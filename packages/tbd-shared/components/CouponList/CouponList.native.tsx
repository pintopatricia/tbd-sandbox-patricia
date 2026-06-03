import type { JSX } from "react";
import { FunctionComponent, useCallback } from "react";
import { View } from "react-native";

import URN from "@ppb/tbd-store/state/layout/URN";
import { Product } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";

import { PartialItem } from "@ppb/tbd-store";
import { useNativeLazyLoading } from "../../hooks/useNativeLazyLoading.native";
import ConnectedCard from "../Card";
import Card from "../Card/Card.native";
import ConnectCouponSportsbook from "../CouponSportsbook";
import CouponSportsbook from "../CouponSportsbook/CouponSportsbook.native";
import ConnectCouponExchange from "../CouponExchange";
import CouponExchange from "../CouponExchange/CouponExchange.native";
import CouponPlaceholder from "../Coupon/CouponPlaceholder.native";
import ConnectedCouponHeaderCard from "../CouponHeaderCard";
import CouponHeaderCard from "../CouponHeaderCard/CouponHeaderCard.native";
import CouponHeaderCardPlaceholder from "../CouponHeaderCard/CouponHeaderCardPlaceholder.native";
import { COUPON_LIST_CONTAINER } from "./CouponList.native.selectors";
import { CouponListProps } from "./props";
import { FlatList, RenderItem } from "../FlatList.native";
import { Divider } from "@ppb/the-wall-native";

const INITIAL_NUM_ITEMS_TO_RENDER = 10;
const NUM_ITEMS_PER_BATCH = 8;
const WINDOW_SIZE = 21;

const viewabilityConfig = {
  viewAreaCoveragePercentThreshold: 0,
  waitForInteraction: true,
  minimumViewTime: 0,
};

function renderCard(
  item: { urn: URN; typename: string; visible: boolean },
  product: Product,
  couponCardGroupUrn: URN,
  isLastCoupon: boolean,
): JSX.Element {
  const { urn, typename, visible } = item;

  switch (typename) {
    case "EventMarketCard":
      return (
        <>
          {product === Product.Sportsbook ? (
            <ConnectCouponSportsbook
              urn={urn}
              component={CouponSportsbook}
              placeholder={CouponPlaceholder}
              couponCardGroupUrn={couponCardGroupUrn}
              visible={visible}
            />
          ) : (
            <ConnectCouponExchange
              urn={urn}
              component={CouponExchange}
              placeholder={CouponPlaceholder}
              couponCardGroupUrn={couponCardGroupUrn}
              visible={visible}
            />
          )}
          {!isLastCoupon && <Divider />}
        </>
      );
    case "CouponHeaderCard":
      return (
        <ConnectedCouponHeaderCard
          component={CouponHeaderCard}
          urn={urn}
          product={product}
          placeholder={CouponHeaderCardPlaceholder}
          visible={visible}
        />
      );
    default:
      return <ConnectedCard component={Card} urn={urn} typename={typename} visible={visible} />;
  }
}

type ItemsWithVisibility = { visible: boolean } & PartialItem;

const CouponList: FunctionComponent<CouponListProps> = (props) => {
  const { items, dispatchFetchCards, product, couponCardGroupUrn } = props;
  const onViewableItemsChanged = useNativeLazyLoading(items, dispatchFetchCards, NUM_ITEMS_PER_BATCH);

  // Due to a bug in react native some of the items within the viewport do not trigger onViewableItemsChanged
  // correctly unless the user interact with the list (e.g. scrolling). To mitigate this issue we use waitForInteraction
  // to force the onViewableItemsChanged callback to only trigger after a scroll. We also force the first
  // INITIAL_NUM_ITEMS_TO_RENDER items to be marked as visible. What this means is that we will start polling prices
  // for the first 10 items which is enough to mitigate the issue in most scenarios. After the user start scrolling
  // the application fixes itself.
  const data: ItemsWithVisibility[] = items.map((item, index) => ({
    ...item,
    visible: index < INITIAL_NUM_ITEMS_TO_RENDER,
  }));

  const renderItem = useCallback<RenderItem<PartialItem>>(
    ({ item, index }) => renderCard(item, product, couponCardGroupUrn, index === items.length - 1),
    [product, couponCardGroupUrn, items.length],
  );

  // Sort filters may repeat competition headers
  const keyExtractor = useCallback(
    ({ urn, typename }: ItemsWithVisibility, index: number) =>
      typename === "CouponHeaderCard" ? `coupon-item-${urn}-${index}` : `coupon-item-${urn}`,
    [],
  );

  if (!items.length) {
    return null;
  }

  return (
    <View {...getTestProps(COUPON_LIST_CONTAINER, false)}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        windowSize={WINDOW_SIZE}
        initialNumToRender={INITIAL_NUM_ITEMS_TO_RENDER}
        maxToRenderPerBatch={NUM_ITEMS_PER_BATCH}
      />
    </View>
  );
};

export default CouponList;
