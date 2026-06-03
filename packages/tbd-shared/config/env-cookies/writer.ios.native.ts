import CookieManager from "@react-native-cookies/cookies";
import { buildBaseCookieTemplates } from "./template.native";
import { CookieWriter } from "./env-cookies.types";

const clear = async () => {
  try {
    const clearOp = await Promise.all([CookieManager.clearAll(), CookieManager.clearAll(true)]);

    return clearOp.every((success) => !!success);
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

            return Promise.all([CookieManager.set(url, cookieRest), CookieManager.set(url, cookieRest, true)]);
          }),
        );

        return setOp.flat().every((success) => !!success);
      } catch (error) {
        console.error("Error setting configured cookies", error);

        return false;
      }
    },
    clear,
  };
};

export { writer };
