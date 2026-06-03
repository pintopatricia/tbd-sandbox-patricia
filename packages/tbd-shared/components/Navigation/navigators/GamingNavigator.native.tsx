import type { JSX } from "react";
import { Platform } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { EntityType } from "@ppb/tbd-urn-codecs";
import URN from "@ppb/tbd-store/state/layout/URN";
import { ScreenName } from "@ppb/tbd-router/native";
import GamingScreen from "../screens/GamingScreen.native";
import GenericScreen from "../screens/GenericScreen.native";
import GameInfoScreen from "../screens/GameInfoScreen.native";
import ErrorScreen from "../screens/ErrorScreen.native";
import WebViewScreen from "../screens/WebViewScreen.native";
import MaintenanceScreen from "../screens/MaintenanceScreen.native";
import { useHandleGamingDeeplink } from "../../../hooks/useHandleGamingDeeplink.native";

const Stack = createNativeStackNavigator();

function renderGamingNavigatorForIOS({ viewUrn, viewUrl }: { viewUrn: URN; viewUrl: string | undefined }): JSX.Element {
  const initialParams = {
    viewLink: {
      viewUrn,
      viewUrl,
    },
  };

  return (
    <>
      <Stack.Screen name={ScreenName.GamingLobbyScreen} component={GamingScreen} initialParams={initialParams} />
      <Stack.Screen name={ScreenName.GamingGamesCollectionScreen} component={GamingScreen} />
      <Stack.Screen name={ScreenName.GamingSubGamesCollectionScreen} component={GamingScreen} />
      <Stack.Screen name={ScreenName.GamingMySelectionsScreen} component={GamingScreen} />
      <Stack.Screen name={ScreenName.GamingWebViewScreen} component={GamingScreen} />
      <Stack.Screen
        name={EntityType.MaintenanceView}
        component={MaintenanceScreen}
        options={{ gestureEnabled: false, animation: "none" }}
      />
    </>
  );
}

function renderGamingNavigatorForAndroid({ viewUrn, viewUrl }: { viewUrn: URN; viewUrl: string }): JSX.Element {
  const isGamingExternalView = viewUrn.includes(EntityType.GamingExternalView);
  const initialParams = {
    viewLink: {
      viewUrn,
      viewUrl,
      hideBackButton: isGamingExternalView,
    },
  };

  const gamingViewInitialParams = { ...initialParams, shouldDisplayNotificationForSpain: true };

  return (
    <>
      {isGamingExternalView && (
        <Stack.Screen name={EntityType.GamingExternalView} component={WebViewScreen} initialParams={initialParams} />
      )}
      <Stack.Screen name={EntityType.GamingView} component={GenericScreen} initialParams={gamingViewInitialParams} />
      <Stack.Screen name={EntityType.GamingCategoryView} component={GenericScreen} />
      <Stack.Screen name={EntityType.GamingSegmentationView} component={GenericScreen} />
      <Stack.Screen name={ScreenName.GameInfoScreen} component={GameInfoScreen} />
      <Stack.Screen name={EntityType.GameView} component={GameInfoScreen} />
      <Stack.Screen
        name={EntityType.MaintenanceView}
        component={MaintenanceScreen}
        options={{ gestureEnabled: false, animation: "none" }}
      />
    </>
  );
}

function GamingNavigator({ viewUrn, viewUrl }: { viewUrn: URN; viewUrl: string }): JSX.Element {
  useHandleGamingDeeplink();
  const Navigator =
    Platform.OS === "ios"
      ? renderGamingNavigatorForIOS({ viewUrn, viewUrl })
      : renderGamingNavigatorForAndroid({ viewUrn, viewUrl });
  const screenOptions = { headerShown: false };

  return (
    <Stack.Navigator screenOptions={screenOptions}>
      {Navigator}
      <Stack.Screen name={ScreenName.ErrorScreen} component={ErrorScreen} />
      <Stack.Screen name={EntityType.SelfExcludedView} component={GenericScreen} />
    </Stack.Navigator>
  );
}

export default GamingNavigator;
