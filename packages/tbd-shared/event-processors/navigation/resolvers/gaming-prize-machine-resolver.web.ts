import { getStore } from "@ppb/tbd-store/create-store";
import { PUSH } from "@ppb/tbd-store/actions";
import { EntityType } from "@ppb/tbd-urn-codecs";
import { getPromoUrlWithReturnURL } from "./promotion-resolver.web";

type DisplayMode = "BLANK_BROWSER" | "BLANK_INAPP" | "BLANK_WEBVIEW" | "SELF_BROWSER" | "SELF_INAPP" | "SELF_WEBVIEW";

type ViewLink = {
  viewUrn: string;
  viewUrl: string;
  viewDisplayMode?: DisplayMode | null;
};

type PrizeMachineNavPayload = {
  urn: string;
  viewLink: ViewLink;
};

export function gamingPrizeMachineOnTapProcessor(payload: PrizeMachineNavPayload) {
  const { viewLink } = payload;

  let { viewUrl } = viewLink;

  const store = getStore();

  if (viewLink.viewUrn.includes(EntityType.ExternalView)) {
    viewUrl = getPromoUrlWithReturnURL(viewUrl, window.location.href);
  }

  store.dispatch({
    type: PUSH,
    payload: {
      ...viewLink,
      viewUrl,
    },
  });
}
