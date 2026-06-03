export type TimeGroupItem = {
  label: string;
  value: Array<number>;
};

export type TimerProps = {
  label?: string;
  days?: TimeGroupItem;
  hours?: TimeGroupItem;
  minutes?: TimeGroupItem;
};
