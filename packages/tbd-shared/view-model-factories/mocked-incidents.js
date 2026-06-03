import {
  CardIncidentType,
  GoalIncidentType,
  FootballMatchPeriod,
  FixtureTeamSide,
  FootballMatchStatus,
  PeriodIncidentType,
  SetPieceIncidentType,
  FoulIncidentType,
  AttackIncidentType,
  ShotIncidentType,
} from "@ppb/tbd-store/state/entities/football-fixture/FootballFixture.types";

export const MOCKED_INCIDENTS = [
  {
    clock: {
      minute: 119,
      second: 10,
    },
    period: FootballMatchPeriod.EXTRA,
    periodStatus: FootballMatchStatus.FULL,
    type: "PeriodIncident",
    details: {
      periodType: PeriodIncidentType.PERIOD_TRANSITION,
      period: FootballMatchPeriod.EXTRA,
      status: FootballMatchStatus.FULL,
      injuryTime: null,
    },
  },
  {
    clock: {
      minute: 107,
      second: 19,
    },
    period: FootballMatchPeriod.EXTRA,
    periodStatus: FootballMatchStatus.INPLAY_SECOND_HALF,
    type: "CardIncident",
    details: {
      cardType: CardIncidentType.YELLOW,
      side: FixtureTeamSide.HOME,
      player: {
        name: "Cristi B.",
      },
    },
  },
  {
    clock: {
      minute: 105,
      second: 0,
    },
    period: FootballMatchPeriod.EXTRA,
    periodStatus: FootballMatchStatus.INPLAY_SECOND_HALF,
    type: "PeriodIncident",
    details: {
      periodType: PeriodIncidentType.PERIOD_TRANSITION,
      period: FootballMatchPeriod.EXTRA,
      status: FootballMatchStatus.INPLAY_SECOND_HALF,
      injuryTime: null,
    },
  },
  {
    clock: {
      minute: 104,
      second: 10,
    },
    period: FootballMatchPeriod.EXTRA,
    periodStatus: FootballMatchStatus.HALF,
    type: "PeriodIncident",
    details: {
      periodType: PeriodIncidentType.PERIOD_TRANSITION,
      period: FootballMatchPeriod.EXTRA,
      status: FootballMatchStatus.HALF,
      injuryTime: null,
    },
  },
  {
    clock: {
      minute: 115,
      second: 19,
    },
    period: FootballMatchPeriod.EXTRA,
    periodStatus: FootballMatchStatus.INPLAY_FIRST_HALF,
    type: "CardIncident",
    details: {
      cardType: CardIncidentType.YELLOW_RED,
      side: FixtureTeamSide.HOME,
      player: {
        name: "Cristi B.",
      },
    },
  },
  {
    clock: {
      minute: 97,
      second: 19,
    },
    period: FootballMatchPeriod.EXTRA,
    periodStatus: FootballMatchStatus.INPLAY_FIRST_HALF,
    type: "CardIncident",
    details: {
      cardType: CardIncidentType.YELLOW,
      side: FixtureTeamSide.AWAY,
      player: {
        name: "Cristi B.",
      },
    },
  },
  {
    clock: {
      minute: 91,
      second: 0,
    },
    period: FootballMatchPeriod.EXTRA,
    periodStatus: FootballMatchStatus.INPLAY_FIRST_HALF,
    type: "PeriodIncident",
    details: {
      periodType: PeriodIncidentType.PERIOD_TRANSITION,
      period: FootballMatchPeriod.EXTRA,
      status: FootballMatchStatus.INPLAY_FIRST_HALF,
      injuryTime: null,
    },
  },
  {
    clock: {
      minute: 93,
      second: 20,
    },
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.FULL,
    type: "PeriodIncident",
    details: {
      periodType: PeriodIncidentType.PERIOD_TRANSITION,
      period: FootballMatchPeriod.REGULAR,
      status: FootballMatchStatus.FULL,
      injuryTime: null,
    },
  },
  {
    clock: {
      minute: 88,
      second: 12,
    },
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.INPLAY_SECOND_HALF,
    type: "PeriodIncident",
    details: {
      periodType: PeriodIncidentType.INJURY_TIME_UPDATE,
      period: FootballMatchPeriod.REGULAR,
      status: FootballMatchStatus.INPLAY_SECOND_HALF,
      injuryTime: 4,
    },
  },
  {
    clock: {
      minute: 72,
      second: 19,
    },
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.INPLAY_SECOND_HALF,
    type: "GoalIncident",
    details: {
      goalType: GoalIncidentType.PENALTY,
      side: FixtureTeamSide.HOME,
      goalScorer: {
        name: "Catalin C.",
      },
    },
  },
  {
    clock: {
      minute: 70,
      second: 19,
    },
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.INPLAY_SECOND_HALF,
    type: "PenaltyIncident",
    details: {
      side: FixtureTeamSide.HOME,
      penaltyType: "AWARDED",
    },
  },
  {
    clock: {
      minute: 66,
      second: 19,
    },
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.INPLAY_SECOND_HALF,
    type: "SubstitutionIncident",
    details: {
      side: FixtureTeamSide.HOME,
      playerIn: {
        name: "Ioana D.",
      },
      playerOut: {
        name: "Andi A.",
      },
    },
  },
  {
    clock: {
      minute: 52,
      second: 19,
    },
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.INPLAY_SECOND_HALF,
    type: "GoalIncident",
    details: {
      goalType: GoalIncidentType.NORMAL,
      side: FixtureTeamSide.AWAY,
      goalScorer: {
        name: "Catalin C.",
      },
      assist: {
        name: "Cristiano B.",
      },
    },
  },
  {
    clock: {
      minute: 52,
      second: 10,
    },
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.INPLAY_SECOND_HALF,
    type: "AttackIncident",
    details: {
      attackType: AttackIncidentType.DANGEROUS_ATTACK,
      side: FixtureTeamSide.AWAY,
    },
  },
  {
    clock: {
      minute: 49,
      second: 19,
    },
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.INPLAY_SECOND_HALF,
    type: "CardIncident",
    details: {
      cardType: CardIncidentType.YELLOW,
      side: FixtureTeamSide.AWAY,
      player: {
        name: "Cristi B.",
      },
    },
  },
  {
    clock: {
      minute: 45,
      second: 0,
    },
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.INPLAY_SECOND_HALF,
    type: "PeriodIncident",
    details: {
      periodType: PeriodIncidentType.PERIOD_TRANSITION,
      period: FootballMatchPeriod.REGULAR,
      status: FootballMatchStatus.INPLAY_SECOND_HALF,
      injuryTime: null,
    },
  },
  {
    clock: {
      minute: 47,
      second: 10,
    },
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.HALF,
    type: "PeriodIncident",
    details: {
      periodType: PeriodIncidentType.PERIOD_TRANSITION,
      period: FootballMatchPeriod.REGULAR,
      status: FootballMatchStatus.HALF,
      injuryTime: null,
    },
  },
  {
    clock: {
      minute: 44,
      second: 51,
    },
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.INPLAY_FIRST_HALF,
    type: "PeriodIncident",
    details: {
      periodType: PeriodIncidentType.INJURY_TIME_UPDATE,
      period: FootballMatchPeriod.REGULAR,
      status: FootballMatchStatus.INPLAY_FIRST_HALF,
      injuryTime: 2,
    },
  },
  {
    clock: {
      minute: 36,
      second: 19,
    },
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.INPLAY_FIRST_HALF,
    type: "ShotIncident",
    details: {
      shotType: ShotIncidentType.SAVED,
      side: FixtureTeamSide.AWAY,
      player: {
        name: "Laura P.",
      },
    },
  },
  {
    clock: {
      minute: 32,
      second: 19,
    },
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.INPLAY_FIRST_HALF,
    type: "ShotIncident",
    details: {
      shotType: ShotIncidentType.OFF_TARGET,
      side: FixtureTeamSide.HOME,
      player: {
        name: "Alexandru P.",
      },
    },
  },
  {
    clock: {
      minute: 29,
      second: 19,
    },
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.INPLAY_FIRST_HALF,
    type: "GoalIncident",
    details: {
      goalType: GoalIncidentType.OWN,
      side: FixtureTeamSide.HOME,
      goalScorer: {
        name: "Babone M.",
      },
      assist: null,
    },
  },
  {
    clock: {
      minute: 29,
      second: 10,
    },
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.INPLAY_FIRST_HALF,
    type: "FoulIncident",
    details: {
      foulType: FoulIncidentType.FOUL,
      side: FixtureTeamSide.HOME,
      player: {
        name: "Babone M.",
      },
    },
  },
  {
    clock: {
      minute: 26,
      second: 10,
    },
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.INPLAY_FIRST_HALF,
    type: "FoulIncident",
    details: {
      foulType: FoulIncidentType.OFFSIDE,
      side: FixtureTeamSide.AWAY,
      player: {
        name: "Bogdan I.",
      },
    },
  },
  {
    clock: {
      minute: 10,
      second: 0,
    },
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.INPLAY_FIRST_HALF,
    type: "GoalIncident",
    details: {
      goalType: GoalIncidentType.CANCELLED,
      side: FixtureTeamSide.HOME,
      goalScorer: {
        name: "Babone M.",
      },
      assist: null,
    },
  },
  {
    clock: {
      minute: 8,
      second: 19,
    },
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.INPLAY_FIRST_HALF,
    type: "CardIncident",
    details: {
      cardType: CardIncidentType.RED,
      side: FixtureTeamSide.HOME,
      player: {
        name: "Tot Dl Babone",
      },
    },
  },
  {
    clock: {
      minute: 8,
      second: 10,
    },
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.INPLAY_FIRST_HALF,
    type: "FoulIncident",
    details: {
      foulType: FoulIncidentType.FOUL,
      side: FixtureTeamSide.HOME,
      player: {
        name: "Tot Dl Babone",
      },
    },
  },
  {
    clock: {
      minute: 1,
      second: 50,
    },
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.INPLAY_FIRST_HALF,
    type: "SetPieceIncident",
    details: {
      side: FixtureTeamSide.AWAY,
      setPieceType: SetPieceIncidentType.FREE_KICK,
    },
  },
  {
    clock: {
      minute: 1,
      second: 50,
    },
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.INPLAY_FIRST_HALF,
    type: "SetPieceIncident",
    details: {
      side: FixtureTeamSide.AWAY,
      setPieceType: SetPieceIncidentType.CORNER,
    },
  },
  {
    clock: {
      minute: 1,
      second: 34,
    },
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.INPLAY_FIRST_HALF,
    type: "SetPieceIncident",
    details: {
      side: FixtureTeamSide.HOME,
      setPieceType: SetPieceIncidentType.THROW_IN,
    },
  },
  {
    clock: {
      minute: 0,
      second: 0,
    },
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.INPLAY_FIRST_HALF,
    type: "PeriodIncident",
    details: {
      periodType: PeriodIncidentType.PERIOD_TRANSITION,
      period: FootballMatchPeriod.REGULAR,
      status: FootballMatchStatus.INPLAY_FIRST_HALF,
      injuryTime: null,
    },
  },
];

