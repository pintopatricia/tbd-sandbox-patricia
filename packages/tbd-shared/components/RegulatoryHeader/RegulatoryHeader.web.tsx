import { FunctionComponent } from "react";
import { RegulatoryHeader as RegulatoryHeaderComponent } from "./snowflakes/RegulatoryHeader/RegulatoryHeader.web";
import { ComponentProps } from "./props";

const RegulatoryHeader: FunctionComponent<ComponentProps> = ({ regulatorySections }) =>
  regulatorySections?.length ? <RegulatoryHeaderComponent regulatorySections={regulatorySections} /> : null;

export default RegulatoryHeader;
