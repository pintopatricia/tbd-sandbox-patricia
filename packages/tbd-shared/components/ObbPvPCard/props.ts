import { ContainerProps, DispatchProps, StateProps } from "./map-to-props-factory";

export type ComponentProps = StateProps & ContainerProps & DispatchProps;
