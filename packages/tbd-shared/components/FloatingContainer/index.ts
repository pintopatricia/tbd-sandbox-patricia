import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import { createUniversalConnector } from "../universal-connector-factory";
import { ContainerProps, DispatchProps, FloatingContainerProps, StateProps } from "./props";

export default createUniversalConnector<StateProps, DispatchProps, ContainerProps, FloatingContainerProps>(
  makeMapStateToProps,
  mapDispatchToProps,
);
