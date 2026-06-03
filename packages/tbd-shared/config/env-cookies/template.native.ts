import { Cookie } from "@react-native-cookies/cookies";

type CookieTemplate = Pick<Cookie, "domain" | "secure" | "expires"> & { url: string };

export const buildBaseCookieTemplates = (domains: string[]): CookieTemplate[] => {
  const expires = new Date();

  expires.setFullYear(expires.getFullYear() + 1);

  return domains.map((domain: string) => ({
    url: domain.startsWith(".") ? `https://www${domain}` : `https://${domain}`,
    domain,
    secure: true,
    expires: expires.toISOString(),
  }));
};
