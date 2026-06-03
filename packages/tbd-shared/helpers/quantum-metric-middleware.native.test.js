import { QuantumMetricLibrary } from "react-native-quantum-metric-library";
import { QUANTUM_METRIC__INIT, QUANTUM_METRIC__SEND_NEW_PAGE_NAMED } from "@ppb/tbd-store/actions/quantum-metric";
import { isCurrentEnv } from "../config/base-path-utils.native";
import { quantumMetricMiddleware } from "./quantum-metric-middleware.native";

jest.mock("../config/base-path-utils.native", () => ({
  isCurrentEnv: jest.fn(),
}));

jest.mock("react-native-quantum-metric-library", () => ({
  QuantumMetricLibrary: {
    sendNewPageNamed: jest.fn(),
    initialize: jest.fn(),
  },
}));

function setupStoreFn(dispatchSpy = jest.fn(), getStateSpy = jest.fn()) {
  return {
    dispatch: dispatchSpy,
    getState: getStateSpy,
  };
}

describe("quantum metric middleware", () => {
  let nextSpy;
  const sendPageAction = {
    type: QUANTUM_METRIC__SEND_NEW_PAGE_NAMED,
    payload: {
      pageName: "viewUrn",
    },
  };
  const initAction = {
    type: QUANTUM_METRIC__INIT,
    payload: {
      subscription: "betfair",
      uid: "uidKey",
    },
  };
  beforeEach(() => {
    jest.resetAllMocks();

    nextSpy = jest.fn();
  });
  describe("when quantum metric is not initialized yet", () => {
    describe("when action type is QUANTUM_METRIC__SEND_NEW_PAGE_NAMED", () => {
      it("should not send new page named", async () => {
        await quantumMetricMiddleware(setupStoreFn())(nextSpy)(sendPageAction);
        expect(QuantumMetricLibrary.sendNewPageNamed).not.toHaveBeenCalled();
      });
    });

    describe("when action type is QUANTUM_METRIC__INIT", () => {
      describe("when is test environment", () => {
        beforeEach(() => {
          // eslint-disable-next-line no-undef
          __DEV__ = false;
          isCurrentEnv.mockImplementation((env) => env === "mockserver");
        });
        it("should not initialize quantum metric", async () => {
          await quantumMetricMiddleware(setupStoreFn())(nextSpy)(initAction);
          expect(QuantumMetricLibrary.initialize).not.toHaveBeenCalled();
        });
      });

      describe("when DEV mode is true", () => {
        beforeEach(() => {
          // eslint-disable-next-line no-undef
          __DEV__ = true;
          isCurrentEnv.mockImplementation((env) => env !== "mockserver");
        });
        it("should not initialize quantum metric", async () => {
          await quantumMetricMiddleware(setupStoreFn())(nextSpy)(initAction);
          expect(QuantumMetricLibrary.initialize).not.toHaveBeenCalled();
        });
      });

      describe("when DEV mode and test environment are false", () => {
        beforeEach(() => {
          // eslint-disable-next-line no-undef
          __DEV__ = false;
          isCurrentEnv.mockImplementation((env) => env !== "mockserver");
        });

        it("should initialize quantum metric", async () => {
          await quantumMetricMiddleware(setupStoreFn())(nextSpy)(initAction);
          expect(QuantumMetricLibrary.initialize).toHaveBeenCalledTimes(1);
          expect(QuantumMetricLibrary.initialize).toHaveBeenCalledWith("betfair", "uidKey");
        });
      });
    });
  });

  describe("when quantum metric is already initialized", () => {
    describe("when action type is QUANTUM_METRIC__SEND_NEW_PAGE_NAMED", () => {
      it("should send new page named", async () => {
        await quantumMetricMiddleware(setupStoreFn())(nextSpy)(sendPageAction);
        expect(QuantumMetricLibrary.sendNewPageNamed).toHaveBeenCalledTimes(1);
        expect(QuantumMetricLibrary.sendNewPageNamed).toHaveBeenCalledWith("viewUrn");
      });
    });

    describe("when action type is QUANTUM_METRIC__INIT", () => {
      it("should not initialize quantum metric", async () => {
        await quantumMetricMiddleware(setupStoreFn())(nextSpy)(initAction);
        expect(QuantumMetricLibrary.initialize).not.toHaveBeenCalled();
      });
    });
  });

  describe("when action type is not related to quantum metric", () => {
    const unknownAction = {
      type: "unknownActionType",
      payload: "somePayload",
    };
    it("should next the action", async () => {
      await quantumMetricMiddleware(setupStoreFn())(nextSpy)(unknownAction);
      expect(nextSpy).toHaveBeenCalledTimes(1);
      expect(nextSpy).toHaveBeenCalledWith({ type: "unknownActionType", payload: "somePayload" });
    });
  });
});
