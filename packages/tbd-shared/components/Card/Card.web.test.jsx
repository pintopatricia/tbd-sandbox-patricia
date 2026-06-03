import "jest-dom/extend-expect";
import { render, waitFor, getByTestId } from "@testing-library/react";
import StatsFormCard from "@ppb/tbd-components-rich-data/components/StatsFormCard/view/StatsFormCard.web";
import StatsHeadToHeadCard from "@ppb/tbd-components-rich-data/components/StatsHeadToHeadCard/view/StatsHeadToHeadCard.web";
import GenericSwitcherCard from "@ppb/tbd-components-navigation/components/GenericSwitcherCard/view/GenericSwitcherCard.web";
import RaceSwitcherCard from "@ppb/tbd-components-navigation/components/RaceSwitcherCard/view/RaceSwitcherCard.web";
import StatsTeamsCard from "@ppb/tbd-components-rich-data/components/StatsTeamsCard/view/StatsTeamsCard.web";
import MiniPromoBannerCard from "@ppb/tbd-components-promotions/components/LoyaltyPromoCard/view/MiniPromotionCard.web";
import EditorialPromoCard from "@ppb/tbd-components-promotions/components/EditorialPromoCard/view/EditorialPromoCard.web";
import BetOpportunityPromoCard from "@ppb/tbd-components-promotions/components/BetOpportunityPromoCard/view/BetOpportunityPromoCard.web";
import LoyaltyPromoCard from "@ppb/tbd-components-promotions/components/LoyaltyPromoCard/view/LoyaltyPromoCard.web";
import SelectionPromoCard from "@ppb/tbd-components-promotions/components/SelectionPromoCard/view/SelectionPromoCard.web";
import LottoCard from "@ppb/tbd-components-sports-betting/components/LottoCard/view/LottoCard.web";
import SportsbookLotteriesBetLegCardGroup from "@ppb/tbd-components-my-bets/components/SportsbookLotteriesBetLegCardGroup/view/SportsbookLotteriesBetLegCardGroup.web";
import PriceBoostMultiplePromoCard from "@ppb/tbd-components-promotions/components/PriceBoostMultiplePromoCard/view/PriceBoostMultiplePromoCard.web";
import PromotionsCardGroup from "@ppb/tbd-components-promotions/components/PromotionsCardGroup/view/PromotionsCardGroup.web";
import MonterosaContentCard from "../MonterosaContentCard/view/MonterosaContentCard.web";
import EmbeddedViewCard from "@ppb/tbd-components-regulatory-and-utils/components/EmbeddedViewCard/view/EmbeddedViewCard.web";

import Card from "./Card.web";
import ConnectedEventMarketCard from "../EventMarketCard";
import ConnectedMatchTimelineCard from "../MatchTimelineCard";
import ConnectedGameCard from "../GameCard";
import ConnectedViewZone from "../ViewZone";
import ConnectedSegmentedCardGroup from "../SegmentedCardGroup";
import ConnectedMarketRulesCard from "../MarketRulesCard";
import ConnectedFixtureCard from "../FixtureCard";
import ConnectedEventHeaderCard from "../EventHeaderCard";
import ConnectedMarketCard from "../MarketCard";
import ConnectedCompetitionViewLinkCard from "../CompetitionViewLinkCard";
import ConnectedRaceMarketCard from "../RaceMarketCard";
import ConnectedEventViewLinkCard from "../EventViewLinkCard";
import ConnectedSportViewLinkCard from "../SportViewLinkCard";
import ConnectedSportsbookBetCard from "../SportsbookBetCard";
import ConnectedHighlightedSelectionCard from "../HighlightedSelectionCard";
import ConnectedHeadToHeadCard from "../HeadToHeadCard";
import ConnectedRecentFormCard from "../RecentFormCard";
import ConnectedMatchStatsCard from "../MatchStatsCard";
import ConnectedPromotionCard from "../PromotionCard";
import ConnectedQuickLinksCard from "../QuickLinksCard";
import ConnectedGameInfoCard from "../GameInfo";
import ConnectedMarketExtendedCard from "../MarketExtendedCard";
import ConnectedRaceViewLinksCard from "../RaceViewLinksCard";
import ConnectedRaceViewLinkCard from "../RaceViewLinkCard";
import ConnectedMarketViewLinkCard from "../MarketViewLinkCard";
import ConnectedGamingLinkCard from "../GamingLinkCard";
import ConnectedBroadcastsCard from "../BroadcastsCard";
import ConnectedBroadcastsAndStatisticsCard from "../BroadcastsAndStatisticsCard";
import ConnectedTimeFormBroadCastsCard from "../TimeFormBroadCastsCard";
import ConnectedRunnerInfoCard from "../RunnerInfoCard";
import ConnectedImsPromotionErrorCard from "../ImsPromotionErrorCard";
import ConnectPreferenceSingleChoiceCard from "../PreferenceSingleChoiceCard";
import ConnectedForbiddenContentCard from "../ForbiddenContentCard";
import ConnectedCompetitionRegionCard from "../CompetitionRegionCard";
import ConnectedBetCardGroup from "../BetCardGroup";
import ConnectedSportsbookBetLegCard from "../SportsbookBetLegCard";
import ConnectedSportsbookBetLegCardGroup from "../SportsbookBetLegCardGroup";
import ConnectedSportsbookExpandableLegCardGroup from "../SportsbookExpandableLegCardGroup";
import ConnectedExpandableCardGroup from "../ExpandableCardGroup";
import ConnectedCouponHeaderCard from "../CouponHeaderCard";
import ConnectedRaceResultsCard from "../RaceResultsCard";
import ConnectedVirtualEventDetailsCard from "../VirtualEventDetailsCard";
import ConnectedExpandableMarketCard from "../ExpandableMarketCard";
import ConnectedVirtualMarketCard from "../VirtualMarketCard";
import ConnectedCorrectScoreCard from "../CorrectScoreCard";
import ConnectedOutrightMarketListCard from "../OutrightMarketListCard";
import ConnectedPopularBetBuilderCard from "../PopularBetBuilderCard";
import ConnectedSportsbookBetInfoCard from "../SportsbookBetInfoCard";
import ConnectedVirtualCardGroup from "../VirtualCardGroup";
import ConnectedExtraWalletCardGroup from "../ExtraWalletCardGroup";
import ConnectedExtraWalletCard from "../ExtraWalletCard";
import ConnectedRegulatoryCard from "../RegulatoryCard";
import ConnectedImsPromotionDetailsCard from "../ImsPromotionDetailsCard";
import ConnectedObbCardGroup from "../ObbCardGroup";
import ConnectedObbCreatedBetsCardGroup from "../ObbCreatedBetsCardGroup";
import ConnectedObbEventPopularsCard from "../ObbEventPopularsCard";

