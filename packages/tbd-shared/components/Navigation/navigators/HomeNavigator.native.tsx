import type { JSX } from "react";
import { createCappedNativeStackNavigator } from "./CappedNativeStackNavigator.native";
import URN from "@ppb/tbd-store/state/layout/URN";
import { NativeEntityTypes, ScreenName } from "@ppb/tbd-router/native";
import { EntityType } from "@ppb/tbd-urn-codecs";
import GenericScreen from "../screens/GenericScreen.native";
import GameInfoScreen from "../screens/GameInfoScreen.native";
import { renderCommonStackScreens } from "./CommonStackScreens.native";

const Stack = createCappedNativeStackNavigator();

function HomeNavigator({ viewUrn }: { viewUrn: URN }): JSX.Element {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        freezeOnBlur: true,
      }}
      maxSameType={3}
    >
      <Stack.Screen
        name={NativeEntityTypes.Home}
        initialParams={{
          viewLink: {
            viewUrn,
          },
        }}
        component={GenericScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen name={EntityType.GenericView} component={GenericScreen} />
      <Stack.Screen name={EntityType.AllCompetitionsView} component={GenericScreen} />
      <Stack.Screen name={EntityType.AllMatchesRacesView} component={GenericScreen} />
      <Stack.Screen name={EntityType.AllMarketsView} component={GenericScreen} />
      <Stack.Screen name={EntityType.SportView} component={GenericScreen} />
      <Stack.Screen name={EntityType.EventView} component={GenericScreen} />
      <Stack.Screen name={EntityType.RaceMeetingView} component={GenericScreen} />
      <Stack.Screen name={EntityType.RaceView} component={GenericScreen} />
      <Stack.Screen name={EntityType.MarketView} component={GenericScreen} />
      <Stack.Screen name={EntityType.CompetitionView} component={GenericScreen} />
      <Stack.Screen name={EntityType.VirtualsView} component={GenericScreen} />
      <Stack.Screen name={EntityType.CouponView} component={GenericScreen} />
      <Stack.Screen name={EntityType.ObbLandingPageView} component={GenericScreen} />
      <Stack.Screen name={EntityType.CouponsByDayView} component={GenericScreen} />
      <Stack.Screen name={EntityType.PlayerView} component={GenericScreen} />
      <Stack.Screen name={ScreenName.GameInfoScreen} component={GameInfoScreen} />
      <Stack.Screen name={EntityType.PromotionsHubView} component={GenericScreen} />
      {renderCommonStackScreens({ screen: Stack.Screen })}
    </Stack.Navigator>
  );
}

export default HomeNavigator;
