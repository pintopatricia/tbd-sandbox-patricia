import { createContext, useState, useContext, ReactNode, useCallback, useRef, useMemo } from "react";

import * as React from "react";
import { TaggingAction } from "@ppb/tbd-store/middlewares/tagging-resolvers/AnalyticsConstants";
import { View } from "react-native";

type TooltipCoords = {
  pageY: number;
};

type TooltipContextType = {
  tooltipText: string;
  visibleTooltipId?: string;
  openTooltip: (
    tooltipId: string,
    tooltipText: string,
    closeTooltipTaggingCallback: (cardUrn: string, taggingAction: TaggingAction.CLOSED) => void,
    cardUrn: string,
    coords?: TooltipCoords,
  ) => void;
  closeTooltip: () => void;
  coords?: TooltipCoords; // Native only
  containerRef?: React.RefObject<View | null>; // Native only
};

const TooltipContext = createContext<TooltipContextType | undefined>(undefined);

export const TooltipProvider: React.FunctionComponent<{ children: React.ReactNode }> = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [tooltipText, setTooltipText] = useState<string>("");
  const [visibleTooltipId, setVisibleTooltipId] = useState<string>();
  const [coords, setCoords] = useState<TooltipCoords>();
  const [cardUrn, setCardUrn] = useState<string>();
  const closeTooltipTaggingRef = useRef<(cardUrn: string, taggingAction: TaggingAction.CLOSED) => void>(() => {});

  const containerRef = useRef<View>(null);

  const openTooltip = useCallback(
    (
      tooltipId: string,
      newTooltipText: string,
      closeTooltipTaggingCallback: (cardUrn: string, taggingAction: TaggingAction.CLOSED) => void,
      urn?: string,
      newCoords?: TooltipCoords,
    ) => {
      setCoords(newCoords);
      setTooltipText(newTooltipText);
      setVisibleTooltipId(tooltipId);
      setCardUrn(urn);
      closeTooltipTaggingRef.current = closeTooltipTaggingCallback;
    },
    [],
  );

  const closeTooltip = useCallback(() => {
    setVisibleTooltipId(undefined);
    setCoords(undefined);
    closeTooltipTaggingRef.current(cardUrn || "", TaggingAction.CLOSED);
  }, [cardUrn]);

  const contextValue = useMemo(
    () => ({
      tooltipText,
      visibleTooltipId,
      coords,
      openTooltip,
      closeTooltip,
      containerRef,
    }),
    [tooltipText, visibleTooltipId, coords, openTooltip, closeTooltip, containerRef],
  );

  return <TooltipContext.Provider value={contextValue}>{children}</TooltipContext.Provider>;
};

export const useTooltip = () => {
  const ctx = useContext(TooltipContext);
  if (!ctx) throw new Error("useTooltip must be used within TooltipProvider");
  return ctx;
};
