/* eslint-disable no-underscore-dangle */

import { PartialItem } from "../../../../../state/layout/views/PartialItem.types";
import { AllCompetitionsViewFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";
import { AllCompetitionsView } from "../../../../../state/layout/views/View.types";

const normalizeAllCompetitionsViewFragmentIntoAllCompetitionsView = (
  allCompetitionsView: AllCompetitionsViewFragment,
): TransformedFragment<AllCompetitionsView> => {
  const { urn, partialItems, url, title, __typename, xsellBar } = allCompetitionsView;

  return {
    data: {
      typename: __typename,
      urn,
      title: title || undefined,
      url,
      xsellBar,
      items: partialItems.edges.reduce((acc: PartialItem[], item) => {
        if (item?.node && "urn" in item.node) {
          return [...acc, { urn: item.node.urn, typename: item.node.__typename }];
        }

        return acc;
      }, []),
    },
  };
};

export default normalizeAllCompetitionsViewFragmentIntoAllCompetitionsView;
