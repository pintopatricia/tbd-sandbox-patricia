import { Product } from "@ppb/tbd-store";
import { getStore } from "@ppb/tbd-store/create-store";
import {
  BetslipExcRemovePotentialSelectionAction,
  BetslipOpenAction,
  BetslipSbkRemovePotentialSelectionAction,
  UI__BETSLIP_EXC_REMOVE_POTENTIAL_SELECTION,
  UI__BETSLIP_OPEN,
  UI__BETSLIP_SBK_REMOVE_POTENTIAL_SELECTION,
} from "@ppb/tbd-store/actions/betslip";
import {
  BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION,
  BETTING__SBK_MARKETS_REQUEST,
  BETTING__SBK_TOGGLE_ONE_LINE_LEG_ACTION,
  BettingSportsbookMarketsRequest,
  BettingSportsbookToggleOneLineLegAction,
  RemoveAllPotentialBetsAction,
} from "@ppb/tbd-store/actions/betting";

function dispatchBetslipActions(
  cardUrn: string,
  runnerUrns: string[],
  markets: { marketUrn: string; marketId: string }[],
  selectionIds: number[],
) {
  if (!runnerUrns?.length || !markets?.length || !selectionIds?.length) {
    return;
  }

  const store = getStore();

  // The following actions are required to open the betslip
  store.dispatch<BetslipOpenAction>({
    type: UI__BETSLIP_OPEN,
    payload: {
      product: Product.Sportsbook,
    },
  });

  runnerUrns.forEach((runnerUrn) => {
    store.dispatch<BetslipSbkRemovePotentialSelectionAction>({
      type: UI__BETSLIP_SBK_REMOVE_POTENTIAL_SELECTION,
      payload: {
        urn: runnerUrn,
      },
    });
    store.dispatch<BetslipExcRemovePotentialSelectionAction>({
      type: UI__BETSLIP_EXC_REMOVE_POTENTIAL_SELECTION,
    });
    store.dispatch<RemoveAllPotentialBetsAction>({
      type: BETTING__REMOVE_ALL_POTENTIAL_BETS_ACTION,
    });
  });

  const marketUrns: string[] = [];
  const marketIds: string[] = [];
  markets.forEach((market) => {
    marketUrns.push(market.marketUrn);
    marketIds.push(market.marketId);
  });

  store.dispatch<BettingSportsbookToggleOneLineLegAction>({
    type: BETTING__SBK_TOGGLE_ONE_LINE_LEG_ACTION,
    payload: {
      marketUrns,
      marketIds,
      selectionIds,
      group: "REAL",
      urn: cardUrn,
    },
  });
}

export function addLotteriesBetToBetslip(
  cardUrn: string,
  markets: { marketUrn: string; marketId: string }[],
  runnerUrns: string[],
  selectionIds: number[],
) {
  const store = getStore();

  // We need ensure we fetch the market from BFF. Otherwise, the relation between market and
  // runner might not be available on store resulting in empty market selectors. Things like
  // runner name are only available when you fetch the market from BFF.
  store.dispatch<BettingSportsbookMarketsRequest>({
    type: BETTING__SBK_MARKETS_REQUEST,
    payload: {
      urns: markets.map(({ marketUrn }) => marketUrn),
      group: "REAL",
    },
  });

  dispatchBetslipActions(cardUrn, runnerUrns, markets, selectionIds);
}
