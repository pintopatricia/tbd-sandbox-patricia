import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { Dispatch } from "redux";

import { ApplicationState } from "@ppb/tbd-store";
import {
  BetslipSportsbookCastBetChange,
  BetslipSportsbookCastBetOrderChange,
  BetslipSportsbookConfirmCastBetChange,
  UI__BETSLIP_SBK_CAST_BET_CHANGE,
  UI__BETSLIP_SBK_CAST_BET_ORDER_CHANGE,
  UI__BETSLIP_SBK_CONFIRM_CAST_BET_CHANGE,
} from "@ppb/tbd-store/actions/betslip";
import { BettingSportsbookOrderChangeAction, BETTING__SBK_ORDER_CHANGE } from "@ppb/tbd-store/actions/betting";
import { getBetslipCard, getCastContext } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { createGetCastRunnerIdsSelector } from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { CastBetCastTypeItem, CastBetOnCastTypeChange } from "@ppb/the-wall-common/types";

import { createGetCastBetSelector } from "../betslip-mapper";
import {
  createGetConfirmationCastBetSelector,
  createGetConfirmationCastContextSelector,
  createGetConfirmationCastRunnerIdsSelector,
  createGetConfirmationCastTypesSelector,
  createIsConfirmStep,
} from "../sportsbook-betslip-confirm-mapper";
import { createCastTypesBuilder } from "../SportsbookPlace/sportsbook-place-mapper";

type CardProps = {
  id: string;
  title?: string;
  selectedCastType?: string;
  runnersOrder: string[];
  castTypes: CastBetCastTypeItem[];
  isOrderable?: boolean;
};

export type StateProps = CardProps | Record<string, never>;

export type ContainerProps = {
  castGroupId: string;
  shouldFocusStakeField?: boolean;
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getIsConfirmStep = createIsConfirmStep();
  const getCastBet = createGetCastBetSelector();
  const getConfirmationCastBet = createGetConfirmationCastBetSelector();
  const getCastTypes = createCastTypesBuilder();
  const getConfirmationCastTypes = createGetConfirmationCastTypesSelector();
  const getRunnerOrders = createGetCastRunnerIdsSelector();
  const getConfirmationRunnerOrders = createGetConfirmationCastRunnerIdsSelector();
  const getConfirmationCastContext = createGetConfirmationCastContextSelector();

  return (state: ApplicationState, { castGroupId }): StateProps => {
    const card = getBetslipCard(state);

    if (!card) {
      return {};
    }

    const isConfirmStep = getIsConfirmStep(state);
    const castBet = isConfirmStep ? getConfirmationCastBet(state, castGroupId) : getCastBet(state, castGroupId);

    if (!castBet) {
      return {};
    }

    const { id, title, selectedCastType, isOrderable } = castBet;

    let castTypes;
    let castContext;
    let runnersOrder;

    if (isConfirmStep) {
      castTypes = getConfirmationCastTypes(state, castGroupId);
      castContext = getConfirmationCastContext(state);
      runnersOrder = getConfirmationRunnerOrders(state, castContext?.[castGroupId]);
    } else {
      castTypes = getCastTypes(state, castGroupId);
      castContext = getCastContext(card);
      runnersOrder = getRunnerOrders(state, castContext?.[castGroupId]);
    }

    return {
      id,
      title,
      selectedCastType,
      runnersOrder,
      castTypes,
      isOrderable,
    };
  };
};

export type DispatchProps = {
  dispatchCastBetChange: CastBetOnCastTypeChange;
  dispatchConfirmCastBetChange: CastBetOnCastTypeChange;
  dispatchOrderChange: (combinationId: string, updatedRunnerId: string, order: string[]) => void;
};

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (dispatch: Dispatch) => ({
  dispatchOrderChange: (combinationId, updatedRunnerId, order) => {
    dispatch<BettingSportsbookOrderChangeAction>({
      type: BETTING__SBK_ORDER_CHANGE,
      payload: {
        order,
      },
    });
    dispatch<BetslipSportsbookCastBetOrderChange>({
      type: UI__BETSLIP_SBK_CAST_BET_ORDER_CHANGE,
      payload: {
        combinationId,
        updatedRunnerId,
      },
    });
  },
  dispatchCastBetChange: (castId: string, combinationId: string) => {
    dispatch<BetslipSportsbookCastBetChange>({
      type: UI__BETSLIP_SBK_CAST_BET_CHANGE,
      payload: {
        castId,
        combinationId,
      },
    });
  },
  dispatchConfirmCastBetChange: (castId: string, combinationId: string) => {
    dispatch<BetslipSportsbookConfirmCastBetChange>({
      type: UI__BETSLIP_SBK_CONFIRM_CAST_BET_CHANGE,
      payload: {
        castId,
        combinationId,
      },
    });
  },
});
