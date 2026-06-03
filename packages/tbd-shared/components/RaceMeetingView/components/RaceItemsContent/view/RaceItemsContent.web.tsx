import * as React from "react";
import type { FunctionComponent, ReactNode } from "react";
import { Suspense, useEffect, useMemo } from "react";
import emitEvent from "../../../../../event-broker/event-emitter";
import RaceResultsCardPlaceholder from "../../../../RaceResultsCard/RaceResultsCardPlaceholder.web";
import RegulatoryCardPlaceholder from "../../../../RegulatoryCard/RegulatoryCardPlaceholder.web";
import NavigationTabsListCard from "../../NavigationTabsListCard/view/NavigationTabsListCard.web";
import type { InitialItemsData } from "../../RaceMeetingView/viewmodel/RaceMeetingView.viewmodel";
import type { CardEdge } from "../viewmodel/RaceItemsContent.viewmodel";
import { useRaceItemsContentVM } from "../viewmodel/RaceItemsContent.viewmodel";
import SELECTORS from "./RaceItemsContent.selectors";
import styles from "./RaceItemsContent.web.module.css";
import { Placeholder } from "@ppb/the-wall-web";

const ConnectedRaceResultsCard = React.lazy(
  () => import(/* webpackChunkName: "RaceResultsCard" */ "../../../../RaceResultsCard"),
);
const RaceResultsCard = React.lazy(
  () => import(/* webpackChunkName: "RaceResultsCard" */ "../../../../RaceResultsCard/RaceResultsCard.web"),
);
const ConnectedRegulatoryCard = React.lazy(
  () => import(/* webpackChunkName: "RegulatoryCard" */ "../../../../RegulatoryCard"),
);
const RegulatoryCard = React.lazy(
  () => import(/* webpackChunkName: "RegulatoryCard" */ "../../../../RegulatoryCard/RegulatoryCard.web"),
);
const ConnectedPreferenceSingleChoiceCard = React.lazy(
  () => import(/* webpackChunkName: "PreferenceSingleChoiceCard" */ "../../../../PreferenceSingleChoiceCard"),
);
const PreferenceSingleChoiceCard = React.lazy(
  () =>
    import(
      /* webpackChunkName: "PreferenceSingleChoiceCard" */ "../../../../PreferenceSingleChoiceCard/PreferenceSingleChoiceCard.web"
    ),
);

export type RaceItemsContentProps = {
  viewUrn: string;
  raceUrn: string | undefined;
  initialItems?: InitialItemsData;
  resultType?: string | null;
  deferQuery?: boolean;
};

function renderCard(edge: CardEdge, transitioning: boolean): ReactNode {
  const { typename, urn } = edge;
  if (!urn) return null;

  switch (typename) {
    case "NavigationTabsList":
      return <NavigationTabsListCard urn={urn} transitioning={transitioning} />;
    case "RaceResultsCard":
      return (
        <div className={styles.cardPadding}>
          <Suspense fallback={<RaceResultsCardPlaceholder />}>
            <ConnectedRaceResultsCard
              urn={urn}
              component={RaceResultsCard}
              placeholder={RaceResultsCardPlaceholder}
              visible={true}
            />
          </Suspense>
        </div>
      );
    case "RegulatoryCard":
      return (
        <Suspense fallback={<RegulatoryCardPlaceholder />}>
          <ConnectedRegulatoryCard
            urn={urn}
            component={RegulatoryCard}
            placeholder={RegulatoryCardPlaceholder}
            visible={true}
          />
        </Suspense>
      );
    case "PreferenceSingleChoiceCard":
      return <ConnectedPreferenceSingleChoiceCard urn={urn} component={PreferenceSingleChoiceCard} visible={true} />;
    default:
      return null;
  }
}

const RaceItemsContent: FunctionComponent<RaceItemsContentProps> = ({
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
      <div data-testid={SELECTORS.CONTENT} className={styles.content}>
        <Placeholder />
      </div>
    );
  }

  return (
    <div data-testid={SELECTORS.CONTENT} className={styles.content}>
      {cardEdges.map((edge) => (
        <div key={edge.key}>{renderCard(edge, transitioning)}</div>
      ))}
    </div>
  );
};

export default RaceItemsContent;
