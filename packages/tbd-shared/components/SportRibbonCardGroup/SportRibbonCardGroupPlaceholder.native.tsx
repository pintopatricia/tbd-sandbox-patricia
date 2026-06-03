import { FunctionComponent } from "react";
import { View } from "react-native";
import { Placeholder } from "@ppb/the-wall-native";
import styles from "./SportRibbonCardGroupPlaceholder.native.styles";

/**
 * SportRibbon Card Group placeholder
 */
const SportRibbonCardGroupPlaceholder: FunctionComponent = () => (
  <View style={styles.placeholderContainer}>
    <View style={styles.sportRibbonCardPlaceholder}>
      <Placeholder style={styles.temporaryPlaceholderOverride} />
    </View>
    <View style={styles.sportRibbonCardPlaceholder}>
      <Placeholder style={styles.temporaryPlaceholderOverride} />
    </View>
    <View style={styles.sportRibbonCardPlaceholder}>
      <Placeholder style={styles.temporaryPlaceholderOverride} />
    </View>
    <View style={styles.sportRibbonCardPlaceholder}>
      <Placeholder style={styles.temporaryPlaceholderOverride} />
    </View>
    <View style={styles.sportRibbonCardPlaceholder}>
      <Placeholder style={styles.temporaryPlaceholderOverride} />
    </View>
    <View style={styles.sportRibbonCardPlaceholder}>
      <Placeholder style={styles.temporaryPlaceholderOverride} />
    </View>
  </View>
);

export default SportRibbonCardGroupPlaceholder;
