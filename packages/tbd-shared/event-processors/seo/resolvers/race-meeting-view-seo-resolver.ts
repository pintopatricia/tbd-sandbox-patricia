import type { ApolloClient } from "@apollo/client";
import { resolveAndDispatchSeo, SeoInput } from "@ppb/tbd-store/middlewares/seo/seo-metadata-resolver";
import { convertToSMDCompliantDateTime } from "@ppb/tbd-store/helpers/dates";
import { getStore } from "@ppb/tbd-store/create-store";
import { getUserDetails } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { getApolloClient } from "../../../apollo-client/client";
import { RaceMeetingViewSeoFragment } from "../RaceMeetingViewSeo.graphql";

export function buildRaceMeetingViewSeoInput(
  apolloClient: ApolloClient,
  urn: string,
  timezone: string,
): SeoInput | null {
  const { cache } = apolloClient;

  const id = cache.identify({
    __typename: "RaceMeetingView",
    urn,
  });

  if (!id) {
    return null;
  }

  const cached = cache.readFragment({
    id,
    fragment: RaceMeetingViewSeoFragment,
  });

  if (!cached) {
    return null;
  }

  const { name: raceName, startTime } = cached.items.selectedRace.race;
  const { venue: venueName, sport } = cached.meeting;

  return {
    pageIdentifier: {
      pageType: "RACE",
      eventTypeId: sport.sportId,
    },
    pageData: {
      race: {
        raceName,
        venueName,
        raceTime: convertToSMDCompliantDateTime(startTime, timezone),
      },
    },
    metaElements: ["META_TITLE", "META_DESCRIPTION"],
  };
}

export async function resolveRaceMeetingViewSeo(urn: string): Promise<void> {
  const { timezone } = getUserDetails(getStore().getState());
  const seoInput = buildRaceMeetingViewSeoInput(getApolloClient(), urn, timezone);

  if (!seoInput) {
    return;
  }

  await resolveAndDispatchSeo(seoInput);
}
