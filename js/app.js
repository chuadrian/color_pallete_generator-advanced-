document.addEventListener('DOMContentLoaded', () => {
  const ui = new UIManager();
  const initialColors = ColorGenerator.generatePalette();
  ui.updatePalette(initialColors);
});
