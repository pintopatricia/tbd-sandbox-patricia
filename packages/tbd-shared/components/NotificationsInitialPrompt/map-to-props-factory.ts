import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import {
  PNNativePromptShownAction,
  PNRegisterDeviceAction,
  PN_NATIVE_PROMPT_SHOWN_EVENT,
  PNInteraction,
  PN_INTERACTION_EVENT,
  PN_REGISTER_DEVICE,
} from "@ppb/tbd-store/actions/push-notifications";
import { RegisterOptions } from "@ppb/tbd-store/state/entities/notifications/Notifications";
import { i18n } from "../../helpers/i18n";

export type ContainerProps = {};

export type CardProps = {
  isLoggedIn: boolean;
  titleLabel: string;
  descriptionLabel: string;
  acceptLabel: string;
  rejectLabel: string;
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getCountryLocalCurrencyCodeSelector = createGetCountryLocalCurrencyCodeSelector();

  return function mapStateToProps(state: ApplicationState): StateProps {
    try {
      const { loggedIn } = getCountryLocalCurrencyCodeSelector(state);

      return {
        isLoggedIn: loggedIn,
        titleLabel: i18n({ key: "I18N.PROMPT.FIRST_LOGIN_LABEL" }),
        descriptionLabel: i18n({ key: "I18N.PROMPT.FIRST_LOGIN_DESCRIPTION" }),
        acceptLabel: i18n({ key: "I18N.PROMPT.FIRST_LOGIN_ACCEPT" }),
        rejectLabel: i18n({ key: "I18N.PROMPT.FIRST_LOGIN_REJECT" }),
      };
    } catch (e) {
      console.error(e);

      return {};
    }
  };
};

const dispatchRegisterDevice = (
  applicationTypeId: string,
  deviceId: string,
  deviceOptions: RegisterOptions,
): PNRegisterDeviceAction => ({
  type: PN_REGISTER_DEVICE,
  payload: {
    applicationTypeId,
    deviceId,
    deviceOptions,
  },
});

const dispatchNativePromptShown = (): PNNativePromptShownAction => ({
  type: PN_NATIVE_PROMPT_SHOWN_EVENT,
});

const dispatchPushNotificationEvent = (label: string, module: string): PNInteraction => ({
  type: PN_INTERACTION_EVENT,
  payload: {
    label,
    module,
  },
});

export type DispatchProps = {
  dispatchRegisterDevice: typeof dispatchRegisterDevice;
  dispatchNativePromptShown: typeof dispatchNativePromptShown;
  dispatchPushNotificationEvent: typeof dispatchPushNotificationEvent;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchRegisterDevice,
  dispatchNativePromptShown,
  dispatchPushNotificationEvent,
};
