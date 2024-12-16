/**
 * debounce.ts
 * Utility to debounce function calls, delaying execution until after the specified time
 * has elapsed since the last invocation.
 *
 * @param func - The function to debounce.
 * @param delay - Delay in milliseconds to wait before invoking the function.
 * @returns A debounced version of the input function.
 */
export function debounce<T extends (...args: any[]) => void>(func: T, delay: number): (...args: Parameters<T>) => void {
    let timerId: ReturnType<typeof setTimeout>;
  
    return (...args: Parameters<T>) => {
      if (timerId) {
        clearTimeout(timerId);
      }
  
      timerId = setTimeout(() => {
        func(...args);
      }, delay);
    };
  }
  