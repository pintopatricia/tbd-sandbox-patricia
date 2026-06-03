import { ObbSportEvent } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";
import { ObbOnboardingCard } from "../ObbOnboardingCardsCardGroup/ObbOnboardingCardsCardGroup.props";

export type ObbOnboardingCardProps = {
  cardGroupUrn: string;
  card: ObbOnboardingCard;
  event: ObbSportEvent;
};
