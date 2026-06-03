type CouponStatsButtonClickPayload = {
  isOpen: boolean;
  statsPebbleUrn?: string;
};

type Events = {
  "@@UI/COUPON_STATS_BUTTON_CLICK": CouponStatsButtonClickPayload;
};

export type { Events as CouponEvents };
