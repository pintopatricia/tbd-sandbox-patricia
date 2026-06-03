import CookieManager from "@react-native-cookies/cookies";
import { buildBaseCookieTemplates } from "./template.native";
import { CookieWriter } from "./env-cookies.types";

const clear = async () => {
  try {
    return await CookieManager.clearAll();
  } catch (error) {
    console.error("Error clearing cookies", error);

    return false;
  }
};

const writer = (domains: string[]): CookieWriter => {
  const cookieTemplates = buildBaseCookieTemplates(domains);

  return {
    set: async (records) => {
      try {
        const cookiesToSet = Array.from(records.entries())
          .map(([name, value]) => cookieTemplates.map((template) => ({ ...template, name, value })))
          .flat();

        const setOp = await Promise.all(
          cookiesToSet.map(async (cookie) => {
            const { url, ...cookieRest } = cookie;

            return CookieManager.set(url, cookieRest);
          }),
        );

        return setOp.every((success) => !!success);
      } catch (error) {
        console.error("Error setting configured cookies", error);

        return false;
      }
    },
    clear,
  };
};

export { writer };
