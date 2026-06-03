import emitEvent from "../../event-broker/event-emitter";

export const emitStatsClickEvent = (isOpen: boolean, statsPebbleUrn: string | undefined) => {
  emitEvent("@@UI/COUPON_STATS_BUTTON_CLICK", {
    isOpen,
    statsPebbleUrn,
  });
};
