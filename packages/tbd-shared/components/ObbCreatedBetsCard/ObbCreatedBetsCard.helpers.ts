import { SelectorObbLeg } from "@ppb/tbd-store/state/entities/obb-legs/ObbLegs.types";
import { ObbBettingOpportunity } from "@ppb/tbd-store/state/layout/cards/obb-created-bets-card/ObbCreatedBetsCard.types";
import { buildObbAvgStatsDescription, buildObbLegDescription, formatQuote } from "../../helpers/obb";
import { ObbCreatedBetsCardBettingOpportunities } from "./ObbCreatedBetsCard.props";

export const buildBettingOpportunitiesVm = (
  bettingOpportunities: ObbBettingOpportunity[],
  getObbLegById: (legId: string) => SelectorObbLeg | undefined,
): ObbCreatedBetsCardBettingOpportunities[] =>
  bettingOpportunities
    .map((opportunity) => {
      const { legId, participants } = opportunity;

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
        legId: obbLeg.id,
        legTemplateId: obbLeg.templateId,
        title: obbLegDescription.participantsDescription,
        subtitle: obbLegDescription.outcomeDescription,
        statsLabel: obbAvgStatsDescription,
        quote: formatQuote(obbLeg.quote),
      };
    })
    .filter((opportunity): opportunity is ObbCreatedBetsCardBettingOpportunities => opportunity !== null);
