export enum LogoProduct {
  BETFAIR_EXCHANGE = "BETFAIR_EXCHANGE",
  GAMING = "GAMING",
  NONE = "NONE",
}

export type LogoProps = {
  product?: LogoProduct;
  color?: string;
};
