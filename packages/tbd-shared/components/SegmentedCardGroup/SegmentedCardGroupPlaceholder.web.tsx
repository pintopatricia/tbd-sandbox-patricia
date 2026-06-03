/* eslint-disable jsx-a11y/heading-has-content */
import { FunctionComponent } from "react";
import styles from "./SegmentedCardGroupPlaceholder.web.css";

/**
 * Segmented Card Group placeholder
 */
const SegmentedCardGroupPlaceholder: FunctionComponent = () => (
  <div className={styles.placeholder}>
    <h2 className={`${styles.placeholderTitle} typography-h580`}></h2>
    <div className={styles.segmentedCardPlaceholder} />;
  </div>
);

export default SegmentedCardGroupPlaceholder;
