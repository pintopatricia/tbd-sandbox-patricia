import { CardProps, ContainerProps, DispatchProps } from "./map-to-props-factory";

export type CardWhiteList<T> = {
  [key: string]: {
    connected: T;
    component: React.FunctionComponent<any>;
    placeholder?: React.FunctionComponent<any>;
    visible?: boolean;
  };
};

export type ComponentProps = CardProps & DispatchProps & ContainerProps;
