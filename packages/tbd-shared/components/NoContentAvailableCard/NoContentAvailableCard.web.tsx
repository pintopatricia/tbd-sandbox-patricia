import { FunctionComponent } from "react";
import { SystemIconName } from "@ppb/the-wall-icons/types";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import styles from "./NoContentAvailableCard.web.css";
import { i18n } from "../../helpers/i18n";

export const NoContentAvailableCard: FunctionComponent = () => {
  const firstLabelStyle = `typography-h380 ${styles.firstLabel}`;
  const secondLabelStyle = `typography-h152 ${styles.secondLabel}`;

  return (
    <div className={styles.noContentAvailableContainer}>
      <div className={styles.iconContainer}>
        <div className={styles.icon}>
          <GenericIcon name={SystemIconName.CLOSE} color={"var(--neutrals-icon-secondary)"}></GenericIcon>
        </div>
      </div>
      <span className={firstLabelStyle}>{i18n({ key: "I18N.NO_PRICE_AVAILABLE.TITLE" })}</span>
      <span className={secondLabelStyle}>{i18n({ key: "I18N.NO_CONTENT_AVAILABLE.TEXT" })}</span>
    </div>
  );
};
