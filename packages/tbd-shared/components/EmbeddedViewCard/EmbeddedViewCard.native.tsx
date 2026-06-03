import { FunctionComponent, useContext } from "react";
import { Platform } from "react-native";
import EmbeddedViewCard from "@ppb/tbd-components-regulatory-and-utils/components/EmbeddedViewCard/view/EmbeddedViewCard.native";
import { CetContext, SetupPin, useBiometricLoginToggle } from "@flutter-global/react-native-cet-framework";
import { codecs } from "@ppb/tbd-urn-codecs";

import { APP_ENVIRONMENT_DEFAULT_PATH, getBasePath } from "../../config/base-path-utils.native";
import { readMessagesInjetedJavascript, handleCetEventMessages } from "../../helpers/webview-event.native";
import { getCustomWebViewUserAgent } from "../../helpers/user-agent.native";

import NativeWebView from "../Navigation/screens/NativeWebView.native";

type Props = {
  urn: string;
  visible?: boolean;
};

const EmbeddedViewCardWrapper: FunctionComponent<Props> = (props) => {
  const { changeLanguage, updateTimezone, authorizationToken: authenticationToken, logOut } = useContext(CetContext);
  const { isBiometricLoginActive, setToggleBiometricLoginActive } = useBiometricLoginToggle(authenticationToken);

  // The `biometric` and `platform` parameters need to be added only on native implementation, and also need the CetContext, and
  // that's why we cannot simply set it on BFF for native apps
  const queryParams =
    codecs.parse(props.urn)?.referenceId === "personalDetails"
      ? `?biometric=${isBiometricLoginActive}&platform=${Platform.OS}`
      : "";

  const appEnv = `${getBasePath()}${APP_ENVIRONMENT_DEFAULT_PATH}`;

  return (
    <EmbeddedViewCard
      {...props}
      webViewConfig={{
        NativeWebView,
        queryParams,
        readMessagesInjetedJavascript,
        getCustomWebViewUserAgent,
      }}
      appEnv={appEnv}
      userActions={{
        changeLanguage,
        updateTimezone,
        logOut,
        setToggleBiometricLoginActive,
        handleCetEventMessages,
      }}
      SetupPin={() => <SetupPin />}
    />
  );
};

export default EmbeddedViewCardWrapper;
