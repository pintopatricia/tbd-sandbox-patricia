import { FunctionComponent, useRef } from "react";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { SystemIconName } from "@ppb/the-wall-icons";
import { MarketSwitcherProps } from "./MarketSwitcher.types";
import styles from "./MarketSwitcher.web.css";

export const MarketSwitcher: FunctionComponent<MarketSwitcherProps> = ({ onTap, title, label, value }) => {
  const buttonRef = useRef(null);
  return (
    <div className={styles.marketSwitcherContainer}>
      <button className={styles.marketSwitcher} onClick={() => onTap(value, buttonRef)}>
        {title && <span className={styles.title}>{title}</span>}

        <div className={styles.labelContainer}>
          <span className={styles.label}>{label}</span>

          <span className={styles.icon} ref={buttonRef}>
            <GenericIcon name={SystemIconName.CHEVRON_DOWN} color="var(--market-switcher-icon-colour)" />
          </span>
        </div>
      </button>
    </div>
  );
};
