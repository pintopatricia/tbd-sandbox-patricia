import { MapStateToPropsFactory } from "react-redux";
import { FetchCardsFromListAction, FETCH_CARDS_FROM_LIST } from "@ppb/tbd-store/actions/catalogue";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { createFindCouponCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/filtered-coupon-cardgroups/filtered-coupon-cardgroups-selectors";

export type CardProps = {
  urn: URN;
  items: PartialItem[];
};

export type ContainerProps = {
  urn: URN;
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getGenericCouponCardGroupByURN = createFindCouponCardGroupByURNSelector();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const coupon = getGenericCouponCardGroupByURN(state.layouts.cardgroups, urn);

    if (!coupon) {
      return {};
    }

    return {
      urn,
      items: coupon.items,
    };
  };
};

const dispatchFetchCards = (urn: string, partials: PartialItem[]): FetchCardsFromListAction => ({
  type: FETCH_CARDS_FROM_LIST,
  payload: {
    urn,
    partials,
  },
});

export type DispatchProps = {
  dispatchFetchCards: typeof dispatchFetchCards;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchFetchCards,
};
