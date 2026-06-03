import URN from "../URN";
import { ViewLink } from "./ViewLink.types";
import { BottomBar } from "./bottom-bar/BottomBarCard.types";
import { MyBetsState } from "./MyBets.types";
import { Section } from "./regulatory-sections/RegulatorySections.types";
import { MyAccountInterfaceOpenState } from "./my-account/MyAccount.types";
import { ExchangeSide } from "../../betting/exchange-bets/ExchangeBet.types";
import {
  MarketTemplate,
  Badge,
  BudgetCategory,
  DisplayMode as TargetDisplayMode,
  ExchangeBetOutcome,
  GamingPrizeMachineStateType,
  IconTag,
  MarketPromoSignposting,
  MarketRulesMarketBettingType,
  MarketRulesSectionName,
  PreferenceLayout,
  PromoTheme,
  PromotionContentType,
  PromotionStatus,
  RewardsStatus,
  FootballTeamDetails,
  FootballFixtureForm,
  PackagedLayoutType,
  WalletRestrictions,
  FootballFixture,
  WinAvgOdds,
  PackIcon,
  MarketStat,
} from "../../../clients/catalogue/catalogue-response-types";
import { CardIconTypes, ForbiddenContentType, ImsPromotionErrorCodes, WalletNames } from "../../constants";
import { Product, Competition, SportsbookMarket } from "../../entities";
import type {
  BaseFixture,
  GameWithReleaseDate,
  Hierarchy,
  Isp,
  Receipt,
  RichText,
  WalletDetails,
} from "../../entities";
import { ViewAllLink } from "../views/ViewAll.types";
import { Alignment } from "./regulatory-sections/constants";
import { PartialItem } from "../views/PartialItem.types";
import { ObbCards, ObbPvpCard, ObbSquadBetCard, ObbSquadVsSquadCard } from "./obb-card/ObbCard.types";
import { ObbCreatedBetsCard, ObbCreatedBetsCards } from "./obb-created-bets-card/ObbCreatedBetsCard.types";
import { ObbEventPopularsCard, ObbEventPopularsCards } from "./obb-event-populars-card/ObbEventPopularsCard.types";

/**
 * Bettable cards, cards that allow betting
 */
export type BettableCard =
  | MarketCard
  | VirtualMarketCard
  | RaceMarketCard
  | MarketExtendedCard
  | EventMarketCard
  | HighlightedSelectionCard
  | MatchStatSelectionCard
  | FixtureCard
  | PromotionCard
  | SelectionPromoCard
  | GridCard
  | CorrectScoreCard
  | OutrightMarketListCard
  | MatchStatSelectionCard
  | SportsbookChatbotCard;

export type BenefitsPackageCriteriaType = "SUM_EXCH_SBK" | "EXCH_MARKETS";

export type Card =
  | AccountBannersCard
  | BalanceCard
  | BettableCard
  | BroadcastsCard
  | BroadcastsAndStatisticsCard
  | CompetitionRegionCard
  | CompetitionViewLinkCard
  | ContentSummaryCard
  | EmbeddedContentCard
  | EmbeddedViewCard
  | EventViewLinkCard
  | FixtureCard
  | GameCard
  | GameInfoCard
  | GamingJackpotCard
  | GamingLinkCard
  | GamingPrizeMachineCard
  | StatsPebbleCardGroup
  | StatsContentCardGroup
  | IncidentsCard
  | GamingPlayNewCard
  | StatsFormCard
  | StatsHeadToHeadCard
  | StatsPlayersSeasonStatsCard
  | StatsMatchStatsCard
  | StatsTeamsCard
  | StatsLineupsCard
  | HeadToHeadCard
  | HighlightedSelectionCard
  | ImsPromotionDetailsCard
  | ImsPromotionErrorCard
  | ImsPromotionStateCard
  | ImsPromotionTermsAndConditionsCard
  | LinksCard
  | MarketGraphsCard
  | MarketRulesCard
  | MatchStatSelectionCard
  | MarketViewLinkCard
  | MatchStatsCard
  | MatchTimelineCard
  | PreferenceSingleChoiceCard
  | SelectionPromoCard
  | PromotionCard
  | MiniPromoBannerCard
  | QuickLinksCard
  | RaceDetailsCard
  | RaceMarketCard
  | RaceViewLinkCard
  | RaceViewLinksCard
  | RecentFormCard
  | RewardsCard
  | RunnerInfoCard
  | SportsbookBetCard
  | SportViewLinkCard
  | TeamLineupCard
  | RaceByTimeRangeCard
  | RegulatoryCard
  | ForbiddenContentCard
  | BetLegCard
  | SportsbookBetInfoCard
  | GenericViewLinkCard
  | BudgetLimitsCard
  | CouponHeaderCard
  | RaceResultsCard
  | TimeFormBroadCastsCard
  | GridCard
  | ExpandableMarketCard
  | PartialExpandableMarketCard
  | VirtualEventDetailsCard
  | VirtualMarketCard
  | PopularBetBuilderCard
  | PopularMultiplesBetBuilderCard
  | CorrectScoreCard
  | OutrightMarketListCard
  | EventHeaderCard
  | EventStatsCard
  | MarketBetCard
  | MarketBetSelectionCard
  | SearchBarCard
  | PackagedCreatedBetsCard
  | PriceBoostMultisListCard
  | ExtraWalletCard
  | PriceBoostMultisCard
  | ObbPvpCard
  | ObbSquadBetCard
  | ObbSquadVsSquadCard
  | SelfExclusionCard
  | BlurbCard
  | LottoCard
  | ObbCreatedBetsCard
  | MonterosaContentCard
  | ObbEventPopularsCard
  | SportsbookChatbotCard;

/**
 * Card data model type
 */
export type BasicCard = {
  /** Card unique identifier */
  urn: URN;
};

/**
 * Minimal card metadata for GA4 tracking when card data is not available in Redux (e.g. Apollo-migrated cards)
 */
export type CardTrackingMetadata = {
  cardUrn?: string;
  typename: string;
  title?: string;
  horizontalPosition?: number;
};

export type RunnerViewLinks = {
  [runnerUrn: string]: ViewLink;
};

export type RaceViewLink = {
  viewLink: ViewLink;
  race: URN;
  marketPromo?: MarketPromoSignposting;
};

export type MeetingViewLink = {
  viewLink: ViewLink;
  meeting: URN;
};

export type QuickLink = {
  label: string;
  viewLink: ViewLink;
  target?: string | null;
  icon: string | null;
};

export type DisplayName = {
  name?: string;
  translationKey?: string;
};

