/* ============================================================================
   CONFIG.JS - Application Configuration & Constants
   ============================================================================
   This file contains all configuration values, constants, and settings
   used throughout the Rudeboy Pattern Checker application.
   
   By centralizing configuration here, we can:
   - Easily adjust app behavior without hunting through code
   - Maintain consistent settings across all modules
   - Document what each setting does and why it exists
   ============================================================================ */

/* ==========================================================================
   CANVAS SETTINGS
   ========================================================================== */

/**
 * Canvas quality presets (in pixels)
 * These determine the resolution of the pattern preview canvas
 */
export const CANVAS_QUALITY = {
  STANDARD: 1200,  // Good for quick previews and most use cases
  HIGH: 1600,      // Better quality, slightly slower rendering
  ULTRA: 2400,     // High quality for detailed work
  MAX: 3200        // Maximum quality for final exports
};

/**
 * Default canvas quality setting
 * Used when the app first loads
 */
export const DEFAULT_CANVAS_QUALITY = CANVAS_QUALITY.STANDARD;

/**
 * Zoom limits for canvas interaction
 * Prevents users from zooming too far in or out
 */
export const ZOOM = {
  MIN: 0.01,   // 1% - Zoomed way out
  MAX: 8,      // 800% - Zoomed way in
  DEFAULT: 1   // 100% - Normal view
};

/**
 * Scale limits for pattern size adjustment
 * Controls how much users can shrink or enlarge patterns
 */
export const SCALE = {
  MIN: 0.05,   // 5% - Very small pattern tiles
  MAX: 5,      // 500% - Very large pattern tiles
  DEFAULT: 1   // 100% - Original size
};

/* ==========================================================================
   PATTERN SETTINGS
   ========================================================================== */

/**
 * Pattern repeat types
 * Different tiling methods for seamless patterns
 */
export const REPEAT_TYPES = {
  FULL: 'full',           // Standard grid tiling
  HALF_DROP: 'half-drop', // Offset every other column by half height
  BRICK: 'brick'          // Offset every other row by half width
};

/**
 * Default repeat type when app loads
 */
export const DEFAULT_REPEAT_TYPE = REPEAT_TYPES.FULL;

/**
 * Background color options for canvas
 * Helps visualize patterns with transparency
 */
export const BACKGROUND_COLORS = {
  CHECKER: 'checker',     // Transparent checkerboard pattern
  BLACK: '#000000',       // Solid black
  WHITE: '#ffffff',       // Solid white
  GRAY: '#1a1a1a'        // Dark gray
};

/**
 * Default background when app loads
 */
export const DEFAULT_BACKGROUND = BACKGROUND_COLORS.CHECKER;

/**
 * Grid overlay sizes (in inches)
 * Helps users visualize scale at different print sizes
 */
export const GRID_SIZES = {
  OFF: 0,
  ONE_INCH: 1,
  TWO_INCH: 2,
  SIX_INCH: 6,
  TWELVE_INCH: 12
};

/* ==========================================================================
   EXPORT SETTINGS
   ========================================================================== */

/**
 * Export resolution presets (in pixels)
 * Common sizes for different use cases
 */
export const EXPORT_RESOLUTIONS = {
  CURRENT: 'current',  // Whatever canvas quality is currently set
  HIGH: 1600,          // Good for web and most print
  ULTRA: 2400,         // High quality print
  MAX: 3200,           // Maximum quality for large prints
  PRINT: 4800,         // Professional print quality
  CUSTOM: 'custom'     // User-defined size
};

/**
 * Export format options
 */
export const EXPORT_FORMATS = {
  PNG: 'png',  // Lossless, larger file size
  JPG: 'jpg'   // Lossy compression, smaller file size
};

/**
 * JPEG quality setting (0.0 to 1.0)
 * Higher = better quality but larger file
 */
export const JPEG_QUALITY = 0.95;

/* ==========================================================================
   LOADING & ANIMATION TIMING
   ========================================================================== */

/**
 * Minimum time (milliseconds) to show loading animation
 * Prevents jarring flash if loading completes too quickly
 */
export const MIN_LOAD_TIME = 1500;  // 1.5 seconds

/**
 * Minimum time for reload animation
 * Used when clicking the logo to reload the app
 */
export const RELOAD_MIN_TIME = 1500;  // 1.5 seconds

/* ==========================================================================
   DIMENSION CALCULATOR SETTINGS
   ========================================================================== */

/**
 * Calculator default values
 * Initial state when app loads
 */
export const CALCULATOR_DEFAULTS = {
  SIZE: 9,           // 9 inches square
  DPI: 150,          // Standard web/print DPI
  UNIT: 'inches',    // Default measurement unit
  FIELD: 'size'      // Which field is active (size or dpi)
};

/**
 * Calculator limits
 * Prevents users from entering impossible values
 */
export const CALCULATOR_LIMITS = {
  SIZE_MIN: 1,        // Minimum size in inches/cm
  SIZE_MAX_INCHES: 200,  // Maximum size in inches
  SIZE_MAX_CM: 500,      // Maximum size in centimeters
  DPI_MIN: 72,        // Minimum DPI
  DPI_MAX: 600        // Maximum DPI
};

