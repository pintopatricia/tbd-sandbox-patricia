import { APP_CONTEXT__FETCH, FetchAppContextAction } from "@ppb/tbd-store/actions/app-context";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { NetworkStatus } from "@ppb/tbd-store/state/network-status/NetworkStatusState.types";
import { getNetworkStatus } from "@ppb/tbd-store/state/network-status/network-status-selectors";
import { MapStateToPropsFactory } from "react-redux";
import { i18n } from "../../helpers/i18n";

export type ContainerProps = {
  bffEndpoint: string;
  latestBffEndpoint: string;
  appEnv: string;
};
export type StateProps = {
  networkStatus: NetworkStatus;
  currentUrn: string | null;
  i18nLabels: {
    title: string;
    text: string;
    settings: string;
    retry: string;
  };
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const i18nLabels = {
    title: i18n({ key: "I18N.OFFLINE_MODE.TITLE" }),
    text: i18n({ key: "I18N.OFFLINE_MODE.TEXT" }),
    settings: i18n({ key: "I18N.ACTION.SETTINGS" }),
    retry: i18n({ key: "I18N.ACTION.RETRY" }),
  };

  return (state: ApplicationState): StateProps => ({
    networkStatus: getNetworkStatus(state),
    i18nLabels,
    currentUrn: state.router.currentUrn,
  });
};

export type DispatchProps = {
  dispatchFetchAppContext: (bffEndpoint: string, latestBffEndpoint: string, appEnv: string) => FetchAppContextAction;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchFetchAppContext: (bffEndpoint, latestBffEndpoint, appEnv) => ({
    type: APP_CONTEXT__FETCH,
    payload: {
      defaultBffEndpoint: bffEndpoint,
      defaultAppEnv: appEnv,
      latestBffEndpoint,
    },
  }),
};
