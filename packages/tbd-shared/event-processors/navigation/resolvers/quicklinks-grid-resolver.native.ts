import { Platform } from "react-native";
import { navigate, navigateWithThirdPartyScreenName, ScreenName } from "@ppb/tbd-router";
import { getStore } from "@ppb/tbd-store/create-store";
import { BOTTOM_BAR_PUSH } from "@ppb/tbd-store/actions";
import { UI__QUICK_LINK_CLICK } from "@ppb/tbd-store/actions/navigation";
import { getValidGameLaunchPatterns } from "../../../helpers/gaming.native";

type QuicklinksGridItemOnTapPayload = {
  urn: string;
  label: string;
  viewLink: { viewUrn: string; viewUrl: string };
  isLoggedIn?: boolean;
  login?: () => void;
};

export function quicklinksGridItemOnTapProcessor(payload: QuicklinksGridItemOnTapPayload) {
  const store = getStore();
  const { viewLink, label, urn, isLoggedIn, login } = payload;

  /**
   * I kept this logic from the old implementation (TBD) but I'm not totally sure about its purpose.
   * Check: https://github.com/Flutter-Global/tbd/blob/80e64b9b6ae5682d97ea75da29bd19ceb35b0a4c/packages/tbd-shared/components/QuicklinksGridItemCard/QuicklinksGridItemCard.native.tsx#L66
   * It seems to cover a specific case for gaming deeplinks.
   *
   * Since on iOS we use a different gaming implementation, this appears to be related to it.
   */
  if (getValidGameLaunchPatterns().some((pattern) => viewLink.viewUrl.match(pattern))) {
    if (login && !isLoggedIn && Platform.OS === "ios") {
      login();

      return;
    }

    navigateWithThirdPartyScreenName(ScreenName.GameLaunchScreen, {
      viewLink,
    });

    return;
  }

  // Gaming links should be opened with the bottom bar navigation
  if (viewLink.viewUrn.includes("gaming")) {
    store.dispatch({
      type: BOTTOM_BAR_PUSH,
      payload: viewLink,
    });
  }

  // Tagging
  store.dispatch({
    type: UI__QUICK_LINK_CLICK,
    payload: {
      url: viewLink.viewUrl,
      label,
      cardUrn: urn,
    },
  });

  // Navigation
  navigate(viewLink, label);
}
