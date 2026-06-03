import { OutputParametricSelector, createSelector, ParametricSelector } from "reselect";
import { ApplicationState } from "../../../ApplicationState.types";
import { createCardGroupByURNSelector } from "../cardgroups-selectors";
import { createNavTabTitleByURNSelector, createViewTypeSelector } from "../../layout-selectors";
import { FilteredCouponCardGroup, FilteredCouponCardGroups } from "./FilteredCouponCardGroups.types";
import { FutureRacingCardGroup } from "../future-racing-cardgroups/FutureRacingCardgroups.types";
import { RacesByTimeRangeCardGroup } from "../races-by-time-range-cardgroups/RacesByTimeRangeCardGroup.types";
import { CardGroups } from "../CardGroup.types";
import URN from "../../URN";

type CouponCardGroups = FilteredCouponCardGroup | FutureRacingCardGroup | RacesByTimeRangeCardGroup;

export const createFindCouponCardGroupByURNSelector = (): OutputParametricSelector<
  CardGroups,
  URN,
  CouponCardGroups | undefined,
  (
    res1: FilteredCouponCardGroup,
    res2: FutureRacingCardGroup,
    res3: RacesByTimeRangeCardGroup,
  ) => CouponCardGroups | undefined
> =>
  createSelector(
    [
      (cardgroups: CardGroups, urn: URN): FilteredCouponCardGroup => cardgroups.filteredcouponcardgroups[urn],
      (cardgroups: CardGroups, urn: URN): FutureRacingCardGroup => cardgroups.futureracingcardgroups[urn],
      (cardgroups: CardGroups, urn: URN): RacesByTimeRangeCardGroup => cardgroups.racesbytimerangecardgroups[urn],
    ],
    (
      filteredCouponCardGroup: FilteredCouponCardGroup,
      futureRacingCardGroup: FutureRacingCardGroup,
      byTimeRangeCardGroup: RacesByTimeRangeCardGroup,
    ): CouponCardGroups | undefined =>
      filteredCouponCardGroup || futureRacingCardGroup || byTimeRangeCardGroup || undefined,
  );

type CouponCardGroupParentTitles = {
  viewType: string | null;
  groupTitle: string | null;
  tabTitle: string | null;
};

export const createGetCouponCardGroupParentTitlesSelector = (): ParametricSelector<
  ApplicationState,
  URN,
  CouponCardGroupParentTitles
> => {
  const getFilteredCouponCardGroupByURN = createCardGroupByURNSelector<FilteredCouponCardGroups, string>();
  const getNavTabTitleByURN = createNavTabTitleByURNSelector();
  const getViewTypeSelector = createViewTypeSelector();

  return createSelector(
    [
      (state: ApplicationState, couponCardGroupUrn: URN) =>
        getFilteredCouponCardGroupByURN(state.layouts.cardgroups.filteredcouponcardgroups, couponCardGroupUrn),
      (state: ApplicationState, couponCardGroupUrn: URN) =>
        getNavTabTitleByURN(state.layouts.navigationtabs, couponCardGroupUrn),
      (state: ApplicationState) => getViewTypeSelector(state),
    ],
    (filteredCouponCardGroup, tabTitle, viewType) => ({
      groupTitle: filteredCouponCardGroup?.title || null,
      tabTitle,
      viewType,
    }),
  );
};
