/**
 * Returns the power term of a floating point.
 *
 * e.g.:
 * The number 123.45 can be represented as a decimal floating-point number
 * with the integer 12345 as the significand and a 10−2 power term
 *
 * @param {number} value The value to get the power term form
 * @return The number's power term
 */
function getPowerTerm(value: number): number {
  return (value.toString().split(".")[1] || "").length;
}

function getMaxPowerTerm(...numbers: number[]): number {
  const scaleFactors = numbers.map((num) => getPowerTerm(num));
  return Math.max(...scaleFactors);
}

/**
 * The significand is part of a number in scientific notation or a floating-point number
 * consisting of its significant digits
 *
 * @param {number} value The value to get the significand for
 * @param {number} decimalPlaces The number of decimal places of the number
 * @return The number represented as significand
 */
function getSignificand(value: number, decimalPlaces: number): number {
  return parseInt(value.toFixed(decimalPlaces).replace(".", ""), 10);
}

/**
 * Rounds down a number to the specified number of places
 *
 * @param {number} value The value to round
 * @param {number} decimalPlaces The number of decimal places to round to
 * @return A rounded floating point number
 */
function round(value: number, decimalPlaces: number): number {
  return Number(value.toFixed(decimalPlaces));
}

/**
 * Calculates a remainder between two values
 *
 * @param {number} value The value against which to check the remainder
 * @param {number} step The second value to compare against
 * @return A floating point number representing the remainder
 */
function getRemainder(value: number, step: number): number {
  // Since modulus with floating points doesn't work well
  // And also working with whole values by only multiplying with a fixed value, doesn't work well
  // We separate into how a floating point is composed using Significand and a Power Term
  // in order to avoid calculations and errors
  const valueDecimalPlaces = getPowerTerm(value);
  const stepDecimalPlaces = getPowerTerm(step);
  const powerTerm = Math.max(valueDecimalPlaces, stepDecimalPlaces);
  const integerValue = getSignificand(value, powerTerm);
  const integerStep = getSignificand(step, powerTerm);

  return (integerValue % integerStep) / 10 ** powerTerm;
}

function getPreciseAddition(...numbers: number[]): number {
  // Find the maximum number of decimal places in the input numbers
  const scaleFactor = 10 ** getMaxPowerTerm(...numbers);

  // Scale all numbers to integers and sum them
  const scaledSum = numbers.reduce((sum, num) => sum + Math.round(num * scaleFactor), 0);

  // Scale the sum back to the original scale
  return scaledSum / scaleFactor;
}

function getPreciseSubtraction(firstNumber: number, ...numbers: number[]): number {
  // Find the maximum number of decimal places in the input numbers
  const scaleFactor = 10 ** getMaxPowerTerm(firstNumber, ...numbers);
  // Scale all numbers to integers and sub them
  const scaledSub = numbers.reduce((sub, num) => sub - Math.round(num * scaleFactor), firstNumber * scaleFactor);

  // Scale the sum back to the original scale
  return scaledSub / scaleFactor;
}

export { getRemainder, round, getPreciseAddition, getPreciseSubtraction };
