import { useEffect, useState } from 'react';

/**
 * Hook to track scroll progress from 0 (top) to 1 (bottom)
 * Used to drive 3D scene transformations based on scroll position
 */
export function useScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;

      // Calculate progress as a value between 0 and 1
      const progress = scrollTop / (documentHeight - windowHeight);
      setScrollProgress(Math.max(0, Math.min(1, progress)));
    };

    // Initial calculation
    handleScroll();

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return scrollProgress;
}
