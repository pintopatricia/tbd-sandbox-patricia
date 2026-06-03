import { createUniversalConnector } from "../universal-connector-factory";
import { ContainerProps, makeMapStateToProps, mapDispatchToProps, StateProps } from "./map-to-props-factory";
import { ComponentProps } from "./props";

export default createUniversalConnector<StateProps, {}, ContainerProps, ComponentProps>(
  makeMapStateToProps,
  mapDispatchToProps,
);
