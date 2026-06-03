import { createSelector, Selector } from "reselect";
import { Cards } from "../Card.types";
import { BottomBarTile } from "./BottomBarCard.types";

export const getBottomBarTiles = (bottomBar: Cards["bottombar"]): BottomBarTile[] | undefined => bottomBar?.tiles;

export const createGetBottomBarTilesSelector = (): Selector<Cards["bottombar"], BottomBarTile[]> =>
  createSelector([(bottomBar: Cards["bottombar"]) => bottomBar], (bottomBar) => bottomBar?.tiles || []);

export const createHasProductSwitcherSelector = (): Selector<Cards["bottombar"], boolean | null | undefined> =>
  createSelector(
    [(bottomBar: Cards["bottombar"]) => bottomBar],
    (bottomBar): boolean | null | undefined => bottomBar?.hasProductSwitcher,
  );
