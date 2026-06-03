import { MyBetsAccaFreezeOpenedAction, MyBetsAccaFreezeClosedAction } from "@ppb/tbd-store/actions/my-bets";

export type ComponentProps = {
  urn: string;
  numberOfEligibleLegs: number;
  numberOfBetLegs: number;
  shouldShowFreezeSelectionButton: boolean;
  dispatchAccaFreezeOpenedAction: () => MyBetsAccaFreezeOpenedAction;
  dispatchAccaFreezeClosedAction: () => MyBetsAccaFreezeClosedAction;
};
