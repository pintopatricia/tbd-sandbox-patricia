import setupSagaMocks from "../saga-jest-setup";
import catalogueService from "../services/catalogue/catalogue-service";
import { EXPAND_RACE_RUNNER } from "../actions/racerunner";

const OVERRIDEN_THROTTLES = {
  throttlesOn: ["1", "2"],
  throttlesOff: ["3"],
};

jest.mock("../state/entities/throttles/throttles-selectors", () => ({
  getOverridenThrottles: jest.fn(() => OVERRIDEN_THROTTLES),
}));

function setup() {
  let saga;
  jest.isolateModules(() => {
    ({ raceRunnerSaga: saga } = require("./race-runner-saga"));
  });
  const setupSaga = setupSagaMocks(saga);

  setupSaga.getState.mockReturnValue({ entities: {} });

  return setupSaga;
}

jest.mock("../services/catalogue/catalogue-service", () => ({
  getRaceRunnersPastPerformances: jest.fn(() => "race runners"),
}));

describe("fetchRaceRunnerSaga", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("when EXPAND_RACE_RUNNER is dispatched", () => {
    describe("on success", () => {
      it("should call getRaceRunnersPastPerformances with the correct arguments", async () => {
        const { putActions, stopSaga, getState } = setup();

        getState.mockReturnValue({ entities: { racerunners: { urn: { horse: {} } } } });

        const action = { type: EXPAND_RACE_RUNNER, payload: ["urn"] };

        await putActions([action]);

        expect(catalogueService.getRaceRunnersPastPerformances).toHaveBeenCalledWith(["urn"], OVERRIDEN_THROTTLES);

        stopSaga();
      });

      it("should dispatch NETWORK/FETCH_RACE_RUNNER_PAST_PERFORMANCES_SUCCESS action", async () => {
        const { putActions, stopSaga, dispatch, getState } = setup();

        getState.mockReturnValue({ entities: { racerunners: { urn: { horse: {} } } } });

        const action = { type: EXPAND_RACE_RUNNER, payload: ["urn"] };

        await putActions([action]);

        expect(dispatch).toHaveBeenCalledWith({
          payload: "race runners",
          type: "NETWORK/FETCH_RACE_RUNNER_PAST_PERFORMANCES_SUCCESS",
        });

        stopSaga();
      });

      it("should ignore racerunners URNs with already fetched pastPerformances", async () => {
        const { putActions, stopSaga, dispatch, getState } = setup();

        getState.mockReturnValue({
          entities: {
            racerunners: {
              urn: { horse: {} },
              alreadyFecthedUrn: { horse: { pastPerformances: [] } },
            },
          },
        });

        const action = { type: EXPAND_RACE_RUNNER, payload: ["urn", "alreadyFecthedUrn"] };

        await putActions([action]);

        expect(dispatch).toHaveBeenCalledWith({
          payload: "race runners",
          type: "NETWORK/FETCH_RACE_RUNNER_PAST_PERFORMANCES_SUCCESS",
        });

        expect(catalogueService.getRaceRunnersPastPerformances).toHaveBeenCalledWith(["urn"], OVERRIDEN_THROTTLES);

        stopSaga();
      });
    });

    describe("when all urns on payload already have pastPerformances stored", () => {
      it("should not call catalogue getRaceRunnersPastPerformances neither dispatch any FETCH CATALOGUE ACTION", async () => {
        const { putActions, stopSaga, dispatch, getState } = setup();

        getState.mockReturnValue({
          entities: {
            racerunners: {
              alreadyFecthedUrn: { horse: { pastPerformances: [] } },
              alreadyFecthedUrn1: { horse: { pastPerformances: [] } },
            },
          },
        });

        const action = { type: EXPAND_RACE_RUNNER, payload: ["alreadyFecthedUrn", "alreadyFecthedUrn1"] };

        await putActions([action]);

        expect(dispatch).not.toHaveBeenCalled();

        expect(catalogueService.getRaceRunnersPastPerformances).not.toHaveBeenCalled();

        stopSaga();
      });
    });

    describe("on error", () => {
      describe("and error is instance of Error", () => {
        it("should dispatch NETWORK/FETCH_RACE_RUNNER_PAST_PERFORMANCES_FAILURE action", async () => {
          const { putActions, stopSaga, dispatch, getState } = setup();

          getState.mockReturnValue({ entities: { racerunners: { urn: { horse: {} } } } });

          catalogueService.getRaceRunnersPastPerformances.mockImplementationOnce(() => {
            throw new Error("Error message");
          });

          const action = { type: EXPAND_RACE_RUNNER, payload: ["urn"] };

          await putActions([action]);

          expect(dispatch).toHaveBeenCalledWith({
            error: "Error message",
            type: "NETWORK/FETCH_RACE_RUNNER_PAST_PERFORMANCES_FAILURE",
          });

          stopSaga();
        });
      });

      describe("and error is not instance of Error", () => {
        it("should dispatch NETWORK/FETCH_RACE_RUNNER_PAST_PERFORMANCES_FAILURE action", async () => {
          const { putActions, stopSaga, dispatch, getState } = setup();

          getState.mockReturnValue({ entities: { racerunners: { urn: { horse: {} } } } });

          catalogueService.getRaceRunnersPastPerformances.mockImplementationOnce(() => {
            // eslint-disable-next-line no-throw-literal
            throw "*shrug*";
          });

          const action = { type: EXPAND_RACE_RUNNER, payload: ["urn"] };

          await putActions([action]);

          expect(dispatch).toHaveBeenCalledWith({
            error: "Unknown error *shrug*",
            type: "NETWORK/FETCH_RACE_RUNNER_PAST_PERFORMANCES_FAILURE",
          });

          stopSaga();
        });
      });
    });
  });
});
