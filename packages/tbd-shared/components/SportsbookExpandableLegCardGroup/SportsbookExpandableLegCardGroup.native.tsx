import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { CardTheme } from "@ppb/the-wall-common/types/Card/Card.types";
import { Card, Divider } from "@ppb/the-wall-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { FunctionComponent } from "react";
import { View } from "react-native";
import ConnectedCardGroup from "../CardGroup";
import CardGroup from "../CardGroup/CardGroup.native";
import { ComponentProps } from "./props";
import styles from "./SportsbookExpandableLegCardGroup.native.styles";
import {
  SBK_EXPANDABLE_LEG_CARD_GROUP,
  SBK_EXPANDABLE_LEG_CARD_GROUP_CARDS,
} from "./SportsbookExpandableLegCardGroup.native.selectors";
import useCollapsibleCardToggle from "../../hooks/useCollapsibleCardToggle";

const SportsbookExpandableLegCardGroup: FunctionComponent<ComponentProps> = ({
  labels: { collapsedLabel, expandedLabel },
  cards,
  dispatchToggleAccordionAction,
  isBetPanelOpen,
}) => {
  const { isExpanded, onCollapseToggle } = useCollapsibleCardToggle({
    isBetPanelOpen,
    dispatchToggleAccordionAction,
  });

  const lastCardIndex = cards.length - 1;

  return (
    <>
      {cards?.length && (
        <View {...getTestProps(SBK_EXPANDABLE_LEG_CARD_GROUP, false)}>
          <View style={styles.dividerContainer}>
            <Divider />
          </View>
          <Card
            isCollapsible
            fullWidthContent
            onTitleClick={onCollapseToggle}
            title={isExpanded ? expandedLabel : collapsedLabel}
            startOpen={isBetPanelOpen}
            theme={CardTheme.TERTIARY}
          >
            <View style={styles.aggregatorBody}>
              {cards.map(({ urn, typename }: PartialItem, index) => {
                const cardStyle = [
                  typename === "SportsbookBetLegCardGroup" && styles.legCardGroup,
                  index !== lastCardIndex && styles.legGroupContainerGap,
                ];
                return (
                  <View style={cardStyle} key={urn} {...getTestProps(SBK_EXPANDABLE_LEG_CARD_GROUP_CARDS, false)}>
                    <ConnectedCardGroup urn={urn} component={CardGroup} typename={typename} />
                  </View>
                );
              })}
            </View>
          </Card>
        </View>
      )}
    </>
  );
};

export default SportsbookExpandableLegCardGroup;
