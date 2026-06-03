import { FunctionComponent, Fragment } from "react";
import * as React from "react";
import StatsFormCard from "@ppb/tbd-components-rich-data/components/StatsFormCard/view/StatsFormCard.native";
import StatsHeadToHeadCard from "@ppb/tbd-components-rich-data/components/StatsHeadToHeadCard/view/StatsHeadToHeadCard.native";
import LottoCard from "@ppb/tbd-components-sports-betting/components/LottoCard/view/LottoCard.native";
import GenericSwitcherCard from "@ppb/tbd-components-navigation/components/GenericSwitcherCard/view/GenericSwitcherCard.native";
import GenericSwitcherCardPlaceholder from "@ppb/tbd-components-navigation/components/GenericSwitcherCard/view/GenericSwitcherCardPlaceholder.native";
import RaceSwitcherCard from "@ppb/tbd-components-navigation/components/RaceSwitcherCard/view/RaceSwitcherCard.native";
import RaceSwitcherCardPlaceholder from "@ppb/tbd-components-navigation/components/RaceSwitcherCard/view/RaceSwitcherCardPlaceholder.native";
import StatsTeamsCard from "@ppb/tbd-components-rich-data/components/StatsTeamsCard/view/StatsTeamsCard.native";
import StatsGoalsAndShotsCard from "@ppb/tbd-components-rich-data/components/StatsGoalsAndShotsCard/view/StatsGoalsAndShotsCard.native";
import LoyaltyPromoCardPlaceholder from "@ppb/tbd-components-promotions/components/LoyaltyPromoCard/view/LoyaltyPromoCardPlaceholder.native";
import MiniPromotionCardPlaceholder from "@ppb/tbd-components-promotions/components/LoyaltyPromoCard/view/MiniPromotionCardPlaceholder.native";
import EditorialPromoCardPlaceholder from "@ppb/tbd-components-promotions/components/EditorialPromoCard/view/EditorialPromoCardPlaceholder.native";
import BetOpportunityPromoCardPlaceholder from "@ppb/tbd-components-promotions/components/BetOpportunityPromoCard/view/BetOpportunityPromoCardPlaceholder.native";
import SelectionPromoCard from "@ppb/tbd-components-promotions/components/SelectionPromoCard/view/SelectionPromoCard.native";
import SelectionPromoCardPlaceholder from "@ppb/tbd-components-promotions/components/SelectionPromoCard/view/SelectionPromoCardPlaceholder.native";
import LottoCardPlaceholder from "@ppb/tbd-components-sports-betting/components/LottoCard/view/LottoCardPlaceholder.native";
import PopularSelectionsCard from "@ppb/tbd-components-sports-betting/components/PopularSelectionsCard/view/PopularSelectionsCard.native";
import PopularSelectionsCardPlaceholder from "@ppb/tbd-components-sports-betting/components/PopularSelectionsCard/view/PopularSelectionsCardPlaceholder.native";
import SportsbookLotteriesBetLegCardGroup from "@ppb/tbd-components-my-bets/components/SportsbookLotteriesBetLegCardGroup/view/SportsbookLotteriesBetLegCardGroup.native";
import SportsbookLotteriesBetLegCardGroupPlaceholder from "@ppb/tbd-components-my-bets/components/SportsbookLotteriesBetLegCardGroup/view/SportsbookLotteriesBetLegCardGroupPlaceholder.native";
import PriceBoostMultiplePromoCard from "@ppb/tbd-components-promotions/components/PriceBoostMultiplePromoCard/view/PriceBoostMultiplePromoCard.native";
import PriceBoostMultiplePromoCardPlaceholder from "@ppb/tbd-components-promotions/components/PriceBoostMultiplePromoCard/view/PriceBoostMultiplePromoCardPlaceholder.native";
import StatsLineupsCard from "@ppb/tbd-components-rich-data/components/StatsLineupsCard/view/StatsLineupsCard.native";
import TeamLineupCard from "@ppb/tbd-components-rich-data/components/TeamLineupCard/view/TeamLineupCard.native";
import SportsbookChatbotCardPlaceholder from "@ppb/tbd-components-sports-betting/components/SportsbookChatbot/view/snowflakes/SportsbookChatbotPlaceholder/SportsbookChatbotPlaceholder.native";
import PenaltyTakersCard from "@ppb/tbd-components-sports-betting/components/PenaltyTakersCard/view/PenaltyTakersCard.native";
import PenaltyTakersCardPlaceholder from "@ppb/tbd-components-sports-betting/components/PenaltyTakersCard/view/PenaltyTakersCardPlaceholder.native";

import { CardWhiteList, ComponentProps } from "./props";
import { MakeMeAgnosticComponent, MakeMeAgnosticConnected } from "./MakeMeAgnostic";

