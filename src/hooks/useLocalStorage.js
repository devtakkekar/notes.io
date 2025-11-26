import { useEffect, useState } from 'react';

const safeParse = (value, fallback) => {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const useLocalStorage = (key, defaultValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') return defaultValue;
    const value = window.localStorage.getItem(key);
    return value !== null ? safeParse(value, defaultValue) : defaultValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(storedValue));
  }, [key, storedValue]);

  return [storedValue, setStoredValue];
};

export default useLocalStorage;

