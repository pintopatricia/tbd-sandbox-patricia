import { FunctionComponent } from "react";
import { Placeholder } from "@ppb/the-wall-web/components/bricks/Placeholder/Placeholder";
import styles from "./CouponHeaderCardPlaceholder.web.css";

const CouponPlaceholder: FunctionComponent = () => (
  <div className={styles.placeholder}>
    <Placeholder />
  </div>
);

export default CouponPlaceholder;
