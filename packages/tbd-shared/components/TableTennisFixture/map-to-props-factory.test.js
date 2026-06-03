import { createTableTennisFixtureByURNSelector } from "@ppb/tbd-store/state/entities/table-tennis-fixture/table-tennis-fixture-selectors";
import { createSportEventByURNSelector } from "@ppb/tbd-store/state/entities/sport-events/sport-event-selectors";
import { createCompetitionSelector } from "@ppb/tbd-store/state/entities/competitions/competition-selectors";
import { createGetExchangeMarketByHierarchySelector } from "@ppb/tbd-store/state/entities/exchange-markets/exchange-market-selectors";
import { createGetSportsbookMarketByHierarchySelector } from "@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { MatchStatus, TeamSide } from "@ppb/the-wall-common/types";

import { createTableTennisScoreboardByURNSelector } from "../../view-model-factories/table-tennis-fixture";
import { makeMapStateToProps } from "./map-to-props-factory";

const getTableTennisFixtureScoreboardByURN = jest.fn();
const getSportEventByURN = jest.fn();
const getTableTennisFixtureByURN = jest.fn();
const getCompetitionByURN = jest.fn();
const getExchangeMarketByHierarchy = jest.fn();
const getSportsbookMarketByHierarchy = jest.fn();
const getUserDetails = jest.fn(() => ({ localeCodeBcp47: "locale", timezone: "timezone" }));

