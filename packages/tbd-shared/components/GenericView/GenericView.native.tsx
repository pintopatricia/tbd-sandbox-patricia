import { FunctionComponent, useCallback, useEffect, useState, useMemo, useRef } from "react";
import { View, StyleProp, ViewStyle, Platform, LayoutAnimation, LayoutChangeEvent, ViewToken } from "react-native";
import { PortalHost, PortalProvider } from "@gorhom/portal";
import { createSelector } from "reselect";

import { ModalHeader, PageHeader } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { PageHeaderIcons } from "@ppb/the-wall-common/types";
import { goBack, NativeEntityTypes } from "@ppb/tbd-router/native";

import { LoadedComponentProps } from "./props";
import { GENERIC_VIEW, GENERIC_VIEW_HEADER, GENERIC_VIEW_ITEMS } from "./GenericView.native.selectors";

import styles from "./GenericView.native.styles";
import { useNativeLazyLoading, useVisibility } from "../../hooks/useNativeLazyLoading.native";
import { CARD_VIEWABILITY_CONFIG } from "../../hooks/useCardVisibility.native";
import { FlatListWithOffsetContext } from "../FlatListWithOffsetContext/FlatListWithOffsetContext.native";

import { ScrollIntoViewProvider } from "../../hooks/useScrollIntoView.native";
import { useStickyObserver } from "../../hooks/useStickyObserver.native";
import { PullRefresh } from "../PullRefresh/PullRefresh.native";
import ConnectedPullRefresh from "../PullRefresh";
import { ViewItem } from "../ViewItem/ViewItem.native";
import { RenderItem } from "../FlatList.native";
import ConnectedBackNavigationItem from "../BackNavigationItem";
import BackNavigationItem from "../BackNavigationItem/BackNavigationItem.native";
import { useGenericViewScrollListener } from "./generic-view-scroll-listener";
import { FILLED_CARDS_PER_LAZY_LOAD } from "@ppb/tbd-store/config/common-config";

const RICH_CONTENT_CARDS = new Set(["BroadcastsCard", "FixtureCard"]);

type ViewableItemsChanged = {
  viewableItems: ViewToken[];
  changed: ViewToken[];
};

// TODO: Sticky behavior should be sent by BFF currently we have this hardcode as in web
enum StickyCardTypeNames {
  RaceDetailsCard = "RaceDetailsCard",
  FixtureCard = "FixtureCard",
  RaceViewLinksCard = "RaceViewLinksCard",
  SearchZone = "SearchZone",
}

// Number of components that are declared as "Header Components"
const HEADER_COMPONENTS = 1;

/**
 * createStickyIndexSelector
 * For a given set of cards, returns
 *  - empty array if there are no sticky cards
 *  - or the corresponding sticky indexes of the cards
 *    - We are going to add to the index a HEADER_COMPONENTS value
 *    - because the header itself is an item inside the list
 */
const createStickyIndexSelector = () =>
  createSelector(
    [(fullCards: PartialItem[]) => fullCards],
    (fullCards: PartialItem[]): number[] =>
      fullCards?.reduce<number[]>((acc, item, index) => {
        if (item.typename in StickyCardTypeNames) {
          if (item.typename === StickyCardTypeNames.FixtureCard && item.red7Scoreboard) {
            return acc;
          }
          acc.push(index + HEADER_COMPONENTS);
        }
        return acc;
      }, []) || [],
  );

/**
 * Applies specific style for when a card is followed by a StickyCard in the partial items list
 */
function cardFollowedByStickyCardStyle(index: number, items: PartialItem[]): Record<string, unknown> | false {
  const nextCard = items[index + 1]?.typename;

  return (
    (nextCard as StickyCardTypeNames) in StickyCardTypeNames &&
    (nextCard as StickyCardTypeNames) !== StickyCardTypeNames.RaceDetailsCard &&
    styles.cardFollowedBySticky
  );
}

const CARDS_WITHOUT_VERTICAL_SPACING = new Set([
  "GenericSwitcherCard",
  "RaceSwitcherCard",
  "IncidentsCard",
  "NavigationTabsList",
]);

const CARDS_WITH_HORIZONTAL_SPACING = new Set([
  "QuickLinksCard",
  "IncidentsCard",
  "BlurbCard",
  "GamingPrizeMachineCard",
]);

