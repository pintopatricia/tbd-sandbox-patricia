import { RefObject } from "react";
import { FilteredCouponCardGroupDefaultSelections } from "../CompetitionFilterDrawer/CompetitionFilterDrawer.types";
import { MultipleFilter } from "../map-to-props-factory";

export type MultipleFilterDrawerOnClose = () => void;

export type MultipleFilterDrawerOnApply = (selectedOptions: string[], labels: (string | undefined)[]) => void;

export type MultipleFilterDrawerViewModel = {
  filter: MultipleFilter;
  selections: FilteredCouponCardGroupDefaultSelections;
  onApply: MultipleFilterDrawerOnApply;
  onClose: MultipleFilterDrawerOnClose;
  refObject?: RefObject<HTMLDivElement | null>;
};
