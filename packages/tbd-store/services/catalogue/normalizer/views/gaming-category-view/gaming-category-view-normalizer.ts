/* eslint-disable no-underscore-dangle */
import { PartialItem } from "../../../../../state/layout/views/PartialItem.types";
import { TransformedFragment } from "../../Normalizer.types";
import { GamingCategoryViewFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { GamingCategoryView } from "../../../../../state/layout/views/View.types";
import { transformGQLSeoMetadataToSeoMetadata } from "../../../gql-entities-mapper";

const normalizeGamingCategoryViewFragmentIntoGamingCategoryView = (
  gamingCategoryView: GamingCategoryViewFragment,
): TransformedFragment<GamingCategoryView> => {
  const { urn, partialItems, url, __typename, navigationItem, seoMetaData, xsellBar } = gamingCategoryView;

  return {
    data: {
      typename: __typename,
      urn,
      url,
      navigationItem,
      seoMetaData: transformGQLSeoMetadataToSeoMetadata(seoMetaData),
      xsellBar,
      items: partialItems.edges.reduce((acc: PartialItem[], item) => {
        if (item?.node && "urn" in item.node) {
          return [
            ...acc,
            {
              urn: item.node.urn,
              typename: item.node.__typename,
            },
          ];
        }

        return acc;
      }, []),
    },
  };
};

export default normalizeGamingCategoryViewFragmentIntoGamingCategoryView;
