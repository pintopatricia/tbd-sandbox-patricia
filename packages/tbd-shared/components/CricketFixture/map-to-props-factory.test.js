import { createCricketFixtureByURNSelector } from "@ppb/tbd-store/state/entities/cricket-fixture/cricket-fixture-selectors";
import { createSportEventByURNSelector } from "@ppb/tbd-store/state/entities/sport-events/sport-event-selectors";
import { createCompetitionSelector } from "@ppb/tbd-store/state/entities/competitions/competition-selectors";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { createGetExchangeMarketByHierarchySelector } from "@ppb/tbd-store/state/entities/exchange-markets/exchange-market-selectors";
import { createGetSportsbookMarketByHierarchySelector } from "@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors";
import { MatchStatus, TeamSide } from "@ppb/the-wall-common/types";

import { i18n } from "../../helpers/i18n";
import { makeMapStateToProps } from "./map-to-props-factory";
import { createCricketFixtureViewModel } from "../../view-model-factories/cricket-fixture";

const getSportEventByURN = jest.fn();
const getCricketFixtureByURN = jest.fn();
const getCompetitionByURN = jest.fn();
const getExchangeMarketByHierarchy = jest.fn();
const getSportsbookMarketByHierarchy = jest.fn();
const getCricketFixtureViewModel = jest.fn();
const getUserDetails = jest.fn(() => "userDetails");

jest.mock("@ppb/tbd-store/state/entities/sport-events/sport-event-selectors", () => ({
  createSportEventByURNSelector: jest.fn(() => getSportEventByURN),
}));

jest.mock("@ppb/tbd-store/state/entities/cricket-fixture/cricket-fixture-selectors", () => ({
  createCricketFixtureByURNSelector: jest.fn(() => getCricketFixtureByURN),
}));

jest.mock("@ppb/tbd-store/state/entities/competitions/competition-selectors", () => ({
  createCompetitionSelector: jest.fn(() => getCompetitionByURN),
}));

jest.mock("@ppb/tbd-store/state/entities/exchange-markets/exchange-market-selectors", () => ({
  createGetExchangeMarketByHierarchySelector: jest.fn(() => getExchangeMarketByHierarchy),
}));

jest.mock("@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors", () => ({
  createGetSportsbookMarketByHierarchySelector: jest.fn(() => getSportsbookMarketByHierarchy),
}));

jest.mock("../../view-model-factories/cricket-fixture", () => ({
  createCricketFixtureViewModel: jest.fn(() => getCricketFixtureViewModel),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => getUserDetails),
}));

const MATCH_STATUS = MatchStatus.IN_PLAY;

const COMPETITION_URN = "ppb:competition:1234";
const COMPETITION_NAME = "ONE DAY INTERNATIONALS";

const URN = "ppb:fixture:31214887";
const SCORE = "score";
const CURRENT_INNING = 1;
const CURRENT_TIME = { inning: CURRENT_INNING };
const CURRENT_TEAM_BATTING = TeamSide.HOME;

const CRICKET_FIXTURE = {
  typename: "CricketFixture",
  urn: URN,
  score: SCORE,
  currentTeamBatting: CURRENT_TEAM_BATTING,
  currentTime: CURRENT_TIME,
};

const SPORT_EVENT_MOCK = {
  name: "A Team v B Team",
};

const DEFAULT_CRICKET_SCORE_DATA = { scoreData: [], homeTotalRuns: 0, awayTotalRuns: 0 };

const SPORT_EVENT_OPEN_DATE = "2022-06-11 21:00:00";
const SPORT_EVENT_FULL_DATE = "11 Jun 2022";
const SPORT_EVENT_TIME = "21:00";
const TEAM_A = {
  name: "A Team",
};
const TEAM_B = {
  name: "B Team",
};

const CRICKET_FIXTURE_VIEW_MODEL = {
  matchStatus: MATCH_STATUS,
  cricketScoreData: DEFAULT_CRICKET_SCORE_DATA,
  teamA: TEAM_A,
  teamB: TEAM_B,
  teamServing: CURRENT_TEAM_BATTING,
  date: SPORT_EVENT_FULL_DATE,
  dateTime: SPORT_EVENT_OPEN_DATE,
  time: SPORT_EVENT_TIME,
};

const APPLICATION_STATE = {
  entities: {
    cricketfixtures: CRICKET_FIXTURE,
    competitions: "competitions",
    sportevents: "sportevents",
  },
};

const OWN_PROPS = {
  urn: URN,
  competition: COMPETITION_URN,
  sporteventURN: "sport:event:urn",
};

const mapStateToProps = makeMapStateToProps();

