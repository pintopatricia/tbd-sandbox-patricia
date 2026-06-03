import {
  FilteredCouponCardGroupFragment,
  FilteredCouponCardGroupWithItemsFilteredFragment,
} from "../../../../../clients/catalogue/catalogue-response-types";
import { FilteredCouponCardGroup } from "../../../../../state/layout/cardgroups/filtered-coupon-cardgroups/FilteredCouponCardGroups.types";
import { PartialItem } from "../../../../../state/layout/views/PartialItem.types";
import { getCardIcon } from "../../../gql-entities-mapper";
import { TransformedFragment } from "../../Normalizer.types";
import normalizeFilterOptionsFragmentIntoFilterOptions from "./filter-options-normalizer";

function isFilteredCouponCardGroupFragment(
  fragment: FilteredCouponCardGroupFragment | FilteredCouponCardGroupWithItemsFilteredFragment,
): fragment is FilteredCouponCardGroupFragment {
  return Object.prototype.hasOwnProperty.call(fragment, "filteredCouponTitle");
}

const normalizeFilteredCouponCardGroupFragmentIntoFilteredCouponCardGroup = (
  filteredCouponCardGroup: FilteredCouponCardGroupFragment | FilteredCouponCardGroupWithItemsFilteredFragment,
): TransformedFragment<FilteredCouponCardGroup> => {
  const { urn, partials, full, __typename, has90Min } = filteredCouponCardGroup;

  let filters = {};

  // Using the common filter normalizer if we have filters available
  if ("filterOptions" in filteredCouponCardGroup && filteredCouponCardGroup.filterOptions) {
    filters = normalizeFilterOptionsFragmentIntoFilterOptions(filteredCouponCardGroup.filterOptions);
  }

  const filteredCouponCardGroupTitle =
    (isFilteredCouponCardGroupFragment(filteredCouponCardGroup) && filteredCouponCardGroup.filteredCouponTitle) || "";

  const viewAll =
    (isFilteredCouponCardGroupFragment(filteredCouponCardGroup) && filteredCouponCardGroup.viewAll) || undefined;

  return {
    data: {
      urn,
      has90Min: has90Min || undefined,
      typename: __typename,
      title: filteredCouponCardGroupTitle,
      filterOptions: filters,
      pageInfo: {
        hasNextPage: partials.pageInfo?.hasNextPage || false,
      },
      viewAll: viewAll?.label
        ? {
            label: viewAll.label,
            icon: viewAll.icon ? getCardIcon(viewAll.icon) : undefined,
            viewLink: viewAll.viewLink,
          }
        : undefined,
      items: partials.edges.reduce((acc: PartialItem[], item, index) => {
        if (item && "urn" in item.node && full.edges[index] !== null) {
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

export default normalizeFilteredCouponCardGroupFragmentIntoFilteredCouponCardGroup;
