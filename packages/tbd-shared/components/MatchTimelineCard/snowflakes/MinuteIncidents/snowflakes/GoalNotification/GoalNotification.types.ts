import { FixtureTeamSide } from "@ppb/the-wall-common/types";

export type GoalNotificationProps = {
  title: string;
  description?: string;
  secondDescription?: string;
  side: FixtureTeamSide;
  isOwnGoal: boolean;
};
