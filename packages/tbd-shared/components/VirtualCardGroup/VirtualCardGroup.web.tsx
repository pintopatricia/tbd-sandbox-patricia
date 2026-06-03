import { FunctionComponent, useEffect } from "react";
import { useOnIntersect } from "@ppb/the-wall-web";
import { ComponentProps } from "./props";

import { ViewItem } from "../ViewItem/ViewItem.web";
import styles from "./VirtualCardGroup.web.css";

const VirtualCardGroup: FunctionComponent<ComponentProps> = ({
  urn: cardUrn,
  items,
  dispatchVirtualsSubscribe,
  dispatchVirtualsUnsubscribe,
}) => {
  const { isIntersecting, ref } = useOnIntersect<HTMLDivElement>(null);

  useEffect(() => {
    if (isIntersecting) {
      dispatchVirtualsSubscribe(cardUrn);
    } else {
      dispatchVirtualsUnsubscribe();
    }

    return () => {
      dispatchVirtualsUnsubscribe();
    };
  }, [cardUrn, dispatchVirtualsSubscribe, dispatchVirtualsUnsubscribe, isIntersecting]);

  return (
    <div ref={ref} className={styles.container}>
      {items.map(({ urn, typename }) => (
        <section className={styles.cardItem} key={urn}>
          <ViewItem urn={urn} typename={typename} visible={true} />
        </section>
      ))}
    </div>
  );
};

export default VirtualCardGroup;
