export type RequestContext = {
  sessionId: number;
  userAgent: string;
  appKey: string;
  host: string | undefined;
  visitorId: string | undefined;
  localeCode: string | undefined;
};
