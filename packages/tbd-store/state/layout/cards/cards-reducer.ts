import { combineReducers, Reducer } from "redux";
import {
  BalanceCard,
  BroadcastsCard,
  Cards,
  CompetitionViewLinkCard,
  CompetitionRegionCard,
  ContentSummaryCard,
  EventViewLinkCard,
  GameCard,
  GameInfoCard,
  GamingJackpotCard,
  GamingLinkCard,
  GamingPlayNewCard,
  HeadToHeadCard,
  HighlightedSelectionCard,
  ImsPromotionDetailsCard,
  ImsPromotionErrorCard,
  ImsPromotionStateCard,
  LinksCard,
  MarketGraphsCard,
  MarketRulesCard,
  MarketViewLinkCard,
  MatchStatsCard,
  MatchTimelineCard,
  PreferenceSingleChoiceCard,
  PromotionCard,
  QuickLinksCard,
  RaceDetailsCard,
  RaceViewLinkCard,
  RaceViewLinksCard,
  RecentFormCard,
  RegulatoryCard,
  RewardsCard,
  RunnerInfoCard,
  SportViewLinkCard,
  RaceByTimeRangeCard,
  ForbiddenContentCard,
  BetLegCard,
  GenericViewLinkCard,
  BudgetLimitsCard,
  CouponHeaderCard,
  PopularBetBuilderCard,
  PopularMultiplesBetBuilderCard,
  RaceResultsCard,
  TimeFormBroadCastsCard,
  ExpandableMarketCard,
  VirtualEventDetailsCard,
  VirtualMarketCard,
  CorrectScoreCard,
  GridCard,
  BroadcastsAndStatisticsCard,
  OutrightMarketListCard,
  EventHeaderCard,
  SportsbookBetInfoCard,
  MarketBetCard,
  MarketBetSelectionCard,
  ImsPromotionTermsAndConditionsCard,
  EmbeddedContentCard,
  SearchBarCard,
  PriceBoostMultisCard,
  BlurbCard,
  MatchStatSelectionCard,
  PartialExpandableMarketCard,
} from "./Card.types";
import accountBannersReducer from "./account-banners/account-banners-cards-reducer";
import bottomBarReducer from "./bottom-bar/bottom-bar-card-reducer";
import receiptReducer from "./receipt/receipt-card-reducer";
import eventMarketReducer from "./event-market/event-market-cards-reducer";
import marketExtendedReducer from "./market-extended/market-extended-cards-reducer";
import marketReducer from "./market/market-cards-reducer";
import myAccount from "./my-account/my-account-card-reducer";
import myBetsReducer from "./my-bets/my-bets-cards-reducer";
import racemarketReducer from "./race-market/race-market-cards-reducer";
import sportsbookbetsReducer from "./sportsbook-bets/sportsbook-bet-cards-reducer";
import fixtureReducer from "./fixture/fixture-cards-reducer";
import eventStatsReducer from "./event-stats/event-stats-cards-reducer";
import pcbReducer from "./packaged-created-bets/packaged-created-bets-cards-reducer-slice";
import pbmlReducer from "./price-boost-multis-list-card/price-boost-multis-list-card-reducer-slice";
import createSliceFactory from "./create-card-slice";
import { DELETE_LAYOUT } from "../../../actions/catalogue";
import extraWalletCardsReducer from "./extra-wallet/extra-wallet-cards-reducer";
import obbCardReducer from "./obb-card/obb-card-reducer";
import obbCreatedBetsCardReducer from "./obb-created-bets-card/obb-created-bets-card-reducer";
import obbEventPopularsCardReducer from "./obb-event-populars-card/obb-event-populars-card-reducer";

