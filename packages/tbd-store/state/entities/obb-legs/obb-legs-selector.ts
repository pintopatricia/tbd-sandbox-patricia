import { ParametricSelector, createSelector } from "reselect";
import { ApplicationState } from "../..";
import { ObbLeg, SelectorObbLeg } from "./ObbLegs.types";
import { ObbParticipants } from "../obb-participants/ObbParticipants.types";
import { buildObbLegSelector } from "./builders/obb-selector-leg-builder";

export const buildObbLeg = (obbLeg: ObbLeg, participants: ObbParticipants): SelectorObbLeg | undefined => {
  if (!obbLeg) {
    return undefined;
  }

  return buildObbLegSelector(obbLeg, participants);
};

export const createObbLegByIdSelector = (): ParametricSelector<ApplicationState, string, SelectorObbLeg | undefined> =>
  createSelector(
    [
      (state: ApplicationState, id: string) => state.entities.obbLegs[id],
      (state: ApplicationState) => state.entities.obbParticipants,
    ],
    (obbLeg, participants) => buildObbLeg(obbLeg, participants),
  );
