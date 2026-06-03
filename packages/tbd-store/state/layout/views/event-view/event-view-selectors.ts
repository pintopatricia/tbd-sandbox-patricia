import URN from "../../URN";
import { View, Views } from "../View.types";

export function getViewbyURN(state: Views, urn: URN): View {
  const allViews = Object.values(state).reduce(
    (acc: { [s: string]: View }, viewCategory: { [s: string]: View }) => ({
      ...acc,
      ...viewCategory,
    }),
    {},
  );
  return allViews[urn];
}
