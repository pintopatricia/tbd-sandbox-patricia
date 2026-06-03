import { ApplicationState, BettingOpportunityType, Product } from "@ppb/tbd-store";
import type { SportsbookOdds } from "@ppb/tbd-store/state/entities/SportsbookOdds.types";
import {
  BetslipOpenAction,
  UI__BETSLIP_OPEN,
  BetslipSbkRemovePotentialSelectionAction,
  UI__BETSLIP_SBK_REMOVE_POTENTIAL_SELECTION,
  BetslipExcRemovePotentialSelectionAction,
  UI__BETSLIP_EXC_REMOVE_POTENTIAL_SELECTION,
  BetslipCollapseToggleAction,
  UI__BETSLIP_SET_COLLAPSE_ACTION,
} from "@ppb/tbd-store/actions/betslip";
import {
  BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION,
  BETTING__SBK_MARKETS_REQUEST,
  BETTING__SBK_ADD_SELECTIONS,
  BETTING__SBK_TOGGLE_LEG_ACTION,
  BettingSportsbookAddSelectionAction,
  BettingSportsbookMarketsRequest,
  BettingSportsbookToggleLegAction,
  RemoveAllPotentialBetsAction,
  UI__MARKET_SBK_BET_BUTTON_CLICK,
  MarketSportsbookBetButtonClickAction,
} from "@ppb/tbd-store/actions/betting";
import type { CardTrackingMetadata } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { getStore } from "@ppb/tbd-store/create-store";
import { sbkRunnerLiveDataCodec, sportsbookRunnerCodec } from "@ppb/tbd-urn-codecs";
import { getApolloClient } from "../../../apollo-client/client";
import { SportsbookRunnerLiveDataPotentialBetUpdateFragment } from "./SportsbookRunnerLiveData.graphql";
import {
  ClosedSbkBetButtonCLickAction,
  SuspendedSbkBetButtonCLickAction,
  UI__CLOSED_SBK_CLICK,
  UI__SUSPENDED_SBK_CLICK,
} from "@ppb/tbd-store/actions/sportsbook-markets";
import type { SportsbookBetButtonStatus } from "@ppb/tbd-components-sports-betting/components/SportsbookBetButton/view/SportsbookBetButton.types";
import {
  getSportsbookMarketByURN,
  getSportsbookMarketRunnerByURN,
} from "@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors";

export type Odds = {
  decimal: number;
  fractional: {
    numerator: number;
    denominator: number;
  } | null;
} | null;

// Transform nulls to undefined to match the expected type by tbd
export function mapSportsbookOdds(odds: Odds) {
  if (!odds) {
    return undefined;
  }

  return {
    decimal: odds.decimal,
    fractional: odds.fractional || undefined,
  };
}

function isSportsbookMarketHydrated(state: ApplicationState, marketUrn: string) {
  const market = getSportsbookMarketByURN(state.entities.sportsbookmarkets, marketUrn);

  if (!market?.runners?.length) {
    return false;
  }

  return market.runners.every(({ urn }) => Boolean(getSportsbookMarketRunnerByURN(market, urn)));
}

export function prefetchSportsbookMarket(marketUrn: string) {
  const store = getStore();

  if (!marketUrn || isSportsbookMarketHydrated(store.getState(), marketUrn)) {
    return;
  }

  store.dispatch<BettingSportsbookMarketsRequest>({
    type: BETTING__SBK_MARKETS_REQUEST,
    payload: {
      urns: [marketUrn],
      group: "REAL",
    },
  });
}

export function prefetchBatchSportsbookMarkets(marketUrns: string[]) {
  const store = getStore();

  const marketUrnsToFetch = marketUrns.filter((marketUrn) => {
    return marketUrn && !isSportsbookMarketHydrated(store.getState(), marketUrn);
  });

  if (marketUrnsToFetch.length === 0) {
    return;
  }

  store.dispatch<BettingSportsbookMarketsRequest>({
    type: BETTING__SBK_MARKETS_REQUEST,
    payload: {
      urns: marketUrnsToFetch,
      group: "REAL",
    },
  });
}

