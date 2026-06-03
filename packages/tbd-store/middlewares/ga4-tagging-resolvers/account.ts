import { buildAccountEvent, AccountEvent } from "tagging-library";
import {
  UserProfileMenuEyeIconClickAction,
  UserProfileToggleCashBalancesViewClickAction,
} from "../../actions/user-profile";
import { TaggingAction } from "../tagging-resolvers/AnalyticsConstants";

export const getMyAccountEyeIconEvent = (action: UserProfileMenuEyeIconClickAction): AccountEvent => {
  const { showBalances } = action.payload;

  return buildAccountEvent({
    action: showBalances ? TaggingAction.TOGGLE_OFF : TaggingAction.TOGGLE_ON,
    selection: "null",
    module: "cash and bonus balances",
    elementText: "hide balance",
  });
};

export const getMyAccountToggleCashBalancesViewEvent = (
  action: UserProfileToggleCashBalancesViewClickAction,
): AccountEvent => {
  const { showLessToggle } = action.payload;

  return buildAccountEvent({
    action: TaggingAction.CLICKED,
    selection: "null",
    module: "cash and bonus balances",
    elementText: showLessToggle ? "show less" : "show more",
  });
};
