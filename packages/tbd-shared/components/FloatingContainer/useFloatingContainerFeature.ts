import { useEffect, useState } from "react";
import subscribeEvent from "../../event-broker/event-subscriber";

type FloatingContainerFeatureState = { feature: "CBB"; urn: string } | null;

const useFloatingContainerFeature = (): FloatingContainerFeatureState => {
  const [state, setState] = useState<FloatingContainerFeatureState>(null);

  useEffect(() => {
    subscribeEvent("@@UI/SPORTSBOOK_CHATBOT_MOUNTED", ({ urn, isAvailable }) => {
      if (isAvailable) {
        setState({ feature: "CBB", urn });
      }
    });

    subscribeEvent("@@UI/SPORTSBOOK_CHATBOT_UNMOUNTED", () => {
      if (state?.feature === "CBB") {
        setState(null);
      }
    });
  }, [state]);

  return state;
};

export default useFloatingContainerFeature;
