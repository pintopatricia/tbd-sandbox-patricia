import { FunctionComponent } from "react";

import { PlacedBetCardProps } from "../PlacedBetCard/PlacedBetCard.types";
import { PlacedBetCard } from "../PlacedBetCard/PlacedBetCard.web";

export const ExchangeMatchedCard: FunctionComponent<PlacedBetCardProps> = (props) => <PlacedBetCard {...props} />;
