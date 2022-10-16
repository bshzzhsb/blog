import { useEffect, useRef } from 'react';

export const useSetup = <T>(setup: () => T, cleanup?: (value?: T) => void) => {
  const ref = useRef<T | undefined>(undefined);

  if (ref.current === undefined) {
    ref.current = setup();
  }

  useEffect(() => {
    return () => {
      cleanup?.(ref.current);
    };
  }, []);

  return ref.current;
};
