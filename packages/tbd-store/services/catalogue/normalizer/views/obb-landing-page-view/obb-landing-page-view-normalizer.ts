/* eslint-disable no-underscore-dangle */
import { PartialItem } from "../../../../../state/layout/views/PartialItem.types";
import { TransformedFragment } from "../../Normalizer.types";
import { ObbLandingPageViewFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { ObbLandingPageView } from "../../../../../state/layout/views/View.types";

const normalizeObbLandingPageViewFragmentIntoObbLandingPageView = (
  obbLandingPageView: ObbLandingPageViewFragment,
): TransformedFragment<ObbLandingPageView> => {
  const { urn, items, url, __typename, xsellBar } = obbLandingPageView;

  return {
    data: {
      typename: __typename,
      urn,
      url,
      xsellBar,
      items: items.edges.reduce((acc: PartialItem[], item) => {
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

export default normalizeObbLandingPageViewFragmentIntoObbLandingPageView;
