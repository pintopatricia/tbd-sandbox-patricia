import { CardProps, StateProps, DispatchProps, ContainerProps } from "./map-to-props-factory";

export type ComponentProps = StateProps & DispatchProps & ContainerProps;

export type LoadedComponentProps = CardProps & DispatchProps & ComponentProps;
