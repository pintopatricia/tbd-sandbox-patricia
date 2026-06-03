import { useContext, useEffect } from "react";
import { DeviceEventEmitter } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { CetContext, cetMainConfiguration } from "@flutter-global/react-native-cet-framework";
import OTPublishersNativeSDK from "react-native-onetrust-cmp";
import { SESSION__TOKEN_CHANGED, SessionTokenChangedAction } from "@ppb/tbd-store/actions/app-context";
import appConfiguration from "../config/app-configuration.native";
import { ApplicationState } from "@ppb/tbd-store";

const useCetFramework = (): void => {
  const dispatch = useDispatch();
  const appContextFailed = useSelector((state: ApplicationState) => state.entities.appContextDetails.failed);
  const localeCode = useSelector((state: ApplicationState) => state.entities.userdetails.localeCode);

  const { authorizationToken, loadDataFromKeychain, logOut, changeLanguage, setOneTrustWebViewJavascript } =
    useContext(CetContext);

  // When app context fails, log out the user
  useEffect(() => {
    const handleAppContextFailed = async () => {
      if (appContextFailed) {
        await logOut();
      }
    };

    handleAppContextFailed();
  }, [appContextFailed, logOut]);

  // When the locale code changes, change the language in CET Framework
  useEffect(() => {
    if (localeCode) {
      changeLanguage(localeCode);
    }
  }, [localeCode, changeLanguage]);

  // When the authorization token changes after initial mount (login/logout), notify the saga to re-fetch app context
  useEffect(() => {
    dispatch<SessionTokenChangedAction>({
      type: SESSION__TOKEN_CHANGED,
      payload: {
        authenticationToken: authorizationToken ?? null,
      },
    });
  }, [authorizationToken, dispatch]);

  // When the OneTrust Javascript changes, set the OneTrust Javascript in CET Framework
  useEffect(() => {
    const oneTrustEventSubscription = DeviceEventEmitter.addListener("UpdateOneTrustJavascriptWithinCET", async () => {
      const consentJSForWebView = await OTPublishersNativeSDK.getOTConsentJSForWebView();
      const oneTrustWebViewJavascript = `window.OTExternalConsent${consentJSForWebView.substring(21)}`;
      setOneTrustWebViewJavascript(oneTrustWebViewJavascript);
    });

    return () => {
      oneTrustEventSubscription.remove();
    };
  }, []);

  // Set the brand in CET Framework
  useEffect(() => {
    cetMainConfiguration.setBrand(appConfiguration.appBrand);
    loadDataFromKeychain();
  }, [loadDataFromKeychain]);
};
export default useCetFramework;
