import { render } from "@testing-library/react";

import RootComponent from "./RootComponent.web";
import { addGtmScript } from "../helpers/google-analytics/google-analytics-helper.web";
import { useRealityCheckAlert } from "../hooks/useRealityCheckAlert.web";

jest.mock("react-redux", () => ({ Provider: jest.fn() }));

jest.mock("@apollo/client/react", () => ({
  ApolloProvider: jest.fn(() => <apollo-provider-mock />),
}));

jest.mock("../apollo-client/client", () => ({
  getApolloClient: jest.fn(),
}));

jest.mock("../experimentation/provider/LoopProvider", () => ({ LoopProvider: jest.fn() }));

jest.mock("../experimentation/visitor-id-resolver.web", () => ({ resolveVisitorId: jest.fn(() => "xxx") }));

jest.mock("./Config/ConfigContext", () => ({
  ConfigContextProvider: jest.fn(() => <config-context-provider-mock />),
}));

jest.mock("./EnvironmentBanner/EnvironmentBanner.web", () => ({
  EnvironmentBanner: jest.fn(() => <environment-banner-mock />),
}));

jest.mock("./ErrorBoundary/ErrorBoundaryProvider.web", () => ({
  ErrorBoundaryProvider: jest.fn(() => <error-boundary-provider-mock />),
}));

jest.mock("./Wdyr/wdyr.web", () => jest.fn(() => <wdyr-dashboard-mock />));

jest.mock("./App", () => ({ default: jest.fn(() => <connected-app-mock />) }));
jest.mock("./App/App.web", () => ({ default: jest.fn(() => <app-mock />) }));
jest.mock("./App/App.desktop.web", () => ({ default: jest.fn(() => <app-desktop-mock />) }));

Object.defineProperty(window, "__CONTENT_LOADING_PARAMETERS__", {
  value: { catalog: false, isDesktop: false },
});

const getThrottleMock = jest.fn();
jest.mock("@ppb/tbd-store/state/entities/throttles/throttles-selectors", () => ({
  createGetThrottleSelector: () => getThrottleMock,
}));

jest.mock("../helpers/google-analytics/google-analytics-helper.web", () => ({
  addGtmScript: jest.fn(),
}));

jest.mock("../hooks/useRealityCheckAlert.web", () => ({
  useRealityCheckAlert: jest.fn(),
}));

const DEFAULT_PROPS = {
  store: {
    getState: jest.fn().mockReturnValue({
      entities: {
        throttles: {},
      },
    }),
    dispatch: jest.fn(),
  },
  theme: "Betfair",
};

const renderRootComponent = (props = {}) => render(<RootComponent {...DEFAULT_PROPS} {...props} />);

describe("RootComponent", () => {
  beforeEach(jest.clearAllMocks);

  describe("deferGTMLoading", () => {
    describe("when deferGTMLoading is false", () => {
      it("should not call addGtmScrip", () => {
        getThrottleMock.mockReturnValue({ isActive: false });
        renderRootComponent();

        expect(addGtmScript).not.toHaveBeenCalled();
      });
    });

    describe("when deferGTMLoading is true", () => {
      it("should call addGtmScript with correct arguments", () => {
        getThrottleMock.mockImplementation((_, throttleName) => {
          if (throttleName === "DEFER_GTM_LOADING" || throttleName === "ENABLE_GA4" || throttleName === "DISABLE_UA") {
            return { isActive: true };
          }
          return { isActive: false };
        });
        renderRootComponent();

        expect(addGtmScript).toHaveBeenCalledTimes(1);
        expect(addGtmScript).toHaveBeenCalledWith(true, true);
      });
    });
  });

  describe("useRealityCheckAlert", () => {
    describe("when component mounts", () => {
      it("should call useRealityCheckAlert", () => {
        renderRootComponent();

        expect(useRealityCheckAlert).toHaveBeenCalledTimes(1);
      });
    });
  });
});
