import type { JSX } from "react";
import { useEffect } from "react";
import { BackHandler, View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { i18n } from "../../../../helpers/i18n";
import { TERRITORY_BLOCKING_SCREEN } from "./SkybetTerritoryBlockingScreen.native.selectors";
import { SkybetTerritoryBlockingPage } from "../../../TerritoryBlockingPage/SkybetTerritoryBlockingPage.native";

function SkybetTerritoryBlockingScreen(): JSX.Element {
  useEffect(() => {
    // Prevents the user from going back using the hardware back button or swipe gesture on Android.
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => true);

    return () => backHandler.remove();
  }, []);

  const titleLabel = i18n({ key: "I18N.TERRITORYBLOCKING.TITLE" });
  const messageLabel = i18n({ key: "I18N.TERRITORYBLOCKING.BODY" });
  const infoLabel = i18n({ key: "I18N.TERRITORYBLOCKING.INFO" });

  return (
    <View {...getTestProps(TERRITORY_BLOCKING_SCREEN, false)}>
      <SkybetTerritoryBlockingPage title={titleLabel} message={messageLabel} info={infoLabel} />
    </View>
  );
}

export default SkybetTerritoryBlockingScreen;
