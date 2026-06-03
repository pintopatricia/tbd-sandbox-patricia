import { MapStateToPropsFactory } from "react-redux";
import { createSelectorCreator, defaultMemoize } from "reselect";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { createEntityByURNSelector } from "@ppb/tbd-store/state/entities/entities-selectors";
import { convertEntityTupleToLegId, isLegInState } from "@ppb/tbd-store/helpers/sportsbook-betting";
import { formatOdds } from "@ppb/tbd-store/helpers/formatters";
import { createSportsbookMarketByURNSelector } from "@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors";
import {
  BettingOpportunityType,
  PopularBettingOpportunities,
  PopularBettingOpportunity,
} from "@ppb/tbd-store/state/entities/popular-betting-opportunities/PopularBettingOpportunity.types";
import { SportsbookOdds } from "@ppb/tbd-store/state/entities/SportsbookOdds.types";
import {
  SubscribeBettingOpportunityPriceUpdates,
  SUBSCRIBE_BETTING_OPPORTUNITY_PRICE_UPDATES,
  UnsubscribeBettingOpportunityPriceUpdates,
  UNSUBSCRIBE_BETTING_OPPORTUNITY_PRICE_UPDATES,
  SubscribeSportsbookMarketUpdatesAction,
  SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
  UnsubscribeSportsbookMarketUpdatesAction,
  UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
} from "@ppb/tbd-store/actions/sportsbook-markets";
import { BettingSportsbookAddSelectionAction, BETTING__SBK_ADD_SELECTIONS } from "@ppb/tbd-store/actions/betting";
import { getUniqueId } from "@ppb/tbd-store/helpers/betting";
import { SportsbookMarkets } from "@ppb/tbd-store/state/entities/sportsbook-markets/SportsbookMarket.types";
import { i18n } from "../../helpers/i18n";
import { LegsOddsMap } from "../Betslip/SportsbookBetslip/sportsbook-betslip-types";

type PopularBetInBetslip = {
  legIds: string[];
  isMultipleOnBetslip: boolean;
  marketsIds: Set<string>;
};

type Selection = {
  marketUrn: URN;
  runnerUrn: URN;
};

type PopularSelection = {
  marketUrn: URN;
  runnerUrn: URN;
  uniqueId: string;
};

export type ContainerProps = {
  cardUrn: URN;
  bettingOpportunityUrn: URN;
  showWasPrice?: boolean;
  short?: boolean;
  visible?: boolean;
  accessibilityLabel?: string;
};

export type CardProps = {
  bettingOpportunityId: string;
  bettingOpportunityType?: BettingOpportunityType;
  isBoostedBet: boolean;
  label: string;
  secondaryLabel?: string;
  isMultipleOnBetslip: boolean;
  popularSelections: PopularSelection[];
  odds?: SportsbookOdds;
  marketsIds: Set<string>;
  isOddsboost: boolean;
  animated: boolean;
  accessibilityHints: { selected: string; default: string };
  accessibilityLabel?: string;
};

export type StateProps = CardProps | Record<string, never>;

function areSelectionSame(
  prev: { sportsbookmarkets: SportsbookMarkets; legs: LegsOddsMap; opportunity: PopularBettingOpportunity },
  next: { sportsbookmarkets: SportsbookMarkets; legs: LegsOddsMap; opportunity: PopularBettingOpportunity },
): boolean {
  const {
    opportunity: { selections: prevSelections },
  } = prev;
  const {
    opportunity: { selections: nextSelections },
  } = next;

  const prevLegs = Object.keys(prev.legs);
  const nextLegs = Object.keys(next.legs);

  return (
    prevSelections?.length === nextSelections?.length &&
    prevSelections?.every((selection, i) => selection.marketUrn === nextSelections[i]?.marketUrn) &&
    prevLegs.length === nextLegs.length &&
    prevLegs.every((pLeg) => nextLegs.some((leg) => leg === pLeg))
  );
}

