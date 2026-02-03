/* ============================================================================
UTILS.JS - Utility Functions & Helpers

This file contains reusable helper functions used throughout the app.

Categories:

- Math utilities (snap, clamp, lerp)
- String utilities (format, truncate)
- Color utilities (conversions, validation)
- DOM utilities (element helpers)
- Date/Time utilities
- File utilities
  ============================================================================ */

/* ==========================================================================
MATH UTILITIES
========================================================================== */

/**

- Snap value to nearest step
- @param {number} val - Value to snap
- @param {number} step - Step size
- @returns {number} Snapped value
- 
- Example: snap(23, 10) → 20
  */
  function snap(val, step) {
  return Math.round(val / step) * step;
  }

/**

- Snap scale value intelligently
- Uses different snap increments based on scale range
- @param {number} val - Scale value
- @returns {number} Snapped scale
  */
  function snapScale(val) {
  if (val >= 0.25) {
  return snap(val, 0.25);
  } else {
  return Math.max(0.05, snap(val, 0.01));
  }
  }

/**

- Snap zoom value intelligently
- Uses different snap increments based on zoom range
- @param {number} val - Zoom percentage
- @returns {number} Snapped zoom percentage
  */
  function snapZoom(val) {
  if (val >= 25) {
  return snap(val, 25);
  } else {
  return Math.max(1, Math.round(val));
  }
  }

/**

- Clamp value between min and max
- @param {number} val - Value to clamp
- @param {number} min - Minimum value
- @param {number} max - Maximum value
- @returns {number} Clamped value
  */
  function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
  }

/**

- Linear interpolation between two values
- @param {number} a - Start value
- @param {number} b - End value
- @param {number} t - Interpolation factor (0-1)
- @returns {number} Interpolated value
  */
  function lerp(a, b, t) {
  return a + (b - a) * t;
  }

/**

- Map value from one range to another
- @param {number} val - Value to map
- @param {number} inMin - Input range minimum
- @param {number} inMax - Input range maximum
- @param {number} outMin - Output range minimum
- @param {number} outMax - Output range maximum
- @returns {number} Mapped value
  */
  function mapRange(val, inMin, inMax, outMin, outMax) {
  return ((val - inMin) / (inMax - inMin)) * (outMax - outMin) + outMin;
  }

/**

- Round to specified decimal places
- @param {number} val - Value to round
- @param {number} places - Decimal places
- @returns {number} Rounded value
  */
  function roundTo(val, places) {
  const multiplier = Math.pow(10, places);
  return Math.round(val * multiplier) / multiplier;
  }

/* ==========================================================================
STRING UTILITIES
========================================================================== */

/**

- Truncate string to max length with ellipsis
- @param {string} str - String to truncate
- @param {number} maxLength - Maximum length
- @returns {string} Truncated string
  */
  function truncate(str, maxLength) {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + ‘…’;
  }

/**

- Capitalize first letter of string
- @param {string} str - String to capitalize
- @returns {string} Capitalized string
  */
  function capitalize(str) {
  if (!str) return ‘’;
  return str.charAt(0).toUpperCase() + str.slice(1);
  }

/**

- Format number with commas
- @param {number} num - Number to format
- @returns {string} Formatted number
- 
- Example: formatNumber(1234567) → “1,234,567”
  */
  function formatNumber(num) {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ‘,’);
  }

/**

- Format file size
- @param {number} bytes - Size in bytes
- @returns {string} Formatted size
- 
- Example: formatFileSize(1536) → “1.5 KB”
  */
  function formatFileSize(bytes) {
  if (bytes === 0) return ‘0 Bytes’;

const k = 1024;
const sizes = [‘Bytes’, ‘KB’, ‘MB’, ‘GB’];
const i = Math.floor(Math.log(bytes) / Math.log(k));

return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ’ ’ + sizes[i];
}

/* ==========================================================================
COLOR UTILITIES
========================================================================== */

/**

- Convert RGB to Hex
- @param {number} r - Red (0-255)
- @param {number} g - Green (0-255)
- @param {number} b - Blue (0-255)
- @returns {string} Hex color
- 
- Example: rgbToHex(255, 0, 0) → “#ff0000”
  */
  function rgbToHex(r, g, b) {
  return ‘#’ + [r, g, b].map(x => {
  const hex = x.toString(16);
  return hex.length === 1 ? ‘0’ + hex : hex;
  }).join(’’);
  }