export type PromotionTermsAndConditions = {
  summary: string | null;
  url?: string;
  label?: DisplayName | null;
};

export type PromotionNavigationAction = {
  label: string;
  viewLink: ViewLink;
};

export type PromotionAddToBetslipAction = {
  market: {
    urn: URN;
  };
  runner: {
    selectionId: number;
    handicap: number;
    runnerURN: string;
  };
  displayPreviousOdd: boolean;
};

export type PromotionBackgroundImage = {
  url: string;
  width: number | null;
  height: number | null;
  tag?: string | null;
};

export type Dimension = {
  width: number;
  height: number;
};
export type PrismicImage = {
  url: string;
  alt: string | null;
  dimensions: Dimension;
};

export type PrizeMachineThemeImages = {
  topLeftImage: PrismicImage | null;
  bottomLeftImage: PrismicImage | null;
  bottomRightImage: PrismicImage | null;
};

export type PromotionAction = PromotionNavigationAction | PromotionAddToBetslipAction;

export type PromotionCard = {
  action: PromotionAction;
  backgroundImage: (PromotionBackgroundImage | null)[];
  promotionName: string | null;
  headline: string | null;
  subHeadline: string | null;
  strapline: string | null;
  promotionContentType: PromotionContentType;
  promoTypeLabel?: string;
  promotionTitle: string | null;
  termsAndConditions: PromotionTermsAndConditions | null;
  typename: "PromotionCard";
  isImsPromo: boolean | null;
  introLine: string | null;
  endDate: string | null;
  optInState: PromotionStatus | null;
  tags: (string | null)[] | null;
  hasBetfairBoost: boolean;
} & BasicCard;

export type LabeledLink = {
  label: DisplayName;
  viewLink: ViewLink;
};

export type PromoState = {
  label?: DisplayName | null;
  link?: LabeledLink | null;
  optInState?: PromotionStatus;
};

export type LoyaltyPromotion = {
  urn: URN;
  name: string | null;
  title: string | null;
  state: PromoState | null;
  termsAndConditions: PromoTermsAndConditions | null;
  promoImage?: PromoImage;
};

export type MiniPromoBannerCard = {
  loyaltyPromotion: URN;
  theme: PromoTheme;
  typename: "MiniPromoBannerCard";
} & BasicCard;

export type PromoImage = {
  url: string;
};

export type PromoTermsAndConditions = {
  label?: DisplayName;
  viewLink?: ViewLink;
  summary?: string;
};

export type PromoNavigationAction = {
  typename: "PromoNavigationAction";
  label: DisplayName;
  viewLink: ViewLink;
};

export type PromoAddToBetslipAction = {
  typename: "PromotionAddToBetslipAction";
  marketUrn: string;
  runnerUrn: string;
};

export type PromoAddToBetslipAndNavigateAction = Omit<PromoNavigationAction, "typename" | "label"> &
  Omit<PromoAddToBetslipAction, "typename"> & {
    typename: "PromotionAddToBetslipAndNavigateAction";
  };

export type PromoAddBettingOpportunityAction = {
  typename: "PromotionAddBettingOpportunityAction";
  opportunityUrn: URN;
  viewLink?: ViewLink;
};

export type PromoTag = IconTag | string;

export type PromoCard = {
  theme: PromoTheme;
  title: string;
  subTitle?: string;
  termsAndConditions?: PromoTermsAndConditions;
};

export type SelectionPromoCard = {
  typename: "SelectionPromoCard";
  action: PromoAddToBetslipAction | (Omit<PromoAddToBetslipAndNavigateAction, "viewLink"> & { viewLink?: ViewLink });
  tag?: PromoTag;
  image?: PromoImage;
} & PromoCard &
  BasicCard;

export type SelfExclusionCard = {
  typename: "SelfExclusionCard";
  text: DisplayName;
} & BasicCard;

export type MarketBlurbLink = {
  text: string;
  url: string;
  displayMode?: TargetDisplayMode | null;
};

export type MarketBlurb = {
  title: string;
  description?: string;
  isExpanded?: boolean;
};

export type MarketBlurbPromotion = MarketBlurb & {
  signposting: MarketPromoSignposting;
};

export type MarketBlurbInfo = MarketBlurb & {
  signposting: "MARKET_RULES";
  link?: MarketBlurbLink;
};

export type BlurbCard = {
  urn: URN;
  typename: "BlurbCard";
  blurb: MarketBlurbInfo;
};

export type Red7Scoreboard = { fullURL: string | null; origin: string | null } | null;

/**
 * The Market card.
 */
export type MarketCard = {
  typename: "MarketCard";
  /** Market view links */
  viewLinks: ViewLink[];
  /** Market graphs links */
  marketGraphsViewLink?: ViewLink;
  /** title The market card text */
  title?: string;
  /** Represents runners to display */
  displayRunners: DisplayRunners;
  /** The currently selected market tab */
  selectedMarketTab?: Product;
  /** Runner view links */
  runnerViewLinks?: RunnerViewLinks;
  /** whether runner details should be expandable */
  isRunnerExpandable?: boolean;
  /** Market Rules */
  marketRulesViewLink?: ViewLink;
  /** Market template */
  template: MarketTemplate;
  /** Number of Items to Display */
  numberOfItemsToDisplay?: number;
  /** Market promotion (Extra places and Money Back) */
  marketPromo?: MarketBlurbPromotion;
  /** Informative blurbs */
  infoBlurbs?: MarketBlurbInfo[];
  /** Player to get FootballFixture  */
  firstPlayer?: FootballPlayerFixtureContextURN;
  /** Market Players */
  players?: FootballPlayerFixtureContextURN[];
  /** Market stat */
  stat?: MarketStat;
} & BasicCard;

/**
 * The Race Market card.
 */
export type RaceMarketCard = {
  typename: "RaceMarketCard";
  runnerViewLinks?: RunnerViewLinks;
  /** Race view link */
  raceViewLink?: ViewLink;
  displayRunners: DisplayRunners;
  numberOfRunners: number;
  /** race URN */
  race: URN;
  /** The currently selected market tab */
  selectedMarketTab?: Product;
  /** the race market title */
  title: string;
  /** Market Rules */
  marketRulesViewLink?: ViewLink;
  /** whether runner details should be expandable */
  isRunnerExpandable?: boolean;
  /** Market promotion (Extra places and Money Back) */
  marketPromo?: MarketBlurbPromotion;
  /** Informative blurbs */
  infoBlurbs?: MarketBlurbInfo[];
} & BasicCard;

/**
 * The Race Results Card
 */
export type RaceResultsCard = {
  typename: "RaceResultsCard";
  /** race URN */
  race: URN;
} & BasicCard;

