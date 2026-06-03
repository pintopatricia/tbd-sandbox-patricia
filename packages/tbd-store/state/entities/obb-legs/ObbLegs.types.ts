import { FootballPlayerPosition, Jerseys, ObbIncidentType } from "../../../clients/catalogue/catalogue-response-types";
import URN from "../../layout/URN";

export type ObbOutcome = {
  incidentType: string;
  operator?: string | null;
  value: number | boolean;
  period: string;
};

export type ObbOperator = {
  id: string;
};

export type ObbPeriod = {
  id: string;
};

export type ObbLegTemplateId = "participantsCombined" | "playerVsPlayer" | "squadVsSquad";

export type ObbLeg = {
  id: string;
  templateId: ObbLegTemplateId;
  templateParams: ObbTemplateParams | null;
  quote?: ObbQuote;
  event: ObbSportEvent;
};

export type ObbTemplateParams = ObbSquadBetLegTemplateParams | ObbPvpLegTemplateParams | ObbSquadVsSquadTemplateParams;

export type ObbSquadBetLegTemplateParams = {
  participantIds: Array<string>;
  outcomeIds: Array<string>;
  value: number;
  timePeriodId: string;
  quantifier: string;
};

export type ObbPvpLegTemplateParams = {
  participantIdA: string;
  participantIdB: string;
  outcomeId: string;
  timePeriodId: string;
};

export type ObbSquadVsSquadTemplateParams = {
  squadAParticipantIds: Array<string>;
  squadBParticipantIds: Array<string>;
  outcomeIds: Array<string>;
  timePeriodId: string;
  quantifier: string;
};

export type ObbLegs = {
  [id: string]: ObbLeg;
};

export type ObbQuote = ObbQuoteSuccess | ObbQuoteError;

export type ObbQuoteSuccess = {
  typename: "ObbQuoteSuccess";
  price: ObbSportsbookOdds;
};

export type ObbQuoteError = {
  typename: "ObbQuoteError";
  errorCode: string;
  errorDetails: string | null;
};

export type ObbFormattedQuote = {
  odds: string | null;
  quoteError?: string;
};

export type ObbSportEvent = {
  typename: "SportsEvent";
  urn: URN;
  name: string;
  eventId: number;
};

export type ObbSportsbookOdds = {
  fractional: {
    numerator: number;
    denominator: number;
  };
  decimal: number;
};

export type SelectorObbLeg = {
  id: string;
  templateId: ObbLegTemplateId;
  templateParams?: SelectorObbLegTemplateParams;
  quote?: ObbQuote;
  event: ObbSportEvent;
};

export type SelectorObbLegTemplateParams =
  | SelectorObbPvpLegTemplateParams
  | SelectorObbSquadBetLegTemplateParams
  | SelectorObbSquadVsSquadLegTemplateParams;

export type SelectorObbPvpLegTemplateParams = {
  participantIdA: ObbParticipant;
  participantIdB: ObbParticipant;
  outcomeId: string;
  timePeriodId: string;
};

export type SelectorObbSquadBetLegTemplateParams = {
  participantIds: Array<ObbParticipant>;
  outcomeIds: Array<string>;
  value: number;
  timePeriodId: string;
  quantifier: string;
};

export type SelectorObbSquadVsSquadLegTemplateParams = {
  squadAParticipantIds: Array<ObbParticipant>;
  squadBParticipantIds: Array<ObbParticipant>;
  outcomeIds: Array<string>;
  timePeriodId: string;
  quantifier: string;
};

export type ObbParticipant = ObbFootballPlayer;

export type ObbFootballPlayer = {
  typename: "ObbFootballPlayer";
  urn: URN;
  player: FootballPlayer;
  team: FootballTeamDetails;
  incidentTypes: {
    [id: string]: ObbIncidentType;
  };
};

export type ObbParticipantsWithStats = Array<
  ObbParticipant & {
    stats: ({ id: string; value: number | null } | null)[];
  }
>;

export type FootballPlayer = {
  id: string | null;
  name: string | null;
  position: FootballPlayerPosition | null;
  shirtNumber: number | null;
  seasonStats: FootballPlayerSeasonStats | null;
};

export type FootballPlayerSeasonStats = {
  matchesPlayed: number;
  averages: {
    goals: number;
    redCards: number;
    shotsOnTarget: number;
    totalShots: number;
    yellowCards: number;
    yellowRedCards: number;
    fouls: number | null;
    foulsWon: number | null;
    assists: number | null;
    passes: number | null;
    foulInvolvements: number | null;
  };
};

export type FootballTeamDetails = {
  name: string | null;
  id: string | null;
  color?: string | null;
  jerseys?: { url: Jerseys["url"] }[] | null;
};
