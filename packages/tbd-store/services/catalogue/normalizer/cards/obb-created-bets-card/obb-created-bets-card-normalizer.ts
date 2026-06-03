import { ObbCreatedBetsCardFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import normalizeObbFootballPlayerFragmentIntoObbFootballPlayer from "../../entities/obb-football-player/obb-football-player-normalizer";
import normalizeObbLegFragmentIntoObbLeg from "../../entities/obb-leg/obb-leg-normalizer";
import { TransformedFragment } from "../../Normalizer.types";
import { NormalizedObbCreatedBetsCard } from "./ObbCreatedBetsCard.types";

const normalizeObbCreatedBetsCardFragmentIntoObbCreatedBetsCard = (
  obbCreatedBetsCard: ObbCreatedBetsCardFragment,
): TransformedFragment<NormalizedObbCreatedBetsCard> => {
  const { __typename, urn, fixture, eventViewLink, footerViewLink, bettingOpportunities } = obbCreatedBetsCard;

  return {
    data: {
      typename: __typename,
      urn,
      fixture: "urn" in fixture ? fixture.urn : "",
      sportEvent: fixture.sportevent.urn,
      eventViewLink: {
        viewUrl: eventViewLink.viewUrl,
        viewUrn: eventViewLink.viewUrn,
      },
      footerViewLink: {
        viewUrl: footerViewLink.viewUrl,
        viewUrn: footerViewLink.viewUrn,
      },
      bettingOpportunities: bettingOpportunities.map(({ participants, leg }) => ({
        participants: participants.map(
          (footballPlayer) => normalizeObbFootballPlayerFragmentIntoObbFootballPlayer(footballPlayer).data,
        ),
        leg: normalizeObbLegFragmentIntoObbLeg(leg).data,
      })),
    },
  };
};

export default normalizeObbCreatedBetsCardFragmentIntoObbCreatedBetsCard;
