import { ObbMultipleDetails } from "../../../helpers/obb";

export type Leg = {
  legId: string;
  participantsDescription: string;
  outcomeDescription: string;
};

type MultipleI18n = {
  notCombinableMessage: string;
  notCombinableAlert: string;
  selectionsToWin: string;
};

type CardProps = {
  i18n: MultipleI18n;
  selectionsTitle: string;
  eventName: string;
  legs: Leg[];
  hasNotCombinableFailure: boolean;
  potentialBetWithStake?: {
    id: string;
    x: number;
  };
};

export type StateProps = CardProps | Record<string, never>;

export type ContainerProps = {
  potentialBets: Array<ObbMultipleDetails>;
  shouldFocusStakeField?: boolean;
  hasAvailabilityHints?: boolean;
  hasReturnsLabel?: boolean;
};

export type DispatchProps = {
  dispatchRemoveSelectionAction: (legId: string) => void;
  dispatchSliderInteraction: (
    eventName: string,
    direction: "increase" | "decrease",
    source: "button" | "selector",
  ) => void;
  dispatchStakeChange: ({ potentialBetId, newValue }: { potentialBetId: string; newValue?: number }) => void;
  dispatchSliderDisplayed: (eventName: string) => void;
};

export type ComponentProps = StateProps & DispatchProps & ContainerProps;
