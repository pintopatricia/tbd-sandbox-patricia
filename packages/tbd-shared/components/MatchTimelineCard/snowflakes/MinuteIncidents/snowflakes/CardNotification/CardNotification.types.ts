import { FixtureTeamSide } from "@ppb/the-wall-common/types";

export enum CardNotificationType {
  RED = "RED",
  YELLOW = "YELLOW",
  SECOND_YELLOW = "SECOND_YELLOW",
}

export type CardNotificationProps = {
  title: string;
  cardType: CardNotificationType;
  side: FixtureTeamSide;
  description?: string;
};
