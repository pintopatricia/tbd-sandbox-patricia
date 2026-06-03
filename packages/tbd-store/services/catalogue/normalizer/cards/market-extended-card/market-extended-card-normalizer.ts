import { MarketExtendedCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { MarketExtendedCard } from "../../../../../state/layout/cards/Card.types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeMarketExtendedCardFragmentIntoMarketExtendedCard = (
  marketExtendedCard: MarketExtendedCardFragment,
): TransformedFragment<MarketExtendedCard> => {
  const {
    urn,
    viewLinks,
    cardTitle,
    cashoutQuotes,
    runnerViewLinks,
    displayRunners,
    isRunnerExpandable,
    raceViewLink,
    __typename,
    numberOfItemsToDisplay,
    marketPromo,
  } = marketExtendedCard;

  return {
    data: {
      typename: __typename,
      urn,
      viewLinks,
      title: cardTitle || undefined,
      displayRunners: {
        ...(!!displayRunners.exchange &&
          "urn" in displayRunners.exchange.market && {
            exchange: {
              market: displayRunners.exchange.market.urn,
              runners: displayRunners.exchange.runners.map((runner) => ({ urn: runner.runnerURN })),
            },
          }),
        ...(!!displayRunners.sportsbook &&
          "urn" in displayRunners.sportsbook.market && {
            sportsbook: {
              market: displayRunners.sportsbook.market.urn,
              runners: displayRunners.sportsbook.runners.map((runner) => ({ urn: runner.runnerURN })),
            },
          }),
      },
      cashoutQuotes: {
        exchangeCashoutQuotesURNs:
          cashoutQuotes?.exchangeCashoutQuotes
            ?.filter(({ value, profit }) => value && profit)
            .map((exchangeCashoutQuote) => exchangeCashoutQuote.urn) || [],
      },
      runnerViewLinks: runnerViewLinks.reduce(
        (acc, value) => ({
          ...acc,
          [value.runnerUrn]: {
            ...value,
          },
        }),
        {},
      ),
      isRunnerExpandable: isRunnerExpandable || undefined,
      raceViewLink: raceViewLink || undefined,
      numberOfItemsToDisplay: numberOfItemsToDisplay || undefined,
      marketPromo: marketPromo || undefined,
    },
  };
};

export default normalizeMarketExtendedCardFragmentIntoMarketExtendedCard;
