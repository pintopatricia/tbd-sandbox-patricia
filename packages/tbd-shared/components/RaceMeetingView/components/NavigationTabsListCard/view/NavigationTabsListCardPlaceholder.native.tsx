import type { FunctionComponent } from "react";
import { View } from "react-native";
import { Placeholder } from "@ppb/the-wall-native";
import styles from "./NavigationTabsListCard.native.styles";

const NavigationTabsListCardPlaceholder: FunctionComponent = () => (
  <View style={styles.placeholder}>
    <Placeholder />
  </View>
);

export default NavigationTabsListCardPlaceholder;
