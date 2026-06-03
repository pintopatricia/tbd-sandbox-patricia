import { buildNotificationEvent } from "tagging-library";

import { PlatformType, TaggingAction } from "../tagging-resolvers/AnalyticsConstants";
import {
  getSmartAppBannerClickEvent,
  getSmartAppBannerCloseEvent,
  getSmartAppBannerDisplayEvent,
} from "./notification";

jest.mock("tagging-library", () => ({
  buildNotificationEvent: jest.fn().mockReturnValue("notification event"),
}));

const NATIVE_APP_ELEMENT_TEXT = "get the native app";
const URL_MOCK = "destination_url_mock";

describe("Notification GA4 resolvers", () => {
  beforeEach(jest.clearAllMocks);

  describe("Smart Banner Events", () => {
    describe("getSmartAppBannerClickEvent", () => {
      it("should call buildNotificationEvent with the correct payload", () => {
        const action = {
          payload: {
            url: URL_MOCK,
          },
        };

        const result = getSmartAppBannerClickEvent(action);

        expect(buildNotificationEvent).toHaveBeenCalledWith({
          action: TaggingAction.CLICKED,
          elementText: NATIVE_APP_ELEMENT_TEXT,
          pushMessagePlatform: PlatformType.Web,
          destinationUrl: URL_MOCK,
        });
        expect(result).toBe("notification event");
      });
    });

    describe.each([
      ["getSmartAppBannerCloseEvent", getSmartAppBannerCloseEvent, TaggingAction.CLOSED],
      ["getSmartAppBannerDisplayEvent", getSmartAppBannerDisplayEvent, TaggingAction.DISPLAYED],
    ])("%s", (functionName, getSmartAppBannerEvent, taggingAction) => {
      it("should call buildNotificationEvent with the correct payload", () => {
        const result = getSmartAppBannerEvent();

        expect(buildNotificationEvent).toHaveBeenCalledWith({
          action: taggingAction,
          elementText: NATIVE_APP_ELEMENT_TEXT,
          pushMessagePlatform: PlatformType.Web,
          destinationUrl: "",
        });
        expect(result).toBe("notification event");
      });
    });
  });
});
