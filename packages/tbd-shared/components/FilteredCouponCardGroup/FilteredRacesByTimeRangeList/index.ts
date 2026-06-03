import { createUniversalConnector } from "../../universal-connector-factory";
import { ComponentProps } from "./props";
import {
  makeMapStateToProps,
  StateProps,
  DispatchProps,
  ContainerProps,
  mapDispatchToProps,
} from "./map-to-props-factory";

export default createUniversalConnector<StateProps, DispatchProps, ContainerProps, ComponentProps>(
  makeMapStateToProps,
  mapDispatchToProps,
);
