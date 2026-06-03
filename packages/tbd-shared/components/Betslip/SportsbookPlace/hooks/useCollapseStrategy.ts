import { useMemo } from "react";
import { BetslipCards } from "../snowflakes/SportsbookPlacePanel/SportsbookPlacePanel.types";

export enum BetslipCollapseStrategy {
  AllOpen = "ALL_OPEN",
  FirstOpen = "FIRST_OPEN",
}

export function useCollapseStrategy(cards: BetslipCards[], strategy: BetslipCollapseStrategy): BetslipCards[] {
  const collapseAwareCards = useMemo(() => {
    const state = { openedCount: 0 };

    return cards.map((card) => ({
      ...card,
      content: card.content.map((cardContent) => {
        const startsOpen =
          strategy === BetslipCollapseStrategy.AllOpen
            ? true
            : !!cardContent.card && !!cardContent.collapsable && state.openedCount === 0;

        if (startsOpen) {
          state.openedCount += 1;
        }

        return {
          ...cardContent,
          startsOpen,
        };
      }),
    }));
  }, [strategy, cards]);

  return collapseAwareCards;
}
