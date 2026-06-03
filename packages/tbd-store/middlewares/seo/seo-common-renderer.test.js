/**
 * @jest-environment jsdom
 */

import {
  renderCanonicalUrlLinkElement,
  renderRedirectMetaElements,
  renderSportEventsScriptElement,
  renderFAQScriptElement,
  setMetadataElements,
  renderNotFoundViewMetaElements,
} from "./seo-common-renderer";

const BASE_URL = "http://localhost";

describe("SEO Common Renderers", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    document.head.innerHTML = "";
    document.body.innerHTML = "";
  });

  describe("Set title, meta description and robots meta tags", () => {
    describe("when metadata is not defined", () => {
      it("should not set anything", () => {
        setMetadataElements(null);
        expect(document.title).toBe("");
      });
    });

    describe("when there is metaTitle", () => {
      it("should set the title to the document", () => {
        setMetadataElements({ metaTitle: "Mock title", metaDescription: "" });
        expect(document.title).toBe("Mock title");
      });
    });

    describe("when there is metaDescription", () => {
      let descriptionTag;
      beforeEach(() => {
        const head = document.getElementsByTagName("head")[0];
        descriptionTag = document.createElement("meta");
        descriptionTag.name = "description";
        head.appendChild(descriptionTag);
      });

      it("should set the description on the meta", () => {
        setMetadataElements({ metaTitle: "", metaDescription: "Mock description" });
        expect(descriptionTag.getAttribute("content")).toBe("Mock description");
      });
    });

    describe("when there are robots meta tags", () => {
      describe("when there are only indexing robots meta tags", () => {
        it("should only set the indexing robots meta tags", () => {
          setMetadataElements({
            metaTitle: "Title",
            metaDescription: "Description",
            robotsMetaTags: {
              noIndex: true,
              noFollow: false,
            },
          });
          const robotsIndexTag = document.querySelector(
            ":is([name=robots][content*=noindex], [name=robots][content*=nofollow])",
          );
          const robotsUnavailableAfterTag = document.querySelector("[name=robots][content*=unavailable_after]");

          expect(robotsIndexTag.getAttribute("content")).toBe("noindex");
          expect(robotsUnavailableAfterTag).toBe(null);
        });
      });

      describe("when there is only unavailable_after robots meta tag", () => {
        it("should only set the unavailable_after robots meta tag", () => {
          setMetadataElements({
            metaTitle: "Title",
            metaDescription: "Description",
            robotsMetaTags: {
              noIndex: false,
              noFollow: false,
              unavailableAfter: "2023-11-01T01:30:29.000Z",
            },
          });
          const robotsIndexTag = document.querySelector(
            ":is([name=robots][content*=noindex], [name=robots][content*=nofollow])",
          );
          const robotsUnavailableAfterTag = document.querySelector("[name=robots][content*=unavailable_after]");

          expect(robotsIndexTag).toBe(null);
          expect(robotsUnavailableAfterTag.getAttribute("content")).toBe("unavailable_after: 2023-11-01T01:30:29.000Z");
        });
      });

      describe("when there are both indexing and unavailable_after robots meta tags", () => {
        it("should set both indexing and unavailable_after robots meta tags", () => {
          setMetadataElements({
            metaTitle: "Title",
            metaDescription: "Description",
            robotsMetaTags: {
              noIndex: true,
              noFollow: true,
              unavailableAfter: "2023-11-01T01:30:29.000Z",
            },
          });
          const robotsIndexTag = document.querySelector(
            ":is([name=robots][content*=noindex], [name=robots][content*=nofollow])",
          );
          const robotsUnavailableAfterTag = document.querySelector("[name=robots][content*=unavailable_after]");

          expect(robotsIndexTag.getAttribute("content")).toBe("noindex, nofollow");
          expect(robotsUnavailableAfterTag.getAttribute("content")).toBe("unavailable_after: 2023-11-01T01:30:29.000Z");
        });
      });
    });
  });

  describe("Canonical URL Link Tag Render", () => {
    describe("when a valid canonical url is provided", () => {
      it("should render link tag with proper url in it", () => {
        const canonicalUrl =
          "/exchange/plus/en/soccer/uefa-women's-champions-league/gintra-(w)-v-valerenga-(w)-betting-30133495";

        renderCanonicalUrlLinkElement(canonicalUrl);
        const renderedCanonicalLinkResult = document.querySelector("link")?.getAttribute("href");

        expect(renderedCanonicalLinkResult).toEqual(
          `${BASE_URL}/exchange/plus/en/soccer/uefa-women's-champions-league/gintra-(w)-v-valerenga-(w)-betting-30133495`,
        );
      });
    });

    describe("when no valid canonical url is provided", () => {
      it("should not render anything", () => {
        const canonicalUrl = "";

        renderCanonicalUrlLinkElement(canonicalUrl);
        const renderedCanonicalLinkResult = document.querySelector("link");

        expect(renderedCanonicalLinkResult).toEqual(null);
      });
    });
  });

  describe("Redirect URL Meta Tag Render", () => {
    describe("when a valid redirect url is provided", () => {
      it("should render meta tag with proper url in it", () => {
        const redirectUrl = "football/english-premier-league/competition:10932509";

        renderRedirectMetaElements("/betting/", redirectUrl);
        const renderedMetaTags = document.querySelectorAll("meta");

        const [statusCodeMetaTag, headerMetaTag] = renderedMetaTags;

        expect(statusCodeMetaTag.content).toBe("301");
        expect(statusCodeMetaTag.name).toBe("prerender-status-code");
        expect(headerMetaTag.content).toBe(
          `Location: ${BASE_URL}/betting/football/english-premier-league/competition:10932509`,
        );
        expect(headerMetaTag.name).toBe("prerender-header");
      });
    });

    describe("when redirect url is forward slash (/)", () => {
      it("should render base url without double traling slash", () => {
        const redirectUrl = "/";

        renderRedirectMetaElements("/betting/", redirectUrl);
        const renderedMetaTagsResult = document.querySelectorAll("meta");

        const [statusCodeMetaTag, headerMetaTag] = renderedMetaTagsResult;

        expect(statusCodeMetaTag.content).toBe("301");
        expect(statusCodeMetaTag.name).toBe("prerender-status-code");
        expect(headerMetaTag.content).toBe(`Location: ${BASE_URL}/betting/`);
        expect(headerMetaTag.name).toBe("prerender-header");
      });
    });

    describe("when no redirect url is provided", () => {
      it("should render base url", () => {
        const redirectUrl = "";

        renderRedirectMetaElements("/betting/", redirectUrl);
        const renderedMetaTagsResult = document.querySelectorAll("meta");

        const [statusCodeMetaTag, headerMetaTag] = renderedMetaTagsResult;

        expect(statusCodeMetaTag.content).toBe("301");
        expect(statusCodeMetaTag.name).toBe("prerender-status-code");
        expect(headerMetaTag.content).toBe(`Location: ${BASE_URL}/betting/`);
        expect(headerMetaTag.name).toBe("prerender-header");
      });
    });
  });

  describe("Not Found URL Meta Tag Render", () => {
    it("should render proper meta tag", () => {
      renderNotFoundViewMetaElements();
      const renderedMetaTags = document.querySelectorAll("meta");

      const [statusCodeMetaTag] = renderedMetaTags;

      const areMetaTagsValid =
        statusCodeMetaTag.content === "404" && statusCodeMetaTag.name === "prerender-status-code";

      expect(areMetaTagsValid).toBeTruthy();
    });

    describe("when renderNotFoundViewMetaElements is called twice", () => {
      it("should only have one meta tag element", () => {
        renderNotFoundViewMetaElements();
        const renderedMetaTags = document.querySelectorAll("meta");

        renderNotFoundViewMetaElements();
        expect(renderedMetaTags).toHaveLength(1);
      });
    });
  });

  describe("SportEvents Structured Data Script Tag Render", () => {
    describe("when a valid sport event is provided", () => {
      it("should render script with proper json in it", () => {
        const events = [
          {
            name: "ZenSt Petersburg v Arsenal Tula",
            startDate: "2020-09-14T15:30:00.000Z",
            endDate: "2020-09-16T00:30:00.000Z",
            eventURL: "/soccer/russian-premier-league/zenit-st-petersburg-v-arsenal-tula/e-29988726",
            competitionName: "Russian Premier League",
          },
        ];

        renderSportEventsScriptElement(events);
        const renderSportEventsResults = document.querySelector("script")?.innerHTML;

        expect(renderSportEventsResults).toEqual(
          `[{"@context":"https://schema.org","@type":"SportsEvent","name":"ZenSt Petersburg v Arsenal Tula","startDate":"2020-09-14T15:30:00.000Z","endDate":"2020-09-16T00:30:00.000Z","url":"${BASE_URL}/soccer/russian-premier-league/zenit-st-petersburg-v-arsenal-tula/e-29988726","location":{"@type":"Place","name":"Russian Premier League","address":{"@type":"PostalAddress","name":"Russian Premier League"}}}]`,
        );
      });
    });

    describe("when no valid sport event is provided", () => {
      it("should not render anything", () => {
        renderSportEventsScriptElement([]);
        const renderSportEventsResults = document.querySelector("script");

        expect(renderSportEventsResults).toEqual(null);
      });
    });
  });

  describe("FAQ Structured Data Script Tag Render", () => {
    describe("when valid faq data is provided", () => {
      it("should render script with a proper json in it", () => {
        const faqData = [
          { name: "Title 1", text: "Some text" },
          { name: "Title 2", text: "Another text" },
        ];

        renderFAQScriptElement(faqData);
        const renderedFaqResult = document.querySelector("script")?.innerHTML;

        expect(renderedFaqResult).toEqual(
          '{"@context":"https://schema.org","@type":"FAQPage","mainEntity":[{"@type":"Question","name":"Title 1","acceptedAnswer":{"@type":"Answer","text":"Some text"}},{"@type":"Question","name":"Title 2","acceptedAnswer":{"@type":"Answer","text":"Another text"}}]}',
        );
      });
    });

    describe("when no valid faq data is provided", () => {
      it("should not render anything", () => {
        renderFAQScriptElement([]);
        const renderedFaqResult = document.querySelector("script");

        expect(renderedFaqResult).toEqual(null);
      });
    });
  });
});
