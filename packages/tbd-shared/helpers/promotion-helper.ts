import { getHttpClientsConfig } from "@ppb/tbd-store/services/client-factory";

export const getMovableInkPromoRedirectUrl = async (viewUrl: string): Promise<string> => {
  const { APP_USER_AGENT = "" } = getHttpClientsConfig();

  return fetch(viewUrl, {
    headers: {
      "User-Agent": APP_USER_AGENT,
    },
  })
    .then((response) => response.url)
    .catch((e) => {
      throw new Error(`Movable Ink URL (${viewUrl}) couldn't be fetched: ${e.message}`);
    });
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
