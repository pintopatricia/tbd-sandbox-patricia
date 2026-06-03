import { APP_CONTEXT__FETCH } from "@ppb/tbd-store/actions/app-context";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

const getErrorViewByURN = jest.fn();

jest.mock("@ppb/tbd-store/state/layout/views/view-selectors", () => ({
  createViewByURNSelector: jest.fn(() => getErrorViewByURN),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

describe("makeMapStateToProps", () => {
  const ERROR_VIEWS = {
    layouts: {
      views: {
        error: {
          "urn:fake:error": {
            typename: "ErrorView",
            urn: "urn:fake:error",
            errorType: "error-type",
            helpCenterUrl: "url",
            appContextBasePath: "path",
            bffEndpoint: "bff",
            latestBffEndpoint: "latest-bff",
          },
        },
      },
    },
    entities: {
      brandSettings: {
        ERROR_VIEW_IMAGE: true,
      },
    },
  };

  const ERROR_VIEWS_WITHOUT_IMAGE = {
    ...ERROR_VIEWS,
    entities: {
      brandSettings: {
        ERROR_VIEW_IMAGE: false,
      },
    },
  };

  function setup(state, urn) {
    getErrorViewByURN.mockImplementation((views) => views[urn] || null);

    return makeMapStateToProps()(state, { urn });
  }

  beforeEach(jest.clearAllMocks);

  describe("makeMapStateToProps", () => {
    describe("when there is a layout for provided URN", () => {
      it("should getErrorViewByURN from state", () => {
        setup(ERROR_VIEWS, "urn:fake:error");

        expect(getErrorViewByURN).toHaveBeenCalledWith(ERROR_VIEWS.layouts.views.error, "urn:fake:error");
      });

      it("should return page layout", () => {
        const props = setup(ERROR_VIEWS, "urn:fake:error");
        expect(props).toEqual({
          errorType: "error-type",
          helpCenterUrl: "url",
          bffEndpoint: "bff",
          latestBffEndpoint: "latest-bff",
          hasErrorViewImage: true,
          i18nLabels: {
            failedRequestMsg: "I18N.ERROR_HANDLING.FAILED_REQUEST_MESSAGE",
            fatalErrorMsg: "I18N.ERROR_HANDLING.FATAL_ERROR_MESSAGE",
            helpCenterLabel: "I18N.NAVIGATE.HELP_CENTER",
            retryButtonLabel: "I18N.ACTION.RETRY",
            title: "I18N.ERROR_HANDLING.TITLE",
          },
        });
      });
    });

    describe("when the error view image is false in store", () => {
      it("should return false for hasErrorViewImage", () => {
        const props = setup(ERROR_VIEWS_WITHOUT_IMAGE, "urn:fake:error");
        expect(props).toEqual({
          errorType: "error-type",
          helpCenterUrl: "url",
          bffEndpoint: "bff",
          latestBffEndpoint: "latest-bff",
          hasErrorViewImage: false,
          i18nLabels: {
            failedRequestMsg: "I18N.ERROR_HANDLING.FAILED_REQUEST_MESSAGE",
            fatalErrorMsg: "I18N.ERROR_HANDLING.FATAL_ERROR_MESSAGE",
            helpCenterLabel: "I18N.NAVIGATE.HELP_CENTER",
            retryButtonLabel: "I18N.ACTION.RETRY",
            title: "I18N.ERROR_HANDLING.TITLE",
          },
        });
      });
    });

    describe("when there is no layout for provided URN", () => {
      it("should getErrorViewByURN from state", () => {
        setup(
          {
            layouts: {
              views: {
                error: {},
              },
            },
            entities: {
              brandSettings: {},
            },
          },
          "urn:fake:error",
        );
        expect(getErrorViewByURN).toHaveBeenCalledWith({}, "urn:fake:error");
      });

      it("should return empty state", () => {
        const state = setup(
          {
            layouts: {
              views: {
                error: {},
              },
            },
            entities: {
              brandSettings: {},
            },
          },
          "urn:fake:error",
        );
        expect(state).toEqual({});
      });
    });
  });

  describe("mapDispatchToProps", () => {
    describe("on dispatchFetchAppContext trigger", () => {
      it("should dispatch fetch AppContext action", () => {
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
});
