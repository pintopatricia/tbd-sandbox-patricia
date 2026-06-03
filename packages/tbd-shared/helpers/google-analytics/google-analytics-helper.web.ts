const UA_ID = "GTM-P32JX6";

export function addGtmScript(isGA4Active?: boolean, isUADisabled?: boolean) {
  if (!isUADisabled) {
    const scriptId = "gtm-UA-script";
    if (document.getElementById(scriptId)) return; // Prevent duplicate

    (function (w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
      const f = d.getElementsByTagName(s)[0];
      const j = d.createElement(s) as HTMLScriptElement;
      const dl = l !== "dataLayer" ? `&l=${l}` : "";
      j.async = true;
      j.crossOrigin = "anonymous";
      j.src = `https://www.googletagmanager.com/gtm.js?id=${i}${dl}`;
      j.id = scriptId;
      f?.parentNode?.insertBefore(j, f);
    })(window as { [key: string]: any }, document, "script", "dataLayer", UA_ID);
  }

  if (isGA4Active) {
    const { ID, DEBUG_KEYS } = window.__TBD_ENVIRONMENT__.GTM;
    const scriptId = "gtm-GA4-script";
    if (document.getElementById(scriptId)) return; // Prevent duplicate

    (function (w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
      const f = d.getElementsByTagName(s)[0];
      const j = d.createElement(s) as HTMLScriptElement;
      const dl = l !== "dataLayer" ? `&l=${l}` : "";
      j.async = true;
      j.crossOrigin = "anonymous";
      j.src = `https://www.googletagmanager.com/gtm.js?id=${i}${dl}${DEBUG_KEYS}`;
      j.id = scriptId;
      f?.parentNode?.insertBefore(j, f);
    })(window as { [key: string]: any }, document, "script", "dataLayer", ID);
  }
}
