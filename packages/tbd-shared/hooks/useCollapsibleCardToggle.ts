import { useCallback, useState } from "react";
import { CardProps, DispatchProps } from "../components/SportsbookExpandableLegCardGroup/map-to-props-factory";

const useCollapsibleCardToggle = ({
  isBetPanelOpen,
  dispatchToggleAccordionAction: toggleAction,
}: Pick<CardProps & DispatchProps, "isBetPanelOpen" | "dispatchToggleAccordionAction">) => {
  const [isExpanded, setIsExpanded] = useState(isBetPanelOpen);

  const onCollapseToggle = useCallback(
    (expanded: boolean) => {
      setIsExpanded((prev) => !prev);
      toggleAction(expanded);
    },
    [toggleAction],
  );

  return { isExpanded, onCollapseToggle };
};

export default useCollapsibleCardToggle;
