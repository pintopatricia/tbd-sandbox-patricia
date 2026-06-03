import {
  FutureRacingCardGroupFragment,
  FutureRacingCardGroupWithItemsFilteredFragment,
} from "../../../../../clients/catalogue/catalogue-response-types";
import {
  FutureRacingCardGroup,
  FutureRacingCardGroupPartialItem,
} from "../../../../../state/layout/cardgroups/future-racing-cardgroups/FutureRacingCardgroups.types";
import { TransformedFragment } from "../../Normalizer.types";
import normalizeFilterOptionsFragmentIntoFilteredCouponOptions from "../filtered-coupon-card-group/filter-options-normalizer";

const normalizeFutureRacingCardGroupFragmentIntoFutureRacingCardGroup = (
  futureRacingCardGroup: FutureRacingCardGroupFragment | FutureRacingCardGroupWithItemsFilteredFragment,
): TransformedFragment<FutureRacingCardGroup> => {
  const { urn, partials, full, __typename } = futureRacingCardGroup;
  let filters = {};

  // Using the common filter normalizer if we have filters available
  if ("filterOptions" in futureRacingCardGroup && futureRacingCardGroup.filterOptions) {
    filters = normalizeFilterOptionsFragmentIntoFilteredCouponOptions(futureRacingCardGroup.filterOptions);
  }

  return {
    data: {
      urn,
      typename: __typename,
      filterOptions: filters,
      pageInfo: {
        hasNextPage: partials.pageInfo?.hasNextPage || false,
      },
      items: partials.edges.reduce((acc: FutureRacingCardGroupPartialItem[], item, index) => {
        if (item && full.edges[index] !== null) {
          return [
            ...acc,
            {
              // eslint-disable-next-line no-underscore-dangle
              typename: item.node.__typename,
              urn: item.node.urn,
              date: item.date,
            },
          ];
        }
        return acc;
      }, []),
    },
  };
};

export default normalizeFutureRacingCardGroupFragmentIntoFutureRacingCardGroup;
