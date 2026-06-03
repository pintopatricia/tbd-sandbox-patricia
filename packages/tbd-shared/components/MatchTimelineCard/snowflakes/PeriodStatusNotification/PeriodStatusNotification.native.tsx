import { FunctionComponent } from "react";
import { View } from "react-native";
import { HeadToHeadResult } from "@ppb/the-wall-native/components/HeadToHead/HeadToHeadResult/HeadToHeadResult";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { Text } from "@ppb/the-wall-native";
import { PeriodStatusNotificationProps } from "./PeriodStatusNotification.types";
import styles from "./PeriodStatusNotification.native.styles";
import {
  PERIOD_STATUS_NOTIFICATION,
  PERIOD_STATUS_NOTIFICATION_TITLE,
} from "./PeriodStatusNotification.native.selectors";

export const PeriodStatusNotification: FunctionComponent<PeriodStatusNotificationProps> = ({ title, resultProps }) => (
  <View style={styles.periodStatusNotification} {...getTestProps(PERIOD_STATUS_NOTIFICATION, false)}>
    <Text style={styles.title} {...getTestProps(PERIOD_STATUS_NOTIFICATION_TITLE)}>
      {title}
    </Text>
    <HeadToHeadResult {...resultProps} />
  </View>
);
