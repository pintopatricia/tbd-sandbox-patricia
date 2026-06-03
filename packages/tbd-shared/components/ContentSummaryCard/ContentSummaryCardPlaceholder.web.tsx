import { FunctionComponent } from "react";
import { Placeholder } from "@ppb/the-wall-web";
import styles from "./ContentSummaryCardPlaceholder.web.css";

const ContentSummaryCardPlaceholder: FunctionComponent = () => (
  <div className={styles.placeholder}>
    <Placeholder />
  </div>
);

export default ContentSummaryCardPlaceholder;
