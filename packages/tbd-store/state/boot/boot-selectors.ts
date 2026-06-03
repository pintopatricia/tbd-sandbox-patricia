import { ApplicationState } from "../ApplicationState.types";

export const getAllowLoadFromStorage = (appState: ApplicationState): boolean => !!appState.boot.allowLoadFromStorage;
export const getIsExchangeEnabled = (appState: ApplicationState): boolean => !!appState.boot.exchangeEnabled;
export const getCanUsePhoenixExchange = (appState: ApplicationState): boolean => !!appState.boot.canUsePhoenixExchange;
