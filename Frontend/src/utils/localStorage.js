/**
 * Set item to localStorage with optional expiration (in ms).
 * If value is undefined or null, the item is removed.
 * @param {string} key - The key to store the value under
 * @param {*} value - The value to store
 * @param {number|null} ttl - Time to live in milliseconds (optional)
 */
export const setToLocalStorage = (key, value, ttl = null) => {
  if (
    value === undefined ||
    value === null ||
    typeof value === 'function' ||
    (typeof value === 'object' && value !== null && typeof value.toJSON !== 'function' && !Array.isArray(value))
  ) {
    console.warn(`Invalid value passed to setToLocalStorage for key: ${key}`, value);
    localStorage.removeItem(key);
    return;
  }
  
  const item = {
    value,
    expiresAt: ttl ? Date.now() + ttl : null,
  };
  
  // ✅ Add debug log
  console.log('Saving to localStorage:', key, item);
  
  // ✅ Optional safety net
  try {
    localStorage.setItem(key, JSON.stringify(item));
  } catch (err) {
    console.error(`Failed to save ${key} in localStorage:`, err, item);
  }
};

/**
 * Get item from localStorage and parse it safely.
 * If item is expired or invalid, return null.
 * @param {string} key - The key to retrieve
 * @returns {*} The stored value or null if not found/expired
 */
export const getFromLocalStorage = (key) => {
  try {
    const item = localStorage.getItem(key);
    
    if (!item || item === 'undefined') {
      return null;
    }
    
    const parsed = JSON.parse(item);
    
    if (parsed?.expiresAt && Date.now() > parsed.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }
    
    return parsed.value ?? null;
  } catch (error) {
    console.error(`Error getting item '${key}' from localStorage:`, error);
    return null;
  }
};

/**
 * Remove a value from localStorage
 * @param {string} key - The key to remove
 */
export const removeFromLocalStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing "${key}" from localStorage:`, error);
  }
};

/**
 * Clear all values from localStorage
 */
export const clearLocalStorage = () => {
  try {
    localStorage.clear();
  } catch (error) {
    console.error('Error clearing localStorage:', error);
  }
};