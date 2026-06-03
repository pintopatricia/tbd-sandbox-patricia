import { FETCH_CARDS_FROM_LIST } from "@ppb/tbd-store/actions/catalogue";
import { mapDispatchToProps, makeMapStateToProps } from "./map-to-props-factory";

const getGenericCouponCardGroupByURN = jest.fn();

jest.mock(
  "@ppb/tbd-store/state/layout/cardgroups/filtered-coupon-cardgroups/filtered-coupon-cardgroups-selectors",
  () => ({
    createFindCouponCardGroupByURNSelector: jest.fn(() => getGenericCouponCardGroupByURN),
  }),
);

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

  describe("when card group exists", () => {
    beforeEach(() => {
      getGenericCouponCardGroupByURN.mockReturnValue({
        items: [
          { urn: "item:1", typename: "item" },
          { urn: "item:2", typename: "item" },
        ],
        title: "All Matches",
      });
    });

    it("should return correct state", () => {
      const mapStateToProps = makeMapStateToProps();

      const result = mapStateToProps(stateMock, { urn: "cardgroupURN" });

      expect(result).toEqual({
        urn: "cardgroupURN",
        items: [
          { urn: "item:1", typename: "item" },
          { urn: "item:2", typename: "item" },
        ],
      });
    });
  });

  describe("when card group does not exists", () => {
    beforeEach(() => {
      getGenericCouponCardGroupByURN.mockReturnValue(undefined);
    });

    it("should return empty", () => {
      const mapStateToProps = makeMapStateToProps();

      const result = mapStateToProps(stateMock, { urn: "cardgroupURN" });

      expect(result).toEqual({});
    });
  });
});

describe("mapDispatchToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("dispatchFetchCards", () => {
    it("should dispatch fetch cards action", () => {
      const { dispatchFetchCards } = mapDispatchToProps;

      expect(dispatchFetchCards("urn:fake", [{ urn: "urn:1" }])).toEqual({
        payload: { urn: "urn:fake", partials: [{ urn: "urn:1" }] },
        type: FETCH_CARDS_FROM_LIST,
      });
    });
  });
});
