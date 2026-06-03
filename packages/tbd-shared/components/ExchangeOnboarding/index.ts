import { createUniversalConnector } from "../universal-connector-factory";
import { makeMapStateToProps, makeMapDispatchToProps, StateProps, DispatchProps } from "./map-to-props-factory";
import { ComponentProps } from "./props";

export default createUniversalConnector<StateProps, DispatchProps, {}, ComponentProps>(
  makeMapStateToProps,
  makeMapDispatchToProps,
);
