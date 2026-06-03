import type { JSX } from "react";
import { FunctionComponent } from "react";
import classnames from "classnames";
import { FixtureTeamSide, IncidentIconType } from "@ppb/the-wall-common/types";
import { IncidentIcon } from "@ppb/the-wall-web/components/bricks/IncidentIcon/IncidentIcon";
import { CardNotificationProps, CardNotificationType } from "./CardNotification.types";
import styles from "./CardNotification.web.css";

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
  const classNameCard = classnames(`typography-h120`, styles.card, {
    [styles.home]: side === FixtureTeamSide.HOME,
    [styles.away]: side === FixtureTeamSide.AWAY,
  });

  return (
    <div className={classNameCard}>
      <span className={styles.iconsContainer}>{getCardIcon(cardType)}</span>
      <span className={classnames(`typography-h180`, styles.sideTitle)}>{title}</span>
      {description && <span className={classnames("typography-h120", styles.sideDescription)}>{description}</span>}
    </div>
  );
};
