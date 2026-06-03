import { FreezeBetLiveData } from "@flutter-global/uki-channels-http-clients/src/clients/SportsbookCashoutOperation/FixedOddsTransactional";
import URN from "../state/layout/URN";

export const NETWORK__FREEZE_BET = "NETWORK__FREEZE_BET";
export const NETWORK__FREEZE_BET_SUCCESS = "NETWORK__FREEZE_BET_SUCCESS";
export const NETWORK__FREEZE_BET_FAILURE = "NETWORK__FREEZE_BET_FAILURE";

export const UI__BET_MUTATION_ACCA_FREEZE_SELECTED = "UI/ACCA_FREEZE_SELECTED";
export const UI__BET_MUTATION_ACCA_FREEZE_DESELECTED = "UI/ACCA_FREEZE_DESELECTED";

export type FreezeLegAction = {
  type: typeof NETWORK__FREEZE_BET;
  payload: {
    betId: string;
    legRef: number;
    eventName: string;
    matchScore: string;
    timeFrozen: string;
  };
};

export type FreezeLegFailureAction = {
  type: typeof NETWORK__FREEZE_BET_FAILURE;
  payload: {
    betId: string;
    legRef: number;
  };
};

export type FreezeLegSuccessAction = {
  type: typeof NETWORK__FREEZE_BET_SUCCESS;
  payload: {
    betId: string;
    legRef: number;
    respStatus: string;
    freezeLiveDataDetails: FreezeBetLiveData;
  };
};

export type BetMutationAccaFreezeSelectedAction = {
  type: typeof UI__BET_MUTATION_ACCA_FREEZE_SELECTED;
  payload: {
    eventUrn: URN;
  };
};

export type BetMutationAccaFreezeDeselectedAction = {
  type: typeof UI__BET_MUTATION_ACCA_FREEZE_DESELECTED;
};

export type BetMutationFreezeLegAction = {
  type: typeof NETWORK__FREEZE_BET;
  payload: {
    eventName: string;
    matchScore: string;
    timeFrozen: string;
  };
};
