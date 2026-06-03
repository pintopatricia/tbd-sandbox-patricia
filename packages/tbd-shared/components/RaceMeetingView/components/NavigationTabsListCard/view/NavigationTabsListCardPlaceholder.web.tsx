import type { FunctionComponent } from "react";
import { Placeholder } from "@ppb/the-wall-web";
import styles from "./NavigationTabsListCard.web.module.css";

const NavigationTabsListCardPlaceholder: FunctionComponent = () => (
  <div className={styles.placeholder}>
    <Placeholder />
  </div>
);

export default NavigationTabsListCardPlaceholder;
