import { GenericEvent } from "../../state/tagging/Event.types";
import { NavigateFromUserProfileLink, SettingsTabsNavigation } from "../../state/tagging/Interface.types";
import { TaggingAction, TaggingCategory } from "./AnalyticsConstants";
import { APPLICATION, BUSINESS } from "./AnalyticsDimensions";

export const getSettingsTabSelectEvent = (
  menuText: string,
  moduleName: string,
  destinationURL: string,
): SettingsTabsNavigation => ({
  event: "ga_event",
  category: TaggingCategory.MY_ACCOUNT,
  action: TaggingAction.NAVIGATED_TO,
  label: menuText,
  [APPLICATION.MODULE]: moduleName,
  [BUSINESS.DESTINATION_URL]: destinationURL,
});

export const getMyAccountMenuLinkEvent = (
  menuText: string,
  linkHref: string,
  jurisdiction: string,
): NavigateFromUserProfileLink => ({
  event: "ga_event",
  category: TaggingCategory.MY_ACCOUNT,
  action: TaggingAction.NAVIGATED_TO,
  label: menuText,
  [APPLICATION.MODULE]: `my_account_${jurisdiction.toLowerCase()}_mobile`,
  [BUSINESS.DESTINATION_URL]: linkHref,
});

export const getMyAccountQuickLinkEvent = (
  title: string,
  linkHref: string,
  jurisdiction: string,
): NavigateFromUserProfileLink => ({
  event: "ga_event",
  category: TaggingCategory.MY_ACCOUNT,
  action: TaggingAction.NAVIGATED_TO,
  label: `${title} quicklink`,
  [APPLICATION.MODULE]: `my_account_${jurisdiction.toLowerCase()}_mobile`,
  [BUSINESS.DESTINATION_URL]: linkHref,
});

export const getMyAccountEyeIconEvent = (toggleOff: boolean, jurisdiction: string): GenericEvent => ({
  event: "ga_event",
  category: TaggingCategory.MY_ACCOUNT,
  action: toggleOff ? TaggingAction.TOGGLE_OFF : TaggingAction.TOGGLE_ON,
  label: toggleOff ? "hide balance" : "show balance",
  [APPLICATION.MODULE]: `my_account_${jurisdiction.toLowerCase()}_mobile`,
});
