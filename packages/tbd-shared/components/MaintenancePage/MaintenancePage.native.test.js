import { render, act } from "@testing-library/react-native";

import { resetNavigationStack, navigate, popLastFromStack } from "@ppb/tbd-router/native";
import { PrimaryButton, QuickLink } from "@ppb/the-wall-native";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { EntityType } from "@ppb/tbd-urn-codecs";
import NativeWebView from "../Navigation/screens/NativeWebView.native";

import { LOADING_CONTAINER, REFRESH_BUTTON } from "./MaintenancePage.native.selectors";
import { splashedStyles } from "./MaintenancePage.native.styles";
import MaintenancePage from "./MaintenancePage.native";
import RegulatoryCard from "../RegulatoryCard/RegulatoryCard.native";
import ConnectedRegulatoryCard from "../RegulatoryCard";
import { getEndpoint } from "../../config/endpoints";

jest.mock("../Navigation/screens/NativeWebView.native", () => jest.fn(() => <native-web-view-mock />));

jest.mock("@ppb/tbd-router/native", () => ({
  navigate: jest.fn(),
  popLastFromStack: jest.fn(),
  resetNavigationStack: jest.fn(),
}));
jest.mock("@ppb/the-wall-native", () => ({
  PrimaryButton: jest.fn(() => <primary-button-mock />),
  QuickLink: jest.fn(() => <quick-link />),
  Text: jest.requireActual("react-native").Text,
}));
jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({ GenericIcon: jest.fn(() => <generic-icon />) }));

jest.mock("../RegulatoryCard/RegulatoryCard.native", () => jest.fn(() => <connected-regulatory-card-mock />));
jest.mock("../RegulatoryCard", () => jest.fn(() => <regulatory-card-mock />));

jest.mock("../../config/endpoints", () => ({ getEndpoint: jest.fn() }));

jest.mock("../../config/app-configuration.native", () => ({
  appName: "tbd_native",
}));

const renderMaintenancePage = (props) =>
  render(
    <MaintenancePage
      urn="ppb:tbd:view:maintenance:maintenance"
      text={{}}
      products={[]}
      dispatchFetchCatalogue={jest.fn()}
      {...props}
    />,
  );

