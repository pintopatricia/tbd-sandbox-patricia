import { EnvironmentJSON } from "@ppb/tbd-store";
import { ClientContext } from "./client-context";

type Channels = "IOS" | "ANDROID" | "WEB_MOBILE" | "WEB_DESKTOP" | "WRAPPER_DESKTOP";

type AppIdentifiers = {
  product: string;
  productId: string;
  appKey: string;
  cbsChannel: string;
  channel: Channels;
};

export function getAppIdentifier(clientContext: ClientContext, environment: EnvironmentJSON): AppIdentifiers {
  if (!environment.APP_IDENTIFIERS) {
    throw new Error("Missing APP_IDENTIFIERS in environment config");
  }

  const rules: { cond: () => boolean; key: Channels }[] = [
    {
      cond() {
        return !!environment.APP_IDENTIFIERS.WRAPPER_DESKTOP && clientContext.wrapper?.wrapperName === "DesktopWrapper";
      },
      key: "WRAPPER_DESKTOP",
    },
    {
      cond() {
        return clientContext.wrapper?.wrapperName === "GamingWrapper" && clientContext.platform === "ios";
      },
      key: "IOS",
    },
    {
      cond() {
        return clientContext.wrapper?.wrapperName === "GamingWrapper" && clientContext.platform === "android";
      },
      key: "ANDROID",
    },
    {
      cond() {
        return !clientContext.wrapper?.wrapperName && clientContext.uiVariant === "desktop";
      },
      key: "WEB_DESKTOP",
    },
    {
      cond() {
        return !clientContext.wrapper?.wrapperName && clientContext.uiVariant === "mobile";
      },
      key: "WEB_MOBILE",
    },
  ];

  const match = rules.find((r) => r.cond());
  if (!match) {
    throw new Error("Could not determine app identifier");
  }

  const entry = environment.APP_IDENTIFIERS[match.key];
  if (!entry) {
    throw new Error(`Missing ${match.key} entry in APP_IDENTIFIERS`);
  }

  return {
    product: entry.product,
    productId: entry.product_id,
    appKey: entry.app_key,
    cbsChannel: entry.cbs_channel,
    channel: match.key,
  };
}
