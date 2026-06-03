import { BETTING__SBK_VALIDATE_STAKE, BettingSportsbookValidateStake } from "@ppb/tbd-store/actions/betting";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { AlertProps, AlertType, AlertViewModel } from "@ppb/the-wall-common/types";
import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { Dispatch } from "redux";
import { createOddsMovementSelector } from "@ppb/tbd-store/state/betslip/betslip-odds-movement-selectors";
import {
  getBetslipCard,
  getSportsbookConfirmationAvailability,
} from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { ExternalPushAction, EXTERNAL_PUSH } from "@ppb/tbd-store/actions/router";
import {
  BetslipSportsbookNotificationShownAction,
  BetslipSportsbookMaxPayoutNotificationUrlClickAction,
  UI__BETSLIP_SBK_NOTIFICATION_SHOWN,
  UI__BETSLIP_SBK_MAX_PAYOUT_NOTIFICATION_URL_CLICK,
  UI__BETSLIP_MAX_PAYOUT_NOTIFICATION_ACCEPTED,
  BetslipMaxPayoutNotificationAcceptedAction,
} from "@ppb/tbd-store/actions/betslip";
import { createValidationsSelector, NOTIFICATION_TYPES, SportsbookValidation } from "./notifier-mapper";
import {
  buildSportsbookTransactionalError,
  createAvailabilityNotificationSelector,
} from "../connected-sportsbook-betslip-mapper";
import { NotificationCode } from "../betslip-notification-code";
import { i18n } from "../../../helpers/i18n";
import { createGetSbkIsDepositRequiredSelector } from "../betslip-mapper";
import { createIsConfirmStep } from "../sportsbook-betslip-confirm-mapper";
import { RUNNER_FAILURE_CODES } from "@ppb/betslip-core";
import { getAllUniqueRunnersFailures } from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";

