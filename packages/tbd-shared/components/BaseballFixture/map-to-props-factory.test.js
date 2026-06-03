import { createBaseballFixtureByURNSelector } from "@ppb/tbd-store/state/entities/baseball-fixture/baseball-fixture-selectors";
import { createSportEventByURNSelector } from "@ppb/tbd-store/state/entities/sport-events/sport-event-selectors";
import { createCompetitionSelector } from "@ppb/tbd-store/state/entities/competitions/competition-selectors";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { createBaseballFixtureViewModel } from "../../view-model-factories/baseball-fixture";

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

// Update Mock: Baseball Selector
jest.mock("@ppb/tbd-store/state/entities/baseball-fixture/baseball-fixture-selectors", () => ({
  createBaseballFixtureByURNSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/competitions/competition-selectors", () => ({
  createCompetitionSelector: jest.fn(),
}));

jest.mock("../../view-model-factories/baseball-fixture", () => ({
  createBaseballFixtureViewModel: jest.fn(),
}));

const URN = "ppb:fixture:3124887";
const INNING_1 = "INNING_1";
const INNING_2 = "INNING_2";
const INNING_3 = "INNING_3";

const CURRENT_SCORE = {
  home: 5,
  away: 2,
};
const FIRST_INNING_SCORE = {
  home: 1,
  away: 0,
};
const SECOND_INNING_SCORE = {
  home: 2,
  away: 1,
};
const THIRD_INNING_SCORE = {
  home: 2,
  away: 1,
};

const COMPETITION_URN = "ppb:competition:1234";
const COMPETITION_NAME = "MLB";

const BASEBALL_FIXTURE = {
  typename: "BaseballFixture",
  urn: URN,
  score: CURRENT_SCORE,
  clock: {
    period: INNING_3,
  },
  scorePerInning: [
    {
      period: INNING_1,
      score: FIRST_INNING_SCORE,
    },
    {
      period: INNING_2,
      score: SECOND_INNING_SCORE,
    },
    {
      period: INNING_3,
      score: THIRD_INNING_SCORE,
    },
  ],
};

const SPORT_EVENT_MOCK = {
  name: "Yankees v Red Sox",
};

const MATCH_STATUS = "IN_PLAY";
const FORMAT_SCOREBOARD_DATA = [
  { teamA: 5, teamB: 2, style: "IN_PLAY" },
  { teamA: 1, teamB: 0, style: "FINISHED" },
  { teamA: 2, teamB: 1, style: "FINISHED" },
  { teamA: 2, teamB: 1, style: "DEFAULT" },
  { teamA: "-", teamB: "-", style: "EMPTY" },
];
const SPORT_EVENT_OPEN_DATE = "222-06-11 2:00:00";
const SPORT_EVENT_TIME = "2:00";

const APPLICATION_STATE = {
  entities: {
    baseballfixtures: BASEBALL_FIXTURE,
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
const getBaseballFixtureByURN = jest.fn();
const getCompetitionByURN = jest.fn();
const getUserDetails = jest.fn();
const getBaseballFixtureViewModel = jest.fn();

const setupMapStateToProps = (state, props) => {
  createSportEventByURNSelector.mockReturnValue(getSportEventByURN);
  createBaseballFixtureByURNSelector.mockReturnValue(getBaseballFixtureByURN);
  createGetCountryLocalCurrencyCodeSelector.mockReturnValue(getUserDetails);
  createCompetitionSelector.mockReturnValue(getCompetitionByURN);
  createBaseballFixtureViewModel.mockReturnValue(getBaseballFixtureViewModel);

  getSportEventByURN.mockReturnValue({ ...SPORT_EVENT_MOCK, openDate: SPORT_EVENT_OPEN_DATE });
  getBaseballFixtureByURN.mockReturnValue(BASEBALL_FIXTURE);
  getCompetitionByURN.mockReturnValue({ urn: COMPETITION_URN, name: COMPETITION_NAME });
  getUserDetails.mockReturnValue({ localeCodeBcp4: "locale", timezone: "timezone" });

  getBaseballFixtureViewModel.mockReturnValue({
    date: SPORT_EVENT_OPEN_DATE,
    dateTime: new Date(SPORT_EVENT_OPEN_DATE),
    time: SPORT_EVENT_TIME,
    scoreData: FORMAT_SCOREBOARD_DATA,
    matchStatus: MATCH_STATUS,
  });

  return makeMapStateToProps()(state, props);
};

describe("MapToPropsFactory - BaseballFixture", () => {
  beforeEach(jest.clearAllMocks);

  it("should create a selector for the sport event urn", () => {
    makeMapStateToProps();

    expect(createSportEventByURNSelector).toHaveBeenCalledWith();
    expect(createSportEventByURNSelector).toHaveBeenCalledTimes(1);
  });

  it("should create a selector for Baseball fixture", () => {
    makeMapStateToProps();

    expect(createBaseballFixtureByURNSelector).toHaveBeenCalledWith();
    expect(createBaseballFixtureByURNSelector).toHaveBeenCalledTimes(1);
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

  it("should create a selector for view model", () => {
    makeMapStateToProps();

    expect(createBaseballFixtureViewModel).toHaveBeenCalledWith();
    expect(createBaseballFixtureViewModel).toHaveBeenCalledTimes(1);
  });

  describe("mapStateToProps", () => {
    describe("when Baseball fixture exists on the store", () => {
      describe("when there is a sportEventURN", () => {
        it("should return props with competition", () => {
          const props = setupMapStateToProps(APPLICATION_STATE, OWN_PROPS);

          expect(getBaseballFixtureByURN).toHaveBeenCalledWith(BASEBALL_FIXTURE, URN);
          expect(getCompetitionByURN).toHaveBeenCalledWith({}, COMPETITION_URN);
          expect(getUserDetails).toHaveBeenCalledWith(APPLICATION_STATE);
          expect(getSportEventByURN).toHaveBeenCalledWith({}, "sport:event:urn");
          expect(i18n).toHaveBeenCalledWith({ key: "I18N.SPORT_EVENT.IN_PLAY" });
          expect(getBaseballFixtureViewModel).toHaveBeenCalledWith(
            expect.objectContaining({
              scorePerInning: BASEBALL_FIXTURE.scorePerInning,
              score: BASEBALL_FIXTURE.score,
              clock: BASEBALL_FIXTURE.clock,
            }),
          );

          expect(props).toEqual({
            clock: {
              period: INNING_3,
            },
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
        it("should return props with team names", () => {
          getBaseballFixtureByURN.mockReturnValueOnce({
            ...BASEBALL_FIXTURE,
            opponentsNames: {
              teamA: "Yankees",
              teamB: "Red Sox",
            },
          });

          const props = setupMapStateToProps(APPLICATION_STATE, OWN_PROPS);

          expect(props).toEqual(
            expect.objectContaining({
              teamA: { name: "Yankees" },
              teamB: { name: "Red Sox" },
            }),
          );
        });
      });
    });

    describe("when Baseball fixture does not exist in the store", () => {
      it("should return an empty object", () => {
        getBaseballFixtureByURN.mockReturnValueOnce();

        const props = setupMapStateToProps(APPLICATION_STATE, OWN_PROPS);
        expect(props).toEqual({});
      });
    });
  });
});
