export type Action = "PUSH" | "POP" | "REPLACE";
export type LocationListener<S> = (location: Location<S>, action: Action) => void;

export type Location<S> = {
  pathname: string;
  search: string;
  state: S | null;
  hash: string;
  key?: string;
};

export type History<S> = {
  location: Location<S>;
  push(path: string, state?: S): void;
  replace(path: string, state?: S): void;
  listen(listener: LocationListener<S>): () => void;
};
