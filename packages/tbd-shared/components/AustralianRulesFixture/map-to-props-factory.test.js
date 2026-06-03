import { createAustralianRulesFixtureByURNSelector } from "@ppb/tbd-store/state/entities/australian-rules-fixture/australian-rules-fixture-selectors";
import { createSportEventByURNSelector } from "@ppb/tbd-store/state/entities/sport-events/sport-event-selectors";
import { createCompetitionSelector } from "@ppb/tbd-store/state/entities/competitions/competition-selectors";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";

import { i18n } from "../../helpers/i18n";
import { makeMapStateToProps } from "./map-to-props-factory";

jest.mock("../../helpers/dates", () => ({
  formatDateWithToday: jest.fn(() => "222-06-11 2:00:00"),
  formatTime: jest.fn(() => "2:00"),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("@ppb/tbd-store/state/entities/sport-events/sport-event-selectors", () => ({
  createSportEventByURNSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/australian-rules-fixture/australian-rules-fixture-selectors", () => ({
  createAustralianRulesFixtureByURNSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/competitions/competition-selectors", () => ({
  createCompetitionSelector: jest.fn(),
}));

jest.mock("./AustralianRulesFixture.helper", () => ({
  formatScoreBoardData: jest.fn(() => "formatScoreboardData"),
  getDateInformation: jest.fn(() => ({
    date: "11 Jun 222",
    dateTime: new Date("222-06-11 2:00:00"),
    time: "2:00",
  })),
  getMatchState: jest.fn(() => "getMatchState"),
  getTeamNames: jest.fn(() => ["A Team", "B Team"]),
}));

const URN = "ppb:fixture:3124887";

const PERIOD_1 = "PERIOD_1";
const PERIOD_2 = "PERIOD_2";
const PERIOD_3 = "PERIOD_3";
const PERIOD_4 = "PERIOD_4";

const CURRENT_SCORE = {
  points: {
    home: 7,
    away: 4,
  },
};
const FIRST_PERIOD_SCORE = {
  points: {
    home: 3,
    away: 1,
  },
};
const SECOND_PERIOD_SCORE = {
  points: {
    home: 2,
    away: 2,
  },
};
const THIRD_PERIOD_SCORE = {
  points: {
    home: 1,
    away: 1,
  },
};
const FOURTH_PERIOD_SCORE = {
  points: {
    home: 0,
    away: 0,
  },
};

const COMPETITION_URN = "ppb:competition:1234";
const COMPETITION_NAME = "NTFL";

const AUSTRALIAN_RULES_FIXTURE = {
  typename: "AustralianRulesFixture",
  urn: URN,
  score: CURRENT_SCORE,
  periodScores: [
    {
      period: PERIOD_1,
      score: FIRST_PERIOD_SCORE,
    },
    {
      period: PERIOD_2,
      score: SECOND_PERIOD_SCORE,
    },
    {
      period: PERIOD_3,
      score: THIRD_PERIOD_SCORE,
    },
    {
      period: PERIOD_4,
      score: FOURTH_PERIOD_SCORE,
    },
  ],
};

const SPORT_EVENT_MOCK = {
  name: "A Team v B Team",
};

const MATCH_STATUS = "IN_PLAY";
const FORMAT_SCOREBOARD_DATA = [
  { teamA: 7, teamB: 4, style: "IN_PLAY" },
  { teamA: 3, teamB: 1, style: "DEFAULT" },
  { teamA: 2, teamB: 2, style: "DEFAULT" },
  { teamA: 1, teamB: 1, style: "DEFAULT" },
  { teamA: 0, teamB: 0, style: "DEFAULT" },
];
const SPORT_EVENT_OPEN_DATE = "222-06-11 2:00:00";
const SPORT_EVENT_TIME = "2:00";
const APPLICATION_STATE = {
  entities: {
    australianrulesfixtures: AUSTRALIAN_RULES_FIXTURE,
    competitions: {},
    sportevents: {},
  },
};

const OWN_PROPS = {
  urn: URN,
  competition: COMPETITION_URN,
  sporteventURN: "sport:event:urn",
};

const getSportEventByURN = jest.fn();
const getAustralianRulesFixtureByURN = jest.fn();
const getCompetitionByURN = jest.fn();
const getUserDetails = jest.fn();

const setupMapStateToProps = (state, props) => {
  createSportEventByURNSelector.mockReturnValue(getSportEventByURN);
  createAustralianRulesFixtureByURNSelector.mockReturnValue(getAustralianRulesFixtureByURN);
  createGetCountryLocalCurrencyCodeSelector.mockReturnValue(getUserDetails);
  createCompetitionSelector.mockReturnValue(getCompetitionByURN);

  getSportEventByURN.mockReturnValue({ ...SPORT_EVENT_MOCK, openDate: SPORT_EVENT_OPEN_DATE });
  getAustralianRulesFixtureByURN.mockReturnValue(AUSTRALIAN_RULES_FIXTURE);
  getCompetitionByURN.mockReturnValue({ urn: COMPETITION_URN, name: COMPETITION_NAME });
  getUserDetails.mockReturnValue({ localeCodeBcp4: "locale", timezone: "timezone" });

  return makeMapStateToProps()(state, props);
};

describe("MapToPropsFactory - AustralianRulesFixture", () => {
  beforeEach(jest.clearAllMocks);

  it("should create a selector for the sport event urn", () => {
    makeMapStateToProps();

    expect(createSportEventByURNSelector).toHaveBeenCalledWith();
    expect(createSportEventByURNSelector).toHaveBeenCalledTimes(1);
  });

  it("should create a selector for AustralianRules fixture", () => {
    makeMapStateToProps();

    expect(createAustralianRulesFixtureByURNSelector).toHaveBeenCalledWith();
    expect(createAustralianRulesFixtureByURNSelector).toHaveBeenCalledTimes(1);
  });

  it("should create a selector for competition", () => {
    makeMapStateToProps();

    expect(createCompetitionSelector).toHaveBeenCalledWith();
    expect(createCompetitionSelector).toHaveBeenCalledTimes(1);
  });

  it("should create a selector for userDetails", () => {
    makeMapStateToProps();

    expect(createGetCountryLocalCurrencyCodeSelector).toHaveBeenCalledWith();
    expect(createGetCountryLocalCurrencyCodeSelector).toHaveBeenCalledTimes(1);
  });

  describe("mapStateToProps", () => {
    describe("when AustralianRules fixture exists on the store", () => {
      describe("when there is a sportEventURN", () => {
        it("should return props with competition", () => {
          const props = setupMapStateToProps(APPLICATION_STATE, OWN_PROPS);

          expect(getAustralianRulesFixtureByURN).toHaveBeenCalledWith(AUSTRALIAN_RULES_FIXTURE, URN);
          expect(getCompetitionByURN).toHaveBeenCalledWith({}, COMPETITION_URN);
          expect(getUserDetails).toHaveBeenCalledWith(APPLICATION_STATE);
          expect(getSportEventByURN).toHaveBeenCalledWith({}, "sport:event:urn");
          expect(i18n).toHaveBeenCalledWith({ key: "I18N.SPORT_EVENT.IN_PLAY" });
          expect(i18n).toHaveBeenCalledTimes(1);

          expect(props).toEqual({
            competition: COMPETITION_NAME,
            event: SPORT_EVENT_MOCK.name,
            date: SPORT_EVENT_OPEN_DATE,
            dateTime: new Date(SPORT_EVENT_OPEN_DATE),
            matchStatus: MATCH_STATUS,
            scoreData: FORMAT_SCOREBOARD_DATA,
            teamA: {},
            teamB: {},
            time: SPORT_EVENT_TIME,
            labels: { inplay: "I18N.SPORT_EVENT.IN_PLAY" },
          });
        });
      });

      describe("and opponent names are provided", () => {
        it("should return props with competition", () => {
          getAustralianRulesFixtureByURN.mockReturnValueOnce({
            ...AUSTRALIAN_RULES_FIXTURE,
            opponentsNames: {
              teamA: "teamA name",
              teamB: "teamB name",
            },
          });

          const props = setupMapStateToProps(APPLICATION_STATE, OWN_PROPS);

          expect(props).toEqual(
            expect.objectContaining({
              teamA: { name: "teamA name" },
              teamB: { name: "teamB name" },
            }),
          );
        });
      });
    });

    describe("when AustralianRules fixture does not exist in the store", () => {
      it("should return an empty object", () => {
        getAustralianRulesFixtureByURN.mockReturnValueOnce();

        const props = setupMapStateToProps(APPLICATION_STATE, OWN_PROPS);
        expect(props).toEqual({});
      });
    });
  });
});
