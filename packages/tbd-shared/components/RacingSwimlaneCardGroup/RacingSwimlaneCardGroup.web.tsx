import { FunctionComponent, useCallback, useContext, useMemo } from "react";
import { ScrollableSwimlane } from "@ppb/the-wall-web";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import { ViewAllLink } from "@ppb/tbd-store/state/layout/views/ViewAll.types";
import classnames from "classnames";
import styles from "./RacingSwimlaneCardGroup.web.css";
import ConnectedCard from "../Card";
import { ComponentProps } from "./props";
import Card, { isCardImplemented } from "../Card/Card.web";
import { useVisibilityObserver } from "../../hooks/useVisibilityObserver.web";
import { Observe } from "../../hooks/useVisibilityObserver.types";
import useCardGroupItems from "../../hooks/useCardGroupItems";
import { ConfigContext } from "../Config/ConfigContext";
import { useRefreshComponent } from "../../hooks";
import { useSelector } from "react-redux";
import { ApplicationState } from "@ppb/tbd-store/state/ApplicationState.types";
import { RaceStatus } from "@ppb/tbd-store/state/constants";

type ScrollableSwimlaneRenderFnProps = {
  title?: string;
  items: PartialItem[];
  viewAll: ViewAllLink | undefined;
  onClick: () => void;
  observe: Observe;
  isDesktopLayout: boolean;
  visibility: Record<string, boolean | undefined>;
};

const ScrollableSwimlaneRenderFn: FunctionComponent<ScrollableSwimlaneRenderFnProps> = ({
  title,
  items,
  viewAll,
  onClick,
  observe,
  isDesktopLayout,
  visibility,
}) => {
  const swimlaneContentStyle = classnames(styles.swimlaneItemContainer, styles.snap, {
    [styles.extended]: items.length < 2,
  });

  return (
    <ScrollableSwimlane
      title={title}
      snap
      noSpacing
      navLink={viewAll}
      onButtonClick={onClick}
      isDesktopLayout={isDesktopLayout}
    >
      {items.map(({ urn, typename }, index) => (
        <div
          key={`${urn}-${index}`}
          className={swimlaneContentStyle}
          ref={(el) => {
            observe(el, urn);
          }}
        >
          <ConnectedCard urn={urn} component={Card} typename={typename} visible={!!visibility[urn]} />
        </div>
      ))}
    </ScrollableSwimlane>
  );
};

const RacingSwimlaneCardGroup: FunctionComponent<ComponentProps> = ({
  title,
  items: partials,
  cardgroupURN,
  viewAll,
  dispatchFetchCards,
  dispatchPushAction,
  dispatchViewAllTap,
  dispatchFetchCardsAction,
}) => {
  const { isDesktopLayout } = useContext(ConfigContext);

  const { observe, visibility } = useVisibilityObserver({
    onFirstShow: (urn) => dispatchFetchCards(urn, partials),
  });

  // Pull the live race statuses from Redux to enable dynamic filtering of finished
  const races = useSelector((state: ApplicationState) => state.entities.races);
  const raceMarketCards = useSelector((state: ApplicationState) => state.layouts.cards.racemarkets);

  // Dynamically filter out finished races instantly
  const activePartials = useMemo(() => {
    return partials.filter((item) => {
      // Only apply this to Race Market Cards
      if (item.typename !== "RaceMarketCard") return true;

      const card = raceMarketCards?.[item.urn];
      if (!card?.race) return true;

      const currentStatus = races?.[card.race]?.details?.status;

      // Drop the card instantly if the fast poller says it's finished
      if (
        currentStatus === RaceStatus.RESULT ||
        currentStatus === RaceStatus.FINISHED ||
        currentStatus === RaceStatus.ABANDONED ||
        currentStatus === RaceStatus.WEIGHED_IN ||
        currentStatus === RaceStatus.RACE_VOID
      ) {
        return false;
      }

      return true;
    });
  }, [partials, races, raceMarketCards]);

  // Use the filtered array instead of the raw partials!
  const items = useCardGroupItems(activePartials, isCardImplemented);

  useRefreshComponent({
    urn: cardgroupURN,
    refreshAction: () => {
      dispatchFetchCardsAction(cardgroupURN);
    },
    chefComponentName: "RacingSwimlaneCardGroup",
  });

  const onClick = useCallback(() => {
    if (!viewAll) return;
    dispatchViewAllTap({ title, viewAll, cardgroupURN });
    dispatchPushAction(viewAll.viewLink);
  }, [cardgroupURN, dispatchPushAction, dispatchViewAllTap, title, viewAll]);

  if (!items.length) {
    return null;
  }

  return (
    <ScrollableSwimlaneRenderFn
      title={title}
      items={items}
      viewAll={viewAll}
      onClick={onClick}
      observe={observe}
      isDesktopLayout={isDesktopLayout}
      visibility={visibility}
    />
  );
};

export default RacingSwimlaneCardGroup;
