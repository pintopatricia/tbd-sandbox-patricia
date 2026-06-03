import { createUniversalConnector } from "../universal-connector-factory";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import { ComponentProps, ContainerProps, DispatchProps, StateProps } from "./ObbCreatedBetsCardGroup.props";

export default createUniversalConnector<StateProps, DispatchProps, ContainerProps, ComponentProps>(
  makeMapStateToProps,
  mapDispatchToProps,
);
