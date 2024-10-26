const utils = {
    copyToClipboard: async (text) => {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (err) {
        console.error('Failed to copy:', err);
        return false;
      }
    },
  
    showToast: (duration = 2000) => {
      const toast = document.querySelector('.copied-toast');
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, duration);
    }
  };
