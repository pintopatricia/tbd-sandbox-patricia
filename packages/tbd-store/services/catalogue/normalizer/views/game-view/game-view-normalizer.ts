/* eslint-disable no-underscore-dangle */
import { PartialItem } from "../../../../../state/layout/views/PartialItem.types";
import { TransformedFragment } from "../../Normalizer.types";
import { GameViewFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { GameView } from "../../../../../state/layout/views/View.types";

const normalizeGameViewFragmentIntoGameView = (gameView: GameViewFragment): TransformedFragment<GameView> => {
  const { urn, items, url, __typename, navigationItem, xsellBar } = gameView;

  return {
    data: {
      typename: __typename,
      urn,
      url,
      navigationItem,
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

export default normalizeGameViewFragmentIntoGameView;
