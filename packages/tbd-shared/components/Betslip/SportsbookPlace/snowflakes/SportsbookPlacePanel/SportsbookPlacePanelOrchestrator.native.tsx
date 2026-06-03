import { FunctionComponent } from "react";
import { SportsbookPlacePanel } from "./SportsbookPlacePanel.native";
import { SportsbookPlacePanelOrchestratorProps } from "./SportsbookPlacePanel.types";
import { SportsbookPlaceTabsPanel } from "./TabsView/SportsbookPlaceTabsPanel.native";
import { useTabsExperimentVariant } from "./useTabsExperimentVariant";

export const SportsbookPlacePanelOrchestrator: FunctionComponent<SportsbookPlacePanelOrchestratorProps> = (props) => {
  const { isDesktopLayout } = props;
  const tabsExperimentVariant = useTabsExperimentVariant();

  if (!isDesktopLayout && tabsExperimentVariant) {
    return <SportsbookPlaceTabsPanel {...props} experimentVariant={tabsExperimentVariant} />;
  }

  return <SportsbookPlacePanel {...props} />;
};
