import { ApplicationState } from "../../state/ApplicationState.types";
import { NormalizersResult } from "../../services/catalogue/normalizer/normalizer-engine";
import { CommonView } from "../../state/layout/views/View.types";

const findViewByUrn = (urn: string, views: CommonView[] = []): CommonView | undefined =>
  views.find((view) => view.urn === urn);

const findDataViewByUrn = (data: NormalizersResult, urn: string): CommonView | undefined => {
  const candidateViews = [
    data.GenericView,
    data.SportView,
    data.CompetitionView,
    data.EventView,
    data.MarketView,
    data.RaceView,
  ];

  for (let i = 0; i < candidateViews.length; i += 1) {
    const view = findViewByUrn(urn, candidateViews[i]);
    if (view) {
      return view;
    }
  }

  return undefined;
};

export const resolveSeoCanonicalUrl = (state: ApplicationState, data: NormalizersResult): string | undefined | null => {
  const currentViewURN = state.router.currentUrn;

  if (!currentViewURN) {
    return undefined;
  }

  return findDataViewByUrn(data, currentViewURN)?.canonicalUrl;
};
