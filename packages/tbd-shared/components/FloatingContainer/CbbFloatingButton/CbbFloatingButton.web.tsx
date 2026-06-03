import type { FunctionComponent } from "react";
import { useEffect, useState } from "react";
import classnames from "classnames";
import SportsbookChatbotInput from "@ppb/tbd-components-sports-betting/components/SportsbookChatbotInput/view/SportsbookChatbotInput.web";
import subscribeEvent from "../../../event-broker/event-subscriber";
import styles from "./CbbFloatingButton.web.css";

const CbbFloatingButton: FunctionComponent<{ betslipHasSelections: boolean; urn: string }> = ({
  betslipHasSelections,
  urn,
}) => {
  const [isChatbotInputActive, setIsChatbotInputActive] = useState(false);

  useEffect(() => {
    subscribeEvent("@@UI/SPORTSBOOK_CHATBOT_INPUT_STATE_CHANGED", ({ state }) => {
      setIsChatbotInputActive(state === "active");
    });
  }, []);

  return (
    <div
      className={classnames(styles.cbbFloatingButton, {
        [styles.withBetslipSelections]: betslipHasSelections,
        [styles.withGradient]: isChatbotInputActive,
        [styles.inactive]: !isChatbotInputActive,
      })}
    >
      <SportsbookChatbotInput urn={urn} />
    </div>
  );
};

export default CbbFloatingButton;
