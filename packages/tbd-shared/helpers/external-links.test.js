import { getExternalLink } from "./external-links";

jest.mock("../config/endpoints", () => ({
  getExternalLinks: jest.fn(() => ({
    MAX_PAYOUT: {
      INTERNATIONAL: {
        default: "www.max_payout.default.com",
        en_GB: "www.max_payout.en_GB.com",
        empty: "",
      },
      SPAIN: {
        default: "www.max_payout.default.es",
        es: "www.max_payout.es.es",
      },
    },
    EMPTY_CONFIG: {},
  })),
}));

describe("external links", () => {
  beforeEach(jest.clearAllMocks);

  describe("getExternalLink", () => {
    describe.each([
      ["INVALID_TYPE", undefined, undefined, ""],
      ["EMPTY_CONFIG", undefined, undefined, ""],
      ["MAX_PAYOUT", undefined, undefined, "www.max_payout.default.com"],
      ["MAX_PAYOUT", undefined, "invalid_locale", "www.max_payout.default.com"],
      ["MAX_PAYOUT", undefined, "default", "www.max_payout.default.com"],
      ["MAX_PAYOUT", undefined, "en_GB", "www.max_payout.en_GB.com"],
      ["MAX_PAYOUT", "INVALID_JURISDICTION", undefined, "www.max_payout.default.com"],
      ["MAX_PAYOUT", "INVALID_JURISDICTION", "invalid_locale", "www.max_payout.default.com"],
      ["MAX_PAYOUT", "INVALID_JURISDICTION", "default", "www.max_payout.default.com"],
      ["MAX_PAYOUT", "INVALID_JURISDICTION", "en_GB", "www.max_payout.en_GB.com"],
      ["MAX_PAYOUT", "INTERNATIONAL", undefined, "www.max_payout.default.com"],
      ["MAX_PAYOUT", "INTERNATIONAL", "invalid_locale", "www.max_payout.default.com"],
      ["MAX_PAYOUT", "INTERNATIONAL", "default", "www.max_payout.default.com"],
      ["MAX_PAYOUT", "INTERNATIONAL", "en_GB", "www.max_payout.en_GB.com"],
      ["MAX_PAYOUT", "INTERNATIONAL", "empty", ""],
      ["MAX_PAYOUT", "SPAIN", undefined, "www.max_payout.default.es"],
      ["MAX_PAYOUT", "SPAIN", "invalid_locale", "www.max_payout.default.es"],
      ["MAX_PAYOUT", "SPAIN", "default", "www.max_payout.default.es"],
      ["MAX_PAYOUT", "SPAIN", "es", "www.max_payout.es.es"],
    ])("when externalLinkType is %s", (externalLinkType, jurisdiction, localeCode, externalLink) => {
      describe(`and jurisdiction is ${jurisdiction}`, () => {
        describe(`and localeCode is ${localeCode}`, () => {
          it(`should return the externalLink "${externalLink}"`, () => {
            expect(getExternalLink(externalLinkType, jurisdiction, localeCode)).toBe(externalLink);
          });
        });
      });
    });
  });
});
