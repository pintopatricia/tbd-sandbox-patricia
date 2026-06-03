type NullablePick<T, R extends keyof T> = {
  [K in keyof Pick<T, R>]: T[K] | null;
};

export type StorageModule<T extends Record<string, any>> = {
  getItem: <R extends keyof T>(keyName: R) => Promise<T[R]>;
  multiGet: <R extends keyof T>(keyNames: R[]) => Promise<NullablePick<T, R>>;
  setItem: <R extends keyof T>(keyName: R, keyValue: T[R] | Record<string, never>) => Promise<void>;
  removeItem: <R extends keyof T>(keyName: R) => Promise<void>;
  clear: () => Promise<void>;
};
