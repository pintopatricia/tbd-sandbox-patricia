import { CashoutStep } from "../../constants";
import {
  getQuoteByBetURN,
  createSportsbookCashoutQuoteSelector,
  createIsSportsbookCashoutQuoteDisplayedSelector,
} from "./sportsbook-cashout-selectors";

const sportsbookQuotes = [
  {
    urn: "ppb:quoteUrn1",
    betUrn: "ppb:sbkBet:1",
    cashOutToken: "cashOutToken1",
    quote: 2,
    refreshRate: 10,
    stake: 2,
    betDelay: 0,
    status: "AVAILABLE",
    step: CashoutStep.DISPLAY,
  },
  {
    urn: "ppb:quoteUrn2",
    betUrn: "ppb:sbkBet:2",
    cashOutToken: "cashOutToken2",
    quote: 2,
    refreshRate: 10,
    stake: 2,
    betDelay: 0,
    status: "AVAILABLE",
    step: CashoutStep.CONFIRM,
  },
  {
    urn: "ppb:quoteUrn3",
    betUrn: "ppb:sbkBet:3",
    cashOutToken: "cashOutToken3",
    quote: 2,
    refreshRate: 10,
    stake: 2,
    betDelay: 0,
    status: "AVAILABLE",
    step: CashoutStep.HIDE,
  },
];

const stateMock = sportsbookQuotes.reduce((acc, quote) => ({ ...acc, [quote.urn]: quote }), {});

describe("sportsbookQuote selectors", () => {
  describe("getQuoteByBetURN", () => {
    it("should return undefined when no quote has the required betUrn", () => {
      const quote = getQuoteByBetURN(stateMock, "RANDOM_URN");
      expect(quote).toBe(undefined);
    });

    it("should return the respective quote when no quote has the required betUrn", () => {
      const quote = getQuoteByBetURN(stateMock, sportsbookQuotes[0].betUrn);
      expect(quote).toEqual(sportsbookQuotes[0]);
    });
  });

  describe("createSportsbookCashoutQuoteSelector", () => {
    const getSportsbookCashoutQuoteByURN = createSportsbookCashoutQuoteSelector();

    it("should return the correct cashout quote", () => {
      expect(getSportsbookCashoutQuoteByURN(stateMock, "ppb:quoteUrn1")).toStrictEqual(sportsbookQuotes[0]);
    });

    describe("when called again and quote's relevant data haven't change", () => {
      const firstCall = getSportsbookCashoutQuoteByURN(stateMock, "ppb:quoteUrn1");
      const secondCall = getSportsbookCashoutQuoteByURN({ ...stateMock, newProp: "newData" }, "ppb:quoteUrn1");

      it("should return the same quote object", () => {
        expect(firstCall === secondCall).toBe(true);
      });
    });

    describe("when called again and quote's relevant data have changed", () => {
      const firstCall = getSportsbookCashoutQuoteByURN(stateMock, "ppb:quoteUrn1");
      const secondCall = getSportsbookCashoutQuoteByURN(
        {
          "ppb:quoteUrn1": { ...sportsbookQuotes[0], stake: 10 },
        },
        "ppb:quoteUrn1",
      );

      it("should return a different quote object", () => {
        expect(firstCall === secondCall).toBe(false);
      });
    });

    describe("when called again with one undefined quote", () => {
      const firstCall = getSportsbookCashoutQuoteByURN(stateMock, "ppb:quoteUrn1");
      const secondCall = getSportsbookCashoutQuoteByURN(
        {
          "ppb:quoteUrn1": undefined,
        },
        "ppb:quoteUrn1",
      );

      it("should return a different quote object", () => {
        expect(firstCall === secondCall).toBe(false);
      });
    });

    describe("when called again with an defined quote over a previous undefined state", () => {
      const firstCall = getSportsbookCashoutQuoteByURN(
        {
          "ppb:quoteUrn1": undefined,
        },
        "ppb:quoteUrn1",
      );
      const secondCall = getSportsbookCashoutQuoteByURN(stateMock, "ppb:quoteUrn1");

      it("should return a different quote object", () => {
        expect(firstCall === secondCall).toBe(false);
      });
    });
  });

  describe("createIsSportsbookCashoutQuoteDisplayedSelector", () => {
    const getIsSportsbookCashoutQuoteDisplayedByURN = createIsSportsbookCashoutQuoteDisplayedSelector();

    it("should return true when the cashout quote step is not HIDE", () => {
      expect(getIsSportsbookCashoutQuoteDisplayedByURN(stateMock, "ppb:quoteUrn2")).toStrictEqual(true);
    });

    it("should return false when the cashout quote step is HIDE", () => {
      expect(getIsSportsbookCashoutQuoteDisplayedByURN(stateMock, "ppb:quoteUrn3")).toStrictEqual(false);
    });
  });
});
