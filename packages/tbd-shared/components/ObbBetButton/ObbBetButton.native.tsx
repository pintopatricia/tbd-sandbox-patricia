import { FunctionComponent, memo, useCallback } from "react";
import * as React from "react";

import { SportsbookBetButtonStatus } from "@ppb/the-wall-common/types";
import { SportsbookBetButton } from "@ppb/the-wall-native";
import { ComponentProps } from "./map-to-props-factory";

const MemoizedBetButton: FunctionComponent<{
  label: string;
  disabled: boolean;
  secondaryLabel?: string;
  animated?: boolean;
  status: SportsbookBetButtonStatus;
  onClick: () => void;
  accessibilityLabel?: string;
  accessibilityHints?: {
    selected: string;
    default: string;
  };
}> = memo(({ label, disabled, secondaryLabel, onClick, animated, status, accessibilityLabel, accessibilityHints }) => (
  <SportsbookBetButton
    disabled={disabled}
    label={label}
    secondaryLabel={secondaryLabel}
    onClick={onClick}
    status={status}
    animated={animated}
    accessibilityLabel={accessibilityLabel}
    accessibilityHints={accessibilityHints}
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
  accessibilityLabel,
  accessibilityHints,
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
      accessibilityLabel={accessibilityLabel}
      accessibilityHints={accessibilityHints}
    />
  );
};

export default React.memo(ObbBetButton);
