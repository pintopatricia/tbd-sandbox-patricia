import type { JSX } from "react";
import { FunctionComponent, useState } from "react";

import { Product } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import URN from "@ppb/tbd-store/state/layout/URN";

import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import ConnectedCard from "../Card";
import Card from "../Card/Card.web";
import ConnectedCouponHeaderCard from "../CouponHeaderCard";
import CouponHeaderCard from "../CouponHeaderCard/CouponHeaderCard.web";
import CouponPlaceholder from "../Coupon/CouponPlaceholder.web";
import ConnectCouponSportsbook from "../CouponSportsbook";
import CouponSportsbook from "../CouponSportsbook/CouponSportsbook.web";
import ConnectCouponExchange from "../CouponExchange";
import CouponExchange from "../CouponExchange/CouponExchange.web";
import { CouponListProps } from "./props";
import CouponHeaderCardPlaceholder from "../CouponHeaderCard/CouponHeaderCardPlaceholder.web";
import { useVisibilityObserver } from "../../hooks/useVisibilityObserver.web";
import { Divider } from "@ppb/the-wall-web";
import styles from "./CouponList.web.css";

const NUM_OF_RENDER_ITEMS = 8;

function renderCard(
  urn: URN,
  typename: string,
  product: Product,
  couponCardGroupUrn: URN,
  visible: boolean,
  isLastCoupon: boolean,
): JSX.Element | null {
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
      return <ConnectedCard component={Card} urn={urn} typename={typename} />;
  }
}

const haveItemsChanged = (items?: PartialItem[], previousItems?: PartialItem[]): boolean => {
  const lengthChanged = !!items?.length && !!previousItems?.length && items?.length !== previousItems?.length;
  return lengthChanged || JSON.stringify(items) !== JSON.stringify(previousItems);
};

const CouponList: FunctionComponent<CouponListProps> = ({ items, product, dispatchFetchCards, couponCardGroupUrn }) => {
  const [previousItems, setPreviousItems] = useState<PartialItem[] | undefined>(items);
  const forceUpdate = haveItemsChanged(items, previousItems);

  if (forceUpdate) {
    setPreviousItems(items);
  }

  const { observe, visibility } = useVisibilityObserver({
    onFirstShow: (urn) => {
      dispatchFetchCards(urn, items, NUM_OF_RENDER_ITEMS);
    },
  });

  return (
    <div className={styles.couponListContainer}>
      {items.map(({ urn, typename }, index) => (
        <div
          key={`${urn}-${product}-${index}`}
          ref={(node) => {
            observe(node, urn);
          }}
        >
          {renderCard(urn, typename, product, couponCardGroupUrn, !!visibility[urn], index === items.length - 1)}
        </div>
      ))}
    </div>
  );
};

export default CouponList;
