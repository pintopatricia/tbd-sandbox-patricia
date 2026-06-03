import { ComponentTheme } from "@ppb/the-wall-common/types";

export enum ForbiddenCardSize {
  Default = "Default",
  Small = "Small",
}

export type ForbiddenContentBaseProps = {
  theme?: ComponentTheme;
  size?: ForbiddenCardSize;
};
