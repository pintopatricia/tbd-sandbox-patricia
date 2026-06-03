import analytics from "@react-native-firebase/analytics";

import { sendEvent, META_DATA_EVENT_KEY } from "./tagging-collector.native";

const mockedLogEvent = jest.fn();
const mockedSetDefaultEventParameters = jest.fn();
const mockedSetUserProperties = jest.fn();
const mockedSetUserId = jest.fn();

jest.mock("@react-native-firebase/analytics", () => () => ({
  logEvent: mockedLogEvent,
  setDefaultEventParameters: mockedSetDefaultEventParameters,
  setUserProperties: mockedSetUserProperties,
  setUserId: mockedSetUserId,
}));

const metaDataEvent = {
  event: META_DATA_EVENT_KEY,
  account_id: "account_id",
  user_id: "user_id",
  brand: "BF",
  country: "country",
  currency: "EUR",
};
const taggingEvent = {
  action: "cancelled",
  element_text: "text",
  event: "interface",
  module: "search",
};
const taggingEvent2 = {
  action: "clicked",
  element_text: "text",
  event: "interface",
  module: "search",
};

describe("TaggingCollector", () => {
  beforeEach(jest.clearAllMocks);

  describe("when event is metaData", () => {
    it("should set default lowercase event parameters in firebase analytics module (w/o user and acc ids)", () => {
      sendEvent(metaDataEvent);

      expect(mockedSetDefaultEventParameters).toHaveBeenCalledWith({
        ...metaDataEvent,
        brand: "bf",
        currency: "eur",
        account_id: undefined,
        user_id: undefined,
      });
    });

    it("should set account_id as a user property in firebase analytics module", () => {
      sendEvent(metaDataEvent);

      expect(mockedSetUserProperties).toHaveBeenCalledWith({
        account_id: "account_id",
      });
    });

    it("should set user_id as a user property in firebase analytics module", () => {
      sendEvent(metaDataEvent);

      expect(mockedSetUserId).toHaveBeenCalledWith("user_id");
    });

    it("should not call analytics logEvent", () => {
      sendEvent(metaDataEvent);

      expect(analytics().logEvent).not.toHaveBeenCalled();
    });
  });

  describe("when event is a tagging event", () => {
    it("should not call analytics setDefaultEventParameters", () => {
      sendEvent(taggingEvent);

      expect(mockedSetDefaultEventParameters).not.toHaveBeenCalled();
    });

    it("should call analytics logEvent with the correct params", () => {
      sendEvent(taggingEvent);

      expect(analytics().logEvent).toHaveBeenCalledWith("interface", taggingEvent);
      expect(analytics().logEvent).toHaveBeenCalledTimes(1);
    });
  });

  describe("when there are 3 events and one of them is undefined", () => {
    it("should call analytics logEvent twice with the correct params", () => {
      sendEvent([taggingEvent, taggingEvent2, undefined]);

      expect(analytics().logEvent).toHaveBeenCalledWith("interface", taggingEvent);
      expect(analytics().logEvent).toHaveBeenCalledWith("interface", taggingEvent2);
      expect(analytics().logEvent).toHaveBeenCalledTimes(2);
    });
  });
});
