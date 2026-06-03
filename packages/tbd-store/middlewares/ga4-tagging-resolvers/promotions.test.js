import { buildPromotionEvent } from "tagging-library";
import { TaggingAction } from "../tagging-resolvers/AnalyticsConstants";
import { getAcceptPromotionEvent, getCancelPromotionEvent } from "./promotions";
import { IMS_PROMOTION_MODULE_NAME } from "../../state";

jest.mock("tagging-library", () => ({
  buildPromotionEvent: jest.fn().mockReturnValue("promotions event"),
}));

jest.mock("../../state/layout/layout-selectors", () => ({
  createViewTypeSelector: jest.fn(() => jest.fn(() => "home")),
}));

beforeEach(jest.clearAllMocks);

describe("promotions", () => {
  describe("getAcceptPromotionEvent", () => {
    it("should return the correct event payload", () => {
      const action = {
        payload: {
          urn: "urn mock",
          name: "name mock",
          promoStatus: "promoStatus mock",
          userStatus: "userStatus mock",
          type: "OPT_IN",
          progressValue: 30,
        },
      };

      const result = getAcceptPromotionEvent(action, {});

      expect(buildPromotionEvent).toHaveBeenCalledWith({
        action: TaggingAction.ACCEPT_PROMOTION,
        elementText: "accept",
        module: IMS_PROMOTION_MODULE_NAME,
        destinationUrl: "null",
        position: "null",
        promotionId: "urn mock",
        promotionName: "name mock",
        promotionUserStatus: "userStatus mock",
        promotionState: "promoStatus mock",
        promotionType: "OPT_IN",
        progressBar: "30",
        tierLevel: "null",
      });

      expect(result).toEqual("promotions event");
    });
  });

  describe("getCancelPromotionEvent", () => {
    it("should return the correct event payload", () => {
      const action = {
        payload: {
          label: "label mock",
          urn: "urn mock",
          name: "name mock",
          promoStatus: "promoStatus mock",
          userStatus: "userStatus mock",
          type: "FREE_SPIN",
          progressValue: 30,
        },
      };
      const result = getCancelPromotionEvent(action, {});

      expect(buildPromotionEvent).toHaveBeenCalledWith({
        action: TaggingAction.CLICKED,
        elementText: "label mock",
        module: IMS_PROMOTION_MODULE_NAME,
        destinationUrl: "null",
        position: "null",
        promotionId: "urn mock",
        promotionName: "name mock",
        promotionUserStatus: "userStatus mock",
        promotionState: "promoStatus mock",
        promotionType: "FREE_SPIN",
        progressBar: "30",
        tierLevel: "null",
      });

      expect(result).toEqual("promotions event");
    });
  });
});