/* Placeholders */
import DefaultPlaceholder from "./DefaultPlaceholder.web";
import CompetitionViewLinkCardPlaceholder from "../CompetitionViewLinkCard/CompetitionViewLinkCardPlaceholder.web";
import MarketViewLinkCardPlaceholder from "../MarketViewLinkCard/MarketViewLinkCardPlaceholder.web";
import GameCardPlaceholder from "../GameCard/GameCardPlaceholder.web";
import GamingLinkCardPlaceholder from "../GamingLinkCard/GamingLinkCardPlaceholder.web";
import EventViewLinkCardPlaceholder from "../EventViewLinkCard/EventViewLinkCardPlaceholder.web";
import EventHeaderCardPlaceholder from "../EventHeaderCard/EventHeaderCardPlaceholder.web";
import RaceViewLinkCardPlaceholder from "../RaceViewLinkCard/RaceViewLinkCardPlaceholder.web";
import RaceViewLinksCardPlaceholder from "../RaceViewLinksCard/RaceViewLinksCardPlaceholder.web";
import SportsbookBetCardPlaceholder from "../SportsbookBetCard/SportsbookBetCardPlaceholder.web";
import SportViewLinkCardPlaceholder from "../SportViewLinkCard/SportViewLinkPlaceholder.web";
import SportsbookBetLegCardPlaceholder from "../SportsbookBetLegCard/SportsbookBetLegCardPlaceholder.web";
import SportsbookExpandableLegCardGroupPlaceholder from "../SportsbookExpandableLegCardGroup/SportsbookExpandableLegCardGroupPlaceholder.web";
import SportsbookBetLegCardGroupPlaceholder from "../SportsbookBetLegCardGroup/SportsbookBetLegCardGroupPlaceholder.web";
import CompetitionRegionCardPlaceholder from "../CompetitionRegionCard/CompetitionRegionCardPlaceholder.web";
import CouponHeaderCardPlaceholder from "../CouponHeaderCard/CouponHeaderCardPlaceholder.web";
import ExpandableMarketCardPlaceholder from "../ExpandableMarketCard/ExpandableMarketCardPlaceholder.web";
import CorrectScoreCardPlaceholder from "../CorrectScoreCard/CorrectScoreCardPlaceholder.web";
import MarketCardPlaceholder from "../MarketCard/MarketCardPlaceholder.web";
import BroadcastsCardPlaceholder from "../BroadcastsCard/BroadcastsCardPlaceholder.web";
import BroadcastsAndStatisticsCardPlaceholder from "../BroadcastsAndStatisticsCard/BroadcastsAndStatisticsCardPlaceholder.web";
import TimeFormBroadCastsCardPlaceholder from "../TimeFormBroadCastsCard/TimeFormBroadCastsCardPlaceholder.web";
import QuickLinksCardPlaceholder from "../QuickLinksCard/QuickLinksCardPlaceholder.web";
import EventMarketCardPlaceholder from "../EventMarketCard/EventMarketCardPlaceholder.web";
import FixtureCardPlaceholder from "../FixtureCard/FixtureCardPlaceholder.web";
import RegulatoryCardPlaceholder from "../RegulatoryCard/RegulatoryCardPlaceholder.web";
import ImsPromotionDetailsCardPlaceholder from "../ImsPromotionDetailsCard/ImsPromotionDetailsCardPlaceholder.web";
import ObbCardGroupPlaceholder from "../ObbCardGroup/ObbCardGroupPlaceholder.web";
import ObbCreatedBetsCardGroupPlaceholder from "../ObbCreatedBetsCardGroup/placeholder/ObbCreatedBetsCardGroupPlaceholder.web";
import ObbEventPopularsCardPlaceholder from "../ObbEventPopularsCard/placeholder/ObbEventPopularsCardPlaceholder.web";

/* Migrated cards */
import GamingPrizeMachineCard from "@ppb/tbd-components-gaming/components/GamingPrizeMachineCard/view/GamingPrizeMachineCard.web";
import StatsMatchStatsCard from "@ppb/tbd-components-rich-data/components/StatsMatchStatsCard/view/StatsMatchStatsCard.web";
import IncidentsCard from "@ppb/tbd-components-rich-data/components/IncidentsCard/view/IncidentsCard.web";
import StatsGoalsAndShotsCard from "@ppb/tbd-components-rich-data/components/StatsGoalsAndShotsCard/view/StatsGoalsAndShotsCard.web";
import StatsPlayersInPlayCard from "../StatsPlayersInPlayCard/view/StatsPlayersInPlayCard.web";
import StatsPlayersSeasonStatsCard from "@ppb/tbd-components-rich-data/components/StatsPlayersSeasonStatsCard/view/StatsPlayersSeasonStatsCard.web";
import StatsBroadcastsCard from "@ppb/tbd-components-rich-data/components/StatsBroadcastsCard/view/StatsBroadcastsCard.web";
import StatsRaceResultsCard from "../StatsRaceResultsCard/view/StatsRaceResultsCard.web";
import GameInfoCardPlaceholder from "../GameInfo/snowflakes/GameInfo/GameInfoPlaceholder.web";
import StatsLineupsCard from "@ppb/tbd-components-rich-data/components/StatsLineupsCard/view/StatsLineupsCard.web";
import TeamLineupCard from "@ppb/tbd-components-rich-data/components/TeamLineupCard/view/TeamLineupCard.web";
import RaceMarketCardPlaceholder from "../RaceMarketCard/RaceMarketCardPlaceholder.web";
import RaceResultsCardPlaceholder from "../RaceResultsCard/RaceResultsCardPlaceholder.web";
import StatsLeagueTableCard from "@ppb/tbd-components-rich-data/components/StatsLeagueTableCard/view/StatsLeagueTableCard.web";
import MarketExtendedCardPlaceholder from "../MarketExtendedCard/MarketExtendedCardPlaceholder.web";
import EmbeddedContentCard from "@ppb/tbd-components-rich-data/components/EmbeddedContentCard/view/EmbeddedContentCard.web";
import PromotionsHubCardGroup from "@ppb/tbd-components-promotions/components/PromotionsHubCardGroup/view/PromotionsHubCardGroup.web";
import SportsbookChatbotCard from "../SportsbookChatbotCard/SportsbookChatbotCard.web";
import PenaltyTakersCard from "@ppb/tbd-components-sports-betting/components/PenaltyTakersCard/view/PenaltyTakersCard.web";

/* Hooks */
jest.mock("react-redux", () => ({
  useSelector: jest.fn(),
}));

