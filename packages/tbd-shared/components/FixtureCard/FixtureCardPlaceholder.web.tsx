import { FunctionComponent } from "react";
import { Placeholder } from "@ppb/the-wall-web";
import styles from "./FixtureCardPlaceholder.web.css";

const FixtureCardPlaceholder: FunctionComponent = () => (
  <div className={styles.container}>
    <Placeholder />
  </div>
);

export default FixtureCardPlaceholder;
