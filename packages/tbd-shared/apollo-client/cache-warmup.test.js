import { apolloCacheWarmUp } from "./cache-warmup";
import { getApolloClient } from "./client";

jest.mock("./client", () => ({
  getApolloClient: jest.fn(),
}));

jest.mock("./AppContextDetails.graphql", () => ({
  AppContextDetailsQuery: "AppContextDetailsQuery",
}));

const PopularSelectionsCardQueryMock = "PopularSelectionsCardQuery";
const PopularSelectionsCardEnrichedPartialFragmentMock = "PopularSelectionsCardEnrichedPartialFragment";
const PopularSelectionsCardDisplayModeFragmentMock = "PopularSelectionsCardDisplayModeFragment";

jest.mock("@ppb/tbd-components-sports-betting/components/PopularSelections/model/PopularSelections.graphql", () => ({
  PopularSelectionsCardQuery: PopularSelectionsCardQueryMock,
  PopularSelectionsCardEnrichedPartialFragment: PopularSelectionsCardEnrichedPartialFragmentMock,
}));

jest.mock(
  "@ppb/tbd-components-sports-betting/components/PopularSelectionsCard/model/PopularSelectionsCard.graphql",
  () => ({
    PopularSelectionsCardDisplayModeFragment: PopularSelectionsCardDisplayModeFragmentMock,
  }),
);

describe("cache-warmup", () => {
  let mockWriteQuery;
  let mockWriteFragment;
  let mockIdentify;

  beforeEach(() => {
    jest.clearAllMocks();
    mockWriteQuery = jest.fn();
    mockWriteFragment = jest.fn();
    mockIdentify = jest.fn((obj) => `${obj.__typename}:${obj.urn}`);
    getApolloClient.mockReturnValue({
      readQuery: jest.fn(),
      writeQuery: mockWriteQuery,
      writeFragment: mockWriteFragment,
      cache: { identify: mockIdentify },
    });
  });

  describe("loadCatalogue - PopularSelectionsCard", () => {
    it("should writeQuery for PopularSelectionsCard with popularSelectionsCardItems", async () => {
      const popularSelectionsCard = {
        __typename: "PopularSelectionsCard",
        urn: "urn:popular:1",
        title: "Popular Selections",
        popularSelectionsCardItems: [
          { runner: { urn: "runner:1" }, market: { urn: "market:1", name: "Match Odds" }, stats: { betCount: 100 } },
        ],
      };

      await apolloCacheWarmUp.loadCatalogue({
        PopularSelectionsCard: [popularSelectionsCard],
      });

      await new Promise(process.nextTick);

      expect(mockWriteQuery).toHaveBeenCalledWith({
        query: PopularSelectionsCardQueryMock,
        variables: { urn: "urn:popular:1" },
        data: {
          Cards: [popularSelectionsCard],
        },
      });
    });

    it("should writeQuery when displayMode is available alongside popularSelectionsCardItems", async () => {
      const popularSelectionsCard = {
        __typename: "PopularSelectionsCard",
        urn: "urn:popular:1",
        title: "Popular Selections",
        displayMode: "SWIPE",
        popularSelectionsCardItems: [
          { runner: { urn: "runner:1" }, market: { urn: "market:1", name: "Match Odds" }, stats: { betCount: 100 } },
        ],
      };

      await apolloCacheWarmUp.loadCatalogue({
        PopularSelectionsCard: [popularSelectionsCard],
      });

      await new Promise(process.nextTick);

      expect(mockWriteQuery).toHaveBeenCalledWith({
        query: PopularSelectionsCardQueryMock,
        variables: { urn: "urn:popular:1" },
        data: {
          Cards: [popularSelectionsCard],
        },
      });
    });

    it("should writeFragment for PopularSelectionsCard without popularSelectionsCardItems", async () => {
      const popularSelectionsCard = {
        __typename: "PopularSelectionsCard",
        urn: "urn:popular:2",
        title: "Popular Selections",
        isExpandedByDefault: false,
      };

      await apolloCacheWarmUp.loadCatalogue({
        PopularSelectionsCard: [popularSelectionsCard],
      });

      await new Promise(process.nextTick);

      expect(mockIdentify).toHaveBeenCalledWith({
        __typename: "PopularSelectionsCard",
        urn: "urn:popular:2",
      });

      expect(mockWriteFragment).toHaveBeenCalledWith({
        id: "PopularSelectionsCard:urn:popular:2",
        fragment: PopularSelectionsCardEnrichedPartialFragmentMock,
        fragmentName: "PopularSelectionsCardEnrichedPartial",
        data: popularSelectionsCard,
      });

      expect(mockWriteQuery).not.toHaveBeenCalled();
    });

    it("should not call writeQuery or writeFragment when PopularSelectionsCard is empty", async () => {
      await apolloCacheWarmUp.loadCatalogue({
        PopularSelectionsCard: [],
      });

      await new Promise(process.nextTick);

      expect(mockWriteQuery).not.toHaveBeenCalled();
      expect(mockWriteFragment).not.toHaveBeenCalled();
    });

    it("should not call writeQuery or writeFragment when PopularSelectionsCard is undefined", async () => {
      await apolloCacheWarmUp.loadCatalogue({});

      await new Promise(process.nextTick);

      expect(mockWriteQuery).not.toHaveBeenCalled();
      expect(mockWriteFragment).not.toHaveBeenCalled();
    });
  });
});
