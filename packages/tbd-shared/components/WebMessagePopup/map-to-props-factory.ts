import {
  FETCH_WEB_MESSAGES,
  FetchWebMessagesAction,
  READ_WEB_MESSAGE,
  ReadWebMessageAction,
} from "@ppb/tbd-store/actions/catalogue";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import {
  createGetWebMessagesListSelector,
  createGetCurrentWebMessageIndexSelector,
} from "@ppb/tbd-store/state/entities/web-messages/web-messages-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { UserDetails, WebMessage } from "@ppb/tbd-store/state/entities";
import { MapStateToPropsFactory } from "react-redux";
import { getEndpoint } from "../../config/endpoints";

function isNotNull<T>(it: T): it is NonNullable<T> {
  return it !== null;
}

const buildTemplateUrl = (url: string, endpoint: string): string => new URL(url, endpoint).toString();

type CardProps = { webMessage: WebMessage | null; loggedIn: boolean | null };
export type StateProps = CardProps | Record<string, never>;
export type ContainerProps = {};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const wmsEndpoint = getEndpoint("WMS");
  const getWebMessagesList = createGetWebMessagesListSelector();
  const getCurrentWebMessageIndex = createGetCurrentWebMessageIndexSelector();

  return function mapStateToProps(state: ApplicationState): StateProps {
    try {
      const webMessagesList = getWebMessagesList(state.entities.webMessages);
      const userDetails = <UserDetails>getUserDetails(state);
      const currentWebMessageIndex = getCurrentWebMessageIndex(state.entities.webMessages);
      let webMessage =
        isNotNull(currentWebMessageIndex) && webMessagesList && webMessagesList.length > 0
          ? webMessagesList[currentWebMessageIndex]
          : null;

      if (isNotNull(webMessage) && webMessage.templateUrl) {
        webMessage = { ...webMessage, templateUrl: buildTemplateUrl(webMessage.templateUrl, wmsEndpoint) };
      }

      return {
        webMessage,
        loggedIn: userDetails?.loggedIn,
      };
    } catch (e) {
      console.error(e);

      return {};
    }
  };
};

const dispatchFetchWebMessages = (loggedIn?: boolean | null): FetchWebMessagesAction => ({
  type: FETCH_WEB_MESSAGES,
  payload: { postLoginSession: loggedIn || window?.__POST_LOGIN_SESSION__ },
});

const dispatchReadWebMessage = (customerMessageId: string): ReadWebMessageAction => ({
  type: READ_WEB_MESSAGE,
  payload: { customerMessageId },
});

export type DispatchProps = {
  dispatchFetchWebMessages: typeof dispatchFetchWebMessages;
  dispatchReadWebMessage: typeof dispatchReadWebMessage;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchFetchWebMessages,
  dispatchReadWebMessage,
};
