import { createUniversalConnector } from "../universal-connector-factory";
import { makeMapStateToProps, mapDispatchToProps, StateProps, ContainerProps } from "./map-to-props-factory";
import { ComponentProps } from "./props";

export default createUniversalConnector<StateProps, {}, ContainerProps, ComponentProps>(
  makeMapStateToProps,
  mapDispatchToProps,
);
