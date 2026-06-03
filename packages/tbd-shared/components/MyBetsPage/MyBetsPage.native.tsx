import type { JSX, RefObject } from "react";
import { FunctionComponent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  View,
  Image,
  FlatList as ReactNativeFlatList,
  DeviceEventEmitter,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import {
  MatchedStatusFilterItem,
  MyBetsItem,
  OrderTypeFilterItem,
} from "@ppb/tbd-store/state/layout/cards/MyBets.types";
import { ActionLink, EmptyState, SegmentedControl, Styled, Text } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { ActionLinkColor, ActionLinkTypography } from "@ppb/the-wall-common/types";
import { SCROLL_UP_EVENT, SCROLL_DOWN_EVENT } from "../GenericView/generic-view-scroll-listener";

import { navigate, useScrollToTop } from "@ppb/tbd-router/native";
import { MyBetsView } from "@ppb/tbd-store/state/layout/views/View.types";
import ConnectedCardGroup from "../CardGroup";
import CardGroup from "../CardGroup/CardGroup.native";
import MyBetsHeaderTooltip from "./snowflakes/MyBetsHeaderTooltip/MyBetsHeaderTooltip.native";
import { ComponentProps } from "./props";

import { MY_BETS_PAGE, MY_BETS_PAGE_EMPTY_STATE, MY_BETS_PAGE_FLATLIST } from "./MyBetsPage.native.selectors";
import styles from "./MyBetsPage.native.styles";
import { PullRefresh } from "../PullRefresh/PullRefresh.native";
import ConnectedPullRefresh from "../PullRefresh";
import { useVisibility } from "../../hooks/useNativeLazyLoading.native";

import { MyBetsHeader } from "./snowflakes/MyBetsHeader/MyBetsHeader.native";
import ConnectedMyBetsExchangeBottomSheet from "../MyBetsExchangeBottomSheet";
import MyBetsExchangeBottomSheet from "../MyBetsExchangeBottomSheet/MyBetsExchangeBottomSheet.native";
import { HeritageBetsToggleOptionsKeys } from "./map-to-props-factory";
import { FlatList, RenderItem, type OnViewableItemsChanged } from "../FlatList.native";

const INITIAL_NUM_TO_RENDER = 4;
const MAX_TO_RENDER_PER_BATCH = 4;
const END_REACHED_THRESHOLD = 2;

const VIEWABILITY_CONFIG = {
  itemVisiblePercentThreshold: 100,
  waitForInteraction: false,
};

const MyBetsPageEmptyState: FunctionComponent<{
  title: string;
  subTitle: string;
  hasEmptyStateImage: boolean;
  homepageButtonText: string;
  homepageUrn: string;
}> = ({ title, subTitle, hasEmptyStateImage, homepageButtonText, homepageUrn }) => {
  const onGoToHomepagePress = useCallback(() => {
    navigate({ viewUrn: homepageUrn });
  }, [homepageUrn]);

  const transactionHistoryCustomRender = {
    transactionHistory: (text: string) => <Text>{text}</Text>,
  };

  const subtitleText = useMemo(
    () => (
      <Styled translation={subTitle} customRender={transactionHistoryCustomRender} style={styles.emptyStateSubtitle} />
    ),
    [subTitle],
  );

  return (
    <View style={styles.emptyState} {...getTestProps(MY_BETS_PAGE_EMPTY_STATE, false)}>
      <EmptyState
        hasImage={hasEmptyStateImage}
        title={title}
        message={subtitleText}
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        image={<Image style={styles.emptyStateImage} source={require("../../assets/images/my_bets_empty.png")} />}
      />

      <ActionLink
        text={homepageButtonText}
        onClick={onGoToHomepagePress}
        color={ActionLinkColor.Default}
        typography={ActionLinkTypography.Regular}
        capitalize={false}
      />
    </View>
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
  homepageUrn,
  view,
  items,
  cursor,
  isLoggedIn,
  hasResetFilters,
  settlementLinkLabel,
  settlementLink,
  dispatchMyBetsHeaderTooltipToggle,
  dispatchFetchCatalogueAction,
  dispatchFetchMoreCatalogueAction,
  dispatchMyBetsOrderTypeFilterClick,
  dispatchMyBetsHeritageToggleFilterClick,
  dispatchResetFilterClick,
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
  dispatchSettlementLinkPageNavigationAction,
  headerItems,
}) => {
  const setVisibility = useVisibility();
  const ref = useRef<ReactNativeFlatList>(null);
  const lastOffset = useRef(0);

  useScrollToTop(ref);
  // Mark this view as visible
  useEffect(() => {
    setVisibility(urn, true);
    return () => setVisibility(urn, false);
  }, [setVisibility, urn]);

  const [isToKeepOrdersFilter, setKeepOrdersFilter] = useState(orderStatusList.length > 0);

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    if (!isToKeepOrdersFilter) {
      const shouldKeepOrdersFilter = orderStatusList.length > 0;
      if (shouldKeepOrdersFilter) {
        timeoutId = setTimeout(() => {
          setKeepOrdersFilter(true);
        }, 0);
      }
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [orderStatusList, isToKeepOrdersFilter]);

  const handleScrollEnd = useCallback((): void => {
    if (view?.pageInfo.hasNextPage) {
      dispatchFetchMoreCatalogueAction(urn, cursor);
    }
  }, [cursor, dispatchFetchMoreCatalogueAction, urn, view]);

  const handleOrderTypeTap = useCallback(
    (id: string) => {
      if (id !== selectedOrderType) {
        setKeepOrdersFilter(false);

        const isHeritage = selectedHeritageBetsType === HeritageBetsToggleOptionsKeys.HERITAGE;

        const viewUrn = isHeritage
          ? heritageFilterViewUrn[id as OrderTypeFilterItem]
          : productTypeFilterViewUrn[id as OrderTypeFilterItem];

        dispatchMyBetsOrderTypeFilterClick(id, selectedProductType, isHeritage, viewUrn);
        dispatchFetchCatalogueAction(viewUrn);
      }
    },
    [
      selectedOrderType,
      selectedProductType,
      selectedHeritageBetsType,
      dispatchMyBetsOrderTypeFilterClick,
      dispatchFetchCatalogueAction,
      productTypeFilterViewUrn,
      heritageFilterViewUrn,
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
      dispatchMyBetsExchangeOrderStatusSwitch,
      dispatchOrderStatusFilterTap,
      dispatchFetchCatalogueAction,
    ],
  );

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
      dispatchMyBetsHeritageToggleFilterClick,
      dispatchFetchCatalogueAction,
      heritageBetsToggleOptions,
    ],
  );

  const handleScroll = useCallback((event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentOffsetY = event.nativeEvent.contentOffset.y;

    if (currentOffsetY > lastOffset.current) {
      DeviceEventEmitter.emit(SCROLL_DOWN_EVENT);
    } else if (currentOffsetY < lastOffset.current) {
      DeviceEventEmitter.emit(SCROLL_UP_EVENT);
    }
    lastOffset.current = currentOffsetY;
  }, []);

  const handleResetFilterTap = useCallback(() => {
    setKeepOrdersFilter(false);
    dispatchResetFilterClick();
  }, [dispatchResetFilterClick]);

  const renderItem = useCallback<RenderItem<MyBetsItem>>(
    ({ item: { isEmptyStateCard, urn: cardGroupUrn, typename, visible } }): JSX.Element =>
      isEmptyStateCard && view ? (
        <MyBetsPageEmptyState
          title={labels.emptyStateTitle}
          subTitle={emptyStateSubTitle}
          hasEmptyStateImage={view.hasEmptyStateImage}
          homepageButtonText={labels.homepageButtonText}
          homepageUrn={homepageUrn}
        />
      ) : (
        <View style={typename === "SwimlaneCardGroup" ? styles.swimlane : undefined}>
          <ConnectedCardGroup
            urn={cardGroupUrn as string}
            component={CardGroup}
            typename={typename as string}
            visible={visible}
          />
        </View>
      ),
    [view, labels.emptyStateTitle, labels.homepageButtonText, emptyStateSubTitle, homepageUrn],
  );

  const sendTooltipAnalyticsEvent = useCallback(
    (isOpen: boolean) => dispatchMyBetsHeaderTooltipToggle(isOpen),
    [dispatchMyBetsHeaderTooltipToggle],
  );

  const headerActionComponent = useMemo(
    () => (
      <View style={styles.headerActionContainer}>
        <View style={styles.segmentedControlContainer}>
          <SegmentedControl
            options={heritageBetsToggleOptions}
            selectedOption={selectedHeritageBetsType}
            onPress={handleHeritageToggleTap}
          />
        </View>
        <MyBetsHeaderTooltip {...heritageBetsTooltipContent} handleTooltipToggle={sendTooltipAnalyticsEvent} />
      </View>
    ),
    [
      heritageBetsToggleOptions,
      selectedHeritageBetsType,
      handleHeritageToggleTap,
      heritageBetsTooltipContent,
      sendTooltipAnalyticsEvent,
    ],
  );

  const listHeaderComponent = useMemo(() => {
    if (!isLoggedIn || !selectedOrderType) return null;

    return (
      <View style={styles.myBetsHeaderContainer}>
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
          dispatchSettlementLinkPageNavigationAction={dispatchSettlementLinkPageNavigationAction}
          headerItems={headerItems}
        />
      </View>
    );
  }, [
    handleOrderStatusTap,
    handleOrderTypeTap,
    handleResetFilterTap,
    hasResetFilters,
    isLoggedIn,
    isToKeepOrdersFilter,
    labels,
    orderStatusList,
    orderTypeList,
    selectedOrderStatusType,
    selectedOrderType,
    showHeritageBetsToggle,
    headerActionComponent,
    dispatchSettlementLinkPageNavigationAction,
    isExchangeProduct,
    settlementLink,
    settlementLinkLabel,
    view,
    headerItems,
  ]);

  const PullRefreshMemo = useMemo(() => <ConnectedPullRefresh component={PullRefresh} viewUrn={urn} />, [urn]);

  const itemsListRef: RefObject<{
    items: MyBetsItem[];
    view: MyBetsView | null;
    urn: string;
    cursor: string;
  }> = useRef({ items, view, urn, cursor });

  useEffect(() => {
    itemsListRef.current = {
      ...itemsListRef.current,
      items,
      view,
      cursor,
      urn,
    };
  }, [items, view, cursor, urn]);

  const onViewCallBack = useCallback<OnViewableItemsChanged>(
    ({ viewableItems, changed }) => {
      changed.forEach(({ item, isViewable }) => setVisibility(item.urn, isViewable));

      const { cursor: refCursor, items: refItems, urn: refUrn, view: refView } = itemsListRef.current;

      if (refItems.length > viewableItems.length) {
        return;
      }

      if (refView?.pageInfo.hasNextPage) {
        dispatchFetchMoreCatalogueAction(refUrn, refCursor);
      }
    },
    [setVisibility, itemsListRef, dispatchFetchMoreCatalogueAction],
  );

  return (
    <View {...getTestProps(MY_BETS_PAGE, false)} style={styles.itemsList}>
      <FlatList
        {...getTestProps(MY_BETS_PAGE_FLATLIST, false)}
        listRef={ref}
        ListHeaderComponent={listHeaderComponent}
        ListHeaderComponentStyle={styles.listHeaderComponentStyle}
        refreshControl={PullRefreshMemo}
        data={items}
        renderItem={renderItem}
        contentContainerStyle={styles.container}
        onEndReachedThreshold={END_REACHED_THRESHOLD}
        onEndReached={handleScrollEnd}
        initialNumToRender={INITIAL_NUM_TO_RENDER}
        maxToRenderPerBatch={MAX_TO_RENDER_PER_BATCH}
        onViewableItemsChanged={onViewCallBack}
        viewabilityConfig={VIEWABILITY_CONFIG}
        scrollEventThrottle={16}
        onScroll={handleScroll}
      />
      {isExchangeProduct && <ConnectedMyBetsExchangeBottomSheet component={MyBetsExchangeBottomSheet} visible={true} />}
    </View>
  );
};

export default MyBetsPage;
