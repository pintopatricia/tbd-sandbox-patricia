import { isPlayerView, isPlayerViewItemPartial } from "./PlayerView.utils";

describe("PlayerView.utils", () => {
  beforeEach(jest.clearAllMocks);

  describe("isPlayerView", () => {
    it("should return true for a valid PlayerView object", () => {
      const mockPlayerView = {
        __typename: "PlayerView",
        urn: "ppb:tbd:view:player:1|2",
        url: "https://example.com/player/1",
        items: {
          edges: [
            { node: { __typename: "PlayerMarketsCardGroup", urn: "ppb:tbd:cardgroup:playermarkets:1|2" } },
            { node: { __typename: "RegulatoryCard", urn: "ppb:tbd:card:regulatory:footer" } },
          ],
          pageInfo: null,
        },
        context: {
          __typename: "FootballPlayerFixtureContext",
          fixture: { urn: "ppb:tbd:fixture:123" },
          player: { id: "player-1" },
        },
      };

      expect(isPlayerView(mockPlayerView)).toBe(true);
    });

    it("should return false for an invalid PlayerView object", () => {
      const mockInvalidObject = {
        __typename: "SomeOtherType",
        urn: "ppb:tbd:view:player:1|2",
      };

      expect(isPlayerView(mockInvalidObject)).toBe(false);
    });

    it("should return false when context is missing or invalid", () => {
      const missingContext = {
        __typename: "PlayerView",
        urn: "ppb:tbd:view:player:1|2",
        url: "https://example.com/player/1",
        items: { edges: [], pageInfo: null },
      };

      const wrongContextTypename = {
        __typename: "PlayerView",
        urn: "ppb:tbd:view:player:1|2",
        url: "https://example.com/player/1",
        items: { edges: [], pageInfo: null },
        context: { __typename: "OtherContext", fixture: { urn: "ppb:tbd:fixture:123" } },
      };

      const missingFixtureUrn = {
        __typename: "PlayerView",
        urn: "ppb:tbd:view:player:1|2",
        url: "https://example.com/player/1",
        items: { edges: [], pageInfo: null },
        context: { __typename: "FootballPlayerFixtureContext", fixture: {} },
      };

      expect(isPlayerView(missingContext)).toBe(false);
      expect(isPlayerView(wrongContextTypename)).toBe(false);
      expect(isPlayerView(missingFixtureUrn)).toBe(false);
    });

    it("should return false when player is missing or null", () => {
      const playerNull = {
        __typename: "PlayerView",
        urn: "ppb:tbd:view:player:1|2",
        url: "https://example.com/player/1",
        items: { edges: [], pageInfo: null },
        context: { __typename: "FootballPlayerFixtureContext", fixture: { urn: "ppb:tbd:fixture:123" }, player: null },
      };

      const playerMissing = {
        __typename: "PlayerView",
        urn: "ppb:tbd:view:player:1|2",
        url: "https://example.com/player/1",
        items: { edges: [], pageInfo: null },
        context: { __typename: "FootballPlayerFixtureContext", fixture: { urn: "ppb:tbd:fixture:123" } },
      };

      expect(isPlayerView(playerNull)).toBe(false);
      expect(isPlayerView(playerMissing)).toBe(false);
    });

    it("should return false for a non-object value", () => {
      expect(isPlayerView(null)).toBe(false);
      expect(isPlayerView(42)).toBe(false);
      expect(isPlayerView("not an object")).toBe(false);
    });

    it("should return false when items is missing or malformed", () => {
      const missingItems = {
        __typename: "PlayerView",
        urn: "ppb:tbd:view:player:1|2",
        url: "https://example.com/player/1",
        context: { __typename: "FootballPlayerFixtureContext", fixture: { urn: "ppb:tbd:fixture:123" } },
      };

      const malformedItems = {
        __typename: "PlayerView",
        urn: "ppb:tbd:view:player:1|2",
        url: "https://example.com/player/1",
        items: { edges: "not-an-array" },
        context: { __typename: "FootballPlayerFixtureContext", fixture: { urn: "ppb:tbd:fixture:123" } },
      };

      expect(isPlayerView(missingItems)).toBe(false);
      expect(isPlayerView(malformedItems)).toBe(false);
    });
  });

  describe("isPlayerViewItemPartial", () => {
    it("should return true for a partial with __typename 'PlayerMarketsCardGroup'", () => {
      const mockItem = {
        __typename: "PlayerMarketsCardGroup",
        urn: "ppb:tbd:cardgroup:playermarkets:1|2",
      };

      expect(isPlayerViewItemPartial(mockItem)).toBe(true);
    });

    it("should return true for a partial with __typename 'FootballPlayerCompetitionStatsCard'", () => {
      const mockItem = {
        __typename: "FootballPlayerCompetitionStatsCard",
        urn: "ppb:tbd:card:footballplayercompetitionstats:1|2",
      };

      expect(isPlayerViewItemPartial(mockItem)).toBe(true);
    });

    it("should return true for a partial with __typename 'RegulatoryCard'", () => {
      const mockItem = {
        __typename: "RegulatoryCard",
        urn: "ppb:tbd:card:regulatory:footer",
      };

      expect(isPlayerViewItemPartial(mockItem)).toBe(true);
    });

    it("should return false for a partial with a different __typename", () => {
      const mockItem = {
        __typename: "DifferentType",
        urn: "ppb:tbd:view:player:1|2",
      };

      expect(isPlayerViewItemPartial(mockItem)).toBe(false);
    });
  });
});
