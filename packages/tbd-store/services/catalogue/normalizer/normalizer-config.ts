import normalizeRacesByTimeRangeCardGroupFragment from "./cards/races-by-time-range-card-group/races-by-time-range-card-group-normalizer";
import normalizeRaceByTimeRangeCardFragment from "./cards/race-by-time-range-card/race-by-time-range-card-normalizer";
import normalizeSwimlaneCardGroupFragment from "./cards/swimlane-card-group/swimlane-card-group-normalizer";
import normalizeHalfTimeSpecialsSwimlaneCardGroupFragment from "./cards/half-time-specials-swimlane-card-group/half-time-specials-swimlane-card-group-normalizer";
import normalizeFutureRacingCardGroupFragment from "./cards/future-racing-card-group/future-racing-card-group-normalizer";
import normalizeGenericViewFragment from "./views/generic-view/generic-view-normalizer";
import normalizeImsPromotionErrorCardFragment from "./cards/ims-promotion-error-card/ims-promotion-error-card-normalizer";
import normalizeFavouriteMarketsNavigationTabFragment from "./navigation-tabs/favourite-markets-navigation-tab-normalizer";
import normalizeNavigationTabFragment from "./navigation-tabs/navigation-tab-normalizer";
import normalizeGamingPlayNewCardFragment from "./cards/gaming-play-new-card/gaming-play-new-card-normalizer";
import normalizeBroadcastsCardFragment from "./cards/broadcasts-card/broadcasts-card-normalizer";
import normalizeBroadcastsAndStatisticsCardFragment from "./cards/broadcasts-and-statistics-card/broadcasts-and-statistics-card-normalizer";
import normalizePebbleCardGroupFragment from "./cards/pebble-card-group/pebble-card-group-normalizer";
import normalizeContentSummaryCardFragment from "./cards/content-summary/content-summary-normalizer";
import normalizeViewZoneFragment from "./cards/view-zone/view-zone-normalizer";
import normalizeSearchZoneFragment from "./cards/search-zone/search-zone-normalizer";
import normalizeSegmentedCardGroupFragment from "./cards/segmented-card-group/segmented-card-group-normalizer";
import normalizeImsPromotionTermsCardFragment from "./cards/ims-promotion-terms-card/ims-promotion-terms-card-normalizer";
import normalizeImsPromotionDetailsCardFragment from "./cards/ims-promotion-details-card/ims-promotion-details-card-normalizer";
import normalizeGamingLinkCardFragment from "./cards/gaming-link-card/gaming-link-card-normalizer";
import normalizeRaceViewFragment from "./views/race-view/race-view-normalizer";
import normalizeRaceDetailsCardFragment from "./cards/race-details-card/race-details-card-normalizer";
import normalizeMarketViewFragment from "./views/market-view/market-view-normalizer";
import normalizeGamingViewFragment from "./views/gaming-view/gaming-view-normalizer";
import normalizeAllMarketsViewFragment from "./views/all-markets-view/all-markets-view-normalizer";
import normalizeEventViewFragment from "./views/event-view/event-view-normalizer";
import normalizeImsPromotionViewFragment from "./views/ims-promotion-view/ims-promotion-view-normalizer";
import normalizePromotionsViewFragment from "./views/promotions-view/promotions-view-normalizer";
import normalizePromotionsHubViewFragment from "./views/promotions-hub-view/promotions-hub-view-normalizer";
import normalizeSettingsViewFragment from "./views/settings-view/settings-view-normalizer";
import normalizeSportViewFragment from "./views/sport-view/sport-view-normalizer";
import normalizeBrowseViewFragment from "./views/browse-view/browse-view-normalizer";
import normalizeCompetitionViewFragment from "./views/competition-view/competition-view-normalizer";
import normalizeGameViewFragment from "./views/game-view/game-view-normalizer";
import normalizeGamingCategoryViewFragment from "./views/gaming-category-view/gaming-category-view-normalizer";
import normalizeGamingSegmentationViewFragment from "./views/gaming-segmentation-view/gaming-segmentation-view-normalizer";
import normalizeSportFragment from "./entities/sports/sport-normalizer";
import normalizeCompetitionFragment from "./entities/competitions/competition-normalizer";
import normalizeFavouriteMarketsCountMetadataFragment from "./entities/favourite-markets-count-metadata/favourite-markets-count-metadata-normalizer";
import normalizeFavouriteMarketsStateFragment from "./entities/favourite-markets-state/favourite-markets-state-normalizer";
import normalizeMeetingFragment from "./entities/meeting/meeting-normalizer";
import normalizeRaceFragment from "./entities/race/race-normalizer";
import normalizeRaceRunnerFragment from "./entities/race-runners/race-runners-normalizer";
import normalizeGreyhoundRaceRunnerFragment from "./entities/greyhound-race-runners/greyhound-race-runners-normalizer";
import normalizeRunnerViewFragment from "./views/runner-view/runner-view-normalizer";
import normalizeSelfExcludedViewFragment from "./views/self-excluded-view/self-excluded-view-normalizer";
import normalizeAllCompetitionsViewFragment from "./views/all-competitions-view/all-competitions-view-normalizer";
import normalizeMyBetsViewFragment from "./views/my-bets-view/my-bets-view-normalizer";
import normalizeExchangeMarketBetFragment from "./entities/exchange-market-bet/exchange-market-bet-normalizer";
import normalizeExchangeCashoutQuoteFragment from "./entities/exchange-cashout-quote/exchange-cashout-quote-normalizer";
import normalizeSportsbookCashoutQuoteFragment from "./entities/sportsbook-cashout-quote/sportsbook-cashout-quote-normalizer";
import normalizeSportEventFragment from "./entities/sport-event/sport-event-normalizer";
import normalizeBottomBarFragment from "./cards/bottom-bar-card/bottom-bar-card-normalizer";
import normalizeSportsbookMarketsFragment from "./entities/sportsbook-market/sportsbook-market-normalizer";
import normalizeSportsbookRunnerLiveDataFragment from "./entities/sportsbook-runner-live-data/sportsbook-runner-live-data-normalizer";
import normalizeSportsbookBetCardFragment from "./cards/sportsbook-bet-card/sportsbook-bet-card-normalizer";
import normalizeExchangeMarketFragment from "./entities/exchange-market/exchange-market-normalizer";
import normalizeSportsbookBetFragment from "./entities/sportsbook-bet/sportsbook-bet-normalizer";
import normalizePreferenceSingleChoiceFragment from "./entities/preference-single-choice/preference-single-choice-normalizer";
import normalizePreferenceSingleChoiceCardFragment from "./cards/preference-single-choice-card/preference-single-choice-card-normalizer";
import normalizeGamingJackpotFragment from "./entities/gaming-jackpot/gaming-jackpot-normalizer";
import normalizeMaintenanceViewFragment from "./views/maintenance-view/maintenance-view-normalizer";
import normalizeQuickLinksCardFragment from "./cards/quick-links-card/quick-links-card-normalizer";
import normalizeLinksCardFragment from "./cards/links-card/links-card-normalizer";
import normalizeBalanceCardFragment from "./cards/balance-card/balance-card-normalizer";
import normalizeRewardsCardFragment from "./cards/rewards-card/rewards-card-normalizer";
import normalizeAccountRewardsCardFragment from "./cards/account-banners-card/account-banners-card-normalizer";
import normalizeMyAccountViewFragment from "./views/my-account-view/my-account-view-normalizer";
import normalizeSportsbookBetLegFragment from "./entities/sportsbook-bet-leg/sportsbook-bet-leg-normalizer";
import normalizeSportsbookBetLegCardFragment from "./cards/sportsbook-bet-leg-card/sportsbook-bet-leg-card-normalizer";
import normalizeSportsbookBetInfoCardFragment from "./cards/sportsbook-bet-info-card/sportsbook-bet-info-card-normalizer";
import normalizeEventMarketCardFragment from "./cards/event-market-card/event-market-card-normalizer";
import normalizeMarketCardFragment from "./cards/market-card/market-card-normalizer";
import normalizeFixtureCardFragment from "./cards/fixture-card/fixture-card-normalizer";
import normalizeEventHeaderCardFragment from "./cards/event-header-card/event-header-card-normalizer";
import normalizeRegulatoryCardFragment from "./cards/regulatory-card/regulatory-card-normalizer";
import normalizeMarketExtendedCardFragment from "./cards/market-extended-card/market-extended-card-normalizer";
import normalizePromotionCardFragment from "./cards/promotion-card/promotion-card-normalizer";
import normalizePromotionsHubCardGroupFragment from "./cards/promotions-hub-card-group/promotions-hub-card-group-normalizer";
import normalizeForbiddenContentCardFragment from "./cards/forbidden-content-card/forbidden-content-card-normalizer";
import normalizeBetCardGroupFragment from "./cards/betcard-group/betcard-group-normalizer";
import normalizeNotFoundViewFragment from "./views/not-found-view/not-found-view-normalizer";
import normalizeBudgetLimitsCardFragment from "./cards/budget-limits-card/budget-limits-card-normalizer";
import normalizeExpandableCardGroupFragment from "./cards/expandable-card-group/expandable-card-group-normalizer";
import normalizeHighlightedSelectionCardFragment from "./cards/highlighted-selection-card/highlighted-selection-normalizer";
import normalizeCouponHeaderCardFragment from "./cards/coupon-header/coupon-header-card-normalizer";
import normalizeGamingCardGroupFragment from "./cards/gaming-card-group/gaming-card-group-normalizer";
import normalizeRaceResultsCardFragment from "./cards/race-results-card/race-results-card-normalizer";
import normalizeGridCardFragment from "./cards/grid-card/grid-card-normalizer";
import normalizeRunnerInfoCardFragment from "./cards/runner-info-card/runner-info-card-normalizer";
import normalizeRaceViewLinkCardFragment from "./cards/race-view-link-card/race-view-link-card-normalizer";
import normalizeRaceViewLinksCardFragment from "./cards/race-view-links-card/race-view-links-card-normalizer";
import normalizeCompetitionRegionCardFragment from "./cards/competition-region-card/competition-region-card-normalizer";
import normalizeSportViewLinkCardFragment from "./cards/sport-view-link-card/sport-view-link-card-normalizer";
import normalizeCompetitionViewLinkCardFragment from "./cards/competition-view-link-card/competition-view-link-card-normalizer";
import normalizeGenericViewLinkCardFragment from "./cards/generic-view-link-card/generic-view-link-card-normalizer";
import normalizeTimeFormBroadCastsCardFragment from "./cards/time-form-broadcasts-card/time-form-broadcasts-card-normalizer";
import normalizeMarketRulesViewFragment from "./views/market-rules-view/market-rules-view-normalizer";
import normalizeMarketRulesCardFragment from "./cards/market-rules-card/market-rules-card-normalizer";
import normalizeRaceMarketCardFragment from "./cards/race-market-card/race-market-card-normalizer";
import normalizeExpandableMarketCardFragment from "./cards/expandable-market-card/expandable-market-card-normalizer";
import normalizeVirtualSportFragmentIntoVirtualSport from "./entities/virtual-sport/virtual-sport-normalizer";
import normalizeVirtualEventFragmentIntoVirtualEvent from "./entities/virtual-event/virtual-event-normalizer";
import normalizeVirtualEventDetailsCardFragment from "./cards/virtual-event-details-card/virtual-event-details-card-normalizer";
import normalizeFootballFixtureFragment from "./entities/football-fixture/football-fixture-normalizer";
import normalizeTeamFormCardFragment from "./cards/team-form-card/team-form-card-normalizer";
import normalizeVirtualRunnerFragment from "./entities/virtual-runner/virtual-runner-normalizer";
import normalizeVirtualMarketFragment from "./entities/virtual-market/virtual-market-normalizer";
import normalizeVirtualMarketCardFragment from "./cards/virtual-market-card/virtual-market-card-normalizer";
import normalizeVirtualCardGroupFragment from "./cards/virtual-card-group/virtual-card-group-normalizer";
import normalizePopularBetBuilderCardFragment from "./cards/popular-bet-builder-card/popular-bet-builder-card-normalizer";
import normalizePriceBoostMultipleCardFragment from "./cards/price-boost-multiple-card/price-boost-multiple-card-normalizer";
import normalizePopularMultiplesBetBuilderCardFragment from "./cards/popular-multiples-bet-builder-card/popular-multiples-bet-builder-card-normalizer";
import normalizePackagedCreatedBetsCardFragment from "./cards/packaged-created-bets-card/packaged-created-bets-normalizer";
import normalizePriceBoostMultisListCardFragment from "./cards/price-boost-multis-list-card/price-boost-multis-list-card-normalizer";
import normalizeTableTennisFixtureFragment from "./entities/table-tennis-fixture/table-tennis-fixture-normalizer";
import normalizeTennisFixtureFragment from "./entities/tennis-fixture/tennis-fixture-normalizer";
import normalizePopularBettingOpportunityFragment from "./entities/popular-betting-opportunity/popular-betting-opportunity-normalizer";
import normalizeCorrectScoreCardFragment from "./cards/correct-score-card/correct-score-card-normalizer";
import normalizeOutrightMarketListCardFragment from "./cards/outright-market-list-card/outright-market-list-card-normalizer";
import normalizeBaseballFixtureFragment from "./entities/baseball-fixture/baseball-fixture-normalizer";
import normalizeBasketballFixtureFragment from "./entities/basketball-fixture/basketball-fixture-normalizer";
import normalizeIceHockeyFixtureFragment from "./entities/ice-hockey-fixture/ice-hockey-fixture-normalizer";
import normalizeAmericanFootballFixtureFragment from "./entities/american-football-fixture/american-football-fixture-normalizer";
import normalizeCricketFixtureFragment from "./entities/cricket-fixture/cricket-fixture-normalizer";
import normalizeRugbyUnionFixtureFragment from "./entities/rugby-union-fixture/rugby-union-fixture-normalizer";
import normalizeRugbyLeagueFixtureFragment from "./entities/rugby-league-fixture/rugby-league-fixture-normalizer";
import normalizeSnookerFixtureFragment from "./entities/snooker-fixture/snooker-fixture-normalizer";
import normalizeVolleyballFixtureFragment from "./entities/volleyball-fixture/volleyball-fixture-normalizer";
import normalizeAustralianRulesFixtureFragment from "./entities/australian-rules-fixture/australian-rules-fixture-normalizer";
import normalizeDartsFixtureFragment from "./entities/darts-fixture/darts-fixture-normalizer";
import normalizeSelectableItemsCardGroupFragment from "./cards/selectable-items-card-group/selectable-items-card-group-normalizer";
import normalizeEventViewLinkCardFragment from "./cards/event-view-link-card/event-view-link-card-normalizer";
import normalizeBaseFixtureFragment from "./entities/fixture/base-fixture-normalizer";
import normalizeMarketViewLinkCardFragment from "./cards/market-view-link/market-view-link-normalizer";
import normalizeGameFragment from "./entities/game/game-normalizer";
import normalizeGameInfoCardFragment from "./cards/game-info-card/game-info-card-normalizer";
import normalizeGameCardFragment from "./cards/game-card/game-card-normalizer";
import normalizeRegulatoryDataFragment from "./entities/regulatory-data/regulatory-data-normalizer";
import normalizeEventStatsFragment from "./cards/event-stats-card/event-stats-normalizer";
import normalizeHeadToHeadCardFragment from "./cards/head-to-head-card/head-to-head-card-normalizer";
import normalizeMatchTimelineCardFragment from "./cards/match-timeline-card/match-timeline-card-normalizer";
import normalizeMatchStatsCardFragment from "./cards/match-stats-card/match-stats-card-normalizer";
import normalizeImsPromotionFragment from "./entities/ims-promotion/ims-promotion-normalizer";
import normalizeImsPromotionStateCardFragment from "./cards/ims-promotion-state-card/ims-promotion-state-card-normalizer";
import normalizeSportRibbonCardGroupFragment from "./cards/sport-ribbon-card-group/sport-ribbon-card-group-normalizer";
import normalizeMarketGraphsCardFragment from "./cards/market-graphs-card/market-graphs-card-normalizer";
import normalizeRunnerMarketGraphFragment from "./entities/runner-market-graph/runner-market-graph-normalizer";
import normalizeSportsbookExpandableLegCardGroupFragment from "./cards/sportsbook-expandable-legs-card-group/sportsbook-expandable-legs-card-group-normalizer";
import normalizeSwimlaneIndexedCardGroupFragment from "./cards/swimlane-indexed-card-group/swimlane-indexed-card-group-normalizer";
import normalizeByTimeRangeMeetingCardGroupFragment from "./cards/by-time-range-meeting-card-group/by-time-range-meeting-card-group-normalizer";
import normalizeSportsbookBetLegCardGroupFragment from "./cards/sportsbook-bet-leg-card-group/sportsbook-bet-leg-card-group-normalizer";
import normalizeNavigationTabsFragment from "./navigation-tabs/navigation-tab-list-normalizer";
import normalizeFilteredCouponCardGroupFragment from "./cards/filtered-coupon-card-group/filtered-coupon-card-group-normalizer";
import normalizeGamingJackpotCardFragment from "./cards/gaming-jackpot-card/gaming-jackpot-card-normalizer";
import normalizeMarketBetCardFragment from "./cards/market-bet-card/market-bet-card-normalizer";
import normalizeMarketBetSelectionCardFragment from "./cards/market-bet-selection-card/market-bet-selection-card-normalizer";
import normalizeMarketBetCardGroupFragment from "./cards/market-bet-card-group/market-bet-card-group-normalizer";
import normalizeMarketBetSelectionCardGroupFragment from "./cards/market-bet-selection-card-group/market-bet-selection-card-group-normalizer";
import normalizeMarketBetExpandableCardGroupFragment from "./cards/market-bet-expandable-card-group/market-bet-expandable-card-group-normalizer";
import normalizeLeftSidebarFragmentIntoLeftSidebar from "./sidebars/left-sidebar-list-normalizer";
import normalizeBetSharingCardGroupFragment from "./cards/bet-sharing-card-group/bet-sharing-card-group-normalizer";
import normalizeSearchBarCardFragmentIntoSearchBarCard from "./cards/search-bar-card/search-bar-card-normalizer";
import normalizeLoyaltyPromotionFragment from "./entities/loyalty-promotion/loyalty-promotion-normalizer";
import {
  GamingPrizeMachineCardFragment,
  StatsPebbleCardGroupFragment,
  StatsSupportingContentButtonsCardGroupFragment,
  StatsFormCardRecentFormFragment,
  StatsFormCardCompetitionFormFragment,
  StatsHeadToHeadCardFragment,
  StatsPlayersSeasonStatsCardAttackingFragment,
  StatsPlayersSeasonStatsCardDefendingFragment,
  StatsContentCardGroupFragment,
  StatsMatchStatsCardFragment,
  StatsGoalsAndShotsCardFragment,
  StatsTeamsCardPreviousFiveFragment,
  StatsTeamsCardAllSeasonFragment,
  StatsPlayersInPlayCardFragment,
  StatsBroadcastsCardFragment,
  IncidentsCardFragment,
  StatsLineupsCardFragment,
  StatsLeagueTableCardFragment,
  GenericSwitcherCardFragment,
  RaceSwitcherCardFragment,
  SelfExclusionCardFragment,
  LoyaltyPromoCardFragment,
  MiniPromoBannerCardFragment,
  EditorialPromoCardFragment,
  BetOpportunityPromoCardFragment,
  SelectionPromoCardFragment,
  LottoCardFragment,
  PriceBoostMultiplePromoCardFragment,
  SportsbookLotteriesBetLegCardGroupFragment,
  PromotionsCardGroupFragment,
  TeamLineupCardFragment,
  MonterosaContentCardFragment,
  EmbeddedContentCardFragment,
  PopularSelectionsCardFragment,
  PopularSelectionsCardEnrichedPartialFragment,
  QuicklinksGridCardGroupFragment,
  EmbeddedViewCardFragment,
  SportsbookChatbotCardFragment,
  PenaltyTakersCardFragment,
} from "../../../clients/catalogue/catalogue-response-types";
import normalizeExtraWalletFragment from "./entities/extra-wallet/extra-wallet-normalizer";
import normalizeExtraWalletCardFragment from "./cards/extra-wallet-card/extra-wallet-card-normalizer";
import normalizeExtraWalletCardGroupFragment from "./cards/extra-wallet-card-group/extra-wallet-card-group-normalizer";
import normalizeBlurbCardFragmentIntoBlurbCard from "./cards/blurb-card/blurb-card-normalizer";
import normalizeObbCardGroupFragment from "./cards/obb-card-group/obb-card-group-normalizer";
import normalizeObbCreatedBetsCardGroupFragment from "./cards/obb-created-bets-card-group/obb-created-bets-card-group-normalizer";
import normalizeObbOnboardingCardsCardGroupFragment from "./cards/obb-onboarding-cards-card-group/obb-onboarding-cards-card-group-normalizer";

