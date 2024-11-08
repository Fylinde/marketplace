import { useEffect, useState } from "react";
import { debounce } from "lodash";

// Define the types
interface WindowSize {
  width: number;
}

// Use TypeScript types in the hook
const useWindowSize = (): WindowSize => {
  // Check if window is available (to support SSR environments)
  const isClient = typeof window !== "undefined";

  const [width, setWidth] = useState<number>(isClient ? window.innerWidth : 0);

  useEffect(() => {
    if (isClient) {
      const debouncedResizeListener = debounce(() => {
        setWidth(window.innerWidth);
      }, 250);

      // Add event listener for window resize
      window.addEventListener("resize", debouncedResizeListener);
      debouncedResizeListener(); // Call the listener initially to set the correct width

      // Cleanup function to remove the event listener
      return () => window.removeEventListener("resize", debouncedResizeListener);
    }
  }, [isClient]);

  return { width }; // Return an object with width
};

export default useWindowSize;
