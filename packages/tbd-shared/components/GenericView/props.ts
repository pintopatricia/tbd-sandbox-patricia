import { StateProps, DispatchProps, ViewProps, ContainerProps } from "./map-to-props-factory";

export type ComponentProps = StateProps & DispatchProps & ContainerProps;

export type LoadedComponentProps = ViewProps & DispatchProps & ContainerProps;
