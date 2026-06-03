import { UI__MAINTENANCE_TO_PRODUCT } from "@ppb/tbd-store/actions/navigation";
import { EXTERNAL_PUSH } from "@ppb/tbd-store/actions/router";
import { ProductsOption } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { FETCH_CATALOGUE } from "@ppb/tbd-store/actions/catalogue";
import { getIsExchangeEnabled } from "@ppb/tbd-store/state/boot/boot-selectors";

import { makeMapStateToProps, makeMapDispatchToProps } from "./map-to-props-factory";
import { getEndpoint } from "../../config/endpoints";

const getMaintenanceViewbyURN = jest.fn();

jest.mock("@ppb/tbd-store/state/layout/views/view-selectors", () => ({
  createViewByURNSelector: jest.fn(() => getMaintenanceViewbyURN),
}));

jest.mock("@ppb/tbd-store/state/boot/boot-selectors", () => ({
  getIsExchangeEnabled: jest.fn(),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("../../config/endpoints", () => ({ getEndpoint: jest.fn() }));

beforeEach(jest.clearAllMocks);

describe("makeMapStateToProps", () => {
  const MAINTENANCE_VIEWS = {
    entities: {
      brandSettings: {
        MAINTENANCE_PAGE_TWITTER_WIDGET: true,
      },
    },
    layouts: {
      views: {
        maintenance: {
          fakeMaintenanceViewUrn: {
            urn: "fakeMaintenanceViewUrn",
            redirectUrl: "swa-url",
            twitterUrl: "twitter-url",
            products: [
              {
                product: ProductsOption.sportsbook,
                name: "I18N.SPORTSBOOK",
                status: "OK",
                viewLink: { viewUrn: "sbk urn", viewUrl: "sbk url" },
              },
              {
                product: ProductsOption.exchange,
                name: "I18N.EXCHANGE",
                status: "OK",
                viewLink: { viewUrn: "exc urn", viewUrl: "exc url" },
              },
              {
                product: ProductsOption.games,
                name: "I18N.GAMES",
                status: "SPLASHED",
                viewLink: { viewUrn: "games urn", viewUrl: "games url" },
              },
            ],
          },
        },
      },
    },
  };

  function setup(state, urn) {
    getMaintenanceViewbyURN.mockImplementation((views) => views[urn] || null);

    return makeMapStateToProps()(state, { urn });
  }

  describe("when maintenance view is not on state", () => {
    it("should return default props", () => {
      const props = setup({ layouts: { views: { maintenance: {} } } }, "fakeMaintenanceViewUrn");

      expect(props).toEqual({
        webSplashURL: "",
        twitterURL: "",
        products: [],
        isExchangeEnabled: false,
        text: {
          refreshButton: "I18N.PROMO.REFRESH",
          description: "I18N.MAINTENANCE.DESCRIPTION",
          pageTitle: "I18N.MAINTENANCE.PAGE_TITLE",
          productsTitle: "I18N.MAINTENANCE.PRODUCTS_TITLE",
          twitter: "I18N.MAINTENANCE.TWITTER",
          iframeTitle: "I18N.MAINTENANCE.IFRAME_TITLE",
        },
      });
    });
  });

  describe("when maintenance view is on state", () => {
    it("should call getMaintenanceViewbyURN", () => {
      setup(MAINTENANCE_VIEWS, "fakeMaintenanceViewUrn");

      expect(getMaintenanceViewbyURN).toHaveBeenCalledWith(
        MAINTENANCE_VIEWS.layouts.views.maintenance,
        "fakeMaintenanceViewUrn",
      );
    });

    it("should return expected props", () => {
      getIsExchangeEnabled.mockReturnValueOnce(true);
      const props = setup(MAINTENANCE_VIEWS, "fakeMaintenanceViewUrn");

      expect(props).toEqual({
        webSplashURL: "swa-url",
        twitterURL: "twitter-url",
        products: [
          {
            product: "sportsbook",
            status: "OK",
            title: "I18N.SPORTSBOOK",
            viewLink: { viewUrn: "sbk urn", viewUrl: "sbk url" },
          },
          {
            product: "exchange",
            status: "OK",
            title: "I18N.EXCHANGE",
            viewLink: { viewUrn: "exc urn", viewUrl: "exc url" },
          },
          {
            product: "games",
            status: "SPLASHED",
            title: "I18N.MAINTENANCE.PRODUCT_UNAVAILABLE",
            viewLink: { viewUrn: "games urn", viewUrl: "games url" },
          },
        ],
        isExchangeEnabled: true,
        text: {
          refreshButton: "I18N.PROMO.REFRESH",
          description: "I18N.MAINTENANCE.DESCRIPTION",
          pageTitle: "I18N.MAINTENANCE.PAGE_TITLE",
          productsTitle: "I18N.MAINTENANCE.PRODUCTS_TITLE",
          twitter: "I18N.MAINTENANCE.TWITTER",
          iframeTitle: "I18N.MAINTENANCE.IFRAME_TITLE",
        },
      });
    });

    it("should suppress twitterURL if brand settings is not available", () => {
      const props = setup(
        {
          layouts: {
            views: {
              maintenance: {
                fakeMaintenanceViewUrn: {
                  urn: "fakeMaintenanceViewUrn",
                  redirectUrl: "swa-url",
                  products: [],
                },
              },
            },
          },
        },
        "fakeMaintenanceViewUrn",
      );

      expect(props).toEqual({
        webSplashURL: "swa-url",
        twitterURL: null,
        products: [],
        text: {
          refreshButton: "I18N.PROMO.REFRESH",
          description: "I18N.MAINTENANCE.DESCRIPTION",
          pageTitle: "I18N.MAINTENANCE.PAGE_TITLE",
          productsTitle: "I18N.MAINTENANCE.PRODUCTS_TITLE",
          twitter: "I18N.MAINTENANCE.TWITTER",
          iframeTitle: "I18N.MAINTENANCE.IFRAME_TITLE",
        },
      });
    });

    it("should suppress twitterURL if brand settings MAINTENANCE_PAGE_TWITTER_WIDGET is false", () => {
      const props = setup(
        {
          entities: {
            brandSettings: {
              MAINTENANCE_PAGE_TWITTER_WIDGET: false,
            },
          },
          layouts: {
            views: {
              maintenance: {
                fakeMaintenanceViewUrn: {
                  urn: "fakeMaintenanceViewUrn",
                  redirectUrl: "swa-url",
                  twitterUrl: "twitter-url",
                  products: [],
                },
              },
            },
          },
        },
        "fakeMaintenanceViewUrn",
      );

      expect(props).toEqual({
        webSplashURL: "swa-url",
        twitterURL: null,
        products: [],
        text: {
          refreshButton: "I18N.PROMO.REFRESH",
          description: "I18N.MAINTENANCE.DESCRIPTION",
          pageTitle: "I18N.MAINTENANCE.PAGE_TITLE",
          productsTitle: "I18N.MAINTENANCE.PRODUCTS_TITLE",
          twitter: "I18N.MAINTENANCE.TWITTER",
          iframeTitle: "I18N.MAINTENANCE.IFRAME_TITLE",
        },
      });
    });
  });
});

describe("mapDispatchToProps", () => {
  const dispatchFn = jest.fn();
  const mapDispatchToProps = makeMapDispatchToProps(dispatchFn);

  describe("dispatchExternalPushAction", () => {
    it("should dispatch external push action", () => {
      const { dispatchExternalPushAction } = mapDispatchToProps;
      const path = "external-url";

      dispatchExternalPushAction(path);

      expect(dispatchFn).toHaveBeenCalledWith({
        type: EXTERNAL_PUSH,
        payload: {
          viewUrl: path,
          viewUrn: "",
        },
      });
      expect(dispatchFn).toHaveBeenCalledTimes(1);
    });
  });

  describe("dispatchToProduct", () => {
    it("should dispatch MaintenanceToProduct action", () => {
      const { dispatchToProduct } = mapDispatchToProps;

      dispatchToProduct({
        product: ProductsOption.sportsbook,
        viewLink: { viewUrn: "some urn", viewUrl: "some url" },
      });

      expect(dispatchFn).toHaveBeenCalledWith({
        type: UI__MAINTENANCE_TO_PRODUCT,
        payload: {
          product: ProductsOption.sportsbook,
          viewLink: {
            viewUrn: "some urn",
            viewUrl: "some url",
          },
        },
      });
      expect(dispatchFn).toHaveBeenCalledTimes(1);
    });
  });

  describe("dispatchToEMS", () => {
    it("should dispatch MaintenanceToProduct action", () => {
      getEndpoint.mockReturnValueOnce("betfair.com/exchange/");
      const { dispatchToEMS } = mapDispatchToProps;

      dispatchToEMS();

      expect(dispatchFn).toHaveBeenCalledWith({
        type: EXTERNAL_PUSH,
        payload: {
          viewUrn: "",
          viewUrl: "betfair.com/exchange/",
          gtmData: {
            label: "Exchange",
            moduleName: "splash page",
          },
        },
      });
      expect(dispatchFn).toHaveBeenCalledTimes(1);
    });
  });

  describe("dispatchFetchCatalogue", () => {
    it("should dispatch FetchCatalogue action", () => {
      const { dispatchFetchCatalogue } = mapDispatchToProps;

      dispatchFetchCatalogue("some urn");

      expect(dispatchFn).toHaveBeenCalledWith({
        type: FETCH_CATALOGUE,
        payload: {
          urn: "some urn",
          withBottomBar: true,
          withLeftSidebar: true,
        },
      });
      expect(dispatchFn).toHaveBeenCalledTimes(1);
    });
  });
});
