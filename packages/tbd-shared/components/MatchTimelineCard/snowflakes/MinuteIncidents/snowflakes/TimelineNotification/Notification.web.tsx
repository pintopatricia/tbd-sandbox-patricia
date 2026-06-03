import { FunctionComponent } from "react";
import classnames from "classnames";
import { MatchTimelineNotificationProps } from "./Notification.types";
import styles from "./Notification.web.css";

export const Notification: FunctionComponent<MatchTimelineNotificationProps> = ({ title, description }) => (
  <div className={classnames(`typography-h120`, styles.card)}>
    <span className={classnames(`typography-h180`, styles.middleTitle)}>{title}</span>
    {description && <span className={classnames("typography-h120", styles.middleDescription)}>{description}</span>}
  </div>
);
