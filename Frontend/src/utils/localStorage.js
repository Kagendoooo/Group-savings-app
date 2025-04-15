// Set item to localStorage with optional expiration (in ms).
// If value is undefined or null, the item is removed.
export const setToLocalStorage = (key, value, ttl = null) => {
  if (value === undefined || value === null) {
    localStorage.removeItem(key);
  } else {
    const item = {
      value,
      expiresAt: ttl ? Date.now() + ttl : null,
    };
    localStorage.setItem(key, JSON.stringify(item));
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