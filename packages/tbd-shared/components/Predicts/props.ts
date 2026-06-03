import { CardProps, ContainerProps, DispatchProps } from "./map-to-props-factory";

export type ComponentProps = Partial<CardProps> & DispatchProps & ContainerProps;
