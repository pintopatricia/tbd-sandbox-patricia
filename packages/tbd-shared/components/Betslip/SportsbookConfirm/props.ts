import { ContainerProps, StateProps, DispatchProps } from "./map-to-props-factory";

export type ComponentProps = StateProps & DispatchProps & ContainerProps;
