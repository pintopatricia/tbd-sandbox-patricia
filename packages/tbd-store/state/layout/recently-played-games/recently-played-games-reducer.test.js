import recentlyPlayedGamesReducer, { updateRecentlyPlayedGamesList } from "./recently-played-games-reducer";

const initialStateMock = [];
const recentlyPlayedGamesListMock = [
  {
    typename: "GameCard",
    urn: "ppb:tbd:card:gaming:game:uid/fishin-frenzy-jk-abp",
  },
  {
    typename: "GameCard",
    urn: "ppb:tbd:card:gaming:game:uid/age-of-the-gods-god-of-storms-cptn",
  },
  {
    typename: "GameCard",
    urn: "ppb:tbd:card:gaming:game:uid/starburst-cev",
  },
  {
    typename: "GameCard",
    urn: "ppb:tbd:card:gaming:game:uid/gonzos-quest-cev",
  },
];

const stateMock = [
  {
    defaultLayout: "GRID_FOUR_COLUMNS",
    displayMode: "SCROLLABLE",
    displayName: undefined,
    items: recentlyPlayedGamesListMock,
    layouts: ["GRID_FOUR_COLUMNS"],
    title: "Play It Again",
    titleImage: undefined,
    typename: "SwimlaneCardGroup",
    urn: "ppb:tbd:gaming:masterConfigElement:recently_played/0",
    viewAll: undefined,
  },
];

const stateMockNoRecentlyPlayed = [
  {
    defaultLayout: "GRID_FOUR_COLUMNS",
    displayMode: "SCROLLABLE",
    displayName: undefined,
    items: recentlyPlayedGamesListMock,
    layouts: ["GRID_FOUR_COLUMNS"],
    title: "Play It Again",
    titleImage: undefined,
    typename: "SwimlaneCardGroup",
    urn: "other urn",
    viewAll: undefined,
  },
];

const launchedGameMock = {
  typename: "GameCard",
  urn: "ppb:tbd:card:gaming:game:uid/big-bass-bonanza-apr",
};

describe("recently played games reducer", () => {
  describe("when action is not handled in the reducer", () => {
    it("should return the initial state", () => {
      const state = recentlyPlayedGamesReducer([], {});
      expect(state).toEqual(initialStateMock);
    });
  });

  describe('when action type matches "FETCH_CATALOGUE_SUCCESS" and there is a recently played card group', () => {
    it("should create the recently played games list", () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {
            GamingCardGroup: stateMock,
          },
        },
      };
      const state = recentlyPlayedGamesReducer(recentlyPlayedGamesListMock, action);
      expect(state).toEqual(recentlyPlayedGamesListMock);
    });
  });

  describe('when action type matches "FETCH_CATALOGUE_SUCCESS" and there is NOT a recently played card group', () => {
    it("should create the recently played games list", () => {
      const action = {
        type: "FETCH_CATALOGUE_SUCCESS",
        payload: {
          data: {
            GamingCardGroup: stateMockNoRecentlyPlayed,
          },
        },
      };
      const state = recentlyPlayedGamesReducer([], action);
      expect(state).toEqual([]);
    });
  });

  describe('when the action type matches "GAME_LAUNCH"', () => {
    it("should update the recently played list with the current lauched game", () => {
      const action = {
        type: "GAME_LAUNCH",
        payload: launchedGameMock,
      };
      const state = recentlyPlayedGamesReducer(recentlyPlayedGamesListMock, action);
      expect(state.length).toBe(recentlyPlayedGamesListMock.length);
      expect(state[0]).toEqual(launchedGameMock);
    });
  });
});

describe("update recently played games list", () => {
  describe("when the launched game is not in the recently played games list", () => {
    it("should add the launced game into the list and remove the last item from original list", () => {
      const updatedGamesList = updateRecentlyPlayedGamesList(launchedGameMock, recentlyPlayedGamesListMock);
      const removedGame = recentlyPlayedGamesListMock[recentlyPlayedGamesListMock.length - 1];
      expect(updatedGamesList[0]).toEqual(launchedGameMock);
      expect(updatedGamesList[updatedGamesList.length - 1]).not.toEqual(removedGame);
    });
  });

  describe("when the launched game is in the recently played games list", () => {
    it("should set the launced game as first item the list", () => {
      const secondGame = recentlyPlayedGamesListMock[1];
      const updatedGamesList = updateRecentlyPlayedGamesList(secondGame, recentlyPlayedGamesListMock);
      expect(updatedGamesList[0]).toEqual(secondGame);
    });
  });
});
