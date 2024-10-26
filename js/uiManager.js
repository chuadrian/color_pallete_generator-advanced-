class UIManager {
  constructor() {
    this.paletteContainer = document.querySelector('.palette-container');
    this.savedPalettesContainer = document.querySelector('.saved-palettes-container');
    this.currentFormat = 'hex';
    this.lockedColors = [];
    this.bindEvents();
    this.loadSavedPalettes();
  }

  createColorBox(color, index) {
    const colorBox = document.createElement('div');
    colorBox.className = 'color-box';
    colorBox.style.backgroundColor = color;
    
    const colorCode = document.createElement('span');
    colorCode.className = 'color-code';
    colorCode.textContent = ColorConverter.formatColor(color, this.currentFormat);
    
    const lockButton = document.createElement('button');
    lockButton.className = 'lock-button';
    lockButton.textContent = this.lockedColors[index] ? '🔒' : '🔓';
    lockButton.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggleLock(index, color);
      lockButton.textContent = this.lockedColors[index] ? '🔒' : '🔓';
    });
    
    colorBox.appendChild(colorCode);
    colorBox.appendChild(lockButton);
    
    colorBox.addEventListener('click', async () => {
      const copied = await utils.copyToClipboard(colorCode.textContent);
      if (copied) {
        utils.showToast();
      }
    });

    return colorBox;
  }

  toggleLock(index, color) {
    this.lockedColors[index] = this.lockedColors[index] ? null : color;
  }

  updatePalette(colors) {
    this.paletteContainer.innerHTML = '';
    colors.forEach((color, index) => {
      const colorBox = this.createColorBox(color, index);
      this.paletteContainer.appendChild(colorBox);
    });
  }

  savePalette(colors) {
    const savedPalettes = JSON.parse(localStorage.getItem('savedPalettes') || '[]');
    savedPalettes.push(colors);
    localStorage.setItem('savedPalettes', JSON.stringify(savedPalettes));
    this.updateSavedPalettes();
  }

  loadSavedPalettes() {
    const savedPalettes = JSON.parse(localStorage.getItem('savedPalettes') || '[]');
    this.updateSavedPalettes(savedPalettes);
  }

  updateSavedPalettes() {
    const savedPalettes = JSON.parse(localStorage.getItem('savedPalettes') || '[]');
    this.savedPalettesContainer.innerHTML = '';
    
    savedPalettes.forEach((palette, paletteIndex) => {
      const paletteElement = document.createElement('div');
      paletteElement.className = 'saved-palette';
      
      palette.forEach(color => {
        const miniColor = document.createElement('div');
        miniColor.className = 'mini-color';
        miniColor.style.backgroundColor = color;
        paletteElement.appendChild(miniColor);
      });

      const deleteButton = document.createElement('button');
      deleteButton.className = 'delete-palette';
      deleteButton.textContent = '×';
      deleteButton.addEventListener('click', () => this.deletePalette(paletteIndex));
      
      paletteElement.appendChild(deleteButton);
      this.savedPalettesContainer.appendChild(paletteElement);
    });
  }

  deletePalette(index) {
    const savedPalettes = JSON.parse(localStorage.getItem('savedPalettes') || '[]');
    savedPalettes.splice(index, 1);
    localStorage.setItem('savedPalettes', JSON.stringify(savedPalettes));
    this.updateSavedPalettes();
  }

  bindEvents() {
    const generateButton = document.querySelector('#generate');
    const saveButton = document.querySelector('#save');
    const paletteSizeInput = document.querySelector('#paletteSize');
    const lockModeSelect = document.querySelector('#lockMode');
    const formatButtons = document.querySelectorAll('.format-options button');

    generateButton.addEventListener('click', () => {
      const count = parseInt(paletteSizeInput.value);
      const mode = lockModeSelect.value;
      const newColors = ColorGenerator.generatePalette(count, mode, this.lockedColors);
      this.updatePalette(newColors);
    });

    saveButton.addEventListener('click', () => {
      const colors = Array.from(this.paletteContainer.children)
        .map(box => box.style.backgroundColor);
      this.savePalette(colors);
    });

    formatButtons.forEach(button => {
      button.addEventListener('click', () => {
        formatButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        this.currentFormat = button.dataset.format;
        
        // Update all color codes to new format
        const colorBoxes = this.paletteContainer.querySelectorAll('.color-box');
        colorBoxes.forEach(box => {
          const colorCode = box.querySelector('.color-code');
          const color = box.style.backgroundColor;
          colorCode.textContent = ColorConverter.formatColor(color, this.currentFormat);
        });
      });
    });
  }
}
