import URN from "../state/layout/URN";

export const UI__JACKPOT_MERCHANDISE_VIEW = "UI__JACKPOT_MERCHANDISE_VIEW";
export const UI__PAGE_CONTENT_LOADED = "UI__PAGE_CONTENT_LOADED";
export const UI__ADD_GAME_TO_FAVOURITES = "UI__ADD_GAME_TO_FAVOURITES";
export const UI__REMOVE_GAME_FROM_FAVOURITES = "UI__REMOVE_GAME_FROM_FAVOURITES";

export type JackpotMerchandiseView = {
  type: typeof UI__JACKPOT_MERCHANDISE_VIEW;
  payload: {
    state: string;
    name: string;
    urn: URN;
    elementText: string;
  };
};

export type LoadedPageContent = {
  type: typeof UI__PAGE_CONTENT_LOADED;
  payload: {
    urn: string;
    title: string;
    itemUrns: string[];
  };
};

export type AddGameToFavourites = {
  type: typeof UI__ADD_GAME_TO_FAVOURITES;
  payload: {
    gameId: string;
    gameName: string;
    gameProvider: string;
    mainProduct: string;
    urn: string;
    cardGroupUrn?: string;
    segmentedCardGroupUrn?: string;
  };
};

export type RemoveGameFromFavourites = {
  type: typeof UI__REMOVE_GAME_FROM_FAVOURITES;
  payload: {
    gameId: string;
    gameName: string;
    gameProvider: string;
    mainProduct: string;
    urn: string;
    cardGroupUrn?: string;
    segmentedCardGroupUrn?: string;
  };
};
