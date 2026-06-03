import { createUniversalConnector } from "../universal-connector-factory";
import {
  makeMapStateToProps,
  ContainerProps,
  StateProps,
  DispatchProps,
  mapDispatchToProps,
  ComponentProps,
} from "./map-to-props-factory";

export default createUniversalConnector<StateProps, DispatchProps, ContainerProps, ComponentProps>(
  makeMapStateToProps,
  mapDispatchToProps,
);
