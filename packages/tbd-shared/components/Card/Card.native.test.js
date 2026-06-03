import { render } from "@testing-library/react-native";
import StatsFormCard from "@ppb/tbd-components-rich-data/components/StatsFormCard/view/StatsFormCard.native";
import GenericSwitcherCard from "@ppb/tbd-components-navigation/components/GenericSwitcherCard/view/GenericSwitcherCard.native";
import RaceSwitcherCard from "@ppb/tbd-components-navigation/components/RaceSwitcherCard/view/RaceSwitcherCard.native";
import StatsTeamsCard from "@ppb/tbd-components-rich-data/components/StatsTeamsCard/view/StatsTeamsCard.native";
import StatsHeadToHeadCard from "@ppb/tbd-components-rich-data/components/StatsHeadToHeadCard/view/StatsHeadToHeadCard.native";
import LottoCard from "@ppb/tbd-components-sports-betting/components/LottoCard/view/LottoCard.native";
import SportsbookLotteriesBetLegCardGroup from "@ppb/tbd-components-my-bets/components/SportsbookLotteriesBetLegCardGroup/view/SportsbookLotteriesBetLegCardGroup.native";
import PriceBoostMultiplePromoCard from "@ppb/tbd-components-promotions/components/PriceBoostMultiplePromoCard/view/PriceBoostMultiplePromoCard.native";
import SportsbookChatbotCard from "@ppb/tbd-components-sports-betting/components/SportsbookChatbot/view/SportsbookChatbot.native";
import Card from "./Card.native";
import ConnectedMarketCard from "../MarketCard";
import ConnectedEventMarketCard from "../EventMarketCard";
import ConnectedSportsbookBetCard from "../SportsbookBetCard";
import ConnectedEventViewLinkCard from "../EventViewLinkCard";
import ConnectedRaceMarketCard from "../RaceMarketCard";
import ConnectedQuickLinksCard from "../QuickLinksCard";
import ConnectedFixtureCard from "../FixtureCard";
import ConnectedEventHeaderCard from "../EventHeaderCard";
import ConnectedRaceDetailsCard from "../RaceDetailsCard";
import ConnectedMarketExtendedCard from "../MarketExtendedCard";
import ConnectedRaceViewLinksCard from "../RaceViewLinksCard";
import ConnectedRaceViewLinkCard from "../RaceViewLinkCard";
import ConnectedMarketRulesCard from "../MarketRulesCard";
import ConnectedMatchStatsCard from "../MatchStatsCard";
import ConnectedRecentFormCard from "../RecentFormCard";
import ConnectedHeadToHeadCard from "../HeadToHeadCard";
import ConnectedHighlightedSelectionCard from "../HighlightedSelectionCard";
import ConnectedPromotionCard from "../PromotionCard";
import ConnectedGameCard from "../GameCard";
import ConnectedRunnerInfoCard from "../RunnerInfoCard";
import ConnectedMatchTimelineCard from "../MatchTimelineCard";
import ConnectedSportViewLinkCard from "../SportViewLinkCard";
import ConnectPreferenceSingleChoiceCard from "../PreferenceSingleChoiceCard";
import ConnectedForbiddenContentCard from "../ForbiddenContentCard";
import ConnectedBroadcastsCard from "../BroadcastsCard";
import ConnectedBroadcastsAndStatisticsCard from "../BroadcastsAndStatisticsCard";
import ConnectedSportsbookBetLegCard from "../SportsbookBetLegCard";
import ConnectedRegulatoryCard from "../RegulatoryCard";
import ConnectedGameInfoCard from "../GameInfo";
import ConnectedGamingLinkCard from "../GamingLinkCard";
import ConnectedRaceByTimeRangeCard from "../RaceByTimeRangeCard";
import ConnectedGenericViewLinkCard from "../GenericViewLinkCard";
import ConnectedCompetitionRegionCard from "../CompetitionRegionCard";
import ConnectedCompetitionViewLinkCard from "../CompetitionViewLinkCard";
import ConnectedCouponHeaderCard from "../CouponHeaderCard";
import ConnectedRaceResultsCard from "../RaceResultsCard";
import ConnectedTimeFormBroadCastsCard from "../TimeFormBroadCastsCard";
import ConnectedVirtualEventDetailsCard from "../VirtualEventDetailsCard";
import ConnectedGridCard from "../GridCard";
import ConnectedExpandableMarketCard from "../ExpandableMarketCard";
import ConnectedVirtualMarketCard from "../VirtualMarketCard";
import ConnectedPopularBetBuilderCard from "../PopularBetBuilderCard";
import ConnectedCorrectScoreCard from "../CorrectScoreCard";
import ConnectedOutrightMarketListCard from "../OutrightMarketListCard";
import ConnectedSportsbookBetInfoCard from "../SportsbookBetInfoCard";
import ConnectedMarketBetCard from "../MarketBetCard";
import ConnectedMarketBetSelectionCard from "../MarketBetSelectionCard";
import ConnectedPackagedCreatedBetsCard from "../PackagedCreatedBetsCard";
import ConnectedPriceBoostMultisListCard from "../PriceBoostMultisListCard";
import ConnectedExtraWalletCard from "../ExtraWalletCard";
import ConnectedObbCardGroup from "../ObbCardGroup";
import ConnectedMatchStatSelectionCard from "../MatchStatSelectionCard";
import MiniPromotionCard from "../Promos/MiniPromotionCard.native";
import LoyaltyPromoCard from "../Promos/LoyaltyPromoCard.native";
import EditorialPromoCard from "../Promos/EditorialPromoCard.native";
import BetOpportunityPromoCard from "../Promos/BetOpportunityPromoCard.native";
import ConnectedObbCreatedBetsCardGroup from "../ObbCreatedBetsCardGroup";
import ConnectedObbEventPopularsCard from "../ObbEventPopularsCard";