import normalizeObbPvpCardFragment from "./cards/obb-pvp-card/obb-pvp-card-normalizer";
import normalizeObbSquadBetCardFragment from "./cards/obb-squad-bet-card/obb-squad-bet-card-normalizer";
import normalizeObbCreatedBetsCardFragment from "./cards/obb-created-bets-card/obb-created-bets-card-normalizer";
import normalizeObbSquadVsSquadCardFragment from "./cards/obb-squad-vs-squad-card/obb-squad-vs-squad-card-normalizer";
import normalizeObbLandingPageViewFragmentIntoObbLandingPageView from "./views/obb-landing-page-view/obb-landing-page-view-normalizer";
import normalizeMatchStatSelectionCardFragment from "./cards/match-stat-selection-card/match-stat-selection-normalizer";
import normalizeObbLegFragmentIntoObbLeg from "./entities/obb-leg/obb-leg-normalizer";
import normalizeRacingSwimlaneCardGroupFragment from "./cards/racing-swimlane-card-group/racing-swimlane-card-group-normalizer";
import normalizePopularSwimlaneCardGroupFragment from "./cards/popular-swimlane-card-group/popular-swimlane-card-group-normalizer";
import normalizeFootballPlayerFixtureContextFragment from "./entities/football-player-fixture-context/football-player-fixture-context-normalizer";
import normalizeObbEventPopularsCardFragment from "./cards/obb-event-populars-card/obb-event-populars-card-normalizer";

