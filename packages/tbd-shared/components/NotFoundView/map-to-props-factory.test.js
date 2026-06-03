import { UI__NAVIGATE_FROM_NOT_FOUND_VIEW, UI__NOT_FOUND_VIEW_LOADED } from "@ppb/tbd-store/actions/navigation";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const getNotFoundViewByURN = jest.fn();

jest.mock("@ppb/tbd-store/state/layout/views/view-selectors", () => ({
  createViewByURNSelector: jest.fn(() => getNotFoundViewByURN),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

describe("makeMapStateToProps", () => {
  const NOTFOUND_VIEWS = {
    layouts: {
      views: {
        notfound: {
          "urn:fake:notfound": {
            urn: "urn:fake:notfound",
            items: [
              {
                typename: "RegulatoryCard",
                urn: "ppb:tbd:card:regulatory:footer",
              },
            ],
          },
        },
      },
    },
    entities: {
      preferences: { products: ["sportsbook"] },
      brandSettings: {
        ERROR_VIEW_IMAGE: true,
      },
    },
  };
  const NOTFOUND_VIEWS_WITHOUT_IMAGE = {
    ...NOTFOUND_VIEWS,
    entities: {
      ...NOTFOUND_VIEWS.entities,
      brandSettings: {
        ERROR_VIEW_IMAGE: false,
      },
    },
  };

  function setup(state, urn) {
    getNotFoundViewByURN.mockImplementation((views) => views[urn] || null);

    return makeMapStateToProps()(state, { urn });
  }

  describe("when there is a layout for provided URN", () => {
    beforeAll(jest.clearAllMocks);

    it("should getNotFoundViewByURN from state", () => {
      setup(NOTFOUND_VIEWS, "urn:fake:notfound");

      expect(getNotFoundViewByURN).toHaveBeenCalledWith(NOTFOUND_VIEWS.layouts.views.notfound, "urn:fake:notfound");
    });

    it("should return page layout", () => {
      const props = setup(NOTFOUND_VIEWS, "urn:fake:notfound");
      expect(props).toEqual({
        items: [
          {
            typename: "RegulatoryCard",
            urn: "ppb:tbd:card:regulatory:footer",
          },
        ],
        messages: {
          title: "I18N.REDIRECT404.TITLE",
          message: "I18N.REDIRECT404.SUBTITLE",
        },
        links: [
          {
            label: "I18N.NAVIGATION_BAR.HOME",
            viewLink: {
              viewUrl: "",
              viewUrn: "ppb:tbd:view:generic:home",
            },
            icon: "HOME",
          },
          {
            label: "I18N.NAVIGATION_BAR.MY_BETS",
            viewLink: {
              viewUrl: "mybets/myBets-open",
              viewUrn: "ppb:tbd:view:myBets:open",
            },
            icon: "MY_BETS",
          },
          {
            label: "I18N.SPORT_EVENT.IN_PLAY",
            viewLink: {
              viewUrl: "view/d-inplay",
              viewUrn: "ppb:tbd:view:generic:inplay",
            },
            icon: "IN_PLAY",
          },
        ],
        hasErrorViewImage: true,
      });
    });
  });

  describe("when there is no layout for provided URN", () => {
    beforeAll(jest.clearAllMocks);

    it("should getNotFoundViewByURN from state", () => {
      setup(
        {
          layouts: {
            views: {
              notfound: {},
            },
          },
          entities: {
            preferences: { products: ["sportsbook"] },
          },
        },
        "urn:fake:notfound",
      );
      expect(getNotFoundViewByURN).toHaveBeenCalledWith({}, "urn:fake:notfound");
    });

    it("should not return items", () => {
      const { items } = setup(
        {
          layouts: {
            views: {
              notfound: {},
            },
          },
          entities: {
            preferences: { products: ["exchange", "sportsbook"] },
          },
        },
        "urn:fake:notfound",
      );

      expect(items).toEqual(undefined);
    });
  });

  describe("when the products list is empty", () => {
    beforeAll(jest.clearAllMocks);

    it("should return my bets link with default value (sportsbook)", () => {
      const props = setup(
        {
          layouts: {
            views: {
              notfound: {
                "urn:fake:notfound": {
                  urn: "urn:fake:notfound",
                  items: [
                    {
                      typename: "RegulatoryCard",
                      urn: "ppb:tbd:card:regulatory:footer",
                    },
                  ],
                },
              },
            },
          },
          entities: {
            preferences: { products: [] },
            brandSettings: {
              ERROR_VIEW_IMAGE: true,
            },
          },
        },
        "urn:fake:notfound",
      );

      expect(props).toEqual({
        items: [
          {
            typename: "RegulatoryCard",
            urn: "ppb:tbd:card:regulatory:footer",
          },
        ],
        messages: {
          title: "I18N.REDIRECT404.TITLE",
          message: "I18N.REDIRECT404.SUBTITLE",
        },
        links: [
          {
            label: "I18N.NAVIGATION_BAR.HOME",
            viewLink: {
              viewUrl: "",
              viewUrn: "ppb:tbd:view:generic:home",
            },
            icon: "HOME",
          },
          {
            label: "I18N.NAVIGATION_BAR.MY_BETS",
            viewLink: {
              viewUrl: "mybets/myBets-open",
              viewUrn: "ppb:tbd:view:myBets:open",
            },
            icon: "MY_BETS",
          },
          {
            label: "I18N.SPORT_EVENT.IN_PLAY",
            viewLink: {
              viewUrl: "view/d-inplay",
              viewUrn: "ppb:tbd:view:generic:inplay",
            },
            icon: "IN_PLAY",
          },
        ],
        hasErrorViewImage: true,
      });
    });
  });

  describe("when the error view image is false in store", () => {
    beforeAll(jest.clearAllMocks);

    it("should return false for hasErrorViewImage", () => {
      const props = setup(NOTFOUND_VIEWS_WITHOUT_IMAGE, "urn:fake:notfound");

      expect(props).toEqual({
        items: [
          {
            typename: "RegulatoryCard",
            urn: "ppb:tbd:card:regulatory:footer",
          },
        ],
        messages: {
          title: "I18N.REDIRECT404.TITLE",
          message: "I18N.REDIRECT404.SUBTITLE",
        },
        links: [
          {
            label: "I18N.NAVIGATION_BAR.HOME",
            viewLink: {
              viewUrl: "",
              viewUrn: "ppb:tbd:view:generic:home",
            },
            icon: "HOME",
          },
          {
            label: "I18N.NAVIGATION_BAR.MY_BETS",
            viewLink: {
              viewUrl: "mybets/myBets-open",
              viewUrn: "ppb:tbd:view:myBets:open",
            },
            icon: "MY_BETS",
          },
          {
            label: "I18N.SPORT_EVENT.IN_PLAY",
            viewLink: {
              viewUrl: "view/d-inplay",
              viewUrn: "ppb:tbd:view:generic:inplay",
            },
            icon: "IN_PLAY",
          },
        ],
        hasErrorViewImage: false,
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  describe("dispatchNavigationFromNotFoundView", () => {
    beforeAll(jest.clearAllMocks);

    it("should dispatch navigation from not found view action with a label", () => {
      const { dispatchNavigationFromNotFoundView } = mapDispatchToProps;

      expect(dispatchNavigationFromNotFoundView("label")).toEqual({
        type: UI__NAVIGATE_FROM_NOT_FOUND_VIEW,
        payload: {
          label: "label",
        },
      });
    });

    it("should dispatch navigation from not found view action", () => {
      const { dispatchNavigationNotFoundViewLoaded } = mapDispatchToProps;

      expect(dispatchNavigationNotFoundViewLoaded()).toEqual({
        type: UI__NOT_FOUND_VIEW_LOADED,
      });
    });
  });
});
