import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { Dispatch } from "redux";
import { FETCH_CARDS_FROM_LIST, FETCH_CATALOGUE } from "@ppb/tbd-store/actions/catalogue";
import { createGetMyBetsFiltersStateSelector } from "@ppb/tbd-store/state/layout/cards/my-bets/my-bets-selectors";
import { MY_BETS_EXC_BOTTOM_SHEET_CLOSE, UI__MY_BETS_EXC_EDIT_BET_CLOSE } from "@ppb/tbd-store/actions/my-bets";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { createViewByURNSelector } from "@ppb/tbd-store/state/layout/views/view-selectors";
import { getMyBetsExchangeBottomSheet } from "@ppb/tbd-store/state/my-bets/my-bets-selectors";
import { REFRESH } from "@ppb/tbd-store/actions/router";
import { GenericViews } from "@ppb/tbd-store/state/layout/views/View.types";
import { i18n } from "../../helpers/i18n";

const HEADER_ITEMS_TYPENAMES = ["FixtureCard", "RaceDetailsCard"];

export type CardProps = {
  title: string;
  isFromEditBet: boolean;
  myBetsPageUrn?: URN;
  displayBottomSheet?: boolean;
  contentUrn?: string;
  items?: PartialItem[];
  headerItem?: PartialItem;
};

export type ContainerProps = {
  visible?: boolean;
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const editBetTitle = i18n({ key: "I18N.BETSLIP.EDIT_BET" });
  const getGenericViewByURN = createViewByURNSelector<GenericViews, URN>();
  const getMyBetsFiltersState = createGetMyBetsFiltersStateSelector();

  return function mapStateToProps(state: ApplicationState): StateProps {
    const {
      isOpen: displayBottomSheet = false,
      contentUrn,
      title: bottomSheetTitle,
    } = getMyBetsExchangeBottomSheet(state) || {};
    const { viewUrn: myBetsPageUrn } = getMyBetsFiltersState(state, state.layouts.views.mybets);

    const contentView = contentUrn ? getGenericViewByURN(state.layouts.views.generic, contentUrn) : undefined;

    const headerItem = contentView?.items.find(({ typename }) => HEADER_ITEMS_TYPENAMES.includes(typename));

    return {
      title: bottomSheetTitle || editBetTitle,
      isFromEditBet: bottomSheetTitle === undefined,
      myBetsPageUrn,
      displayBottomSheet,
      contentUrn,
      items: contentView?.items,
      headerItem,
    };
  };
};

export type DispatchProps = {
  dispatchCloseBottomSheetAction: (wasCloseButtonPressed: boolean, wasFromEditBet: boolean) => void;
  dispatchFetchCatalogueAction: (urn: string) => void;
  dispatchFetchCardsAction: (urn: string, partials: PartialItem[]) => void;
  dispatchMyBetsPageRefreshAction: (urn: string) => void;
};

export const makeMapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = (dispatch: Dispatch) => ({
  dispatchCloseBottomSheetAction: (wasCloseButtonPressed = false, wasFromEditBet = false) => {
    if (wasFromEditBet) {
      dispatch({
        type: UI__MY_BETS_EXC_EDIT_BET_CLOSE,
        payload: {
          wasCloseButtonPressed,
        },
      });
    }

    dispatch({
      type: MY_BETS_EXC_BOTTOM_SHEET_CLOSE,
    });
  },
  dispatchFetchCatalogueAction: (urn: string) => {
    dispatch({
      type: FETCH_CATALOGUE,
      payload: { urn },
    });
  },
  dispatchFetchCardsAction: (urn: string, partials: PartialItem[]) => {
    dispatch({
      type: FETCH_CARDS_FROM_LIST,
      payload: {
        urn,
        partials,
      },
    });
  },
  dispatchMyBetsPageRefreshAction: (urn: URN) => {
    dispatch({
      type: REFRESH,
      payload: { urn },
    });
  },
});
