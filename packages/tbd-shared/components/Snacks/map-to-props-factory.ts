import type { MapStateToPropsFactory } from "react-redux";
import { createSelector, type Selector } from "reselect";

import { UI__MESSAGING_REMOVE, type MessagingUIRemove } from "@ppb/tbd-store/actions/messaging";
import type { ApplicationState, Message, Messages } from "@ppb/tbd-store/state";
import { getBetslipVisibilityState } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import type { Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import { getIcon } from "../../helpers/icon";

export type ContainerProps = {};

type SnackMessage = Message & {
  icon?: Icons;
};

export type StateProps = {
  messages: SnackMessage[];
  messagesByTypeOrder?: Messages["messagesByTypeOrder"];
  withBetslipCollapsed?: boolean;
};

const createGetMessagesSelector = (): Selector<Messages, SnackMessage[]> =>
  createSelector([(messages: Messages): Messages => messages], (messages): SnackMessage[] => {
    const snackMessages: SnackMessage[] = [];

    messages.messagesByTypeOrder.forEach((code): void => {
      const message = messages[code];

      if (message) {
        snackMessages.push({
          ...message,
          icon: getIcon(message.icon),
        });
      }
    });

    return snackMessages;
  });

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getMessages = createGetMessagesSelector();

  return (state: ApplicationState): StateProps => {
    const messagesState = state.entities.messages;

    return {
      messages: getMessages(messagesState),
      messagesByTypeOrder: messagesState.messagesByTypeOrder,
      withBetslipCollapsed: getBetslipVisibilityState(state),
    };
  };
};

const dispatchOnClose = (code: number): MessagingUIRemove => ({
  type: UI__MESSAGING_REMOVE,
  payload: { code },
});

export type DispatchProps = {
  dispatchOnClose: typeof dispatchOnClose;
};

export const mapDispatchToProps: DispatchProps = { dispatchOnClose };
