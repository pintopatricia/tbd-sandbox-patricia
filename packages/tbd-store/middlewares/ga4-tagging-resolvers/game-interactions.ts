import { buildGameInteractionsEvent, GameInteractionsEvent } from "tagging-library";
import { gameCardCodec, parseURN } from "@ppb/tbd-urn-codecs";
import { TaggingAction } from "../tagging-resolvers/AnalyticsConstants";
import { ApplicationState } from "../../state/ApplicationState.types";
import { LoadPlayNew } from "../../actions/navigation";
import { JackpotMerchandiseView, LoadedPageContent } from "../../actions/game-interactions";
import { AddUserFavouriteGameAction, RemoveUserFavouriteGameAction } from "../../actions/user-favourite-games";
import { getViewZoneByItemUrn } from "../../state/layout/viewzones/viewzone-selectors";
import { PartialItem } from "../../state/layout";
import { GamingCardGroups } from "../../state/layout/cardgroups/CardGroup.types";
import URN from "../../state/layout/URN";
import { createCardGroupByURNSelector } from "../../state/layout/cardgroups/cardgroups-selectors";
import { createCardByURNSelector } from "../../state/layout/cards/cards-selectors";
import { GameCard, GameCards } from "../../state/layout/cards/Card.types";
import { getGameByURN } from "../../state/entities/games/game-selectors";
import { Game } from "../../state/entities/Gaming.types";
import { getLayoutMetadata } from "../../state/layout-snapshot";

type LoadPrizeMachineEventParams = {
  urn: string;
  hasJackpot: boolean;
  jackpotState: string;
  guaranteedPrize: boolean;
};
export const getLoadPrizeMachineEvent = (params: LoadPrizeMachineEventParams): GameInteractionsEvent => {
  const { urn, hasJackpot, jackpotState, guaranteedPrize } = params;

  const metadata = getLayoutMetadata(urn);

  let isPlus = "";

  if (guaranteedPrize) {
    if (hasJackpot) {
      isPlus = " plus -";
    } else {
      isPlus = " plus";
    }
  }

  return buildGameInteractionsEvent({
    elementText: hasJackpot ? `prize machine -${isPlus} active jackpot - ${jackpotState}` : `prize machine${isPlus}`,
    gameName: "prize pinball",
    gameId: "prize pinball",
    position: "",
    gameProvider: "",
    moduleDisplayOrder: metadata.verticalPosition?.toString() || "",
    gameState: "",
    action: TaggingAction.DISPLAYED,
    module: "prize machine",
    stake: "",
    winnings: "",
  });
};

export const getLoadPlayNewEvent = (action: LoadPlayNew): GameInteractionsEvent => {
  const { urn, isStaticPromo } = action.payload;
  const metadata = getLayoutMetadata(urn);

  return buildGameInteractionsEvent({
    elementText: "",
    gameName: isStaticPromo ? "spin until you win - hype building" : "spin until you win - active",
    gameId: isStaticPromo ? "spin until you win - hype building" : "spin until you win - active",
    position: "",
    gameProvider: "",
    moduleDisplayOrder: metadata.verticalPosition !== undefined ? metadata.verticalPosition.toString() : "",
    gameState: "",
    action: TaggingAction.DISPLAYED,
    module: "spin until you win",
    stake: "",
    winnings: "",
  });
};

export const getLoadedPageContentEvent = (
  action: LoadedPageContent,
  state: ApplicationState,
): GameInteractionsEvent => {
  const { urn, title, itemUrns } = action.payload;
  const metadata = getLayoutMetadata(urn);
  const getGamingCardGroupByURN = createCardGroupByURNSelector<GamingCardGroups, URN>();
  const getGameCard = createCardByURNSelector<GameCards, URN>();

  const cardGroup =
    getGamingCardGroupByURN(state.layouts.cardgroups.gamingcardgroups, metadata.cardGroupUrn || "") ?? null;

  const urnsToProcess = itemUrns || cardGroup?.items?.map((item: PartialItem) => item.urn) || [];
  const gameCards = urnsToProcess.map((itemUrn: string) => getGameCard(state.layouts.cards.games, itemUrn));
  const games =
    gameCards?.map((item: GameCard | null) => item && getGameByURN(state.entities.games, item.game)) || null;

  const names =
    games
      ?.filter((item: Game | null | undefined) => item)
      .map((item: Game | null | undefined) => item?.name)
      .join(", ") || "";

  const providers =
    games
      ?.filter((item: Game | null | undefined) => item)
      .map((item: Game | null | undefined) => item?.provider.name)
      .join(", ") || "";

  // Use launchId if available, otherwise extract game code
  const ids = urnsToProcess
    .map((itemUrn: string, index: number) => {
      const game = games?.[index];
      if (game?.launchId) {
        return game.launchId;
      }
      const parsedUrn = parseURN(itemUrn);
      if (parsedUrn && gameCardCodec.isValid(parsedUrn)) {
        const extracted = gameCardCodec.extract(parsedUrn);
        return extracted?.value || itemUrn;
      }
      return itemUrn;
    })
    .join(", ");

  return buildGameInteractionsEvent({
    elementText: title,
    module: JSON.stringify(metadata.cardGroupUrn),
    gameName: names,
    gameId: ids,
    position: metadata.horizontalPosition?.toString() || "null",
    gameProvider: providers,
    moduleDisplayOrder: metadata.verticalPosition !== undefined ? metadata.verticalPosition.toString() : "",
    gameState: "",
    action: TaggingAction.DISPLAYED,
  });
};

