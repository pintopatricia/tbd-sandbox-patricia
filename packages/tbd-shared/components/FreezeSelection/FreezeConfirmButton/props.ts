import { BetLeg } from "@ppb/tbd-store";

export type ComponentProps = StateProps & ContainerProps;

export type StateProps = {
};

export type ContainerProps = {
  selectedLeg?: BetLeg;
  oddsLabel?: string;
  onConfirm: () => void;
};
