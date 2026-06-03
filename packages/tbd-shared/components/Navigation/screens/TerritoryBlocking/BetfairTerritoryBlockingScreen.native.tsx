import type { JSX } from "react";
import { useEffect } from "react";
import { BackHandler, View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { i18n } from "../../../../helpers/i18n";
import { TERRITORY_BLOCKING_SCREEN } from "./BetfairTerritoryBlockingScreen.native.selectors";
import { BetfairTerritoryBlockingPage } from "../../../TerritoryBlockingPage/BetfairTerritoryBlockingPage.native";

function BetfairTerritoryBlockingScreen(): JSX.Element {
  useEffect(() => {
    // Prevents the user from going back using the hardware back button or swipe gesture on Android.
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => true);

    return () => backHandler.remove();
  }, []);

  const titleLabel = i18n({ key: "I18N.TERRITORYBLOCKING.TITLE" });
  const messageLabel = i18n({ key: "I18N.TERRITORYBLOCKING.BODY" });
  const infoLabel = "Betfair - Mobile Web";

  return (
    <View {...getTestProps(TERRITORY_BLOCKING_SCREEN, false)}>
      <BetfairTerritoryBlockingPage title={titleLabel} message={messageLabel} info={infoLabel} />
    </View>
  );
}

export default BetfairTerritoryBlockingScreen;
