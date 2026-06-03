type Listener = () => void;

let initialised = false;
const listeners = new Set<Listener>();

export const setCetInitialised = (): void => {
  initialised = true;
  listeners.forEach((cb) => cb());
  listeners.clear();
};

export const onCetInitialised = (listener: Listener): (() => void) => {
  if (initialised) {
    listener();
    return () => {};
  }
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

// Exposed for testing purposes only
export const resetCetInitState = (): void => {
  initialised = false;
  listeners.clear();
};
