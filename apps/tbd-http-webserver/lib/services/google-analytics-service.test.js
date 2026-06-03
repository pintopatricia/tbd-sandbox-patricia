import { getGAHtmlScripts } from "./google-analytics-service";

const OLD_UA_CONFIG = `<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-P32JX6')</script><!-- End Google Tag Manager --><!-- Google Tag Manager (noscript) --><noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-P32JX6" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript><!-- End Google Tag Manager (noscript) -->`;
const GA4_CONFIG = (DEBUG_KEYS, ID) => ({
  head: `<!-- Google Tag Manager --><script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl+ '${DEBUG_KEYS}';f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${ID}');</script><!-- End Google Tag Manager -->`,
  body: `<!-- Google Tag Manager (noscript) --><noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${ID}${DEBUG_KEYS}"height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript><!-- End Google Tag Manager (noscript) -->`,
});

function minify(html) {
  return html.replace(/\s{2,}/g, "");
}

describe("getGAHtmlScripts", () => {
  describe("when the DEFER_GTM_LOADING throttle is enabled", () => {
    it("should return an empty analytics state", async () => {
      const result = await getGAHtmlScripts(
        {
          ENABLE_GA4: { isActive: false },
          DISABLE_UA: { isActive: false },
          DEFER_GTM_LOADING: { isActive: true },
        },
        {
          GTM: {
            DEBUG_KEYS: "DEBUG_KEYS",
            ID: "ID",
          },
        },
      );

      expect(minify(result.ua)).toEqual("");
      expect(minify(result.ga4.head)).toEqual("");
      expect(minify(result.ga4.body)).toEqual("");
    });
  });

  describe("when the DEFER_GTM_LOADING throttle is disabled", () => {
    describe("when the ENABLE_GA4 throttle is disabled", () => {
      describe("when the DISABLE_UA throttle is disabled", () => {
        it("should return the old UA config", async () => {
          const result = await getGAHtmlScripts(
            {
              ENABLE_GA4: { isActive: false },
              DISABLE_UA: { isActive: false },
              DEFER_GTM_LOADING: { isActive: false },
            },
            {
              GTM: {
                DEBUG_KEYS: "DEBUG_KEYS",
                ID: "ID",
              },
            },
          );

          expect(minify(result.ua)).toEqual(OLD_UA_CONFIG);
        });
      });

      describe("when the DISABLE_UA throttle is enabled", () => {
        it("should return empty string", async () => {
          const result = await getGAHtmlScripts(
            {
              ENABLE_GA4: { isActive: false },
              DISABLE_UA: { isActive: true },
              DEFER_GTM_LOADING: { isActive: false },
            },
            {
              GTM: {
                DEBUG_KEYS: "DEBUG_KEYS",
                ID: "ID",
              },
            },
          );

          expect(minify(result.ua)).toEqual("");
        });
      });
    });

    describe("when the ENABLE_GA4 throttle is enabled", () => {
      describe("when the DISABLE_UA throttle is disabled", () => {
        it("should return both the old UA and the GA4 config in a single string", async () => {
          const result = await getGAHtmlScripts(
            {
              ENABLE_GA4: { isActive: true },
              DISABLE_UA: { isActive: false },
              DEFER_GTM_LOADING: { isActive: false },
            },
            {
              GTM: {
                DEBUG_KEYS: "DEBUG_KEYS",
                ID: "ID",
              },
            },
          );

          expect(minify(result.ga4.head)).toEqual(GA4_CONFIG("DEBUG_KEYS", "ID").head);
          expect(minify(result.ga4.body)).toEqual(GA4_CONFIG("DEBUG_KEYS", "ID").body);
          expect(minify(result.ua)).toEqual(OLD_UA_CONFIG);
        });
      });

      describe("when the DISABLE_UA throttle is enabled", () => {
        it("should return the GA4 config in a single string", async () => {
          const result = await getGAHtmlScripts(
            {
              ENABLE_GA4: { isActive: true },
              DISABLE_UA: { isActive: true },
              DEFER_GTM_LOADING: { isActive: false },
            },
            {
              GTM: {
                DEBUG_KEYS: "DEBUG_KEYS",
                ID: "ID",
              },
            },
          );

          expect(minify(result.ga4.head)).toEqual(GA4_CONFIG("DEBUG_KEYS", "ID").head);
          expect(minify(result.ga4.body)).toEqual(GA4_CONFIG("DEBUG_KEYS", "ID").body);
        });
      });
    });
  });
});
