import { FunctionComponent, memo, useCallback } from "react";

import { SportsbookBetButtonStatus } from "@ppb/the-wall-common/types";
import { SportsbookBetButton } from "@ppb/the-wall-web";
import { ComponentProps } from "./map-to-props-factory";

const MemoizedBetButton: FunctionComponent<{
  label: string;
  disabled: boolean;
  secondaryLabel?: string;
  animated?: boolean;
  status: SportsbookBetButtonStatus;
  onClick: () => void;
}> = memo(({ label, disabled, secondaryLabel, onClick, animated, status }) => (
  <SportsbookBetButton
    disabled={disabled}
    label={label}
    secondaryLabel={secondaryLabel}
    onClick={onClick}
    status={status}
    animated={animated}
  />
));

MemoizedBetButton.displayName = "MemoizedBetButton";

const ObbBetButton: FunctionComponent<ComponentProps> = ({
  cardUrn,
  eventName,
  position,
  quote,
  secondaryLabel,
  legId,
  status,
  animated,
  metadataOverride,
  dispatchAddLegToBetslip,
  onClick,
}) => {
  const handleBetButtonClick = useCallback(() => {
    if (onClick) return onClick();
    return dispatchAddLegToBetslip(legId, cardUrn, eventName, position, metadataOverride);
  }, [legId, cardUrn, eventName, position, metadataOverride, dispatchAddLegToBetslip, onClick]);

  return (
    <MemoizedBetButton
      disabled={!quote || !!quote?.quoteError}
      label={quote?.odds ?? "-"}
      secondaryLabel={secondaryLabel}
      onClick={handleBetButtonClick}
      animated={animated}
      status={status ?? "default"}
    />
  );
};

export default ObbBetButton;
