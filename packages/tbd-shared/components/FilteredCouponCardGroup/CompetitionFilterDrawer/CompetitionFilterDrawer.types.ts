import { RefObject } from "react";
import { OptionListItem } from "@ppb/the-wall-common/types";

export type CompetitionFilterDrawerOnClose = () => void;

export type CompetitionFilterDrawerOnApply = (selectedOptions: string[], labels: (string | undefined)[]) => void;

export type CompetitionFilterGroup = {
  id: string;
  flag: string | undefined;
  title: string;
  items: OptionListItem[];
};

export type FilteredCouponCardGroupDefaultSelections = {
  sortFilter: string | undefined;
  dateRangeFilter: string | undefined;
  marketTypeFilter: string | null;
  competitionFilter: { urn: string; name: string }[] | undefined;
  monthFilter: string[] | undefined;
  countriesFilter: string[] | undefined;
};

export type CompetitionFilterDrawerViewModel = {
  urn: string;
  title: string;
  topCompetitions: CompetitionFilterGroup;
  currentSelections: FilteredCouponCardGroupDefaultSelections;
  onApply: CompetitionFilterDrawerOnApply;
  onClose: CompetitionFilterDrawerOnClose;
  resetText: string;
  refObject?: RefObject<HTMLDivElement | null>;
};
