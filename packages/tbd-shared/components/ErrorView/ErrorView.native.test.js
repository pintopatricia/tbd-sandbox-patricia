import { render, fireEvent } from "@testing-library/react-native";
import { EmptyState, PrimaryButton } from "@ppb/the-wall-native";
import { ErrorType } from "@ppb/tbd-store/state/network-status/Errors";
import { DisplayMode } from "@ppb/tbd-store/state/layout/views/ViewLink.types";
import { navigate, resetNavigationStack } from "@ppb/tbd-router/native";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { AssetsIconName } from "@ppb/the-wall-icons";
import { tokens } from "@ppb/the-wall-common/base-theme";
import ErrorView from "./ErrorView.native";
import styles from "./ErrorView.native.styles";
import {
  ERROR_VIEW,
  LOGO,
  ILLUSTRATION,
  RETRY_BUTTON,
  RETRY_BUTTON_LABEL,
  HELP_CENTER,
  HELP_CENTER_ICON,
  HELP_CENTER_LABEL,
} from "./ErrorView.native.selectors";

jest.mock("react-native-svg", () => ({ SvgCssUri: jest.fn(() => <svg-css-uri-mock />) }));

jest.mock("@ppb/the-wall-native", () => ({
  EmptyState: jest.fn(() => <empty-state-mock />),
  PrimaryButton: jest.fn(() => <primary-button-mock />),
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("@ppb/tbd-router/native", () => ({
  DisplayModeTypes: jest.fn(() => ({
    Browser: "browser",
  })),
  navigate: jest.fn(() => {}),
  resetNavigationStack: jest.fn(),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn((props) => <generic-icon-mock {...props} />),
}));

const i18nLabels = {
  title: "title",
  fatalErrorMsg: "fatalErrorMsg",
  failedRequestMsg: "failedRequestMsg",
  retryButtonLabel: "retryButtonLabel",
  helpCenterLabel: "helpCenterLabel",
};
const helpCenterUrl = "url";
const dispatchFetchAppContextMock = jest.fn();
const ErrorViewProps = {
  i18nLabels,
  helpCenterUrl,
  hasErrorViewImage: true,
  dispatchFetchAppContext: dispatchFetchAppContextMock,
  appEnv: "app-env",
};
const optionalEndpoints = {
  appContextBasePath: "path",
  bffEndpoint: "bff-path",
  latestBffEndpoint: "bff-path-latest",
};

const renderErrorView = (props) => {
  const container = render(<ErrorView {...props} />);

  return {
    errorViewContainer: container.queryByTestId(ERROR_VIEW),
    logoContainer: container.queryByTestId(LOGO),
    illustrationContainer: container.queryByTestId(ILLUSTRATION),
    retryButtonContainer: container.queryByTestId(RETRY_BUTTON),
    retryButtonLabel: container.queryByTestId(RETRY_BUTTON_LABEL),
    helpCenterContainer: container.queryByTestId(HELP_CENTER),
    helpCenterIcon: container.queryByTestId(HELP_CENTER_ICON),
    helpCenterLabel: container.queryByTestId(HELP_CENTER_LABEL),
  };
};

describe("ErrorView", () => {
  beforeEach(jest.clearAllMocks);

  describe("when view is rendered", () => {
    describe("and the error type is FATAL_ERROR or FATAL_EMPTY_VIEW_ERROR", () => {
      it.each([ErrorType.FATAL_ERROR, ErrorType.FATAL_EMPTY_VIEW_ERROR])(
        "should render error view component with correct styles and labels",
        (errorType) => {
          const { errorViewContainer, logoContainer, illustrationContainer, retryButtonContainer } = renderErrorView({
            ...ErrorViewProps,
            errorType,
          });
          expect(errorViewContainer).not.toBeNull();
          expect(illustrationContainer).not.toBeNull();

          expect(logoContainer).toHaveStyle(styles.logoContainer);
          expect(GenericIcon).toHaveBeenCalledWith(
            { name: AssetsIconName.BRAND_LOGO, color: tokens.BrandLogoShapeColour },
            undefined,
          );

          expect(retryButtonContainer).toHaveStyle(styles.retryButton);
          expect(PrimaryButton).toHaveBeenCalledWith(
            {
              onTap: expect.any(Function),
              label: expect.any(Object),
            },
            undefined,
          );
        },
      );

      it.each([ErrorType.FATAL_ERROR, ErrorType.FATAL_EMPTY_VIEW_ERROR])(
        "should call EmptyState with correct props",
        (errorType) => {
          renderErrorView({ ...ErrorViewProps, errorType });
          expect(EmptyState).toHaveBeenCalledWith(
            {
              title: i18nLabels.title,
              message: i18nLabels.fatalErrorMsg,
              hasImage: true,
            },
            undefined,
          );
        },
      );

      it.each([ErrorType.FATAL_ERROR, ErrorType.FATAL_EMPTY_VIEW_ERROR])(
        "shouldn't render help center container",
        (errorType) => {
          const { helpCenterContainer } = renderErrorView({ ...ErrorViewProps, errorType });
          expect(helpCenterContainer).toBeNull();
        },
      );

      describe("When retry button is pressed", () => {
        describe("and the bff endpoints and base path are provided", () => {
          it.each([ErrorType.FATAL_ERROR, ErrorType.FATAL_EMPTY_VIEW_ERROR])(
            "must resetNavigationStack",
            (errorType) => {
              renderErrorView({ ...ErrorViewProps, ...optionalEndpoints, errorType });

              PrimaryButton.mock.calls[0][0].onTap();

              expect(resetNavigationStack).toHaveBeenCalledTimes(1);
            },
          );

          it.each([ErrorType.FATAL_ERROR, ErrorType.FATAL_EMPTY_VIEW_ERROR])(
            "must dispatch the fetch AppContext action",
            (errorType) => {
              renderErrorView({ ...ErrorViewProps, ...optionalEndpoints, errorType });

              PrimaryButton.mock.calls[0][0].onTap();

              expect(dispatchFetchAppContextMock).toHaveBeenCalledTimes(1);
              expect(dispatchFetchAppContextMock).toHaveBeenCalledWith("bff-path", "bff-path-latest", "app-env");
            },
          );
        });

        describe("and the bff endpoints and base path are not provided", () => {
          it.each([ErrorType.FATAL_ERROR, ErrorType.FATAL_EMPTY_VIEW_ERROR])(
            "must not resetNavigationStack",
            (errorType) => {
              renderErrorView({ ...ErrorViewProps, errorType });

              PrimaryButton.mock.calls[0][0].onTap();

              expect(resetNavigationStack).not.toHaveBeenCalled();
            },
          );

          it.each([ErrorType.FATAL_ERROR, ErrorType.FATAL_EMPTY_VIEW_ERROR])(
            "must not dispatch the fetch AppContext action",
            (errorType) => {
              renderErrorView({ ...ErrorViewProps, errorType });

              PrimaryButton.mock.calls[0][0].onTap();

              expect(dispatchFetchAppContextMock).not.toHaveBeenCalled();
            },
          );
        });
      });
    });

    describe("and the error type is FAILED_REQUEST", () => {
      const errorType = ErrorType.FAILED_REQUEST;

      it("should render error view component with correct styles and labels", () => {
        const { errorViewContainer, logoContainer, illustrationContainer, helpCenterContainer, helpCenterLabel } =
          renderErrorView({
            ...ErrorViewProps,
            errorType,
          });
        expect(errorViewContainer).not.toBeNull();
        expect(logoContainer).toBeNull();
        expect(illustrationContainer).not.toBeNull();

        expect(helpCenterContainer).toHaveStyle(styles.helpCenterContainer);
        expect(helpCenterLabel).toHaveStyle(styles.helpCenterLabel);

        expect(helpCenterLabel).toHaveTextContent(i18nLabels.helpCenterLabel);
      });

      it("shouldn't render Betfair Logo container", () => {
        const { logoContainer } = renderErrorView({ i18nLabels, errorType: ErrorType.FAILED_REQUEST, helpCenterUrl });
        expect(logoContainer).toBeNull();
      });

      it("should call EmptyState with correct props", () => {
        renderErrorView({ ...ErrorViewProps, errorType });

        expect(EmptyState).toHaveBeenCalledWith(
          {
            title: i18nLabels.title,
            message: i18nLabels.failedRequestMsg,
            hasImage: true,
          },
          undefined,
        );
      });

      it("shouldn't render retry button container", () => {
        const { retryButtonContainer } = renderErrorView({ ...ErrorViewProps, errorType });
        expect(retryButtonContainer).toBeNull();
      });

      describe("When help center icon is pressed", () => {
        it("must dispatch the press action and call the navigate function", () => {
          const { helpCenterIcon } = renderErrorView({ ...ErrorViewProps, errorType });

          fireEvent(helpCenterIcon, "onPress");

          expect(navigate).toHaveBeenCalledWith({
            viewUrl: helpCenterUrl,
            viewUrn: "ppb:tbd:view:external",
            viewDisplayMode: DisplayMode.BlankBrowser,
          });
        });
      });
    });
  });
});
