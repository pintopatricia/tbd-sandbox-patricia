import { EntityType } from "@ppb/tbd-urn-codecs";
import { ViewQuery } from "../../clients/catalogue/catalogue-response-types";
import { normalizerEngine } from "./normalizer/normalizer-engine";
import { TransformedLayout } from "./catalogue-types";
import { getApolloCacheFeeder } from "../../config/apollo-cache-feeder";
import { getApolloCacheObserver } from "../../config/apollo-cache-observer";

function isEntityTypeName(name: string): name is keyof typeof EntityType {
  return name in EntityType;
}

/**
 * Transforms a graphql view into a transformed layout
 *
 * @param viewQuery  The view query response
 * @returns The transformed layout
 */
export function buildViewResult(viewQuery: ViewQuery): TransformedLayout {
  if (!viewQuery.View || !("urn" in viewQuery.View)) {
    return {
      data: {},
    };
  }

  // New normalizer (not all cards migrated yet)
  const normalizerResult = normalizerEngine(viewQuery.View);

  // Find the current view and default to null if it is not found
  const currentView = isEntityTypeName(viewQuery.View.__typename) ? EntityType[viewQuery.View.__typename] : null;

  // Monkey patching results with router
  const router = {
    currentUrn: viewQuery.View.urn,
    currentUrl: viewQuery.View.url,
    currentView,
    category: "category" in viewQuery.View ? viewQuery.View.category : null,
  };

  const apolloCacheFeeder = getApolloCacheFeeder();
  if (apolloCacheFeeder) {
    apolloCacheFeeder(normalizerResult);
  }

  const apolloCacheObserver = getApolloCacheObserver();
  if (apolloCacheObserver) {
    apolloCacheObserver(normalizerResult);
  }

  return {
    data: normalizerResult,
    router,
  };
}
