import { useEffect } from "react";

export function useDebugScreen() {
  useEffect(() => {
    function handleResize() {
      const width = window.innerWidth;
      let category = "Desktop";

      if (width <= 640) {
        category = "Mobile (2 Cols)";
      } else if (width <= 768) {
        category = "Tablet/Large Phone (3 Cols)";
      }

      console.log(`[DEBUG] Width: ${width}px | Mode: ${category}`);
    }

    //Call once on mount to show initial state
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
}
