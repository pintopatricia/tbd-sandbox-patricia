// This will be removed when this component is migrated Universal Components
import { createUniversalConnector } from "../universal-connector-factory";
import { makeMapStateToProps, mapDispatchToProps, DispatchProps, StateProps } from "./map-to-props-factory";
import { ComponentProps } from "./props";

export default createUniversalConnector<StateProps, DispatchProps, {}, ComponentProps>(
  makeMapStateToProps,
  mapDispatchToProps,
);
