import { View } from "react-native";
import { Placeholder } from "@ppb/the-wall-native";
import styles from "./RaceMarketCardPlaceholder.native.styles";

const RaceMarketCardPlaceholder = () => (
  <View style={styles.raceMarketCardPlaceholder}>
    <Placeholder style={styles.temporaryPlaceholderOverride} />
  </View>
);

export default RaceMarketCardPlaceholder;
