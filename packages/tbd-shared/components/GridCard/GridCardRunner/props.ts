import { AzSwitcherProps, URN } from "@ppb/the-wall-common/types";
import { GridCardItem } from "../map-to-props-factory";

export type GridCardRunnerProps = {
  lineIndex: number;
  lineLabel: string;
  items: GridCardItem[];
  urn: URN;
  azSwitcherProps?: AzSwitcherProps;
  jersey?: string;
  useFallbackJersey?: boolean;
  hasJerseys: boolean;
  hasStats: boolean;
  statValue?: string;
  statValueInterpolation?: Record<string, string | number>;
  statLabel?: string;
};
