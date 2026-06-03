import type { JSX } from "react";

import {
  lazy,
  FunctionComponent,
  MouseEvent,
  Suspense,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { MatchedStatusFilterItem, OrderTypeFilterItem } from "@ppb/tbd-store/state/layout/cards/MyBets.types";
import { ActionLink, SegmentedControl, EmptyState, Styled } from "@ppb/the-wall-web";
import { ActionLinkColor, ActionLinkTypography } from "@ppb/the-wall-common/types";

import { ViewLink } from "@ppb/tbd-store/state/layout/views/ViewLink.types";
import { ComponentProps } from "./props";
import styles from "./MyBetsPage.web.css";
import ConnectedCard from "../Card";
import Card from "../Card/Card.web";
import { useInfiniteScroll } from "../../hooks";
import {
  DispatchHomepageNavigation,
  DispatchTransactionHistoryNavigation,
  HeritageBetsToggleOptionsKeys,
} from "./map-to-props-factory";
import ConnectedSwimlaneCardGroup from "../SwimlaneCardGroup";
import SwimlaneCardGroup from "../SwimlaneCardGroup/SwimlaneCardGroup.web";
import SwimlaneCardGroupPlaceholder from "../SwimlaneCardGroup/SwimlaneCardGroupPlaceholder.web";
import { ConfigContext } from "../Config/ConfigContext";
import { MyBetsHeader } from "./snowflakes/MyBetsHeader/MyBetsHeader.web";
import { createImagePath } from "../../helpers/create-image-path.web";
import MyBetsHeaderTooltip from "./snowflakes/MyBetsHeaderTooltip/MyBetsHeaderTooltip.web";

const ConnectedMyBetsExchangeBottomSheet = lazy(
  () => import(/* webpackChunkName: "MyBetsPage" */ "../MyBetsExchangeBottomSheet"),
);

const MyBetsExchangeBottomSheet = lazy(
  () => import(/* webpackChunkName: "MyBetsPage" */ "../MyBetsExchangeBottomSheet/MyBetsExchangeBottomSheet.web"),
);

export const MyBetsPageEmptyState: FunctionComponent<{
  title: string;
  transactionHistoryLink: ViewLink;
  hasEmptyStateImage: boolean;
  subtitle: string;
  homepageButtonText: string;
  selectedOrderType?: string;
  dispatchHomepageNavigation: DispatchHomepageNavigation;
  dispatchTransactionHistoryNavigation: DispatchTransactionHistoryNavigation;
}> = ({
  title,
  transactionHistoryLink,
  hasEmptyStateImage,
  subtitle,
  homepageButtonText,
  selectedOrderType = "",
  dispatchHomepageNavigation,
  dispatchTransactionHistoryNavigation,
}): JSX.Element => {
  const { isDesktopLayout } = useContext(ConfigContext);

  const onClickHandle = useCallback(
    (event: MouseEvent) => {
      event.preventDefault();

      dispatchTransactionHistoryNavigation(transactionHistoryLink);
    },
    [dispatchTransactionHistoryNavigation, transactionHistoryLink],
  );

  const transactionHistoryCustomRender = useMemo(
    () => ({
      transactionHistory: (text: string) => (
        <button onClick={onClickHandle} className={`${styles.emptyStateTransactionLink} typography-h320`}>
          {text}
        </button>
      ),
    }),
    [onClickHandle],
  );

  const subtitleText = useMemo(() => {
    if (selectedOrderType === OrderTypeFilterItem.Open || !isDesktopLayout) {
      return <Styled translation={subtitle} styles={{ transactionHistory: styles.transactionHistory }} />;
    }

    return <Styled translation={subtitle} customRender={transactionHistoryCustomRender} />;
  }, [isDesktopLayout, selectedOrderType, subtitle, transactionHistoryCustomRender]);

  return (
    <div className={styles.emptyState}>
      <EmptyState
        hasImage={hasEmptyStateImage}
        title={title}
        message={subtitleText}
        image={<img className={styles.emptyStateImage} src={createImagePath("my_bets_empty")} alt="Empty My Bets" />}
      />
      <ActionLink
        text={homepageButtonText}
        onClick={dispatchHomepageNavigation}
        color={ActionLinkColor.Default}
        typography={ActionLinkTypography.Regular}
        capitalize={false}
      />
    </div>
  );
};

const MyBetsPage: FunctionComponent<ComponentProps> = ({
  urn,
  selectedOrderType,
  orderTypeList,
  selectedProductType,
  productTypeFilterViewUrn,
  heritageFilterViewUrn,
  labels,
  emptyStateSubTitle,
  view,
  items,
  cursor,
  isLoggedIn,
  hasResetFilters,
  dispatchFetchCatalogueAction,
  dispatchFetchMoreCatalogueAction,
  dispatchMyBetsOrderTypeFilterClick,
  dispatchMyBetsHeritageToggleFilterClick,
  dispatchMyBetsHeaderTooltipToggle,
  dispatchResetFilterClick,
  dispatchHomepageNavigation,
  dispatchTransactionHistoryNavigation,
  isExchangeProduct,
  orderStatusList,
  selectedOrderStatusType,
  orderStatusUrnByKey,
  dispatchOrderStatusFilterTap,
  dispatchMyBetsExchangeOrderStatusSwitch,
  showHeritageBetsToggle,
  heritageBetsToggleOptions,
  selectedHeritageBetsType,
  heritageBetsTooltipContent,
  dispatchSettlementLinkNavigation,
  dispatchSettlementLinkPageNavigationAction,
  settlementLink,
  settlementLinkLabel,
  headerItems,
}) => {
  const handleScrollEnd = useCallback((): void => {
    if (view?.pageInfo.hasNextPage) {
      dispatchFetchMoreCatalogueAction(urn, cursor);
    }
  }, [cursor, dispatchFetchMoreCatalogueAction, urn, view]);

  const { scrollViewRef, resetScroll } = useInfiniteScroll<HTMLDivElement>(handleScrollEnd, 0, true);

  const [isToKeepOrdersFilter, setKeepOrdersFilter] = useState(orderStatusList.length > 0);
  const prevOrderStatusListRef = useRef(orderStatusList);

  /* eslint-disable react-hooks/refs -- using ref as a cache */
  if (prevOrderStatusListRef.current !== orderStatusList) {
    prevOrderStatusListRef.current = orderStatusList;
    if (!isToKeepOrdersFilter) {
      setKeepOrdersFilter(orderStatusList.length > 0);
    }
  }
  /* eslint-enable react-hooks/refs */

  const handleOrderTypeTap = useCallback(
    (id: string) => {
      if (id !== selectedOrderType) {
        setKeepOrdersFilter(false);
        resetScroll();
        const isHeritage = selectedHeritageBetsType === HeritageBetsToggleOptionsKeys.HERITAGE;

        const viewUrn = isHeritage
          ? heritageFilterViewUrn[id as OrderTypeFilterItem]
          : productTypeFilterViewUrn[id as OrderTypeFilterItem];

        dispatchMyBetsOrderTypeFilterClick(id, selectedProductType, isHeritage, viewUrn);
        dispatchFetchCatalogueAction(viewUrn);
      }
    },
    [
      resetScroll,
      dispatchMyBetsOrderTypeFilterClick,
      dispatchFetchCatalogueAction,
      selectedOrderType,
      selectedProductType,
      selectedHeritageBetsType,
      heritageFilterViewUrn,
      productTypeFilterViewUrn,
    ],
  );

  const handleOrderStatusTap = useCallback(
    (id: string) => {
      if (id !== selectedOrderStatusType) {
        const viewUrn = orderStatusUrnByKey && orderStatusUrnByKey[id as MatchedStatusFilterItem];
        if (viewUrn) {
          dispatchOrderStatusFilterTap(viewUrn, id);
          dispatchFetchCatalogueAction(viewUrn);
        }
        dispatchMyBetsExchangeOrderStatusSwitch(id);
      }
    },
    [
      selectedOrderStatusType,
      orderStatusUrnByKey,
      dispatchOrderStatusFilterTap,
      dispatchFetchCatalogueAction,
      dispatchMyBetsExchangeOrderStatusSwitch,
    ],
  );

  const handleResetFilterTap = useCallback(() => {
    setKeepOrdersFilter(false);
    dispatchResetFilterClick();
  }, [dispatchResetFilterClick]);

  const handleHeritageToggleTap = useCallback(
    (key: string) => {
      setKeepOrdersFilter(false);

      const viewUrn =
        key === HeritageBetsToggleOptionsKeys.HERITAGE
          ? heritageFilterViewUrn[selectedOrderType as OrderTypeFilterItem]
          : productTypeFilterViewUrn[selectedOrderType as OrderTypeFilterItem];

      const label = heritageBetsToggleOptions.find((heritageOption) => heritageOption.key === key)?.value as string;

      dispatchMyBetsHeritageToggleFilterClick(key === HeritageBetsToggleOptionsKeys.HERITAGE, viewUrn, label);
      dispatchFetchCatalogueAction(viewUrn);
    },
    [
      selectedOrderType,
      heritageFilterViewUrn,
      productTypeFilterViewUrn,
      heritageBetsToggleOptions,
      dispatchMyBetsHeritageToggleFilterClick,
      dispatchFetchCatalogueAction,
    ],
  );

  const sendTooltipAnalyticsEvent = useCallback(
    (isOpen: boolean) => dispatchMyBetsHeaderTooltipToggle(isOpen),
    [dispatchMyBetsHeaderTooltipToggle],
  );

  const headerActionComponent = useMemo(
    () => (
      <div className={styles.headerActionContainer}>
        <div className={styles.headerBetsToggleContainer}>
          <SegmentedControl
            options={heritageBetsToggleOptions}
            selectedOption={selectedHeritageBetsType}
            onClick={handleHeritageToggleTap}
          />
        </div>
        <MyBetsHeaderTooltip {...heritageBetsTooltipContent} handleTooltipToggle={sendTooltipAnalyticsEvent} />
      </div>
    ),
    [
      heritageBetsToggleOptions,
      selectedHeritageBetsType,
      handleHeritageToggleTap,
      heritageBetsTooltipContent,
      sendTooltipAnalyticsEvent,
    ],
  );

  return (
    <div ref={scrollViewRef} className={styles.myBetsPageContainer}>
      {isLoggedIn && (
        <div className={styles.myBetsHeaderContainer}>
          <MyBetsHeader
            title={labels.title}
            resetButtonText={labels.resetButtonText}
            resetAlertText={labels.resetAlertText}
            orderTypeList={orderTypeList}
            onOrderTypeTap={handleOrderTypeTap}
            selectedOrderType={selectedOrderType}
            onResetButtonClick={handleResetFilterTap}
            showResetButton={!isExchangeProduct && hasResetFilters}
            showResetAlert={isExchangeProduct && hasResetFilters}
            showOrderStatusFilter={isToKeepOrdersFilter}
            orderStatusList={orderStatusList}
            selectedOrderStatusType={selectedOrderStatusType}
            onOrderStatusTap={handleOrderStatusTap}
            headerAction={showHeritageBetsToggle ? headerActionComponent : undefined}
            settlementLink={settlementLink}
            settlementLinkLabel={settlementLinkLabel}
            dispatchSettlementLinkAction={dispatchSettlementLinkNavigation}
            dispatchSettlementLinkPageNavigationAction={dispatchSettlementLinkPageNavigationAction}
            headerItems={headerItems}
          />
        </div>
      )}
      {items.map(({ urn: cardUrn, typename, isEmptyStateCard }, index) => {
        if (isEmptyStateCard && view) {
          return (
            <MyBetsPageEmptyState
              key={`${cardUrn}-${index}`}
              title={labels.emptyStateTitle}
              subtitle={emptyStateSubTitle}
              transactionHistoryLink={view.transactionHistoryLink}
              hasEmptyStateImage={view.hasEmptyStateImage}
              selectedOrderType={selectedOrderType}
              homepageButtonText={labels.homepageButtonText}
              dispatchHomepageNavigation={dispatchHomepageNavigation}
              dispatchTransactionHistoryNavigation={dispatchTransactionHistoryNavigation}
            />
          );
        }

        if (typename === "SwimlaneCardGroup") {
          return (
            <div className={styles.swimlane} key={`${cardUrn}-${index}`}>
              <ConnectedSwimlaneCardGroup
                urn={cardUrn as string}
                component={SwimlaneCardGroup}
                placeholder={SwimlaneCardGroupPlaceholder}
              />
            </div>
          );
        }

        return (
          <ConnectedCard
            key={`${cardUrn}-${index}`}
            urn={cardUrn as string}
            component={Card}
            typename={typename as string}
          />
        );
      })}
      {isExchangeProduct && (
        <Suspense fallback={<></>}>
          <ConnectedMyBetsExchangeBottomSheet component={MyBetsExchangeBottomSheet} />
        </Suspense>
      )}
    </div>
  );
};

export default MyBetsPage;
