import type { FunctionComponent } from "react";

import type { FloatingContainerProps } from "./props";
import CbbFloatingButton from "./CbbFloatingButton/CbbFloatingButton.native";
import useFloatingContainerFeature from "./useFloatingContainerFeature";

const FloatingContainer: FunctionComponent<FloatingContainerProps> = ({ betslipHasSelections }) => {
  const state = useFloatingContainerFeature();

  switch (state?.feature) {
    case "CBB":
      return <CbbFloatingButton betslipHasSelections={betslipHasSelections} urn={state.urn} />;
    default:
      return null;
  }
};

export default FloatingContainer;
