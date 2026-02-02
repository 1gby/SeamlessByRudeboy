/* ============================================================================
MAIN.JS - Application Initialization & Coordination

This is the entry point that initializes all modules in the correct order.

Module initialization order:

1. Canvas (core drawing engine)
1. Mockups (load mockup images)
1. UI (set up all controls and listeners)
1. Tools (calculator, color palette, saved patterns)
1. Easter Egg (Matrix effect and music)
   ============================================================================ */

/**

- Loading overlay state
  */
  let loadStartTime = 0;
  let isReload = false;
  const MIN_LOAD_TIME = 1500;
  const RELOAD_MIN_TIME = 1500;

/**

- Show loading overlay
  */
  function showLoading(reload = false) {
  isReload = reload;
  loadStartTime = Date.now();
  document.getElementById(‘loadingOverlay’).classList.add(‘visible’);
  }

/**

- Hide loading overlay
  */
  function hideLoading() {
  const elapsed = Date.now() - loadStartTime;
  const remaining = Math.max(0, (isReload ? RELOAD_MIN_TIME : MIN_LOAD_TIME) - elapsed);
  setTimeout(() => {
  document.getElementById(‘loadingOverlay’).classList.remove(‘visible’);
  }, remaining);
  }

/**

- Initialize the application
- Called when DOM is ready
  */
  function init() {
  // Initialize canvas first (core functionality)
  initCanvas();

// Load mockup images (async, non-blocking)
loadMockupImages();

// Initialize UI controls and event listeners
initUI();

// Initialize tools (color palette, calculator, saved patterns)
initTools();

// Initialize easter egg
initEasterEgg();

// Set up logo reload functionality
setupLogoReload();
}

/**

- Set up logo click to reload page
  */
  function setupLogoReload() {
  const logo = document.getElementById(‘logo’);

logo.addEventListener(‘click’, () => {
showLoading(true);
setTimeout(() => location.reload(), 2800);
});
}

/**

- Start the app when DOM is ready
  */
  document.addEventListener(‘DOMContentLoaded’, init);