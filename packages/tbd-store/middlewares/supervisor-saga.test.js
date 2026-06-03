import setupSagaMocks from "../saga-jest-setup";
import { NETWORK_STATUS__UPDATE } from "../actions/network-status";
import { getNetworkStatus } from "../state/network-status/network-status-selectors";

const spawnFn = jest.fn(jest.requireActual("redux-saga/effects").spawn);
const cancelFn = jest.fn();

jest.mock("redux-saga/effects", () => ({
  ...jest.requireActual("redux-saga/effects"),
  spawn: spawnFn,
  cancel: cancelFn,
}));

jest.mock("../state/network-status/network-status-selectors", () => ({
  getNetworkStatus: jest.fn(),
}));

jest.mock("../config", () => ({
  getInterval: jest.fn(() => 2000),
}));

const sagaFn = jest.fn();
const id = "ERO";
const OPTIONAL_ACTION = "OPTIONAL_ACTION";

function setup() {
  let saga;

  jest.isolateModules(() => {
    ({ createSupervisor: saga } = require("./supervisor-saga"));
  });

  return setupSagaMocks(() => saga(sagaFn, id, OPTIONAL_ACTION)());
}

describe("supervisorSaga", () => {
  afterEach(jest.clearAllMocks);

  describe("when it intercepts a NETWORK_STATUS__UPDATE action", () => {
    describe("and the payload is ONLINE", () => {
      it("should spawn the sagaFn", async () => {
        const { putActions, stopSaga } = setup();

        await putActions([
          {
            type: NETWORK_STATUS__UPDATE,
            payload: { networkStatus: "ONLINE" },
          },
        ]);

        expect(spawnFn).toHaveBeenCalledWith(sagaFn);

        stopSaga();
      });
    });

    describe("and the payload is OFFLINE", () => {
      it("should cancel the sagaFn", async () => {
        const { putActions, stopSaga } = setup();

        await putActions([
          {
            type: NETWORK_STATUS__UPDATE,
            payload: { networkStatus: "ONLINE" },
          },
          {
            type: NETWORK_STATUS__UPDATE,
            payload: { networkStatus: "OFFLINE" },
          },
        ]);

        expect(cancelFn).toHaveBeenCalled();

        stopSaga();
      });
    });
  });

  describe("when the networkStatus is OFFLINE", () => {
    it("should not spawn the sagaFn", async () => {
      const { putActions, stopSaga } = setup();
      getNetworkStatus.mockReturnValueOnce("OFFLINE");

      await putActions([
        {
          type: OPTIONAL_ACTION,
        },
      ]);

      expect(spawnFn).not.toHaveBeenCalled();

      stopSaga();
    });
  });

  describe("when it the networkStatus is ONLINE", () => {
    let sagaMocks;

    beforeEach(async () => {
      sagaMocks = setup();

      const { putActions } = sagaMocks;

      await putActions([
        {
          type: OPTIONAL_ACTION,
        },
      ]);

      getNetworkStatus.mockReturnValueOnce("ONLINE");
    });

    describe("and intercepts an OPTIONAL_ACTION action", () => {
      it("should spawn the sagaFn", async () => {
        const { stopSaga } = sagaMocks;

        expect(spawnFn).toHaveBeenCalledWith(sagaFn);

        stopSaga();
      });

      it("should not spawn the sagaFn again if the interval is not done", async () => {
        const { putActions, stopSaga } = sagaMocks;

        await putActions(
          [
            {
              type: OPTIONAL_ACTION,
            },
          ],
          1000,
        );

        expect(spawnFn).toHaveBeenCalledTimes(1);

        stopSaga();
      });

      it("should spawn the sagaFn again if the interval is done", async () => {
        const { putActions, stopSaga } = sagaMocks;

        await putActions(
          [
            {
              type: OPTIONAL_ACTION,
            },
          ],
          2001,
        );

        expect(spawnFn).toHaveBeenCalledTimes(2);

        stopSaga();
      });
    });
  });
});
