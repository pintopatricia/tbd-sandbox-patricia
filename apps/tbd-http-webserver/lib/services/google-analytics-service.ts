import { EnvironmentJSON, ThrottlesState } from "@ppb/tbd-store";

const EMPTY_ANALYTICS_STATE = {
  ua: "",
  ga4: { head: "", body: "" },
};

type GA4Tags = { head: string; body: string };
function getGA4Config(environment: EnvironmentJSON): GA4Tags {
  return {
    head: `
      <!-- Google Tag Manager -->
      <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl+ '${environment.GTM.DEBUG_KEYS}';f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','${environment.GTM.ID}');</script>
      <!-- End Google Tag Manager -->
    `,
    body: `
      <!-- Google Tag Manager (noscript) -->
      <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${environment.GTM.ID}${environment.GTM.DEBUG_KEYS}"
      height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
      <!-- End Google Tag Manager (noscript) -->
    `,
  };
}

type GTMTags = {
  ga4: GA4Tags;
  ua: string;
};
export function getGAHtmlScripts(throttles: ThrottlesState, environment: EnvironmentJSON): GTMTags {
  const OLD_UA_CONFIG = `
        <!-- Google Tag Manager -->
        <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-P32JX6')</script>
        <!-- End Google Tag Manager -->
        <!-- Google Tag Manager (noscript) -->
        <noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P32JX6" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
        <!-- End Google Tag Manager (noscript) -->
  `;

  const isGA4Active = throttles.ENABLE_GA4?.isActive;
  const isUADisabled = throttles.DISABLE_UA?.isActive;
  const deferGTMLoading = throttles.DEFER_GTM_LOADING?.isActive;

  if (deferGTMLoading) {
    return EMPTY_ANALYTICS_STATE;
  }

  // Check if GA4 throttle is active
  if (isGA4Active) {
    // Get GA4 config based on the environment (PRD vs other env's)
    const GA4Config = getGA4Config(environment);

    return {
      ga4: GA4Config,
      ua: isUADisabled ? "" : OLD_UA_CONFIG,
    };
  }

  if (isUADisabled) {
    return EMPTY_ANALYTICS_STATE;
  }

  return {
    ua: OLD_UA_CONFIG,
    ga4: { head: "", body: "" },
  };
}
