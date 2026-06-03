import { MapStateToPropsFactory, MapDispatchToProps } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import {
  LOYALTY__ACKNOWLEDGE_MESSAGE,
  LOYALTY__DISMISS_MESSAGE,
  AcknowledgeLoyaltyMessageAction,
  DismissLoyaltyMessageAction,
} from "@ppb/tbd-store/actions/loyalty-messaging";
import { LoyaltyMessage } from "@ppb/tbd-store/state/entities/loyalty-messaging/LoyaltyMessaging.types";
import { TopicMessage } from "@ppb/onsite-gateway-client";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { EXTERNAL_PUSH, ExternalPushAction } from "@ppb/tbd-store/actions/router";
import { APP_VISIBILITY_CHANGE, AppVisibilityChangeAction } from "@ppb/tbd-store/actions/interface";

const dispatchExternalPushAction = (viewUrl: string): ExternalPushAction => ({
  type: EXTERNAL_PUSH,
  payload: {
    viewUrn: "",
    viewUrl,
  },
});

export type ContainerProps = {
  basePath?: string;
};

export type StateProps = {
  message?: LoyaltyMessage;
  userDetails?: UserDetails;
};

export const dispatchAcknowledgeMessage = (message: TopicMessage): AcknowledgeLoyaltyMessageAction => ({
  type: LOYALTY__ACKNOWLEDGE_MESSAGE,
  payload: message,
});

export const dispatchDismissMessage = (message: TopicMessage): DismissLoyaltyMessageAction => ({
  type: LOYALTY__DISMISS_MESSAGE,
  payload: message,
});

export const dispatchAppVisibilityChange = (visible: boolean): AppVisibilityChangeAction => ({
  type: APP_VISIBILITY_CHANGE,
  payload: { visible },
});

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, {}, ApplicationState> =
  () =>
  (state: ApplicationState): StateProps => {
    try {
      const { messages } = state.entities.loyaltyMessages;
      const message = messages.find((stackedMessage: LoyaltyMessage) => stackedMessage.isDisplayed);
      const userDetails = <UserDetails>getUserDetails(state);

      return {
        message,
        userDetails,
      };
    } catch (e) {
      console.error(e);
      return {};
    }
  };

export type DispatchProps = {
  dispatchAcknowledgeMessage: typeof dispatchAcknowledgeMessage;
  dispatchAppVisibilityChange?: typeof dispatchAppVisibilityChange;
  dispatchExternalPushAction?: typeof dispatchExternalPushAction;
  dispatchDismissMessage: typeof dispatchDismissMessage;
};

export const mapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = {
  dispatchAcknowledgeMessage,
  dispatchExternalPushAction,
  dispatchDismissMessage,
};