export type StateProps = {
  notifications: AlertProps[];
  validations: (
    | SportsbookValidation
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

function shouldSurpressTransactionalError(state: ApplicationState): boolean {
  // if we have new odds movement alert experience
  // we want to filter out the requested price not available failure
  // as it will be surfaced as odds movement alert instead of transactional error
  const isOddsMovementAlertSwitchEnabled = state.entities.throttles["ODDS_MOVEMENT_ALERT_SWITCH"]?.isActive;
  if (!isOddsMovementAlertSwitchEnabled) {
    return false;
  }

  const runnerFailures = getAllUniqueRunnersFailures(state);
  return runnerFailures.every((failure) => failure === RUNNER_FAILURE_CODES.REQUESTED_PRICE_NOT_AVAILABLE);
}

export const makeMapStateToProps: MapStateToPropsFactory<StateProps | false, ContainerProps, ApplicationState> = (
  appState: ApplicationState,
) => {
  const oddsChangedNotification: AlertProps = {
    id: NotificationCode.OddsChanged,
    type: AlertType.Info,
    message: i18n({ key: "I18N.BETSLIP.ODDS_CHANGE_NOTIFICATION" }),
  };
  const handicapChangedNotification: AlertProps = {
    id: NotificationCode.HandicapChanged,
    type: AlertType.Info,
    message: i18n({ key: "I18N.BETSLIP.HANDICAP_CHANGE_NOTIFICATION" }),
  };
  const oddsAndHandicapChangedNotification: AlertProps = {
    id: NotificationCode.OddsHandicap,
    type: AlertType.Info,
    message: i18n({ key: "I18N.BETSLIP.ODDS_HANDICAP_CHANGE_NOTIFICATION" }),
  };
  const oddsAndAvailabilityNotification: AlertProps = {
    id: NotificationCode.OddsAvailability,
    type: AlertType.Warning,
    message: i18n({ key: "I18N.BETSLIP.ODDS_AVAILABILITY_NOTIFICATION" }),
  };
  const handicapAndAvailabilityNotification: AlertProps = {
    id: NotificationCode.HandicapAvailability,
    type: AlertType.Warning,
    message: i18n({ key: "I18N.BETSLIP.AVAILABILITY_HANDICAP_NOTIFICATION" }),
  };
  const oddsAndHandicapAndAvailabilityNotification: AlertProps = {
    id: NotificationCode.OddsHandicapAvailability,
    type: AlertType.Warning,
    message: i18n({ key: "I18N.BETSLIP.ODDS_AVAILABILITY_HANDICAP_NOTIFICATION" }),
  };

  const insufficientFundsNotification: AlertProps = appState?.entities.brandSettings?.SBG_BETSLIP_ERROR_MESSAGE
    ? {
        id: NotificationCode.InsufficientFunds,
        message: i18n({ key: "I18N.BETSLIP.ERROR.FUNDS_REQUIRED" }),
        detail: i18n({ key: "I18N.BETSLIP.ERROR.PLEASE_DEPOSIT" }),
        type: AlertType.Info,
        gtmLabel: `${AlertType.Error}I18N.BETSLIP.ERROR.FUNDS_REQUIRED`,
      }
    : {
        id: NotificationCode.InsufficientFunds,
        message: i18n({ key: "I18N.BETSLIP.SBK.ERROR.INSUFFICIENT_FUNDS" }),
        type: AlertType.Error,
        gtmLabel: `${AlertType.Error}I18N.BETSLIP.SBK.ERROR.INSUFFICIENT_FUNDS`,
      };

  const getIsConfirmStep = createIsConfirmStep();
  const getValidations = createValidationsSelector();
  const getAvailability = createAvailabilityNotificationSelector();
  const getOddsMovementState = createOddsMovementSelector();
  const getIsDepositRequired = createGetSbkIsDepositRequiredSelector();

  return (state: ApplicationState) => {
    const betslip = getBetslipCard(state);

    if (!betslip) {
      return false;
    }

    const isConfirmStep = getIsConfirmStep(state);
    const validations = getValidations(state);
    const availability = isConfirmStep ? false : getAvailability(state);
    const oddsMovementMap = getOddsMovementState(betslip.sportsbookOddsMovement);
    const isDepositRequired = getIsDepositRequired(state);
    const { sportsbookHandicapMovement } = betslip;
    const hasAnyOddChanged = Object.values(oddsMovementMap).some((each) => each.movement !== null);
    const availabilityChangedDuringConfirmStep = getSportsbookConfirmationAvailability(state);
    const validationsNotifications = validations
      .map(({ notification }) => notification)
      .filter((notification): notification is AlertViewModel => !!notification);

    // Validation notifications have higher precedence
    const highPriorityNotifications = (validationsNotifications.length > 0 && validationsNotifications) || null;

    const hasAnyHandicapChanged = sportsbookHandicapMovement
      ? Object.values(sportsbookHandicapMovement).some((each) => each.hasHandicapChanged)
      : false;

    const shouldSuppressError = shouldSurpressTransactionalError(state);
    const transactionalError = shouldSuppressError ? undefined : buildSportsbookTransactionalError(state);

    // order matters
    const notifications = appState?.entities.brandSettings?.SBG_BETSLIP_ERROR_MESSAGE
      ? [
          {
            condition: !!availability && hasAnyOddChanged && hasAnyHandicapChanged,
            item: [oddsAndHandicapAndAvailabilityNotification],
          },
          { condition: hasAnyOddChanged && hasAnyHandicapChanged, item: [oddsAndHandicapChangedNotification] },
          { condition: availabilityChangedDuringConfirmStep, item: [oddsAndAvailabilityNotification] },
          { condition: hasAnyHandicapChanged && !!availability, item: [handicapAndAvailabilityNotification] },
          { condition: !!availability, item: availability ? [availability] : [] },
          { condition: hasAnyHandicapChanged, item: [handicapChangedNotification] },
        ]
      : [
          {
            condition: !!availability && hasAnyOddChanged && hasAnyHandicapChanged,
            item: [oddsAndHandicapAndAvailabilityNotification],
          },
          { condition: hasAnyOddChanged && hasAnyHandicapChanged, item: [oddsAndHandicapChangedNotification] },
          { condition: hasAnyOddChanged && !!availability, item: [oddsAndAvailabilityNotification] },
          { condition: availabilityChangedDuringConfirmStep, item: [oddsAndAvailabilityNotification] },
          { condition: hasAnyHandicapChanged && !!availability, item: [handicapAndAvailabilityNotification] },
          { condition: !!availability, item: availability ? [availability] : [] },
          { condition: hasAnyOddChanged, item: [oddsChangedNotification] },
          { condition: hasAnyHandicapChanged, item: [handicapChangedNotification] },
        ];
    const lowPriorityNotification = notifications.find((notification) => notification.condition);
    const lowPriorityNotifications = lowPriorityNotification ? [...lowPriorityNotification.item] : [];

    const transactionalNotification = transactionalError ? [transactionalError] : [];
    const generalNotifications = highPriorityNotifications || lowPriorityNotifications;

    if (isDepositRequired) {
      return {
        notifications: [insufficientFundsNotification, ...generalNotifications],
        validations,
      };
    }

    return {
      notifications: [...transactionalNotification, ...generalNotifications],
      validations,
    };
  };
};

export type DispatchActions =
  | BettingSportsbookValidateStake
  | BetslipSportsbookNotificationShownAction
  | BetslipSportsbookMaxPayoutNotificationUrlClickAction
  | ExternalPushAction
  | BetslipMaxPayoutNotificationAcceptedAction;

export type DispatchProps = {
  dispatchSportsbookValidateStake: (combinationId: string) => void;
  dispatchSportsbookNotificationShown: (gtmLabel: string) => void;
  dispatchSportsbookMaxPayoutNotificationUrlClick: (url: string) => void;
  dispatchExternalPush: (url: string) => void;
  dispatchMaxPayoutNotificationAccepted: () => void;
};

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (
  dispatch: Dispatch<DispatchActions>,
) => ({
  dispatchSportsbookValidateStake: (combinationId) => {
    dispatch<BettingSportsbookValidateStake>({
      type: BETTING__SBK_VALIDATE_STAKE,
      payload: { combinationId },
    });
  },

  dispatchSportsbookNotificationShown: (label) => {
    dispatch<BetslipSportsbookNotificationShownAction>({
      type: UI__BETSLIP_SBK_NOTIFICATION_SHOWN,
      payload: {
        label,
      },
    });
  },

  dispatchSportsbookMaxPayoutNotificationUrlClick: (url) => {
    dispatch<BetslipSportsbookMaxPayoutNotificationUrlClickAction>({
      type: UI__BETSLIP_SBK_MAX_PAYOUT_NOTIFICATION_URL_CLICK,
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
