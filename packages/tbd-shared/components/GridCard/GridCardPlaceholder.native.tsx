import { FunctionComponent } from "react";
import { View } from "react-native";
import { Placeholder } from "@ppb/the-wall-native";
import styles from "./GridCardPlaceholder.native.styles";

const GridCardPlaceholder: FunctionComponent = () => (
  <View style={styles.placeholder}>
    <Placeholder style={styles.temporaryPlaceholderOverride} />
  </View>
);

export default GridCardPlaceholder;
