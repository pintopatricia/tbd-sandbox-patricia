export type ConnectedComponentsList<T> = {
  [key: string]: {
    connected: T;
    component: React.FunctionComponent<any>;
    placeholder?: React.FunctionComponent<any>;
  };
};
