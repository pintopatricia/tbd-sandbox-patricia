import { Icons } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";

type SupportingContentButtonPress = (buttonId: string, isSelected: boolean) => void;

export type SupportingContentCardGroupItem = {
  label: string;
  icon: Icons;
  urn: string;
  typename: string;
  applyContentStyles: boolean;
};

export type SupportingContentSelectedItem = SupportingContentCardGroupItem | null;

export type SupportingContentCardGroupProps = {
  items: SupportingContentCardGroupItem[];
  visible?: boolean;
  onSupportingContentButtonPress: SupportingContentButtonPress;
};

export type SupportingContentButtonWrapperProps = {
  item: SupportingContentCardGroupItem;
  isSelected: boolean;
  onSupportingContentButtonPress: SupportingContentButtonPress;
  setSelectedItem: (item: SupportingContentSelectedItem) => void;
};
