import { FunctionComponent } from "react";

import styles from "./SportsbookPlacePlaceholder.web.css";
import { SportsbookPlacePlaceholderViewModel } from "./SportsbookPlacePlaceholder.web.types";

const ControlsGroup: FunctionComponent = () => (
  <div className={styles.controls}>
    <div className={styles.card}></div>
    <div className={styles.card}></div>
  </div>
);

export const SportsbookPlacePlaceholder: FunctionComponent<SportsbookPlacePlaceholderViewModel> = ({
  height = 300,
}) => {
  const placeholderHeight = height + 100; // adding 100px because we need to adjust the fix for Safari browswers that show a transparent bottombar
  return (
    <section className={styles.placeholder} style={{ height: placeholderHeight }}>
      <div className={styles.container}>
        <div className={styles.singlesCard}></div>
        <ControlsGroup />
      </div>
      <ControlsGroup />
    </section>
  );
};
