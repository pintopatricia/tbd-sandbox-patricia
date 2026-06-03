import { FetchCardsFromListAction } from "@ppb/tbd-store/actions/catalogue";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { Product } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { URN } from "@ppb/the-wall-common/types";

export type DispatchFetchCards = (
  urn: string,
  partials: PartialItem[],
  numberOfCards?: number,
) => FetchCardsFromListAction;

export type CouponListProps = {
  product: Product;
  items: PartialItem[];
  dispatchFetchCards: DispatchFetchCards;
  couponCardGroupUrn: URN;
  visible?: boolean;
};