export type RegulatoryCard = {
  typename: "RegulatoryCard";
  sections: Section[];
} & BasicCard;

export type RaceDetailsCard = {
  typename: "RaceDetailsCard";
  urn: URN;
  race: URN;
  numberOfRunners: number;
  raceClass: number | null;
  showMeetingInfo: boolean;
  raceViewLink: ViewLink | null;
  availableToSubscribe: boolean;
};

export type TimeFormBroadCastsCard = {
  typename: "TimeFormBroadCastsCard";
  race?: URN;
  broadcasts?: Broadcasts;
  raceToSubscribe?: URN;
  availableToSubscribe: boolean;
} & BasicCard;

export type RaceViewLinksCard = {
  typename: "RaceViewLinksCard";
  /** Race view links */
  raceViewLinks: RaceViewLink[];
  /** The selected race */
  race: URN;
} & BasicCard;

export type RaceViewLinkCard = {
  typename: "RaceViewLinkCard";
  viewLink: ViewLink;
  race: URN;
} & BasicCard;

export type RaceByTimeRangeCard = {
  typename: "RaceByTimeRangeCard";
  viewLink: ViewLink;
  startTime: string;
  race: URN;
  marketPromo?: MarketPromoSignposting;
  winner?: string;
  winnerIsp?: Isp;
} & BasicCard;

export type DisplayRunnersDefinition = {
  market: URN;
  runners: {
    urn: URN;
    participantId?: string | null;
  }[];
};

export type DisplayRunners = {
  exchange?: DisplayRunnersDefinition;
  sportsbook?: DisplayRunnersDefinition;
};

export type TabLink = {
  label: string;
  icon?: PackIcon;
  tabViewLink: ViewLink;
};

/**
 * The Market Extended card.
 */
export type MarketExtendedCard = {
  typename: "MarketExtendedCard";
  /** Market view links */
  viewLinks: ViewLink[];
  /** Market graphs links */
  marketGraphsViewLink?: ViewLink;
  /** title The market card text */
  title?: string;
  /** Represents the hierarchy of the markets within the card. E.g.: Race and Meeting for a racing related markets */
  marketsHierarchy?: Hierarchy; // TODO: remove optional after BFF send hierarchy
  displayRunners: DisplayRunners;
  /** The currently selected market tab */
  selectedMarketTab?: Product;
  /** the cashout quotes */
  cashoutQuotes: CashoutQuotes;
  /** Runner view links */
  runnerViewLinks?: RunnerViewLinks;
  /** whether runner details should be expandable */
  isRunnerExpandable?: boolean;
  /** Market Rules */
  marketRulesViewLink?: ViewLink;
  /** Race view link */
  raceViewLink?: ViewLink;
  /** Number of Items to Display */
  numberOfItemsToDisplay?: number;
  /** Market promotion (Extra places and Money Back) */
  marketPromo?: MarketBlurbPromotion;
} & BasicCard;

/**
 * The Event Market card.
 */
export type EventMarketCard = {
  typename: "EventMarketCard";
  sportevent: URN;
  statsPebbleURN?: URN;
  fixture: URN | BaseFixture;
  competition?: URN;
  eventViewLink: ViewLink;
  marketGraphsViewLink?: ViewLink;
  runnerViewLinks: RunnerViewLinks;
  title: string;
  displayRunners: DisplayRunners;
  /** The currently selected market tab */
  selectedMarketTab?: Product;
  videoAvailable: boolean;
  isSuperSubEligible: boolean;
  /** Market promotion (Extra places and Money Back) */
  marketPromo?: MarketBlurbPromotion;
  tabLink?: TabLink;
} & BasicCard;

export type Broadcasts = {
  dataVizUrl: string | null;
  liveVideoUrl: string | null;
};

/**
 * The Fixture Card
 */
export type FixtureCard = {
  typename: "FixtureCard";
  fixture: URN | BaseFixture;
  eventViewLink: ViewLink | null;
  sportevent: URN;
  availableToSubscribe: boolean;
  red7Scoreboard: Red7Scoreboard;
} & BasicCard;

/**
 * The Event Header Card
 */
export type EventHeaderCard = {
  typename: "EventHeaderCard";
  title: string;
  subtitle?: string;
  tertiaryTitle?: string;
  sportId?: string;
  date?: string;
} & BasicCard;

export type BroadcastsCard = {
  typename: "BroadcastsCard";
  broadcasts: Broadcasts;
  isCollapsed: boolean;
} & BasicCard;

export type BroadcastsAndStatisticsCard = {
  typename: "BroadcastsAndStatisticsCard";
  sportevent: URN;
  broadcasts?: Broadcasts;
  isCollapsed?: boolean;
  statisticsViewLink?: ViewLink;
} & BasicCard;

export type HeadToHeadCard = {
  typename: "HeadToHeadCard";
  fixture: URN;
} & BasicCard;

export type RecentFormCard = {
  typename: "TeamFormCard";
  fixture: URN;
} & BasicCard;

export type RunnerInfoCard = {
  typename: "RunnerInfoCard";
  urn: URN;
  raceRunner: URN;
} & BasicCard;

export type TeamLineupCard = {
  typename: "TeamLineupCard";
  fixture: URN;
} & BasicCard;

export type MatchTimelineCard = {
  typename: "MatchTimelineCard";
  fixture: URN;
} & BasicCard;

export type MatchStatsCard = {
  typename: "MatchStatsCard";
  fixture: URN;
} & BasicCard;

export type EventStatsCard = {
  typename: "EventStatsCard";
  matchStatsUrl: string;
} & BasicCard;

export type GameCard = {
  typename: "GameCard";
  game: URN;
} & BasicCard;

export type GameInfoCard = {
  typename: "GameInfoCard";
  game: URN;
} & BasicCard;

export type WalletDetailsKeys = keyof WalletDetails;

export type WalletSign = "+" | "-";

export type WalletAggregationRule = {
  wallet?: WalletNames;
  field?: WalletDetailsKeys;
  sign?: WalletSign;
};

export type WalletNameAndRule = {
  walletName?: string;
  hideIfZero?: boolean;
  aggregationRules?: WalletAggregationRule[];
  withCurrency: boolean;
};

export type WalletSection = {
  sectionName?: string;
  sectionNameLabel?: string;
  sectionKey?: string;
  walletsNamesAndRules: WalletNameAndRule[];
};

type MenuSectionItem = {
  text: string;
  viewLink: ViewLink;
  target?: string;
  alignment: Alignment;
};

