import classnames from "classnames";
import { FunctionComponent, useCallback, useState, RefObject, useContext, JSX } from "react";
import { ActionLink, FilterBy, Alert, PebbleList, Card } from "@ppb/the-wall-web";
import { ActionLinkColor, ActionLinkTypography, AlertType } from "@ppb/the-wall-common/types";
import URN from "@ppb/tbd-store/state/layout/URN";
import styles from "./FilteredCouponCardGroup.web.css";
import { ComponentProps } from "./props";
import FilteredCouponList from "./FilteredCouponList/FilteredCouponList.web";
import ConnectedFilteredCouponList from "./FilteredCouponList";
import FutureRacingCardGroup from "./FutureRacingCardGroup/FutureRacingCardGroup.web";
import ConnectedFutureRacingCardGroup from "./FutureRacingCardGroup";
import FilteredRacesByTimeRangeList from "./FilteredRacesByTimeRangeList/FilteredRacesByTimeRangeList.web";
import ConnectedFilteredRacesByTimeRangeList from "./FilteredRacesByTimeRangeList";
import CompetitionFilterDrawer from "./CompetitionFilterDrawer/CompetitionFilterDrawer.web";
import MultipleFilterDrawer from "./MultipleFilterDrawer/MultipleFilterDrawer.web";
import SingleFilterDrawer from "./SingleFilterDrawer/SingleFilterDrawer.web";
import { isCompetitionFilter, isMultipleFilter, isSingleFilter, useFilters } from "./filter-helper";
import NinetyMinuteBlurb from "../SportsbookMarket/NinetyMinuteBlurb/NinetyMinuteBlurb.web";
import ConnectedNinetyMinuteBlurb from "../SportsbookMarket/NinetyMinuteBlurb";
import { MarketSwitcher } from "./snowflakes/MarketSwitcher/MarketSwitcher.web";
import { MarketTypeFiltersType } from "./map-to-props-factory";
import { ConfigContext } from "../Config/ConfigContext";
import { useRefreshComponent } from "../../hooks";
import { refreshCouponCard } from "../../event-processors/live-data/resolvers/coupon-card-resolvers";

function MarketTypeFilters({ filters, ...marketSwitcherProps }: MarketTypeFiltersType) {
  const { layout, availableOptions, defaultOption, value: filterValue } = filters;
  const { marketSwitcherTitle, setTriggerRef, getMarketTypeFilterLabel, onMarketTypeFilterTap } = marketSwitcherProps;
  const { isDesktopLayout } = useContext(ConfigContext);

  return layout === "PEBBLES" ? (
    <div className={styles.pebbleListContainer}>
      <PebbleList
        items={availableOptions}
        defaultSelectedPebble={defaultOption?.id || availableOptions[0].id}
        onPebbleClick={(id) => onMarketTypeFilterTap(filterValue, id)}
        isDesktopLayout={isDesktopLayout}
        showDesktopArrows={isDesktopLayout}
      />
    </div>
  ) : (
    <MarketSwitcher
      onTap={(value, tapTriggerRef) => {
        if (tapTriggerRef && setTriggerRef) setTriggerRef(tapTriggerRef);
        onMarketTypeFilterTap(value);
      }}
      label={getMarketTypeFilterLabel()}
      value={filterValue}
      title={marketSwitcherTitle}
    />
  );
}

function renderList(urn: URN, typename: string): JSX.Element | null {
  switch (typename) {
    case "FilteredCouponCardGroup":
      return <ConnectedFilteredCouponList urn={urn} component={FilteredCouponList} />;
    case "FutureRacingCardGroup":
      return <ConnectedFutureRacingCardGroup urn={urn} component={FutureRacingCardGroup} />;
    case "RacesByTimeRangeCardGroup":
      return <ConnectedFilteredRacesByTimeRangeList urn={urn} component={FilteredRacesByTimeRangeList} />;
    default:
      return null;
  }
}

