// Set item to localStorage with optional expiration (in ms).
// If value is undefined or null, the item is removed.
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


// Get item from localStorage and parse it safely.
// If item is expired or invalid, return null.
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