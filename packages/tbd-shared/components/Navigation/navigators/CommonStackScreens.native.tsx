import type { JSX } from "react";

import { EntityType } from "@ppb/tbd-urn-codecs";
import { RouteConfig } from "@react-navigation/native";
import { NativeStackNavigationOptions, type NativeStackNavigationEventMap } from "@react-navigation/native-stack";
import { ScreenName } from "@ppb/tbd-router/native";
import { Brand } from "@ppb/tbd-store/config/Brand";

import GenericScreen from "../screens/GenericScreen.native";
import NotFoundScreen from "../screens/NotFoundScreen.native";
import ErrorScreen from "../screens/ErrorScreen.native";
import MaintenanceScreen from "../screens/MaintenanceScreen.native";
import config from "../../../config/app-configuration.native";
import BetfairTerritoryBlockingScreen from "../screens/TerritoryBlocking/BetfairTerritoryBlockingScreen.native";
import SkybetTerritoryBlockingScreen from "../screens/TerritoryBlocking/SkybetTerritoryBlockingScreen.native";

/**
 * Helper to hold a definition for common screens that are reused across
 * bottom bar stacks.
 * @param { screen } Object The navigation stack screen component
 */
export function renderCommonStackScreens({
  screen: Screen,
}: {
  screen: <RouteName extends string>(
    _: RouteConfig<
      Record<string, object | undefined>,
      RouteName,
      any,
      NativeStackNavigationOptions,
      NativeStackNavigationEventMap,
      object
    >,
  ) => null;
}): JSX.Element {
  return (
    <>
      <Screen name={EntityType.NotFoundView} component={NotFoundScreen} />
      <Screen
        name={ScreenName.ErrorScreen}
        component={ErrorScreen}
        options={{ gestureEnabled: false, animation: "none" }}
      />
      <Screen
        name={EntityType.MaintenanceView}
        component={MaintenanceScreen}
        options={{ gestureEnabled: false, animation: "none" }}
      />
      <Screen
        name={ScreenName.TerritoryBlockingScreen}
        component={config.appBrand === Brand.Skybet ? SkybetTerritoryBlockingScreen : BetfairTerritoryBlockingScreen}
        options={{ gestureEnabled: false, animation: "none" }}
      />
      <Screen name={EntityType.SelfExcludedView} component={GenericScreen} />
    </>
  );
}
