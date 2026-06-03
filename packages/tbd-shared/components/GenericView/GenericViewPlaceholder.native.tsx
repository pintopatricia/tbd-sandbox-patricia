import { FunctionComponent } from "react";
import { View } from "react-native";
import { Placeholder } from "@ppb/the-wall-native";
import styles from "./GenericViewPlaceholder.native.styles";

const HomePlaceholder: FunctionComponent = () => (
  <View style={styles.contentContainer}>
    <View style={styles.sportRibbonPlaceholderContainer}>
      <Placeholder style={styles.temporaryPlaceholderOverride} />
    </View>

    <View style={styles.swimlaneCardGroupPlaceholder}>
      <Placeholder style={styles.temporaryPlaceholderOverride} />
    </View>

    <Placeholder style={styles.temporaryPlaceholderOverride} />
  </View>
);

const GenericPlaceholder: FunctionComponent = () => (
  <View style={styles.contentContainer}>
    <View style={styles.headerPlaceholder}>
      <Placeholder style={styles.temporaryPlaceholderOverride} />
    </View>

    <Placeholder style={styles.temporaryPlaceholderOverride} />
  </View>
);

export const GenericViewPlaceholder: FunctionComponent<{ urn: string }> = ({ urn }) => {
  switch (urn) {
    case "ppb:tbd:view:generic:home":
      return <HomePlaceholder />;
    default:
      return <GenericPlaceholder />;
  }
};
