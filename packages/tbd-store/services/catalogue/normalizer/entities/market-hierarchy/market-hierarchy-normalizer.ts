import { Hierarchy } from "../../../../../state/entities";
import { MarketHierarchyFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeMarketHierarchyFragmentIntoMarketHierarchy = (
  marketHierarchy: MarketHierarchyFragment,
): TransformedFragment<Hierarchy> => {
  // eslint-disable-next-line no-underscore-dangle
  switch (marketHierarchy.__typename) {
    case "RaceHierarchy":
      return {
        data: {
          race: marketHierarchy.race.urn,
          meeting: marketHierarchy.meeting.urn,
        },
      };
    case "EventHierarchy":
      return {
        data: {
          sportevent: marketHierarchy.sportevent.urn,
        },
      };
    case "EventCompetitionHierarchy":
      return {
        data: {
          sportevent: marketHierarchy.sportevent.urn,
          competition: marketHierarchy.competition.urn,
        },
      };
    default:
      throw new Error("Unkown Market Hierarchy");
  }
};

export default normalizeMarketHierarchyFragmentIntoMarketHierarchy;
