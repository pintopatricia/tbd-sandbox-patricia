import { FunctionComponent } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import { Placeholder } from "@ppb/the-wall-native";
import { ApplicationState } from "@ppb/tbd-store/state";
import styles from "./EventMarketCardPlaceholder.native.styles";

const EventMarketCardNativePlaceholder: FunctionComponent = () => {
  const brandSettings = useSelector((state: ApplicationState) => state.entities.brandSettings);
  const alternativeLayout = brandSettings?.ENABLE_CIP_BANNER;

  return (
    <View style={alternativeLayout ? styles.placeholderForMinHeight : styles.placeholder}>
      <Placeholder style={styles.temporaryPlaceholderOverride} />
    </View>
  );
};

export default EventMarketCardNativePlaceholder;
