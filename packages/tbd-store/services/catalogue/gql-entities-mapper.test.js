import { CardIconTypes } from "../../state/constants";
import {
  getCardIcon,
  transformGQLGameImageToGameImage,
  transformGQLMarketGraphsToMarketGraphsCard,
  transformGQLSeoMetadataToSeoMetadata,
} from "./gql-entities-mapper";

jest.mock("./normalizer/cards/segmented-card-group/segmented-card-group-normalizer", () =>
  jest.fn(() => ({ data: "data" })),
);

jest.mock("./normalizer/cards/view-zone/view-zone-normalizer", () => jest.fn(() => ({ data: "data" })));

describe("transformGQLMarketGraphsToMarketGraphsCard", () => {
  it("should return the mapped market graphs card", () => {
    const gqlMarketGraphsCard = {
      __typename: "MarketGraphsCard",
      urn: "MarketGraphsCard:1",
      market: { urn: "ppb:tbd:market:1" },
      runner: {
        runnerURN: "ppb:tbd:runner:1",
        liveData: { urn: "ppb:tbd:liveRunner:1" },
        graphParams: "?marketId=123456&selectionId=98776554",
      },
    };
    expect(transformGQLMarketGraphsToMarketGraphsCard(gqlMarketGraphsCard)).toStrictEqual({
      market: "ppb:tbd:market:1",
      runner: "ppb:tbd:runner:1",
      urn: "MarketGraphsCard:1",
      typename: "MarketGraphsCard",
      graphParams: "?marketId=123456&selectionId=98776554",
    });
  });
});

describe("getCardIcon", () => {
  it("should return correct card icon", () => {
    const resultBingo = getCardIcon("Bingo");
    expect(resultBingo).toEqual(CardIconTypes.Bingo);

    const resultBlackjack = getCardIcon("Blackjack");
    expect(resultBlackjack).toEqual(CardIconTypes.Blackjack);

    const resultCardTable = getCardIcon("CardTable");
    expect(resultCardTable).toEqual(CardIconTypes.CardTable);

    const resultCasino = getCardIcon("Casino");
    expect(resultCasino).toEqual(CardIconTypes.Casino);

    const resultExclusive = getCardIcon("Exclusive");
    expect(resultExclusive).toEqual(CardIconTypes.Exclusive);

    const resultGames = getCardIcon("Games");
    expect(resultGames).toEqual(CardIconTypes.Games);

    const resultCrashGames = getCardIcon("Crashgames");
    expect(resultCrashGames).toEqual(CardIconTypes.CrashGames);

    const resultFavourites = getCardIcon("Favourites");
    expect(resultFavourites).toEqual(CardIconTypes.Favourites);

    const resultInstantWins = getCardIcon("InstantWins");
    expect(resultInstantWins).toEqual(CardIconTypes.InstantWins);

    const resultJackpots = getCardIcon("Jackpots");
    expect(resultJackpots).toEqual(CardIconTypes.Jackpots);

    const resultLive = getCardIcon("Live");
    expect(resultLive).toEqual(CardIconTypes.Live);

    const resultNew = getCardIcon("New");
    expect(resultNew).toEqual(CardIconTypes.New);

    const resultRoulette = getCardIcon("Roulette");
    expect(resultRoulette).toEqual(CardIconTypes.Roulette);

    const resultSlots = getCardIcon("Slots");
    expect(resultSlots).toEqual(CardIconTypes.Slots);

    const resultTableGames = getCardIcon("TableGames");
    expect(resultTableGames).toEqual(CardIconTypes.TableGames);

    const resultTournaments = getCardIcon("Tournaments");
    expect(resultTournaments).toEqual(CardIconTypes.Tournaments);
  });
});

describe("transformGQLGameImageToGameImage function", () => {
  describe("When we have all images", () => {
    it("should return all images", () => {
      const gameImage = {
        small: {
          url: "small",
          alt: "small",
          dimensions: {
            width: 225,
            height: 225,
          },
        },
        medium: {
          url: "medium",
          alt: "medium",
          dimensions: {
            width: 450,
            height: 450,
          },
        },
      };
      const image = transformGQLGameImageToGameImage(gameImage);
      expect(image).toStrictEqual({
        small: {
          url: "small",
          alt: "small",
          dimensions: {
            width: 225,
            height: 225,
          },
        },
        medium: {
          url: "medium",
          alt: "medium",
          dimensions: {
            width: 450,
            height: 450,
          },
        },
      });
    });
  });
  describe("When we don't a have a medium image", () => {
    it("should return the small image", () => {
      const gameImage = {
        small: {
          url: "small",
          alt: "small",
          dimensions: {
            width: 225,
            height: 225,
          },
        },
      };
      const image = transformGQLGameImageToGameImage(gameImage);
      expect(image).toStrictEqual({
        medium: undefined,
        small: {
          url: "small",
          alt: "small",
          dimensions: {
            width: 225,
            height: 225,
          },
        },
      });
    });
  });
  describe("When we don't have a small image", () => {
    it("should return the medium image", () => {
      const gameImage = {
        medium: {
          url: "medium",
          alt: "medium",
          dimensions: {
            width: 450,
            height: 450,
          },
        },
      };
      const image = transformGQLGameImageToGameImage(gameImage);
      expect(image).toStrictEqual({
        small: undefined,
        medium: {
          url: "medium",
          alt: "medium",
          dimensions: {
            width: 450,
            height: 450,
          },
        },
      });
    });
  });
  describe("When we don't have an image", () => {
    it("should return undefined", () => {
      const gameImage = null;
      const image = transformGQLGameImageToGameImage(gameImage);
      expect(image).toStrictEqual(undefined);
    });
  });
});

describe("transformGQLSeoMetadataToSeoMetadata", () => {
  it("should return SeoMetaData when both metaTitle and metaDescription are defined", () => {
    const gqlSeoMetaData = {
      metaTitle: "Test Title",
      metaDescription: "Test Description",
    };

    const result = transformGQLSeoMetadataToSeoMetadata(gqlSeoMetaData);
    expect(result).toEqual({
      metaTitle: "Test Title",
      metaDescription: "Test Description",
    });
  });

  it("should return SeoMetaData with empty metaTitle when metaTitle is undefined", () => {
    const gqlSeoMetaData = {
      metaTitle: undefined,
      metaDescription: "Test Description",
    };

    const result = transformGQLSeoMetadataToSeoMetadata(gqlSeoMetaData);
    expect(result).toEqual({
      metaTitle: "",
      metaDescription: "Test Description",
    });
  });

  it("should return SeoMetaData with empty metaDescription when metaDescription is undefined", () => {
    const gqlSeoMetaData = {
      metaTitle: "Test Title",
      metaDescription: undefined,
    };

    const result = transformGQLSeoMetadataToSeoMetadata(gqlSeoMetaData);
    expect(result).toEqual({
      metaTitle: "Test Title",
      metaDescription: "",
    });
  });

  it("should return undefined when both metaTitle and metaDescription are undefined", () => {
    const gqlSeoMetaData = {
      metaTitle: undefined,
      metaDescription: undefined,
    };

    const result = transformGQLSeoMetadataToSeoMetadata(gqlSeoMetaData);
    expect(result).toBeUndefined();
  });
});