export const MOCKED_INCIDENTS_FIRST_HALF = [
  {
    clock: {
      minute: 45,
      second: 0,
    },
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.HALF,
    type: "PeriodIncident",
    details: {
      periodType: PeriodIncidentType.PERIOD_TRANSITION,
      period: FootballMatchPeriod.REGULAR,
      status: FootballMatchStatus.HALF,
      injuryTime: null,
    },
  },
  {
    clock: {
      minute: 44,
      second: 51,
    },
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.INPLAY_FIRST_HALF,
    type: "PeriodIncident",
    details: {
      periodType: PeriodIncidentType.INJURY_TIME_UPDATE,
      period: FootballMatchPeriod.REGULAR,
      status: FootballMatchStatus.INPLAY_FIRST_HALF,
      injuryTime: 2,
    },
  },
  {
    clock: {
      minute: 36,
      second: 19,
    },
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.INPLAY_FIRST_HALF,
    type: "ShotIncident",
    details: {
      shotType: ShotIncidentType.SAVED,
      side: FixtureTeamSide.AWAY,
      player: {
        name: "Laura P.",
      },
    },
  },
  {
    clock: {
      minute: 32,
      second: 19,
    },
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.INPLAY_FIRST_HALF,
    type: "ShotIncident",
    details: {
      shotType: ShotIncidentType.OFF_TARGET,
      side: FixtureTeamSide.HOME,
      player: {
        name: "Alexandru P.",
      },
    },
  },
  {
    clock: {
      minute: 29,
      second: 19,
    },
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.INPLAY_FIRST_HALF,
    type: "GoalIncident",
    details: {
      goalType: GoalIncidentType.OWN,
      side: FixtureTeamSide.HOME,
      goalScorer: {
        name: "Babone M.",
      },
      assist: null,
    },
  },
  {
    clock: {
      minute: 29,
      second: 10,
    },
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.INPLAY_FIRST_HALF,
    type: "FoulIncident",
    details: {
      foulType: FoulIncidentType.FOUL,
      side: FixtureTeamSide.HOME,
      player: {
        name: "Babone M.",
      },
    },
  },
  {
    clock: {
      minute: 26,
      second: 10,
    },
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.INPLAY_FIRST_HALF,
    type: "FoulIncident",
    details: {
      foulType: FoulIncidentType.OFFSIDE,
      side: FixtureTeamSide.AWAY,
      player: {
        name: "Bogdan I.",
      },
    },
  },
  {
    clock: {
      minute: 10,
      second: 0,
    },
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.INPLAY_FIRST_HALF,
    type: "GoalIncident",
    details: {
      goalType: GoalIncidentType.CANCELLED,
      side: FixtureTeamSide.HOME,
      goalScorer: {
        name: "Babone M.",
      },
      assist: null,
    },
  },
  {
    clock: {
      minute: 8,
      second: 19,
    },
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.INPLAY_FIRST_HALF,
    type: "CardIncident",
    details: {
      cardType: CardIncidentType.RED,
      side: FixtureTeamSide.HOME,
      player: {
        name: "Tot Dl Babone",
      },
    },
  },
  {
    clock: {
      minute: 8,
      second: 10,
    },
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.INPLAY_FIRST_HALF,
    type: "FoulIncident",
    details: {
      foulType: FoulIncidentType.FOUL,
      side: FixtureTeamSide.HOME,
      player: {
        name: "Tot Dl Babone",
      },
    },
  },
  {
    clock: {
      minute: 1,
      second: 50,
    },
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.INPLAY_FIRST_HALF,
    type: "SetPieceIncident",
    details: {
      side: FixtureTeamSide.AWAY,
      setPieceType: SetPieceIncidentType.FREE_KICK,
    },
  },
  {
    clock: {
      minute: 1,
      second: 50,
    },
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.INPLAY_FIRST_HALF,
    type: "SetPieceIncident",
    details: {
      side: FixtureTeamSide.AWAY,
      setPieceType: SetPieceIncidentType.CORNER,
    },
  },
  {
    clock: {
      minute: 1,
      second: 34,
    },
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.INPLAY_FIRST_HALF,
    type: "SetPieceIncident",
    details: {
      side: FixtureTeamSide.HOME,
      setPieceType: SetPieceIncidentType.THROW_IN,
    },
  },
  {
    clock: {
      minute: 0,
      second: 0,
    },
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.INPLAY_FIRST_HALF,
    type: "PeriodIncident",
    details: {
      periodType: PeriodIncidentType.PERIOD_TRANSITION,
      period: FootballMatchPeriod.REGULAR,
      status: FootballMatchStatus.INPLAY_FIRST_HALF,
      injuryTime: null,
    },
  },
];
export const MOCKED_INCIDENTS_3 = [
  {
    clock: {
      minute: 1,
      second: 50,
    },
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.INPLAY_FIRST_HALF,
    type: "SetPieceIncident",
    details: {
      side: FixtureTeamSide.AWAY,
      setPieceType: SetPieceIncidentType.FREE_KICK,
    },
  },
  {
    clock: {
      minute: 1,
      second: 50,
    },
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.INPLAY_FIRST_HALF,
    type: "SetPieceIncident",
    details: {
      side: FixtureTeamSide.AWAY,
      setPieceType: SetPieceIncidentType.CORNER,
    },
  },
  {
    clock: {
      minute: 1,
      second: 34,
    },
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.INPLAY_FIRST_HALF,
    type: "SetPieceIncident",
    details: {
      side: FixtureTeamSide.HOME,
      setPieceType: SetPieceIncidentType.THROW_IN,
    },
  },
  {
    clock: {
      minute: 0,
      second: 0,
    },
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.INPLAY_FIRST_HALF,
    type: "PeriodIncident",
    details: {
      periodType: PeriodIncidentType.PERIOD_TRANSITION,
      period: FootballMatchPeriod.REGULAR,
      status: FootballMatchStatus.INPLAY_FIRST_HALF,
      injuryTime: null,
    },
  },
];