// Connected mocks
jest.mock("../EventMarketCard", () => jest.fn(() => <connected-event-market-card data-testid="event-market-card" />));
jest.mock("../MatchTimelineCard", () =>
  jest.fn(() => <connected-match-timeline-card data-testid="matchtimeline-card" />),
);
jest.mock("../GameCard", () => jest.fn(() => <connected-game-card data-testid="game-card" />));
jest.mock("../MarketRulesCard", () =>
  jest.fn(() => <connected-market-rules-card-mock data-testid="market-rules-card" />),
);
jest.mock("../FixtureCard", () => jest.fn(() => <connected-fixture-card data-testid="fixture-card" />));
jest.mock("../EventHeaderCard", () => jest.fn(() => <connected-event-header-card data-testid="event-header-card" />));
jest.mock("../MarketCard", () => jest.fn(() => <connected-market-card data-testid="market-card" />));
jest.mock("../MarketViewLinkCard", () =>
  jest.fn(() => <connected-market-view-link-card data-testid="market-view-link-card" />),
);
jest.mock("../CompetitionViewLinkCard", () =>
  jest.fn(() => <connected-competition-view-link-card data-testid="competition-view-link-card" />),
);
jest.mock("../RaceMarketCard", () => jest.fn(() => <connected-race-market-card data-testid="race-market-card" />));
jest.mock("../EventViewLinkCard", () =>
  jest.fn(() => <connected-event-view-link-card data-testid="event-view-link" />),
);
jest.mock("../SportsbookBetCard", () =>
  jest.fn(() => <connected-sportsbook-bet-card data-testid="sportsbook-bet-card" />),
);
jest.mock("../HighlightedSelectionCard", () =>
  jest.fn(() => <connected-highlighted-selection-card data-testid="highlighted-selection-card" />),
);
jest.mock("../HeadToHeadCard", () => jest.fn(() => <connected-head-to-head-card data-testid="head-to-head-card" />));
jest.mock("../RecentFormCard", () => jest.fn(() => <connected-recent-form-card data-testid="recent-form-card" />));
jest.mock("../MatchStatsCard", () => jest.fn(() => <connected-match-stats-card data-testid="match-stats-card" />));
jest.mock("../PromotionCard", () => jest.fn(() => <connected-promotion-card data-testid="promotion-card" />));
jest.mock("../QuickLinksCard", () => jest.fn(() => <connected-quick-links-card data-testid="quick-links-card" />));
jest.mock("../GameInfo", () => jest.fn(() => <connected-game-info-card data-testid="game-info-card" />));
jest.mock("../RaceViewLinksCard", () =>
  jest.fn(() => <connected-race-viewlinks-card data-testid="race-viewlinks-card" />),
);
jest.mock("../RaceViewLinkCard", () =>
  jest.fn(() => <connected-race-viewlink-card data-testid="race-viewlink-card" />),
);
jest.mock("../MarketViewLinkCard", () =>
  jest.fn(() => <connected-market-view-link-card data-testid="market-view-link-card" />),
);
jest.mock("../GamingLinkCard", () => jest.fn(() => <connected-gaming-link-card data-testid="gaming-link-card" />));
jest.mock("../ViewZone", () => jest.fn(() => <connected-view-zone-mock data-testid="view-zone" />));
jest.mock("../SegmentedCardGroup", () =>
  jest.fn(() => <connectedsegmented-card-group data-testid="segmented-cardgroup" />),
);
jest.mock("../SwimlaneCardGroup", () =>
  jest.fn(() => <connected-swimlane-card-group data-testid="swimlane-card-group" />),
);
jest.mock("../BroadcastsCard", () => jest.fn(() => <connected-broadcasts-card data-testid="broadcasts-card" />));
jest.mock("../BroadcastsAndStatisticsCard", () =>
  jest.fn(() => <connected-broadcasts-and-statistics-card data-testid="broadcasts-and-statistics-card" />),
);
jest.mock("../TimeFormBroadCastsCard", () =>
  jest.fn(() => <connected-time-form-broadcasts-card data-testid="time-form-broadcasts-card" />),
);
jest.mock("@ppb/tbd-components-navigation/components/GenericSwitcherCard/view/GenericSwitcherCard.web", () =>
  jest.fn(() => <connected-generic-switcher-card data-testid="generic-switcher-card" />),
);
jest.mock("@ppb/tbd-components-navigation/components/RaceSwitcherCard/view/RaceSwitcherCard.web", () =>
  jest.fn(() => <connected-race-switcher-card data-testid="race-switcher-card" />),
);
jest.mock("@ppb/tbd-components-promotions/components/LoyaltyPromoCard/view/LoyaltyPromoCard.web", () =>
  jest.fn(() => <connected-mini-promo-card data-testid="mini-promo-card" />),
);
jest.mock("../RunnerInfoCard", () => jest.fn(() => <connected-runner-info-card data-testid="runner-info-card" />));
jest.mock("../ImsPromotionErrorCard", () =>
  jest.fn(() => <connected-ims-promotion-error-card data-testid="ims-promotion-error-card" />),
);
jest.mock("../SportViewLinkCard", () =>
  jest.fn(() => <connected-sport-view-link-card data-testid="sport-view-link" />),
);
jest.mock("../PreferenceSingleChoiceCard", () =>
  jest.fn(() => <connected-preference-single-choice-card data-testid="preference-single-choice-card" />),
);
jest.mock("../ForbiddenContentCard", () =>
  jest.fn(() => <connected-forbidden-content-card data-testid="forbidden-content-card" />),
);
jest.mock("../CompetitionRegionCard", () =>
  jest.fn(() => <connected-competition-region-card data-testid="competition-region-card" />),
);

jest.mock("../BetCardGroup", () => jest.fn(() => <connected-betcardgroup data-testid="betcardgroup" />));
jest.mock("../SportsbookBetLegCard", () =>
  jest.fn(() => <connected-sportsbook-bet-leg-card data-testid="sportsbook-bet-leg-card" />),
);
jest.mock("../SportsbookBetLegCardGroup", () =>
  jest.fn(() => <connected-sportsbook-bet-leg-card-group data-testid="sportsbook-bet-leg-card-group" />),
);
jest.mock("../SportsbookExpandableLegCardGroup", () =>
  jest.fn(() => <connected-sportsbook-expandable-leg-card-group data-testid="sportsbook-expandable-leg-card-group" />),
);
jest.mock("../ExpandableCardGroup", () =>
  jest.fn(() => <connected-expandable-card-group data-testid="expandable-card-group" />),
);
jest.mock("../CouponHeaderCard", () =>
  jest.fn(() => <connected-coupon-header-card data-testid="coupon-header-card" />),
);
jest.mock("../RaceResultsCard", () => jest.fn(() => <connected-race-results-card data-testid="race-results-card" />));
jest.mock("../VirtualEventDetailsCard", () =>
  jest.fn(() => <connected-virtual-event-details-card data-testid="virtual-event-details-card" />),
);
jest.mock("../ExpandableMarketCard", () =>
  jest.fn(() => <expandable-market-card data-testid="expandable-market-card" />),
);
jest.mock("../VirtualMarketCard", () =>
  jest.fn(() => <connected-virtual-market-card data-testid="virtual-market-card" />),
);
jest.mock("../CorrectScoreCard", () =>
  jest.fn(() => <connected-correct-score-card data-testid="correct-score-card" />),
);
jest.mock("../OutrightMarketListCard", () =>
  jest.fn(() => <connected-outright-market-list-card data-testid="outright-market-list-card" />),
);
jest.mock("../PopularBetBuilderCard", () =>
  jest.fn(() => <connected-popular-bet-builder-card data-testid="popular-bet-builder-card" />),
);
jest.mock("@ppb/tbd-components-sports-betting/components/PopularSelectionsCard/view/PopularSelectionsCard.web", () =>
  jest.fn(() => <popular-selections-card-mock data-testid="popular-selections-card" />),
);

