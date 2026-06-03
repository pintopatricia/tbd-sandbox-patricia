 
import { FunctionComponent } from "react";
import { View } from "react-native";
import { Placeholder } from "@ppb/the-wall-native";
import styles from "./BroadcastsCardPlaceholder.native.styles";

const BroadcastsCardPlaceholder: FunctionComponent = () => (
  <View style={styles.placeholder}>
    <Placeholder style={styles.placeholder} />
  </View>
);
export default BroadcastsCardPlaceholder;
