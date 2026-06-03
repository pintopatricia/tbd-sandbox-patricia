import { PayoutLimits } from "@ppb/tbd-store";

export const MAX_PAYOUT_LIMITS: PayoutLimits = {
  GBP: { softCap: 50000, hardCap: 500000, hardCapKey: "I18N.BETSLIP.CURRENCY_IN_WORDS.GBP500000" },
  EUR: { softCap: 50000, hardCap: 500000, hardCapKey: "I18N.BETSLIP.CURRENCY_IN_WORDS.EUR500000" },
  DEFAULT: { softCap: 50000, hardCap: 500000, hardCapKey: "I18N.BETSLIP.CURRENCY_IN_WORDS.500000" },
};
