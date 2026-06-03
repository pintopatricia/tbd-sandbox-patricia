import type { JSX } from "react";
import { useRef } from "react";
import { ScrollView, View } from "react-native";
import { RouteProp, useRoute, useScrollToTop } from "@react-navigation/native";
import { ViewLink } from "@ppb/tbd-store/state/layout/cards/ViewLink.types";
import { getTestProps } from "@ppb/the-wall-native/helpers/test-props";
import ConnectedBrowsePage from "../../BrowsePage";
import BrowsePage from "../../BrowsePage/BrowsePage.native";
import ConnectedRegulatoryCard from "../../RegulatoryCard";
import RegulatoryCard from "../../RegulatoryCard/RegulatoryCard.native";

type ParamList = {
  BrowseScreen: {
    viewLink: ViewLink;
  };
};

function BrowseScreen(): JSX.Element {
  const ref = useRef<ScrollView>(null);

  useScrollToTop(ref);

  const route = useRoute<RouteProp<ParamList, "BrowseScreen">>();
  const { viewUrn } = route?.params?.viewLink ?? undefined;

  return (
    <>
      <ScrollView ref={ref} keyboardShouldPersistTaps="handled" scrollEventThrottle={16}>
        <View {...getTestProps("browse-screen", false)}>
          <ConnectedBrowsePage urn={viewUrn} component={BrowsePage} />
          <ConnectedRegulatoryCard component={RegulatoryCard} urn={"ppb:tbd:card:regulatory:footer"} />
        </View>
      </ScrollView>
    </>
  );
}

export default BrowseScreen;
