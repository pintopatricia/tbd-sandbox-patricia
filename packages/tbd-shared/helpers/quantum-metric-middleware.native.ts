import { Dispatch, Middleware } from "redux";
import { QuantumMetricLibrary } from "react-native-quantum-metric-library";
import {
  QUANTUM_METRIC__INIT,
  QuantumMetricInitAction,
  QuantumMetricSendNewPageNamedAction,
  QUANTUM_METRIC__SEND_NEW_PAGE_NAMED,
} from "@ppb/tbd-store/actions/quantum-metric";
import { isCurrentEnv } from "../config/base-path-utils.native";
import { Environment } from "../config/environments.native";

type ActionTypes = QuantumMetricInitAction | QuantumMetricSendNewPageNamedAction;

let isInitialized = false;

export const quantumMetricMiddleware: Middleware = () => (next: Dispatch<ActionTypes>) => (action: ActionTypes) => {
  switch (action.type) {
    case QUANTUM_METRIC__INIT:
      if (!isInitialized) {
        const isTestingEnv = isCurrentEnv(Environment.mockserver);
        if (!__DEV__ && !isTestingEnv) {
          const {
            payload: { subscription, uid },
          } = action;
          QuantumMetricLibrary.initialize(subscription, uid);
          isInitialized = true;
        }
      }
      break;
    case QUANTUM_METRIC__SEND_NEW_PAGE_NAMED:
      if (isInitialized) {
        const {
          payload: { pageName },
        } = action;
        QuantumMetricLibrary.sendNewPageNamed(pageName);
      }
      break;
    default:
      break;
  }
  return next(action);
};
