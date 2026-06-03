export type SearchBarHistoryProps = {
  historyLabel?: string;
  onHistoryClick: (searchTerm: string) => void;
  searchHistory: string[];
};
