import type { Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { HintType, OddsMovementDirection } from "@ppb/the-wall-common/types";
import { RacingSport } from "@ppb/tbd-store";
import type { Region } from "@ppb/the-wall-icons/traps";

type CardProps = {
  id: string;
  isPlacing?: boolean;
  urn?: string;
  title: string;
  subtitle: string;
  odd?: string;
  oddsMovement?: OddsMovementDirection;
  hintMessage?: string;
  hintType?: HintType;
  selectionTypeIcon?: Icons;
  is90Min?: boolean;
  icon?: string;
  silkFallbackType?: string;
  racingSport?: RacingSport;
  meetingCountry?: Region;
  trap?: string | number;
  isTrapIconThrottleActive?: boolean;
};

export type StateProps = CardProps | Record<string, never>;

export type ContainerProps = {
  id: string;
  isReadOnly: boolean;
  isPlacing?: boolean;
  displayOdds?: boolean;
};

export type DispatchProps = {
  dispatchSelectionRemove: (id: string, urn: string) => void;
};

export type ComponentProps = StateProps & DispatchProps & ContainerProps;
