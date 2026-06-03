import { ApplicationState, createGetThrottleSelector } from "@ppb/tbd-store";
import { injectScript } from "@ppb/tbd-store/helpers/add-element-to-dom";
import { Jurisdiction } from "@ppb/tbd-store/state/constants";
import { isDesktopAppKeyTypeSelector } from "@ppb/tbd-store/state/layout/layout-selectors";

const shouldInjectGeoComplyScript = (state: ApplicationState): boolean => {
  const isDesktopAppKey = isDesktopAppKeyTypeSelector();
  const getThrottle = createGetThrottleSelector();

  const { throttles, userdetails } = state.entities;
  const isBrazilJurisdiction =
    "jurisdiction" in userdetails && userdetails.jurisdiction.jurisdiction === Jurisdiction.BRAZIL;

  return (
    isBrazilJurisdiction && !isDesktopAppKey(state) && !!getThrottle(throttles, "INJECT_GEO_COMPLY_SCRIPT")?.isActive
  );
};

export const injectGeoComplyScript = (state: ApplicationState, scriptUrl?: string): void => {
  if (scriptUrl && shouldInjectGeoComplyScript(state)) {
    injectScript({ src: scriptUrl, "data-product": "bfrb_web" });
  }
};
