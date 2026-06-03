import { OutputParametricSelector, createSelector } from "reselect";
import { BettingState, generateRunnerId } from "@ppb/betslip-core";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import {
  getBettingResolvers,
  getSportsbookBettingReviewLines,
  getSportsbookBettingRunners,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { RunnersMetadata } from "@ppb/tbd-store/state/betting/sportsbook-betting/SportsbookBetting.types";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { buildSelection } from "../connected-sportsbook-betslip-mapper";

export type PreviewSelection = {
  id: string;
  title: string;
  subtitle: string;
};

export const createPreviewSelectionsSelector = (): OutputParametricSelector<
  ApplicationState,
  string,
  PreviewSelection[],
  (
    id: string,
    lines: BettingState.LinesMap,
    runners: BettingState.RunnersMap,
    userDetails: UserDetails,
    metadata: RunnersMetadata,
  ) => PreviewSelection[]
> => {
  const getUserDetails = createGetCountryLocalCurrencyCodeSelector();

  return createSelector(
    [
      (_: ApplicationState, id: string) => id,
      getSportsbookBettingReviewLines,
      getSportsbookBettingRunners,
      getUserDetails,
      (state: ApplicationState) => getBettingResolvers(state.betslip?.group).getMetadata(state),
    ],
    (id, lines, runners, userDetails, metadata) => {
      const currentLine = lines[id];
      const runnerIds = currentLine.runners.map((runnerTuple) => generateRunnerId(runnerTuple));

      return runnerIds
        .map((runnerId) => {
          const runner = runners[runnerId];
          const runnerMetadata = metadata[runnerId];

          if (!runner || !runnerMetadata) {
            return null;
          }

          const { title, subtitle } = buildSelection(metadata[runnerId], <UserDetails>userDetails, runner);

          return {
            id: runnerId,
            title,
            subtitle,
          };
        })
        .filter((runnerPreview): runnerPreview is PreviewSelection => !!runnerPreview);
    },
  );
};
