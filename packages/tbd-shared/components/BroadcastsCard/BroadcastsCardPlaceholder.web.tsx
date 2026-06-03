import { FunctionComponent } from "react";
import { Placeholder } from "@ppb/the-wall-web";
import styles from "./BroadcastsCardPlaceholder.web.css";

const BroadcastsCardPlaceholder: FunctionComponent = () => (
  <div className={styles.placeholder} id="placeholder">
    <Placeholder />
  </div>
);

export default BroadcastsCardPlaceholder;
