import { FunctionComponent } from "react";
import { View, type ViewStyle, type TextStyle } from "react-native";
import { FixtureTeamSide, IncidentIconType } from "@ppb/the-wall-common/types";
import { IncidentIcon, Text } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { SubstitutionNotificationProps } from "./SubstitutionNotification.types";
import styles from "./SubstitutionNotification.native.styles";
import {
  SUBSTITUTION_NOTIFICATION,
  SUBSTITUTION_NOTIFICATION_TITLE,
  SUBSTITUTION_NOTIFICATION_PLAYER_IN_ENTRY,
  SUBSTITUTION_NOTIFICATION_PLAYER_IN_ICON,
  SUBSTITUTION_NOTIFICATION_PLAYER_IN_TEXT,
  SUBSTITUTION_NOTIFICATION_PLAYER_OUT_ENTRY,
  SUBSTITUTION_NOTIFICATION_PLAYER_OUT_ICON,
  SUBSTITUTION_NOTIFICATION_PLAYER_OUT_TEXT,
} from "./SubstitutionNotification.native.selectors";

export const SubstitutionNotification: FunctionComponent<SubstitutionNotificationProps> = ({
  title,
  playerIn,
  playerOut,
  side,
}) => {
  const substitutionTitleStyles: TextStyle[] = [styles.title];
  const substitutionEntryStyles: ViewStyle[] = [styles.entry];
  const substitutionTextStyles: TextStyle[] = [styles.substitutionText];

  if (side === FixtureTeamSide.HOME) {
    substitutionTitleStyles.push(styles.homeText);
    substitutionEntryStyles.push(styles.entryHome);
    substitutionTextStyles.push(styles.homeText);
  }

  return (
    <View {...getTestProps(SUBSTITUTION_NOTIFICATION, false)} style={styles.notification}>
      <Text {...getTestProps(SUBSTITUTION_NOTIFICATION_TITLE)} style={substitutionTitleStyles}>
        {title}
      </Text>
      {!!playerIn && (
        <View {...getTestProps(SUBSTITUTION_NOTIFICATION_PLAYER_IN_ENTRY, false)} style={substitutionEntryStyles}>
          <View {...getTestProps(SUBSTITUTION_NOTIFICATION_PLAYER_IN_ICON)} style={styles.icon}>
            <IncidentIcon type={IncidentIconType.SUBSTITUTION_IN}></IncidentIcon>
          </View>
          <Text {...getTestProps(SUBSTITUTION_NOTIFICATION_PLAYER_IN_TEXT)} style={substitutionTextStyles}>
            {playerIn}
          </Text>
        </View>
      )}
      {!!playerOut && (
        <View {...getTestProps(SUBSTITUTION_NOTIFICATION_PLAYER_OUT_ENTRY, false)} style={substitutionEntryStyles}>
          <View {...getTestProps(SUBSTITUTION_NOTIFICATION_PLAYER_OUT_ICON)} style={styles.icon}>
            <IncidentIcon type={IncidentIconType.SUBSTITUTION_OUT}></IncidentIcon>
          </View>
          <Text {...getTestProps(SUBSTITUTION_NOTIFICATION_PLAYER_OUT_TEXT)} style={substitutionTextStyles}>
            {playerOut}
          </Text>
        </View>
      )}
    </View>
  );
};
