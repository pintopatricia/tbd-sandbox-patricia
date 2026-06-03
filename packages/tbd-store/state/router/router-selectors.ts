import { ApplicationState } from "../ApplicationState.types";
import URN from "../layout/URN";
import { RouterState } from "./RouterState.types";

export const getCurrentViewURN = (state: RouterState): URN | null => state.currentUrn;

export const getCurrentViewURL = (state: RouterState): string | null => state.currentUrl;

export const getCurrentView = (state: RouterState): string | null => state.currentView;

export const getRefreshState = (state: RouterState): boolean => state.isRefreshing;

export const getRouter = (state: ApplicationState): RouterState => state.router;
