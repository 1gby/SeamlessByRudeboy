/* ============================================================================
CONFIG.JS - Application Configuration

This file contains all configuration constants and settings.
Centralized configuration makes it easy to adjust app behavior.

Categories:

- Canvas settings
- File upload settings
- Export settings
- Animation settings
- API endpoints
  ============================================================================ */

/**

- Canvas Configuration
  */
  const CANVAS_CONFIG = {
  // Default canvas size in pixels
  DEFAULT_SIZE: 1200,

// Available canvas quality options
QUALITY_OPTIONS: {
STANDARD: 1200,
HIGH: 1600,
ULTRA: 2400,
MAX: 3200
},

// Zoom limits
MIN_ZOOM: 0.01,
MAX_ZOOM: 8.0,

// Scale limits
MIN_SCALE: 0.05,
MAX_SCALE: 5.0,

// Default repeat type
DEFAULT_REPEAT: ‘full’,

// Repeat type options
REPEAT_TYPES: [‘full’, ‘half-drop’, ‘brick’]
};

/**

- File Upload Configuration
  */
  const UPLOAD_CONFIG = {
  // Accepted file types
  ACCEPTED_TYPES: [‘image/png’, ‘image/jpeg’, ‘image/jpg’, ‘image/webp’],

// Maximum file size (10MB)
MAX_FILE_SIZE: 10 * 1024 * 1024,

// File extensions
ACCEPTED_EXTENSIONS: [’.png’, ‘.jpg’, ‘.jpeg’, ‘.webp’]
};

/**

- Export Configuration
  */
  const EXPORT_CONFIG = {
  // Available export resolutions
  RESOLUTIONS: {
  CURRENT: ‘current’,
  HIGH: 1600,
  ULTRA: 2400,
  MAX: 3200,
  PRINT: 4800,
  CUSTOM: ‘custom’
  },

// Export formats
FORMATS: {
PNG: ‘png’,
JPG: ‘jpg’
},

// JPEG quality (0-1)
JPEG_QUALITY: 0.95,

// Default filename prefix
FILENAME_PREFIX: ‘rudeboy-pattern’
};

/**

- Loading Configuration
  */
  const LOADING_CONFIG = {
  // Minimum loading time (ms) - ensures user sees loading animation
  MIN_LOAD_TIME: 1500,

// Minimum reload time (ms)
MIN_RELOAD_TIME: 1500
};

/**

- Animation Configuration
  */
  const ANIMATION_CONFIG = {
  // Transition duration (ms)
  TRANSITION_NORMAL: 300,
  TRANSITION_FAST: 150,
  TRANSITION_SLOW: 500,

// Animation timing functions
EASE_IN_OUT: ‘ease-in-out’,
EASE_OUT: ‘ease-out’,
EASE_IN: ‘ease-in’
};

/**

- Calculator Configuration
  */
  const CALC_CONFIG = {
  // Default values
  DEFAULT_SIZE: 9,
  DEFAULT_DPI: 150,
  DEFAULT_UNIT: ‘inches’,

// Size limits
MIN_SIZE_INCHES: 1,
MAX_SIZE_INCHES: 200,
MIN_SIZE_CM: 1,
MAX_SIZE_CM: 500,

// DPI limits
MIN_DPI: 72,
MAX_DPI: 600,

// Conversion factor
CM_TO_INCHES: 2.54,

// Preset recommendations
PRESETS: {
PRINT_QUALITY: [
{ size: 4, dpi: 300, unit: ‘in’, label: ‘4” × 4” @ 300 DPI’ },
{ size: 6, dpi: 300, unit: ‘in’, label: ‘6” × 6” @ 300 DPI’ },
{ size: 8, dpi: 300, unit: ‘in’, label: ‘8” × 8” @ 300 DPI’ },
{ size: 12, dpi: 300, unit: ‘in’, label: ‘12” × 12” @ 300 DPI’ }
],
WEB_DIGITAL: [
{ px: 512, label: ‘512 × 512px’ },
{ px: 1024, label: ‘1024 × 1024px’ },
{ px: 2048, label: ‘2048 × 2048px’ },
{ px: 4096, label: ‘4096 × 4096px’ }
],
POD: [
{ size: 10.67, dpi: 150, unit: ‘in’, label: ‘Redbubble (1600px)’ },
{ size: 16, dpi: 150, unit: ‘in’, label: ‘Society6 (2400px)’ },
{ size: 13.33, dpi: 150, unit: ‘in’, label: ‘Spoonflower (2000px)’ },
{ size: 21.33, dpi: 150, unit: ‘in’, label: ‘Zazzle (3200px)’ }
]
}
};

