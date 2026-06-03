import type { JSX } from "react";
import { FunctionComponent, useCallback } from "react";
import { ActionLinkColor, ActionLinkTypography, AlertType } from "@ppb/the-wall-common/types";
import { ActionLink, FilterBy, Alert, PebbleList, Text, Card } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { View } from "react-native";
import { navigate } from "@ppb/tbd-router/native";
import URN from "@ppb/tbd-store/state/layout/URN";
import {
  FILTERED_COUPON_CARD_GROUP,
  FILTERED_COUPON_CARD_GROUP_HEADER,
  FILTERED_COUPON_CARD_GROUP_TITLE,
  FILTER_CONTAINER,
  NO_RESULTS_SECTION,
  NO_RESULTS_LABEL,
  NO_RESULTS_SUGGESTION,
  NO_RESULTS_BUTTON,
  MARKET_SWITCHER_CONTAINER,
  PEBBLE_LIST_CONTAINER,
} from "./FilteredCouponCardGroup.native.selectors";
import styles from "./FilteredCouponCardGroup.native.styles";
import { ComponentProps } from "./props";
import ConnectedFilteredCouponList from "./FilteredCouponList";
import FilteredCouponList from "./FilteredCouponList/FilteredCouponList.native";
import ConnectedFutureRacingCardGroup from "./FutureRacingCardGroup";
import FutureRacingCardGroup from "./FutureRacingCardGroup/FutureRacingCardGroup.native";
import ConnectedFilteredRacesByTimeRangeList from "./FilteredRacesByTimeRangeList";
import FilteredRacesByTimeRangeList from "./FilteredRacesByTimeRangeList/FilteredRacesByTimeRangeList.native";
import SingleFilterDrawer from "./SingleFilterDrawer/SingleFilterDrawer.native";
import { isCompetitionFilter, isMultipleFilter, isSingleFilter, useFilters } from "./filter-helper";
import CompetitionFilterDrawer from "./CompetitionFilterDrawer/CompetitionFilterDrawer.native";
import MultipleFilterDrawer from "./MultipleFilterDrawer/MultipleFilterDrawer.native";
import NinetyMinuteBlurb from "../SportsbookMarket/NinetyMinuteBlurb/NinetyMinuteBlurb.native";
import ConnectedNinetyMinuteBlurb from "../SportsbookMarket/NinetyMinuteBlurb";
import { MarketSwitcher } from "./snowflakes/MarketSwitcher/MarketSwitcher.native";
import { MarketTypeFiltersType } from "./map-to-props-factory";
import { useRefreshComponent } from "../../hooks/useRefreshComponent.native";
import { refreshCouponCard } from "../../event-processors/live-data/resolvers/coupon-card-resolvers";

function MarketTypeFilters({ filters, ...marketSwitcherProps }: MarketTypeFiltersType) {
  const { layout, availableOptions, defaultOption, value: filterValue } = filters;
  const { marketSwitcherTitle, getMarketTypeFilterLabel, onMarketTypeFilterTap } = marketSwitcherProps;

  return layout === "PEBBLES" ? (
    <View {...getTestProps(PEBBLE_LIST_CONTAINER, false)} style={styles.pebbleListContainer}>
      <PebbleList
        items={availableOptions}
        defaultSelectedPebble={defaultOption?.id || availableOptions[0].id}
        onPebblePress={(id) => onMarketTypeFilterTap(filterValue, id)}
      />
    </View>
  ) : (
    <View {...getTestProps(MARKET_SWITCHER_CONTAINER, false)}>
      <MarketSwitcher
        onTap={(value) => onMarketTypeFilterTap(value)}
        label={getMarketTypeFilterLabel()}
        value={filterValue}
        title={marketSwitcherTitle}
      />
    </View>
  );
}

function renderList(urn: URN, typename: string, visible?: boolean): JSX.Element | null {
  switch (typename) {
    case "FilteredCouponCardGroup":
      return <ConnectedFilteredCouponList urn={urn} component={FilteredCouponList} visible={visible} />;
    case "FutureRacingCardGroup":
      return <ConnectedFutureRacingCardGroup urn={urn} component={FutureRacingCardGroup} visible={visible} />;
    case "RacesByTimeRangeCardGroup":
      return (
        <ConnectedFilteredRacesByTimeRangeList urn={urn} component={FilteredRacesByTimeRangeList} visible={visible} />
      );
    default:
      return null;
  }
}

