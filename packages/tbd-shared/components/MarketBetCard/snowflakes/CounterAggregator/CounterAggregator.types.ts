export type CounterAggregatorOnButtonTap = () => void;

export type CounterAggregatorProps = {
  count: number;
  title?: string;
  subtitle?: string;
  buttonText?: string;
  onButtonTap?: CounterAggregatorOnButtonTap;
};
