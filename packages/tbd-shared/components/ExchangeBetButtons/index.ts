import {
  makeMapStateToProps,
  makeMapDispatchToProps,
  StateProps,
  ContainerProps,
  DispatchProps,
} from "./map-to-props-factory";
import { createUniversalConnector } from "../universal-connector-factory";
import { ComponentProps } from "./props";

export default createUniversalConnector<StateProps, DispatchProps, ContainerProps, ComponentProps>(
  makeMapStateToProps,
  makeMapDispatchToProps,
);
