let isOnline = true; // Internal state for internet status
let statusChangeCallback: ((status: boolean) => void) | null = null; // Callback for status changes

/**
 * Updates the internet status.
 * @param status - A boolean indicating whether the internet is online.
 */
export function setInternetStatus(status: boolean): void {
  if (typeof status !== "boolean") {
    throw new Error("Status must be a boolean value.");
  }
  isOnline = status;

  if (statusChangeCallback) {
    statusChangeCallback(isOnline);
  }
}

/**
 * Retrieves the current internet status.
 * @returns A boolean indicating whether the internet is online.
 */
export function getInternetStatus(): boolean {
  return isOnline;
}

/**
 * Registers a callback function to be executed when the internet status changes.
 * @param callback - A function that receives the updated internet status as a parameter.
 */
export function onInternetStatusChange(callback: (status: boolean) => void): void {
  if (typeof callback !== "function") {
    throw new Error("Callback must be a function.");
  }
  statusChangeCallback = callback;
}
