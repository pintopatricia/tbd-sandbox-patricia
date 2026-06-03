import { FunctionComponent } from "react";
import { Placeholder } from "@ppb/the-wall-native";
import { View } from "react-native";
import styles from "./NavigationTabsListPlaceholder.native.styles";

const NavigationTabsListPlaceholder: FunctionComponent = () => (
  <View style={styles.placeholder}>
    <View style={styles.placeholderTabList}>
      <View style={styles.placeholderTabListItem}>
        <Placeholder style={styles.temporaryPlaceholderOverride} />
      </View>
      <View style={styles.placeholderTabListItem}>
        <Placeholder style={styles.temporaryPlaceholderOverride} />
      </View>
      <View style={styles.placeholderTabListItem}>
        <Placeholder style={styles.temporaryPlaceholderOverride} />
      </View>
      <View style={styles.placeholderTabListItem}>
        <Placeholder style={styles.temporaryPlaceholderOverride} />
      </View>
    </View>
    <View style={styles.placeholderTabContainer}>
      <Placeholder style={[styles.temporaryPlaceholderOverride, styles.noBorderRadius]} />
    </View>
  </View>
);

export default NavigationTabsListPlaceholder;
