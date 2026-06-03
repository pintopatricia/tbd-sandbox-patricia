import appConfiguration from "../config/app-configuration.native";

export const getValidGameLaunchPatterns = () => {
  return [
    appConfiguration.deeplinkConfiguration.gameLaunchURLPattern,
    appConfiguration.deeplinkConfiguration.newGameLaunchPattern,
  ].filter((pattern): pattern is string => Boolean(pattern));
};
