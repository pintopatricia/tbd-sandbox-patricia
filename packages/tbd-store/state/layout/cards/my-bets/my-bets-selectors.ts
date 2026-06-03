import { createSelector, OutputParametricSelector } from "reselect";
import { ApplicationState } from "../../../ApplicationState.types";
import URN from "../../URN";
import { createViewByURNSelector } from "../../views/view-selectors";
import { MyBetsViews } from "../../views/View.types";
import { MyBetsState } from "../MyBets.types";

export const getMyBetsCard = (state: ApplicationState): MyBetsState => state.layouts.cards.mybets;

export const createGetMyBetsFiltersStateSelector = (): OutputParametricSelector<
  ApplicationState,
  MyBetsViews,
  MyBetsState,
  (myBetsState: MyBetsState, myBetsViews: MyBetsViews, myBetsViewUrn: string | null) => MyBetsState
> => {
  const getMyBetsViewByURN = createViewByURNSelector<MyBetsViews, URN>();

  return createSelector(
    [
      (state: ApplicationState) => getMyBetsCard(state),
      (state: ApplicationState) => state.layouts.views.mybets,
      (state: ApplicationState) => state.router.currentUrn,
    ],
    (myBetsState, myBetsViews, myBetsViewUrn) => {
      if (myBetsState.orderTypeFilter && myBetsState.productTypeFilter && myBetsState.viewUrn) {
        return myBetsState;
      }

      if (myBetsState.isHeritageView !== undefined && myBetsState.viewUrn) {
        return myBetsState;
      }

      if (myBetsViewUrn) {
        const myBetsView = getMyBetsViewByURN(myBetsViews, myBetsViewUrn);

        if (myBetsView?.filters) {
          return {
            orderTypeFilter: myBetsView.filters.orderType.items[myBetsView.filters.orderType.defaultIndex],
            productTypeFilter: myBetsView.filters.productType.items[myBetsView.filters.productType.defaultIndex],
            hasHeritageBets: myBetsView.filters.hasHeritageBets,
            viewUrn: myBetsViewUrn,
            isHeritageView: myBetsView.filters.isHeritageView,
          };
        }
      }

      return {};
    },
  );
};
