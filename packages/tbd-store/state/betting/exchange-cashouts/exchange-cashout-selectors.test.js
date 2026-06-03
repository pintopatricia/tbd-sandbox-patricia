import { CashoutStep } from "../../constants";
import {
  createExchangeCashoutQuoteSelector,
  createGetAllExchangeCashoutQuotesDisplayStatusSelector,
} from "./exchange-cashout-selectors";

const exchangeQuotes = [
  {
    urn: "ppb:quoteUrn1",
    marketUrn: "marketUrn1",
    value: 123,
    profit: 321,
    currentLiability: 1,
    status: "AVAILABLE",
    step: CashoutStep.DISPLAY,
  },
  {
    urn: "ppb:quoteUrn2",
    marketUrn: "marketUrn2",
    value: 123,
    profit: 321,
    currentLiability: 1,
    status: "AVAILABLE",
    step: CashoutStep.CONFIRM,
  },
  {
    urn: "ppb:quoteUrn3",
    marketUrn: "marketUrn3",
    value: 123,
    profit: 321,
    currentLiability: 1,
    status: "AVAILABLE",
    step: CashoutStep.HIDE,
  },
];

const stateMock = exchangeQuotes.reduce((acc, quote) => ({ ...acc, [quote.urn]: quote }), {});

describe('"exchangeQuote" selectors', () => {
  describe("createExchangeCashoutQuoteSelector", () => {
    const getExchangeCashoutQuoteByURN = createExchangeCashoutQuoteSelector();

    it("should return the correct cashout quote", () => {
      expect(getExchangeCashoutQuoteByURN(stateMock, "ppb:quoteUrn1")).toStrictEqual(exchangeQuotes[0]);
    });

    describe("when the selector is called again and quote relevant data didn't change", () => {
      const firstCall = getExchangeCashoutQuoteByURN(stateMock, "ppb:quoteUrn1");
      const secondCall = getExchangeCashoutQuoteByURN({ ...stateMock, newProp: "newData" }, "ppb:quoteUrn1");

      it("should return the same quote object", () => {
        expect(firstCall === secondCall).toBe(true);
      });
    });

    describe("when the selector is called again but any quote relevant data changed", () => {
      const firstCall = getExchangeCashoutQuoteByURN(stateMock, "ppb:quoteUrn1");
      const secondCall = getExchangeCashoutQuoteByURN(
        {
          "ppb:quoteUrn1": { ...exchangeQuotes[0], profit: 10 },
        },
        "ppb:quoteUrn1",
      );

      it("should return a different quote object", () => {
        expect(firstCall === secondCall).toBe(false);
      });
    });

    describe("when the selector is called again with undefined quote", () => {
      const firstCall = getExchangeCashoutQuoteByURN(stateMock, "ppb:quoteUrn1");
      const secondCall = getExchangeCashoutQuoteByURN(
        {
          "ppb:quoteUrn1": undefined,
        },
        "ppb:quoteUrn1",
      );

      it("should return a different quote object", () => {
        expect(firstCall === secondCall).toBe(false);
      });
    });

    describe("when quote data is undefined and the selector is called again with defined quote", () => {
      const firstCall = getExchangeCashoutQuoteByURN(
        {
          "ppb:quoteUrn1": undefined,
        },
        "ppb:quoteUrn1",
      );
      const secondCall = getExchangeCashoutQuoteByURN(stateMock, "ppb:quoteUrn1");

      it("should return a different quote object", () => {
        expect(firstCall === secondCall).toBe(false);
      });
    });
  });

  describe("createGetAllExchangeCashoutQuotesDisplayStatusSelector", () => {
    const getAllExchangeCashoutQuotesDisplayStatus = createGetAllExchangeCashoutQuotesDisplayStatusSelector();

    it("should return an all current cashout quote steps display status mapped by URN", () => {
      expect(getAllExchangeCashoutQuotesDisplayStatus(stateMock)).toStrictEqual({
        "ppb:quoteUrn1": true,
        "ppb:quoteUrn2": true,
        "ppb:quoteUrn3": false,
      });
    });

    describe("when the selector is called again and none of quotes step didn't change", () => {
      const firstCall = getAllExchangeCashoutQuotesDisplayStatus(stateMock);
      const secondCall = getAllExchangeCashoutQuotesDisplayStatus({ ...stateMock });

      it("should return the same mapped object with the quotes display status", () => {
        expect(firstCall === secondCall).toBe(true);
      });
    });

    describe("when the selector is called again but at least one quote step has changed", () => {
      const newStateMock = { ...stateMock };
      newStateMock["ppb:quoteUrn2"] = { ...newStateMock["ppb:quoteUrn2"], step: CashoutStep.CASHING_OUT };

      const firstCall = getAllExchangeCashoutQuotesDisplayStatus(stateMock);
      const secondCall = getAllExchangeCashoutQuotesDisplayStatus(newStateMock);

      it("should return a different mapped object with the quotes display status", () => {
        expect(firstCall === secondCall).toBe(false);
      });
    });

    describe("when the selector is called again and none of quotes step didn't change but a new quote has been added", () => {
      const newStateMock = {
        ...stateMock,
        "ppb:quoteUrn4": {
          urn: "ppb:quoteUrn4",
          marketUrn: "marketUrn4",
          value: 123,
          profit: 321,
          status: "AVAILABLE",
          step: CashoutStep.HIDE,
        },
      };

      const firstCall = getAllExchangeCashoutQuotesDisplayStatus(stateMock);
      const secondCall = getAllExchangeCashoutQuotesDisplayStatus(newStateMock);

      it("should return a different mapped object with the quotes display status", () => {
        expect(firstCall === secondCall).toBe(false);
      });
    });
  });
});
