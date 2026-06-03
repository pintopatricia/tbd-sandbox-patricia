export type Observe = (node: ObservableElement | null, urn: string) => void;

export type VisibilityObserverOptions = {
  onShow?: (urn: string) => void;
  onFirstShow?: (urn: string) => void;
  onHide?: (urn: string) => void;
};

export type ObservableElement = Element & { urn?: string };

export type Nodes = Record<string, boolean | undefined>;
