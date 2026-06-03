export type CookieWriter = {
  set: (records: Map<string, string>) => Promise<boolean>;
  clear: () => Promise<boolean>;
};
export type CookieWriterFactory = (domains: string[]) => CookieWriter;
