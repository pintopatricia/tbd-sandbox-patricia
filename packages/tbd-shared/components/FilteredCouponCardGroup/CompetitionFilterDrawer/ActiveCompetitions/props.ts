type ConnectedCard<T> = {
  urn: string;
  component: React.FunctionComponent<T>;
  placeholder: React.FunctionComponent;
};

export type CardProps = {
  selectedCompetitions: { id: string; name: string }[];
  onCompetitionRemove: (id: string) => void;
  resetText: string;
  onReset: () => void;
};

export type ConnectedProps = ConnectedCard<CardProps> & {
  selectedCompetitionsIds: string[];
  onCompetitionRemove: (id: string) => void;
  resetText: string;
  onReset: () => void;
};
