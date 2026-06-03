import { OutputParametricSelector, createSelector } from "reselect";

import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { BettingState } from "@ppb/betslip-core";
import {
  getBettingResolvers,
  getSportsbookBettingLegs,
} from "@ppb/tbd-store/state/betting/sportsbook-betting/sportsbook-betting-selectors";
import { getSportsbookConfirmationLegs } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";
import { RunnersMetadata } from "@ppb/tbd-store/state/betting/sportsbook-betting/SportsbookBetting.types";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { OfflineUserDetails, UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { formatTime } from "../../../helpers/dates";

export type EventGroup = {
  urn: string;
  title: string;
  legIds: string[];
};
export type EventGroupMap = {
  [eventUrn: string]: EventGroup;
};

type LegSelector = (state: ApplicationState) => BettingState.LegsMap;

type EventGroupedLegsSelectorFn = (
  legIds: string[],
  legs: BettingState.LegsMap,
  userDetails: UserDetails,
  metadata: RunnersMetadata,
) => EventGroupMap;

type EventGroupedLegsSelector = OutputParametricSelector<
  ApplicationState,
  string[],
  EventGroupMap,
  EventGroupedLegsSelectorFn
>;

const createGetEventGroupedLegs = (legSelector: LegSelector): EventGroupedLegsSelector =>
  createSelector(
    [
      (_: ApplicationState, legIds: string[]) => legIds,
      legSelector,
      getUserDetails,
      (state: ApplicationState) => getBettingResolvers(state.betslip?.group).getMetadata(state),
    ],
    (
      legIds: string[],
      legs: BettingState.LegsMap,
      userDetails: UserDetails | OfflineUserDetails,
      metadata: RunnersMetadata,
    ) =>
      legIds.reduce((finalEventGroupMap: EventGroupMap, legId) => {
        const currentLeg = legs[legId];
        const [anyRunnerId] = currentLeg.runners;
        const runnerMetadata = metadata[anyRunnerId];

        if (runnerMetadata.type === "RACING") {
          const { localeCodeBcp47, timezone } = userDetails;
          const { urn, time, venue } = runnerMetadata.racing;
          const currentEventGroup = finalEventGroupMap[urn] || { legIds: [] };

          return {
            ...finalEventGroupMap,
            [urn]: {
              urn,
              title: `${formatTime(time, localeCodeBcp47, timezone)} ${venue}`,
              legIds: [...currentEventGroup.legIds, legId],
            },
          };
        }

        const { eventUrn, eventName } = runnerMetadata;
        const currentEventGroup = finalEventGroupMap[eventUrn] || { legIds: [] };

        return {
          ...finalEventGroupMap,
          [eventUrn]: {
            urn: eventUrn,
            title: eventName,
            legIds: [...currentEventGroup.legIds, legId],
          },
        };
      }, {}),
  );

export const createGetBettingEventGroupedLegs = (): ReturnType<typeof createGetEventGroupedLegs> =>
  createGetEventGroupedLegs(getSportsbookBettingLegs);

export const createGetConfirmationEventGroupedLegs = (): ReturnType<typeof createGetEventGroupedLegs> =>
  createGetEventGroupedLegs(getSportsbookConfirmationLegs);