export const TEST_INCIDENTS_SMALL = [
  {
    period: "REGULAR",
    periodStatus: "INPLAY_FIRST_HALF",
    clock: {
      minute: 12,
      second: 53,
    },
    type: "CardIncident",
    details: {
      __typename: "CardIncident",
      cardType: "YELLOW",
      side: "AWAY",
      player: {
        id: 2,
        name: "John D.",
        position: "DEFENDER",
        shirtNumber: 8,
        startingType: "LINEUP",
      },
    },
  },
  {
    period: "REGULAR",
    periodStatus: "INPLAY_SECOND_HALF",
    clock: {
      minute: 89,
      second: 53,
    },
    clockExtraMinutes: "90 +4",
    type: "CardIncident",
    details: {
      __typename: "CardIncident",
      cardType: "RED",
      side: "HOME",
      player: {
        id: 2,
        name: "Roger D.",
        position: "DEFENDER",
        shirtNumber: 8,
        startingType: "LINEUP",
      },
    },
  },
  {
    period: "REGULAR",
    periodStatus: "INPLAY_FIRST_HALF",
    clock: {
      minute: 26,
      second: 0,
    },
    type: "GoalIncident",
    details: {
      __typename: "GoalIncident",
      goalType: "OWN",
      side: "AWAY",
      goalScorer: {
        id: 2,
        name: "Cristiano R.",
      },
    },
  },
  {
    period: "REGULAR",
    periodStatus: "INPLAY_FIRST_HALF",
    clock: {
      minute: 21,
      second: 53,
    },
    type: "CardIncident",
    details: {
      __typename: "CardIncident",
      cardType: "YELLOW_RED",
      side: "HOME",
      player: {
        id: 2,
        name: "Roger D.",
        position: "DEFENDER",
        shirtNumber: 8,
        startingType: "LINEUP",
      },
    },
  },
  {
    period: "REGULAR",
    periodStatus: "INPLAY_FIRST_HALF",
    clock: {
      minute: 26,
      second: 0,
    },
    clockExtraMinutes: "45 +3",
    type: "GoalIncident",
    details: {
      __typename: "GoalIncident",
      goalType: "PENALTY",
      side: "AWAY",
      goalScorer: {
        id: 2,
        name: "Cristiano R.",
      },
    },
  },
];