const createPopularBetInBetslip = () => {
  const getSportsbookMarketByURN = createSportsbookMarketByURNSelector();

  return createSelectorCreator(defaultMemoize, areSelectionSame)(
    (state: ApplicationState, opportunity: PopularBettingOpportunity) => ({
      sportsbookmarkets: state.entities.sportsbookmarkets,
      legs: state.betting.sportsbookBetting.legs,
      opportunity,
    }),
    ({ sportsbookmarkets, legs, opportunity }) =>
      opportunity.selections.reduce<PopularBetInBetslip>(
        (acc, { runnerUrn, marketUrn }) => {
          const market = getSportsbookMarketByURN(sportsbookmarkets, marketUrn);

          if (!market?.marketId) {
            acc.isMultipleOnBetslip = false;
            return acc;
          }

          const runner = market.runners.find((r) => r.urn === runnerUrn);

          if (!runner?.selectionId) {
            acc.isMultipleOnBetslip = false;
            return acc;
          }

          const groupId = opportunity.type === "BOOSTED_BETS" ? opportunity.id : undefined;
          const legId = convertEntityTupleToLegId(market.marketId, runner.selectionId, groupId);

          acc.legIds.push(legId);

          if (!isLegInState(legId, legs)) {
            acc.isMultipleOnBetslip = false;
          }
          acc.marketsIds.add(market.marketId);
          return acc;
        },
        {
          legIds: [],
          isMultipleOnBetslip: true,
          marketsIds: new Set<string>(),
        },
      ),
  );
};

function areSelectionSameId(
  prev: { state: ApplicationState; selections: Selection[] },
  next: { state: ApplicationState; selections: Selection[] },
): boolean {
  return (
    prev.selections?.length === next.selections?.length &&
    prev.selections?.every((selection, i) => selection.marketUrn === next.selections[i]?.marketUrn)
  );
}

const createSelectionUniqueIdSelector = () =>
  createSelectorCreator(defaultMemoize, areSelectionSameId)(
    (state: ApplicationState, selections: Selection[]) => ({ state, selections }),
    ({ state, selections }) => selections.map((selection) => ({ ...selection, uniqueId: getUniqueId(state) })),
  );

const buildAccessibilityLabel = (
  isOddsboostMarketType: boolean | undefined,
  treatedSecondaryLabel: string | undefined,
  label: string,
) => {
  if (isOddsboostMarketType && treatedSecondaryLabel) {
    return i18n({
      key: "I18N.ACCESSIBILITY.BET_BUTTON_ODDSBOOST",
      interpolationValues: {
        previousOdds: treatedSecondaryLabel,
        currentOdds: label,
      },
    });
  }

  if (treatedSecondaryLabel) {
    return `${treatedSecondaryLabel}, ${i18n({
      key: "I18N.ACCESSIBILITY.BET_BUTTON_DEFAULT",
      interpolationValues: { odds: label },
    })}`;
  }

  return i18n({
    key: "I18N.ACCESSIBILITY.BET_BUTTON_DEFAULT",
    interpolationValues: { odds: label },
  });
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getBettingOpportunityByURN = createEntityByURNSelector<PopularBettingOpportunities, URN>();
  const getPopularBetInBetslip = createPopularBetInBetslip();
  const getSelectionsUniqueId = createSelectionUniqueIdSelector();

  return (
    state: ApplicationState,
    { bettingOpportunityUrn, showWasPrice = false, short = false, accessibilityLabel }: ContainerProps,
  ): StateProps => {
    const { sportsbookOddsDisplay } = state.entities.preferences;
    const bettingOpportunity = getBettingOpportunityByURN(
      state.entities.popularbettingopportunities,
      bettingOpportunityUrn,
    );

    if (!bettingOpportunity?.selections.length) {
      return {};
    }

    let odds = "";
    let originalOdds = "";

    if (sportsbookOddsDisplay && bettingOpportunity.odds) {
      odds = formatOdds(bettingOpportunity.odds, sportsbookOddsDisplay);
    }
    if (sportsbookOddsDisplay && bettingOpportunity.originalOdds) {
      originalOdds = formatOdds(bettingOpportunity.originalOdds, sportsbookOddsDisplay);
    }

    const i18nLabels = {
      addToBetslip: i18n({ key: "I18N.POPULAR.ADD_TO_BETSLIP" }),
      addToBetslipAt: i18n({ key: "I18N.POPULAR.ADD_TO_BETSLIP_AT", interpolationValues: { odd: odds } }),
      addedToBetslip: i18n({ key: "I18N.POPULAR.ADDED_TO_BETSLIP" }),
    };

    const { isMultipleOnBetslip, marketsIds } = getPopularBetInBetslip(state, bettingOpportunity);

    const isBoosted = bettingOpportunity.type === "BOOSTED_BETS";
    const animated = state.entities.brandSettings?.SPORTSBOOK_BET_BUTTON_ANIMATION ?? true;

    let label;
    if (isMultipleOnBetslip) {
      label = i18nLabels.addedToBetslip;
    } else {
      const addToBetslipLabel = odds ? i18nLabels.addToBetslipAt : i18nLabels.addToBetslip;
      label = isBoosted ? odds : addToBetslipLabel;
    }

    label = short || isBoosted ? odds : label;
    const secondaryLabel = isBoosted && showWasPrice ? originalOdds : undefined;
    const accessibilityHints = {
      selected: i18n({ key: "I18N.ACCESSIBILITY.REMOVE_FROM_BETSLIP_HINT" }),
      default: i18n({ key: "I18N.ACCESSIBILITY.ADD_TO_BETSLIP_HINT" }),
    };
    const selectionsMapped = getSelectionsUniqueId(state, bettingOpportunity.selections);

    return {
      bettingOpportunityId: bettingOpportunity.id,
      bettingOpportunityType: bettingOpportunity.type ?? undefined,
      label,
      secondaryLabel,
      isMultipleOnBetslip,
      popularSelections: selectionsMapped,
      odds: bettingOpportunity.odds,
      marketsIds,
      isOddsboost: isBoosted && showWasPrice,
      isBoostedBet: isBoosted,
      animated,
      accessibilityHints,
      accessibilityLabel:
        accessibilityLabel ?? buildAccessibilityLabel(isBoosted && showWasPrice, secondaryLabel, label),
    };
  };
};

