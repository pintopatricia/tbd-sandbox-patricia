import { FunctionComponent } from "react";
import { View } from "react-native";
import styles from "./SegmentedCardGroup.native.styles";

/**
 * Segmented Card Group placeholder
 */
const SegmentedCardGroupPlaceholder: FunctionComponent = () => (
  <View style={styles.placeholder}>
    <View style={styles.placeholderTitle} />
    <View style={styles.segmentedCardPlaceholder} />
  </View>
);

export default SegmentedCardGroupPlaceholder;
