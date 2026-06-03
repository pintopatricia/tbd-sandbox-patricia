import { View } from "react-native";

import { ScrollableSwimlane, Divider, Placeholder } from "@ppb/the-wall-native";
import styles from "./ObbEventPopularsCardPlaceholder.native.styles";

const ObbEventPopularsCardPlaceholder = () => {
  return (
    <ScrollableSwimlane title="">
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.bettingOpportunitiesContainer}>
            <View style={styles.marketSection}>
              <View style={styles.popularEvidenceContainer}>
                <View style={styles.popularEvidencePlaceholderContainer}>
                  <Placeholder style={styles.placeholderFill} />
                </View>
              </View>
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
              <View style={styles.popularEvidenceContainer}>
                <View style={styles.popularEvidencePlaceholderContainer}>
                  <Placeholder style={styles.placeholderFill} />
                </View>
              </View>
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
            <View style={styles.showMoreContainer}>
              <View style={styles.linkContainer}>
                <Placeholder style={styles.placeholderFill} />
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollableSwimlane>
  );
};

export default ObbEventPopularsCardPlaceholder;
