// Simple storage utility using localStorage
export const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? { value: item } : null;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, value);
      return { success: true };
    } catch (error) {
      console.error('Storage set error:', error);
      return { success: false };
    }
  },
  
  delete: (key) => {
    try {
      localStorage.removeItem(key);
      return { success: true };
    } catch (error) {
      console.error('Storage delete error:', error);
      return { success: false };
    }
  },
  
  list: (prefix) => {
    try {
      const keys = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key.startsWith(prefix)) {
          keys.push(key);
        }
      }
      return { keys };
    } catch (error) {
      console.error('Storage list error:', error);
      return { keys: [] };
    }
  }
};