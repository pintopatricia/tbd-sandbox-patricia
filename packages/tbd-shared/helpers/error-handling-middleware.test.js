import { HttpResponseError } from "@flutter-global/uki-channels-http-clients";

import { FETCH_CATALOGUE_FAILURE, FETCH_CATALOGUE_EMPTY_VIEW_FAILURE } from "@ppb/tbd-store";
import {
  NETWORK__FETCH_APP_CONTEXT_FAILURE,
  NETWORK__FETCH_APP_CONTEXT_TERRITORY_BLOCKING,
} from "@ppb/tbd-store/actions/app-context";
import {
  goBack,
  navigateWithThirdPartyScreenName,
  navigateTerritoryBlockingScreen,
  ScreenName,
} from "@ppb/tbd-router/native";
import { ERROR_VIEW__ADD } from "@ppb/tbd-store/actions/error";
import { ErrorType } from "@ppb/tbd-store/state/network-status/Errors";
import { getBasePath } from "../config/base-path-utils.native";

jest.mock("react-native", () => ({
  Platform: { OS: "android" },
}));

import { createErrorHandlingMiddleware } from "./error-handling-middleware";

jest.mock("../config/base-path-utils.native", () => ({
  getBasePath: jest.fn(() => "base-path"),
  APP_CONTEXT_DEFAULT_PATH: "/defaultPath",
  getCatalogueDefaultPath: jest.fn(() => "/bff-gql/v11"),
  CATALOGUE_LATEST_PATH: "/bff-gql/latest",
  APP_ENVIRONMENT_DEFAULT_PATH: "/app-env",
}));

jest.mock("../config/app-configuration.native", () => ({
  helpCenterUrls: {
    en: "https://support.betfair.com/",
  },
}));

jest.mock("@ppb/tbd-router/native", () => ({
  navigationRef: { isReady: jest.fn(() => true) },
  goBack: jest.fn(),
  navigateWithThirdPartyScreenName: jest.fn(),
  navigateTerritoryBlockingScreen: jest.fn(),
  ScreenName: {
    ErrorScreen: "ErrorScreen",
    RootErrorScreen: "RootErrorScreen",
  },
  NativeEntityTypes: {
    Error: "ppb:tbd:view:error",
  },
}));

const dispatchSpy = jest.fn();

function setup({
  dispatch = dispatchSpy,
  nextSpy = jest.fn(),
  action = { type: "some action", payload: "some payload" },
  state = {},
} = {}) {
  return createErrorHandlingMiddleware({
    getState: () => state,
    dispatch,
  })(nextSpy)(action);
}

