export const UI__BOTTOM_BAR_GAME_LAUNCH = "UI__BOTTOM_BAR_GAME_LAUNCH";

export type BottomBarGameLaunchAction = {
  type: typeof UI__BOTTOM_BAR_GAME_LAUNCH;
  payload: {
    path: string;
    tile: string;
  };
};
