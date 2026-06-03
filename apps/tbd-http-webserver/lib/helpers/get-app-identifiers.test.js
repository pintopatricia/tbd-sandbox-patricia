import { getAppIdentifier } from "./get-app-identifiers";

const baseEnvironment = {
  APP_IDENTIFIERS: {
    IOS: {
      product: "sportsbook",
      product_id: "230",
      app_key: "iosKey",
      cbs_channel: "PokerStars Wrapper IOS",
    },
    ANDROID: {
      product: "sportsbook",
      product_id: "240",
      app_key: "androidKey",
      cbs_channel: "PokerStars Wrapper Android",
    },
    WEB_MOBILE: {
      product: "sportsbook",
      product_id: "200",
      app_key: "webMobileKey",
      cbs_channel: "PokerStars Web Mobile",
    },
    WEB_DESKTOP: {
      product: "sportsbook",
      product_id: "99",
      app_key: "webDesktopKey",
      cbs_channel: "PokerStars Web Desktop",
    },
    WRAPPER_DESKTOP: {
      product: "sportsbook",
      product_id: "250",
      app_key: "wrapperDesktopKey",
      cbs_channel: "PokerStars Wrapper Desktop",
    },
  },
};

describe("getAppIdentifier", () => {
  it("returns WEB_MOBILE identifiers when uiVariant is mobile and no wrapper", () => {
    const ctx = { uiVariant: "mobile", platform: "web", wrapper: null };

    const result = getAppIdentifier(ctx, baseEnvironment);

    expect(result).toEqual({
      product: "sportsbook",
      productId: "200",
      appKey: "webMobileKey",
      cbsChannel: "PokerStars Web Mobile",
      channel: "WEB_MOBILE",
    });
  });

  it("returns WEB_DESKTOP identifiers when uiVariant is desktop and no wrapper", () => {
    const ctx = { uiVariant: "desktop", platform: "web", wrapper: null };

    const result = getAppIdentifier(ctx, baseEnvironment);

    expect(result).toEqual({
      product: "sportsbook",
      productId: "99",
      appKey: "webDesktopKey",
      cbsChannel: "PokerStars Web Desktop",
      channel: "WEB_DESKTOP",
    });
  });

  it("returns IOS identifiers when wrapper is GamingWrapper and platform is ios", () => {
    const ctx = { uiVariant: "mobile", platform: "ios", wrapper: { wrapperName: "GamingWrapper" } };

    const result = getAppIdentifier(ctx, baseEnvironment);

    expect(result).toEqual({
      product: "sportsbook",
      productId: "230",
      appKey: "iosKey",
      cbsChannel: "PokerStars Wrapper IOS",
      channel: "IOS",
    });
  });

  it("returns ANDROID identifiers when wrapper is GamingWrapper and platform is android", () => {
    const ctx = { uiVariant: "mobile", platform: "android", wrapper: { wrapperName: "GamingWrapper" } };

    const result = getAppIdentifier(ctx, baseEnvironment);

    expect(result).toEqual({
      product: "sportsbook",
      productId: "240",
      appKey: "androidKey",
      cbsChannel: "PokerStars Wrapper Android",
      channel: "ANDROID",
    });
  });

  it("returns WRAPPER_DESKTOP identifiers when wrapper is DesktopWrapper and key exists", () => {
    const ctx = { uiVariant: "mobile", platform: "web", wrapper: { wrapperName: "DesktopWrapper" } };

    const result = getAppIdentifier(ctx, baseEnvironment);

    expect(result).toEqual({
      product: "sportsbook",
      productId: "250",
      appKey: "wrapperDesktopKey",
      cbsChannel: "PokerStars Wrapper Desktop",
      channel: "WRAPPER_DESKTOP",
    });
  });

  it("throws an error if wrapper is DesktopWrapper but WRAPPER_DESKTOP key is missing", () => {
    const environment = {
      APP_IDENTIFIERS: {
        ...baseEnvironment.APP_IDENTIFIERS,
        WRAPPER_DESKTOP: undefined, // simulate missing key
      },
    };
    const ctx = { uiVariant: "desktop", platform: "web", wrapper: { wrapperName: "DesktopWrapper" } };

    expect(() => getAppIdentifier(ctx, environment)).toThrow("Could not determine app identifier");
  });

  it("throws if APP_IDENTIFIERS is missing", () => {
    const ctx = { uiVariant: "mobile", platform: "web", wrapper: null };

    expect(() => getAppIdentifier(ctx, {})).toThrow("Missing APP_IDENTIFIERS in environment config");
  });

  it("throws if no matching rule is found", () => {
    const ctx = { uiVariant: "unknown", platform: "web", wrapper: null };

    expect(() => getAppIdentifier(ctx, baseEnvironment)).toThrow("Could not determine app identifier");
  });
});
