import { MapStateToPropsFactory } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { PUSH, PushAction } from "@ppb/tbd-store/actions/router";
import { createRaceViewLinksCardHydratedByURNSelector } from "@ppb/tbd-store/state/layout/cards/race-viewlinks/race-viewlinks-selectors";
import { RaceViewLinksLinkClick, UI__RACE_VIEW_LINKS_LINK_CLICK } from "@ppb/tbd-store/actions/navigation";
import { RaceSelectableItem } from "@ppb/the-wall-common/types";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";
import { UserDetails } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { createRaceViewLinksViewModel } from "../../view-model-factories/race-viewlinks";

export type ContainerProps = { urn: string };

export type StateProps = {
  races: RaceSelectableItem[];
  defaultRaceIndex?: number;
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getRaceViewLinksCardHydratedByURN = createRaceViewLinksCardHydratedByURNSelector();
  const getPropsForRaceSelectorVm = createRaceViewLinksViewModel();
  const getUserDetailsSelector = createGetCountryLocalCurrencyCodeSelector();

  return function mapStateToProps(state: ApplicationState, { urn }) {
    const raceSelectorCardHydrated = getRaceViewLinksCardHydratedByURN(state, urn);

    if (!raceSelectorCardHydrated) {
      return {
        urn,
        races: [],
      };
    }

    const userDetails = <UserDetails>getUserDetailsSelector(state);
    const { raceItems, defaultRaceIndex } = getPropsForRaceSelectorVm(raceSelectorCardHydrated, userDetails);

    return {
      urn,
      races: raceItems || [],
      defaultRaceIndex,
    };
  };
};

const dispatchRaceViewLinksLinkClick = (
  cardUrn: string,
  href: string,
  isRaceClosed: boolean,
): RaceViewLinksLinkClick => ({
  type: UI__RACE_VIEW_LINKS_LINK_CLICK,
  payload: { cardUrn, href, isRaceClosed },
});

const dispatchPush = (raceViewLink: ViewLink): PushAction => ({
  type: PUSH,
  payload: raceViewLink,
});

export type DispatchProps = {
  dispatchPush: typeof dispatchPush;
  dispatchRaceViewLinksLinkClick: typeof dispatchRaceViewLinksLinkClick;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchPush,
  dispatchRaceViewLinksLinkClick,
};
