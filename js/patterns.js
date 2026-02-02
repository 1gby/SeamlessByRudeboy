/* ============================================================================
PATTERNS.JS - Pattern Loading, Processing & Export

This file handles:

- Loading images from files
- Loading images from URLs (samples)
- Processing and validating images
- Exporting patterns at custom resolutions
  ============================================================================ */

/**

- Load image from file (user upload)
  */
  function loadImageFromFile(file) {
  if (!file) return;

showLoading(false);
const reader = new FileReader();

reader.onload = (e) => {
const img = new Image();

```
img.onload = () => {
  processImage(img);
};

img.onerror = () => {
  hideLoading();
  alert('Failed to load image!');
};

img.src = e.target.result;
```

};

reader.readAsDataURL(file);
}

/**

- Load image from URL (sample patterns)
  */
  function loadImageFromURL(url) {
  showLoading(false);
  const img = new Image();
  img.crossOrigin = ‘anonymous’;

img.onload = () => {
processImage(img);
};

img.onerror = () => {
hideLoading();
alert(‘Failed to load sample!’);
};

img.src = url;
}

/**

- Process loaded image
  */
  function processImage(img) {
  canvasState.tileImage = img;

// Auto-scale to reasonable size
canvasState.scale = Math.max(0.05, Math.min(5, 300 / canvasState.tileImage.width));

// Update scale slider
let sliderVal;
if (canvasState.scale <= 1.0) {
sliderVal = Math.round(((canvasState.scale - 0.05) / 0.95) * 50);
} else {
sliderVal = Math.round(50 + ((canvasState.scale - 1.0) / 4.0) * 50);
}

document.getElementById(‘patternScale’).value = sliderVal;
document.getElementById(‘scaleValue’).textContent = canvasState.scale.toFixed(2) + ‘×’;

updateBackground();
analyzePattern();
document.getElementById(‘patternInfo’).classList.add(‘visible’);
drawCanvas();
hideLoading();
}

/**

- Export pattern at custom resolution
  */
  function exportPattern(exportSize, format) {
  if (!canvasState.tileImage) return;

showLoading(false);

setTimeout(async () => {
const exportCanvas = document.createElement(‘canvas’);
exportCanvas.width = exportSize;
exportCanvas.height = exportSize;
const exportCtx = exportCanvas.getContext(‘2d’);

```
exportCtx.imageSmoothingEnabled = true;
exportCtx.imageSmoothingQuality = 'high';

const tileSize = canvasState.tileImage.width * canvasState.scale;

exportCtx.save();
exportCtx.translate(
  canvasState.panX * (exportSize / canvasState.maxCanvasSize), 
  canvasState.panY * (exportSize / canvasState.maxCanvasSize)
);
exportCtx.scale(canvasState.zoom, canvasState.zoom);

const tilesX = Math.ceil(exportSize / tileSize / canvasState.zoom) + 6;
const tilesY = Math.ceil(exportSize / tileSize / canvasState.zoom) + 6;
const startTileX = Math.floor(-(canvasState.panX * (exportSize / canvasState.maxCanvasSize)) / (tileSize * canvasState.zoom)) - 3;
const startTileY = Math.floor(-(canvasState.panY * (exportSize / canvasState.maxCanvasSize)) / (tileSize * canvasState.zoom)) - 3;

for (let i = startTileX; i < startTileX + tilesX; i++) {
  for (let j = startTileY; j < startTileY + tilesY; j++) {
    let drawX = i * tileSize + canvasState.offsetPercentX * tileSize;
    let drawY = j * tileSize + canvasState.offsetPercentY * tileSize;
    
    if (canvasState.repeatType === 'half-drop') {
      drawY += (Math.abs(i) % 2 === 1) ? tileSize / 2 : 0;
    } else if (canvasState.repeatType === 'brick') {
      drawX += (Math.abs(j) % 2 === 1) ? tileSize / 2 : 0;
    }
    
    exportCtx.drawImage(canvasState.tileImage, drawX, drawY, tileSize, tileSize);
  }
}

exportCtx.restore();

const mimeType = format === 'jpg' ? 'image/jpeg' : 'image/png';
const quality = format === 'jpg' ? 0.95 : undefined;

exportCanvas.toBlob(async (blob) => {
  const ext = format === 'jpg' ? '.jpg' : '.png';
  const file = new File([blob], `rudeboy-pattern-${exportSize}px${ext}`, { type: mimeType });
  
  try {
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      await navigator.share({
        files: [file],
        title: 'Rudeboy Pattern',
        text: `Check out my ${exportSize}px pattern!`
      });
    } else {
      const link = document.createElement('a');
      link.download = `rudeboy-pattern-${exportSize}px${ext}`;
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
    }
  } catch (e) {
    if (e.name !== 'AbortError') {
      const link = document.createElement('a');
      link.download = `rudeboy-pattern-${exportSize}px${ext}`;
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
    }
  }
  
  hideLoading();
}, mimeType, quality);
```

}, 100);
}