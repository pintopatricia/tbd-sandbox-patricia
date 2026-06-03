import { AlertProps, AlertType, AlertViewModel } from "@ppb/the-wall-common/types";
import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { createOddsMovementSelector } from "@ppb/tbd-store/state/betslip/betslip-odds-movement-selectors";
import { BETTING__OBB_VALIDATE_STAKE, BettingObbValidateStake } from "@ppb/tbd-store/actions/betting";
import { Dispatch } from "redux";
import { EXTERNAL_PUSH, ExternalPushAction } from "@ppb/tbd-store";
import {
  BetslipMaxPayoutNotificationAcceptedAction,
  BetslipObbMaxPayoutNotificationUrlClickAction,
  BetslipObbNotificationShownAction,
  UI__BETSLIP_MAX_PAYOUT_NOTIFICATION_ACCEPTED,
  UI__BETSLIP_OBB_MAX_PAYOUT_NOTIFICATION_URL_CLICK,
  UI__BETSLIP_OBB_NOTIFICATION_SHOWN,
} from "@ppb/tbd-store/actions/betslip";
import { NotificationCode } from "../betslip-notification-code";
import { i18n } from "../../../helpers/i18n";
import { createValidationsSelector, NOTIFICATION_TYPES, ObbValidation } from "./obb-notifier-mapper";
import { createGetObbIsDepositRequiredSelector } from "../betslip-mapper";
import { buildObbFailuresNotifications, createAvailabilityNotificationSelector } from "../connected-obb-betslip-mapper";

export type StateProps = {
  notifications: AlertProps[];
  validations: (
    | ObbValidation
    | {
        type: NOTIFICATION_TYPES;
        notification: AlertProps;
      }
  )[];
};

export type ContainerProps = {
  className?: string;
  style?: Record<string, unknown>;
  isBetslipCollapsed?: boolean;
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps | false, ContainerProps, ApplicationState> = () => {
  const oddsChangedNotification: AlertProps = {
    id: NotificationCode.OddsChanged,
    type: AlertType.Info,
    message: i18n({ key: "I18N.BETSLIP.ODDS_CHANGE_NOTIFICATION" }),
  };

  const oddsAndAvailabilityNotification: AlertProps = {
    id: NotificationCode.OddsAvailability,
    type: AlertType.Warning,
    message: i18n({ key: "I18N.BETSLIP.ODDS_AVAILABILITY_NOTIFICATION" }),
  };

  const insufficientFundsNotification: AlertProps = {
    id: NotificationCode.InsufficientFunds,
    message: i18n({ key: "I18N.BETSLIP.OBB.ERROR.INSUFFICIENT_FUNDS" }),
    type: AlertType.Error,
    gtmLabel: `${AlertType.Error}I18N.BETSLIP.OBB.ERROR.INSUFFICIENT_FUNDS`,
  };

  const getValidations = createValidationsSelector();
  const getAvailability = createAvailabilityNotificationSelector();
  const getOddsMovementState = createOddsMovementSelector();
  const getIsDepositRequired = createGetObbIsDepositRequiredSelector();

  return (state: ApplicationState) => {
    if (!state.betslip) {
      return false;
    }

    const availabilityNotification = getAvailability(state);
    const validations = getValidations(state);
    const oddsMovementMap = getOddsMovementState(state.betslip.obbOddsMovement);
    const hasAnyOddChanged = Object.values(oddsMovementMap).some((potentialBet) => potentialBet.movement !== null);
    const isDepositRequired = getIsDepositRequired(state);
    const filteredValidationsNotifications = validations
      .map(({ notification }) => notification)
      .filter((notification): notification is AlertViewModel => !!notification);

    const highPriorityNotifications =
      filteredValidationsNotifications.length > 0 ? filteredValidationsNotifications : null;

    const oddsAndAvailabilityConditions = [
      { condition: hasAnyOddChanged && !!availabilityNotification, item: [oddsAndAvailabilityNotification] },
      { condition: !!availabilityNotification, item: availabilityNotification ? [availabilityNotification] : [] },
      { condition: hasAnyOddChanged, item: [oddsChangedNotification] },
    ];

    const failureNotifications = buildObbFailuresNotifications(state);
    const filteredFailureNotifications = failureNotifications || [];

    const lowPriorityNotification = oddsAndAvailabilityConditions.find((item) => item.condition)?.item;
    const lowPriorityNotifications = lowPriorityNotification ? [...lowPriorityNotification] : [];

    const generalNotifications = highPriorityNotifications || lowPriorityNotifications;

    if (isDepositRequired) {
      return {
        notifications: [insufficientFundsNotification, ...generalNotifications],
        validations,
      };
    }

    return {
      notifications: [...filteredFailureNotifications, ...generalNotifications],
      validations,
    };
  };
};

export type DispatchActions =
  | BettingObbValidateStake
  | BetslipObbNotificationShownAction
  | BetslipObbMaxPayoutNotificationUrlClickAction
  | ExternalPushAction
  | BetslipMaxPayoutNotificationAcceptedAction;

export type DispatchProps = {
  dispatchObbValidateStake: (id: string) => void;
  dispatchObbNotificationShown: (gtmLabel: string) => void;
  dispatchObbMaxPayoutNotificationUrlClick: (url: string) => void;
  dispatchExternalPush: (url: string) => void;
  dispatchMaxPayoutNotificationAccepted: () => void;
};

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (
  dispatch: Dispatch<DispatchActions>,
) => ({
  dispatchObbValidateStake: (id) => {
    dispatch<BettingObbValidateStake>({ type: BETTING__OBB_VALIDATE_STAKE, payload: { potentialBetId: id } });
  },

  dispatchObbNotificationShown: (label) => {
    dispatch<BetslipObbNotificationShownAction>({
      type: UI__BETSLIP_OBB_NOTIFICATION_SHOWN,
      payload: {
        label,
      },
    });
  },

  dispatchObbMaxPayoutNotificationUrlClick: (url) => {
    dispatch<BetslipObbMaxPayoutNotificationUrlClickAction>({
      type: UI__BETSLIP_OBB_MAX_PAYOUT_NOTIFICATION_URL_CLICK,
      payload: {
        url,
      },
    });
  },

  dispatchExternalPush: (url: string) => {
    dispatch<ExternalPushAction>({
      type: EXTERNAL_PUSH,
      payload: {
        viewUrn: "",
        viewUrl: url,
        gtmData: {
          label: "I18N.BETSLIP.VALIDATION_SEE_TC_FOR_MORE_INFO",
          moduleName: "betslip",
        },
      },
    });
  },

  dispatchMaxPayoutNotificationAccepted: () => {
    dispatch<BetslipMaxPayoutNotificationAcceptedAction>({
      type: UI__BETSLIP_MAX_PAYOUT_NOTIFICATION_ACCEPTED,
    });
  },
});
