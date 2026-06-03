import { ObbEventSelectionAction } from "@ppb/tbd-store/actions/obb";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ObbSportEvent } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";
import { Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

export type ContainerProps = {
  urn: string;
};

export type ObbOnboardingCardParticipant = {
  urn: string;
  name: string;
  jersey?: string;
};

export type JerseySize = "small" | "large";

export type ObbSquadBetOnboardingCard = {
  type: "SquadBet";
  legIds: string[];
  outcomeLabel: string;
  outcomeIcon?: Icons;
  participants: ObbOnboardingCardParticipant[];
};

export type ObbSquadVsSquadOnboardingCard = {
  type: "SquadVsSquad";
  legIds: string[];
  outcomeLabel: string;
  outcomeIcon?: Icons;
  jerseySize: JerseySize;
  squadAParticipants: ObbOnboardingCardParticipant[];
  squadBParticipants: ObbOnboardingCardParticipant[];
};

export type ObbOnboardingCard = ObbSquadBetOnboardingCard | ObbSquadVsSquadOnboardingCard;

export type ObbOnboardingCardsCardGroupProps = {
  urn: URN;
  title?: string;
  badgeLabel?: string;
  event: ObbSportEvent;
  onboardingCards: ObbOnboardingCard[];
  clearCardGroupView: boolean;
};

export type StateProps = ObbOnboardingCardsCardGroupProps | Record<string, never>;

export type DispatchProps = {
  dispatchOnboardingCardGroupDisplayed: (eventName: string, numberOfCards: number) => void;
  dispatchOnboardingCardGroupScrollEvent: (eventName: string, direction: "left" | "right") => void;
  dispatchObbEventSelection: (event: ObbEventSelectionAction["payload"]["event"], eventName?: string) => void;
  dispatchDeleteObbOnboardingCardsCardGroup: () => void;
};

export type ComponentProps = StateProps & ContainerProps & DispatchProps;
