import { buildBetslipEvent, BetslipEvent } from "tagging-library";
import { generateRunnerId } from "@ppb/betslip-core";
import {
  BetslipExcRemovePotentialSelectionAction,
  BetslipExchangeRemovePotentialBetClickAction,
  BetslipExchangeReportBetEditClickAction,
  BetslipExchangeUnmatchedCancelClickAction,
  BetslipExchangeUnmatchedUpdateClickAction,
  BetslipSbkRemovePotentialSelectionAction,
  BetslipSportsbookRemoveLegClick,
} from "../../actions/betslip";
import { ApplicationState, ProductsOption } from "../../state";
import {
  getBetslipCard,
  getBetslipExchangeContext,
  getBetslipExchangeReportUnmatched,
} from "../../state/betslip/betslip-card-selectors";
import {
  createExcRunnerPotentialBetsByRunnerURNSelector,
  getExchangeRunnerTree,
} from "../../state/entities/entities-selectors";
import { TaggingAction } from "../tagging-resolvers/AnalyticsConstants";
import { getBettingResolvers } from "../../state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { MyBetsCancelExchangeBetFailureAction, MyBetsCancelExchangeBetSuccessAction } from "../../actions/my-bets";
import { getBetMetrics, getSportsbookRunnerMetrics, getVirtualRunnerMetrics } from "./helpers";

const getCancelBetClickEvent = (
  action: TaggingAction,
  betId: string,
  selection: string,
  selectionId: string,
): BetslipEvent =>
  buildBetslipEvent({
    action,
    betId,
    selection,
    selectionId,
    bettingProduct: ProductsOption.exchange,
  });

export const getDontUpdateBetClickEvent = (): BetslipEvent =>
  buildBetslipEvent({
    action: TaggingAction.DONT_UPDATE,
    betId: "null",
    selection: "null",
    selectionId: "null",
    bettingProduct: ProductsOption.exchange,
  });

export const getUpdateBetClickEvent = (
  action: BetslipExchangeUnmatchedUpdateClickAction,
  state: ApplicationState,
): BetslipEvent | null => {
  const { betId, runner: runnerUrn } = action.payload;
  const runnerTree = getExchangeRunnerTree(state.entities, runnerUrn);

  if (!runnerTree) return null;

  const { marketRunner, runner } = runnerTree;

  return buildBetslipEvent({
    action: TaggingAction.SUBMITTED_UPDATE_UNMATCHED_BET,
    betId,
    selection: marketRunner.name,
    selectionId: runner.selectionId.toString(),
    bettingProduct: ProductsOption.exchange,
  });
};

const getBetslipCancelBetClickEvent = (state: ApplicationState, action: TaggingAction): BetslipEvent | null => {
  const betslipContext = getBetslipExchangeContext(state);
  const betslipEchangeUnmatchedReport = getBetslipExchangeReportUnmatched(state);

  if (!betslipContext) {
    return null;
  }
  const runnerTree = getExchangeRunnerTree(state.entities, betslipContext?.runner);

  if (!runnerTree) {
    return null;
  }
  const { marketRunner, runner } = runnerTree;

  return getCancelBetClickEvent(
    action,
    betslipEchangeUnmatchedReport?.betId || "null",
    marketRunner.name,
    runner.selectionId.toString(),
  );
};

export const getBetslipCancelUnmatchedBetClickEvent = (
  action: BetslipExchangeUnmatchedCancelClickAction,
  state: ApplicationState,
): BetslipEvent | null => getBetslipCancelBetClickEvent(state, TaggingAction.CANCELLED_BET);

export const getBetslipCancelBetSuccessClickEvent = (
  action: BetslipExchangeUnmatchedCancelClickAction,
  state: ApplicationState,
): BetslipEvent | null => getBetslipCancelBetClickEvent(state, TaggingAction.CANCELLED_BET_SUCCESS);

export const getBetslipCancelBetFailureClickEvent = (
  action: BetslipExchangeUnmatchedCancelClickAction,
  state: ApplicationState,
): BetslipEvent | null => getBetslipCancelBetClickEvent(state, TaggingAction.CANCELLED_BET_FAILURE);

export const getExchangeOnClickEdit = (
  action: BetslipExchangeReportBetEditClickAction,
  state: ApplicationState,
): BetslipEvent | null => {
  const { betId } = action.payload;
  const betMetrics = getBetMetrics(state, betId);

  if (!betMetrics) return null;

  return buildBetslipEvent({
    action: TaggingAction.EDIT_UNMATCHED_BET,
    betId,
    selection: betMetrics?.selection,
    selectionId: betMetrics?.selection_id.toString(),
    bettingProduct: ProductsOption.exchange,
  });
};

export const getBetslipSportsbookRemoveSelectionEvent = (
  action: BetslipSportsbookRemoveLegClick,
  state: ApplicationState,
): BetslipEvent | null => {
  const { runnerUrn } = action.payload;
  if (!runnerUrn) {
    return null;
  }

  const bettingRunnersMetadata = getBettingResolvers(state.betslip?.group).getMetadata(state);

  const leg = Object.values(state.betting.sportsbookBetting.legs)[0];
  const metadata = bettingRunnersMetadata[leg.runners[0]];

  if (!metadata) return null;

  const runnerMetrics =
    metadata.bettingGroup === "REAL"
      ? getSportsbookRunnerMetrics(state, runnerUrn)
      : getVirtualRunnerMetrics(state, runnerUrn);

  if (!runnerMetrics) {
    return null;
  }

  return buildBetslipEvent({
    action: TaggingAction.REMOVED_SELECTION,
    betId: "null",
    selection: runnerMetrics.selection || "null",
    selectionId: runnerMetrics.selection_id.toString() || "null",
    bettingProduct: ProductsOption.sportsbook,
  });
};

