import {
  createGetNotificationsDeviceSelector,
  createGetSubscribedEventIdsSelector,
  createGetUnsupportedEventIdsSelector,
  createIsEventSubscribedByEventIdSelector,
} from "./notifications-selectors";

const stateMock1 = {
  deviceInfo: { registerOptions: undefined, applicationTypeId: "applicationTypeId", deviceId: "deviceId" },
  subscribedEventIds: [],
  unsupportedEventIds: [],
};
const stateMock2 = { deviceInfo: {}, subscribedEventIds: ["1"], unsupportedEventIds: ["2"] };

describe('"notifications" selectors', () => {
  describe("createGetNotificationsDeviceSelector", () => {
    it("should be a function factory", () => {
      const getNotificationsDeviceSelector = createGetNotificationsDeviceSelector();
      expect(getNotificationsDeviceSelector).toEqual(expect.any(Function));
      expect(getNotificationsDeviceSelector).not.toBe(createGetNotificationsDeviceSelector());
    });

    describe("when state does not change", () => {
      it("should not recompute the selector", () => {
        const getNotificationsDeviceSelector = createGetNotificationsDeviceSelector();
        getNotificationsDeviceSelector(stateMock1);
        getNotificationsDeviceSelector(stateMock1);

        expect(getNotificationsDeviceSelector.recomputations()).toEqual(1);
      });
    });

    describe("when state changes", () => {
      it("should recompute the selector", () => {
        const getNotificationsDeviceSelector = createGetNotificationsDeviceSelector();
        getNotificationsDeviceSelector(stateMock1);
        getNotificationsDeviceSelector(stateMock1);
        getNotificationsDeviceSelector(stateMock2);

        expect(getNotificationsDeviceSelector.recomputations()).toEqual(2);
      });
    });

    it("should return deviceInfo", () => {
      const getNotificationsDeviceSelector = createGetNotificationsDeviceSelector();
      expect(getNotificationsDeviceSelector(stateMock1)).toStrictEqual({
        applicationTypeId: "applicationTypeId",
        deviceId: "deviceId",
        registerOptions: undefined,
      });
    });
  });

  describe("createGetSubscribedEventIdsSelector", () => {
    it("should be a function factory", () => {
      const getSubscribedEventIdsSelector = createGetSubscribedEventIdsSelector();
      expect(getSubscribedEventIdsSelector).toEqual(expect.any(Function));
      expect(getSubscribedEventIdsSelector).not.toBe(createGetSubscribedEventIdsSelector());
    });

    describe("when state does not change", () => {
      it("should not recompute the selector", () => {
        const getSubscribedEventIdsSelector = createGetSubscribedEventIdsSelector();
        getSubscribedEventIdsSelector(stateMock1);
        getSubscribedEventIdsSelector(stateMock1);

        expect(getSubscribedEventIdsSelector.recomputations()).toEqual(1);
      });
    });

    describe("when state changes", () => {
      it("should recompute the selector", () => {
        const getSubscribedEventIdsSelector = createGetSubscribedEventIdsSelector();
        getSubscribedEventIdsSelector(stateMock1);
        getSubscribedEventIdsSelector(stateMock1);
        getSubscribedEventIdsSelector(stateMock2);

        expect(getSubscribedEventIdsSelector.recomputations()).toEqual(2);
      });
    });

    it("should return subscribed event ids", () => {
      const getSubscribedEventIdsSelector = createGetSubscribedEventIdsSelector();
      expect(getSubscribedEventIdsSelector(stateMock2)).toStrictEqual(["1"]);
    });
  });

  describe("createGetUnsupportedEventIdsSelector", () => {
    it("should be a function factory", () => {
      const getUnsupportedEventIdsSelector = createGetUnsupportedEventIdsSelector();
      expect(getUnsupportedEventIdsSelector).toEqual(expect.any(Function));
      expect(getUnsupportedEventIdsSelector).not.toBe(createGetUnsupportedEventIdsSelector());
    });

    describe("when state does not change", () => {
      it("should not recompute the selector", () => {
        const getUnsupportedEventIdsSelector = createGetUnsupportedEventIdsSelector();
        getUnsupportedEventIdsSelector(stateMock1);
        getUnsupportedEventIdsSelector(stateMock1);

        expect(getUnsupportedEventIdsSelector.recomputations()).toEqual(1);
      });
    });

    describe("when state changes", () => {
      it("should recompute the selector", () => {
        const getUnsupportedEventIdsSelector = createGetUnsupportedEventIdsSelector();
        getUnsupportedEventIdsSelector(stateMock1);
        getUnsupportedEventIdsSelector(stateMock1);
        getUnsupportedEventIdsSelector(stateMock2);

        expect(getUnsupportedEventIdsSelector.recomputations()).toEqual(2);
      });
    });

    it("should return subscribed event ids", () => {
      const getUnsupportedEventIdsSelector = createGetUnsupportedEventIdsSelector();
      expect(getUnsupportedEventIdsSelector(stateMock2)).toStrictEqual(["2"]);
    });
  });

  describe("createIsEventSubscribedByEventIdSelector", () => {
    it("should be a function factory", () => {
      const isEventSubscribedByEventIdSelector = createIsEventSubscribedByEventIdSelector();
      expect(isEventSubscribedByEventIdSelector).toEqual(expect.any(Function));
      expect(isEventSubscribedByEventIdSelector).not.toBe(createIsEventSubscribedByEventIdSelector());
    });

    describe("when state does not change", () => {
      it("should not recompute the selector", () => {
        const isEventSubscribedByEventIdSelector = createIsEventSubscribedByEventIdSelector();
        isEventSubscribedByEventIdSelector(stateMock1);
        isEventSubscribedByEventIdSelector(stateMock1);

        expect(isEventSubscribedByEventIdSelector.recomputations()).toEqual(1);
      });
    });

    describe("when state changes", () => {
      it("should recompute the selector", () => {
        const isEventSubscribedByEventIdSelector = createIsEventSubscribedByEventIdSelector();
        isEventSubscribedByEventIdSelector(stateMock1);
        isEventSubscribedByEventIdSelector(stateMock1);
        isEventSubscribedByEventIdSelector(stateMock2);

        expect(isEventSubscribedByEventIdSelector.recomputations()).toEqual(2);
      });
    });

    it("should return true if device is subscribed", () => {
      const isEventSubscribedByEventIdSelector = createIsEventSubscribedByEventIdSelector();
      expect(isEventSubscribedByEventIdSelector(stateMock2, "1")).toStrictEqual(true);
    });

    it("should return false if device is not subscribed", () => {
      const isEventSubscribedByEventIdSelector = createIsEventSubscribedByEventIdSelector();
      expect(isEventSubscribedByEventIdSelector(stateMock2, "2")).toStrictEqual(false);
    });
  });
});
