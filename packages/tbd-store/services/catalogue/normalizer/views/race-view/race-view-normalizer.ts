/* eslint-disable no-underscore-dangle */
import { PartialItem } from "../../../../../state/layout/views/PartialItem.types";
import { RaceViewFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";
import { RaceView } from "../../../../../state/layout/views/View.types";

const normalizeRaceViewFragmentIntoRaceView = (raceView: RaceViewFragment): TransformedFragment<RaceView> => {
  const { urn, partialItems, canonicalUrl, url, race, __typename, xsellBar } = raceView;

  return {
    data: {
      typename: __typename,
      urn,
      canonicalUrl,
      url,
      race: race.urn,
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

export default normalizeRaceViewFragmentIntoRaceView;
