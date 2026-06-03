import { forwardRef } from "react";
import { render, act } from "@testing-library/react-native";
import { CustomModal } from "@ppb/the-wall-native";
import ReactNativeWebView from "react-native-webview";
import { firebase } from "@react-native-firebase/crashlytics";
import { isMovableInkSubdomain, navigateWithDeepLinking } from "@ppb/tbd-router";
import WebMessagePopup from "./WebMessagePopup.native";
import { getMovableInkPromoRedirectUrl } from "../../helpers/promotion-helper";
import { getHomepagePaths, getHost } from "../../config/endpoints";

jest.mock("../../config/endpoints", () => ({
  getHost: jest.fn().mockReturnValue("betfair.com"),
  getHomepagePaths: jest.fn().mockReturnValue("aaa|bbbb|dddd"),
}));

jest.mock("@ppb/tbd-router", () => ({
  navigateWithDeepLinking: jest.fn(),
  isMovableInkSubdomain: jest.fn().mockReturnValue(true),
}));

jest.mock("@ppb/the-wall-native", () => ({
  CustomModal: jest.fn(({ children }) => <custom-modal-mock>{children}</custom-modal-mock>),
  Loader: jest.fn(() => <loader-mock />),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
}));

jest.mock("react-native-webview", () => ({
  WebView: jest.fn(),
}));

jest.mock("@react-native-firebase/crashlytics", () => ({
  firebase: { crashlytics: jest.fn().mockReturnValue({ recordError: jest.fn() }) },
}));

jest.mock("../../helpers/promotion-helper", () => ({
  getMovableInkPromoRedirectUrl: jest.fn().mockResolvedValue("test.url"),
}));

jest.mock("../../config/app-configuration.native", () => ({
  appBrand: "betfair",
  deeplinkConfiguration: "deeplinkConfiguration",
}));

const WebViewMock = jest.fn((props, ref) => <web-view-mock {...props} ref={ref} />);
ReactNativeWebView.WebView = forwardRef(WebViewMock);

const DISPATCH_FETCH_WEB_MESSAGES = jest.fn();
const DISPATCH_READ_WEB_MESSAGE = jest.fn();

function renderWebMessagePopup(props) {
  return render(<WebMessagePopup {...props} />);
}

const stateProps = {
  webMessage: {
    urn: "mockedUrn1",
    title: "mockedTitle1",
    templateHeight: "mockedTemplateHeight1",
    templateWidth: "mockedTemplateWidth1",
    templateUrl: "mockedTemplateUrl1",
  },
  dispatchFetchWebMessages: DISPATCH_FETCH_WEB_MESSAGES,
  dispatchReadWebMessage: DISPATCH_READ_WEB_MESSAGE,
};

