import type { useQuery } from "@apollo/client/react";

import type {
  StatsPlayersInPlayCardFragment,
  StatsPlayersInPlayCardQuery,
  StatsPlayersInPlayCardQueryVariables,
  StatsPlayersInPlayUserDetailsFragment,
} from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";

export enum PlayerStat {
  SHOTS_ON_TARGET = "shotsOnTarget",
  FOULS = "fouls",
  FOULS_WON = "foulsWon",
  ASSISTS = "assists",
  GOALKEEPER_SAVES = "goalkeeperSaves",
  TOTAL_SHOTS = "totalShots",
  TACKLES_WON = "tacklesWon",
  BLOCKED_SHOTS = "blockedShots",
  OFFSIDES = "offsides",
  INTERCEPTIONS = "interceptions",
  SHOTS_CREATED = "shotsCreated",
}

type TableEntry = {
  id: string;
  playerName: string;
  teamName: string;
  quantity: number;
};

export type SwimlaneItem = {
  stat: PlayerStat;
  title: string;
  description: string | null;
  hasTermsAndConditions: boolean;
  tableEntries: TableEntry[];
};

export type Translations = {
  termsConditions: string;
  emptyStateTitle: string;
  emptyStateMessageGeneral: string;
  emptyStateMessageSingleStat: string;
  player: string;
  total: string;
  showMore: string;
  showLess: string;
};

type StatsPlayersInPlayCardQueryData = {
  appContext: StatsPlayersInPlayUserDetailsFragment | null;
  card: StatsPlayersInPlayCardFragment | null;
};

type StatsPlayersInPlayCardQueryRequest = {
  call: () => Promise<useQuery.Result<StatsPlayersInPlayCardQuery, StatsPlayersInPlayCardQueryVariables>>;
  called: boolean;
  loading: boolean;
};

export type StatsPlayersInPlayCardQueryResult = {
  data: StatsPlayersInPlayCardQueryData;
  request: StatsPlayersInPlayCardQueryRequest;
};

export type StatsPlayersInPlayCardVM = {
  loading: boolean;
  vm: {
    data: {
      swimlaneItems: SwimlaneItem[] | null;
      translations: Translations;
      termsAndConditionsURL?: string;
      timestamp?: string | null;
    };
    events: {
      onExpandableClickButton: (urn: string, isOpen: boolean) => void;
      onTermsTap: (urn: string, destinationUrl: string, title: string) => void;
    };
  };
};

export type StatsTableProps = {
  translations: Translations;
  bodyEntries: TableEntry[];
  hasShowMore: boolean;
  isShowMoreOpen: boolean;
  onShowMore: () => void;
};

export type StatsPlayersInPlayCardProps = {
  urn: string;
  visible?: boolean;
};
