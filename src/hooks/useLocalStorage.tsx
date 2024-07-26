import { useState, useEffect } from 'react';

function useLocalStorage<T>(key: string, initialValue: T) {
  // Retrieve the stored value from localStorage
  const getStoredValue = () => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error('Error reading localStorage key “' + key + '”: ', error);
      return initialValue;
    }
  };

  // Initialize state with the stored value
  const [storedValue, setStoredValue] = useState<T>(getStoredValue);

  // Update localStorage whenever the state changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(storedValue));
    } catch (error) {
      console.error('Error setting localStorage key “' + key + '”: ', error);
    }
  }, [key, storedValue]);

  // Return the state and a function to update it
  const setValue = (value: T | ((val: T) => T)) => {
    setStoredValue((prevValue) => {
      return value instanceof Function ? value(prevValue) : value;
    });
  };

  return [storedValue, setValue] as const;
}

export default useLocalStorage;
