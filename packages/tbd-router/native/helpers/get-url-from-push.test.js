import { CampaignClassic } from "@adobe/react-native-aepcampaignclassic";
import { buildUrl } from "@ppb/tbd-routes";
import { Brand } from "@ppb/tbd-store/config/Brand";
import { getInfoFromPush } from "./get-url-from-push";

jest.mock("@adobe/react-native-aepcampaignclassic", () => ({
  CampaignClassic: { trackNotificationClickWithUserInfo: jest.fn() },
}));

jest.mock("@ppb/tbd-routes", () => ({
  buildUrl: jest.fn(),
  RouteTypes: { Event: "e", Race: "r" },
}));

const MOCK_MARKETING_URL = "fake marketing url";
const MOCK_BODY = "fake body text";
const MOCK_TITLE = "fake title text";

describe("Push Notifications Helper", () => {
  describe("getInfoFromPush", () => {
    describe("if called with a notification that has EXTRA_ADOBE_PUSH_MESSAGE", () => {
      it("should call trackNotification method", () => {
        getInfoFromPush(
          {
            payload: {
              EXTRA_ADOBE_PUSH_MESSAGE: {
                _dId: "deliveryID",
                _mId: "messageID",
                marketing_url: MOCK_MARKETING_URL,
              },
            },
          },
          Brand.Betfair,
        );

        expect(CampaignClassic.trackNotificationClickWithUserInfo).toHaveBeenCalledWith({
          _dId: "deliveryID",
          _mId: "messageID",
        });
      });

      it("should return the marketing_url as url and the _msg as body", () => {
        const returnValue = getInfoFromPush(
          {
            payload: { EXTRA_ADOBE_PUSH_MESSAGE: { marketing_url: MOCK_MARKETING_URL, _msg: MOCK_BODY } },
          },
          Brand.Betfair,
        );

        expect(returnValue).toEqual({ url: MOCK_MARKETING_URL, body: MOCK_BODY, pushMessagePlatform: "Abobe" });
      });
    });

    describe("if called with a notification that has marketing_url", () => {
      it("should return the marketing_url as url, the title and the body", () => {
        const returnValue = getInfoFromPush(
          {
            payload: { marketing_url: MOCK_MARKETING_URL, title: MOCK_TITLE, body: MOCK_BODY },
          },
          Brand.Betfair,
        );

        expect(returnValue).toEqual({
          url: MOCK_MARKETING_URL,
          title: MOCK_TITLE,
          body: MOCK_BODY,
          pushMessagePlatform: "Abobe",
        });
      });
    });

    describe("if called with a notification that has com.urbanairship.metadata", () => {
      describe("when event type is not racing", () => {
        it("should return the right deeplink for the event", () => {
          buildUrl.mockReturnValue("e-12345");
          const returnValue = getInfoFromPush(
            {
              payload: { eventTypeId: "2", Id: "12345", "com.urbanairship.metadata": "nobodyCares" },
            },
            Brand.Betfair,
          );

          expect(returnValue).toEqual({ url: "bfe://e-12345", pushMessagePlatform: "Airship" });
        });
      });

      describe("when event type is racing", () => {
        it("should return the right deeplink for the race", () => {
          buildUrl.mockReturnValue("r-7|98765");

          const returnValue = getInfoFromPush(
            {
              payload: { eventTypeId: "7", Id: "98765", "com.urbanairship.metadata": "nobodyCares" },
            },
            Brand.Betfair,
          );

          expect(returnValue).toEqual({ url: "bfe://r-7|98765", pushMessagePlatform: "Airship" });
        });
      });
    });
  });

  describe("if called with other type of notification", () => {
    it("should return an empty object", () => {
      const returnValue = getInfoFromPush(
        {
          payload: {},
        },
        Brand.Betfair,
      );

      expect(returnValue).toEqual({});
    });
  });
});
