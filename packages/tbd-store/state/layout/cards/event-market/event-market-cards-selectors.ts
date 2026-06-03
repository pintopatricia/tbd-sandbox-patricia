import { createSelector, OutputParametricSelector } from "reselect";
import { EventMarketCards } from "../Card.types";
import { Product } from "../../../entities/user-preferences/UserPreferences.types";
import URN from "../../URN";

export const createHasEventMarketCardByCompetitionURNSelector = (): OutputParametricSelector<
  EventMarketCards,
  URN,
  boolean,
  (eventMarketCards: EventMarketCards, competitionURN: URN, product: Product) => boolean
> =>
  createSelector(
    [
      (eventMarketCards: EventMarketCards) => eventMarketCards,
      (_: EventMarketCards, competitionUrn: URN) => competitionUrn,
      (_: EventMarketCards, __: URN, product: Product) => product,
    ],
    (eventMarketCards, competitionURN, product) =>
      Object.values(eventMarketCards).some(
        ({ competition: currentCompetition, displayRunners }) =>
          competitionURN === currentCompetition &&
          ((product === Product.Exchange && !!displayRunners.exchange) ||
            (product === Product.Sportsbook && !!displayRunners.sportsbook)),
      ),
  );