jest.mock("../../view-model-factories/table-tennis-fixture", () => ({
  createTableTennisScoreboardByURNSelector: jest.fn(() => getTableTennisFixtureScoreboardByURN),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("@ppb/tbd-store/state/entities/sport-events/sport-event-selectors", () => ({
  createSportEventByURNSelector: jest.fn(() => getSportEventByURN),
}));

jest.mock("@ppb/tbd-store/state/entities/table-tennis-fixture/table-tennis-fixture-selectors", () => ({
  createTableTennisFixtureByURNSelector: jest.fn(() => getTableTennisFixtureByURN),
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => getUserDetails),
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

const COMPETITION_URN = "ppb:competition:1234";
const COMPETITION_NAME = "TT ELITE SERIES MEN";

const URN = "ppb:fixture:31214887";
const CURRENT_SET = {
  currentServer: TeamSide.HOME,
  number: 2,
  score: {
    away: 4,
    home: 3,
  },
};
const SETS_WON = {
  away: 1,
  home: 0,
};
const PREVIOUS_SETS = [
  {
    currentServer: null,
    number: 1,
    score: {
      away: 9,
      home: 11,
    },
  },
];

const TABLE_TENNIS_FIXTURE = {
  typename: "TableTennisFixture",
  urn: URN,
  currentSet: CURRENT_SET,
  setsWon: SETS_WON,
  previousSets: PREVIOUS_SETS,
};

const SPORT_EVENT_MOCK = {
  name: "A Team v B Team",
};
const TEAM_A = {
  name: "A Team",
};
const TEAM_B = {
  name: "B Team",
};
const SCORE_DATA = [
  {
    teamA: 0,
    teamB: 1,
    style: "GREEN_BACKGROUND",
  },
  {
    teamA: 2,
    teamB: 6,
    style: "BORDER",
  },
];
const TABLE_TENNIS_SCOREBOARD = {
  competition: "TT ELITE SERIES MEN",
  event: "A Team v B Team",
  currentSet: CURRENT_SET,
  matchStatus: MatchStatus.IN_PLAY,
  scoreData: SCORE_DATA,
  teamA: TEAM_A,
  teamB: TEAM_B,
  teamServing: "HOME",
  date: "11 Jun 2022",
  dateTime: new Date("2022-06-11 21:00:00"),
  time: "21:00",
  labels: {
    inplay: "I18N.SPORT_EVENT.IN_PLAY",
  },
};
const APPLICATION_STATE = {
  entities: {
    tabletennisfixtures: TABLE_TENNIS_FIXTURE,
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

describe("MapToPropsFactory - TableTennisFixture", () => {
  beforeEach(jest.clearAllMocks);

  describe("makeMapStateToProps", () => {
    it("should create a selector for the sport event urn", () => {
      makeMapStateToProps();

      expect(createSportEventByURNSelector).toHaveBeenCalled();
      expect(createSportEventByURNSelector).toHaveBeenCalledTimes(1);
    });

    it("should create a selector for Table Tennis fixture", () => {
      makeMapStateToProps();

      expect(createTableTennisFixtureByURNSelector).toHaveBeenCalled();
      expect(createTableTennisFixtureByURNSelector).toHaveBeenCalledTimes(1);
    });

    it("should create a selector for userDetails", () => {
      makeMapStateToProps();

      expect(createGetCountryLocalCurrencyCodeSelector).toHaveBeenCalled();
      expect(createGetCountryLocalCurrencyCodeSelector).toHaveBeenCalledTimes(1);
    });

    it("should create a selector for competition", () => {
      makeMapStateToProps();

      expect(createCompetitionSelector).toHaveBeenCalled();
      expect(createCompetitionSelector).toHaveBeenCalledTimes(1);
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

    it("should create a selector for table tennis view model", () => {
      makeMapStateToProps();

      expect(createTableTennisScoreboardByURNSelector).toHaveBeenCalled();
      expect(createTableTennisScoreboardByURNSelector).toHaveBeenCalledTimes(1);
    });
  });

  describe("mapStateToProps", () => {
    describe("when table tennis fixture does not exist in the store", () => {
      beforeEach(() => {
        getTableTennisFixtureByURN.mockReturnValue(null);
      });

      it("should return an empty object", () => {
        const props = mapStateToProps(APPLICATION_STATE, OWN_PROPS);

        expect(getTableTennisFixtureByURN).toHaveBeenCalledWith(TABLE_TENNIS_FIXTURE, URN);

        expect(props).toEqual({});
      });
    });

    describe("when table tennis fixture does exist in the store", () => {
      describe("and can't find sportEvent", () => {
        beforeEach(() => {
          getTableTennisFixtureByURN.mockReturnValue(TABLE_TENNIS_FIXTURE);
          getSportEventByURN.mockReturnValue(undefined);
        });

        it("should return empty object", () => {
          const props = mapStateToProps(APPLICATION_STATE, OWN_PROPS);
          expect(getUserDetails).toHaveBeenCalledWith(APPLICATION_STATE);
          expect(props).toEqual({});
        });
      });

      describe("and can find sportEvent", () => {
        beforeEach(() => {
          getTableTennisFixtureByURN.mockReturnValue(TABLE_TENNIS_FIXTURE);
          getSportEventByURN.mockReturnValue(SPORT_EVENT_MOCK);
          getCompetitionByURN.mockReturnValue({
            urn: COMPETITION_URN,
            name: COMPETITION_NAME,
          });
          getExchangeMarketByHierarchy.mockReturnValue("exchangeMarket");
          getSportsbookMarketByHierarchy.mockReturnValue("sportsbookMarket");
          getTableTennisFixtureScoreboardByURN.mockReturnValue(TABLE_TENNIS_SCOREBOARD);
        });

        it("should return the correct table tennis data", () => {
          const props = mapStateToProps(APPLICATION_STATE, OWN_PROPS);

          expect(getUserDetails).toHaveBeenCalledWith(APPLICATION_STATE);
          expect(getTableTennisFixtureScoreboardByURN).toHaveBeenCalledWith({
            fixture: {
              currentSet: {
                currentServer: "HOME",
                number: 2,
                score: {
                  away: 4,
                  home: 3,
                },
              },
              previousSets: [
                {
                  currentServer: null,
                  number: 1,
                  score: {
                    away: 9,
                    home: 11,
                  },
                },
              ],
              setsWon: {
                away: 1,
                home: 0,
              },
              typename: "TableTennisFixture",
              urn: "ppb:fixture:31214887",
            },
            inplay: undefined,
            marketStatus: undefined,
            sportEvent: {
              name: "A Team v B Team",
            },
            userDetails: {
              localeCodeBcp47: "locale",
              timezone: "timezone",
            },
          });

          expect(props).toEqual(TABLE_TENNIS_SCOREBOARD);
        });
      });
    });
  });
});