describe("create ErrorHandling Middleware", () => {
  beforeEach(jest.clearAllMocks);

  describe("when action type is FETCH_CATALOGUE_FAILURE", () => {
    describe("and is a general error", () => {
      beforeEach(() => {
        jest.clearAllMocks();
        setup({ action: { type: FETCH_CATALOGUE_FAILURE, payload: { error: {} } } });
      });

      it("should call getBasePath", () => {
        expect(getBasePath).toHaveBeenCalledTimes(1);
      });

      it("should dispatch error view add action", () => {
        expect(dispatchSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledWith({
          type: ERROR_VIEW__ADD,
          payload: {
            urn: "ppb:tbd:view:error",
            errorType: ErrorType.FAILED_REQUEST,
            helpCenterUrl: "https://support.betfair.com/",
            appEnv: "base-path/app-env",
          },
        });
      });

      it("should call goBack", () => {
        expect(goBack).toHaveBeenCalledTimes(1);
      });

      it("should call navigateWithThirdPartyScreenName with correct params", () => {
        expect(navigateWithThirdPartyScreenName).toHaveBeenCalledTimes(1);
        expect(navigateWithThirdPartyScreenName).toHaveBeenCalledWith(ScreenName.ErrorScreen);
      });
    });

    describe("and error code is 429", () => {
      setup({
        action: {
          type: FETCH_CATALOGUE_FAILURE,
          payload: { error: new HttpResponseError("url", "method", "query", "body", 429) },
        },
      });

      it("should not call getBasePath", () => {
        expect(getBasePath).not.toHaveBeenCalled();
      });

      it("should not call dispatch", () => {
        expect(dispatchSpy).not.toHaveBeenCalled();
      });

      it("should not call navigateWithThirdPartyScreenName", () => {
        expect(navigateWithThirdPartyScreenName).not.toHaveBeenCalled();
      });
    });
  });

  describe("when action type is NETWORK__FETCH_APP_CONTEXT_FAILURE", () => {
    beforeEach(() => {
      setup({ action: { type: NETWORK__FETCH_APP_CONTEXT_FAILURE } });
    });

    it("should call getBasePath", () => {
      expect(getBasePath).toHaveBeenCalledTimes(1);
    });

    it("should dispatch error view add action", () => {
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith({
        type: ERROR_VIEW__ADD,
        payload: {
          urn: "ppb:tbd:view:error",
          errorType: ErrorType.FATAL_ERROR,
          appEnv: "base-path/app-env",
          bffEndpoint: "base-path/bff-gql/v11",
          latestBffEndpoint: "base-path/bff-gql/latest",
        },
      });
    });

    it("should call navigateWithThirdPartyScreenName with correct params", () => {
      expect(navigateWithThirdPartyScreenName).toHaveBeenCalledTimes(1);
      expect(navigateWithThirdPartyScreenName).toHaveBeenCalledWith(ScreenName.RootErrorScreen);
    });
  });

  describe("NETWORK/FETCH_APP_CONTEXT_TERRITORY_BLOCKING", () => {
    it("should navigate to territory blocking screen if territory blocked", () => {
      setup({
        action: {
          type: NETWORK__FETCH_APP_CONTEXT_TERRITORY_BLOCKING,
          payload: { details: { isBlockedTerritory: true } },
        },
      });
      expect(navigateTerritoryBlockingScreen).toHaveBeenCalledTimes(1);
      expect(navigateTerritoryBlockingScreen).toHaveBeenCalledWith();
    });

    it("should not navigate to territory blocking screen if not territory blocked", () => {
      setup({
        action: { type: NETWORK__FETCH_APP_CONTEXT_TERRITORY_BLOCKING, payload: { details: false } },
      });
      expect(navigateTerritoryBlockingScreen).not.toHaveBeenCalled();
    });
  });

  describe("when action type is FETCH_CATALOGUE_EMPTY_VIEW_FAILURE", () => {
    beforeEach(() => {
      setup({ action: { type: FETCH_CATALOGUE_EMPTY_VIEW_FAILURE } });
    });

    it("should call getBasePath", () => {
      expect(getBasePath).toHaveBeenCalledTimes(1);
    });

    it("should dispatch error view add action", () => {
      expect(dispatchSpy).toHaveBeenCalledTimes(1);
      expect(dispatchSpy).toHaveBeenCalledWith({
        type: ERROR_VIEW__ADD,
        payload: {
          urn: "ppb:tbd:view:error",
          errorType: ErrorType.FATAL_EMPTY_VIEW_ERROR,
          appEnv: "base-path/app-env",
          bffEndpoint: "base-path/bff-gql/v11",
          latestBffEndpoint: "base-path/bff-gql/latest",
        },
      });
    });

    it("should call navigateWithThirdPartyScreenName with correct params", () => {
      expect(navigateWithThirdPartyScreenName).toHaveBeenCalledTimes(1);
      expect(navigateWithThirdPartyScreenName).toHaveBeenCalledWith(ScreenName.ErrorScreen);
    });
  });

  describe("when action type is unknown", () => {
    beforeEach(() => {
      setup({ action: { type: "UNKNOWN" } });
    });

    it("should not call getBasePath", () => {
      expect(getBasePath).not.toHaveBeenCalled();
    });

    it("should not call dispatch", () => {
      expect(dispatchSpy).not.toHaveBeenCalled();
    });

    it("should not call navigateWithThirdPartyScreenName", () => {
      expect(navigateWithThirdPartyScreenName).not.toHaveBeenCalled();
    });
  });
});
