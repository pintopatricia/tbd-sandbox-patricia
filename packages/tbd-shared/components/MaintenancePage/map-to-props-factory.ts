import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import { Dispatch } from "redux";

import URN from "@ppb/tbd-store/state/layout/URN";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { createViewByURNSelector } from "@ppb/tbd-store/state/layout/views/view-selectors";
import { EXTERNAL_PUSH, ExternalPushAction } from "@ppb/tbd-store/actions/router";
import { MaintenanceToProduct, UI__MAINTENANCE_TO_PRODUCT } from "@ppb/tbd-store/actions/navigation";
import { FetchCatalogueAction, FETCH_CATALOGUE } from "@ppb/tbd-store/actions/catalogue";
import { getIsExchangeEnabled } from "@ppb/tbd-store/state/boot/boot-selectors";
import { MaintenanceProduct, MaintenanceViews } from "@ppb/tbd-store/state/layout/views/View.types";
import { RoundCorners } from "@ppb/the-wall-common/types";
import { i18n } from "../../helpers/i18n";
import { TranslationKey } from "../../translations/keys";
import { getEndpoint } from "../../config/endpoints";

export type ContainerProps = { urn: string };

export type Product = {
  product: MaintenanceProduct["product"];
  status: MaintenanceProduct["status"];
  viewLink: MaintenanceProduct["viewLink"];
  title: string;
  roundCorners?: RoundCorners;
};

export type StateProps = {
  webSplashURL: string;
  twitterURL: string | null;
  products: Product[];
  isExchangeEnabled: boolean;
  text: {
    refreshButton: string;
    pageTitle: string;
    description: string;
    productsTitle: string;
    twitter: string;
    iframeTitle: string;
  };
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getMaintenanceViewbyURN = createViewByURNSelector<MaintenanceViews, URN>();

  const text = {
    refreshButton: i18n({ key: "I18N.PROMO.REFRESH" }),
    pageTitle: i18n({ key: "I18N.MAINTENANCE.PAGE_TITLE" }),
    description: i18n({ key: "I18N.MAINTENANCE.DESCRIPTION" }),
    productsTitle: i18n({ key: "I18N.MAINTENANCE.PRODUCTS_TITLE" }),
    twitter: i18n({ key: "I18N.MAINTENANCE.TWITTER" }),
    iframeTitle: i18n({ key: "I18N.MAINTENANCE.IFRAME_TITLE" }),
  };

  return (state: ApplicationState, ownProps: ContainerProps): StateProps => {
    const maintenanceView = getMaintenanceViewbyURN(state.layouts.views.maintenance, ownProps.urn);
    if (!maintenanceView) {
      return {
        webSplashURL: "",
        twitterURL: "",
        products: [],
        isExchangeEnabled: false,
        text,
      };
    }

    const { redirectUrl, products, twitterUrl } = maintenanceView;

    const enhancedProducts = products.map((product) => {
      const productName = i18n({ key: product.name as keyof TranslationKey });
      return {
        product: product.product,
        status: product.status,
        viewLink: product.viewLink,
        title:
          product.status === "OK"
            ? productName
            : i18n({ key: "I18N.MAINTENANCE.PRODUCT_UNAVAILABLE", interpolationValues: { product: productName } }),
      };
    });

    return {
      webSplashURL: redirectUrl,
      twitterURL: state.entities?.brandSettings?.MAINTENANCE_PAGE_TWITTER_WIDGET ? twitterUrl : null,
      text,
      products: enhancedProducts,
      isExchangeEnabled: getIsExchangeEnabled(state),
    };
  };
};

export type DispatchProps = {
  dispatchExternalPushAction: (url: string) => void;
  dispatchToProduct: (productOptions: Pick<MaintenanceProduct, "product" | "viewLink">) => void;
  dispatchToEMS: () => void;
  dispatchFetchCatalogue: (urn: URN) => void;
};

export const makeMapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (dispatch: Dispatch) => ({
  dispatchExternalPushAction: (url: string): ExternalPushAction =>
    dispatch<ExternalPushAction>({
      type: EXTERNAL_PUSH,
      payload: {
        viewUrn: "",
        viewUrl: url,
      },
    }),
  dispatchToProduct: ({ product, viewLink }) => {
    dispatch<MaintenanceToProduct>({
      type: UI__MAINTENANCE_TO_PRODUCT,
      payload: {
        product,
        viewLink,
      },
    });
  },
  // web only, native uses `navigate`
  dispatchToEMS: () => {
    dispatch<ExternalPushAction>({
      type: EXTERNAL_PUSH,
      payload: {
        viewUrn: "",
        viewUrl: getEndpoint("EXCHANGE_SITE"),
        gtmData: {
          label: "Exchange",
          moduleName: "splash page",
        },
      },
    });
  },
  dispatchFetchCatalogue: (urn: URN) => {
    dispatch<FetchCatalogueAction>({
      type: FETCH_CATALOGUE,
      payload: {
        urn,
        withBottomBar: true,
        withLeftSidebar: true,
      },
    });
  },
});