describe("MapToPropsFactory - CricketFixture", () => {
  beforeEach(jest.clearAllMocks);

  describe("makeMapStateToProps", () => {
    it("should create a selector for the sport event urn", () => {
      makeMapStateToProps();

      expect(createSportEventByURNSelector).toHaveBeenCalled();
      expect(createSportEventByURNSelector).toHaveBeenCalledTimes(1);
    });

    it("should create a selector for Cricket fixture", () => {
      makeMapStateToProps();

      expect(createCricketFixtureByURNSelector).toHaveBeenCalled();
      expect(createCricketFixtureByURNSelector).toHaveBeenCalledTimes(1);
    });

    it("should create a selector for competition", () => {
      makeMapStateToProps();

      expect(createCompetitionSelector).toHaveBeenCalled();
      expect(createCompetitionSelector).toHaveBeenCalledTimes(1);
    });

    it("should create a selector for userDetails", () => {
      makeMapStateToProps();

      expect(createGetCountryLocalCurrencyCodeSelector).toHaveBeenCalled();
      expect(createGetCountryLocalCurrencyCodeSelector).toHaveBeenCalledTimes(1);
    });

    it("should create a selector for exchange market by hierarchy", () => {
      makeMapStateToProps();

      expect(createGetExchangeMarketByHierarchySelector).toHaveBeenCalled();
      expect(createGetExchangeMarketByHierarchySelector).toHaveBeenCalledTimes(1);
    });

    it("should create a selector for sportsbook market by hierarchy", () => {
      makeMapStateToProps();

      expect(createGetSportsbookMarketByHierarchySelector).toHaveBeenCalled();
      expect(createGetSportsbookMarketByHierarchySelector).toHaveBeenCalledTimes(1);
    });

    it("should create a selector for cricket fixture view model", () => {
      makeMapStateToProps();

      expect(createCricketFixtureViewModel).toHaveBeenCalled();
      expect(createCricketFixtureViewModel).toHaveBeenCalledTimes(1);
    });

    describe("mapStateToProps", () => {
      describe("when cricket fixture does not exist in the store", () => {
        beforeEach(() => {
          getCricketFixtureByURN.mockReturnValue(null);
        });

        it("should return an empty object", () => {
          const props = mapStateToProps(APPLICATION_STATE, OWN_PROPS);

          expect(getCricketFixtureByURN).toHaveBeenCalledWith(CRICKET_FIXTURE, URN);

          expect(props).toEqual({});
        });
      });

      describe("when cricket fixture exists in the store", () => {
        describe("and it corresponds to a sportevent", () => {
          beforeEach(() => {
            getSportEventByURN.mockReturnValueOnce({ ...SPORT_EVENT_MOCK, openDate: SPORT_EVENT_OPEN_DATE });
            getCricketFixtureViewModel.mockReturnValue(CRICKET_FIXTURE_VIEW_MODEL);
            getCricketFixtureByURN.mockReturnValue(CRICKET_FIXTURE);
            getCompetitionByURN.mockReturnValue({
              urn: COMPETITION_URN,
              name: COMPETITION_NAME,
            });
            getSportEventByURN.mockReturnValue(SPORT_EVENT_MOCK);

            getExchangeMarketByHierarchy.mockReturnValue("exchangeMarket");
            getSportsbookMarketByHierarchy.mockReturnValue("sportsbookMarket");
          });

          it("should return correct props", () => {
            const props = mapStateToProps(APPLICATION_STATE, OWN_PROPS);

            expect(getCricketFixtureByURN).toHaveBeenCalledWith(CRICKET_FIXTURE, URN);
            expect(getCompetitionByURN).toHaveBeenCalledWith("competitions", COMPETITION_URN);

            expect(getSportEventByURN).toHaveBeenCalledWith("sportevents", "sport:event:urn");
            expect(getUserDetails).toHaveBeenCalledWith(APPLICATION_STATE);

            expect(props).toEqual({
              competition: COMPETITION_NAME,
              event: SPORT_EVENT_MOCK.name,
              date: SPORT_EVENT_FULL_DATE,
              dateTime: SPORT_EVENT_OPEN_DATE,
              matchStatus: MATCH_STATUS,
              cricketScoreData: DEFAULT_CRICKET_SCORE_DATA,
              teamA: TEAM_A,
              teamB: TEAM_B,
              teamServing: CURRENT_TEAM_BATTING,
              time: SPORT_EVENT_TIME,
              labels: {
                inplay: undefined,
              },
            });
          });

          it("should return expected text for inplay", () => {
            i18n.mockReturnValueOnce("inplayz");

            const props = makeMapStateToProps()(APPLICATION_STATE, OWN_PROPS);

            expect(i18n).toHaveBeenCalledWith({ key: "I18N.SPORT_EVENT.IN_PLAY" });
            expect(i18n).toHaveBeenCalledTimes(1);
            expect(props.labels.inplay).toEqual("inplayz");
          });
        });
      });

      describe("when competition does not exist in the store", () => {
        beforeEach(() => {
          getCricketFixtureByURN.mockReturnValue(CRICKET_FIXTURE);
          getCricketFixtureViewModel.mockReturnValue(CRICKET_FIXTURE_VIEW_MODEL);
          getCompetitionByURN.mockReturnValue(undefined);
        });

        it("should return props with competition as undefined", () => {
          const props = mapStateToProps(APPLICATION_STATE, OWN_PROPS);

          expect(props).toEqual(
            expect.objectContaining({
              competition: undefined,
            }),
          );
        });
      });
    });
  });
});
