/* eslint-disable @typescript-eslint/no-require-imports, import/no-import-module-exports, no-underscore-dangle, no-undef   */

import { initClient } from "@ppb/tbd-shared/client.web";
import { RootComponentAttachment } from "@ppb/tbd-shared/components/RootComponentAttachment.web";

import { MAX_PAYOUT_LIMITS } from "./config/max-payout-limits";
import "./assets/css/global.css";
import { initSBGFontBaseinPx } from "./config/sbg-font-base-in-px";

const payouts = { limits: MAX_PAYOUT_LIMITS };

initClient({ payouts }).then((store) => {
  initSBGFontBaseinPx(store);

  if (!module.hot) {
    // @ts-expect-error Allow the passed state to be garbage-collected.
    delete window.__PRELOADED_STATE__;
  }

  if (module.hot) {
    module.hot.decline();
  }

  return RootComponentAttachment(store, "SkyBet");
});
