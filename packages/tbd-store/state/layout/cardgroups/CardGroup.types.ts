import { BasicCard, RaceTimeItemEdge, TranslatableText } from "../cards/Card.types";
import { ViewLink } from "../cards/ViewLink.types";
import { ViewAllLink } from "../views/ViewAll.types";
import { FutureRacingCardGroup, FutureRacingCardGroups } from "./future-racing-cardgroups/FutureRacingCardgroups.types";
import {
  RacesByTimeRangeCardGroup,
  RacesByTimeRangeCardGroups,
} from "./races-by-time-range-cardgroups/RacesByTimeRangeCardGroup.types";
import {
  FilteredCouponCardGroup,
  FilteredCouponCardGroups,
} from "./filtered-coupon-cardgroups/FilteredCouponCardGroups.types";
import URN from "../URN";
import { PartialItem } from "../views/PartialItem.types";
import { SportsbookBet } from "../../betting/sportsbook-bets/SportsbookBet.types";
import { CardGroupLayout, SelectableItemsFilterOptions } from "../../constants";
import { Badge, PackIcon, PebbleCardGroupIcon } from "../../../clients/catalogue/catalogue-response-types";
import { RichText } from "../../entities";
import { NormalizedObbLeg } from "../../../services/catalogue/normalizer/entities/obb-leg/ObbLeg.types";

export type AllCardGroups =
  | SwimlaneCardGroup
  | SegmentedCardGroup
  | ExpandableCardGroup
  | SelectableItemsCardGroup
  | PebbleCardGroup
  | PartialPebbleCardGroup
  | GamingCardGroup
  | FutureRacingCardGroup
  | RacesByTimeRangeCardGroup
  | FilteredCouponCardGroup
  | SwimlaneIndexedCardGroup
  | ByTimeRangeMeetingCardGroup
  | BetCardGroup
  | SportsbookBetLegCardGroup
  | SportsbookExpandableLegCardGroup
  | MarketBetCardGroup
  | MarketBetSelectionCardGroup
  | MarketBetExpandableCardGroup
  | BetSharingCardGroup
  | VirtualCardGroup
  | ExtraWalletCardGroup
  | ObbCardGroup
  | HalfTimeSpecialsSwimlaneCardGroup
  | RacingSwimlaneCardGroup
  | PopularSwimlaneCardGroup
  | ObbCreatedBetsCardGroup
  | PromotionsHubCardGroup
  | ObbOnboardingCardsCardGroup;

export type DisplayNameTranslationKey = {
  translationKey: string;
};

export enum TitleImage {
  ODDSBOOST = "ODDSBOOST",
}
export type Image = {
  vector: string | null;
};

export type BasicCardGroup = {
  items: PartialItem[];
} & BasicCard;

/**
 * Swimlane Card Group - groups cards by URN in a swimlane
 */
export type SwimlaneCardGroup = {
  title?: string;
  titleImage?: TitleImage;
  displayName?: DisplayNameTranslationKey;
  typename: "SwimlaneCardGroup";
  displayMode: DisplayMode;
  defaultLayout?:
    | CardGroupLayout.CARD_LIST
    | CardGroupLayout.COUPON
    | CardGroupLayout.GRID_TWO_COLUMNS
    | CardGroupLayout.GRID_FOUR_COLUMNS;
  layouts?: CardGroupLayout[];
  viewAll?: ViewAllLink;
} & BasicCardGroup;

/**
 * Racing Swimlane Card Group - groups race market cards by URN in a swimlane
 */
export type RacingSwimlaneCardGroup = {
  title?: string;
  displayName?: DisplayNameTranslationKey;
  typename: "RacingSwimlaneCardGroup";
  layouts?: CardGroupLayout[];
  viewAll?: ViewAllLink;
} & BasicCardGroup;

/**
 * Promotions Hub Card Group - groups promotions hub cards by URN
 */
export type PromotionsHubCardGroup = {
  typename: "PromotionsHubCardGroup";
} & BasicCardGroup;

/**
 * Popular Swimlane Card Group - groups popular and popular multiples bet builder cards by URN in a swimlane
 */
export type PopularSwimlaneCardGroup = {
  title?: string;
  displayName?: DisplayNameTranslationKey;
  typename: "PopularSwimlaneCardGroup";
  layouts?: CardGroupLayout[];
} & BasicCardGroup;

/**
 * Half Time Specials Swimlane Card Group - groups cards by URN in a swimlane
 */
export type HalfTimeSpecialsSwimlaneCardGroup = {
  title: string;
  subtitle: string;
  titleImage?: TitleImage;
  displayName?: DisplayNameTranslationKey;
  typename: "HalfTimeSpecialsSwimlaneCardGroup";
  displayMode: DisplayMode;
  layouts?: CardGroupLayout[];
  isDecorated?: boolean;
  isIconSupportingTitle?: boolean;
} & BasicCardGroup;

