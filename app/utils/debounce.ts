function debounce<T extends unknown[]>(fn: (...args: T) => void, timeout: number) {
  let timer: number;
  return function (...args: T) {
    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      fn(...args);
    }, timeout);
  };
}

export default debounce;