/* Placeholders */
import DefaultPlaceholder from "./DefaultPlaceholder.native";
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
import SportsbookBetLegCardPlaceholder from "../SportsbookBetLegCard/SportsbookBetLegCardPlaceholder.native";
import CompetitionRegionCardPlaceholder from "../CompetitionRegionCard/CompetitionRegionCardPlaceholder.native";
import CouponHeaderCardPlaceholder from "../CouponHeaderCard/CouponHeaderCardPlaceholder.native";
import RaceByTimeRangeCardPlaceholder from "../RaceByTimeRangeCard/RaceByTimeRangeCardPlaceholder.native";
import GridCardPlaceholder from "../GridCard/GridCardPlaceholder.native";
import ExpandableMarketCardPlaceholder from "../ExpandableMarketCard/ExpandableMarketCardPlaceholder.native";
import CorrectScoreCardPlaceholder from "../CorrectScoreCard/CorrectScoreCardPlaceholder.native";
import MarketCardPlaceholder from "../MarketCard/MarketCardPlaceholder.native";
import BroadcastsAndStatisticsCardPlaceholder from "../BroadcastsAndStatisticsCard/BroadcastsAndStatisticsCardPlaceholder.native";
import TimeFormBroadCastsCardPlaceholder from "../TimeFormBroadCastsCard/TimeFormBroadCastsCardPlaceholder.native";
import RegulatoryCardPlaceholder from "../RegulatoryCard/RegulatoryCardPlaceholder.native";
import QuickLinksCardPlaceholder from "../QuickLinksCard/QuickLinksCardPlaceholder.native";
import ObbCardGroupPlaceholder from "../ObbCardGroup/ObbCardGroupPlaceholder.native";
import EventMarketCardPlaceholder from "../EventMarketCard/EventMarketCardPlaceholder.native";
import RaceDetailsCardPlaceholder from "../RaceDetailsCard/RaceDetailsCardPlaceholder.native";
import CompetitionViewLinkCardPlaceholder from "../CompetitionViewLinkCard/CompetitionViewLinkCardPlaceholder.native";
import BroadcastsCardPlaceholder from "../BroadcastsCard/BroadcastsCardPlaceholder.native";
import MarketExtendedCardPlaceholder from "../MarketExtendedCard/MarketExtendedCardPlaceholder.native";
import ObbCreatedBetsCardGroupPlaceholder from "../ObbCreatedBetsCardGroup/placeholder/ObbCreatedBetsCardGroupPlaceholder.native";
import ObbEventPopularsCardPlaceholder from "../ObbEventPopularsCard/placeholder/ObbEventPopularsCardPlaceholder.native";

/* Migrated cards */
import StatsMatchStatsCard from "@ppb/tbd-components-rich-data/components/StatsMatchStatsCard/view/StatsMatchStatsCard.native";
import SelfExclusionCard from "@ppb/tbd-components-navigation/components/SelfExclusionCard/view/SelfExclusionCard.native";
import StatsGoalsAndShotsCard from "@ppb/tbd-components-rich-data/components/StatsGoalsAndShotsCard/view/StatsGoalsAndShotsCard.native";
import StatsPlayersInPlayCard from "../StatsPlayersInPlayCard/view/StatsPlayersInPlayCard.native";
import StatsPlayersSeasonStatsCard from "../StatsPlayersSeasonStatsCard/view/StatsPlayersSeasonStatsCard.native";
import StatsBroadcastsCard from "@ppb/tbd-components-rich-data/components/StatsBroadcastsCard/view/StatsBroadcastsCard.native";
import StatsRaceResultsCard from "../StatsRaceResultsCard/view/StatsRaceResultsCard.native";
import GameInfoPlaceholder from "../GameInfo/snowflakes/GameInfo/GameInfoPlaceholder.native";
import FixtureCardPlaceholder from "../FixtureCard/FixtureCardPlaceholder.native";
import RaceMarketCardPlaceholder from "../RaceMarketCard/RaceMarketCardPlaceholder.native";
import RaceResultsCardPlaceholder from "../RaceResultsCard/RaceResultsCardPlaceholder.native";
import StatsLeagueTableCard from "@ppb/tbd-components-rich-data/components/StatsLeagueTableCard/view/StatsLeagueTableCard.native";
import StatsLineupsCard from "@ppb/tbd-components-rich-data/components/StatsLineupsCard/view/StatsLineupsCard.native";
import TeamLineupCard from "@ppb/tbd-components-rich-data/components/TeamLineupCard/view/TeamLineupCard.native";
import IncidentsCard from "@ppb/tbd-components-rich-data/components/IncidentsCard/view/IncidentsCard.native";
import MonterosaContent from "../MonterosaContentCard/view/MonterosaContent.native";
import EmbeddedContentCard from "../EmbeddedContentCard/EmbeddedContentCard.native";
import EmbeddedViewCard from "../EmbeddedViewCard/EmbeddedViewCard.native";
import PenaltyTakersCard from "@ppb/tbd-components-sports-betting/components/PenaltyTakersCard/view/PenaltyTakersCard.native";

