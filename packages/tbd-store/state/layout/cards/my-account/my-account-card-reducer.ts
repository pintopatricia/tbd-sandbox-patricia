import { UI__MY_ACCOUNT_ICON_CLICK, MyAccountIconClickAction } from "../../../../actions/interface";
import { UI__BROWSE_ICON_CLICK, BrowseIconClickAction } from "../../../../actions/browse";
import { UI__LOGO_CLICK, LogoClickAction } from "../../../../actions/navigation";
import { MyAccountInterfaceOpenState } from "./MyAccount.types";

const INITIAL_STATE = {
  isOpen: false,
};

type ActionTypes = MyAccountIconClickAction | BrowseIconClickAction | LogoClickAction;

export default (
  currentState: undefined | MyAccountInterfaceOpenState,
  action: ActionTypes,
): MyAccountInterfaceOpenState => {
  const state = currentState || INITIAL_STATE;

  switch (action.type) {
    case UI__MY_ACCOUNT_ICON_CLICK:
      return {
        isOpen: action.payload,
      };
    case UI__BROWSE_ICON_CLICK:
    case UI__LOGO_CLICK:
      return INITIAL_STATE;
    default:
      return state;
  }
};
