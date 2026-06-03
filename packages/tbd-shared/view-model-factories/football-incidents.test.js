import { IncidentIconType } from "@ppb/the-wall-common/types";
import { getPropsForTeamLineups, getIconTypeForIncident } from "./football-incidents";

jest.mock("../helpers/i18n", () => ({
  i18n: ({ key }) => key,
}));

global.Date.now = jest.fn(() => new Date("2019-12-23T12:15:00Z"));

const i18n = {
  substitutes: "I18N.TEAM_LINEUP.SUBSTITUTES",
  coaches: "I18N.TEAM_LINEUP.COACHES",
  goal: "I18N.FOOTBALL_INCIDENT.GOAL",
  ownGoal: "I18N.FOOTBALL_INCIDENT.OWN_GOAL",
  yellow: "I18N.FOOTBALL_INCIDENT.CARD_YELLOW",
  red: "I18N.FOOTBALL_INCIDENT.CARD_RED",
  secondYellow: "I18N.FOOTBALL_INCIDENT.CARD_SECOND_YELLOW",
  penaltyScored: "I18N.FOOTBALL_INCIDENT.PENALTY_SCORED",
  penaltyMissed: "I18N.FOOTBALL_INCIDENT.PENALTY_MISSED",
  subIn: "I18N.FOOTBALL_INCIDENT.SUBS_IN",
  subOut: "I18N.FOOTBALL_INCIDENT.SUBS_OUT",
};

const footballFixture = {
  urn: "ppb:footballfixture:29601422",
  scheduledAt: new Date("2020-01-11T15:15:00Z"),
  home: {
    name: "Crystal Palace",
    color: "#1B458F",
    crest: {
      vector: "http://sca.qa.internal/Assets/Team%20Logo/English%20Premier%20League/Crystal Palace.svg",
    },
    squad: {
      manager: "Crystal Manager",
      players: [
        {
          id: 1,
          name: "Player 1",
          startingType: "LINEUP",
          shirtNumber: "2",
          position: "DEFENDER",
        },
      ],
    },
  },
  away: {
    name: "Arsenal",
    color: "#DA291C",
    crest: {
      vector: "http://sca.qa.internal/Assets/Team%20Logo/English%20Premier%20League/Arsenal.svg",
    },
    squad: {
      manager: "Arsenal Manager",
      players: [
        {
          id: 2,
          name: "Player 2",
          startingType: "LINEUP",
          shirtNumber: "3",
          position: "DEFENDER",
        },
      ],
    },
  },
  duration: {
    period: "EXTRA",
    status: "PENALTY_SHOOTOUT",
    clock: {
      minute: 24,
      second: 48,
    },
    stoppageMinutes: 0,
  },
  score: {
    home: 2,
    away: 1,
  },
  penaltyShootout: {},
  incidents: [],
};

const homeLineup = {
  formation: "",
  manager: "Crystal Manager",
  startPlayers: [
    {
      incidents: [],
      name: "Player 1",
      shirtNumber: "2",
    },
  ],
  subsPlayers: [],
};

const awayLineup = {
  formation: "",
  manager: "Arsenal Manager",
  startPlayers: [
    {
      incidents: [],
      name: "Player 2",
      shirtNumber: "3",
    },
  ],
  subsPlayers: [],
};

describe("Football Incidents view model factory", () => {
  describe("getIconTypeForIncident", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should return the Icons.Own icon", () => {
      const goalIncident = {
        type: "GoalIncident",
        details: {
          goalType: "OWN",
        },
      };
      const result = getIconTypeForIncident(goalIncident);
      expect(result).toBe(IncidentIconType.OWN_GOAL);
    });

    it("should return the Icons.Goal icon", () => {
      const goalIncident = {
        type: "GoalIncident",
        details: {
          goalType: "NORMAL",
        },
      };
      const result = getIconTypeForIncident(goalIncident);
      expect(result).toBe(IncidentIconType.GOAL);
    });

    it("should return the Icons.PenaltyScored icon", () => {
      const penaltyIncident = {
        type: "PenaltyShootoutIncident",
        details: {
          penaltyShootoutType: "SCORED",
        },
      };
      const result = getIconTypeForIncident(penaltyIncident);
      expect(result).toBe(IncidentIconType.PENALTY_SCORED);
    });

    it("should return the Icons.PenaltyMissed icon", () => {
      const penaltyIncident = {
        type: "PenaltyShootoutIncident",
        details: {
          penaltyShootoutType: "MISSED",
        },
      };
      const result = getIconTypeForIncident(penaltyIncident);
      expect(result).toBe(IncidentIconType.PENALTY_MISSED);
    });

    it("should return the Icons.Yellow icon", () => {
      const cardIncident = {
        type: "CardIncident",
        details: {
          cardType: "YELLOW",
        },
      };
      const result = getIconTypeForIncident(cardIncident);
      expect(result).toBe(IncidentIconType.YELLOW_CARD);
    });

    it("should return the Icons.Red icon", () => {
      const cardIncident = {
        type: "CardIncident",
        details: {
          cardType: "RED",
        },
      };
      const result = getIconTypeForIncident(cardIncident);
      expect(result).toBe(IncidentIconType.RED_CARD);
    });

    it("should return the Icons.SecondYellow icon", () => {
      const cardIncident = {
        type: "CardIncident",
        details: {
          cardType: "YELLOW_RED",
        },
      };
      const result = getIconTypeForIncident(cardIncident);
      expect(result).toBe(IncidentIconType.SECOND_YELLOW_CARD);
    });

    it("should return the Icons.In icon", () => {
      const subIncident = {
        type: "SubstitutionIncident",
        details: {
          cardType: "YELLOW_RED",
        },
      };
      const result = getIconTypeForIncident(subIncident, true);
      expect(result).toBe(IncidentIconType.SUBSTITUTION_IN);
    });

    it("should return the Icons.Out icon", () => {
      const subIncident = {
        type: "SubstitutionIncident",
        details: {
          cardType: "YELLOW_RED",
        },
      };
      const result = getIconTypeForIncident(subIncident);
      expect(result).toBe(IncidentIconType.SUBSTITUTION_OUT);
    });

    it("should return null element", () => {
      const subIncident = {
        type: "Unknown type",
        details: {},
      };
      const result = getIconTypeForIncident(subIncident);
      expect(result).toBeNull();
    });
  });
});
