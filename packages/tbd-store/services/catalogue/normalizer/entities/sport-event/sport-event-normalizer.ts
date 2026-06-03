import { SportEvent } from "../../../../../state/entities";
import { SportEventFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeSportEventFragmentIntoSportEvent = (sportEvent: SportEventFragment): TransformedFragment<SportEvent> => {
  const { urn, eventId, name, competition, openDate, __typename } = sportEvent;

  return {
    data: {
      typename: __typename,
      urn,
      eventId,
      name,
      openDate,
      competition: competition?.urn,
    },
  };
};

export default normalizeSportEventFragmentIntoSportEvent;
