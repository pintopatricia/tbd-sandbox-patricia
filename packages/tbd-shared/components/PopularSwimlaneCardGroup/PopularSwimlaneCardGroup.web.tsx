import { FunctionComponent, useContext } from "react";
import { ScrollableSwimlane } from "@ppb/the-wall-web";
import { PartialItem } from "@ppb/tbd-store/state/layout/views/PartialItem.types";
import classnames from "classnames";
import styles from "./PopularSwimlaneCardGroup.web.css";
import ConnectedCard from "../Card";
import { ComponentProps } from "./props";
import Card, { isCardImplemented } from "../Card/Card.web";
import { useVisibilityObserver } from "../../hooks/useVisibilityObserver.web";
import { Observe } from "../../hooks/useVisibilityObserver.types";
import useCardGroupItems from "../../hooks/useCardGroupItems";
import { ConfigContext } from "../Config/ConfigContext";
import { useRefreshComponent } from "../../hooks";

type ScrollableSwimlaneRenderFnProps = {
  title?: string;
  items: PartialItem[];
  observe: Observe;
  isDesktopLayout: boolean;
  visibility: Record<string, boolean | undefined>;
};

const ScrollableSwimlaneRenderFn: FunctionComponent<ScrollableSwimlaneRenderFnProps> = ({
  title,
  items,
  observe,
  isDesktopLayout,
  visibility,
}) => {
  const swimlaneContentStyle = classnames(styles.swimlaneItemContainer, styles.snap, {
    [styles.extended]: items.length < 2,
  });

  return (
    <ScrollableSwimlane title={title} snap noSpacing isDesktopLayout={isDesktopLayout}>
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

const PopularSwimlaneCardGroup: FunctionComponent<ComponentProps> = ({
  title,
  items: partials,
  cardgroupURN,
  dispatchFetchCards,
  dispatchFetchCardsAction,
}) => {
  const { isDesktopLayout } = useContext(ConfigContext);
  const items = useCardGroupItems(partials, isCardImplemented);

  const { observe, visibility } = useVisibilityObserver({
    onFirstShow: (urn) => dispatchFetchCards(urn, partials),
  });

  useRefreshComponent({
    urn: cardgroupURN,
    refreshAction: () => {
      dispatchFetchCardsAction(cardgroupURN);
    },
    chefComponentName: "PopularSwimlaneCardGroup",
  });

  if (!items.length) {
    return null;
  }

  return (
    <ScrollableSwimlaneRenderFn
      title={title}
      items={items}
      observe={observe}
      isDesktopLayout={isDesktopLayout}
      visibility={visibility}
    />
  );
};

export default PopularSwimlaneCardGroup;
