/* eslint-disable no-underscore-dangle */

// TODO: to add typename after engine is implemented
// type RunnerViewWithTypename = RunnerView & { typename: "RunnerView" };
import { RunnerViewFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { PartialItem } from "../../../../../state/layout/views/PartialItem.types";
import { RunnerView } from "../../../../../state/layout/views/View.types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeRunnerViewFragmentIntoRunnerView = (runnerView: RunnerViewFragment): TransformedFragment<RunnerView> => {
  const { urn, items, url, title, __typename, xsellBar } = runnerView;

  return {
    data: {
      typename: __typename,
      urn,
      url,
      xsellBar,
      title: title || "",
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

export default normalizeRunnerViewFragmentIntoRunnerView;
