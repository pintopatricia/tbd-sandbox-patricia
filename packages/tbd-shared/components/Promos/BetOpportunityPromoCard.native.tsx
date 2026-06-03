import { useJoinNow } from "@flutter-global/react-native-cet-framework";
import BetOpportunityPromoCard from "@ppb/tbd-components-promotions/components/BetOpportunityPromoCard/view/BetOpportunityPromoCard.native";
import * as React from "react";

type Props = {
  urn: string;
  visible?: boolean;
};

const BetOpportunityPromoCardWrapper: React.FunctionComponent<Props> = (props) => {
  const joinNow = useJoinNow();

  return <BetOpportunityPromoCard {...props} joinNow={joinNow} />;
};

export default BetOpportunityPromoCardWrapper;
