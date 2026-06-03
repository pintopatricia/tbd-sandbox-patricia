import { FunctionComponent, Fragment, Suspense, useMemo } from "react";
import { View } from "react-native";
import { CardWhiteList, ComponentProps } from "./props";
import { ErrorBoundary } from "../ErrorBoundary/ErrorBoundary";

import ConnectedObbPvPCard from "../ObbPvPCard";
import ObbPvPCard from "../ObbPvPCard/ObbPvPCard.native";

import ConnectedObbSquadBetCard from "../ObbSquadBetCard";
import ObbSquadBetCard from "../ObbSquadBetCard/ObbSquadBetCard.native";

import ConnectedObbSquadVsSquadCard from "../ObbSquadVsSquadCard";
import ObbSquadVsSquadCard from "../ObbSquadVsSquadCard/ObbSquadVsSquadCard.native";

import ObbCardPlaceholder from "./ObbCardPlaceholder.native";

type ConnectedObbCardsList =
  | typeof ConnectedObbPvPCard
  | typeof ConnectedObbSquadBetCard
  | typeof ConnectedObbSquadVsSquadCard;
/**
 * This contains the list of Native Visual components for each type of Card
 * They will be added here during the refactor of each of the connected cards
 */
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

const ObbCard: FunctionComponent<ComponentProps> = ({ urn, visible, typename, isCardLoaded }) => {
  const obbCard = useMemo(() => {
    if (isCardLoaded && obbCardWhiteList[typename]) {
      const { connected: Connected, component } = obbCardWhiteList[typename];
      return <Connected urn={urn} component={component} visible={visible} />;
    }
    return <ObbCardPlaceholder />;
  }, [isCardLoaded, typename, urn, visible]);

  return (
    <ErrorBoundary urn={urn}>
      <Fragment key={urn}>
        <Suspense fallback={<ObbCardPlaceholder />}>
          <View>{obbCard}</View>
        </Suspense>
      </Fragment>
    </ErrorBoundary>
  );
};

export default ObbCard;
