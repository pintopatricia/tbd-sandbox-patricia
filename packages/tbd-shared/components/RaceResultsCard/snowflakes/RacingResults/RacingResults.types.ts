import { AlertProps } from "@ppb/the-wall-common/types";

export type ResultRunner = {
  position?: number;
  positionStatusCode?: string;
  distance?: string;
  saddleCloth: string;
  horseName: string;
  silk?: string;
  draw?: number;
  bspAdvantage?: number;
  jockeyName?: string;
  favouriteLabel?: string;
  trainerName?: string;
  startingPrice: string;
  hasPerformance: boolean;
  isNonRunner: boolean;
};

export enum DnfCodes {
  DNF = "DNF",
  PU = "PU",
  F = "F",
  BD = "BD",
  CO = "CO",
  D = "D",
  R = "R",
  RR = "RR",
  RO = "RO",
  SU = "SU",
  UR = "UR",
  WO = "WO",
}

export type RacingResultsProps = {
  title?: string;
  labels: {
    positionLabel: string;
    distanceLabel: string;
    horseLabel: string;
    startingPriceLabel: string;
    ranLabel: string;
  };
  ranNumber?: number;
  dnfCodes?: { [key in DnfCodes]?: string };
  runners: ResultRunner[];
  statusAlert?: AlertProps;
};
