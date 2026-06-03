import type { JSX } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { RouteProp, useRoute } from "@react-navigation/native";
import { EntityType } from "@ppb/tbd-urn-codecs";
import { ScreenName } from "@ppb/tbd-router/native";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";

import GenericScreen from "../screens/GenericScreen.native";
import GameInfoScreen from "../screens/GameInfoScreen.native";
import { renderCommonStackScreens } from "./CommonStackScreens.native";

type ParamList = {
  BrowseNavigator: {
    viewLink: ViewLink;
  };
};

const Stack = createNativeStackNavigator();

/**
 * Temporary navigator until BROWSE_PAGE_PRISMIC is removed
 * this can then replace BrowseNavigator
 */
function BrowseSwitchNavigator(): JSX.Element {
  const route = useRoute<RouteProp<ParamList, "BrowseNavigator">>();
  const { viewUrn } = route?.params?.viewLink ?? undefined;

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        freezeOnBlur: true,
      }}
    >
      <Stack.Screen
        name={EntityType.BrowseView}
        component={GenericScreen}
        initialParams={{
          viewLink: {
            viewUrn,
          },
        }}
      />
      <Stack.Screen name={ScreenName.GameInfoScreen} component={GameInfoScreen} />
      {renderCommonStackScreens({ screen: Stack.Screen })}
    </Stack.Navigator>
  );
}

export default BrowseSwitchNavigator;