describe("MaintenancePage", () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers();
    });
    jest.useRealTimers();
  });

  describe("When the view prop has a webSplashURL", () => {
    it("should render the loading container", () => {
      const { queryByTestId } = renderMaintenancePage({
        webSplashURL: "http://redirectUrl",
      });

      expect(queryByTestId(LOADING_CONTAINER)).not.toBe(null);
    });

    it("should render the WebView", () => {
      renderMaintenancePage({
        webSplashURL: "http://redirectUrl",
      });

      expect(NativeWebView).toHaveBeenCalledWith(
        {
          onLoadEnd: expect.any(Function),
          cacheEnabled: false,
          onNavigationStateChange: expect.any(Function),
          sharedCookiesEnabled: true,
          source: {
            uri: "http://redirectUrl?swa_product=tbd_native",
          },
          ref: {
            current: null,
          },
          style: [{ opacity: 0 }],
        },
        undefined,
      );
    });

    it("should render the refresh button", () => {
      renderMaintenancePage({
        webSplashURL: "http://redirectUrl",
      });

      expect(PrimaryButton).toHaveBeenCalled();
    });

    it("should render the refresh button text", () => {
      renderMaintenancePage({
        webSplashURL: "http://redirectUrl",
        text: { refreshButton: "button title" },
      });

      expect(PrimaryButton).toHaveBeenCalledWith(
        expect.objectContaining({
          label: "button title",
          testID: "maintenance-page-refresh-button",
          disabled: true,
        }),
        undefined,
      );
    });

    describe("When WebView ends loading", () => {
      it("should switch WebView's opacity", () => {
        renderMaintenancePage({
          webSplashURL: "http://redirectUrl",
        });

        expect(NativeWebView).toHaveBeenCalledWith(
          expect.objectContaining({
            style: [{ opacity: 0 }],
          }),
          undefined,
        );

        act(() => {
          NativeWebView.mock.calls[0][0].onLoadEnd();
        });

        expect(NativeWebView).toHaveBeenLastCalledWith(
          expect.objectContaining({
            style: [false],
          }),
          undefined,
        );
      });
    });

    describe("When a WebView link in pressed", () => {
      describe("and the url doesn't match the maintenance redirect url", () => {
        it("should navigate to external view", () => {
          renderMaintenancePage({
            webSplashURL: "http://redirectUrl",
          });

          act(() => {
            NativeWebView.mock.calls[0][0].onNavigationStateChange({
              url: "http://someUrl/something",
            });
          });

          expect(navigate).toHaveBeenCalledWith({
            viewUrl: "http://someUrl/something",
            viewUrn: "ppb:tbd:view:external",
          });
        });
      });

      describe("and the url matches the maintenance redirect url", () => {
        it("shouldn't navigate to an external view", () => {
          renderMaintenancePage({
            webSplashURL: "http://redirectUrl",
          });

          act(() => {
            NativeWebView.mock.calls[0][0].onNavigationStateChange({
              url: "http://redirectUrl/something",
            });
          });

          expect(navigate).not.toHaveBeenCalled();
        });
      });
    });

    describe("The refresh button", () => {
      it("should be disabled on initial render and resetNavigation should be called on tap", () => {
        renderMaintenancePage({
          webSplashURL: "http://redirectUrl",
        });

        expect(PrimaryButton.mock.calls[0][0].disabled).toBeTruthy();
        expect(resetNavigationStack).not.toHaveBeenCalled();

        PrimaryButton.mock.calls[0][0].onTap();

        expect(resetNavigationStack).toHaveBeenCalled();
      });
    });
  });

  describe("When the view prop has empty webSplashURL", () => {
    it("shouldn't render the loading container", () => {
      const { queryByTestId } = renderMaintenancePage({
        webSplashURL: "",
      });

      expect(queryByTestId(LOADING_CONTAINER)).toBe(null);
    });

    it("shouldn't render the Refresh Button", () => {
      const { queryByTestId } = renderMaintenancePage({
        webSplashURL: "",
      });

      expect(queryByTestId(REFRESH_BUTTON)).toBe(null);
    });

    it("should display provided text", () => {
      const { queryByText } = renderMaintenancePage({
        webSplashURL: "",
        text: {
          pageTitle: "the title",
          description: "the description",
          productsTitle: "the products",
        },
      });

      expect(queryByText("the title")).not.toBeNull();
      expect(queryByText("the description")).not.toBeNull();
      expect(queryByText("the products")).not.toBeNull();
    });

    describe("when product status is OK", () => {
      it("should call QuickLink for each product", () => {
        renderMaintenancePage({
          webSplashURL: "",
          products: [
            { product: "sportsbook", status: "OK", title: "sportsbook" },
            { product: "exchange", status: "OK", title: "exchange" },
          ],
        });

        expect(QuickLink).toHaveBeenNthCalledWith(
          1,
          {
            icon: expect.anything(),
            item: { text: "sportsbook" },
            onPress: expect.any(Function),
            roundCorners: { topLeft: true, topRight: true, bottomLeft: false, bottomRight: false },
          },
          undefined,
        );
        expect(QuickLink).toHaveBeenNthCalledWith(
          2,
          {
            icon: expect.anything(),
            item: { text: "exchange" },
            onPress: expect.any(Function),
            roundCorners: { topLeft: false, topRight: false, bottomLeft: true, bottomRight: true },
          },
          undefined,
        );
        expect(QuickLink).toHaveBeenCalledTimes(2);
      });

      it("QuickLink onPress should call dispatchToProduct", () => {
        const dispatchToProduct = jest.fn();
        renderMaintenancePage({
          webSplashURL: "",
          products: [{ product: "sportsbook", status: "OK", viewLink: { viewUrn: "sbk:urn", viewUrl: "sbk url" } }],
          dispatchToProduct,
        });

        QuickLink.mock.calls[0][0].onPress();

        expect(dispatchToProduct).toHaveBeenCalledWith({
          product: "sportsbook",
          viewLink: { viewUrn: "sbk:urn", viewUrl: "sbk url" },
        });
        expect(dispatchToProduct).toHaveBeenCalledTimes(1);
      });

      it("QuickLink onPress should call popLastFromStack", () => {
        renderMaintenancePage({
          webSplashURL: "",
          products: [{ product: "sportsbook", status: "OK", viewLink: { viewUrn: "sbk:urn", viewUrl: "sbk url" } }],
          dispatchToProduct: jest.fn(),
        });

        QuickLink.mock.calls[0][0].onPress();

        expect(popLastFromStack).toHaveBeenCalledTimes(1);
      });

      it("should call GenericIcon with expected props", () => {
        renderMaintenancePage({
          webSplashURL: "",
          products: [
            { product: "sportsbook", status: "OK" },
            { product: "exchange", status: "OK" },
          ],
          text: {},
        });

        render(QuickLink.mock.calls[0][0].icon);
        render(QuickLink.mock.calls[1][0].icon);

        expect(GenericIcon).toHaveBeenNthCalledWith(
          1,
          {
            name: SystemIconName.NOTIFICATION_SUCCESS,
            color: tokens.MessagingSuccessIconDefault,
          },
          undefined,
        );
        expect(GenericIcon).toHaveBeenNthCalledWith(
          2,
          {
            name: SystemIconName.NOTIFICATION_SUCCESS,
            color: tokens.MessagingSuccessIconDefault,
          },
          undefined,
        );
        expect(GenericIcon).toHaveBeenCalledTimes(2);
      });

      it("After 60 seconds should call dispatchFetchCatalogue", () => {
        const dispatchFetchCatalogue = jest.fn();
        renderMaintenancePage({
          webSplashURL: "",
          products: [{ product: "sportsbook", status: "OK", viewLink: { viewUrn: "sbk:urn", viewUrl: "sbk url" } }],
          dispatchFetchCatalogue,
        });

        expect(dispatchFetchCatalogue).toHaveBeenCalledTimes(0);

        act(() => {
          jest.advanceTimersByTime(60000);
        });

        expect(dispatchFetchCatalogue).toHaveBeenCalledTimes(1);
        expect(dispatchFetchCatalogue).toHaveBeenCalledWith("ppb:tbd:view:maintenance:maintenance");
      });

      describe("and exchange link is clicked and isExchangeEnabled is `false`", () => {
        it("QuickLink onLinkClick should call navigate", () => {
          getEndpoint.mockReturnValueOnce("betfair.com/exchange");
          renderMaintenancePage({
            webSplashURL: "",
            products: [{ product: "exchange", status: "OK", viewLink: { viewUrn: "exc:urn", viewUrl: "exc url" } }],
            isExchangeEnabled: false,
          });

          QuickLink.mock.calls[0][0].onPress();

          expect(getEndpoint).toHaveBeenCalledWith("EXCHANGE_SITE");
          expect(getEndpoint).toHaveBeenCalledTimes(1);
          expect(navigate).toHaveBeenCalledWith({
            fallbackViewUrl: "betfair.com/exchange",
            viewUrl: "bfsportsbetting://",
            viewUrn: EntityType.ExternalView,
          });
          expect(navigate).toHaveBeenCalledTimes(1);
        });
      });
    });

    describe("when product status is SPLASHED", () => {
      it("should call QuickLink for each product", () => {
        renderMaintenancePage({
          webSplashURL: "",
          products: [
            { product: "sportsbook", status: "SPLASHED", title: "sportsbook unavailable" },
            { product: "exchange", status: "SPLASHED", title: "exchange unavailable" },
          ],
          text: {},
        });

        expect(QuickLink).toHaveBeenNthCalledWith(
          1,
          {
            item: { text: "sportsbook unavailable" },
            icon: expect.anything(),
            onPress: undefined,
            roundCorners: { topLeft: true, topRight: true, bottomLeft: false, bottomRight: false },
          },
          undefined,
        );
        expect(QuickLink).toHaveBeenNthCalledWith(
          2,
          {
            item: { text: "exchange unavailable" },
            icon: expect.anything(),
            onPress: undefined,
            roundCorners: { topLeft: false, topRight: false, bottomLeft: true, bottomRight: true },
          },
          undefined,
        );
        expect(QuickLink).toHaveBeenCalledTimes(2);
      });

      it("should call GenericIcon with expected props", () => {
        renderMaintenancePage({
          webSplashURL: "",
          products: [
            { product: "sportsbook", status: "SPLASHED" },
            { product: "exchange", status: "SPLASHED" },
          ],
          text: {},
        });

        render(QuickLink.mock.calls[0][0].icon);
        render(QuickLink.mock.calls[1][0].icon);

        expect(GenericIcon).toHaveBeenNthCalledWith(
          1,
          {
            name: SystemIconName.NOTIFICATION_WARNING,
            color: tokens.QuickLinkPrimaryDefaultIconErrorColour,
          },
          undefined,
        );
        expect(GenericIcon).toHaveBeenNthCalledWith(
          2,
          {
            name: SystemIconName.NOTIFICATION_WARNING,
            color: tokens.QuickLinkPrimaryDefaultIconErrorColour,
          },
          undefined,
        );
        expect(GenericIcon).toHaveBeenCalledTimes(2);
      });

      it("After 60 seconds should call dispatchFetchCatalogue", () => {
        const dispatchFetchCatalogue = jest.fn();
        renderMaintenancePage({
          webSplashURL: "",
          products: [
            { product: "sportsbook", status: "SPLASHED" },
            { product: "exchange", status: "SPLASHED" },
          ],
          dispatchFetchCatalogue,
        });

        expect(dispatchFetchCatalogue).toHaveBeenCalledTimes(0);

        act(() => {
          jest.advanceTimersByTime(60000);
        });

        expect(dispatchFetchCatalogue).toHaveBeenCalledTimes(1);
        expect(dispatchFetchCatalogue).toHaveBeenCalledWith("ppb:tbd:view:maintenance:maintenance");
      });
    });

    it("should render WebView and text when twitter URL provided", () => {
      const { queryByText } = renderMaintenancePage({
        webSplashURL: "",
        text: {
          twitter: "twitter test",
        },
        twitterURL: "http://twitter",
      });

      expect(queryByText("twitter test")).not.toBeNull();
      expect(NativeWebView).toHaveBeenCalledWith(
        {
          style: splashedStyles.twitterFrame,
          source: { uri: "http://twitter" },
          onNavigationStateChange: expect.any(Function),
          ref: {
            current: null,
          },
        },
        undefined,
      );
      expect(NativeWebView).toHaveBeenCalledTimes(1);
    });

    it("should not render WebView or text if no twitter URL provided", () => {
      const { queryByText } = renderMaintenancePage({
        webSplashURL: "",
        text: {
          twitter: "twitter test",
        },
      });

      expect(queryByText("twitter test")).toBeNull();
      expect(NativeWebView).toHaveBeenCalledTimes(0);
    });

    it("should not render WebView or text if twitterURL is empty string", () => {
      const { queryByText } = renderMaintenancePage({
        webSplashURL: "",
        text: {
          twitter: "twitter test",
        },
        twitterURL: "",
      });

      expect(queryByText("twitter test")).toBeNull();
      expect(NativeWebView).toHaveBeenCalledTimes(0);
    });

    it("should call regulatory card", () => {
      renderMaintenancePage({
        webSplashURL: "",
      });

      expect(ConnectedRegulatoryCard).toHaveBeenCalledWith(
        {
          component: RegulatoryCard,
          urn: "ppb:tbd:card:regulatory:footer",
        },
        undefined,
      );
      expect(ConnectedRegulatoryCard).toHaveBeenCalledTimes(1);
    });
  });
});
