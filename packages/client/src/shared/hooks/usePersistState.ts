import { useEffect, useState } from 'react';

export function usePersistState<T>(
  key: string,
  initialState: T,
): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    const persistedState = localStorage.getItem(key);
    return persistedState ? JSON.parse(persistedState) : initialState;
  });

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem(key, JSON.stringify(state));
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [key, state]);

  return [state, setState];
}
