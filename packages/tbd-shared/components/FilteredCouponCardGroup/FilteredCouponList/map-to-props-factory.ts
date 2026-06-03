import { MapStateToPropsFactory } from "react-redux";
import { createSelector } from "reselect";

import { FetchCardsFromListAction, FETCH_CARDS_FROM_LIST } from "@ppb/tbd-store/actions/catalogue";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { createCouponProductsByURNSelector } from "@ppb/tbd-store/state/layout/layout-selectors";
import { createFindCouponCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/filtered-coupon-cardgroups/filtered-coupon-cardgroups-selectors";
import { Product } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";

const createFilteredItemsSelector = () =>
  createSelector([(items: PartialItem[]) => items], (items): PartialItem[] =>
    // Filter out consecutive CouponHeaderCard items, keeping only the last one
    items.reduce((acc: PartialItem[], currentItem: PartialItem, index: number) => {
      const prevItem = items[index - 1];

      if (currentItem.typename === "CouponHeaderCard" && prevItem?.typename === "CouponHeaderCard") {
        acc.pop();
      }

      acc.push(currentItem);
      return acc;
    }, []),
  );

export type CardProps = {
  urn: URN;
  items: PartialItem[];
  product: Product;
};

export type ContainerProps = {
  urn: URN;
  visible?: boolean;
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getGenericCouponCardGroupByURN = createFindCouponCardGroupByURNSelector();
  const getCouponProductsByURNSelector = createCouponProductsByURNSelector();
  const getFilteredItems = createFilteredItemsSelector();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const coupon = getGenericCouponCardGroupByURN(state.layouts.cardgroups, urn);

    if (!coupon) {
      return {};
    }

    const availableProducts = getCouponProductsByURNSelector(state.layouts, urn);

    return {
      urn,
      product: availableProducts.Sportsbook ? Product.Sportsbook : Product.Exchange,
      items: getFilteredItems(coupon.items),
    };
  };
};

const dispatchFetchCards = (
  urn: string,
  partials: PartialItem[],
  numberOfCards?: number,
): FetchCardsFromListAction => ({
  type: FETCH_CARDS_FROM_LIST,
  payload: {
    urn,
    partials,
    numberOfCards,
  },
});

export type DispatchProps = {
  dispatchFetchCards: typeof dispatchFetchCards;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchFetchCards,
};
