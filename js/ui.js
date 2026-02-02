/* ============================================================================
UI.JS - User Interface Controls & Interactions

This file manages all UI elements and their event listeners:

- File upload (button click, drag & drop)
- Sliders (offset, scale, zoom, mockup controls)
- Dropdowns (master dropdown, settings, view modes)
- Accordions (instructions, slider dropdowns)
- Weather widget
- Time display

Coordinates with other modules by calling their functions when UI changes.
============================================================================ */

/**

- Initialize all UI elements and event listeners
- Called once on page load from main.js
  */
  function initUI() {
  setupFileUpload();
  setupSliders();
  setupDropdowns();
  setupAccordions();
  setupExportModal();
  initWeather();
  initTime();
  }

/* ==========================================================================
FILE UPLOAD
========================================================================== */

/**

- Set up file upload functionality
- - Button click to trigger file input
- - Drag and drop support
    */
    function setupFileUpload() {
    const fileInput = document.getElementById(‘fileInput’);
    const uploadBtn = document.getElementById(‘uploadBtnHeader’);
    const canvas = document.getElementById(‘canvas’);

// Upload button click
uploadBtn.addEventListener(‘click’, () => fileInput.click());

// File input change
fileInput.addEventListener(‘change’, (e) => {
if (e.target.files[0]) {
loadImageFromFile(e.target.files[0]);
}
});

// Drag over canvas
canvas.addEventListener(‘dragover’, (e) => {
e.preventDefault();
canvas.style.opacity = ‘0.7’;
});

// Drag leave canvas
canvas.addEventListener(‘dragleave’, () => {
canvas.style.opacity = ‘1’;
});

// Drop on canvas
canvas.addEventListener(‘drop’, (e) => {
e.preventDefault();
canvas.style.opacity = ‘1’;
if (e.dataTransfer.files[0]) {
loadImageFromFile(e.dataTransfer.files[0]);
}
});
}

/* ==========================================================================
SLIDERS
========================================================================== */

/**

- Set up all slider controls
- - Offset X/Y (pattern position)
- - Scale (pattern size)
- - Zoom (canvas zoom)
- - Mockup zoom/rotate
    */
    function setupSliders() {
    // Offset X slider
    const offsetX = document.getElementById(‘offsetX’);
    const offsetXValue = document.getElementById(‘offsetXValue’);

offsetX.addEventListener(‘input’, (e) => {
canvasState.offsetPercentX = parseInt(e.target.value) / 100;
offsetXValue.textContent = e.target.value + ‘%’;
drawCanvas();
});

offsetX.addEventListener(‘change’, (e) => {
const snapped = snap(parseInt(e.target.value), 10);
canvasState.offsetPercentX = snapped / 100;
offsetX.value = snapped;
offsetXValue.textContent = snapped + ‘%’;
drawCanvas();
});

// Offset Y slider
const offsetY = document.getElementById(‘offsetY’);
const offsetYValue = document.getElementById(‘offsetYValue’);

offsetY.addEventListener(‘input’, (e) => {
canvasState.offsetPercentY = parseInt(e.target.value) / 100;
offsetYValue.textContent = e.target.value + ‘%’;
drawCanvas();
});

offsetY.addEventListener(‘change’, (e) => {
const snapped = snap(parseInt(e.target.value), 10);
canvasState.offsetPercentY = snapped / 100;
offsetY.value = snapped;
offsetYValue.textContent = snapped + ‘%’;
drawCanvas();
});

// Scale slider
const patternScale = document.getElementById(‘patternScale’);
const scaleValue = document.getElementById(‘scaleValue’);

patternScale.addEventListener(‘input’, (e) => {
const sliderVal = parseInt(e.target.value);

```
if (sliderVal <= 50) {
  canvasState.scale = 0.05 + (sliderVal / 50) * 0.95;
} else {
  canvasState.scale = 1.0 + ((sliderVal - 50) / 50) * 4.0;
}

scaleValue.textContent = canvasState.scale.toFixed(2) + '×';
drawCanvas();
```

});

patternScale.addEventListener(‘change’, (e) => {
const sliderVal = parseInt(e.target.value);

```
if (sliderVal <= 50) {
  canvasState.scale = 0.05 + (sliderVal / 50) * 0.95;
} else {
  canvasState.scale = 1.0 + ((sliderVal - 50) / 50) * 4.0;
}

canvasState.scale = snapScale(canvasState.scale);

let newSliderVal;
if (canvasState.scale <= 1.0) {
  newSliderVal = Math.round(((canvasState.scale - 0.05) / 0.95) * 50);
} else {
  newSliderVal = Math.round(50 + ((canvasState.scale - 1.0) / 4.0) * 50);
}

patternScale.value = newSliderVal;
scaleValue.textContent = canvasState.scale.toFixed(2) + '×';
drawCanvas();
```

});

// Zoom slider
const zoomSlider = document.getElementById(‘zoomSlider’);
const zoomValue = document.getElementById(‘zoomValue’);

zoomSlider.addEventListener(‘input’, (e) => {
const sliderVal = parseInt(e.target.value);

```
if (sliderVal <= 50) {
  canvasState.zoom = (1 + (sliderVal / 50) * 99) / 100;
} else {
  canvasState.zoom = (100 + ((sliderVal - 50) / 50) * 700) / 100;
}

zoomValue.textContent = Math.round(canvasState.zoom * 100) + '%';
drawCanvas();
```

});

zoomSlider.addEventListener(‘change’, (e) => {
const sliderVal = parseInt(e.target.value);

```
if (sliderVal <= 50) {
  canvasState.zoom = (1 + (sliderVal / 50) * 99) / 100;
} else {
  canvasState.zoom = (100 + ((sliderVal - 50) / 50) * 700) / 100;
}

const zoomPercent = Math.round(canvasState.zoom * 100);
const snapped = snapZoom(zoomPercent);
canvasState.zoom = snapped / 100;

let newSliderVal;
if (snapped <= 100) {
  newSliderVal = Math.round(((snapped - 1) / 99) * 50);
} else {
  newSliderVal = Math.round(50 + ((snapped - 100) / 700) * 50);
}

zoomSlider.value = newSliderVal;
zoomValue.textContent = snapped + '%';
drawCanvas();
```

});

// Mockup zoom slider
const mockupZoom = document.getElementById(‘mockupZoom’);
const mockupZoomValue = document.getElementById(‘mockupZoomValue’);

mockupZoom.addEventListener(‘input’, (e) => {
canvasState.mockupZoom = parseInt(e.target.value) / 100;
mockupZoomValue.textContent = e.target.value + ‘%’;
drawCanvas();
});

// Mockup rotate slider
const mockupRotate = document.getElementById(‘mockupRotate’);
const mockupRotateValue = document.getElementById(‘mockupRotateValue’);

mockupRotate.addEventListener(‘input’, (e) => {
canvasState.mockupRotate = parseInt(e.target.value);
mockupRotateValue.textContent = e.target.value + ‘°’;
drawCanvas();
});
}

