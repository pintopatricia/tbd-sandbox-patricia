import { ReactNode } from "react";
import { BetSelectionDetailsCommonProps, FallbackIconType } from "@ppb/the-wall-common/types";
import { BetSelectionDetailsNativeProps } from "@ppb/the-wall-common/types/native";
import type { Region } from "@ppb/the-wall-icons/traps";

export type BetSelectionsHeaderProps = {
  isOpen: boolean;
} & CommonBetSelectionsHeaderProps;

type CommonBetSelectionsHeaderProps = {
  title: string;
  endElement?: ReactNode;
  startElement?: ReactNode;
};

export type BetSelectionsProps = {
  selections: BetSelection[];
  isPlacing?: boolean;
  removeBorderRadius?: boolean;
} & CommonBetSelectionsHeaderProps;

export type BetSelectionsOnSelectionRemove = (id: string, urn: string) => void;

export type BetSelectionsCallbacks = {
  onSelectionRemove?: BetSelectionsOnSelectionRemove;
  onTitleClick?: (isOpen: boolean) => void;
};

export type BetSelectionsViewModel = BetSelectionsProps & BetSelectionsCallbacks;

export type BetSelectionItemProps = {
  selection: BetSelection;
  onSelectionRemove: BetSelectionsOnSelectionRemove | undefined;
  isPlacing: boolean | undefined;
  icon: ReactNode;
};

export type BetSelection = {
  id: string;
  urn: string;
  silkFallbackType?: FallbackIconType;
  racingSport?: number;
  meetingCountry?: Region;
  trap?: string | number;
  icon?: BetSelectionDetailsCommonProps["icon"];
  title: BetSelectionDetailsCommonProps["title"];
  subtitle: BetSelectionDetailsCommonProps["subtitle"];
  odd?: BetSelectionDetailsCommonProps["odd"];
  oddsMovement?: BetSelectionDetailsCommonProps["oddsMovement"];
  hintMessage?: BetSelectionDetailsCommonProps["hintMessage"];
  hintType?: BetSelectionDetailsCommonProps["hintType"];
  is90Min?: BetSelectionDetailsCommonProps["is90Min"];
  selectionTypeIcon?: BetSelectionDetailsCommonProps["selectionTypeIcon"];
  isPushNotificationsUnavailable?: BetSelectionDetailsNativeProps["isPushNotificationsUnavailable"];
};
