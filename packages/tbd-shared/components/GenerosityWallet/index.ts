import { makeMapStateToProps, mapDispatchToProps, StateProps, DispatchProps } from "./map-to-props-factory";
import { createUniversalConnector } from "../universal-connector-factory";
import { ComponentProps } from "./props";

export default createUniversalConnector<StateProps, DispatchProps, {}, ComponentProps>(
  makeMapStateToProps,
  mapDispatchToProps,
);