export const TEST_GOAL_INCIDENT = {
  period: "REGULAR",
  periodStatus: "INPLAY_FIRST_HALF",
  clock: {
    minute: 26,
    second: 0,
  },
  type: "GoalIncident",
  details: {
    __typename: "GoalIncident",
    goalType: "NORMAL",
    side: "AWAY",
    goalScorer: {
      id: 2,
      name: "Cristiano R.",
    },
  },
};

export const TEST_GOAL_INCIDENT_WITH_ASSIST = {
  period: "REGULAR",
  periodStatus: "INPLAY_FIRST_HALF",
  clock: {
    minute: 26,
    second: 0,
  },
  type: "GoalIncident",
  details: {
    __typename: "GoalIncident",
    goalType: "NORMAL",
    side: "AWAY",
    goalScorer: {
      id: 2,
      name: "Cristiano R.",
    },
    assist: {
      id: 3,
      name: "Marcelo D.",
    },
  },
};

export const TEST_GOAL_INCIDENT_WITHOUT_SCORER = {
  period: "REGULAR",
  periodStatus: "INPLAY_FIRST_HALF",
  clock: {
    minute: 26,
    second: 0,
  },
  type: "GoalIncident",
  details: {
    __typename: "GoalIncident",
    goalType: "NORMAL",
    side: "AWAY",
  },
};

