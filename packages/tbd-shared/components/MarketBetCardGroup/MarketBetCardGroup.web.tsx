import { FunctionComponent } from "react";
import { ComponentProps } from "./props";
import ConnectedCard from "../Card";
import Card from "../Card/Card.web";
import styles from "./MarketBetCardGroup.web.css";

const MarketBetCardGroup: FunctionComponent<ComponentProps> = ({ items }) => (
  <div className={styles.marketBetCardGroup}>
    {items?.map(({ urn, typename }) => (
      <div className={styles.groupItem} key={urn}>
        <ConnectedCard key={urn} urn={urn} component={Card} typename={typename} />
      </div>
    ))}
  </div>
);

export default MarketBetCardGroup;
