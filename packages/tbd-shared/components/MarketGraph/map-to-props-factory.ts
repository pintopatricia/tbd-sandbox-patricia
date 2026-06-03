import { MapDispatchToProps, MapStateToPropsFactory } from "react-redux";

import { ExchangeMarket, MarketRunner } from "@ppb/tbd-store";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";

import { createExchangeMarketSelector } from "@ppb/tbd-store/state/entities/exchange-markets/exchange-market-selectors";
import { createMeetingByURNSelector } from "@ppb/tbd-store/state/entities/meetings/meeting-selectors";
import { createSportEventByURNSelector } from "@ppb/tbd-store/state/entities/sport-events/sport-event-selectors";
import { isRaceHierarchy } from "@ppb/tbd-store/helpers/markets";

import { i18n } from "../../helpers/i18n";
import { getEndpoint } from "../../config/endpoints";

export type ContainerProps = {
  market: URN;
  runner: URN;
  onMarketGraphDismiss: () => void;
};

type CardProps = {
  title: string;
  baseUrl?: string;
  eventName?: string;
  marketName?: string;
};

export type StateProps = CardProps;

const getExchangeMarketAggregationsUrl = (
  { marketId }: ExchangeMarket,
  { selectionId, handicap = 0 }: MarketRunner,
): string => {
  const egaEndpoint = getEndpoint("EGA");
  return `${egaEndpoint}${marketId}/${selectionId}/${handicap}`;
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const title = i18n({ key: "I18N.MARKET_GRAPHS" });

  const getExchangeMarketByURNSelector = createExchangeMarketSelector();
  const getMeetingByURN = createMeetingByURNSelector();
  const getSportEventByURN = createSportEventByURNSelector();

  return function mapStateToProps(
    state: ApplicationState,
    { market: marketURN, runner: runnerURN }: ContainerProps,
  ): StateProps {
    const market = getExchangeMarketByURNSelector(state.entities.exchangemarkets, marketURN);
    const runner = market?.runners.find(({ urn }) => urn === runnerURN);
    if (!market || !runner) return { title };

    const baseUrl = getExchangeMarketAggregationsUrl(market, runner);

    const { hierarchy, name: marketName } = market;

    let eventName: string;
    if (isRaceHierarchy(hierarchy)) {
      const { entityName } = getMeetingByURN(state.entities.meetings, hierarchy?.meeting);
      eventName = entityName;
    } else {
      const { name: entityName } = getSportEventByURN(state.entities.sportevents, hierarchy?.sportevent) || {};
      if (!entityName) return { title };

      eventName = entityName;
    }

    return { title, baseUrl, eventName, marketName };
  };
};

export type DispatchProps = {};

export const makeMapDispatchToProps: MapDispatchToProps<DispatchProps, ContainerProps> = () => ({});
