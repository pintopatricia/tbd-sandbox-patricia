import { createUniversalConnector } from "../universal-connector-factory";
import {
  makeMapStateToProps,
  StateProps,
  ContainerProps,
  mapDispatchToProps,
  DispatchProps,
} from "./map-to-props-factory";
import { ComponentProps } from "./props";

export default createUniversalConnector<StateProps, DispatchProps, ContainerProps, ComponentProps>(
  makeMapStateToProps,
  mapDispatchToProps,
  {},
);
