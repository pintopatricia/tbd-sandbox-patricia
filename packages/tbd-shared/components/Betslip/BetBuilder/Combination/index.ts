import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";
import { createUniversalConnector } from "../../../universal-connector-factory";
import { ComponentProps, StateProps, DispatchProps } from "../props";
import { CombinationContainerProps } from "./props";

export default createUniversalConnector<StateProps, DispatchProps, CombinationContainerProps, ComponentProps>(
  makeMapStateToProps,
  mapDispatchToProps,
);
