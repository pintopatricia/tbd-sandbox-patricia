import { getStore } from "@ppb/tbd-store/create-store";
import { createFindCouponCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/filtered-coupon-cardgroups/filtered-coupon-cardgroups-selectors";
import { FETCH_FILTERED_COUPON, FetchFilteredCouponAction } from "@ppb/tbd-store";

export async function refreshCouponCard(payload: { urn: string }) {
  const store = getStore();
  const state = store.getState();

  const getFilteredCouponCardGroupByURN = createFindCouponCardGroupByURNSelector();
  const filteredCoupon = getFilteredCouponCardGroupByURN(state.layouts.cardgroups, payload.urn);

  if (!filteredCoupon) {
    return;
  }

  const marketType =
    "marketTypeFilter" in filteredCoupon.filterOptions
      ? filteredCoupon.filterOptions.marketTypeFilter?.selectedOption?.marketType
      : undefined;

  const competitions =
    "competitionsFilter" in filteredCoupon.filterOptions
      ? filteredCoupon.filterOptions.competitionsFilter?.selectedOptions?.map((option) => option.urn)
      : undefined;

  const dateRange =
    "dateRangeFilter" in filteredCoupon.filterOptions
      ? filteredCoupon.filterOptions.dateRangeFilter?.selectedOption?.urn
      : undefined;

  const sortBy =
    "sortOption" in filteredCoupon.filterOptions ? filteredCoupon.filterOptions.sortOption?.selectedOption : undefined;

  store.dispatch<FetchFilteredCouponAction>({
    type: FETCH_FILTERED_COUPON,
    payload: {
      urn: payload.urn,
      filterBy: {
        marketType: !marketType || marketType === "ppb:marketType:RECOMMENDED" ? null : marketType,
        competitions: competitions || undefined,
        dateRange: dateRange || undefined,
      },
      sortBy: sortBy || undefined,
    },
  });
}
