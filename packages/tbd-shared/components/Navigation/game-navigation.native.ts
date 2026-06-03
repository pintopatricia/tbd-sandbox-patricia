import { WebView } from "react-native-webview";
import { Platform } from "react-native";

/** This function is used for handling the back button in game webview.
 * The boolean returned type is required by the Backhandler */
export const handleBack = (
  webviewRef: WebView<{}>,
  canGoBack: boolean,
  onGoBack: () => void,
  onCannotGoBack: () => void,
): boolean => {
  if (webviewRef) {
    if (!canGoBack) {
      onCannotGoBack();
    } else {
      onGoBack();
    }
    return true;
  }
  return false;
};

export const handleWebHardwareBack = (webviewRef: WebView, url: string, rootUrl: string) => {
  if (Platform.OS !== "android" || url === rootUrl) {
    return false;
  }
  const gamePlayDomainPrefix = "https://play.betfair";
  const sportsGamingDomainPrefix = "https://sportsgaming.betfair";

  if (url.startsWith(gamePlayDomainPrefix)) {
    webviewRef.injectJavaScript(`
                  const exitGame = () => {
                        const exitGameUrl = window.com.ppb.globalVariables.exitGameURL
                        window.location.href=exitGameUrl;
                  }
                  exitGame();
         `);
    return true;
  }
  if (rootUrl.startsWith(sportsGamingDomainPrefix)) {
    webviewRef.injectJavaScript(`
                  const goToRootUrl = () => {
                        window.location.href="${rootUrl}";
                  }
                  goToRootUrl();
         `);
    return true;
  }
  return false;
};