const cardEntriesReducer: Reducer<Cards> = combineReducers<Cards>({
  accountBanners: accountBannersReducer,
  balance: createSliceFactory<BalanceCard>("BalanceCard").reducer,
  bottombar: bottomBarReducer,
  blurb: createSliceFactory<BlurbCard>("BlurbCard").reducer,
  broadcasts: createSliceFactory<BroadcastsCard>("BroadcastsCard").reducer,
  competitionregions: createSliceFactory<CompetitionRegionCard>("CompetitionRegionCard").reducer,
  competitionviewlinks: createSliceFactory<CompetitionViewLinkCard>("CompetitionViewLinkCard").reducer,
  contentsummary: createSliceFactory<ContentSummaryCard>("ContentSummaryCard").reducer,
  eventmarkets: eventMarketReducer,
  eventviewlinks: createSliceFactory<EventViewLinkCard>("EventViewLinkCard").reducer,
  eventstats: eventStatsReducer,
  fixtures: fixtureReducer,
  eventheader: createSliceFactory<EventHeaderCard>("EventHeaderCard").reducer,
  forbiddencontent: createSliceFactory<ForbiddenContentCard>("ForbiddenContentCard").reducer,
  gameinfos: createSliceFactory<GameInfoCard>("GameInfoCard").reducer,
  games: createSliceFactory<GameCard>("GameCard").reducer,
  gamingjackpots: createSliceFactory<GamingJackpotCard>("GamingJackpotCard").reducer,
  gaminglinks: createSliceFactory<GamingLinkCard>("GamingLinkCard").reducer,
  gamingplaynews: createSliceFactory<GamingPlayNewCard>("GamingPlayNewCard").reducer,
  genericviewlinks: createSliceFactory<GenericViewLinkCard>("GenericViewLinkCard").reducer,
  headtoheads: createSliceFactory<HeadToHeadCard>("HeadToHeadCard").reducer,
  highlightedselections: createSliceFactory<HighlightedSelectionCard>("HighlightedSelectionCard").reducer,
  imspromotiondetails: createSliceFactory<ImsPromotionDetailsCard>("ImsPromotionDetailsCard").reducer,
  imspromotionerror: createSliceFactory<ImsPromotionErrorCard>("ImsPromotionErrorCard").reducer,
  imspromotionstate: createSliceFactory<ImsPromotionStateCard>("ImsPromotionStateCard").reducer,
  imspromotiontermsandconditions: createSliceFactory<ImsPromotionTermsAndConditionsCard>(
    "ImsPromotionTermsAndConditionsCard",
  ).reducer,
  links: createSliceFactory<LinksCard>("LinksCard").reducer,
  marketgraphs: createSliceFactory<MarketGraphsCard>("MarketGraphsCard").reducer,
  marketrules: createSliceFactory<MarketRulesCard>("MarketRulesCard").reducer,
  markets: marketReducer,
  marketsextended: marketExtendedReducer,
  marketviewlinks: createSliceFactory<MarketViewLinkCard>("MarketViewLinkCard").reducer,
  matchstats: createSliceFactory<MatchStatsCard>("MatchStatsCard").reducer,
  matchtimelines: createSliceFactory<MatchTimelineCard>("MatchTimelineCard").reducer,
  myaccount: myAccount,
  mybets: myBetsReducer,
  preferencesinglechoices: createSliceFactory<PreferenceSingleChoiceCard>("PreferenceSingleChoiceCard").reducer,
  promotions: createSliceFactory<PromotionCard>("PromotionCard").reducer,
  quicklinks: createSliceFactory<QuickLinksCard>("QuickLinksCard").reducer,
  racebytimerangecards: createSliceFactory<RaceByTimeRangeCard>("RaceByTimeRangeCard").reducer,
  racedetails: createSliceFactory<RaceDetailsCard>("RaceDetailsCard").reducer,
  racemarkets: racemarketReducer,
  raceresults: createSliceFactory<RaceResultsCard>("RaceResultsCard").reducer,
  raceviewlink: createSliceFactory<RaceViewLinkCard>("RaceViewLinkCard").reducer,
  raceviewlinks: createSliceFactory<RaceViewLinksCard>("RaceViewLinksCard").reducer,
  receipt: receiptReducer,
  recentforms: createSliceFactory<RecentFormCard>("TeamFormCard").reducer,
  regulatory: createSliceFactory<RegulatoryCard>("RegulatoryCard").reducer,
  rewards: createSliceFactory<RewardsCard>("RewardsCard").reducer,
  runnerinfos: createSliceFactory<RunnerInfoCard>("RunnerInfoCard").reducer,
  sportsbookbets: sportsbookbetsReducer,
  sportviewlinks: createSliceFactory<SportViewLinkCard>("SportViewLinkCard").reducer,
  timeformbroadcasts: createSliceFactory<TimeFormBroadCastsCard>("TimeFormBroadCastsCard").reducer,
  betlegs: createSliceFactory<BetLegCard>("BetLegCard").reducer,
  budgetLimits: createSliceFactory<BudgetLimitsCard>("BudgetLimitsCard").reducer,
  couponheaders: createSliceFactory<CouponHeaderCard>("CouponHeaderCard").reducer,
  grids: createSliceFactory<GridCard>("GridCard").reducer,
  expandablemarkets: createSliceFactory<ExpandableMarketCard | PartialExpandableMarketCard>("ExpandableMarketCard")
    .reducer,
  virtualeventdetails: createSliceFactory<VirtualEventDetailsCard>("VirtualEventDetailsCard").reducer,
  virtualmarket: createSliceFactory<VirtualMarketCard>("VirtualMarketCard").reducer,
  popularbetbuilders: createSliceFactory<PopularBetBuilderCard>("PopularBetBuilderCard").reducer,
  packagedcreatedbets: pcbReducer.reducer,
  popularmultiplesbetbuilders: createSliceFactory<PopularMultiplesBetBuilderCard>("PopularMultiplesBetBuilderCard")
    .reducer,
  correctscorecards: createSliceFactory<CorrectScoreCard>("CorrectScoreCard").reducer,
  outrightmarketlistcards: createSliceFactory<OutrightMarketListCard>("OutrightMarketListCard").reducer,
  broadcastsandstatistics: createSliceFactory<BroadcastsAndStatisticsCard>("BroadcastsAndStatisticsCard").reducer,
  sportsbookbetinfos: createSliceFactory<SportsbookBetInfoCard>("SportsbookBetInfoCard").reducer,
  marketbetcard: createSliceFactory<MarketBetCard>("MarketBetCard").reducer,
  marketbetselectioncard: createSliceFactory<MarketBetSelectionCard>("MarketBetSelectionCard").reducer,
  embeddedcontents: createSliceFactory<EmbeddedContentCard>("EmbeddedContentCard").reducer,
  searchBar: createSliceFactory<SearchBarCard>("SearchBarCard").reducer,
  extrawallet: extraWalletCardsReducer,
  priceboostmulticards: createSliceFactory<PriceBoostMultisCard>("PriceBoostMultisCard").reducer,
  obbcards: obbCardReducer,
  priceboostmultislistcards: pbmlReducer.reducer,
  matchstatselections: createSliceFactory<MatchStatSelectionCard>("MatchStatSelectionCard").reducer,
  obbcreatedbetscards: obbCreatedBetsCardReducer,
  obbeventpopularscards: obbEventPopularsCardReducer,
});

const cardsReducer: Reducer<Cards> = (currentState, action) => {
  let newState: Cards;

  switch (action.type) {
    case DELETE_LAYOUT:
      newState = cardEntriesReducer(undefined, action);
      return {
        ...newState,
        // we can't clear bottom bar state because native app depends on previous state whe refreshing the view (ex: maintenace page, pull to refresh)
        bottombar: currentState?.bottombar ?? newState.bottombar,
      };
    default:
      return cardEntriesReducer(currentState, action);
  }
};

export default cardsReducer;
