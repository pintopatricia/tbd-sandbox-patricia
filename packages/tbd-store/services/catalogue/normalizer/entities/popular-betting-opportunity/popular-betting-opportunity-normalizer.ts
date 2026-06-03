/* eslint-disable no-underscore-dangle */
import { PopularBettingOpportunity } from "../../../../../state";
import { PopularBettingOpportunityFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizePopularBettingOpportunityFragmentIntoPopularBettingOpportunity = (
  fragment: PopularBettingOpportunityFragment,
): TransformedFragment<PopularBettingOpportunity> => {
  const { __typename, urn, id, count, selections, displayName, type } = fragment;

  return {
    data: {
      typename: __typename,
      id,
      urn,
      count,
      selections: selections.map((selection) => ({
        marketUrn: selection.market.urn,
        runnerUrn: selection.runner.runnerURN,
        silkUrl: selection.raceRunner?.details.silk || undefined,
        jockeyName: selection.raceRunner?.details.jockeyName || undefined,
        trainerName: selection.raceRunner?.details.trainerName || undefined,
      })),
      name: displayName || undefined,
      type,
    },
  };
};

export default normalizePopularBettingOpportunityFragmentIntoPopularBettingOpportunity;
