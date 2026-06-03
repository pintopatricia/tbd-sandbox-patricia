import { FixtureTeamSide } from "@ppb/the-wall-common/types";

export type SubstitutionNotificationProps = {
  title: string;
  playerIn?: string;
  playerOut?: string;
  side: FixtureTeamSide;
};
