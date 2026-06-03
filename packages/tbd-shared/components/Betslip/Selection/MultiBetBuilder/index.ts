import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import { createUniversalConnector } from "../../../universal-connector-factory";
import { ComponentProps, StateProps, DispatchProps, ContainerProps } from "../props";

export default createUniversalConnector<StateProps, DispatchProps, ContainerProps, ComponentProps>(
  makeMapStateToProps,
  mapDispatchToProps,
);
