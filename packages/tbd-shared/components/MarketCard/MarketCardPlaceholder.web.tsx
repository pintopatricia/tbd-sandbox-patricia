import { FunctionComponent } from "react";
import { Placeholder } from "@ppb/the-wall-web/components/bricks/Placeholder/Placeholder";
import styles from "./MarketCardPlaceholder.web.css";

const MarketCardPlaceholder: FunctionComponent = () => (
  <div className={styles.placeholder} id="placeholder">
    <Placeholder />
  </div>
);

export default MarketCardPlaceholder;
