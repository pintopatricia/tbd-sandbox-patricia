import { FunctionComponent } from "react";
import { View } from "react-native";
import { Placeholder } from "@ppb/the-wall-native";
import styles from "./RaceResultsCardPlaceholder.native.styles";

const RaceResultsCardPlaceholder: FunctionComponent = () => (
  <View style={styles.raceResultsCardPlaceholder}>
    <Placeholder style={styles.temporaryPlaceholderOverride} />
  </View>
);

export default RaceResultsCardPlaceholder;
