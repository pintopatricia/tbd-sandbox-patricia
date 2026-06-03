import { View } from "react-native";
import { Styled, Text } from "@ppb/the-wall-native";
import { GenericIcon, Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import styles from "./TimesBacked.native.styles";
import { TIMES_BACKED, TIMES_BACKED_LABEL, TIMES_BACKED_ICON } from "./TimesBacked.native.selectors";

export const TimesBacked = ({ label, icon, iconColor }: { label: string; icon: Icons; iconColor: string }) => (
  <View {...getTestProps(TIMES_BACKED)} style={styles.timesBackedContainer}>
    <View {...getTestProps(TIMES_BACKED_ICON)} style={styles.timesBackedIcon}>
      <GenericIcon name={icon} color={iconColor} />
    </View>
    <Text {...getTestProps(TIMES_BACKED_LABEL)} style={styles.timesBackedLabel}>
      <Styled translation={label} styles={{ count: styles.timesBackedCount }} />
    </Text>
  </View>
);

export default TimesBacked;
