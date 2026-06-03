export type CookieOptions = {
  domain?: string;
  encode?: (val: string) => string;
  expires?: Date;
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  secure?: boolean;
  signed?: boolean;
  sameSite?: boolean;
};

export type Cookie = {
  name: string;
  value: string;
  options?: CookieOptions;
};

export type CookieService = {
  getCookie(name: string): string | undefined;
  clearCookie(name: string): void;
  setCookie(name: string, value: string, options?: CookieOptions): boolean;
};
