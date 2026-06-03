import { FunctionComponent } from "react";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";
import { StarsProps } from "./Stars.types";
import styles from "./Stars.web.css";

export const Stars: FunctionComponent<StarsProps> = ({ filled, outline }) => (
  <div className={styles.stars}>
    {Array.from({ length: filled }).map((_, idx) => (
      <span key={idx} className={styles.starFilled}>
        <GenericIcon name={SystemIconName.STAR_FILLED} color={"var(--agnostic-signposting-generosity-icon-default)"} />
      </span>
    ))}
    {Array.from({ length: outline }).map((_, idx) => (
      <span key={idx} className={styles.starOutline}>
        <GenericIcon name={SystemIconName.STAR_OUTLINED} color={"var(--agnostic-neutrals-icon-disabled)"} />
      </span>
    ))}
  </div>
);
