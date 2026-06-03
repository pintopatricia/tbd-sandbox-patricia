import { useExperimentVariant } from "../../../../../experimentation/hooks/useExperimentVariant";
import { SportsbookPlaceTabsPanelViewModel } from "./TabsView/SportsbookPlaceTabsPanel.types";

export const useTabsExperimentVariant = (): SportsbookPlaceTabsPanelViewModel["experimentVariant"] | null => {
  const experimentVariant = useExperimentVariant("exp-tabbed-betslip-view");
  if (experimentVariant === "variant-betslip-tabs-view-with-all") {
    return "with-all";
  } else if (experimentVariant === "variant-betslip-tabs-view-without-all") {
    return "without-all";
  }

  return null;
};
