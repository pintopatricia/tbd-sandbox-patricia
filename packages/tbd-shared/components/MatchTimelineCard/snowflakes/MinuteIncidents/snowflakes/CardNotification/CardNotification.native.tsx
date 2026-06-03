import type { FunctionComponent, JSX } from "react";
import { View } from "react-native";
import { IncidentIconType } from "@ppb/the-wall-common/types";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { IncidentIcon, Text } from "@ppb/the-wall-native";
import { CardNotificationProps, CardNotificationType } from "./CardNotification.types";
import styles from "./CardNotification.native.styles";
import {
  CARD_NOTIFICATION,
  CARD_NOTIFICATION_TITLE,
  CARD_NOTIFICATION_DESCRIPTION,
  CARD_NOTIFICATION_CARD_ICON,
} from "./CardNotification.native.selectors";

function getCardIcon(cardType: CardNotificationType): JSX.Element | null {
  const cardMapping = {
    [CardNotificationType.YELLOW]: IncidentIconType.YELLOW_CARD,
    [CardNotificationType.SECOND_YELLOW]: IncidentIconType.SECOND_YELLOW_CARD,
    [CardNotificationType.RED]: IncidentIconType.RED_CARD,
  };

  const iconType = cardMapping[cardType];
  return iconType ? <IncidentIcon type={iconType}></IncidentIcon> : null;
}

export const CardNotification: FunctionComponent<CardNotificationProps> = ({ title, description, cardType, side }) => {
  // Defining the card / text style so it can be aligned
  // to the left or right depending if it is home / away card.
  const homeAwayStyles = {
    HOME: { text: styles.textHome, card: styles.cardHome },
    AWAY: { text: styles.textAway, card: styles.cardAway },
  };

  return (
    <View {...getTestProps(CARD_NOTIFICATION, false)} style={[styles.cardNotification, homeAwayStyles[side].card]}>
      {!!cardType && (
        <View {...getTestProps(CARD_NOTIFICATION_CARD_ICON)} style={styles.iconContainer}>
          {getCardIcon(cardType)}
        </View>
      )}
      {!!title && (
        <Text {...getTestProps(CARD_NOTIFICATION_TITLE)} style={[styles.title, homeAwayStyles[side].text]}>
          {title}
        </Text>
      )}
      {!!description && (
        <Text {...getTestProps(CARD_NOTIFICATION_DESCRIPTION)} style={[styles.description, homeAwayStyles[side].text]}>
          {description}
        </Text>
      )}
    </View>
  );
};
