/* eslint-disable no-underscore-dangle */
import { TransformedFragment } from "../../Normalizer.types";
import { SportViewFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { SportView } from "../../../../../state/layout/views/View.types";
import { PartialItem } from "../../../../../state/layout/views/PartialItem.types";

const normalizeSportViewFragmentIntoSportView = (sportView: SportViewFragment): TransformedFragment<SportView> => {
  const { urn, partialItems, url, sport, title, canonicalUrl, __typename, xsellBar } = sportView;

  return {
    data: {
      typename: __typename,
      urn,
      url,
      title: title || undefined,
      canonicalUrl,
      sport: sport.urn,
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

export default normalizeSportViewFragmentIntoSportView;