jest.mock("../SportsbookBetInfoCard", () =>
  jest.fn(() => <connected-sportsbook-bet-info-card data-testid="sportsbook-bet-info-card" />),
);
jest.mock("../VirtualCardGroup", () =>
  jest.fn(() => <connected-virtual-card-group data-testid="virtual-card-group" />),
);
jest.mock("../ExtraWalletCardGroup", () =>
  jest.fn(() => <connected-extra-wallet-card-group data-testid="extra-wallet-card-group" />),
);
jest.mock("../ExtraWalletCard", () => jest.fn(() => <connected-extra-wallet-card data-testid="extra-wallet-card" />));
jest.mock("../RegulatoryCard", () => jest.fn(() => <connected-regulatory-card data-testid="regulatory-card" />));
jest.mock("../ImsPromotionDetailsCard", () =>
  jest.fn(() => <connected-ims-promotion-details-card data-testid="ims-promotion-details-card" />),
);
jest.mock("../ObbCardGroup", () => jest.fn(() => <connected-obb-card-group data-testid="obb-card-group" />));
jest.mock("../ObbCreatedBetsCardGroup", () =>
  jest.fn(() => <connected-obb-created-bets-card-group data-testid="obb-created-bets-card-group" />),
);
jest.mock("../ObbEventPopularsCard", () =>
  jest.fn(() => <connected-obb-event-populars-card data-testid="obb-event-populars-card" />),
);

// Web components mocks
jest.mock("../EventMarketCard/EventMarketCard.web", () => jest.fn(() => <event-market-card-mock />));
jest.mock("../MarketRulesCard/MarketRulesCard.web", () => jest.fn(() => <market-rules-card-mock />));
jest.mock("../MatchTimelineCard/MatchTimelineCard.web", () => jest.fn(() => <matchtimeline-card-mock />));
jest.mock("../GameCard/GameCard.web", () => jest.fn(() => <game-card-mock />));
jest.mock("../MarketViewLinkCard/MarketViewLinkCard.web", () => jest.fn(() => <market-view-link-mock />));
jest.mock("../GameInfo/GameInfo.web", () => jest.fn(() => <game-info-mock />));
jest.mock("../MarketCard/MarketCard.web", () => jest.fn(() => <basic-market-mock />));
jest.mock("../CompetitionViewLinkCard/CompetitionViewLinkCard.web", () =>
  jest.fn(() => <competition-view-link-card-mock />),
);
jest.mock("../RaceMarketCard/RaceMarketCard.web", () => jest.fn(() => <race-market-card-mock />));
jest.mock("../HighlightedSelectionCard/HighlightedSelectionCard.web", () =>
  jest.fn(() => <highlighted-selection-card-mock />),
);
jest.mock("../RecentFormCard/RecentFormCard.web", () => jest.fn(() => <recent-form-card-mock />));
jest.mock("../HeadToHeadCard/HeadToHeadCard.web", () => jest.fn(() => <head-to-head-mock />));
jest.mock("../MatchStatsCard/MatchStatsCard.web", () => jest.fn(() => <match-stats-mock />));
jest.mock("../EventViewLinkCard/EventViewLinkCard.web", () => jest.fn(() => <event-view-link-card />));
jest.mock("../PromotionCard/PromotionCard.web", () => jest.fn(() => <promotion-card-mock />));
jest.mock("../QuickLinksCard/QuickLinksCard.web", () => jest.fn(() => <quick-links-card-mock />));
jest.mock("./MakeMeAgnostic", () => jest.fn(() => <make-me-agnostic-mock />));
jest.mock("../FixtureCard/FixtureCard.web", () => jest.fn(() => <fixture-card-mock />));
jest.mock("../EventHeaderCard/EventHeaderCard.web", () => jest.fn(() => <event-header-card-mock />));
jest.mock("../SportsbookBetCard/SportsbookBetCard.web", () => jest.fn(() => <sportsbook-bet-card-mock />));
jest.mock("../MarketExtendedCard", () =>
  jest.fn(() => <connected-market-extended-card-mock data-testid="market-extended-card" />),
);
jest.mock("../MarketExtendedCard/MarketExtendedCard.web", () => jest.fn(() => <market-extended-card-mock />));
jest.mock("../RaceViewLinksCard/RaceViewLinksCard.web", () => jest.fn(() => <race-viewlinks-card-mock />));
jest.mock("../RaceViewLinkCard/RaceViewLinkCard.web", () => jest.fn(() => <race-viewlink-card-mock />));
jest.mock("../MarketViewLinkCard/MarketViewLinkCard.web", () => jest.fn(() => <market-view-link-card-mock />));
jest.mock("../GamingLinkCard/GamingLinkCard.web", () => jest.fn(() => <gaming-link-card />));
jest.mock("../ViewZone/ViewZone.web", () => jest.fn(() => <view-zone-mock />));
jest.mock("../SegmentedCardGroup/SegmentedCardGroup.web", () => jest.fn(() => <segmented-card-group />));
jest.mock("../SwimlaneCardGroup/SwimlaneCardGroup.web", () => jest.fn(() => <swimlane-card-group />));
jest.mock("../BroadcastsCard/BroadcastsCard.web", () => jest.fn(() => <broadcasts-card-mock />));
jest.mock("../BroadcastsAndStatisticsCard/BroadcastsAndStatisticsCard.web", () =>
  jest.fn(() => <broadcasts-and-statistics-card-mock />),
);
jest.mock("../TimeFormBroadCastsCard/TimeFormBroadCastsCard.web", () =>
  jest.fn(() => <time-form-broadcasts-card-mock />),
);
jest.mock("../RunnerInfoCard/RunnerInfoCard.web", () => jest.fn(() => <runner-info-card />));
jest.mock("../SportViewLinkCard/SportViewLinkCard.web", () => jest.fn(() => <sport-view-link-card />));
jest.mock("../PreferenceSingleChoiceCard/PreferenceSingleChoiceCard.web", () =>
  jest.fn(() => <preference-single-choice-card />),
);
jest.mock("../ForbiddenContentCard/ForbiddenContentCard.web", () => jest.fn(() => <forbidden-content-card />));
jest.mock("../CompetitionRegionCard/CompetitionRegionCard.web", () => jest.fn(() => <competition-region-card />));
jest.mock("../BetCardGroup/BetCardGroup.web", () => jest.fn(() => <betcardgroup-mock />));
jest.mock("../SportsbookBetLegCard/SportsbookBetLegCard.web", () => jest.fn(() => <sportsbook-bet-leg-card-mock />));
jest.mock("../SportsbookBetLegCardGroup/SportsbookBetLegCardGroup.web", () =>
  jest.fn(() => <sportsbook-bet-leg-card-group-mock />),
);
jest.mock("../SportsbookExpandableLegCardGroup/SportsbookExpandableLegCardGroup.web", () =>
  jest.fn(() => <sportsbook-expandable-leg-card-group-mock />),
);
jest.mock("../ExpandableCardGroup/ExpandableCardGroup.web", () => jest.fn(() => <expandable-card-group-mock />));
jest.mock("../CouponHeaderCard/CouponHeaderCard.web", () => jest.fn(() => <coupon-header-card-mock />));
jest.mock("../RaceResultsCard/RaceResultsCard.web", () => jest.fn(() => <race-results-card-mock />));
jest.mock("../VirtualEventDetailsCard/VirtualEventDetailsCard.web", () =>
  jest.fn(() => <virtual-event-details-card-mock />),
);
jest.mock("../VirtualMarketCard/VirtualMarketCard.web", () => jest.fn(() => <virtual-market-card-mock />));
jest.mock("../CorrectScoreCard/CorrectScoreCard.web", () => jest.fn(() => <correct-score-card-mock />));
jest.mock("../OutrightMarketListCard/OutrightMarketListCard.web", () => jest.fn(() => <outright-market-list-mock />));
jest.mock("../SportsbookBetInfoCard/SportsbookBetInfoCard.web", () => jest.fn(() => <sportsbook-bet-info-card-mock />));
jest.mock("../VirtualCardGroup/VirtualCardGroup.web", () => jest.fn(() => <virtual-card-group-mock />));
jest.mock("../ExtraWalletCardGroup/ExtraWalletCardGroup.web", () => jest.fn(() => <extra-wallet-card-group-mock />));
jest.mock("../ExtraWalletCard/ExtraWalletCard.web", () => jest.fn(() => <extra-wallet-card-mock />));
jest.mock("../ImsPromotionDetailsCard/ImsPromotionDetailsCard.web", () =>
  jest.fn(() => <ims-promotion-details-card-mock />),
);
jest.mock("../ObbCardGroup/ObbCardGroup.web", () => jest.fn(() => <obb-card-group-mock />));
jest.mock("../ObbCreatedBetsCardGroup/ObbCreatedBetsCardGroup.web", () =>
  jest.fn(() => <obb-created-bets-card-group-mock />),
);
jest.mock("../ObbEventPopularsCard/ObbEventPopularsCard.web", () => jest.fn(() => <obb-event-populars-card-mock />));

