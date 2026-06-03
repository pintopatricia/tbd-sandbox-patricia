import { StateProps, DispatchProps, ContainerProps } from "./map-to-props-factory";

export type ComponentProps = StateProps & ContainerProps & DispatchProps;
