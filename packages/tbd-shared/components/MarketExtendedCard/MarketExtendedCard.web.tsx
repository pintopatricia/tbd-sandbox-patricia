import { FunctionComponent } from "react";
import { MarketTemplate } from "@ppb/tbd-store/clients/catalogue/catalogue-response-types";
import ConnectedMarket from "../Market";
import { Market } from "../Market/Market.web";
import { ComponentProps } from "./props";
import styles from "./MarketExtendedCard.web.css";

const MarketExtendedCard: FunctionComponent<ComponentProps> = ({
  title,
  displayRunners,
  cardUrn,
  runnerViewLinks,
  eventViewLink,
  numberOfItemsToDisplay,
  marketPromo,
}) => (
  <div className={styles.container}>
    <ConnectedMarket
      cardUrn={cardUrn}
      displayRunners={displayRunners}
      component={Market}
      runnerViewLinks={runnerViewLinks}
      eventViewLink={eventViewLink}
      template={MarketTemplate.Default}
      numberOfItemsToDisplay={numberOfItemsToDisplay}
      marketPromo={marketPromo}
      title={title}
    />
  </div>
);

export default MarketExtendedCard;
