import {
  StateProps,
  ContainerProps,
  makeMapStateToProps,
  mapDispatchToProps,
  DispatchProps,
} from "./map-to-props-factory";
import { ComponentProps } from "./props";
import { createUniversalConnector } from "../../universal-connector-factory";

export default createUniversalConnector<StateProps, DispatchProps, ContainerProps, ComponentProps>(
  makeMapStateToProps,
  mapDispatchToProps,
);
