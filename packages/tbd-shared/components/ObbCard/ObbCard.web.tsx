import { lazy, Fragment, FunctionComponent, Suspense, useMemo } from "react";
import { CardWhiteList, ComponentProps } from "./props";

import { ErrorBoundary } from "../ErrorBoundary/ErrorBoundary";

import styles from "./ObbCard.web.css";
import ObbCardPlaceholder from "./ObbCardPlaceholder.web";

const ConnectedObbPvPCard = lazy(() => import(/* webpackChunkName: "ObbPvPCard" */ "../ObbPvPCard"));
const ObbPvPCard = lazy(() => import(/* webpackChunkName: "ObbPvPCard" */ "../ObbPvPCard/ObbPvPCard.web"));
const ConnectedObbSquadBetCard = lazy(() => import(/* webpackChunkName: "ObbSquadBetCard" */ "../ObbSquadBetCard"));
const ObbSquadBetCard = lazy(
  () => import(/* webpackChunkName: "ObbSquadBetCard" */ "../ObbSquadBetCard/ObbSquadBetCard.web"),
);

const ConnectedObbSquadVsSquadCard = lazy(
  () => import(/* webpackChunkName: "ObbSquadVsSquadCard" */ "../ObbSquadVsSquadCard"),
);
const ObbSquadVsSquadCard = lazy(
  () => import(/* webpackChunkName: "ObbSquadVsSquadCard" */ "../ObbSquadVsSquadCard/ObbSquadVsSquadCard.web"),
);

type ConnectedObbCardsList =
  | typeof ConnectedObbPvPCard
  | typeof ConnectedObbSquadBetCard
  | typeof ConnectedObbSquadVsSquadCard;

const obbCardWhiteList: CardWhiteList<ConnectedObbCardsList> = {
  ObbPvpCard: {
    connected: ConnectedObbPvPCard,
    component: ObbPvPCard,
  },
  ObbSquadBetCard: {
    connected: ConnectedObbSquadBetCard,
    component: ObbSquadBetCard,
  },
  ObbSquadVsSquadCard: {
    connected: ConnectedObbSquadVsSquadCard,
    component: ObbSquadVsSquadCard,
  },
};

const ObbCard: FunctionComponent<ComponentProps> = ({
  urn,
  visible,
  typename,
  isCardLoaded,
  layoutUrn,
  itemIndex,
  cardGroupUrn,
}) => {
  const obbCard = useMemo(() => {
    if (isCardLoaded) {
      const { connected: Connected, component } = obbCardWhiteList[typename];
      return (
        <Connected
          urn={urn}
          component={component}
          visible={visible}
          layoutUrn={layoutUrn}
          itemIndex={itemIndex}
          cardGroupUrn={cardGroupUrn}
        />
      );
    }
    return <ObbCardPlaceholder />;
  }, [cardGroupUrn, isCardLoaded, itemIndex, layoutUrn, typename, urn, visible]);

  return (
    <ErrorBoundary urn={urn}>
      <Fragment key={urn}>
        <Suspense fallback={<ObbCardPlaceholder />}>
          <div className={styles.container}>{obbCard}</div>
        </Suspense>
      </Fragment>
    </ErrorBoundary>
  );
};

export default ObbCard;
