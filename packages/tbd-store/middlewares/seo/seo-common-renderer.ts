import {
  RobotsMetaTags,
  SmdResponse,
} from "@flutter-global/uki-channels-http-clients/src/clients/SeoMetadataService/SeoMetadata";

import { addElementToDOM } from "../../helpers/add-element-to-dom";

import {
  SeoStructuredDataSportEventProperties,
  SeoStructuredDataSportEvent,
  SeoStructuredDataFAQProperties,
} from "./SeoStructuredData.types";
import { SeoMetaDataDefault } from "./SeoMetaData.types";

const domain = `${window.location.protocol}//${window.location.hostname}`;
const headDOMElement = document.getElementsByTagName("head")[0];
const bodyDOMElement = document.getElementsByTagName("body")[0];

const metaDescriptionElement = document.createElement("meta");
metaDescriptionElement.name = "description";

const robotsIndexElement = document.createElement("meta");
robotsIndexElement.name = "robots";

const robotsUnavailableAfterElement = document.createElement("meta");
robotsUnavailableAfterElement.name = "robots";

const metaStatusCodeElement = document.createElement("meta");
metaStatusCodeElement.name = "prerender-status-code";
metaStatusCodeElement.content = "301";

const metaHeaderElement = document.createElement("meta");
metaHeaderElement.name = "prerender-header";

const canonicalUrlLinkElement = document.createElement("link");
canonicalUrlLinkElement.rel = "canonical";

const sportEventsScriptElement = document.createElement("script");
sportEventsScriptElement.type = "application/ld+json";

const faqScriptElement = document.createElement("script");
faqScriptElement.type = "application/ld+json";

const VALID_INDEXING_DIRECTIVES = ["noIndex", "noFollow"];

const renderIndexRobotsMetaElement = (indexingValue: string | undefined): void => {
  if (!indexingValue) {
    return;
  }

  robotsIndexElement.setAttribute("content", indexingValue);

  addElementToDOM(headDOMElement, robotsIndexElement);
};

const renderUnavailableAfterRobotsMetaElement = (unavailableAfterValue: string | undefined): void => {
  if (!unavailableAfterValue) {
    return;
  }

  robotsUnavailableAfterElement.setAttribute("content", `unavailable_after: ${unavailableAfterValue}`);

  addElementToDOM(headDOMElement, robotsUnavailableAfterElement);
};

/**
 * Function that sets the title, meta description and robots meta tags to the HTML document
 * @param {SmdResponse} metadata contains 3 properties: metaTitle - string, metaDescription - string, robotsMetaTags - RobotsMetaTags
 */
export const setMetadataElements = (metadata?: SmdResponse | SeoMetaDataDefault | null): void => {
  if (!metadata) {
    return;
  }

  const { metaTitle, metaDescription, robotsMetaTags } = metadata;
  const descriptionTag = document.querySelector("meta[name=description]");

  if (metaTitle) {
    document.title = metaTitle;
  }

  if (metaDescription) {
    if (descriptionTag) {
      descriptionTag.setAttribute("content", metaDescription);
    } else {
      metaDescriptionElement.setAttribute("content", metaDescription);

      addElementToDOM(headDOMElement, metaDescriptionElement);
    }
  }

  if (robotsMetaTags) {
    const indexRobotsValue = Object.keys(robotsMetaTags)
      .filter((key) => VALID_INDEXING_DIRECTIVES.includes(key) && !!robotsMetaTags[key as keyof RobotsMetaTags])
      .map((key) => key.toLowerCase())
      .join(", ");

    renderIndexRobotsMetaElement(indexRobotsValue);
    renderUnavailableAfterRobotsMetaElement(robotsMetaTags.unavailableAfter);
  }
};

export const renderRedirectMetaElements = (baseHref: string, redirectUrl: string | undefined | null): void => {
  const redirectUrlWithoutTrailingSlash = redirectUrl === "/" ? "" : redirectUrl ?? ""; // this is to ensure that we won't have a double trailing slash for the homepage
  const url = `${domain}${baseHref}${redirectUrlWithoutTrailingSlash}`;

  metaHeaderElement.content = `Location: ${url}`;

  addElementToDOM(headDOMElement, metaStatusCodeElement);
  addElementToDOM(headDOMElement, metaHeaderElement);
};

export const renderNotFoundViewMetaElements = (): void => {
  let found = false;
  document.querySelectorAll("meta").forEach((meta) => {
    if (meta.content === "404") {
      found = true;
    }
  });

  if (found) {
    return;
  }

  const metaNotFoundElement = document.createElement("meta");
  metaNotFoundElement.name = "prerender-status-code";
  metaNotFoundElement.content = "404";

  addElementToDOM(headDOMElement, metaNotFoundElement);
};

export const renderCanonicalUrlLinkElement = (canonicalUrl: string | undefined | null): void => {
  if (!canonicalUrl) {
    return;
  }

  canonicalUrlLinkElement.href = domain + canonicalUrl;

  addElementToDOM(headDOMElement, canonicalUrlLinkElement);
};

export const renderSportEventsScriptElement = (sportEvents: SeoStructuredDataSportEventProperties[]): void => {
  if (!sportEvents?.length) {
    return;
  }

  const baseHref = document.getElementById("tbdBase")?.getAttribute("href") || "";

  const data = sportEvents.map((event: SeoStructuredDataSportEventProperties) => {
    const { name, startDate, endDate, eventURL, competitionName } = event;

    const item: SeoStructuredDataSportEvent = {
      "@context": "https://schema.org",
      "@type": "SportsEvent",
      name,
      startDate,
      endDate,
      url: domain + baseHref + eventURL,
      location: {
        "@type": "Place",
        name: competitionName,
        address: {
          "@type": "PostalAddress",
          name: competitionName,
        },
      },
    };

    return item;
  });

  sportEventsScriptElement.innerHTML = JSON.stringify(data);

  addElementToDOM(bodyDOMElement, sportEventsScriptElement);
};

export const renderFAQScriptElement = (faqData?: SeoStructuredDataFAQProperties[]): void => {
  if (!faqData?.length) {
    return;
  }

  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqData.map((faq) => {
      const { name, text } = faq;

      return {
        "@type": "Question",
        name,
        acceptedAnswer: {
          "@type": "Answer",
          text,
        },
      };
    }),
  };

  faqScriptElement.innerHTML = JSON.stringify(data);

  addElementToDOM(bodyDOMElement, faqScriptElement);
};
