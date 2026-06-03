import { FunctionComponent } from "react";
import { useVisibilityObserver } from "../../../hooks/useVisibilityObserver.web";
import { ComponentProps } from "./props";
import ConnectedCard from "../../Card";
import Card from "../../Card/Card.web";
import styles from "./FutureRacingCardGroup.web.css";

const FutureRacingCardGroup: FunctionComponent<ComponentProps> = ({ items, urnList, dispatchFetchCards }) => {
  const { observe, visibility } = useVisibilityObserver({
    onFirstShow: (urn) => dispatchFetchCards(urn, urnList),
  });

  return (
    <>
      {items.map((item) => (
        <div className={styles.container} key={item.date}>
          <div className={`typography-h380 ${styles.title}`}>{item.date}</div>
          {item.items?.map(({ urn, typename }) => (
            <div
              key={urn}
              className={styles.separator}
              ref={(node) => {
                observe(node, urn);
              }}
            >
              <ConnectedCard key={urn} urn={urn} typename={typename} component={Card} visible={!!visibility[urn]} />
            </div>
          ))}
        </div>
      ))}
    </>
  );
};

export default FutureRacingCardGroup;
