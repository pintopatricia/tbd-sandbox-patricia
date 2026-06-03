export type Limit = {
  softCap: number;
  hardCap: number;
  hardCapKey: string;
};

export type DefaultLimit = {
  DEFAULT: Limit;
};

export type PayoutLimits = Record<string, Limit | undefined> & DefaultLimit;

type PayoutsConfig = {
  limits?: PayoutLimits;
};

export class ProductConfiguration {
  protected payouts: PayoutsConfig = {};

  setPayoutLimits(limits: PayoutLimits) {
    this.payouts.limits = limits;
  }

  getPayoutLimit(currencyCode: string): Limit | undefined {
    return currencyCode && this.payouts.limits?.[currencyCode]
      ? this.payouts.limits?.[currencyCode]
      : this.payouts.limits?.DEFAULT;
  }
}

const productConfiguration = new ProductConfiguration();

export { productConfiguration };
