import { FunctionComponent } from "react";
import { View } from "react-native";
import { Placeholder } from "@ppb/the-wall-native";
import styles from "./SportsbookBetLegCardGroupPlaceholder.native.styles";

const SportsbookBetLegCardGroupPlaceholder: FunctionComponent = () => (
  <View style={styles.placeholderContainer}>
    <Placeholder style={styles.temporaryPlaceholderOverride} />
  </View>
);
export default SportsbookBetLegCardGroupPlaceholder;
