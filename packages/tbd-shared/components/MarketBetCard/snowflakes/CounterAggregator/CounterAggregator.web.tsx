import { FunctionComponent } from "react";
import { CounterColor, CounterSize } from "@ppb/the-wall-common/types";

import { Counter, ActionLink } from "@ppb/the-wall-web";
import { CounterAggregatorProps } from "./CounterAggregator.types";
import styles from "./CounterAggregator.web.css";

export const CounterAggregator: FunctionComponent<CounterAggregatorProps> = ({
  count,
  title,
  subtitle,
  buttonText,
  onButtonTap,
}) => (
  <div className={styles.headerContainer}>
    <div className={styles.titleContainer}>
      <div className={styles.contentTop}>
        <Counter value={count} color={CounterColor.Yellow} size={CounterSize.Small} />
        <h3 className={`${styles.title}`}>{title}</h3>
      </div>
      {!!buttonText && !!onButtonTap && (
        <div className={styles.titleButton}>
          <ActionLink text={buttonText} onClick={onButtonTap} noPadding={true} stopPropagate={true} />
        </div>
      )}
    </div>
    {!!subtitle && <span className={`${styles.subtitle}`}>{subtitle}</span>}
  </div>
);