describe("WebMessagePopup component", () => {
  describe("when initializing", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should render Custom Modal", () => {
      renderWebMessagePopup(stateProps);

      expect(CustomModal).toHaveBeenCalledTimes(1);
    });

    it("should render the Web View", () => {
      renderWebMessagePopup(stateProps);

      expect(WebViewMock).toHaveBeenCalledTimes(1);
    });

    it("should set the correct source", () => {
      renderWebMessagePopup(stateProps);

      expect(WebViewMock).toHaveBeenCalledWith(expect.objectContaining({ source: { uri: "mockedTemplateUrl1" } }), {
        current: null,
      });
    });

    describe("when navigating inside the web view", () => {
      describe("when initial load happens", () => {});

      describe("when a movable ink url is pressed", () => {
        describe("when it resolves successfully", () => {
          it("should call dispatchReadWebMessage", async () => {
            getMovableInkPromoRedirectUrl.mockResolvedValue("test.url");
            isMovableInkSubdomain.mockReturnValue(true);
            renderWebMessagePopup(stateProps);

            const { onNavigationStateChange } = WebViewMock.mock.calls[0][0];

            await act(() => onNavigationStateChange({ url: "https://movableink.betfair.com" }));

            expect(DISPATCH_READ_WEB_MESSAGE).toHaveBeenCalledWith("mockedUrn1");
          });

          describe("when the message has been marked as read", () => {
            it("should call navigateWithDeepLinking with the resolved url", async () => {
              getMovableInkPromoRedirectUrl.mockResolvedValue("test.url");
              isMovableInkSubdomain.mockReturnValue(true);
              const { rerender } = renderWebMessagePopup(stateProps);

              const { onNavigationStateChange } = WebViewMock.mock.calls[0][0];

              await act(() => onNavigationStateChange({ url: "https://movableink.betfair.com" }));
              await act(() => rerender(<WebMessagePopup {...stateProps} webMessage={null} />));

              expect(getHost).toHaveBeenCalled();
              expect(getHomepagePaths).toHaveBeenCalled();
              expect(navigateWithDeepLinking).toHaveBeenCalledWith(
                "test.url",
                "betfair.com",
                "aaa|bbbb|dddd",
                "deeplinkConfiguration",
              );
            });
          });

          describe("when the message has NOT been marked as read yet", () => {
            it("should NOT call navigateWithDeepLinking with the resolved url", async () => {
              getMovableInkPromoRedirectUrl.mockResolvedValue("test.url");
              isMovableInkSubdomain.mockReturnValue(true);
              const { rerender } = renderWebMessagePopup(stateProps);

              const { onNavigationStateChange } = WebViewMock.mock.calls[0][0];

              await act(() => onNavigationStateChange({ url: "https://movableink.betfair.com" }));
              await act(() => rerender(<WebMessagePopup {...stateProps} />));

              expect(getHost).not.toHaveBeenCalled();
              expect(getHomepagePaths).not.toHaveBeenCalled();
              expect(navigateWithDeepLinking).not.toHaveBeenCalled();
            });
          });
        });

        describe("when it fails resolving", () => {
          it("should not call navigate", async () => {
            getMovableInkPromoRedirectUrl.mockRejectedValue("Movable Ink resolve error");
            isMovableInkSubdomain.mockReturnValue(true);
            renderWebMessagePopup(stateProps);

            const { onNavigationStateChange } = WebViewMock.mock.calls[0][0];
            await act(() => onNavigationStateChange({ url: "https://movableink.betfair.com" }));

            expect(getHost).not.toHaveBeenCalled();
            expect(getHomepagePaths).not.toHaveBeenCalled();
            expect(navigateWithDeepLinking).not.toHaveBeenCalled();
          });

          it("should log error to firebase", async () => {
            getMovableInkPromoRedirectUrl.mockRejectedValue("Movable Ink resolve error");
            isMovableInkSubdomain.mockReturnValue(true);
            renderWebMessagePopup(stateProps);

            const { onNavigationStateChange } = WebViewMock.mock.calls[0][0];
            await act(() => onNavigationStateChange({ url: "https://movableink.betfair.com" }));

            expect(firebase.crashlytics().recordError).toHaveBeenCalledWith("Movable Ink resolve error", "MovableInk");
          });
        });
      });

      describe("when another type of link is pressed", () => {
        it("should call dispatchReadWebMessage", async () => {
          isMovableInkSubdomain.mockReturnValue(false);
          renderWebMessagePopup(stateProps);

          const { onNavigationStateChange } = WebViewMock.mock.calls[0][0];

          await act(() => onNavigationStateChange({ url: "https://promos.betfair.com" }));

          expect(DISPATCH_READ_WEB_MESSAGE).toHaveBeenCalledWith("mockedUrn1");
        });

        describe("when the message has been marked as read", () => {
          it("should call navigateWithDeepLinking with the resolved url", async () => {
            isMovableInkSubdomain.mockReturnValue(false);
            const { rerender } = renderWebMessagePopup(stateProps);

            const { onNavigationStateChange } = WebViewMock.mock.calls[0][0];

            await act(() => onNavigationStateChange({ url: "https://promos.betfair.com" }));
            await act(() => rerender(<WebMessagePopup {...stateProps} webMessage={null} />));

            expect(getHost).toHaveBeenCalled();
            expect(getHomepagePaths).toHaveBeenCalled();
            expect(navigateWithDeepLinking).toHaveBeenCalledWith(
              "https://promos.betfair.com",
              "betfair.com",
              "aaa|bbbb|dddd",
              "deeplinkConfiguration",
            );
          });
        });

        describe("when the message has NOT been marked as read yet", () => {
          it("should NOT call navigateWithDeepLinking with the resolved url", async () => {
            isMovableInkSubdomain.mockReturnValue(false);
            const { rerender } = renderWebMessagePopup(stateProps);

            const { onNavigationStateChange } = WebViewMock.mock.calls[0][0];

            await act(() => onNavigationStateChange({ url: "https://promos.betfair.com" }));
            await act(() => rerender(<WebMessagePopup {...stateProps} />));

            expect(getHost).not.toHaveBeenCalled();
            expect(getHomepagePaths).not.toHaveBeenCalled();
            expect(navigateWithDeepLinking).not.toHaveBeenCalled();
          });
        });
      });
    });

    it("should dispatch a fetchWebMessages on useEffect hook", () => {
      renderWebMessagePopup(stateProps);
      expect(DISPATCH_FETCH_WEB_MESSAGES).toHaveBeenCalledTimes(1);
    });
  });
});
