import { URL } from "url";
import { buildSetCookieInstructions } from "@ppb/affiliates-tracking";
import { CookieOptions } from "./@types/CookieService";

export default (url: URL, domain: string, refererRFRValue: string | null) => {
  const setCookieInstructions = buildSetCookieInstructions(url, domain, {
    overrideRfrPartnerId: refererRFRValue || undefined,
  });

  const cookieInstructions = setCookieInstructions.map(
    ({
      name,
      value,
      attributes,
    }): {
      name: string;
      value: string;
      options: CookieOptions;
    } => {
      const cookieOptions: CookieOptions = {
        domain: attributes.domain,
      };

      if (attributes.expires) {
        cookieOptions.expires = new Date(attributes.expires);
      }

      return { name, value, options: cookieOptions };
    },
  );

  return cookieInstructions;
};
