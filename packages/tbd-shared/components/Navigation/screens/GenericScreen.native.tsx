import type { JSX } from "react";
import { View } from "react-native";
import { RouteProp, useIsFocused, useRoute } from "@react-navigation/native";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import SpainSessionWs from "../../SpainSessionWS/SpainSessionWS.native";
import ConnectedSpainSessionWs from "../../SpainSessionWS";
import ConnectedGenericView from "../../GenericView";
import { GenericView } from "../../GenericView/GenericView.native";
import { GenericViewPlaceholder } from "../../GenericView/GenericViewPlaceholder.native";
import ConnectedFloatingContainer from "../../FloatingContainer";
import FloatingContainer from "../../FloatingContainer/FloatingContainer.native";
import ConnectedRootBetslip from "../../Betslip/RootBetslip";
import { RootBetslip } from "../../Betslip/RootBetslip/RootBetslip.native";
import ConnectedReceipt from "../../Receipt";
import Receipt from "../../Receipt/Receipt.native";
import ConnectedRegulatoryHeader from "../../RegulatoryHeader";
import RegulatoryHeader from "../../RegulatoryHeader/RegulatoryHeader.native";
import ConnectedExchangeOnboarding from "../../ExchangeOnboarding";
import { ExchangeOnboarding } from "../../ExchangeOnboarding/ExchangeOnboarding.native";
import PlayerView from "../../PlayerView/view/PlayerView.native";
import styles from "./GenericScreen.native.styles";
import { EntityType } from "@ppb/tbd-urn-codecs";
import ConnectedRaceView from "../../RaceView";
import RaceView from "../../RaceView/RaceView.native";
import RaceMeetingView from "../../RaceMeetingView/components/RaceMeetingView/view/RaceMeetingView.native";

export type SupportedViewType = "GenericScreen" | EntityType.PlayerView | EntityType.RaceView | EntityType.RaceMeetingView;

export const renderView = (urn: string, viewType?: SupportedViewType): JSX.Element => {
  switch (viewType) {
    case EntityType.PlayerView:
      return <PlayerView urn={urn} />;
    case EntityType.RaceMeetingView:
      return <RaceMeetingView urn={urn} />;
    case EntityType.RaceView:
      return <ConnectedRaceView urn={urn} component={RaceView} />;
    default:
      // @ts-expect-error TODO Universal integration with placeholders still break on ts-jest
      return <ConnectedGenericView urn={urn} component={GenericView} placeholder={GenericViewPlaceholder} />;
  }
};

export type ParamList = {
  GenericScreen: {
    viewLink: ViewLink;
    isBetslipAvailable?: boolean;
    isReceiptAvailable?: boolean;
    showRegulatoryHeader?: boolean;
    showNemeOnboarding?: boolean;
    shouldDisplayNotificationForSpain?: boolean;
  };
};

function GenericScreen(): JSX.Element | null {
  const route = useRoute<RouteProp<ParamList, "GenericScreen">>();
  const isFocused = useIsFocused();

  const { viewUrn } = route.params.viewLink;
  const {
    isBetslipAvailable = true,
    isReceiptAvailable = true,
    showRegulatoryHeader = false,
    showNemeOnboarding = true,
    shouldDisplayNotificationForSpain = false,
  } = route.params;

  return (
    <View style={styles.keyboardAvoidingView} {...getTestProps("generic-screen", false)}>
      {showRegulatoryHeader && <ConnectedRegulatoryHeader component={RegulatoryHeader} />}
      {renderView(viewUrn, route.name)}
      <ConnectedFloatingContainer component={FloatingContainer} />
      {isBetslipAvailable && <ConnectedRootBetslip component={RootBetslip} />}
      {isReceiptAvailable && <ConnectedReceipt component={Receipt} />}
      {showNemeOnboarding && <ConnectedExchangeOnboarding component={ExchangeOnboarding} />}
      {isFocused && shouldDisplayNotificationForSpain && <ConnectedSpainSessionWs component={SpainSessionWs} />}
    </View>
  );
}

export default GenericScreen;
