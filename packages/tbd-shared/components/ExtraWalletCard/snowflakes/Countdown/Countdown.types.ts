export enum CountdownType {
  DEFAULT = "default",
  ALERT = "alert",
}

export type CountdownProps = {
  text: string;
  type: CountdownType;
};
