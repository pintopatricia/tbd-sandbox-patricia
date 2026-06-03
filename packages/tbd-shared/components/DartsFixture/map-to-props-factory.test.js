import { createDartsFixtureByURNSelector } from "@ppb/tbd-store/state/entities/darts-fixture/darts-fixture-selectors";
import { createSportEventByURNSelector } from "@ppb/tbd-store/state/entities/sport-events/sport-event-selectors";
import { createCompetitionSelector } from "@ppb/tbd-store/state/entities/competitions/competition-selectors";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { DartsFixtureType } from "@ppb/tbd-store/state/entities/darts-fixture/DartsFixture";
import { createGetThrottleSelector } from "@ppb/tbd-store/state/entities/throttles/throttles-selectors";

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

jest.mock("@ppb/tbd-store/state/entities/darts-fixture/darts-fixture-selectors", () => ({
  createDartsFixtureByURNSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/competitions/competition-selectors", () => ({
  createCompetitionSelector: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/throttles/throttles-selectors", () => ({
  createGetThrottleSelector: jest.fn(),
}));

const MATCH_STATUS = "IN_PLAY";
const FORMAT_SCOREBOARD_DATA = [
  { teamA: 3, teamB: 1, style: "IN_PLAY" }, // Sets
  { teamA: 2, teamB: 2, style: "DEFAULT" }, // Legs
];
const SPORT_EVENT_OPEN_DATE = "222-06-11 2:00:00";
const SPORT_EVENT_TIME = "2:00";

// Mock the view model factory
jest.mock("../../view-model-factories/darts-fixture", () => ({
  createDartsFixtureViewModel: jest.fn(() =>
    jest.fn(() => ({
      date: SPORT_EVENT_OPEN_DATE,
      dateTime: new Date(SPORT_EVENT_OPEN_DATE),
      time: SPORT_EVENT_TIME,
      scoreData: FORMAT_SCOREBOARD_DATA,
      matchStatus: MATCH_STATUS,
    })),
  ),
}));

const URN = "ppb:dartsfixture:3124887";
const CURRENT_SCORE = {
  home: 3,
  away: 1,
};
const CURRENT_SET = {
  number: 2,
  score: { home: 1, away: 2 },
};

const COMPETITION_URN = "ppb:competition:1234";
const COMPETITION_NAME = "Premier League";

const DARTS_FIXTURE = {
  typename: "DartsFixture",
  urn: URN,
  score: CURRENT_SCORE,
  type: DartsFixtureType.SETS,
  currentSet: CURRENT_SET,
};

const SPORT_EVENT_MOCK = {
  name: "Player A v Player B",
};

const APPLICATION_STATE = {
  entities: {
    dartsfixtures: DARTS_FIXTURE,
    competitions: {},
    sportevents: {},
    throttles: {
      DARTS_COUPON_SCOREBOARD: { isActive: true },
    },
  },
};

const OWN_PROPS = {
  urn: URN,
  competition: COMPETITION_URN,
  sporteventURN: "sport:event:urn",
};

const getSportEventByURN = jest.fn();
const getDartsFixtureByURN = jest.fn();
const getCompetitionByURN = jest.fn();
const getUserDetails = jest.fn();
const getThrottle = jest.fn();

const setupMapStateToProps = (state, props) => {
  createSportEventByURNSelector.mockReturnValue(getSportEventByURN);
  createDartsFixtureByURNSelector.mockReturnValue(getDartsFixtureByURN);
  createGetCountryLocalCurrencyCodeSelector.mockReturnValue(getUserDetails);
  createCompetitionSelector.mockReturnValue(getCompetitionByURN);
  createGetThrottleSelector.mockReturnValue(getThrottle);

  getSportEventByURN.mockReturnValue({ ...SPORT_EVENT_MOCK, openDate: SPORT_EVENT_OPEN_DATE });
  getDartsFixtureByURN.mockReturnValue(DARTS_FIXTURE);
  getCompetitionByURN.mockReturnValue({ urn: COMPETITION_URN, name: COMPETITION_NAME });
  getUserDetails.mockReturnValue({ localeCodeBcp4: "locale", timezone: "timezone" });

  // Default: Throttle Enabled
  getThrottle.mockReturnValue({ isActive: true });

  return makeMapStateToProps()(state, props);
};