import Placeholder from "./DefaultPlaceholder.native";
import EventViewLinkCardPlaceholder from "../EventViewLinkCard/EventViewLinkCardPlaceholder.native";
import EventHeaderCardPlaceholder from "../EventHeaderCard/EventHeaderCardPlaceholder.native";
import RaceViewLinkCardPlaceholder from "../RaceViewLinkCard/RaceViewLinkCardPlaceholder.native";
import RaceViewLinksCardPlaceholder from "../RaceViewLinksCard/RaceViewLinksCardPlaceholder.native";
import GameCardPlaceholder from "../GameCard/GameCardPlaceholder.native";
import GamingLinkCardPlaceholder from "../GamingLinkCard/GamingLinkCardPlaceholder.native";
import HighlightedSelectionCardPlaceholder from "../HighlightedSelectionCard/HighlightedSelectionCardPlaceholder.native";
import MatchStatSelectionCardPlaceholder from "../MatchStatSelectionCard/MatchStatSelectionCardPlaceholder.native";
import SportsbookBetCardPlaceholder from "../SportsbookBetCard/SportsbookBetCardPlaceholder.native";
import SportViewLinkCardPlaceholder from "../SportViewLinkCard/SportViewLinkCardPlaceholder.native";
import CompetitionRegionCardPlaceholder from "../CompetitionRegionCard/CompetitionRegionCardPlaceholder.native";
import RaceByTimeRangeCardPlaceholder from "../RaceByTimeRangeCard/RaceByTimeRangeCardPlaceholder.native";
import CouponHeaderCardPlaceholder from "../CouponHeaderCard/CouponHeaderCardPlaceholder.native";
import GridCardPlaceholder from "../GridCard/GridCardPlaceholder.native";
import ExpandableMarketCardPlaceholder from "../ExpandableMarketCard/ExpandableMarketCardPlaceholder.native";
import CorrectScoreCardPlaceholder from "../CorrectScoreCard/CorrectScoreCardPlaceholder.native";
import MarketCardPlaceholder from "../MarketCard/MarketCardPlaceholder.native";
import BroadcastsAndStatisticsCardPlaceholder from "../BroadcastsAndStatisticsCard/BroadcastsAndStatisticsCardPlaceholder.native";
import TimeFormBroadCastsCardPlaceholder from "../TimeFormBroadCastsCard/TimeFormBroadCastsCardPlaceholder.native";
import EventMarketCardPlaceholder from "../EventMarketCard/EventMarketCardPlaceholder.native";
import CompetitionViewLinkCardPlaceholder from "../CompetitionViewLinkCard/CompetitionViewLinkCardPlaceholder.native";
import FixtureCardPlaceholder from "../FixtureCard/FixtureCardPlaceholder.native";
import { ErrorBoundary } from "../ErrorBoundary/ErrorBoundary";
import MonterosaContent from "../MonterosaContentCard/view/MonterosaContent.native";