// Helper function that proxy data to store with any normalization
function proxyNormalizer<T>(data: T) {
  return { data };
}

export type ApolloNormalizers = {
  GamingPrizeMachineCard: typeof proxyNormalizer<GamingPrizeMachineCardFragment>;
  StatsPebbleCardGroup: typeof proxyNormalizer<StatsPebbleCardGroupFragment>;
  StatsSupportingContentButtonsCardGroup: typeof proxyNormalizer<StatsSupportingContentButtonsCardGroupFragment>;
  StatsFormCard: typeof proxyNormalizer<StatsFormCardRecentFormFragment | StatsFormCardCompetitionFormFragment>;
  StatsHeadToHeadCard: typeof proxyNormalizer<StatsHeadToHeadCardFragment>;
  StatsPlayersSeasonStatsCard: typeof proxyNormalizer<
    StatsPlayersSeasonStatsCardAttackingFragment | StatsPlayersSeasonStatsCardDefendingFragment
  >;
  StatsContentCardGroup: typeof proxyNormalizer<StatsContentCardGroupFragment>;
  StatsMatchStatsCard: typeof proxyNormalizer<StatsMatchStatsCardFragment>;
  StatsGoalsAndShotsCard: typeof proxyNormalizer<StatsGoalsAndShotsCardFragment>;
  StatsTeamsCard: typeof proxyNormalizer<StatsTeamsCardPreviousFiveFragment | StatsTeamsCardAllSeasonFragment>;
  StatsPlayersInPlayCard: typeof proxyNormalizer<StatsPlayersInPlayCardFragment>;
  StatsBroadcastsCard: typeof proxyNormalizer<StatsBroadcastsCardFragment>;
  IncidentsCard: typeof proxyNormalizer<IncidentsCardFragment>;
  StatsLineupsCard: typeof proxyNormalizer<StatsLineupsCardFragment>;
  StatsLeagueTableCard: typeof proxyNormalizer<StatsLeagueTableCardFragment>;
  GenericSwitcherCard: typeof proxyNormalizer<GenericSwitcherCardFragment>;
  RaceSwitcherCard: typeof proxyNormalizer<RaceSwitcherCardFragment>;
  SelfExclusionCard: typeof proxyNormalizer<SelfExclusionCardFragment>;
  LoyaltyPromoCard: typeof proxyNormalizer<LoyaltyPromoCardFragment>;
  MiniPromoBannerCard: typeof proxyNormalizer<MiniPromoBannerCardFragment>;
  EditorialPromoCard: typeof proxyNormalizer<EditorialPromoCardFragment>;
  BetOpportunityPromoCard: typeof proxyNormalizer<BetOpportunityPromoCardFragment>;
  SelectionPromoCard: typeof proxyNormalizer<SelectionPromoCardFragment>;
  LottoCard: typeof proxyNormalizer<LottoCardFragment>;
  PriceBoostMultiplePromoCard: typeof proxyNormalizer<PriceBoostMultiplePromoCardFragment>;
  SportsbookLotteriesBetLegCardGroup: typeof proxyNormalizer<SportsbookLotteriesBetLegCardGroupFragment>;
  PromotionsCardGroup: typeof proxyNormalizer<PromotionsCardGroupFragment>;
  TeamLineupCard: typeof proxyNormalizer<TeamLineupCardFragment>;
  MonterosaContentCard: typeof proxyNormalizer<MonterosaContentCardFragment>;
  EmbeddedContentCard: typeof proxyNormalizer<EmbeddedContentCardFragment>;
  PopularSelectionsCard: typeof proxyNormalizer<
    PopularSelectionsCardFragment | PopularSelectionsCardEnrichedPartialFragment
  >;
  QuicklinksGridCardGroup: typeof proxyNormalizer<QuicklinksGridCardGroupFragment>;
  EmbeddedViewCard: typeof proxyNormalizer<EmbeddedViewCardFragment>;
  SportsbookChatbotCard: typeof proxyNormalizer<SportsbookChatbotCardFragment>;
  PenaltyTakersCard: typeof proxyNormalizer<PenaltyTakersCardFragment>;
};

