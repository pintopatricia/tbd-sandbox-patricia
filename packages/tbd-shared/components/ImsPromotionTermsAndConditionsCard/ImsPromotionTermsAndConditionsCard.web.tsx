import { FunctionComponent } from "react";
import { RichTextComponent } from "@ppb/the-wall-web";
import { LoadedComponentProps } from "./props";
import styles from "./ImsPromotionTermsAndConditionsCard.web.css";

const ImsPromotionTermsAndConditionsCard: FunctionComponent<LoadedComponentProps> = ({ title, termsAndConditions }) => (
  <div className={styles.container}>
    <h4 className={`typography-h380 ${styles.title}`}>{title}</h4>
    <RichTextComponent list={termsAndConditions} />
  </div>
);

export default ImsPromotionTermsAndConditionsCard;
