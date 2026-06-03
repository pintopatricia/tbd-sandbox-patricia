import { mapEroOddsToLadder } from "@ppb/chart-tools";
import { TableCellColor } from "@ppb/the-wall-common/types";
import { createSelector } from "reselect";
import { ExchangeRunnerTraded } from "@ppb/tbd-store/state/entities/ExchangeRunnerTraded.types";
import { currencyFormatWithDecimalPlaces } from "../formatters/currency-formatters";
import { i18n } from "../helpers/i18n";

type MarketGraphData = {
  graphParams: string;
  exchangeRunner: ExchangeRunnerTraded;
  marketTotalMatched: number;
  marketName: string;
  marketId: string;
  selectionId: number;
  localeCode: string;
  localeCodeBcp47: string;
  currencyCode: string;
  runnerName: string;
};

export const createPropsForMarketGraphVm = () =>
  createSelector(
    [
      ({ graphParams }: MarketGraphData) => graphParams,
      ({ exchangeRunner }: MarketGraphData) => exchangeRunner,
      ({ marketTotalMatched }: MarketGraphData) => marketTotalMatched,
      ({ marketName }: MarketGraphData) => marketName,
      ({ marketId }: MarketGraphData) => marketId,
      ({ selectionId }: MarketGraphData) => selectionId,
      ({ localeCode }: MarketGraphData) => localeCode,
      ({ localeCodeBcp47 }: MarketGraphData) => localeCodeBcp47,
      ({ currencyCode }: MarketGraphData) => currencyCode,
      ({ runnerName }: MarketGraphData) => runnerName,
    ],
    (
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
    ) => {
      const formatValue = (value: number): string =>
        currencyFormatWithDecimalPlaces({
          currencyCode,
          localeCodeBcp47,
          value,
          decimalPlaces: 2,
        });

      const { traded, back, lay, lastPriceTraded, totalMatched: runnerTotalMatched = 0 } = exchangeRunner;

      const title = `${marketName} - ${runnerName}`;
      const lowestPriceMatched = exchangeRunner.traded[0]?.price;
      const highestPriceMatched = exchangeRunner.traded[exchangeRunner.traded.length - 1]?.price;
      const projectedBsp = exchangeRunner.sp?.nearPrice;
      const detailedSummary = [
        {
          title: i18n({ key: "I18N.MARKET_GRAPHS.OVERVIEW" }),
          groups: [
            {
              title: i18n({ key: "I18N.MARKET_GRAPHS.LAST_PRICE_MATCHED" }),
              amount: lastPriceTraded ? lastPriceTraded.toString() : "-",
            },
            {
              title: i18n({ key: "I18N.MARKET_GRAPHS.LOWEST_PRICE_MATCHED" }),
              amount: lowestPriceMatched ? lowestPriceMatched.toString() : "-",
            },
            {
              title: i18n({ key: "I18N.MARKET_GRAPHS.HIGHEST_PRICE_MATCHED" }),
              amount: highestPriceMatched ? highestPriceMatched.toString() : "-",
            },
            {
              title: i18n({ key: "I18N.MARKET_GRAPHS.PROJECTED_BSP" }),
              amount: projectedBsp ? projectedBsp.toFixed(2).toString() : "-",
            },
            {
              title: i18n({ key: "I18N.MARKET_GRAPHS.MATCHED_MARKET" }),
              amount: formatValue(marketTotalMatched),
            },
            {
              title: i18n({ key: "I18N.MARKET_GRAPHS.MATCHED_SELECTION" }),
              amount: formatValue(runnerTotalMatched),
            },
          ],
        },
      ];
      const oddsLadder = {
        back,
        lay,
        traded,
      };
      const ladder = mapEroOddsToLadder(oddsLadder);
      const tradedTable = ladder.map((row) => {
        const [price, toBack, toLay, amountTraded] = row;
        const isBack = toBack > 0;
        const isLay = toLay > 0;

        const formattedAmountTraded = amountTraded > 0 ? formatValue(amountTraded) : "";

        // toBack > 0
        if (isBack) {
          return [
            { value: price.toString(), color: TableCellColor.Blue },
            {
              value: formatValue(toBack),
              color: TableCellColor.Blue,
            },
            { value: "" },
            {
              value: formattedAmountTraded,
            },
          ];
        }

        // toLay > 0
        if (isLay) {
          return [
            { value: price.toString(), color: TableCellColor.Pink },
            { value: "" },
            {
              value: formatValue(toLay),
              color: TableCellColor.Pink,
            },
            {
              value: formattedAmountTraded,
            },
          ];
        }

        // toBack = 0 && toLay = 0
        return [
          { value: price.toString() },
          {
            value: "",
          },
          {
            value: "",
          },
          {
            value: formattedAmountTraded,
          },
        ];
      });

      const pebbleListItems = [
        {
          key: "price",
          value: i18n({ key: "I18N.MARKET_GRAPHS.PRICE" }),
        },
        {
          key: "chance",
          value: i18n({ key: "I18N.MARKET_GRAPHS.CHANCE" }),
        },
      ];

      return {
        title,
        traded: tradedTable,
        lastPriceTraded,
        detailedSummary,
        graphParams,
        marketId,
        selectionId,
        localeCode,
        localeCodeBcp47,
        currencyCode,
        pebbleListItems,
      };
    },
  );
