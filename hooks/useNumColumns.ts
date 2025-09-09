import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

// Simple responsive columns hook to avoid external breakpoint hooks that may
// use useInsertionEffect under React 19. Tune thresholds as needed.
export function useNumColumns() {
  const { width } = useWindowDimensions();

  const columns = useMemo(() => {
    // Tailor these breakpoints for your target devices
    if (width >= 1200) return 5; // xl
    if (width >= 992) return 4;  // lg
    if (width >= 768) return 3;  // md
    return 2;                    // default
  }, [width]);

  return columns;
}