export type MenuSection = {
  title?: string;
  sectionType: string;
  sectionLabel: string;
  items: MenuSectionItem[];
};

export type BenefitAccess = {
  type: string | null;
  accessLevel: string | null;
};

export type Amount = {
  type: string | null;
  value: string | null;
};

export type ValueLookup = {
  maxAmount: Amount | null;
  quantity: Amount | null;
  size: number | null;
};

export type Benefits = {
  hidden: boolean | null;
  type: string | null;
  accessLevel: string | null;
  valueLookup: ValueLookup | null;
};

export type BenefitsPackageSection = {
  commissionRate: number | null;
  requiredMarketBets: number | null;
  packageLevel: string | null;
  benefits: Benefits[] | null;
  criteriaType: BenefitsPackageCriteriaType | null;
  excludedBenefits: BenefitAccess[] | null;
};

export type BenefitsPackages = {
  rewardsStatus: RewardsStatus;
  lastMonthTradedMarkets: number | null;
  currentMonthTradedMarkets: number | null;
  currentMonth: string | null;
  nextMonth: string | null;
  qualifiedBenefitsPackage: BenefitsPackageSection | null;
  chosenBenefitsPackage: BenefitsPackageSection | null;
  availablePackages: BenefitsPackageSection[] | null;
};

export type BalanceCard = {
  typename: "BalanceCard";
  wasWallets: WalletNames[];
  walletSections: WalletSection[];
} & BasicCard;

export type LinksCard = {
  typename: "LinksCard";
  title?: string;
  sections: MenuSection[];
} & BasicCard;

export type BannerAddressInfo = {
  addressLabel?: string | null;
  postcodeLabel?: string | null;
  jumioAddressStreetName?: string | null;
  jumioAddressCity?: string | null;
  jumioAddressProvince?: string | null;
};

export type BannerFormContent = {
  addressInfo?: BannerAddressInfo | null;
};

export type BannerContactUsInfo = {
  link?: string | null;
  label?: string | null;
};

export type BannerBodyContent = {
  text?: string | null;
  items?: (string | null)[] | null;
  formContent?: BannerFormContent | null;
  contactUsInfo?: BannerContactUsInfo | null;
};

export type BannerInfo = {
  title?: string | null;
  bodyContent?: BannerBodyContent | null;
};

export type MinimizedBannerInfo = {
  bodyText?: string | null;
};

export type ReducedBannerCTA = {
  label?: string | null;
  gaLabel?: string | null;
  minimizedLabel?: string | null;
  type?: string | null;
  buttonType?: string | null;
  path?: string | null;
  url?: string | null;
  target?: string | null;
  action?: string | null;
  data?: string | null;
};

export type AccountBannerOnError = {
  index: number;
  bannerInfo?: BannerInfo | null;
  minimizedBannerInfo?: MinimizedBannerInfo | null;
  bannerActions?: ReducedBannerCTA[] | null;
  isMinimized?: boolean | null;
  priority?: string | null;
  useCase?: string | null;
  flow?: string | null;
  template?: string | null;
  attentionLevel?: string | null;
  maxDisplays?: number | null;
  version?: number | null;
  isClosable?: boolean | null;
};

export type BannerCTAFinalize = {
  onErrorBanner?: AccountBannerOnError | null;
};

export type BannerCTA = {
  label?: string | null;
  gaLabel?: string | null;
  minimizedLabel?: string | null;
  type?: string | null;
  buttonType?: string | null;
  path?: string | null;
  url?: string | null;
  target?: string | null;
  action?: string | null;
  data?: string | null;
  actionFinalize?: BannerCTAFinalize | null;
};

export type BannerDetails = {
  index: number;
  bannerInfo?: BannerInfo | null;
  minimizedBannerInfo?: MinimizedBannerInfo | null;
  bannerActions?: BannerCTA[] | null;
  isMinimized?: boolean | null;
  priority?: string | null;
  useCase?: string | null;
  flow?: string | null;
  template?: string | null;
  attentionLevel?: string | null;
  maxDisplays?: number | null;
  version?: number | null;
  isClosable?: boolean | null;
  bannerType?: string | null;
};

export type RewardsCard = {
  typename: "RewardsCard";
  benefitsPackages: BenefitsPackages;
} & BasicCard;

export type AccountBannersCard = {
  typename: "AccountBannersCard";
  bannerDetails: BannerDetails[];
  currentBanner: BannerDetails | AccountBannerOnError | null;
} & BasicCard;

export type LinksCards = {
  [urn: string]: LinksCard;
};

export type BalanceCards = {
  [urn: string]: BalanceCard;
};

export type RewardsCards = {
  [urn: string]: RewardsCard;
};

export type BlurbCards = {
  [urn: string]: BlurbCard;
};

export type LottoCard = {
  typename: "LottoCard";
  selectedLottoPebble: string | null;
  showCompetitionName: boolean;
  competition: Competition;
  lottoMarkets: SportsbookMarket[];
  marketIds: string[];
  winAvgOdds?: WinAvgOdds;
} & BasicCard;

export type GamingLinkCard = {
  typename: "GamingLinkCard";
  games: GameWithReleaseDate[];
  link: ViewAllLink;
} & BasicCard;

export type StatsFormCard = {
  typename: "StatsFormCard";
  home: FootballTeamDetails;
  away: FootballTeamDetails;
  recentForm: FootballFixtureForm;
  fixture: FootballFixture;
} & BasicCard;

export type StatsHeadToHeadCard = {
  typename: "StatsHeadToHeadCard";
  head2head: FootballFixtureForm;
  fixture: FootballFixture;
} & BasicCard;

export type StatsPlayersSeasonStatsCard = {
  typename: "StatsPlayersSeasonStatsCard";
  fixture: URN;
} & BasicCard;

export type StatsMatchStatsCard = {
  typename: "StatsMatchStatsCard";
  fixture: FootballFixture;
} & BasicCard;

export type StatsTeamsCard = {
  typename: "StatsTeamsCard";
  fixture: FootballFixture;
} & BasicCard;

export type StatsLineupsCard = {
  typename: "StatsLineupsCard";
  fixture: URN;
} & BasicCard;

export type GamingPrizeMachineCard = {
  typename: "GamingPrizeMachineCard";
  placementId: string;
  completed: boolean;
  redirectUrl: string | null;
  jackpotAmount: number | null;
  jackpotState: GamingPrizeMachineStateType | null;
  activeTitle: string | null;
  ctaLabel: string | null;
  themeImages: PrizeMachineThemeImages | null;
  displayJackpotWinnersPostPlayWidget: boolean;
  guaranteedPrize: boolean;
} & BasicCard;

