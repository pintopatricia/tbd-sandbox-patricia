import {
  MY_BETS_EXC_BOTTOM_SHEET_CLOSE,
  MY_BETS_EXC_BOTTOM_SHEET_OPEN,
  MyBetsExchangeOpenBottomSheetAction,
  MyBetsExchangeCloseBottomSheetAction,
} from "../../actions/my-bets";
import { MyBetsState } from "./MyBets.types";

type ActionTypes = MyBetsExchangeOpenBottomSheetAction | MyBetsExchangeCloseBottomSheetAction;

const INITIAL_STATE: MyBetsState = {};

export default (currentState: undefined | MyBetsState, action: ActionTypes): MyBetsState => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case MY_BETS_EXC_BOTTOM_SHEET_OPEN: {
      const { contentUrn, title } = action.payload;
      return {
        ...state,
        exchangeBottomSheet: {
          isOpen: true,
          title,
          contentUrn,
        },
      };
    }

    case MY_BETS_EXC_BOTTOM_SHEET_CLOSE: {
      return {
        ...state,
        exchangeBottomSheet: {
          isOpen: false,
          title: undefined,
          contentUrn: undefined,
        },
      };
    }

    default:
      return state;
  }
};
