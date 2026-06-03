import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { SAW_CARD } from "@ppb/tbd-store/actions/interface";
import { UI__NAVIGATE_TO_SEE_ALL_PROMOTIONS } from "@ppb/tbd-store/actions/navigation";
import { PUSH } from "@ppb/tbd-store/actions/router";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

jest.mock("../../helpers/i18n", () => ({
  i18n: ({ key }) => key,
}));

jest.mock("@ppb/tbd-store/state/layout/cards/cards-selectors", () => {
  const getImsPromotionErrorCardByURN = jest.fn();
  return {
    createCardByURNSelector: jest.fn(() => getImsPromotionErrorCardByURN),
  };
});

jest.mock("@ppb/tbd-store/state/entities/ims-promotions/ImsPromotion", () => ({
  IMS_PROMOTION_MODULE_NAME: "moduleName",
}));

const STATE = {
  layouts: {
    cards: {
      imspromotionerror: { urn: "props" },
    },
  },
};

describe("mapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  it("should return props when card exist", () => {
    const getImsPromotionErrorCardByURN = createCardByURNSelector();

    getImsPromotionErrorCardByURN.mockReturnValue({
      errorCode: "COMPLETED",
      seeAll: {
        viewUrn: "viewURN",
        viewUrl: "viewURL",
      },
    });

    const mapStateToProps = makeMapStateToProps();

    const props = mapStateToProps(STATE, { urn: "ppb:tbd:card:imsPromotionError:gaming-win" });

    expect(getImsPromotionErrorCardByURN).toHaveBeenCalledWith(
      { urn: "props" },
      "ppb:tbd:card:imsPromotionError:gaming-win",
    );
    expect(props).toEqual({
      body: "I18N.PROMOTION.COMPLETED.BODY",
      title: "I18N.PROMOTION.COMPLETED.TITLE",
      type: "SUCCESS",
      i18n: {
        seeAllInfo: "I18N.PROMOTION.SEEALL.INFO",
        seeAllLabel: "I18N.PROMOTION.SEEALL.TITLE",
        recommended: "I18N.PROMOTION.ERROR.RECOMMENDED",
      },
      seeAllLink: {
        viewUrn: "viewURN",
        viewUrl: "viewURL",
      },
    });
  });

  it("should return an empty object when card does not exist", () => {
    const getImsPromotionErrorCardByURN = createCardByURNSelector();

    getImsPromotionErrorCardByURN.mockReturnValue(null);

    const mapStateToProps = makeMapStateToProps();

    const props = mapStateToProps(STATE, { urn: "ppb:tbd:card:imsPromotionError:gaming-win" });

    expect(getImsPromotionErrorCardByURN).toHaveBeenCalledWith(
      { urn: "props" },
      "ppb:tbd:card:imsPromotionError:gaming-win",
    );
    expect(props).toEqual({});
  });
});

describe("mapDispatchToProps", () => {
  describe("dispatchSawPromotionError", () => {
    it("should dispatch saw promotion error action", () => {
      const { dispatchSawPromotionError } = mapDispatchToProps;
      const label = "fakeLabel";

      expect(dispatchSawPromotionError(label)).toEqual({
        type: SAW_CARD,
        payload: { label, moduleName: "moduleName" },
      });
    });
  });

  describe("dispatchNavigateToSeeAllPromotions", () => {
    it("shoud dispatch navigate to see all promotion action", () => {
      const { dispatchNavigateToSeeAllPromotions } = mapDispatchToProps;
      const seeAllLink = {
        viewUrn: "viewURN",
        viewUrl: "viewURL",
      };

      expect(dispatchNavigateToSeeAllPromotions(seeAllLink)).toEqual({
        payload: seeAllLink,
        type: UI__NAVIGATE_TO_SEE_ALL_PROMOTIONS,
      });
    });
  });

  describe("dispatchPushAction", () => {
    it("shoud dispatch push action", () => {
      const { dispatchPushAction } = mapDispatchToProps;
      const viewLink = { viewUrn: "fakeURN", viewUrl: "fakeURL" };

      expect(dispatchPushAction(viewLink)).toEqual({
        payload: viewLink,
        type: PUSH,
      });
    });
  });
});
