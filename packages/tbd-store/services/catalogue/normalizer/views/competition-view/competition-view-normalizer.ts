/* eslint-disable no-underscore-dangle */
import { PartialItem } from "../../../../../state/layout/views/PartialItem.types";
import { TransformedFragment } from "../../Normalizer.types";
import { CompetitionViewFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { CompetitionView } from "../../../../../state/layout/views/View.types";

const normalizeCompetitionViewFragmentIntoCompetitionView = (
  competitionView: CompetitionViewFragment,
): TransformedFragment<CompetitionView> => {
  const { urn, partialItems, url, title, canonicalUrl, competition, __typename, xsellBar } = competitionView;

  return {
    data: {
      typename: __typename,
      urn,
      url,
      title: title || undefined,
      canonicalUrl,
      competition: competition.urn,
      xsellBar,
      items: partialItems.edges.reduce((acc: PartialItem[], item) => {
        if (item?.node && "urn" in item.node) {
          return [
            ...acc,
            {
              urn: item.node.urn,
              typename: item.node.__typename,
              theme: item.theme,
            },
          ];
        }

        return acc;
      }, []),
    },
  };
};

export default normalizeCompetitionViewFragmentIntoCompetitionView;
