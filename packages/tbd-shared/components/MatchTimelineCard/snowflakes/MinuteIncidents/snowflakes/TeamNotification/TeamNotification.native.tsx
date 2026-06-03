import { FunctionComponent } from "react";
import { View } from "react-native";
import { FixtureTeamSide } from "@ppb/the-wall-common/types";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";

import { Text } from "@ppb/the-wall-native";
import { TeamNotificationProps } from "./TeamNotification.types";
import styles from "./TeamNotification.native.styles";
import {
  TEAM_NOTIFICATION,
  TEAM_NOTIFICATION_TITLE,
  TEAM_NOTIFICATION_DESCRIPTION,
} from "./TeamNotification.native.selectors";

export const TeamNotification: FunctionComponent<TeamNotificationProps> = ({ title, description, side }) => {
  const titleStyle = [
    styles.title,
    side === FixtureTeamSide.HOME && styles.home,
    side === FixtureTeamSide.AWAY && styles.away,
  ];
  const descriptionStyle = [
    styles.description,
    side === FixtureTeamSide.HOME && styles.home,
    side === FixtureTeamSide.AWAY && styles.away,
  ];

  return (
    <View style={styles.container} {...getTestProps(TEAM_NOTIFICATION, false)}>
      <Text style={titleStyle} {...getTestProps(TEAM_NOTIFICATION_TITLE)}>
        {title}
      </Text>
      {!!description && (
        <Text style={descriptionStyle} {...getTestProps(TEAM_NOTIFICATION_DESCRIPTION)}>
          {description}
        </Text>
      )}
    </View>
  );
};
