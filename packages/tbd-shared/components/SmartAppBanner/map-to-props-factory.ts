import type { MapStateToPropsFactory } from "react-redux";

import { EXTERNAL_PUSH_BLANK } from "@ppb/tbd-store";
import type {
  ApplicationState,
  AppPlatformVersion,
  ExternalPushBlankAction,
  AppPlatform,
  UserDetails,
} from "@ppb/tbd-store";
import {
  type SmartAppBannerClickAction,
  type SmartAppBannerCloseAction,
  type SmartAppBannerDisplayAction,
  UI__SMART_APP_BANNER_CLICK,
  UI__SMART_APP_BANNER_CLOSE,
  UI__SMART_APP_BANNER_DISPLAY,
} from "@ppb/tbd-store/actions/notification";
import { createGetThrottleSelector } from "@ppb/tbd-store/state/entities/throttles/throttles-selectors";
import { createGetAppPlatformVersionSelector } from "@ppb/tbd-store/state/entities/app-version/app-version-selectors";
import { createGetCountryLocalCurrencyCodeSelector } from "@ppb/tbd-store/state/entities/user-details/user-details-selectors";

import { getExternalLink } from "../../helpers/external-links";
import { i18n } from "../../helpers/i18n";
import { getUserAgentOS, isIOSDevice, getOSVersion } from "../../helpers/user-agent.web";
import { isVersionSupported } from "../../helpers/version-helper";

export type ContainerProps = {};

export type StateProps = {
  title: string;
  subtitle: string;
  downloadButtonLabel: string;
  downloadUrl?: string;
};

const getDownloadUrl = ({ jurisdiction: { jurisdiction }, localeCode }: UserDetails): string | undefined => {
  if (jurisdiction === "BRAZIL" && isIOSDevice()) {
    return undefined;
  }

  return getExternalLink("SMART_APP_BANNER", jurisdiction, localeCode);
};

const shouldShowSmartBanner = (
  appPlatformVersion: AppPlatformVersion | undefined,
  isSmartBannerEnabled: boolean,
): boolean => {
  if (!appPlatformVersion?.minOSVersion || !isSmartBannerEnabled) {
    return false;
  }

  const osVersion = getOSVersion();

  if (!osVersion) {
    return false;
  }

  return isVersionSupported(osVersion, appPlatformVersion.minOSVersion);
};

export const makeMapStateToProps: MapStateToPropsFactory<StateProps, ContainerProps, ApplicationState> = () => {
  const getThrottle = createGetThrottleSelector();
  const getUserDetails = createGetCountryLocalCurrencyCodeSelector();
  const getAppPlatformVersion = createGetAppPlatformVersionSelector();

  const baseVM: StateProps = {
    title: i18n({ key: "I18N.SMART_APP_BANNER.TITLE" }),
    subtitle: i18n({ key: "I18N.SMART_APP_BANNER.SUBTITLE" }),
    downloadButtonLabel: i18n({ key: "I18N.SMART_APP_BANNER.BUTTON_LABEL" }),
  };

  return (state: ApplicationState): StateProps => {
    const appPlatformVersion = getAppPlatformVersion(state.entities.appversion, getUserAgentOS() as AppPlatform);
    const isSmartBannerEnabled = !!getThrottle(state.entities.throttles, "SMART_APP_BANNER")?.isActive;

    if (!shouldShowSmartBanner(appPlatformVersion, isSmartBannerEnabled)) {
      return baseVM;
    }

    let userDetails;

    try {
      userDetails = <UserDetails>getUserDetails(state);
    } catch (e) {
      console.error(e);

      return baseVM;
    }

    return {
      ...baseVM,
      downloadUrl: getDownloadUrl(userDetails),
    };
  };
};

const dispatchExternalPush = (url: string): ExternalPushBlankAction => ({
  type: EXTERNAL_PUSH_BLANK,
  payload: {
    viewUrn: "",
    viewUrl: url,
  },
});

const dispatchSmartAppBannerClick = (url: string): SmartAppBannerClickAction => ({
  type: UI__SMART_APP_BANNER_CLICK,
  payload: { url },
});

const dispatchSmartAppBannerClose = (): SmartAppBannerCloseAction => ({
  type: UI__SMART_APP_BANNER_CLOSE,
});

const dispatchSmartAppBannerDisplay = (): SmartAppBannerDisplayAction => ({
  type: UI__SMART_APP_BANNER_DISPLAY,
});

export type DispatchProps = {
  dispatchExternalPush: typeof dispatchExternalPush;
  dispatchSmartAppBannerClick: typeof dispatchSmartAppBannerClick;
  dispatchSmartAppBannerClose: typeof dispatchSmartAppBannerClose;
  dispatchSmartAppBannerDisplay: typeof dispatchSmartAppBannerDisplay;
};

export const mapDispatchToProps: DispatchProps = {
  dispatchExternalPush,
  dispatchSmartAppBannerClick,
  dispatchSmartAppBannerClose,
  dispatchSmartAppBannerDisplay,
};
