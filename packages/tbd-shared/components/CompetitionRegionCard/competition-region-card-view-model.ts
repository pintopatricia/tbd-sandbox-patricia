import { createSelector, ParametricSelector } from "reselect";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import {
  createHydratedCompetitionRegionSelector,
  HydratedCompetitionRegion,
} from "@ppb/tbd-store/state/application-state-selectors";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { i18n } from "../../helpers/i18n";
import { TranslationKey } from "../../translations/keys";

export type CompetitionViewLink = {
  title: string;
  viewLink: ViewLink;
};

export type CompetitionRegionMapped = {
  urn: string;
  title: string;
  flag?: string;
  competitionViewLinks: CompetitionViewLink[];
};

export const createCompetitionRegionViewModel = (): ParametricSelector<
  ApplicationState,
  URN,
  CompetitionRegionMapped[] | null
> => {
  const getHydratedCompetitionRegion = createHydratedCompetitionRegionSelector();

  return createSelector(
    [
      (state: ApplicationState, urn: URN) => getHydratedCompetitionRegion(state, urn),
      (state: ApplicationState) => <UserDetails>getUserDetails(state),
    ],
    (competitionRegions: HydratedCompetitionRegion[] | null, userDetails: UserDetails) => {
      if (!competitionRegions) {
        return null;
      }
      return competitionRegions
        .filter((competitionRegion) => competitionRegion.competitionViewLinks.length)
        .map((competitionRegion) => ({
          urn: competitionRegion.urn,
          title: i18n({
            key: `I18N.COUNTRIES.${competitionRegion.code.toUpperCase()}` as keyof TranslationKey,
          }),
          flag: competitionRegion.flag,
          competitionViewLinks: competitionRegion.competitionViewLinks.map((competitionViewLink) => ({
            title: competitionViewLink.competition.name,
            viewLink: competitionViewLink.viewLink,
          })),
        }))
        .sort((competition1, competition2) =>
          competition1.title.localeCompare(competition2.title, userDetails.localeCodeBcp47),
        );
    },
  );
};
