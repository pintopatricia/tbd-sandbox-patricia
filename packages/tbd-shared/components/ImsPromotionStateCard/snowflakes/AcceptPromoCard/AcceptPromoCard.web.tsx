import { FunctionComponent } from "react";
import classnames from "classnames";
import { PrimaryButton } from "@ppb/the-wall-web";
import { AcceptPromoCardProps } from "./AcceptPromoCard.web.types";
import styles from "./AcceptPromoCard.web.css";

export const AcceptPromoCard: FunctionComponent<AcceptPromoCardProps> = ({ title, tcText, image, i18n, onAccept }) => (
  <div
    className={styles.acceptPromo}
    style={{
      backgroundImage: `url(${image})`,
    }}
  >
    <div className={styles.textBackground}>
      <div className={styles.textContent}>
        <h5 className={`${styles.title} typography-h280`}>{title}</h5>
        <div className={classnames(styles.tcText, "typography-h082")}>{tcText}</div>
      </div>
      <PrimaryButton label={i18n.accept} onTap={onAccept}></PrimaryButton>
    </div>
  </div>
);
