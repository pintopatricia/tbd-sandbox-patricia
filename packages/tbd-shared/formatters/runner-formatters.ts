export const formatHandicap = (handicapValue = 0, withSeparator = true): string => {
  if (!handicapValue) {
    return "";
  }
  const formattedHandicap = `${handicapValue > 0 ? "+" : ""}${handicapValue}`;

  return withSeparator ? `(${formattedHandicap})` : `${formattedHandicap}`;
};

export const formatRunnerName = (name: string, handicap = 0, withSeparator = true): string => {
  if (!handicap) {
    return name;
  }

  const formattedHandicap = formatHandicap(handicap, withSeparator);

  return `${name} ${formattedHandicap}`;
};

/**
 * formatHorseInfo
 * @param runnerInfo
 * Transforms uppercase string to lowercase except for the first character of every word "\b\w"
 * and the characters between parenthesis "\(.+?\)"
 *
 * Example
 * input: ELEVATED CITY (USA)
 * output: Elevated City (USA)
 */
export const formatHorseInfo = (runnerInfo: string | undefined): string | undefined =>
  runnerInfo?.toLowerCase().replace(/(\b\w|\(.+?\))/g, (m) => m.toUpperCase());
