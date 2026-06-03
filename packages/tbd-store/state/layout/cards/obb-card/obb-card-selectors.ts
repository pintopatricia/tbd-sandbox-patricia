import { createSelector, ParametricSelector } from "reselect";
import { createCardByURNSelector } from "../cards-selectors";
import { ApplicationState } from "../../../ApplicationState.types";
import URN from "../../URN";
import {
  ObbCard,
  ObbCards,
  ObbPositionType,
  SelectorObbCard,
  SelectorSquadBetCardWithModalFields,
  SelectorSquadVsSquadCardWithModalFields,
} from "./ObbCard.types";
import { ObbParticipants } from "../../../entities/obb-participants/ObbParticipants.types";
import { buildObbPvpCard } from "./builders/obb-selector-pvp-card-builder";
import {
  buildObbSquadBetCardSelector,
  buildObbSquadBetCardWithModalFieldsSelector,
} from "./builders/obb-selector-squad-bet-card-builder";
import {
  buildObbSquadVsSquadCardSelector,
  buildObbSquadVsSquadCardWithModalFieldsSelector,
} from "./builders/obb-selector-squad-vs-squad-card-builder";
import { createCardGroupByURNSelector } from "../../cardgroups/cardgroups-selectors";
import { ObbCardGroups } from "../../cardgroups/CardGroup.types";

export const buildObbCard = (obbCard: ObbCard | null, participants: ObbParticipants): SelectorObbCard | undefined => {
  if (!obbCard) {
    return undefined;
  }

  switch (obbCard.typename) {
    case "ObbPvpCard":
      return buildObbPvpCard(obbCard, participants);
    case "ObbSquadBetCard":
      return buildObbSquadBetCardSelector(obbCard, participants);
    case "ObbSquadVsSquadCard":
      return buildObbSquadVsSquadCardSelector(obbCard, participants);
    default: {
      return undefined;
    }
  }
};

export const createObbCardByURNSelector = (): ParametricSelector<
  ApplicationState,
  URN,
  SelectorObbCard | undefined
> => {
  const getObbCardByUrn = createCardByURNSelector<ObbCards, URN>();

  return createSelector(
    [
      (state: ApplicationState, urn: URN) => getObbCardByUrn(state.layouts.cards.obbcards, urn),
      (state: ApplicationState) => state.entities.obbParticipants,
    ],
    (obbCard, participants) => buildObbCard(obbCard, participants),
  );
};

export const createObbSquadBetCardWithModalFieldsByURNSelector = (): ParametricSelector<
  ApplicationState,
  URN,
  SelectorSquadBetCardWithModalFields | undefined
> => {
  const getObbCardByUrn = createCardByURNSelector<ObbCards, URN>();

  return createSelector(
    [
      (state: ApplicationState, urn: URN) => getObbCardByUrn(state.layouts.cards.obbcards, urn),
      (state: ApplicationState) => state.entities.obbParticipants,
    ],
    (obbCard, participants) => {
      if (!obbCard || obbCard.typename !== "ObbSquadBetCard") {
        return undefined;
      }
      return buildObbSquadBetCardWithModalFieldsSelector(obbCard, participants);
    },
  );
};

export const createObbSquadVsSquadCardWithModalFieldsByURNSelector = (): ParametricSelector<
  ApplicationState,
  URN,
  SelectorSquadVsSquadCardWithModalFields | undefined
> => {
  const getObbCardByUrn = createCardByURNSelector<ObbCards, URN>();

  return createSelector(
    [
      (state: ApplicationState, urn: URN) => getObbCardByUrn(state.layouts.cards.obbcards, urn),
      (state: ApplicationState) => state.entities.obbParticipants,
    ],
    (obbCard, participants) => {
      if (!obbCard || obbCard.typename !== "ObbSquadVsSquadCard") {
        return undefined;
      }
      return buildObbSquadVsSquadCardWithModalFieldsSelector(obbCard, participants);
    },
  );
};

export const createObbCardPositionSelector = (): ParametricSelector<
  ApplicationState,
  string,
  ObbPositionType | undefined
> => {
  const getCardGroupByUrn = createCardGroupByURNSelector<ObbCardGroups, URN>();

  return createSelector(
    [
      (state: ApplicationState, obbCardGroupUrn: string) =>
        getCardGroupByUrn(state.layouts.cardgroups.obbcardgroups, obbCardGroupUrn),
      (_: ApplicationState, __: string, layoutUrn: string) => layoutUrn,
      (_: ApplicationState, __: string, ___: string, itemIndex: number) => itemIndex,
    ],
    (obbCardGroup, layoutUrn, itemIndex) => {
      if (!obbCardGroup || !obbCardGroup.sections.length) {
        return undefined;
      }

      let targetSection = null;
      let targetLayoutIndex = -1;

      for (const section of obbCardGroup.sections) {
        const layoutIndex = section.layouts.findIndex((layout) => layout.urn === layoutUrn);

        if (layoutIndex !== -1) {
          targetSection = section;
          targetLayoutIndex = layoutIndex;
          break;
        }
      }

      if (!targetSection || targetLayoutIndex === -1) {
        return undefined;
      }

      let cumulativeVerticalPosition = 0;

      targetSection.layouts.slice(0, targetLayoutIndex).forEach((layout) => {
        if (layout.typename === "ObbCardsStackedLayout") {
          cumulativeVerticalPosition += layout.items.length;
        }

        if (layout.typename === "ObbCardsSwimlaneLayout") {
          cumulativeVerticalPosition += 1;
        }
      });

      const targetLayout = targetSection.layouts[targetLayoutIndex];

      if (targetLayout.typename === "ObbCardsStackedLayout") {
        return {
          horizontalPosition: 1,
          verticalPosition: cumulativeVerticalPosition + itemIndex + 1,
        };
      }

      if (targetLayout.typename === "ObbCardsSwimlaneLayout") {
        return {
          horizontalPosition: itemIndex + 1,
          verticalPosition: cumulativeVerticalPosition + 1,
        };
      }

      return undefined;
    },
  );
};
