import { PUSH } from "@ppb/tbd-store/actions/router";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const getSportRibbonCardGroupByURNSelector = jest.fn();

jest.mock("@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors", () => ({
  createCardGroupByURNSelector: jest.fn(() => getSportRibbonCardGroupByURNSelector),
}));

jest.mock("@ppb/the-wall-icons/icons", () => ({
  iconsMap: {
    "icon-category": {
      "icon-id": "icon",
    },
  },
}));

const stateMock = {
  layouts: {
    cardgroups: {
      sportribboncardgroups: {
        sportribboncardgroupUrn: {
          urn: "sportribboncardgroupUrn",
        },
      },
    },
  },
  entities: {
    brandSettings: {
      HIGHLIGHTED_SPORTS_RIBBON: false,
    },
  },
};

const itemsMock = [{ urn: "AAA" }, { urn: "BBB" }];

describe("mapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("getSportRibbonCardGroupByURNSelector", () => {
    it("should call getSportRibbonCardGroupByURNSelector with the correct arguments", () => {
      const mapStateToProps = makeMapStateToProps();

      getSportRibbonCardGroupByURNSelector.mockReturnValue({ items: itemsMock });

      mapStateToProps(stateMock, { urn: "sportribboncardgroupUrn" });

      expect(getSportRibbonCardGroupByURNSelector).toHaveBeenCalledWith(
        stateMock.layouts.cardgroups.sportribboncardgroups,
        "sportribboncardgroupUrn",
      );
    });
  });

  describe("getIcon", () => {
    it("should return the correct icon", () => {
      const mapStateToProps = makeMapStateToProps();
      const { getIcon } = mapStateToProps(stateMock, { urn: "sportribboncardgroupUrn" });

      expect(getIcon(null, undefined, 2)).toEqual("Sports--Tennis");
      expect(getIcon(null, undefined, "invalid")).toEqual("Sports--Generic-Sports");

      expect(getIcon(undefined, "ODDSBOOST", 4)).toEqual("Sports--Football");
      expect(getIcon({ category: "icon-category", id: "icon-id" }, undefined, 2)).toEqual("icon");
    });
  });

  describe("when the urn doesn't exist", () => {
    it("should return an empty object", () => {
      const mapStateToProps = makeMapStateToProps();
      getSportRibbonCardGroupByURNSelector.mockReturnValue(undefined);

      const result = mapStateToProps(stateMock, "nonexistentURN");

      expect(result).toEqual({});
    });
  });

  describe("when the urn exists", () => {
    it("should return the items", () => {
      const mapStateToProps = makeMapStateToProps();
      getSportRibbonCardGroupByURNSelector.mockReturnValue({
        items: itemsMock,
      });

      const result = mapStateToProps(stateMock, { urn: "sportribboncardgroupUrn" });

      expect(result).toEqual({
        isSportsRibbonHighlighted: false,
        items: itemsMock,
        getIcon: expect.any(Function),
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("dispatchRouterPushAction", () => {
    it("should dispatch router push action", () => {
      const { dispatchRouterPushAction } = mapDispatchToProps;
      const viewLink = { href: "/some-path", label: "Some Label" };

      expect(dispatchRouterPushAction(viewLink)).toEqual({
        type: PUSH,
        payload: viewLink,
      });
    });
  });

  describe("dispatchNavigationViewFromFavourites", () => {
    it("should dispatch navigation view from favourites action", () => {
      const { dispatchNavigationViewFromFavourites } = mapDispatchToProps;
      const label = "Sport Label";
      const href = "/sport/path";
      const cardUrn = "urn:card:123";

      expect(dispatchNavigationViewFromFavourites(label, href, cardUrn)).toEqual({
        type: "UI_NAVIGATE_VIEW_FROM_FAVOURITES",
        payload: {
          label,
          href,
          cardUrn,
        },
      });
    });
  });
});
