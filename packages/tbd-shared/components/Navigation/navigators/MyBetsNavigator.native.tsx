import type { JSX } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { EntityType } from "@ppb/tbd-urn-codecs";
import URN from "@ppb/tbd-store/state/layout/URN";
import MyBetsScreen from "../screens/MyBetsScreen.native";
import { renderCommonStackScreens } from "./CommonStackScreens.native";

const Stack = createNativeStackNavigator();

function MyBetsNavigator({ viewUrn }: { viewUrn: URN }): JSX.Element {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        freezeOnBlur: true,
      }}
    >
      <Stack.Screen
        name={EntityType.MyBetsView}
        initialParams={{
          viewLink: {
            viewUrn,
          },
        }}
        component={MyBetsScreen}
      />
      {renderCommonStackScreens({ screen: Stack.Screen })}
    </Stack.Navigator>
  );
}

export default MyBetsNavigator;