import ConnectedMarketCard from "../MarketCard";
import ConnectedEventViewLinkCard from "../EventViewLinkCard";
import ConnectedEventMarketCard from "../EventMarketCard";
import ConnectedSportsbookBetCard from "../SportsbookBetCard";
import ConnectedQuickLinksCard from "../QuickLinksCard";
import ConnectedRaceMarketCard from "../RaceMarketCard";
import ConnectedFixtureCard from "../FixtureCard";
import ConnectedEventHeaderCard from "../EventHeaderCard";
import ConnectedRaceDetailsCard from "../RaceDetailsCard";
import ConnectedRaceResultsCard from "../RaceResultsCard";
import ConnectedMarketExtendedCard from "../MarketExtendedCard";
import ConnectedRaceViewLinksCard from "../RaceViewLinksCard";
import ConnectedRaceViewLinkCard from "../RaceViewLinkCard";
import ConnectedMarketRulesCard from "../MarketRulesCard";
import ConnectedMatchStatsCard from "../MatchStatsCard";
import ConnectedEventStatsCard from "../EventStatsCard";
import ConnectedHeadToHeadCard from "../HeadToHeadCard";
import ConnectedHighlightedSelectionCard from "../HighlightedSelectionCard";
import ConnectedMatchStatSelectionCard from "../MatchStatSelectionCard";
import ConnectedPromotionCard from "../PromotionCard";
import ConnectedPackagedCreatedBetsCard from "../PackagedCreatedBetsCard";
import ConnectedPriceBoostMultisListCard from "../PriceBoostMultisListCard";
import ConnectedRecentFormCard from "../RecentFormCard";
import ConnectedGameCard from "../GameCard";
import ConnectedGameInfoCard from "../GameInfo";
import ConnectedGamingLinkCard from "../GamingLinkCard";
import ConnectedRunnerInfoCard from "../RunnerInfoCard";
import ConnectedRegulatoryCard from "../RegulatoryCard";
import ConnectedMatchTimelineCard from "../MatchTimelineCard";
import ConnectedSportViewLinkCard from "../SportViewLinkCard";
import ConnectedPreferenceSingleChoiceCard from "../PreferenceSingleChoiceCard";
import ConnectedRaceByTimeRangeCard from "../RaceByTimeRangeCard";
import ConnectedForbiddenContentCard from "../ForbiddenContentCard";
import ConnectedBroadcastsCard from "../BroadcastsCard";
import ConnectedSportsbookBetLegCard from "../SportsbookBetLegCard";
import ConnectedGenericViewLinkCard from "../GenericViewLinkCard";
import ConnectedCompetitionRegionCard from "../CompetitionRegionCard";
import ConnectedCompetitionViewLinkCard from "../CompetitionViewLinkCard";
import ConnectedCouponHeaderCard from "../CouponHeaderCard";
import ConnectedTimeFormBroadCastsCard from "../TimeFormBroadCastsCard";
import ConnectedVirtualEventDetailsCard from "../VirtualEventDetailsCard";
import ConnectedGridCard from "../GridCard";
import ConnectedExpandableMarketCard from "../ExpandableMarketCard";
import ConnectedVirtualMarketCard from "../VirtualMarketCard";
import ConnectedPopularBetBuilderCard from "../PopularBetBuilderCard";
import ConnectedCorrectScoreCard from "../CorrectScoreCard";
import ConnectedBroadcastsAndStatisticsCard from "../BroadcastsAndStatisticsCard";
import ConnectedOutrightMarketListCard from "../OutrightMarketListCard";
import ConnectedSportsbookBetInfoCard from "../SportsbookBetInfoCard";
import ConnectedMarketBetCard from "../MarketBetCard";
import ConnectedMarketBetSelectionCard from "../MarketBetSelectionCard";
import ConnectedSearchBarCard from "../SearchBarCard";
import ConnectedExtraWalletCard from "../ExtraWalletCard";
import ConnectedObbCardGroupCard from "../ObbCardGroup";
import ConnectedObbCreatedBetsCardGroupCard from "../ObbCreatedBetsCardGroup";
import ConnectedEventPopularsCard from "../ObbEventPopularsCard";
import ConnectedObbOnboardingCardsCardGroupCard from "../ObbOnboardingCardsCardGroup";