describe("MapToPropsFactory - DartsFixture", () => {
  beforeEach(jest.clearAllMocks);

  it("should create a selector for the sport event urn", () => {
    makeMapStateToProps();
    expect(createSportEventByURNSelector).toHaveBeenCalledTimes(1);
  });

  it("should create a selector for Darts fixture", () => {
    makeMapStateToProps();
    expect(createDartsFixtureByURNSelector).toHaveBeenCalledTimes(1);
  });

  it("should create a selector for competition", () => {
    makeMapStateToProps();
    expect(createCompetitionSelector).toHaveBeenCalledTimes(1);
  });

  it("should create a selector for userDetails", () => {
    makeMapStateToProps();
    expect(createGetCountryLocalCurrencyCodeSelector).toHaveBeenCalledTimes(1);
  });

  it("should create a selector for throttles", () => {
    makeMapStateToProps();
    expect(createGetThrottleSelector).toHaveBeenCalledTimes(1);
  });

  describe("mapStateToProps", () => {
    describe("when Darts fixture exists on the store", () => {
      describe("when there is a sportEventURN", () => {
        it("should return props with competition, fixture data and throttle enabled", () => {
          const props = setupMapStateToProps(APPLICATION_STATE, OWN_PROPS);

          expect(getDartsFixtureByURN).toHaveBeenCalledWith(DARTS_FIXTURE, URN);
          expect(getCompetitionByURN).toHaveBeenCalledWith({}, COMPETITION_URN);
          expect(getUserDetails).toHaveBeenCalledWith(APPLICATION_STATE);
          expect(getSportEventByURN).toHaveBeenCalledWith({}, "sport:event:urn");
          expect(i18n).toHaveBeenCalledWith({ key: "I18N.SPORT_EVENT.IN_PLAY" });
          expect(i18n).toHaveBeenCalledTimes(1);
          // Check Throttle call
          expect(getThrottle).toHaveBeenCalledWith(APPLICATION_STATE.entities.throttles, "DARTS_COUPON_SCOREBOARD");

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
            currentSet: CURRENT_SET,
            isDartsCouponScoreboardEnabled: true,
          });
        });
      });

      describe("when throttle is disabled", () => {
        it("should return isDartsCouponScoreboardEnabled as false", () => {
          createSportEventByURNSelector.mockReturnValue(getSportEventByURN);
          createDartsFixtureByURNSelector.mockReturnValue(getDartsFixtureByURN);
          createGetCountryLocalCurrencyCodeSelector.mockReturnValue(getUserDetails);
          createCompetitionSelector.mockReturnValue(getCompetitionByURN);
          createGetThrottleSelector.mockReturnValue(getThrottle);

          getSportEventByURN.mockReturnValue({ ...SPORT_EVENT_MOCK, openDate: SPORT_EVENT_OPEN_DATE });
          getDartsFixtureByURN.mockReturnValue(DARTS_FIXTURE);
          getCompetitionByURN.mockReturnValue({ urn: COMPETITION_URN, name: COMPETITION_NAME });
          getUserDetails.mockReturnValue({ localeCodeBcp4: "locale", timezone: "timezone" });

          getThrottle.mockReturnValue({ isActive: false });

          const mapStateToProps = makeMapStateToProps();
          const props = mapStateToProps(APPLICATION_STATE, OWN_PROPS);

          expect(props).toEqual(
            expect.objectContaining({
              isDartsCouponScoreboardEnabled: false,
            }),
          );
        });
      });

      describe("and opponent names are provided", () => {
        it("should return props with team names populated", () => {
          getDartsFixtureByURN.mockReturnValueOnce({
            ...DARTS_FIXTURE,
            opponentsNames: {
              teamA: "Player A",
              teamB: "Player B",
            },
          });

          const props = setupMapStateToProps(APPLICATION_STATE, OWN_PROPS);

          expect(props).toEqual(
            expect.objectContaining({
              teamA: { name: "Player A" },
              teamB: { name: "Player B" },
            }),
          );
        });
      });
    });

    describe("when Darts fixture does not exist in the store", () => {
      it("should return an empty object", () => {
        getDartsFixtureByURN.mockReturnValueOnce(undefined);

        const props = setupMapStateToProps(APPLICATION_STATE, OWN_PROPS);
        expect(props).toEqual({});
      });
    });
  });
});
