/* ============================================================================
   UTILS.JS - Utility & Helper Functions
   ============================================================================
   This file contains reusable utility functions used throughout the app.
   These are pure functions that don't depend on global state and can be
   used anywhere in the application.
   
   Categories:
   - Math utilities (snapping, rounding, clamping)
   - Color utilities (hex conversion, validation)
   - Canvas utilities (drawing shapes)
   - Array utilities (shuffling)
   - Image utilities (loading)
   ============================================================================ */

/* ==========================================================================
   MATH UTILITIES
   ========================================================================== */

/**
 * Snap a value to the nearest step
 * Example: snap(47, 10) returns 50
 * 
 * @param {number} value - The value to snap
 * @param {number} step - The step size to snap to
 * @returns {number} The snapped value
 */
export function snap(value, step) {
  return Math.round(value / step) * step;
}

/**
 * Snap scale values with intelligent step sizes
 * Uses smaller steps for values below 0.25 for finer control
 * 
 * @param {number} value - The scale value to snap
 * @returns {number} The snapped scale value
 */
export function snapScale(value) {
  if (value >= 0.25) {
    // For larger values, snap to 0.25 (25%)
    return snap(value, 0.25);
  } else {
    // For smaller values, snap to 0.01 (1%) for precision
    return Math.max(0.05, snap(value, 0.01));
  }
}

/**
 * Snap zoom percentage values
 * Uses smaller steps below 25% for finer control
 * 
 * @param {number} value - The zoom percentage to snap
 * @returns {number} The snapped zoom percentage
 */
export function snapZoom(value) {
  if (value >= 25) {
    // For values 25% and above, snap to 25%
    return snap(value, 25);
  } else {
    // For values below 25%, snap to 1%
    return Math.max(1, Math.round(value));
  }
}

/**
 * Clamp a value between a minimum and maximum
 * Example: clamp(150, 0, 100) returns 100
 * 
 * @param {number} value - The value to clamp
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {number} The clamped value
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

/**
 * Linear interpolation between two values
 * Example: lerp(0, 100, 0.5) returns 50
 * 
 * @param {number} start - Starting value
 * @param {number} end - Ending value
 * @param {number} amount - Interpolation amount (0 to 1)
 * @returns {number} The interpolated value
 */
export function lerp(start, end, amount) {
  return start + (end - start) * amount;
}

/* ==========================================================================
   COLOR UTILITIES
   ========================================================================== */

/**
 * Convert RGB color values to hexadecimal color code
 * Example: rgbToHex(255, 0, 128) returns '#FF0080'
 * 
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @returns {string} Hex color code with # prefix
 */
export function rgbToHex(r, g, b) {
  return '#' + [r, g, b].map(value => {
    const hex = value.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('');
}

/**
 * Convert hexadecimal color code to RGB object
 * Handles both 3-digit (#RGB) and 6-digit (#RRGGBB) formats
 * Example: hexToRgb('#FF0080') returns { r: 255, g: 0, b: 128 }
 * 
 * @param {string} hex - Hex color code (with or without #)
 * @returns {Object} RGB object with r, g, b properties
 */
export function hexToRgb(hex) {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Expand 3-digit hex to 6-digit (e.g., #F0A becomes #FF00AA)
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }
  
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  return { r, g, b };
}

/**
 * Validate if a string is a valid hexadecimal color code
 * Accepts both #RGB and #RRGGBB formats
 * 
 * @param {string} hex - String to validate
 * @returns {boolean} True if valid hex color
 */
export function isValidHex(hex) {
  return /^#?([0-9A-F]{3}|[0-9A-F]{6})$/i.test(hex);
}

/**
 * Calculate relative luminance of an RGB color
 * Used for contrast calculations
 * 
 * @param {number} r - Red value (0-255)
 * @param {number} g - Green value (0-255)
 * @param {number} b - Blue value (0-255)
 * @returns {number} Luminance value (0 to 1)
 */
export function getLuminance(r, g, b) {
  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

/**
 * Calculate contrast ratio between two luminance values
 * Used to assess pattern contrast
 * 
 * @param {number} lum1 - First luminance value
 * @param {number} lum2 - Second luminance value
 * @returns {number} Contrast ratio
 */
export function getContrastRatio(lum1, lum2) {
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return lighter / (darker + 0.05);
}

/* ==========================================================================
   CANVAS UTILITIES
   ========================================================================== */

/**
 * Draw a rounded rectangle on a canvas context
 * Used for creating cards, buttons, and containers
 * 
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
 * @param {number} x - X coordinate of top-left corner
 * @param {number} y - Y coordinate of top-left corner
 * @param {number} width - Rectangle width
 * @param {number} height - Rectangle height
 * @param {number} radius - Corner radius
 */
export function roundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.arcTo(x + width, y, x + width, y + radius, radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  ctx.lineTo(x + radius, y + height);
  ctx.arcTo(x, y + height, x, y + height - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
}

/**
 * Create a pattern from an image on a canvas context
 * Used for tiling patterns across the canvas
 * 
 * @param {CanvasRenderingContext2D} ctx - Canvas 2D context
 * @param {HTMLImageElement} image - Image to use as pattern
 * @param {string} repetition - Repeat mode ('repeat', 'repeat-x', 'repeat-y', 'no-repeat')
 * @returns {CanvasPattern} Canvas pattern object
 */
export function createPattern(ctx, image, repetition = 'repeat') {
  return ctx.createPattern(image, repetition);
}

/* ==========================================================================
   ARRAY UTILITIES
   ========================================================================== */

/**
 * Shuffle an array in place using Fisher-Yates algorithm
 * Used to randomize playlist order
 * 
 * @param {Array} array - Array to shuffle
 * @returns {Array} The same array, shuffled (modified in place)
 */
export function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * Get a random item from an array
 * 
 * @param {Array} array - Array to pick from
 * @returns {*} Random item from array
 */
export function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Remove duplicates from an array
 * 
 * @param {Array} array - Array to deduplicate
 * @returns {Array} New array with duplicates removed
 */
export function uniqueArray(array) {
  return [...new Set(array)];
}

/* ==========================================================================
   IMAGE UTILITIES
   ========================================================================== */

/**
 * Load an image from a URL and return a promise
 * Handles CORS for cross-origin images
 * 
 * @param {string} url - URL of image to load
 * @param {boolean} crossOrigin - Whether to set crossOrigin attribute
 * @returns {Promise<HTMLImageElement>} Promise that resolves with loaded image
 */
export function loadImage(url, crossOrigin = true) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    if (crossOrigin) {
      img.crossOrigin = 'anonymous';
    }
    
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    
    img.src = url;
  });
}

/**
 * Load an image from a File object (from file input)
 * 
 * @param {File} file - File object from file input
 * @returns {Promise<HTMLImageElement>} Promise that resolves with loaded image
 */
export function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image from file'));
      img.src = event.target.result;
    };
    
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/* ==========================================================================
   STRING UTILITIES
   ========================================================================== */

