import { render } from "@testing-library/react-native";

import { Product } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";

import CouponList from "../../CouponList/CouponList.native";
import FilteredCouponList from "./FilteredCouponList.native";

jest.mock("../../CouponList/CouponList.native", () => jest.fn(() => <coupon-list-mock />));

describe("FilteredCouponList", () => {
  afterEach(jest.clearAllMocks);

  it("should call CouponList", () => {
    const itemsToRender = [{ urn: "ppb:excMarket:1.162031694" }, { urn: "ppb:sbkMarket:924.201495349" }];

    render(
      <FilteredCouponList
        urn={"ppb:1:test"}
        items={itemsToRender}
        product={Product.Sportsbook}
        dispatchFetchCards={() => {}}
      />,
    );

    expect(CouponList).toHaveBeenCalledWith(
      {
        couponCardGroupUrn: "ppb:1:test",
        items: itemsToRender,
        product: Product.Sportsbook,
        dispatchFetchCards: expect.any(Function),
      },
      undefined,
    );
    expect(CouponList).toHaveBeenCalledTimes(1);
  });
});