/**
 * The list of normalizers output
 */
export type Normalizers = {
  // Entities
  Sport: typeof normalizeSportFragment;
  Competition: typeof normalizeCompetitionFragment;
  FavouriteMarketsCountMetadata: typeof normalizeFavouriteMarketsCountMetadataFragment;
  FavouriteMarketsState: typeof normalizeFavouriteMarketsStateFragment;
  Meeting: typeof normalizeMeetingFragment;
  Race: typeof normalizeRaceFragment;
  RaceRunner: typeof normalizeRaceRunnerFragment;
  GreyhoundRaceRunner: typeof normalizeGreyhoundRaceRunnerFragment;
  MarketBet: typeof normalizeExchangeMarketBetFragment;
  SportsbookMarket: typeof normalizeSportsbookMarketsFragment;
  SportsbookRunnerLiveData: typeof normalizeSportsbookRunnerLiveDataFragment;
  ExchangeCashoutQuote: typeof normalizeExchangeCashoutQuoteFragment;
  SportsbookCashoutQuote: typeof normalizeSportsbookCashoutQuoteFragment;
  SportsEvent: typeof normalizeSportEventFragment;
  BottomBar: typeof normalizeBottomBarFragment;
  LeftSidebar: typeof normalizeLeftSidebarFragmentIntoLeftSidebar;
  RegulatoryData: typeof normalizeRegulatoryDataFragment;
  ExchangeMarket: typeof normalizeExchangeMarketFragment;
  SportsbookBet: typeof normalizeSportsbookBetFragment;
  PreferenceSingleChoice: typeof normalizePreferenceSingleChoiceFragment;
  GamingJackpot: typeof normalizeGamingJackpotFragment;
  BetLeg: typeof normalizeSportsbookBetLegFragment;
  VirtualSport: typeof normalizeVirtualSportFragmentIntoVirtualSport;
  VirtualEvent: typeof normalizeVirtualEventFragmentIntoVirtualEvent;
  FootballFixture: typeof normalizeFootballFixtureFragment;
  FootballPlayerFixtureContext: typeof normalizeFootballPlayerFixtureContextFragment;
  VirtualRunner: typeof normalizeVirtualRunnerFragment;
  VirtualMarket: typeof normalizeVirtualMarketFragment;
  TableTennisFixture: typeof normalizeTableTennisFixtureFragment;
  TennisMatch: typeof normalizeTennisFixtureFragment;
  PopularBettingOpportunity: typeof normalizePopularBettingOpportunityFragment;
  BaseballFixture: typeof normalizeBaseballFixtureFragment;
  BasketballFixture: typeof normalizeBasketballFixtureFragment;
  IceHockeyFixture: typeof normalizeIceHockeyFixtureFragment;
  AmericanFootballFixture: typeof normalizeAmericanFootballFixtureFragment;
  DartsFixture: typeof normalizeDartsFixtureFragment;
  CricketFixture: typeof normalizeCricketFixtureFragment;
  RugbyUnionFixture: typeof normalizeRugbyUnionFixtureFragment;
  RugbyLeagueFixture: typeof normalizeRugbyLeagueFixtureFragment;
  SnookerFixture: typeof normalizeSnookerFixtureFragment;
  VolleyballFixture: typeof normalizeVolleyballFixtureFragment;
  AustralianRulesFixture: typeof normalizeAustralianRulesFixtureFragment;
  BaseFixture: typeof normalizeBaseFixtureFragment;
  Game: typeof normalizeGameFragment;
  ImsPromotion: typeof normalizeImsPromotionFragment;
  RunnerMarketGraph: typeof normalizeRunnerMarketGraphFragment;
  ExtraWallet: typeof normalizeExtraWalletFragment;
  ObbLeg: typeof normalizeObbLegFragmentIntoObbLeg;
  LoyaltyPromotion: typeof normalizeLoyaltyPromotionFragment;
  // Views
  GenericView: typeof normalizeGenericViewFragment;
  RaceView: typeof normalizeRaceViewFragment;
  MarketView: typeof normalizeMarketViewFragment;
  AllCompetitionsView: typeof normalizeAllCompetitionsViewFragment;
  RunnerView: typeof normalizeRunnerViewFragment;
  SelfExcludedView: typeof normalizeSelfExcludedViewFragment;
  GamingView: typeof normalizeGamingViewFragment;
  AllMarketsView: typeof normalizeAllMarketsViewFragment;
  EventView: typeof normalizeEventViewFragment;
  ImsPromotionView: typeof normalizeImsPromotionViewFragment;
  PromotionsView: typeof normalizePromotionsViewFragment;
  PromotionsHubView: typeof normalizePromotionsHubViewFragment;
  SettingsView: typeof normalizeSettingsViewFragment;
  SportView: typeof normalizeSportViewFragment;
  CompetitionView: typeof normalizeCompetitionViewFragment;
  GameView: typeof normalizeGameViewFragment;
  GamingCategoryView: typeof normalizeGamingCategoryViewFragment;
  GamingSegmentationView: typeof normalizeGamingSegmentationViewFragment;
  BrowseView: typeof normalizeBrowseViewFragment;
  MaintenanceView: typeof normalizeMaintenanceViewFragment;
  MyBetsView: typeof normalizeMyBetsViewFragment;
  MyAccountView: typeof normalizeMyAccountViewFragment;
  NotFoundView: typeof normalizeNotFoundViewFragment;
  MarketRulesView: typeof normalizeMarketRulesViewFragment;
  ObbLandingPageView: typeof normalizeObbLandingPageViewFragmentIntoObbLandingPageView;
  // Groups
  SwimlaneCardGroup: typeof normalizeSwimlaneCardGroupFragment;
  HalfTimeSpecialsSwimlaneCardGroup: typeof normalizeHalfTimeSpecialsSwimlaneCardGroupFragment;
  FutureRacingCardGroup: typeof normalizeFutureRacingCardGroupFragment;
  RaceByTimeRangeCard: typeof normalizeRaceByTimeRangeCardFragment;
  RacesByTimeRangeCardGroup: typeof normalizeRacesByTimeRangeCardGroupFragment;
  ViewZone: typeof normalizeViewZoneFragment;
  SearchZone: typeof normalizeSearchZoneFragment;
  SegmentedCardGroup: typeof normalizeSegmentedCardGroupFragment;
  PebbleCardGroup: typeof normalizePebbleCardGroupFragment;
  ExpandableCardGroup: typeof normalizeExpandableCardGroupFragment;
  GamingCardGroup: typeof normalizeGamingCardGroupFragment;
  SelectableItemsCardGroup: typeof normalizeSelectableItemsCardGroupFragment;
  VirtualCardGroup: typeof normalizeVirtualCardGroupFragment;
  SportRibbonCardGroup: typeof normalizeSportRibbonCardGroupFragment;
  SportsbookExpandableLegCardGroup: typeof normalizeSportsbookExpandableLegCardGroupFragment;
  BetCardGroup: typeof normalizeBetCardGroupFragment;
  SwimlaneIndexedCardGroup: typeof normalizeSwimlaneIndexedCardGroupFragment;
  ByTimeRangeMeetingCardGroup: typeof normalizeByTimeRangeMeetingCardGroupFragment;
  SportsbookBetLegCardGroup: typeof normalizeSportsbookBetLegCardGroupFragment;
  NavigationTabsList: typeof normalizeNavigationTabsFragment;
  FilteredCouponCardGroup: typeof normalizeFilteredCouponCardGroupFragment;
  MarketBetCardGroup: typeof normalizeMarketBetCardGroupFragment;
  MarketBetSelectionCardGroup: typeof normalizeMarketBetSelectionCardGroupFragment;
  MarketBetExpandableCardGroup: typeof normalizeMarketBetExpandableCardGroupFragment;
  BetSharingCardGroup: typeof normalizeBetSharingCardGroupFragment;
  ExtraWalletCardGroup: typeof normalizeExtraWalletCardGroupFragment;
  ObbCardGroup: typeof normalizeObbCardGroupFragment;
  RacingSwimlaneCardGroup: typeof normalizeRacingSwimlaneCardGroupFragment;
  PopularSwimlaneCardGroup: typeof normalizePopularSwimlaneCardGroupFragment;
  ObbCreatedBetsCardGroup: typeof normalizeObbCreatedBetsCardGroupFragment;
  PromotionsHubCardGroup: typeof normalizePromotionsHubCardGroupFragment;
  ObbOnboardingCardsCardGroup: typeof normalizeObbOnboardingCardsCardGroupFragment;

  // Cards
  SportsbookBetCard: typeof normalizeSportsbookBetCardFragment;
  ImsPromotionErrorCard: typeof normalizeImsPromotionErrorCardFragment;
  GamingPlayNewCard: typeof normalizeGamingPlayNewCardFragment;
  BroadcastsCard: typeof normalizeBroadcastsCardFragment;
  BroadcastsAndStatisticsCard: typeof normalizeBroadcastsAndStatisticsCardFragment;
  ContentSummaryCard: typeof normalizeContentSummaryCardFragment;
  FavouriteMarketsNavigationTab: typeof normalizeFavouriteMarketsNavigationTabFragment;
  NavigationTab: typeof normalizeNavigationTabFragment;
  ImsPromotionTermsAndConditionsCard: typeof normalizeImsPromotionTermsCardFragment;
  ImsPromotionDetailsCard: typeof normalizeImsPromotionDetailsCardFragment;
  GamingLinkCard: typeof normalizeGamingLinkCardFragment;
  RaceDetailsCard: typeof normalizeRaceDetailsCardFragment;
  PreferenceSingleChoiceCard: typeof normalizePreferenceSingleChoiceCardFragment;
  QuickLinksCard: typeof normalizeQuickLinksCardFragment;
  LinksCard: typeof normalizeLinksCardFragment;
  BalanceCard: typeof normalizeBalanceCardFragment;
  RewardsCard: typeof normalizeRewardsCardFragment;
  AccountBannersCard: typeof normalizeAccountRewardsCardFragment;
  BetLegCard: typeof normalizeSportsbookBetLegCardFragment;
  SportsbookBetInfoCard: typeof normalizeSportsbookBetInfoCardFragment;
  EventMarketCard: typeof normalizeEventMarketCardFragment;
  MarketCard: typeof normalizeMarketCardFragment;
  FixtureCard: typeof normalizeFixtureCardFragment;
  EventHeaderCard: typeof normalizeEventHeaderCardFragment;
  HeadToHeadCard: typeof normalizeHeadToHeadCardFragment;
  MatchTimelineCard: typeof normalizeMatchTimelineCardFragment;
  MatchStatsCard: typeof normalizeMatchStatsCardFragment;
  RegulatoryCard: typeof normalizeRegulatoryCardFragment;
  MarketExtendedCard: typeof normalizeMarketExtendedCardFragment;
  PromotionCard: typeof normalizePromotionCardFragment;
  ForbiddenContentCard: typeof normalizeForbiddenContentCardFragment;
  BudgetLimitsCard: typeof normalizeBudgetLimitsCardFragment;
  HighlightedSelectionCard: typeof normalizeHighlightedSelectionCardFragment;
  CouponHeaderCard: typeof normalizeCouponHeaderCardFragment;
  RaceResultsCard: typeof normalizeRaceResultsCardFragment;
  GridCard: typeof normalizeGridCardFragment;
  RunnerInfoCard: typeof normalizeRunnerInfoCardFragment;
  RaceViewLinkCard: typeof normalizeRaceViewLinkCardFragment;
  RaceViewLinksCard: typeof normalizeRaceViewLinksCardFragment;
  CompetitionRegionCard: typeof normalizeCompetitionRegionCardFragment;
  SportViewLinkCard: typeof normalizeSportViewLinkCardFragment;
  CompetitionViewLinkCard: typeof normalizeCompetitionViewLinkCardFragment;
  GenericViewLinkCard: typeof normalizeGenericViewLinkCardFragment;
  TimeFormBroadCastsCard: typeof normalizeTimeFormBroadCastsCardFragment;
  MarketRulesCard: typeof normalizeMarketRulesCardFragment;
  RaceMarketCard: typeof normalizeRaceMarketCardFragment;
  ExpandableMarketCard: typeof normalizeExpandableMarketCardFragment;
  VirtualEventDetailsCard: typeof normalizeVirtualEventDetailsCardFragment;
  TeamFormCard: typeof normalizeTeamFormCardFragment;
  VirtualMarketCard: typeof normalizeVirtualMarketCardFragment;
  PopularBetBuilderCard: typeof normalizePopularBetBuilderCardFragment;
  PriceBoostMultisCard: typeof normalizePriceBoostMultipleCardFragment;
  PopularMultiplesBetBuilderCard: typeof normalizePopularMultiplesBetBuilderCardFragment;
  PackagedCreatedBetsCard: typeof normalizePackagedCreatedBetsCardFragment;
  PriceBoostMultisListCard: typeof normalizePriceBoostMultisListCardFragment;
  CorrectScoreCard: typeof normalizeCorrectScoreCardFragment;
  OutrightMarketListCard: typeof normalizeOutrightMarketListCardFragment;
  EventViewLinkCard: typeof normalizeEventViewLinkCardFragment;
  MarketViewLinkCard: typeof normalizeMarketViewLinkCardFragment;
  GameInfoCard: typeof normalizeGameInfoCardFragment;
  GameCard: typeof normalizeGameCardFragment;
  EventStatsCard: typeof normalizeEventStatsFragment;
  ImsPromotionStateCard: typeof normalizeImsPromotionStateCardFragment;
  MarketGraphsCard: typeof normalizeMarketGraphsCardFragment;
  GamingJackpotCard: typeof normalizeGamingJackpotCardFragment;
  MarketBetCard: typeof normalizeMarketBetCardFragment;
  MarketBetSelectionCard: typeof normalizeMarketBetSelectionCardFragment;
  SearchBarCard: typeof normalizeSearchBarCardFragmentIntoSearchBarCard;
  ExtraWalletCard: typeof normalizeExtraWalletCardFragment;
  ObbPvpCard: typeof normalizeObbPvpCardFragment;
  BlurbCard: typeof normalizeBlurbCardFragmentIntoBlurbCard;
  MatchStatSelectionCard: typeof normalizeMatchStatSelectionCardFragment;
  ObbSquadBetCard: typeof normalizeObbSquadBetCardFragment;
  ObbCreatedBetsCard: typeof normalizeObbCreatedBetsCardFragment;
  ObbSquadVsSquadCard: typeof normalizeObbSquadVsSquadCardFragment;
  ObbEventPopularsCard: typeof normalizeObbEventPopularsCardFragment;
} & ApolloNormalizers;