/* PLACEHOLDERS */
jest.mock("./DefaultPlaceholder.web", () => jest.fn(() => <default-placeholder />));
jest.mock("../CompetitionViewLinkCard/CompetitionViewLinkCardPlaceholder.web", () =>
  jest.fn(() => <competition-view-link-placeholder />),
);
jest.mock("../MarketViewLinkCard/MarketViewLinkCardPlaceholder.web", () =>
  jest.fn(() => <market-view-link-placeholder />),
);
jest.mock("../RaceViewLinkCard/RaceViewLinkCardPlaceholder.web", () => jest.fn(() => <race-view-link-placeholder />));
jest.mock("../RaceViewLinksCard/RaceViewLinksCardPlaceholder.web", () =>
  jest.fn(() => <race-view-links-placeholder />),
);

jest.mock("../SportsbookBetCard/SportsbookBetCardPlaceholder.web", () =>
  jest.fn(() => <sportsbook-bet-card-placeholder />),
);
jest.mock("../SportViewLinkCard/SportViewLinkPlaceholder.web", () => jest.fn(() => <sport-view-link-placeholder />));
jest.mock("../SportsbookBetLegCard/SportsbookBetLegCardPlaceholder.web", () =>
  jest.fn(() => <sportsbook-bet-leg-card-placeholder />),
);
jest.mock("../SportsbookExpandableLegCardGroup/SportsbookExpandableLegCardGroupPlaceholder.web", () =>
  jest.fn(() => <sportsbook-expandable-leg-card-group-placeholder />),
);
jest.mock("../SportsbookBetLegCardGroup/SportsbookBetLegCardGroupPlaceholder.web", () =>
  jest.fn(() => <sportsbook-bet-leg-card-group-placeholder />),
);
jest.mock("../CompetitionRegionCard/CompetitionRegionCardPlaceholder.web", () =>
  jest.fn(() => <competition-region-card-placeholder />),
);
jest.mock("../CouponHeaderCard/CouponHeaderCardPlaceholder.web", () =>
  jest.fn(() => <coupon-header-card-placeholder />),
);
jest.mock("../GenericViewLinkCard/GenericViewLinkCardPlaceholder.web", () =>
  jest.fn(() => <generic-view-link-placeholder />),
);
jest.mock("../GameCard/GameCardPlaceholder.web", () => jest.fn(() => <game-card-placeholder />));
jest.mock("../GamingLinkCard/GamingLinkCardPlaceholder.web", () => jest.fn(() => <gaming-link-card-placeholder />));
jest.mock("../EventViewLinkCard/EventViewLinkCardPlaceholder.web", () =>
  jest.fn(() => <event-view-link-card-placeholder />),
);
jest.mock("../EventHeaderCard/EventHeaderCardPlaceholder.web", () => jest.fn(() => <event-header-card-placeholder />));
jest.mock("../ExpandableMarketCard/ExpandableMarketCardPlaceholder.web", () =>
  jest.fn(() => <expandable-placeholder />),
);
jest.mock("../CorrectScoreCard/CorrectScoreCardPlaceholder.web", () =>
  jest.fn(() => <correct-score-card-placeholder />),
);
jest.mock("../QuickLinksCard/QuickLinksCardPlaceholder.web", () => jest.fn(() => <quick-links-card-placeholder />));
jest.mock("../MarketCard/MarketCardPlaceholder.web", () => jest.fn(() => <market-card-placeholder />));
jest.mock("../MarketExtendedCard/MarketExtendedCardPlaceholder.web", () =>
  jest.fn(() => <market-extended-card-placeholder />),
);
jest.mock("../EventMarketCard/EventMarketCardPlaceholder.web", () => jest.fn(() => <event-market-card-placeholder />));
jest.mock("../RaceResultsCard/RaceResultsCardPlaceholder.web", () => jest.fn(() => <race-results-card-placeholder />));
jest.mock("../RaceMarketCard/RaceMarketCardPlaceholder.web", () => jest.fn(() => <race-market-card-placeholder />));
jest.mock("../BroadcastsCard/BroadcastsCardPlaceholder.web", () => jest.fn(() => <broadcasts-card-placeholder />));

