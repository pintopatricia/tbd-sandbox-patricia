import { createSelector, ParametricSelector } from "reselect";
import URN from "../../URN";
import { Cards, BudgetLimit, BudgetLimitsCards } from "../Card.types";
import { createCardByURNSelector } from "../cards-selectors";
import { BudgetCategory } from "../../../../clients/catalogue/catalogue-response-types";

export const createNextBreachableLimitSelector = (): ParametricSelector<Cards, URN, BudgetLimit | null> => {
  const getBudgetLimitsCard = createCardByURNSelector<BudgetLimitsCards, URN>();

  return createSelector(
    [(cards: Cards, urn: URN) => getBudgetLimitsCard(cards.budgetLimits, urn)],
    (card): BudgetLimit | null => {
      const cardLimits = card?.limits;

      if (!cardLimits?.length) {
        return null;
      }

      return cardLimits.reduce<BudgetLimit | null>((acc, limit) => {
        if (limit.category === BudgetCategory.Pdl) {
          return acc;
        }

        if (limit.nextBreachable) {
          return limit;
        }

        return acc;
      }, null);
    },
  );
};
