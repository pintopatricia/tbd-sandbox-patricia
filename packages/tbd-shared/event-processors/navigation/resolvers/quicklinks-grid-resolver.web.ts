import { getStore } from "@ppb/tbd-store/create-store";
import { EXTERNAL_PUSH_BLANK, PUSH } from "@ppb/tbd-store/actions";
import { EntityType } from "@ppb/tbd-urn-codecs";
import { UI__QUICK_LINK_CLICK } from "@ppb/tbd-store/actions/navigation";

type QuicklinksGridItemOnTapPayload = {
  urn: string;
  label: string;
  viewLink: { viewUrn: string; viewUrl: string };
  isLoggedIn?: boolean;
  login?: () => void;
};

export function quicklinksGridItemOnTapProcessor(payload: QuicklinksGridItemOnTapPayload) {
  const store = getStore();
  const { viewLink, label, urn } = payload;

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
  if (payload.viewLink.viewUrn.includes(EntityType.ExternalView)) {
    store.dispatch({
      type: EXTERNAL_PUSH_BLANK,
      payload: viewLink,
    });
  } else {
    store.dispatch({
      type: PUSH,
      payload: viewLink,
    });
  }
}
