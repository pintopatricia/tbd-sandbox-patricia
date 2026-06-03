export type Alignment = "left" | "right" | "center";

export const ALIGNMENT: Record<string, Alignment> = {
  Left: "left",
  Right: "right",
  Center: "center",
} as const;

export const SECTION_TYPE = {
  Generic: "GENERIC",
  Accordion: "ACCORDION",
} as const;
