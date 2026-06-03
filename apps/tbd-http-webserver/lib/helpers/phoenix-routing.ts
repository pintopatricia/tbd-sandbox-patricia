import { DefaultProductOption, LastViewedProductOption, ProductsOption, ProductUrlSuffix } from "@ppb/tbd-store";

export enum ProductCluster {
  SPORTSBOOK = "SBK",
  EXCHANGE = "EXC",
}

export type CookieCorrections = { tbd_dp?: DefaultProductOption; tbd_lvp?: LastViewedProductOption };

type PhoenixRoutingInput = {
  cluster: ProductCluster;
  resolvedProduct: ProductsOption;
  isExcAllowedJurisdiction: boolean;
  isLoggedIn: boolean;
  currentCookies: {
    tbd_dp: string | undefined;
    tbd_lvp: string | undefined;
  };
  uspPreferences: {
    defaultProduct: DefaultProductOption;
    lastViewedProduct: LastViewedProductOption;
  };
};

const enum Action {
  BOUNCE = "bounce",
  SERVE = "serve",
}

type PhoenixRoutingOutput =
  | { cookieCorrections: CookieCorrections | null; action: Action.SERVE }
  | { cookieCorrections: CookieCorrections | null; action: Action.BOUNCE; bounceUrl: string };

function calculateCookieCorrections(
  isLoggedIn: boolean,
  uspPreferences: { defaultProduct: DefaultProductOption; lastViewedProduct: LastViewedProductOption },
  currentCookies: { tbd_dp: string | undefined; tbd_lvp: string | undefined },
): CookieCorrections | null {
  // Logged-out: no USP preferences to change cookies
  if (!isLoggedIn) {
    return null;
  }

  const corrections: CookieCorrections = {};

  if (currentCookies.tbd_dp !== uspPreferences.defaultProduct) {
    corrections.tbd_dp = uspPreferences.defaultProduct;
  }

  if (currentCookies.tbd_lvp !== uspPreferences.lastViewedProduct) {
    corrections.tbd_lvp = uspPreferences.lastViewedProduct;
  }

  return Object.keys(corrections).length > 0 ? corrections : null;
}

export function getPhoenixRouting({
  cluster,
  resolvedProduct,
  isExcAllowedJurisdiction,
  isLoggedIn,
  currentCookies,
  uspPreferences,
}: PhoenixRoutingInput): PhoenixRoutingOutput {
  // EXC cluster cannot serve SBK content — bounce to SBK cluster.
  // SBK never bounces (self-heal instead) — this breaks redirect loops by design.
  const action =
    cluster === ProductCluster.EXCHANGE && (resolvedProduct !== ProductsOption.exchange || !isExcAllowedJurisdiction)
      ? Action.BOUNCE
      : Action.SERVE;

  const cookieCorrections = calculateCookieCorrections(isLoggedIn, uspPreferences, currentCookies);

  return action === Action.BOUNCE
    ? { cookieCorrections, action, bounceUrl: ProductUrlSuffix.Sportsbook }
    : { cookieCorrections, action };
}
