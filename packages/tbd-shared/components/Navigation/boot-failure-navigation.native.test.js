import { navigateOnBootFailure } from "./boot-failure-navigation.native";
import {
  navigateTerritoryBlockingScreen,
  navigateWithThirdPartyScreenName,
  ScreenName,
  NativeEntityTypes,
} from "@ppb/tbd-router/native";
import { ErrorType } from "@ppb/tbd-store/state/network-status/Errors";
import { ERROR_VIEW__ADD } from "@ppb/tbd-store/actions/error";
import {
  getBasePath,
  getCatalogueDefaultPath,
  CATALOGUE_LATEST_PATH,
  APP_ENVIRONMENT_DEFAULT_PATH,
} from "../../config/base-path-utils.native";

jest.mock("@ppb/tbd-router/native", () => ({
  navigateTerritoryBlockingScreen: jest.fn(),
  navigateWithThirdPartyScreenName: jest.fn(),
  ScreenName: { RootErrorScreen: "RootErrorScreen" },
  NativeEntityTypes: { Error: "ppb:tbd:view:error" },
}));

jest.mock("../../config/base-path-utils.native", () => ({
  getBasePath: jest.fn(() => "https://example.com/"),
  getCatalogueDefaultPath: jest.fn(() => "api/tbd/bff-gql/v1/"),
  CATALOGUE_LATEST_PATH: "api/tbd/bff-gql/latest/",
  APP_ENVIRONMENT_DEFAULT_PATH: "betting/env.json",
}));

const createStore = (failed) => ({
  dispatch: jest.fn(),
  getState: jest.fn(() => ({ boot: { failed } })),
});

describe("navigateOnBootFailure", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("navigates to territory blocking screen when boot failed with 'blocked'", () => {
    const store = createStore("blocked");

    navigateOnBootFailure(store);

    expect(navigateTerritoryBlockingScreen).toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalled();
  });

  it("dispatches error action and navigates to error screen when boot failed with 'failed'", () => {
    const store = createStore("failed");

    navigateOnBootFailure(store);

    expect(store.dispatch).toHaveBeenCalledWith({
      type: ERROR_VIEW__ADD,
      payload: {
        urn: NativeEntityTypes.Error,
        errorType: ErrorType.FATAL_ERROR,
        bffEndpoint: "https://example.com/api/tbd/bff-gql/v1/",
        latestBffEndpoint: `https://example.com/${CATALOGUE_LATEST_PATH}`,
        appEnv: `https://example.com/${APP_ENVIRONMENT_DEFAULT_PATH}`,
      },
    });
    expect(navigateWithThirdPartyScreenName).toHaveBeenCalledWith(ScreenName.RootErrorScreen);
  });

  it("does nothing when boot has not failed", () => {
    const store = createStore(undefined);

    navigateOnBootFailure(store);

    expect(navigateTerritoryBlockingScreen).not.toHaveBeenCalled();
    expect(navigateWithThirdPartyScreenName).not.toHaveBeenCalled();
    expect(store.dispatch).not.toHaveBeenCalled();
  });
});