import MarketCard from "../MarketCard/MarketCard.native";
import EmbeddedViewCard from "../EmbeddedViewCard/EmbeddedViewCard.native";
import EventViewLinkCard from "../EventViewLinkCard/EventViewLinkCard.native";
import EventMarketCard from "../EventMarketCard/EventMarketCard.native";
import SportsbookBetCard from "../SportsbookBetCard/SportsbookBetCard.native";
import QuickLinksCard from "../QuickLinksCard/QuickLinksCard.native";
import RaceMarketCard from "../RaceMarketCard/RaceMarketCard.native";
import FixtureCard from "../FixtureCard/FixtureCard.native";
import EventHeaderCard from "../EventHeaderCard/EventHeaderCard.native";
import RaceDetailsCard from "../RaceDetailsCard/RaceDetailsCard.native";
import RaceDetailsCardPlaceholder from "../RaceDetailsCard/RaceDetailsCardPlaceholder.native";
import RaceResultsCard from "../RaceResultsCard/RaceResultsCard.native";
import MarketExtendedCard from "../MarketExtendedCard/MarketExtendedCard.native";
import MarketExtendedCardPlaceholder from "../MarketExtendedCard/MarketExtendedCardPlaceholder.native";
import RaceViewLinksCard from "../RaceViewLinksCard/RaceViewLinksCard.native";
import RaceViewLinkCard from "../RaceViewLinkCard/RaceViewLinkCard.native";
import MarketRulesCard from "../MarketRulesCard/MarketRulesCard.native";
import MatchStatsCard from "../MatchStatsCard/MatchStatsCard.native";
import EventStatsCard from "../EventStatsCard/EventStatsCard.native";
import RecentFormCard from "../RecentFormCard/RecentFormCard.native";
import HeadToHeadCard from "../HeadToHeadCard/HeadToHeadCard.native";
import HighlightedSelectionCard from "../HighlightedSelectionCard/HighlightedSelectionCard.native";
import MatchStatSelectionCard from "../MatchStatSelectionCard/MatchStatSelectionCard.native";
import PromotionCard from "../PromotionCard/PromotionCard.native";
import GameCard from "../GameCard/GameCard.native";
import GameInfo from "../GameInfo/GameInfo.native";
import GameInfoPlaceholder from "../GameInfo/snowflakes/GameInfo/GameInfoPlaceholder.native";
import GamingLinkCard from "../GamingLinkCard/GamingLinkCard.native";
import RunnerInfoCard from "../RunnerInfoCard/RunnerInfoCard.native";
import RegulatoryCard from "../RegulatoryCard/RegulatoryCard.native";
import MatchTimelineCard from "../MatchTimelineCard/MatchTimelineCard.native";
import SportViewLinkCard from "../SportViewLinkCard/SportViewLinkCard.native";
import PreferenceSingleChoiceCard from "../PreferenceSingleChoiceCard/PreferenceSingleChoiceCard.native";
import RaceByTimeRangeCard from "../RaceByTimeRangeCard/RaceByTimeRangeCard.native";
import ForbiddenContentCard from "../ForbiddenContentCard/ForbiddenContentCard.native";
import BroadcastsCard from "../BroadcastsCard/BroadcastsCard.native";
import SportsbookBetLegCard from "../SportsbookBetLegCard/SportsbookBetLegCard.native";
import GenericViewLinkCard from "../GenericViewLinkCard/GenericViewLinkCard.native";
import CompetitionRegionCard from "../CompetitionRegionCard/CompetitionRegionCard.native";
import CompetitionViewLinkCard from "../CompetitionViewLinkCard/CompetitionViewLinkCard.native";
import CouponHeaderCard from "../CouponHeaderCard/CouponHeaderCard.native";
import TimeFormBroadCastsCard from "../TimeFormBroadCastsCard/TimeFormBroadCastsCard.native";
import VirtualEventDetailsCard from "../VirtualEventDetailsCard/VirtualEventDetailsCard.native";
import GridCard from "../GridCard/GridCard.native";
import ExpandableMarketCard from "../ExpandableMarketCard/ExpandableMarketCard.native";
import VirtualMarketCard from "../VirtualMarketCard/VirtualMarketCard.native";
import PopularBetBuilderCard from "../PopularBetBuilderCard/PopularBetBuilderCard.native";
import CorrectScoreCard from "../CorrectScoreCard/CorrectScoreCard.native";
import BroadcastsAndStatisticsCard from "../BroadcastsAndStatisticsCard/BroadcastsAndStatisticsCard.native";
import OutrightMarketListCard from "../OutrightMarketListCard/OutrightMarketListCard.native";
import SportsbookBetInfoCard from "../SportsbookBetInfoCard/SportsbookBetInfoCard.native";
import MarketBetCard from "../MarketBetCard/MarketBetCard.native";
import MarketBetSelectionCard from "../MarketBetSelectionCard/MarketBetSelectionCard.native";
import EmbeddedContentCard from "../EmbeddedContentCard/EmbeddedContentCard.native";
import SearchBarCard from "../SearchBarCard/SearchBarCard.native";
import StatsPlayersSeasonStatsCard from "../StatsPlayersSeasonStatsCard/view/StatsPlayersSeasonStatsCard.native";
import StatsMatchStatsCard from "@ppb/tbd-components-rich-data/components/StatsMatchStatsCard/view/StatsMatchStatsCard.native";
import IncidentsCard from "@ppb/tbd-components-rich-data/components/IncidentsCard/view/IncidentsCard.native";
import StatsPlayersInPlayCard from "../StatsPlayersInPlayCard/view/StatsPlayersInPlayCard.native";
import StatsLeagueTableCard from "@ppb/tbd-components-rich-data/components/StatsLeagueTableCard/view/StatsLeagueTableCard.native";
import PackagedCreatedBetsCard from "../PackagedCreatedBetsCard/PackagedCreatedBetsCard.native";
import PriceBoostMultisListCard from "../PriceBoostMultisListCard/PriceBoostMultisListCard.native";
import ExtraWalletCard from "../ExtraWalletCard/ExtraWalletCard.native";
import ObbCardGroup from "../ObbCardGroup/ObbCardGroup.native";
import ObbCreatedBetsCardGroup from "../ObbCreatedBetsCardGroup/ObbCreatedBetsCardGroup.native";
import ObbOnboardingCardsCardGroup from "../ObbOnboardingCardsCardGroup/ObbOnboardingCardsCardGroup.native";
import SelfExclusionCard from "@ppb/tbd-components-navigation/components/SelfExclusionCard/view/SelfExclusionCard.native";
import ObbEventPopularsCard from "../ObbEventPopularsCard/ObbEventPopularsCard.native";
import ObbCardGroupPlaceholder from "../ObbCardGroup/ObbCardGroupPlaceholder.native";
import StatsBroadcastsCard from "@ppb/tbd-components-rich-data/components/StatsBroadcastsCard/view/StatsBroadcastsCard.native";
import StatsRaceResultsCard from "../StatsRaceResultsCard/view/StatsRaceResultsCard.native";
import SportsbookBetLegCardPlaceholder from "../SportsbookBetLegCard/SportsbookBetLegCardPlaceholder.native";
import QuickLinksCardPlaceholder from "../QuickLinksCard/QuickLinksCardPlaceholder.native";
import RegulatoryCardPlaceholder from "../RegulatoryCard/RegulatoryCardPlaceholder.native";
import RaceResultsCardPlaceholder from "../RaceResultsCard/RaceResultsCardPlaceholder.native";
import RaceMarketCardPlaceholder from "../RaceMarketCard/RaceMarketCardPlaceholder.native";
import BroadcastsCardPlaceholder from "../BroadcastsCard/BroadcastsCardPlaceholder.native";
import EmbeddedViewCardPlaceholder from "@ppb/tbd-components-regulatory-and-utils/components/EmbeddedViewCard/view/EmbeddedViewCardPlaceholder.native";
import MiniPromoBannerCard from "../Promos/MiniPromotionCard.native";
import LoyaltyPromoCard from "../Promos/LoyaltyPromoCard.native";
import EditorialPromoCard from "../Promos/EditorialPromoCard.native";
import BetOpportunityPromoCard from "../Promos/BetOpportunityPromoCard.native";
import ObbCreatedBetsCardGroupPlaceholder from "../ObbCreatedBetsCardGroup/placeholder/ObbCreatedBetsCardGroupPlaceholder.native";
import ObbEventPopularsCardPlaceholder from "../ObbEventPopularsCard/placeholder/ObbEventPopularsCardPlaceholder.native";
import SportsbookChatbotCard from "../SportsbookChatbotCard/SportsbookChatbotCard.native";
import ObbOnboardingCardsCardGroupPlaceholder from "../ObbOnboardingCardsCardGroup/placeholder/ObbOnboardingCardsCardGroupPlaceholder.native";

