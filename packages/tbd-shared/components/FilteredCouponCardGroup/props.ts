import { DispatchProps, CardProps, ContainerProps } from "./map-to-props-factory";

export type { Filter, FilterBySelections } from "./map-to-props-factory";

export type ComponentProps = CardProps & DispatchProps & ContainerProps;
