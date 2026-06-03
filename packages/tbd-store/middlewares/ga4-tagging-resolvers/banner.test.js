import { buildBannerEvent } from "tagging-library";
import { getPromotionClickEvent } from "./banner";
import { TaggingAction } from "../tagging-resolvers/AnalyticsConstants";

jest.mock("tagging-library", () => ({
  buildBannerEvent: jest.fn().mockReturnValue("banner event"),
}));

jest.mock("../../state/layout-snapshot", () => ({
  getLayoutMetadata: () => ({
    horizontalPosition: 1,
    verticalPosition: 2,
  }),
}));

jest.mock("../../state/layout/layout-selectors", () => ({
  createViewTypeSelector: jest.fn(() => jest.fn(() => "home")),
}));
jest.mock("../../state/layout/views/event-view/event-view-selectors", () => ({
  getViewbyURN: jest.fn().mockReturnValue("SportView"),
}));

describe("Banner GA4 resolvers", () => {
  beforeEach(jest.clearAllMocks);

  describe("getPromotionClickEvent", () => {
    describe.each([
      [true, "casino - Promotion Title"],
      [false, "Promotion Title"],
    ])("when ImsPromo is `%s`", (isImsPromo, elementText) => {
      it("should call buildBannerEvent with the correct payload", () => {
        const action = {
          payload: {
            viewLink: { viewUrl: "linkHref" },
            title: "Promotion Title",
            isImsPromo,
            taggingAction: TaggingAction.CLICKED_BANNER_CTA,
          },
        };
        const result = getPromotionClickEvent(action, {});

        expect(buildBannerEvent).toHaveBeenCalledWith({
          action: TaggingAction.CLICKED_BANNER_CTA,
          elementText,
          module: "home - banner swimlane",
          destinationUrl: "linkHref",
          position: "1",
        });
        expect(result).toBe("banner event");
      });
    });
  });
});
