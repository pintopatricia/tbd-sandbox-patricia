import { FETCH_CATALOGUE_SUCCESS, FETCH_CATALOGUE_FAILURE } from "@ppb/tbd-store/actions/catalogue";
import { navigate } from "@ppb/tbd-router/native";
import { createUrnMiddleware } from "./urn-middleware.native";

jest.mock("@ppb/tbd-router/native", () => ({
  navigate: jest.fn(() => {}),
  NativeEntityTypes: {
    Home: "ppb:tbd:view:generic:home",
  },
}));

jest.mock("../config/app-configuration.native", () => ({
  deeplinkConfiguration: {
    gameLaunchURLPattern: "launcherPattern",
  },
}));

const GENERIC_VIEW_PAYLOAD = {
  router: {
    currentUrn: "ppb:tbd:view:generic",
    currentUrl: "generic-url",
  },
};

const runMiddleware = (action) => {
  const store = {
    getState: jest.fn(() => ({
      router: {
        currentUrn: "ppb:tbd:view:generic:home",
      },
    })),
  };

  const middleware = createUrnMiddleware(() => {});
  middleware(store)(() => null)(action);
};

describe("create URN Middleware", () => {
  beforeEach(jest.resetAllMocks);

  describe("when there's a successful catalogue fetch", () => {
    describe("and requested URNs not includes the current URN", () => {
      it("shouldn't call the navigate function", () => {
        runMiddleware({
          type: FETCH_CATALOGUE_SUCCESS,
          payload: { ...GENERIC_VIEW_PAYLOAD, requestedUrns: ["ppb:tbd:view:generic"] },
        });
        expect(navigate).not.toHaveBeenCalled();
      });
    });

    describe("and requested URNs includes the current URN", () => {
      it("should call the navigate function", () => {
        runMiddleware({
          type: FETCH_CATALOGUE_SUCCESS,
          payload: { ...GENERIC_VIEW_PAYLOAD, requestedUrns: ["ppb:tbd:view:other"] },
        });
        expect(navigate).toHaveBeenCalledWith({
          viewUrl: "generic-url",
          viewUrn: "ppb:tbd:view:generic",
        });
      });
    });

    describe("and the current view is a maintenance view", () => {
      beforeEach(() => {
        runMiddleware({
          type: FETCH_CATALOGUE_SUCCESS,
          payload: {
            router: {
              currentView: "ppb:tbd:view:maintenance",
            },
          },
        });
      });

      it("shouldn't call the navigate function", () => {
        expect(navigate).not.toHaveBeenCalled();
      });
    });
  });

  describe("when there's a random action type", () => {
    it("shouldn't call the navigate function", () => {
      runMiddleware({
        type: FETCH_CATALOGUE_FAILURE,
        payload: { ...GENERIC_VIEW_PAYLOAD, requestedUrns: ["ppb:tbd:view:other"] },
      });
      expect(navigate).not.toHaveBeenCalled();
    });
  });
});
