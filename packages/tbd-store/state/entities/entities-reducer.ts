import { combineReducers, Reducer } from "redux";
import type {
  Competition,
  Entities,
  FavouriteMarketsCountMetadata,
  Jackpot,
  Meeting,
  VirtualSport,
  VirtualRunner,
} from "./index";
import productIdReducer from "./product-id/product-id-reducer";
import appKeyReducer from "./app-key/app-key-reducer";
import appVersionReducer from "./app-version/app-version-reducer";
import baseballFixtureReducer from "./baseball-fixture/baseball-fixture-reducer";
import basketballFixtureReducer from "./basketball-fixture/basketball-fixture-reducer";
import iceHockeyFixtureReducer from "./ice-hockey-fixture/ice-hockey-fixture-reducer";
import americanFootballFixtureReducer from "./american-football-fixture/american-football-fixture-reducer";
import cricketFixtureReducer from "./cricket-fixture/cricket-fixture-reducer";
import rugbyUnionFixtureReducer from "./rugby-union-fixture/rugby-union-fixture-reducer";
import rugbyLeagueFixtureReducer from "./rugby-league-fixture/rugby-league-fixture-reducer";
import snookerFixtureReducer from "./snooker-fixture/snooker-fixture-reducer";
import volleyballFixtureReducer from "./volleyball-fixture/volleyball-fixture-reducer";
import australianRulesFixtureReducer from "./australian-rules-fixture/australian-rules-fixture-reducer";
import dartsFixtureReducer from "./darts-fixture/darts-fixture-reducer";
import createReducer from "./create-entity-reducer";
import exchangeMarketsReducer from "./exchange-markets/exchange-markets-reducer";
import exchangeRunnersReducer from "./exchange-runners/exchange-runners-reducer";
import exchangeRunnersTradedReducer from "./exchange-runners-traded/exchange-runners-traded-reducer";
import brandSettingsReducer from "./brand-settings/brand-settings-reducer";
import favouriteMarketsStateReducer from "./favourite-markets-state/favourite-markets-state-reducer";
import footballFixtureSlice from "./football-fixture/football-fixture-slice";
import footballPlayerFixtureContextSlice from "./football-player-fixture-context/football-player-fixture-context-slice";
import gameReducer from "./games/games-reducer";
import obbLegsReducer from "./obb-legs/obb-legs-reducer";
import obbParticipantsReducer from "./obb-participants/obb-participants-reducer";
import imsPromotionsReducer from "./ims-promotions/ims-promotions-reducer";
import messagesReducer from "./messages/messages-reducer";
import notificationsReducer from "./notifications/notifications-reducer";
import racesReducer from "./races/race-reducer";
import settingsPreferencesReducer from "./settings-preferences/settings-preferences-reducer";
import sportsbookMarketsReducer from "./sportsbook-markets/sportsbook-markets-reducer";
import sportsbookRunnersReducer from "./sportsbook-runners/sportsbook-runners-reducer";
import tableTennisFixtureReducer from "./table-tennis-fixture/table-tennis-fixture-reducer";
import tennisFixtureReducer from "./tennis-fixture/tennis-fixture-reducer";
import throttlesReducer from "./throttles/throttles-reducer";
import userDetailsReducer from "./user-details/user-details-reducer";
import userPreferencesReducer from "./user-preferences/user-preferences-reducer";
import appContextDetailsReducer from "./app-context/app-context-details-reducer";
import userWalletsReducer from "./user-wallets/user-wallets-reducer";
import webMessagesReducer from "./web-messages/web-messages-reducer";
import raceRunnersReducer from "./race-runners/race-runners-reducer";
import greyhoundRaceRunnersReducer from "./greyhound-race-runners/greyhound-race-runners-reducer";
import loyaltyMessagingReducer from "./loyalty-messaging/loyalty-messaging-reducer";
import virtualEventsReducer from "./virtual-event/virtual-event-reducer";
import popularBettingOpportunitiesReducer from "./popular-betting-opportunities/popular-betting-opportunities-reducer";
import virtualMarketsReducer from "./virtual-market/virtual-market-reducer";
import experimentsReducer from "./experiments/experiments-reducer";
import sportsReducer from "./sports/sport-reducer";
import sportsbookBetLegsReducer from "./sportsbook-bet-legs/sportsbook-bet-legs-reducer";
import regulatoryDataReducer from "./regulatory-data/regulatory-data-reducer";
import sportsEventReducer from "./sport-events/sport-events-reducer";
import extraWalletReducer from "./extra-wallet/extra-wallet-reducer";

