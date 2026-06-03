import { createCardGroupByURNSelector } from "../cardgroups-selectors";
import { createNavTabTitleByURNSelector, createViewTypeSelector } from "../../layout-selectors";
import { createGetCouponCardGroupParentTitlesSelector } from "./filtered-coupon-cardgroups-selectors";

jest.mock("../../cards/cards-selectors", () => ({
  createCardByURNSelector: jest.fn(),
}));

jest.mock("../cardgroups-selectors", () => ({
  createCardGroupByURNSelector: jest.fn(() => jest.fn()),
}));

jest.mock("../../layout-selectors", () => ({
  createNavTabTitleByURNSelector: jest.fn(() => jest.fn()),
  createViewTypeSelector: jest.fn(() => jest.fn()),
}));

describe("filteredcouponcardgroups selectors", () => {
  beforeEach(jest.clearAllMocks);

  describe("createGetCouponCardGroupParentTitlesSelector", () => {
    const state = {
      layouts: {
        cardgroups: {},
      },
    };

    describe("and the other selectors return values", () => {
      it("should return the expected values", () => {
        createCardGroupByURNSelector.mockReturnValueOnce(() => ({ title: "groupTitle" }));
        createNavTabTitleByURNSelector.mockReturnValueOnce(() => "tabTitle");
        createViewTypeSelector.mockReturnValueOnce(() => "viewType");

        const result = createGetCouponCardGroupParentTitlesSelector()(state, "couponCardGroupUrn");

        expect(result).toEqual({
          groupTitle: "groupTitle",
          tabTitle: "tabTitle",
          viewType: "viewType",
        });
      });
    });

    describe("and the other selectors return null", () => {
      it("should return the expected values", () => {
        createCardGroupByURNSelector.mockReturnValueOnce(() => ({ title: null }));
        createNavTabTitleByURNSelector.mockReturnValueOnce(() => null);
        createViewTypeSelector.mockReturnValueOnce(() => null);

        const result = createGetCouponCardGroupParentTitlesSelector()(state, "couponCardGroupUrn");

        expect(result).toEqual({
          groupTitle: null,
          tabTitle: null,
          viewType: null,
        });
      });
    });
  });
});