/**

- Convert Hex to RGB
- @param {string} hex - Hex color
- @returns {object} RGB object {r, g, b}
- 
- Example: hexToRgb(”#ff0000”) → {r: 255, g: 0, b: 0}
  */
  function hexToRgb(hex) {
  hex = hex.replace(’#’, ‘’);

// Handle 3-character hex
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
- @param {string} hex - Hex color to validate
- @returns {boolean} True if valid
  */
  function isValidHex(hex) {
  return /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i.test(hex);
  }

/**

- Calculate relative luminance
- @param {number} r - Red (0-255)
- @param {number} g - Green (0-255)
- @param {number} b - Blue (0-255)
- @returns {number} Luminance (0-1)
  */
  function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
  c = c / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });

return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

/**

- Calculate contrast ratio between two colors
- @param {object} rgb1 - First color {r, g, b}
- @param {object} rgb2 - Second color {r, g, b}
- @returns {number} Contrast ratio
  */
  function getContrastRatio(rgb1, rgb2) {
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

const lighter = Math.max(lum1, lum2);
const darker = Math.min(lum1, lum2);

return (lighter + 0.05) / (darker + 0.05);
}

/* ==========================================================================
DOM UTILITIES
========================================================================== */

/**

- Query selector shorthand
- @param {string} selector - CSS selector
- @param {Element} parent - Parent element (optional)
- @returns {Element} Element or null
  */
  function $(selector, parent = document) {
  return parent.querySelector(selector);
  }

/**

- Query selector all shorthand
- @param {string} selector - CSS selector
- @param {Element} parent - Parent element (optional)
- @returns {NodeList} NodeList of elements
  */
  function $$(selector, parent = document) {
  return parent.querySelectorAll(selector);
  }

/**

- Create element with attributes and children
- @param {string} tag - Tag name
- @param {object} attrs - Attributes object
- @param {Array} children - Child elements or text
- @returns {Element} Created element
  */
  function createElement(tag, attrs = {}, children = []) {
  const el = document.createElement(tag);

// Set attributes
Object.entries(attrs).forEach(([key, value]) => {
if (key === ‘class’) {
el.className = value;
} else if (key === ‘style’) {
Object.assign(el.style, value);
} else if (key.startsWith(‘on’)) {
el.addEventListener(key.substring(2).toLowerCase(), value);
} else {
el.setAttribute(key, value);
}
});

// Add children
children.forEach(child => {
if (typeof child === ‘string’) {
el.appendChild(document.createTextNode(child));
} else if (child instanceof Element) {
el.appendChild(child);
}
});

return el;
}

/**

- Toggle class on element
- @param {Element} el - Element
- @param {string} className - Class name
- @param {boolean} force - Force add/remove (optional)
  */
  function toggleClass(el, className, force) {
  if (force !== undefined) {
  el.classList.toggle(className, force);
  } else {
  el.classList.toggle(className);
  }
  }

/**

- Add multiple classes
- @param {Element} el - Element
- @param {Array<string>} classes - Class names
  */
  function addClasses(el, classes) {
  el.classList.add(…classes);
  }

/**

- Remove multiple classes
- @param {Element} el - Element
- @param {Array<string>} classes - Class names
  */
  function removeClasses(el, classes) {
  el.classList.remove(…classes);
  }

/* ==========================================================================
DATE/TIME UTILITIES
========================================================================== */

/**

- Format date to localized string
- @param {Date} date - Date object
- @param {object} options - Intl.DateTimeFormat options
- @returns {string} Formatted date
  */
  function formatDate(date, options = {}) {
  return new Intl.DateTimeFormat(‘en-US’, options).format(date);
  }

/**

- Get relative time string
- @param {Date} date - Date object
- @returns {string} Relative time (e.g., “2 hours ago”)
  */
  function getRelativeTime(date) {
  const now = new Date();
  const diff = now - date;
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
if (minutes > 0) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
return ‘just now’;
}

/**

- Format time to 12-hour format
- @param {Date} date - Date object
- @returns {string} Formatted time (e.g., “2:30 PM”)
  */
  function formatTime12Hour(date) {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const ampm = hours >= 12 ? ‘PM’ : ‘AM’;
  const displayHours = hours % 12 || 12;
  const displayMinutes = minutes < 10 ? ‘0’ + minutes : minutes;

return `${displayHours}:${displayMinutes} ${ampm}`;
}

/* ==========================================================================
FILE UTILITIES
========================================================================== */

/**

- Get file extension
- @param {string} filename - File name
- @returns {string} Extension (lowercase, with dot)
  */
  function getFileExtension(filename) {
  return filename.slice(filename.lastIndexOf(’.’)).toLowerCase();
  }

