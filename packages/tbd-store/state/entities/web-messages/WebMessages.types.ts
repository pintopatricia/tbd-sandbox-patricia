import URN from "../../layout/URN";
import { DynamicModuleState } from "../DynamicModuleState.types";

export type WebMessage = {
  urn: URN;
  title?: string;
  templateHeight?: number;
  templateWidth?: number;
  templateUrl?: string;
};

export type WebMessages = {
  webMessagesList: WebMessage[] | null;
  currentWebMessageIndex: number | null;
};

export type WebMessagesState = WebMessages & DynamicModuleState;