jest.mock("../MarketCard", () => jest.fn(() => <mock testID="market-card" />));
jest.mock("../EventViewLinkCard", () => jest.fn(() => <mock testID="event-view-link-card" />));
jest.mock("../EventMarketCard", () => jest.fn(() => <mock testID="event-market-card" />));
jest.mock("../SportsbookBetCard", () => jest.fn(() => <mock testID="sportsbook-bet-card" />));
jest.mock("../QuickLinksCard", () => jest.fn(() => <mock testID="quick-links-card" />));
jest.mock("../RaceMarketCard", () => jest.fn(() => <mock testID="race-market-card" />));
jest.mock("../FixtureCard", () => jest.fn(() => <mock testID="fixture-card" />));
jest.mock("../EventHeaderCard", () => jest.fn(() => <mock testID="event-header-card" />));
jest.mock("../RaceDetailsCard", () => jest.fn(() => <mock testID="race-details-card" />));
jest.mock("../MarketExtendedCard", () => jest.fn(() => <mock testID="market-extended-card" />));
jest.mock("../RaceViewLinksCard", () => jest.fn(() => <mock testID="race-view-links-card" />));
jest.mock("../RaceViewLinkCard", () => jest.fn(() => <mock testID="race-view-link-card" />));
jest.mock("../MarketRulesCard", () => jest.fn(() => <mock testID="market-rules-card" />));
jest.mock("../MatchStatsCard", () => jest.fn(() => <mock testID="match-stats-card" />));
jest.mock("../RecentFormCard", () => jest.fn(() => <mock testID="recent-form-card" />));
jest.mock("../HeadToHeadCard", () => jest.fn(() => <mock testID="head-to-head-card" />));
jest.mock("../HighlightedSelectionCard", () => jest.fn(() => <mock testID="highlighted-selection-card" />));
jest.mock("../MatchStatSelectionCard", () => jest.fn(() => <mock testID="match-stat-selection-card" />));
jest.mock("../PromotionCard", () => jest.fn(() => <mock testID="promotion-card" />));
jest.mock("../GameCard", () => jest.fn(() => <mock testID="game-card" />));
jest.mock("../RunnerInfoCard", () => jest.fn(() => <mock testID="runner-info-card" />));
jest.mock("../MatchTimelineCard", () => jest.fn(() => <mock testID="match-timeline-card" />));
jest.mock("../SportViewLinkCard", () => jest.fn(() => <mock testID="sport-view-link-card" />));
jest.mock("../PreferenceSingleChoiceCard", () => jest.fn(() => <mock data-testid="preference-single-choice-card" />));
jest.mock("../CompetitionRegionCard", () => jest.fn(() => <mock data-testid="competition-region-card" />));
jest.mock("../CompetitionViewLinkCard", () => jest.fn(() => <mock data-testid="competition-view-link-card" />));
jest.mock("./MakeMeAgnostic", () => ({
  MakeMeAgnosticComponent: null,
  MakeMeAgnosticConnected: null,
}));
jest.mock("../ForbiddenContentCard", () => jest.fn(() => <mock data-testid="forbidden-content-card" />));
jest.mock("../BroadcastsCard", () => jest.fn(() => <mock testID="broadcasts-card" />));
jest.mock("../BroadcastsAndStatisticsCard", () => jest.fn(() => <mock testID="broadcasts-and-statistics-card" />));
jest.mock("../SportsbookBetLegCard", () => jest.fn(() => <mock testID="sportsbook-bet-leg-card" />));
jest.mock("../RegulatoryCard", () => jest.fn(() => <mock testID="regulatory-card" />));
jest.mock("../GameInfo", () => jest.fn(() => <mock testID="game-info-card" />));
jest.mock("../GamingLinkCard", () => jest.fn(() => <mock testID="gaming-link-card" />));
jest.mock("../RaceByTimeRangeCard", () => jest.fn(() => <mock testID="race-by-time-range-card" />));
jest.mock("../GenericViewLinkCard", () => jest.fn(() => <mock testID="generic-view-link-card" />));
jest.mock("../CouponHeaderCard", () => jest.fn(() => <mock testID="coupon-header-card" />));
jest.mock("../RaceResultsCard", () => jest.fn(() => <mock testID="race-results-card" />));
jest.mock("../TimeFormBroadCastsCard", () => jest.fn(() => <mock testID="time-form-broadcasts-card" />));
jest.mock("../VirtualEventDetailsCard", () => jest.fn(() => <mock testID="virtual-event-details-card" />));
jest.mock("../GridCard", () => jest.fn(() => <mock testID="grid-card" />));
jest.mock("../ExpandableMarketCard", () => jest.fn(() => <mock testID="expandable-market-card" />));
jest.mock("../VirtualMarketCard", () => jest.fn(() => <mock testID="virtual-market-card" />));
jest.mock("../PopularBetBuilderCard", () => jest.fn(() => <mock testID="popular-bet-builder-card" />));
jest.mock("@ppb/tbd-components-sports-betting/components/PopularSelectionsCard/view/PopularSelectionsCard.native", () =>
  jest.fn(() => <popular-selections-card data-testid="popular-selections-card" />),
);
jest.mock("../CorrectScoreCard", () => jest.fn(() => <mock testID="correct-score-card" />));
jest.mock("../OutrightMarketListCard", () => jest.fn(() => <mock testID="outright-market-list-card" />));
jest.mock("../SportsbookBetInfoCard", () =>
  jest.fn(() => <connected-sportsbook-bet-info-card testID="sportsbook-bet-info-card" />),
);
jest.mock("../MarketBetCard", () => jest.fn(() => <mock testID="market-bet-card" />));
jest.mock("../MarketBetSelectionCard", () => jest.fn(() => <mock testID="market-bet-selection-card" />));
jest.mock("../PackagedCreatedBetsCard", () =>
  jest.fn(() => <packaged-created-bets-card testID="packaged-created-bets-card" />),
);
jest.mock("../PriceBoostMultisListCard", () =>
  jest.fn(() => <price-boost-multis-list-card testID="price-boost-multis-list-card" />),
);
jest.mock("../ExtraWalletCard", () => jest.fn(() => <extra-wallet-card testID="extra-wallet-card" />));
jest.mock("../ObbCardGroup", () => jest.fn(() => <obb-card-group testID="obb-card-group" />));
jest.mock("../ObbCreatedBetsCardGroup", () =>
  jest.fn(() => <obb-created-bets-card-group testID="obb-created-bets-card-group" />),
);
jest.mock("../ObbEventPopularsCard", () => jest.fn(() => <obb-event-populars-card testID="obb-event-populars-card" />));
jest.mock("../ObbOnboardingCardsCardGroup", () =>
  jest.fn(() => <obb-onboarding-cards-card-group testID="obb-onboarding-cards-card-group" />),
);

