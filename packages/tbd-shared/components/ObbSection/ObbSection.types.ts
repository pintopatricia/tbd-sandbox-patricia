import type { IconAsset, ObbCardsLayout } from "@ppb/tbd-store/state/layout/cardgroups/CardGroup.types";

export type ObbSectionProps = {
  urn: string;
  title: string;
  icon?: IconAsset;
  isExpanded: boolean;
  layouts: ObbCardsLayout[];
  sectionIndex: number;
  cardGroupUrn: string;
  selectedFilter: string;
  onToggle: (isOpen: boolean) => void;
  handleOnSwimlaneArrowClick?: (direction: "left" | "right", group: string | undefined) => void;
  handleLayoutSelection: (sectionUrn: string, layoutUrn: string) => void;
  onShowMoreClicked: (sectionUrn: string, layoutUrn: string, isOpen: boolean) => void;
};
