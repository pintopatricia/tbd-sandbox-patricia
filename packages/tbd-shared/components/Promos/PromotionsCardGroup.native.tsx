import * as React from "react";
import NativeWebView from "../Navigation/screens/NativeWebView.native";
import PromotionsCardGroup from "@ppb/tbd-components-promotions/components/PromotionsCardGroup/view/PromotionsCardGroup.native";
import { useJoinNow } from "@flutter-global/react-native-cet-framework";

type Props = {
  urn: string;
  visible?: boolean;
};

const PromotionsCardGroupWrapper: React.FunctionComponent<Props> = (props) => {
  const joinNow = useJoinNow();

  return <PromotionsCardGroup {...props} joinNow={joinNow} NativeWebView={NativeWebView} />;
};

export default PromotionsCardGroupWrapper;
