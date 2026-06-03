/* eslint no-console: 0 */
import * as React from "react";
import { WebView, WebViewMessageEvent } from "react-native-webview";
import RNFetchBlob from "rn-fetch-blob";
import { Platform, PermissionsAndroid } from "react-native";
import { EntityType } from "@ppb/tbd-urn-codecs";
import { navigate } from "@ppb/tbd-router/native";
import { DisplayMode } from "@ppb/tbd-store/state/layout/views/ViewLink.types";
import { PlatformType } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { isMetaDataEvent, sendEvent } from "../gtm/tagging-collector.native";
import { isJsonString } from "./json.native";

export const readMessagesInjetedJavascript = `window.addEventListener("message", (event) => {
  window.ReactNativeWebView.postMessage(JSON.stringify({
    ...event.data,
    origin: window.location.origin,
  }))
});

window.isRebuildNative = true;
`;

type CetMessageHandler = (
  eventMessage: WebViewMessageEvent,
  onLanguageChange: (language: string | boolean) => void,
  onTimezoneChange: (timezone: string | boolean) => void,
  onBiometricChange: () => void,
  onPasswordChange: () => void,
) => Promise<any>;

export const handleCetEventMessages: CetMessageHandler = async (
  eventMessage,
  onLanguageChange,
  onTimezoneChange,
  onBiometricChange,
  onPasswordChange,
) => {
  const event = JSON.parse(eventMessage.nativeEvent.data);
  switch (event.type) {
    case "LANGUAGE.UPDATED":
      await onLanguageChange(event.message);
      break;
    case "TIMEZONE.UPDATED":
      await onTimezoneChange(event.message);
      break;
    case "BIOMETRIC.UPDATED":
      await onBiometricChange();
      break;
    case "PASSWORD.UPDATED":
      await onPasswordChange();
      break;
    case "VIEW.ITALIAN.CONTRACT":
      navigate({
        viewUrn: EntityType.ExternalView,
        viewUrl: event.message,
        viewDisplayMode: DisplayMode.BlankWebview,
      });
      break;
    case "DOWNLOAD.ITALIAN.CONTRACT": {
      const { config, fs } = RNFetchBlob;
      const date = new Date();
      const { DownloadDir, DocumentDir } = fs.dirs; // You can check the available directories in the wiki.
      const dirToSave = Platform.OS === "ios" ? DocumentDir : DownloadDir;
      const options = {
        fileCache: true,
        path: `${dirToSave}/betfair_contract_${Math.floor(date.getTime() + date.getSeconds())}.pdf`,
        addAndroidDownloads: {
          useDownloadManager: true, // true will use native manager and be shown on notification bar.
          notification: true,
        },
      };

      if (Platform.OS === "android") {
        try {
          const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE);

          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            config(options)
              .fetch("GET", event.message)
              .then((res) => {
                console.log("the file has been successfully saved", res.path());
              })
              .catch((err) => {
                console.warn(err);
              });
          }
        } catch (err) {
          console.warn(err);
        }
      } else if (Platform.OS === "ios") {
        config(options)
          .fetch("GET", event.message)
          .then((res) => {
            RNFetchBlob.ios.previewDocument(res.path());
          })
          .catch((err) => {
            console.warn(err);
          });
      }

      break;
    }
    default:
      break;
  }
};

const extractMessageData = (message: any): any => {
  let messageData: any;
  if (!message?.nativeEvent?.data) {
    return null;
  }
  if (isJsonString(message?.nativeEvent?.data)) {
    messageData = JSON.parse(message?.nativeEvent?.data);
  } else {
    messageData = message?.nativeEvent?.data;
  }
  return messageData;
};

export const sendWrapperEvent = (message: any) => {
  const messageData: any = extractMessageData(message);

  if (messageData?.command === "logEvent") {
    if (!isMetaDataEvent(messageData?.parameters)) {
      const eventParams = { ...messageData?.parameters, product: PlatformType.Wrapper };
      sendEvent(eventParams);
    }
  }
};

export const forwardPYWMessages = (message: any, webViewRef: React.RefObject<WebView<{}> | null>) => {
  const messageData: any = extractMessageData(message);

  if (messageData?.source === "PYW") {
    const injectedJS = `
      (function() {
        window.postMessage(JSON.parse('${JSON.stringify(messageData)}'), '*');
      })();
    `;

    if (webViewRef?.current) {
      webViewRef.current.injectJavaScript(injectedJS);
    }
  }
};