export type StatsPebbleCardGroup = {
  typename: "StatsPebbleCardGroup";
} & BasicCard;

export type StatsContentCardGroup = {
  typename: "StatsContentCardGroup";
} & BasicCard;

export type IncidentsCard = {
  typename: "IncidentsCard";
} & BasicCard;

export type GamingPlayNewCard = {
  typename: "GamingPlayNewCard";
  title: string;
  subtitle: string | null;
  backgroundImage: (PromotionBackgroundImage | null)[];
  logoImage: (PromotionBackgroundImage | null)[];
  termsAndConditions: PromotionTermsAndConditions | null;
  endDate: string | null;
  optInState: PromotionStatus | null;
  tags: (string | null)[] | null;
} & BasicCard;

export type GamingPlayNewCards = {
  [urn: string]: GamingPlayNewCard;
};

export type AccountBannersCards = {
  [urn: string]: AccountBannersCard;
};

export type GamingJackpotCard = {
  typename: "GamingJackpotCard";
  name: string;
  logo: string;
  jackpots: URN[];
} & BasicCard;
/**
 * Quick Links card
 */
export type QuickLinksCard = {
  typename: "QuickLinksCard";
  accordionTitle?: string | null;
  accordionExpanded?: boolean | null;
  title?: string | null;
  label?: DisplayName | null;
  links: QuickLink[];
} & BasicCard;

/**
 * Content Summary card
 */
export type ContentSummaryCard = {
  typename: "ContentSummaryCard";
  sections: Section[];
} & BasicCard;

/**
 * Ims Promotion Details card
 */
export type ImsPromotionDetailsCard = {
  typename: "ImsPromotionDetailsCard";
  details: RichText[];
} & BasicCard;

/**
 * Ims Promotion Term and Conditions card
 */
export type ImsPromotionTermsAndConditionsCard = {
  typename: "ImsPromotionTermsAndConditionsCard";
  termsAndConditions: RichText[];
} & BasicCard;

/**
 * Ims Promotion State card
 */
export type ImsPromotionStateCard = {
  typename: "ImsPromotionStateCard";
  promotion: URN;
  depositLink?: ViewLink;
} & BasicCard;

/**
 * Ims Promotion Error card
 */
export type ImsPromotionErrorCard = {
  typename: "ImsPromotionErrorCard";
  errorCode: ImsPromotionErrorCodes;
  seeAll?: ViewLink;
} & BasicCard;

export type PebbleCardEdge = {
  name?: string | null;
  urn: URN;
  typename: string;
};

/**
 * Generic View link Cards - responsible for providing generic links between views (eg: Inplay link in the homepage ribbon)
 */
export type GenericViewLinkCard = {
  typename: "GenericViewLinkCard";
  viewLink: ViewLink;
  badge: Badge | null;
  title: string;
  sportId: number | undefined;
} & BasicCard;

/**
 * Event View link Cards - responsible for providing links between "view" layout entities
 */
export type EventViewLinkCard = {
  typename: "EventViewLinkCard";
  viewLink: ViewLink;
  sportevent: URN;
  fixture?: URN;
} & BasicCard;

/**
 * Market View link Cards - responsible for providing links for "market" layout entities
 */
export type MarketViewLinkCard = {
  typename: "MarketViewLinkCard";
  marketName: string;
  viewLink: ViewLink;
  badge?: Badge | null;
} & BasicCard;

export type CompetitionViewLinkCard = {
  typename: "CompetitionViewLinkCard";
  competition: URN;
  viewLink: ViewLink;
} & BasicCard;

export type SportViewLinkCard = {
  typename: "SportViewLinkCard";
  sport: URN;
  viewLink: ViewLink;
} & BasicCard;

export type HighlightedSelectionCard = {
  typename: "HighlightedSelectionCard";
  title: string;
  displayPreviousOdd: boolean;
  runner: URN;
  market: URN;
} & BasicCard;

export type OutrightMarketListCard = {
  typename: "OutrightMarketListCard";
  markets: URN[];
  numberOfRowsToDisplay?: number;
  title: string;
  favouriteMarketsStateURN?: URN;
} & BasicCard;

export type EventViewLink = {
  [urn: string]: ViewLink;
};

export type NavigationLink = {
  [urn: string]: ViewLink;
};

export type PreferenceSingleChoiceCard = {
  typename: "PreferenceSingleChoiceCard";
  preferenceURN: URN;
  title: string;
  description: string;
  layout: PreferenceLayout;
} & BasicCard;

/**
 * The Sportsbook bet card.
 */
export type SportsbookBetCard = {
  typename: "SportsbookBetCard";
  betURN: URN;
  navigationLinks: NavigationLink;
  betSharingViewLink?: ViewLink;
} & BasicCard;

/**
 * The sportsbook bet info card
 */
export type SportsbookBetInfoCard = {
  typename: "SportsbookBetInfoCard";
  placedDate: string;
  settledDate?: string;
  betReceiptId: string;
  regulatorBetId?: string;
  deviceId?: string;
  betSelections?: { marketUrn: string; runnerUrn: string }[];
  product?: string;
} & BasicCard;

/**
 * The sportsbook bet leg card
 */
export type BetLegCard = {
  typename: "BetLegCard";
  betURN: URN;
  legURN: URN;
} & BasicCard;

/**
 * Sibling View
 */
export type SiblingView = {
  viewLink?: ViewLink;
};

/**
 * ActionSwitcherCard
 */
export type ActionSwitcherCard = {
  title: { translationKey: string };
  viewLink: ViewLink;
};

type TranslateProps = {
  key: string;
  interpolationValues?: {
    [key: string]: string | number;
  };
};

export type TranslatableText = {
  translated?: string;
  translate?: TranslateProps;
};

export type EmbeddedViewCard = {
  typename: "EmbeddedViewCard";
  text: string;
  url: string;
} & BasicCard;

export type SearchBarCard = {
  typename: "SearchBarCard";
  title: string | null;
  placeholder: string | null;
} & BasicCard;

export type PPHPromotion = {
  fulfillmentEndDate: string | null;
  tec: { full: string | null } | null;
  customerPromotionState: {
    hasAccepted: boolean | null;
    optInState: string | null;
    eligibility: { canOptIn: boolean | null } | null;
  } | null;
};

export type ForbiddenContentCard = {
  typename: "ForbiddenContentCard";
  forbiddenCardType: ForbiddenContentType;
} & BasicCard;

export type RunnerListCardRunner = {
  runnerURN: string;
  name: string;
};
export type CompetitionViewLink = {
  urn: URN;
  viewLink: ViewLink;
  competition: URN;
};

