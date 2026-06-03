import { createUniversalConnector } from "../universal-connector-factory";
import {
  ContainerProps,
  makeMapStateToProps,
  StateProps,
  DispatchProps,
  makeMapDispatchToProps,
} from "./map-to-props-factory";
import { ComponentProps } from "./props";

export default createUniversalConnector<StateProps, DispatchProps, ContainerProps, ComponentProps>(
  makeMapStateToProps,
  makeMapDispatchToProps,
);
