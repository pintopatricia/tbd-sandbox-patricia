import { FixtureTeamSide } from "@ppb/the-wall-common/types";

export type TeamNotificationProps = {
  title: string;
  description?: string;
  side: FixtureTeamSide;
};
