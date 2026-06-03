import i18n from "i18next";
import { ApplicationState, ObbLegTaggingMetadata, ObbModuleMetadata } from "../state";
import { getLayoutMetadata } from "../state/layout-snapshot";
import { ObbCard } from "../state/layout/cards/obb-card/ObbCard.types";
import { getUniqueId } from "./betting";

export const generateBetDetailsFromState = (legId: string, state?: ApplicationState) => {
  if (!state) return undefined;

  const { obbLegs, sportevents, competitions, sports } = state.entities;

  const eventUrn = obbLegs[legId]?.event.urn ?? "";
  const eventId = eventUrn ? sportevents[eventUrn].eventId : "";
  const competitionUrn = eventUrn ? sportevents[eventUrn].competition : "";
  const competitionId = competitionUrn ? competitions[competitionUrn].competitionId : "";
  const competitionName = competitionUrn ? competitions[competitionUrn].name : "";
  const sportUrn = competitionUrn ? competitions[competitionUrn].sport : "";
  const sportId = sportUrn ? sports[sportUrn].sportId : "";
  const sportName = sportUrn ? sports[sportUrn].name : "";
  const card = Object.values(state.layouts.cards.obbcards).find((cardElement: ObbCard) => {
    if ("defaultLegs" in cardElement) {
      // in squad bet card type, the legId was in defaultLegs field
      return cardElement.defaultLegs?.some((defaultLegId: string) => defaultLegId === legId);
    }

    if ("selectedLegs" in cardElement) {
      // in build ups card type, the legId was in defaultLegs field
      return cardElement.selectedLegs?.some((defaultLegId: string) => defaultLegId === legId);
    }

    return false;
  });

  const moduleMetadata: ObbModuleMetadata = {};

  if (card) {
    const { tabName, cardGroupTitle = "", cardLayoutTitle = "" } = getLayoutMetadata(card.urn);

    moduleMetadata.group = cardGroupTitle;
    moduleMetadata.layout = cardLayoutTitle;
    moduleMetadata.tabName = tabName;
    if (card.typename === "ObbPvpCard") {
      moduleMetadata.card = i18n.t("I18N.OBB.OUTCOME_SUMMARY.PVP", {
        incidentType: card.incidentType,
        operator: "MORE",
        count: 2,
      });
    } else if (card.typename === "ObbSquadBetCard") {
      moduleMetadata.card = card.title;
    }
  }

  const placedBetSelectionEvent: ObbLegTaggingMetadata = {
    ...moduleMetadata,
    eventId: eventId?.toString() ?? "null",
    competitionId: competitionId?.toString() ?? "null",
    sportId: sportId?.toString() ?? "null",
    competition: competitionName,
    sport: sportName,
    uniqueId: getUniqueId(state),
  };

  return placedBetSelectionEvent;
};