/* ==========================================================================
DROPDOWNS
========================================================================== */

/**

- Set up all dropdown controls
- - Master dropdown (switches between sections)
- - Canvas quality
- - Repeat type
- - View mode
- - Background color
- - Grid size
- - Sample patterns
- - Country stores
    */
    function setupDropdowns() {
    // Master dropdown (section switcher)
    const masterDropdown = document.getElementById(‘masterDropdown’);

masterDropdown.addEventListener(‘change’, (e) => {
const sections = [‘displaySection’, ‘controlsSection’, ‘toolsSection’, ‘storesSection’];
sections.forEach(id => document.getElementById(id).classList.remove(‘active’));

```
const sectionMap = {
  display: 'displaySection',
  controls: 'controlsSection',
  tools: 'toolsSection',
  stores: 'storesSection'
};

if (sectionMap[e.target.value]) {
  document.getElementById(sectionMap[e.target.value]).classList.add('active');
  document.getElementById('instructionsAccordion').style.display = 'none';
} else {
  document.getElementById('instructionsAccordion').style.display = 'block';
}
```

});

// Canvas quality
const canvasQuality = document.getElementById(‘canvasQuality’);

canvasQuality.addEventListener(‘change’, (e) => {
canvasState.maxCanvasSize = parseInt(e.target.value);
resizeCanvas();
});

// Repeat type
const repeatType = document.getElementById(‘repeatType’);

repeatType.addEventListener(‘change’, (e) => {
canvasState.repeatType = e.target.value;
drawCanvas();
});

// View mode
const viewMode = document.getElementById(‘viewMode’);

viewMode.addEventListener(‘change’, (e) => {
canvasState.viewMode = e.target.value;
drawCanvas();
});

// Background color
const bgColor = document.getElementById(‘bgColor’);

bgColor.addEventListener(‘change’, (e) => {
canvasState.backgroundColor = e.target.value;
updateBackground();
drawCanvas();
});

// Grid size
const gridSize = document.getElementById(‘gridSize’);

gridSize.addEventListener(‘change’, (e) => {
canvasState.gridOverlaySize = e.target.value === ‘off’ ? 0 : parseInt(e.target.value);
drawCanvas();
});

// Seamless test
const seamlessTest = document.getElementById(‘seamlessTest’);

seamlessTest.addEventListener(‘change’, (e) => {
canvasState.seamlessTestMode = e.target.value === ‘on’;
drawCanvas();
});

// Sample patterns
const sampleSelect = document.getElementById(‘sampleSelect’);

sampleSelect.addEventListener(‘change’, (e) => {
const url = e.target.value;
if (!url) return;

```
loadImageFromURL(url);
e.target.value = '';
```

});

// Country stores
const countryStores = document.getElementById(‘countryStores’);

countryStores.addEventListener(‘change’, (e) => {
if (e.target.value) {
window.open(e.target.value, ‘_blank’);
e.target.value = ‘’;
}
});
}

