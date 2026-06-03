import * as React from "react";
import LoyaltyPromoCard from "@ppb/tbd-components-promotions/components/LoyaltyPromoCard/view/LoyaltyPromoCard.native";
import NativeWebView from "../Navigation/screens/NativeWebView.native";

type Props = {
  urn: string;
  visible?: boolean;
};

const LoyaltyPromoCardWrapper: React.FunctionComponent<Props> = (props) => (
  <LoyaltyPromoCard {...props} NativeWebView={NativeWebView} />
);

export default LoyaltyPromoCardWrapper;
