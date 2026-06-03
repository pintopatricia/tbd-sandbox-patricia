import { addGtmScript } from "./google-analytics-helper.web";

window.__TBD_ENVIRONMENT__ = { GTM: { ID: "GTM-ID", DEBUG_KEYS: "gtm_debug=x" } };
const { ID: GTM_ID, DEBUG_KEYS: GTM_DEBUG_KEYS } = window.__TBD_ENVIRONMENT__.GTM;

describe("Google Analytics Helper - addGtmScript", () => {
  beforeEach(() => {
    // Setup the document head with an empty script element
    document.head.innerHTML = "";
    const scriptTag = document.createElement("script");
    document.head.appendChild(scriptTag);

    // Reset the dataLayer
    window.dataLayer = [];
  });

  describe("when isGA4Active is false and isUADisabled is true", () => {
    it("should not add a GTM event to the dataLayer", () => {
      addGtmScript(false, true);

      expect(window.dataLayer).toEqual([]);
    });
  });

  describe("when isGA4Active is true", () => {
    beforeEach(() => {
      addGtmScript(true, true);
    });

    it("should add a GTM GA4 script to the document", () => {
      const scriptTag = document.getElementsByTagName("script")[0];
      expect(scriptTag).not.toBeNull();
      expect(scriptTag.async).toBe(true);
      expect(scriptTag.src).toBe(`https://www.googletagmanager.com/gtm.js?id=${GTM_ID}${GTM_DEBUG_KEYS}`);
      expect(scriptTag.id).toBe("gtm-GA4-script");

      // 1 for the script tag created in beforeEach, 1 for the GTM script
      expect(document.getElementsByTagName("script").length).toBe(2);
    });

    it("should add a GTM GA4 start event to the dataLayer", () => {
      expect(window.dataLayer).toEqual([
        {
          event: "gtm.js",
          "gtm.start": expect.any(Number),
        },
      ]);
    });

    describe("and the script already ran before", () => {
      it("should not add a new GTM GA4 script to the document", () => {
        addGtmScript(true, true);

        expect(document.getElementsByTagName("script").length).toBe(2);
      });
    });
  });

  describe("when isUADisabled is false", () => {
    beforeEach(() => {
      addGtmScript(false, false);
    });

    it("should add a GTM UA script to the document", () => {
      const scriptTag = document.getElementsByTagName("script")[0];
      expect(scriptTag).not.toBeNull();
      expect(scriptTag.async).toBe(true);
      expect(scriptTag.src).toBe(`https://www.googletagmanager.com/gtm.js?id=GTM-P32JX6`);
      expect(scriptTag.id).toBe("gtm-UA-script");

      // 1 for the script tag created in beforeEach, 1 for the GTM script
      expect(document.getElementsByTagName("script").length).toBe(2);
    });

    it("should add a GTM UA start event to the dataLayer", () => {
      expect(window.dataLayer).toEqual([
        {
          event: "gtm.js",
          "gtm.start": expect.any(Number),
        },
      ]);
    });

    describe("and the script already ran before", () => {
      it("should not add a new GTM UA script to the document", () => {
        addGtmScript(false, false);
        expect(document.getElementsByTagName("script").length).toBe(2);
      });
    });
  });
});