export const getJackpotMerchandiseViewEvent = (
  action: JackpotMerchandiseView,
  state: ApplicationState,
): GameInteractionsEvent => {
  const { state: jackpotState, name, urn, elementText } = action.payload;
  const metadata = getLayoutMetadata(urn);
  const getGamingCardGroupByURN = createCardGroupByURNSelector<GamingCardGroups, URN>();
  const getGameCard = createCardByURNSelector<GameCards, URN>();

  const viewZone = getViewZoneByItemUrn(state, urn);
  const gamingCardGroupPartial = viewZone?.viewZone?.items?.length
    ? viewZone.viewZone.items.find((item: PartialItem) => item.typename === "GamingCardGroup")
    : null;
  const cardGroup =
    (gamingCardGroupPartial &&
      getGamingCardGroupByURN(state.layouts.cardgroups.gamingcardgroups, gamingCardGroupPartial.urn || "")) ||
    null;
  const jackpotGameCards =
    cardGroup?.items?.map((item: PartialItem) => getGameCard(state.layouts.cards.games, item.urn)) || null;
  const jackpotGames =
    jackpotGameCards?.map((item: GameCard | null) => item && getGameByURN(state.entities.games, item.game)) || null;
  const names =
    jackpotGames
      ?.filter((item: Game | null | undefined) => item)
      .map((item: Game | null | undefined) => item?.name)
      .join(", ") || "";
  const providers =
    jackpotGames
      ?.filter((item: Game | null | undefined) => item)
      .map((item: Game | null | undefined) => item?.provider.name)
      .join(", ") || "";
  const ids =
    jackpotGames
      ?.filter((item: Game | null | undefined) => item)
      .map((item: Game | null | undefined) => item?.launchId)
      .join(", ") || "";

  return buildGameInteractionsEvent({
    elementText,
    module: name,
    gameName: names,
    gameId: ids,
    position: "",
    gameProvider: providers,
    moduleDisplayOrder: metadata.verticalPosition !== undefined ? metadata.verticalPosition.toString() : "",
    gameState: jackpotState,
    action: TaggingAction.DISPLAYED,
    stake: "",
    winnings: "",
  });
};

export const getAddGameToFavouritesEvent = (action: AddUserFavouriteGameAction): GameInteractionsEvent | null => {
  const { gameId, gameName, gameProvider, urn, cardGroupUrn, segmentedCardGroupUrn } = action.payload;

  // If tagging data is not provided, don't send the event
  if (!gameName || !gameProvider || !urn) {
    return null;
  }

  const metadata = getLayoutMetadata(urn);
  const position = metadata.horizontalPosition?.toString() || "";
  const moduleDisplayOrder = metadata.verticalPosition?.toString() || "";
  const module = cardGroupUrn || segmentedCardGroupUrn || "";

  return buildGameInteractionsEvent({
    elementText: "",
    module,
    gameName,
    gameId,
    position,
    gameProvider,
    moduleDisplayOrder,
    gameState: "",
    action: "added game to favourites",
  });
};

export const getRemoveGameFromFavouritesEvent = (
  action: RemoveUserFavouriteGameAction,
): GameInteractionsEvent | null => {
  const { gameId, gameName, gameProvider, urn, cardGroupUrn, segmentedCardGroupUrn } = action.payload;

  // If tagging data is not provided, don't send the event
  if (!gameName || !gameProvider || !urn) {
    return null;
  }

  const metadata = getLayoutMetadata(urn);
  const position = metadata.horizontalPosition?.toString() || "";
  const moduleDisplayOrder = metadata.verticalPosition?.toString() || "";
  const module = cardGroupUrn || segmentedCardGroupUrn || "";

  return buildGameInteractionsEvent({
    elementText: "",
    module,
    gameName,
    gameId,
    position,
    gameProvider,
    moduleDisplayOrder,
    gameState: "",
    action: "removed game from favourites",
  });
};
