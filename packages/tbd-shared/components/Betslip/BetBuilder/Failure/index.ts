import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import { createUniversalConnector } from "../../../universal-connector-factory";
import { ComponentProps, StateProps, DispatchProps } from "../props";
import { FailureContainerProps } from "./props";

export default createUniversalConnector<StateProps, DispatchProps, FailureContainerProps, ComponentProps>(
  makeMapStateToProps,
  mapDispatchToProps,
);
