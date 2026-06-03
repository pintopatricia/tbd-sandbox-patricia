import { DispatchProps, CardProps, StateProps, ContainerProps } from "./map-to-props-factory";

export type ComponentProps = CardProps & StateProps & DispatchProps & ContainerProps;