function getItemStyle(
  index: number,
  typename: string,
  items: PartialItem[],
  isModalView: boolean,
  theme: PartialItem["theme"],
): StyleProp<ViewStyle> {
  const shouldHaveVerticalSpacing = !(
    (typename as StickyCardTypeNames) in StickyCardTypeNames ||
    CARDS_WITHOUT_VERTICAL_SPACING.has(typename) ||
    (theme === "HIGHLIGHTED" && typename === "SportRibbonCardGroup") ||
    (index === 0 && isModalView)
  );

  const shouldHaveHorizontalSpacing = CARDS_WITH_HORIZONTAL_SPACING.has(typename);

  return [
    shouldHaveVerticalSpacing && styles.genericViewItemContainer,
    shouldHaveHorizontalSpacing && styles.genericViewItemContainerHorizontalMargin,
    shouldHaveVerticalSpacing && RICH_CONTENT_CARDS.has(typename) && styles.richContentContainer,
    cardFollowedByStickyCardStyle(index, items),
    theme === "HIGHLIGHTED" ? styles.highlighted : styles.default,
    typename === "SearchZone" && styles.transparent,
  ];
}

type HeaderProps = {
  isModalView: boolean;
  title: string;
  subtitle?: string;
  badge?: PageHeaderIcons;
  viewUrn: string;
};

const Header = ({ isModalView, title, subtitle, badge }: HeaderProps) => (
  <View style={!isModalView && title ? styles.header : undefined} {...getTestProps(GENERIC_VIEW_HEADER, false)}>
    {!!title && !isModalView && <PageHeader title={title} subtitle={subtitle} icon={badge} />}
  </View>
);
Header.displayName = "Header";

const getStickyIndexes = createStickyIndexSelector();

