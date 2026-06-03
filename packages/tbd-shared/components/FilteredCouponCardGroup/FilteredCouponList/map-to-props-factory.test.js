import { FETCH_CARDS_FROM_LIST } from "@ppb/tbd-store/actions/catalogue";
import { Product } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { mapDispatchToProps, makeMapStateToProps } from "./map-to-props-factory";

const getGenericCouponCardGroupByURN = jest.fn();
const getVisibleItems = jest.fn();
const getCouponProductsByURNSelector = jest.fn(() => ({ Sportsbook: false, Exchange: false }));

jest.mock("../../../helpers/i18n", () => ({
  i18n: ({ key }) => key,
}));

jest.mock(
  "@ppb/tbd-store/state/layout/cardgroups/filtered-coupon-cardgroups/filtered-coupon-cardgroups-selectors",
  () => ({
    createFindCouponCardGroupByURNSelector: jest.fn(() => getGenericCouponCardGroupByURN),
    createFilteredCouponVisibleItemsByUrnSelector: jest.fn(() => getVisibleItems),
  }),
);

jest.mock("@ppb/tbd-store/state/layout/layout-selectors", () => ({
  createCouponProductsByURNSelector: jest.fn(() => getCouponProductsByURNSelector),
}));

const stateMock = {
  layouts: {
    cardgroups: {
      couponcardgroups: {
        cardgroupURN: {
          urn: "cardgroupURN",
          items: [
            { urn: "item:1", typename: "item" },
            { urn: "item:2", typename: "item" },
          ],
        },
      },
    },
  },
};