function dispatchBetslipSingleBetActions(
  runnerUrn: string,
  mappedOdds?: SportsbookOdds,
  cardUrn?: string,
  cardMetadata?: CardTrackingMetadata,
) {
  const store = getStore();
  // The following actions are required to open the betslip
  store.dispatch<BetslipOpenAction>({
    type: UI__BETSLIP_OPEN,
    payload: {
      product: Product.Sportsbook,
    },
  });
  store.dispatch<BetslipSbkRemovePotentialSelectionAction>({
    type: UI__BETSLIP_SBK_REMOVE_POTENTIAL_SELECTION,
    payload: {
      urn: runnerUrn,
    },
  });
  store.dispatch<BetslipExcRemovePotentialSelectionAction>({
    type: UI__BETSLIP_EXC_REMOVE_POTENTIAL_SELECTION,
  });
  if (cardUrn) {
    dispatchMarketSportsbookBetButtonClickAction(runnerUrn, cardUrn, mappedOdds, cardMetadata);
  }
  store.dispatch<RemoveAllPotentialBetsAction>({
    type: BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION,
  });
  store.dispatch<BettingSportsbookToggleLegAction>({
    type: BETTING__SBK_TOGGLE_LEG_ACTION,
    payload: {
      urn: runnerUrn,
      odds: mappedOdds,
      group: "REAL",
    },
  });
}

export function dispatchMarketSportsbookBetButtonClickAction(
  runnerUrn: string,
  cardUrn: string,
  mappedOdds?: SportsbookOdds,
  cardMetadata?: CardTrackingMetadata,
) {
  if (!mappedOdds) {
    return;
  }

  const store = getStore();

  store.dispatch<MarketSportsbookBetButtonClickAction>({
    type: UI__MARKET_SBK_BET_BUTTON_CLICK,
    payload: {
      odds: mappedOdds,
      urn: runnerUrn,
      uniqueId: "",
      group: "REAL",
      cardUrn,
      betOriginURL: window.location?.href ?? "",
      cardMetadata,
    },
  });
}

export function getSingleBetButtonAdder(
  runnerUrn: string,
  odds: Odds | null,
  status: SportsbookBetButtonStatus,
  cardUrn?: string,
) {
  if (!odds || !runnerUrn) {
    return () => {};
  }

  const store = getStore();

  if (status === "closed" || status === "suspended") {
    store.dispatch<SuspendedSbkBetButtonCLickAction | ClosedSbkBetButtonCLickAction>({
      type: status === "closed" ? UI__CLOSED_SBK_CLICK : UI__SUSPENDED_SBK_CLICK,
    });

    return () => {};
  }

  const mappedOdds = mapSportsbookOdds(odds);

  return () => {
    dispatchBetslipSingleBetActions(runnerUrn, mappedOdds, cardUrn);
  };
}

export function getUpsellSelectionAdder(runnerUrn: string, odds: Odds | null, marketUrn?: string) {
  if (!odds || !runnerUrn) {
    return () => {};
  }

  if (marketUrn) {
    prefetchSportsbookMarket(marketUrn);
  }

  const mappedOdds = mapSportsbookOdds(odds);

  return () => {
    const store = getStore();

    // Only dispatch the toggle leg action — the betslip is already open from the upsell context,
    // so we skip UI__BETSLIP_OPEN and the potential-selection cleanup actions that are only
    // relevant for bet buttons on content pages.
    store.dispatch<BettingSportsbookToggleLegAction>({
      type: BETTING__SBK_TOGGLE_LEG_ACTION,
      payload: {
        urn: runnerUrn,
        odds: mappedOdds,
        group: "REAL",
      },
    });

    // The sportsbook-betting middleware auto-collapses the betslip when going to 2+ legs
    // via handleAutoCollapse. Force it back open so the user stays in the betslip context.
    store.dispatch<BetslipCollapseToggleAction>({
      type: UI__BETSLIP_SET_COLLAPSE_ACTION,
      payload: {
        collapse: false,
      },
    });
  };
}

export function getPopularSelectionsCardBetButtonAdder(
  runnerUrn: string,
  odds: Odds,
  cardMetadata: CardTrackingMetadata,
) {
  const { cardUrn } = cardMetadata;

  if (!odds || !runnerUrn || !cardUrn) {
    return () => {};
  }

  return () => {
    dispatchMarketSportsbookBetButtonClickAction(runnerUrn, cardUrn, mapSportsbookOdds(odds), cardMetadata);
  };
}

