import { FunctionComponent } from "react";
import { View } from "react-native";
import { Divider, Placeholder } from "@ppb/the-wall-native";
import styles from "./ObbSquadBetCardPlaceholder.native.styles";

const ObbSquadBetCardPlaceholder: FunctionComponent = () => (
  <View style={styles.placeholderContainer}>
    <Placeholder style={styles.title} />
    <View style={styles.microPlayerContainer}>
      <Placeholder style={styles.microPlayer} />
      <Placeholder style={styles.microPlayer} />
      <Placeholder style={styles.microPlayer} />
      <Placeholder style={styles.microPlayer} />
    </View>
    <Placeholder style={styles.statsLabel} />
    <Divider />
    <Placeholder style={styles.outcomesLabel} />
    <View style={styles.betButtonContainer}>
      <Placeholder style={styles.betButton} />
      <Placeholder style={styles.betButton} />
      <Placeholder style={styles.betButton} />
      <Placeholder style={styles.betButton} />
    </View>
  </View>
);

export default ObbSquadBetCardPlaceholder;
