import { COMMANDS__INIT } from "../actions/commands";
import { MODULES__SBK_BETTING_LOADED } from "../actions/modules";
import setupSagaMocks from "../saga-jest-setup";
import { CMD_LOAD_SBK_BETSLIP } from "../state";
import { getModules } from "../state/modules/modules-selectors";

jest.mock("../state/modules/modules-selectors", () => ({
  getModules: jest.fn(() => ({
    sbkBetting: false,
  })),
}));

function setupSaga({ commands = [], isBettingModuleLoaded = false }) {
  let saga;

  jest.isolateModules(() => {
    ({ commandsSaga: saga } = require("./commands-saga"));
  });

  getModules.mockReturnValue({
    sbkBetting: isBettingModuleLoaded,
  });

  return setupSagaMocks(() => saga(commands));
}

describe("commandsSaga", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("CMD_LOAD_SBK_BETSLIP", () => {
    describe("when there is no CMD_LOAD_SBK_BETSLIP command", () => {
      function setupNoLoadSbkBetslipCommandScenario() {
        return setupSaga({
          commands: [
            {
              name: "SOME_COMMAND",
            },
          ],
        });
      }
      describe("and betting module is loaded", () => {
        it("should not call URL__BETSLIP_DEEPLINK", () => {
          const { dispatch, stopSaga } = setupNoLoadSbkBetslipCommandScenario();

          expect(dispatch).not.toHaveBeenCalled();

          stopSaga();
        });
      });
      describe("and betting module is not loaded", () => {
        describe("when MODULES__SBK_BETTING_LOADED is dispatched", () => {
          it("should not call URL__BETSLIP_DEEPLINK anyway", () => {
            const { dispatch, stopSaga } = setupNoLoadSbkBetslipCommandScenario({ isBettingModuleLoaded: false });

            expect(dispatch).not.toHaveBeenCalled();

            stopSaga();
          });
        });
      });
    });

    describe("when there is a CMD_LOAD_SBK_BETSLIP command", () => {
      describe("and betting module is not loaded", () => {
        function setupBettingModuleNotLoadedScenario() {
          return setupSaga({
            commands: [
              {
                name: CMD_LOAD_SBK_BETSLIP,
                args: {
                  selections: ["some selection", "some other selection"],
                  isBetSharing: false,
                },
              },
            ],
            isBettingModuleLoaded: false,
          });
        }
        it("should call getModules selector", () => {
          const { stopSaga } = setupBettingModuleNotLoadedScenario();

          expect(getModules).toHaveBeenCalledTimes(1);

          stopSaga();
        });

        it("should not call URL__BETSLIP_DEEPLINK", () => {
          const { dispatch, stopSaga } = setupBettingModuleNotLoadedScenario();

          expect(dispatch).not.toHaveBeenCalled();

          stopSaga();
        });

        describe("when MODULES__SBK_BETTING_LOADED is dispatched", () => {
          it("should call URL__BETSLIP_DEEPLINK when betting module is loaded", async () => {
            const { dispatch, putActions, stopSaga } = setupBettingModuleNotLoadedScenario();

            expect(dispatch).not.toHaveBeenCalled();
            await putActions([
              {
                type: MODULES__SBK_BETTING_LOADED,
              },
            ]);
            expect(dispatch).toHaveBeenCalledWith({
              type: "URL/BETSLIP_DEEPLINK",
              payload: {
                selections: ["some selection", "some other selection"],
                isBetSharing: false,
              },
            });
            expect(dispatch).toHaveBeenCalledTimes(1);

            stopSaga();
          });
        });
      });

      describe("and betting module is loaded", () => {
        function setupBettingModuleLoadedScenario() {
          return setupSaga({
            commands: [
              {
                name: CMD_LOAD_SBK_BETSLIP,
                args: {
                  selections: ["some selection", "some other selection"],
                  isBetSharing: false,
                },
              },
            ],
            isBettingModuleLoaded: true,
          });
        }

        it("should call getModules selector", () => {
          const { stopSaga } = setupBettingModuleLoadedScenario();

          expect(getModules).toHaveBeenCalledTimes(1);

          stopSaga();
        });

        it("should call URL__BETSLIP_DEEPLINK with its payload", () => {
          const { dispatch, stopSaga } = setupBettingModuleLoadedScenario();

          expect(dispatch).toHaveBeenCalledWith({
            type: "URL/BETSLIP_DEEPLINK",
            payload: {
              selections: ["some selection", "some other selection"],
              isBetSharing: false,
            },
          });
          expect(dispatch).toHaveBeenCalledTimes(1);

          stopSaga();
        });
      });
    });
  });

  describe("COMMANDS__INIT", () => {
    function setupCommandsInit() {
      return setupSaga({
        commands: [],
        isBettingModuleLoaded: true,
      });
    }

    it("should call URL__BETSLIP_DEEPLINK with its payload", () => {
      const { dispatch, stopSaga, putActions } = setupCommandsInit();

      putActions([
        {
          type: COMMANDS__INIT,
          payload: [
            {
              name: CMD_LOAD_SBK_BETSLIP,
              args: {
                selections: ["some selection", "some other selection"],
                isBetSharing: false,
              },
            },
          ],
        },
      ]);

      expect(dispatch).toHaveBeenCalledWith({
        type: "URL/BETSLIP_DEEPLINK",
        payload: {
          selections: ["some selection", "some other selection"],
          isBetSharing: false,
        },
      });
      expect(dispatch).toHaveBeenCalledTimes(1);

      stopSaga();
    });
  });
});
