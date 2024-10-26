class ColorGenerator {
    static generateHex() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
    }
  
    static adjustHue(hsl, amount) {
      let newHue = (hsl.h + amount) % 360;
      if (newHue < 0) newHue += 360;
      return `hsl(${newHue}, ${hsl.s}%, ${hsl.l}%)`;
    }
  
    static generatePaletteWithMode(baseColor, count, mode) {
      const rgb = ColorConverter.hexToRgb(baseColor);
      const hsl = ColorConverter.rgbToHsl(rgb.r, rgb.g, rgb.b);
      const colors = [baseColor];
  
      switch (mode) {
        case 'analogous':
          for (let i = 1; i < count; i++) {
            colors.push(this.adjustHue(hsl, i * 30));
          }
          break;
        case 'monochromatic':
          for (let i = 1; i < count; i++) {
            const lightness = Math.max(20, Math.min(80, hsl.l + (i * 15 - 30)));
            colors.push(`hsl(${hsl.h}, ${hsl.s}%, ${lightness}%)`);
          }
          break;
        case 'complementary':
          colors.push(this.adjustHue(hsl, 180));
          while (colors.length < count) {
            colors.push(this.generateHex());
          }
          break;
        default:
          while (colors.length < count) {
            colors.push(this.generateHex());
          }
      }
  
      return colors;
    }
  
    static generatePalette(count = 5, mode = 'none', lockedColors = []) {
      if (mode === 'none') {
        return Array.from({ length: count }, (_, i) => 
          lockedColors[i] || this.generateHex()
        );
      }
  
      const baseColor = lockedColors[0] || this.generateHex();
      return this.generatePaletteWithMode(baseColor, count, mode);
    }
  }
