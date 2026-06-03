import { FunctionComponent } from "react";
import { View } from "react-native";
import { Placeholder } from "@ppb/the-wall-native";
import styles from "./QuickLinksCardPlaceholder.native.styles";

const QuickLinksCardPlaceholder: FunctionComponent = () => (
  <View style={styles.placeholder}>
    <View style={styles.placeholderTitle}>
      <Placeholder style={styles.temporaryPlaceholderOverride} />
    </View>
    <View style={styles.placeholderContainer}>
      <Placeholder style={styles.temporaryPlaceholderOverride} />
    </View>
  </View>
);

export default QuickLinksCardPlaceholder;
