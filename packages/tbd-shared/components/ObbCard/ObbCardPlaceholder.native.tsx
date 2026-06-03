 
import { FunctionComponent } from "react";
import { View } from "react-native";
import { Placeholder } from "@ppb/the-wall-native";
import styles from "./ObbCardPlaceholder.native.styles";

const ObbCardPlaceholder: FunctionComponent = () => (
  <View style={styles.placeholder}>
    <Placeholder style={styles.placeholderContainer} />
  </View>
);

export default ObbCardPlaceholder;
