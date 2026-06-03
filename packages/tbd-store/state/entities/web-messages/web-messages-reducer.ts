import { WebMessage, WebMessagesState } from "./WebMessages.types";
import {
  WEB_MESSAGES_MODULE_LOADED,
  FETCH_WEB_MESSAGES_SUCCESS,
  FetchWebMessagesSuccessAction,
  READ_WEB_MESSAGE_FAILURE,
  READ_WEB_MESSAGE_SUCCESS,
  ReadWebMessageFailureAction,
  ReadWebMessageSuccessAction,
  WebMessagesModuleLoadedAction,
} from "../../../actions/catalogue";
import { WebMessage as WebMessageCatalogue } from "../../../clients/catalogue/catalogue-response-types";

type ActionTypes =
  | FetchWebMessagesSuccessAction
  | ReadWebMessageSuccessAction
  | ReadWebMessageFailureAction
  | WebMessagesModuleLoadedAction;

function isNotNullOrUndefined<T>(value: null | undefined | T): value is T {
  return value !== null && value !== undefined;
}

const mapToStandardMessage = (message: WebMessageCatalogue): WebMessage => ({
  urn: message.urn,
  title: message.content.title ? message.content.title : undefined,
  templateHeight: message.content.templateHeight ? message.content.templateHeight : undefined,
  templateWidth: message.content.templateWidth ? message.content.templateWidth : undefined,
  templateUrl: message.content.templateUrl ? message.content.templateUrl : undefined,
});

const INITIAL_STATE = { webMessagesList: null, currentWebMessageIndex: null, isModuleLoaded: false };

export default (currentState: undefined | WebMessagesState, action: ActionTypes): WebMessagesState => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case WEB_MESSAGES_MODULE_LOADED:
      return { ...state, isModuleLoaded: true };
    case FETCH_WEB_MESSAGES_SUCCESS: {
      const webMessages = action.payload.MarketingMessages.filter((element): element is WebMessageCatalogue =>
        isNotNullOrUndefined(element),
      );
      const webMessagesList = webMessages.map((element) => mapToStandardMessage(element));
      return {
        ...state,
        webMessagesList,
        currentWebMessageIndex: 0,
      };
    }
    case READ_WEB_MESSAGE_SUCCESS: {
      if (state.webMessagesList && isNotNullOrUndefined(state.currentWebMessageIndex)) {
        if (state.currentWebMessageIndex < state.webMessagesList.length - 1) {
          return { ...state, currentWebMessageIndex: state.currentWebMessageIndex + 1 };
        }
        return { ...state, currentWebMessageIndex: null };
      }
      return state;
    }
    case READ_WEB_MESSAGE_FAILURE: {
      return { ...state, currentWebMessageIndex: null };
    }
    default:
      return state;
  }
};