export const TEST_OWN_GOAL_INCIDENT = {
  period: "REGULAR",
  periodStatus: "INPLAY_FIRST_HALF",
  clock: {
    minute: 26,
    second: 0,
  },
  type: "GoalIncident",
  details: {
    __typename: "GoalIncident",
    goalType: "OWN",
    side: "AWAY",
    goalScorer: {
      id: 2,
      name: "Cristiano R.",
    },
  },
};

export const TEST_RED_CARD_INCIDENT = {
  period: "REGULAR",
  periodStatus: "INPLAY_SECOND_HALF",
  clock: {
    minute: 54,
    second: 53,
  },
  type: "CardIncident",
  details: {
    __typename: "CardIncident",
    cardType: "RED",
    side: "HOME",
    player: {
      id: 2,
      name: "Roger D.",
    },
  },
};

export const TEST_YELLOW_CARD_INCIDENT = {
  period: "REGULAR",
  periodStatus: "INPLAY_SECOND_HALF",
  clock: {
    minute: 54,
    second: 53,
  },
  type: "CardIncident",
  details: {
    __typename: "CardIncident",
    cardType: "YELLOW",
    side: "HOME",
    player: {
      id: 2,
      name: "Roger D.",
    },
  },
};

export const TEST_SECOND_YELLOW_CARD_INCIDENT = {
  period: "REGULAR",
  periodStatus: "INPLAY_SECOND_HALF",
  clock: {
    minute: 54,
    second: 53,
  },
  type: "CardIncident",
  details: {
    __typename: "CardIncident",
    cardType: "YELLOW_RED",
    side: "HOME",
    player: {
      id: 2,
      name: "Roger D.",
    },
  },
};

export const TEST_CORNER_INCIDENT = {
  period: "REGULAR",
  periodStatus: "INPLAY_FIRST_HALF",
  clock: {
    minute: 10,
    second: 0,
  },
  type: "SetPieceIncident",
  details: {
    __typename: "SetPieceIncident",
    setPieceType: "CORNER",
    side: "HOME",
  },
};

export const TEST_THROW_IN_INCIDENT = {
  period: "REGULAR",
  periodStatus: "INPLAY_FIRST_HALF",
  clock: {
    minute: 10,
    second: 0,
  },
  type: "SetPieceIncident",
  details: {
    __typename: "SetPieceIncident",
    setPieceType: "THROW_IN",
    side: "HOME",
  },
};

export const TEST_GOAL_KICK_INCIDENT = {
  period: "REGULAR",
  periodStatus: "INPLAY_FIRST_HALF",
  clock: {
    minute: 10,
    second: 0,
  },
  type: "SetPieceIncident",
  details: {
    __typename: "SetPieceIncident",
    setPieceType: "GOAL_KICK",
    side: "HOME",
  },
};

export const TEST_FREE_KICK_INCIDENT = {
  period: "REGULAR",
  periodStatus: "INPLAY_FIRST_HALF",
  clock: {
    minute: 10,
    second: 0,
  },
  type: "SetPieceIncident",
  details: {
    __typename: "SetPieceIncident",
    setPieceType: "FREE_KICK",
    side: "HOME",
  },
};

export const TEST_FOUL_INCIDENT = {
  period: "REGULAR",
  periodStatus: "INPLAY_FIRST_HALF",
  clock: {
    minute: 10,
    second: 0,
  },
  type: "FoulIncident",
  details: {
    __typename: "FoulIncident",
    foulType: "FOUL",
    side: "HOME",
  },
};

export const TEST_FOUL_INCIDENT_WITH_PLAYER = {
  period: "REGULAR",
  periodStatus: "INPLAY_FIRST_HALF",
  clock: {
    minute: 10,
    second: 0,
  },
  type: "FoulIncident",
  details: {
    __typename: "FoulIncident",
    foulType: "FOUL",
    player: {
      name: "Stanescu H.",
    },
    side: "HOME",
  },
};

export const TEST_OFFSIDE_INCIDENT = {
  period: "REGULAR",
  periodStatus: "INPLAY_FIRST_HALF",
  clock: {
    minute: 10,
    second: 0,
  },
  type: "FoulIncident",
  details: {
    __typename: "FoulIncident",
    foulType: "OFFSIDE",
    side: "HOME",
  },
};

export const TEST_ATTACK_INCIDENT = {
  period: "REGULAR",
  periodStatus: "INPLAY_FIRST_HALF",
  clock: {
    minute: 10,
    second: 0,
  },
  type: "AttackIncident",
  details: {
    __typename: "AttackIncident",
    side: "HOME",
  },
};

export const TEST_SHOT_OFF_TARGET_INCIDENT = {
  period: "REGULAR",
  periodStatus: "INPLAY_FIRST_HALF",
  clock: {
    minute: 10,
    second: 0,
  },
  type: "ShotIncident",
  details: {
    __typename: "ShotIncident",
    shotType: "OFF_TARGET",
    side: "HOME",
  },
};

