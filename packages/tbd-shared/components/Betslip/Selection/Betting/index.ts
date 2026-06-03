import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import { createUniversalConnector } from "../../../universal-connector-factory";
import { ComponentProps, StateProps, DispatchProps, ContainerProps } from "../props";

export default createUniversalConnector<StateProps | false, DispatchProps, ContainerProps, ComponentProps>(
  makeMapStateToProps,
  mapDispatchToProps,
);
