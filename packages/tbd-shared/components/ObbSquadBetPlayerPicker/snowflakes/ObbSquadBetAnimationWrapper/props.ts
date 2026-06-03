import { ReactNode } from "react";

export type ObbSquadBetAnimationWrapperProps = {
  children: ReactNode;
  trigger?: unknown; // triggers animation on change, usually modalParticipants.length
  animationDuration?: number;
};
