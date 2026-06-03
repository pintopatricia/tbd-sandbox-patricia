type Image = {
  small?: string;
  medium?: string;
  large?: string;
};

export type RaceViewLinkCardProps = {
  countryFlag?: Image;
  imageAlt?: string;
  onClick: () => void;
  title: string;
  subtitle?: string;
  subtitleLabel?: string;
};