/**

- Validate file type
- @param {File} file - File object
- @param {Array<string>} acceptedTypes - Accepted MIME types
- @returns {boolean} True if valid
  */
  function validateFileType(file, acceptedTypes) {
  return acceptedTypes.includes(file.type);
  }

/**

- Validate file size
- @param {File} file - File object
- @param {number} maxSize - Max size in bytes
- @returns {boolean} True if valid
  */
  function validateFileSize(file, maxSize) {
  return file.size <= maxSize;
  }

/**

- Read file as data URL
- @param {File} file - File object
- @returns {Promise<string>} Data URL
  */
  function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.onload = (e) => resolve(e.target.result);
  reader.onerror = reject;
  reader.readAsDataURL(file);
  });
  }

/**

- Download file
- @param {Blob} blob - Blob data
- @param {string} filename - File name
  */
  function downloadFile(blob, filename) {
  const link = document.createElement(‘a’);
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
  }

/* ==========================================================================
ASYNC UTILITIES
========================================================================== */

/**

- Wait for specified time
- @param {number} ms - Milliseconds to wait
- @returns {Promise} Promise that resolves after delay
  */
  function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
  }

/**

- Debounce function
- @param {Function} func - Function to debounce
- @param {number} wait - Wait time in ms
- @returns {Function} Debounced function
  */
  function debounce(func, wait) {
  let timeout;
  return function executedFunction(…args) {
  const later = () => {
  clearTimeout(timeout);
  func(…args);
  };
  clearTimeout(timeout);
  timeout = setTimeout(later, wait);
  };
  }

/**

- Throttle function
- @param {Function} func - Function to throttle
- @param {number} limit - Time limit in ms
- @returns {Function} Throttled function
  */
  function throttle(func, limit) {
  let inThrottle;
  return function(…args) {
  if (!inThrottle) {
  func.apply(this, args);
  inThrottle = true;
  setTimeout(() => inThrottle = false, limit);
  }
  };
  }

/* ==========================================================================
STORAGE UTILITIES
========================================================================== */

/**

- Get item from localStorage with JSON parsing
- @param {string} key - Storage key
- @param {any} defaultValue - Default value if not found
- @returns {any} Parsed value or default
  */
  function getStorageItem(key, defaultValue = null) {
  try {
  const item = localStorage.getItem(key);
  return item ? JSON.parse(item) : defaultValue;
  } catch (e) {
  console.error(‘Error reading from localStorage:’, e);
  return defaultValue;
  }
  }

/**

- Set item in localStorage with JSON stringification
- @param {string} key - Storage key
- @param {any} value - Value to store
- @returns {boolean} True if successful
  */
  function setStorageItem(key, value) {
  try {
  localStorage.setItem(key, JSON.stringify(value));
  return true;
  } catch (e) {
  console.error(‘Error writing to localStorage:’, e);
  return false;
  }
  }

/**

- Remove item from localStorage
- @param {string} key - Storage key
  */
  function removeStorageItem(key) {
  try {
  localStorage.removeItem(key);
  return true;
  } catch (e) {
  console.error(‘Error removing from localStorage:’, e);
  return false;
  }
  }

/* ==========================================================================
VALIDATION UTILITIES
========================================================================== */

/**

- Check if value is empty
- @param {any} value - Value to check
- @returns {boolean} True if empty
  */
  function isEmpty(value) {
  if (value == null) return true;
  if (typeof value === ‘string’) return value.trim() === ‘’;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === ‘object’) return Object.keys(value).length === 0;
  return false;
  }

/**

- Check if value is numeric
- @param {any} value - Value to check
- @returns {boolean} True if numeric
  */
  function isNumeric(value) {
  return !isNaN(parseFloat(value)) && isFinite(value);
  }

/* ==========================================================================
CANVAS UTILITIES
========================================================================== */

/**

- Draw rounded rectangle path
- @param {CanvasRenderingContext2D} ctx - Canvas context
- @param {number} x - X position
- @param {number} y - Y position
- @param {number} w - Width
- @param {number} h - Height
- @param {number} r - Border radius
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

- Get image data safely
- @param {CanvasRenderingContext2D} ctx - Canvas context
- @param {number} x - X position
- @param {number} y - Y position
- @param {number} w - Width
- @param {number} h - Height
- @returns {ImageData|null} Image data or null if error
  */
  function safeGetImageData(ctx, x, y, w, h) {
  try {
  return ctx.getImageData(x, y, w, h);
  } catch (e) {
  console.error(‘Error getting image data:’, e);
  return null;
  }
  }