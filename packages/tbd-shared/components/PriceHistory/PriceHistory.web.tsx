import { FunctionComponent } from "react";
import styles from "./PriceHistory.web.css";
import { ComponentProps } from "./props";

const PriceHistory: FunctionComponent<ComponentProps> = ({ previousOdds }) =>
  previousOdds ? <div className={`${styles.priceHistory} typography-h120`}>{previousOdds}</div> : null;

export default PriceHistory;
