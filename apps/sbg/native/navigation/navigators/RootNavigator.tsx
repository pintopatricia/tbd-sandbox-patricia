import type { JSX } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { View, Platform } from "react-native";
import { LaunchArguments } from "react-native-launch-arguments";
import { createDrawerNavigator, DrawerContentScrollView } from "@react-navigation/drawer";
import { EntityType } from "@ppb/tbd-urn-codecs";
import { CetStackNavigator, CetStackNavigatorParamList } from "@flutter-global/react-native-cet-framework";
import { Throttles } from "@ppb/tbd-shared/components/Throttles/Throttles.native";
import ConnectedThrottles from "@ppb/tbd-shared/components/Throttles";
import { NativeEntityTypes, ScreenName } from "@ppb/tbd-router/native";
import { isCurrentEnv } from "@ppb/tbd-shared/config/base-path-utils.native";
import { Environment } from "@ppb/tbd-shared/config/environments.native";
import WebViewScreen from "@ppb/tbd-shared/components/Navigation/screens/WebViewScreen.native";
import MaintenanceScreen from "@ppb/tbd-shared/components/Navigation/screens/MaintenanceScreen.native";
import ErrorScreen from "@ppb/tbd-shared/components/Navigation/screens/ErrorScreen.native";
import { SelfExcludedScreen } from "@ppb/tbd-shared/components/Navigation/screens/SelfExcludedScreen.native";
import GenericScreen from "@ppb/tbd-shared/components/Navigation/screens/GenericScreen.native";
import GameLaunchScreen from "@ppb/tbd-shared/components/Navigation/screens/GameLaunchScreen.native";
import { BottomBarScreen } from "@ppb/tbd-shared/components/Navigation/screens/BottomBarScreen.native";
import SkybetTerritoryBlockingScreen from "@ppb/tbd-shared/components/Navigation/screens/TerritoryBlocking/SkybetTerritoryBlockingScreen.native";
import { SkyBetStateIndicator } from "@ppb/tbd-shared/components/SkyBetLoading/snowflakes/SkyBetStateIndicator.native";
import { i18n } from "@ppb/tbd-shared/helpers/i18n";
import { useRealityCheckAlert } from "@ppb/tbd-shared/hooks/useRealityCheckAlert.native";
import DeviceInfo from "react-native-device-info";
import { SettingsView } from "@ppb/tbd-shared/components/SettingsView/SettingsView.native";
import useCetFramework from "@ppb/tbd-shared/hooks/useCetFramework.native";
import { TBDN_RELEASE_MODE } from "../../app.config.json";
import styles from "./RootNavigator.styles";

const launchArgs = LaunchArguments.value();
const MainStack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function CetStackNavigatorWrapper(props: { navigation: CetStackNavigatorParamList }): JSX.Element {
  return (
    <View style={styles.cetStackNavigatorWrapper} testID="my-account">
      <CetStackNavigator {...props} />
    </View>
  );
}

const i18nLabels = {
  title: i18n({ key: "I18N.STATE_INIDICATOR.SPLASH_SCREEN_TITLE" }),
};

function StateIndicatorView(): JSX.Element {
  return (
    <View style={styles.skyBetbottomBarWrapper}>
      <SkyBetStateIndicator loadingTitle={i18nLabels.title} appVersion={`v${DeviceInfo.getBuildNumber()}`} />
    </View>
  );
}

/**
 * The Main Navigator includes the app navigator and screen definitions. It contains
 * the bottom bar navigator, and screens that are presented as isolated modal views
 * like WebView or the My Account CET screens.
 */
function MainNavigator(): JSX.Element {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <MainStack.Screen name={NativeEntityTypes.BottomBar}>
        {() => <BottomBarScreen StateIndicatorView={StateIndicatorView} />}
      </MainStack.Screen>
      <MainStack.Screen
        name={EntityType.MarketRulesView}
        component={GenericScreen}
        options={{
          presentation: "modal",
        }}
      />
      <MainStack.Screen
        name={EntityType.RunnerView}
        component={GenericScreen}
        initialParams={{
          isBetslipAvailable: false,
          isReceiptAvailable: false,
        }}
        options={{
          presentation: "modal",
        }}
      />
      <MainStack.Screen
        name={ScreenName.RootMaintenanceScreen}
        component={MaintenanceScreen}
        options={{
          gestureEnabled: false,
          presentation: "card",
          animation: "none",
        }}
      />
      <MainStack.Screen
        name={ScreenName.RootErrorScreen}
        component={ErrorScreen}
        options={{
          gestureEnabled: false,
          presentation: "card",
          animation: "none",
        }}
      />
      <MainStack.Screen
        name={ScreenName.TerritoryBlockingScreen}
        component={SkybetTerritoryBlockingScreen}
        options={{
          gestureEnabled: false,
          presentation: "card",
          animation: "none",
        }}
      />
      <MainStack.Screen name="CetStackNavigator" options={{ animation: "fade" }} component={CetStackNavigatorWrapper} />
      <MainStack.Screen
        name={EntityType.StatisticsView}
        component={GenericScreen}
        initialParams={{
          isBetslipAvailable: false,
          isReceiptAvailable: false,
        }}
        options={{
          presentation: "modal",
        }}
      />
      <MainStack.Screen
        name={EntityType.SettingsView}
        initialParams={{
          showRegulatoryHeader: true,
          showNemeOnboarding: false,
        }}
        component={GenericScreen}
      />
      <MainStack.Screen
        name={EntityType.ExternalView}
        component={WebViewScreen}
        options={{
          presentation: "modal",
        }}
      />
      <MainStack.Screen name={EntityType.SelfExcludedView} component={SelfExcludedScreen} />

      {Platform.OS === "android" && (
        <MainStack.Screen
          name={ScreenName.GameLaunchScreen}
          options={{
            presentation: "modal",
          }}
          component={GameLaunchScreen}
        />
      )}
    </MainStack.Navigator>
  );
}

/**
 * The Root Navigator represents the topmost navigator of the application. The
 * app when released internally exposes a Drawer menu to cater for In App
 * settings like allowing to switch between environments.
 */
function RootNavigator(): JSX.Element {
  const useSettingsDrawer =
    TBDN_RELEASE_MODE === "internal" && !isCurrentEnv(Environment.mockserver) && !launchArgs.e2e;

  useCetFramework();
  useRealityCheckAlert();

  if (!useSettingsDrawer) {
    return <MainNavigator />;
  }

  return (
    <Drawer.Navigator
      initialRouteName={NativeEntityTypes.Main}
      drawerContent={() => (
        <DrawerContentScrollView style={{ padding: 10 }}>
          <SettingsView />
          <ConnectedThrottles component={Throttles} />
        </DrawerContentScrollView>
      )}
      screenOptions={{ headerShown: false }}
      defaultStatus="closed"
    >
      <Drawer.Screen name={NativeEntityTypes.Main} component={MainNavigator} />
    </Drawer.Navigator>
  );
}

export default RootNavigator;
