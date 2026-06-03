 

import { initClient } from "@ppb/tbd-shared/client.web";
import { RootComponentAttachment } from "@ppb/tbd-shared/components/RootComponentAttachment.web";

import { MAX_PAYOUT_LIMITS } from "./config/max-payout-limits";
import "./assets/css/global.css";
import { initPPFontBaseinPx } from "./config/pp-font-base-in-px";

const payouts = { limits: MAX_PAYOUT_LIMITS };

initClient({ payouts }).then((store) => {
  initPPFontBaseinPx(store);

  if (!module.hot) {
    // @ts-expect-error Allow the passed state to be garbage-collected.
    delete window.__PRELOADED_STATE__;
  }

  return RootComponentAttachment(store, "PaddyPower");
});
