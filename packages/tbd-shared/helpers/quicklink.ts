import { LinkItem, RoundCorners } from "@ppb/the-wall-common/types";
import { QuickLink } from "@ppb/tbd-store/state/layout/cards/Card.types";
import {
  CookieConsent,
  RegulatoryLinkItem,
} from "../components/UserProfile/snowflakes/RegulatorySectionsSession/RegulatorySections.types";

export const getQuicklinkRoundCorners = (
  links: QuickLink[] | RegulatoryLinkItem[] | CookieConsent[] | LinkItem[],
  index: number,
): RoundCorners => {
  const isFirst = index === 0;
  const isLast = index === links.length - 1;

  return {
    topLeft: isFirst,
    topRight: isFirst,
    bottomLeft: isLast,
    bottomRight: isLast,
  };
};
