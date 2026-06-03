import { FunctionComponent } from "react";
import { View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";

import { Text } from "@ppb/the-wall-native";
import { MatchTimelineNotificationProps } from "./Notification.types";
import styles from "./Notification.native.styles";
import { NOTIFICATION, NOTIFICATION_TITLE, NOTIFICATION_DESCRIPTION } from "./Notification.native.selectors";

export const Notification: FunctionComponent<MatchTimelineNotificationProps> = ({ title, description }) => (
  <View {...getTestProps(NOTIFICATION, false)} style={styles.card}>
    <Text {...getTestProps(NOTIFICATION_TITLE)} style={styles.title} numberOfLines={1}>
      {title}
    </Text>
    {description ? (
      <Text {...getTestProps(NOTIFICATION_DESCRIPTION)} style={styles.description}>
        {description}
      </Text>
    ) : null}
  </View>
);
