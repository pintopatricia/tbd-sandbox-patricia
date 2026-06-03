import { FunctionComponent } from "react";
import { View } from "react-native";
import { Placeholder } from "@ppb/the-wall-native";
import styles from "./BroadcastsAndStatisticsCardPlaceholder.native.styles";

const BroadcastsAndStatisticsCardPlaceholder: FunctionComponent = () => (
  <View style={styles.placeholder}>
    <Placeholder style={styles.temporaryPlaceholderOverride} />
  </View>
);

export default BroadcastsAndStatisticsCardPlaceholder;
