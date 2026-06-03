import { FunctionComponent } from "react";
import { Placeholder } from "@ppb/the-wall-web";
import styles from "./RaceMarketCardPlaceholder.web.css";

const RaceMarketCardPlaceholder: FunctionComponent = () => (
  <div className={styles.container} id="placeholder">
    <Placeholder />
  </div>
);
export default RaceMarketCardPlaceholder;
