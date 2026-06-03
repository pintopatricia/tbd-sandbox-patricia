import { NETWORK__REALITY_CHECK_ALERT } from "@ppb/tbd-store/actions/notification";

import { dispatchRealityCheckAlert } from "./reality-check-alert";

const mockStore = {
  dispatch: jest.fn(),
};

jest.mock("@ppb/tbd-store/create-store", () => ({
  getStore: jest.fn(() => mockStore),
}));

describe("Reality Check Alert", () => {
  beforeEach(jest.clearAllMocks);

  describe("when the value is a positive number", () => {
    it("should dispatch reality check action with the correct payload", () => {
      dispatchRealityCheckAlert(60);

      expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
      expect(mockStore.dispatch).toHaveBeenCalledWith({
        type: NETWORK__REALITY_CHECK_ALERT,
        payload: {
          duration: 60,
        },
      });
    });
  });

  describe("when the value is a string with a positive number", () => {
    it("should dispatch reality check action with the correct payload", () => {
      dispatchRealityCheckAlert("60");

      expect(mockStore.dispatch).toHaveBeenCalledTimes(1);
      expect(mockStore.dispatch).toHaveBeenCalledWith({
        type: NETWORK__REALITY_CHECK_ALERT,
        payload: {
          duration: 60,
        },
      });
    });
  });

  describe("when the value is not a number", () => {
    it("should not dispatch action", () => {
      dispatchRealityCheckAlert("60minutes");

      expect(mockStore.dispatch).not.toHaveBeenCalled();
    });
  });

  describe("when the value is 0", () => {
    it("should not dispatch action", () => {
      dispatchRealityCheckAlert(0);

      expect(mockStore.dispatch).not.toHaveBeenCalled();
    });
  });

  describe("when the value is a negative number", () => {
    it("should not dispatch action", () => {
      dispatchRealityCheckAlert(-10);

      expect(mockStore.dispatch).not.toHaveBeenCalled();
    });
  });

  describe("when the value is not an integer", () => {
    it("should not dispatch action", () => {
      dispatchRealityCheckAlert(10.5);

      expect(mockStore.dispatch).not.toHaveBeenCalled();
    });
  });

  describe("when the value is undefined", () => {
    it("should not dispatch action", () => {
      dispatchRealityCheckAlert(undefined);

      expect(mockStore.dispatch).not.toHaveBeenCalled();
    });
  });

  describe("when the value is an object", () => {
    it("should not dispatch action", () => {
      dispatchRealityCheckAlert({ timeSpent: 60 });

      expect(mockStore.dispatch).not.toHaveBeenCalled();
    });
  });

  describe("when the value is a function", () => {
    it("should not dispatch action", () => {
      dispatchRealityCheckAlert(jest.fn());

      expect(mockStore.dispatch).not.toHaveBeenCalled();
    });
  });

  describe("when the value is a boolean", () => {
    it("should not dispatch action", () => {
      dispatchRealityCheckAlert(true);

      expect(mockStore.dispatch).not.toHaveBeenCalled();
    });
  });
});