export const getBetslipExchangeRemovePotentialBetClickEvent = (
  action: BetslipExchangeRemovePotentialBetClickAction,
  state: ApplicationState,
): BetslipEvent | null => {
  const { runner } = action.payload;
  if (!runner) {
    return null;
  }

  const runnerTree = getExchangeRunnerTree(state.entities, runner);
  if (!runnerTree) {
    return null;
  }

  return buildBetslipEvent({
    action: TaggingAction.REMOVED_SELECTION,
    betId: "null",
    selection: runnerTree.marketRunner?.name || "null",
    selectionId: runnerTree.runner?.selectionId?.toString() || "null",
    bettingProduct: ProductsOption.exchange,
  });
};

export const getMyBetsCancelUnmatchedExchangeBetSuccess = (
  action: MyBetsCancelExchangeBetSuccessAction,
): BetslipEvent => {
  const { selectionName, betId } = action.payload;

  return getCancelBetClickEvent(TaggingAction.CANCELLED_BET_SUCCESS, betId, selectionName, "null");
};

export const getMyBetsCancelUnmatchedExchangeBetFailure = (
  action: MyBetsCancelExchangeBetFailureAction,
): BetslipEvent => {
  const { selectionName, betId } = action.payload;

  return getCancelBetClickEvent(TaggingAction.CANCELLED_BET_FAILURE, betId, selectionName, "null");
};

export const getMyBetsCancelAllUnmatchedExchangeBetsSuccess = () =>
  getCancelBetClickEvent(TaggingAction.CANCELLED_ALL_BETS_SUCCESS, "null", "null", "null");

export const getMyBetsCancelAllUnmatchedExchangeBetsFailure = () =>
  getCancelBetClickEvent(TaggingAction.CANCELLED_ALL_BETS_FAILURE, "null", "null", "null");

export const getBetslipBetBuilderRemoveSelections = (): BetslipEvent | null =>
  buildBetslipEvent({
    action: TaggingAction.REMOVED_ALL_SELECTIONS,
    betId: "null",
    selection: "null",
    selectionId: "null",
    bettingProduct: ProductsOption.sportsbook,
  });

export const getBetslipSportsbookLoginToPlaceBetClickEvent = (): BetslipEvent =>
  buildBetslipEvent({
    action: TaggingAction.LOGIN_TO_PLACE_BET,
    betId: "null",
    selection: "null",
    selectionId: "null",
    bettingProduct: ProductsOption.sportsbook,
  });

export const getBetslipExchangeLoginToPlaceBetClickEvent = (): BetslipEvent =>
  buildBetslipEvent({
    action: TaggingAction.LOGIN_TO_PLACE_BET,
    betId: "null",
    selection: "null",
    selectionId: "null",
    bettingProduct: ProductsOption.exchange,
  });

export function getBetslipExchangeRemovePotentialSelectionEvent(
  action: BetslipExcRemovePotentialSelectionAction,
  state: ApplicationState,
): BetslipEvent | null {
  const betslipContext = getBetslipExchangeContext(state);

  if (!betslipContext) {
    return null;
  }

  // Given the fact we only handle one potential bet at a time.
  // This bet is the one that will always get removed / replaced.
  const [potentialBetBeingRemoved] = createExcRunnerPotentialBetsByRunnerURNSelector()(state, betslipContext.runner);

  if (!potentialBetBeingRemoved) {
    return null;
  }

  const runnerTree = getExchangeRunnerTree(state.entities, betslipContext.runner);
  if (!runnerTree) {
    return null;
  }

  return buildBetslipEvent({
    action: TaggingAction.REMOVED_SELECTION,
    betId: "null",
    selection: runnerTree.marketRunner?.name || "null",
    selectionId: runnerTree.runner?.selectionId?.toString() || "null",
    bettingProduct: ProductsOption.exchange,
  });
}

export function getBetslipSportsbookRemovePotentialSelectionEvent(
  action: BetslipSbkRemovePotentialSelectionAction,
  state: ApplicationState,
): BetslipEvent | null {
  const {
    betting: { sportsbookBetting },
  } = state;

  const { urn } = action.payload;
  const bettingResolvers = getBettingResolvers(state.betslip?.group);
  const runnerIdAssociation = bettingResolvers.getMarketRunnerIdAssociation(state.entities, urn);

  const card = getBetslipCard(state);

  if (urn && !card?.taggingMetadata.selections[urn]) return null;

  if (!runnerIdAssociation) return null;

  const runnerId = generateRunnerId(runnerIdAssociation);

  const leg = Object.values(sportsbookBetting.legs).find((currentLeg) => currentLeg.runners.includes(runnerId));

  if (!leg) return null;

  const bettingRunnersMetadata = bettingResolvers.getMetadata(state);
  const metadata = bettingRunnersMetadata[runnerId];

  if (!metadata) return null;

  const runnerMetrics =
    metadata.bettingGroup === "REAL" ? getSportsbookRunnerMetrics(state, urn) : getVirtualRunnerMetrics(state, urn);

  if (!runnerMetrics) {
    return null;
  }

  return buildBetslipEvent({
    action: TaggingAction.REMOVED_SELECTION,
    betId: "null",
    selection: runnerMetrics.selection || "null",
    selectionId: runnerMetrics.selection_id.toString() || "null",
    bettingProduct: ProductsOption.sportsbook,
  });
}
