import { createSelector, Selector } from "reselect";
import { WebMessage, WebMessages } from "./WebMessages.types";

export const createGetCurrentWebMessageIndexSelector = (): Selector<WebMessages, number | null> =>
  createSelector(
    [(webMessages: WebMessages) => webMessages],
    (webMessages): number | null => webMessages.currentWebMessageIndex,
  );

export const createGetWebMessagesListSelector = (): Selector<WebMessages, WebMessage[] | null> =>
  createSelector(
    [(webMessages: WebMessages) => webMessages],
    (webMessages): WebMessage[] | null => webMessages.webMessagesList,
  );
