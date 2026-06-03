import { createSelector, ParametricSelector } from "reselect";
import {
  BetCardGroup,
  SwimlaneCardGroup,
  ExpandableCardGroup,
  PebbleCardGroup,
  SegmentedCardGroup,
  SelectableItemsCardGroup,
  SportsbookBetLegCardGroup,
  SportsbookExpandableLegCardGroup,
  GamingCardGroup,
  SwimlaneIndexedCardGroup,
  ByTimeRangeMeetingCardGroup,
  CardGroups,
  AllCardGroups,
  MarketBetCardGroup,
  MarketBetExpandableCardGroup,
  MarketBetSelectionCardGroup,
  BetSharingCardGroup,
  VirtualCardGroup,
  ExtraWalletCardGroup,
  ObbCardGroup,
  HalfTimeSpecialsSwimlaneCardGroup,
  PartialPebbleCardGroup,
  RacingSwimlaneCardGroup,
  PopularSwimlaneCardGroup,
  ObbCreatedBetsCardGroup,
  ObbOnboardingCardsCardGroup,
} from "./CardGroup.types";

import { FutureRacingCardGroup } from "./future-racing-cardgroups/FutureRacingCardgroups.types";
import { RacesByTimeRangeCardGroup } from "./races-by-time-range-cardgroups/RacesByTimeRangeCardGroup.types";
import { FilteredCouponCardGroup } from "./filtered-coupon-cardgroups/FilteredCouponCardGroups.types";
import URN from "../URN";

export function createCardGroupByURNSelector<S, K extends keyof S>(): ParametricSelector<S, K, S[K] | null> {
  return createSelector(
    [(stateSlice: S) => stateSlice, (_: S, urn: K) => urn],
    (cardgroups, urn): S[K] | null => cardgroups?.[urn] ?? null,
  );
}
/**
 * createFindCardGroupByURNSelector
 * For a given cardgroup URN, returns the corresponding cardgroup or null if there's none
 */
