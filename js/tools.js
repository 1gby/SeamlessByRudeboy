/* ============================================================================
TOOLS.JS - Color Tools, Calculator, Saved Patterns

This file handles the tools section functionality:

- Color palette extraction from pattern
- Hex color checker
- Dimension calculator (size + DPI = pixels)
- Saved patterns (save/load/delete from localStorage)
  ============================================================================ */

/**

- Calculator state
  */
  const calcState = {
  size: 9,           // Size in inches or cm
  dpi: 150,          // DPI
  activeField: ‘size’, // ‘size’ or ‘dpi’
  useMetric: false   // false = inches, true = cm
  };

/**

- Saved patterns array
  */
  let savedPatterns = JSON.parse(localStorage.getItem(‘rudeboy-patterns’) || ‘[]’);

/**

- Initialize tools
  */
  function initTools() {
  setupColorTools();
  setupCalculator();
  setupSavedPatterns();
  }

/* ==========================================================================
COLOR PALETTE & HEX CHECKER
========================================================================== */

/**

- Set up color palette and hex checker
  */
  function setupColorTools() {
  // Palette toggle
  const paletteToggle = document.getElementById(‘paletteToggle’);
  const colorPalette = document.getElementById(‘colorPalette’);
  const hexChecker = document.getElementById(‘hexChecker’);
  let hexCheckerMode = false;

paletteToggle.addEventListener(‘click’, () => {
hexCheckerMode = !hexCheckerMode;
if (hexCheckerMode) {
colorPalette.classList.add(‘hex-mode’);
hexChecker.classList.add(‘active’);
paletteToggle.textContent = ‘Color Palette’;
} else {
colorPalette.classList.remove(‘hex-mode’);
hexChecker.classList.remove(‘active’);
paletteToggle.textContent = ‘Hex Checker’;
}
});

// Hex input
const hexInput = document.getElementById(‘hexInput’);
const hexPreview = document.getElementById(‘hexPreview’);

hexInput.addEventListener(‘input’, (e) => {
let hex = e.target.value.trim();

```
if (!hex.startsWith('#')) {
  hex = '#' + hex;
  hexInput.value = hex;
}

if (isValidHex(hex)) {
  const rgb = hexToRgb(hex);
  hexPreview.style.backgroundColor = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
}
```

});

// Set initial hex preview
hexInput.value = ‘#FF0000’;
hexPreview.style.backgroundColor = ‘#FF0000’;
}

/**

- Analyze pattern and extract color palette
  */
  function analyzePattern() {
  if (!canvasState.tileImage) return;

const width = canvasState.tileImage.width;
const height = canvasState.tileImage.height;

// Update pattern info
document.getElementById(‘infoPattern’).textContent = `${width} × ${height}px`;

// Quality assessment
let qualityText = ‘’;
let qualityClass = ‘’;

if (width >= 3000 && height >= 3000) {
qualityText = ‘Excellent ✅’;
qualityClass = ‘success’;
} else if (width >= 2000 && height >= 2000) {
qualityText = ‘Good ⚠️’;
qualityClass = ‘warning’;
} else {
qualityText = ‘Low ❌’;
qualityClass = ‘’;
}

document.getElementById(‘infoQuality’).textContent = qualityText;
document.getElementById(‘infoQuality’).className = ’info-value ’ + qualityClass;

// Extract colors
const tempCanvas = document.createElement(‘canvas’);
tempCanvas.width = Math.min(width, 500);
tempCanvas.height = Math.min(height, 500);
const tempCtx = tempCanvas.getContext(‘2d’);
tempCtx.drawImage(canvasState.tileImage, 0, 0, tempCanvas.width, tempCanvas.height);

const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
const data = imageData.data;
const colorMap = new Map();

// Count colors (quantized to reduce palette)
for (let i = 0; i < data.length; i += 4) {
const r = Math.round(data[i] / 10) * 10;
const g = Math.round(data[i + 1] / 10) * 10;
const b = Math.round(data[i + 2] / 10) * 10;
const key = `${r},${g},${b}`;
colorMap.set(key, (colorMap.get(key) || 0) + 1);
}

const uniqueColors = colorMap.size;
document.getElementById(‘infoColors’).textContent = `${uniqueColors}`;

// Get top 9 colors
const sortedColors = Array.from(colorMap.entries())
.sort((a, b) => b[1] - a[1])
.slice(0, 9);

// Render color palette
const colorPalette = document.getElementById(‘colorPalette’);
colorPalette.innerHTML = ‘’;
sortedColors.forEach(([color]) => {
const [r, g, b] = color.split(’,’).map(Number);
const hex = rgbToHex(r, g, b);

```
const swatch = document.createElement('div');
swatch.className = 'color-swatch';
swatch.style.backgroundColor = `rgb(${r},${g},${b})`;

const tooltip = document.createElement('div');
tooltip.className = 'hex-tooltip';
tooltip.textContent = hex;
swatch.appendChild(tooltip);

swatch.addEventListener('click', () => {
  navigator.clipboard.writeText(hex).then(() => {
    swatch.classList.add('copied');
    setTimeout(() => swatch.classList.remove('copied'), 1000);
  });
});

colorPalette.appendChild(swatch);
```

});

// Calculate contrast
let minLum = 1;
let maxLum = 0;

sortedColors.forEach(([color]) => {
const [r, g, b] = color.split(’,’).map(Number);
const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
minLum = Math.min(minLum, lum);
maxLum = Math.max(maxLum, lum);
});

const contrastRatio = maxLum / (minLum + 0.05);

if (contrastRatio > 7) {
document.getElementById(‘infoContrast’).textContent = ‘High’;
document.getElementById(‘infoContrast’).className = ‘info-value success’;
} else if (contrastRatio > 3) {
document.getElementById(‘infoContrast’).textContent = ‘Medium’;
document.getElementById(‘infoContrast’).className = ‘info-value warning’;
} else {
document.getElementById(‘infoContrast’).textContent = ‘Low’;
document.getElementById(‘infoContrast’).className = ‘info-value’;
}
}

