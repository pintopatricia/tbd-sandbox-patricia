import { FETCH_CATALOGUE_SUCCESS, FETCH_CATALOGUE_FAILURE } from "../actions/catalogue";
import { createMaintenanceStatusMiddleware } from "./maintenance-status";

const FULL_SPLASH_PAYLOAD = {
  router: {
    currentView: "ppb:tbd:view:maintenance",
  },
  data: {
    MaintenanceView: [
      {
        redirectUrl: "redirectUrl",
      },
    ],
  },
};

const PARTIAL_SPLASH_PAYLOAD = {
  router: {
    currentView: "ppb:tbd:view:maintenance",
  },
  data: {
    MaintenanceView: [
      {
        redirectUrl: "",
      },
    ],
  },
};

const GENERIC_VIEW_PAYLOAD = {
  router: {
    currentView: "ppb:tbd:view:generic",
  },
};

const callback = jest.fn();

const runMiddleware = (type, payload) => {
  const middleware = createMaintenanceStatusMiddleware(callback);
  middleware({ getState: () => ({}) })(() => null)({
    type,
    payload,
  });
};

describe("create MaintenanceStatus Middleware", () => {
  beforeEach(jest.resetAllMocks);

  describe("when there's a successful catalogue fetch", () => {
    describe("and no maintenance view is returned", () => {
      it("shouldn't call the callback function", () => {
        runMiddleware(FETCH_CATALOGUE_SUCCESS, GENERIC_VIEW_PAYLOAD);
        expect(callback).not.toHaveBeenCalled();
      });
    });

    describe("and a full splash maintenance view is returned", () => {
      it("should call the callback function with the correct params", () => {
        runMiddleware(FETCH_CATALOGUE_SUCCESS, FULL_SPLASH_PAYLOAD);
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(true);
      });
    });

    describe("and a partial splash maintenance view is returned", () => {
      it("should call the callback function with the correct params", () => {
        runMiddleware(FETCH_CATALOGUE_SUCCESS, PARTIAL_SPLASH_PAYLOAD);
        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith(false);
      });
    });
  });

  describe("when there's any other action", () => {
    it("shouldn't call the callback function", () => {
      runMiddleware(FETCH_CATALOGUE_FAILURE, GENERIC_VIEW_PAYLOAD);
      expect(callback).not.toHaveBeenCalled();
    });
  });
});
