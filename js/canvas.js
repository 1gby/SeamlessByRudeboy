/* ============================================================================
CANVAS.JS - Canvas Drawing & Pattern Rendering

This file handles all canvas-related operations:

- Drawing patterns with different repeat types (full drop, half drop, brick)
- Zooming and panning
- Mockup rendering (phone, tote, mug, etc.)
- Grid overlays
- Seamless edge testing
- Background rendering

The canvas is the heart of the Pattern Checker - it displays the tile
repeated infinitely so users can check for seamless alignment.
============================================================================ */

/**

- Canvas state object
- Holds all current canvas settings and the loaded pattern
  */
  const canvasState = {
  // Canvas DOM elements
  canvas: null,
  ctx: null,
  canvasWrapper: null,

// Pattern image
tileImage: null,

// Transform settings
scale: 1,              // Pattern scale (0.05 - 5.0)
offsetPercentX: 0,     // Horizontal offset (0 - 1)
offsetPercentY: 0,     // Vertical offset (0 - 1)
panX: 0,               // Pan position X
panY: 0,               // Pan position Y
zoom: 1,               // Canvas zoom (0.01 - 8.0)

// Display settings
repeatType: ‘full’,    // ‘full’, ‘half-drop’, ‘brick’
viewMode: ‘tile’,      // ‘tile’, ‘tile-grid’, ‘phone’, ‘tote’, etc.
backgroundColor: ‘checker’,  // ‘checker’, ‘#000000’, ‘#ffffff’, etc.

// Quality settings
maxCanvasSize: 1200,   // Canvas size in pixels

// Test/overlay settings
seamlessTestMode: false,
gridOverlaySize: 0,    // 0 = off, 1, 2, 6, 12 inches

// Mockup settings
mockupZoom: 1,
mockupRotate: 0,

// Drag state
isDragging: false,
dragStartX: 0,
dragStartY: 0,

// Zoom limits
MIN_ZOOM: 0.01,
MAX_ZOOM: 8
};

/**

- Initialize canvas
- Sets up canvas element, context, and event listeners
  */
  function initCanvas() {
  canvasState.canvas = document.getElementById(‘canvas’);
  canvasState.ctx = canvasState.canvas.getContext(‘2d’, {
  willReadFrequently: false  // Optimization for drawing
  });
  canvasState.canvasWrapper = document.getElementById(‘canvas-wrapper’);

// Initial canvas size
resizeCanvas();

// Set up event listeners
setupCanvasEvents();

// Initial draw (empty state)
drawCanvas();
}

/**

- Resize canvas to fit container while respecting max size
- Called on window resize and quality changes
  */
  function resizeCanvas() {
  const size = Math.min(
  canvasState.canvasWrapper.clientWidth - 64,
  canvasState.maxCanvasSize
  );

canvasState.canvas.width = size;
canvasState.canvas.height = size;

updateBackground();
updateCanvasInfo();
drawCanvas();
}

/**

- Set up all canvas event listeners
- - Click to upload
- - Drag to pan
- - Wheel to zoom
- - Touch pinch to zoom
    */
    function setupCanvasEvents() {
    // Click to upload (if no image loaded)
    canvasState.canvas.addEventListener(‘click’, () => {
    if (!canvasState.tileImage && !canvasState.isDragging) {
    document.getElementById(‘fileInput’).click();
    }
    });

// Pointer events for drag
canvasState.canvas.addEventListener(‘pointerdown’, handlePointerDown);
canvasState.canvas.addEventListener(‘pointermove’, handlePointerMove);
canvasState.canvas.addEventListener(‘pointerup’, handlePointerUp);
canvasState.canvas.addEventListener(‘pointerleave’, handlePointerUp);

// Mouse wheel for zoom
canvasState.canvas.addEventListener(‘wheel’, handleWheel, { passive: false });

// Touch pinch zoom
canvasState.canvas.addEventListener(‘touchstart’, handleTouchStart, { passive: false });
canvasState.canvas.addEventListener(‘touchmove’, handleTouchMove, { passive: false });
canvasState.canvas.addEventListener(‘touchend’, handleTouchEnd);

// Window resize
window.addEventListener(‘resize’, resizeCanvas);
}

/**

- Pointer down - start dragging
  */
  function handlePointerDown(e) {
  if (!canvasState.tileImage ||
  (canvasState.viewMode !== ‘tile’ && canvasState.viewMode !== ‘tile-grid’)) {
  return;
  }

canvasState.isDragging = true;
canvasState.dragStartX = e.clientX - canvasState.panX;
canvasState.dragStartY = e.clientY - canvasState.panY;
canvasState.canvas.setPointerCapture(e.pointerId);
}

