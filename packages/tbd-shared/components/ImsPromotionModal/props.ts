import { StateProps, DispatchProps, ViewProps, ContainerProps } from "./map-to-props-factory";

export type ComponentProps = StateProps & ViewProps & DispatchProps & ContainerProps;
