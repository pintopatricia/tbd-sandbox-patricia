import { CMD_LOAD_SBK_BETSLIP } from "../app-commands";

import { buildBootInitialState } from "./boot-initial-state-factory";

describe("buildBootInitialState", () => {
  describe("when appCommands is undefined", () => {
    it("should return INITIAL_STATE and allow load from storage", () => {
      const initialState = buildBootInitialState({ devTools: true });

      expect(initialState).toEqual({
        allowLoadFromStorage: true,
        devTools: true,
      });
    });
  });

  describe("when appCommands is defined but does not contain CMD_LOAD_SBK_BETSLIP", () => {
    it("should return INITIAL_STATE and allow load from storage", () => {
      const initialState = buildBootInitialState({}, [
        {
          name: "SOME_COMMAND",
        },
        {
          name: "ANOTHER_COMMAND",
        },
      ]);

      expect(initialState).toEqual({
        allowLoadFromStorage: true,
      });
    });
  });

  describe("when appCommands is defined and contains CMD_LOAD_SBK_BETSLIP", () => {
    it("should return INITIAL_STATE and NOT allow load from storage", () => {
      const initialState = buildBootInitialState({}, [
        {
          name: "SOME_COMMAND",
        },
        {
          name: CMD_LOAD_SBK_BETSLIP,
        },
        {
          name: "ANOTHER_COMMAND",
        },
      ]);

      expect(initialState).toEqual({
        allowLoadFromStorage: false,
      });
    });
  });
});
