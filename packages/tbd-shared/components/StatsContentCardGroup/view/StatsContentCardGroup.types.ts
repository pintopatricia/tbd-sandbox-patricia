import { Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

export type Props = {
  urn: string;
  visible?: boolean;
};

export type StatsContentItem = {
  label: string;
  icon: Icons;
  urn: string;
  typename: string;
};