/**
 * Register a "entities reducer" comprised of nested "business entity" reducers
 */
const entitiesReducer: Reducer<Entities> = combineReducers<Entities>({
  productId: productIdReducer,
  appkey: appKeyReducer,
  appkeytype: appKeyReducer,
  appversion: appVersionReducer,
  baseballfixtures: baseballFixtureReducer,
  basketballfixtures: basketballFixtureReducer,
  brandSettings: brandSettingsReducer,
  americanfootballfixtures: americanFootballFixtureReducer,
  cricketfixtures: cricketFixtureReducer,
  competitions: createReducer<Competition>("Competition"),
  exchangemarkets: exchangeMarketsReducer,
  exchangerunners: exchangeRunnersReducer,
  exchangerunnerstraded: exchangeRunnersTradedReducer,
  favouritemarketscountmetadatas: createReducer<FavouriteMarketsCountMetadata>("FavouriteMarketsCountMetadata"),
  favouritemarketsstates: favouriteMarketsStateReducer,
  footballfixtures: footballFixtureSlice.reducer,
  footballplayerfixturecontexts: footballPlayerFixtureContextSlice.reducer,
  rugbyunionfixtures: rugbyUnionFixtureReducer,
  rugbyleaguefixtures: rugbyLeagueFixtureReducer,
  volleyballfixtures: volleyballFixtureReducer,
  games: gameReducer,
  imspromotions: imsPromotionsReducer,
  jackpots: createReducer<Jackpot>("GamingJackpot"),
  obbLegs: obbLegsReducer,
  obbParticipants: obbParticipantsReducer,
  meetings: createReducer<Meeting>("Meeting"),
  messages: messagesReducer,
  notifications: notificationsReducer,
  preferences: userPreferencesReducer,
  racerunners: raceRunnersReducer,
  greyhoundracerunners: greyhoundRaceRunnersReducer,
  races: racesReducer,
  settingspreferences: settingsPreferencesReducer,
  sportevents: sportsEventReducer,
  sports: sportsReducer,
  sportsbookbetlegs: sportsbookBetLegsReducer,
  sportsbookmarkets: sportsbookMarketsReducer,
  sportsbookrunners: sportsbookRunnersReducer,
  tabletennisfixtures: tableTennisFixtureReducer,
  tennisfixtures: tennisFixtureReducer,
  throttles: throttlesReducer,
  userdetails: userDetailsReducer,
  wallets: userWalletsReducer,
  webMessages: webMessagesReducer,
  appContextDetails: appContextDetailsReducer,
  loyaltyMessages: loyaltyMessagingReducer,
  virtualsports: createReducer<VirtualSport>("VirtualSport"),
  virtualevents: virtualEventsReducer,
  virtualrunners: createReducer<VirtualRunner>("VirtualRunner"),
  virtualmarkets: virtualMarketsReducer,
  popularbettingopportunities: popularBettingOpportunitiesReducer,
  experiments: experimentsReducer,
  regulatoryData: regulatoryDataReducer,
  extraWallets: extraWalletReducer,
  icehockeyfixtures: iceHockeyFixtureReducer,
  snookerfixtures: snookerFixtureReducer,
  australianrulesfixtures: australianRulesFixtureReducer,
  dartsfixtures: dartsFixtureReducer,
});

export default entitiesReducer;
