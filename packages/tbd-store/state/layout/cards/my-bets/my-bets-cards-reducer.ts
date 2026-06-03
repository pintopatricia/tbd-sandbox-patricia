import { DeleteLayoutAction, DELETE_LAYOUT } from "../../../../actions/catalogue";
import {
  UI__MY_BETS_ORDER_TYPE_FILTER_CLICK,
  MyBetsOrderTypeFilterClick,
  MY_BETS_RESET_FILTERS,
  MyBetsResetFilters,
  UI__MY_BETS_ORDER_STATUS_FILTER_CLICK,
  MyBetsOrderStatusFilterClick,
  UI__MY_BETS_HERITAGE_TOGGLE_FILTER_CLICK,
  MyBetsHeritageToggleFilterClick,
} from "../../../../actions/my-bets";
import { MyBetsState } from "../MyBets.types";

type ActionTypes =
  | MyBetsOrderTypeFilterClick
  | DeleteLayoutAction
  | MyBetsResetFilters
  | MyBetsOrderStatusFilterClick
  | MyBetsHeritageToggleFilterClick;

export default (currentState: undefined | MyBetsState, action: ActionTypes): MyBetsState => {
  const state = currentState || {};

  switch (action.type) {
    case UI__MY_BETS_ORDER_TYPE_FILTER_CLICK:
      return {
        ...state,
        productTypeFilter: action.payload.filter.productType,
        orderTypeFilter: action.payload.filter.orderType,
        isHeritageView: action.payload.filter.isHeritageView,
        viewUrn: action.payload.viewUrn,
      };
    case UI__MY_BETS_ORDER_STATUS_FILTER_CLICK:
      return {
        ...state,
        orderStatusFilter: action.payload.filter.orderStatus,
        viewUrn: action.payload.viewUrn,
      };
    case UI__MY_BETS_HERITAGE_TOGGLE_FILTER_CLICK:
      return {
        ...state,
        isHeritageView: action.payload.filter.isHeritageView,
        viewUrn: action.payload.viewUrn,
      };
    case MY_BETS_RESET_FILTERS:
    case DELETE_LAYOUT:
      return {};
    default:
      return state;
  }
};
