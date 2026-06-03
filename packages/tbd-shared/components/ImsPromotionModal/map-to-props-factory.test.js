import { createFindViewByURNSelector } from "@ppb/tbd-store/state/layout/views/view-selectors";
import { PUSH } from "@ppb/tbd-store/actions/router";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/layout/views/view-selectors", () => {
  const getViewByURN = jest.fn();

  return {
    createFindViewByURNSelector: jest.fn(() => getViewByURN),
  };
});

describe("mapStateToProps", () => {
  const FAKE_PROMOTION_VIEW = {
    typename: "fakeImsPromotionView",
    returnViewLink: { viewUrn: "fakeUrn", viewUrl: "fakeUrl" },
    items: [
      { urn: "1", typename: "Card" },
      { urn: "2", typename: "Card" },
    ],
    title: "Fake Promotion",
  };

  const PROMOTION_VIEWS = {
    layouts: {
      views: {
        imspromotion: {
          fakePromotionViewUrn: FAKE_PROMOTION_VIEW,
        },
      },
    },
    router: {
      currentUrl: "/betting/fake",
    },
  };
  function setup(state, urn) {
    createFindViewByURNSelector().mockImplementation(({ imspromotion = {} }) => imspromotion[urn] || null);

    return makeMapStateToProps()(state, { urn });
  }

  beforeEach(jest.clearAllMocks);

  describe("when is layout for provided URN", () => {
    it("should getPromotionViewbyURN from state", () => {
      setup(PROMOTION_VIEWS, "fakePromotionViewUrn");
      expect(createFindViewByURNSelector()).toHaveBeenCalledWith(PROMOTION_VIEWS.layouts.views, "fakePromotionViewUrn");
    });

    it("the props should have the correct values", () => {
      const props = setup(PROMOTION_VIEWS, "fakePromotionViewUrn");

      expect(props).toEqual({
        view: "fakePromotionViewUrn",
        title: "Fake Promotion",
        returnViewLink: { viewUrl: "", viewUrn: "ppb:tbd:view:generic:home" },
      });
    });

    it("the props should have the correct values when one query param is missing", () => {
      PROMOTION_VIEWS.router.currentUrl = "/fakeUrl?urn=fakeUrn";
      const props = setup(PROMOTION_VIEWS, "fakePromotionViewUrn");

      expect(props).toEqual({
        view: "fakePromotionViewUrn",
        title: "Fake Promotion",
        returnViewLink: { viewUrl: "", viewUrn: "ppb:tbd:view:generic:home" },
      });
    });

    it("the props should have the correct values for viewlink when query parameters exist", () => {
      PROMOTION_VIEWS.router.currentUrl = "/fakeUrl?urn=fakeUrn&url=fakeUrl";
      const props = setup(PROMOTION_VIEWS, "fakePromotionViewUrn");

      expect(props).toEqual({
        view: "fakePromotionViewUrn",
        title: "Fake Promotion",
        returnViewLink: { viewUrl: "fakeUrl", viewUrn: "fakeUrn" },
      });
    });
  });

  describe("mapDispatchToProps", () => {
    beforeEach(jest.clearAllMocks);

    describe("dispatchFetchCards", () => {
      it("should dispatch fetch cards from list action", () => {
        const { dispatchGoBack } = mapDispatchToProps;
        const viewLink = { viewUrn: "fakeUrn", viewUrl: "fakeUrl" };

        expect(dispatchGoBack(viewLink)).toEqual({
          payload: {
            viewUrn: "fakeUrn",
            viewUrl: "fakeUrl",
          },
          type: PUSH,
        });
      });
    });
  });
});
