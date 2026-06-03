import { RecentFormCaptionI18n } from "@ppb/the-wall-common/types/RecentForm/RecentFormCaption.types";

import { RecentFormResultI18n, RecentFormResultProps } from "../RecentFormResult/RecentFormResult.types";

export type RecentFormDetailedI18n = {
  captionI18n: RecentFormCaptionI18n;
  recentFormResultI18n: RecentFormResultI18n;
};

export type RecentFormDetailedProps = {
  relativeFixtureResult: [RecentFormResultProps[], RecentFormResultProps[]];
  i18n: RecentFormDetailedI18n;
};
