import { withStyle } from "@ppb/the-wall-native";
import SwimlaneCardGroupPlaceholder from "../SwimlaneCardGroup/SwimlaneCardGroupPlaceholder.native";

export const FilteredCouponCardGroupPlaceholder = withStyle(
  SwimlaneCardGroupPlaceholder,
  {
    height: 1000,
    width: "100%",
  },
  { withAction: true },
);

export const DefaultPlaceholder = withStyle(SwimlaneCardGroupPlaceholder, { height: 300 });
