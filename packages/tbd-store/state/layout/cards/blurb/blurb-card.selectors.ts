import { createSelector } from "reselect";
import URN from "../../URN";

import type { BlurbCards } from "../Card.types";

export const createGetBlurbCardByURNSelector = () =>
  createSelector(
    [(blurbCards: BlurbCards, urn: URN) => blurbCards[urn]?.blurb, (_: BlurbCards, urn: URN) => urn],
    (blurbCard) => blurbCard,
  );