jest.mock("../FixtureCard/FixtureCardPlaceholder.web", () => jest.fn(() => <fixture-card-placeholder />));
jest.mock("../RegulatoryCard/RegulatoryCardPlaceholder.web", () => jest.fn(() => <regulatory-card-placeholder />));
jest.mock("../ImsPromotionDetailsCard/ImsPromotionDetailsCardPlaceholder.web", () =>
  jest.fn(() => <ims-promotion-details-card-placeholder />),
);
jest.mock("../ObbCardGroup/ObbCardGroupPlaceholder.web", () => jest.fn(() => <obb-card-group-placeholder />));
jest.mock("../ObbCreatedBetsCardGroup/placeholder/ObbCreatedBetsCardGroupPlaceholder.web", () =>
  jest.fn(() => <obb-created-bets-card-group-placeholder />),
);
jest.mock("../ObbEventPopularsCard/placeholder/ObbEventPopularsCardPlaceholder.web", () =>
  jest.fn(() => <obb-event-populars-card-placeholder />),
);

jest.spyOn(global.console, "warn").mockReturnValue("warning");

jest.mock("../ErrorBoundary/ErrorBoundary", () => ({
  ErrorBoundary: jest.fn(({ children }) => <>{children}</>),
}));

/* Migrated cards */
jest.mock("@ppb/tbd-components-gaming/components/GamingPrizeMachineCard/view/GamingPrizeMachineCard.web", () =>
  jest.fn(() => <gaming-prize-machine-card-mock data-testid="gaming-prize-machine-card" />),
);
jest.mock("@ppb/tbd-components-rich-data/components/StatsFormCard/view/StatsFormCard.web", () =>
  jest.fn(() => <stats-form-card-mock data-testid="stats-form-card" />),
);
jest.mock("@ppb/tbd-components-rich-data/components/StatsHeadToHeadCard/view/StatsHeadToHeadCard.web", () =>
  jest.fn(() => <stats-head-to-head-card-mock data-testid="stats-head-to-head-card" />),
);
jest.mock("@ppb/tbd-components-rich-data/components/StatsTeamsCard/view/StatsTeamsCard.web", () =>
  jest.fn(() => <stats-teams-card-mock data-testid="stats-teams-card" />),
);
jest.mock("@ppb/tbd-components-rich-data/components/StatsMatchStatsCard/view/StatsMatchStatsCard.web", () =>
  jest.fn(() => <stats-match-stats-card-mock data-testid="stats-match-stats-card" />),
);
jest.mock("@ppb/tbd-components-rich-data/components/StatsGoalsAndShotsCard/view/StatsGoalsAndShotsCard.web", () =>
  jest.fn(() => <stats-goals-and-shots-card-mock data-testid="stats-goals-and-shots-card" />),
);
jest.mock("../StatsPlayersInPlayCard/view/StatsPlayersInPlayCard.web", () =>
  jest.fn(() => <stats-players-in-play-card-mock data-testid="stats-players-in-play-card" />),
);
jest.mock(
  "@ppb/tbd-components-rich-data/components/StatsPlayersSeasonStatsCard/view/StatsPlayersSeasonStatsCard.web",
  () => jest.fn(() => <stats-players-season-card-mock data-testid="stats-players-season-card" />),
);
jest.mock("@ppb/tbd-components-rich-data/components/StatsBroadcastsCard/view/StatsBroadcastsCard.web", () =>
  jest.fn(() => <stats-broadcasts-card-mock data-testid="stats-broadcasts-card" />),
);
jest.mock("../StatsRaceResultsCard/view/StatsRaceResultsCard.web", () =>
  jest.fn(() => <stats-race-results-card-mock data-testid="stats-race-results-card" />),
);
jest.mock("../SportsbookChatbotCard/SportsbookChatbotCard.web", () =>
  jest.fn(() => <sportsbook-chatbot-card-mock data-testid="sportsbook-chatbot-card" />),
);
jest.mock("@ppb/tbd-components-rich-data/components/IncidentsCard/view/IncidentsCard.web", () =>
  jest.fn(() => <incidents-card-mock data-testid="incidents-card" />),
);
jest.mock("@ppb/tbd-components-rich-data/components/StatsLineupsCard/view/StatsLineupsCard.web", () =>
  jest.fn(() => <stats-lineups-card-mock data-testid="stats-lineups-card" />),
);
jest.mock("@ppb/tbd-components-rich-data/components/TeamLineupCard/view/TeamLineupCard.web", () =>
  jest.fn(() => <team-lineup-card-mock data-testid="team-lineup-card" />),
);
jest.mock("@ppb/tbd-components-rich-data/components/StatsLeagueTableCard/view/StatsLeagueTableCard.web", () =>
  jest.fn(() => <stats-league-table-card-mock data-testid="stats-league-table-card" />),
);
jest.mock("@ppb/tbd-components-promotions/components/LoyaltyPromoCard/view/LoyaltyPromoCard.web", () =>
  jest.fn(() => <loyalty-promo-card-mock data-testid="loyalty-promo-card" />),
);
jest.mock("@ppb/tbd-components-promotions/components/LoyaltyPromoCard/view/MiniPromotionCard.web", () =>
  jest.fn(() => <mini-promo-card-mock data-testid="mini-promo-card" />),
);
jest.mock("@ppb/tbd-components-promotions/components/EditorialPromoCard/view/EditorialPromoCard.web", () =>
  jest.fn(() => <editorial-promo-card-mock data-testid="editorial-promo-card" />),
);
jest.mock("@ppb/tbd-components-promotions/components/BetOpportunityPromoCard/view/BetOpportunityPromoCard.web", () =>
  jest.fn(() => <bet-opportunity-promo-card-mock data-testid="bet-opportunity-promo-card" />),
);
jest.mock("@ppb/tbd-components-promotions/components/SelectionPromoCard/view/SelectionPromoCard.web", () =>
  jest.fn(() => <selection-promo-card-mock data-testid="selection-promo-card" />),
);
jest.mock("@ppb/tbd-components-sports-betting/components/LottoCard/view/LottoCard.web", () =>
  jest.fn(() => <lotto-card-mock data-testid="lotto-card" />),
);
jest.mock(
  "@ppb/tbd-components-promotions/components/PriceBoostMultiplePromoCard/view/PriceBoostMultiplePromoCard.web",
  () => jest.fn(() => <price-boost-multiple-promo-card-mock data-testid="price-boost-multiple-promo-card" />),
);
jest.mock(
  "@ppb/tbd-components-my-bets/components/SportsbookLotteriesBetLegCardGroup/view/SportsbookLotteriesBetLegCardGroup.web",
  () => jest.fn(() => <sbk-lotteries-bet-leg-card-group-mock data-testid="sbk-lotteries-bet-leg-card-group" />),
);
jest.mock("@ppb/tbd-components-promotions/components/PromotionsCardGroup/view/PromotionsCardGroup.web", () =>
  jest.fn(() => <promotions-card-group-mock data-testid="promotions-card-group" />),
);
jest.mock("@ppb/tbd-components-sports-betting/components/PenaltyTakersCard/view/PenaltyTakersCard.web", () =>
  jest.fn(() => <penalty-takers-card-mock data-testid="penalty-takers-card" />),
);
jest.mock("../MonterosaContentCard/view/MonterosaContentCard.web", () =>
  jest.fn(() => <monterosa-content-card-mock data-testid="monterosa-content-card" />),
);
jest.mock("@ppb/tbd-components-rich-data/components/EmbeddedContentCard/view/EmbeddedContentCard.web", () =>
  jest.fn(() => <connected-embedded-content-card data-testid="embedded-content-card" />),
);
jest.mock("@ppb/tbd-components-regulatory-and-utils/components/EmbeddedViewCard/view/EmbeddedViewCard.web", () =>
  jest.fn(() => <embedded-view-card-mock data-testid="embedded-view-card" />),
);
jest.mock("@ppb/tbd-components-promotions/components/PromotionsHubCardGroup/view/PromotionsHubCardGroup.web", () =>
  jest.fn(() => <promotions-hub-card-group-mock data-testid="promotions-hub-card-group" />),
);

