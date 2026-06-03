import { ExternalLink } from "@ppb/tbd-store";

import { getExternalLinks } from "../config/endpoints";

const DEFAULT_JURISDICTION = "INTERNATIONAL";
const DEFAULT_LOCALE_CODE = "default";

export const getExternalLink = (
  externalLinkType: ExternalLink,
  jurisdiction = DEFAULT_JURISDICTION,
  localeCode = DEFAULT_LOCALE_CODE,
): string => {
  const externalLink = getExternalLinks()?.[externalLinkType];

  if (!externalLink) {
    return "";
  }

  return (
    externalLink[jurisdiction]?.[localeCode] ??
    externalLink[jurisdiction]?.[DEFAULT_LOCALE_CODE] ??
    externalLink[DEFAULT_JURISDICTION]?.[localeCode] ??
    externalLink[DEFAULT_JURISDICTION]?.[DEFAULT_LOCALE_CODE] ??
    ""
  );
};
