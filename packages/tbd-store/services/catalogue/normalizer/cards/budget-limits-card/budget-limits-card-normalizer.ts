/* eslint-disable no-underscore-dangle */
import { BudgetLimitsCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { BudgetLimitsCard } from "../../../../../state/layout/cards/Card.types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeBudgetLimitsCardFragmentIntoBudgetLimitsCard = (
  fragment: BudgetLimitsCardFragment,
): TransformedFragment<BudgetLimitsCard> => {
  const limitsFragment =
    fragment.limits &&
    fragment.limits.map((limit, index) => {
      if (!limit) {
        return { index };
      }

      return {
        amount: limit.amount,
        category: limit.category,
        remain: limit.remain,
        reset: limit.reset,
        nextBreachable: limit.nextBreachable,
      };
    });

  return {
    data: {
      typename: fragment.__typename,
      urn: fragment.urn,
      limits: limitsFragment,
    },
  };
};

export default normalizeBudgetLimitsCardFragmentIntoBudgetLimitsCard;