/**

- Pattern Quality Thresholds
  */
  const QUALITY_CONFIG = {
  // Pixel thresholds for quality assessment
  EXCELLENT_MIN: 3000,
  GOOD_MIN: 2000,

// Contrast ratio thresholds
HIGH_CONTRAST: 7,
MEDIUM_CONTRAST: 3
};

/**

- Grid Overlay Configuration
  */
  const GRID_CONFIG = {
  // Available grid sizes (in inches)
  SIZES: [0, 1, 2, 6, 12],

// DPI for grid calculations
DPI: 150,

// Grid line style
LINE_COLOR: ‘rgba(255, 255, 255, 0.5)’,
LINE_WIDTH: 2,
LINE_DASH: [5, 5]
};

/**

- Mockup Configuration
  */
  const MOCKUP_CONFIG = {
  // Base URL for mockup images
  BASE_URL: ‘https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/Mockups/’,

// Available mockups
MOCKUPS: {
phone: ‘iphone.png’,
bottle: ‘bottle.png’,
tote: ‘tote.png’,
bandana: ‘bandana.png’,
bedspread: ‘bedspread.png’,
ipad: ‘ipad.png’,
mug: ‘mug.png’,
sweatshirt: ‘sweatshirt.png’
},

// Mockup display size (percentage of canvas)
DISPLAY_SIZE_PERCENT: 0.72,

// Chroma key detection (green screen)
CHROMA_KEY: {
MIN_GREEN: 200,
GREEN_ADVANTAGE: 50,
MAX_RED: 50,
MAX_BLUE: 50
}
};

/**

- Sample Patterns Configuration
  */
  const SAMPLES_CONFIG = {
  // Base URL for sample patterns
  BASE_URL: ‘https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/patterns/’,

// Available samples
SAMPLES: [
{ name: ‘Seamless’, file: ‘Seamless.png’ },
{ name: ‘Mushrooms’, file: ‘Mushrooms.png’ },
{ name: ‘Jolt Cola’, file: ‘JoltCola.png’ },
{ name: ‘Beaver’, file: ‘Beaver.png’ },
{ name: ‘Pinot Noir’, file: ‘PinotNoir.png’ },
{ name: ‘Wu-Tang’, file: ‘Wu-Tang.png’ }
]
};

/**

- Weather API Configuration
  */
  const WEATHER_CONFIG = {
  // Open-Meteo API endpoint
  API_ENDPOINT: ‘https://api.open-meteo.com/v1/forecast’,

// Nominatim reverse geocoding
GEOCODING_ENDPOINT: ‘https://nominatim.openstreetmap.org/reverse’,

// US bounds for F vs C
US_BOUNDS: {
MIN_LAT: 24,
MAX_LAT: 50,
MIN_LON: -125,
MAX_LON: -66
}
};

/**

- Local Storage Configuration
  */
  const STORAGE_CONFIG = {
  // Storage key for saved patterns
  PATTERNS_KEY: ‘rudeboy-patterns’,

// Maximum saved patterns
MAX_PATTERNS: 50
};

/**

- Easter Egg Configuration
  */
  const EASTER_EGG_CONFIG = {
  // Music base URL
  MUSIC_BASE_URL: ‘https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/secret%20stash/’,

// Icon URL
ICON_URL: ‘https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/icons/nova.png’,

// Matrix animation settings
MATRIX: {
MESSAGE: ‘CREATED BY RUDEBOY’,
MESSAGE_INTERVAL: 30000,
INITIAL_SPEED: 50,
MESSAGE_SPEED: 75
},

// Audio settings
AUDIO: {
MAX_VOLUME: 0.5,
FADE_IN_STEP: 0.05,
FADE_IN_INTERVAL: 100,
FADE_OUT_STEP: 0.05,
FADE_OUT_INTERVAL: 50
}
};

/**

- Snapping Configuration
  */
  const SNAP_CONFIG = {
  // Offset snap increment (%)
  OFFSET_SNAP: 10,

// Zoom snap thresholds
ZOOM_SNAP_THRESHOLD: 25,

// Scale snap thresholds
SCALE_SNAP_THRESHOLD_LOW: 0.25,
SCALE_SNAP_THRESHOLD_HIGH: 0.01
};

/**

- Touch Configuration
  */
  const TOUCH_CONFIG = {
  // Edge dead zone for zoom (pixels)
  EDGE_DEAD_ZONE_DESKTOP: 80,
  EDGE_DEAD_ZONE_MOBILE: 100,

// Pinch zoom sensitivity
PINCH_ZOOM_SENSITIVITY: 1.0
};