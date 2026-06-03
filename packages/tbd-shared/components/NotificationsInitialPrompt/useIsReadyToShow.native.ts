import { useState, useEffect } from "react";
import { Platform } from "react-native";
import OTPublishersNativeSDK, { OTEventName } from "react-native-onetrust-cmp";

function useOneTrustBannerVisible() {
  const [isBannerVisible, setIsBannerVisible] = useState(false);

  useEffect(() => {
    const showListener = OTPublishersNativeSDK.addEventListener(OTEventName.showBanner, () => setIsBannerVisible(true));

    const hideListener = OTPublishersNativeSDK.addEventListener(OTEventName.hideBanner, () =>
      setIsBannerVisible(false),
    );

    return () => {
      showListener.remove();
      hideListener.remove();
    };
  }, []);

  return isBannerVisible;
}

function useOneTrustConsentDefined() {
  const [isConsentDefined, setIsConsentDefined] = useState(false);

  useEffect(() => {
    OTPublishersNativeSDK.shouldShowBanner().then((shouldShow) => {
      setIsConsentDefined(!shouldShow);
    });

    const listener = OTPublishersNativeSDK.addEventListener(OTEventName.allSDKViewsDismissed, () => {
      setIsConsentDefined(true);
    });

    return () => {
      listener.remove();
    };
  }, []);

  return isConsentDefined;
}

// This custom hook was created as a temporary quickfix to unblock a release: [https://jira.services.flutteruki.com/browse/OCISLY-695]
// while we investigate an issue where the notification prompt modal breaks the whole iOS app when it is shown before the OneTrust consent is given.
// The root cause of that issue is still unknown
export function useIsReadyToShow(): boolean {
  const OS = Platform.OS;
  const isOneTrustBannerVisible = useOneTrustBannerVisible();
  const isOneTrustConsentDefined = useOneTrustConsentDefined();

  return OS === "ios" ? !isOneTrustBannerVisible && isOneTrustConsentDefined : true;
}
