import { SUBSCRIBE_FIXTURE_UPDATES, UNSUBSCRIBE_FIXTURE_UPDATES } from "@ppb/tbd-store/actions/fixture";
import { createFixtureByURNSelector, isBaseFixture } from "@ppb/tbd-store/state/entities/entities-selectors";
import { ScoreboardViewMode } from "@ppb/the-wall-common/types";

import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const getSportEventByURN = jest.fn(() => ({
  urn: "ppb:event:30459295",
  name: "event name",
  openDate: "2021-05-07T19:00:00.000Z",
  competition: "ppb:competition:10932509",
  eventId: 30459295,
}));

const getCompetitionByURN = jest.fn(() => ({
  urn: "ppb:competition:10932509",
  name: "competition name",
  sport: "ppb:eventType:1",
  competitionId: 10932509,
}));

const getFixtureByURN = jest.fn(() => ({
  urn: "ppb:fixture:30459295",
  typename: "SomeFixture",
}));

const getExchangeMarketByHierarchy = jest.fn(() => ({
  urn: "ppb:excMarket:1.184779900",
  name: "Set Betting",
  marketId: "1.184779900",
  sportevent: "ppb:event:30646946",
  competition: "ppb:competition:12290431",
  sport: "ppb:eventType:2",
  status: "OPEN",
  type: "SET_BETTING",
  inplay: true,
  hierarchy: {
    sportevent: "ppb:event:32255654",
    competition: "ppb:competition:10932509",
  },
  bettingType: "ODDS",
  marketType: "SET_BETTING",
  runners: [{ name: "runner A" }, { name: "runner B" }],
}));

const getSportsbookMarketByHierarchy = jest.fn(() => ({
  urn: "ppb:sbkMarket:1.184779911",
  name: "Set Betting",
  marketId: "1.18477991",
  sportevent: "ppb:event:123456",
  competition: "ppb:competition:987654",
  sport: "ppb:eventType:2",
  status: "OPEN",
  type: "SET_BETTING",
  inplay: true,
  hierarchy: {
    sportevent: "ppb:event:123456",
    competition: "ppb:competition:987654",
  },
  bettingType: "ODDS",
  marketType: "SET_BETTING",
  runners: [{ name: "runner A" }, { name: "runner B" }],
}));

const getUserDetails = jest.fn(() => ({
  localeCodeBcp47: "locale",
  timezone: "timezone",
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => getUserDetails),
}));

jest.mock("@ppb/tbd-store/state/entities/exchange-markets/exchange-market-selectors", () => ({
  createGetExchangeMarketByHierarchySelector: jest.fn(() => getExchangeMarketByHierarchy),
}));

jest.mock("@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors", () => ({
  createGetSportsbookMarketByHierarchySelector: jest.fn(() => getSportsbookMarketByHierarchy),
}));

