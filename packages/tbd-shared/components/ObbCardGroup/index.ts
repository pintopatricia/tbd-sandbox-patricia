import { createUniversalConnector } from "../universal-connector-factory";
import {
  ContainerProps,
  DispatchProps,
  StateProps,
  makeMapStateToProps,
  mapDispatchToProps,
} from "./map-to-props-factory";
import { ComponentProps } from "./props";

export default createUniversalConnector<StateProps, DispatchProps, ContainerProps, ComponentProps>(
  makeMapStateToProps,
  mapDispatchToProps,
);