jest.mock("../MarketCard/MarketCard.native", () => "market-card-native");
jest.mock("../EventViewLinkCard/EventViewLinkCard.native", () => "event-view-link-card-native");
jest.mock("../EventMarketCard/EventMarketCard.native", () => "event-market-card-native");
jest.mock("../SportsbookBetCard/SportsbookBetCard.native", () => "sportsbook-bet-card-native");
jest.mock("../QuickLinksCard/QuickLinksCard.native", () => "quick-links-card-native");
jest.mock("../RaceMarketCard/RaceMarketCard.native", () => "race-market-card-native");
jest.mock("../FixtureCard/FixtureCard.native", () => "fixture-card-native");
jest.mock("../EventHeaderCard/EventHeaderCard.native", () => "event-header-card-native");
jest.mock("../RaceDetailsCard/RaceDetailsCard.native", () => "race-details-card-native");
jest.mock("../MarketExtendedCard/MarketExtendedCard.native", () => "market-extended-card-native");
jest.mock("../RaceViewLinksCard/RaceViewLinksCard.native", () => "race-view-links-card-native");
jest.mock("../RaceViewLinkCard/RaceViewLinkCard.native", () => "race-view-link-card-native");
jest.mock("../MarketRulesCard/MarketRulesCard.native", () => "market-rules-card-native");
jest.mock("../MatchStatsCard/MatchStatsCard.native", () => "match-stats-card-native");
jest.mock("../MatchStatSelectionCard/MatchStatSelectionCard.native", () => "match-stat-selection-card-native");
jest.mock("../RecentFormCard/RecentFormCard.native", () => "recent-form-card-native");
jest.mock("../HeadToHeadCard/HeadToHeadCard.native", () => "head-to-head-card-native");
jest.mock("../HighlightedSelectionCard/HighlightedSelectionCard.native", () => "highlighted-selection-card-native");
jest.mock("../PromotionCard/PromotionCard.native", () => "promotion-card-native");
jest.mock("../GameCard/GameCard.native", () => "game-card-native");
jest.mock("../RunnerInfoCard/RunnerInfoCard.native", () => "runner-info-card-native");
jest.mock("../MatchTimelineCard/MatchTimelineCard.native", () => "match-timeline-card-native");
jest.mock("../SportViewLinkCard/SportViewLinkCard.native", () => "sport-view-link-card-native");
jest.mock(
  "../PreferenceSingleChoiceCard/PreferenceSingleChoiceCard.native",
  () => "preference-single-choice-card-native",
);
jest.mock("../ForbiddenContentCard/ForbiddenContentCard.native", () => "forbidden-content-card-native");
jest.mock("../BroadcastsCard/BroadcastsCard.native", () => "broadcasts-card-native");
jest.mock(
  "../BroadcastsAndStatisticsCard/BroadcastsAndStatisticsCard.native",
  () => "broadcasts-and-statistics-card-native",
);
jest.mock("../EmbeddedViewCard/EmbeddedViewCard.native", () => "embedded-view-card-native");
jest.mock("../SportsbookBetLegCard/SportsbookBetLegCard.native", () => "sportsbook-bet-leg-card-native");
jest.mock("../RegulatoryCard/RegulatoryCard.native", () => "regulatory-card-native");
jest.mock("../GameInfo/GameInfo.native", () => "game-info-card-native");
jest.mock("../GamingLinkCard/GamingLinkCard.native", () => "gaming-link-card-native");
jest.mock("../RaceByTimeRangeCard/RaceByTimeRangeCard.native", () => "race-by-time-range-card-native");
jest.mock("../GenericViewLinkCard/GenericViewLinkCard.native", () => "generic-view-link-card-native");
jest.mock("../CompetitionRegionCard/CompetitionRegionCard.native", () => "competition-region-card-native");
jest.mock("../CompetitionViewLinkCard/CompetitionViewLinkCard.native", () => "competition-view-link-card-native");
jest.mock("../CouponHeaderCard/CouponHeaderCard.native", () => "coupon-header-card-native");
jest.mock("../RaceResultsCard/RaceResultsCard.native", () => "race-results-card-native");
jest.mock("../TimeFormBroadCastsCard/TimeFormBroadCastsCard.native", () => "time-form-broadcasts-card-native");
jest.mock("../VirtualEventDetailsCard/VirtualEventDetailsCard.native", () => "virtual-event-details-card-native");
jest.mock("../GridCard/GridCard.native", () => "grid-card-native");
jest.mock("../ExpandableMarketCard/ExpandableMarketCard.native", () => "expandable-market-card-native");
jest.mock("../VirtualMarketCard/VirtualMarketCard.native", () => "virtual-market-card-native");
jest.mock("../PopularBetBuilderCard/PopularBetBuilderCard.native", () => "popular-bet-builder-card-native");
jest.mock("../CorrectScoreCard/CorrectScoreCard.native", () => "correct-score-card-native");
jest.mock("../OutrightMarketListCard/OutrightMarketListCard.native", () => "outright-market-list-card-native");
jest.mock("../SportsbookBetInfoCard/SportsbookBetInfoCard.native", () => "sportsbook-bet-info-card-native");
jest.mock("../MarketBetCard/MarketBetCard.native", () => "market-bet-card-native");
jest.mock("../MarketBetSelectionCard/MarketBetSelectionCard.native", () => "market-bet-selection-card-native");
jest.mock("../PackagedCreatedBetsCard/PackagedCreatedBetsCard.native", () => "packaged-created-bets-card-native");
jest.mock("../PriceBoostMultisListCard/PriceBoostMultisListCard.native", () => "price-boost-multis-list-card-native");
jest.mock("../SearchBarCard/SearchBarCard.native", () => "search-bar-card-native");
jest.mock("../ExtraWalletCard/ExtraWalletCard.native", () => "extra-wallet-card-native");
jest.mock("../ObbCardGroup/ObbCardGroup.native", () => "obb-card-group-native");
jest.mock("../ObbCreatedBetsCardGroup/ObbCreatedBetsCardGroup.native", () => "obb-created-bets-card-group-native");
jest.mock("../ObbEventPopularsCard/ObbEventPopularsCard.native", () => "obb-event-populars-card-native");
jest.mock(
  "../ObbOnboardingCardsCardGroup/ObbOnboardingCardsCardGroup.native",
  () => "obb-onboarding-cards-card-group-native",
);

jest.mock("@ppb/the-wall-native", () => ({
  SportsbookBetButton: jest.fn(() => <sportsbook-bet-button-mock />),
}));

jest.spyOn(global.console, "warn").mockReturnValue("warning");

/* PLACEHOLDERS */
jest.mock("./DefaultPlaceholder.native", () => jest.fn(() => <default-placeholder />));
jest.mock("../ObbCardGroup/ObbCardGroupPlaceholder.native", () => jest.fn(() => <obb-card-group-placeholder />));
jest.mock("../EventViewLinkCard/EventViewLinkCardPlaceholder.native", () => jest.fn(() => <event-link-placeholder />));
jest.mock("../EventHeaderCard/EventHeaderCardPlaceholder.native", () => jest.fn(() => <event-header-placeholder />));
jest.mock("../RaceDetailsCard/RaceDetailsCardPlaceholder.native", () => jest.fn(() => <race-details-placeholder />));
jest.mock("../RaceViewLinkCard/RaceViewLinkCardPlaceholder.native", () =>
  jest.fn(() => <race-view-link-placeholder />),
);
jest.mock("../RaceViewLinksCard/RaceViewLinksCardPlaceholder.native", () =>
  jest.fn(() => <race-view-links-placeholder />),
);
jest.mock("../GameCard/GameCardPlaceholder.native", () => jest.fn(() => <game-placeholder />));
jest.mock("../GamingLinkCard/GamingLinkCardPlaceholder.native", () => jest.fn(() => <gaming-link-card-placeholder />));
jest.mock("../HighlightedSelectionCard/HighlightedSelectionCardPlaceholder.native", () =>
  jest.fn(() => <highlighted-selection-card-placeholder />),
);
jest.mock("../MatchStatSelectionCard/MatchStatSelectionCardPlaceholder.native", () =>
  jest.fn(() => <match-stat-selection-card-placeholder />),
);
jest.mock("../SportsbookBetCard/SportsbookBetCardPlaceholder.native", () =>
  jest.fn(() => <sportsbook-bet-card-placeholder />),
);
jest.mock("../SportViewLinkCard/SportViewLinkCardPlaceholder.native", () =>
  jest.fn(() => <sport-view-link-card-placeholder />),
);
jest.mock("../SportsbookBetLegCard/SportsbookBetLegCardPlaceholder.native", () =>
  jest.fn(() => <sportsbook-bet-leg-card-placeholder />),
);

jest.mock("../CompetitionRegionCard/CompetitionRegionCardPlaceholder.native", () =>
  jest.fn(() => <competition-region-card-placeholder />),
);

jest.mock("../CouponHeaderCard/CouponHeaderCardPlaceholder.native", () =>
  jest.fn(() => <coupon-header-card-placeholder />),
);

jest.mock("../GridCard/GridCardPlaceholder.native", () => jest.fn(() => <grid-card-placeholder />));
jest.mock("../ExpandableMarketCard/ExpandableMarketCardPlaceholder.native", () =>
  jest.fn(() => <expandable-market-card-placeholder />),
);
jest.mock("../CorrectScoreCard/CorrectScoreCardPlaceholder.native", () =>
  jest.fn(() => <correct-score-card-placeholder />),
);
jest.mock("../MarketCard/MarketCardPlaceholder.native", () => jest.fn(() => <market-card-placeholder />));
jest.mock("../QuickLinksCard/QuickLinksCardPlaceholder.native", () => jest.fn(() => <quick-links-card-placeholder />));