export const GenericView: FunctionComponent<LoadedComponentProps> = ({
  urn: viewUrn,
  items = [],
  title,
  subtitle,
  badge,
  isModalView,
  dispatchFetchCards,
  dispatchModalToggleAction,
  backNavigationTitle,
  pinGamingSearch,
}) => {
  /**
   * Triggers fetch card when item is visible
   */
  const stickyIndexes = useMemo(() => getStickyIndexes(items), [items]);
  const onViewableItemsChangedFetch = useNativeLazyLoading(items, dispatchFetchCards);
  const onViewableItemsChangedSticky = useStickyObserver(stickyIndexes);
  const setVisibility = useVisibility();
  const [scrollableAreaHeight, setScrollableAreaHeight] = useState(0);
  const { onScroll } = useGenericViewScrollListener();

  // Native workaround for a bug where FlatList's `onViewableItemsChanged` does not fire,
  // for items already in the viewport on first render, until the user scrolls.
  // Without this, above-the-fold cards (e.g. the roulette widget) never get fetched and
  // stay as placeholders until the user scrolls.
  // To avoid that we force an initial fetch for cards in batches of 4 and we ignore duplicates
  // if the card is already being fetched.
  const hasTriggeredInitialFetch = useRef(false);
  useEffect(() => {
    if (Platform.OS !== "ios" && Platform.OS !== "android") return;
    if (hasTriggeredInitialFetch.current || items.length === 0) return;
    hasTriggeredInitialFetch.current = true;
    for (let i = 0; i < items.length; i += FILLED_CARDS_PER_LAZY_LOAD) {
      dispatchFetchCards(items[i].urn, items);
    }
  }, [items, dispatchFetchCards]);

  // LayoutAnimation in android is experimental, and there is some issues when the FlatList is being animated
  // leaving the view half transparent. So we're cancelling the next LayoutAnimation
  useEffect(() => {
    if (!items.length && Platform.OS === "android") {
      LayoutAnimation.configureNext({ duration: 0, create: undefined, update: undefined, delete: undefined });
    }
  }, [items.length]);

  // Make this view as visible
  useEffect(() => {
    setVisibility(viewUrn, true);
    return () => setVisibility(viewUrn, false);
  }, [setVisibility, viewUrn]);

  const onViewableItemsChanged = useCallback(
    (change: ViewableItemsChanged) => {
      onViewableItemsChangedSticky.current(change);
      onViewableItemsChangedFetch(change);
    },
    [onViewableItemsChangedFetch, onViewableItemsChangedSticky],
  );

  // returns -infinity when the list is empty
  const lastStickyIndex = Math.max(...stickyIndexes);

  // this is used to check if the Search Bar from the Casino tab is present. If so, set the initialNumToRender to Infinity,
  // otherwise the scroll won't work as expected (flickering effect for some items).
  const isGamingSearchAvailable = items.some((item) => item.typename === "SearchZone");
  const disableSticky = isGamingSearchAvailable && !pinGamingSearch;

  const isNativeHomeTab = viewUrn === NativeEntityTypes.Home;

  // `initialNumToRender` determines the number of items to render in the initial batch. React Native keeps these items mounted
  // forever as part of the windowed rendering in order to improve perceived performance of scroll-to-top actions. By assigning
  // `Infinity` or the list total length to `initialNumToRender` we are hinting React Native to stop mounting and unmounting items
  // on scroll. Unfortunately, this operation can be prone to conflicts and more expensive when nesting FlatLists with complex
  // layouts. Performance profiling results have shown that keeping all items mounted outperformed virtualizing the list items.
  // It also mitigated some issues like loops in (un)mount states and a jumpy behavior as items are (un)mounted with inconsitent
  // heights or lazy loading for coupons mounted out of the viewport. When `lastStickyIndex >= 0`, sticky cards will take a
  // different approach for the initial items to render or it will thrown an error on Android.
  const initialNumToRender = lastStickyIndex >= 0 && !isGamingSearchAvailable ? lastStickyIndex + 1 : Infinity;

  const renderItemComponent = useCallback<RenderItem<PartialItem>>(
    ({ item: { urn, typename, visible, theme }, index }) => (
      <View
        style={getItemStyle(index, typename, items, isModalView, theme)}
        {...getTestProps(`${GENERIC_VIEW_ITEMS}`, false)}
      >
        <ViewItem urn={urn} typename={typename} visible={visible} theme={theme} />
      </View>
    ),
    [isModalView, items],
  );

  const onScrollableAreaLayoutChange = useCallback(
    (event: LayoutChangeEvent) => setScrollableAreaHeight(event.nativeEvent.layout.height),
    [],
  );

  const HeaderComponent = useMemo(
    () => <Header isModalView={isModalView} title={title} subtitle={subtitle} badge={badge} viewUrn={viewUrn} />,
    [badge, isModalView, subtitle, title, viewUrn],
  );
  const PullRefreshMemo = useMemo(() => <ConnectedPullRefresh component={PullRefresh} viewUrn={viewUrn} />, [viewUrn]);

  const ref = useRef(null);

  const onDismissCallback = useCallback(() => {
    dispatchModalToggleAction(false);

    goBack();
  }, [dispatchModalToggleAction]);

  return (
    <PortalProvider>
      <View style={styles.genericView} {...getTestProps(GENERIC_VIEW, false)}>
        {isModalView && <ModalHeader title={title} onDismiss={onDismissCallback} />}
        {backNavigationTitle && <ConnectedBackNavigationItem component={BackNavigationItem} urn={viewUrn} />}
        {pinGamingSearch && <PortalHost name="page-overlay" />}
        {isNativeHomeTab && <PortalHost name="game-widget" />}
        <ScrollIntoViewProvider wrappingRef={ref} scrollableAreaHeight={scrollableAreaHeight}>
          <FlatListWithOffsetContext
            listRef={ref}
            onLayout={onScrollableAreaLayoutChange}
            refreshControl={PullRefreshMemo}
            initialNumToRender={initialNumToRender}
            ListHeaderComponent={HeaderComponent}
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode="on-drag"
            data={items}
            scrollEnabled
            renderItem={renderItemComponent}
            stickyHeaderIndices={disableSticky ? [] : stickyIndexes}
            removeClippedSubviews={false} // When true, empty sticky indexes crash Android
            onViewableItemsChanged={onViewableItemsChanged}
            viewabilityConfig={CARD_VIEWABILITY_CONFIG}
            onScroll={onScroll}
          />
        </ScrollIntoViewProvider>
      </View>
    </PortalProvider>
  );
};
