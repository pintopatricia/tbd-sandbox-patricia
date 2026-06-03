import { PUSH } from "@ppb/tbd-store/actions/router";
import { getViewZoneByItemUrn } from "@ppb/tbd-store/state/layout/viewzones/viewzone-selectors";
import { FETCH_CARDS_FROM_LIST } from "@ppb/tbd-store/actions/catalogue";
import { createCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors", () => {
  const getGamingCardGroupByURN = jest.fn();

  return {
    createCardGroupByURNSelector: jest.fn(() => getGamingCardGroupByURN),
  };
});

jest.mock("@ppb/tbd-store/state/layout/viewzones/viewzone-selectors", () => ({
  getViewZones: jest.fn(),
  getViewZoneByItemUrn: jest.fn(),
}));

const stateMock = {
  layouts: {
    views: {
      browse: {
        "ppb:tbd:view:browse:gaming": {
          urn: "ppb:tbd:view:browse:gaming",
          url: "browse/browse:gaming",
          typename: "BrowseView",
          isOpen: true,
          search: {
            inputSearchTerm: "",
            result: {
              query: "",
              startIndex: 0,
              pageSize: 0,
              items: [],
            },
          },
        },
      },
    },

    cardgroups: {
      gamingcardgroups: {
        fakeGamingCardGroupUrn: {
          urn: "fakeGamingCardGroupUrn",
        },
      },
      segmentedcardgroups: {
        "ppb:tbd:segmented:card:group:test1": {
          urn: "ppb:tbd:segmented:card:group:test1",
          type: "SEGMENTED_CARDGROUP",
          items: ["ppb:tbd:card:group:curatedGames:arcade"],
        },
      },
    },
    viewzones: {
      "ppb:tbd:gaming:masterConfigElement:multifunctional_module/1": {
        urn: "ppb:tbd:gaming:masterConfigElement:multifunctional_module/1",
        type: "VIEW_ZONE",
        title: "Casino",
        items: [
          { typename: "SegmentedCardGroup", urn: "ppb:tbd:segmented:card:group:test1" },
          { typename: "SwimlaneCardGroup", urn: "ppb:tbd:card:group:curatedGames:recently" },
        ],
      },
    },
  },
};

