import { FunctionComponent } from "react";
import { View } from "react-native";
import { Placeholder } from "@ppb/the-wall-native";
import styles from "./CorrectScoreCardPlaceholder.native.styles";

const CorrectScoreCardPlaceholder: FunctionComponent = () => (
  <View style={styles.container}>
    <Placeholder style={styles.temporaryPlaceholderOverride} />
  </View>
);

export default CorrectScoreCardPlaceholder;
