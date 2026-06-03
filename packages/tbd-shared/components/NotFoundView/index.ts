import { createUniversalConnector } from "../universal-connector-factory";
import {
  makeMapStateToProps,
  StateProps,
  DispatchProps,
  ContainerProps,
  mapDispatchToProps,
} from "./map-to-props-factory";
import { ComponentProps } from "./props";

export default createUniversalConnector<StateProps, DispatchProps, ContainerProps, ComponentProps>(
  makeMapStateToProps,
  mapDispatchToProps,
);