jest.mock("../FixtureCard/FixtureCardPlaceholder.native", () => jest.fn(() => <fixture-card-placeholder />));
jest.mock("@ppb/tbd-components-promotions/components/LoyaltyPromoCard/view/LoyaltyPromoCardPlaceholder.native", () =>
  jest.fn(() => <mini-promotion-card-placeholder data-testid="mini-promotion-card-placeholder" />),
);
jest.mock("../EventMarketCard/EventMarketCardPlaceholder.native.tsx", () =>
  jest.fn(() => <event-market-card-placeholder data-testid="event-market-card-placeholder" />),
);
jest.mock("../MarketExtendedCard/MarketExtendedCardPlaceholder.native.tsx", () =>
  jest.fn(() => <market-extended-card-placeholder data-testid="market-extended-card-placeholder" />),
);
jest.mock("../GameInfo/snowflakes/GameInfo/GameInfoPlaceholder.native.tsx", () =>
  jest.fn(() => <game-info-placeholder />),
);
jest.mock("../RaceByTimeRangeCard/RaceByTimeRangeCardPlaceholder.native", () =>
  jest.fn(() => <race-card-time-range-card-placeholder />),
);
jest.mock("../CompetitionViewLinkCard/CompetitionViewLinkCardPlaceholder.native", () =>
  jest.fn(() => <competition-view-link-card-placeholder />),
);
jest.mock("../BroadcastsAndStatisticsCard/BroadcastsAndStatisticsCardPlaceholder.native", () =>
  jest.fn(() => <broadcasts-and-statistics-card-placeholder />),
);
jest.mock("../TimeFormBroadCastsCard/TimeFormBroadCastsCardPlaceholder.native", () =>
  jest.fn(() => <time-form-broadcasts-card-placeholder />),
);
jest.mock("../RegulatoryCard/RegulatoryCardPlaceholder.native", () => jest.fn(() => <regulatory-card-placeholder />));
jest.mock("../RaceMarketCard/RaceMarketCardPlaceholder.native.tsx", () =>
  jest.fn(() => <race-market-card-placeholder />),
);
jest.mock("../RaceResultsCard/RaceResultsCardPlaceholder.native.tsx", () =>
  jest.fn(() => <race-results-card-placeholder />),
);
jest.mock("../BroadcastsCard/BroadcastsCardPlaceholder.native", () => jest.fn(() => <broadcasts-card-placeholder />));

/* Migrated cards */
jest.mock("@ppb/tbd-components-rich-data/components/StatsFormCard/view/StatsFormCard.native", () =>
  jest.fn(() => <stats-form-card-mock data-testid="stats-form-card" />),
);
jest.mock("@ppb/tbd-components-navigation/components/GenericSwitcherCard/view/GenericSwitcherCard.native", () =>
  jest.fn(() => <generic-switcher-card-mock data-testid="generic-switcher-card" />),
);
jest.mock(
  "@ppb/tbd-components-navigation/components/GenericSwitcherCard/view/GenericSwitcherCardPlaceholder.native",
  () => jest.fn(() => <generic-switcher-card-placeholder-mock data-testid="generic-switcher-card-placeholder" />),
);
jest.mock("@ppb/tbd-components-navigation/components/RaceSwitcherCard/view/RaceSwitcherCard.native", () =>
  jest.fn(() => <race-switcher-card-mock data-testid="race-switcher-card" />),
);
jest.mock("@ppb/tbd-components-navigation/components/RaceSwitcherCard/view/RaceSwitcherCardPlaceholder.native", () =>
  jest.fn(() => <race-switcher-card-placeholder-mock data-testid="race-switcher-card-placeholder" />),
);
jest.mock("@ppb/tbd-components-rich-data/components/StatsHeadToHeadCard/view/StatsHeadToHeadCard.native", () =>
  jest.fn(() => <stats-head-to-head-card-mock data-testid="stats-head-to-head-card" />),
);
jest.mock("@ppb/tbd-components-rich-data/components/StatsGoalsAndShotsCard/view/StatsGoalsAndShotsCard.native", () =>
  jest.fn(() => <stats-goals-and-shots-card-mock data-testid="stats-goals-and-shots-card" />),
);
jest.mock("../MonterosaContentCard/view/MonterosaContent.native", () =>
  jest.fn(() => <monterosa-content-card-mock data-testid="monterosa-content-card" />),
);
jest.mock("../EmbeddedContentCard/EmbeddedContentCard.native", () =>
  jest.fn(() => <embedded-content-card-mock data-testid="embedded-content-card" />),
);
jest.mock("@ppb/tbd-components-rich-data/components/StatsTeamsCard/view/StatsTeamsCard.native", () =>
  jest.fn(() => <stats-team-card-mock data-testid="stats-card" />),
);
jest.mock("@ppb/tbd-components-sports-betting/components/LottoCard/view/LottoCard.native", () =>
  jest.fn(() => <lotto-card-mock data-testid="lotto-card" />),
);
jest.mock(
  "@ppb/tbd-components-promotions/components/PriceBoostMultiplePromoCard/view/PriceBoostMultiplePromoCard.native",
  () => jest.fn(() => <price-boost-multiple-promo-card-mock data-testid="price-boost-multiple-promo-card" />),
);
jest.mock(
  "@ppb/tbd-components-my-bets/components/SportsbookLotteriesBetLegCardGroup/view/SportsbookLotteriesBetLegCardGroup.native",
  () => jest.fn(() => <sbk-lotteries-bet-leg-card-group-mock data-testid="sbk-lotteries-bet-leg-card-group" />),
);
jest.mock("../StatsPlayersInPlayCard/view/StatsPlayersInPlayCard.native", () =>
  jest.fn(() => <stats-players-in-play-card-mock data-testid="stats-players-in-play-card" />),
);
jest.mock("../StatsPlayersSeasonStatsCard/view/StatsPlayersSeasonStatsCard.native", () =>
  jest.fn(() => <stats-players-season-card-mock data-testid="stats-players-season-card" />),
);
jest.mock("@ppb/tbd-components-rich-data/components/StatsLineupsCard/view/StatsLineupsCard.native", () =>
  jest.fn(() => <stats-lineups-card-mock data-testid="stats-lineups-card" />),
);
jest.mock("@ppb/tbd-components-rich-data/components/TeamLineupCard/view/TeamLineupCard.native", () =>
  jest.fn(() => <mock testID="team-lineup-card" />),
);
jest.mock("@ppb/tbd-components-rich-data/components/StatsLeagueTableCard/view/StatsLeagueTableCard.native", () =>
  jest.fn(() => <stats-league-table-card-mock data-testid="stats-league-table-card" />),
);
jest.mock("@ppb/tbd-components-rich-data/components/IncidentsCard/view/IncidentsCard.native", () =>
  jest.fn(() => <incidents-card-mock data-testid="incidents-card" />),
);
jest.mock("@ppb/tbd-components-rich-data/components/StatsMatchStatsCard/view/StatsMatchStatsCard.native", () =>
  jest.fn(() => <stats-match-stats-card-mock data-testid="stats-match-stats-card" />),
);
jest.mock("@ppb/tbd-components-rich-data/components/StatsBroadcastsCard/view/StatsBroadcastsCard.native", () =>
  jest.fn(() => <stats-broadcasts-card-mock data-testid="stats-broadcasts-card" />),
);
jest.mock("../StatsRaceResultsCard/view/StatsRaceResultsCard.native", () =>
  jest.fn(() => <stats-race-results-card-mock data-testid="stats-race-results-card" />),
);
jest.mock("@ppb/tbd-components-navigation/components/SelfExclusionCard/view/SelfExclusionCard.native", () =>
  jest.fn(() => <self-exclusion-card-mock data-testid="self-exclusion-card" />),
);
jest.mock("@ppb/tbd-components-sports-betting/components/PenaltyTakersCard/view/PenaltyTakersCard.native", () =>
  jest.fn(() => <penalty-takers-card-mock data-testid="penalty-takers-card" />),
);
jest.mock(
  "@ppb/tbd-components-sports-betting/components/PenaltyTakersCard/view/PenaltyTakersCardPlaceholder.native",
  () => jest.fn(() => <penalty-takers-card-placeholder-mock data-testid="penalty-takers-card-placeholder" />),
);
jest.mock("../Promos/LoyaltyPromoCard.native", () =>
  jest.fn(() => <loyalty-promo-card-mock data-testid="loyalty-promo-card" />),
);
jest.mock("../Promos/MiniPromotionCard.native", () =>
  jest.fn(() => <mini-promo-card-mock data-testid="mini-promo-card" />),
);
jest.mock("../Promos/EditorialPromoCard.native", () =>
  jest.fn(() => <editorial-promo-card-mock data-testid="editorial-promo-card" />),
);
jest.mock("../Promos/BetOpportunityPromoCard.native", () =>
  jest.fn(() => <bet-opportunity-promo-card-mock data-testid="bet-opportunity-promo-card" />),
);
jest.mock("../ObbCreatedBetsCardGroup/placeholder/ObbCreatedBetsCardGroupPlaceholder.native", () =>
  jest.fn(() => <obb-created-bets-card-group-placeholder />),
);
jest.mock("../EmbeddedViewCard/EmbeddedViewCard.native", () =>
  jest.fn(() => <embedded-view-card-mock data-testid="embedded-view-card" />),
);
jest.mock("../ObbEventPopularsCard/placeholder/ObbEventPopularsCardPlaceholder.native", () =>
  jest.fn(() => <obb-event-populars-card-placeholder />),
);
jest.mock("@ppb/tbd-components-sports-betting/components/SportsbookChatbot/view/SportsbookChatbot.native", () =>
  jest.fn(() => <sportsbook-chatbot-card-mock testID="sportsbook-chatbot-card" />),
);
jest.mock("../ObbOnboardingCardsCardGroup/placeholder/ObbOnboardingCardsCardGroupPlaceholder.native", () =>
  jest.fn(() => <obb-onboarding-cards-card-group-placeholder />),
);

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  typography: {},
  spacings: {},
  heights: {},
  tokens: {},
}));

