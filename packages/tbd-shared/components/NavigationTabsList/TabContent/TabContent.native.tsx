import type { JSX } from "react";
import { memo, useCallback, useMemo, useState } from "react";
import * as React from "react";
import { View, type StyleProp, type ViewStyle } from "react-native";

import type { PartialItem } from "@ppb/tbd-store/state";
import { Tooltip } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";

import { useNativeLazyLoading } from "../../../hooks/useNativeLazyLoading.native";
import { CARD_VIEWABILITY_CONFIG } from "../../../hooks/useCardVisibility.native";
import { FlatList, type RenderItem, type ViewabilityProps } from "../../FlatList.native";
import { NavigationTabItem, type NavigationTabItemProps } from "../../NavigationTabItem/NavigationTabItem.native";

import { NAVIGATION_TAB_ITEM_VIEW, TAB_CONTENT } from "./TabContent.native.selectors";
import type { TabContentProps } from "./TabContent.types";
import styles from "./TabContent.native.styles";

const INITIAL_NUM_TO_RENDER = 10;

type MemoizedProps = TabContentProps & {
  viewabilityProps: ViewabilityProps;
};

// NOTE: Below is the list of components that already have side padding and should not have the default cardItem padding
const groupsWithSidePadding = [
  "SwimlaneCardGroup",
  "GamingCardGroup",
  "FilteredCouponCardGroup",
  "RacesByTimeRangeCardGroup",
  "FutureRacingCardGroup",
  "EmbeddedViewCard",
  "PebbleCardGroup",
  "QuicklinksGridCardGroup",
  "MiniPromoBannerCard",
  "ObbCreatedBetsCardGroup",
  "OutrightMarketListCard",
  "BroadcastsCard",
  "SearchBarCard",
  "PackagedCreatedBetsCard",
  "PriceBoostMultisListCard",
  "LottoCard",
  "RacingSwimlaneCardGroup",
  "ObbEventPopularsCard",
  "ObbOnboardingCardsCardGroup",
];

const getStyle = (typename: string): StyleProp<ViewStyle> =>
  !groupsWithSidePadding.includes(typename) && styles.cardItem;

const NavigationTabItemView: React.FC<NavigationTabItemProps> = ({ urn, typename, visible }): JSX.Element => (
  <View style={getStyle(typename)} {...getTestProps(NAVIGATION_TAB_ITEM_VIEW, false)}>
    <NavigationTabItem urn={urn} typename={typename} visible={visible} />
  </View>
);

const MemoizedNavigationTabItem = memo(NavigationTabItemView);

/**
 * Renders a Card or CardGroup based on the typename
 */

const MemoizedTabContent: React.FC<MemoizedProps> = memo(({ items, tooltip, viewabilityProps }): JSX.Element => {
  const [isTooltipVisible, setTooltipVisible] = useState(!!tooltip);

  const onTooltipClose = useCallback((): void => {
    setTooltipVisible(false);

    if (tooltip) {
      tooltip.onClose();
    }
  }, [tooltip]);

  const renderItem = useCallback<RenderItem<PartialItem>>(
    ({ item: { urn, typename, visible } }): JSX.Element => (
      <MemoizedNavigationTabItem urn={urn} typename={typename} visible={visible} />
    ),
    [],
  );

  return (
    <View style={styles.container} {...getTestProps(TAB_CONTENT, false)}>
      {tooltip && isTooltipVisible && (
        <View style={styles.tooltip}>
          <Tooltip title={tooltip.title} description={tooltip.description} onClosePress={onTooltipClose} />
        </View>
      )}
      <FlatList
        style={styles.tabContent}
        data={items}
        renderItem={renderItem}
        onViewableItemsChanged={viewabilityProps.onViewableItemsChanged}
        initialNumToRender={INITIAL_NUM_TO_RENDER}
      />
    </View>
  );
});

MemoizedTabContent.displayName = "MemoizedTabContent";

export const TabContent: React.FC<TabContentProps> = (props): JSX.Element => {
  const onViewableItemsChanged = useNativeLazyLoading(props.items, props.dispatchFetchCardsFromList);

  const viewabilityProps = useMemo(
    (): ViewabilityProps => ({
      viewabilityConfig: CARD_VIEWABILITY_CONFIG,
      onViewableItemsChanged: onViewableItemsChanged,
    }),
    [onViewableItemsChanged],
  );

  return <MemoizedTabContent viewabilityProps={viewabilityProps} {...props} />;
};

// @ts-expect-error This component is expected to re-render a lot since it is wrapping useContext and useNativeLazyLoading
TabContent.whyDidYouRender = false;
