import { MapStateToPropsFactory } from "react-redux";

import { ApplicationState } from "@ppb/tbd-store";
import { createSportsbookMarketByURNSelector } from "@ppb/tbd-store/state/entities/sportsbook-markets/sportsbook-market-selectors";
import { IconsList } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

import { ComponentProps as MarketBlurbProps } from "../../MarketBlurb/props";

export type CardProps = {
  hasSpacing?: boolean;
} & Pick<MarketBlurbProps, "titleKey" | "descriptionKey" | "signposting" | "externalLinkType">;

export type StateProps = CardProps | Record<string, never>;

export type ContainerProps = {
  marketURN?: string;
  hasSpacing?: boolean;
  onMarketPromoClick?: ({ title, isOpen, variant }: { title: string; isOpen: boolean; variant: string }) => void;
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getSportsbookMarketByURNSelector = createSportsbookMarketByURNSelector();

  return (state: ApplicationState, { marketURN, hasSpacing }: ContainerProps): StateProps => {
    if (marketURN) {
      const market = getSportsbookMarketByURNSelector(state.entities.sportsbookmarkets, marketURN);

      if (!market || market.marketType !== "MATCH_ODDS_90") {
        return {};
      }
    }

    return {
      titleKey: "I18N.NINETY_MINUTE.PROMO_INDICATOR",
      descriptionKey: "I18N.MARKET_PROMO.DESCRIPTION",
      signposting: IconsList.NINETY_MINUTE_PAYOUT,
      externalLinkType: "NINETY_MINUTE_RULE",
      hasSpacing,
    };
  };
};

export type DispatchProps = {};

export const mapDispatchToProps: DispatchProps = {};
