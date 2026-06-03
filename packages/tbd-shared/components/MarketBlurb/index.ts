import { createUniversalConnector } from "../universal-connector-factory";

import {
  makeMapStateToProps,
  mapDispatchToProps,
  StateProps,
  DispatchProps,
  ContainerProps,
} from "./map-to-props-factory";
import { ComponentProps } from "./props";

export default createUniversalConnector<StateProps, DispatchProps, ContainerProps, ComponentProps>(
  makeMapStateToProps,
  mapDispatchToProps,
);
