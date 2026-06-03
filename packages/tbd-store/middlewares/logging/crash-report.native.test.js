import { crashReporter } from "./crash-reporter.native";
import { FETCH_CATALOGUE_FAILURE } from "../../actions/catalogue";
import { PUSH } from "../../actions/router";

function setup(action, nextSpy = jest.fn(), dispatchSpy = jest.fn()) {
  const state = {};
  const store = {
    getState: jest.fn().mockReturnValue(state),
    dispatch: dispatchSpy,
  };

  return crashReporter(store)(nextSpy)(action);
}

describe("Crash Reporter Logging", () => {
  beforeEach(jest.clearAllMocks);

  const error = {
    message: "error",
    stack: "stack",
  };
  const fetchCatalogueFailureAction = {
    type: FETCH_CATALOGUE_FAILURE,
    payload: {
      error,
    },
  };

  describe("when action type is FETCH_CATALOGUE_FAILURE", () => {
    it("should throw an error", () => {
      const errorSpy = jest.spyOn(console, "error").mockImplementation();
      const logSpy = jest.spyOn(console, "log").mockImplementation();

      setup(fetchCatalogueFailureAction);

      expect(errorSpy).toHaveBeenCalledTimes(1);
      expect(errorSpy).toHaveBeenCalledWith(FETCH_CATALOGUE_FAILURE);
      expect(logSpy).toHaveBeenCalledTimes(1);
      expect(logSpy).toHaveBeenCalledWith(fetchCatalogueFailureAction.payload.error.message);

      logSpy.mockRestore();
      errorSpy.mockRestore();
    });
  });

  describe("when action type is PUSH", () => {
    it("should not throw an error", () => {
      expect(() => setup({ type: PUSH })).not.toThrow();
    });
  });
});
