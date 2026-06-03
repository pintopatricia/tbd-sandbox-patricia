import { TaggingAction } from "./AnalyticsConstants";
import { getViewbyURN } from "../../state/layout/views/event-view/event-view-selectors";
import { createViewTypeSelector } from "../../state/layout/layout-selectors";
import { getPromotionClickEvent } from "./banner";

jest.mock("tagging-library", () => ({}));

jest.mock("../../state/layout-snapshot", () => ({
  getLayoutMetadata: () => ({
    horizontalPosition: 1,
    verticalPosition: 2,
  }),
}));

jest.mock("../../state/layout/views/event-view/event-view-selectors");
jest.mock("../../state/application-state-selectors");
jest.mock("../../state/layout/layout-selectors");

describe("Banner GTM resolvers", () => {
  describe("getPromotionClickEvent", () => {
    const setup = ({ view = "SportView" } = {}) => {
      getViewbyURN.mockReturnValue(view);
      createViewTypeSelector.mockReturnValue(() => "page");
    };

    const actionPayload = {
      viewLink: { viewUrl: "linkHref" },
      title: "Promotion Title",
      promotionUrn: "ppb:tbd:card:promotion:1",
      isImsPromo: true,
    };

    const appState = {
      router: "router",
      layouts: {
        views: {
          event: {
            fakeEventViewURN: "fakeEventViewURN",
          },
        },
      },
    };

    it("should return the correct event payload", () => {
      setup();

      expect(getPromotionClickEvent(actionPayload, appState, TaggingAction.CLICKED_BANNER_CTA)).toEqual({
        event: "ga_event",
        category: "banner",
        action: TaggingAction.CLICKED_BANNER_CTA,
        label: "casino - Promotion Title",
        cd3: "page - banner swimlane",
        cd34: "linkHref",
        cd133: null,
        cd134: null,
        cd136: null,
        cd67: 2,
        cd42: 1,
        cd43: 1,
      });
    });
  });
});
