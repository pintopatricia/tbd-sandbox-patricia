import { Middleware } from "redux";

import { PUSH, PushAction, PUSH_SAME_VIEW, PushSameViewAction } from "../actions";
import { BETTING__SBK_ADD_SELECTIONS, BettingSportsbookAddSelectionAction } from "../actions/betting";
import {
  CommandsInitAction,
  COMMANDS__INIT,
  URL__BETSLIP_DEEPLINK,
  URLBetslipDeeplinkAction,
} from "../actions/commands";
import { resolveAppCommands } from "../modules/commands-resolver";
import { ApplicationState } from "../state";

type ActionTypes = PushAction | PushSameViewAction | URLBetslipDeeplinkAction;

export const commandsMiddleware: Middleware<Record<string, never>, ApplicationState> =
  ({ dispatch }) =>
  (next) =>
  (action: ActionTypes) => {
    switch (action.type) {
      case PUSH:
      case PUSH_SAME_VIEW: {
        const appCommands = resolveAppCommands(() => {
          // eslint-disable-next-line no-console
          console.error("Error resolving app commands", action.payload.viewUrl);
        }, action.payload.viewUrl);

        if (appCommands) {
          dispatch<CommandsInitAction>({
            type: COMMANDS__INIT,
            payload: appCommands,
          });
        }
        break;
      }

      case URL__BETSLIP_DEEPLINK: {
        dispatch<BettingSportsbookAddSelectionAction>({
          type: BETTING__SBK_ADD_SELECTIONS,
          payload: {
            selections: action.payload.selections,
            group: "REAL",
            deeplink: {
              isBetSharing: action.payload.isBetSharing,
            },
          },
        });
        break;
      }
      default:
        break;
    }

    return next(action);
  };
