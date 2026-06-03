import { StateProps, ContainerProps, DispatchProps } from "./map-to-props-factory";

export type ComponentProps = StateProps & DispatchProps & ContainerProps;