describe("Card Web", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not render any card when cardType is empty", () => {
    const { container } = render(<Card urn={"urn"} />);
    expect(container).toBeEmpty();
  });

  it("should render the component placeholder when the card is not loaded yet", () => {
    render(<Card urn={"urn"} typename={"MarketCard"} isCardLoaded={false} />);
    expect(MarketCardPlaceholder).toHaveBeenCalled();
    expect(ConnectedMarketCard).not.toHaveBeenCalled();
  });

  it("should not render any card when cardType is not whitelisted", () => {
    const { container } = render(<Card urn={"urn"} typename={"not-whitelisted"} />);

    expect(global.console.warn).toHaveBeenCalledWith("Unsupported card:", "not-whitelisted");

    expect(container).toBeEmpty();
  });

  describe.each([
    ["FixtureCard", ConnectedFixtureCard, "fixture-card", FixtureCardPlaceholder],
    ["EventHeaderCard", ConnectedEventHeaderCard, "event-header-card", EventHeaderCardPlaceholder],
    ["MarketCard", ConnectedMarketCard, "market-card", MarketCardPlaceholder],
    ["MarketViewLinkCard", ConnectedMarketViewLinkCard, "market-view-link-card", MarketViewLinkCardPlaceholder],
    [
      "CompetitionViewLinkCard",
      ConnectedCompetitionViewLinkCard,
      "competition-view-link-card",
      CompetitionViewLinkCardPlaceholder,
    ],
    ["RaceMarketCard", ConnectedRaceMarketCard, "race-market-card", RaceMarketCardPlaceholder],
    ["EventViewLinkCard", ConnectedEventViewLinkCard, "event-view-link", EventViewLinkCardPlaceholder],
    ["SportsbookBetCard", ConnectedSportsbookBetCard, "sportsbook-bet-card", SportsbookBetCardPlaceholder],
    ["HighlightedSelectionCard", ConnectedHighlightedSelectionCard, "highlighted-selection-card", DefaultPlaceholder],
    ["HeadToHeadCard", ConnectedHeadToHeadCard, "head-to-head-card", DefaultPlaceholder],
    ["TeamFormCard", ConnectedRecentFormCard, "recent-form-card", DefaultPlaceholder],
    ["MatchStatsCard", ConnectedMatchStatsCard, "match-stats-card", DefaultPlaceholder],
    ["PromotionCard", ConnectedPromotionCard, "promotion-card", DefaultPlaceholder],
    ["QuickLinksCard", ConnectedQuickLinksCard, "quick-links-card", QuickLinksCardPlaceholder],
    ["GameInfoCard", ConnectedGameInfoCard, "game-info-card", GameInfoCardPlaceholder],
    ["MarketExtendedCard", ConnectedMarketExtendedCard, "market-extended-card", MarketExtendedCardPlaceholder],
    ["RaceViewLinksCard", ConnectedRaceViewLinksCard, "race-viewlinks-card", RaceViewLinksCardPlaceholder],
    ["RaceViewLinkCard", ConnectedRaceViewLinkCard, "race-viewlink-card", RaceViewLinkCardPlaceholder],
    ["GamingLinkCard", ConnectedGamingLinkCard, "gaming-link-card", GamingLinkCardPlaceholder],
    ["ViewZone", ConnectedViewZone, "view-zone", DefaultPlaceholder],
    ["SegmentedCardGroup", ConnectedSegmentedCardGroup, "segmented-cardgroup", DefaultPlaceholder],
    ["EventMarketCard", ConnectedEventMarketCard, "event-market-card", EventMarketCardPlaceholder],
    ["MarketRulesCard", ConnectedMarketRulesCard, "market-rules-card", DefaultPlaceholder],
    ["MatchTimelineCard", ConnectedMatchTimelineCard, "matchtimeline-card", DefaultPlaceholder],
    ["GameCard", ConnectedGameCard, "game-card", GameCardPlaceholder],
    ["BroadcastsCard", ConnectedBroadcastsCard, "broadcasts-card", BroadcastsCardPlaceholder],
    [
      "BroadcastsAndStatisticsCard",
      ConnectedBroadcastsAndStatisticsCard,
      "broadcasts-and-statistics-card",
      BroadcastsAndStatisticsCardPlaceholder,
    ],
    [
      "TimeFormBroadCastsCard",
      ConnectedTimeFormBroadCastsCard,
      "time-form-broadcasts-card",
      TimeFormBroadCastsCardPlaceholder,
    ],
    ["RunnerInfoCard", ConnectedRunnerInfoCard, "runner-info-card", DefaultPlaceholder],
    ["SportViewLinkCard", ConnectedSportViewLinkCard, "sport-view-link", SportViewLinkCardPlaceholder],
    ["ImsPromotionErrorCard", ConnectedImsPromotionErrorCard, "ims-promotion-error-card", DefaultPlaceholder],
    [
      "PreferenceSingleChoiceCard",
      ConnectPreferenceSingleChoiceCard,
      "preference-single-choice-card",
      DefaultPlaceholder,
    ],
    ["ForbiddenContentCard", ConnectedForbiddenContentCard, "forbidden-content-card", DefaultPlaceholder],
    [
      "CompetitionRegionCard",
      ConnectedCompetitionRegionCard,
      "competition-region-card",
      CompetitionRegionCardPlaceholder,
    ],
    ["BetCardGroup", ConnectedBetCardGroup, "betcardgroup", DefaultPlaceholder],
    ["BetLegCard", ConnectedSportsbookBetLegCard, "sportsbook-bet-leg-card", SportsbookBetLegCardPlaceholder],
    [
      "SportsbookBetLegCardGroup",
      ConnectedSportsbookBetLegCardGroup,
      "sportsbook-bet-leg-card-group",
      SportsbookBetLegCardGroupPlaceholder,
    ],
    [
      "SportsbookExpandableLegCardGroup",
      ConnectedSportsbookExpandableLegCardGroup,
      "sportsbook-expandable-leg-card-group",
      SportsbookExpandableLegCardGroupPlaceholder,
    ],
    ["ExpandableCardGroup", ConnectedExpandableCardGroup, "expandable-card-group", DefaultPlaceholder],
    ["CouponHeaderCard", ConnectedCouponHeaderCard, "coupon-header-card", CouponHeaderCardPlaceholder],
    ["RaceResultsCard", ConnectedRaceResultsCard, "race-results-card", RaceResultsCardPlaceholder],
    ["VirtualEventDetailsCard", ConnectedVirtualEventDetailsCard, "virtual-event-details-card", DefaultPlaceholder],
    ["ExpandableMarketCard", ConnectedExpandableMarketCard, "expandable-market-card", ExpandableMarketCardPlaceholder],
    ["VirtualMarketCard", ConnectedVirtualMarketCard, "virtual-market-card", DefaultPlaceholder],
    ["CorrectScoreCard", ConnectedCorrectScoreCard, "correct-score-card", CorrectScoreCardPlaceholder],
    ["OutrightMarketListCard", ConnectedOutrightMarketListCard, "outright-market-list-card", DefaultPlaceholder],
    ["PopularMultiplesBetBuilderCard", ConnectedPopularBetBuilderCard, "popular-bet-builder-card", DefaultPlaceholder],
    ["SportsbookBetInfoCard", ConnectedSportsbookBetInfoCard, "sportsbook-bet-info-card", expect.any(Function)],
    ["VirtualCardGroup", ConnectedVirtualCardGroup, "virtual-card-group", DefaultPlaceholder],
    ["ExtraWalletCardGroup", ConnectedExtraWalletCardGroup, "extra-wallet-card-group", DefaultPlaceholder],
    ["ExtraWalletCard", ConnectedExtraWalletCard, "extra-wallet-card", DefaultPlaceholder],
    ["RegulatoryCard", ConnectedRegulatoryCard, "regulatory-card", RegulatoryCardPlaceholder],
    [
      "ImsPromotionDetailsCard",
      ConnectedImsPromotionDetailsCard,
      "ims-promotion-details-card",
      ImsPromotionDetailsCardPlaceholder,
    ],
    ["ObbCardGroup", ConnectedObbCardGroup, "obb-card-group", ObbCardGroupPlaceholder],
    [
      "ObbCreatedBetsCardGroup",
      ConnectedObbCreatedBetsCardGroup,
      "obb-created-bets-card-group",
      ObbCreatedBetsCardGroupPlaceholder,
    ],
    ["ObbEventPopularsCard", ConnectedObbEventPopularsCard, "obb-event-populars-card", ObbEventPopularsCardPlaceholder],
  ])("when the card type is `%s`", (typename, connected, testId, placeholder) => {
    it(`should lazy load and render the connected ${typename} component`, async () => {
      const { container } = render(<Card urn={"urn"} typename={typename} isCardLoaded={true} theme="HIGHLIGHTED" />);

      await waitFor(() => getByTestId(container, testId));

      expect(connected).toHaveBeenCalledWith(
        { urn: "urn", component: expect.any(Object), placeholder, theme: "HIGHLIGHTED" },
        undefined,
      );
    });
  });

  describe.each([
    ["GamingPrizeMachineCard", GamingPrizeMachineCard, "gaming-prize-machine-card"],
    ["StatsFormCard", StatsFormCard, "stats-form-card"],
    ["StatsHeadToHeadCard", StatsHeadToHeadCard, "stats-head-to-head-card"],
    ["StatsTeamsCard", StatsTeamsCard, "stats-teams-card"],
    ["StatsMatchStatsCard", StatsMatchStatsCard, "stats-match-stats-card"],
    ["StatsGoalsAndShotsCard", StatsGoalsAndShotsCard, "stats-goals-and-shots-card"],
    ["StatsPlayersInPlayCard", StatsPlayersInPlayCard, "stats-players-in-play-card"],
    ["StatsPlayersSeasonStatsCard", StatsPlayersSeasonStatsCard, "stats-players-season-card"],
    ["StatsBroadcastsCard", StatsBroadcastsCard, "stats-broadcasts-card"],
    ["StatsRaceResultsCard", StatsRaceResultsCard, "stats-race-results-card"],
    ["IncidentsCard", IncidentsCard, "incidents-card"],
    ["StatsLineupsCard", StatsLineupsCard, "stats-lineups-card"],
    ["StatsTableCard", StatsLeagueTableCard, "stats-league-table-card"],
    ["GenericSwitcherCard", GenericSwitcherCard, "generic-switcher-card"],
    ["RaceSwitcherCard", RaceSwitcherCard, "race-switcher-card"],
    ["MiniPromoBannerCard", MiniPromoBannerCard, "mini-promo-card"],
    ["LoyaltyPromoCard", LoyaltyPromoCard, "loyalty-promo-card"],
    ["EditorialPromoCard", EditorialPromoCard, "editorial-promo-card"],
    ["BetOpportunityPromoCard", BetOpportunityPromoCard, "bet-opportunity-promo-card"],
    ["SelectionPromoCard", SelectionPromoCard, "selection-promo-card"],
    ["LottoCard", LottoCard, "lotto-card"],
    ["PriceBoostMultiplePromoCard", PriceBoostMultiplePromoCard, "price-boost-multiple-promo-card"],
    ["SportsbookLotteriesBetLegCardGroup", SportsbookLotteriesBetLegCardGroup, "sbk-lotteries-bet-leg-card-group"],
    ["PromotionsCardGroup", PromotionsCardGroup, "promotions-card-group"],
    ["TeamLineupCard", TeamLineupCard, "team-lineup-card"],
    ["MonterosaContentCard", MonterosaContentCard, "monterosa-content-card"],
    ["EmbeddedContentCard", EmbeddedContentCard, "embedded-content-card"],
    ["EmbeddedViewCard", EmbeddedViewCard, "embedded-view-card"],
    ["PromotionsHubCardGroup", PromotionsHubCardGroup, "promotions-hub-card-group"],
    ["SportsbookChatbotCard", SportsbookChatbotCard, "sportsbook-chatbot-card"],
    ["PenaltyTakersCard", PenaltyTakersCard, "penalty-takers-card"],
  ])("when the card is migrated and type is `%s`", (typename, card, testId) => {
    it(`should lazy load and render the card ${typename} component`, async () => {
      const { container } = render(<Card urn={"urn"} typename={typename} isCardLoaded={true} visible={true} />);

      await waitFor(() => {
        getByTestId(container, testId);
      });

      expect(card).toHaveBeenCalledWith(expect.objectContaining({ urn: "urn", visible: true }), undefined);
    });
  });
});
