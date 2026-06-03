/* eslint-disable no-underscore-dangle */
import { PartialItem } from "../../../../../state/layout/views/PartialItem.types";
import { TransformedFragment } from "../../Normalizer.types";
import { EventViewFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { EventView } from "../../../../../state/layout/views/View.types";

const normalizeEventViewFragmentIntoEventView = (eventView: EventViewFragment): TransformedFragment<EventView> => {
  const { urn, partialItems, canonicalUrl, url, sportevent, __typename, xsellBar } = eventView;

  return {
    data: {
      typename: __typename,
      urn,
      url,
      canonicalUrl,
      xsellBar,
      sportevent: sportevent.urn,
      items: partialItems.edges.reduce((acc: PartialItem[], item) => {
        if (item?.node && "urn" in item.node) {
          const partialItem: PartialItem = {
            urn: item.node.urn,
            typename: item.node.__typename,
            theme: item.theme,
            ...(item.node.__typename === "FixtureCard" && item.node.red7Scoreboard
              ? { red7Scoreboard: item.node.red7Scoreboard }
              : {}),
          };

          return [...acc, partialItem];
        }

        return acc;
      }, []),
    },
  };
};

export default normalizeEventViewFragmentIntoEventView;
