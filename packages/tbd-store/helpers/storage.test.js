import {
  disableExc,
  disableExcOnboarding,
  enableExc,
  enableExcOnboarding,
  getBetslip,
  getSportsbookBettingData,
  getTaggingMetadata,
  loadStorageData,
  removeSportsbookBettingData,
  resetTaggingMetadata,
  updateNotificationsData,
  updateRatingData,
  updateSportsbookBettingData,
  updateTaggingMetadata,
  updateThrottlesData,
  updateObbBettingData,
  removeObbBettingData,
  getObbBettingData,
  updateFavouriteMarketsTooltipClosedCounter,
} from "./storage";

const currentDate = new Date("2020-06-06T16:01:56.244Z");
Date.now = jest.fn(() => new Date(currentDate));

const storageModule = {
  setItem: jest.fn(),
  getItem: jest.fn(),
  multiGet: jest.fn().mockReturnValue({}),
  removeItem: jest.fn(),
};
const notificationsState = { events: ["1"] };
const ratingState = {
  session: {
    numberOfSessions: 0,
    lastSessionDate: "some date",
  },
};

describe("Storage", () => {
  beforeEach(jest.clearAllMocks);

  describe("updateRatingData", () => {
    it("should call StorageModule setItem with correct arguments", () => {
      updateRatingData(storageModule, ratingState);

      expect(storageModule.setItem).toHaveBeenCalledWith("rating", {
        ...ratingState,
        rateMyAppTriggered: false,
      });
      expect(storageModule.setItem).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateNotificationsData", () => {
    it("should call StorageModule setItem with correct arguments", () => {
      updateNotificationsData(storageModule, notificationsState);

      expect(storageModule.setItem).toHaveBeenCalledWith("notifications", { events: ["1"] });
      expect(storageModule.setItem).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateThrottlesData", () => {
    it("should call StorageModule setItem with passed throttle state only", async () => {
      storageModule.getItem.mockImplementationOnce(() => Promise.resolve({}));
      await updateThrottlesData(storageModule, { BOXEVER: { isActive: true, isOverriden: true } });
      expect(storageModule.setItem).toHaveBeenCalledWith("throttles_override", {
        BOXEVER: { isActive: true, isOverriden: true },
      });
      expect(storageModule.setItem).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateSportsbookBettingData", () => {
    it("should call StorageModule setItem with correct arguments", () => {
      updateSportsbookBettingData(storageModule, { some: "state" });

      expect(storageModule.setItem).toHaveBeenCalledWith("sportsbookBettingState", {
        some: "state",
      });
      expect(storageModule.setItem).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateObbBettingData", () => {
    it("should call StorageModule setItem with correct arguments", () => {
      updateObbBettingData(storageModule, { some: "state" });

      expect(storageModule.setItem).toHaveBeenCalledWith("obbBettingState", {
        some: "state",
      });
      expect(storageModule.setItem).toHaveBeenCalledTimes(1);
    });
  });

  describe("getBetslip", () => {
    it("should call StorageModule setItem with correct argument", () => {
      getBetslip(storageModule);

      expect(storageModule.getItem).toHaveBeenCalledWith("betslip");
      expect(storageModule.getItem).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateTaggingMetadata", () => {
    it("should call StorageModule setItem with correct arguments", () => {
      updateTaggingMetadata(storageModule, "taggingMetaMock");

      expect(storageModule.setItem).toHaveBeenCalledWith("taggingMetadata", "taggingMetaMock");
      expect(storageModule.setItem).toHaveBeenCalledTimes(1);
    });
  });

  describe("resetTaggingMetadata", () => {
    it("should call StorageModule setItem with correct arguments", () => {
      resetTaggingMetadata(storageModule);

      expect(storageModule.setItem).toHaveBeenCalledWith("taggingMetadata", {});
      expect(storageModule.setItem).toHaveBeenCalledTimes(1);
    });
  });

  describe("getTaggingMetadata", () => {
    it("should call StorageModule setItem with correct arguments", () => {
      getTaggingMetadata(storageModule);

      expect(storageModule.getItem).toHaveBeenCalledWith("taggingMetadata");
      expect(storageModule.getItem).toHaveBeenCalledTimes(1);
    });
  });

  describe("loadStorageData", () => {
    describe("when loading storage data in native", () => {
      it("should call StorageModule multiGet with correct arguments", async () => {
        const keyNames = ["notifications", "enableExc", "rating", "favouriteMarkets"];

        await loadStorageData(storageModule, true);

        expect(storageModule.multiGet).toHaveBeenCalledWith(keyNames);
        expect(storageModule.multiGet).toHaveBeenCalledTimes(1);
      });

      it("should return correct value", async () => {
        storageModule.multiGet.mockReturnValueOnce({
          notifications: { subscribedEventIds: [] },
          enableExc: true,
          rating: "ratingMock",
          favouriteMarkets: {
            tooltipClosedCounter: 1,
          },
        });

        const result = await loadStorageData(storageModule, true);

        expect(result).toEqual({
          notifications: {
            subscribedEventIds: [],
            unsupportedEventIds: [],
            wasNotificationHowToSubscribeEventsShown: false,
            wasNotificationNativePromptShown: false,
          },
          boot: {
            exchangeEnabled: true,
          },
          rating: "ratingMock",
          favouriteMarkets: {
            tooltipClosedCounter: 1,
          },
        });
      });
    });

    describe("when loading storage data in web", () => {
      it("should call StorageModule multiGet with correct arguments", async () => {
        const keyNames = ["notifications", "enableExc", "rating", "favouriteMarkets"];

        await loadStorageData(storageModule, false);

        expect(storageModule.multiGet).toHaveBeenCalledWith(keyNames);
        expect(storageModule.multiGet).toHaveBeenCalledTimes(1);
      });

      it("should return correct value", async () => {
        storageModule.multiGet.mockReturnValueOnce([]);

        const result = await loadStorageData(storageModule, true);

        expect(result).toEqual({
          notifications: {
            subscribedEventIds: [],
            unsupportedEventIds: [],
            wasNotificationHowToSubscribeEventsShown: false,
            wasNotificationNativePromptShown: false,
          },
          boot: {
            exchangeEnabled: false,
          },
          favouriteMarkets: {
            tooltipClosedCounter: 0,
          },
        });
      });
    });
  });

  describe("removeSportsbookBettingData", () => {
    it("should call StorageModule removeItem with correct arguments", () => {
      removeSportsbookBettingData(storageModule);

      expect(storageModule.removeItem).toHaveBeenCalledWith("sportsbookBettingState");
      expect(storageModule.removeItem).toHaveBeenCalledTimes(1);
    });
  });

  describe("removeObbBettingData", () => {
    it("should call StorageModule removeItem with correct arguments", () => {
      removeObbBettingData(storageModule);

      expect(storageModule.removeItem).toHaveBeenCalledWith("obbBettingState");
      expect(storageModule.removeItem).toHaveBeenCalledTimes(1);
    });
  });

  describe("getSportsbookBettingData", () => {
    it("should call StorageModule getItem with correct arguments", () => {
      storageModule.getItem.mockReturnValue({ key: "test" });
      getSportsbookBettingData(storageModule);

      expect(storageModule.getItem).toHaveBeenCalledWith("sportsbookBettingState");
      expect(storageModule.getItem).toHaveBeenCalledTimes(1);
    });

    it("should return correct value", async () => {
      storageModule.getItem.mockReturnValue({ key: "test" });
      const result = getSportsbookBettingData(storageModule);

      expect(await result).toEqual({ key: "test" });
    });
  });

  describe("getObbBettingData", () => {
    it("should call StorageModule getItem with correct arguments", () => {
      storageModule.getItem.mockReturnValue({ key: "test" });
      getObbBettingData(storageModule);

      expect(storageModule.getItem).toHaveBeenCalledWith("obbBettingState");
      expect(storageModule.getItem).toHaveBeenCalledTimes(1);
    });

    it("should return correct value", async () => {
      storageModule.getItem.mockReturnValue({ key: "test" });
      const result = getSportsbookBettingData(storageModule);

      expect(await result).toEqual({ key: "test" });
    });
  });

  describe("enableExc", () => {
    it("should call StorageModule setItem with correct arguments", () => {
      enableExc(storageModule);

      expect(storageModule.setItem).toHaveBeenCalledWith("enableExc", true);
      expect(storageModule.setItem).toHaveBeenCalledTimes(1);
    });
  });

  describe("disableExc", () => {
    it("should call StorageModule setItem with correct arguments", () => {
      disableExc(storageModule);

      expect(storageModule.setItem).toHaveBeenCalledWith("enableExc", false);
      expect(storageModule.setItem).toHaveBeenCalledTimes(1);
    });
  });

  describe("updateFavouriteMarketsTooltipClosedCounter", () => {
    describe("when there's no stored value", () => {
      it("should call StorageModule setItem with correct arguments", async () => {
        storageModule.getItem.mockResolvedValueOnce(undefined);
        await updateFavouriteMarketsTooltipClosedCounter(storageModule);

        expect(storageModule.setItem).toHaveBeenCalledWith("favouriteMarkets", {
          tooltipClosedCounter: 1,
        });
      });
    });

    describe("when there's a stored value", () => {
      it("should call StorageModule setItem with correct arguments", async () => {
        storageModule.getItem.mockResolvedValueOnce({ tooltipClosedCounter: 1 });
        await updateFavouriteMarketsTooltipClosedCounter(storageModule);

        expect(storageModule.setItem).toHaveBeenCalledWith("favouriteMarkets", {
          tooltipClosedCounter: 2,
        });
      });
    });
  });
});
