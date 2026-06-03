import { Placeholder } from "@ppb/the-wall-native";
import { FunctionComponent } from "react";
import { View } from "react-native";
import styles from "./ByTimeRangeMeetingCardGroup.native.styles";

export type ByTimeRangeMeetingCardGroupPlaceholderProps = {};

const ByTimeRangeMeetingCardGroupPlaceholder: FunctionComponent<ByTimeRangeMeetingCardGroupPlaceholderProps> = () => (
  <View style={styles.placeholder}>
    <View style={styles.placeholderHeader}>
      <Placeholder style={styles.placeholderTitle} />
    </View>
    <Placeholder style={styles.placeholderContainer} />
  </View>
);

export default ByTimeRangeMeetingCardGroupPlaceholder;
