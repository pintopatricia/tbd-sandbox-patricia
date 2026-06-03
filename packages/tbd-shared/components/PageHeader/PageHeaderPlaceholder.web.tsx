import { FunctionComponent } from "react";
import { Placeholder } from "@ppb/the-wall-web/components/bricks/Placeholder/Placeholder";
import styles from "./PageHeaderPlaceholder.web.css";

const PageHeaderPlaceholder: FunctionComponent = () => (
  <div className={styles.placeholderContainer}>
    <Placeholder className={styles.placeholder} />
  </div>
);

export default PageHeaderPlaceholder;
