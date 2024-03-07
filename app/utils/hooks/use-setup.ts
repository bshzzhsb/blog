import { useEffect, useRef } from 'react';

export const useSetup = <T>(setup: () => T, cleanup?: (value?: T) => void) => {
  const ref = useRef<T | undefined>(undefined);
  const cleanupRef = useRef(cleanup);

  if (ref.current === undefined) {
    ref.current = setup();
  }

  useEffect(() => {
    const cleanup = cleanupRef.current;

    return () => {
      cleanup?.(ref.current);
      ref.current = undefined;
    };
  }, []);

  return ref.current;
};