jest.mock("../../helpers/dates", () => ({
  formatDateAndTimeWithMonth: jest.fn(() => "FULL DATE FORMAT"),
  formatDate: jest.fn(() => "DATE FORMAT"),
  formatTime: jest.fn(() => "TIME FORMAT"),
  isToday: jest.fn(() => true),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("@ppb/tbd-store/state/entities/sport-events/sport-event-selectors", () => ({
  createSportEventByURNSelector: jest.fn(() => getSportEventByURN),
}));

jest.mock("@ppb/tbd-store/state/entities/entities-selectors", () => ({
  createFixtureByURNSelector: jest.fn(() => getFixtureByURN),
  isBaseFixture: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/entities/competitions/competition-selectors", () => ({
  createCompetitionSelector: jest.fn(() => getCompetitionByURN),
}));

const GENERIC_STATE = {
  layouts: {},
  entities: {
    footballfixtures: {
      "ppb:fixture:30459295": {
        urn: "ppb:fixture:30459295",
        typename: "FootballFixture",
        sportevent: "ppb:event:30459295",
        competition: "ppb:competition:10932509",
      },
    },
    tennisfixtures: {
      "ppb:fixture:30459111": {
        urn: "ppb:fixture:30459111",
        typename: "TennisMatch",
        sportevent: "ppb:event:30459111",
        competition: "ppb:competition:10932510",
      },
    },
    basketballfixtures: {
      "ppb:fixture:31160969": {
        urn: "ppb:fixture:31160969",
        typename: "TennisMatch",
        sportevent: "ppb:event:31160969",
        competition: "ppb:competition:10932510",
      },
    },
    cricketfixtures: {
      "ppb:fixture:32255654": {
        urn: "ppb:fixture:32255654",
        typename: "CricketFixture",
        sportevent: "ppb:event:32255654",
        competition: "ppb:competition:10932509",
      },
    },
    tabletennisfixtures: {
      "ppb:fixture:32255655": {
        urn: "ppb:fixture:32255655",
        typename: "TableTennisFixture",
        sportevent: "ppb:event:32255655",
        competition: "ppb:competition:10932509",
      },
    },
    sportevents: {
      "ppb:event:30459295": {
        urn: "ppb:event:30459295",
        name: "event name",
        openDate: "2021-05-07T19:00:00.000Z",
        competition: "ppb:competition:10932509",
      },
      "ppb:event:30459111": {
        urn: "ppb:event:30459111",
        name: "Nadal v Rogerer Federer",
        openDate: "2021-05-07T19:00:00.000Z",
        competition: "ppb:competition:10932510",
      },
      "ppb:event:32255654": {
        urn: "ppb:event:32255654",
        name: "New Zealend v India",
        openDate: "2021-05-07T19:00:00.000Z",
        competition: "ppb:competition:10932509",
      },
    },
    competitions: {
      "ppb:competition:10932509": {
        urn: "ppb:competition:10932509",
        name: "competition name",
        sport: "ppb:eventType:1",
        competitionId: 10932509,
      },
      "ppb:competition:10932510": {
        urn: "ppb:competition:10932510",
        name: "ATP Australia Open",
        sport: "ppb:eventType:2",
        competitionId: 10932510,
      },
    },
    exchangemarkets: {
      "ppb:excMarket:1.184779900": {
        urn: "ppb:excMarket:1.184779900",
        name: "Set Betting",
        marketId: "1.184779900",
        sportevent: "ppb:event:30646946",
        competition: "ppb:competition:12290431",
        sport: "ppb:eventType:2",
        status: "OPEN",
        type: "SET_BETTING",
        inplay: true,
        hierarchy: {
          sportevent: "ppb:event:32255654",
          competition: "ppb:competition:10932509",
        },
        bettingType: "ODDS",
        marketType: "SET_BETTING",
        runners: [{ name: "runner A" }, { name: "runner B" }],
      },
    },
    sportsbookmarkets: {
      "ppb:sbkMarket:1.184779911": {
        urn: "ppb:sbkMarket:1.184779911",
        name: "Set Betting",
        marketId: "1.184779911",
        sportevent: "ppb:event:123456",
        competition: "ppb:competition:12290431",
        sport: "ppb:eventType:2",
        status: "OPEN",
        type: "SET_BETTING",
        inplay: true,
        hierarchy: {
          sportevent: "ppb:event:123456",
          competition: "ppb:competition:987654",
        },
        bettingType: "ODDS",
        marketType: "SET_BETTING",
        runners: [{ name: "runner A" }, { name: "runner B" }],
      },
    },
  },
};

const EXPECTED_BASE_FIXTURE_PROPS = {
  competitionURN: "ppb:competition:10932509",
  sportsbookURN: "ppb:sbkMarket:924.111111",
  exchangeURN: "ppb:excMarket:1.11111",
  sporteventURN: "ppb:event:30459295",
};

const EXPECTED_FOOTBALL_PROPS = {
  competitionURN: "ppb:competition:10932509",
  fixtureURN: "ppb:fixture:30459295",
  typename: "FootballFixture",
  sporteventURN: "ppb:event:30459295",
};

const EXPECTED_TENNIS_PROPS = {
  competitionURN: "ppb:competition:10932509",
  fixtureURN: "ppb:fixture:30459111",
  sporteventURN: "ppb:event:30459111",
  typename: "TennisMatch",
};

const EXPECTED_BASKETBALL_PROPS = {
  competitionURN: "ppb:competition:10932509",
  fixtureURN: "ppb:fixture:31160969",
  sporteventURN: "ppb:event:31160969",
  typename: "BasketballFixture",
};

const EXPECTED_CRICKET_PROPS = {
  competitionURN: "ppb:competition:10932509",
  fixtureURN: "ppb:fixture:32255654",
  sporteventURN: "ppb:event:32255654",
  typename: "CricketFixture",
};

const EXPECTED_TABLE_TENNIS_PROPS = {
  competitionURN: "ppb:competition:10932509",
  fixtureURN: "ppb:fixture:32255655",
  sporteventURN: "ppb:event:32255655",
  typename: "TableTennisFixture",
};

const setupMapStateToProps = (fixture, sporteventURN, state = GENERIC_STATE) => {
  const containerProps = {
    fixture,
    sporteventURN,
  };
  return makeMapStateToProps()(state, containerProps);
};

describe("makeMapStateToProps", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  let stateProps;

  describe("when fixture is not a baseFixture", () => {
    beforeEach(() => {
      isBaseFixture.mockReturnValue(false);
    });

    describe("and is undefined", () => {
      beforeEach(() => {
        getFixtureByURN.mockReturnValueOnce(undefined);
      });

      it("should return an empty object", () => {
        stateProps = setupMapStateToProps("ppb:fixture:batatas");

        expect(getFixtureByURN).toHaveBeenCalledTimes(1);
        expect(getFixtureByURN).toHaveBeenCalledWith(GENERIC_STATE.entities, "ppb:fixture:batatas");

        expect(stateProps).toEqual({});
      });
    });

    describe("and is not supported", () => {
      beforeEach(() => {
        getFixtureByURN.mockReturnValueOnce({
          urn: "ppb:fixture:notsupported",
          typename: "NotSupportedFixture",
        });
      });

      it("should return an empty object", () => {
        stateProps = setupMapStateToProps("ppb:fixture:notsupported");

        expect(getFixtureByURN).toHaveBeenCalledTimes(1);
        expect(getFixtureByURN).toHaveBeenCalledWith(GENERIC_STATE.entities, "ppb:fixture:notsupported");

        expect(stateProps).toEqual({});
      });
    });

    describe.each([
      ["FootballFixture", "ppb:fixture:30459295", "ppb:event:30459295", EXPECTED_FOOTBALL_PROPS],
      ["TennisMatch", "ppb:fixture:30459111", "ppb:event:30459111", EXPECTED_TENNIS_PROPS],
      ["BasketballFixture", "ppb:fixture:31160969", "ppb:event:31160969", EXPECTED_BASKETBALL_PROPS],
      ["CricketFixture", "ppb:fixture:32255654", "ppb:event:32255654", EXPECTED_CRICKET_PROPS],
      ["TableTennisFixture", "ppb:fixture:32255655", "ppb:event:32255655", EXPECTED_TABLE_TENNIS_PROPS],
    ])("and is %s", (typename, fixtureURN, eventURN, expectedProps) => {
      beforeEach(() => {
        getFixtureByURN.mockReturnValue({
          urn: fixtureURN,
          typename,
        });
      });

      it("should get data from state and build correct view model", () => {
        stateProps = setupMapStateToProps(fixtureURN, eventURN);

        expect(getFixtureByURN).toHaveBeenCalledTimes(1);
        expect(getFixtureByURN).toHaveBeenCalledWith(GENERIC_STATE.entities, fixtureURN);

        expect(getSportEventByURN).toHaveBeenCalledTimes(1);
        expect(getSportEventByURN).toHaveBeenCalledWith(GENERIC_STATE.entities.sportevents, eventURN);

        expect(getCompetitionByURN).toHaveBeenCalledTimes(1);
        expect(getCompetitionByURN).toHaveBeenCalledWith(
          GENERIC_STATE.entities.competitions,
          "ppb:competition:10932509",
        );

        expect(stateProps).toEqual(expectedProps);
      });

      describe("when fixture doesn't exist in state", () => {
        it("should return an empty object", () => {
          createFixtureByURNSelector.mockReturnValueOnce(() => () => undefined);

          stateProps = setupMapStateToProps(fixtureURN, eventURN);

          expect(stateProps).toEqual({});
        });
      });

      describe("when competition doesn't exist in state", () => {
        it("should return an undefined competition", () => {
          getCompetitionByURN.mockReturnValueOnce(undefined);

          stateProps = setupMapStateToProps(fixtureURN, eventURN);

          expect(stateProps).toEqual({
            ...expectedProps,
            competitionURN: undefined,
          });
        });
      });

      describe("when event doesn't exist in state", () => {
        it("should return empty state", () => {
          getSportEventByURN.mockReturnValueOnce(undefined);

          stateProps = setupMapStateToProps(fixtureURN, eventURN);

          expect(stateProps).toEqual({
            ...expectedProps,
            competitionURN: undefined,
          });
        });
      });
    });
  });

  describe("when fixture is a baseFixture", () => {
    beforeEach(() => {
      isBaseFixture.mockReturnValue(true);
    });

    it("should get data from state and build correct view model", () => {
      const fixture = {
        urn: "ppb:fixture:30459295",
        typename: "BaseFixture",
        sportevent: "ppb:event:30459295",
        mainMarket: { exchange: "ppb:excMarket:1.11111", sportsbook: "ppb:sbkMarket:924.111111" },
      };
      stateProps = setupMapStateToProps(fixture, "ppb:event:30459295");

      expect(getFixtureByURN).not.toHaveBeenCalled();
      expect(getSportEventByURN).toHaveBeenCalledTimes(1);
      expect(getSportEventByURN).toHaveBeenCalledWith(GENERIC_STATE.entities.sportevents, "ppb:event:30459295");
      expect(getCompetitionByURN).toHaveBeenCalledTimes(1);
      expect(getCompetitionByURN).toHaveBeenCalledWith(GENERIC_STATE.entities.competitions, "ppb:competition:10932509");

      expect(stateProps).toEqual(EXPECTED_BASE_FIXTURE_PROPS);
    });

    it("should return an empty object if sportevent doesn't exists in state", () => {
      getSportEventByURN.mockReturnValueOnce(undefined);
      stateProps = setupMapStateToProps("ppb:fixture:30459295", "ppb:event:30459295");

      expect(getSportEventByURN).toHaveBeenCalledTimes(1);
      expect(getCompetitionByURN).toHaveBeenCalledTimes(0);

      expect(stateProps).toEqual({});
    });
  });
});

describe("mapDispatchToProps", () => {
  describe("dispatchSubscribeFixtureUpdates", () => {
    describe("and the viewMode is DEFAULT", () => {
      it("should dispatch SUBSCRIBE_FIXTURE_UPDATES action with an false isLite", () => {
        const { dispatchSubscribeFixtureUpdates } = mapDispatchToProps;
        const urn = "urn:fake:event:1";
        const typename = "SomeFixture";

        expect(dispatchSubscribeFixtureUpdates(urn, typename, ScoreboardViewMode.DEFAULT)).toEqual({
          payload: { urn, typename, isLite: false },
          type: SUBSCRIBE_FIXTURE_UPDATES,
        });
      });
    });

    describe("and the viewMode is COUPON", () => {
      it("should dispatch SUBSCRIBE_FIXTURE_UPDATES action with an false isLite", () => {
        const { dispatchSubscribeFixtureUpdates } = mapDispatchToProps;
        const urn = "urn:fake:event:1";
        const typename = "SomeFixture";

        expect(dispatchSubscribeFixtureUpdates(urn, typename, ScoreboardViewMode.COUPON)).toEqual({
          payload: { urn, typename, isLite: false },
          type: SUBSCRIBE_FIXTURE_UPDATES,
        });
      });
    });

    describe("and the viewMode is SMALL", () => {
      it("should dispatch SUBSCRIBE_FIXTURE_UPDATES action with an true isLite", () => {
        const { dispatchSubscribeFixtureUpdates } = mapDispatchToProps;
        const urn = "urn:fake:event:1";
        const typename = "SomeFixture";

        expect(dispatchSubscribeFixtureUpdates(urn, typename, ScoreboardViewMode.SMALL)).toEqual({
          payload: { urn, typename, isLite: true },
          type: SUBSCRIBE_FIXTURE_UPDATES,
        });
      });
    });

    describe("and inplay is true", () => {
      it("should dispatch SUBSCRIBE_FIXTURE_UPDATES action with a true inplay", () => {
        const { dispatchSubscribeFixtureUpdates } = mapDispatchToProps;
        const urn = "urn:fake:event:1";
        const typename = "SomeFixture";
        const isInplay = true;

        expect(dispatchSubscribeFixtureUpdates(urn, typename, ScoreboardViewMode.SMALL, isInplay)).toEqual({
          payload: { urn, typename, isLite: true, isInplay: true },
          type: SUBSCRIBE_FIXTURE_UPDATES,
        });
      });
    });

    describe("and inplay is false", () => {
      it("should dispatch SUBSCRIBE_FIXTURE_UPDATES action with a false inplay", () => {
        const { dispatchSubscribeFixtureUpdates } = mapDispatchToProps;
        const urn = "urn:fake:event:1";
        const typename = "SomeFixture";
        const isInplay = false;

        expect(dispatchSubscribeFixtureUpdates(urn, typename, ScoreboardViewMode.SMALL, isInplay)).toEqual({
          payload: { urn, typename, isLite: true, isInplay: false },
          type: SUBSCRIBE_FIXTURE_UPDATES,
        });
      });
    });
  });

  describe("dispatchUnsubscribeFixtureUpdates", () => {
    it("should dispatch UNSUBSCRIBE_FIXTURE_UPDATES action", () => {
      const { dispatchUnsubscribeFixtureUpdates } = mapDispatchToProps;
      const urn = "urn:fake:event:1";
      const typename = "SomeFixture";

      expect(dispatchUnsubscribeFixtureUpdates(urn, typename)).toEqual({
        payload: { urn, typename },
        type: UNSUBSCRIBE_FIXTURE_UPDATES,
      });
    });
  });
});
