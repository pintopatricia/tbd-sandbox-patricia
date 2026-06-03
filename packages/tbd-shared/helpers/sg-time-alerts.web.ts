import type { ApplicationState } from "@ppb/tbd-store";
import { injectScript } from "@ppb/tbd-store/helpers/add-element-to-dom";
import { Jurisdiction } from "@ppb/tbd-store/state/constants";
import { isDesktopAppKeyTypeSelector } from "@ppb/tbd-store/state/layout/layout-selectors";

const shouldInjectSGTimeAlertsScript = (state: ApplicationState): boolean => {
  const { userdetails } = state.entities;
  const isItalyJurisdiction =
    "jurisdiction" in userdetails && userdetails.jurisdiction.jurisdiction === Jurisdiction.ITALY;

  return isItalyJurisdiction && userdetails.loggedIn && !isDesktopAppKeyTypeSelector()(state);
};

export const injectSGTimeAlertsScript = (state: ApplicationState, scriptUrl?: string): void => {
  if (scriptUrl && shouldInjectSGTimeAlertsScript(state)) {
    injectScript({ src: scriptUrl });
  }
};
