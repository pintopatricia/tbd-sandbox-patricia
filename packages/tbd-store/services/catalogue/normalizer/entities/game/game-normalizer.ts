import { Game } from "../../../../../state";
import {
  GameFragment,
  GameDescription as GQLGameDescription,
} from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";
import {
  transformGQLGameImageToGameImage,
  transformGQLGameFeedDataToGameFeedData,
  transformGQLGameDescriptionToGameDescription,
  transformGQLSeoMetadataToSeoMetadata,
  transformGQLGameBaseImageToGameBaseImage,
} from "../../../gql-entities-mapper";
import { JackpotLogo, Label } from "../../../../../state";

type Maybe<T> = T | null | undefined;

const normalizeGameFragmentIntoGame = (game: GameFragment): TransformedFragment<Game> => {
  const {
    __typename,
    urn,
    name,
    label,
    launchId,
    backgroundColor,
    customBackgroundColor,
    copyrightText,
    rgsCodeMobile,
    description,
    metaData,
    gameType,
    gameVolatility,
    gameTheme,
    jackpotType,
    gameStudio,
    minStake,
    maxStake,
    gameMechanics,
    gameHelp,
    feedData,
    flattened,
    jackpotLogo,
    viewLink,
    mainProduct,
    provider,
    customLogo,
    rtp,
    decoration,
    hasDemo,
    screenshots,
    uid,
  } = game;

  const computedBackgroundColor =
    customBackgroundColor || (backgroundColor && backgroundColor.split(" - ")[0]) || undefined;

  return {
    data: {
      typename: __typename,
      urn,
      viewLink,
      name,
      launchId,
      uid,
      rgsCodeMobile,
      label: label ? Label[label] : undefined,
      provider: {
        name: provider.name,
        uid: provider.uid,
      },
      customLogo:
        customLogo && customLogo.image
          ? {
              name: customLogo?.name || undefined,
              image: customLogo.image,
            }
          : undefined,
      mainProduct,
      flattened: transformGQLGameImageToGameImage(flattened),
      jackpotLogo: jackpotLogo ? JackpotLogo[jackpotLogo] : undefined,
      feedData: transformGQLGameFeedDataToGameFeedData(feedData),
      copyrightText: copyrightText || undefined,
      backgroundColor: computedBackgroundColor,
      description: transformGQLGameDescriptionToGameDescription(description as Maybe<GQLGameDescription>),
      seoMetaData: transformGQLSeoMetadataToSeoMetadata(metaData),
      gameType: gameType ?? undefined,
      gameVolatility: gameVolatility ?? undefined,
      gameTheme: gameTheme ?? undefined,
      jackpotType: jackpotType ?? undefined,
      gameStudio: gameStudio ?? undefined,
      minStake: minStake ?? undefined,
      maxStake: maxStake ?? undefined,
      gameMechanics: gameMechanics?.filter((m): m is string => m !== null) ?? undefined,
      gameHelp: gameHelp ?? undefined,
      rtp: rtp ?? undefined,
      decoration: decoration ?? undefined,
      hasDemo: hasDemo ?? undefined,
      screenshots: (screenshots || []).map((screenshot) => {
        if (!screenshot) {
          return null;
        }
        return transformGQLGameBaseImageToGameBaseImage(screenshot);
      }),
    },
  };
};

export default normalizeGameFragmentIntoGame;