/**

- Pointer move - handle dragging
  */
  function handlePointerMove(e) {
  if (!canvasState.isDragging ||
  (canvasState.viewMode !== ‘tile’ && canvasState.viewMode !== ‘tile-grid’)) {
  return;
  }

canvasState.panX = e.clientX - canvasState.dragStartX;
canvasState.panY = e.clientY - canvasState.dragStartY;
drawCanvas();
}

/**

- Pointer up - stop dragging
  */
  function handlePointerUp() {
  canvasState.isDragging = false;
  }

/**

- Mouse wheel - zoom in/out
  */
  function handleWheel(e) {
  if (!canvasState.tileImage) return;

const rect = canvasState.canvas.getBoundingClientRect();
const mouseX = e.clientX - rect.left;
const mouseY = e.clientY - rect.top;

// Edge dead zone (prevent zoom when near edges)
const edgeDeadZone = 80;
const isInDeadZone =
mouseX < edgeDeadZone ||
mouseX > rect.width - edgeDeadZone ||
mouseY < edgeDeadZone ||
mouseY > rect.height - edgeDeadZone;

if (isInDeadZone) return;

e.preventDefault();

// Zoom factor based on wheel delta
const zoomFactor = e.deltaY < 0 ? 1.1 : 0.9;

// Calculate new zoom
let newZoom = Math.max(
canvasState.MIN_ZOOM,
Math.min(canvasState.MAX_ZOOM, canvasState.zoom * zoomFactor)
);

const scaleChange = newZoom - canvasState.zoom;

// Adjust pan to zoom toward mouse position
canvasState.panX -= (mouseX - canvasState.panX) * (scaleChange / canvasState.zoom);
canvasState.panY -= (mouseY - canvasState.panY) * (scaleChange / canvasState.zoom);
canvasState.zoom = newZoom;

// Update zoom slider UI
updateZoomSlider();
drawCanvas();
}

/**

- Touch state for pinch zoom
  */
  let lastTouchDistance = 0;

/**

- Touch start - prepare for pinch zoom
  */
  function handleTouchStart(e) {
  if (e.touches.length === 2 && canvasState.tileImage) {
  e.preventDefault();
  const touch1 = e.touches[0];
  const touch2 = e.touches[1];
  lastTouchDistance = Math.hypot(
  touch2.clientX - touch1.clientX,
  touch2.clientY - touch1.clientY
  );
  }
  }

/**

- Touch move - handle pinch zoom
  */
  function handleTouchMove(e) {
  if (e.touches.length === 2 && canvasState.tileImage) {
  const rect = canvasState.canvas.getBoundingClientRect();
  const touch1 = e.touches[0];
  const centerX = touch1.clientX - rect.left;
  const centerY = touch1.clientY - rect.top;
  const edgeDeadZone = 100;
  
  const isInDeadZone =
  centerX < edgeDeadZone ||
  centerX > rect.width - edgeDeadZone ||
  centerY < edgeDeadZone ||
  centerY > rect.height - edgeDeadZone;
  
  if (isInDeadZone) return;
  
  e.preventDefault();
  const touch2 = e.touches[1];
  const currentDistance = Math.hypot(
  touch2.clientX - touch1.clientX,
  touch2.clientY - touch1.clientY
  );
  
  if (lastTouchDistance > 0) {
  const zoomFactor = currentDistance / lastTouchDistance;
  const centerX = ((touch1.clientX + touch2.clientX) / 2) - rect.left;
  const centerY = ((touch1.clientY + touch2.clientY) / 2) - rect.top;
  
  let newZoom = Math.max(
  canvasState.MIN_ZOOM,
  Math.min(canvasState.MAX_ZOOM, canvasState.zoom * zoomFactor)
  );
  
  const scaleChange = newZoom - canvasState.zoom;
  
  canvasState.panX -= (centerX - canvasState.panX) * (scaleChange / canvasState.zoom);
  canvasState.panY -= (centerY - canvasState.panY) * (scaleChange / canvasState.zoom);
  canvasState.zoom = newZoom;
  
  updateZoomSlider();
  drawCanvas();
  }
  
  lastTouchDistance = currentDistance;
  }
  }

/**

- Touch end - reset pinch zoom state
  */
  function handleTouchEnd() {
  lastTouchDistance = 0;
  }

