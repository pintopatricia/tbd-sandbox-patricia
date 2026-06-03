import { getNetworkStatus } from "@ppb/tbd-store/state/network-status/network-status-selectors";
import { APP_CONTEXT__FETCH } from "@ppb/tbd-store/actions/app-context";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

jest.mock("@ppb/tbd-store/state/network-status/network-status-selectors", () => ({
  getNetworkStatus: jest.fn(),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

describe("makeMapStateToProps", () => {
  const STATE = {
    router: {
      currentUrn: "URN",
    },
  };

  function setup(state) {
    getNetworkStatus.mockReturnValue("ONLINE");
    return makeMapStateToProps()(state);
  }

  beforeEach(jest.clearAllMocks);

  it("should call getNetworkStatus with the correct parameters", () => {
    setup(STATE);

    expect(getNetworkStatus).toHaveBeenCalledWith(STATE);
  });

  it("should return the correct props", () => {
    const props = setup(STATE);

    expect(props).toEqual({
      networkStatus: "ONLINE",
      currentUrn: "URN",
      i18nLabels: {
        text: "I18N.OFFLINE_MODE.TEXT",
        title: "I18N.OFFLINE_MODE.TITLE",
        retry: "I18N.ACTION.RETRY",
        settings: "I18N.ACTION.SETTINGS",
      },
    });
  });

  describe("mapDispatchToProps", () => {
    it("should dispatch fetch app context action", () => {
      const { dispatchFetchAppContext } = mapDispatchToProps;

      expect(dispatchFetchAppContext("bff-endpoint", "bff-endpoint-latest", "app-env")).toEqual({
        type: APP_CONTEXT__FETCH,
        payload: {
          defaultBffEndpoint: "bff-endpoint",
          latestBffEndpoint: "bff-endpoint-latest",
          defaultAppEnv: "app-env",
        },
      });
    });
  });
});
