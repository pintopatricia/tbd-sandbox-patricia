import { BottomBarFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { BottomBar, BottomBarTile } from "../../../../../state/layout/cards/bottom-bar/BottomBarCard.types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeBottomBarFragmentIntoBottomBar = (bottomBar: BottomBarFragment): TransformedFragment<BottomBar> => {
  const tiles = bottomBar.tiles || [];
  const { __typename, hasProductSwitcher } = bottomBar;

  return {
    data: {
      typename: __typename,
      hasProductSwitcher,
      tiles: tiles.reduce((acc: BottomBarTile[], tile) => {
        if (tile && tile.tileType && tile.viewLink) {
          const { tileType, viewLink } = tile;

          acc.push({
            tileType,
            viewLink,
          });
        }

        return acc;
      }, []),
    },
  };
};

export default normalizeBottomBarFragmentIntoBottomBar;
