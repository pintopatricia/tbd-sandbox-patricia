import { FunctionComponent } from "react";

import { ComponentProps } from "./props";
import CouponList from "../../CouponList/CouponList.web";

const FilteredCouponList: FunctionComponent<ComponentProps> = ({ urn, items, product, dispatchFetchCards }) => (
  <CouponList couponCardGroupUrn={urn} items={items} product={product} dispatchFetchCards={dispatchFetchCards} />
);

export default FilteredCouponList;
