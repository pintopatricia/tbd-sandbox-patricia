/**
 * @jest-environment jsdom
 */

import { FETCH_CATALOGUE_SUCCESS } from "../../actions/catalogue";
import { createSeoCommonMiddleware } from "./seo-common";
import { resolveSeoMetadata } from "./seo-metadata-resolver";
import { resolveFAQStructuredData, resolveSeoStructuredData } from "./seo-structured-data-resolver";
import {
  setMetadataElements,
  renderSportEventsScriptElement,
  renderFAQScriptElement,
  renderNotFoundViewMetaElements,
  renderCanonicalUrlLinkElement,
} from "./seo-common-renderer";
import { resolveSeoCanonicalUrl } from "./seo-canonical-url-resolver";
import { PUSH } from "../../actions/router";
import { UI__NOT_FOUND_VIEW_LOADED } from "../../actions/navigation";
import { SEO__VIEW_LOADED } from "../../actions/seo";

jest.mock("./seo-metadata-resolver");
jest.mock("./seo-structured-data-resolver");
jest.mock("./seo-canonical-url-resolver");
jest.mock("./seo-common-renderer");
jest.mock("./seo-canonical-url-resolver");
jest.mock("i18next", () => ({
  t: jest.fn((key) => key),
}));

const userdetails = { localeCode: "en" };

const router = {
  currentUrn: "ppb:tbd:view:competition:117",
  currentView: "ppb:tbd:view:competition",
};

const state = {
  entities: { userdetails },
  layouts: { views: {} },
  router,
};

global.navigator = Object.create(navigator);
Object.defineProperty(global.navigator, "vendor", {
  value: "Google Inc.",
  writable: true,
});

function setup(action, nextSpy = jest.fn(), dispatchSpy = jest.fn()) {
  const store = {
    getState: jest.fn().mockReturnValue(state),
    dispatch: dispatchSpy,
  };

  return createSeoCommonMiddleware(store)(nextSpy)(action);
}

describe("SEO Common Middleware", () => {
  beforeEach(jest.clearAllMocks);

  describe("Metadata Middleware", () => {
    const fetchCatalogueSuccessAction = {
      type: FETCH_CATALOGUE_SUCCESS,
      payload: { data: {} },
    };

    const notFoundViewLoadedAction = {
      type: UI__NOT_FOUND_VIEW_LOADED,
    };

    describe("when action type is FETCH_CATALOGUE_SUCCESS", () => {
      describe("when seoInput is defined", () => {
        beforeEach(async () => {
          resolveSeoMetadata.mockReturnValue({
            metaTitle: "Mock title",
            metaDescription: "Mock description",
            robotsMetaTags: {
              noIndex: false,
              noFollow: false,
            },
          });
          resolveSeoStructuredData.mockReturnValue("resolveSeoStructuredData");
          resolveFAQStructuredData.mockReturnValue("resolveFAQStructuredData");
          resolveSeoCanonicalUrl.mockReturnValue("resolveSeoCanonicalUrl");

          await setup({ type: PUSH });
          await setup(fetchCatalogueSuccessAction);
        });

        it("should render seo elements", () => {
          expect(setMetadataElements).toHaveBeenCalledWith({
            metaTitle: "Mock title",
            metaDescription: "Mock description",
            robotsMetaTags: {
              noIndex: false,
              noFollow: false,
            },
          });
          expect(renderSportEventsScriptElement).toHaveBeenCalledWith("resolveSeoStructuredData");
          expect(renderFAQScriptElement).toHaveBeenCalledWith("resolveFAQStructuredData");
          expect(renderCanonicalUrlLinkElement).toHaveBeenCalledWith("resolveSeoCanonicalUrl");
        });
      });

      describe("when resolveSeoMetadata returns null", () => {
        beforeEach(async () => {
          resolveSeoMetadata.mockReturnValue(null);
          await setup({ type: PUSH });
          setMetadataElements.mockClear();
          await setup(fetchCatalogueSuccessAction);
        });

        it("should not re-paint metadata (defaults from PUSH remain)", () => {
          expect(setMetadataElements).not.toHaveBeenCalled();
        });
      });

      describe("when is safari browser", () => {
        beforeEach(async () => {
          resolveSeoMetadata.mockReturnValue({
            metaTitle: "Mock title",
            metaDescription: "Mock description",
            robotsMetaTags: {
              noIndex: false,
              noFollow: false,
            },
          });
          resolveSeoStructuredData.mockReturnValue("resolveSeoStructuredData");
          resolveFAQStructuredData.mockReturnValue("resolveFAQStructuredData");
          resolveSeoCanonicalUrl.mockReturnValue("resolveSeoCanonicalUrl");
          Object.defineProperty(global.navigator, "vendor", {
            value: "Apple Computer, Inc.",
            writable: true,
          });
        });

        it("should not render canonical link", async () => {
          await setup({ type: PUSH });
          await setup(fetchCatalogueSuccessAction);

          expect(renderCanonicalUrlLinkElement).not.toHaveBeenCalled();
        });
      });
    });

    describe("when action is UI__NOT_FOUND_VIEW_LOADED", () => {
      beforeEach(() => {
        setup({ type: UI__NOT_FOUND_VIEW_LOADED });
        setup(notFoundViewLoadedAction);
      });

      it("should call renderNotFoundViewMetaElements", () => {
        expect(renderNotFoundViewMetaElements).toHaveBeenCalled();
      });
    });

    describe("when action is SEO__VIEW_LOADED", () => {
      const viewLoadedAction = {
        type: SEO__VIEW_LOADED,
        payload: {
          metaTitle: "1m4f Maiden Stakes - Newmarket - 2026-04-27T15:30:00.000Z - I18N.META.TITLE",
        },
      };

      beforeEach(async () => {
        await setup({ type: PUSH });
        await setup(viewLoadedAction);
      });

      it("should set metadata elements with the payload overrides merged into the default metadata", () => {
        expect(setMetadataElements).toHaveBeenCalledWith({
          metaTitle: "1m4f Maiden Stakes - Newmarket - 2026-04-27T15:30:00.000Z - I18N.META.TITLE",
          metaDescription: "I18N.META.DESCRIPTION",
          robotsMetaTags: {
            noIndex: false,
            noFollow: false,
            unavailableAfter: "",
          },
        });
      });
    });

    describe("when action type is PUSH", () => {
      beforeEach(async () => {
        await setup({ type: PUSH });
      });

      it("should reset document metadata to the defaults so previous-view titles do not persist", () => {
        expect(setMetadataElements).toHaveBeenCalledWith({
          metaTitle: "I18N.META.TITLE",
          metaDescription: "I18N.META.DESCRIPTION",
          robotsMetaTags: {
            noIndex: false,
            noFollow: false,
            unavailableAfter: "",
          },
        });
      });
    });
  });
});
