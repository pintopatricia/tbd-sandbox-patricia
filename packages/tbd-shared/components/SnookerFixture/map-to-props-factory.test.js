import { createSnookerFixtureByURNSelector } from "@ppb/tbd-store/state/entities/snooker-fixture/snooker-fixture-selectors";
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

jest.mock("@ppb/tbd-store/state/entities/snooker-fixture/snooker-fixture-selectors", () => ({
  createSnookerFixtureByURNSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/competitions/competition-selectors", () => ({
  createCompetitionSelector: jest.fn(),
}));

jest.mock("./SnookerFixture.helper", () => ({
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

const CURRENT_SCORE = {
  home: 7,
  away: 4,
};

const COMPETITION_URN = "ppb:competition:1234";
const COMPETITION_NAME = "NFL";

const SNOOKER_FIXTURE = {
  typename: "SnookerFixture",
  urn: URN,
  score: CURRENT_SCORE,
};

const SPORT_EVENT_MOCK = {
  name: "A Team v B Team",
};

const MATCH_STATUS = "IN_PLAY";
const FORMAT_SCOREBOARD_DATA = [{ teamA: 7, teamB: 4, style: "IN_PLAY" }];
const SPORT_EVENT_OPEN_DATE = "222-06-11 2:00:00";
const SPORT_EVENT_TIME = "2:00";
const APPLICATION_STATE = {
  entities: {
    snookerfixtures: SNOOKER_FIXTURE,
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
const getSnookerFixtureByURN = jest.fn();
const getCompetitionByURN = jest.fn();
const getUserDetails = jest.fn();

const setupMapStateToProps = (state, props) => {
  createSportEventByURNSelector.mockReturnValue(getSportEventByURN);
  createSnookerFixtureByURNSelector.mockReturnValue(getSnookerFixtureByURN);
  createGetCountryLocalCurrencyCodeSelector.mockReturnValue(getUserDetails);
  createCompetitionSelector.mockReturnValue(getCompetitionByURN);

  getSportEventByURN.mockReturnValue({ ...SPORT_EVENT_MOCK, openDate: SPORT_EVENT_OPEN_DATE });
  getSnookerFixtureByURN.mockReturnValue(SNOOKER_FIXTURE);
  getCompetitionByURN.mockReturnValue({ urn: COMPETITION_URN, name: COMPETITION_NAME });
  getUserDetails.mockReturnValue({ localeCodeBcp4: "locale", timezone: "timezone" });

  return makeMapStateToProps()(state, props);
};

describe("MapToPropsFactory - SnookerFixture", () => {
  beforeEach(jest.clearAllMocks);

  it("should create a selector for the sport event urn", () => {
    makeMapStateToProps();

    expect(createSportEventByURNSelector).toHaveBeenCalledWith();
    expect(createSportEventByURNSelector).toHaveBeenCalledTimes(1);
  });

  it("should create a selector for Snooker fixture", () => {
    makeMapStateToProps();

    expect(createSnookerFixtureByURNSelector).toHaveBeenCalledWith();
    expect(createSnookerFixtureByURNSelector).toHaveBeenCalledTimes(1);
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
    describe("when Snooker fixture exists on the store", () => {
      describe("when there is a sportEventURN", () => {
        it("should return props with competition", () => {
          const props = setupMapStateToProps(APPLICATION_STATE, OWN_PROPS);

          expect(getSnookerFixtureByURN).toHaveBeenCalledWith(SNOOKER_FIXTURE, URN);
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
          getSnookerFixtureByURN.mockReturnValueOnce({
            ...SNOOKER_FIXTURE,
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

    describe("when Snooker fixture does not exist in the store", () => {
      it("should return an empty object", () => {
        getSnookerFixtureByURN.mockReturnValueOnce();

        const props = setupMapStateToProps(APPLICATION_STATE, OWN_PROPS);
        expect(props).toEqual({});
      });
    });
  });
});