/**

- RGB to Hex conversion
  */
  function rgbToHex(r, g, b) {
  return ‘#’ + [r, g, b].map(x => {
  const hex = x.toString(16);
  return hex.length === 1 ? ‘0’ + hex : hex;
  }).join(’’);
  }

/**

- Hex to RGB conversion
  */
  function hexToRgb(hex) {
  hex = hex.replace(’#’, ‘’);
  if (hex.length === 3) {
  hex = hex.split(’’).map(c => c + c).join(’’);
  }
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return { r, g, b };
  }

/**

- Validate hex color
  */
  function isValidHex(hex) {
  return /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i.test(hex);
  }

/* ==========================================================================
DIMENSION CALCULATOR
========================================================================== */

/**

- Set up dimension calculator
  */
  function setupCalculator() {
  const calcSlider = document.getElementById(‘calcSlider’);
  const labelSize = document.getElementById(‘labelSize’);
  const labelDPI = document.getElementById(‘labelDPI’);
  const currentValue = document.getElementById(‘currentValue’);
  const calcResultValue = document.getElementById(‘calcResultValue’);
  const btnInches = document.getElementById(‘btnInches’);
  const btnCM = document.getElementById(‘btnCM’);
  const calcRecommendationsToggle = document.getElementById(‘calcRecommendationsToggle’);
  const calcRecommendations = document.getElementById(‘calcRecommendations’);

// Toggle recommendations
calcRecommendationsToggle.addEventListener(‘click’, () => {
const isActive = calcRecommendations.classList.contains(‘active’);
calcRecommendations.classList.toggle(‘active’, !isActive);
calcRecommendationsToggle.textContent = isActive ? ‘Recommendations’ : ‘Hide’;
});

// Size/DPI toggle
labelSize.addEventListener(‘click’, () => {
calcState.activeField = ‘size’;
updateCalcDisplay();
});

labelDPI.addEventListener(‘click’, () => {
calcState.activeField = ‘dpi’;
updateCalcDisplay();
});

// Inches/CM toggle
btnInches.addEventListener(‘click’, () => {
if (calcState.useMetric) {
calcState.useMetric = false;
btnInches.classList.add(‘active’);
btnCM.classList.remove(‘active’);

```
  if (calcState.activeField === 'size') {
    calcState.size = Math.round(calcState.size / 2.54);
    calcSlider.max = '200';
  }
  
  updateCalcDisplay();
}
```

});

btnCM.addEventListener(‘click’, () => {
if (!calcState.useMetric) {
calcState.useMetric = true;
btnCM.classList.add(‘active’);
btnInches.classList.remove(‘active’);

```
  if (calcState.activeField === 'size') {
    calcState.size = Math.round(calcState.size * 2.54);
    calcSlider.max = '500';
  }
  
  updateCalcDisplay();
}
```

});

// Slider
calcSlider.addEventListener(‘input’, (e) => {
calcState[calcState.activeField] = parseInt(e.target.value);
updateCalcDisplay();
});

// Preset buttons
document.querySelectorAll(’.calc-preset-btn’).forEach(btn => {
btn.addEventListener(‘click’, () => {
const size = btn.dataset.size;
const dpi = btn.dataset.dpi;
const unit = btn.dataset.unit;
const px = btn.dataset.px;

```
  if (px) {
    const pxVal = parseInt(px);
    const inches = pxVal / 72;
    calcState.size = calcState.useMetric ? Math.round(inches * 2.54) : Math.round(inches);
    calcState.dpi = 72;
    calcState.activeField = 'size';
  } else {
    if (unit === 'in' && calcState.useMetric) {
      calcState.size = Math.round(parseFloat(size) * 2.54);
    } else if (unit === 'cm' && !calcState.useMetric) {
      calcState.size = Math.round(parseFloat(size) / 2.54);
    } else {
      calcState.size = Math.round(parseFloat(size));
    }
    calcState.dpi = parseInt(dpi);
    calcState.activeField = 'size';
  }
  
  updateCalcDisplay();
});
```

});

// Initial display
updateCalcDisplay();
}

/**

- Update calculator display
  */
  function updateCalcDisplay() {
  const labelSize = document.getElementById(‘labelSize’);
  const labelDPI = document.getElementById(‘labelDPI’);
  const currentValue = document.getElementById(‘currentValue’);
  const calcSlider = document.getElementById(‘calcSlider’);
  const calcResultValue = document.getElementById(‘calcResultValue’);

// Update active label
labelSize.classList.remove(‘active’);
labelDPI.classList.remove(‘active’);

const activeLabel = calcState.activeField === ‘size’ ? labelSize : labelDPI;
activeLabel.classList.add(‘active’);

// Update current value display
const value = calcState[calcState.activeField];
const unit = calcState.useMetric ? ‘cm’ : ‘”’;

if (calcState.activeField === ‘size’) {
currentValue.textContent = `${value} × ${value}${unit}`;

```
if (calcState.useMetric) {
  calcSlider.min = '1';
  calcSlider.max = '500';
} else {
  calcSlider.min = '1';
  calcSlider.max = '200';
}
```

} else {
currentValue.textContent = value;
calcSlider.min = ‘72’;
calcSlider.max = ‘600’;
}

calcSlider.value = value;

// Calculate result
const sizeInInches = calcState.useMetric ? calcState.size / 2.54 : calcState.size;
const px = Math.round(sizeInInches * calcState.dpi);

if (px === 1) {
calcResultValue.textContent = `1 × 1px`;
} else {
calcResultValue.textContent = `${px} × ${px}px`;
}
}

/* ==========================================================================
SAVED PATTERNS
========================================================================== */

/**

- Set up saved patterns
  */
  function setupSavedPatterns() {
  const savePatternBtn = document.getElementById(‘savePatternBtn’);
  const patternNameInput = document.getElementById(‘patternNameInput’);

// Save button
savePatternBtn.addEventListener(‘click’, savePattern);

// Enter key to save
patternNameInput.addEventListener(‘keypress’, (e) => {
if (e.key === ‘Enter’) savePattern();
});

// Initial render
renderSavedPatterns();
}

/**

- Save current pattern
  */
  function savePattern() {
  if (!canvasState.tileImage) {
  alert(‘Uh oh! It's not me, it's you. Try loading a pattern first!’);
  return;
  }

const patternNameInput = document.getElementById(‘patternNameInput’);
const patternName = patternNameInput.value.trim() || `Pattern ${Date.now()}`;

const patternData = {
id: Date.now(),
name: patternName,
timestamp: new Date().toISOString(),
imageData: canvasState.canvas.toDataURL(‘image/png’),
settings: {
scale: canvasState.scale,
offsetPercentX: canvasState.offsetPercentX,
offsetPercentY: canvasState.offsetPercentY,
repeatType: canvasState.repeatType,
backgroundColor: canvasState.backgroundColor,
zoom: canvasState.zoom,
panX: canvasState.panX,
panY: canvasState.panY
}
};

savedPatterns.unshift(patternData);
localStorage.setItem(‘rudeboy-patterns’, JSON.stringify(savedPatterns));

patternNameInput.value = ‘’;
renderSavedPatterns();

alert(`✅ "${patternName}" saved!`);
}

/**

- Load saved pattern
  */
  function loadPattern(id) {
  const pattern = savedPatterns.find(p => p.id === id);
  if (!pattern) return;

showLoading(false);

const img = new Image();
img.onload = () => {
canvasState.tileImage = img;

```
// Restore settings
canvasState.scale = pattern.settings.scale;
canvasState.offsetPercentX = pattern.settings.offsetPercentX;
canvasState.offsetPercentY = pattern.settings.offsetPercentY;
canvasState.repeatType = pattern.settings.repeatType;
canvasState.backgroundColor = pattern.settings.backgroundColor;
canvasState.zoom = pattern.settings.zoom;
canvasState.panX = pattern.settings.panX;
canvasState.panY = pattern.settings.panY;

// Update UI
document.getElementById('patternScale').value = canvasState.scale <= 1.0 ? 
  Math.round(((canvasState.scale - 0.05) / 0.95) * 50) : 
  Math.round(50 + ((canvasState.scale - 1.0) / 4.0) * 50);
document.getElementById('scaleValue').textContent = canvasState.scale.toFixed(2) + '×';

document.getElementById('offsetX').value = Math.round(canvasState.offsetPercentX * 100);
document.getElementById('offsetXValue').textContent = Math.round(canvasState.offsetPercentX * 100) + '%';

document.getElementById('offsetY').value = Math.round(canvasState.offsetPercentY * 100);
document.getElementById('offsetYValue').textContent = Math.round(canvasState.offsetPercentY * 100) + '%';

document.getElementById('repeatType').value = canvasState.repeatType;
document.getElementById('bgColor').value = canvasState.backgroundColor;

const zoomPercent = Math.round(canvasState.zoom * 100);
const zoomSliderVal = zoomPercent <= 100 ? 
  Math.round(((zoomPercent - 1) / 99) * 50) : 
  Math.round(50 + ((zoomPercent - 100) / 700) * 50);
document.getElementById('zoomSlider').value = zoomSliderVal;
document.getElementById('zoomValue').textContent = zoomPercent + '%';

updateBackground();
analyzePattern();
document.getElementById('patternInfo').classList.add('visible');
drawCanvas();
hideLoading();
```

};

img.src = pattern.imageData;
}

/**

- Delete saved pattern
  */
  function deletePattern(id) {
  if (!confirm(‘Delete this pattern?’)) return;

savedPatterns = savedPatterns.filter(p => p.id !== id);
localStorage.setItem(‘rudeboy-patterns’, JSON.stringify(savedPatterns));
renderSavedPatterns();
}

/**

- Render saved patterns list
  */
  function renderSavedPatterns() {
  const savedPatternsList = document.getElementById(‘savedPatternsList’);
  savedPatternsList.innerHTML = ‘’;

if (savedPatterns.length === 0) {
savedPatternsList.innerHTML = ‘<div style="text-align:center;color:#666;padding:1rem;font-size:0.9rem;">No saved patterns yet</div>’;
return;
}

savedPatterns.forEach(pattern => {
const item = document.createElement(‘div’);
item.className = ‘saved-pattern-item’;

```
const thumb = document.createElement('img');
thumb.className = 'saved-pattern-thumb';
thumb.src = pattern.imageData;

const info = document.createElement('div');
info.className = 'saved-pattern-info';

const name = document.createElement('div');
name.className = 'saved-pattern-name';
name.textContent = pattern.name;

const date = document.createElement('div');
date.className = 'saved-pattern-date';
date.textContent = new Date(pattern.timestamp).toLocaleDateString();

info.appendChild(name);
info.appendChild(date);

const deleteBtn = document.createElement('button');
deleteBtn.className = 'saved-pattern-delete';
deleteBtn.textContent = '🗑️';
deleteBtn.onclick = (e) => {
  e.stopPropagation();
  deletePattern(pattern.id);
};

item.appendChild(thumb);
item.appendChild(info);
item.appendChild(deleteBtn);

item.onclick = () => loadPattern(pattern.id);

savedPatternsList.appendChild(item);
```

});
}