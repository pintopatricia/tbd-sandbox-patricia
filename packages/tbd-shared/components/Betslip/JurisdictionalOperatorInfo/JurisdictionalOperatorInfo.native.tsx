import { FunctionComponent, JSX } from "react";
import { Caption } from "@ppb/the-wall-native";
import { Jurisdiction } from "@ppb/tbd-store/state/constants";
import { withJurisdiction } from "../withJurisdiction/withJurisdiction";
import { operatorInfoTranslation } from "./JurisdictionalOperatorInfo.helper";

const OperatorInfo: FunctionComponent = (): JSX.Element | null =>
  operatorInfoTranslation ? <Caption>{operatorInfoTranslation}</Caption> : null;

export const JurisdictionalOperatorInfo = withJurisdiction(OperatorInfo, {
  jurisdictions: [Jurisdiction.ITALY, Jurisdiction.SPAIN, Jurisdiction.INTERNATIONAL],
});
