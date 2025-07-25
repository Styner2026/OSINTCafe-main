import { useCallback } from 'react';

/**
 * Performance optimization utility for OSINT Café application
 * This file contains utility functions to improve page load times
 * and navigation performance between pages.
 */

/**
 * Creates a deferred loader for heavy resources like iframes and images
 * @param loadingDelay - Optional delay in ms before loading content
 * @returns Object with loading state and load trigger function
 */
export const useDeferredLoading = (loadingDelay = 0) => {
  const load = useCallback(() => {
    if (loadingDelay > 0) {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, loadingDelay);
      });
    }
    return Promise.resolve();
  }, [loadingDelay]);

  return { load };
};

/**
 * Reduces the frequency of state updates for input fields to improve performance
 * @param value - Current value
 * @param setValue - State setter function
 * @param delay - Debounce delay in ms
 * @returns Debounced update handler
 */
export const useDebounceInput = <T,>(
  setValue: (value: T) => void,
  delay = 300
) => {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return useCallback((newValue: T) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      setValue(newValue);
      timeoutId = null;
    }, delay);
  }, [setValue, delay]);
};

/**
 * Prefetches route data and resources to improve navigation speed
 * @param routes - Array of routes to prefetch
 */
export const prefetchRoutes = (routes: string[]) => {
  // Implementation would depend on your routing library and data fetching strategy
  // This is a placeholder for the concept
  routes.forEach(route => {
    // Create a link prefetch tag for each route
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    link.as = 'document';
    document.head.appendChild(link);
  });
};

/**
 * Optimizes API calls by batching multiple requests
 * @param apiCalls - Array of API call functions
 * @returns Promise with all results
 */
export const batchApiCalls = async <T,>(apiCalls: Array<() => Promise<T>>) => {
  return Promise.all(apiCalls.map(call => call()));
};

export default {
  useDeferredLoading,
  useDebounceInput,
  prefetchRoutes,
  batchApiCalls
};
