import { CardProps, ContainerProps, DispatchProps } from "./map-to-props-factory";

export type KindComponentProps<T> = Omit<T, "kind">;
export type ComponentProps = CardProps & DispatchProps & ContainerProps;
