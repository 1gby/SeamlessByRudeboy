/* ============================================================================
MOCKUPS.JS - Mockup Image Loading

This file handles loading all mockup images (phone, tote, mug, etc.)
Images are loaded once at startup and stored in memory
============================================================================ */

/**

- Mockup images storage
  */
  const mockupImages = {
  phone: null,
  bottle: null,
  tote: null,
  bandana: null,
  bedspread: null,
  ipad: null,
  mug: null,
  sweatshirt: null
  };

/**

- Load all mockup images
  */
  function loadMockupImages() {
  const images = [
  { key: ‘phone’, url: ‘https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/Mockups/iphone.png’ },
  { key: ‘bottle’, url: ‘https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/Mockups/bottle.png’ },
  { key: ‘tote’, url: ‘https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/Mockups/tote.png’ },
  { key: ‘bandana’, url: ‘https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/Mockups/bandana.png’ },
  { key: ‘bedspread’, url: ‘https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/Mockups/bedspread.png’ },
  { key: ‘ipad’, url: ‘https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/Mockups/ipad.png’ },
  { key: ‘mug’, url: ‘https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/Mockups/mug.png’ },
  { key: ‘sweatshirt’, url: ‘https://raw.githubusercontent.com/1gby/seamless-checker/main/assets/Mockups/sweatshirt.png’ }
  ];

images.forEach(({ key, url }) => {
const img = new Image();
img.crossOrigin = ‘anonymous’;
img.src = url;
img.onload = () => {
mockupImages[key] = img;
if (canvasState.tileImage) drawCanvas();
};
img.onerror = () => console.error(`${key} mockup failed to load`);
});
}