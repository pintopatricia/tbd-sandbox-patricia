import { FETCH_CATALOGUE_SUCCESS, FetchCatalogueSuccessAction } from "../../../actions/catalogue";
import { GameLaunchAction, GAME_LAUNCH } from "../../../actions/game-feeds";
import { isRecentlyPlayedGroup } from "../../../helpers/recently-played-games";
import { PartialItem } from "../views/PartialItem.types";

const INITIAL_STATE: PartialItem[] = [];

type ActionTypes = FetchCatalogueSuccessAction | GameLaunchAction;

const splittedUrl = (link: string): string => link.split("|")[0];

export function updateRecentlyPlayedGamesList(
  launchedGame: PartialItem,
  recentlyPlayedGamesList: PartialItem[],
): PartialItem[] {
  const formattedLaunchedGame = {
    ...launchedGame,
    urn: `ppb:tbd:card:gaming:game:uid/${launchedGame.urn.split("/")[1]}`,
  };
  const isGameInList = !!recentlyPlayedGamesList.find(
    (game) => splittedUrl(game.urn) === splittedUrl(formattedLaunchedGame.urn),
  );
  if (isGameInList) {
    const playedGames = recentlyPlayedGamesList.filter(
      (game) => splittedUrl(game.urn) !== splittedUrl(formattedLaunchedGame.urn),
    );
    return [formattedLaunchedGame, ...playedGames];
  }
  return [formattedLaunchedGame, ...recentlyPlayedGamesList.slice(0, recentlyPlayedGamesList.length - 1)];
}

export default (currentState: PartialItem[] = INITIAL_STATE, action: ActionTypes): PartialItem[] => {
  switch (action.type) {
    case FETCH_CATALOGUE_SUCCESS: {
      const groups = action.payload.data.GamingCardGroup || [];
      const recent = groups.find((cargroup) => isRecentlyPlayedGroup(cargroup.urn))?.items;

      if (!recent || !recent.length) {
        return currentState;
      }

      return recent;
    }
    case GAME_LAUNCH:
      return updateRecentlyPlayedGamesList(action.payload, currentState);
    default:
      return currentState;
  }
};
