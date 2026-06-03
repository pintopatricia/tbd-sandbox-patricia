import { NormalizersResult } from "@ppb/tbd-store/services/catalogue/normalizer/normalizer-engine";
import { Normalizers } from "@ppb/tbd-store/services/catalogue/normalizer/normalizer-config";
import { gql } from "../../types/__generated__/gql";

export const SportsEventFragment = gql(/* GraphQL */ `
  fragment sportEventCacheWarmup on SportsEvent {
    __typename
    urn
    eventId
    name
    openDate
    competition {
      __typename
      urn
      name
      sport {
        __typename
        urn
        name
      }
    }
  }
`);

export const buildSportEventFragment = (
  sportsevent: ReturnType<Normalizers["SportsEvent"]>["data"],
  catalogue: NormalizersResult,
) => {
  let competitionFragment = null;
  let sportFragment = null;

  const { typename: __typename, urn, eventId, name, openDate } = sportsevent;

  if (!eventId || !openDate) {
    return null;
  }

  const competition = catalogue.Competition?.find((c) => c.urn === sportsevent.competition);

  if (competition) {
    const sport = catalogue.Sport?.find((s) => s.urn === competition.sport);

    if (sport) {
      sportFragment = {
        __typename: sport.typename,
        urn: sport.urn,
        name: sport.name,
      };
    }

    competitionFragment = {
      __typename: competition.typename,
      urn: competition.urn,
      name: competition.name,
      sport: sportFragment,
    };
  }

  return {
    __typename,
    urn,
    eventId,
    name,
    openDate,
    competition: competitionFragment,
  };
};
