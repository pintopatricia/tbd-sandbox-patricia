import { Dispatch } from "redux";
import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";

import {
  BetslipBetBuilderMultisDismissNotificationAction,
  UI__BETSLIP_DISMISS_BET_BUILDER_MULTIS_NOTIFICATION_ACTION,
} from "@ppb/tbd-store/actions/betslip";
import {
  getBetslipCard,
  getSportsbookConfirmationCombinations,
} from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { getSportsbookBettingCombinations } from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { createGetThrottleSelector } from "@ppb/tbd-store/state/entities/throttles/throttles-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { createGetMultiBetBuilderSelector } from "@ppb/tbd-store/helpers/sportsbook-betting";

import { createIsConfirmStep } from "../sportsbook-betslip-confirm-mapper";
import { i18n } from "../../../helpers/i18n";
import { translateMultiple } from "../connected-sportsbook-betslip-mapper";

import {
  createGetBettingEventGroupedLegs,
  createGetConfirmationEventGroupedLegs,
  EventGroupMap,
} from "./multi-bet-builder-card-mapper";

export type ContainerProps = {
  shouldFocusStakeField?: boolean;
  betControlsExperimentVariant?: string;
};

export type CardProps = {
  id: string;
  title: string;
  groups: EventGroupMap;
  isNotificationVisible: boolean;
  i18n: {
    notification?: string;
  };
};

export type StateProps = CardProps | Record<string, never>;

export type DispatchProps = {
  dispatchBetslipBetBuilderMultisDismissNotification: () => void;
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getIsConfirmStep = createIsConfirmStep();
  const getBettingEventGroupedLegs = createGetBettingEventGroupedLegs();
  const getConfirmationEventGroupedLegs = createGetConfirmationEventGroupedLegs();
  const getThrottle = createGetThrottleSelector();

  const labels = {
    notification: i18n({ key: "I18N.BETSLIP.SBK.BET_BUILDER_MULTI_ONBOARD" }),
  };

  return (state: ApplicationState): StateProps => {
    const isConfirmStep = getIsConfirmStep(state);
    const getMultiBetBuilder = createGetMultiBetBuilderSelector(
      isConfirmStep ? getSportsbookConfirmationCombinations : getSportsbookBettingCombinations,
    );
    const combination = getMultiBetBuilder(state);
    const betslipCard = getBetslipCard(state);

    if (!betslipCard || !combination) {
      return {};
    }

    const { id, legs, betType } = combination;
    const notificationThrottle = getThrottle(state.entities.throttles, "MULTI_BET_BUILDER_ONBOARDING");

    return {
      id,
      groups: isConfirmStep ? getConfirmationEventGroupedLegs(state, legs) : getBettingEventGroupedLegs(state, legs),
      title: translateMultiple(betType),
      isNotificationVisible: !!notificationThrottle?.isActive && betslipCard.isBetBuilderMultisNotificationVisible,
      i18n: labels,
    };
  };
};

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (dispatch: Dispatch) => ({
  dispatchBetslipBetBuilderMultisDismissNotification: (): void => {
    dispatch<BetslipBetBuilderMultisDismissNotificationAction>({
      type: UI__BETSLIP_DISMISS_BET_BUILDER_MULTIS_NOTIFICATION_ACTION,
    });
  },
});
