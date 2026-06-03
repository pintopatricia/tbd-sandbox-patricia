import type { JSX } from "react";
import { View } from "react-native";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import { RouteProp, useRoute } from "@react-navigation/native";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import ConnectedMyBetsPage from "../../MyBetsPage";
import MyBetsPage from "../../MyBetsPage/MyBetsPage.native";
import ConnectedReceipt from "../../Receipt";
import Receipt from "../../Receipt/Receipt.native";
import ConnectedRootBetslip from "../../Betslip/RootBetslip";
import { RootBetslip } from "../../Betslip/RootBetslip/RootBetslip.native";

type ParamList = {
  MyBetsScreen: {
    viewLink: ViewLink;
  };
};

function MyBetsScreen(): JSX.Element {
  const route = useRoute<RouteProp<ParamList, "MyBetsScreen">>();
  const { viewUrn } = route?.params?.viewLink ?? undefined;

  return (
    <View {...getTestProps("my-bets-screen", false)}>
      <ConnectedMyBetsPage urn={viewUrn} component={MyBetsPage} />
      <ConnectedRootBetslip component={RootBetslip} />
      <ConnectedReceipt component={Receipt} />
    </View>
  );
}

export default MyBetsScreen;
