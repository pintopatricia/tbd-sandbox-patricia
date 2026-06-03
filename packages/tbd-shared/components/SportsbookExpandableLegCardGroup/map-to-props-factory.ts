import URN from "@ppb/tbd-store/state/layout/URN";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { MapStateToPropsFactory } from "react-redux";
import { createSelector } from "reselect";
import { createCardGroupByURNSelector } from "@ppb/tbd-store/state/layout/cardgroups/cardgroups-selectors";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { MyBetsOnAccordionToggle, UI__MY_BETS_ON_ACCORDION_TOGGLE } from "@ppb/tbd-store/actions/my-bets";
import { SportsbookExpandableLegCardGroups } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";
import { i18n } from "../../helpers/i18n";

export type ContainerProps = {
  urn: URN;
};

type Labels = {
  collapsedLabel: string;
  expandedLabel: string;
};

export type CardProps = {
  labels: Labels;
  cards: PartialItem[];
  isBetPanelOpen: boolean;
};

export type StateProps = CardProps | Record<string, never>;

const createGetStaticLabels = () =>
  createSelector([(localeCode: string) => localeCode], () => ({
    collapsedLabel: i18n({ key: "I18N.GENERIC.ACCORDION_COLLAPSED_LABEL" }),
    expandedLabel: i18n({ key: "I18N.GENERIC.ACCORDION_EXPANDED_LABEL" }),
  }));

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getSportsbookExpandableLegCardGroupByURN = createCardGroupByURNSelector<
    SportsbookExpandableLegCardGroups,
    URN
  >();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();

  const getStaticLabels = createGetStaticLabels();

  return (state: ApplicationState, { urn }: ContainerProps): StateProps => {
    const expandableLegGroup = getSportsbookExpandableLegCardGroupByURN(
      state.layouts.cardgroups.sportsbookexpandablelegcardgroups,
      urn,
    );

    if (!expandableLegGroup) {
      return {};
    }

    const userDetails = <UserDetails>getUserDetailsSelector(state);
    const labels = getStaticLabels(userDetails?.localeCode);

    return {
      labels,
      cards: expandableLegGroup.items,
      isBetPanelOpen: expandableLegGroup.isBetPanelOpen,
    };
  };
};

const dispatchToggleAccordionAction = (isExpanded: boolean): MyBetsOnAccordionToggle => ({
  type: UI__MY_BETS_ON_ACCORDION_TOGGLE,
  payload: {
    isExpanded,
  },
});

export type DispatchProps = {
  dispatchToggleAccordionAction: typeof dispatchToggleAccordionAction;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchToggleAccordionAction,
};
