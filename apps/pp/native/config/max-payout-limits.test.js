import { MAX_PAYOUT_LIMITS } from "./max-payout-limits";

describe("Max Payout Limits", () => {
  it("should export max payout limits", () => {
    expect(MAX_PAYOUT_LIMITS).toEqual({
      USD: { softCap: 350000, hardCap: 1400000, hardCapKey: "I18N.BETSLIP.CURRENCY_IN_WORDS.USD1400000" },
      GBP: { softCap: 250000, hardCap: 1000000, hardCapKey: "I18N.BETSLIP.CURRENCY_IN_WORDS.GBP1000000" },
      AUD: { softCap: 500000, hardCap: 2000000, hardCapKey: "I18N.BETSLIP.CURRENCY_IN_WORDS.AUD2000000" },
      BRL: { softCap: 1000000, hardCap: 4000000, hardCapKey: "I18N.BETSLIP.CURRENCY_IN_WORDS.BRL4000000" },
      EUR: { softCap: 250000, hardCap: 1000000, hardCapKey: "I18N.BETSLIP.CURRENCY_IN_WORDS.EUR1000000" },
      CAD: { softCap: 475000, hardCap: 1900000, hardCapKey: "I18N.BETSLIP.CURRENCY_IN_WORDS.CAD1900000" },
      DKK: { softCap: 2400000, hardCap: 9600000, hardCapKey: "I18N.BETSLIP.CURRENCY_IN_WORDS.DKK9600000" },
      HKD: { softCap: 2800000, hardCap: 11200000, hardCapKey: "I18N.BETSLIP.CURRENCY_IN_WORDS.HKD11200000" },
      NOK: { softCap: 3025000, hardCap: 12100000, hardCapKey: "I18N.BETSLIP.CURRENCY_IN_WORDS.NOK12100000" },
      RON: { softCap: 1450000, hardCap: 5800000, hardCapKey: "I18N.BETSLIP.CURRENCY_IN_WORDS.RON5800000" },
      SGD: { softCap: 500000, hardCap: 2000000, hardCapKey: "I18N.BETSLIP.CURRENCY_IN_WORDS.SGD2000000" },
      SEK: { softCap: 3000000, hardCap: 12000000, hardCapKey: "I18N.BETSLIP.CURRENCY_IN_WORDS.SEK12000000" },
      DEFAULT: { softCap: 250000, hardCap: 1000000, hardCapKey: "I18N.BETSLIP.CURRENCY_IN_WORDS.1000000" },
    });
  });
});
