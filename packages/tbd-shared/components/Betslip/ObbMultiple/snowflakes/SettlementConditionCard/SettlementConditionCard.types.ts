import { ObbMultipleDetails } from "../../../../../helpers/obb";

export type SettlementConditionCardProps = {
  showStatusLabel?: boolean;
  potentialBets?: ObbMultipleDetails[];
  onChange?: (potentialBetId: string, direction?: "increase" | "decrease", source?: "selector" | "button") => void;
  readOnlyProps?: { selectionsToWin: number; totalSelections: number };
  defaultSliderStep?: number;
};
