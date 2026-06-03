import { FunctionComponent, useCallback, useState } from "react";
import { View } from "react-native";
import { Card } from "@ppb/the-wall-native";
import { CardHeaderSize, CardTheme } from "@ppb/the-wall-common/types/Card/Card.types";
import CardGroup from "../CardGroup/CardGroup.native";
import ConnectedCardGroup from "../CardGroup";
import { ComponentProps } from "./props";

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
      expandedLabel,
      collapsedLabel,
    ],
  );

  return (
    <Card
      isCollapsible
      title={headerText}
      theme={CardTheme.TERTIARY}
      size={CardHeaderSize.MEDIUM}
      onTitleClick={handleCollapseToggle}
      startOpen={isOpen}
    >
      <>
        {items?.map(({ urn: itemURN, typename }) => (
          <View key={itemURN}>
            <ConnectedCardGroup key={itemURN} urn={itemURN} component={CardGroup} typename={typename} />
          </View>
        ))}
      </>
    </Card>
  );
};

export default MarketBetExpandableCardGroup;