export type MigratedCardWhiteList = {
  [key: string]: {
    component: React.FunctionComponent<{ urn: string; visible?: boolean }>;
    placeholder?: React.FunctionComponent<any>;
  };
};

type ConnectedCardsList =
  | typeof ConnectedMarketCard
  | typeof ConnectedSportsbookBetCard
  | typeof ConnectedEventMarketCard
  | typeof ConnectedEventViewLinkCard
  | typeof ConnectedQuickLinksCard
  | typeof ConnectedRaceMarketCard
  | typeof ConnectedFixtureCard
  | typeof ConnectedEventHeaderCard
  | typeof ConnectedRaceDetailsCard
  | typeof ConnectedRaceResultsCard
  | typeof ConnectedMarketExtendedCard
  | typeof ConnectedRaceViewLinksCard
  | typeof ConnectedRaceViewLinkCard
  | typeof ConnectedMarketRulesCard
  | typeof ConnectedMatchStatsCard
  | typeof ConnectedEventStatsCard
  | typeof ConnectedRecentFormCard
  | typeof ConnectedHeadToHeadCard
  | typeof ConnectedHighlightedSelectionCard
  | typeof ConnectedMatchStatSelectionCard
  | typeof ConnectedPromotionCard
  | typeof ConnectedGameCard
  | typeof ConnectedGameInfoCard
  | typeof ConnectedGamingLinkCard
  | typeof ConnectedRunnerInfoCard
  | typeof ConnectedRegulatoryCard
  | typeof ConnectedMatchTimelineCard
  | typeof ConnectedSportViewLinkCard
  | typeof ConnectedPreferenceSingleChoiceCard
  | typeof ConnectedRaceByTimeRangeCard
  | typeof ConnectedForbiddenContentCard
  | typeof ConnectedBroadcastsCard
  | typeof ConnectedSportsbookBetLegCard
  | typeof ConnectedGenericViewLinkCard
  | typeof ConnectedCompetitionRegionCard
  | typeof ConnectedCompetitionViewLinkCard
  | typeof ConnectedCouponHeaderCard
  | typeof ConnectedTimeFormBroadCastsCard
  | typeof ConnectedVirtualEventDetailsCard
  | typeof ConnectedGridCard
  | typeof ConnectedExpandableMarketCard
  | typeof ConnectedVirtualMarketCard
  | typeof ConnectedPopularBetBuilderCard
  | typeof ConnectedCorrectScoreCard
  | typeof ConnectedBroadcastsAndStatisticsCard
  | typeof ConnectedOutrightMarketListCard
  | typeof ConnectedSportsbookBetInfoCard
  | typeof ConnectedMarketBetCard
  | typeof ConnectedMarketBetSelectionCard
  | typeof MakeMeAgnosticConnected
  | typeof ConnectedSearchBarCard
  | typeof ConnectedPackagedCreatedBetsCard
  | typeof ConnectedPriceBoostMultisListCard
  | typeof ConnectedExtraWalletCard
  | typeof ConnectedObbCardGroupCard
  | typeof ConnectedObbCreatedBetsCardGroupCard
  | typeof ConnectedEventPopularsCard
  | typeof ConnectedObbOnboardingCardsCardGroupCard;

