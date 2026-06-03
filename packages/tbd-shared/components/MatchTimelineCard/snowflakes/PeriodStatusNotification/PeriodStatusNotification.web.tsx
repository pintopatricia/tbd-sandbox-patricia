import { FunctionComponent } from "react";
import classnames from "classnames";
import { HeadToHeadResult } from "@ppb/the-wall-web/components/bricks/HeadToHeadResult/HeadToHeadResult";
import { PeriodStatusNotificationProps } from "./PeriodStatusNotification.types";
import styles from "./PeriodStatusNotification.web.css";

export const PeriodStatusNotification: FunctionComponent<PeriodStatusNotificationProps> = ({ title, resultProps }) => (
  <div className={styles.periodStatusNotificationContainer}>
    <span className={classnames(`typography-h158`, styles.title)}>{title}</span>
    <HeadToHeadResult {...resultProps} />
  </div>
);
