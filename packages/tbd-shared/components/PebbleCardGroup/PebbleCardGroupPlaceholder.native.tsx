import { FunctionComponent } from "react";
import { View } from "react-native";
import { Placeholder } from "@ppb/the-wall-native";
import styles from "./PebbleCardGroupPlaceholder.native.styles";

const PebbleCardGroupPlaceholder: FunctionComponent = () => (
  <View style={styles.placeholderContainer}>
    <Placeholder style={styles.placeholder} />
  </View>
);

export default PebbleCardGroupPlaceholder;
