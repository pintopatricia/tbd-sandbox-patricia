import { MAX_PAYOUT_LIMITS } from "./max-payout-limits";

describe("Max Payout Limits", () => {
  it("should export max payout limits", () => {
    expect(MAX_PAYOUT_LIMITS).toEqual({
      GBP: { softCap: 50000, hardCap: 500000, hardCapKey: "I18N.BETSLIP.CURRENCY_IN_WORDS.GBP500000" },
      EUR: { softCap: 50000, hardCap: 500000, hardCapKey: "I18N.BETSLIP.CURRENCY_IN_WORDS.EUR500000" },
      DEFAULT: { softCap: 50000, hardCap: 500000, hardCapKey: "I18N.BETSLIP.CURRENCY_IN_WORDS.500000" },
    });
  });
});
