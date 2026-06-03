import { RaceMarketCard } from "../../../../../state/layout/cards/Card.types";
import { RaceMarketCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";
import { normalizeBlurbFragment } from "../blurb-card/blurb-card-normalizer";

const normalizeRaceMarketCardFragmentIntoRaceMarketCard = (
  raceMarketCard: RaceMarketCardFragment,
): TransformedFragment<RaceMarketCard> => {
  const {
    urn,
    title,
    raceViewLink,
    numberOfRunners,
    race,
    runnerViewLinks,
    displayRunners,
    isRunnerExpandable,
    __typename,
    marketPromo,
    blurbs,
  } = raceMarketCard;

  return {
    data: {
      urn,
      typename: __typename,
      raceViewLink: raceViewLink || undefined,
      numberOfRunners,
      title,
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
              runners: displayRunners.sportsbook?.runners.map((runner) => ({ urn: runner.runnerURN })),
            },
          }),
      },
      race: race.urn,
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
      marketPromo: marketPromo ? { ...marketPromo, isExpanded: false } : undefined,
      infoBlurbs: (blurbs || [])
        .filter((blurb): blurb is NonNullable<typeof blurb> => !!blurb)
        .map((blurb) => normalizeBlurbFragment(blurb)),
    },
  };
};

export default normalizeRaceMarketCardFragmentIntoRaceMarketCard;
