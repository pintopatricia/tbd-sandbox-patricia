import { render, act } from "@testing-library/react";
import "jest-dom/extend-expect";

import { QuickLink } from "@ppb/the-wall-web";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";

import RegulatoryCard from "../RegulatoryCard/RegulatoryCard.web";
import ConnectedRegulatoryCard from "../RegulatoryCard";
import MaintenancePage from "./MaintenancePage.web";

jest.useFakeTimers();

jest.mock("@ppb/the-wall-web", () => ({
  QuickLink: jest.fn(() => <quick-link />),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon />),
}));

jest.mock("../RegulatoryCard/RegulatoryCard.web", () => jest.fn(() => <regulatory-card />));

jest.mock("../RegulatoryCard", () => jest.fn(() => <connected-regulatory-card />));

function renderMaintenancePage(props) {
  return render(<MaintenancePage urn="ppb:tbd:view:maintenance:maintenance" text={{}} {...props} />);
}

describe("Maintenance Page component", () => {
  beforeEach(jest.clearAllMocks);

  describe("when maintenance view state has a webSplashURL", () => {
    it("should dispatch external push action", () => {
      const dispatchExternalPushAction = jest.fn();

      renderMaintenancePage({
        webSplashURL: "swa-url",
        text: {},
        dispatchExternalPushAction,
      });

      expect(dispatchExternalPushAction).toHaveBeenCalledWith("swa-url?ref=http://localhost/");
      expect(dispatchExternalPushAction).toHaveBeenCalledTimes(1);
    });
  });

  describe("when maintenance view state has empty webSplashURL", () => {
    it("shouldn't dispatch external push action", () => {
      const dispatchExternalPushAction = jest.fn();
      renderMaintenancePage({
        webSplashURL: "",
        products: [],
        text: {},
        dispatchExternalPushAction,
      });

      expect(dispatchExternalPushAction).not.toHaveBeenCalled();
    });

    it("should display provided text with twitter when twitter url is supplied", () => {
      const { queryByText } = renderMaintenancePage({
        webSplashURL: "",
        products: [],
        text: {
          pageTitle: "the title",
          description: "the description",
          productsTitle: "the products",
          twitter: "the twitter",
        },
        twitterURL: "https://twitter.com",
      });

      expect(queryByText("the title")).not.toBeNull();
      expect(queryByText("the description")).not.toBeNull();
      expect(queryByText("the products")).not.toBeNull();
      expect(queryByText("the twitter")).not.toBeNull();
    });

    it("should display provided text without twitter when no twitter url is supplied", () => {
      const { queryByText } = renderMaintenancePage({
        webSplashURL: "",
        products: [],
        text: {
          pageTitle: "the title",
          description: "the description",
          productsTitle: "the products",
          twitter: "the twitter",
        },
      });

      expect(queryByText("the title")).not.toBeNull();
      expect(queryByText("the description")).not.toBeNull();
      expect(queryByText("the products")).not.toBeNull();
      expect(queryByText("the twitter")).toBeNull();
    });

    describe("when product status is OK", () => {
      it("should call QuickLink for each product", () => {
        renderMaintenancePage({
          webSplashURL: "",
          products: [
            { product: "sportsbook", status: "OK", title: "sportsbook" },
            { product: "exchange", status: "OK", title: "exchange" },
          ],
          text: {},
        });

        expect(QuickLink).toHaveBeenNthCalledWith(
          1,
          {
            item: { text: "sportsbook" },
            icon: expect.anything(),
            onLinkClick: expect.any(Function),
            roundCorners: { topLeft: true, topRight: true, bottomLeft: false, bottomRight: false },
          },
          undefined,
        );
        expect(QuickLink).toHaveBeenNthCalledWith(
          2,
          {
            item: { text: "exchange" },
            icon: expect.anything(),
            onLinkClick: expect.any(Function),
            roundCorners: { topLeft: false, topRight: false, bottomLeft: true, bottomRight: true },
          },
          undefined,
        );
        expect(QuickLink).toHaveBeenCalledTimes(2);
      });

      it("QuickLink onLinkClick should call dispatchToProduct", () => {
        const dispatchToProduct = jest.fn();
        renderMaintenancePage({
          webSplashURL: "",
          products: [{ product: "sportsbook", status: "OK", viewLink: { viewUrn: "sbk:urn", viewUrl: "sbk url" } }],
          text: {},
          dispatchToProduct,
        });

        QuickLink.mock.calls[0][0].onLinkClick();

        expect(dispatchToProduct).toHaveBeenCalledWith({
          product: "sportsbook",
          viewLink: { viewUrn: "sbk:urn", viewUrl: "sbk url" },
        });
        expect(dispatchToProduct).toHaveBeenCalledTimes(1);
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
            color: "var(--messaging-success-icon-default)",
          },
          undefined,
        );
        expect(GenericIcon).toHaveBeenNthCalledWith(
          2,
          {
            name: SystemIconName.NOTIFICATION_SUCCESS,
            color: "var(--messaging-success-icon-default)",
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
          text: {},
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
        it("QuickLink onLinkClick should call dispatchToEMS", () => {
          const dispatchToEMS = jest.fn();
          renderMaintenancePage({
            webSplashURL: "",
            products: [{ product: "exchange", status: "OK", viewLink: { viewUrn: "exc:urn", viewUrl: "exc url" } }],
            isExchangeEnabled: false,
            dispatchToEMS,
          });

          QuickLink.mock.calls[0][0].onLinkClick();

          expect(dispatchToEMS).toHaveBeenCalledWith();
          expect(dispatchToEMS).toHaveBeenCalledTimes(1);
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
            onLinkClick: undefined,
            roundCorners: { topLeft: true, topRight: true, bottomLeft: false, bottomRight: false },
          },
          undefined,
        );
        expect(QuickLink).toHaveBeenNthCalledWith(
          2,
          {
            item: { text: "exchange unavailable" },
            icon: expect.anything(),
            onLinkClick: undefined,
            roundCorners: { topLeft: false, topRight: false, bottomLeft: true, bottomRight: true },
          },
          undefined,
        );
        expect(QuickLink).toHaveBeenCalledTimes(2);
      });

      it("should call GenericIcon with default props", () => {
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
            color: "var(--quick-link-primary-default-icon-error-colour)",
          },
          undefined,
        );
        expect(GenericIcon).toHaveBeenNthCalledWith(
          2,
          {
            name: SystemIconName.NOTIFICATION_WARNING,
            color: "var(--quick-link-primary-default-icon-error-colour)",
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
          text: {},
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

    it("should have an iframe for twitter when twitter url is supplied", () => {
      const { queryByTitle } = renderMaintenancePage({
        webSplashURL: "",
        twitterURL: "https://someiframe.betfair.com",
        products: [],
        text: {
          iframeTitle: "Twitter Timeline",
        },
      });

      const twitterIframe = queryByTitle("Twitter Timeline");

      expect(twitterIframe).not.toBeNull();
      expect(twitterIframe.tagName).toBe("IFRAME");
      expect(twitterIframe.getAttribute("src")).toEqual("https://someiframe.betfair.com");
    });

    it("should call ConnectedRegulatoryCard", () => {
      renderMaintenancePage({
        webSplashURL: "",
        products: [],
        text: {},
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
