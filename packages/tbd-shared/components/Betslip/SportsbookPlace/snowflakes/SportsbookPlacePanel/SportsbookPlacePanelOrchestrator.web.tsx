import { forwardRef } from "react";
import { SportsbookPlacePanelOrchestratorProps } from "./SportsbookPlacePanel.types";
import { SportsbookPlacePanel } from "./SportsbookPlacePanel.web";
import { SportsbookPlaceTabsPanel } from "./TabsView/SportsbookPlaceTabsPanel.web";
import { useTabsExperimentVariant } from "./useTabsExperimentVariant";

export const SportsbookPlacePanelOrchestrator = forwardRef<HTMLDivElement, SportsbookPlacePanelOrchestratorProps>(
  (props, ref) => {
    const { isDesktopLayout } = props;
    const tabsExperimentVariant = useTabsExperimentVariant();

    if (!isDesktopLayout && tabsExperimentVariant) {
      return <SportsbookPlaceTabsPanel {...props} experimentVariant={tabsExperimentVariant} />;
    }

    return <SportsbookPlacePanel ref={ref} {...props} />;
  },
);

SportsbookPlacePanelOrchestrator.displayName = "SportsbookPlacePanelOrchestrator";
