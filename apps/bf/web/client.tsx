type BrandConfig = {
  BRAND: Parameters<typeof RootComponentAttachment>[1];
  MAX_PAYOUT_LIMITS: Parameters<typeof initClient>[0]["payouts"]["limits"];
};
import { initClient } from "@ppb/tbd-shared/client.web";
import { RootComponentAttachment } from "@ppb/tbd-shared/components/RootComponentAttachment.web";

import unsafeBrandConfig from "./brand.config.json";
import "./assets/css/global.css";
import { initFontBaseinPx } from "./config/common/font-base-in-px";

const brandConfig = unsafeBrandConfig as unknown as BrandConfig;
const payouts = { limits: brandConfig.MAX_PAYOUT_LIMITS };

initClient({ payouts }).then((store) => {
  initFontBaseinPx(store);

  if (!module.hot) {
    // @ts-expect-error Allow the passed state to be garbage-collected.
    delete window.__PRELOADED_STATE__;
  }

  return RootComponentAttachment(store, brandConfig.BRAND);
});
