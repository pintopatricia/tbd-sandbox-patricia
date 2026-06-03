export type Log = {
  error(...args: any[]): void;
  info(...args: any[]): void;
  warn(...args: any[]): void;
};
