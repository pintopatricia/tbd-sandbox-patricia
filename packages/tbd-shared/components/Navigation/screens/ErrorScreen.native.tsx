import { type JSX, useEffect } from "react";
import { BackHandler, ScrollView } from "react-native";
import { NativeEntityTypes } from "@ppb/tbd-router/native/router";
import ConnectedErrorView from "../../ErrorView/index";
import ErrorView from "../../ErrorView/ErrorView.native";

function ErrorScreen(): JSX.Element {
  useEffect(() => {
    // Prevents the user from going back using the hardware back button or swipe gesture on Android.
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => true);

    return () => backHandler.remove();
  }, []);
  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }} scrollEventThrottle={16}>
      <ConnectedErrorView urn={NativeEntityTypes.Error} component={ErrorView} />
    </ScrollView>
  );
}

export default ErrorScreen;
