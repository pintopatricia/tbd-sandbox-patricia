import { RegulatorySection } from "../../../UserProfile/snowflakes/RegulatorySectionsSession/RegulatorySections.types";

export type RegulatorySectionsHeaderProps = {
  regulatorySections: RegulatorySection[];
  isFixedHeight?: boolean;
};

export enum Alignment {
  Left = "left",
  Right = "right",
  Center = "center",
}
