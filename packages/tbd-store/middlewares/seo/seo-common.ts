import { Middleware } from "redux";
import { SmdResponse } from "@flutter-global/uki-channels-http-clients/src/clients/SeoMetadataService/SeoMetadata";
import i18n from "i18next";
import { ApplicationState } from "../../state/ApplicationState.types";
import {
  renderCanonicalUrlLinkElement,
  renderFAQScriptElement,
  renderNotFoundViewMetaElements,
  renderSportEventsScriptElement,
  setMetadataElements,
} from "./seo-common-renderer";
import { FETCH_CATALOGUE_SUCCESS, FetchCatalogueSuccessAction } from "../../actions/catalogue";
import { UI__NOT_FOUND_VIEW_LOADED, NotFoundViewLoadedAction } from "../../actions/navigation";
import { PUSH, PushAction } from "../../actions/router";
import { SEO__VIEW_LOADED, SeoViewLoadedAction } from "../../actions/seo";
import { SeoStructuredDataFAQProperties, SeoStructuredDataSportEventProperties } from "./SeoStructuredData.types";
import { SeoMetaDataDefault } from "./SeoMetaData.types";

let metaData: SmdResponse | null = null;
let canonicalUrl: string | undefined | null;
let sportEvents: SeoStructuredDataSportEventProperties[];
let faqData: SeoStructuredDataFAQProperties[] | undefined;

type ActionTypes = FetchCatalogueSuccessAction | PushAction | NotFoundViewLoadedAction | SeoViewLoadedAction;

const buildDefaultMetadata = (): SeoMetaDataDefault => ({
  metaTitle: `${i18n.t("I18N.META.TITLE")}`,
  metaDescription: `${i18n.t("I18N.META.DESCRIPTION")}`,
  robotsMetaTags: {
    noIndex: false,
    noFollow: false,
    unavailableAfter: "",
  },
});

export const createSeoCommonMiddleware: Middleware =
  ({ getState }) =>
  (next) =>
  async (action: ActionTypes) => {
    const result = next(action);

    if (action.type === UI__NOT_FOUND_VIEW_LOADED) {
      renderNotFoundViewMetaElements();
    }

    if (action.type === PUSH) {
      metaData = null;
      setMetadataElements(buildDefaultMetadata());
    }

    if (action.type === SEO__VIEW_LOADED) {
      metaData = {
        ...buildDefaultMetadata(),
        ...action.payload,
      };
      setMetadataElements(metaData);
    }

    if (action.type === FETCH_CATALOGUE_SUCCESS) {
      const state: ApplicationState = getState();
      const { data } = action.payload;
      const isSafari = navigator.vendor.match(/apple/i);

      if (!metaData) {
        try {
          const { resolveSeoMetadata } = await import(/* webpackChunkName: "seo-common" */ "./seo-metadata-resolver");

          const resolved = await resolveSeoMetadata(state, data);

          if (resolved) {
            metaData = resolved;
            setMetadataElements(metaData);
          }
        } catch (error) {
          console.warn(error);
        }
      }

      // Do not include canonicalUrl on Safari because of bookmark issue (https://apple.stackexchange.com/questions/347259/why-does-safari-sometimes-bookmark-a-different-url)
      // It bookmarks URL designated in <link rel="canonical"> tag instead of the correct one
      if (!isSafari && !canonicalUrl) {
        try {
          const { resolveSeoCanonicalUrl } = await import(
            /* webpackChunkName: "seo-common" */ "./seo-canonical-url-resolver"
          );

          canonicalUrl = resolveSeoCanonicalUrl(state, data);
          renderCanonicalUrlLinkElement(canonicalUrl);
        } catch (error) {
          console.warn(error);
        }
      }

      if (!sportEvents?.length) {
        try {
          const { resolveSeoStructuredData } = await import(
            /* webpackChunkName: "seo-common" */ "./seo-structured-data-resolver"
          );

          sportEvents = resolveSeoStructuredData(state);
          renderSportEventsScriptElement(sportEvents);
        } catch (error) {
          console.warn(error);
        }
      }

      if (!faqData?.length) {
        try {
          const { resolveFAQStructuredData } = await import(
            /* webpackChunkName: "seo-common" */ "./seo-structured-data-resolver"
          );

          faqData = resolveFAQStructuredData(state);
          renderFAQScriptElement(faqData);
        } catch (error) {
          console.warn(error);
        }
      }
    }

    return result;
  };
