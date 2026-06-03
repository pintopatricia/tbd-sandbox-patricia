/* eslint-disable no-underscore-dangle */

import {
  FeedData,
  GameBaseImage,
  GameDescription,
  GameImage,
  RichText,
  RichTextSpan,
  RichTextStyle,
  RouletteNumber,
  SeoMetaData,
} from "../../state/entities";
import { MarketGraphsCard } from "../../state/layout/cards/Card.types";
import {
  GameDescription as GQLGameDescription,
  GameFeedData as GQLGameFeedData,
  GameImage as GQLImage,
  GameImages as GQLImages,
  MarketGraphsCardFragment,
  RichText as GQLRichText,
  RichTextSpan as GQLRichTextSpan,
  SeoMetaData as GQLSeoMetaData,
} from "../../clients/catalogue/catalogue-response-types";
import { CardIconTypes, RouletteNumberColor } from "../../state/constants";

type Maybe<T> = T | null | undefined;

export function getCardIcon(icon: string | undefined): CardIconTypes | undefined {
  switch (icon) {
    case "Bingo":
      return CardIconTypes.Bingo;
    case "Blackjack":
      return CardIconTypes.Blackjack;
    case "CardTable":
      return CardIconTypes.CardTable;
    case "Casino":
      return CardIconTypes.Casino;
    case "Crashgames":
      return CardIconTypes.CrashGames;
    case "Exclusive":
      return CardIconTypes.Exclusive;
    case "Games":
      return CardIconTypes.Games;
    case "InstantWins":
      return CardIconTypes.InstantWins;
    case "Jackpots":
      return CardIconTypes.Jackpots;
    case "Live":
      return CardIconTypes.Live;
    case "New":
      return CardIconTypes.New;
    case "Promotions":
      return CardIconTypes.Promotions;
    case "Roulette":
      return CardIconTypes.Roulette;
    case "Slots":
      return CardIconTypes.Slots;
    case "Slingo":
      return CardIconTypes.Slingo;
    case "TableGames":
      return CardIconTypes.TableGames;
    case "Tournaments":
      return CardIconTypes.Tournaments;
    case "Favourites":
      return CardIconTypes.Favourites;
    default:
      return undefined;
  }
}

/**
 * Transforms a gql game base image to a store game base image
 */
export function transformGQLGameBaseImageToGameBaseImage(gameImage: GQLImage): GameBaseImage {
  return {
    alt: gameImage.alt ? gameImage.alt : undefined,
    url: gameImage.url,
    dimensions: {
      width: gameImage.dimensions.width,
      height: gameImage.dimensions.height,
    },
  };
}

/**
 * Transforms a gql game image to a store game image
 */
export function transformGQLGameImageToGameImage(images: Maybe<GQLImages>): GameImage | undefined {
  if (!images) {
    return undefined;
  }

  return {
    small: images.small ? transformGQLGameBaseImageToGameBaseImage(images.small) : undefined,
    medium: images.medium ? transformGQLGameBaseImageToGameBaseImage(images.medium) : undefined,
  };
}

export function transformGQLGameFeedDataToGameFeedData(gameFeedData: Maybe<GQLGameFeedData>): FeedData | undefined {
  if (!gameFeedData) {
    return undefined;
  }

  const filteredLastNumbers = gameFeedData?.lastNumbers?.reduce((acc: RouletteNumber[], lastNumber) => {
    acc.push({
      number: lastNumber.number,
      color: RouletteNumberColor[lastNumber.color as keyof typeof RouletteNumberColor],
    });
    return acc;
  }, []);

  return {
    jackpot: gameFeedData?.jackpot ?? undefined,
    availableSeats: gameFeedData?.availableSeats ?? undefined,
    lastNumbers: filteredLastNumbers ?? undefined,
    tableNames: gameFeedData?.tableNames ?? undefined,
  };
}

const VALID_RICH_TEXT_STYLES: RichTextStyle[] = ["span", "p", "strong", "hyperlink", "em"];

function isRichTextStyle(style: string): style is RichTextStyle {
  return VALID_RICH_TEXT_STYLES.includes(style as RichTextStyle);
}

function transformGQLRichTextSpanToRichTextSpan(richTextSpans: GQLRichTextSpan[]): RichTextSpan[] {
  return richTextSpans.map((entry: GQLRichTextSpan) => ({
    start: entry.start,
    end: entry.end,
    style: isRichTextStyle(entry.style) ? entry.style : "span",
    url: entry.url ? entry.url : undefined,
  }));
}

export function transformGQLRichTextToRichText(richTexts: GQLRichText[]): RichText[] {
  return richTexts.map((entry: GQLRichText) => ({
    type: entry.type,
    text: entry.text,
    spans: entry.spans ? transformGQLRichTextSpanToRichTextSpan(entry.spans) : undefined,
  }));
}

export function transformGQLGameDescriptionToGameDescription(
  description: Maybe<GQLGameDescription>,
): GameDescription | undefined {
  if (!description?.content?.length) {
    return undefined;
  }

  return {
    content: transformGQLRichTextToRichText(description.content),
    headline: description.headline ?? undefined,
  };
}

export function transformGQLSeoMetadataToSeoMetadata(metaData: Maybe<GQLSeoMetaData>): SeoMetaData | undefined {
  if (!metaData?.metaTitle && !metaData?.metaDescription) {
    return undefined;
  }

  return {
    metaTitle: metaData?.metaTitle ?? "",
    metaDescription: metaData?.metaDescription ?? "",
  };
}

/**
 * Maps a graphql marketgraphcard to a store marketgraphcard
 */
export function transformGQLMarketGraphsToMarketGraphsCard({
  urn,
  market,
  runner,
  __typename,
}: MarketGraphsCardFragment): MarketGraphsCard {
  return {
    urn,
    typename: __typename,
    market: market.urn,
    runner: runner.runnerURN,
    graphParams: runner.graphParams,
  };
}