export const TEST_SHOT_OFF_TARGET_INCIDENT_WITH_PLAYER = {
  period: "REGULAR",
  periodStatus: "INPLAY_FIRST_HALF",
  clock: {
    minute: 10,
    second: 0,
  },
  type: "ShotIncident",
  details: {
    __typename: "ShotIncident",
    shotType: "OFF_TARGET",
    player: {
      name: "Hagi G.",
    },
    side: "HOME",
  },
};

export const TEST_SHOT_ON_TARGET_INCIDENT = {
  period: "REGULAR",
  periodStatus: "INPLAY_FIRST_HALF",
  clock: {
    minute: 10,
    second: 0,
  },
  type: "ShotIncident",
  details: {
    __typename: "ShotIncident",
    shotType: "SAVED",
    side: "HOME",
  },
};

export const TEST_SHOT_BLOCKED_INCIDENT = {
  period: "REGULAR",
  periodStatus: "INPLAY_FIRST_HALF",
  clock: {
    minute: 10,
    second: 0,
  },
  type: "ShotIncident",
  details: {
    __typename: "ShotIncident",
    shotType: "OFF_TARGET_BLOCKED",
    side: "HOME",
  },
};

export const TEST_SHOT_SAVED_BLOCKED_INCIDENT = {
  period: "REGULAR",
  periodStatus: "INPLAY_FIRST_HALF",
  clock: {
    minute: 10,
    second: 0,
  },
  type: "ShotIncident",
  details: {
    __typename: "ShotIncident",
    shotType: "SAVED_BLOCKED",
    side: "HOME",
  },
};

export const TEST_SUBSTITUTION_INCIDENT = {
  period: "REGULAR",
  periodStatus: "INPLAY_FIRST_HALF",
  clock: {
    minute: 10,
    second: 0,
  },
  type: "SubstitutionIncident",
  details: {
    __typename: "SubstitutionIncident",
    playerIn: {
      name: "Player In",
    },
    playerOut: {
      name: "Player Out",
    },
    side: "HOME",
  },
};

export const TEST_PERIOD_INCIDENT_REGULAR_INPLAY_FIRST_HALF = {
  period: "REGULAR",
  periodStatus: "INPLAY_FIRST_HALF",
  clock: {
    minute: 0,
    second: 0,
  },
  type: "PeriodIncident",
  details: {
    __typename: "PeriodIncident",
    periodType: "PERIOD_TRANSITION",
    period: "REGULAR",
    status: "INPLAY_FIRST_HALF",
    injuryTime: null,
  },
};

export const TEST_PERIOD_INCIDENT_REGULAR_INPLAY_SECOND_HALF = {
  period: "REGULAR",
  periodStatus: "INPLAY_SECOND_HALF",
  clock: {
    minute: 45,
    second: 0,
  },
  type: "PeriodIncident",
  details: {
    __typename: "PeriodIncident",
    periodType: "PERIOD_TRANSITION",
    period: "REGULAR",
    status: "INPLAY_SECOND_HALF",
    injuryTime: null,
  },
};

export const TEST_PERIOD_INCIDENT_REGULAR_HALF = {
  period: "REGULAR",
  periodStatus: "HALF",
  clock: {
    minute: 45,
    second: 0,
  },
  type: "PeriodIncident",
  details: {
    __typename: "PeriodIncident",
    periodType: "PERIOD_TRANSITION",
    period: "REGULAR",
    status: "HALF",
    injuryTime: null,
  },
};

export const TEST_PERIOD_INCIDENT_EXTRA_INPLAY_FIRST_HALF = {
  period: "EXTRA",
  periodStatus: "INPLAY_FIRST_HALF",
  clock: {
    minute: 90,
    second: 0,
  },
  type: "PeriodIncident",
  details: {
    __typename: "PeriodIncident",
    periodType: "PERIOD_TRANSITION",
    period: "EXTRA",
    status: "INPLAY_FIRST_HALF",
    injuryTime: null,
  },
};

export const TEST_PERIOD_INCIDENT_EXTRA_HALF = {
  period: "EXTRA",
  periodStatus: "HALF",
  clock: {
    minute: 45,
    second: 0,
  },
  type: "PeriodIncident",
  details: {
    __typename: "PeriodIncident",
    periodType: "PERIOD_TRANSITION",
    period: "EXTRA",
    status: "HALF",
    injuryTime: null,
  },
};

export const TEST_PERIOD_INCIDENT_EXTRA_INPLAY_SECOND_HALF = {
  period: "EXTRA",
  periodStatus: "INPLAY_SECOND_HALF",
  clock: {
    minute: 105,
    second: 0,
  },
  type: "PeriodIncident",
  details: {
    __typename: "PeriodIncident",
    periodType: "PERIOD_TRANSITION",
    period: "EXTRA",
    status: "INPLAY_SECOND_HALF",
    injuryTime: null,
  },
};

