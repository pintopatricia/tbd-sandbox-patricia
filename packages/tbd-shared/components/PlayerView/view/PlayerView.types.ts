import { FootballPlayerPosition } from "../../../types/__generated__/graphql";

export type PlayerViewHeader = {
  name: string;
  position?: FootballPlayerPosition;
  shirtNumber?: number;
};
