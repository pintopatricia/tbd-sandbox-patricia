import { FETCH_CATALOGUE, FetchCatalogueAction } from "@ppb/tbd-store/actions/catalogue";
import { createMyAccountInterfaceStateSelector } from "@ppb/tbd-store/state/layout/cards/my-account/my-account-selectors";
import { createFindViewByURNSelector } from "@ppb/tbd-store/state/layout/views/view-selectors";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import URN from "@ppb/tbd-store/state/layout/URN";
import { MapStateToPropsFactory } from "react-redux";
import {
  SettingsNavigationAction,
  SettingsNavigationPayload,
  UI__SETTINGS_TABS_CLICK,
} from "@ppb/tbd-store/actions/settings-page";
import { SettingsView } from "@ppb/tbd-store/state/layout/views/View.types";

export type StateProps =
  | {
      view: SettingsView | null;
      jurisdiction: string;
    }
  | Record<string, never>;

export type ContainerProps = {
  urn: URN;
  tabUrl?: string;
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getViewByURN = createFindViewByURNSelector();
  const getMyAccountInterfaceState = createMyAccountInterfaceStateSelector();

  return (state: ApplicationState, { urn }: ContainerProps): StateProps => {
    const view = (getViewByURN(state.layouts.views, urn) as any) || null;
    const { jurisdiction } = getMyAccountInterfaceState(state);
    if (!jurisdiction) {
      return {};
    }
    return { view, jurisdiction };
  };
};

const dispatchFetchCatalogueAction = (urn: string): FetchCatalogueAction => ({
  type: FETCH_CATALOGUE,
  payload: { urn },
});

const dispatchClickSettingsTab = (payload: SettingsNavigationPayload): SettingsNavigationAction => ({
  type: UI__SETTINGS_TABS_CLICK,
  payload,
});

export type DispatchProps = {
  dispatchFetchCatalogueAction: typeof dispatchFetchCatalogueAction;
  dispatchClickSettingsTab: typeof dispatchClickSettingsTab;
};

export const mapDispatchToProps: DispatchProps = { dispatchFetchCatalogueAction, dispatchClickSettingsTab };
