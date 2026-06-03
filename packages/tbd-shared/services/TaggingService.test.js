import {
  TaggingService,
  cardGroupTaggingService,
  jackpotTaggingService,
  gamesCardGroupTaggingService,
} from "./TaggingService";

describe("TaggingService", () => {
  let taggingService;

  beforeEach(() => {
    taggingService = new TaggingService();
  });

  describe("hasFired", () => {
    it("should return false for events that have not been fired", () => {
      expect(taggingService.hasFired("event-1")).toBe(false);
      expect(taggingService.hasFired("event-2")).toBe(false);
    });

    it("should return true for events that have been marked as fired", () => {
      taggingService.markFired("event-1");

      expect(taggingService.hasFired("event-1")).toBe(true);
      expect(taggingService.hasFired("event-2")).toBe(false);
    });
  });

  describe("markFired", () => {
    it("should mark an event as fired", () => {
      taggingService.markFired("event-1");

      expect(taggingService.hasFired("event-1")).toBe(true);
    });

    it("should handle marking the same event multiple times without error", () => {
      taggingService.markFired("event-1");
      taggingService.markFired("event-1");
      taggingService.markFired("event-1");

      expect(taggingService.hasFired("event-1")).toBe(true);
    });

    it("should track multiple different events independently", () => {
      taggingService.markFired("event-1");
      taggingService.markFired("event-2");
      taggingService.markFired("event-3");

      expect(taggingService.hasFired("event-1")).toBe(true);
      expect(taggingService.hasFired("event-2")).toBe(true);
      expect(taggingService.hasFired("event-3")).toBe(true);
      expect(taggingService.hasFired("event-4")).toBe(false);
    });
  });

  describe("clear", () => {
    it("should clear all fired events", () => {
      taggingService.markFired("event-1");
      taggingService.markFired("event-2");

      expect(taggingService.hasFired("event-1")).toBe(true);
      expect(taggingService.hasFired("event-2")).toBe(true);

      taggingService.clear();

      expect(taggingService.hasFired("event-1")).toBe(false);
      expect(taggingService.hasFired("event-2")).toBe(false);
    });

    it("should allow marking events again after clear", () => {
      taggingService.markFired("event-1");
      taggingService.clear();
      taggingService.markFired("event-1");

      expect(taggingService.hasFired("event-1")).toBe(true);
    });
  });

  describe("singleton instances", () => {
    it("should export cardGroupTaggingService as a TaggingService instance", () => {
      expect(cardGroupTaggingService).toBeInstanceOf(TaggingService);
    });

    it("should export jackpotTaggingService as a TaggingService instance", () => {
      expect(jackpotTaggingService).toBeInstanceOf(TaggingService);
    });

    it("should export gamesCardGroupTaggingService as a TaggingService instance", () => {
      expect(gamesCardGroupTaggingService).toBeInstanceOf(TaggingService);
    });

    it("should have separate instances for each singleton", () => {
      expect(cardGroupTaggingService).not.toBe(jackpotTaggingService);
      expect(cardGroupTaggingService).not.toBe(gamesCardGroupTaggingService);
      expect(jackpotTaggingService).not.toBe(gamesCardGroupTaggingService);
    });
  });
});
