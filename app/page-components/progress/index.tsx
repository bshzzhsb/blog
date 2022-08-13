import { useEffect, useRef, useState } from 'react';
import { useLocation, useTransition } from '@remix-run/react';

const Progress: React.FC = () => {
  const [progress, setProgress] = useState(0);
  const transition = useTransition();
  const location = useLocation();
  const timer = useRef<number>();

  useEffect(() => {
    const { state, location: toLocation } = transition;
    // exclude in page routing
    if (location.pathname !== toLocation?.pathname) {
      if (state === 'loading') {
        window.clearInterval(timer.current);
        setProgress(10);
        timer.current = window.setInterval(() => {
          setProgress((pre) => {
            if (pre < 90) {
              return pre + 5;
            } else {
              window.clearInterval(timer.current);
              return 90;
            }
          });
        }, 500);
      } else if (state === 'idle' && timer.current !== 0) {
        // when state to 'idle', toLocation will be undefined
        // timer.current is 0 means there is none transition
        setProgress(100);
        window.clearInterval(timer.current);
        timer.current = 0;
        setTimeout(() => {
          setProgress(0);
        }, 200);
      }
    }
  }, [location, transition]);

  return (
    <div
      style={{
        transform: `translate3d(-${100 - progress}%, 0, 0)`,
        transition: progress === 0 ? undefined : 'transform 0.2s ',
      }}
      className="progress fixed top-0 w-full h-0.5 bg-orange-400 z-[1000]"
    />
  );
};

export default Progress;