export type GamingCardGroupType = "DEFAULT" | "RECENTLY_PLAYED" | "CATEGORIES" | "FAVOURITE_GAMES";
export type GameTileSize = "SMALL" | "MEDIUM" | "LARGE";

/**
 * A copy of CardGroup for now, more refactor needs to be done
 */
export type GamingCardGroup = {
  title?: string;
  displayName?: DisplayNameTranslationKey;
  typename: "GamingCardGroup";
  displayMode: DisplayMode;
  cardGroupType: GamingCardGroupType;
  defaultLayout?:
    | CardGroupLayout.CARD_LIST
    | CardGroupLayout.COUPON
    | CardGroupLayout.GRID_TWO_COLUMNS
    | CardGroupLayout.GRID_FOUR_COLUMNS;
  layouts?: CardGroupLayout[];
  viewAll?: ViewAllLink;
  decoration?: string;
  gameTileSize?: GameTileSize;
} & BasicCardGroup;

/**
 * Expandable Card group - groups cards by URN
 */
export type ExpandableCardGroup = {
  title?: string;
  typename: "ExpandableCardGroup";
  isExpanded?: boolean;
  isExpandable?: boolean;
} & BasicCardGroup;

export type DisplayMode = "SWIPEABLE" | "SNAP" | "SCROLLABLE";

/**
 * Bet Card group - groups cards by URN
 */
export type BetCardGroup = {
  typename: "BetCardGroup";
  aggregatorId?: string;
  aggregatorDesc?: string;
} & BasicCardGroup;

/**
 * Bet Sharing Card group
 */
export type BetSharingCardGroup = {
  typename: "BetSharingCardGroup";
  bet: SportsbookBet;
} & BasicCardGroup;

/**
 * Bet Leg Group
 */
export type SportsbookBetLegCardGroup = {
  typename: "SportsbookBetLegCardGroup";
} & BasicCardGroup;

export type SportsbookLotteriesBetLegCardGroup = {
  typename: "SportsbookLotteriesBetLegCardGroup";
} & BasicCardGroup;

/**
 * Expandable Leg Group
 */
export type SportsbookExpandableLegCardGroup = {
  typename: "SportsbookExpandableLegCardGroup";
  isBetPanelOpen: boolean;
} & BasicCardGroup;

export type ByTimeRangeMeetingCardGroup = {
  typename: "ByTimeRangeMeetingCardGroup";
  title?: string;
  displayName?: DisplayNameTranslationKey;
  icon?: Image;
} & BasicCardGroup;

/**
 * Swimlaned Indexed Card group - groups cards by URN and holds a "hint" which represents which index
 * we want to present to the user first. meaning, this type of swimlanes will automatically focus (scroll)
 * the given index into the view port
 */

export type SwimlaneIndexedCardGroup = {
  title?: string;
  titleImage?: TitleImage;
  displayName?: DisplayNameTranslationKey;
  icon?: Image | undefined;
  typename: "SwimlaneIndexedCardGroup";
  displayMode: DisplayMode;
  defaultLayout?:
    | CardGroupLayout.CARD_LIST
    | CardGroupLayout.COUPON
    | CardGroupLayout.GRID_TWO_COLUMNS
    | CardGroupLayout.GRID_FOUR_COLUMNS;
  layouts?: CardGroupLayout[];
  viewAll?: ViewAllLink;
  hint?: number;
} & BasicCardGroup;

export type IconAsset = { id: string; category: string };

export type PebbleCardEdge = {
  name?: string;
  urn: URN;
  typename: string;
};

export type PebbleCardGroup = PartialPebbleCardGroup & {
  selectedItemUrn: string;
  icon?: PebbleCardGroupIcon;
  outerTitle?: TranslatableText;
  viewAll?: ViewAllLink;
  viewOpenBets?: ViewLink;
  items: PebbleCardEdge[];
};

export type PartialPebbleCardGroup = {
  typename: "PebbleCardGroup";
  pebbleExpanded: boolean;
  title?: TranslatableText;
  favouriteMarketsStateURN?: URN;
} & BasicCard;

export type ObbSportEvent = {
  urn: string;
  openDate: string;
  name: string;
  eventId: number;
};

export type FilterTag = {
  label?: string;
  type: string;
};

