import { FunctionComponent, useCallback, useState } from "react";
import { Card as CardTheWall } from "@ppb/the-wall-web";
import { CardHeaderSize, CardTheme } from "@ppb/the-wall-common/types/Card/Card.types";
import { ComponentProps } from "./props";
import ConnectedCard from "../Card";
import Card from "../Card/Card.web";

const MarketBetExpandableCardGroup: FunctionComponent<ComponentProps> = ({
  items,
  isOpen,
  marketBetCardGroupURN,
  isSettled,
  collapsedLabel,
  expandedLabel,
  dispatchFetchCardsAction,
  dispatchToggleAccordionAction,
}) => {
  const [headerText, setHeaderText] = useState(collapsedLabel);

  const handleCollapseToggle = useCallback(
    (isExpanded: boolean) => {
      setHeaderText(isExpanded ? expandedLabel : collapsedLabel);
      if (isExpanded && !isSettled) {
        dispatchFetchCardsAction(marketBetCardGroupURN);
      }
      dispatchToggleAccordionAction(isExpanded);
    },
    [
      dispatchFetchCardsAction,
      dispatchToggleAccordionAction,
      isSettled,
      marketBetCardGroupURN,
      collapsedLabel,
      expandedLabel,
    ],
  );

  return (
    <CardTheWall
      isCollapsible
      title={headerText}
      theme={CardTheme.TERTIARY}
      size={CardHeaderSize.MEDIUM}
      onTitleClick={handleCollapseToggle}
      startOpen={isOpen}
    >
      <>
        {items?.map(({ urn: itemURN, typename }) => (
          <div key={itemURN}>
            <ConnectedCard key={itemURN} urn={itemURN} component={Card} typename={typename} />
          </div>
        ))}
      </>
    </CardTheWall>
  );
};

export default MarketBetExpandableCardGroup;
