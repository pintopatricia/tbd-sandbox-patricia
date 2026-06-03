import { ScrollableSwimlane } from "@ppb/the-wall-web";
import { lazy, FunctionComponent, Suspense, useContext } from "react";
import { ComponentProps } from "./props";
import styles from "./SegmentedCardGroup.web.css";
import SegmentedCardGroupPlaceholder from "./SegmentedCardGroupPlaceholder.web";
import SwimlaneCardGroupPlaceholder from "../SwimlaneCardGroup/SwimlaneCardGroupPlaceholder.web";
import { useVisibilityObserver } from "../../hooks/useVisibilityObserver.web";
import { ConfigContext } from "../Config/ConfigContext";

const ConnectedGamingCardGroup = lazy(() => import(/* webpackChunkName: "GamingCardGroup" */ "../GamingCardGroup"));

const GamingCardGroup = lazy(
  () => import(/* webpackChunkName: "GamingCardGroup" */ "../GamingCardGroup/GamingCardGroup.web"),
);

const SegmentedCardGroup: FunctionComponent<ComponentProps> = ({
  segmentedCardGroupUrn,
  zones,
  dispatchFetchCards,
}) => {
  const { observe, visibility } = useVisibilityObserver({
    onFirstShow: (urn) => dispatchFetchCards(urn, zones),
  });
  const { isDesktopLayout } = useContext(ConfigContext);

  return (
    <div className={styles.segmentedCardGroupContainer}>
      <ScrollableSwimlane isDesktopLayout={isDesktopLayout}>
        {zones.map((zone, index) => (
          <div
            key={`${zone}-${index}`}
            className={styles.segmentedCardGroup}
            ref={(node) => {
              observe(node, zone.urn);
            }}
          >
            <Suspense fallback={<SegmentedCardGroupPlaceholder />}>
              <ConnectedGamingCardGroup
                isSegmented={true}
                segmentedCardGroupUrn={segmentedCardGroupUrn}
                urn={zone.urn}
                component={GamingCardGroup}
                placeholder={SwimlaneCardGroupPlaceholder}
                visible={!!visibility[zone.urn]}
              />
            </Suspense>
          </div>
        ))}
      </ScrollableSwimlane>
    </div>
  );
};

export default SegmentedCardGroup;
