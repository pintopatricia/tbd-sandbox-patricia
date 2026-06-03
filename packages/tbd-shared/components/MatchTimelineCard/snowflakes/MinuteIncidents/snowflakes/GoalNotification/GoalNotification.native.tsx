import { FunctionComponent } from "react";
import { View } from "react-native";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SportsIconName } from "@ppb/the-wall-icons";
import { colors } from "@ppb/the-wall-common/base-theme";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { Text } from "@ppb/the-wall-native";
import { GoalNotificationProps } from "./GoalNotification.types";
import styles from "./GoalNotification.native.styles";
import {
  GOAL_NOTIFICATION,
  GOAL_NOTIFICATION_TITLE,
  GOAL_NOTIFICATION_DESCRIPTION,
  GOAL_NOTIFICATION_SECOND_DESCRIPTION,
  GOAL_NOTIFICATION_ICON,
} from "./GoalNotification.native.selectors";

export const GoalNotification: FunctionComponent<GoalNotificationProps> = ({
  title,
  description,
  secondDescription,
  side,
  isOwnGoal,
}) => {
  // Defining the card / text style so it can be aligned
  // to the left or right depending if it is home / away card.
  const homeAwayStyles = {
    HOME: { goal: styles.goalHome, text: styles.textHome, icon: styles.iconHome },
    AWAY: { goal: styles.goalAway, text: styles.textAway, icon: styles.iconAway },
  };

  const isOwnGoalStyle = isOwnGoal
    ? { goal: styles.ownGoal, textTitle: styles.textOwnGoal, textDescription: styles.textOwnGoal }
    : { goal: styles.goal, textTitle: styles.textGoalTitle, textDescription: styles.textGoalDescription };

  const cardStyle = [styles.goalNotification, homeAwayStyles[side].goal, isOwnGoalStyle.goal];
  const iconStyle = [styles.iconContainer, homeAwayStyles[side].icon];
  const titleStyle = [styles.title, homeAwayStyles[side].text, isOwnGoalStyle.textTitle];
  const descriptionStyle = [styles.description, homeAwayStyles[side].text, isOwnGoalStyle.textDescription];
  const iconColor = isOwnGoal
    ? colors.SignpostingIndicatorsRichContentIconNegative2
    : colors.SignpostingIndicatorsRichContentIconWarning2;

  return (
    <View {...getTestProps(GOAL_NOTIFICATION, false)} style={cardStyle}>
      <View {...getTestProps(GOAL_NOTIFICATION_ICON)} style={iconStyle}>
        <GenericIcon color={iconColor} name={SportsIconName.FOOTBALL} />
      </View>
      {!!title && (
        <Text {...getTestProps(GOAL_NOTIFICATION_TITLE)} style={titleStyle}>
          {title}
        </Text>
      )}
      {!!description && (
        <Text {...getTestProps(GOAL_NOTIFICATION_DESCRIPTION)} style={descriptionStyle}>
          {description}
        </Text>
      )}
      {!!secondDescription && (
        <Text {...getTestProps(GOAL_NOTIFICATION_SECOND_DESCRIPTION)} style={descriptionStyle}>
          {secondDescription}
        </Text>
      )}
    </View>
  );
};
