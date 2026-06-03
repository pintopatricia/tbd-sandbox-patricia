import type { FlipStep } from "./PredictsLoading.types";

export const PREDICTS_LOADING_LABEL = {
  YES: "YES",
  NO: "NO",
} as const;

export const PREDICTS_LOADING_CAPTION_KEY = "I18N.PREDICTS.LOADING";

export const FLIP_SEQUENCE: FlipStep[] = [
  { at: 0, label: PREDICTS_LOADING_LABEL.NO, flipMs: 0 },
  { at: 1200, label: PREDICTS_LOADING_LABEL.YES, flipMs: 800 },
  { at: 2500, label: PREDICTS_LOADING_LABEL.NO, flipMs: 800 },
  { at: 3750, label: PREDICTS_LOADING_LABEL.YES, flipMs: 800 },
  { at: 4900, label: PREDICTS_LOADING_LABEL.NO, flipMs: 800 },
  { at: 6400, label: PREDICTS_LOADING_LABEL.YES, flipMs: 800 },
];

export const INITIAL_LABEL = FLIP_SEQUENCE[0].label;
export const FINAL_LABEL = FLIP_SEQUENCE[FLIP_SEQUENCE.length - 1].label;

const LAST_FLIP = FLIP_SEQUENCE[FLIP_SEQUENCE.length - 1];
export const ANIMATION_TOTAL_MS = LAST_FLIP.at + LAST_FLIP.flipMs;
export const ANIMATION_END_BUFFER_MS = 80;

export const FLIP_BEZIER: [number, number, number, number] = [0.65, 0, 0.35, 1];

export const FADE_OUT_MS = 500;
export const DEFAULT_MIN_DISPLAY_MS = ANIMATION_TOTAL_MS + ANIMATION_END_BUFFER_MS;

export const DOT_BOUNCE_MS = 1200;
export const DOT_RISE_MS = 360;
export const DOT_STAGGER_MS = 200;