export type Image = {
  vector: string | null;
  small: string | null;
  medium: string | null;
  large: string | null;
};

export type CompetitionRegion = {
  country: {
    urn: string;
    code: string;
    flag?: string;
  };
  competitionViewLinks: CompetitionViewLink[];
};

export type CompetitionRegionCard = {
  typename: "CompetitionRegionCard";
  competitionRegions: CompetitionRegion[];
} & BasicCard;

export type MarketCards = {
  [urn: string]: MarketCard;
};

export type OutrightMarketListCards = {
  [urn: string]: OutrightMarketListCard;
};

export type TimeFormBroadCastsCards = {
  [urn: string]: TimeFormBroadCastsCard;
};

export type RaceMarketCards = {
  [urn: string]: RaceMarketCard;
};

export type RaceResultsCards = {
  [urn: string]: RaceResultsCard;
};

export type RaceDetailsCards = {
  [urn: string]: RaceDetailsCard;
};

export type RaceViewLinksCards = {
  [urn: string]: RaceViewLinksCard;
};

export type RaceViewLinkCards = {
  [urn: string]: RaceViewLinkCard;
};

export type MarketExtendedCards = {
  [urn: string]: MarketExtendedCard;
};

export type FixtureCards = {
  [urn: string]: FixtureCard;
};

export type EventHeaderCards = {
  [urn: string]: EventHeaderCard;
};

export type HeadToHeadCards = {
  [urn: string]: HeadToHeadCard;
};

export type HighlightedSelectionCards = {
  [urn: string]: HighlightedSelectionCard;
};

export type MatchStatSelectionCards = {
  [urn: string]: MatchStatSelectionCard;
};

export type RecentFormCards = {
  [urn: string]: RecentFormCard;
};

export type RunnerInfoCards = {
  [urn: string]: RunnerInfoCard;
};

export type TeamLineupCards = {
  [urn: string]: TeamLineupCard;
};

export type SearchBarCards = {
  [urn: string]: SearchBarCard;
};

export type MatchTimelineCards = {
  [urn: string]: MatchTimelineCard;
};

export type MatchStatsCards = {
  [urn: string]: MatchStatsCard;
};
export type EventStatsCards = {
  [urn: string]: EventStatsCard;
};

export type EventMarketCards = {
  [urn: string]: EventMarketCard;
};

export type EventViewLinkCards = {
  [urn: string]: EventViewLinkCard;
};

export type MarketViewLinkCards = {
  [urn: string]: MarketViewLinkCard;
};

export type MarketRulesCards = {
  [urn: string]: MarketRulesCard;
};

export type QuickLinksCards = {
  [urn: string]: QuickLinksCard;
};

export type ContentSummaryCards = {
  [urn: string]: ContentSummaryCard;
};

export type MarketRulesSection = {
  name: MarketRulesSectionName | string;
  content: string;
};

export type GameCards = {
  [urn: string]: GameCard;
};

export type GameInfoCards = {
  [urn: string]: GameInfoCard;
};

export type MarketGraphsCards = {
  [urn: string]: MarketGraphsCard;
};

export type GamingLinkCards = {
  [urn: string]: GamingLinkCard;
};

export type GamingPrizeMachineCards = {
  [urn: string]: GamingPrizeMachineCard;
};

export type StatsFormCards = {
  [urn: string]: StatsFormCard;
};

export type StatsMatchStatsCards = {
  [urn: string]: StatsMatchStatsCard;
};

export type StatsTeamsCards = {
  [urn: string]: StatsTeamsCard;
};

export type StatsLineupsCards = {
  [urn: string]: StatsLineupsCard;
};

export type StatsHeadToHeadCards = {
  [urn: string]: StatsHeadToHeadCard;
};

export type StatsPlayersSeasonStatsCards = {
  [urn: string]: StatsPlayersSeasonStatsCard;
};

export type PromotionCards = {
  [urn: string]: PromotionCard;
};

export type MiniPromoBannerCards = {
  [urn: string]: MiniPromoBannerCard;
};

export type GamingJackpotCards = {
  [urn: string]: GamingJackpotCard;
};

export type BroadcastsCards = {
  [urn: string]: BroadcastsCard;
};

export type BroadcastsAndStatisticsCards = {
  [urn: string]: BroadcastsAndStatisticsCard;
};

export type ImsPromotionDetailsCards = {
  [urn: string]: ImsPromotionDetailsCard;
};

export type ImsPromotionTermsAndConditionsCards = {
  [urn: string]: ImsPromotionTermsAndConditionsCard;
};

export type ImsPromotionStateCards = {
  [urn: string]: ImsPromotionStateCard;
};

export type ImsPromotionErrorCards = {
  [urn: string]: ImsPromotionErrorCard;
};

export type EmbeddedViewCards = {
  [urn: string]: EmbeddedViewCard;
};

export type RaceByTimeRangeCards = {
  [urn: string]: RaceByTimeRangeCard;
};

export type ForbiddenContentCards = {
  [urn: string]: ForbiddenContentCard;
};

export type CompetitionRegionCards = {
  [urn: string]: CompetitionRegionCard;
};

export type MarketBetCards = {
  [urn: string]: MarketBetCard;
};

export type MarketBetSelectionCards = {
  [urn: string]: MarketBetSelectionCard;
};

export type MarketRulesCard = {
  typename: "MarketRulesCard";
  marketName: string;
  wallet: string;
  clarifications?: string | null;
  marketBaseRate: number;
  discountAllowed: boolean;
  eventStartTime?: string | null;
  marketBettingType?: MarketRulesMarketBettingType | null;
  numberOfWinners?: number | null;
  sections: MarketRulesSection[];
  footer?: string | null;
  displayMode: TargetDisplayMode | null;
} & BasicCard;

export type MarketGraphsCard = {
  typename: "MarketGraphsCard";
  market: URN;
  runner: URN;
  graphParams: string;
} & BasicCard;

export type GridCardLayout = "VERTICAL_MARKETS" | "HORIZONTAL_MARKETS";

export type GridCardItem = {
  urn: URN;
  displayLabel?: string;
};

export type GridCardRunner = {
  urn: URN;
  name: string;
  selectionId: number;
  participantId: string | null;
  marketURN: URN;
};

export type GridCard = {
  typename: "GridCard";
  numberOfItemsToDisplay?: number;
  layout: GridCardLayout;
  markets: GridCardItem[];
  runners: GridCardRunner[];
  firstPlayer?: FootballPlayerFixtureContextURN;
  players?: FootballPlayerFixtureContextURN[];
  infoBlurbs?: MarketBlurbInfo[];
  stat?: MarketStat;
} & BasicCard;

