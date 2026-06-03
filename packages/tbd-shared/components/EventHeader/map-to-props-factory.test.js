import { IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import { makeMapStateToProps } from "./map-to-props-factory";
import { formatDateWithToday, formatStartTime } from "../../helpers/dates";

const getExchangeMarketByURN = jest.fn();
var getSportsbookMarketByURN = jest.fn();
const getUserDetails = jest.fn();

jest.mock("@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors", () => ({
  createSportsbookMarketByURNSelector: () => getSportsbookMarketByURN,
}));

jest.mock("@ppb/tbd-store/state/entities/exchange-markets/exchange-market-selectors", () => ({
  createExchangeMarketSelector: () => getExchangeMarketByURN,
}));

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => getUserDetails),
}));

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

jest.mock("../../helpers/dates", () => ({
  formatStartTime: jest.fn(() => "FULL DATE FORMAT"),
  formatDateWithToday: jest.fn(() => "DATE FORMAT"),
  formatTime: jest.fn(() => "TIME FORMAT"),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("@ppb/tbd-store/state/entities/sport-events/sport-event-selectors", () => ({
  createSportEventByURNSelector: jest.fn(() => getSportEventByURN),
}));

jest.mock("@ppb/tbd-store/state/entities/competitions/competition-selectors", () => ({
  createCompetitionSelector: jest.fn(() => getCompetitionByURN),
}));

const GENERIC_STATE = {
  layouts: {},
  entities: {
    sportevents: "sportevents",
    competitions: "competitions",
    exchangemarkets: "exchangemarkets",
    sportsbookmarkets: "sportsbookmarkets",
  },
};

const EXPECTED_BASE_FIXTURE_PROPS = {
  awayRunnerName: undefined,
  date: "DATE FORMAT",
  dateTime: new Date("2021-05-07T19:00:00.000Z"),
  homeRunnerName: undefined,
  inPlay: "I18N.SPORT_EVENT.IN_PLAY",
  subtitle: "FULL DATE FORMAT",
  tertiaryTitle: "competition name",
  time: "TIME FORMAT",
  title: "event name",
  viewMode: "DEFAULT",
  sporteventURN: "ppb:event:30459295",
  showBorder: true,
};

const setupMapStateToProps = (state = GENERIC_STATE, containerExtraProps = {}) => {
  const containerProps = {
    exchangeURN: "ppb:excMarket:1.11111",
    sportsbookURN: "ppb:sbkMarket:924.111111",
    sporteventURN: "ppb:event:30459295",
    viewMode: "DEFAULT",
    showBottomSeparator: true,
    showTertiaryTitle: true,
    iconsList: undefined,
    ...containerExtraProps,
  };
  return makeMapStateToProps()(state, containerProps);
};

describe("makeMapStateToProps", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  let stateProps;

  it("should get data from state and build correct view model", () => {
    getExchangeMarketByURN.mockReturnValue({
      urn: "ppb:excMarket:1.184779900",
      name: "Set Betting",
      marketId: "1.184779900",
      sportevent: "ppb:event:30646946",
      competition: "ppb:competition:12290431",
      sport: "ppb:eventType:2",
      status: "OPEN",
      type: "SET_BETTING",
      inplay: true,
      bettingType: "ODDS",
      marketType: "SET_BETTING",
      isAccaFreezeEligible: false,
    });
    getUserDetails.mockReturnValue({
      localeCodeBcp47: "locale",
      timezone: "timezone",
    });

    const state = {
      ...GENERIC_STATE,
      entities: {
        throttles: {
          ACCA_FREEZE: {
            isActive: false,
          },
        },
      },
      router: {
        currentUrn: "ppb:tbd:view:generic:coupon:1234",
      },
    };

    stateProps = setupMapStateToProps(state);

    expect(getSportEventByURN).toHaveBeenCalledTimes(1);
    expect(getSportEventByURN).toHaveBeenCalledWith(state.entities.sportevents, "ppb:event:30459295");
    expect(getCompetitionByURN).toHaveBeenCalledTimes(1);
    expect(getCompetitionByURN).toHaveBeenCalledWith(state.entities.competitions, "ppb:competition:10932509");
    expect(getExchangeMarketByURN).toHaveBeenCalledTimes(1);
    expect(getExchangeMarketByURN).toHaveBeenCalledWith(state.entities.exchangemarkets, "ppb:excMarket:1.11111");
    expect(getSportsbookMarketByURN).toHaveBeenCalledTimes(1);
    expect(getSportsbookMarketByURN).toHaveBeenCalledWith(state.entities.sportsbookmarkets, "ppb:sbkMarket:924.111111");
    expect(getUserDetails).toHaveBeenNthCalledWith(1, state);
    expect(formatStartTime).toHaveBeenCalledWith(new Date("2021-05-07T19:00:00.000Z"), "locale", "timezone");

    expect(stateProps).toEqual({
      ...EXPECTED_BASE_FIXTURE_PROPS,
      isSticky: undefined,
      iconsList: undefined,
    });
  });

  it("should return an undefined tertiary title if showTertiaryTitle prop is false", () => {
    getExchangeMarketByURN.mockReturnValue({
      urn: "ppb:excMarket:1.184779900",
      name: "Set Betting",
      marketId: "1.184779900",
      sportevent: "ppb:event:30646946",
      competition: "ppb:competition:12290431",
      sport: "ppb:eventType:2",
      status: "OPEN",
      type: "SET_BETTING",
      inplay: true,
      bettingType: "ODDS",
      marketType: "SET_BETTING",
      isAccaFreezeEligible: false,
    });

    stateProps = setupMapStateToProps(
      {
        ...GENERIC_STATE,
        entities: {
          throttles: {
            ACCA_FREEZE: {
              isActive: false,
            },
          },
        },
        router: {
          currentUrn: "ppb:tbd:view:generic:coupon:1234",
        },
      },
      { showTertiaryTitle: false },
    );

    expect(stateProps).toEqual({
      ...EXPECTED_BASE_FIXTURE_PROPS,
      tertiaryTitle: undefined,
      isSticky: undefined,
      iconsList: undefined,
    });
  });

  it("should return an empty object if sportevent doesn't exists in state", () => {
    getSportEventByURN.mockReturnValueOnce(undefined);
    stateProps = setupMapStateToProps({
      entities: {
        throttles: {
          ACCA_FREEZE: {
            isActive: false,
          },
        },
      },
      router: {
        currentUrn: "ppb:tbd:view:generic:coupon:1234",
      },
    });

    expect(getSportEventByURN).toHaveBeenCalledTimes(1);
    expect(getCompetitionByURN).toHaveBeenCalledTimes(0);

    expect(stateProps).toEqual({});
  });

  describe("when exchange market has runners", () => {
    it("should return home and away runner name from exchange market", () => {
      getExchangeMarketByURN.mockReturnValue({
        urn: "ppb:excMarket:1.184779900",
        name: "Set Betting",
        marketId: "1.184779900",
        sportevent: "ppb:event:30646946",
        competition: "ppb:competition:12290431",
        sport: "ppb:eventType:2",
        status: "OPEN",
        type: "SET_BETTING",
        inplay: true,
        bettingType: "ODDS",
        marketType: "SET_BETTING",
        runners: [{ name: "teamA" }, { name: "teamB" }],
        isAccaFreezeEligible: false,
      });

      stateProps = setupMapStateToProps({
        ...GENERIC_STATE,
        entities: {
          throttles: {
            ACCA_FREEZE: {
              isActive: false,
            },
          },
        },
        router: {
          currentUrn: "ppb:tbd:view:generic:coupon:1234",
        },
      });

      expect(stateProps).toEqual({
        ...EXPECTED_BASE_FIXTURE_PROPS,
        homeRunnerName: "teamA",
        awayRunnerName: "teamB",
        isSticky: undefined,
        iconsList: undefined,
      });
    });
  });

  describe("when sportsbook market has runners", () => {
    it("should return home and away runner name from sportsbook market", () => {
      getExchangeMarketByURN.mockReturnValueOnce(undefined);
      getSportsbookMarketByURN.mockReturnValueOnce({
        runners: [{ name: "team X" }, { name: "team Y" }, { name: "team Z" }],
        isAccaFreezeEligible: false,
      });
      formatDateWithToday.mockReturnValueOnce("I18N.DATE.TODAY");
      stateProps = setupMapStateToProps({
        entities: {
          throttles: {
            ACCA_FREEZE: {
              isActive: false,
            },
          },
        },
        router: {
          currentUrn: "ppb:tbd:view:generic:coupon:1234",
        },
      });

      expect(stateProps).toEqual({
        ...EXPECTED_BASE_FIXTURE_PROPS,
        date: "I18N.DATE.TODAY",
        dateTime: new Date("2021-05-07T19:00:00.000Z"),
        inPlay: undefined,
        homeRunnerName: "team X",
        awayRunnerName: "team Z",
        isSticky: undefined,
        iconsList: undefined,
      });
    });

    it("should return home and away runner name from sportsbook market when has displayRunners", () => {
      getExchangeMarketByURN.mockReturnValueOnce(undefined);
      getSportsbookMarketByURN.mockReturnValueOnce({
        runners: [
          { name: "team X", urn: "ppb:sbkRunner:1234" },
          { name: "team H", urn: "ppb:sbkRunner:1235" },
          { name: "team Z", urn: "ppb:sbkRunner:1236" },
        ],
        isSticky: undefined,
        isAccaFreezeEligible: false,
      });
      formatDateWithToday.mockReturnValueOnce("I18N.DATE.TODAY");

      stateProps = setupMapStateToProps(
        {
          ...GENERIC_STATE,
          entities: {
            throttles: {
              ACCA_FREEZE: {
                isActive: false,
              },
            },
          },
          router: {
            currentUrn: "ppb:tbd:view:generic:coupon:1234",
          },
        },
        {
          displayRunners: ["ppb:sbkRunner:1234", "ppb:sbkRunner:1235", "ppb:sbkRunner:1236"],
        },
      );

      expect(stateProps).toEqual({
        ...EXPECTED_BASE_FIXTURE_PROPS,
        date: "I18N.DATE.TODAY",
        dateTime: new Date("2021-05-07T19:00:00.000Z"),
        inPlay: undefined,
        homeRunnerName: "team X",
        awayRunnerName: "team Z",
        isSticky: undefined,
        iconsList: undefined,
      });
    });
  });

  describe("acca freeze", () => {
    describe("when throttle is disabled and market is eligible", () => {
      it("should have iconsList without accaFreeze icon", () => {
        getExchangeMarketByURN.mockReturnValueOnce(undefined);
        getSportsbookMarketByURN.mockReturnValueOnce({
          runners: [
            { name: "team X", urn: "ppb:sbkRunner:1234" },
            { name: "team H", urn: "ppb:sbkRunner:1235" },
            { name: "team Z", urn: "ppb:sbkRunner:1236" },
          ],
          isSticky: undefined,
          isAccaFreezeEligible: true,
        });
        formatDateWithToday.mockReturnValueOnce("I18N.DATE.TODAY");

        stateProps = setupMapStateToProps(
          {
            ...GENERIC_STATE,
            entities: {
              throttles: {
                ACCA_FREEZE: {
                  isActive: false,
                },
              },
            },
            router: {
              currentUrn: "ppb:tbd:view:generic:coupon:1234",
            },
          },
          {
            displayRunners: ["ppb:sbkRunner:1234", "ppb:sbkRunner:1235", "ppb:sbkRunner:1236"],
            iconsList: [],
          },
        );

        expect(stateProps.iconsList).not.toContain(IconsList.ACCA_FREEZE_PROMO);
      });
    });

    describe("when throttle is enabled and market is eligible", () => {
      it("should have iconsList with accaFreeze icon", () => {
        getExchangeMarketByURN.mockReturnValueOnce(undefined);
        getSportsbookMarketByURN.mockReturnValueOnce({
          runners: [
            { name: "team X", urn: "ppb:sbkRunner:1234" },
            { name: "team H", urn: "ppb:sbkRunner:1235" },
            { name: "team Z", urn: "ppb:sbkRunner:1236" },
          ],
          isSticky: undefined,
          isAccaFreezeEligible: true,
        });
        formatDateWithToday.mockReturnValueOnce("I18N.DATE.TODAY");

        stateProps = setupMapStateToProps(
          {
            ...GENERIC_STATE,
            entities: {
              throttles: {
                ACCA_FREEZE: {
                  isActive: true,
                },
              },
            },
            router: {
              currentUrn: "ppb:tbd:view:generic:coupon:1234",
            },
          },
          {
            displayRunners: ["ppb:sbkRunner:1234", "ppb:sbkRunner:1235", "ppb:sbkRunner:1236"],
            iconsList: [],
          },
        );

        expect(stateProps.iconsList).toContain(IconsList.ACCA_FREEZE_PROMO);
      });
    });

    describe("when view is homepage", () => {
      it("should have acca freeze icon", () => {
        getExchangeMarketByURN.mockReturnValueOnce(undefined);
        getSportsbookMarketByURN.mockReturnValueOnce({
          runners: [
            { name: "team X", urn: "ppb:sbkRunner:1234" },
            { name: "team H", urn: "ppb:sbkRunner:1235" },
            { name: "team Z", urn: "ppb:sbkRunner:1236" },
          ],
          isSticky: undefined,
          isAccaFreezeEligible: true,
        });
        formatDateWithToday.mockReturnValueOnce("I18N.DATE.TODAY");

        stateProps = setupMapStateToProps(
          {
            ...GENERIC_STATE,
            entities: {
              throttles: {
                ACCA_FREEZE: {
                  isActive: true,
                },
              },
            },
            router: {
              currentUrn: "ppb:tbd:view:generic:home",
            },
          },
          {
            displayRunners: ["ppb:sbkRunner:1234", "ppb:sbkRunner:1235", "ppb:sbkRunner:1236"],
          },
        );

        expect(stateProps.iconsList).toContain(IconsList.ACCA_FREEZE_PROMO);
      });
    });

    describe("when the view is not homepage", () => {
      it("should have iconsList with accaFreeze icon", () => {
        getExchangeMarketByURN.mockReturnValueOnce(undefined);
        getSportsbookMarketByURN.mockReturnValueOnce({
          runners: [
            { name: "team X", urn: "ppb:sbkRunner:1234" },
            { name: "team H", urn: "ppb:sbkRunner:1235" },
            { name: "team Z", urn: "ppb:sbkRunner:1236" },
          ],
          isSticky: undefined,
          isAccaFreezeEligible: true,
        });
        formatDateWithToday.mockReturnValueOnce("I18N.DATE.TODAY");

        stateProps = setupMapStateToProps(
          {
            ...GENERIC_STATE,
            entities: {
              throttles: {
                ACCA_FREEZE: {
                  isActive: true,
                },
              },
            },
            router: {
              currentUrn: "ppb:tbd:view:generic:coupon:1234",
            },
          },
          {
            displayRunners: ["ppb:sbkRunner:1234", "ppb:sbkRunner:1235", "ppb:sbkRunner:1236"],
            router: {
              currentUrn: "ppb:tbd:view:generic:1234",
            },
          },
        );

        expect(stateProps.iconsList).toContain(IconsList.ACCA_FREEZE_PROMO);
      });
    });

    describe("when the market is in play", () => {
      it("should have iconsList as undefined", () => {
        getExchangeMarketByURN.mockReturnValueOnce(undefined);
        getSportsbookMarketByURN.mockReturnValueOnce({
          runners: [
            { name: "team X", urn: "ppb:sbkRunner:1234" },
            { name: "team H", urn: "ppb:sbkRunner:1235" },
            { name: "team Z", urn: "ppb:sbkRunner:1236" },
          ],
          isSticky: undefined,
          isAccaFreezeEligible: true,
          inplay: true,
        });
        formatDateWithToday.mockReturnValueOnce("I18N.DATE.TODAY");

        stateProps = setupMapStateToProps(
          {
            ...GENERIC_STATE,
            entities: {
              throttles: {
                ACCA_FREEZE: {
                  isActive: true,
                },
              },
            },
            router: {
              currentUrn: "ppb:tbd:view:generic:coupon:1234",
            },
          },
          {
            displayRunners: ["ppb:sbkRunner:1234", "ppb:sbkRunner:1235", "ppb:sbkRunner:1236"],
            router: {
              currentUrn: "ppb:tbd:view:generic:1234",
            },
          },
        );

        expect(stateProps.iconsList).toBeUndefined();
      });
    });
  });
});
