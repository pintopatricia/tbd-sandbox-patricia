export type CombinationsListI18n = {
  title: string;
  odd: string;
  payout: string;
  more: string;
  less: string;
};

export type ListCombinationLine = {
  id: string;
  odd: string;
  payout: string;
  children: React.ReactNode;
};

export type CombinationsListProps = {
  children: React.ReactNode;
  isOpen: boolean;
  shortViewCount: number;
  i18n: CombinationsListI18n;
} & CombinationsListCallbacks;

export type CombinationsListOnButtonClick = () => void;

export type CombinationsListCallbacks = {
  onToggle: CombinationsListOnButtonClick;
  onMore: CombinationsListOnButtonClick;
};
