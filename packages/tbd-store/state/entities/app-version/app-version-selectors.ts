import { createSelector, ParametricSelector } from "reselect";
import type { AppPlatformVersion, AppPlatform, AppVersion } from "./AppVersion.types";

export const getAppPlatformVersion = (
  appVersionState: AppVersion,
  appPlatform: AppPlatform,
): AppPlatformVersion | undefined => appVersionState?.[appPlatform];

export const createGetAppPlatformVersionSelector = (): ParametricSelector<
  AppVersion,
  AppPlatform,
  AppPlatformVersion | undefined
> => createSelector([getAppPlatformVersion], (appPlatformVersion) => appPlatformVersion);