describe("mapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  it("should call getGenericCouponCardGroupByURN", () => {
    const mapStateToProps = makeMapStateToProps();

    mapStateToProps(stateMock, { urn: "cardgroupURN" });

    expect(getGenericCouponCardGroupByURN).toHaveBeenCalledWith(stateMock.layouts.cardgroups, "cardgroupURN");
  });

  describe("when card group doesn't exist", () => {
    it("should not call getCouponProductsByURNSelector", () => {
      getGenericCouponCardGroupByURN.mockReturnValue(null);

      const mapStateToProps = makeMapStateToProps();

      mapStateToProps(stateMock, { urn: "cardgroupURN" });

      expect(getCouponProductsByURNSelector).not.toHaveBeenCalled();
    });

    it("should return empty", () => {
      const mapStateToProps = makeMapStateToProps();

      const result = mapStateToProps(stateMock, { urn: "cardgroupURN" });

      expect(result).toEqual({});
    });
  });

  describe("when card group exists", () => {
    it("should call getCouponProductsByURNSelector", () => {
      getGenericCouponCardGroupByURN.mockReturnValue({ items: [] });
      const mapStateToProps = makeMapStateToProps();

      mapStateToProps(stateMock, { urn: "cardgroupURN" });

      expect(getCouponProductsByURNSelector).toHaveBeenCalledWith(stateMock.layouts, "cardgroupURN");
    });

    describe("and there's Sportsbook available", () => {
      it("should return correct state", () => {
        getGenericCouponCardGroupByURN.mockReturnValue({
          items: [
            { urn: "item:1", typename: "item" },
            { urn: "item:2", typename: "item" },
          ],
        });
        getCouponProductsByURNSelector.mockReturnValue({
          Sportsbook: true,
          Exchange: false,
        });
        const mapStateToProps = makeMapStateToProps();

        const result = mapStateToProps(stateMock, { urn: "cardgroupURN" });

        expect(result).toEqual({
          urn: "cardgroupURN",
          product: Product.Sportsbook,
          items: [
            { urn: "item:1", typename: "item" },
            { urn: "item:2", typename: "item" },
          ],
        });
      });

      describe("and items has CouponHeaderCard without EventMarketCard", () => {
        it("should return correct state", () => {
          getGenericCouponCardGroupByURN.mockReturnValue({
            items: [
              { urn: "item:1", typename: "CouponHeaderCard" },
              { urn: "item:2", typename: "CouponHeaderCard" },
              { urn: "item:3", typename: "CouponHeaderCard" },
              { urn: "item:4", typename: "EventMarketCard" },
            ],
          });
          getCouponProductsByURNSelector.mockReturnValue({
            Sportsbook: true,
            Exchange: false,
          });
          const mapStateToProps = makeMapStateToProps();

          const result = mapStateToProps(stateMock, { urn: "cardgroupURN" });

          expect(result).toEqual({
            urn: "cardgroupURN",
            product: Product.Sportsbook,
            items: [
              { urn: "item:3", typename: "CouponHeaderCard" },
              { urn: "item:4", typename: "EventMarketCard" },
            ],
          });
        });
      });
    });

    describe("and there's Exchange available", () => {
      it("should return correct state", () => {
        getGenericCouponCardGroupByURN.mockReturnValue({
          items: [
            { urn: "item:1", typename: "item" },
            { urn: "item:2", typename: "item" },
          ],
        });
        getCouponProductsByURNSelector.mockReturnValue({
          Sportsbook: false,
          Exchange: true,
        });
        const mapStateToProps = makeMapStateToProps();

        const result = mapStateToProps(stateMock, { urn: "cardgroupURN" });

        expect(result).toEqual({
          urn: "cardgroupURN",
          product: Product.Exchange,
          items: [
            { urn: "item:1", typename: "item" },
            { urn: "item:2", typename: "item" },
          ],
        });
      });
    });

    describe("items memoization", () => {
      beforeEach(() => {
        getGenericCouponCardGroupByURN.mockReset();
        getCouponProductsByURNSelector.mockReset();
      });

      it("should return the same items reference across calls when coupon.items is unchanged", () => {
        const sourceItems = [
          { urn: "item:1", typename: "CouponHeaderCard" },
          { urn: "item:2", typename: "CouponHeaderCard" },
          { urn: "item:3", typename: "EventMarketCard" },
        ];
        getGenericCouponCardGroupByURN.mockReturnValue({ items: sourceItems });
        getCouponProductsByURNSelector.mockReturnValue({ Sportsbook: true, Exchange: false });

        const mapStateToProps = makeMapStateToProps();
        const first = mapStateToProps(stateMock, { urn: "cardgroupURN" });
        const second = mapStateToProps(stateMock, { urn: "cardgroupURN" });

        expect(second.items).toBe(first.items);
      });

      it("should return a new items reference when coupon.items reference changes", () => {
        getGenericCouponCardGroupByURN
          .mockReturnValueOnce({
            items: [
              { urn: "item:1", typename: "CouponHeaderCard" },
              { urn: "item:2", typename: "EventMarketCard" },
            ],
          })
          .mockReturnValueOnce({
            items: [
              { urn: "item:1", typename: "CouponHeaderCard" },
              { urn: "item:2", typename: "EventMarketCard" },
              { urn: "item:3", typename: "EventMarketCard" },
            ],
          });
        getCouponProductsByURNSelector.mockReturnValue({ Sportsbook: true, Exchange: false });

        const mapStateToProps = makeMapStateToProps();
        const first = mapStateToProps(stateMock, { urn: "cardgroupURN" });
        const second = mapStateToProps(stateMock, { urn: "cardgroupURN" });

        expect(second.items).not.toBe(first.items);
      });

      it("should not mutate the source items array", () => {
        const sourceItems = [
          { urn: "item:1", typename: "CouponHeaderCard" },
          { urn: "item:2", typename: "CouponHeaderCard" },
          { urn: "item:3", typename: "EventMarketCard" },
        ];
        const snapshot = sourceItems.map((item) => ({ ...item }));
        getGenericCouponCardGroupByURN.mockReturnValue({ items: sourceItems });
        getCouponProductsByURNSelector.mockReturnValue({ Sportsbook: true, Exchange: false });

        makeMapStateToProps()(stateMock, { urn: "cardgroupURN" });

        expect(sourceItems).toEqual(snapshot);
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("dispatchFetchCards", () => {
    it("should dispatch fetch cards action", () => {
      const { dispatchFetchCards } = mapDispatchToProps;

      expect(dispatchFetchCards("urn:fake", [{ urn: "urn:1", typename: "Card" }], 8, true)).toEqual({
        type: FETCH_CARDS_FROM_LIST,
        payload: {
          urn: "urn:fake",
          partials: [{ urn: "urn:1", typename: "Card" }],
          numberOfCards: 8,
        },
      });
    });
  });
});
