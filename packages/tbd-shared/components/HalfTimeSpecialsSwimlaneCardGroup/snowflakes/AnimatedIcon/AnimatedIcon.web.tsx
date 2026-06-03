import { FunctionComponent } from "react";
import classNames from "classnames";
import styles from "./AnimatedIcon.web.css";

const AnimatedIcon: FunctionComponent = () => (
  <div className={classNames(styles.icon)} data-testid="ICON">
    <div className={classNames(styles.text)}>NEW</div>
  </div>
);

export default AnimatedIcon;
