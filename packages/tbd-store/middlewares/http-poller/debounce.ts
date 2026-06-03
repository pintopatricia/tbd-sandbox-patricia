export default function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number,
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | undefined;

  return function debounced(...args: Parameters<T>) {
    // Clear the previous timeout if there is one
    if (timeoutId) clearTimeout(timeoutId);

    // Set a new timeout to call the function after the delay
    timeoutId = setTimeout(() => {
      func(...args);
    }, delay);
  };
}
