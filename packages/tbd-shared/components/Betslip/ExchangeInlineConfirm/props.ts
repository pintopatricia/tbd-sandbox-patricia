import { StateProps, DispatchProps } from "./map-to-props-factory";

export type ContainerProps = {};

export type ComponentProps = StateProps & DispatchProps & ContainerProps;
