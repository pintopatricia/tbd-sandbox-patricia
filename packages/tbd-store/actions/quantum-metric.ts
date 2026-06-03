export const QUANTUM_METRIC__INIT = "QUANTUM_METRIC/INIT";
export const QUANTUM_METRIC__SEND_NEW_PAGE_NAMED = "QUANTUM_METRIC/SEND_NEW_PAGE_NAMED";

export type QuantumMetricInitPayload = {
  subscription: string;
  uid: string;
};

export type QuantumMetricInitAction = {
  type: typeof QUANTUM_METRIC__INIT;
  payload: QuantumMetricInitPayload;
};

export type QuantumMetricSendNewPageNamedAction = {
  type: typeof QUANTUM_METRIC__SEND_NEW_PAGE_NAMED;
  payload: {
    pageName: string;
  };
};