describe("makeMapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("mapStateToProps", () => {
    describe("card group", () => {
      it("should call getGamingCardGroupByURN with params", () => {
        const mapStateToProps = makeMapStateToProps();
        mapStateToProps(stateMock, { urn: "fakeGamingCardGroupUrn" });

        expect(createCardGroupByURNSelector()).toHaveBeenCalledWith(
          {
            fakeGamingCardGroupUrn: {
              urn: "fakeGamingCardGroupUrn",
            },
          },
          "fakeGamingCardGroupUrn",
        );
      });

      it("should call getViewZoneByItemUrn with params", () => {
        const mapStateToProps = makeMapStateToProps();
        mapStateToProps(stateMock, { urn: "fakeGamingCardGroupUrn", parentUrn: "parentUrn" });

        expect(getViewZoneByItemUrn).toHaveBeenCalledWith(stateMock, "parentUrn");
      });

      it("should return game cards", () => {
        createCardGroupByURNSelector().mockReturnValue({
          title: "fakeTitle",
          items: [{ urn: "fullCardsByCardGroup" }],
          urn: "fakeGamingCardGroupUrn",
          defaultLayout: "fakeLayout",
          viewAll: {
            label: "test",
            viewLink: {
              viewUrn: "fakeUrn",
              viewUrl: "fakeUrl",
            },
          },
        });

        const mapStateToProps = makeMapStateToProps();
        const result = mapStateToProps(stateMock, {
          urn: "fakeGamingCardGroupUrn",
          parentUrn: "parentUrn",
        });

        expect(result).toEqual({
          cardGroupUrn: "fakeGamingCardGroupUrn",
          gamingCategoryLink: undefined,
          items: [{ urn: "fullCardsByCardGroup" }],
          layout: "fakeLayout",
          title: "fakeTitle",
          parentUrn: "parentUrn",
          totalItems: 1,
          viewZoneTitle: "",
          viewAll: { label: "test", viewLink: { viewUrl: "fakeUrl", viewUrn: "fakeUrn" } },
        });
      });

      it("should return game cards with gamingCategoryLink and no viewAll", () => {
        createCardGroupByURNSelector().mockReturnValue({
          title: "fakeTitle",
          items: [{ urn: "fullCardsByCardGroup" }],
          urn: "fakeGamingCardGroupUrn",
          defaultLayout: "CARD_LIST",
          viewAll: {
            label: "test",
            viewLink: {
              viewUrn: "fakeUrn",
              viewUrl: "fakeUrl",
            },
          },
        });

        const mapStateToProps = makeMapStateToProps();
        const result = mapStateToProps(stateMock, { urn: "fakeGamingCardGroupUrn" });

        expect(result).toEqual({
          cardGroupUrn: "fakeGamingCardGroupUrn",
          parentUrn: undefined,
          viewZoneTitle: "",
          gamingCategoryLink: {
            buttonText: undefined,
            cardIcon: undefined,
            label: "test",
            viewLink: { viewUrl: "fakeUrl", viewUrn: "fakeUrn" },
          },
          items: [{ urn: "fullCardsByCardGroup" }],
          layout: "CARD_LIST",
          title: "fakeTitle",
          totalItems: 1,
        });
      });

      it("should return no game cards", () => {
        createCardGroupByURNSelector().mockReturnValue(null);

        const mapStateToProps = makeMapStateToProps();
        const result = mapStateToProps(stateMock, { urn: "fakeGamingCardGroupUrn" });

        expect(result).toEqual({});
      });

      it("should return game cards with no title if type is favourite games", () => {
        createCardGroupByURNSelector().mockReturnValue({
          title: "fakeTitle",
          items: [{ urn: "fullCardsByCardGroup" }],
          urn: "fakeGamingCardGroupUrn",
          defaultLayout: "fakeLayout",
          cardGroupType: "FAVOURITE_GAMES",
          viewAll: {
            label: "test",
            viewLink: {
              viewUrn: "fakeUrn",
              viewUrl: "fakeUrl",
            },
          },
        });

        const mapStateToProps = makeMapStateToProps();
        const result = mapStateToProps(stateMock, {
          urn: "fakeGamingCardGroupUrn",
          parentUrn: "parentUrn",
        });

        expect(result).toEqual({
          cardGroupUrn: "fakeGamingCardGroupUrn",
          gamingCategoryLink: undefined,
          items: [{ urn: "fullCardsByCardGroup" }],
          layout: "fakeLayout",
          parentUrn: "parentUrn",
          totalItems: 1,
          viewZoneTitle: "",
          viewAll: { label: "test", viewLink: { viewUrl: "fakeUrl", viewUrn: "fakeUrn" } },
        });
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("dispatchNavigateToCategoryUsingSeeAllButton", () => {
    it("should dispatch navigate to category using see all button action", () => {
      const { dispatchNavigateToCategoryUsingSeeAllButton } = mapDispatchToProps;
      const viewLinkMock = { viewUrl: "fakeUrl", viewUrn: "fakeUrn" };
      const cardUrn = "fakeCardGroupUrn";
      const text = "fakeText";
      const zoneTitle = "fakeZoneTitle";

      const result = dispatchNavigateToCategoryUsingSeeAllButton(viewLinkMock, cardUrn, text, zoneTitle);

      expect(result).toEqual({
        payload: {
          cardUrn: "fakeCardGroupUrn",
          href: "fakeUrl",
          label: "fakeText",
          viewUrn: "fakeUrn",
          zoneTitle: "fakeZoneTitle",
        },
        type: "UI__NAVIGATE_TO_GAMING_CATEGORY_USING_SEE_ALL_BUTTON",
      });
    });
  });

  describe("dispatchPushAction", () => {
    it("should dispatch push action", () => {
      const { dispatchPushAction } = mapDispatchToProps;
      const viewLinkMock = { viewUrl: "fakeUrl", viewUrn: "fakeUrn" };

      expect(dispatchPushAction(viewLinkMock)).toEqual({
        payload: viewLinkMock,
        type: PUSH,
      });
    });
  });

  describe("dispatchFetchCards", () => {
    it("should dispatch fetch cards action", () => {
      const { dispatchFetchCards } = mapDispatchToProps;
      expect(dispatchFetchCards("ppb:tbd:urn", ["itemA, itemB"])).toEqual({
        type: FETCH_CARDS_FROM_LIST,
        payload: {
          urn: "ppb:tbd:urn",
          partials: ["itemA, itemB"],
        },
      });
    });
  });

  describe("dispatchLaunchCategory", () => {
    it("should dispatch launch category action", () => {
      const { dispatchLaunchCategory } = mapDispatchToProps;
      const viewLinkMock = { viewUrl: "fakeUrl", viewUrn: "fakeUrn" };
      const categoryName = "fakeCategoryName";
      const zoneTitle = "fakeZoneTitle";

      expect(dispatchLaunchCategory(viewLinkMock, categoryName, zoneTitle)).toEqual({
        payload: {
          href: "fakeUrl",
          categoryName: "fakeCategoryName",
          zoneTitle: "fakeZoneTitle",
        },
        type: "UI__NAVIGATE_TO_GAMING_CATEGORY_USING_MULTIFUNCTIONAL",
      });
    });
  });
});
