import { crashReporter } from "./crash-reporter.web";
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

  const error = new Error("Test");
  const fetchCatalogueFailureAction = {
    type: FETCH_CATALOGUE_FAILURE,
    payload: { error },
  };

  describe("when action type is FETCH_CATALOGUE_FAILURE", () => {
    it("should throw an error", () => {
      expect(() => setup(fetchCatalogueFailureAction)).toThrow("Test");
    });
  });

  describe("when action type is PUSH", () => {
    it("should not throw an error", () => {
      expect(() => setup({ type: PUSH })).not.toThrow();
    });
  });
});
