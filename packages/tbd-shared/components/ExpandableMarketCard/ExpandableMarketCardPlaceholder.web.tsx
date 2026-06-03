import { FunctionComponent } from "react";
import { Placeholder } from "@ppb/the-wall-web/components/bricks/Placeholder/Placeholder";
import styles from "./ExpandableMarketCardPlaceholder.web.css";

const ExpandableMarketCardPlaceholder: FunctionComponent = () => (
  <div className={styles.placeholder}>
    <Placeholder />
  </div>
);

export default ExpandableMarketCardPlaceholder;
