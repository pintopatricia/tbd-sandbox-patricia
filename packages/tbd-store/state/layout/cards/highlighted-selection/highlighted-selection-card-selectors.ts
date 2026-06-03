import { createSelector } from "reselect";
import URN from "../../URN";
import { HighlightedSelectionCards } from "../Card.types";

/**
 * For a given list of highlighted selection cards URNs, returns those who exist on highlighted selection cards
 */
export const createHighlightedSelectionCardsByURNsSelector = () =>
  createSelector(
    [
      (highlightedselections: HighlightedSelectionCards) => highlightedselections,
      (_: HighlightedSelectionCards, highlightedSelectionCardURNs: URN[]) => highlightedSelectionCardURNs,
    ],
    (highlightedselections, highlightedSelectionCardURNs): URN[] =>
      highlightedSelectionCardURNs.filter((urn: URN) => Object.keys(highlightedselections).includes(urn)),
  );
