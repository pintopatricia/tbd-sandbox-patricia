import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import {
  currencyFormatWithDecimalPlaces,
  currencyFormatWithoutDecimalPlaces,
} from "../../formatters/currency-formatters";
import { formatTime } from "../../helpers/dates";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const getUserDetails = jest.fn();

jest.mock("@ppb/tbd-store/state/entities/user-details/user-details-selectors", () => ({
  createGetCountryLocalCurrencyCodeSelector: jest.fn(() => getUserDetails),
}));

jest.mock("../../helpers/dates", () => ({
  formatTime: jest.fn(),
}));

jest.mock("../../formatters/currency-formatters", () => ({
  currencyFormatWithDecimalPlaces: jest.fn(),
  currencyFormatWithoutDecimalPlaces: jest.fn(),
}));

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => {
  const getJackpotCardByURN = jest.fn();
  return {
    createCardByURNSelector: jest.fn(() => getJackpotCardByURN),
  };
});

jest.mock("../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));

jest.spyOn(global.console, "error").mockImplementation(() => jest.fn());

const getMockState = (state1, state2, state3) => ({
  layouts: {
    cards: {
      gamingjackpots: { urn: "props" },
    },
  },
  entities: {
    jackpots: {
      "ppb:jackpot:1": {
        urn: "ppb:jackpot:1",
        name: "Jackpot 1",
        value: 3008,
        state: state1,
        progress: 0,
        dropValue: 5000,
        dropTime: undefined,
        dropText: "Must drop by",
      },
      "ppb:jackpot:2": {
        urn: "ppb:jackpot:2",
        name: "Jackpot 2",
        value: 80050,
        state: state2,
        progress: 80,
        dropValue: 100000,
        dropTime: undefined,
        dropText: undefined,
      },
      "ppb:jackpot:3": {
        urn: "ppb:jackpot:3",
        name: "Jackpot 3",
        value: 80050,
        state: state3,
        progress: 80,
        dropValue: undefined,
        dropTime: new Date("2019-07-12 12:30:00"),
        dropText: undefined,
      },
    },
  },
});

describe("mapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("When there are only COLD jackpots", () => {
    it("should return props in the same order", () => {
      const getGamingJackpotCardByURN = createCardByURNSelector();

      getGamingJackpotCardByURN.mockReturnValue({
        type: "GAMING_JACKPOT_CARD",
        name: "name",
        logo: "logoUrl",
        jackpots: ["ppb:jackpot:1", "ppb:jackpot:2", "ppb:jackpot:3"],
      });

      getUserDetails.mockReturnValue({
        countryCode: "countryCode",
        currencyCode: "currencyCode",
        localeCode: "localeCode",
        localeCodeBcp47: "localeCodeBcp",
        timezone: "timezone",
      });

      currencyFormatWithDecimalPlaces.mockReturnValue("currencySymbol10.00");
      currencyFormatWithoutDecimalPlaces.mockReturnValue("currencySymbol13000");
      formatTime.mockReturnValue("formated time");

      const mapStateToProps = makeMapStateToProps();

      const props = mapStateToProps(getMockState("COLD", "COLD", "COLD"), { urn: "ppb:tbd:card:gamingJackpot:1" });
      expect(getGamingJackpotCardByURN).toHaveBeenCalledWith({ urn: "props" }, "ppb:tbd:card:gamingJackpot:1");
      expect(props).toEqual({
        state: "COLD",
        name: "name",
        logoUrl: "logoUrl",
        items: [
          {
            description: "Must drop by",
            progress: 0,
            state: "COLD",
            title: "Jackpot 1",
            value: "3008",
          },
          {
            description: "I18N.JACKPOT.DROP_BEFORE currencySymbol13000",
            progress: 80,
            state: "COLD",
            title: "Jackpot 2",
            value: "80050",
          },
          {
            description: "I18N.JACKPOT.DROP_BY formated time",
            progress: 80,
            state: "COLD",
            title: "Jackpot 3",
            value: "80050",
          },
        ],
        userDetails: {
          countryCode: "countryCode",
          currencyCode: "currencyCode",
          localeCode: "localeCode",
          localeCodeBcp47: "localeCodeBcp",
          timezone: "timezone",
        },
      });
    });
  });

  describe("When there is one HOT jackpot", () => {
    let getGamingJackpotCardByURN;

    beforeEach(() => {
      getGamingJackpotCardByURN = createCardByURNSelector();

      getGamingJackpotCardByURN.mockReturnValue({
        type: "GAMING_JACKPOT_CARD",
        name: "name",
        logo: "logoUrl",
        jackpots: ["ppb:jackpot:1", "ppb:jackpot:2", "ppb:jackpot:3"],
      });

      getUserDetails.mockReturnValue({
        countryCode: "countryCode",
        currencyCode: "currencyCode",
        localeCode: "localeCode",
        localeCodeBcp47: "localeCodeBcp",
        timezone: "timezone",
      });

      currencyFormatWithDecimalPlaces.mockReturnValue("currencySymbol10.00");
      currencyFormatWithoutDecimalPlaces.mockReturnValue("currencySymbol13000");
      formatTime.mockReturnValue("formated time");
    });

    it("should return props in correct order", () => {
      const mapStateToProps = makeMapStateToProps();

      const props = mapStateToProps(getMockState("COLD", "COLD", "HOT"), { urn: "ppb:tbd:card:gamingJackpot:1" });

      expect(getGamingJackpotCardByURN).toHaveBeenCalledWith({ urn: "props" }, "ppb:tbd:card:gamingJackpot:1");
      expect(props).toEqual({
        state: "HOT",
        name: "name",
        logoUrl: "logoUrl",
        items: [
          {
            description: "I18N.JACKPOT.DROP_BY formated time",
            progress: 80,
            state: "HOT",
            title: "Jackpot 3",
            value: "80050",
          },
          {
            description: "Must drop by",
            progress: 0,
            state: "COLD",
            title: "Jackpot 1",
            value: "3008",
          },
          {
            description: "I18N.JACKPOT.DROP_BEFORE currencySymbol13000",
            progress: 80,
            state: "COLD",
            title: "Jackpot 2",
            value: "80050",
          },
        ],
        userDetails: {
          countryCode: "countryCode",
          currencyCode: "currencyCode",
          localeCode: "localeCode",
          localeCodeBcp47: "localeCodeBcp",
          timezone: "timezone",
        },
      });
    });

    describe("when `getUserDetails` throws", () => {
      const GET_USER_DETAILS_ERROR = "GET_USER_DETAILS_ERROR";

      beforeEach(() => {
        getUserDetails.mockImplementationOnce(() => {
          throw new Error(GET_USER_DETAILS_ERROR);
        });
      });

      it("should call console.error with the error thrown by `getUserDetails`", () => {
        makeMapStateToProps()(getMockState("COLD", "COLD", "HOT"), { urn: "ppb:tbd:card:gamingJackpot:1" });

        expect(global.console.error).toHaveBeenCalledWith(new Error(GET_USER_DETAILS_ERROR));
      });

      it("should return an empty object", () => {
        expect(
          makeMapStateToProps()(getMockState("COLD", "COLD", "HOT"), { urn: "ppb:tbd:card:gamingJackpot:1" }),
        ).toEqual({});
      });
    });
  });

  describe("When there are 2 HOT jackpots", () => {
    it("should return props in the correct order", () => {
      const getGamingJackpotCardByURN = createCardByURNSelector();

      getGamingJackpotCardByURN.mockReturnValue({
        type: "GAMING_JACKPOT_CARD",
        name: "name",
        logo: "logoUrl",
        jackpots: ["ppb:jackpot:1", "ppb:jackpot:2", "ppb:jackpot:3"],
      });

      getUserDetails.mockReturnValue({
        countryCode: "countryCode",
        currencyCode: "currencyCode",
        localeCode: "localeCode",
        localeCodeBcp47: "localeCodeBcp",
        timezone: "timezone",
      });

      currencyFormatWithDecimalPlaces.mockReturnValue("currencySymbol10.00");
      currencyFormatWithoutDecimalPlaces.mockReturnValue("currencySymbol13000");
      formatTime.mockReturnValue("formated time");

      const mapStateToProps = makeMapStateToProps();

      const props = mapStateToProps(getMockState("COLD", "HOT", "HOT"), { urn: "ppb:tbd:card:gamingJackpot:1" });

      expect(getGamingJackpotCardByURN).toHaveBeenCalledWith({ urn: "props" }, "ppb:tbd:card:gamingJackpot:1");
      expect(props).toEqual({
        state: "HOT",
        name: "name",
        logoUrl: "logoUrl",
        items: [
          {
            description: "I18N.JACKPOT.DROP_BY formated time",
            progress: 80,
            state: "HOT",
            title: "Jackpot 3",
            value: "80050",
          },
          {
            description: "I18N.JACKPOT.DROP_BEFORE currencySymbol13000",
            progress: 80,
            state: "HOT",
            title: "Jackpot 2",
            value: "80050",
          },
          {
            description: "Must drop by",
            progress: 0,
            state: "COLD",
            title: "Jackpot 1",
            value: "3008",
          },
        ],
        userDetails: {
          countryCode: "countryCode",
          currencyCode: "currencyCode",
          localeCode: "localeCode",
          localeCodeBcp47: "localeCodeBcp",
          timezone: "timezone",
        },
      });
    });
  });

  it("should return an empty object when card does not exist", () => {
    const getGamingJackpotCardByURN = createCardByURNSelector();

    getGamingJackpotCardByURN.mockReturnValue(null);

    const mapStateToProps = makeMapStateToProps();

    const props = mapStateToProps(getMockState("COLD", "HOT", "HOT"), { urn: "ppb:tbd:card:gamingJackpot:1" });

    expect(getGamingJackpotCardByURN).toHaveBeenCalledWith({ urn: "props" }, "ppb:tbd:card:gamingJackpot:1");
    expect(props).toEqual({});
  });

  describe("dispatchSubscribeJackpot", () => {
    it("shoud dispatch dispatchSubscribeJackpot action", () => {
      const { dispatchSubscribeJackpot } = mapDispatchToProps;
      const urn = "fakeUrn";

      expect(dispatchSubscribeJackpot(urn)).toEqual({
        payload: { urn },
        type: "SUBSCRIBE_JACKPOT",
      });
    });
  });

  describe("dispatchUnsubscribeJackpot", () => {
    it("shoud dispatch dispatchUnsubscribeJackpot action", () => {
      const { dispatchUnsubscribeJackpot } = mapDispatchToProps;
      const urn = "fakeUrn";

      expect(dispatchUnsubscribeJackpot(urn)).toEqual({
        payload: { urn },
        type: "UNSUBSCRIBE_JACKPOT",
      });
    });
  });

  describe("dispatchJackpotMerchandiseView", () => {
    it("shoud dispatch dispatchJackpotMerchandiseView action", () => {
      const { dispatchJackpotMerchandiseView } = mapDispatchToProps;

      expect(dispatchJackpotMerchandiseView("COLD", "jackpot", "fakeUrn", "Jackpot 1, Jackpot 2, Jackpot 3")).toEqual({
        payload: {
          state: "normal",
          name: "jackpot",
          urn: "fakeUrn",
          elementText: "Jackpot 1, Jackpot 2, Jackpot 3",
        },
        type: "UI__JACKPOT_MERCHANDISE_VIEW",
      });
    });

    it("shoud dispatch dispatchJackpotMerchandiseView action when state is HOT", () => {
      const { dispatchJackpotMerchandiseView } = mapDispatchToProps;

      expect(dispatchJackpotMerchandiseView("HOT", "jackpot", "fakeUrn", "Jackpot 1, Jackpot 2, Jackpot 3")).toEqual({
        payload: {
          state: "hot",
          name: "jackpot",
          urn: "fakeUrn",
          elementText: "Jackpot 1, Jackpot 2, Jackpot 3",
        },
        type: "UI__JACKPOT_MERCHANDISE_VIEW",
      });
    });
  });
});
