import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { EventHeaderCard, EventHeaderCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { formatDateWithToday, formatTime } from "../../helpers/dates";

export type ContainerProps = {
  urn: URN;
};

export type CardProps = {
  date?: string;
  time?: string;
  dateTime?: Date;
} & EventHeaderCard;

export type StateProps = CardProps | Record<string, never>;
export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getEventHeaderCard = createCardByURNSelector<EventHeaderCards, URN>();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const eventHeaderCard = getEventHeaderCard(state.layouts.cards.eventheader, urn);
    const { localeCodeBcp47, timezone } = <UserDetails>getUserDetailsSelector(state);

    if (!eventHeaderCard) {
      return {};
    }

    const openDate = eventHeaderCard.date ? new Date(eventHeaderCard.date) : undefined;

    if (!openDate) {
      return eventHeaderCard;
    }

    const date = formatDateWithToday(openDate, localeCodeBcp47, timezone);
    const time = formatTime(openDate, localeCodeBcp47, timezone);
    const dateTime = openDate;

    return { ...eventHeaderCard, date, time, dateTime };
  };
};
