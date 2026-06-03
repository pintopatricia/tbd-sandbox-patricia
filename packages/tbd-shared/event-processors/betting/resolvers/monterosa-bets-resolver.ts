import { Product } from "@ppb/tbd-store";
import type { URN } from "@ppb/the-wall-common/types";
import { getStore } from "@ppb/tbd-store/create-store";
import { BetslipOpenAction, UI__BETSLIP_OPEN } from "@ppb/tbd-store/actions/betslip";
import {
  BETTING__SBK_MARKETS_REQUEST,
  BETTING__SBK_ADD_SELECTIONS,
  BettingSportsbookMarketsRequest,
  BettingSportsbookAddSelectionAction,
  ADD_SELECTION_PAYLOAD,
} from "@ppb/tbd-store/actions/betting";
import { marketCodec, sportsbookRunnerCodec } from "@ppb/tbd-urn-codecs";
import type { MarketId, SelectionId } from "@ppb/betslip-core/src/types/imply/common";

type MonterosaSelection = {
  marketId: MarketId;
  selectionId: SelectionId;
};

type SelectionKey = `${MarketId}:${SelectionId}`;

const createSelectionKey = ({ marketId, selectionId }: MonterosaSelection): SelectionKey =>
  `${marketId}:${selectionId}`;

function hasNewSelections(
  selections: MonterosaSelection[],
  runners: Record<URN, { marketId: MarketId; selectionId: SelectionId }>,
): boolean {
  const currentSelectionKeys = new Set<SelectionKey>(Object.values(runners).map(createSelectionKey));

  return selections.some((selection) => !currentSelectionKeys.has(createSelectionKey(selection)));
}

function deduplicateSelections(selections: MonterosaSelection[]): MonterosaSelection[] {
  const checkedKeys = new Set<SelectionKey>();

  return selections.reduce<MonterosaSelection[]>((acc, selection) => {
    const key = createSelectionKey(selection);

    if (checkedKeys.has(key)) {
      return acc;
    }

    checkedKeys.add(key);
    acc.push(selection);

    return acc;
  }, []);
}

function mapToBetslipSelections(selections: MonterosaSelection[]): ADD_SELECTION_PAYLOAD["selections"] {
  const seenRunnerUrns = new Set<URN>();

  return selections.reduce<ADD_SELECTION_PAYLOAD["selections"]>((acc, selection) => {
    const marketUrn = marketCodec.encode(selection.marketId).uid;
    const runnerUrn = sportsbookRunnerCodec.encode(selection.marketId, selection.selectionId).uid;

    if (!seenRunnerUrns.has(runnerUrn)) {
      seenRunnerUrns.add(runnerUrn);
      acc.push({ marketUrn, runnerUrn });
    }

    return acc;
  }, []);
}

function mapToMarketUrns(selections: MonterosaSelection[]): URN[] {
  const seenMarketUrns = new Set<URN>();

  return selections.reduce<URN[]>((acc, selection) => {
    const marketUrn = marketCodec.encode(selection.marketId).uid;

    if (!seenMarketUrns.has(marketUrn)) {
      seenMarketUrns.add(marketUrn);
      acc.push(marketUrn);
    }

    return acc;
  }, []);
}

function dispatchBetslipActions(
  store: ReturnType<typeof getStore>,
  betslipSelections: ADD_SELECTION_PAYLOAD["selections"],
  cardUrn: string,
): void {
  openBetslip(store);

  store.dispatch<BettingSportsbookAddSelectionAction>({
    type: BETTING__SBK_ADD_SELECTIONS,
    payload: {
      selections: betslipSelections,
      group: "REAL",
      cardUrn,
      ensureSelectionsFromStore: true,
    },
  });
}

function openBetslip(store: ReturnType<typeof getStore>): void {
  store.dispatch<BetslipOpenAction>({
    type: UI__BETSLIP_OPEN,
    payload: {
      product: Product.Sportsbook,
    },
  });
}
function dispatchUpdateMarkets(store: ReturnType<typeof getStore>, uniqueMarketUrns: URN[]): void {
  store.dispatch<BettingSportsbookMarketsRequest>({
    type: BETTING__SBK_MARKETS_REQUEST,
    payload: {
      urns: uniqueMarketUrns,
      group: "REAL",
    },
  });
}

export function addMonterosaSelectionsToBetslip(
  cardUrn: string,
  selections: MonterosaSelection[],
): MonterosaSelection[] {
  if (!selections.length) {
    return [];
  }

  const store = getStore();
  const state = store.getState();
  const sportsbookBettingRunners = state.betting?.sportsbookBetting?.runners || {};

  if (!hasNewSelections(selections, sportsbookBettingRunners)) {
    openBetslip(store);
    return selections;
  }

  const uniqueSelections = deduplicateSelections(selections); // remove  duplicate because action do a toogle if has repeated
  const betslipSelections = mapToBetslipSelections(uniqueSelections);
  const uniqueMarketUrns = mapToMarketUrns(uniqueSelections);

  if (!betslipSelections.length) {
    return [];
  }

  dispatchUpdateMarkets(store, uniqueMarketUrns);
  dispatchBetslipActions(store, betslipSelections, cardUrn);

  return uniqueSelections;
}
