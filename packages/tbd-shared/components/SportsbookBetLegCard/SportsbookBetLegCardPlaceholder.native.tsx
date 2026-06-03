import { FunctionComponent } from "react";
import { View } from "react-native";
import { Placeholder } from "@ppb/the-wall-native";
import styles from "./SportsbookBetLegCardPlaceholder.native.styles";

const SportsbookBetLegCardPlaceholder: FunctionComponent = () => (
  <View style={styles.placeholderContainer}>
    <Placeholder style={styles.temporaryPlaceholderOverride} />
  </View>
);

export default SportsbookBetLegCardPlaceholder;
