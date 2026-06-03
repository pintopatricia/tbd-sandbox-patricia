import { DisplayMode } from "@ppb/the-wall-common/types/ViewLink.types";
import { NativeViewLink, navigate, navigateWithThirdPartyScreenName, ScreenName } from "@ppb/tbd-router";
import { Platform } from "react-native";
import { getStore } from "@ppb/tbd-store/create-store";
import { UI__LAUNCH_GAME_FROM_PROMO } from "@ppb/tbd-store/actions/navigation";
import { getValidGameLaunchPatterns } from "../../../helpers/gaming.native";

type ViewLink = {
  viewUrn: string;
  viewUrl: string;
  viewDisplayMode?: string | null;
};

type PromotionOnTapPayload = {
  urn: string;
  viewLink?: ViewLink;
  joinNow?: (url: string) => Promise<void>;
};

// Unless we stop using enums for DisplayMode, we need this
function convertViewLink(viewLink: {
  viewUrn: string;
  viewUrl: string;
  viewDisplayMode?: string | null;
}): NativeViewLink {
  const { viewUrn, viewUrl } = viewLink;
  const viewDisplayMode = "viewDisplayMode" in viewLink ? (viewLink.viewDisplayMode as DisplayMode) : null;

  return {
    viewUrn,
    viewUrl,
    viewDisplayMode,
  };
}

export function promotionOnTapProcessor(payload: PromotionOnTapPayload) {
  const { joinNow, urn } = payload;

  if (!payload.viewLink) {
    return;
  }

  const viewLink = convertViewLink(payload.viewLink);
  const { viewUrl } = viewLink;

  // Handle CET Framework join now navigations (e.g. registration)
  if (viewUrl?.includes("register") || viewUrl?.includes("registration")) {
    joinNow?.(viewUrl);
    return;
  }

  if (getValidGameLaunchPatterns().some((pattern) => viewUrl?.match(pattern)) && Platform.OS === "android") {
    const store = getStore();
    store.dispatch({
      type: UI__LAUNCH_GAME_FROM_PROMO,
      payload: {
        viewUrl: viewLink.viewUrl,
        urn: urn,
      },
    });
    navigateWithThirdPartyScreenName(ScreenName.GameLaunchScreen, {
      viewLink,
    });
    return;
  }

  navigate(viewLink);
}
