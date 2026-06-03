import { getCompetitionByURN } from "@ppb/tbd-store/state/entities/competitions/competition-selectors";
import { createTennisScoreboardByURNSelector } from "@ppb/tbd-store/state/entities/tennis-fixture/tennis-fixture-selectors";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { getOpponentsNames } from "@ppb/tbd-store/helpers/fixture";

import { i18n } from "../../helpers/i18n";
import { formatDateWithToday, formatTime } from "../../helpers/dates";

import { makeMapStateToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => () => ({
    localeCodeBcp47: "locale",
    timezone: "timezone",
  })),
}));

jest.mock("@ppb/tbd-store/state/entities/tennis-fixture/tennis-fixture-selectors", () => ({
  createTennisScoreboardByURNSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/competitions/competition-selectors", () => ({
  getCompetitionByURN: jest.fn(() => ({
    name: "competition",
  })),
}));
jest.mock("@ppb/tbd-store/state/entities/sport-events/sport-event-selectors", () => ({
  createSportEventByURNSelector: () =>
    jest.fn(() => ({
      name: "event name",
    })),
}));
jest.mock("@ppb/tbd-store/helpers/fixture", () => ({
  getOpponentsNames: jest.fn(),
}));

jest.mock("../../helpers/dates", () => ({
  formatDateWithToday: jest.fn(() => "date"),
  formatTime: jest.fn(() => "time"),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

const scheduledStartTime = new Date();

const SCORE_DATA = [
  {
    teamA: 1,
    teamB: 2,
    style: "GREY_BACKGROUND",
  },
  {
    teamA: 3,
    teamB: 4,
    style: "BORDER",
  },
  {
    teamA: 15,
    teamB: 30,
    style: "GREEN_BACKGROUND",
  },
];

const SCORE_MOCK = {
  currentMatch: {
    home: 1,
    away: 1,
  },
  currentSet: {
    home: 2,
    away: 0,
  },
  currentGame: {
    home: 40,
    away: 15,
  },
};

const TENNIS_SCOREBOARD = {
  scheduledStartTime,
  status: {
    status: "PRE_MATCH",
    reason: undefined,
  },
  surface: "surface",
  teamServing: "HOME",
  scoreData: SCORE_DATA,
  score: SCORE_MOCK,
  teamA: null,
  teamB: null,
  teamAScore: 1,
  teamBScore: 1,
  currentSet: {
    teamAScore: 2,
    teamBScore: 0,
    currentGame: {
      teamAScore: 40,
      teamBScore: 15,
      teamServing: "HOME",
    },
  },
};

const SCOREBOARD_PROPS = {
  event: "event name",
  teamA: {},
  teamB: {},
  teamServing: "HOME",
  scoreData: SCORE_DATA,
  score: SCORE_MOCK,
  date: "date",
  time: "time",
  dateTime: scheduledStartTime,
  status: "PRE_MATCH",
  surface: "surface",
  statusReason: undefined,
  competition: "competition",
  interrupted: false,
  labels: { inplay: "I18N.SPORT_EVENT.IN_PLAY" },
};

const APPLICATION_STATE = {
  entities: {
    sportevents: {},
    tennisfixtures: {},
    competitions: {},
  },
};

const CONTAINER_PROPS = {
  urn: "ppb:tennisfixture:2222222",
  competition: "ppb:competition:4444",
};

const getTennisScoreboard = jest.fn();

const setupMakeMapStateToProps = (state, props) => {
  createTennisScoreboardByURNSelector.mockReturnValue(getTennisScoreboard);
  getTennisScoreboard.mockReturnValue(TENNIS_SCOREBOARD);

  return makeMapStateToProps()(state, props);
};

describe("MapToPropsFactory - TennisFixture", () => {
  beforeEach(jest.clearAllMocks);

  it("should create a selector for tennis fixture", () => {
    makeMapStateToProps();

    expect(createTennisScoreboardByURNSelector).toHaveBeenCalledWith();
    expect(createTennisScoreboardByURNSelector).toHaveBeenCalledTimes(1);
  });

  it("should create a selector for user details", () => {
    makeMapStateToProps();

    expect(createGetCountryLocalCurrencyCodeSelector).toHaveBeenCalledWith();
    expect(createGetCountryLocalCurrencyCodeSelector).toHaveBeenCalledTimes(1);
  });

  describe("when tennis fixture exists on the store", () => {
    it("should return labels", () => {
      const props = setupMakeMapStateToProps(APPLICATION_STATE, CONTAINER_PROPS);

      expect(i18n).toHaveBeenCalledWith({ key: "I18N.SPORT_EVENT.IN_PLAY" });
      expect(i18n).toHaveBeenCalledTimes(1);
      expect(props.labels.inplay).toEqual("I18N.SPORT_EVENT.IN_PLAY");
    });

    describe("when scheduledStartTime is today", () => {
      it("should return props with today's string", () => {
        formatDateWithToday.mockReturnValueOnce("I18N.DATE.TODAY");

        const props = setupMakeMapStateToProps(APPLICATION_STATE, CONTAINER_PROPS);
        expect(props).toEqual({
          ...SCOREBOARD_PROPS,
          date: "I18N.DATE.TODAY",
        });
      });
    });

    describe("when scheduledStartTime is not today", () => {
      it("should return props with full date", () => {
        const props = setupMakeMapStateToProps(APPLICATION_STATE, CONTAINER_PROPS);

        expect(formatDateWithToday).toHaveBeenCalledWith(expect.any(Date), "locale", "timezone");
        expect(formatTime).toHaveBeenCalledWith(expect.any(Date), "locale", "timezone");

        expect(props).toEqual(SCOREBOARD_PROPS);
      });
    });

    describe("when currentSet does not exist", () => {
      it("should return props with score and teamServing as undefined", () => {
        getTennisScoreboard.mockReturnValueOnce({ ...TENNIS_SCOREBOARD, currentSet: undefined });

        const props = setupMakeMapStateToProps(APPLICATION_STATE, CONTAINER_PROPS);
        expect(props).toEqual({
          ...SCOREBOARD_PROPS,
          teamServing: undefined,
        });
      });
    });

    describe("when there is status", () => {
      it("should return props with status and map statusReason to tennis status reason labels", () => {
        getTennisScoreboard.mockReturnValueOnce({
          ...TENNIS_SCOREBOARD,
          status: {
            status: "INTERRUPTED",
            reason: "HEAT_DELAY",
          },
        });

        const props = setupMakeMapStateToProps(APPLICATION_STATE, CONTAINER_PROPS);
        expect(props).toEqual({
          ...SCOREBOARD_PROPS,
          status: "INTERRUPTED",
          statusReason: "HEAT DELAY",
          interrupted: true,
        });
      });
    });

    describe("when there is no status", () => {
      it("should return props with status and statusReason as undefined", () => {
        getTennisScoreboard.mockReturnValueOnce({ ...TENNIS_SCOREBOARD, status: undefined });

        const props = setupMakeMapStateToProps(APPLICATION_STATE, CONTAINER_PROPS);
        expect(props).toEqual({
          ...SCOREBOARD_PROPS,
          status: undefined,
          statusReason: undefined,
        });
      });
    });

    describe("when there is no competition", () => {
      it("should return props with competition as undefined", () => {
        getCompetitionByURN.mockReturnValue(undefined);

        const props = setupMakeMapStateToProps(APPLICATION_STATE, CONTAINER_PROPS);
        expect(props).toEqual({
          ...SCOREBOARD_PROPS,
          competition: undefined,
        });
      });
    });

    describe("when there are opponentsNames", () => {
      it("should return valid teams", () => {
        getOpponentsNames.mockReturnValueOnce({ teamA: "Team 1", teamB: "Team 2" });

        const props = setupMakeMapStateToProps(APPLICATION_STATE, CONTAINER_PROPS);
        expect(props).toEqual(
          expect.objectContaining({
            teamA: { name: "Team 1" },
            teamB: { name: "Team 2" },
          }),
        );
      });
    });

    describe("when there are no opponentsNames", () => {
      it("should return teams as empty object", () => {
        const props = setupMakeMapStateToProps(APPLICATION_STATE, CONTAINER_PROPS);
        expect(props).toEqual(expect.objectContaining({ teamA: {}, teamB: {} }));
      });
    });
  });

  describe("when tennis fixture does not exist on the store", () => {
    it("should return an empty object", () => {
      getTennisScoreboard.mockReturnValueOnce(undefined);

      const props = setupMakeMapStateToProps(APPLICATION_STATE, CONTAINER_PROPS);
      expect(props).toEqual({});
    });
  });
});
