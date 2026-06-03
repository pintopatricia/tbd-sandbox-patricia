import React, { useEffect, useMemo } from "react";
import type { ReactNode } from "react";
import { View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { Placeholder } from "@ppb/the-wall-native";
import emitEvent from "../../../../../event-broker/event-emitter";
import ConnectedRaceResultsCard from "../../../../RaceResultsCard";
import RaceResultsCard from "../../../../RaceResultsCard/RaceResultsCard.native";
import RaceResultsCardPlaceholder from "../../../../RaceResultsCard/RaceResultsCardPlaceholder.native";
import ConnectedRegulatoryCard from "../../../../RegulatoryCard";
import RegulatoryCard from "../../../../RegulatoryCard/RegulatoryCard.native";
import RegulatoryCardPlaceholder from "../../../../RegulatoryCard/RegulatoryCardPlaceholder.native";
import NavigationTabsListCard from "../../NavigationTabsListCard/view/NavigationTabsListCard.native";
import type { InitialItemsData } from "../../RaceMeetingView/viewmodel/RaceMeetingView.viewmodel";
import type { CardEdge } from "../viewmodel/RaceItemsContent.viewmodel";
import { useRaceItemsContentVM } from "../viewmodel/RaceItemsContent.viewmodel";
import SELECTORS from "./RaceItemsContent.selectors";
import styles from "./RaceItemsContent.native.styles";

export type RaceItemsContentProps = {
  viewUrn: string;
  raceUrn: string | undefined;
  initialItems?: InitialItemsData;
  resultType?: string | null;
  deferQuery?: boolean;
};

const ConnectedPreferenceSingleChoiceCard = React.lazy(
  () => import(/* webpackChunkName: "PreferenceSingleChoiceCard" */ "../../../../PreferenceSingleChoiceCard"),
);
const PreferenceSingleChoiceCard = React.lazy(
  () =>
    import(
      /* webpackChunkName: "PreferenceSingleChoiceCard" */ "../../../../PreferenceSingleChoiceCard/PreferenceSingleChoiceCard.native"
    ),
);

function renderCard(edge: CardEdge, transitioning: boolean): ReactNode {
  const { typename, urn } = edge;
  if (!urn) return null;

  switch (typename) {
    case "NavigationTabsList":
      return <NavigationTabsListCard urn={urn} transitioning={transitioning} />;
    case "RaceResultsCard":
      return (
        <View style={styles.cardPadding}>
          <ConnectedRaceResultsCard
            urn={urn}
            component={RaceResultsCard}
            placeholder={RaceResultsCardPlaceholder}
            visible={true}
          />
        </View>
      );
    case "RegulatoryCard":
      return (
        <ConnectedRegulatoryCard
          urn={urn}
          component={RegulatoryCard}
          placeholder={RegulatoryCardPlaceholder}
          visible={true}
        />
      );
    case "PreferenceSingleChoiceCard":
      return <ConnectedPreferenceSingleChoiceCard urn={urn} component={PreferenceSingleChoiceCard} visible={true} />;
    default:
      return null;
  }
}

const RaceItemsContent: React.FunctionComponent<RaceItemsContentProps> = ({
  viewUrn,
  raceUrn,
  initialItems,
  resultType,
  deferQuery,
}) => {
  const {
    loading,
    transitioning,
    vm: {
      data: { cardEdges },
    },
  } = useRaceItemsContentVM(viewUrn, raceUrn, initialItems, resultType, deferQuery);

  const cardEdgeUrns = useMemo(() => cardEdges.map((edge) => edge.urn).filter(Boolean) as string[], [cardEdges]);

  useEffect(() => {
    if (cardEdgeUrns.length > 0) {
      emitEvent("@@UI/FETCH_CARDS", { itemUrns: cardEdgeUrns });
    }
  }, [cardEdgeUrns]);

  if (loading) {
    return (
      <View {...getTestProps(SELECTORS.CONTENT, false)} style={styles.content}>
        <Placeholder />
      </View>
    );
  }

  return (
    <View {...getTestProps(SELECTORS.CONTENT, false)}>
      {cardEdges.map((edge) => (
        <View key={edge.key}>{renderCard(edge, transitioning)}</View>
      ))}
    </View>
  );
};

export default RaceItemsContent;
