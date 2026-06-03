import { FunctionComponent } from "react";
import { Placeholder } from "@ppb/the-wall-web/components/bricks/Placeholder/Placeholder";
import styles from "./RegulatoryCardPlaceholder.web.css";

const RegulatoryCardPlaceholder: FunctionComponent = () => (
  <div className={styles.placeholderContainer}>
    <Placeholder />
  </div>
);

export default RegulatoryCardPlaceholder;
