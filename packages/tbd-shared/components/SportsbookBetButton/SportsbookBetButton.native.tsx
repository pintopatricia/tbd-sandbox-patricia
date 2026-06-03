import { FunctionComponent, useCallback, useEffect } from "react";
import { SportsbookBetButton as SportsbookBetButtonComponent } from "@ppb/the-wall-native";
import { ComponentProps } from "./props";
import SportsbookBetButtonPlaceholder from "./SportsbookBetButtonPlaceholder.native";

const SportsbookBetButton: FunctionComponent<ComponentProps> = ({
  runnerUrn,
  cardUrn,
  label,
  secondaryLabel,
  handicapLabel,
  status,
  odds,
  oddsboost,
  dispatchBetPlacement,
  onPotentialBetChange,
  isBetslipCollapsed,
  struckThrough = true,
  toastMessageStatus,
  rounded,
  tall,
  dispatchInactiveBetButtonClickAction,
  animated,
  onPromoClickCallback,
  accessibilityHints,
  accessibilityLabel,
}) => {
  const isSelected = status === "selected";

  const onClick = useCallback(() => {
    if (toastMessageStatus) {
      dispatchInactiveBetButtonClickAction(toastMessageStatus);
    } else if (onPromoClickCallback) {
      onPromoClickCallback();
    } else {
      const bet = { urn: runnerUrn, odds };
      const metadata = { cardUrn, betOriginURL: "" };
      dispatchBetPlacement(bet, metadata);
    }
  }, [
    toastMessageStatus,
    dispatchInactiveBetButtonClickAction,
    onPromoClickCallback,
    runnerUrn,
    odds,
    cardUrn,
    dispatchBetPlacement,
  ]);

  useEffect(() => {
    if (onPotentialBetChange) {
      onPotentialBetChange(isSelected, !!isBetslipCollapsed);
    }
  }, [isSelected, isBetslipCollapsed, onPotentialBetChange]);

  if (!label && status !== "closed") {
    return <SportsbookBetButtonPlaceholder />;
  }

  return (
    <SportsbookBetButtonComponent
      animated={animated}
      onClick={onClick}
      label={label}
      secondaryLabel={secondaryLabel}
      handicapLabel={handicapLabel}
      status={status}
      oddsboost={oddsboost}
      struckThrough={struckThrough}
      rounded={rounded}
      tall={tall}
      accessibilityHints={accessibilityHints}
      accessibilityLabel={accessibilityLabel}
    />
  );
};

export default SportsbookBetButton;
