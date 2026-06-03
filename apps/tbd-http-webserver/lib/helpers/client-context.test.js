import { getClientContext } from "./client-context";

const MOCK_USER_AGENT =
  "Mozilla/5.0 (iPhone; CPU iPhone OS 10_2 like Mac OS X) AppleWebKit/602.3.12 (KHTML, like Gecko) Mobile/14C89; GamingWrapper (PokerStars; iOS; 7.6.3; BridgeAPIVersion/0.1.1)";

function setup(userAgent, xDesktop, desktopQueryParam) {
  const $headers = {
    getHeader: jest.fn((key) => {
      if (key === "User-Agent") return userAgent;
      if (key === "X-TBD-DESKTOP") return xDesktop;
      return undefined;
    }),
  };
  const $log = { error: jest.fn() };
  const queryParams = { desktop: desktopQueryParam };
  return { $headers, $log, queryParams };
}

describe("getClientContext", () => {
  it("returns ios/mobile when UA is iPhone", () => {
    const { $headers, $log, queryParams } = setup("Mozilla/5.0 (iPhone; CPU iPhone OS 10_2 like Mac OS X)");
    const ctx = getClientContext($headers, $log, queryParams);
    expect(ctx).toEqual({ platform: "ios", uiVariant: "mobile", wrapper: null });
  });

  it("returns android/mobile when UA is Android", () => {
    const { $headers, $log, queryParams } = setup("Mozilla/5.0 (Linux; Android 10)");
    const ctx = getClientContext($headers, $log, queryParams);
    expect(ctx).toEqual({ platform: "android", uiVariant: "mobile", wrapper: null });
  });

  it("returns web/desktop when UA is desktop and X-TBD-DESKTOP=true", () => {
    const { $headers, $log, queryParams } = setup("Mozilla/5.0 (Windows NT 10.0)", "true");
    const ctx = getClientContext($headers, $log, queryParams);
    expect(ctx).toEqual({ platform: "web", uiVariant: "desktop", wrapper: null });
  });

  it("returns web/mobile when UA is desktop and X-TBD-DESKTOP=false", () => {
    const { $headers, $log, queryParams } = setup("Mozilla/5.0 (Windows NT 10.0)", "false");
    const ctx = getClientContext($headers, $log, queryParams);
    expect(ctx).toEqual({ platform: "web", uiVariant: "mobile", wrapper: null });
  });

  it("returns web/desktop when UA is desktop and desktop query param is set to true", () => {
    const { $headers, $log, queryParams } = setup("Mozilla/5.0 (Windows NT 10.0)", "false", "true");
    const ctx = getClientContext($headers, $log, queryParams);
    expect(ctx).toEqual({ platform: "web", uiVariant: "desktop", wrapper: null });
  });

  it("returns web/desktop when UA is desktop and desktop query param is set to false", () => {
    const { $headers, $log, queryParams } = setup("Mozilla/5.0 (Windows NT 10.0)", "false", "false");
    const ctx = getClientContext($headers, $log, queryParams);
    expect(ctx).toEqual({ platform: "web", uiVariant: "mobile", wrapper: null });
  });

  it("returns web/mobile when UA is missing", () => {
    const { $headers, $log, queryParams } = setup(undefined);
    const ctx = getClientContext($headers, $log, queryParams);
    expect(ctx).toEqual({ platform: "web", uiVariant: "mobile", wrapper: null });
    expect($log.error).toHaveBeenCalled();
  });

  it("returns wrapper context when wrapper is enabled and UA matches GamingWrapper", () => {
    const { $headers, $log, queryParams } = setup(MOCK_USER_AGENT);
    const ctx = getClientContext($headers, $log, queryParams, true);
    expect(ctx.wrapper).toEqual({
      wrapperName: "GamingWrapper",
      bridgeAPIVersion: "0.1.1",
    });
  });

  it("returns wrapper context when wrapper is enabled and UA matches DesktopWrapper", () => {
    const { $headers, $log, queryParams } = setup("Mozilla/5.0 ... PSBrowserEmbedded ...");
    const ctx = getClientContext($headers, $log, queryParams, true);
    expect(ctx.wrapper).toEqual({ wrapperName: "DesktopWrapper" });
  });

  it("returns null wrapper when wrapper is enabled but UA is unrelated", () => {
    const { $headers, $log, queryParams } = setup("SomeOtherUserAgent");
    const ctx = getClientContext($headers, $log, queryParams, true);
    expect(ctx.wrapper).toBeNull();
  });
});
