import { mapEroOddsToLadder } from "@ppb/chart-tools";
import { currencyFormatWithDecimalPlaces } from "../formatters/currency-formatters";
import { createPropsForMarketGraphVm } from "./connected-market-graph";

jest.mock("../formatters/currency-formatters", () => ({
  currencyFormatWithDecimalPlaces: jest.fn((props) => `€${props.value}`),
}));

jest.mock("@ppb/chart-tools", () => ({
  mapEroOddsToLadder: jest.fn().mockReturnValue([
    [1.01, 154, 0, 0],
    [6.03, 0, 300, 150],
    [1000, 0, 0, 150],
  ]),
}));

jest.mock("../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));

const exchangeRunner = {
  back: ["back"],
  lay: ["lay"],
  traded: [
    { price: 1, liquidity: 100 },
    { price: 2, liquidity: 200 },
  ],
  sp: {
    nearPrice: 2.2131,
    farPrice: 3.123,
  },
  lastPriceTraded: 77,
  totalMatched: 444,
};

const graphParams = "graphParams";
const marketTotalMatched = 3000;
const marketName = "marketName";
const marketId = "1.11111111";
const selectionId = 123;
const localeCode = "localeCode";
const localeCodeBcp47 = "localeCodeBcp47";
const currencyCode = "currencyCode";
const runnerName = "runnerName";
const pebbleListItems = [
  {
    key: "price",
    value: "I18N.MARKET_GRAPHS.PRICE",
  },
  {
    key: "chance",
    value: "I18N.MARKET_GRAPHS.CHANCE",
  },
];
describe("createPropsForMarketGraphVm", () => {
  it("should mapEroOddsToLadder", () => {
    createPropsForMarketGraphVm()({
      graphParams,
      exchangeRunner,
      marketTotalMatched,
      marketName,
      marketId,
      selectionId,
      localeCode,
      localeCodeBcp47,
      currencyCode,
      runnerName,
    });

    expect(mapEroOddsToLadder).toHaveBeenCalledWith({
      back: ["back"],
      lay: ["lay"],
      traded: [
        { liquidity: 100, price: 1 },
        { liquidity: 200, price: 2 },
      ],
    });
  });

  it("should format currency", () => {
    createPropsForMarketGraphVm()({
      graphParams,
      exchangeRunner,
      marketTotalMatched,
      marketName,
      marketId,
      selectionId,
      localeCode,
      localeCodeBcp47,
      currencyCode,
      runnerName,
    });

    expect(currencyFormatWithDecimalPlaces.mock.calls).toContainEqual(
      [
        {
          currencyCode: "currencyCode",
          decimalPlaces: 2,
          localeCodeBcp47: "localeCodeBcp47",
          value: 3000,
        },
      ],
      [
        {
          currencyCode: "currencyCode",
          decimalPlaces: 2,
          localeCodeBcp47: "localeCodeBcp47",
          value: 0,
        },
      ],
      [
        {
          currencyCode: "currencyCode",
          decimalPlaces: 2,
          localeCodeBcp47: "localeCodeBcp47",
          value: 150,
        },
      ],
      [
        {
          currencyCode: "currencyCode",
          decimalPlaces: 2,
          localeCodeBcp47: "localeCodeBcp47",
          value: 150,
        },
      ],
      [
        {
          currencyCode: "currencyCode",
          decimalPlaces: 2,
          localeCodeBcp47: "localeCodeBcp47",
          value: 3000,
        },
      ],
      [
        {
          currencyCode: "currencyCode",
          decimalPlaces: 2,
          localeCodeBcp47: "localeCodeBcp47",
          value: 0,
        },
      ],
      [
        {
          currencyCode: "currencyCode",
          decimalPlaces: 2,
          localeCodeBcp47: "localeCodeBcp47",
          value: 150,
        },
      ],
      [
        {
          currencyCode: "currencyCode",
          decimalPlaces: 2,
          localeCodeBcp47: "localeCodeBcp47",
          value: 150,
        },
      ],
    );
  });

  it("should return a market graph props", () => {
    const result = createPropsForMarketGraphVm()({
      graphParams,
      exchangeRunner,
      marketTotalMatched,
      marketName,
      marketId,
      selectionId,
      localeCode,
      localeCodeBcp47,
      currencyCode,
      runnerName,
    });

    expect(result).toStrictEqual({
      currencyCode: "currencyCode",
      detailedSummary: [
        {
          groups: [
            { amount: "77", title: "I18N.MARKET_GRAPHS.LAST_PRICE_MATCHED" },
            { amount: "1", title: "I18N.MARKET_GRAPHS.LOWEST_PRICE_MATCHED" },
            { amount: "2", title: "I18N.MARKET_GRAPHS.HIGHEST_PRICE_MATCHED" },
            { amount: "2.21", title: "I18N.MARKET_GRAPHS.PROJECTED_BSP" },
            { amount: "€3000", title: "I18N.MARKET_GRAPHS.MATCHED_MARKET" },
            { amount: "€444", title: "I18N.MARKET_GRAPHS.MATCHED_SELECTION" },
          ],
          title: "I18N.MARKET_GRAPHS.OVERVIEW",
        },
      ],
      graphParams: "graphParams",
      lastPriceTraded: 77,
      localeCode: "localeCode",
      localeCodeBcp47: "localeCodeBcp47",
      marketId: "1.11111111",
      selectionId: 123,
      title: "marketName - runnerName",
      pebbleListItems,
      traded: [
        [
          {
            color: "blue",
            value: "1.01",
          },
          {
            color: "blue",
            value: "€154",
          },
          {
            value: "",
          },
          {
            value: "",
          },
        ],
        [
          {
            color: "pink",
            value: "6.03",
          },
          {
            value: "",
          },
          {
            color: "pink",
            value: "€300",
          },
          {
            value: "€150",
          },
        ],
        [
          {
            value: "1000",
          },
          {
            value: "",
          },
          {
            value: "",
          },
          {
            value: "€150",
          },
        ],
      ],
    });
  });

  it("should return default values when props are missing", () => {
    const result = createPropsForMarketGraphVm()({
      graphParams,
      exchangeRunner: {
        back: ["back"],
        lay: ["lay"],
        traded: [],
      },
      marketTotalMatched,
      marketName,
      marketId,
      selectionId,
      localeCode,
      localeCodeBcp47,
      currencyCode,
      runnerName,
    });

    expect(result.detailedSummary).toEqual([
      {
        groups: [
          { amount: "-", title: "I18N.MARKET_GRAPHS.LAST_PRICE_MATCHED" },
          { amount: "-", title: "I18N.MARKET_GRAPHS.LOWEST_PRICE_MATCHED" },
          { amount: "-", title: "I18N.MARKET_GRAPHS.HIGHEST_PRICE_MATCHED" },
          { amount: "-", title: "I18N.MARKET_GRAPHS.PROJECTED_BSP" },
          { amount: "€3000", title: "I18N.MARKET_GRAPHS.MATCHED_MARKET" },
          { amount: "€0", title: "I18N.MARKET_GRAPHS.MATCHED_SELECTION" },
        ],
        title: "I18N.MARKET_GRAPHS.OVERVIEW",
      },
    ]);
  });
});
