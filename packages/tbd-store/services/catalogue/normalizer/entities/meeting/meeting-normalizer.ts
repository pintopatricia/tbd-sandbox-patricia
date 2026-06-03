import { Meeting } from "../../../../../state/entities";
import { MeetingFragment } from "../../../../../clients/catalogue/catalogue-response-types";
import { TransformedFragment } from "../../Normalizer.types";

const normalizeMeetingFragmentIntoMeeting = (meeting: MeetingFragment): TransformedFragment<Meeting> => {
  const { urn, venue, country, countryFlag, date, name, sport, meetingId, __typename } = meeting;

  return {
    data: {
      urn,
      typename: __typename,
      venue,
      meetingId,
      entityName: name,
      sportUrn: sport.urn,
      country,
      countryFlag:
        (countryFlag && {
          small: countryFlag.small || undefined,
          medium: countryFlag.medium || undefined,
          large: countryFlag.large || undefined,
        }) ||
        undefined,
      date: date || undefined,
    },
  };
};

export default normalizeMeetingFragmentIntoMeeting;
