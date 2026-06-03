import URN from "../state/layout/URN";

export const UI__BROADCASTS_CARD_TOGGLE = "UI__BROADCASTS_CARD_TOGGLE";
export const UI__MEDIA_PLAYER_LOADED = "UI__MEDIA_PLAYER_LOADED";
export const UI__TIME_FORM_BROADCASTS_CARD_TOGGLE = "UI__TIME_FORM_BROADCASTS_CARD_TOGGLE";
export const UI__TIME_FORM_BROADCASTS_CARD_MEDIA_PLAYER_EVENT = "UI__TIME_FORM_BROADCASTS_CARD_MEDIA_PLAYER_EVENT";
export const UI__BROADCASTS_AND_STATISTICS_CARD_TOGGLE = "UI__BROADCASTS_AND_STATISTICS_CARD_TOGGLE";
export const UI__BROADCASTS_AND_STATISTICS_MEDIA_PLAYER_LOADED = "UI__BROADCASTS_AND_STATISTICS_MEDIA_PLAYER_LOADED";
export const UI__RACE_REPLAYS_MEDIA_PLAYER_LOADED = "UI__RACE_REPLAYS_MEDIA_PLAYER_LOADED";

export type BroadcastsCardToggleAction = {
  type: typeof UI__BROADCASTS_CARD_TOGGLE;
  payload: {
    isExpanded: boolean;
    cardUrn: URN;
  };
};

export type MediaPlayerLoadedAction = {
  type: typeof UI__MEDIA_PLAYER_LOADED;
  payload: {
    label: string;
    cardUrn: URN;
  };
};

export type TimeFormBroadCastsCardMediaPlayerAction = {
  type: typeof UI__TIME_FORM_BROADCASTS_CARD_MEDIA_PLAYER_EVENT;
  payload: {
    label: string;
    raceUrn: URN;
  };
};

export type TimeFormBroadCastsCardToggleAction = {
  type: typeof UI__TIME_FORM_BROADCASTS_CARD_TOGGLE;
  payload: {
    isExpanded: boolean;
    cardUrn: URN;
    raceUrn: URN;
  };
};

export type BroadcastsAndStatisticsCardToggleAction = {
  type: typeof UI__BROADCASTS_AND_STATISTICS_CARD_TOGGLE;
  payload: {
    isExpanded: boolean;
    cardUrn: URN;
  };
};

export type BroadcastsAndStatisticsCardMediaPlayerLoadedAction = {
  type: typeof UI__BROADCASTS_AND_STATISTICS_MEDIA_PLAYER_LOADED;
  payload: {
    label: string;
    cardUrn: URN;
  };
};

export type RaceReplaysMediaPlayerLoadedAction = {
  type: typeof UI__RACE_REPLAYS_MEDIA_PLAYER_LOADED;
  payload: {
    marketUrn: URN;
  };
};
