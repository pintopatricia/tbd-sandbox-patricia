import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { RaceByTimeRangeCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { MapStateToPropsFactory } from "react-redux";
import { PUSH, PushAction } from "@ppb/tbd-store/actions/router";
import { NavigateToView, UI__NAVIGATE_TO_VIEW } from "@ppb/tbd-store/actions/navigation";
import { createRaceByURNSelector } from "@ppb/tbd-store/state/entities/races/race-selectors";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { createSportsbookDisplayOddsPreferencesSelector } from "@ppb/tbd-store/state/entities/user-preferences/user-preferences-selectors";
import { OddsDisplayPreference, RacingSport } from "@ppb/tbd-store";
import { createMeetingByURNSelector } from "@ppb/tbd-store/state/entities/meetings/meeting-selectors";
import { getSportByURN } from "@ppb/tbd-store/state/entities/sports/sport-selectors";
import { MarketPromoSignposting } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import { formatTime } from "../../helpers/dates";
import { i18n } from "../../helpers/i18n";
import { formatStartingPrice, getFavouriteLabel } from "../../view-model-factories/race-results-card";
import { createIsBrandSettingEnabledSelector } from "@ppb/tbd-store/state/entities/brand-settings/brand-settings-selectors";

export type ContainerProps = {
  urn: URN;
};

export type CardProps = {
  title: string;
  subtitle?: string;
  viewLink: ViewLink;
  isRaceClosed?: boolean;
  promotion?: MarketPromoSignposting;
  isHorseRacing: boolean;
  isGrid: boolean;
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getCardByURNSelector = createCardByURNSelector<RaceByTimeRangeCards, URN>();
  const getSportsbookDisplayOddsPreferences = createSportsbookDisplayOddsPreferencesSelector();
  const getRaceByURN = createRaceByURNSelector();
  const getMeetingByURN = createMeetingByURNSelector();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();
  const isBrandSettingEnabled = createIsBrandSettingEnabledSelector();

  return function mapStateToProps(state: ApplicationState, { urn }: ContainerProps): StateProps {
    const raceByTimeRangeCard = getCardByURNSelector(state.layouts.cards.racebytimerangecards, urn);
    const { localeCodeBcp47, timezone } = <UserDetails>getUserDetailsSelector(state);

    if (!raceByTimeRangeCard) {
      return {};
    }

    const { viewLink, marketPromo, race, winnerIsp, startTime, winner } = raceByTimeRangeCard;

    const sportsbookOddsDisplay =
      getSportsbookDisplayOddsPreferences(state.entities.preferences) ?? OddsDisplayPreference.Decimal;

    const { details, name, meeting } = getRaceByURN(state.entities.races, race);

    const winnerOddValue = formatStartingPrice(winnerIsp, sportsbookOddsDisplay);

    const { sportUrn } = getMeetingByURN(state.entities.meetings, meeting);

    const sportId = getSportByURN(state.entities.sports, sportUrn)?.sportId;

    const isHorseRacing = sportId === RacingSport.HORSE_RACING;

    const title = formatTime(startTime, localeCodeBcp47, timezone);
    const isRaceClosed = !!details?.resultType;
    const promotion = !isRaceClosed ? marketPromo : undefined;
    const isGrid = isBrandSettingEnabled(state, "RACES_BY_TIME_GRID");

    if (!isHorseRacing) {
      return {
        title,
        viewLink,
        isRaceClosed,
        promotion,
        isHorseRacing,
        isGrid,
      };
    }

    const favouriteLabel = getFavouriteLabel(winnerIsp?.favourite);

    const raceWinner =
      winner &&
      `${i18n({ key: "I18N.RECENT_FORM.WINNER" })}: ${winner.toLowerCase()}${
        winnerOddValue ? ` @\u00A0${winnerOddValue}` : ""
      }${favouriteLabel ? ` (${favouriteLabel})` : ""}`;

    const raceClass = details?.raceClass ? `${i18n({ key: "I18N.LABELS.CLASS" })} ${details?.raceClass}` : undefined;

    const raceName = raceClass ? `${name}, ${raceClass}` : name;
    const subtitle = raceWinner ?? raceName;

    return {
      title,
      subtitle,
      viewLink,
      isRaceClosed: isRaceClosed || !!winner,
      promotion,
      isHorseRacing,
      isGrid,
    };
  };
};

const dispatchPush = (raceViewLink: ViewLink): PushAction => ({
  type: PUSH,
  payload: raceViewLink,
});

const dispatchClickAction = (urn: URN, url: string, label: string, isRaceClosed?: boolean): NavigateToView => ({
  type: UI__NAVIGATE_TO_VIEW,
  payload: {
    cardURN: urn,
    url,
    module: "secondary swimlane",
    label: isRaceClosed ? "resulted race time" : label,
  },
});

export type DispatchProps = {
  dispatchPush: typeof dispatchPush;
  dispatchClickAction: typeof dispatchClickAction;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchPush,
  dispatchClickAction,
};
