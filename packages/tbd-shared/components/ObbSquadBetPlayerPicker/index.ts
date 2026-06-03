import { createUniversalConnector } from "../universal-connector-factory";
import { ContainerProps, StateProps, DispatchProps, ComponentProps } from "./props";

import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

export default createUniversalConnector<StateProps, DispatchProps, ContainerProps, ComponentProps>(
  makeMapStateToProps,
  mapDispatchToProps,
);