export type ObbCardGroup = {
  typename: "ObbCardGroup";
  title?: string;
  event: ObbSportEvent;
  info?: string;
  moreInfoLabel?: string;
  bettingWindowOffset: number;
  showFilterTags: boolean;
  filterTags: FilterTag[];
  moreInfoDetails?: Array<RichText | null> | null;
  sections: ObbSection[];
  selectedFilter?: string;
  sectionExpansionOverrideByFilter: Record<string, Record<string, boolean>>;
} & BasicCard;

export type ObbCreatedBetsCardGroup = {
  typename: "ObbCreatedBetsCardGroup";
  title: string;
  headerBadgeLabel?: string;
  headerViewLink?: ViewLink;
} & BasicCardGroup;

export type ObbOnboardingCardParticipant = {
  typename: "ObbFootballPlayer";
  urn: string;
  player: {
    id: string | null;
    name: string | null;
    shirtNumber: number | null;
    position: string | null;
  };
  team: {
    id: string;
    name: string;
    color: string | null;
    crest: { small: string | null; medium: string | null } | null;
    jerseys: { type: string | null; color: string | null; url: string | null }[] | null;
  };
};

export type ObbOnboardingCard = {
  participants: ObbOnboardingCardParticipant[];
  legs: NormalizedObbLeg[];
};

export type ObbOnboardingCardsCardGroup = {
  typename: "ObbOnboardingCardsCardGroup";
  title?: string;
  badgeLabel?: string;
  event: ObbSportEvent;
  onboardingCards: ObbOnboardingCard[];
} & BasicCardGroup;

export type ObbSection = {
  typename: "ObbSection";
  urn: string;
  title: string;
  icon?: IconAsset | null;
  isExpanded: boolean;
  layouts: ObbCardsLayout[];
};

export type ObbCardsLayout = ObbCardsStackedLayout | ObbCardsSwimlaneLayout;

export type ObbCardsStackedLayout = {
  typename: "ObbCardsStackedLayout";
  title?: string;
  badge?: string;
  maxCardsToDisplay?: number;
  isSelected: boolean;
} & BasicCardGroup;

export type ObbCardsSwimlaneLayout = {
  typename: "ObbCardsSwimlaneLayout";
  title?: string;
  badge?: string;
  isSelected: boolean;
} & BasicCardGroup;

/**
 * Segmented Card Group
 */
export type SegmentedCardGroup = {
  typename: "SegmentedCardGroup";
} & BasicCardGroup;

export type SwimlaneCardGroups = {
  [urn: string]: SwimlaneCardGroup;
};

export type HalfTimeSpecialsSwimlaneCardGroups = {
  [urn: string]: HalfTimeSpecialsSwimlaneCardGroup;
};

export type GamingCardGroups = {
  [urn: string]: GamingCardGroup;
};

export type BetCardGroups = {
  [urn: string]: BetCardGroup;
};

export type BetSharingCardGroups = {
  [urn: string]: BetSharingCardGroup;
};

export type PebbleCardGroups = {
  [urn: string]: PebbleCardGroup | PartialPebbleCardGroup;
};

export type SegmentedCardGroups = {
  [urn: string]: SegmentedCardGroup;
};

export type ExpandableCardGroups = {
  [urn: string]: ExpandableCardGroup;
};

export type ByTimeRangeMeetingCardGroups = {
  [urn: string]: ByTimeRangeMeetingCardGroup;
};

export type SwimlaneIndexedCardGroups = {
  [urn: string]: SwimlaneIndexedCardGroup;
};

export type SportsbookBetLegCardGroups = {
  [urn: string]: SportsbookBetLegCardGroup;
};

export type SportsbookLotteriesBetLegCardGroups = {
  [urn: string]: SportsbookLotteriesBetLegCardGroup;
};

export type SportsbookExpandableLegCardGroups = {
  [urn: string]: SportsbookExpandableLegCardGroup;
};

export type ObbCardGroups = {
  [urn: string]: ObbCardGroup;
};

export type ObbCreatedBetsCardGroups = {
  [urn: string]: ObbCreatedBetsCardGroup;
};

export type ObbOnboardingCardsCardGroups = {
  [urn: string]: ObbOnboardingCardsCardGroup;
};

export type SelectableItemsFilter = {
  countries: SelectableItemsFilterOptions[];
  defaultCountry: SelectableItemsFilterOptions;
  selectedOption?: SelectableItemsFilterOptions;
};

export type StatisticsItemEdge = {
  urn: URN;
  typename: string;
};

export type VirtualCardGroupItemEdge = {
  startTime: string;
  urn: URN;
  typename: "VirtualCardGroup";
  isClosed: boolean;
  isDisabled: boolean;
  isHighligted: boolean;
};

export type SelectableItemsCardGroupEdge = RaceTimeItemEdge | StatisticsItemEdge | VirtualCardGroupItemEdge;