/* ==========================================================================
ACCORDIONS
========================================================================== */

/**

- Set up accordion toggles
- - Instructions accordion
- - Slider dropdowns
- - Zoom slider
    */
    function setupAccordions() {
    // Instructions accordion
    const instructionsAccordion = document.getElementById(‘instructionsAccordion’);
    const instructionsHeader = instructionsAccordion.querySelector(’.instructions-accordion-header’);

instructionsHeader.addEventListener(‘click’, () => {
const isOpen = instructionsAccordion.classList.contains(‘open’);
instructionsAccordion.classList.toggle(‘open’, !isOpen);
instructionsHeader.querySelector(‘span:last-child’).textContent = isOpen ? ‘▼’ : ‘▲’;
});

// Slider dropdowns
document.querySelectorAll(’.slider-dropdown-header’).forEach(header => {
header.addEventListener(‘click’, () => {
const parent = header.parentElement;
const wasOpen = parent.classList.contains(‘open’);
document.querySelectorAll(’.slider-dropdown’).forEach(sd => sd.classList.remove(‘open’));
if (!wasOpen) parent.classList.add(‘open’);
});
});

// Zoom slider
const zoomSliderWrapper = document.getElementById(‘zoomSliderWrapper’);
const zoomHeader = zoomSliderWrapper.querySelector(’.zoom-slider-header’);

zoomHeader.addEventListener(‘click’, () => {
const wasOpen = zoomSliderWrapper.classList.contains(‘open’);
zoomSliderWrapper.classList.toggle(‘open’, !wasOpen);
});
}

/* ==========================================================================
EXPORT MODAL
========================================================================== */

/**

- Set up export modal functionality
  */
  function setupExportModal() {
  const exportBtn = document.getElementById(‘exportBtnHeader’);
  const exportModal = document.getElementById(‘exportModal’);
  const exportRes = document.getElementById(‘exportRes’);
  const customSizeOption = document.getElementById(‘customSizeOption’);
  const exportConfirm = document.getElementById(‘exportConfirm’);
  const exportCancel = document.getElementById(‘exportCancel’);

// Open modal
exportBtn.addEventListener(‘click’, () => {
if (!canvasState.tileImage) return;
exportRes.options[0].text = `Current Canvas (${canvasState.maxCanvasSize}px)`;
exportModal.classList.add(‘visible’);
});

// Close modal
exportCancel.addEventListener(‘click’, () => {
exportModal.classList.remove(‘visible’);
});

// Show/hide custom size input
exportRes.addEventListener(‘change’, (e) => {
if (e.target.value === ‘custom’) {
customSizeOption.style.display = ‘block’;
} else {
customSizeOption.style.display = ‘none’;
}
});

// Export button
exportConfirm.addEventListener(‘click’, () => {
if (!canvasState.tileImage) return;

```
let exportSize = canvasState.maxCanvasSize;

if (exportRes.value === 'custom') {
  exportSize = parseInt(document.getElementById('customSize').value) || 2400;
} else if (exportRes.value !== 'current') {
  exportSize = parseInt(exportRes.value);
}

const format = document.getElementById('exportFormat').value;

exportModal.classList.remove('visible');
exportPattern(exportSize, format);
```

});
}

/* ==========================================================================
WEATHER WIDGET
========================================================================== */

/**

- Initialize weather widget
  */
  function initWeather() {
  getWeather();
  }

