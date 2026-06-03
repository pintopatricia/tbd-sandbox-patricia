import { createRugbyUnionFixtureByURNSelector } from "@ppb/tbd-store/state/entities/rugby-union-fixture/rugby-union-fixture-selectors";
import { createSportEventByURNSelector } from "@ppb/tbd-store/state/entities/sport-events/sport-event-selectors";
import { createCompetitionSelector } from "@ppb/tbd-store/state/entities/competitions/competition-selectors";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";

import { MatchStatus } from "@ppb/the-wall-common/types";

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

jest.mock("@ppb/tbd-store/state/entities/rugby-union-fixture/rugby-union-fixture-selectors", () => ({
  createRugbyUnionFixtureByURNSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/competitions/competition-selectors", () => ({
  createCompetitionSelector: jest.fn(),
}));

const URN = "ppb:fixture:31214887";

const COMPETITION_URN = "ppb:competition:1234";
const COMPETITION_NAME = "European Champions Cup";

const CURRENT_SCORE = {
  home: 70,
  away: 47,
};

const HALF_TIME_SCORE = {
  home: 0,
  away: 0,
};

const RUGBY_UNION_FIXTURE = {
  typename: "RugbyUnionFixture",
  urn: URN,
  score: CURRENT_SCORE,
  halfTimeScore: HALF_TIME_SCORE,
};

const SPORT_EVENT_MOCK = {
  name: "A Team v B Team",
};

const FORMAT_SCOREBOARD_DATA = [
  { teamA: 70, teamB: 47, style: "IN_PLAY" },
  { teamA: 0, teamB: 0, style: "IN_PLAY" },
];
const SPORT_EVENT_OPEN_DATE = "2022-06-11 21:00:00";
const SPORT_EVENT_TIME = "21:00";
const APPLICATION_STATE = {
  entities: {
    rugbyunionfixtures: RUGBY_UNION_FIXTURE,
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
const getRugbyUnionFixtureByURN = jest.fn();
const getCompetitionByURN = jest.fn();
const getUserDetails = jest.fn();

const setupMapStateToProps = (state, props) => {
  createSportEventByURNSelector.mockReturnValue(getSportEventByURN);
  createRugbyUnionFixtureByURNSelector.mockReturnValue(getRugbyUnionFixtureByURN);
  createGetCountryLocalCurrencyCodeSelector.mockReturnValue(getUserDetails);
  createCompetitionSelector.mockReturnValue(getCompetitionByURN);

  getSportEventByURN.mockReturnValue({ ...SPORT_EVENT_MOCK, openDate: SPORT_EVENT_OPEN_DATE });
  getRugbyUnionFixtureByURN.mockReturnValue(RUGBY_UNION_FIXTURE);
  getCompetitionByURN.mockReturnValue({ urn: COMPETITION_URN, name: COMPETITION_NAME });
  getUserDetails.mockReturnValue({ localeCodeBcp47: "locale", timezone: "timezone" });

  return makeMapStateToProps()(state, props);
};

describe("MapToPropsFactory - RugbyUnionFixture", () => {
  beforeEach(jest.clearAllMocks);

  it("should create a selector for the sport event urn", () => {
    makeMapStateToProps();

    expect(createSportEventByURNSelector).toHaveBeenCalledWith();
    expect(createSportEventByURNSelector).toHaveBeenCalledTimes(1);
  });

  it("should create a selector for RugbyUnion fixture", () => {
    makeMapStateToProps();

    expect(createRugbyUnionFixtureByURNSelector).toHaveBeenCalledWith();
    expect(createRugbyUnionFixtureByURNSelector).toHaveBeenCalledTimes(1);
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
    describe("when rugby-union fixture exists on the store", () => {
      describe("when there is a sportEventURN", () => {
        it("should return props with competition", () => {
          const props = setupMapStateToProps(APPLICATION_STATE, OWN_PROPS);

          expect(getRugbyUnionFixtureByURN).toHaveBeenCalledWith(RUGBY_UNION_FIXTURE, URN);
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
            scoreData: FORMAT_SCOREBOARD_DATA,
            matchStatus: MatchStatus.IN_PLAY,
            teamA: {},
            teamB: {},
            time: SPORT_EVENT_TIME,
            labels: { inplay: "I18N.SPORT_EVENT.IN_PLAY" },
          });
        });
      });

      describe("and opponent names are provided", () => {
        it("should return props with competition", () => {
          getRugbyUnionFixtureByURN.mockReturnValueOnce({
            ...RUGBY_UNION_FIXTURE,
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

      describe("and scores are not provided", () => {
        it("should return match status as pre match", () => {
          getRugbyUnionFixtureByURN.mockReturnValueOnce({
            ...RUGBY_UNION_FIXTURE,
            score: null,
            halfTimeScore: null,
          });

          const props = setupMapStateToProps(APPLICATION_STATE, OWN_PROPS);

          expect(props).toEqual(
            expect.objectContaining({
              matchStatus: MatchStatus.PRE_MATCH,
            }),
          );
        });
      });
    });

    describe("when rugby-union fixture does not exist in the store", () => {
      it("should return an empty object", () => {
        getRugbyUnionFixtureByURN.mockReturnValueOnce();

        const props = setupMapStateToProps(APPLICATION_STATE, OWN_PROPS);
        expect(props).toEqual({});
      });
    });
  });
});