export const TEST_PERIOD_INCIDENT_REGULAR_FULL = {
  period: "REGULAR",
  periodStatus: "FULL",
  clock: {
    minute: 90,
    second: 0,
  },
  type: "PeriodIncident",
  details: {
    __typename: "PeriodIncident",
    periodType: "PERIOD_TRANSITION",
    period: "REGULAR",
    status: "FULL",
    injuryTime: null,
  },
};

export const TEST_PERIOD_INCIDENT_EXTRA_FULL = {
  period: "EXTRA",
  periodStatus: "FULL",
  clock: {
    minute: 120,
    second: 0,
  },
  type: "PeriodIncident",
  details: {
    __typename: "PeriodIncident",
    periodType: "PERIOD_TRANSITION",
    period: "EXTRA",
    status: "FULL",
    injuryTime: null,
  },
};

export const TEST_PERIOD_INCIDENT_END = {
  period: "REGULAR",
  periodStatus: "FULL",
  clock: {
    minute: 90,
    second: 0,
  },
  type: "PeriodIncident",
  details: {
    __typename: "PeriodIncident",
    periodType: "PERIOD_TRANSITION",
    period: "REGULAR",
    status: "FULL",
    injuryTime: null,
  },
};

export const TEST_PERIOD_INCIDENT_INJURY_TIME = {
  period: "REGULAR",
  periodStatus: "INPLAY_FIRST_HALF",
  clock: {
    minute: 44,
    second: 0,
  },
  type: "PeriodIncident",
  details: {
    __typename: "PeriodIncident",
    periodType: "INJURY_TIME_UPDATED",
    period: "REGULAR",
    status: "INPLAY_FIRST_HALF",
    injuryTime: 3,
  },
};

export const MATCH_STATS = [
  {
    period: null,
    periodStatus: FootballMatchStatus.FULL,
    home: {
      possession: null,
      corners: 5,
      yellowCards: 0,
      redCards: 0,
      offsides: 0,
      fouls: 0,
      throwIns: 21,
      freeKicks: 20,
      goalKicks: 0,
      blockedShots: 0,
      dangerousAttacks: 0,
      shotsOnTarget: 1,
      shotsOffTarget: 0,
      goals: 4,
    },
    away: {
      possession: null,
      corners: 2,
      yellowCards: 0,
      redCards: 0,
      offsides: 0,
      fouls: 0,
      throwIns: 15,
      freeKicks: 12,
      goalKicks: 0,
      blockedShots: 0,
      dangerousAttacks: 0,
      shotsOnTarget: 4,
      shotsOffTarget: 0,
      goals: 3,
    },
  },
  {
    period: FootballMatchPeriod.EXTRA,
    periodStatus: FootballMatchStatus.INPLAY_FIRST_HALF,
    home: {
      possession: null,
      corners: 5,
      yellowCards: 0,
      redCards: 0,
      offsides: 0,
      fouls: 0,
      throwIns: 21,
      freeKicks: 20,
      goalKicks: 0,
      blockedShots: 0,
      dangerousAttacks: 0,
      shotsOnTarget: 1,
      shotsOffTarget: 0,
      goals: 3,
    },
    away: {
      possession: null,
      corners: 2,
      yellowCards: 0,
      redCards: 0,
      offsides: 0,
      fouls: 0,
      throwIns: 15,
      freeKicks: 12,
      goalKicks: 0,
      blockedShots: 0,
      dangerousAttacks: 0,
      shotsOnTarget: 4,
      shotsOffTarget: 0,
      goals: 3,
    },
  },
  {
    period: FootballMatchPeriod.EXTRA,
    periodStatus: FootballMatchStatus.INPLAY_SECOND_HALF,
    home: {
      possession: null,
      corners: 5,
      yellowCards: 0,
      redCards: 0,
      offsides: 0,
      fouls: 0,
      throwIns: 21,
      freeKicks: 20,
      goalKicks: 0,
      blockedShots: 0,
      dangerousAttacks: 0,
      shotsOnTarget: 1,
      shotsOffTarget: 0,
      goals: 4,
    },
    away: {
      possession: null,
      corners: 2,
      yellowCards: 0,
      redCards: 0,
      offsides: 0,
      fouls: 0,
      throwIns: 15,
      freeKicks: 12,
      goalKicks: 0,
      blockedShots: 0,
      dangerousAttacks: 0,
      shotsOnTarget: 4,
      shotsOffTarget: 0,
      goals: 3,
    },
  },
  {
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.INPLAY_FIRST_HALF,
    home: {
      possession: 39,
      corners: 5,
      yellowCards: 0,
      redCards: 0,
      offsides: 0,
      fouls: 0,
      throwIns: 21,
      freeKicks: 20,
      goalKicks: 0,
      blockedShots: 0,
      dangerousAttacks: 2,
      shotsOnTarget: 1,
      shotsOffTarget: 5,
      goals: 1,
    },
    away: {
      possession: 61,
      corners: 2,
      yellowCards: 0,
      redCards: 0,
      offsides: 0,
      fouls: 0,
      throwIns: 15,
      freeKicks: 12,
      goalKicks: 0,
      blockedShots: 0,
      dangerousAttacks: 4,
      shotsOnTarget: 4,
      shotsOffTarget: 7,
      goals: 0,
    },
  },
  {
    period: FootballMatchPeriod.REGULAR,
    periodStatus: FootballMatchStatus.INPLAY_SECOND_HALF,
    home: {
      possession: null,
      corners: 5,
      yellowCards: 0,
      redCards: 0,
      offsides: 0,
      fouls: 0,
      throwIns: 21,
      freeKicks: 20,
      goalKicks: 0,
      blockedShots: 0,
      dangerousAttacks: 0,
      shotsOnTarget: 1,
      shotsOffTarget: 0,
      goals: 3,
    },
    away: {
      possession: null,
      corners: 2,
      yellowCards: 0,
      redCards: 0,
      offsides: 0,
      fouls: 0,
      throwIns: 15,
      freeKicks: 12,
      goalKicks: 0,
      blockedShots: 0,
      dangerousAttacks: 0,
      shotsOnTarget: 4,
      shotsOffTarget: 0,
      goals: 3,
    },
  },
];