export type FootballPlayerFixtureContextURN = {
  typename: "FootballPlayerFixtureContext";
  urn: string;
};

export type GridCards = {
  [urn: string]: GridCard;
};

export type PopularBetBuilderCard = {
  typename: "PopularBetBuilderCard";
  fixture: URN;
  sportevent: URN;
  popularbettingopportunity: URN;
  viewLink: ViewLink;
  tabViewLink?: ViewLink;
} & BasicCard;

export type PopularBetBuilderCards = {
  [urn: string]: PopularBetBuilderCard;
};

export type PopularMultiplesBetBuilderCard = {
  typename: "PopularMultiplesBetBuilderCard";
  popularbettingopportunity: URN;
  title?: string;
  fromCmsConfig: boolean;
} & BasicCard;

export type PopularMultiplesBetBuilderCards = {
  [urn: string]: PopularMultiplesBetBuilderCard;
};

export type PackagedCreatedBetsItem = PartialItem & {
  cursor?: string;
};

export type PackagedCreatedBetsCard = {
  typename: "PackagedCreatedBetsCard";
  displayName?: DisplayName | null;
  layout: PackagedLayoutType | null;
  favouriteMarketsStateURN?: URN;
  hasNextPage: boolean;
  endCursor?: string;
  items: PackagedCreatedBetsItem[];
} & BasicCard;

export type PackagedCreatedBetsCards = {
  [urn: string]: PackagedCreatedBetsCard;
};

export type PriceBoostMultisListItem = PartialItem & {
  cursor?: string;
};

export type PriceBoostMultisListCard = {
  typename: "PriceBoostMultisListCard";
  blurb: MarketBlurbInfo | null;
  displayName?: DisplayName | null;
  showWasPrice: boolean;
  hasNextPage: boolean;
  endCursor?: string;
  items: PriceBoostMultisListItem[];
} & BasicCard;

export type PriceBoostMultisListCards = {
  [urn: string]: PriceBoostMultisListCard;
};

export type CorrectScoreCard = {
  typename: "CorrectScoreCard";
  numberOfItemsToDisplay?: number;
  market: URN;
} & BasicCard;

export type CorrectScoreCards = {
  [urn: string]: CorrectScoreCard;
};

export type GenericViewLinkCards = {
  [urn: string]: GenericViewLinkCard;
};

export type CompetitionViewLinkCards = {
  [urn: string]: CompetitionViewLinkCard;
};
export type SportViewLinkCards = {
  [urn: string]: SportViewLinkCard;
};

export type RegulatoryCards = {
  [urn: string]: RegulatoryCard;
};

export type PreferenceSingleChoiceCards = {
  [urn: string]: PreferenceSingleChoiceCard;
};

export type SportsbookBetCards = {
  [urn: string]: SportsbookBetCard;
};

export type BetLegCards = {
  [urn: string]: BetLegCard;
};

export type SportsbookBetInfoCards = {
  [urn: string]: SportsbookBetInfoCard;
};

export type CashoutQuotes = {
  exchangeCashoutQuotesURNs: URN[];
};

export type BudgetLimit = {
  amount?: number;
  category?: BudgetCategory;
  remain?: number;
  reset?: string;
  nextBreachable?: boolean;
};

export type BudgetLimitsCard = {
  urn: URN;
  typename: "BudgetLimitsCard";
  limits: BudgetLimit[] | null;
} & BasicCard;

export type BudgetLimitsCards = {
  [urn: string]: BudgetLimitsCard;
};

export type CouponHeaderCard = {
  urn: URN;
  typename: "CouponHeaderCard";
  columns: string[];
  competition: URN;
  competitionViewLink: ViewLink;
  hasStats: boolean;
} & BasicCard;

export type CouponHeaderCards = {
  [urn: string]: CouponHeaderCard;
};

export type ExpandableMarketCard = {
  urn: URN;
  title: string;
  marketCardURN: URN;
  viewOpenBets?: ViewLink;
  typename: "ExpandableMarketCard";
} & BasicCard;

export type PartialExpandableMarketCard = {
  urn: URN;
  title: string;
  typename: "ExpandableMarketCard";
} & BasicCard;

export type ExpandableMarketCards = {
  [urn: string]: ExpandableMarketCard | PartialExpandableMarketCard;
};

export type VirtualEventHierarchy = {
  virtualEventURN: URN;
};

export type VirtualMarketHierarchy = VirtualEventHierarchy;

export type VirtualMarketCard = {
  typename: "VirtualMarketCard";
  urn: URN;
  title: string;
  event: URN;
  market: URN;
  gameRulesViewLink: ViewLink;
};

export type VirtualMarketCards = {
  [urn: string]: VirtualMarketCard;
};

export type VirtualEventDetailsCard = {
  typename: "VirtualEventDetailsCard";
  urn: URN;
  virtualEvent: URN;
};

export type VirtualEventDetailsCards = {
  [urn: string]: VirtualEventDetailsCard;
};

export type MarketBetCard = {
  typename: "MarketBetCard";
  betCardGroupURN: URN;
  marketBetCardGroupURN: URN;
  marketBetURN: URN;
  numberOfBets: number;
  numberOfUnmatched: number;
  liability?: number;
  matchedStatus?: string;
  commission?: number;
  profit?: number;
  netProfit?: number;
} & BasicCard;

export type MarketBetSelectionCard = {
  typename: "MarketBetSelectionCard";
  id: string;
  handicap: number;
  placedDate: string;
  settledDate?: string;
  matchedDate?: string;
  price: number;
  runnerDesc: string;
  side?: ExchangeSide;
  isCashout: boolean;
  size?: number;
  profit?: number;
  result?: ExchangeBetOutcome;
  isFreeBet: boolean;
  freeBetSize: number;
  priceMatched: number;
  selectionId: number;
  deviceId?: string;
  isUnmatched: boolean;
  isBsp?: boolean;
  bspLiability?: number;
  liability?: number;
  editViewLink?: ViewLink;
  marketBetURN: URN;
  runnerURN: URN;
  marketURN: URN;
  marketBetCardGroupURN: URN;
} & BasicCard;

export type EmbeddedContentCard = {
  typename: "EmbeddedContentCard";
  title: string;
  url: string;
} & BasicCard;

export type EmbeddedContentCards = {
  [urn: string]: EmbeddedContentCard;
};

export type ExtraWalletCard = {
  typename: "ExtraWalletCard";
  urn: URN;
  badges: string[];
  extraWalletURN: URN;
  restrictions: WalletRestrictions;
} & BasicCard;

