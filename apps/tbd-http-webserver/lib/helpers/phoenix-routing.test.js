import { DefaultProductOption, LastViewedProductOption, ProductsOption } from "@ppb/tbd-store";
import { getPhoenixRouting } from "./phoenix-routing";

// Shorthand flags for jurisdiction
const intl = { isExcAllowedJurisdiction: true };
const denmark = { isExcAllowedJurisdiction: false };

function route({
  cluster,
  resolvedProduct,
  isExcAllowedJurisdiction,
  isLoggedIn,
  current_tbd_dp,
  current_tbd_lvp,
  defaultProductUSP,
  lastViewedProductUSP,
}) {
  return getPhoenixRouting({
    cluster,
    resolvedProduct,
    isExcAllowedJurisdiction,
    isLoggedIn,
    currentCookies: { tbd_dp: current_tbd_dp, tbd_lvp: current_tbd_lvp },
    uspPreferences: {
      defaultProduct: defaultProductUSP ?? DefaultProductOption.sportsbook,
      lastViewedProduct: lastViewedProductUSP ?? LastViewedProductOption.sportsbook,
    },
  });
}

describe("Phoenix-routing", () => {
  describe("Happy paths", () => {
    it("logged-in exchange user on EXC — serve, no corrections", () => {
      const result = route({
        cluster: "EXC",
        resolvedProduct: ProductsOption.exchange,
        ...intl,
        isLoggedIn: true,
        current_tbd_dp: DefaultProductOption.exchange,
        current_tbd_lvp: LastViewedProductOption.exchange,
        defaultProductUSP: DefaultProductOption.exchange,
        lastViewedProductUSP: LastViewedProductOption.exchange,
      });

      expect(result.action).toBe("serve");
      expect(result.cookieCorrections).toBeNull();
    });

    it("logged-in sportsbook user on SBK — serve, no corrections", () => {
      const result = route({
        cluster: "SBK",
        resolvedProduct: ProductsOption.sportsbook,
        ...intl,
        isLoggedIn: true,
        current_tbd_dp: DefaultProductOption.sportsbook,
        current_tbd_lvp: LastViewedProductOption.sportsbook,
        defaultProductUSP: DefaultProductOption.sportsbook,
        lastViewedProductUSP: LastViewedProductOption.sportsbook,
      });

      expect(result.action).toBe("serve");
      expect(result.cookieCorrections).toBeNull();
    });

    it("logged-out exchange user on EXC — serve, no corrections", () => {
      const result = route({
        cluster: "EXC",
        resolvedProduct: ProductsOption.exchange,
        ...intl,
        isLoggedIn: false,
        current_tbd_dp: DefaultProductOption.exchange,
        current_tbd_lvp: LastViewedProductOption.exchange,
      });

      expect(result.action).toBe("serve");
      expect(result.cookieCorrections).toBeNull();
    });

    it("logged-out sportsbook user on SBK — serve, no corrections", () => {
      const result = route({
        cluster: "SBK",
        resolvedProduct: ProductsOption.sportsbook,
        ...intl,
        isLoggedIn: false,
        current_tbd_dp: DefaultProductOption.sportsbook,
        current_tbd_lvp: LastViewedProductOption.sportsbook,
      });

      expect(result.action).toBe("serve");
      expect(result.cookieCorrections).toBeNull();
    });

    it("first visit, no cookies — serve", () => {
      const result = route({
        cluster: "SBK",
        resolvedProduct: ProductsOption.sportsbook,
        ...intl,
        isLoggedIn: false,
      });

      expect(result.action).toBe("serve");
    });
  });

  describe("Jurisdiction blocks", () => {
    it("logged-in denmark user on EXC (BFF resolved to SBK) — bounce to SBK", () => {
      const result = route({
        cluster: "EXC",
        resolvedProduct: ProductsOption.sportsbook, // BFF overrode exchange → sportsbook
        ...denmark,
        isLoggedIn: true,
        current_tbd_dp: DefaultProductOption.exchange,
        defaultProductUSP: DefaultProductOption.exchange,
        lastViewedProductUSP: LastViewedProductOption.exchange,
      });

      expect(result.action).toBe("bounce");
      expect(result.bounceUrl).toBe("?product=sbk");
    });

    it("logged-in denmark user on SBK — serve", () => {
      const result = route({
        cluster: "SBK",
        resolvedProduct: ProductsOption.sportsbook,
        ...denmark,
        isLoggedIn: true,
        current_tbd_dp: DefaultProductOption.sportsbook,
        defaultProductUSP: DefaultProductOption.sportsbook,
      });

      expect(result.action).toBe("serve");
    });

    it("logged-out denmark user with exchange cookie on EXC — bounce to SBK", () => {
      const result = route({
        cluster: "EXC",
        resolvedProduct: ProductsOption.sportsbook,
        ...denmark,
        isLoggedIn: false,
        current_tbd_dp: DefaultProductOption.exchange,
      });

      expect(result.action).toBe("bounce");
      expect(result.bounceUrl).toBe("?product=sbk");
    });

    it("on EXC, denmark, resolved=exchange — bounce (jurisdiction blocks EXC regardless of product)", () => {
      const result = route({
        cluster: "EXC",
        resolvedProduct: ProductsOption.exchange,
        ...denmark,
        isLoggedIn: true,
      });

      expect(result.action).toBe("bounce");
      expect(result.bounceUrl).toBe("?product=sbk");
    });

    it("logged-out denmark, no cookies — SBK, serve", () => {
      const result = route({
        cluster: "SBK",
        resolvedProduct: ProductsOption.sportsbook,
        ...denmark,
        isLoggedIn: false,
      });

      expect(result.action).toBe("serve");
    });
  });

  describe("Right cluster, stale cookies", () => {
    it("on EXC, USP=exchange, cookie=sportsbook — serve, fix tbd_dp", () => {
      const result = route({
        cluster: "EXC",
        resolvedProduct: ProductsOption.exchange,
        ...intl,
        isLoggedIn: true,
        current_tbd_dp: DefaultProductOption.sportsbook, // stale
        current_tbd_lvp: LastViewedProductOption.exchange,
        defaultProductUSP: DefaultProductOption.exchange,
        lastViewedProductUSP: LastViewedProductOption.exchange,
      });

      expect(result.action).toBe("serve");
      expect(result.cookieCorrections).not.toBeNull();
      expect(result.cookieCorrections.tbd_dp).toBe(DefaultProductOption.exchange);
    });

    it("on SBK, USP=sportsbook, cookie=exchange — serve, fix tbd_dp", () => {
      const result = route({
        cluster: "SBK",
        resolvedProduct: ProductsOption.sportsbook,
        ...intl,
        isLoggedIn: true,
        current_tbd_dp: DefaultProductOption.exchange, // stale
        current_tbd_lvp: LastViewedProductOption.sportsbook,
        defaultProductUSP: DefaultProductOption.sportsbook,
        lastViewedProductUSP: LastViewedProductOption.sportsbook,
      });

      expect(result.action).toBe("serve");
      expect(result.cookieCorrections).not.toBeNull();
      expect(result.cookieCorrections.tbd_dp).toBe(DefaultProductOption.sportsbook);
    });
  });

  describe("Wrong cluster — self-heal vs bounce", () => {
    it("on SBK, resolved=exchange — SELF-HEAL: serve, fix cookies", () => {
      const result = route({
        cluster: "SBK",
        resolvedProduct: ProductsOption.exchange, // user's real preference, but landed on SBK
        ...intl,
        isLoggedIn: true,
        current_tbd_dp: DefaultProductOption.sportsbook, // stale cookie caused wrong routing
        current_tbd_lvp: LastViewedProductOption.sportsbook,
        defaultProductUSP: DefaultProductOption.exchange,
        lastViewedProductUSP: LastViewedProductOption.exchange,
      });

      expect(result.action).toBe("serve");
      expect(result.bounceUrl).toBeUndefined();
      expect(result.cookieCorrections).not.toBeNull();
      expect(result.cookieCorrections.tbd_dp).toBe(DefaultProductOption.exchange);
    });

    it("on EXC, resolved=sportsbook — BOUNCE to SBK", () => {
      const result = route({
        cluster: "EXC",
        resolvedProduct: ProductsOption.sportsbook,
        ...intl,
        isLoggedIn: true,
        current_tbd_dp: DefaultProductOption.exchange,
        defaultProductUSP: DefaultProductOption.sportsbook,
        lastViewedProductUSP: LastViewedProductOption.sportsbook,
      });

      expect(result.action).toBe("bounce");
      expect(result.bounceUrl).toBe("?product=sbk");
    });

    it("on EXC, denmark, resolved=sportsbook — BOUNCE to SBK", () => {
      const result = route({
        cluster: "EXC",
        resolvedProduct: ProductsOption.sportsbook,
        ...denmark,
        isLoggedIn: true,
        current_tbd_dp: DefaultProductOption.exchange,
        defaultProductUSP: DefaultProductOption.exchange,
        lastViewedProductUSP: LastViewedProductOption.exchange,
      });

      expect(result.action).toBe("bounce");
      expect(result.bounceUrl).toBe("?product=sbk");
    });
  });

  describe("Cookie corrections", () => {
    it("all cookies match USP — no corrections", () => {
      const result = route({
        cluster: "SBK",
        resolvedProduct: ProductsOption.sportsbook,
        ...intl,
        isLoggedIn: true,
        current_tbd_dp: DefaultProductOption.sportsbook,
        current_tbd_lvp: LastViewedProductOption.sportsbook,
        defaultProductUSP: DefaultProductOption.sportsbook,
        lastViewedProductUSP: LastViewedProductOption.sportsbook,
      });

      expect(result.cookieCorrections).toBeNull();
    });

    it("tbd_dp drifted from USP — only tbd_dp corrected", () => {
      const result = route({
        cluster: "SBK",
        resolvedProduct: ProductsOption.sportsbook,
        ...intl,
        isLoggedIn: true,
        current_tbd_dp: DefaultProductOption.exchange, // stale
        current_tbd_lvp: LastViewedProductOption.sportsbook,
        defaultProductUSP: DefaultProductOption.sportsbook,
        lastViewedProductUSP: LastViewedProductOption.sportsbook,
      });

      expect(result.cookieCorrections).not.toBeNull();
      expect(result.cookieCorrections.tbd_dp).toBe(DefaultProductOption.sportsbook);
      expect(result.cookieCorrections.tbd_lvp).toBeUndefined();
    });

    it("logged-out user — no cookie corrections (cookies are the authority)", () => {
      const result = route({
        cluster: "SBK",
        resolvedProduct: ProductsOption.sportsbook,
        ...intl,
        isLoggedIn: false,
        current_tbd_dp: DefaultProductOption.exchange, // mismatched but logged-out
      });

      expect(result.cookieCorrections).toBeNull();
    });

    it("only tbd_lvp drifted — only tbd_lvp corrected", () => {
      const result = route({
        cluster: "SBK",
        resolvedProduct: ProductsOption.sportsbook,
        ...intl,
        isLoggedIn: true,
        current_tbd_dp: DefaultProductOption.exchange,
        current_tbd_lvp: LastViewedProductOption.sportsbook, // stale
        defaultProductUSP: DefaultProductOption.exchange,
        lastViewedProductUSP: LastViewedProductOption.exchange,
      });

      expect(result.cookieCorrections.tbd_dp).toBeUndefined();
      expect(result.cookieCorrections.tbd_lvp).toBe(LastViewedProductOption.exchange);
    });
  });
});
