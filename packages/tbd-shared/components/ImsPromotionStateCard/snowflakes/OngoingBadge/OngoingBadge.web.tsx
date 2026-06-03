import { FunctionComponent } from "react";
import { OngoingBadgeProps } from "./OngoingBadge.types";
import styles from "./OngoingBadge.web.css";
import { OngoingPromoCardBadge } from "../OngoingPromoBadge/OngoingPromoCardBadge.web";

export const OngoingBadge: FunctionComponent<OngoingBadgeProps> = ({ label }) => (
  <div className={styles.promoBadge}>
    <span className={"typography-h088"}>{label}</span>
    <OngoingPromoCardBadge />
  </div>
);