jest.mock("react-native-webview", () => jest.fn((props) => <webview-mock {...props} />));

jest.mock("@splunk/otel-react-native", () => ({
  SplunkWebView: require("react").forwardRef(({ WebViewComponent, ...props }, ref) => {
    const React = require("react");
    return React.createElement(WebViewComponent, { ref, ...props });
  }),
}));

jest.mock("react-native-onetrust-cmp", () => ({
  __esModule: true,
}));

jest.mock("../ErrorBoundary/ErrorBoundary", () => ({
  ErrorBoundary: jest.fn(({ children }) => <>{children}</>),
}));
describe("Card Native", () => {
  beforeEach(jest.clearAllMocks);

  describe.each([
    ["MarketCard", ConnectedMarketCard, "market-card-native", "market-card", "MarketCard", MarketCardPlaceholder],
    [
      "EventMarketCard",
      ConnectedEventMarketCard,
      "event-market-card-native",
      "event-market-card",
      "EventMarketCard",
      EventMarketCardPlaceholder,
    ],
    [
      "ConnectedSportsbookBetCard",
      ConnectedSportsbookBetCard,
      "sportsbook-bet-card-native",
      "sportsbook-bet-card",
      "SportsbookBetCard",
      SportsbookBetCardPlaceholder,
    ],
    [
      "ConnectedEventViewLinkCard",
      ConnectedEventViewLinkCard,
      "event-view-link-card-native",
      "event-view-link-card",
      "EventViewLinkCard",
      EventViewLinkCardPlaceholder,
    ],
    [
      "ConnectedQuickLinksCard",
      ConnectedQuickLinksCard,
      "quick-links-card-native",
      "quick-links-card",
      "QuickLinksCard",
      QuickLinksCardPlaceholder,
    ],
    [
      "ConnectedRaceMarketCard",
      ConnectedRaceMarketCard,
      "race-market-card-native",
      "race-market-card",
      "RaceMarketCard",
      RaceMarketCardPlaceholder,
    ],
    [
      "ConnectedFixtureCard",
      ConnectedFixtureCard,
      "fixture-card-native",
      "fixture-card",
      "FixtureCard",
      FixtureCardPlaceholder,
    ],
    [
      "ConnectedEventHeaderCard",
      ConnectedEventHeaderCard,
      "event-header-card-native",
      "event-header-card",
      "EventHeaderCard",
      EventHeaderCardPlaceholder,
    ],
    [
      "ConnectedRaceDetailsCard",
      ConnectedRaceDetailsCard,
      "race-details-card-native",
      "race-details-card",
      "RaceDetailsCard",
      RaceDetailsCardPlaceholder,
    ],
    [
      "MarketExtendedCard",
      ConnectedMarketExtendedCard,
      "market-extended-card-native",
      "market-extended-card",
      "MarketExtendedCard",
      MarketExtendedCardPlaceholder,
    ],
    [
      "RaceViewLinksCard",
      ConnectedRaceViewLinksCard,
      "race-view-links-card-native",
      "race-view-links-card",
      "RaceViewLinksCard",
      RaceViewLinksCardPlaceholder,
    ],
    [
      "RaceViewLinkCard",
      ConnectedRaceViewLinkCard,
      "race-view-link-card-native",
      "race-view-link-card",
      "RaceViewLinkCard",
      RaceViewLinkCardPlaceholder,
    ],
    [
      "MarketRulesCard",
      ConnectedMarketRulesCard,
      "market-rules-card-native",
      "market-rules-card",
      "MarketRulesCard",
      DefaultPlaceholder,
    ],
    [
      "MatchStatsCard",
      ConnectedMatchStatsCard,
      "match-stats-card-native",
      "match-stats-card",
      "MatchStatsCard",
      DefaultPlaceholder,
    ],
    [
      "TeamFormCard",
      ConnectedRecentFormCard,
      "recent-form-card-native",
      "recent-form-card",
      "TeamFormCard",
      DefaultPlaceholder,
    ],
    [
      "ConnectedHeadToHeadCard",
      ConnectedHeadToHeadCard,
      "head-to-head-card-native",
      "head-to-head-card",
      "HeadToHeadCard",
      DefaultPlaceholder,
    ],
    [
      "ConnectedMatchTimelineCard",
      ConnectedMatchTimelineCard,
      "match-timeline-card-native",
      "match-timeline-card",
      "MatchTimelineCard",
      DefaultPlaceholder,
    ],
    [
      "ConnectedHighlightedSelectionCard",
      ConnectedHighlightedSelectionCard,
      "highlighted-selection-card-native",
      "highlighted-selection-card",
      "HighlightedSelectionCard",
      HighlightedSelectionCardPlaceholder,
    ],
    [
      "ConnectedMatchStatSelectionCard",
      ConnectedMatchStatSelectionCard,
      "match-stat-selection-card-native",
      "match-stat-selection-card",
      "MatchStatSelectionCard",
      MatchStatSelectionCardPlaceholder,
    ],
    [
      "ConnectedPromotionCard",
      ConnectedPromotionCard,
      "promotion-card-native",
      "promotion-card",
      "PromotionCard",
      DefaultPlaceholder,
    ],
    ["GameCard", ConnectedGameCard, "game-card-native", "game-card", "GameCard", GameCardPlaceholder],
    [
      "ConnectedRunnerInfoCard",
      ConnectedRunnerInfoCard,
      "runner-info-card-native",
      "runner-info-card",
      "RunnerInfoCard",
      DefaultPlaceholder,
    ],
    [
      "ConnectedSportViewLinkCard",
      ConnectedSportViewLinkCard,
      "sport-view-link-card-native",
      "sport-view-link-card",
      "SportViewLinkCard",
      SportViewLinkCardPlaceholder,
    ],
    [
      "ConnectedPreferenceSingleChoiceCard",
      ConnectPreferenceSingleChoiceCard,
      "preference-single-choice-card-native",
      "preference-single-choice-card",
      "PreferenceSingleChoiceCard",
      DefaultPlaceholder,
    ],
    [
      "ConnectedForbiddenContentCard",
      ConnectedForbiddenContentCard,
      "forbidden-content-card-native",
      "forbidden-content-card",
      "ForbiddenContentCard",
      DefaultPlaceholder,
    ],
    [
      "ConnectedBroadcastsCard",
      ConnectedBroadcastsCard,
      "broadcasts-card-native",
      "broadcasts-card",
      "BroadcastsCard",
      BroadcastsCardPlaceholder,
    ],
    [
      "ConnectedBroadcastsAndStatisticsCard",
      ConnectedBroadcastsAndStatisticsCard,
      "broadcasts-and-statistics-card-native",
      "broadcasts-and-statistics-card",
      "BroadcastsAndStatisticsCard",
      BroadcastsAndStatisticsCardPlaceholder,
    ],
    [
      "ConnectedSportsbookBetLegCard",
      ConnectedSportsbookBetLegCard,
      "sportsbook-bet-leg-card-native",
      "sportsbook-bet-leg-card",
      "BetLegCard",
      SportsbookBetLegCardPlaceholder,
    ],
    [
      "ConnectedRegulatoryCard",
      ConnectedRegulatoryCard,
      "regulatory-card-native",
      "regulatory-card",
      "RegulatoryCard",
      RegulatoryCardPlaceholder,
    ],
    [
      "ConnectedGameInfoCard",
      ConnectedGameInfoCard,
      "game-info-card-native",
      "game-info-card",
      "GameInfoCard",
      GameInfoPlaceholder,
    ],
    [
      "ConnectedGamingLinkCard",
      ConnectedGamingLinkCard,
      "gaming-link-card-native",
      "gaming-link-card",
      "GamingLinkCard",
      GamingLinkCardPlaceholder,
    ],
    [
      "ConnectedRaceByTimeRangeCard",
      ConnectedRaceByTimeRangeCard,
      "race-by-time-range-card-native",
      "race-by-time-range-card",
      "RaceByTimeRangeCard",
      RaceByTimeRangeCardPlaceholder,
    ],
    [
      "ConnectedGenericViewLinkCard",
      ConnectedGenericViewLinkCard,
      "generic-view-link-card-native",
      "generic-view-link-card",
      "GenericViewLinkCard",
      DefaultPlaceholder,
    ],
    [
      "ConnectedCompetitionViewLinkCard",
      ConnectedCompetitionViewLinkCard,
      "competition-view-link-card-native",
      "competition-view-link-card",
      "CompetitionViewLinkCard",
      CompetitionViewLinkCardPlaceholder,
    ],
    [
      "ConnectedCompetitionRegionCard",
      ConnectedCompetitionRegionCard,
      "competition-region-card-native",
      "competition-region-card",
      "CompetitionRegionCard",
      CompetitionRegionCardPlaceholder,
    ],
    [
      "ConnectedCouponHeaderCard",
      ConnectedCouponHeaderCard,
      "coupon-header-card-native",
      "coupon-header-card",
      "CouponHeaderCard",
      CouponHeaderCardPlaceholder,
    ],
    [
      "ConnectedRaceResultsCard",
      ConnectedRaceResultsCard,
      "race-results-card-native",
      "race-results-card",
      "RaceResultsCard",
      RaceResultsCardPlaceholder,
    ],
    [
      "ConnectedTimeFormBroadCastsCard",
      ConnectedTimeFormBroadCastsCard,
      "time-form-broadcasts-card-native",
      "time-form-broadcasts-card",
      "TimeFormBroadCastsCard",
      TimeFormBroadCastsCardPlaceholder,
    ],
    [
      "ConnectedVirtualEventDetailsCard",
      ConnectedVirtualEventDetailsCard,
      "virtual-event-details-card-native",
      "virtual-event-details-card",
      "VirtualEventDetailsCard",
      DefaultPlaceholder,
    ],
    ["ConnectedGridCard", ConnectedGridCard, "grid-card-native", "grid-card", "GridCard", GridCardPlaceholder],
    [
      "ConnectedExpandableMarketCard",
      ConnectedExpandableMarketCard,
      "expandable-market-card-native",
      "expanded-market-card",
      "ExpandableMarketCard",
      ExpandableMarketCardPlaceholder,
    ],
    [
      "ConnectedVirtualMarketCard",
      ConnectedVirtualMarketCard,
      "virtual-market-card-native",
      "virtual-market-card",
      "VirtualMarketCard",
      DefaultPlaceholder,
    ],
    [
      "ConnectedPopularBetBuilderCard",
      ConnectedPopularBetBuilderCard,
      "popular-bet-builder-card-native",
      "popular-bet-builder-card",
      "PopularBetBuilderCard",
      DefaultPlaceholder,
    ],
    [
      "ConnectedCorrectScoreCard",
      ConnectedCorrectScoreCard,
      "correct-score-card-native",
      "correct-score-card",
      "CorrectScoreCard",
      CorrectScoreCardPlaceholder,
    ],
    [
      "ConnectedOutrightMarketListCard",
      ConnectedOutrightMarketListCard,
      "outright-market-list-card-native",
      "outright-market-list-card",
      "OutrightMarketListCard",
      DefaultPlaceholder,
    ],
    [
      "PopularMultiplesBetBuilderCard",
      ConnectedPopularBetBuilderCard,
      "popular-bet-builder-card-native",
      "popular-bet-builder-card",
      "PopularBetBuilderCard",
      DefaultPlaceholder,
    ],
    [
      "SportsbookBetInfoCard",
      ConnectedSportsbookBetInfoCard,
      "sportsbook-bet-info-card-native",
      "sportsbook-bet-info-card",
      "SportsbookBetInfoCard",
      DefaultPlaceholder,
    ],
    [
      "MarketBetCard",
      ConnectedMarketBetCard,
      "market-bet-card-native",
      "market-bet-card",
      "MarketBetCard",
      DefaultPlaceholder,
    ],
    [
      "MarketBetSelectionCard",
      ConnectedMarketBetSelectionCard,
      "market-bet-selection-card-native",
      "market-bet-selection",
      "MarketBetSelectionCard",
      DefaultPlaceholder,
    ],
    [
      "PackagedCreatedBetsCard",
      ConnectedPackagedCreatedBetsCard,
      "packaged-created-bets-card-native",
      "packaged-created-bets-card",
      "PackagedCreatedBetsCard",
      DefaultPlaceholder,
    ],
    [
      "PriceBoostMultisListCard",
      ConnectedPriceBoostMultisListCard,
      "price-boost-multis-list-card-native",
      "price-boost-multis-list-card",
      "PriceBoostMultisListCard",
      DefaultPlaceholder,
    ],
    [
      "ExtraWalletCard",
      ConnectedExtraWalletCard,
      "extra-wallet-card-native",
      "extra-wallet-card",
      "ExtraWalletCard",
      DefaultPlaceholder,
    ],
    [
      "ObbCardGroup",
      ConnectedObbCardGroup,
      "obb-card-group-native",
      "obb-card-group",
      "ObbCardGroup",
      ObbCardGroupPlaceholder,
    ],
    [
      "ObbCreatedBetsCardGroup",
      ConnectedObbCreatedBetsCardGroup,
      "obb-created-bets-card-group-native",
      "obb-created-bets-card-group",
      "ObbCreatedBetsCardGroup",
      ObbCreatedBetsCardGroupPlaceholder,
    ],
    [
      "ObbEventPopularsCard",
      ConnectedObbEventPopularsCard,
      "obb-event-populars-card-native",
      "obb-event-populars-card",
      "ObbEventPopularsCard",
      ObbEventPopularsCardPlaceholder,
    ],
  ])("when the card type is `%s`", (componentName, connected, component, testId, typename, placeholder) => {
    it(`should lazy load and render the connected ${componentName} component`, async () => {
      const { queryByTestId } = render(
        <Card urn={"urn"} typename={typename} placeholder={placeholder} theme="HIGHLIGHTED" />,
      );

      const result = await queryByTestId(testId);

      expect(result).toBeDefined();
      expect(connected).toHaveBeenCalledWith({ urn: "urn", component, placeholder, theme: "HIGHLIGHTED" }, undefined);
    });
  });

  describe.each([
    ["StatsFormCard", StatsFormCard, "stats-form-card"],
    ["StatsHeadToHeadCard", StatsHeadToHeadCard, "stats-head-to-head-card"],
    ["StatsTeamsCard", StatsTeamsCard, "stats-teams-card"],
    ["StatsMatchStatsCard", StatsMatchStatsCard, "stats-match-stats-card"],
    ["StatsGoalsAndShotsCard", StatsGoalsAndShotsCard, "stats-goals-and-shots-card"],
    ["StatsPlayersInPlayCard", StatsPlayersInPlayCard, "stats-players-in-play-card"],
    ["StatsPlayersSeasonStatsCard", StatsPlayersSeasonStatsCard, "stats-players-season-card"],
    ["StatsBroadcastsCard", StatsBroadcastsCard, "stats-broadcasts-card"],
    ["StatsRaceResultsCard", StatsRaceResultsCard, "stats-race-results-card"],
    ["StatsLineupsCard", StatsLineupsCard, "stats-lineups-card"],
    ["StatsTableCard", StatsLeagueTableCard, "stats-league-table-card"],
    ["IncidentsCard", IncidentsCard, "incidents-card"],
    ["SelfExclusionCard", SelfExclusionCard, "self-exclusion-card"],
    ["GenericSwitcherCard", GenericSwitcherCard, "generic-switcher-card"],
    ["RaceSwitcherCard", RaceSwitcherCard, "race-switcher-card"],
    ["LoyaltyPromoCard", LoyaltyPromoCard, "loyalty-promo-card"],
    ["MiniPromoBannerCard", MiniPromotionCard, "mini-promo-card"],
    ["EditorialPromoCard", EditorialPromoCard, "editorial-promo-card"],
    ["BetOpportunityPromoCard", BetOpportunityPromoCard, "bet-opportunity-promo-card"],
    ["LottoCard", LottoCard, "lotto-card"],
    ["PriceBoostMultiplePromoCard", PriceBoostMultiplePromoCard, "price-boost-multiple-promo-card"],
    ["SportsbookLotteriesBetLegCardGroup", SportsbookLotteriesBetLegCardGroup, "sbk-lotteries-bet-leg-card-group"],
    ["TeamLineupCard", TeamLineupCard, "team-lineup-card"],
    ["MonterosaContentCard", MonterosaContent, "monterosa-content-card"],
    ["EmbeddedContentCard", EmbeddedContentCard, "embedded-content-card"],
    ["EmbeddedViewCard", EmbeddedViewCard, "embedded-view-card"],
    ["SportsbookChatbotCard", SportsbookChatbotCard, "sportsbook-chatbot-card"],
    ["PenaltyTakersCard", PenaltyTakersCard, "penalty-takers-card"],
  ])("when the card is migrated and type is `%s`", (typename, card, testId) => {
    it(`should lazy load and render the card ${typename} component`, async () => {
      const { queryByTestId } = render(<Card urn={"urn"} typename={typename} visible={true} />);

      const result = await queryByTestId(testId);
      expect(result).toBeDefined();
      expect(card).toHaveBeenCalledWith(expect.objectContaining({ urn: "urn", visible: true }), undefined);
    });
  });

  it("should not render when no type", () => {
    const { toJSON } = render(<Card urn={"urn"} />);
    expect(toJSON()).toBeNull();
  });

  it("should not render when card type not implemented", () => {
    const { toJSON } = render(<Card cardType="OTHER_CARD" urn={"urn"} />);
    expect(toJSON()).toBeNull();
  });
});
