import { MapStateToPropsFactory } from "react-redux";

import { PUSH, PushAction } from "@ppb/tbd-store/actions/router";
import { createCompetitionSelector } from "@ppb/tbd-store/state/entities/competitions/competition-selectors";
import { createCardByURNSelector } from "@ppb/tbd-store/state/layout/cards/cards-selectors";
import { createHasEventMarketCardByCompetitionURNSelector } from "@ppb/tbd-store/state/layout/cards/event-market/event-market-cards-selectors";
import { createShallowEqualSelector } from "@ppb/tbd-store/helpers/selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { CouponHeaderCards } from "@ppb/tbd-store/state/layout/cards/Card.types";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { Product } from "@ppb/tbd-store/state/entities/user-preferences/UserPreferences.types";
import { i18n } from "../../helpers/i18n";
import { TranslationKey } from "../../translations/keys";

export type ContainerProps = {
  urn: URN;
  product: Product;
};

export type CardProps = {
  title: string;
  titleLink?: ViewLink;
  columns: string[];
  showComponent: boolean;
  hasStats: boolean;
};

export type StateProps = CardProps | Record<string, never>;

const createResolvedColumnsSelector = () =>
  createShallowEqualSelector(
    [(columns: string[]) => columns, (_columns: string[], hasStats: boolean) => hasStats],
    (columns, hasStats) =>
      hasStats ? [...columns, i18n({ key: "I18N.COUPON.STATS" as keyof TranslationKey })] : columns,
  );

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getCouponHeaderCard = createCardByURNSelector<CouponHeaderCards, URN>();
  const getCompetitionByURN = createCompetitionSelector();
  const hasEventMarketCardByCompetitionURN = createHasEventMarketCardByCompetitionURNSelector();
  const getResolvedColumns = createResolvedColumnsSelector();

  return function mapStateToProps(state: ApplicationState, { urn, product }: ContainerProps): StateProps {
    const couponHeaderCard = getCouponHeaderCard(state.layouts.cards.couponheaders, urn);

    if (!couponHeaderCard) {
      return {};
    }

    const { competition, competitionViewLink: titleLink, columns, hasStats } = couponHeaderCard;

    const showComponent = hasEventMarketCardByCompetitionURN(state.layouts.cards.eventmarkets, competition, product);

    const title = getCompetitionByURN(state.entities.competitions, competition)?.name || "";

    return {
      title,
      titleLink,
      columns: getResolvedColumns(columns, hasStats),
      showComponent,
      hasStats,
    };
  };
};

const dispatchRouterPushAction = (viewLink: ViewLink): PushAction => ({
  type: PUSH,
  payload: viewLink,
});

export type DispatchProps = {
  dispatchRouterPushAction: typeof dispatchRouterPushAction;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchRouterPushAction,
};
