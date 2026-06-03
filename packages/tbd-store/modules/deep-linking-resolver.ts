import { codecs } from "@ppb/tbd-urn-codecs";

import { CMD_LOAD_SBK_BETSLIP, LoadSbkBetslipCommand } from "../state";

type Selections = LoadSbkBetslipCommand["args"]["selections"];
type DeepLinkingAdapter = (searchParams: URLSearchParams) => Selections | undefined;

export const BET_SHARING_SRC = "betsharing";

function encodeSelection(marketId: string, selectionId: string): Selections[0] {
  return {
    marketUrn: codecs.market.encode(marketId).uid,
    runnerUrn: codecs.sportsbookRunner.encode(marketId, +selectionId).uid,
  };
}

/**
 * Regular expression to match market id and runner id
 *
 * E.g.: 924.123456|6789
 */
const selectionRE = /(\d+\.\d+)\|(\d+)/g;

const smxAdapter: DeepLinkingAdapter = (searchParams: URLSearchParams) => {
  const betsParam = searchParams.get("bets");

  if (!betsParam) {
    return undefined;
  }

  const matchedSelections = betsParam.matchAll(selectionRE);
  const selections = Array.from(matchedSelections, ([, marketId, runnerId]) => encodeSelection(marketId, runnerId));

  return selections.length > 0 ? selections : undefined;
};

const sbwAdapter: DeepLinkingAdapter = (searchParams: URLSearchParams) => {
  const modulesParam = searchParams.get("modules");
  const actionParam = searchParams.get("action");
  const bssIdParam = searchParams.get("bssId");
  const bsmIdParam = searchParams.get("bsmId");

  if (modulesParam !== "betslip") {
    return undefined;
  }

  if (actionParam !== "addAffiliateSelections" && actionParam !== "addAffiliateSelection") {
    return undefined;
  }

  if (!bssIdParam || !bsmIdParam) {
    return undefined;
  }

  const selectionIds = bssIdParam.replace(/;/g, ",").split(",");
  const marketIds = bsmIdParam.replace(/;/g, ",").split(",");

  if (marketIds.length !== selectionIds.length) {
    return undefined;
  }

  return selectionIds.map<Selections[0]>((selectionId, index) => encodeSelection(marketIds[index], selectionId));
};

function handleBetslipDeepLinking(searchParams: URLSearchParams): Selections | undefined {
  return [smxAdapter, sbwAdapter].reduce<ReturnType<DeepLinkingAdapter>>(
    (acc, adapter) => acc || adapter(searchParams),
    undefined,
  );
}

export function resolveBetslipDeepLinking(
  currentUrl: string | null,
  errorLogFn: (error: string) => void,
): LoadSbkBetslipCommand | undefined {
  if (!currentUrl) {
    return undefined;
  }

  try {
    const query = decodeURIComponent(currentUrl).split("?").pop();
    const searchParams = new URLSearchParams(query);

    if (!searchParams) {
      return undefined;
    }

    const selections = handleBetslipDeepLinking(searchParams);

    if (!selections) {
      return undefined;
    }

    return {
      name: CMD_LOAD_SBK_BETSLIP,
      args: {
        selections,
        isBetSharing: searchParams.get("src") === BET_SHARING_SRC,
      },
    };
  } catch (err) {
    errorLogFn(`Error while handling deeplinking: ${err instanceof Error ? err.stack : err}`);
  }

  return undefined;
}
