import { FunctionComponent } from "react";

import { ComponentProps } from "./props";
import styles from "./BackNavigationItem.web.css";

const BackNavigationItem: FunctionComponent<ComponentProps> = ({ title }) => {
  const isLargeScreen = window.innerWidth > 900;

  return (
    <div>
      {!isLargeScreen && (
        <div className={styles.container}>
          <h1 className={styles.content}>{title}</h1>
        </div>
      )}
    </div>
  );
};

export default BackNavigationItem;
