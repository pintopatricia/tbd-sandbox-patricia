import { MarketCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { MarketCard } from "../../../../../state/layout/cards/Card.types";
import { TransformedFragment } from "../../Normalizer.types";
import { normalizeBlurbFragment } from "../blurb-card/blurb-card-normalizer";

const normalizeMarketCardFragmentIntoMarketCard = (marketCard: MarketCardFragment): TransformedFragment<MarketCard> => {
  const {
    urn,
    viewLinks,
    cardTitle,
    runnerViewLinks,
    displayRunners,
    isRunnerExpandable,
    template,
    numberOfItemsToDisplay,
    __typename,
    marketPromo,
    blurbs,
    firstPlayer,
    players,
    stat,
  } = marketCard;

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
              runners: displayRunners.exchange.runners.map((runner) => ({
                urn: runner.runnerURN,
              })),
            },
          }),
        ...(!!displayRunners.sportsbook &&
          "urn" in displayRunners.sportsbook.market && {
            sportsbook: {
              market: displayRunners.sportsbook.market.urn,
              runners: displayRunners.sportsbook.runners.map((runner) => ({
                urn: runner.runnerURN,
                participantId: runner.participantId,
              })),
            },
          }),
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
      template,
      numberOfItemsToDisplay: numberOfItemsToDisplay || undefined,
      marketPromo: marketPromo ? { ...marketPromo, isExpanded: false } : undefined,
      infoBlurbs: (blurbs || [])
        .filter((blurb): blurb is NonNullable<typeof blurb> => !!blurb)
        .map((blurb) => normalizeBlurbFragment(blurb)),
      firstPlayer: firstPlayer?.edges[0]?.node
        ? {
            urn: firstPlayer?.edges[0]?.node.urn,
            typename: firstPlayer?.edges[0]?.node.__typename,
          }
        : undefined,
      players: players?.edges?.flatMap((pe) =>
        pe?.node
          ? [
              {
                urn: pe.node.urn,
                typename: pe.node.__typename,
              },
            ]
          : [],
      ),
      stat: stat ?? undefined,
    },
  };
};

export default normalizeMarketCardFragmentIntoMarketCard;
