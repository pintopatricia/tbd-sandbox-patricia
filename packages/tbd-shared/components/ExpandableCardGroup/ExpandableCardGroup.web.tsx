import { FunctionComponent, useCallback } from "react";
import classnames from "classnames";
import { Card } from "@ppb/the-wall-web";
import { CardTheme, CardHeaderSize } from "@ppb/the-wall-common/types/Card/Card.types";
import styles from "./ExpandableCardGroup.web.css";
import ConnectedCard from "../Card";
import { ComponentProps } from "./props";
import TBDCard from "../Card/Card.web";
import { useVisibilityObserver } from "../../hooks/useVisibilityObserver.web";

const ExpandableCardGroup: FunctionComponent<ComponentProps> = ({
  urn: cardUrn,
  title,
  items,
  isExpanded = true,
  isExpandable = true,
  dispatchFetchCards,
  dispatchExpandableCardGroupToggle,
}) => {
  const { observe, visibility } = useVisibilityObserver({
    onFirstShow: (urn) => dispatchFetchCards(urn, items),
  });

  const onCollapsibleComponentToggle = useCallback(
    (expanded: boolean) => {
      dispatchExpandableCardGroupToggle(expanded, cardUrn, title);
    },
    [dispatchExpandableCardGroupToggle, cardUrn, title],
  );

  if (!items.length) {
    return <></>;
  }

  const getStyle = (typename: string): string =>
    classnames(styles.expandableCardgroupItem, {
      [styles.highlightedSelection]: ["HighlightedSelectionCard"].includes(typename),
    });

  const expandableCardGroupItems = (
    <>
      {items.map(({ urn: itemUrn, typename }, index) => (
        <div
          key={`${itemUrn}-${index}`}
          className={getStyle(typename)}
          ref={(node) => {
            observe(node, itemUrn);
          }}
        >
          <ConnectedCard urn={itemUrn} component={TBDCard} typename={typename} visible={!!visibility[itemUrn]} />
        </div>
      ))}
    </>
  );

  return (
    <div className={styles.expandableCardgroup}>
      {isExpandable ? (
        <Card
          title={title}
          startOpen={isExpanded}
          onTitleClick={onCollapsibleComponentToggle}
          theme={CardTheme.SECONDARY}
          size={CardHeaderSize.LARGE}
          isCollapsible
          fullWidthContent
        >
          {expandableCardGroupItems}
        </Card>
      ) : (
        <div>
          {title && (
            <div className={styles.headerTitle}>
              <p className={"typography-h380"}>{title}</p>
            </div>
          )}
          {expandableCardGroupItems}
        </div>
      )}
    </div>
  );
};

export default ExpandableCardGroup;
