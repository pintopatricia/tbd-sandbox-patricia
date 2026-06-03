import { render } from "@testing-library/react";
import "jest-dom/extend-expect";

import { Product } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";

import FilteredCouponList from "./FilteredCouponList.web";
import CouponList from "../../CouponList/CouponList.web";

jest.mock("../../CouponList/CouponList.web", () => jest.fn(() => <coupon-list-mock />));

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
