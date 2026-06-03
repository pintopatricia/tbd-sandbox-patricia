import { FunctionComponent } from "react";
import { RichTextComponent } from "@ppb/the-wall-web";
import styles from "./ImsPromotionDetailsCard.web.css";
import { LoadedComponentProps } from "./props";

const ImsPromotionDetailsCard: FunctionComponent<LoadedComponentProps> = ({ title, details }) => (
  <div className={styles.container}>
    <h4 className={`typography-h380 ${styles.title}`}>{title}</h4>
    <RichTextComponent list={details} />
  </div>
);

export default ImsPromotionDetailsCard;
