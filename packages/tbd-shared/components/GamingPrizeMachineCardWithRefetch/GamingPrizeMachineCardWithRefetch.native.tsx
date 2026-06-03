import { useCallback, useEffect, useRef } from "react";
import * as React from "react";
import URN from "@ppb/tbd-store/state/layout/URN";
import { getEventRegistry } from "eventemitter3-singleton";
import { useFocusEffect } from "@react-navigation/native";
import GamingPrizeMachineCard from "@ppb/tbd-components-gaming/components/GamingPrizeMachineCard/view/GamingPrizeMachineCard.native";
import { GamingPrizeMachineQuery } from "@ppb/tbd-components-gaming/components/GamingPrizeMachineCard/model/GamingPrizeMachine.graphql";
import { getApolloClient } from "../../apollo-client/client";

const { on } = getEventRegistry();

const GamingPrizeMachineCardWithRefetch: React.FC<{ urn: URN }> = ({ urn }) => {
  const client = getApolloClient();
  const shouldRefetch = useRef(false);

  useEffect(() => {
    on("@@UI/WEBVIEW_SCREEN_CLOSED", () => {
      shouldRefetch.current = true;
    });
  }, [urn]);

  useFocusEffect(
    useCallback(() => {
      if (shouldRefetch.current) {
        shouldRefetch.current = false;
        client.refetchQueries({
          include: [GamingPrizeMachineQuery],
        });
      }
    }, [client]),
  );

  return <GamingPrizeMachineCard urn={urn} />;
};

export default GamingPrizeMachineCardWithRefetch;
