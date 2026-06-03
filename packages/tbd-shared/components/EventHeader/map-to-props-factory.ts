import { MapStateToPropsFactory } from "react-redux";
import { createSelector } from "reselect";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { SportsbookMarket } from "@ppb/tbd-store/state/entities/sportsbook-markets/SportsbookMarket.types";
import {
  ExchangeMarket,
  ExchangeMarketStatus,
} from "@ppb/tbd-store/state/entities/exchange-markets/ExchangeMarket.types";
import { createSportEventByURNSelector } from "@ppb/tbd-store/state/entities/sport-events/sport-event-selectors";
import { createSportsbookMarketByURNSelector } from "@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors";
import { createExchangeMarketSelector } from "@ppb/tbd-store/state/entities/exchange-markets/exchange-market-selectors";
import { createCompetitionSelector } from "@ppb/tbd-store/state/entities/competitions/competition-selectors";
import { EventHeaderCommonProps, EventHeaderViewMode, ScoreboardViewMode } from "@ppb/the-wall-common/types";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { MarketRunner } from "@ppb/tbd-store/state/entities/Market.types";
import { IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import { createGetThrottleSelector } from "@ppb/tbd-store";
import { formatDateWithToday, formatTime, formatStartTime } from "../../helpers/dates";
import { i18n } from "../../helpers/i18n";

export type ContainerProps = {
  exchangeURN?: URN;
  sportsbookURN?: URN;
  sporteventURN: URN;
  baseFixtureURN?: URN;
  viewMode: ScoreboardViewMode;
  showTertiaryTitle?: boolean;
  showBottomSeparator?: boolean;
  showHorizontalDuration?: boolean;
  displayRunners?: URN[];
  availableToSubscribe?: boolean;
  iconsList?: EventHeaderCommonProps["iconsList"];
  isSticky?: boolean;
};

export type CardProps = {
  title: string;
  subtitle: string;
  inPlay?: string;
  tertiaryTitle?: string;
  isSticky?: boolean;
  showBorder?: boolean;
  viewMode: EventHeaderViewMode;
  homeRunnerName?: string;
  awayRunnerName?: string;
  date?: string;
  time?: string;
  dateTime?: Date;
  sporteventURN: URN;
  iconsList: ContainerProps["iconsList"];
};

export type StateProps = CardProps | Record<string, never>;

type Teams = { home: MarketRunner; away: MarketRunner };

function getDefaultTeams(marketRunners: MarketRunner[]): Teams {
  const { 0: defaultHome, [marketRunners.length - 1]: defaultAway } = marketRunners;

  return {
    home: defaultHome,
    away: defaultAway,
  };
}

function getTeams(market: ExchangeMarket | SportsbookMarket | null, displayRunners: URN[] | undefined): Teams | null {
  if (!market?.runners || market.runners.length < 2) {
    return null;
  }

  if (!displayRunners || displayRunners.length === 0) {
    return getDefaultTeams(market.runners);
  }

  const { 0: firstRunner, [displayRunners.length - 1]: lastRunner } = displayRunners;
  const home = market.runners.find((runner) => runner.urn === firstRunner);
  const away = market.runners.find((runner) => runner.urn === lastRunner);

  if (!home || !away) {
    return getDefaultTeams(market.runners);
  }

  return {
    home,
    away,
  };
}

const createMergedIconsListSelector = () =>
  createSelector(
    [
      (iconsList: ContainerProps["iconsList"]) => iconsList,
      (_iconsList: ContainerProps["iconsList"], hasAccaFreeze: boolean) => hasAccaFreeze,
    ],
    (iconsList, hasAccaFreeze): ContainerProps["iconsList"] =>
      hasAccaFreeze ? [...(iconsList ?? []), IconsList.ACCA_FREEZE_PROMO] : iconsList,
  );

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getSportEventByURN = createSportEventByURNSelector();
  const getCompetitionByURN = createCompetitionSelector();
  const getExchangeMarketByUrn = createExchangeMarketSelector();
  const getSportsbookMarketByUrn = createSportsbookMarketByURNSelector();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();
  const getThrottle = createGetThrottleSelector();
  const getMergedIconsList = createMergedIconsListSelector();

  const inplayLabel = i18n({ key: "I18N.SPORT_EVENT.IN_PLAY" });

  return function mapStateToProps(state: ApplicationState, props: ContainerProps): StateProps {
    const { localeCodeBcp47, timezone } = <UserDetails>getUserDetailsSelector(state);
    const sportevent = getSportEventByURN(state.entities.sportevents, props.sporteventURN);

    if (!sportevent) return {};
    const competition = sportevent && getCompetitionByURN(state.entities.competitions, sportevent.competition);

    const sbkMarket =
      (props.sportsbookURN && getSportsbookMarketByUrn(state.entities.sportsbookmarkets, props.sportsbookURN)) || null;
    const excMarket =
      (props.exchangeURN && getExchangeMarketByUrn(state.entities.exchangemarkets, props.exchangeURN)) || null;

    const baseFixtureIsInplay =
      (sbkMarket?.status !== "CLOSED" && sbkMarket?.inplay) ||
      (excMarket?.status !== ExchangeMarketStatus.Closed && excMarket?.inplay) ||
      false;

    const openDate = sportevent.openDate ? new Date(sportevent.openDate) : undefined;

    let date: string | undefined;
    let time: string | undefined;

    if (openDate) {
      date = formatDateWithToday(openDate, localeCodeBcp47, timezone);
      time = formatTime(openDate, localeCodeBcp47, timezone);
    }

    const teams = getTeams(sbkMarket || excMarket, props.displayRunners);
    const isAccaFreezeEnabled = getThrottle(state.entities.throttles, "ACCA_FREEZE")?.isActive;
    const hasAccaFreeze = isAccaFreezeEnabled && sbkMarket?.isAccaFreezeEligible === true && !baseFixtureIsInplay;

    return {
      title: sportevent.name,
      subtitle: openDate ? formatStartTime(openDate, localeCodeBcp47, timezone) : "",
      tertiaryTitle:
        props.showTertiaryTitle && competition?.name.trim() !== sportevent.name.trim() ? competition?.name : undefined,
      inPlay: baseFixtureIsInplay ? inplayLabel : undefined,
      viewMode: props.viewMode === ScoreboardViewMode.COUPON ? EventHeaderViewMode.COUPON : EventHeaderViewMode.DEFAULT,
      date,
      time,
      dateTime: openDate,
      homeRunnerName: teams?.home?.name,
      awayRunnerName: teams?.away?.name,
      sporteventURN: props.sporteventURN,
      showBorder: props.showBottomSeparator,
      isSticky: props.isSticky,
      iconsList: getMergedIconsList(props.iconsList, !!hasAccaFreeze),
    };
  };
};

export type DispatchProps = Record<string, never>;

export const mapDispatchToProps: DispatchProps = {};
