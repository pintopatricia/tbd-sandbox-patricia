import { combineReducers, Reducer } from "redux";
import type {
  BetCardGroup,
  BetSharingCardGroup,
  CardGroups,
  ExpandableCardGroup,
  GamingCardGroup,
  MarketBetCardGroup,
  MarketBetExpandableCardGroup,
  MarketBetSelectionCardGroup,
  SegmentedCardGroup,
  SportsbookBetLegCardGroup,
  SportsbookExpandableLegCardGroup,
  SwimlaneCardGroup,
  SwimlaneIndexedCardGroup,
  ByTimeRangeMeetingCardGroup,
  HalfTimeSpecialsSwimlaneCardGroup,
  RacingSwimlaneCardGroup,
  PopularSwimlaneCardGroup,
  PromotionsHubCardGroup,
  ObbOnboardingCardsCardGroup,
} from "./CardGroup.types";
import filteredCouponCardgroupsReducer from "./filtered-coupon-cardgroups/filtered-coupon-cardgroups-reducer";
import futureRacingCardgroupsReducer from "./future-racing-cardgroups/future-racing-cardgroups-reducer";
import pebbleCardgroupsReducer from "./pebble-cardgroups/pebble-cardgroups-reducer";
import racesByTimeRangeCardgroupsReducer from "./races-by-time-range-cardgroups/races-by-time-range-cardgroups-reducer";
import selectableItemsCardgroupsReducer from "./selectable-items-cardgroups/selectable-items-cardgroups-reducer";
import createCardGroupsReducer from "./create-card-group-reducer";
import virtualCardgroupsReducer from "./virtual-cardgroups/virtual-cardgroups-reducer";
import extraWalletCardgroupsReducer from "./extra-wallet-cardgroups/extra-wallet-cardgroups-reducer";
import sportsRibbonCardgroupsReducer from "./sports-ribbon-cardgroups/sports-ribbon-cardgroups-reducer";
import obbCardGroupsReducer from "./obb-cardgroups/obb-cardgroups-reducer";
import obbCreatedBetsCardGroupsReducer from "./obb-created-bets-cardgroups/obb-created-bets-cardgroups-reducer";

const cardGroupsReducer: Reducer<CardGroups> = combineReducers<CardGroups>({
  betcardgroups: createCardGroupsReducer<BetCardGroup>("BetCardGroup"),
  betsharingcardgroups: createCardGroupsReducer<BetSharingCardGroup>("BetSharingCardGroup"),
  swimlanecardgroups: createCardGroupsReducer<SwimlaneCardGroup>("SwimlaneCardGroup"),
  segmentedcardgroups: createCardGroupsReducer<SegmentedCardGroup>("SegmentedCardGroup"),
  pebblecardgroups: pebbleCardgroupsReducer,
  virtualcardgroups: virtualCardgroupsReducer,
  filteredcouponcardgroups: filteredCouponCardgroupsReducer,
  futureracingcardgroups: futureRacingCardgroupsReducer,
  racesbytimerangecardgroups: racesByTimeRangeCardgroupsReducer,
  sportsbookbetlegcardgroups: createCardGroupsReducer<SportsbookBetLegCardGroup>("SportsbookBetLegCardGroup"),
  sportsbookexpandablelegcardgroups: createCardGroupsReducer<SportsbookExpandableLegCardGroup>(
    "SportsbookExpandableLegCardGroup",
  ),
  expandablecardgroups: createCardGroupsReducer<ExpandableCardGroup>("ExpandableCardGroup"),
  gamingcardgroups: createCardGroupsReducer<GamingCardGroup>("GamingCardGroup"),
  swimlaneindexedcardgroups: createCardGroupsReducer<SwimlaneIndexedCardGroup>("SwimlaneIndexedCardGroup"),
  bytimerangemeetingcardgroup: createCardGroupsReducer<ByTimeRangeMeetingCardGroup>("ByTimeRangeMeetingCardGroup"),
  selectableitemscardgroups: selectableItemsCardgroupsReducer,
  sportribboncardgroups: sportsRibbonCardgroupsReducer,
  marketbetcardgroups: createCardGroupsReducer<MarketBetCardGroup>("MarketBetCardGroup"),
  marketbetselectioncardgroups: createCardGroupsReducer<MarketBetSelectionCardGroup>("MarketBetSelectionCardGroup"),
  marketbetexpandablecardgroups: createCardGroupsReducer<MarketBetExpandableCardGroup>("MarketBetExpandableCardGroup"),
  extrawalletcardgroups: extraWalletCardgroupsReducer,
  obbcardgroups: obbCardGroupsReducer,
  halftimespecialsswimlanecardgroups: createCardGroupsReducer<HalfTimeSpecialsSwimlaneCardGroup>(
    "HalfTimeSpecialsSwimlaneCardGroup",
  ),
  racingswimlanecardgroups: createCardGroupsReducer<RacingSwimlaneCardGroup>("RacingSwimlaneCardGroup"),
  popularswimlanecardgroups: createCardGroupsReducer<PopularSwimlaneCardGroup>("PopularSwimlaneCardGroup"),
  obbcreatedbetscardgroups: obbCreatedBetsCardGroupsReducer,
  promotionshubcardgroups: createCardGroupsReducer<PromotionsHubCardGroup>("PromotionsHubCardGroup"),
  obbonboardingcardsgroups: createCardGroupsReducer<ObbOnboardingCardsCardGroup>("ObbOnboardingCardsCardGroup"),
});

export default cardGroupsReducer;