/**
 * Common DPI values for reference
 */
export const DPI_PRESETS = {
  WEB: 72,           // Standard web resolution
  PRINT_LOW: 150,    // Low quality print
  PRINT_STANDARD: 300,  // Standard print quality
  PRINT_HIGH: 600    // High quality print
};

/* ==========================================================================
   MOCKUP SETTINGS
   ========================================================================== */

/**
 * Mockup types available in the app
 */
export const MOCKUP_TYPES = {
  TILE: 'tile',              // Infinite tiled pattern
  TILE_GRID: 'tile-grid',    // Infinite tile with grid overlay
  PHONE: 'phone',            // Phone case mockup
  IPAD: 'ipad',              // iPad case mockup
  TOTE: 'tote',              // Tote bag mockup
  BANDANA: 'bandana',        // Bandana mockup
  BEDSPREAD: 'bedspread',    // Bedspread mockup
  MUG: 'mug',                // Mug mockup
  SWEATSHIRT: 'sweatshirt',  // Sweatshirt mockup
  FABRIC: 'fabric',          // Fabric swatch mockup
  BOTTLE: 'bottle'           // Water bottle mockup
};

/**
 * Mockup zoom limits
 * How much users can zoom mockup previews
 */
export const MOCKUP_ZOOM = {
  MIN: 100,    // 100% - Normal size
  MAX: 150,    // 150% - 1.5x zoom
  DEFAULT: 100
};

/**
 * Mockup rotation limits
 */
export const MOCKUP_ROTATION = {
  MIN: 0,      // 0 degrees
  MAX: 360,    // Full rotation
  DEFAULT: 0
};

/**
 * Green screen color detection for mockups
 * Used to replace green areas with pattern
 */
export const GREEN_SCREEN = {
  COLOR: '#00FF00',           // Pure green (#00FF00)
  TOLERANCE_R: 10,            // Red channel tolerance (0-10)
  TOLERANCE_G_MIN: 200,       // Green channel minimum (200-255)
  TOLERANCE_B: 10             // Blue channel tolerance (0-10)
};

/* ==========================================================================
   SAMPLE PATTERNS
   ========================================================================== */

/**
 * Pre-loaded sample patterns for users to try
 * GitHub raw URLs to pattern images
 */
export const SAMPLE_PATTERNS = [
  {
    name: 'Seamless',
    url: 'https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/patterns/Seamless.png'
  },
  {
    name: 'Mushrooms',
    url: 'https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/patterns/Mushrooms.png'
  },
  {
    name: 'Jolt Cola',
    url: 'https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/patterns/JoltCola.png'
  },
  {
    name: 'Beaver',
    url: 'https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/patterns/Beaver.png'
  },
  {
    name: 'Pinot Noir',
    url: 'https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/patterns/PinotNoir.png'
  },
  {
    name: 'Wu-Tang',
    url: 'https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/patterns/Wu-Tang.png'
  },
  {
    name: 'Sturdy',
    url: 'https://raw.githubusercontent.com/1gby/SeamlessByRudeboy/main/assets/patterns/sturdy.png'
  }
];

/* ==========================================================================
   MOCKUP IMAGE URLS
   ========================================================================== */

/**
 * URLs to mockup template images
 * These are loaded once when the app starts
 */
export const MOCKUP_URLS = {
  PHONE: 'https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/Mockups/iphone.png',
  IPAD: 'https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/Mockups/ipad.png',
  TOTE: 'https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/Mockups/tote.png',
  BANDANA: 'https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/Mockups/bandana.png',
  BEDSPREAD: 'https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/Mockups/bedspread.png',
  MUG: 'https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/Mockups/mug.png',
  BOTTLE: 'https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/Mockups/bottle.png',
  SWEATSHIRT: 'https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/Mockups/sweatshirt.png'
};

/* ==========================================================================
   EASTER EGG - MUSIC PLAYLIST
   ========================================================================== */

/**
 * Audio tracks for the Matrix easter egg
 * Plays random tracks when easter egg is activated
 */
export const PLAYLIST = [
  {
    title: 'Capone',
    artist: 'Hey Pluto',
    url: 'https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/secret%20stash/capone.mp3'
  },
  {
    title: 'Count',
    artist: 'Fonss',
    url: 'https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/secret%20stash/count.mp3'
  },
  {
    title: 'Falling Softly',
    artist: 'Richard Smithson',
    url: 'https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/secret%20stash/falling%20softly.mp3'
  },
  {
    title: 'Fluid',
    artist: 'Mountaineer',
    url: 'https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/secret%20stash/fluid.mp3'
  },
  {
    title: 'I Wanna Take Your Body Higher',
    artist: 'SkyGaze',
    url: 'https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/secret%20stash/i%20wanna%20take%20your%20body%20higher.mp3'
  },
  {
    title: 'Journey',
    artist: 'Tatami',
    url: 'https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/secret%20stash/journey.mp3'
  },
  {
    title: 'Moments',
    artist: 'Tatami',
    url: 'https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/secret%20stash/moments.mp3'
  },
  {
    title: 'Stardrive',
    artist: 'Simon Folwar',
    url: 'https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/secret%20stash/stardrive.mp3'
  },
  {
    title: 'Sunset In Junipero',
    artist: 'Bach',
    url: 'https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/secret%20stash/sunset%20in%20junipero.mp3'
  },
  {
    title: 'I Know',
    artist: 'Matrika',
    url: 'https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/secret%20stash/IKnow.mp3'
  },
  {
    title: 'Other Worlds',
    artist: 'Carpetman',
    url: 'https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/secret%20stash/OtherWorlds.mp3'
  },
  {
    title: 'Jaffa Days',
    artist: 'ToneBreak',
    url: 'https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/secret%20stash/JaffaDays.mp3'
  },
  {
    title: 'Baby Blue',
    artist: 'Action Bronson',
    url: 'https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/secret%20stash/BabyBlue.mp3'
  }
];

