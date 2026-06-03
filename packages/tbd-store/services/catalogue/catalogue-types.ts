import { ExchangeCashouts } from "../../state/betting/exchange-cashouts/ExchangeCashouts.types";
import { SportsbookCashouts } from "../../state/betting/sportsbook-cashouts/SportsbookCashouts.types";
import { BetLegs, SportsbookBets } from "../../state/betting/sportsbook-bets/SportsbookBet.types";
import { ExchangeMarketBets } from "../../state/betting/exchange-market-bets/ExchangeMarketBet.types";
import URN from "../../state/layout/URN";
import {
  Competitions,
  TennisFixtures,
  BaseballFixtures,
  BasketballFixtures,
  IceHockeyFixtures,
  AmericanFootballFixtures,
  RugbyUnionFixtures,
  RugbyLeagueFixtures,
  VolleyballFixtures,
  CricketFixtures,
  DartsFixtures,
  TableTennisFixtures,
  SnookerFixtures,
  AustralianRulesFixtures,
  ExchangeMarkets,
  ExchangeRunners,
  ExchangeRunnersTraded,
  FootballFixtures,
  Games,
  Jackpots,
  Sports,
  SportEvents,
  SportsbookMarkets,
  SportsbookRunners,
  Meetings,
  Races,
  RaceRunners,
  ImsPromotions,
  SettingsPreferences,
  VirtualSports,
  VirtualEvents,
  VirtualRunners,
  VirtualMarkets,
  PopularBettingOpportunities,
  DefaultProductOption,
  ExchangeDefaultProductOption,
  ProductsOption,
} from "../../state/entities";
import {
  AttackIncident,
  CardIncident,
  ExchangeMarketFragment,
  FootballIncidentFragment,
  FoulIncident,
  GoalIncident,
  PenaltyIncident,
  PenaltyShootoutIncident,
  PeriodIncident,
  PreferenceSingleChoice as CataloguePreferenceSingleChoice,
  SetPieceIncident,
  ShotIncident,
  SportsbookMarketFragment,
  SubstitutionIncident,
  TeamFormCardFragment,
} from "../../clients/catalogue/catalogue-response-types";
import { NormalizersResult } from "./normalizer/normalizer-engine";

export type Entities = {
  exchangemarkets: ExchangeMarkets;
  exchangemarketbets: ExchangeMarketBets;
  exchangerunners: ExchangeRunners;
  exchangerunnerstraded: ExchangeRunnersTraded;
  sportsbookmarkets: SportsbookMarkets;
  sportsbookrunners: SportsbookRunners;
  sportevents: SportEvents;
  competitions: Competitions;
  sports: Sports;
  footballfixtures: FootballFixtures;
  tennisfixtures: TennisFixtures;
  baseballfixtures: BaseballFixtures;
  basketballfixtures: BasketballFixtures;
  icehockeyfixtures: IceHockeyFixtures;
  americanfootballfixtures: AmericanFootballFixtures;
  rugbyunionfixtures: RugbyUnionFixtures;
  rugbyleaguefixtures: RugbyLeagueFixtures;
  volleyballfixtures: VolleyballFixtures;
  cricketfixtures: CricketFixtures;
  dartsfixtures: DartsFixtures;
  tabletennisfixtures: TableTennisFixtures;
  snookerfixtures: SnookerFixtures;
  australianrulesfixtures: AustralianRulesFixtures;
  games: Games;
  jackpots: Jackpots;
  exchangecashouts: ExchangeCashouts;
  sportsbookbets: SportsbookBets;
  sportsbookbetlegs: BetLegs;
  meetings: Meetings;
  races: Races;
  sportsbookcashouts: SportsbookCashouts;
  imspromotions: ImsPromotions;
  racerunners: RaceRunners;
  settingsPreferences: SettingsPreferences;
  virtualsports: VirtualSports;
  virtualevents: VirtualEvents;
  virtualrunners: VirtualRunners;
  virtualmarkets: VirtualMarkets;
  popularbettingopportunities: PopularBettingOpportunities;
};

export type TransformedLayout = {
  data: NormalizersResult;
  router?: {
    currentUrn: URN;
    currentUrl: string;
    currentView: string | null;
    category?: string | null;
  };
};

export type PreferenceSingleChoice = CataloguePreferenceSingleChoice & {
  typename: "PreferenceSingleChoice";
};

export type SetPreferenceResult =
  | {
      settingsPreferences: {
        [x: string]: PreferenceSingleChoice;
      };
      userPreferences: {
        [x: string]: string | boolean | DefaultProductOption | ExchangeDefaultProductOption | ProductsOption[];
      };
    }
  | undefined;

export const isExchangeMarket = (
  market: ExchangeMarketFragment | SportsbookMarketFragment,
): market is ExchangeMarketFragment => market.__typename === "ExchangeMarket";

export const isSportsbookMarket = (
  market: ExchangeMarketFragment | SportsbookMarketFragment,
): market is SportsbookMarketFragment => market.__typename === "SportsbookMarket";

export const shouldRenderRecentFormCard = (teamFormCard: TeamFormCardFragment): boolean =>
  !!teamFormCard.footballFixture?.recentForm?.home?.length || !!teamFormCard.footballFixture?.recentForm?.away?.length;

export const isGoalIncident = (
  incident: FootballIncidentFragment["details"],
): incident is GoalIncident & { __typename: "GoalIncident" } => incident?.__typename === "GoalIncident";

export const isCardIncident = (
  incident: FootballIncidentFragment["details"],
): incident is CardIncident & { __typename: "CardIncident" } => incident?.__typename === "CardIncident";

export const isSubstitutionIncident = (
  incident: FootballIncidentFragment["details"],
): incident is SubstitutionIncident & { __typename: "SubstitutionIncident" } =>
  incident?.__typename === "SubstitutionIncident";

export const isPenaltyIncident = (
  incident: FootballIncidentFragment["details"],
): incident is PenaltyIncident & { __typename: "PenaltyIncident" } => incident?.__typename === "PenaltyIncident";

export const isPenaltyShootoutIncident = (
  incident: FootballIncidentFragment["details"],
): incident is PenaltyShootoutIncident & { __typename: "PenaltyShootoutIncident" } =>
  incident?.__typename === "PenaltyShootoutIncident";

export const isPeriodIncident = (
  incident: FootballIncidentFragment["details"],
): incident is PeriodIncident & { __typename: "PeriodIncident" } => incident?.__typename === "PeriodIncident";

export const isShotIncident = (
  incident: FootballIncidentFragment["details"],
): incident is ShotIncident & { __typename: "ShotIncident" } => incident?.__typename === "ShotIncident";

export const isSetPieceIncident = (
  incident: FootballIncidentFragment["details"],
): incident is SetPieceIncident & { __typename: "SetPieceIncident" } => incident?.__typename === "SetPieceIncident";

export const isFoulIncident = (
  incident: FootballIncidentFragment["details"],
): incident is FoulIncident & { __typename: "FoulIncident" } => incident?.__typename === "FoulIncident";

export const isAttackIncident = (
  incident: FootballIncidentFragment["details"],
): incident is AttackIncident & { __typename: "AttackIncident" } => incident?.__typename === "AttackIncident";
