import { FixtureTeamSide, FixtureOutcome, AvBScore } from "@ppb/the-wall-common/types/FootballFixture.types";
import { RecentFormCaptionContentType } from "@ppb/the-wall-common/types/RecentForm/RecentFormCaption.types";

export type RecentFormResultI18n = {
  [FixtureOutcome.WIN]: string;
  [FixtureOutcome.DRAW]: string;
  [FixtureOutcome.LOSE]: string;
  [RecentFormCaptionContentType.PEN]: string;
  [RecentFormCaptionContentType.AET]: string;
  [FixtureTeamSide.HOME]: string;
  [FixtureTeamSide.AWAY]: string;
};

export type RecentFormResultProps = {
  score?: AvBScore;
  isExtraTimeScore?: boolean;
  penaltyScore?: AvBScore;
  opponent: string;
  competition?: string;
  date: string;
  side: FixtureTeamSide;
  outcome: FixtureOutcome;
  alignment: RecentFormResultAlignment;
  translations: RecentFormResultI18n;
};

export enum RecentFormResultAlignment {
  LEFT = "LEFT",
  RIGHT = "RIGHT",
}