/**
 * This contains the list of Native Visual components for each type of Card
 * They will be added here during the refactor of each of the connected cards
 */
export const cardWhiteList: CardWhiteList<ConnectedCardsList> = {
  FixtureCard: {
    connected: ConnectedFixtureCard,
    component: FixtureCard,
    placeholder: FixtureCardPlaceholder,
  },
  EventHeaderCard: {
    connected: ConnectedEventHeaderCard,
    component: EventHeaderCard,
    placeholder: EventHeaderCardPlaceholder,
  },
  MarketCard: {
    connected: ConnectedMarketCard,
    component: MarketCard,
    placeholder: MarketCardPlaceholder,
  },
  EventMarketCard: {
    connected: ConnectedEventMarketCard,
    component: EventMarketCard,
    placeholder: EventMarketCardPlaceholder,
  },
  HeadToHeadCard: { connected: ConnectedHeadToHeadCard, component: HeadToHeadCard },
  TeamFormCard: { connected: ConnectedRecentFormCard, component: RecentFormCard },
  MatchTimelineCard: { connected: ConnectedMatchTimelineCard, component: MatchTimelineCard },
  MatchStatsCard: { connected: ConnectedMatchStatsCard, component: MatchStatsCard },
  EventStatsCard: { connected: ConnectedEventStatsCard, component: EventStatsCard },
  CompetitionViewLinkCard: {
    connected: ConnectedCompetitionViewLinkCard,
    component: CompetitionViewLinkCard,
    placeholder: CompetitionViewLinkCardPlaceholder,
  },
  QuickLinksCard: {
    connected: ConnectedQuickLinksCard,
    component: QuickLinksCard,
    placeholder: QuickLinksCardPlaceholder,
  },
  PromotionCard: { connected: ConnectedPromotionCard, component: PromotionCard },
  MarketExtendedCard: {
    connected: ConnectedMarketExtendedCard,
    component: MarketExtendedCard,
    placeholder: MarketExtendedCardPlaceholder,
  },
  RaceMarketCard: {
    connected: ConnectedRaceMarketCard,
    component: RaceMarketCard,
    placeholder: RaceMarketCardPlaceholder,
  },
  RaceDetailsCard: {
    connected: ConnectedRaceDetailsCard,
    component: RaceDetailsCard,
    placeholder: RaceDetailsCardPlaceholder,
  },
  RaceResultsCard: {
    connected: ConnectedRaceResultsCard,
    component: RaceResultsCard,
    placeholder: RaceResultsCardPlaceholder,
  },
  EventViewLinkCard: {
    connected: ConnectedEventViewLinkCard,
    component: EventViewLinkCard,
    placeholder: EventViewLinkCardPlaceholder,
  },
  MarketViewLinkCard: { connected: MakeMeAgnosticConnected, component: MakeMeAgnosticComponent },
  MarketRulesCard: { connected: ConnectedMarketRulesCard, component: MarketRulesCard },
  SportsbookBetCard: {
    connected: ConnectedSportsbookBetCard,
    component: SportsbookBetCard,
    placeholder: SportsbookBetCardPlaceholder,
  },
  HighlightedSelectionCard: {
    connected: ConnectedHighlightedSelectionCard,
    component: HighlightedSelectionCard,
    placeholder: HighlightedSelectionCardPlaceholder,
  },
  MatchStatSelectionCard: {
    connected: ConnectedMatchStatSelectionCard,
    component: MatchStatSelectionCard,
    placeholder: MatchStatSelectionCardPlaceholder,
  },
  RaceViewLinksCard: {
    connected: ConnectedRaceViewLinksCard,
    component: RaceViewLinksCard,
    placeholder: RaceViewLinksCardPlaceholder,
  },
  RaceViewLinkCard: {
    connected: ConnectedRaceViewLinkCard,
    component: RaceViewLinkCard,
    placeholder: RaceViewLinkCardPlaceholder,
  },
  RegulatoryCard: {
    connected: ConnectedRegulatoryCard,
    component: RegulatoryCard,
    placeholder: RegulatoryCardPlaceholder,
  },
  GameCard: {
    connected: ConnectedGameCard,
    component: GameCard,
    placeholder: GameCardPlaceholder,
  },
  GameInfoCard: {
    connected: ConnectedGameInfoCard,
    component: GameInfo,
    placeholder: GameInfoPlaceholder,
  },
  GamingLinkCard: {
    connected: ConnectedGamingLinkCard,
    component: GamingLinkCard,
    placeholder: GamingLinkCardPlaceholder,
  },
  RunnerInfoCard: { connected: ConnectedRunnerInfoCard, component: RunnerInfoCard },
  SportViewLinkCard: {
    connected: ConnectedSportViewLinkCard,
    component: SportViewLinkCard,
    placeholder: SportViewLinkCardPlaceholder,
  },
  PreferenceSingleChoiceCard: {
    connected: ConnectedPreferenceSingleChoiceCard,
    component: PreferenceSingleChoiceCard,
  },
  RaceByTimeRangeCard: {
    connected: ConnectedRaceByTimeRangeCard,
    component: RaceByTimeRangeCard,
    placeholder: RaceByTimeRangeCardPlaceholder,
  },
  ForbiddenContentCard: {
    connected: ConnectedForbiddenContentCard,
    component: ForbiddenContentCard,
  },
  BroadcastsCard: {
    connected: ConnectedBroadcastsCard,
    component: BroadcastsCard,
    placeholder: BroadcastsCardPlaceholder,
  },
  BetLegCard: {
    connected: ConnectedSportsbookBetLegCard,
    component: SportsbookBetLegCard,
    placeholder: SportsbookBetLegCardPlaceholder,
  },
  CompetitionRegionCard: {
    connected: ConnectedCompetitionRegionCard,
    component: CompetitionRegionCard,
    placeholder: CompetitionRegionCardPlaceholder,
  },
  GenericViewLinkCard: {
    connected: ConnectedGenericViewLinkCard,
    component: GenericViewLinkCard,
  },
  CouponHeaderCard: {
    connected: ConnectedCouponHeaderCard,
    component: CouponHeaderCard,
    placeholder: CouponHeaderCardPlaceholder,
  },
  TimeFormBroadCastsCard: {
    connected: ConnectedTimeFormBroadCastsCard,
    component: TimeFormBroadCastsCard,
    placeholder: TimeFormBroadCastsCardPlaceholder,
  },
  VirtualEventDetailsCard: {
    connected: ConnectedVirtualEventDetailsCard,
    component: VirtualEventDetailsCard,
  },
  GridCard: {
    connected: ConnectedGridCard,
    component: GridCard,
    placeholder: GridCardPlaceholder,
  },
  ExpandableMarketCard: {
    connected: ConnectedExpandableMarketCard,
    component: ExpandableMarketCard,
    placeholder: ExpandableMarketCardPlaceholder,
  },
  VirtualMarketCard: {
    connected: ConnectedVirtualMarketCard,
    component: VirtualMarketCard,
  },
  PopularBetBuilderCard: {
    connected: ConnectedPopularBetBuilderCard,
    component: PopularBetBuilderCard,
  },
  PriceBoostMultisCard: {
    connected: ConnectedPopularBetBuilderCard,
    component: PopularBetBuilderCard,
  },
  CorrectScoreCard: {
    connected: ConnectedCorrectScoreCard,
    component: CorrectScoreCard,
    placeholder: CorrectScoreCardPlaceholder,
  },
  BroadcastsAndStatisticsCard: {
    connected: ConnectedBroadcastsAndStatisticsCard,
    component: BroadcastsAndStatisticsCard,
    placeholder: BroadcastsAndStatisticsCardPlaceholder,
  },
  OutrightMarketListCard: {
    connected: ConnectedOutrightMarketListCard,
    component: OutrightMarketListCard,
  },
  PopularMultiplesBetBuilderCard: {
    connected: ConnectedPopularBetBuilderCard,
    component: PopularBetBuilderCard,
  },
  SportsbookBetInfoCard: {
    connected: ConnectedSportsbookBetInfoCard,
    component: SportsbookBetInfoCard,
  },
  PackagedCreatedBetsCard: {
    connected: ConnectedPackagedCreatedBetsCard,
    component: PackagedCreatedBetsCard,
  },
  PriceBoostMultisListCard: {
    connected: ConnectedPriceBoostMultisListCard,
    component: PriceBoostMultisListCard,
  },
  MarketBetCard: { connected: ConnectedMarketBetCard, component: MarketBetCard },
  MarketBetSelectionCard: { connected: ConnectedMarketBetSelectionCard, component: MarketBetSelectionCard },
  SearchBarCard: { connected: ConnectedSearchBarCard, component: SearchBarCard },
  ExtraWalletCard: { connected: ConnectedExtraWalletCard, component: ExtraWalletCard },
  ObbCardGroup: { connected: ConnectedObbCardGroupCard, component: ObbCardGroup, placeholder: ObbCardGroupPlaceholder },
  ObbCreatedBetsCardGroup: {
    connected: ConnectedObbCreatedBetsCardGroupCard,
    component: ObbCreatedBetsCardGroup,
    placeholder: ObbCreatedBetsCardGroupPlaceholder,
  },
  ObbEventPopularsCard: {
    connected: ConnectedEventPopularsCard,
    component: ObbEventPopularsCard,
    placeholder: ObbEventPopularsCardPlaceholder,
  },
  ObbOnboardingCardsCardGroup: {
    connected: ConnectedObbOnboardingCardsCardGroupCard,
    component: ObbOnboardingCardsCardGroup,
    placeholder: ObbOnboardingCardsCardGroupPlaceholder,
  },
};

