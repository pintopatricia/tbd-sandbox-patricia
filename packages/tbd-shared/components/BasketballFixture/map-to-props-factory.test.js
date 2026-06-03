import { createBasketballFixtureByURNSelector } from "@ppb/tbd-store/state/entities/basketball-fixture/basketball-fixture-selectors";
import { createSportEventByURNSelector } from "@ppb/tbd-store/state/entities/sport-events/sport-event-selectors";
import { createCompetitionSelector } from "@ppb/tbd-store/state/entities/competitions/competition-selectors";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";

import { i18n } from "../../helpers/i18n";
import { makeMapStateToProps } from "./map-to-props-factory";

jest.mock("../../helpers/dates", () => ({
  formatDateWithToday: jest.fn(() => "2022-06-11 21:00:00"),
  formatTime: jest.fn(() => "21:00"),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("@ppb/tbd-store/state/entities/sport-events/sport-event-selectors", () => ({
  createSportEventByURNSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/basketball-fixture/basketball-fixture-selectors", () => ({
  createBasketballFixtureByURNSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/competitions/competition-selectors", () => ({
  createCompetitionSelector: jest.fn(),
}));

jest.mock("./BasketballFixture.helper", () => ({
  formatScoreBoardData: jest.fn(() => "formatScoreboardData"),
  getDateInformation: jest.fn(() => ({
    date: "11 Jun 2022",
    dateTime: new Date("2022-06-11 21:00:00"),
    time: "21:00",
  })),
  getMatchState: jest.fn(() => "getMatchState"),
  getPrefixLabel: jest.fn(() => "getPrefixLabel"),
  getTeamNames: jest.fn(() => ["A Team", "B Team"]),
}));

const URN = "ppb:fixture:31214887";
const PERIOD_1 = "PERIOD_1";
const PERIOD_2 = "PERIOD_2";
const PERIOD_3 = "PERIOD_3";
const Q3_SEGMENT = "Q3";
const CURRENT_SCORE = {
  home: 70,
  away: 47,
};
const FIRST_PERIOD_SCORE = {
  home: 32,
  away: 17,
};
const SECOND_PERIOD_SCORE = {
  home: 21,
  away: 20,
};
const THIRD_PERIOD_SCORE = {
  home: 17,
  away: 10,
};

const COMPETITION_URN = "ppb:competition:1234";
const COMPETITION_NAME = "NBA";

const BASKETBALL_FIXTURE = {
  typename: "BasketballFixture",
  urn: URN,
  score: CURRENT_SCORE,
  clock: {
    period: PERIOD_3,
    segment: Q3_SEGMENT,
    timeElapsed: 428,
    timeRemaining: 172,
  },
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
  ],
};

const SPORT_EVENT_MOCK = {
  name: "A Team v B Team",
};

const MATCH_STATUS = "IN_PLAY";
const PREFIX_LABEL = "Q3";
const FORMAT_SCOREBOARD_DATA = [
  { teamA: 70, teamB: 47, style: "IN_PLAY" },
  { teamA: 32, teamB: 17, style: "FINISHED" },
  { teamA: 21, teamB: 20, style: "FINISHED" },
  { teamA: 17, teamB: 10, style: "DEFAULT" },
  { teamA: "-", teamB: "-", style: "EMPTY" },
];
const SPORT_EVENT_OPEN_DATE = "2022-06-11 21:00:00";
const SPORT_EVENT_TIME = "21:00";
const APPLICATION_STATE = {
  entities: {
    basketballfixtures: BASKETBALL_FIXTURE,
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
const getBasketballFixtureByURN = jest.fn();
const getCompetitionByURN = jest.fn();
const getUserDetails = jest.fn();

const setupMapStateToProps = (state, props) => {
  createSportEventByURNSelector.mockReturnValue(getSportEventByURN);
  createBasketballFixtureByURNSelector.mockReturnValue(getBasketballFixtureByURN);
  createGetCountryLocalCurrencyCodeSelector.mockReturnValue(getUserDetails);
  createCompetitionSelector.mockReturnValue(getCompetitionByURN);

  getSportEventByURN.mockReturnValue({ ...SPORT_EVENT_MOCK, openDate: SPORT_EVENT_OPEN_DATE });
  getBasketballFixtureByURN.mockReturnValue(BASKETBALL_FIXTURE);
  getCompetitionByURN.mockReturnValue({ urn: COMPETITION_URN, name: COMPETITION_NAME });
  getUserDetails.mockReturnValue({ localeCodeBcp47: "locale", timezone: "timezone" });

  return makeMapStateToProps()(state, props);
};

describe("MapToPropsFactory - BasketballFixture", () => {
  beforeEach(jest.clearAllMocks);

  it("should create a selector for the sport event urn", () => {
    makeMapStateToProps();

    expect(createSportEventByURNSelector).toHaveBeenCalledWith();
    expect(createSportEventByURNSelector).toHaveBeenCalledTimes(1);
  });

  it("should create a selector for Basketball fixture", () => {
    makeMapStateToProps();

    expect(createBasketballFixtureByURNSelector).toHaveBeenCalledWith();
    expect(createBasketballFixtureByURNSelector).toHaveBeenCalledTimes(1);
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
    describe("when basketball fixture exists on the store", () => {
      describe("when there is a sportEventURN", () => {
        it("should return props with competition", () => {
          const props = setupMapStateToProps(APPLICATION_STATE, OWN_PROPS);

          expect(getBasketballFixtureByURN).toHaveBeenCalledWith(BASKETBALL_FIXTURE, URN);
          expect(getCompetitionByURN).toHaveBeenCalledWith({}, COMPETITION_URN);
          expect(getUserDetails).toHaveBeenCalledWith(APPLICATION_STATE);
          expect(getSportEventByURN).toHaveBeenCalledWith({}, "sport:event:urn");
          expect(i18n).toHaveBeenCalledWith({ key: "I18N.SPORT_EVENT.IN_PLAY" });
          expect(i18n).toHaveBeenCalledTimes(1);

          expect(props).toEqual({
            clock: {
              period: PERIOD_3,
              segment: Q3_SEGMENT,
              timeElapsed: 428,
              timeRemaining: 172,
            },
            competition: COMPETITION_NAME,
            event: SPORT_EVENT_MOCK.name,
            date: SPORT_EVENT_OPEN_DATE,
            dateTime: new Date(SPORT_EVENT_OPEN_DATE),
            matchStatus: MATCH_STATUS,
            prefixLabel: PREFIX_LABEL,
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
          getBasketballFixtureByURN.mockReturnValueOnce({
            ...BASKETBALL_FIXTURE,
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

    describe("when basketball fixture does not exist in the store", () => {
      it("should return an empty object", () => {
        getBasketballFixtureByURN.mockReturnValueOnce();

        const props = setupMapStateToProps(APPLICATION_STATE, OWN_PROPS);
        expect(props).toEqual({});
      });
    });
  });
});
