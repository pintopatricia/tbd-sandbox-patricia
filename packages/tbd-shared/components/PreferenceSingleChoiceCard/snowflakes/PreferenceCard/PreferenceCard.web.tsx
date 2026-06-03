import { FunctionComponent } from "react";
import { SystemIconName } from "@ppb/the-wall-icons";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { PreferenceCardProps } from "./PreferenceCard.types";
import styles from "./PreferenceCard.web.css";

export const PreferenceCard: FunctionComponent<PreferenceCardProps> = ({
  title,
  hint,
  children,
  extraContent,
  onInfoButtonClick,
}) => (
  <div className={styles.container}>
    {!!title || !!onInfoButtonClick ? (
      <div className={styles.header}>
        {!!title && <span className={`${styles.title} typography-h380`}>{title}</span>}
        {!!onInfoButtonClick && (
          <button className={styles.infoContainer} onClick={onInfoButtonClick}>
            <GenericIcon name={SystemIconName.NOTIFICATION_INFO} color={"var(--action-tertiary-icon-default)"} />
          </button>
        )}
      </div>
    ) : null}
    {extraContent && <div className={styles.extraContent}>{extraContent}</div>}
    <div className={styles.option}>
      {!!hint && <span className={`${styles.hint} typography-h152`}>{hint}</span>}
      {children}
    </div>
  </div>
);
