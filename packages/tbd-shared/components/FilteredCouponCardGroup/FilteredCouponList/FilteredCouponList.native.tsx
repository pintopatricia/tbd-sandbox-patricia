import { FunctionComponent } from "react";
import { View } from "react-native";

import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";

import { ComponentProps } from "./props";
import CouponList from "../../CouponList/CouponList.native";
import { FILTERED_COUPON_LIST_CONTAINER } from "./FilteredCouponList.native.selectors";

const FilteredCouponList: FunctionComponent<ComponentProps> = ({
  urn,
  items,
  product,
  visible,
  dispatchFetchCards,
}) => (
  <View {...getTestProps(FILTERED_COUPON_LIST_CONTAINER, false)}>
    <CouponList
      couponCardGroupUrn={urn}
      items={items}
      product={product}
      dispatchFetchCards={dispatchFetchCards}
      visible={visible}
    />
  </View>
);

export default FilteredCouponList;