export const apolloNormalizers: ApolloNormalizers = {
  GamingPrizeMachineCard: proxyNormalizer<GamingPrizeMachineCardFragment>,
  StatsPebbleCardGroup: proxyNormalizer<StatsPebbleCardGroupFragment>,
  StatsSupportingContentButtonsCardGroup: proxyNormalizer<StatsSupportingContentButtonsCardGroupFragment>,
  StatsFormCard: proxyNormalizer<StatsFormCardRecentFormFragment | StatsFormCardCompetitionFormFragment>,
  StatsHeadToHeadCard: proxyNormalizer<StatsHeadToHeadCardFragment>,
  StatsPlayersSeasonStatsCard: proxyNormalizer<
    StatsPlayersSeasonStatsCardAttackingFragment | StatsPlayersSeasonStatsCardDefendingFragment
  >,
  StatsContentCardGroup: proxyNormalizer<StatsContentCardGroupFragment>,
  StatsMatchStatsCard: proxyNormalizer<StatsMatchStatsCardFragment>,
  StatsGoalsAndShotsCard: proxyNormalizer<StatsGoalsAndShotsCardFragment>,
  StatsTeamsCard: proxyNormalizer<StatsTeamsCardPreviousFiveFragment | StatsTeamsCardAllSeasonFragment>,
  StatsPlayersInPlayCard: proxyNormalizer<StatsPlayersInPlayCardFragment>,
  StatsBroadcastsCard: proxyNormalizer<StatsBroadcastsCardFragment>,
  IncidentsCard: proxyNormalizer<IncidentsCardFragment>,
  StatsLineupsCard: proxyNormalizer<StatsLineupsCardFragment>,
  StatsLeagueTableCard: proxyNormalizer<StatsLeagueTableCardFragment>,
  GenericSwitcherCard: proxyNormalizer<GenericSwitcherCardFragment>,
  RaceSwitcherCard: proxyNormalizer<RaceSwitcherCardFragment>,
  SelfExclusionCard: proxyNormalizer<SelfExclusionCardFragment>,
  LoyaltyPromoCard: proxyNormalizer<LoyaltyPromoCardFragment>,
  MiniPromoBannerCard: proxyNormalizer<MiniPromoBannerCardFragment>,
  EditorialPromoCard: proxyNormalizer<EditorialPromoCardFragment>,
  BetOpportunityPromoCard: proxyNormalizer<BetOpportunityPromoCardFragment>,
  SelectionPromoCard: proxyNormalizer<SelectionPromoCardFragment>,
  LottoCard: proxyNormalizer<LottoCardFragment>,
  PriceBoostMultiplePromoCard: proxyNormalizer<PriceBoostMultiplePromoCardFragment>,
  SportsbookLotteriesBetLegCardGroup: proxyNormalizer<SportsbookLotteriesBetLegCardGroupFragment>,
  PromotionsCardGroup: proxyNormalizer<PromotionsCardGroupFragment>,
  TeamLineupCard: proxyNormalizer<TeamLineupCardFragment>,
  MonterosaContentCard: proxyNormalizer<MonterosaContentCardFragment>,
  EmbeddedContentCard: proxyNormalizer<EmbeddedContentCardFragment>,
  PopularSelectionsCard: proxyNormalizer<PopularSelectionsCardFragment | PopularSelectionsCardEnrichedPartialFragment>,
  QuicklinksGridCardGroup: proxyNormalizer<QuicklinksGridCardGroupFragment>,
  EmbeddedViewCard: proxyNormalizer<EmbeddedViewCardFragment>,
  SportsbookChatbotCard: proxyNormalizer<SportsbookChatbotCardFragment>,
  PenaltyTakersCard: proxyNormalizer<PenaltyTakersCardFragment>,
};

