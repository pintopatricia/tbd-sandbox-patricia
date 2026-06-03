import { createUniversalConnector } from "../universal-connector-factory";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import { ComponentProps, ContainerProps, StateProps, DispatchProps } from "./ObbCreatedBetsCard.props";

export default createUniversalConnector<StateProps, DispatchProps, ContainerProps, ComponentProps>(
  makeMapStateToProps,
  mapDispatchToProps,
);
