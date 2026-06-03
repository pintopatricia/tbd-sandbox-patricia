export type StateProps = {
  legIds: string[];
  title: string;
  description?: string;
};

export type ContainerProps = {
  legIds?: string[];
  isWarning?: boolean;
  hasIcon?: boolean;
  renderLeg: (legId: string) => React.ReactNode;
  onRemove?: () => void; // TODO: replace with the-wall component type
};

export type DispatchProps = {
  dispatchCollapseToggle: (isExpanded: boolean) => void;
};

export type ComponentProps = StateProps & DispatchProps & ContainerProps;