export function getPopularSelectionsSwipeRightAdder(
  runnerUrn: string,
  odds: Odds,
  cardUrn: string,
  status: SportsbookBetButtonStatus,
) {
  if (!odds || !runnerUrn || !cardUrn) {
    return () => {};
  }

  const store = getStore();

  if (status === "selected") {
    return () => {};
  }

  if (status === "closed" || status === "suspended") {
    store.dispatch<SuspendedSbkBetButtonCLickAction | ClosedSbkBetButtonCLickAction>({
      type: status === "closed" ? UI__CLOSED_SBK_CLICK : UI__SUSPENDED_SBK_CLICK,
    });

    return () => {};
  }

  return () => {
    dispatchBetslipSingleBetActions(runnerUrn, mapSportsbookOdds(odds), cardUrn, {
      cardUrn,
      typename: "PopularSelectionsCard",
      title: "popular selection modal",
    });
  };
}

export function openBetslip() {
  const store = getStore();

  store.dispatch<BetslipCollapseToggleAction>({
    type: UI__BETSLIP_SET_COLLAPSE_ACTION,
    payload: {
      collapse: false,
    },
  });
}

export function getSingleSelectionPromoAdder(
  cardUrn: string,
  marketUrn: string,
  runnerUrn: string,
  odds: Odds | null,
): () => void {
  const store = getStore();

  if (!odds) {
    return () => {};
  }

  // We need ensure we fetch the market from BFF. Otherwise, the relation between market and
  // runner might not be available on store resulting in empty market selectors. Things like
  // runner name are only available when you fetch the market from BFF.
  store.dispatch<BettingSportsbookMarketsRequest>({
    type: BETTING__SBK_MARKETS_REQUEST,
    payload: {
      urns: [marketUrn],
      group: "REAL",
    },
  });

  // Some promotions trigger navigations. Since on native navigations have animations we need to defer
  // those actions otherwise betslip will leave a "shadow" of itself on previous screen.
  return () => {
    setTimeout(() => {
      dispatchBetslipSingleBetActions(runnerUrn, mapSportsbookOdds(odds), cardUrn);
    }, 0);
  };
}

export function addBettingOpportunityToBetslip(
  cardUrn: string,
  selections: { marketUrn: string; runnerUrn: string }[],
  bettingOpportunityId: string,
  bettingOpportunityType: BettingOpportunityType | null,
) {
  const store = getStore();

  store.dispatch<BettingSportsbookAddSelectionAction>({
    type: BETTING__SBK_ADD_SELECTIONS,
    payload: {
      selections,
      group: "REAL",
      bettingOpportunityId,
      bettingOpportunityType: bettingOpportunityType || undefined,
      cardUrn,
    },
  });
}

export function addChatbotSelectionsToBetslip(
  chatbotSelections: Array<{ runnerUrn: string; marketUrn: string }>,
  cardUrn: string,
  odds: Odds,
  horizontalPosition?: number,
) {
  const store = getStore();

  if (!chatbotSelections.length) {
    return;
  }

  store.dispatch<BettingSportsbookAddSelectionAction>({
    type: BETTING__SBK_ADD_SELECTIONS,
    payload: {
      selections: chatbotSelections,
      group: "REAL",
      cardUrn,
      cardMetadata: {
        typename: "SportsbookChatbotCard",
        title: "bets you can explore",
        horizontalPosition,
      },
      odds: mapSportsbookOdds(odds),
    },
  });
}

export function potentialBetResolver(marketId: string, selectionId: number, state: "ADDED" | "REMOVED") {
  const { cache } = getApolloClient();

  const urn = sbkRunnerLiveDataCodec.encode(sportsbookRunnerCodec.encode(marketId, selectionId).referenceId).uid;

  cache.writeFragment({
    fragment: SportsbookRunnerLiveDataPotentialBetUpdateFragment,
    data: {
      __typename: "SportsbookRunnerLiveData",
      urn,
      isPotentialBet: state === "ADDED",
    },
  });
}