const FilteredCouponCardGroup: FunctionComponent<ComponentProps> = ({
  urn,
  typename,
  title,
  filters,
  viewAll,
  hasResults,
  noResultsLabel,
  noResultsSuggestionLabel,
  noResultsResetLabel,
  hasMaxNumberOfEvents,
  resetText,
  has90Min,
  marketSwitcherTitle,
  notificationMessageLabel,
  notificationDetailLabel,
  visible,
  dispatchFetchFilteredCoupon,
  dispatchViewAllTap,
  dispatchFilterOpenEvent,
  dispatchFilterCloseEvent,
  dispatchFilterApplyEvent,
  dispatchFilterResetClickEvent,
  dispatchSelectedMarketSwitcherFilter,
  dispatchSelectedDateRangeFilterChanged,
  dispatchSelectedSortFilterChanged,
  dispatchSelectedCompetitionsFilterChanged,
  dispatchSelectedMonthFilterChanged,
  dispatchSelectedCountriesFilterChanged,
}) => {
  const {
    onFilterTap,
    onReset,
    filterByState,
    currentFilter,
    currentSelections,
    isModalClosed,
    onApply,
    onClose,
    onMarketTypeFilterTap,
    getMarketTypeFilterLabel,
  } = useFilters(
    filters,
    urn,
    dispatchFetchFilteredCoupon,
    dispatchFilterOpenEvent,
    dispatchFilterCloseEvent,
    dispatchFilterApplyEvent,
    dispatchFilterResetClickEvent,
    dispatchSelectedMarketSwitcherFilter,
    dispatchSelectedDateRangeFilterChanged,
    dispatchSelectedSortFilterChanged,
    dispatchSelectedCompetitionsFilterChanged,
    dispatchSelectedMonthFilterChanged,
    dispatchSelectedCountriesFilterChanged,
  );

  const isRacesByTimeRangeCardGroup = typename === "RacesByTimeRangeCardGroup";

  useRefreshComponent({
    urn,
    refreshAction: () => refreshCouponCard({ urn }),
    chefComponentName: "FilteredCouponCardGroup",
  });

  const onTap = useCallback(() => {
    if (!viewAll?.viewLink) {
      return;
    }

    dispatchViewAllTap(viewAll.label, viewAll, urn);
    navigate(viewAll.viewLink);
  }, [viewAll, dispatchViewAllTap, urn]);

  const { genericFilters, marketTypeFilter } = filters;
  const hasMarketTypeFilter = marketTypeFilter && Object.keys(marketTypeFilter).length > 0;
  const marketTypeLayout = marketTypeFilter?.layout;

  const content = (
    <>
      {hasMarketTypeFilter && marketTypeLayout !== "PEBBLES" && (
        <MarketTypeFilters
          filters={marketTypeFilter}
          marketSwitcherTitle={marketSwitcherTitle}
          getMarketTypeFilterLabel={getMarketTypeFilterLabel}
          onMarketTypeFilterTap={onMarketTypeFilterTap}
        />
      )}
      {hasResults && (
        <>
          {has90Min && <ConnectedNinetyMinuteBlurb component={NinetyMinuteBlurb} hasSpacing />}
          {renderList(urn, typename, visible)}
        </>
      )}
    </>
  );

  return (
    <View
      style={[styles.container, isRacesByTimeRangeCardGroup && styles.containerWithoutMargin]}
      {...getTestProps(FILTERED_COUPON_CARD_GROUP, false)}
    >
      {!!title && (
        <View style={styles.header} {...getTestProps(FILTERED_COUPON_CARD_GROUP_HEADER, false)}>
          <Text style={styles.title} {...getTestProps(FILTERED_COUPON_CARD_GROUP_TITLE, false)}>
            {title}
          </Text>
          {viewAll?.label && (
            <ActionLink
              text={viewAll.label}
              onClick={onTap}
              color={ActionLinkColor.Default}
              typography={ActionLinkTypography.Regular}
            />
          )}
        </View>
      )}
      {genericFilters.length > 0 && (
        <View
          {...getTestProps(FILTER_CONTAINER, false)}
          style={[styles.filter, isRacesByTimeRangeCardGroup && styles.filterWithMargin]}
        >
          <FilterBy resetText={resetText} onFilterTap={onFilterTap} onResetTap={onReset} filters={filterByState} />
        </View>
      )}
      {hasMarketTypeFilter && marketTypeLayout === "PEBBLES" && (
        <MarketTypeFilters
          filters={marketTypeFilter}
          marketSwitcherTitle={marketSwitcherTitle}
          getMarketTypeFilterLabel={getMarketTypeFilterLabel}
          onMarketTypeFilterTap={onMarketTypeFilterTap}
        />
      )}
      {(hasMarketTypeFilter || hasResults) &&
        (isRacesByTimeRangeCardGroup ? (
          content
        ) : (
          <Card showShadow fullWidthContent>
            {content}
          </Card>
        ))}
      {!hasResults && (
        <View style={styles.noResults} {...getTestProps(NO_RESULTS_SECTION, false)}>
          <Text style={styles.noResultsLabel} {...getTestProps(NO_RESULTS_LABEL, false)}>
            {noResultsLabel}
          </Text>
          <Text style={styles.noResultsSuggestion} {...getTestProps(NO_RESULTS_SUGGESTION, false)}>
            {noResultsSuggestionLabel}
          </Text>
          <View style={styles.noResultsReset} {...getTestProps(NO_RESULTS_BUTTON, false)}>
            <ActionLink
              onClick={() => onReset(noResultsResetLabel)}
              text={noResultsResetLabel}
              color={ActionLinkColor.Default}
            />
          </View>
        </View>
      )}
      {hasMaxNumberOfEvents && (
        <View style={styles.notification}>
          <Alert type={AlertType.Info} message={notificationMessageLabel} detail={notificationDetailLabel}></Alert>
        </View>
      )}
      {!isModalClosed && isSingleFilter(currentFilter) && (
        <SingleFilterDrawer filter={currentFilter} selections={currentSelections} onApply={onApply} onClose={onClose} />
      )}
      {!isModalClosed && isMultipleFilter(currentFilter) && (
        <MultipleFilterDrawer
          filter={currentFilter}
          selections={currentSelections}
          onApply={onApply}
          onClose={onClose}
        />
      )}
      {!isModalClosed && isCompetitionFilter(currentFilter) && (
        <CompetitionFilterDrawer
          urn={urn}
          title={currentFilter.title}
          topCompetitions={{
            ...currentFilter.topCompetitions,
            items: currentFilter.topCompetitions.items.map((competitionCheckbox) => ({
              ...competitionCheckbox,
              isSelected:
                currentSelections[currentFilter.id]?.some(
                  (competition) => competitionCheckbox.id === competition.urn,
                ) ?? false,
            })),
          }}
          currentSelections={currentSelections}
          onApply={onApply}
          onClose={onClose}
          resetText={resetText}
        />
      )}
    </View>
  );
};

export default FilteredCouponCardGroup;
