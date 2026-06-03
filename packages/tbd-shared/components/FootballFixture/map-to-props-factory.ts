import type { ComponentProps } from "react";
import { MapStateToPropsFactory } from "react-redux";

import { createGetThrottleSelector, SportsbookMarket } from "@ppb/tbd-store";
import { createCompetitionSelector } from "@ppb/tbd-store/state/entities/competitions/competition-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { createSportsbookMarketByURNSelector } from "@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors";
import { createExchangeMarketSelector } from "@ppb/tbd-store/state/entities/exchange-markets/exchange-market-selectors";
import { Product } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { ScoreboardViewMode } from "@ppb/the-wall-common/types";
import { IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import type { AvBFixture, FootballScoreboard } from "@ppb/the-wall-web";
import { FixtureStatus } from "@ppb/tbd-store/state/constants";

import { createPropsForScoreboardVm } from "../../view-model-factories/scoreboard";

type AvBFixtureProps = ComponentProps<typeof AvBFixture>;
type FootballScoreboardProps = ComponentProps<typeof FootballScoreboard>;

export type ContainerProps = {
  urn: URN;
  competition?: URN;
  sporteventURN?: URN;
  availableToSubscribe?: boolean;
  showBottomSeparator?: AvBFixtureProps["showBottomSeparator"];
  showEventDateBelow?: FootballScoreboardProps["showEventDateBelow"];
  showHorizontalDuration?: FootballScoreboardProps["showHorizontalDuration"];
  viewMode?: ScoreboardViewMode;
  iconsList: FootballScoreboardProps["iconsList"];
  activeProduct?: Product;
  marketURN?: URN;
};

export type CardProps = {
  competition?: string;
  scoreboardProps: FootballScoreboardProps;
  iconsList: ContainerProps["iconsList"];
};

export type StateProps = CardProps | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getPropsForScoreboard = createPropsForScoreboardVm();
  const getCompetitionByURN = createCompetitionSelector();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();
  const getSbkMarket = createSportsbookMarketByURNSelector();
  const getExcMarket = createExchangeMarketSelector();

  return function mapStateToProps(
    state: ApplicationState,
    { urn, competition: competitionURN, activeProduct, marketURN, iconsList = [] }: ContainerProps,
  ): StateProps {
    const footballFixture = state.entities.footballfixtures[urn];
    if (!footballFixture) {
      return {};
    }
    const getThrottle = createGetThrottleSelector();

    /** Is market In Play from markets (SMP/ERO) or fallback to SCA data */
    let marketInPlay = footballFixture.fixtureStatus === FixtureStatus.IN_PLAY;
    let hasAccaFreeze = false;
    if (marketURN && activeProduct) {
      const market =
        activeProduct === Product.Sportsbook
          ? getSbkMarket(state.entities.sportsbookmarkets, marketURN)
          : getExcMarket(state.entities.exchangemarkets, marketURN);

      marketInPlay = market?.inplay ?? footballFixture.fixtureStatus === FixtureStatus.IN_PLAY;
      hasAccaFreeze =
        !!getThrottle(state.entities.throttles, "ACCA_FREEZE")?.isActive &&
        !!(activeProduct === Product.Sportsbook && (market as SportsbookMarket)?.isAccaFreezeEligible) &&
        !marketInPlay;
    }

    const userDetails = <UserDetails>getUserDetailsSelector(state);
    const competition = getCompetitionByURN(state.entities.competitions, competitionURN);
    const scoreboardProps = getPropsForScoreboard(footballFixture, userDetails, marketInPlay);

    return {
      competition: competition?.name,
      scoreboardProps,
      iconsList: hasAccaFreeze ? [...iconsList, IconsList.ACCA_FREEZE_PROMO] : iconsList,
    };
  };
};
