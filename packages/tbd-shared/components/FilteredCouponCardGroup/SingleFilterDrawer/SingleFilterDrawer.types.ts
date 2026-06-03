import { RefObject } from "react";
import { SingleFilter, SingleFilterSelection } from "../map-to-props-factory";

export type SingleFilterDrawerOnClose = () => void;

export type SingleFilterDrawerOnApply = (
  selectedOptions: string[],
  labels: (string | undefined)[],
  selectedFilter?: SingleFilter,
) => void;

export type SingleFilterDrawerViewModel = {
  filter: SingleFilter;
  selections: SingleFilterSelection;
  onApply: SingleFilterDrawerOnApply;
  onClose: SingleFilterDrawerOnClose;
  refObject?: RefObject<HTMLDivElement | null>;
};
