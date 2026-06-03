import {
  makeMapStateToProps,
  mapDispatchToProps,
  StateProps,
  DispatchProps,
  ContainerProps,
} from "./map-to-props-factory";
import { createUniversalConnector } from "../../universal-connector-factory";
import { ComponentProps } from "./props";
import { areStatePropsEqual } from "./state-comparer";

export default createUniversalConnector<StateProps | false, DispatchProps, ContainerProps, ComponentProps>(
  makeMapStateToProps,
  mapDispatchToProps,
  { areStatePropsEqual },
);
