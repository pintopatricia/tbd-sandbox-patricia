import { buildNotificationEvent } from "tagging-library";
import { Brand } from "@ppb/tbd-store/config/Brand";
import { TaggingAction } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { notificationReceivedHandler, notificationSawHandler } from "./airship-listener-handlers";
import { getInfoFromPush } from "./get-url-from-push";

jest.mock("tagging-library", () => ({
  buildNotificationEvent: jest.fn().mockReturnValue("notification event"),
}));

jest.mock("./get-url-from-push", () => ({
  getInfoFromPush: jest.fn(),
}));

const sendEventMock = jest.fn();
const getInfoFromPushMock = {
  url: "bfe://pushNotificationFakeURL",
  pushMessagePlatform: "test platform",
};

describe("AirShip Listeners Handlers", () => {
  beforeEach(jest.clearAllMocks);

  describe("when notificationReceivedHandler is called", () => {
    describe("without notification text", () => {
      beforeEach(() => {
        getInfoFromPush.mockReturnValueOnce(getInfoFromPushMock);
        notificationReceivedHandler({}, null, Brand.Betfair, sendEventMock);
      });

      it("should call buildNotificationEvent with the correct params", () => {
        expect(buildNotificationEvent).toHaveBeenCalledWith({
          action: TaggingAction.RECEIVED_MESSAGE,
          destinationUrl: "bfe://pushNotificationFakeURL",
          elementText: "null",
          pushMessagePlatform: "test platform",
        });
        expect(buildNotificationEvent).toHaveBeenCalledTimes(1);
      });

      it("should call the sendEvent callback with the correct params", () => {
        expect(sendEventMock).toHaveBeenCalledWith("notification event");
        expect(sendEventMock).toHaveBeenCalledTimes(1);
      });
    });

    describe("and the pushMessagePlatform is not resolved", () => {
      beforeEach(() => {
        getInfoFromPush.mockReturnValueOnce({
          url: getInfoFromPushMock.url,
        });
        notificationReceivedHandler({}, "push text", Brand.Betfair, sendEventMock);
      });

      it("should call buildNotificationEvent with the correct params", () => {
        expect(buildNotificationEvent).toHaveBeenCalledWith({
          action: TaggingAction.RECEIVED_MESSAGE,
          destinationUrl: "bfe://pushNotificationFakeURL",
          elementText: "push text",
          pushMessagePlatform: "null",
        });
        expect(buildNotificationEvent).toHaveBeenCalledTimes(1);
      });

      it("should call the sendEvent callback with the correct params", () => {
        expect(sendEventMock).toHaveBeenCalledWith("notification event");
        expect(sendEventMock).toHaveBeenCalledTimes(1);
      });
    });

    describe("and the push notification has an url", () => {
      beforeEach(() => {
        getInfoFromPush.mockReturnValueOnce(getInfoFromPushMock);
        notificationReceivedHandler({}, "push text", Brand.Betfair, sendEventMock);
      });

      it("should call buildNotificationEvent with the correct params", () => {
        expect(buildNotificationEvent).toHaveBeenCalledWith({
          action: TaggingAction.RECEIVED_MESSAGE,
          destinationUrl: "bfe://pushNotificationFakeURL",
          elementText: "push text",
          pushMessagePlatform: "test platform",
        });
        expect(buildNotificationEvent).toHaveBeenCalledTimes(1);
      });

      it("should call the sendEvent callback with the correct params", () => {
        expect(sendEventMock).toHaveBeenCalledWith("notification event");
        expect(sendEventMock).toHaveBeenCalledTimes(1);
      });
    });

    describe("and the push notification doesn't have an url", () => {
      beforeEach(() => {
        getInfoFromPush.mockReturnValueOnce({
          pushMessagePlatform: getInfoFromPushMock.pushMessagePlatform,
        });
        notificationReceivedHandler({}, "push text", Brand.Betfair, sendEventMock);
      });

      it("should call buildNotificationEvent with the correct params", () => {
        expect(buildNotificationEvent).toHaveBeenCalledWith({
          action: TaggingAction.RECEIVED_MESSAGE,
          destinationUrl: "null",
          elementText: "push text",
          pushMessagePlatform: "test platform",
        });
        expect(buildNotificationEvent).toHaveBeenCalledTimes(1);
      });

      it("should call the sendEvent callback with the correct params", () => {
        expect(sendEventMock).toHaveBeenCalledWith("notification event");
        expect(sendEventMock).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("when notificationSawHandler is called", () => {
    describe("without notification text", () => {
      beforeEach(() => {
        getInfoFromPush.mockReturnValueOnce(getInfoFromPushMock);
        notificationSawHandler({}, null, Brand.Betfair, sendEventMock);
      });

      it("should call buildNotificationEvent with the correct params", () => {
        expect(buildNotificationEvent).toHaveBeenCalledWith({
          action: TaggingAction.SAW_MESSAGE,
          destinationUrl: "null",
          elementText: "null",
          pushMessagePlatform: "test platform",
        });
        expect(buildNotificationEvent).toHaveBeenCalledTimes(1);
      });

      it("should call the sendEvent callback with the correct params", () => {
        expect(sendEventMock).toHaveBeenCalledWith("notification event");
        expect(sendEventMock).toHaveBeenCalledTimes(1);
      });
    });

    describe("and the pushMessagePlatform is not resolved", () => {
      beforeEach(() => {
        getInfoFromPush.mockReturnValueOnce({
          url: getInfoFromPushMock.url,
        });
        notificationSawHandler({}, "push text", Brand.Betfair, sendEventMock);
      });

      it("should call buildNotificationEvent with the correct params", () => {
        expect(buildNotificationEvent).toHaveBeenCalledWith({
          action: TaggingAction.SAW_MESSAGE,
          destinationUrl: "null",
          elementText: "push text",
          pushMessagePlatform: "null",
        });
        expect(buildNotificationEvent).toHaveBeenCalledTimes(1);
      });

      it("should call the sendEvent callback with the correct params", () => {
        expect(sendEventMock).toHaveBeenCalledWith("notification event");
        expect(sendEventMock).toHaveBeenCalledTimes(1);
      });
    });

    describe("and the push notification has an url", () => {
      beforeEach(() => {
        getInfoFromPush.mockReturnValueOnce(getInfoFromPushMock);
        notificationSawHandler({}, "push text", Brand.Betfair, sendEventMock);
      });

      it("should call buildNotificationEvent with the correct params", () => {
        expect(buildNotificationEvent).toHaveBeenCalledWith({
          action: TaggingAction.SAW_MESSAGE,
          destinationUrl: "null",
          elementText: "push text",
          pushMessagePlatform: "test platform",
        });
        expect(buildNotificationEvent).toHaveBeenCalledTimes(1);
      });

      it("should call the sendEvent callback with the correct params", () => {
        expect(sendEventMock).toHaveBeenCalledWith("notification event");
        expect(sendEventMock).toHaveBeenCalledTimes(1);
      });
    });
  });
});
