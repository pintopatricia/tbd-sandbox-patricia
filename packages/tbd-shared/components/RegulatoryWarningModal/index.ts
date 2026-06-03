import { createUniversalConnector } from "../universal-connector-factory";

import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import type { ContainerProps, DispatchProps, StateProps } from "./map-to-props-factory";
import type { ComponentProps } from "./props";

export default createUniversalConnector<StateProps, DispatchProps, ContainerProps, ComponentProps>(
  makeMapStateToProps,
  mapDispatchToProps,
);
