import { TransformedFragment } from "../../Normalizer.types";
import { HighlightedSelectionCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { HighlightedSelectionCard } from "../../../../../state/layout/cards/Card.types";

const normalizeHighlightedSelectionCardFragmentIntoHighlightedSelectionCard = (
  highlightedSelection: HighlightedSelectionCardFragment,
): TransformedFragment<HighlightedSelectionCard> => {
  const { urn, title, displayPreviousOdd, runner, market, __typename } = highlightedSelection;
  return {
    data: {
      typename: __typename,
      displayPreviousOdd,
      market: market.urn,
      runner: runner.runnerURN,
      title,
      urn,
    },
  };
};

export default normalizeHighlightedSelectionCardFragmentIntoHighlightedSelectionCard;
