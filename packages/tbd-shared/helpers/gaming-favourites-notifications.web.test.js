import {
  incrementFavouritesNotification,
  decrementFavouritesNotification,
  getFavouritesNotificationCount,
  clearFavouritesNotifications,
} from "./gaming-favourites-notifications.web";

// Mock i18next
jest.mock("i18next", () => ({
  language: "en",
}));

const STORAGE_KEY = "favouritesNotifications_en";

describe("gaming-favourites-notifications", () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  const getStoredData = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : { unseenCount: 0, addedGameIds: [] };
  };

  describe("incrementFavouritesNotification", () => {
    it("should increment count when adding a new game", () => {
      incrementFavouritesNotification("game1");

      const stored = getStoredData();
      expect(stored.unseenCount).toBe(1);
      expect(stored.addedGameIds).toContain("game1");
    });

    it("should increment count for multiple different games", () => {
      incrementFavouritesNotification("game1");
      incrementFavouritesNotification("game2");
      incrementFavouritesNotification("game3");

      const stored = getStoredData();
      expect(stored.unseenCount).toBe(3);
      expect(stored.addedGameIds).toEqual(["game1", "game2", "game3"]);
    });

    it("should not increment count if game is already in the list", () => {
      incrementFavouritesNotification("game1");
      incrementFavouritesNotification("game1");

      const stored = getStoredData();
      expect(stored.unseenCount).toBe(1);
      expect(stored.addedGameIds).toEqual(["game1"]);
    });
  });

  describe("decrementFavouritesNotification", () => {
    it("should decrement count when removing a game that was added", () => {
      incrementFavouritesNotification("game1");
      incrementFavouritesNotification("game2");
      decrementFavouritesNotification("game1");

      const stored = getStoredData();
      expect(stored.unseenCount).toBe(1);
      expect(stored.addedGameIds).toEqual(["game2"]);
    });

    it("should not decrement below zero", () => {
      decrementFavouritesNotification("game1");

      const stored = getStoredData();
      expect(stored.unseenCount).toBe(0);
      expect(stored.addedGameIds).toEqual([]);
    });

    it("should not change count if game was not in the list", () => {
      incrementFavouritesNotification("game1");
      decrementFavouritesNotification("game2");

      const stored = getStoredData();
      expect(stored.unseenCount).toBe(1);
      expect(stored.addedGameIds).toEqual(["game1"]);
    });
  });

  describe("getFavouritesNotificationCount", () => {
    it("should return 0 when no notifications exist", () => {
      expect(getFavouritesNotificationCount()).toBe(0);
    });

    it("should return correct count after increments", () => {
      incrementFavouritesNotification("game1");
      incrementFavouritesNotification("game2");

      expect(getFavouritesNotificationCount()).toBe(2);
    });

    it("should return correct count after increments and decrements", () => {
      incrementFavouritesNotification("game1");
      incrementFavouritesNotification("game2");
      decrementFavouritesNotification("game1");

      expect(getFavouritesNotificationCount()).toBe(1);
    });
  });

  describe("clearFavouritesNotifications", () => {
    it("should reset count and clear all game ids", () => {
      incrementFavouritesNotification("game1");
      incrementFavouritesNotification("game2");
      incrementFavouritesNotification("game3");

      clearFavouritesNotifications();

      const stored = getStoredData();
      expect(stored.unseenCount).toBe(0);
      expect(stored.addedGameIds).toEqual([]);
    });

    it("should work even when storage is empty", () => {
      clearFavouritesNotifications();

      const stored = getStoredData();
      expect(stored.unseenCount).toBe(0);
      expect(stored.addedGameIds).toEqual([]);
    });
  });

  describe("integration scenarios", () => {
    it("should handle add, remove, add same game correctly", () => {
      incrementFavouritesNotification("game1");
      decrementFavouritesNotification("game1");
      incrementFavouritesNotification("game1");

      expect(getFavouritesNotificationCount()).toBe(1);
      const stored = getStoredData();
      expect(stored.addedGameIds).toEqual(["game1"]);
    });

    it("should handle clear and then add new games", () => {
      incrementFavouritesNotification("game1");
      incrementFavouritesNotification("game2");
      clearFavouritesNotifications();
      incrementFavouritesNotification("game3");

      expect(getFavouritesNotificationCount()).toBe(1);
      const stored = getStoredData();
      expect(stored.addedGameIds).toEqual(["game3"]);
    });
  });
});