const dispatchSubscribeBettingOpportunityPrice = (
  bettingOppportunityUrn: URN,
): SubscribeBettingOpportunityPriceUpdates => ({
  type: SUBSCRIBE_BETTING_OPPORTUNITY_PRICE_UPDATES,
  payload: {
    bettingOppportunityUrn,
  },
});

const dispatchUnsubscribeBettingOpportunityPrice = (
  bettingOppportunityUrn: URN,
): UnsubscribeBettingOpportunityPriceUpdates => ({
  type: UNSUBSCRIBE_BETTING_OPPORTUNITY_PRICE_UPDATES,
  payload: {
    bettingOppportunityUrn,
  },
});

const dispatchAddRemoveSelections = (
  selections: Selection[],
  cardUrn: URN,
  odds?: SportsbookOdds,
  bettingOpportunityId?: string,
  bettingOpportunityType?: BettingOpportunityType,
): BettingSportsbookAddSelectionAction => ({
  type: BETTING__SBK_ADD_SELECTIONS,
  payload: {
    selections,
    group: "REAL",
    bettingOpportunityId,
    bettingOpportunityType,
    cardUrn,
    odds,
  },
});

const dispatchSubscribeMarketsUpdates = (
  marketId: string,
  subscriberId: string,
): SubscribeSportsbookMarketUpdatesAction => ({
  type: SUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
  payload: { marketId, subscriberId },
});

const dispatchUnsubscribeMarketsUpdates = (
  marketId: string,
  subscriberId: string,
): UnsubscribeSportsbookMarketUpdatesAction => ({
  type: UNSUBSCRIBE_SPORTSBOOK_MARKET_UPDATES,
  payload: {
    marketId,
    subscriberId,
  },
});

export type DispatchProps = {
  dispatchSubscribeBettingOpportunityPrice: typeof dispatchSubscribeBettingOpportunityPrice;
  dispatchUnsubscribeBettingOpportunityPrice: typeof dispatchUnsubscribeBettingOpportunityPrice;
  dispatchAddRemoveSelections: typeof dispatchAddRemoveSelections;
  dispatchSubscribeMarketsUpdates: typeof dispatchSubscribeMarketsUpdates;
  dispatchUnsubscribeMarketsUpdates: typeof dispatchUnsubscribeMarketsUpdates;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchSubscribeBettingOpportunityPrice,
  dispatchUnsubscribeBettingOpportunityPrice,
  dispatchAddRemoveSelections,
  dispatchSubscribeMarketsUpdates,
  dispatchUnsubscribeMarketsUpdates,
};