/**

- Get user’s weather
  */
  async function getWeather() {
  const weatherWidget = document.getElementById(‘weatherWidget’);
  const weatherCondition = document.getElementById(‘weatherCondition’);
  const weatherIcon = document.getElementById(‘weatherIcon’);
  const weatherLocation = document.getElementById(‘weatherLocation’);

weatherWidget.classList.add(‘visible’);
weatherWidget.classList.add(‘loading’);

if (!navigator.geolocation) {
weatherCondition.textContent = ‘Location unavailable’;
weatherLocation.textContent = ‘Geolocation not supported’;
weatherWidget.classList.remove(‘loading’);
return;
}

navigator.geolocation.getCurrentPosition(async (position) => {
const { latitude, longitude } = position.coords;

```
try {
  const [weatherResponse, cityName] = await Promise.all([
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`),
    getCityName(latitude, longitude)
  ]);
  
  const data = await weatherResponse.json();
  
  if (data.current_weather) {
    displayWeatherOpenMeteo(data, latitude, longitude, cityName);
  }
} catch (error) {
  console.error('Weather fetch error:', error);
  weatherCondition.textContent = 'Weather unavailable';
  weatherIcon.textContent = '🌐';
  weatherLocation.textContent = 'Service unavailable';
  weatherWidget.classList.remove('loading');
}
```

}, (error) => {
console.error(‘Geolocation error:’, error);
weatherCondition.textContent = ‘Location denied’;
weatherIcon.textContent = ‘📍’;
weatherLocation.textContent = ‘Enable location’;
weatherWidget.classList.remove(‘loading’);
});
}

/**

- Get city name from coordinates
  */
  async function getCityName(lat, lon) {
  try {
  const response = await fetch(
  `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
  );
  const data = await response.json();
  
  if (data && data.address) {
  const city = data.address.city ||
  data.address.town ||
  data.address.village ||
  data.address.county ||
  data.address.state;
  const country = data.address.country;
  
  if (city && country) {
  return `${city}, ${country}`;
  } else if (city) {
  return city;
  } else if (country) {
  return country;
  }
  }
  return ‘Your Location’;
  } catch (error) {
  console.error(‘Reverse geocoding error:’, error);
  return ‘Your Location’;
  }
  }

/**

- Display weather from Open-Meteo API
  */
  function displayWeatherOpenMeteo(data, lat, lon, cityName) {
  const tempC = Math.round(data.current_weather.temperature);
  const tempF = Math.round((tempC * 9/5) + 32);

const isUS = (lat > 24 && lat < 50 && lon > -125 && lon < -66);
const temp = isUS ? tempF : tempC;
const unit = isUS ? ‘°F’ : ‘°C’;

document.getElementById(‘weatherTemp’).textContent = `${temp}${unit}`;
document.getElementById(‘weatherCondition’).textContent = getRudeboyWeatherCondition(data.current_weather.weathercode);
document.getElementById(‘weatherLocation’).textContent = cityName;
document.getElementById(‘weatherIcon’).textContent = getWeatherIconFromCode(data.current_weather.weathercode);
document.getElementById(‘weatherWidget’).classList.remove(‘loading’);
}

/**

- Get weather icon from code
  */
  function getWeatherIconFromCode(code) {
  if (code === 0) return ‘☀️’;
  if (code === 1 || code === 2) return ‘🌤️’;
  if (code === 3) return ‘☁️’;
  if (code === 45 || code === 48) return ‘🌫️’;
  if (code >= 51 && code <= 67) return ‘🌧️’;
  if (code >= 71 && code <= 77) return ‘❄️’;
  if (code >= 80 && code <= 82) return ‘🌦️’;
  if (code >= 85 && code <= 86) return ‘❄️’;
  if (code >= 95 && code <= 99) return ‘⛈️’;
  return ‘🌡️’;
  }

/**

- Get Rudeboy weather condition text
  */
  function getRudeboyWeatherCondition(code) {
  if (code === 0) return ‘SunnySide Up’;
  if (code === 1 || code === 2) return “It’s Cloudy Bitch”;
  if (code === 3) return “It’s Cloudy Bitch”;
  if (code === 45 || code === 48) return “Can’t see shit”;
  if (code >= 51 && code <= 67) return ‘Wet T-Shirt Weather’;
  if (code >= 71 && code <= 77) return ‘Fucking Snow’;
  if (code >= 80 && code <= 82) return “She’s a squirter”;
  if (code >= 85 && code <= 86) return ‘Fucking Snow’;
  if (code >= 95 && code <= 99) return ‘Zeus is Pissed’;
  return ‘Unknown’;
  }

/* ==========================================================================
TIME DISPLAY
========================================================================== */

/**

- Initialize time display
  */
  function initTime() {
  updateTime();
  setInterval(updateTime, 1000);
  }

/**

- Update time display
  */
  function updateTime() {
  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const ampm = hours >= 12 ? ‘PM’ : ‘AM’;
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes < 10 ? ‘0’ + minutes : minutes;

document.getElementById(‘weatherTime’).textContent = `${displayHours}:${displayMinutes} ${ampm}`;
}