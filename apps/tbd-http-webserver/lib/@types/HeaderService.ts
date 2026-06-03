export type Header = {
  name: string;
  value: string;
};

export type HeaderService = {
  getHeader(name: string): string;
  removeHeader(name: string): void;
  setHeader(name: string, value: string): boolean;
};
