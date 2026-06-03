import { SelectorObbLeg } from "@ppb/tbd-store/state/entities/obb-legs/ObbLegs.types";
import { buildObbLegDescription, buildObbAvgStatsDescription } from "../../helpers/obb";
import { ObbPopularBettingOpportunity } from "@ppb/tbd-store/state/layout/cards/obb-event-populars-card/ObbEventPopularsCard.types";

import { ObbPopularBettingOpportunityProps } from "./ObbEventPopularsCard.props";
import { i18n } from "../../helpers/i18n";

const MIN_POPULAR_EVIDENCE_BET_COUNT = 10;

export const buildPopularBettingOpportunitiesVm = (
  popularBettingOpportunities: ObbPopularBettingOpportunity[],
  getObbLegById: (legId: string) => SelectorObbLeg | undefined,
): ObbPopularBettingOpportunityProps[] =>
  popularBettingOpportunities
    .map((popularBettingOpportunity): ObbPopularBettingOpportunityProps | null => {
      const { legId, betCount, participants } = popularBettingOpportunity;

      const obbLeg = getObbLegById(legId);

      if (!obbLeg || !obbLeg.templateParams) {
        return null;
      }

      const obbLegDescription = buildObbLegDescription(obbLeg);

      if (!obbLegDescription) {
        return null;
      }

      const obbAvgStatsDescription = buildObbAvgStatsDescription(obbLeg, participants);

      return {
        legId,
        title: obbLegDescription.participantsDescription,
        subtitle: obbLegDescription.outcomeDescription,
        stats: obbAvgStatsDescription,
        timesBackedLabel:
          betCount >= MIN_POPULAR_EVIDENCE_BET_COUNT
            ? i18n({
                key: "I18N.POPULAR.TIMES_BACKED",
                interpolationValues: { count: betCount },
              })
            : i18n({
                key: "I18N.OBB.POPULARS.POPULAR_EVIDENCE_FALLBACK",
              }),
      };
    })
    .filter((opportunity): opportunity is ObbPopularBettingOpportunityProps => opportunity !== null);
