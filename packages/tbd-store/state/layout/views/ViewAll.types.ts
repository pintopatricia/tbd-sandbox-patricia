import { CardIconTypes } from "../../constants";
import { ViewLink } from "./ViewLink.types";

export type ViewAllLink = {
  label: string;
  icon?: CardIconTypes;
  viewLink: ViewLink;
};
