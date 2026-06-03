import { Styled } from "@ppb/the-wall-web";
import classNames from "classnames";
import { GenericIcon, Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import styles from "./TimesBacked.web.css";

export const TimesBacked = ({ label, icon, iconColor }: { label: string; icon: Icons; iconColor: string }) => (
  <div className={classNames(styles.timesBackedContainer)}>
    <div className={styles.timesBackedIcon}>
      <GenericIcon name={icon} color={iconColor} />
    </div>
    <span className={styles.timesBackedLabel}>
      <Styled translation={label} styles={{ count: styles.timesBackedCount }} />
    </span>
  </div>
);

export default TimesBacked;
