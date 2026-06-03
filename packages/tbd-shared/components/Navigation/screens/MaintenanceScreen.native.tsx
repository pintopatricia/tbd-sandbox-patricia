import type { JSX } from "react";
import { useEffect } from "react";
import { BackHandler, View } from "react-native";
import { codecs } from "@ppb/tbd-urn-codecs";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import ConnectedMaintenancePage from "../../MaintenancePage";
import MaintenancePage from "../../MaintenancePage/MaintenancePage.native";
import styles from "./MaintenanceScreen.native.styles";
import { MAINTENANCE_SCREEN } from "./MaintenanceScreen.native.selectors";

const { uid } = codecs.maintenanceView.encode();

function MaintenanceScreen(): JSX.Element {
  useEffect(() => {
    // Prevents the user from going back using the hardware back button or swipe gesture on Android.
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => true);

    return () => backHandler.remove();
  }, []);

  return (
    <View {...getTestProps(MAINTENANCE_SCREEN, false)} style={styles.maintenanceScreen}>
      <ConnectedMaintenancePage component={MaintenancePage} urn={uid} />
    </View>
  );
}

export default MaintenanceScreen;
