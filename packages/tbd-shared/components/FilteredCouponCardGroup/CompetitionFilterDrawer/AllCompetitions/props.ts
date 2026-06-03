import { CompetitionFilterGroup } from "../CompetitionFilterDrawer.types";

type ConnectedCard<T> = {
  urn: string;
  component: React.FunctionComponent<T>;
  placeholder: React.FunctionComponent;
};

export type AllCompetitionsCheckboxListHandler = (opt: { id: string; text: string }) => void;

export type CardProps = {
  competitions: CompetitionFilterGroup[];
  selectedCompetitions: string[];
  onCheckboxListChange: AllCompetitionsCheckboxListHandler;
};

export type ConnectedProps = ConnectedCard<CardProps> & {
  selectedCompetitions: string[];
  onCheckboxListChange: AllCompetitionsCheckboxListHandler;
};
