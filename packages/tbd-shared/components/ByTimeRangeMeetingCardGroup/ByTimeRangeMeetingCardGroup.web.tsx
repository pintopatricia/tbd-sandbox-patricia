import { FunctionComponent, useRef } from "react";
import { Image } from "@ppb/the-wall-web";
import styles from "./ByTimeRangeMeetingCardGroup.web.css";
import ConnectedCard from "../Card";
import { ComponentProps } from "./props";
import Card, { isCardImplemented } from "../Card/Card.web";
import useCardGroupItems from "../../hooks/useCardGroupItems";
import { useVisibilityObserver } from "../../hooks/useVisibilityObserver.web";

const ByTimeRangeMeetingCardGroup: FunctionComponent<ComponentProps> = ({
  title,
  icon,
  items: partials,
  dispatchFetchCards,
}) => {
  const items = useCardGroupItems(partials, isCardImplemented);

  const { observe, visibility } = useVisibilityObserver({
    onFirstShow: (urn) => dispatchFetchCards(urn, partials),
  });

  const itemsRef = useRef<{ [key: string]: HTMLDivElement | null }>({});

  if (!items.length) {
    return null;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        {!!(icon?.vector && title) && (
          <div className={styles.icon}>
            <Image alt="" src={icon?.vector} />
          </div>
        )}
        {!!title && <h2 className={styles.title}>{title}</h2>}
      </div>
      <div className={styles.containerItems}>
        {items.map(({ urn, typename }, index) => (
          <div
            key={`${urn}-${index}`}
            ref={(el) => {
              itemsRef.current[index] = el;
              observe(el, urn);
            }}
          >
            <ConnectedCard urn={urn} component={Card} typename={typename} visible={!!visibility[urn]} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ByTimeRangeMeetingCardGroup;
