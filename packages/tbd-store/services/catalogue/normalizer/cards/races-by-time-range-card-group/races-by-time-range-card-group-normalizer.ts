import {
  RacesByTimeRangeCardGroupFragment,
  RacesByTimeRangeCardGroupWithItemsFilteredFragment,
} from "../../../../../clients/catalogue/catalogue-response-types";
import { RacesByTimeRangeCardGroup } from "../../../../../state/layout/cardgroups/races-by-time-range-cardgroups/RacesByTimeRangeCardGroup.types";
import { PartialItem } from "../../../../../state/layout/views/PartialItem.types";
import { TransformedFragment } from "../../Normalizer.types";
import normalizeFilterOptionsFragmentIntoFilteredCouponOptions from "../filtered-coupon-card-group/filter-options-normalizer";

const normalizeRacesByTimeRangeCardGroupFragmentIntoRacesByTimeRangeCardGroup = (
  racesByTimeRangeCardGroup: RacesByTimeRangeCardGroupFragment | RacesByTimeRangeCardGroupWithItemsFilteredFragment,
): TransformedFragment<RacesByTimeRangeCardGroup> => {
  const { urn, partials, full, __typename } = racesByTimeRangeCardGroup;
  let filters = {};

  // Using the common filter normalizer if we have filters available
  if ("filterOptions" in racesByTimeRangeCardGroup && racesByTimeRangeCardGroup.filterOptions) {
    filters = normalizeFilterOptionsFragmentIntoFilteredCouponOptions(racesByTimeRangeCardGroup.filterOptions);
  }
  return {
    data: {
      urn,
      typename: __typename,
      filterOptions: filters,
      pageInfo: {
        hasNextPage: partials.pageInfo?.hasNextPage || false,
      },
      items: partials.edges.reduce((acc: PartialItem[], item, index) => {
        if (item && full.edges[index] !== null) {
          return [
            ...acc,
            {
              // eslint-disable-next-line no-underscore-dangle
              typename: item.node.__typename,
              urn: item.node.urn,
            },
          ];
        }
        return acc;
      }, []),
    },
  };
};

export default normalizeRacesByTimeRangeCardGroupFragmentIntoRacesByTimeRangeCardGroup;
