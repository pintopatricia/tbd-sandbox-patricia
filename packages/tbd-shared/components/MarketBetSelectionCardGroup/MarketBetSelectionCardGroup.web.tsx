import { FunctionComponent } from "react";
import { Divider } from "@ppb/the-wall-web";
import { ComponentProps } from "./props";
import ConnectedCard from "../Card";
import Card from "../Card/Card.web";
import styles from "./MarketBetSelectionCardGroup.web.css";

const MarketBetSelectionCardGroup: FunctionComponent<ComponentProps> = ({ items }) => {
  const lastItemIndex = items.length - 1;

  return (
    <div className={styles.marketBetSelectionCardGroup}>
      {items?.map(({ urn: itemURN, typename }, index) => (
        <div className={styles.marketBetSelectionCardGroupItem} key={itemURN}>
          <ConnectedCard key={itemURN} urn={itemURN} component={Card} typename={typename} />
          {lastItemIndex !== index && <Divider />}
        </div>
      ))}
    </div>
  );
};
export default MarketBetSelectionCardGroup;
