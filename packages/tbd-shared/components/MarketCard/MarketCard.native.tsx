import { FunctionComponent } from "react";
import { ComponentProps } from "./props";
import ConnectedMarket from "../Market";
import { Market } from "../Market/Market.native";

const MarketCard: FunctionComponent<ComponentProps> = ({
  title,
  displayRunners,
  cardUrn,
  marketViewLinks,
  runnerViewLinks,
  isRunnerExpandable,
  template,
  numberOfItemsToDisplay,
  marketPromo,
  infoBlurbs,
  visible,
}) => (
  <ConnectedMarket
    title={title}
    cardUrn={cardUrn}
    marketViewLinks={marketViewLinks}
    component={Market}
    runnerViewLinks={runnerViewLinks}
    displayRunners={displayRunners}
    isRunnerExpandable={isRunnerExpandable}
    template={template}
    numberOfItemsToDisplay={numberOfItemsToDisplay}
    marketPromo={marketPromo}
    infoBlurbs={infoBlurbs}
    visible={visible}
  />
);

export default MarketCard;
