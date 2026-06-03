let APP_KEY: string;

export function setApplicationKey(newAppKey: string): void {
  APP_KEY = newAppKey;
}

export function getApplicationKey(): string {
  if (!APP_KEY) {
    throw new Error("No application key available");
  }

  return APP_KEY;
}
