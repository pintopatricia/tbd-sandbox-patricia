import * as React from "react";
import MiniPromotionCard from "@ppb/tbd-components-promotions/components/LoyaltyPromoCard/view/MiniPromotionCard.native";
import NativeWebView from "../Navigation/screens/NativeWebView.native";

type Props = {
  urn: string;
  visible?: boolean;
};

const MiniPromotionCardWrapper: React.FunctionComponent<Props> = (props) => (
  <MiniPromotionCard {...props} NativeWebView={NativeWebView} />
);

export default MiniPromotionCardWrapper;