/**
 * Easter egg animation settings
 */
export const EASTER_EGG = {
  MESSAGE_INTERVAL: 30000,  // How often "CREATED BY RUDEBOY" appears (30 seconds)
  MATRIX_SPEED: 50,         // Milliseconds between matrix frames (lower = faster)
  MATRIX_SPEED_MESSAGE: 75, // Speed during message animation
  AUDIO_VOLUME: 0.5,        // Audio playback volume (0.0 to 1.0)
  FADE_IN_STEP: 0.05,       // Volume increase per step during fade in
  FADE_OUT_STEP: 0.05       // Volume decrease per step during fade out
};

/* ==========================================================================
   COLOR PALETTE EXTRACTION
   ========================================================================== */

/**
 * Settings for automatic color palette generation
 */
export const COLOR_PALETTE = {
  MAX_COLORS: 9,            // Maximum colors to extract from pattern
  SAMPLE_SIZE: 500,         // Max dimensions for sampling (faster processing)
  COLOR_BUCKET_SIZE: 10     // Group similar colors (RGB rounded to nearest 10)
};

/* ==========================================================================
   PATTERN QUALITY THRESHOLDS
   ========================================================================== */

/**
 * Thresholds for pattern quality assessment
 * Used to show quality badges (Excellent, Good, Low)
 */
export const QUALITY_THRESHOLDS = {
  EXCELLENT_MIN: 3000,  // Pixels - "Excellent" quality
  GOOD_MIN: 2000        // Pixels - "Good" quality (below = "Low")
};

/**
 * Contrast ratio thresholds
 * Used to assess pattern contrast levels
 */
export const CONTRAST_THRESHOLDS = {
  HIGH: 7,      // High contrast
  MEDIUM: 3     // Medium contrast (below = Low)
};

/* ==========================================================================
   LOCAL STORAGE KEYS
   ========================================================================== */

/**
 * Keys used for browser local storage
 * Allows patterns to persist between sessions
 */
export const STORAGE_KEYS = {
  SAVED_PATTERNS: 'rudeboy-patterns'  // Saved pattern data
};

/* ==========================================================================
   ASSET PATHS
   ========================================================================== */

/**
 * Paths to app assets
 */
export const ASSETS = {
  LOGO: 'https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/icons/icon.png',
  LOGO_NOVA: 'https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/icons/nova.png'
};

/* ==========================================================================
   PRINT-ON-DEMAND STORE LINKS
   ========================================================================== */

/**
 * Links to POD platforms where users can sell patterns
 * Organized by region
 */
export const POD_STORES = {
  EUROPE: [
    { name: 'Gelato 🇪🇺', url: 'https://www.gelato.com/' },
    { name: 'Contrado 🇪🇺', url: 'https://www.contrado.co.uk/' },
    { name: 'Saal Digital 🇪🇺', url: 'https://www.saal-digital.com/' },
    { name: 'Photobook Europe 🇪🇺', url: 'https://www.photobook-europe.com/' },
    { name: 'WhiteWall 🇪🇺', url: 'https://www.whitewall.com/' }
  ],
  USA: [
    { name: 'CanvasPeople 🇺🇸', url: 'https://www.canvaspeople.com/' },
    { name: 'CanvasChamp 🇺🇸', url: 'https://www.canvaschamp.com/' },
    { name: 'Mpix 🇺🇸', url: 'https://www.mpix.com/' },
    { name: 'Canvaspop 🇺🇸', url: 'https://www.canvaspop.com/' },
    { name: 'Canvas On Demand 🇺🇸', url: 'https://canvasondemand.com/' }
  ],
  CANADA: [
    { name: 'CanvasCanada.ca 🇨🇦', url: 'https://www.canvascanada.ca/' },
    { name: 'CanvasChamp.ca 🇨🇦', url: 'https://www.canvaschamp.ca/' },
    { name: 'BestCanvas.ca 🇨🇦', url: 'https://www.bestcanvas.ca/' },
    { name: 'Canvaspop 🇨🇦', url: 'https://www.canvaspop.com/' },
    { name: 'Posterjack 🇨🇦', url: 'https://posterjack.ca/' }
  ]
};