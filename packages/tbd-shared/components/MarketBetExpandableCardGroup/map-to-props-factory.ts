import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { createCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { createGetMyBetsFiltersStateSelector } from "@ppb/tbd-store/state/layout/cards/my-bets/my-bets-selectors";
import { MapStateToPropsFactory } from "react-redux";
import { createSelector } from "reselect";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { FETCH_CARDS, FetchCardsAction } from "@ppb/tbd-store/actions/catalogue";
import { MyBetsOnAccordionToggle, UI__MY_BETS_ON_ACCORDION_TOGGLE } from "@ppb/tbd-store/actions/my-bets";
import { OrderTypeFilterItem } from "@ppb/tbd-store/state/layout/cards/MyBets.types";
import { MarketBetExpandableCardGroups } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";
import { i18n } from "../../helpers/i18n";

export type ContainerProps = {
  urn: URN;
};

type Labels = {
  collapsedLabel: string;
  expandedLabel: string;
};

export type CardProps = {
  urn: URN;
  items: PartialItem[];
  isOpen: boolean;
  marketBetCardGroupURN: URN;
  isSettled: boolean;
} & Labels;

export type StateProps = CardProps | Record<string, never>;

const createGetStaticLabels = () =>
  createSelector([(localeCode: string) => localeCode], () => ({
    collapsedLabel: i18n({ key: "I18N.GENERIC.ACCORDION_COLLAPSED_LABEL" }),
    expandedLabel: i18n({ key: "I18N.GENERIC.ACCORDION_EXPANDED_LABEL" }),
  }));

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getCardGroupByURN = createCardGroupByURNSelector<MarketBetExpandableCardGroups, URN>();
  const getCountryLocalCurrencyCode = createGetCountryLocalCurrencyCodeSelector();
  const getStaticLabels = createGetStaticLabels();
  const getMyBetsFiltersState = createGetMyBetsFiltersStateSelector();

  return (state: ApplicationState, { urn }: ContainerProps): StateProps => {
    const expandableCardGroup = getCardGroupByURN(state.layouts.cardgroups.marketbetexpandablecardgroups, urn);

    if (!expandableCardGroup) {
      return {};
    }

    const { orderTypeFilter } = getMyBetsFiltersState(state, state.layouts.views.mybets);
    const { localeCode } = getCountryLocalCurrencyCode(state);
    const labels = getStaticLabels(localeCode);

    return {
      items: expandableCardGroup.items,
      isOpen: expandableCardGroup.isOpen,
      urn: expandableCardGroup.urn,
      marketBetCardGroupURN: expandableCardGroup.marketBetCardGroupURN,
      collapsedLabel: labels.collapsedLabel,
      expandedLabel: labels.expandedLabel,
      isSettled: orderTypeFilter === OrderTypeFilterItem.Settled,
    };
  };
};

const dispatchFetchCardsAction = (marketBetCardGroupURN: URN): FetchCardsAction => ({
  type: FETCH_CARDS,
  payload: {
    urns: [marketBetCardGroupURN],
    forceRefresh: true,
  },
});

const dispatchToggleAccordionAction = (isExpanded: boolean): MyBetsOnAccordionToggle => ({
  type: UI__MY_BETS_ON_ACCORDION_TOGGLE,
  payload: {
    isExpanded,
  },
});

export type DispatchProps = {
  dispatchFetchCardsAction: typeof dispatchFetchCardsAction;
  dispatchToggleAccordionAction: typeof dispatchToggleAccordionAction;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchFetchCardsAction,
  dispatchToggleAccordionAction,
};
