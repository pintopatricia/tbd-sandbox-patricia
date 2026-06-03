export type InfoButtonOnClick = () => void;

export type PreferenceCardProps = {
  children: React.ReactNode;
  extraContent?: React.ReactNode;
  title?: string;
  hint?: string;
  onInfoButtonClick?: InfoButtonOnClick;
};
