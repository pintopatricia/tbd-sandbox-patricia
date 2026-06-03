import { FunctionComponent } from "react";
import { View } from "react-native";
import { Divider, Placeholder } from "@ppb/the-wall-native";
import styles from "./ObbCreatedBetsCardPlaceholder.native.styles";

const ObbCreatedBetsCardPlaceholder: FunctionComponent = () => (
  <View style={styles.card}>
    <View style={styles.header}>
      <View style={styles.durationContainer}>
        <Placeholder style={styles.placeholderFill} />
      </View>
      <View style={styles.teamsRow}>
        <View style={styles.teamContainer}>
          <Placeholder style={styles.placeholderFill} />
        </View>
        <View style={styles.scoreContainer}>
          <Placeholder style={styles.placeholderFill} />
        </View>
        <View style={styles.teamContainer}>
          <Placeholder style={styles.placeholderFill} />
        </View>
      </View>
    </View>

    <View style={styles.outcomesContainer}>
      <View style={styles.marketSection}>
        <View style={styles.marketContent}>
          <View style={styles.marketContentContainer}>
            <Placeholder style={styles.placeholderFill} />
          </View>
          <View style={styles.buttonContainer}>
            <Placeholder style={styles.placeholderFill} />
          </View>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statsPlaceholderContainer}>
            <Placeholder style={styles.placeholderFill} />
          </View>
        </View>
      </View>

      <Divider />

      <View style={styles.marketSection}>
        <View style={styles.marketContent}>
          <View style={styles.marketContentContainer}>
            <Placeholder style={styles.placeholderFill} />
          </View>
          <View style={styles.buttonContainer}>
            <Placeholder style={styles.placeholderFill} />
          </View>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statsPlaceholderContainer}>
            <Placeholder style={styles.placeholderFill} />
          </View>
        </View>
      </View>
    </View>

    <View style={styles.footer}>
      <Divider />
      <View style={styles.seeAllContainer}>
        <View style={styles.linkContainer}>
          <Placeholder style={styles.placeholderFill} />
        </View>
      </View>
    </View>
  </View>
);

export default ObbCreatedBetsCardPlaceholder;
