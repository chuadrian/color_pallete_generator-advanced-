class ColorConverter {
    static hexToRgb(hex) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
      } : null;
    }
  
    static rgbToHsl(r, g, b) {
      r /= 255;
      g /= 255;
      b /= 255;
  
      const max = Math.max(r, g, b);
      const min = Math.min(r, g, b);
      let h, s, l = (max + min) / 2;
  
      if (max === min) {
        h = s = 0;
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  
        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break;
          case g: h = (b - r) / d + 2; break;
          case b: h = (r - g) / d + 4; break;
        }
  
        h /= 6;
      }
  
      return {
        h: Math.round(h * 360),
        s: Math.round(s * 100),
        l: Math.round(l * 100)
      };
    }
  
    static formatColor(color, format) {
      const rgb = this.hexToRgb(color);
      if (!rgb) return color;
  
      switch (format) {
        case 'hex':
          return color.toUpperCase();
        case 'rgb':
          return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
        case 'hsl':
          const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);
          return `hsl(${hsl.h}°, ${hsl.s}%, ${hsl.l}%)`;
        default:
          return color;
      }
    }
  }
