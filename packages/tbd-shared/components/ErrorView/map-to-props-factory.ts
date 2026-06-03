import { MapStateToPropsFactory } from "react-redux";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { createViewByURNSelector } from "@ppb/tbd-store/state/layout/views/view-selectors";
import { APP_CONTEXT__FETCH, FetchAppContextAction } from "@ppb/tbd-store/actions/app-context";
import { ErrorViews } from "@ppb/tbd-store/state/layout/views/View.types";
import { i18n } from "../../helpers/i18n";

export type ContainerProps = { urn: string };
export type StateProps =
  | {
      i18nLabels: {
        title: string;
        fatalErrorMsg: string;
        failedRequestMsg: string;
        retryButtonLabel: string;
        helpCenterLabel: string;
      };
      errorType: string;
      helpCenterUrl?: string;
      bffEndpoint?: string;
      latestBffEndpoint?: string;
      appEnv: string;
      hasErrorViewImage: boolean;
    }
  | Record<string, never>;

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getErrorViewByURN = createViewByURNSelector<ErrorViews, URN>();
  const i18nLabels = {
    title: i18n({ key: "I18N.ERROR_HANDLING.TITLE" }),
    fatalErrorMsg: i18n({ key: "I18N.ERROR_HANDLING.FATAL_ERROR_MESSAGE" }),
    failedRequestMsg: i18n({ key: "I18N.ERROR_HANDLING.FAILED_REQUEST_MESSAGE" }),
    retryButtonLabel: i18n({ key: "I18N.ACTION.RETRY" }),
    helpCenterLabel: i18n({ key: "I18N.NAVIGATE.HELP_CENTER" }),
  };

  return (state: ApplicationState, ownProps: ContainerProps): StateProps => {
    const view = getErrorViewByURN(state.layouts.views.error, ownProps.urn);
    const hasErrorViewImage = !!state.entities.brandSettings?.ERROR_VIEW_IMAGE;

    if (!view) {
      return {};
    }

    const { errorType, helpCenterUrl, bffEndpoint, latestBffEndpoint, appEnv } = view;

    return {
      i18nLabels,
      errorType,
      helpCenterUrl,
      bffEndpoint,
      latestBffEndpoint,
      appEnv,
      hasErrorViewImage,
    };
  };
};

export type DispatchProps = {
  dispatchFetchAppContext: (bffEndpoint: string, latestBffEndpoint: string, appEnv: string) => FetchAppContextAction;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchFetchAppContext: (bffEndpoint, latestBffEndpoint, appEnv) => ({
    type: APP_CONTEXT__FETCH,
    payload: {
      defaultBffEndpoint: bffEndpoint,
      latestBffEndpoint,
      defaultAppEnv: appEnv,
    },
  }),
};
