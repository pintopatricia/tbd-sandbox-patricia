import { Platform } from "react-native";
import DeviceInfo from "react-native-device-info";
import { UserDetailsState } from "@ppb/tbd-store/state/entities/user-details/UserDetailsState";
import { AppVersion } from "@ppb/tbd-store/state/entities/app-version/AppVersion.types";
import { AppUpdateStatus, isPlatformSupported, isStoreUpdate } from "./update-helper.native";

import { UpdateBuilder } from "./update-builder.native";

class SuggestAndForceUpdate {
  isAndroid;

  appUpdateStatus;

  constructor() {
    this.isAndroid = Platform.OS === "android";
    this.appUpdateStatus = AppUpdateStatus.Hidden;
  }

  public checkAppUpdate(appVersion: AppVersion, userDetails?: UserDetailsState): void {
    const supportedVersion = this.isAndroid ? appVersion?.android : appVersion?.ios;
    const currentVersion = Number(DeviceInfo.getBuildNumber());

    if (!supportedVersion?.versionCode) {
      return;
    }

    if (supportedVersion.blackList?.some((blackVersion) => blackVersion.versioncode === currentVersion)) {
      this.appUpdateStatus = AppUpdateStatus.Force;
      this.setupUpdateBuilder(
        userDetails,
        supportedVersion.storeUrl,
        appVersion?.android.downloadUrl,
        supportedVersion.url,
      );

      return;
    }

    if (!isPlatformSupported(supportedVersion.minOSVersion)) {
      this.appUpdateStatus = AppUpdateStatus.Unsupported;
      this.setupUpdateBuilder(userDetails);

      return;
    }

    if (currentVersion < supportedVersion.versionCode) {
      const minVersion = supportedVersion.minVersionCode || 0;

      if (currentVersion < minVersion) {
        this.appUpdateStatus = AppUpdateStatus.Force;
      } else {
        this.appUpdateStatus = AppUpdateStatus.Suggest;
      }
      this.setupUpdateBuilder(
        userDetails,
        supportedVersion.storeUrl,
        appVersion?.android.downloadUrl,
        supportedVersion.url,
      );
    }
  }

  public displaySuggestOrForceUpdate(): void {
    switch (this.appUpdateStatus) {
      case AppUpdateStatus.Force:
        UpdateBuilder.displayForceUpdate();
        break;
      case AppUpdateStatus.Suggest:
        UpdateBuilder.displaySuggestUpdate();
        break;
      case AppUpdateStatus.Unsupported:
        UpdateBuilder.displayPlatformNotSupported();
        break;
      default:
        break;
    }
  }

  private setupUpdateBuilder(userDetails?: UserDetailsState, storeUrl = "", downloadUrl = "", url = ""): void {
    if (url) {
      UpdateBuilder.setup(this.isAndroid, this.appUpdateStatus, url);

      return;
    }

    const updateInStore = isStoreUpdate(this.isAndroid, userDetails);
    const linkUrl = updateInStore ? storeUrl : downloadUrl;

    UpdateBuilder.setup(this.isAndroid, this.appUpdateStatus, linkUrl);
  }
}

export const AppUpdate = new SuggestAndForceUpdate();