// Apollo migrated cards
const migratedCardWhiteList: MigratedCardWhiteList = {
  StatsFormCard: {
    component: StatsFormCard,
  },
  StatsHeadToHeadCard: {
    component: StatsHeadToHeadCard,
  },
  StatsTeamsCard: {
    component: StatsTeamsCard,
  },
  StatsMatchStatsCard: {
    component: StatsMatchStatsCard,
  },
  StatsPlayersSeasonStatsCard: {
    component: StatsPlayersSeasonStatsCard,
  },
  StatsTableCard: {
    component: StatsLeagueTableCard,
  },
  SelfExclusionCard: {
    component: SelfExclusionCard,
  },
  StatsGoalsAndShotsCard: {
    component: StatsGoalsAndShotsCard,
  },
  StatsPlayersInPlayCard: {
    component: StatsPlayersInPlayCard,
  },
  StatsBroadcastsCard: {
    component: StatsBroadcastsCard,
  },
  StatsRaceResultsCard: {
    component: StatsRaceResultsCard,
  },
  StatsLineupsCard: {
    component: StatsLineupsCard,
  },
  TeamLineupCard: {
    component: TeamLineupCard,
  },
  IncidentsCard: {
    component: IncidentsCard,
  },
  GenericSwitcherCard: {
    component: GenericSwitcherCard,
    placeholder: GenericSwitcherCardPlaceholder,
  },
  RaceSwitcherCard: {
    component: RaceSwitcherCard,
    placeholder: RaceSwitcherCardPlaceholder,
  },
  MiniPromoBannerCard: {
    component: MiniPromoBannerCard,
    placeholder: MiniPromotionCardPlaceholder,
  },
  LoyaltyPromoCard: {
    component: LoyaltyPromoCard,
    placeholder: LoyaltyPromoCardPlaceholder,
  },
  EditorialPromoCard: {
    component: EditorialPromoCard,
    placeholder: EditorialPromoCardPlaceholder,
  },
  BetOpportunityPromoCard: {
    component: BetOpportunityPromoCard,
    placeholder: BetOpportunityPromoCardPlaceholder,
  },
  SelectionPromoCard: {
    component: SelectionPromoCard,
    placeholder: SelectionPromoCardPlaceholder,
  },
  LottoCard: {
    component: LottoCard,
    placeholder: LottoCardPlaceholder,
  },
  PopularSelectionsCard: {
    component: PopularSelectionsCard,
    placeholder: PopularSelectionsCardPlaceholder,
  },
  PriceBoostMultiplePromoCard: {
    component: PriceBoostMultiplePromoCard,
    placeholder: PriceBoostMultiplePromoCardPlaceholder,
  },
  SportsbookLotteriesBetLegCardGroup: {
    component: SportsbookLotteriesBetLegCardGroup,
    placeholder: SportsbookLotteriesBetLegCardGroupPlaceholder,
  },
  MonterosaContentCard: {
    component: MonterosaContent,
  },
  EmbeddedContentCard: {
    component: EmbeddedContentCard,
  },
  EmbeddedViewCard: {
    component: EmbeddedViewCard,
    placeholder: EmbeddedViewCardPlaceholder,
  },
  SportsbookChatbotCard: {
    component: SportsbookChatbotCard,
    placeholder: SportsbookChatbotCardPlaceholder,
  },
  PenaltyTakersCard: {
    component: PenaltyTakersCard,
    placeholder: PenaltyTakersCardPlaceholder,
  },
};

export const isCardImplemented = (typename: string): boolean => !!cardWhiteList[typename];

const Card: FunctionComponent<ComponentProps> = ({ urn, typename, visible, theme }) => {
  if (!cardWhiteList[typename] && !migratedCardWhiteList[typename]) {
    return <></>;
  }

  const ComponentPlaceholder =
    cardWhiteList[typename]?.placeholder || migratedCardWhiteList[typename]?.placeholder || Placeholder;

  const renderCard = () => {
    if (migratedCardWhiteList[typename]) {
      const Component = migratedCardWhiteList[typename].component;

      return <Component urn={urn} visible={visible} />;
    }

    const { connected: ConnectedCard, component } = cardWhiteList[typename];

    return (
      // @ts-expect-error Final union type is too complex
      <ConnectedCard
        // @ts-expect-error Final union type is too complex
        urn={urn}
        component={component}
        placeholder={ComponentPlaceholder}
        visible={visible}
        theme={theme ?? undefined}
      />
    );
  };

  // TODO remove @ts-expect-error after fixing typechecking on connected universal components
  return (
    <ErrorBoundary urn={urn}>
      <Fragment key={urn}>{renderCard()}</Fragment>
    </ErrorBoundary>
  );
};

export default Card;