/**

- Main draw function
- Renders the pattern, mockups, or empty state
  */
  function drawCanvas() {
  const ctx = canvasState.ctx;
  const canvas = canvasState.canvas;

// Clear canvas
ctx.clearRect(0, 0, canvas.width, canvas.height);

// If no image, show empty state
if (!canvasState.tileImage) {
showEmptyState(true);
updateCanvasClass(false);
disableExportButton();
return;
}

// Hide empty state, enable export
showEmptyState(false);
updateCanvasClass(true);
enableExportButton();

const tileSize = canvasState.tileImage.width * canvasState.scale;
const showGrid = canvasState.viewMode === ‘tile-grid’;

// Enable high quality rendering
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = ‘high’;
ctx.save();

// Render based on view mode
if (canvasState.viewMode === ‘tile’ || canvasState.viewMode === ‘tile-grid’) {
drawTiledPattern(ctx, tileSize, showGrid);
} else {
drawMockup(ctx);
}

ctx.restore();
}

/**

- Draw tiled pattern (infinite repeat)
  */
  function drawTiledPattern(ctx, tileSize, showGrid) {
  ctx.translate(canvasState.panX, canvasState.panY);
  ctx.scale(canvasState.zoom, canvasState.zoom);

// Calculate visible tiles
const tilesX = Math.ceil(canvasState.canvas.width / tileSize / canvasState.zoom) + 6;
const tilesY = Math.ceil(canvasState.canvas.height / tileSize / canvasState.zoom) + 6;
const startTileX = Math.floor(-canvasState.panX / (tileSize * canvasState.zoom)) - 3;
const startTileY = Math.floor(-canvasState.panY / (tileSize * canvasState.zoom)) - 3;

// Draw tiles
for (let i = startTileX; i < startTileX + tilesX; i++) {
for (let j = startTileY; j < startTileY + tilesY; j++) {
let drawX = i * tileSize + canvasState.offsetPercentX * tileSize;
let drawY = j * tileSize + canvasState.offsetPercentY * tileSize;

```
  // Apply repeat type offset
  if (canvasState.repeatType === 'half-drop') {
    drawY += (Math.abs(i) % 2 === 1) ? tileSize / 2 : 0;
  } else if (canvasState.repeatType === 'brick') {
    drawX += (Math.abs(j) % 2 === 1) ? tileSize / 2 : 0;
  }
  
  ctx.drawImage(canvasState.tileImage, drawX, drawY, tileSize, tileSize);
}
```

}

// Draw grid overlay if enabled
if (showGrid) {
drawTileGrid(ctx, tileSize, startTileX, startTileY, tilesX, tilesY);
}

// Draw seamless test overlay if enabled
if (canvasState.seamlessTestMode) {
drawSeamlessTest(ctx, tileSize, startTileX, startTileY, tilesX, tilesY);
}

// Draw grid overlay (inch markers) if enabled
if (canvasState.gridOverlaySize > 0) {
drawGridOverlay(ctx, tileSize);
}
}

/**

- Draw grid lines between tiles
  */
  function drawTileGrid(ctx, tileSize, startTileX, startTileY, tilesX, tilesY) {
  ctx.strokeStyle = ‘rgba(255, 255, 255, 0.4)’;
  ctx.lineWidth = 1 / canvasState.zoom;

// Vertical lines
for (let i = startTileX; i < startTileX + tilesX + 1; i++) {
let lineX = i * tileSize + canvasState.offsetPercentX * tileSize;
ctx.beginPath();
ctx.moveTo(lineX, startTileY * tileSize - tileSize);
ctx.lineTo(lineX, (startTileY + tilesY + 1) * tileSize);
ctx.stroke();
}

// Horizontal lines
for (let j = startTileY; j < startTileY + tilesY + 1; j++) {
let lineY = j * tileSize + canvasState.offsetPercentY * tileSize;
ctx.beginPath();
ctx.moveTo(startTileX * tileSize - tileSize, lineY);
ctx.lineTo((startTileX + tilesX + 1) * tileSize, lineY);
ctx.stroke();
}
}

/**

- Draw seamless test (red edge overlay)
- Highlights tile edges to check for seamless alignment
  */
  function drawSeamlessTest(ctx, tileSize, startTileX, startTileY, tilesX, tilesY) {
  ctx.save();
  ctx.strokeStyle = ‘rgba(255, 0, 0, 0.8)’;
  ctx.lineWidth = 3 / canvasState.zoom;

for (let i = startTileX; i < startTileX + tilesX; i++) {
for (let j = startTileY; j < startTileY + tilesY; j++) {
let drawX = i * tileSize + canvasState.offsetPercentX * tileSize;
let drawY = j * tileSize + canvasState.offsetPercentY * tileSize;

```
  if (canvasState.repeatType === 'half-drop') {
    drawY += (Math.abs(i) % 2 === 1) ? tileSize / 2 : 0;
  } else if (canvasState.repeatType === 'brick') {
    drawX += (Math.abs(j) % 2 === 1) ? tileSize / 2 : 0;
  }
  
  ctx.strokeRect(drawX, drawY, tileSize, tileSize);
}
```

}

ctx.restore();
}

/**

- Draw measurement grid overlay (inches)
  */
  function drawGridOverlay(ctx, tileSize) {
  if (canvasState.gridOverlaySize === 0) return;

ctx.save();
ctx.strokeStyle = ‘rgba(255, 255, 255, 0.5)’;
ctx.lineWidth = 2 / canvasState.zoom;
ctx.setLineDash([5 / canvasState.zoom, 5 / canvasState.zoom]);

const dpi = 150;
const gridPixelSize = canvasState.gridOverlaySize * dpi;

const startX = Math.floor(-canvasState.panX / canvasState.zoom / gridPixelSize) * gridPixelSize;
const startY = Math.floor(-canvasState.panY / canvasState.zoom / gridPixelSize) * gridPixelSize;
const endX = startX + Math.ceil(canvasState.canvas.width / canvasState.zoom / gridPixelSize + 2) * gridPixelSize;
const endY = startY + Math.ceil(canvasState.canvas.height / canvasState.zoom / gridPixelSize + 2) * gridPixelSize;

// Vertical lines
for (let x = startX; x <= endX; x += gridPixelSize) {
ctx.beginPath();
ctx.moveTo(x, startY);
ctx.lineTo(x, endY);
ctx.stroke();
}

// Horizontal lines
for (let y = startY; y <= endY; y += gridPixelSize) {
ctx.beginPath();
ctx.moveTo(startX, y);
ctx.lineTo(endX, y);
ctx.stroke();
}

ctx.restore();
}

/**

- Draw mockup (product visualization)
  */
  function drawMockup(ctx) {
  ctx.translate(canvasState.canvas.width / 2, canvasState.canvas.height / 2);

const mockups = {
phone: mockupImages.phone,
ipad: mockupImages.ipad,
tote: mockupImages.tote,
bandana: mockupImages.bandana,
bedspread: mockupImages.bedspread,
mug: mockupImages.mug,
bottle: mockupImages.bottle,
sweatshirt: mockupImages.sweatshirt
};

if (mockups[canvasState.viewMode]) {
drawMockupWithPattern(ctx, mockups[canvasState.viewMode]);
} else if (canvasState.viewMode === ‘fabric’) {
drawFabricSwatch(ctx);
}
}

/**

- Draw mockup with pattern overlay
- Replaces green screen in mockup with pattern
  */
  function drawMockupWithPattern(ctx, mockupImg) {
  if (!mockupImg || !mockupImg.complete || !mockupImg.naturalWidth) return;

const displaySize = Math.min(
canvasState.canvas.width,
canvasState.canvas.height
) * 0.72 * canvasState.mockupZoom;

// Create mockup canvas
const mockupCanvas = document.createElement(‘canvas’);
mockupCanvas.width = displaySize;
mockupCanvas.height = displaySize;
const mockupCtx = mockupCanvas.getContext(‘2d’);
mockupCtx.drawImage(mockupImg, 0, 0, displaySize, displaySize);

const mockupData = mockupCtx.getImageData(0, 0, displaySize, displaySize);
const pixels = mockupData.data;

// Create pattern canvas
const patternCanvas = document.createElement(‘canvas’);
patternCanvas.width = displaySize;
patternCanvas.height = displaySize;
const patternCtx = patternCanvas.getContext(‘2d’);

patternCtx.save();
patternCtx.translate(displaySize / 2, displaySize / 2);
patternCtx.scale(canvasState.zoom, canvasState.zoom);
patternCtx.translate(-displaySize / 2, -displaySize / 2);
drawPatternToContext(patternCtx, 0, 0, displaySize, displaySize,
canvasState.tileImage.width * canvasState.scale);
patternCtx.restore();

const patternData = patternCtx.getImageData(0, 0, displaySize, displaySize);
const patternPixels = patternData.data;

// Replace green pixels with pattern
for (let i = 0; i < pixels.length; i += 4) {
const r = pixels[i];
const g = pixels[i + 1];
const b = pixels[i + 2];
const a = pixels[i + 3];

```
// Detect bright green (chroma key)
const isGreen = (g > 200) && (g > r + 50) && (g > b + 50) && (r < 50) && (b < 50) && (a > 0);

if (isGreen) {
  pixels[i] = patternPixels[i];
  pixels[i + 1] = patternPixels[i + 1];
  pixels[i + 2] = patternPixels[i + 2];
  pixels[i + 3] = patternPixels[i + 3];
}
```

}

mockupCtx.putImageData(mockupData, 0, 0);

// Draw rotated mockup
ctx.rotate(canvasState.mockupRotate * Math.PI / 180);
ctx.drawImage(mockupCanvas, -displaySize / 2, -displaySize / 2);
}

/**

- Draw fabric swatch mockup
  */
  function drawFabricSwatch(ctx) {
  const maxSize = Math.min(canvasState.canvas.width, canvasState.canvas.height) * 0.6;
  const fabricWidth = maxSize * 0.95;
  const fabricHeight = fabricWidth * 0.8;

ctx.save();
roundedRect(ctx, -fabricWidth / 2, -fabricHeight / 2, fabricWidth, fabricHeight, 15);
ctx.fillStyle = ‘#2a2a2a’;
ctx.fill();
ctx.strokeStyle = ‘#444’;
ctx.lineWidth = 2;
ctx.stroke();
ctx.clip();

drawPatternToContext(ctx, -fabricWidth / 2, -fabricHeight / 2, fabricWidth, fabricHeight,
canvasState.tileImage.width * canvasState.scale);
ctx.restore();
}

/**

- Helper: Draw pattern to any context
  */
  function drawPatternToContext(ctx, startX, startY, width, height, tileSize) {
  const tilesX = Math.ceil(width / tileSize) + 4;
  const tilesY = Math.ceil(height / tileSize) + 4;

for (let i = -2; i < tilesX; i++) {
for (let j = -2; j < tilesY; j++) {
let drawX = startX + i * tileSize + canvasState.offsetPercentX * tileSize;
let drawY = startY + j * tileSize + canvasState.offsetPercentY * tileSize;

```
  if (canvasState.repeatType === 'half-drop') {
    drawY += (Math.abs(i) % 2 === 1) ? tileSize / 2 : 0;
  } else if (canvasState.repeatType === 'brick') {
    drawX += (Math.abs(j) % 2 === 1) ? tileSize / 2 : 0;
  }
  
  ctx.drawImage(canvasState.tileImage, drawX, drawY, tileSize, tileSize);
}
```

}
}

/**

- Helper: Rounded rectangle path
  */
  function roundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
  }

/**

- Update background (checkerboard or solid color)
  */
  function updateBackground() {
  if (canvasState.tileImage) {
  if (canvasState.backgroundColor === ‘checker’) {
  canvasState.canvas.style.background =
  ‘repeating-conic-gradient(#ccc 0% 25%, #999 0% 50%, #ccc 50% 75%, #999 75% 100%)’;
  canvasState.canvas.style.backgroundSize = ‘40px 40px’;
  } else {
  canvasState.canvas.style.background = canvasState.backgroundColor;
  canvasState.canvas.style.backgroundSize = ‘100% 100%’;
  }
  } else {
  canvasState.canvas.style.background =
  ‘repeating-conic-gradient(#2a2a2a 0% 25%, #1a1a1a 0% 50%, #2a2a2a 50% 75%, #1a1a1a 75% 100%)’;
  canvasState.canvas.style.backgroundSize = ‘40px 40px’;
  }
  }

/**

- UI helper functions
  */
  function showEmptyState(show) {
  const emptyState = document.getElementById(‘emptyState’);
  if (show) {
  emptyState.classList.add(‘visible’);
  } else {
  emptyState.classList.remove(‘visible’);
  }
  }

function updateCanvasClass(hasImage) {
if (hasImage) {
canvasState.canvas.classList.add(‘has-image’);
} else {
canvasState.canvas.classList.remove(‘has-image’);
}
}

function disableExportButton() {
document.getElementById(‘exportBtnHeader’).disabled = true;
}

function enableExportButton() {
document.getElementById(‘exportBtnHeader’).disabled = false;
}

function updateCanvasInfo() {
document.getElementById(‘infoCanvas’).textContent = `${canvasState.maxCanvasSize}px`;
}

function updateZoomSlider() {
const zoomPercent = Math.round(canvasState.zoom * 100);

let sliderVal;
if (zoomPercent <= 100) {
sliderVal = Math.round(((zoomPercent - 1) / 99) * 50);
} else {
sliderVal = Math.round(50 + ((zoomPercent - 100) / 700) * 50);
}

document.getElementById(‘zoomSlider’).value = sliderVal;
document.getElementById(‘zoomValue’).textContent = zoomPercent + ‘%’;
}