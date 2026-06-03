export type DetailedSummaryItem = {
  title: string;
  amount: string;
};

export type DetailedSummaryGroups = {
  title: string;
  groups: DetailedSummaryItem[];
};

export type DetailedSummaryProps = {
  details: DetailedSummaryGroups[];
  showHorizontalRule: boolean;
};
