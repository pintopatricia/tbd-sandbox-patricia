/**
 * Data model holding fractional odds for displaying odds on the screen in a fractional format
 */
export type FractionalOdds = {
  numerator: number;
  denominator: number;
};

/**
 * Data model holding decimal and fractional odds to be displayed on the screen, according to use
 * preferences (decimal or fractional format)
 */
export type SportsbookOdds = {
  /** Odds in a decimal format */
  decimal: number;
  /** Odds in a fractional format */
  fractional?: FractionalOdds;
  /** Odds in american format */
  american?: number;
};

export type EachWayOdds = {
  trueOdds?: SportsbookOdds;
  displayDecimal?: number;
  displayFractional?: FractionalOdds;
};
