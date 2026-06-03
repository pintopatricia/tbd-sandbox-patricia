import { useJoinNow } from "@flutter-global/react-native-cet-framework";
import EditorialPromoCard from "@ppb/tbd-components-promotions/components/EditorialPromoCard/view/EditorialPromoCard.native";
import * as React from "react";

type Props = {
  urn: string;
  visible?: boolean;
};

const EditorialPromoCardWrapper: React.FunctionComponent<Props> = (props) => {
  const joinNow = useJoinNow();

  return <EditorialPromoCard {...props} joinNow={joinNow} />;
};

export default EditorialPromoCardWrapper;
