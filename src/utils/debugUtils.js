import {useRef, useEffect} from 'react';

/**
 * Tracks component re-renders and logs them in the console.
 * @param {string} componentName - Name of the component for logging.
 */
export const useRenderTracker = componentName => {
  const renderCount = useRef(0);

  useEffect(() => {
    renderCount.current += 1;
    if (renderCount.current > 1) {
      console.log(`${componentName} rendered ${renderCount.current} times`);
    }
  });
};