/**
 * Capitalize the first letter of a string
 * 
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert a string to kebab-case
 * Example: "Hello World" becomes "hello-world"
 * 
 * @param {string} str - String to convert
 * @returns {string} Kebab-case string
 */
export function kebabCase(str) {
  return str
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

/**
 * Truncate a string to a maximum length with ellipsis
 * 
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated string
 */
export function truncate(str, maxLength) {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength - 3) + '...';
}

/* ==========================================================================
   DATE/TIME UTILITIES
   ========================================================================== */

/**
 * Format a date as a readable string
 * Example: "Feb 2, 2026"
 * 
 * @param {Date} date - Date object to format
 * @returns {string} Formatted date string
 */
export function formatDate(date) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

/**
 * Format a timestamp as a relative time string
 * Example: "2 hours ago"
 * 
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} Relative time string
 */
export function timeAgo(timestamp) {
  const seconds = Math.floor((Date.now() - timestamp) / 1000);
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  };
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit);
    if (interval >= 1) {
      return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
    }
  }
  
  return 'just now';
}

/* ==========================================================================
   DOM UTILITIES
   ========================================================================== */

/**
 * Shorthand for document.getElementById
 * 
 * @param {string} id - Element ID
 * @returns {HTMLElement} Element with the given ID
 */
export function getEl(id) {
  return document.getElementById(id);
}

/**
 * Shorthand for document.querySelector
 * 
 * @param {string} selector - CSS selector
 * @returns {HTMLElement} First element matching selector
 */
export function $(selector) {
  return document.querySelector(selector);
}

/**
 * Shorthand for document.querySelectorAll
 * 
 * @param {string} selector - CSS selector
 * @returns {NodeList} All elements matching selector
 */
export function $$(selector) {
  return document.querySelectorAll(selector);
}

/* ==========================================================================
   DEBOUNCE & THROTTLE
   ========================================================================== */

/**
 * Debounce a function - delays execution until after wait time has passed
 * Useful for resize, scroll, and input events
 * 
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle a function - ensures it only runs once per time period
 * Useful for scroll and resize events
 * 
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} Throttled function
 */
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/* ==========================================================================
   DOWNLOAD UTILITIES
   ========================================================================== */

/**
 * Download a blob as a file
 * Used for exporting patterns
 * 
 * @param {Blob} blob - Blob data to download
 * @param {string} filename - Desired filename
 */
export function downloadBlob(blob, filename) {
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

/**
 * Copy text to clipboard
 * Used for copying hex color codes
 * 
 * @param {string} text - Text to copy
 * @returns {Promise<void>} Promise that resolves when copied
 */
export function copyToClipboard(text) {
  return navigator.clipboard.writeText(text);
}

/* ==========================================================================
   VALIDATION UTILITIES
   ========================================================================== */

/**
 * Check if a value is a valid number
 * 
 * @param {*} value - Value to check
 * @returns {boolean} True if valid number
 */
export function isValidNumber(value) {
  return typeof value === 'number' && !isNaN(value) && isFinite(value);
}

/**
 * Check if a value is within a range (inclusive)
 * 
 * @param {number} value - Value to check
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {boolean} True if value is in range
 */
export function isInRange(value, min, max) {
  return isValidNumber(value) && value >= min && value <= max;
}