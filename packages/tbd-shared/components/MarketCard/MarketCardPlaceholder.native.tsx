import { FunctionComponent } from "react";
import { View, ViewStyle } from "react-native";
import { Placeholder } from "@ppb/the-wall-native";

const styles: { [key: string]: ViewStyle } = {
  placeholder: {
    height: 105,
  },
  temporaryPlaceholderOverride: {
    height: "100%",
  },
};

const MarketCardPlaceholder: FunctionComponent = () => (
  <View style={styles.placeholder}>
    <Placeholder style={styles.temporaryPlaceholderOverride} />
  </View>
);

export default MarketCardPlaceholder;
