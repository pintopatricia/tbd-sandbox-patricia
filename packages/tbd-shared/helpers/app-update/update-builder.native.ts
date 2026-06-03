import { Alert, AlertButton, AppState, BackHandler, Linking, NativeModules } from "react-native";
import { TaggingAction } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { buildInterfaceEvent } from "tagging-library";
import { sendEvent } from "../../gtm/tagging-collector.native";
import { i18n } from "../i18n";
import { hideSplash } from "../splash";
import { AppUpdateStatus } from "./update-helper.native";

const { IOSExitApp } = NativeModules;
let isForceUpdateVisible = true;

class SuggestAndForceUpdateBuilder {
  isAndroid;

  isSuggestUpdateFlow;

  linkUrl;

  appStatus;

  constructor() {
    this.isAndroid = false;
    this.linkUrl = "";
    this.isSuggestUpdateFlow = false;
    this.appStatus = AppUpdateStatus.Hidden;
  }

  public setup(isAndroid: boolean, appStatus: AppUpdateStatus, linkUrl: string): void {
    this.isAndroid = isAndroid;
    this.linkUrl = linkUrl;
    this.isSuggestUpdateFlow = appStatus === AppUpdateStatus.Suggest;
    this.appStatus = appStatus;

    if (appStatus === AppUpdateStatus.Force) {
      AppState.addEventListener("change", (appState) => {
        if (!isForceUpdateVisible && appState === "active") {
          this.displayForceUpdate();
        }
      });
    }

    isForceUpdateVisible = false;
  }

  public displayForceUpdate = (): void => {
    hideSplash();

    sendEvent(
      buildInterfaceEvent({
        action: TaggingAction.DISPLAYED,
        elementText: "update your app",
        module: "update prompt",
      }),
    );

    Alert.alert(i18n({ key: "I18N.FORCEUPDATE.TITLE" }), i18n({ key: "I18N.FORCEUPDATE.BODY" }), [
      this.buildForceUpdateButton(),
    ]);
    isForceUpdateVisible = true;
  };

  public displaySuggestUpdate = (): void => {
    Alert.alert(
      i18n({ key: "I18N.SUGGESTUPDATE.TITLE" }),
      i18n({ key: "I18N.SUGGESTUPDATE.BODY" }),
      this.isAndroid
        ? [this.buildCancelButton(), this.buildUpdateButton()]
        : [this.buildUpdateButton(), this.buildCancelButton()],
    );
  };

  public displayPlatformNotSupported = (): void => {
    hideSplash();

    Alert.alert(i18n({ key: "I18N.UPDATEOS.TITLE" }), i18n({ key: "I18N.UPDATEOS.BODY" }), [this.buildDismissButton()]);
  };

  private buildUpdateButton = (): AlertButton => ({
    text: i18n({ key: "I18N.SUGGESTUPDATE.BUTTON_UPDATE" }),
    onPress: () => {
      isForceUpdateVisible = false;
      Linking.canOpenURL(this.linkUrl).then(async (supported) => {
        if (supported) {
          await Linking.openURL(this.linkUrl);
        }
      });
    },
  });

  private buildForceUpdateButton = (): AlertButton => ({
    text: i18n({ key: "I18N.SUGGESTUPDATE.BUTTON_UPDATE" }),
    onPress: () => {
      sendEvent(
        buildInterfaceEvent({
          action: TaggingAction.CLICKED,
          elementText: "update",
          module: "update prompt",
        }),
      );

      isForceUpdateVisible = false;
      Linking.canOpenURL(this.linkUrl).then(async (supported) => {
        if (supported) {
          await Linking.openURL(this.linkUrl);
        }
      });
    },
  });

  private buildDismissButton = (): AlertButton => ({
    text: i18n({ key: "I18N.UPDATEOS.BUTTON" }),
    onPress: () => {
      if (this.appStatus === AppUpdateStatus.Unsupported) {
        if (this.isAndroid) {
          BackHandler.exitApp();
        } else {
          IOSExitApp.exitApp();
        }
      } else if (this.isSuggestUpdateFlow) {
        this.displaySuggestUpdate();
      } else {
        this.displayForceUpdate();
      }
    },
  });

  private buildCancelButton = (): AlertButton => ({
    text: i18n({ key: "I18N.SUGGESTUPDATE.BUTTON_NOT_NOW" }),
  });
}

export const UpdateBuilder = new SuggestAndForceUpdateBuilder();
