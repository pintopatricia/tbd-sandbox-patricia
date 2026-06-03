export type SingleStatElement = {
  color?: string | null;
  value: number | null;
};

export type StatsGroupProps = {
  label?: string;
  secondaryLabel?: string;
  left: SingleStatElement;
  right: SingleStatElement;
  disabled?: boolean;
  placeholder?: boolean;
  maxValue?: number;
};
