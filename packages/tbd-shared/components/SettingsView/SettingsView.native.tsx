import { FunctionComponent, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as React from "react";
import { Alert, Button, Keyboard, Platform, Switch, View } from "react-native";
import RadioForm from "react-native-simple-radio-button";
import { tokens } from "@ppb/the-wall-common/base-theme";
import { getTestProps, setA11yTestsMode, isA11yTestsMode } from "@ppb/the-wall-native/helpers/test-props";
import { Jurisdiction } from "@ppb/tbd-store/config/Jurisdiction";
import { navigateWithThirdPartyScreenName, ScreenName } from "@ppb/tbd-router";
import { CetContext, useLogin } from "@flutter-global/react-native-cet-framework";
import { EntityType } from "@ppb/tbd-urn-codecs";
import { DrawerStatusContext } from "@react-navigation/drawer";
import { Text, TextInput } from "@ppb/the-wall-native";
import Storage, { GeneratedHeaders, SETTINGS_BUNDLE_KEYS } from "../../helpers/storage.native";
import { Environment, environments, jurisdictions } from "../../config/environments.native";
import { setGeneratedHeaders } from "../../config/headers.native";
import appConfiguration from "../../config/app-configuration.native";
import { getEnvironmentCookieHandler } from "../../config/env-cookies/handler.native";
import { getLaunchUrl } from "../../view-model-factories/game";
import { EnvironmentBanner } from "../EnvironmentBanner/EnvironmentBanner.native";
import styles from "./SettingsView.native.styles";

function isValidURL(str: string): boolean {
  try {
    new URL(str);

    return true;
  } catch {
    return false;
  }
}

const environmentDisplayLabels: Partial<Record<Environment, string>> = {
  [Environment.drk]: "gaming-drk",
};

type ItemProps = {
  item: { id: string; isActive: boolean };
  onChange: (id: string, value: boolean) => void;
};

const Item: FunctionComponent<ItemProps> = ({ item, onChange }) => {
  const { id, isActive } = item;
  const [isThrottleActive, setThrottleActive] = useState(isActive);
  const onChangeGuard = useCallback(
    (newValue: boolean) => {
      setThrottleActive(newValue);
      onChange(id, newValue);
    },
    [id, onChange],
  );

  return (
    <View style={styles.item}>
      <Text style={styles.identifier}>{id}</Text>
      <Switch
        trackColor={{ false: tokens.NeutralsBorderElevation4, true: tokens.ActionPrimaryBackgroundDefault }}
        thumbColor={tokens.NeutralsIconDefault}
        value={isThrottleActive}
        onValueChange={onChangeGuard}
        {...getTestProps("throttles-switch", false)}
      ></Switch>
    </View>
  );
};

const DebugView: FunctionComponent = () => (
  <View testID="debug-view">
    <Text style={styles.titleStyle}>Debug</Text>
    <Item
      item={{ id: "Highlight Updates", isActive: false }}
      onChange={(_id, isActive: boolean) => {
        if (isActive) {
          // eslint-disable-next-line @typescript-eslint/no-require-imports
          require("../../helpers/debug/chameleon");
        } else {
          Alert.alert("Reload Metro Bundler to reset Chameleon");
        }
      }}
    />
  </View>
);

const GameLaunchDebugView: FunctionComponent = () => {
  const { isAuthenticated } = useContext(CetContext);
  const [gameId, setGameId] = useState<string>("");
  const [launchProduct, setLaunchProduct] = useState<string>("");
  const [providerUid, setProviderUid] = useState<string>("");
  const viewLink = useMemo(
    () => ({
      viewUrn: "",
      viewUrl:
        gameId && providerUid && launchProduct
          ? getLaunchUrl(
              gameId,
              providerUid,
              launchProduct,
              true,
              Platform.OS === "android"
                ? "https://casino.betfair.com/"
                : "https://launcher.betfair.es/?goToOrigin=true",
            )
          : "",
    }),
    [gameId, launchProduct, providerUid],
  );
  const login = useLogin();

  const onGameLaunchPress = useCallback((): void => {
    if (!isAuthenticated) {
      login();
      return;
    }
    if (!viewLink.viewUrl) {
      return;
    }

    Keyboard.dismiss();
    navigateWithThirdPartyScreenName(ScreenName.GameLaunchScreen, {
      viewLink,
      params: {
        urn: `${EntityType.GameCard}:uid/${gameId}`,
      },
    });
  }, [gameId, isAuthenticated, login, viewLink]);

  return (
    <View testID="game-launch-debug-view" style={styles.gameDebugContainer}>
      <View style={styles.inlineContainer}>
        <Text style={styles.titleStyle}>Game Launch</Text>
        <Button
          testID="game-launch-button"
          color={tokens.ActionPrimaryTextDefault}
          title={"Launch"}
          onPress={onGameLaunchPress}
        />
      </View>
      <TextInput
        style={styles.input}
        placeholderTextColor={tokens.NeutralsTextSecondary}
        autoComplete="off"
        autoCapitalize="none"
        autoCorrect={false}
        placeholder='Game ID (e.g. "sweet-bonanza-cpr")'
        onChangeText={(text) => {
          setGameId(text.toLowerCase());
        }}
      />
      <TextInput
        style={styles.input}
        placeholderTextColor={tokens.NeutralsTextSecondary}
        autoComplete="off"
        autoCapitalize="none"
        autoCorrect={false}
        placeholder='Game product (e.g. "gaming")'
        onChangeText={(text) => {
          setLaunchProduct(text.toLowerCase());
        }}
      />
      <TextInput
        style={styles.input}
        placeholderTextColor={tokens.NeutralsTextSecondary}
        autoComplete="off"
        autoCapitalize="none"
        autoCorrect={false}
        placeholder='Provider code (e.g. "gp-pr")'
        onChangeText={(text) => {
          setProviderUid(text.toLowerCase());
        }}
      />
    </View>
  );
};

export const SettingsView: FunctionComponent<{ hasGameLaunchDebugView?: boolean }> = ({ hasGameLaunchDebugView }) => {
  const [generatedHeaders, setLocalGeneratedHeaders] = useState<GeneratedHeaders>({});
  const [customEnv, setCustomEnv] = useState<string>("");
  const [customHeaders, setCustomHeaders] = useState<string>("");
  const [customCookies, setCustomCookies] = useState<string>("");
  const [envIndex, setEnvIndex] = useState(0);
  const [jurisdictionIndex, setJurisdictionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [envProps, setEnvProps] = useState<{ label: string; value: string }[]>([]);
  const [jurisdictionProps, setJurisdictionProps] = useState<{ label: Jurisdiction; value: Jurisdiction }[]>([]);
  const [enableA11yLabelsToggle, setEnableA11yLabelsToggle] = useState<boolean>(!isA11yTestsMode());

  const showA11yLabelsToggle = Platform.OS === "android";

  const drawerStatus = React.useContext(DrawerStatusContext);

  const onCookieClearPress = useCallback(() => {
    const handler = getEnvironmentCookieHandler(envProps[envIndex].value);

    handler.clear().then((success) => {
      if (success) {
        setCustomCookies("");
        Storage.removeItem(SETTINGS_BUNDLE_KEYS.CUSTOM_APP_COOKIES);
        Alert.alert("Success", `Clear successful for all app cookies. \n\nRestart the app`);
      } else {
        Alert.alert("Fail", "Something went wrong clearing, check the logs for errors");
      }
    });
  }, [envIndex, envProps]);

  useEffect(() => {
    Storage.multiGet([
      SETTINGS_BUNDLE_KEYS.GENERATED_APP_HEADERS,
      SETTINGS_BUNDLE_KEYS.CUSTOM_APP_ENVIRONMENT,
      SETTINGS_BUNDLE_KEYS.CUSTOM_APP_HEADERS,
      SETTINGS_BUNDLE_KEYS.CUSTOM_APP_COOKIES,
      SETTINGS_BUNDLE_KEYS.APP_ENVIRONMENT,
      SETTINGS_BUNDLE_KEYS.APP_JURISDICTION,
      SETTINGS_BUNDLE_KEYS.DISABLE_A11Y_LABELS,
    ]).then(
      ({
        [SETTINGS_BUNDLE_KEYS.GENERATED_APP_HEADERS]: generatedAppHeaders,
        [SETTINGS_BUNDLE_KEYS.CUSTOM_APP_ENVIRONMENT]: customAppEnvironment,
        [SETTINGS_BUNDLE_KEYS.CUSTOM_APP_HEADERS]: customAppHeaders,
        [SETTINGS_BUNDLE_KEYS.CUSTOM_APP_COOKIES]: customAppCookies,
        [SETTINGS_BUNDLE_KEYS.APP_ENVIRONMENT]: appEnvironmentOption,
        [SETTINGS_BUNDLE_KEYS.APP_JURISDICTION]: appJurisdictionOption,
        [SETTINGS_BUNDLE_KEYS.DISABLE_A11Y_LABELS]: disableA11yLabels,
      }) => {
        const envPropsFinal = environments.map((key) => ({
          label: environmentDisplayLabels[key] ?? key,
          value: key,
        }));
        const jurisdictionPropsFinal = jurisdictions.map((jurisdiction) => ({
          label: jurisdiction,
          value: jurisdiction,
        }));
        const indexEnv = envPropsFinal.findIndex((prop) => prop.value === appEnvironmentOption);
        const indexJurisdiction = jurisdictionPropsFinal.findIndex((prop) => prop.value === appJurisdictionOption);
        const defaultCustomEnv = appConfiguration.appConfig?.TBDN_INITIAL_CUSTOM_ENVIRONMENT ?? "";
        const defaultCustomCookies = appConfiguration.appConfig?.TBDN_INITIAL_COOKIES ?? "";

        setEnvIndex(indexEnv);
        setJurisdictionIndex(indexJurisdiction);
        setLoading(false);
        setLocalGeneratedHeaders(generatedAppHeaders || {});
        setCustomEnv(customAppEnvironment || defaultCustomEnv);
        setCustomHeaders(customAppHeaders || "");
        setCustomCookies(customAppCookies || defaultCustomCookies);
        setEnvProps(envPropsFinal);
        setJurisdictionProps(jurisdictionPropsFinal);

        if (showA11yLabelsToggle) {
          // globally set setting loaded from storage
          setA11yTestsMode(disableA11yLabels ?? isA11yTestsMode());
          setEnableA11yLabelsToggle(!(disableA11yLabels ?? isA11yTestsMode()));
        }
      },
    );
  }, [envIndex, jurisdictionIndex]);

  return (
    <View testID="settings-view">
      <DebugView />
      <View style={styles.environmentsContainer}>
        <Text style={styles.titleStyle}>Environments</Text>
        <EnvironmentBanner />
      </View>
      {!loading && (
        <RadioForm
          style={styles.radioForm}
          labelStyle={styles.label}
          radio_props={envProps}
          initial={envIndex}
          buttonColor={tokens.ActionPrimaryIconDisabled}
          selectedButtonColor={tokens.ActionPrimaryIconActive}
          buttonSize={10}
          buttonWidth={0.5}
          onPress={(environment: string, index: number) => {
            Storage.setItem(SETTINGS_BUNDLE_KEYS.APP_ENVIRONMENT, environment);
            setEnvIndex(index);
            setGeneratedHeaders(environment as Environment, jurisdictionProps[jurisdictionIndex].value);
          }}
        />
      )}
      <Text style={styles.titleStyle}>Jurisdictions</Text>
      {!loading && (
        <RadioForm
          style={styles.radioForm}
          labelStyle={styles.label}
          radio_props={jurisdictionProps}
          initial={jurisdictionIndex}
          buttonColor={tokens.ActionPrimaryIconDisabled}
          selectedButtonColor={tokens.ActionPrimaryIconActive}
          buttonSize={10}
          buttonWidth={0.5}
          onPress={(jurisdiction: Jurisdiction, index: number) => {
            Storage.setItem(SETTINGS_BUNDLE_KEYS.APP_JURISDICTION, jurisdiction);
            setJurisdictionIndex(index);
            setGeneratedHeaders(envProps[envIndex].value as Environment, jurisdiction);
          }}
        />
      )}
      <Text style={styles.titleStyle}>Custom Environment</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor={tokens.NeutralsTextSecondary}
        defaultValue={customEnv}
        autoComplete="off"
        autoCapitalize="none"
        autoCorrect={false}
        placeholder="Insert custom environment here"
        onEndEditing={(event) => {
          const { text } = event.nativeEvent;

          if (!text) {
            Storage.removeItem(SETTINGS_BUNDLE_KEYS.CUSTOM_APP_ENVIRONMENT);
          } else if (isValidURL(text)) {
            Storage.setItem(SETTINGS_BUNDLE_KEYS.CUSTOM_APP_ENVIRONMENT, text);
          } else {
            Alert.alert("URL not valid!");
          }
        }}
      />
      <Text style={styles.titleStyle}>Generated Headers</Text>
      {!!generatedHeaders && (
        <Text style={styles.label}>
          {Object.entries(generatedHeaders)
            .map(([key, value]) => `${key}: ${value}`)
            .join("\n")}
        </Text>
      )}
      <Text style={styles.titleStyle}>Headers</Text>
      <TextInput
        style={{ ...styles.input, ...(!customHeaders && { fontStyle: "italic", fontSize: 13 }) }}
        placeholderTextColor={tokens.NeutralsTextSecondary}
        defaultValue={customHeaders}
        placeholder="e.g. X-IP:0.0.0.0,X-COUNTRY-CODE:DK"
        autoComplete="off"
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={(text) => {
          Storage.setItem(SETTINGS_BUNDLE_KEYS.CUSTOM_APP_HEADERS, text);
        }}
      />
      <Text style={styles.title}>
        Be aware. If you have a custom header it will override that property in the generated header. Check log to see
        final header
      </Text>
      <View style={styles.inlineContainer}>
        <Text style={styles.titleStyle}>Cookies</Text>
        <Button
          color={tokens.ActionPrimaryTextDefault}
          title={"Clear"}
          onPress={onCookieClearPress}
          {...getTestProps("throttles-reload", false)}
        />
      </View>
      <TextInput
        style={{ ...styles.input, ...(!customCookies && { fontStyle: "italic", fontSize: 13 }) }}
        placeholderTextColor={tokens.NeutralsTextSecondary}
        value={customCookies}
        placeholder="e.g. drk=hash;vid=hash"
        autoComplete="off"
        autoCapitalize="none"
        autoCorrect={false}
        onChangeText={(text) => {
          setCustomCookies(text);
          Storage.setItem(SETTINGS_BUNDLE_KEYS.CUSTOM_APP_COOKIES, text);
        }}
      />
      {showA11yLabelsToggle && (
        <View>
          <Text style={styles.titleStyle}>Accessibility</Text>
          <View style={styles.item}>
            <Text style={styles.identifier}>{"Accessibility labels"}</Text>
            <Switch
              trackColor={{ false: tokens.ActionQuaternaryBackgroundOff, true: tokens.ActionQuaternaryBackgroundOn }}
              thumbColor={tokens.ActionQuaternaryIconDefault}
              value={enableA11yLabelsToggle}
              onValueChange={(value: boolean) => {
                Storage.setItem(SETTINGS_BUNDLE_KEYS.DISABLE_A11Y_LABELS, !value);
                setEnableA11yLabelsToggle(value);
                setA11yTestsMode(!value);
              }}
            />
          </View>
        </View>
      )}
      {hasGameLaunchDebugView && drawerStatus && <GameLaunchDebugView />}
    </View>
  );
};

export default SettingsView;
