import { getBetslipCard } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { AlertProps } from "@ppb/the-wall-common/types";
import { MapStateToPropsFactory } from "react-redux";
import { createMultiplesNotificationsSelector, translateMultiple } from "../connected-sportsbook-betslip-mapper";
import { createGetConfirmationOneLineMultiple, createIsConfirmStep } from "../sportsbook-betslip-confirm-mapper";
import { createGetCurrentMultiple } from "../SportsbookPlace/sportsbook-place-mapper";

type CardProps = {
  multiplesNotifications?: AlertProps[];
  currentMultiple?: { id: string; text: string };
};

export type StateProps = CardProps | Record<string, never>;

export type ContainerProps = {
  hasOneLineMultiple: boolean;
  shouldFocusStakeField?: boolean;
  betControlsExperimentVariant?: string;
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const buildMultiplesNotifications = createMultiplesNotificationsSelector();
  const getCurrentMultiple = createGetCurrentMultiple();
  const getConfirmMultiple = createGetConfirmationOneLineMultiple();
  const getIsConfirmStep = createIsConfirmStep();

  return (appState: ApplicationState, { hasOneLineMultiple }: ContainerProps): StateProps => {
    const card = getBetslipCard(appState);
    const multiplesNotifications = buildMultiplesNotifications(appState);

    let currentMultiple;
    if (hasOneLineMultiple) {
      const isConfirmStep = getIsConfirmStep(appState);
      currentMultiple = isConfirmStep ? getConfirmMultiple(appState) : getCurrentMultiple(appState);
    }

    if (!card || !(currentMultiple || multiplesNotifications)) {
      return {};
    }

    return {
      multiplesNotifications,
      currentMultiple: currentMultiple
        ? {
            id: currentMultiple.id,
            text: translateMultiple(currentMultiple?.betType),
          }
        : undefined,
    };
  };
};