export type ExtraWalletCards = {
  [urn: string]: ExtraWalletCard;
};

export type PriceBoostMultisCard = {
  typename: "PriceBoostMultisCard";
  title: string;
  showWasPrice: boolean;
  popularbettingopportunity: URN;
} & BasicCard;

export type PriceBoostMultisCards = {
  [urn: string]: PriceBoostMultisCard;
};

export type MatchStatTitle = {
  playerNames: string[];
  combiner: string;
};

export type MatchStatSelectionCard = {
  typename: "MatchStatSelectionCard";
  matchStatTitle: MatchStatTitle;
  matchStatSubtitle: string;
  runner: URN;
  market: URN;
  statsDescription?: string;
  incidentType?: string;
} & BasicCard;

export type MonterosaContentCard = {
  typename: "MonterosaContentCard";
} & BasicCard;

export type MonterosaContentCards = {
  [urn: string]: MonterosaContentCard;
};

export type SportsbookChatbotCard = {
  typename: "SportsbookChatbotCard";
} & BasicCard;

/**
 * Cards data model type
 * a key-value structure where the key is a unique identifier (market card URN in this case) stored on the value too
 *
 * e.g.
 *  {
 *    "myUniqueId": { urn: "myUniqueId", name: "", ... }
 *  }
 */
export type Cards = {
  accountBanners: AccountBannersCards;
  balance: BalanceCards;
  betlegs: BetLegCards;
  bottombar: BottomBar | null;
  blurb: BlurbCards;
  broadcasts: BroadcastsCards;
  broadcastsandstatistics: BroadcastsAndStatisticsCards;
  budgetLimits: BudgetLimitsCards;
  competitionregions: CompetitionRegionCards;
  competitionviewlinks: CompetitionViewLinkCards;
  contentsummary: ContentSummaryCards;
  correctscorecards: CorrectScoreCards;
  couponheaders: CouponHeaderCards;
  embeddedcontents: EmbeddedContentCards;
  eventheader: EventHeaderCards;
  eventmarkets: EventMarketCards;
  eventstats: EventStatsCards;
  eventviewlinks: EventViewLinkCards;
  expandablemarkets: ExpandableMarketCards;
  fixtures: FixtureCards;
  forbiddencontent: ForbiddenContentCards;
  gameinfos: GameInfoCards;
  games: GameCards;
  gamingjackpots: GamingJackpotCards;
  gaminglinks: GamingLinkCards;
  gamingplaynews: GamingPlayNewCards;
  genericviewlinks: GenericViewLinkCards;
  grids: GridCards;
  headtoheads: HeadToHeadCards;
  highlightedselections: HighlightedSelectionCards;
  imspromotiondetails: ImsPromotionDetailsCards;
  imspromotionerror: ImsPromotionErrorCards;
  imspromotionstate: ImsPromotionStateCards;
  imspromotiontermsandconditions: ImsPromotionTermsAndConditionsCards;
  links: LinksCards;
  marketbetcard: MarketBetCards;
  marketbetselectioncard: MarketBetSelectionCards;
  marketgraphs: MarketGraphsCards;
  marketrules: MarketRulesCards;
  markets: MarketCards;
  marketsextended: MarketExtendedCards;
  marketviewlinks: MarketViewLinkCards;
  matchstats: MatchStatsCards;
  matchstatselections: MatchStatSelectionCards;
  matchtimelines: MatchTimelineCards;
  myaccount: MyAccountInterfaceOpenState;
  mybets: MyBetsState;
  obbcards: ObbCards;
  obbcreatedbetscards: ObbCreatedBetsCards;
  obbeventpopularscards: ObbEventPopularsCards;
  outrightmarketlistcards: OutrightMarketListCards;
  popularbetbuilders: PopularBetBuilderCards;
  popularmultiplesbetbuilders: PopularMultiplesBetBuilderCards;
  packagedcreatedbets: PackagedCreatedBetsCards;
  priceboostmultislistcards: PriceBoostMultisListCards;
  preferencesinglechoices: PreferenceSingleChoiceCards;
  promotions: PromotionCards;
  quicklinks: QuickLinksCards;
  racebytimerangecards: RaceByTimeRangeCards;
  priceboostmulticards: PriceBoostMultisCards;
  racedetails: RaceDetailsCards;
  racemarkets: RaceMarketCards;
  raceresults: RaceResultsCards;
  raceviewlink: RaceViewLinkCards;
  raceviewlinks: RaceViewLinksCards;
  receipt: Receipt;
  recentforms: RecentFormCards;
  regulatory: RegulatoryCards;
  rewards: RewardsCards;
  runnerinfos: RunnerInfoCards;
  searchBar: SearchBarCards;
  sportsbookbetinfos: SportsbookBetInfoCards;
  sportsbookbets: SportsbookBetCards;
  sportviewlinks: SportViewLinkCards;
  timeformbroadcasts: TimeFormBroadCastsCards;
  virtualeventdetails: VirtualEventDetailsCards;
  virtualmarket: VirtualMarketCards;
  extrawallet: ExtraWalletCards;
};

export const APOLLO_MIGRATED_CARDS = [
  "GamingPrizeMachineCard",
  "StatsPebbleCardGroup",
  "StatsSupportingContentButtonsCardGroup",
  "StatsFormCard",
  "StatsHeadToHeadCard",
  "StatsPlayersSeasonStatsCard",
  "StatsContentCardGroup",
  "IncidentsCard",
  "StatsMatchStatsCard",
  "StatsPlayersInPlayCard",
  "StatsGoalsAndShotsCard",
  "StatsTeamsCard",
  "StatsLineupsCard",
  "SelfExclusionCard",
  "StatsBroadcastsCard",
  "GenericSwitcherCard",
  "RaceSwitcherCard",
  "LoyaltyPromoCard",
  "MiniPromoBannerCard",
  "EditorialPromoCard",
  "BetOpportunityPromoCard",
  "SelectionPromoCard",
  "LottoCard",
  "PriceBoostMultiplePromoCard",
  "PromotionsCardGroup",
  "TeamLineupCard",
  "MonterosaContentCard",
  "EmbeddedContentCard",
  "PopularSelectionsCard",
  "QuicklinksGridCardGroup",
  "QuicklinksGridItemCard",
  "EmbeddedViewCard",
  "PromotionsHubCardGroup",
  "SportsbookChatbotCard",
  "PenaltyTakersCard",
];

export type RaceTimeItemEdge = {
  startTime: string;
  venue?: string | null;
  icon?: CardIconTypes;
  urn: URN;
  typename: string;
  marketPromo?: MarketPromoSignposting;
  isHighlighted: boolean;
};
