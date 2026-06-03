import { FunctionComponent } from "react";
import classnames from "classnames";

import { Alert, PrimaryButton } from "@ppb/the-wall-web";
import styles from "./PromoMessageCard.web.css";
import { PromoMessageProps } from "./PromoMessageCard.web.types";

export const PromoMessageCard: FunctionComponent<PromoMessageProps> = ({ title, body, type, i18n, onSeeAll }) => (
  <div className={styles.imsPromoMessage}>
    <Alert type={type} message={title} detail={body} />
    <div className={classnames("typography-h120", styles.infoText)}>{i18n.seeAllInfo}</div>
    <PrimaryButton label={i18n.seeAllLabel} onTap={onSeeAll} />
    <div className={classnames("typography-h120", styles.recommendedText)}>{i18n.recommended}</div>
  </div>
);
