import { ApplicationState } from "../../state/ApplicationState.types";
import { dataBuildersByCardType, getFAQDataByContentSummaryCard } from "./seo-structured-data-builders";
import { SeoStructuredDataFAQProperties, SeoStructuredDataSportEventProperties } from "./SeoStructuredData.types";
import { getLayoutSnapshot } from "../../state/layout-snapshot";

export const resolveSeoStructuredData = (state: ApplicationState): SeoStructuredDataSportEventProperties[] => {
  const structuredData: SeoStructuredDataSportEventProperties[] = [];
  const cards = getLayoutSnapshot(state.router.currentUrn ?? "") || [];

  Object.entries(cards).forEach(([urn, card]) => {
    const typename = card.typename as keyof typeof dataBuildersByCardType;
    const builder = dataBuildersByCardType[typename];
    const data = builder ? builder(urn, state) : null;

    if (data) {
      structuredData.push(data);
    }
  });

  return structuredData;
};

export const resolveFAQStructuredData = (state: ApplicationState): SeoStructuredDataFAQProperties[] | undefined => {
  const cards = getLayoutSnapshot(state.router.currentUrn ?? "") || [];

  const result = Object.entries(cards).find(([, card]) => {
    if (card.typename === "ContentSummaryCard") {
      return true;
    }

    return false;
  });

  const cardUrn = result?.[0];

  if (!cardUrn) {
    return undefined;
  }

  return getFAQDataByContentSummaryCard(cardUrn, state);
};
