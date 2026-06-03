import { GridCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { GridCard } from "../../../../../state/layout/cards/Card.types";
import { TransformedFragment } from "../../Normalizer.types";
import { normalizeBlurbFragment } from "../blurb-card/blurb-card-normalizer";
import normalizeDisplayNameFragmentIntoDisplayName from "../display-name/display-name-normalizer";

const normalizeGridCardFragmentIntoGridCard = (fragment: GridCardFragment): TransformedFragment<GridCard> => {
  const { __typename, urn, numberOfItemsToDisplay, layout, markets, runners, firstPlayer, players, blurbs, stat } =
    fragment;

  return {
    data: {
      typename: __typename,
      urn,
      numberOfItemsToDisplay: numberOfItemsToDisplay || undefined,
      layout: layout ?? undefined,
      markets: markets.map((node) => ({
        urn: node.market.urn,
        ...(node.displayLabel ? { displayLabel: normalizeDisplayNameFragmentIntoDisplayName(node.displayLabel) } : {}),
      })),
      runners: runners.map((node) => ({
        urn: node.runner.runnerURN,
        selectionId: node.runner.selectionId,
        participantId: node.runner.participantId,
        name: normalizeDisplayNameFragmentIntoDisplayName(node.displayName),
        marketURN: node.runner.marketURN,
      })),
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
      infoBlurbs: (blurbs || [])
        .filter((blurb): blurb is NonNullable<typeof blurb> => !!blurb)
        .map((blurb) => normalizeBlurbFragment(blurb)),
      stat: stat ?? undefined,
    },
  };
};

export default normalizeGridCardFragmentIntoGridCard;
