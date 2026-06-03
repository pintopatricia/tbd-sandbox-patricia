import { getStore } from "@ppb/tbd-store/create-store";
import { PUSH } from "@ppb/tbd-store/actions";
import { EntityType } from "@ppb/tbd-urn-codecs";

type DisplayMode = "BLANK_BROWSER" | "BLANK_INAPP" | "BLANK_WEBVIEW" | "SELF_BROWSER" | "SELF_INAPP" | "SELF_WEBVIEW";

type ViewLink = {
  viewUrn: string;
  viewUrl: string;
  viewDisplayMode?: DisplayMode | null;
};

type PromotionOnTapPayload = {
  urn: string;
  viewLink?: ViewLink;
  joinNow?: (url: string) => Promise<void>;
};

/**
 * Note: we decided to call this function with window.location.href on PromotionCard.web.tsx, because this is the
 * only case where the current url is needed. If, in the future, there are other cases where this could be reused,
 * new conversations should take place to come up with a generic solution involving BFF
 */
export const getPromoUrlWithReturnURL = (promoUrl: string, currentUrl: string): string => {
  const newUrl = new URL(promoUrl);

  // if there is already a returnURL, we want to return the promo URL as is
  if (newUrl.searchParams.get("returnURL")) {
    return promoUrl;
  }

  // if the URL is an identitysso redirect, the returnURL parameter must be added to the promotions URL
  const urlParameter = newUrl.searchParams.get("url");
  if (urlParameter) {
    const newUrlParameter = new URL(urlParameter);
    const rurlParameter = newUrlParameter.searchParams.get("rurl");
    if (rurlParameter) {
      const newRurlParameter = new URL(rurlParameter);

      newRurlParameter.searchParams.set("returnURL", currentUrl);
      newUrlParameter.searchParams.set("rurl", newRurlParameter.toString());
      newUrl.searchParams.set("url", newUrlParameter.toString());

      return newUrl.toString();
    }
  }

  newUrl.searchParams.append("returnURL", currentUrl);
  return newUrl.toString();
};

export function promotionOnTapProcessor(payload: PromotionOnTapPayload) {
  const { viewLink } = payload;

  if (!viewLink) {
    return;
  }

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