export const TEST_MATCH_STATS = [
  {
    period: null,
    periodStatus: "FULL",
    home: {
      possession: null,
      dangerousAttacks: 0,
      shotsOnTarget: 1,
      shotsOffTarget: 0,
    },
    away: {
      possession: null,
      dangerousAttacks: 0,
      shotsOnTarget: 4,
      shotsOffTarget: 0,
    },
  },
  {
    period: "EXTRA",
    periodStatus: "INPLAY_FIRST_HALF",
    home: {
      possession: null,
      dangerousAttacks: 0,
      shotsOnTarget: 1,
      shotsOffTarget: 0,
    },
    away: {
      possession: null,
      dangerousAttacks: 0,
      shotsOnTarget: 4,
      shotsOffTarget: 0,
    },
  },
  {
    period: "EXTRA",
    periodStatus: "INPLAY_SECOND_HALF",
    home: {
      possession: null,
      dangerousAttacks: 0,
      shotsOnTarget: 1,
      shotsOffTarget: 0,
    },
    away: {
      possession: null,
      dangerousAttacks: 0,
      shotsOnTarget: 4,
      shotsOffTarget: 0,
    },
  },
  {
    period: "REGULAR",
    periodStatus: "INPLAY_FIRST_HALF",
    home: {
      possession: 39,
      dangerousAttacks: 2,
      shotsOnTarget: 1,
      shotsOffTarget: 5,
    },
    away: {
      possession: 61,
      dangerousAttacks: 4,
      shotsOnTarget: 4,
      shotsOffTarget: 7,
    },
  },
  {
    period: "REGULAR",
    periodStatus: "INPLAY_SECOND_HALF",
    home: {
      possession: null,
      dangerousAttacks: 0,
      shotsOnTarget: 1,
      shotsOffTarget: 0,
    },
    away: {
      possession: null,
      dangerousAttacks: 0,
      shotsOnTarget: 4,
      shotsOffTarget: 0,
    },
  },
];

export const TEST_MATCH_STATS_GOALS = [
  {
    period: null,
    periodStatus: "FULL",
    home: {
      possession: null,
      dangerousAttacks: 0,
      shotsOnTarget: 1,
      shotsOffTarget: 0,
      goals: 3,
    },
    away: {
      possession: null,
      dangerousAttacks: 0,
      shotsOnTarget: 4,
      shotsOffTarget: 0,
      goals: 2,
    },
  },
  {
    period: "EXTRA",
    periodStatus: "INPLAY_FIRST_HALF",
    home: {
      possession: null,
      dangerousAttacks: 0,
      shotsOnTarget: 1,
      shotsOffTarget: 0,
      goals: 1,
    },
    away: {
      possession: null,
      dangerousAttacks: 0,
      shotsOnTarget: 4,
      shotsOffTarget: 0,
      goals: 1,
    },
  },
  {
    period: "EXTRA",
    periodStatus: "INPLAY_SECOND_HALF",
    home: {
      possession: null,
      dangerousAttacks: 0,
      shotsOnTarget: 1,
      shotsOffTarget: 0,
      goals: 1,
    },
    away: {
      possession: null,
      dangerousAttacks: 0,
      shotsOnTarget: 4,
      shotsOffTarget: 0,
      goals: 0,
    },
  },
  {
    period: "REGULAR",
    periodStatus: "INPLAY_FIRST_HALF",
    home: {
      possession: 39,
      dangerousAttacks: 2,
      shotsOnTarget: 1,
      shotsOffTarget: 5,
      goals: 0,
    },
    away: {
      possession: 61,
      dangerousAttacks: 4,
      shotsOnTarget: 4,
      shotsOffTarget: 7,
      goals: 1,
    },
  },
  {
    period: "REGULAR",
    periodStatus: "INPLAY_SECOND_HALF",
    home: {
      possession: null,
      dangerousAttacks: 0,
      shotsOnTarget: 1,
      shotsOffTarget: 0,
      goals: 1,
    },
    away: {
      possession: null,
      dangerousAttacks: 0,
      shotsOnTarget: 4,
      shotsOffTarget: 0,
      goals: 0,
    },
  },
];
