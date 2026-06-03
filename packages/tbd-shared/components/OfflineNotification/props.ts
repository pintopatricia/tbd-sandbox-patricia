import { DispatchProps, StateProps, ContainerProps } from "./map-to-props-factory";

export type ComponentProps = StateProps & DispatchProps & ContainerProps;
