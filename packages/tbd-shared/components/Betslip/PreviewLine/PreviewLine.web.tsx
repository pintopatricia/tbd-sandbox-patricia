import { FunctionComponent } from "react";

import { CombinationsListLine } from "../Preview/snowflakes/CombinationsList/CombinationsList.web";
import { ComponentProps } from "./props";
import styles from "./PreviewLine.web.css";

export const PreviewLine: FunctionComponent<ComponentProps> = ({ order, odd, payout, runners }) => (
  <CombinationsListLine id={`${order}`} odd={odd} payout={payout}>
    {runners.map(({ id, title, subtitle }) => (
      <div key={id} className={styles.previewSelection}>
        <div className="typography-h088">{title}</div>
        <div className="typography-h082">{subtitle}</div>
      </div>
    ))}
  </CombinationsListLine>
);
