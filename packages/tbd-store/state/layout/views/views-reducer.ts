import { combineReducers, Reducer } from "redux";
import {
  Views,
  GenericView,
  RaceView,
  AllCompetitionsView,
  AllMarketsView,
  CompetitionView,
  EventView,
  GamingView,
  ImsPromotionView,
  PromotionsView,
  PromotionsHubView,
  RunnerView,
  SportView,
  MarketView,
  SettingsView,
  GameView,
  GamingCategoryView,
  NotFoundView,
  GamingSegmentationView,
  MarketRulesView,
  SelfExcludedView,
  ObbLandingPageView,
} from "./View.types";
import browseViewReducer from "./browse-view/browse-view-reducer";
import myAccountReducer from "./my-account/my-account-view-reducer";
import myBetsViewReducer from "./my-bets/my-bets-view-reducer";
import errorViewReducer from "./error-view/error-view-reducer";
import { maintenanceReducer } from "./maintenance-view/maintenance-view-reducer";
import createReducer from "./create-view-reducer";

/**
 * Register a "views reducer" comprised of nested "view entity" reducers
 */
const viewsReducer: Reducer<Views> = combineReducers<Views>({
  allcompetitions: createReducer<AllCompetitionsView>("AllCompetitionsView"),
  allmarkets: createReducer<AllMarketsView>("AllMarketsView"),
  browse: browseViewReducer,
  competition: createReducer<CompetitionView>("CompetitionView"),
  error: errorViewReducer,
  event: createReducer<EventView>("EventView"),
  game: createReducer<GameView>("GameView"),
  gaming: createReducer<GamingView>("GamingView"),
  gamingcategory: createReducer<GamingCategoryView>("GamingCategoryView"),
  gamingsegmentation: createReducer<GamingSegmentationView>("GamingSegmentationView"),
  generic: createReducer<GenericView>("GenericView"),
  imspromotion: createReducer<ImsPromotionView>("ImsPromotionView"),
  promotions: createReducer<PromotionsView>("PromotionsView"),
  maintenance: maintenanceReducer,
  notfound: createReducer<NotFoundView>("NotFoundView"),
  market: createReducer<MarketView>("MarketView"),
  myAccount: myAccountReducer,
  mybets: myBetsViewReducer,
  race: createReducer<RaceView>("RaceView"),
  runner: createReducer<RunnerView>("RunnerView"),
  settings: createReducer<SettingsView>("SettingsView"),
  selfexcluded: createReducer<SelfExcludedView>("SelfExcludedView"),
  sport: createReducer<SportView>("SportView"),
  promotionshub: createReducer<PromotionsHubView>("PromotionsHubView"),
  marketrules: createReducer<MarketRulesView>("MarketRulesView"),
  obblandingpage: createReducer<ObbLandingPageView>("ObbLandingPageView"),
});

export default viewsReducer;