export type SelectableItemsCardGroup = {
  title?: string;
  typename: "SelectableItemsCardGroup";
  isHighlighted: boolean;
  items: SelectableItemsCardGroupEdge[];
  filter?: SelectableItemsFilter;
} & BasicCard;

export type VirtualCardGroup = {
  typename: "VirtualCardGroup";
} & BasicCardGroup;

export type VirtualCardGroups = {
  [urn: string]: VirtualCardGroup;
};

export type SelectableItemsCardGroups = {
  [urn: string]: SelectableItemsCardGroup;
};

export type FavoriteSportsPreference = {
  selectedFavoriteSports: URN[];
  sportOptions: URN[];
  urn: URN;
};

export type SportRibbonCardGroup = {
  typename: "SportRibbonCardGroup";
  items: {
    urn: URN;
    typename: string;
    label?: string | null;
    icon?: PackIcon | null;
    viewLink: ViewLink;
    badge?: Badge | null;
    sportId?: number | null;
    title: string;
  }[];
} & BasicCard;

export type SportRibbonCardGroups = {
  [urn: string]: SportRibbonCardGroup;
};

export type MarketBetCardGroup = {
  typename: "MarketBetCardGroup";
} & BasicCardGroup;

export type MarketBetSelectionCardGroup = {
  typename: "MarketBetSelectionCardGroup";
  betCardGroupURN: URN;
  marketBetCardURN: URN;
  marketBetCardGroupURN: URN;
} & BasicCardGroup;

export type MarketBetExpandableCardGroup = {
  typename: "MarketBetExpandableCardGroup";
  isOpen: boolean;
  marketBetCardGroupURN: URN;
} & BasicCardGroup;

export type MarketBetCardGroups = {
  [urn: string]: MarketBetCardGroup;
};

export type MarketBetSelectionCardGroups = {
  [urn: string]: MarketBetSelectionCardGroup;
};

export type MarketBetExpandableCardGroups = {
  [urn: string]: MarketBetExpandableCardGroup;
};

export type ExtraWalletCardGroup = {
  typename: "ExtraWalletCardGroup";
  urn: URN;
  amount: number;
  helpUrl?: string;
  bonusPageUrl?: string;
  items: PartialItem[];
};

export type ExtraWalletCardGroups = {
  [urn: string]: ExtraWalletCardGroup;
};

export type RacingSwimlaneCardGroups = {
  [urn: string]: RacingSwimlaneCardGroup;
};

export type PopularSwimlaneCardGroups = {
  [urn: string]: PopularSwimlaneCardGroup;
};

export type PromotionsHubCardGroups = {
  [urn: string]: PromotionsHubCardGroup;
};

export type CardGroups = {
  betcardgroups: BetCardGroups;
  betsharingcardgroups: BetSharingCardGroups;
  expandablecardgroups: ExpandableCardGroups;
  filteredcouponcardgroups: FilteredCouponCardGroups;
  futureracingcardgroups: FutureRacingCardGroups;
  gamingcardgroups: GamingCardGroups;
  pebblecardgroups: PebbleCardGroups;
  racesbytimerangecardgroups: RacesByTimeRangeCardGroups;
  segmentedcardgroups: SegmentedCardGroups;
  selectableitemscardgroups: SelectableItemsCardGroups;
  sportribboncardgroups: SportRibbonCardGroups;
  sportsbookbetlegcardgroups: SportsbookBetLegCardGroups;
  sportsbookexpandablelegcardgroups: SportsbookExpandableLegCardGroups;
  swimlanecardgroups: SwimlaneCardGroups;
  halftimespecialsswimlanecardgroups: HalfTimeSpecialsSwimlaneCardGroups;
  swimlaneindexedcardgroups: SwimlaneIndexedCardGroups;
  bytimerangemeetingcardgroup: ByTimeRangeMeetingCardGroups;
  marketbetcardgroups: MarketBetCardGroups;
  marketbetselectioncardgroups: MarketBetSelectionCardGroups;
  marketbetexpandablecardgroups: MarketBetExpandableCardGroups;
  virtualcardgroups: VirtualCardGroups;
  extrawalletcardgroups: ExtraWalletCardGroups;
  obbcardgroups: ObbCardGroups;
  racingswimlanecardgroups: RacingSwimlaneCardGroups;
  popularswimlanecardgroups: PopularSwimlaneCardGroups;
  obbcreatedbetscardgroups: ObbCreatedBetsCardGroups;
  promotionshubcardgroups: PromotionsHubCardGroups;
  obbonboardingcardsgroups: ObbOnboardingCardsCardGroups;
};

export { CardGroupLayout, SelectableItemsFilterOptions } from "../../constants";
