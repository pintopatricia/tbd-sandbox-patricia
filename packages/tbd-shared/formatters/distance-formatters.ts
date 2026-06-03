import { DistanceFormatters } from "./formatters";

export const raceDistance: DistanceFormatters["raceDistance"] = ({ miles, furlongs, yards }) => {
  const formattedMiles = miles && miles > 0 ? `${miles}m ` : "";
  const formattedFurlongs = furlongs && furlongs > 0 ? `${furlongs}f ` : "";
  const formattedYards = yards && yards > 0 ? `${yards}y` : "";
  return `${formattedMiles}${formattedFurlongs}${formattedYards}`.trim();
};
