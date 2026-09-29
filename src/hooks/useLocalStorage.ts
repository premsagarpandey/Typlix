import { useState, useCallback, useEffect, useRef } from 'react';
import { secureStorage } from '../utils/secureStorage';

export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    return secureStorage.getItem<T>(key, initialValue);
  });

  const storedValueRef = useRef(storedValue);

  useEffect(() => {
    storedValueRef.current = storedValue;
  }, [storedValue]);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const nextValue = value instanceof Function ? value(storedValueRef.current) : value;
        secureStorage.setItem(key, nextValue);
        window.dispatchEvent(
          new CustomEvent('typlix_settings_changed', {
            detail: { key, value: nextValue },
          })
        );
        setStoredValue(nextValue);
      } catch (error) {
        console.error(`Error saving localStorage key "${key}":`, error);
      }
    },
    [key]
  );

  useEffect(() => {
    const handleSettingsChanged = (e: Event) => {
      const customEvent = e as CustomEvent<{ key: string; value: T }>;
      if (customEvent.detail && customEvent.detail.key === key) {
        setStoredValue(customEvent.detail.value);
      }
    };

    const handleProgressUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<{ key?: string; value?: unknown; typingGameLevel?: number }>;
      if (key === 'typingGameLevel' && typeof customEvent.detail?.typingGameLevel === 'number') {
        setStoredValue(customEvent.detail.typingGameLevel as T);
      } else if (customEvent.detail?.key === key) {
        setStoredValue(customEvent.detail.value as T);
      }
    };

    window.addEventListener('typlix_settings_changed', handleSettingsChanged);
    window.addEventListener('typlix_progress_updated', handleProgressUpdated);
    return () => {
      window.removeEventListener('typlix_settings_changed', handleSettingsChanged);
      window.removeEventListener('typlix_progress_updated', handleProgressUpdated);
    };
  }, [key]);

  return [storedValue, setValue] as const;
}