export const createFindCardGroupByURNSelector = (): ParametricSelector<CardGroups, URN, AllCardGroups | null> =>
  createSelector(
    [
      (cardgroups: CardGroups, urn: URN) => cardgroups.swimlanecardgroups[urn] || null,
      (cardgroups: CardGroups, urn: URN) => cardgroups.segmentedcardgroups[urn] || null,
      (cardgroups: CardGroups, urn: URN) => cardgroups.expandablecardgroups[urn] || null,
      (cardgroups: CardGroups, urn: URN) => cardgroups.selectableitemscardgroups[urn] || null,
      (cardgroups: CardGroups, urn: URN) => cardgroups.pebblecardgroups[urn] || null,
      (cardgroups: CardGroups, urn: URN) => cardgroups.gamingcardgroups[urn] || null,
      (cardgroups: CardGroups, urn: URN) => cardgroups.futureracingcardgroups[urn] || null,
      (cardgroups: CardGroups, urn: URN) => cardgroups.racesbytimerangecardgroups[urn] || null,
      (cardgroups: CardGroups, urn: URN) => cardgroups.filteredcouponcardgroups[urn] || null,
      (cardgroups: CardGroups, urn: URN) => cardgroups.swimlaneindexedcardgroups[urn] || null,
      (cardgroups: CardGroups, urn: URN) => cardgroups.bytimerangemeetingcardgroup[urn] || null,
      (cardgroups: CardGroups, urn: URN) => cardgroups.betcardgroups[urn] || null,
      (cardgroups: CardGroups, urn: URN) => cardgroups.sportsbookbetlegcardgroups[urn] || null,
      (cardgroups: CardGroups, urn: URN) => cardgroups.sportsbookexpandablelegcardgroups[urn] || null,
      (cardgroups: CardGroups, urn: URN) => cardgroups.marketbetcardgroups[urn] || null,
      (cardgroups: CardGroups, urn: URN) => cardgroups.marketbetselectioncardgroups[urn] || null,
      (cardgroups: CardGroups, urn: URN) => cardgroups.marketbetexpandablecardgroups[urn] || null,
      (cardgroups: CardGroups, urn: URN) => cardgroups.betsharingcardgroups[urn] || null,
      (cardgroups: CardGroups, urn: URN) => cardgroups.virtualcardgroups[urn] || null,
      (cardgroups: CardGroups, urn: URN) => cardgroups.extrawalletcardgroups[urn] || null,
      (cardgroups: CardGroups, urn: URN) => cardgroups.obbcardgroups[urn] || null,
      (cardgroups: CardGroups, urn: URN) => cardgroups.halftimespecialsswimlanecardgroups[urn] || null,
      (cardgroups: CardGroups, urn: URN) => cardgroups.racingswimlanecardgroups[urn] || null,
      (cardgroups: CardGroups, urn: URN) => cardgroups.popularswimlanecardgroups[urn] || null,
      (cardgroups: CardGroups, urn: URN) => cardgroups.obbcreatedbetscardgroups[urn] || null,
      (cardgroups: CardGroups, urn: URN) => cardgroups.obbonboardingcardsgroups[urn] || null,
    ],
    (
      swimlanecardgroup: SwimlaneCardGroup | null,
      segmentedcardgroup: SegmentedCardGroup | null,
      expandablecardgroup: ExpandableCardGroup | null,
      selectableitemscardgroup: SelectableItemsCardGroup | null,
      pebblecardgroup: PebbleCardGroup | PartialPebbleCardGroup | null,
      gamingcardgroup: GamingCardGroup | null,
      futureracingcardgroup: FutureRacingCardGroup | null,
      racesbytimerangecardgroup: RacesByTimeRangeCardGroup | null,
      filteredcouponcardgroup: FilteredCouponCardGroup | null,
      swimlaneindexedcardgroup: SwimlaneIndexedCardGroup | null,
      bytimerangemeetingcardgroup: ByTimeRangeMeetingCardGroup | null,
      betcardgroup: BetCardGroup | null,
      sportsbookbetlegcardgroup: SportsbookBetLegCardGroup | null,
      sportsbookexpandablelegcardgroup: SportsbookExpandableLegCardGroup | null,
      marketbetcardgroup: MarketBetCardGroup | null,
      marketbetselectioncardgroup: MarketBetSelectionCardGroup | null,
      marketbetexpandablecardgroup: MarketBetExpandableCardGroup | null,
      betsharingcardgroup: BetSharingCardGroup | null,
      virtualcardgroup: VirtualCardGroup | null,
      extrawalletcardgroups: ExtraWalletCardGroup | null,
      obbcardgroup: ObbCardGroup | null,
      halftimespecialsswimlanecardgroup: HalfTimeSpecialsSwimlaneCardGroup | null,
      racingswimlanecardgroup: RacingSwimlaneCardGroup | null,
      popularswimlanecardgroup: PopularSwimlaneCardGroup | null,
      obbcreatedbetscardgroup: ObbCreatedBetsCardGroup | null,
      obbonboardingcardsgroup: ObbOnboardingCardsCardGroup | null,
    ): AllCardGroups | null =>
      swimlanecardgroup ||
      segmentedcardgroup ||
      expandablecardgroup ||
      selectableitemscardgroup ||
      pebblecardgroup ||
      gamingcardgroup ||
      futureracingcardgroup ||
      racesbytimerangecardgroup ||
      filteredcouponcardgroup ||
      swimlaneindexedcardgroup ||
      bytimerangemeetingcardgroup ||
      betcardgroup ||
      sportsbookbetlegcardgroup ||
      sportsbookexpandablelegcardgroup ||
      marketbetcardgroup ||
      marketbetselectioncardgroup ||
      marketbetexpandablecardgroup ||
      betsharingcardgroup ||
      virtualcardgroup ||
      extrawalletcardgroups ||
      obbcardgroup ||
      halftimespecialsswimlanecardgroup ||
      racingswimlanecardgroup ||
      popularswimlanecardgroup ||
      obbcreatedbetscardgroup ||
      obbonboardingcardsgroup ||
      null,
  );