/**
 * The list of all normalizers indexed by their fragment's typename. If you want
 * to map a new Card/CardGroup just add here a new entry.
 */
export const normalizers: Normalizers = {
  ...apolloNormalizers,
  // Entities
  Sport: normalizeSportFragment,
  Competition: normalizeCompetitionFragment,
  FavouriteMarketsCountMetadata: normalizeFavouriteMarketsCountMetadataFragment,
  FavouriteMarketsState: normalizeFavouriteMarketsStateFragment,
  Meeting: normalizeMeetingFragment,
  Race: normalizeRaceFragment,
  RaceRunner: normalizeRaceRunnerFragment,
  GreyhoundRaceRunner: normalizeGreyhoundRaceRunnerFragment,
  MarketBet: normalizeExchangeMarketBetFragment,
  SportsbookMarket: normalizeSportsbookMarketsFragment,
  SportsbookRunnerLiveData: normalizeSportsbookRunnerLiveDataFragment,
  ExchangeCashoutQuote: normalizeExchangeCashoutQuoteFragment,
  SportsbookCashoutQuote: normalizeSportsbookCashoutQuoteFragment,
  SportsEvent: normalizeSportEventFragment,
  BottomBar: normalizeBottomBarFragment,
  LeftSidebar: normalizeLeftSidebarFragmentIntoLeftSidebar,
  ExchangeMarket: normalizeExchangeMarketFragment,
  SportsbookBet: normalizeSportsbookBetFragment,
  PreferenceSingleChoice: normalizePreferenceSingleChoiceFragment,
  GamingJackpot: normalizeGamingJackpotFragment,
  BetLeg: normalizeSportsbookBetLegFragment,
  VirtualSport: normalizeVirtualSportFragmentIntoVirtualSport,
  VirtualEvent: normalizeVirtualEventFragmentIntoVirtualEvent,
  VirtualRunner: normalizeVirtualRunnerFragment,
  VirtualMarket: normalizeVirtualMarketFragment,
  FootballFixture: normalizeFootballFixtureFragment,
  FootballPlayerFixtureContext: normalizeFootballPlayerFixtureContextFragment,
  TableTennisFixture: normalizeTableTennisFixtureFragment,
  TennisMatch: normalizeTennisFixtureFragment,
  PopularBettingOpportunity: normalizePopularBettingOpportunityFragment,
  BaseballFixture: normalizeBaseballFixtureFragment,
  BasketballFixture: normalizeBasketballFixtureFragment,
  IceHockeyFixture: normalizeIceHockeyFixtureFragment,
  AmericanFootballFixture: normalizeAmericanFootballFixtureFragment,
  CricketFixture: normalizeCricketFixtureFragment,
  SnookerFixture: normalizeSnookerFixtureFragment,
  AustralianRulesFixture: normalizeAustralianRulesFixtureFragment,
  DartsFixture: normalizeDartsFixtureFragment,
  BaseFixture: normalizeBaseFixtureFragment,
  RugbyUnionFixture: normalizeRugbyUnionFixtureFragment,
  RugbyLeagueFixture: normalizeRugbyLeagueFixtureFragment,
  VolleyballFixture: normalizeVolleyballFixtureFragment,
  Game: normalizeGameFragment,
  RegulatoryData: normalizeRegulatoryDataFragment,
  ImsPromotion: normalizeImsPromotionFragment,
  RunnerMarketGraph: normalizeRunnerMarketGraphFragment,
  ExtraWallet: normalizeExtraWalletFragment,
  ObbLeg: normalizeObbLegFragmentIntoObbLeg,
  LoyaltyPromotion: normalizeLoyaltyPromotionFragment,
  // Views
  GenericView: normalizeGenericViewFragment,
  RaceView: normalizeRaceViewFragment,
  MarketView: normalizeMarketViewFragment,
  AllCompetitionsView: normalizeAllCompetitionsViewFragment,
  RunnerView: normalizeRunnerViewFragment,
  GamingView: normalizeGamingViewFragment,
  AllMarketsView: normalizeAllMarketsViewFragment,
  EventView: normalizeEventViewFragment,
  ImsPromotionView: normalizeImsPromotionViewFragment,
  PromotionsView: normalizePromotionsViewFragment,
  PromotionsHubView: normalizePromotionsHubViewFragment,
  SettingsView: normalizeSettingsViewFragment,
  SportView: normalizeSportViewFragment,
  CompetitionView: normalizeCompetitionViewFragment,
  GameView: normalizeGameViewFragment,
  GamingCategoryView: normalizeGamingCategoryViewFragment,
  GamingSegmentationView: normalizeGamingSegmentationViewFragment,
  BrowseView: normalizeBrowseViewFragment,
  MaintenanceView: normalizeMaintenanceViewFragment,
  MyBetsView: normalizeMyBetsViewFragment,
  MyAccountView: normalizeMyAccountViewFragment,
  NotFoundView: normalizeNotFoundViewFragment,
  MarketRulesView: normalizeMarketRulesViewFragment,
  SelfExcludedView: normalizeSelfExcludedViewFragment,
  ObbLandingPageView: normalizeObbLandingPageViewFragmentIntoObbLandingPageView,
  // Groups
  SwimlaneCardGroup: normalizeSwimlaneCardGroupFragment,
  HalfTimeSpecialsSwimlaneCardGroup: normalizeHalfTimeSpecialsSwimlaneCardGroupFragment,
  FutureRacingCardGroup: normalizeFutureRacingCardGroupFragment,
  RaceByTimeRangeCard: normalizeRaceByTimeRangeCardFragment,
  RacesByTimeRangeCardGroup: normalizeRacesByTimeRangeCardGroupFragment,
  ViewZone: normalizeViewZoneFragment,
  SearchZone: normalizeSearchZoneFragment,
  SegmentedCardGroup: normalizeSegmentedCardGroupFragment,
  PebbleCardGroup: normalizePebbleCardGroupFragment,
  ExpandableCardGroup: normalizeExpandableCardGroupFragment,
  GamingCardGroup: normalizeGamingCardGroupFragment,
  SelectableItemsCardGroup: normalizeSelectableItemsCardGroupFragment,
  SportRibbonCardGroup: normalizeSportRibbonCardGroupFragment,
  SportsbookExpandableLegCardGroup: normalizeSportsbookExpandableLegCardGroupFragment,
  BetCardGroup: normalizeBetCardGroupFragment,
  BetSharingCardGroup: normalizeBetSharingCardGroupFragment,
  SwimlaneIndexedCardGroup: normalizeSwimlaneIndexedCardGroupFragment,
  ByTimeRangeMeetingCardGroup: normalizeByTimeRangeMeetingCardGroupFragment,
  SportsbookBetLegCardGroup: normalizeSportsbookBetLegCardGroupFragment,
  NavigationTabsList: normalizeNavigationTabsFragment,
  FilteredCouponCardGroup: normalizeFilteredCouponCardGroupFragment,
  MarketBetCardGroup: normalizeMarketBetCardGroupFragment,
  MarketBetSelectionCardGroup: normalizeMarketBetSelectionCardGroupFragment,
  MarketBetExpandableCardGroup: normalizeMarketBetExpandableCardGroupFragment,
  VirtualCardGroup: normalizeVirtualCardGroupFragment,
  ExtraWalletCardGroup: normalizeExtraWalletCardGroupFragment,
  ObbCardGroup: normalizeObbCardGroupFragment,
  RacingSwimlaneCardGroup: normalizeRacingSwimlaneCardGroupFragment,
  PopularSwimlaneCardGroup: normalizePopularSwimlaneCardGroupFragment,
  ObbCreatedBetsCardGroup: normalizeObbCreatedBetsCardGroupFragment,
  PromotionsHubCardGroup: normalizePromotionsHubCardGroupFragment,
  ObbOnboardingCardsCardGroup: normalizeObbOnboardingCardsCardGroupFragment,
  // Cards
  SportsbookBetCard: normalizeSportsbookBetCardFragment,
  ImsPromotionErrorCard: normalizeImsPromotionErrorCardFragment,
  GamingPlayNewCard: normalizeGamingPlayNewCardFragment,
  BroadcastsCard: normalizeBroadcastsCardFragment,
  BroadcastsAndStatisticsCard: normalizeBroadcastsAndStatisticsCardFragment,
  ContentSummaryCard: normalizeContentSummaryCardFragment,
  FavouriteMarketsNavigationTab: normalizeFavouriteMarketsNavigationTabFragment,
  NavigationTab: normalizeNavigationTabFragment,
  ImsPromotionTermsAndConditionsCard: normalizeImsPromotionTermsCardFragment,
  ImsPromotionDetailsCard: normalizeImsPromotionDetailsCardFragment,
  GamingLinkCard: normalizeGamingLinkCardFragment,
  RaceDetailsCard: normalizeRaceDetailsCardFragment,
  PreferenceSingleChoiceCard: normalizePreferenceSingleChoiceCardFragment,
  QuickLinksCard: normalizeQuickLinksCardFragment,
  LinksCard: normalizeLinksCardFragment,
  BalanceCard: normalizeBalanceCardFragment,
  RewardsCard: normalizeRewardsCardFragment,
  AccountBannersCard: normalizeAccountRewardsCardFragment,
  BetLegCard: normalizeSportsbookBetLegCardFragment,
  SportsbookBetInfoCard: normalizeSportsbookBetInfoCardFragment,
  EventMarketCard: normalizeEventMarketCardFragment,
  MarketCard: normalizeMarketCardFragment,
  FixtureCard: normalizeFixtureCardFragment,
  EventHeaderCard: normalizeEventHeaderCardFragment,
  HeadToHeadCard: normalizeHeadToHeadCardFragment,
  MatchTimelineCard: normalizeMatchTimelineCardFragment,
  MatchStatsCard: normalizeMatchStatsCardFragment,
  RegulatoryCard: normalizeRegulatoryCardFragment,
  MarketExtendedCard: normalizeMarketExtendedCardFragment,
  PromotionCard: normalizePromotionCardFragment,
  ForbiddenContentCard: normalizeForbiddenContentCardFragment,
  BudgetLimitsCard: normalizeBudgetLimitsCardFragment,
  HighlightedSelectionCard: normalizeHighlightedSelectionCardFragment,
  CouponHeaderCard: normalizeCouponHeaderCardFragment,
  RaceResultsCard: normalizeRaceResultsCardFragment,
  GridCard: normalizeGridCardFragment,
  RunnerInfoCard: normalizeRunnerInfoCardFragment,
  RaceViewLinkCard: normalizeRaceViewLinkCardFragment,
  RaceViewLinksCard: normalizeRaceViewLinksCardFragment,
  CompetitionRegionCard: normalizeCompetitionRegionCardFragment,
  SportViewLinkCard: normalizeSportViewLinkCardFragment,
  CompetitionViewLinkCard: normalizeCompetitionViewLinkCardFragment,
  GenericViewLinkCard: normalizeGenericViewLinkCardFragment,
  TimeFormBroadCastsCard: normalizeTimeFormBroadCastsCardFragment,
  MarketRulesCard: normalizeMarketRulesCardFragment,
  RaceMarketCard: normalizeRaceMarketCardFragment,
  ExpandableMarketCard: normalizeExpandableMarketCardFragment,
  VirtualEventDetailsCard: normalizeVirtualEventDetailsCardFragment,
  TeamFormCard: normalizeTeamFormCardFragment,
  VirtualMarketCard: normalizeVirtualMarketCardFragment,
  PopularBetBuilderCard: normalizePopularBetBuilderCardFragment,
  PriceBoostMultisCard: normalizePriceBoostMultipleCardFragment,
  PopularMultiplesBetBuilderCard: normalizePopularMultiplesBetBuilderCardFragment,
  PackagedCreatedBetsCard: normalizePackagedCreatedBetsCardFragment,
  PriceBoostMultisListCard: normalizePriceBoostMultisListCardFragment,
  CorrectScoreCard: normalizeCorrectScoreCardFragment,
  OutrightMarketListCard: normalizeOutrightMarketListCardFragment,
  EventViewLinkCard: normalizeEventViewLinkCardFragment,
  MarketViewLinkCard: normalizeMarketViewLinkCardFragment,
  GameInfoCard: normalizeGameInfoCardFragment,
  GameCard: normalizeGameCardFragment,
  EventStatsCard: normalizeEventStatsFragment,
  ImsPromotionStateCard: normalizeImsPromotionStateCardFragment,
  MarketGraphsCard: normalizeMarketGraphsCardFragment,
  GamingJackpotCard: normalizeGamingJackpotCardFragment,
  MarketBetCard: normalizeMarketBetCardFragment,
  MarketBetSelectionCard: normalizeMarketBetSelectionCardFragment,
  SearchBarCard: normalizeSearchBarCardFragmentIntoSearchBarCard,
  ExtraWalletCard: normalizeExtraWalletCardFragment,
  ObbPvpCard: normalizeObbPvpCardFragment,
  ObbSquadBetCard: normalizeObbSquadBetCardFragment,
  ObbSquadVsSquadCard: normalizeObbSquadVsSquadCardFragment,
  BlurbCard: normalizeBlurbCardFragmentIntoBlurbCard,
  MatchStatSelectionCard: normalizeMatchStatSelectionCardFragment,
  ObbCreatedBetsCard: normalizeObbCreatedBetsCardFragment,
  ObbEventPopularsCard: normalizeObbEventPopularsCardFragment,
};
