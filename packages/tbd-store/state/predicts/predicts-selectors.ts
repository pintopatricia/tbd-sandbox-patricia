import { ApplicationState } from "../ApplicationState.types";

export const getIsPredictsOpen = (state: ApplicationState): boolean => state.predicts.isOpen;