const FilteredCouponCardGroup: FunctionComponent<ComponentProps> = ({
  urn,
  typename,
  title,
  filters,
  hasMaxNumberOfEvents,
  viewAll,
  hasResults,
  noResultsLabel,
  noResultsSuggestionLabel,
  noResultsResetLabel,
  resetText,
  marketSwitcherTitle,
  notificationMessageLabel,
  notificationDetailLabel,
  has90Min,
  dispatchFetchFilteredCoupon,
  dispatchViewAllTap,
  dispatchPushAction,
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
    getMarketTypeFilterLabel,
    onApply,
    onClose,
    onMarketTypeFilterTap,
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
    dispatchPushAction(viewAll.viewLink);
  }, [viewAll, dispatchViewAllTap, urn, dispatchPushAction]);

  const [triggerRef, setTriggerRef] = useState<RefObject<HTMLDivElement | null>>();

  const { genericFilters, marketTypeFilter } = filters;
  const hasMarketTypeFilter = marketTypeFilter && Object.keys(marketTypeFilter).length > 0;
  const marketTypeLayout = marketTypeFilter?.layout;

  const content = (
    <>
      {hasMarketTypeFilter && marketTypeLayout !== "PEBBLES" && (
        <MarketTypeFilters
          filters={marketTypeFilter}
          marketSwitcherTitle={marketSwitcherTitle}
          setTriggerRef={setTriggerRef}
          getMarketTypeFilterLabel={getMarketTypeFilterLabel}
          onMarketTypeFilterTap={onMarketTypeFilterTap}
        />
      )}
      {hasResults && (
        <>
          {has90Min && <ConnectedNinetyMinuteBlurb component={NinetyMinuteBlurb} hasSpacing />}
          {renderList(urn, typename)}
        </>
      )}
    </>
  );

  const containerClassnames = classnames(styles.container, {
    [styles.containerWithoutMargin]: isRacesByTimeRangeCardGroup,
  });

  const genericFilterClassnames = classnames(styles.filter, {
    [styles.filterWithMargin]: isRacesByTimeRangeCardGroup,
  });

  return (
    <div className={containerClassnames}>
      {(title || viewAll?.label) && (
        <div className={styles.header}>
          <h4 className={`typography-h380 ${styles.title}`}>{title}</h4>
          {viewAll?.label && (
            <ActionLink
              text={viewAll.label}
              onClick={onTap}
              color={ActionLinkColor.Default}
              typography={ActionLinkTypography.Regular}
            />
          )}
        </div>
      )}
      {genericFilters.length > 0 && (
        <div className={genericFilterClassnames}>
          <FilterBy
            resetText={resetText}
            onFilterTap={(id, value, tapTriggerRef) => {
              if (tapTriggerRef) setTriggerRef(tapTriggerRef);
              onFilterTap(id, value);
            }}
            onResetTap={onReset}
            filters={filterByState}
          />
        </div>
      )}
      {hasMarketTypeFilter && marketTypeLayout === "PEBBLES" && (
        <MarketTypeFilters
          filters={marketTypeFilter}
          marketSwitcherTitle={marketSwitcherTitle}
          setTriggerRef={setTriggerRef}
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
        <div className={styles.noResults}>
          <span className={`typography-h280 ${styles.noResultsLabel}`}>{noResultsLabel}</span>
          <span className="typography-h152">{noResultsSuggestionLabel}</span>
          <div className={styles.noResultsReset}>
            <ActionLink
              onClick={() => onReset(noResultsResetLabel)}
              text={noResultsResetLabel}
              color={ActionLinkColor.Default}
            />
          </div>
        </div>
      )}
      {hasMaxNumberOfEvents && (
        <Alert type={AlertType.Info} message={notificationMessageLabel} detail={notificationDetailLabel} />
      )}
      {!isModalClosed && isSingleFilter(currentFilter) && (
        <SingleFilterDrawer
          refObject={triggerRef}
          filter={currentFilter}
          selections={currentSelections}
          onApply={onApply}
          onClose={onClose}
        />
      )}

      {!isModalClosed && isMultipleFilter(currentFilter) && (
        <MultipleFilterDrawer
          refObject={triggerRef}
          filter={currentFilter}
          selections={currentSelections}
          onApply={onApply}
          onClose={onClose}
        />
      )}

      {!isModalClosed && isCompetitionFilter(currentFilter) && (
        <CompetitionFilterDrawer
          urn={urn}
          refObject={triggerRef}
          title={currentFilter.title}
          topCompetitions={{
            ...currentFilter.topCompetitions,
            items: currentFilter.topCompetitions.items.map((competitionCheckbox) => ({
              ...competitionCheckbox,
              // update with isSelected: true the options that are currently selected
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
    </div>
  );
};

export default FilteredCouponCardGroup;
