import { makeMapStateToProps, StateProps, ContainerProps, mapDispatchToProps } from "./map-to-props-factory";
import { createUniversalConnector } from "../universal-connector-factory";
import { ComponentProps } from "./props";

export default createUniversalConnector<StateProps, {}, ContainerProps, ComponentProps>(
  makeMapStateToProps,
  mapDispatchToProps,
);
