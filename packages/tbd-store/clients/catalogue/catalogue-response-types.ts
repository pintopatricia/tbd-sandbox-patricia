export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends " $fragmentName" | "__typename" ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  FieldSet: { input: any; output: any };
  URL: { input: string; output: string };
  URN: { input: string; output: string };
  _Any: { input: any; output: any };
  federation__Scope: { input: any; output: any };
  link__Import: { input: any; output: any };
};

export type AvbScore = {
  away: Maybe<Scalars["Int"]["output"]>;
  home: Maybe<Scalars["Int"]["output"]>;
};

/** My Account banner to be displayed in case the prevoius banner action failed */
export type AccountBannerOnError = {
  /** The banner attentionLevel. This should determine the banner color */
  attentionLevel: Maybe<Scalars["String"]["output"]>;
  /** The banner calls to action */
  bannerActions: Maybe<Array<Maybe<ReducedBannerCta>>>;
  /** The banner details */
  bannerInfo: Maybe<BannerInfo>;
  /** The flow of the banner */
  flow: Maybe<Scalars["String"]["output"]>;
  /** Should the banner display a close button that only closes the banner */
  isClosable: Maybe<Scalars["Boolean"]["output"]>;
  /** Is the banner minimized */
  isMinimized: Maybe<Scalars["Boolean"]["output"]>;
  /** The max number of times the banner should be displayed */
  maxDisplays: Maybe<Scalars["Int"]["output"]>;
  /** The banner info to be displayed on minimized mode */
  minimizedBannerInfo: Maybe<MinimizedBannerInfo>;
  /** The banner priority. The ones with higher proirity should be displayed first */
  priority: Maybe<Scalars["String"]["output"]>;
  /** The banner template */
  template: Maybe<Scalars["String"]["output"]>;
  /** The use case of the banner */
  useCase: Maybe<Scalars["String"]["output"]>;
  /** The banner version */
  version: Maybe<Scalars["Int"]["output"]>;
};

/** Represents a My account banners card */
export type AccountBannersCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The account banners list */
    bannerDetails: Maybe<Array<Maybe<BannerDetails>>>;
    /** The account banner card URN */
    urn: Scalars["URN"]["output"];
  };

/** Represents My Account banner address info */
export type AddressInfo = {
  /** Address label */
  addressLabel: Maybe<Scalars["String"]["output"]>;
  /** Address city */
  jumioAddressCity: Maybe<Scalars["String"]["output"]>;
  /** Address province */
  jumioAddressProvince: Maybe<Scalars["String"]["output"]>;
  /** Address street */
  jumioAddressStreetName: Maybe<Scalars["String"]["output"]>;
  /** Postcode */
  postcodeLabel: Maybe<Scalars["String"]["output"]>;
};

/** Represents a View with all competitions for a given sport. */
export type AllCompetitionsView = View & {
  /** The bottom bar */
  bottomBar: Maybe<BottomBar>;
  /** The view category */
  category: Maybe<ViewCategory>;
  /** The layout items on the view */
  items: ViewItemsConnection;
  /** The left side bar */
  leftSidebar: Maybe<LeftSidebar>;
  /** The regulatory data used for the regulatory header */
  regulatoryData: Maybe<RegulatoryData>;
  /** The view title */
  title: Maybe<Scalars["String"]["output"]>;
  /** The view url */
  url: Scalars["URL"]["output"];
  /** The view urn */
  urn: Scalars["URN"]["output"];
  /** The xsell bar */
  xsellBar: Maybe<XSellBar>;
};

/** Represents a View with all competitions for a given sport. */
export type AllCompetitionsViewItemsArgs = {
  after: InputMaybe<Scalars["String"]["input"]>;
  first: InputMaybe<Scalars["Int"]["input"]>;
};

/** Represents a View with all related markets. */
export type AllMarketsView = View & {
  /** The bottom bar */
  bottomBar: Maybe<BottomBar>;
  /** The view category */
  category: Maybe<ViewCategory>;
  /** The layout items on the view */
  items: ViewItemsConnection;
  /** The left side bar */
  leftSidebar: Maybe<LeftSidebar>;
  /** The regulatory data used for the regulatory header */
  regulatoryData: Maybe<RegulatoryData>;
  /** The view title */
  title: Maybe<Scalars["String"]["output"]>;
  /** The view url */
  url: Scalars["URL"]["output"];
  /** The view urn */
  urn: Scalars["URN"]["output"];
  /** The xsell bar */
  xsellBar: Maybe<XSellBar>;
};

/** Represents a View with all related markets. */
export type AllMarketsViewItemsArgs = {
  after: InputMaybe<Scalars["String"]["input"]>;
  first: InputMaybe<Scalars["Int"]["input"]>;
};

export type AmericanFootballClock = {
  /** Current period of the fixture */
  period: Maybe<AmericanFootballPeriod>;
  /** Time elapsed in the current period (in seconds) */
  timeElapsed: Maybe<Scalars["Int"]["output"]>;
  /** Time remaining in the current period (in seconds) */
  timeRemaining: Maybe<Scalars["Int"]["output"]>;
};

export type AmericanFootballFixture = Fixture & {
  /** Clock information */
  clock: Maybe<AmericanFootballClock>;
  /** If the score should be display in american format */
  isAmericanFormat: Scalars["Boolean"]["output"];
  /** Score information for each quarter */
  quarterScores: Maybe<Array<Maybe<AmericanFootballQuarterScore>>>;
  /** The fixture main market home away runner names */
  runnerNames: Maybe<FixtureRunnerNames>;
  /** Score of the current period */
  score: Maybe<AmericanFootballScore>;
  /** The sport event */
  sportevent: SportsEvent;
  /** The fixture urn */
  urn: Scalars["URN"]["output"];
};

export enum AmericanFootballPeriod {
  End = "END",
  EndOvertime = "END_OVERTIME",
  EndPeriod_1 = "END_PERIOD_1",
  EndPeriod_2 = "END_PERIOD_2",
  EndPeriod_3 = "END_PERIOD_3",
  EndPeriod_4 = "END_PERIOD_4",
  Overtime = "OVERTIME",
  Period_1 = "PERIOD_1",
  Period_2 = "PERIOD_2",
  Period_3 = "PERIOD_3",
  Period_4 = "PERIOD_4",
}

export type AmericanFootballQuarterScore = {
  /** Period/Quarter identifier */
  period: Maybe<AmericanFootballPeriod>;
  /** Score for this quarter */
  score: Maybe<AmericanFootballScore>;
};

export type AmericanFootballScore = {
  /** Away team score */
  away: Maybe<Scalars["Int"]["output"]>;
  /** Home team score */
  home: Maybe<Scalars["Int"]["output"]>;
};

/** App context details including environment, user details and others */
export type AppContextDetails = {
  /** Experiments applied to the user with their respective variants */
  activeExperiments: Array<Maybe<ExperimentVariant>>;
  /** All configured brand settings and if they are being applied or not */
  brandSettings: Array<BrandSetting>;
  /**
   * Experiments applied to the user with their respective variants
   * @deprecated Can receive a null experimentVariant
   */
  experiments: Array<ExperimentVariant>;
  /** Configured polling cadences per service, login and in-play state */
  pollcadences: Maybe<PollingCadences>;
  /** Current user's applied preferences */
  preferences: Preferences;
  /** Registration data */
  registration: Maybe<RegistrationData>;
  /** All configured throttles and if they are being applied or not */
  throttles: Array<FeatureThrottle>;
  urn: Scalars["URN"]["output"];
  /** Context of the user such as currency settings, locale, etc */
  userdetails: UserDetails;
};

/**
 * NO breaking changes are allowed on AppVersion type, at most the properties should be deprecated.
 * This needs to remain as stable as possible for update reasons
 */
export type AppVersion = {
  blackList: Maybe<Array<Maybe<AppVersionBlacklist>>>;
  /** @deprecated Use `url` instead, since it resolves to a download or store url */
  downloadUrl: Maybe<Scalars["String"]["output"]>;
  minOSVersion: Maybe<Scalars["String"]["output"]>;
  minVersionCode: Maybe<Scalars["Float"]["output"]>;
  /** @deprecated Use `url` instead, since it resolves to a download or store url */
  storeUrl: Maybe<Scalars["String"]["output"]>;
  url: Maybe<Scalars["String"]["output"]>;
  urn: Scalars["URN"]["output"];
  versionCode: Maybe<Scalars["Float"]["output"]>;
};

export type AppVersionBlacklist = {
  versioncode: Maybe<Scalars["Float"]["output"]>;
};

/** Represents a pair of Associated Markets */
export type AssociatedMarkets = {
  /** The associated Exchange Market */
  exchange: Maybe<ExchangeMarket>;
  /** The associated Sportsbook Market */
  sportsbook: Maybe<SportsbookMarket>;
};

export type AttackIncident = {
  attackType: Maybe<AttackIncidentType>;
  side: Maybe<FixtureTeamSide>;
};

export enum AttackIncidentType {
  DangerousAttack = "DANGEROUS_ATTACK",
}

export type AustralianRulesFixture = Fixture & {
  /** If the score should be display in american format */
  isAmericanFormat: Scalars["Boolean"]["output"];
  /** Scores by period */
  periodScores: Maybe<Array<Maybe<AustralianRulesPeriodScore>>>;
  /** The fixture main market home away runner names */
  runnerNames: Maybe<FixtureRunnerNames>;
  /** Score of the current period */
  score: Maybe<AustralianRulesScoreBoard>;
  /** The sport event */
  sportevent: SportsEvent;
  /** The fixture urn */
  urn: Scalars["URN"]["output"];
};

export enum AustralianRulesPeriod {
  Period_1 = "PERIOD_1",
  Period_2 = "PERIOD_2",
  Period_3 = "PERIOD_3",
  Period_4 = "PERIOD_4",
  UnknownPeriod = "UNKNOWN_PERIOD",
}

export type AustralianRulesPeriodScore = {
  /** Period of the fixture */
  australianRulesPeriod: Maybe<AustralianRulesPeriod>;
  /** Score of the period associated */
  score: Maybe<AustralianRulesScoreBoard>;
};

export type AustralianRulesScore = {
  /** Away team score */
  away: Maybe<Scalars["Int"]["output"]>;
  /** Home team score */
  home: Maybe<Scalars["Int"]["output"]>;
};

export type AustralianRulesScoreBoard = {
  /** Behinds score */
  behinds: Maybe<AustralianRulesScore>;
  /** Goals score */
  goals: Maybe<AustralianRulesScore>;
  /** Points score */
  points: Maybe<AustralianRulesScore>;
};

export type AverageGoalsDetails = {
  firstHalf: Maybe<Scalars["Float"]["output"]>;
  overall: Maybe<Scalars["Float"]["output"]>;
  secondHalf: Maybe<Scalars["Float"]["output"]>;
};

export type AverageTeamStats = {
  away: Maybe<Scalars["Float"]["output"]>;
  firstHalf: Maybe<Scalars["Float"]["output"]>;
  home: Maybe<Scalars["Float"]["output"]>;
  overall: Maybe<Scalars["Float"]["output"]>;
  secondHalf: Maybe<Scalars["Float"]["output"]>;
};

/** Represents the possible badges */
export enum Badge {
  Casino = "CASINO",
  Cup = "CUP",
  Inplay = "INPLAY",
  MyBets = "MY_BETS",
  Oddsboost = "ODDSBOOST",
  Oddsonthat = "ODDSONTHAT",
  Roulette = "ROULETTE",
  SuperSpin = "SUPER_SPIN",
  Virtuals = "VIRTUALS",
}

/** Represents the signposting badge text. */
export type BadgeSignposting = {
  label: DisplayName;
};

/** Represents the possible states for a promotion badge */
export enum BadgeState {
  Accepted = "ACCEPTED",
  BonusAwarded = "BONUS_AWARDED",
  BonusUsed = "BONUS_USED",
  ComingSoon = "COMING_SOON",
  Completed = "COMPLETED",
  Expired = "EXPIRED",
  NotAvailable = "NOT_AVAILABLE",
  TokenAwarded = "TOKEN_AWARDED",
  TokenUsed = "TOKEN_USED",
}

/** Represents a card with collection of wallets and wallet aggregation sections */
export type BalanceCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The balance card urn */
    urn: Scalars["URN"]["output"];
    /** The balance card wallets sections */
    walletSections: Array<WalletSectios>;
    /** The balance card wallets */
    wallets: Array<Wallet>;
  };

/** Represents My Account banner buttons. They contain the actionFinalize extra field compared to ReducedBannerCTA */
export type BannerCta = {
  /** MAX custom action to call */
  action: Maybe<Scalars["String"]["output"]>;
  /** Finalize action info */
  actionFinalize: Maybe<BannerCtaFinalize>;
  /** Button type */
  buttonType: Maybe<Scalars["String"]["output"]>;
  /** Data to be used to call MAX custom action */
  data: Maybe<Scalars["String"]["output"]>;
  /** Button GA label */
  gaLabel: Maybe<Scalars["String"]["output"]>;
  /** Button label */
  label: Maybe<Scalars["String"]["output"]>;
  /** Button minimized label */
  minimizedLabel: Maybe<Scalars["String"]["output"]>;
  /** Relative path */
  path: Maybe<Scalars["String"]["output"]>;
  /** Where should the URL be opened */
  target: Maybe<Scalars["String"]["output"]>;
  /** CTA type */
  type: Maybe<Scalars["String"]["output"]>;
  /** Button URL */
  url: Maybe<Scalars["String"]["output"]>;
};

/** Represents My Account banner buttons */
export type BannerCtaFinalize = {
  /** The next banner to be displayed in case of error */
  onErrorBanner: Maybe<AccountBannerOnError>;
};

/** Represents a banner details */
export type BannerDetails = {
  /** The banner attentionLevel. This should determine the banner color */
  attentionLevel: Maybe<Scalars["String"]["output"]>;
  /** The banner calls to action */
  bannerActions: Maybe<Array<Maybe<BannerCta>>>;
  /** The banner details */
  bannerInfo: Maybe<BannerInfo>;
  /** The banner type - kyc, news, rg etc */
  bannerType: Maybe<Scalars["String"]["output"]>;
  /** The flow of the banner */
  flow: Maybe<Scalars["String"]["output"]>;
  /** Should the banner display a close button that only closes the banner */
  isClosable: Maybe<Scalars["Boolean"]["output"]>;
  /** Is the banner minimized */
  isMinimized: Maybe<Scalars["Boolean"]["output"]>;
  /** The max number of times the banner should be displayed */
  maxDisplays: Maybe<Scalars["Int"]["output"]>;
  /** The banner info to be displayed on minimized mode */
  minimizedBannerInfo: Maybe<MinimizedBannerInfo>;
  /** The banner priority. The ones with higher proirity should be displayed first */
  priority: Maybe<Scalars["String"]["output"]>;
  /** The banner template */
  template: Maybe<Scalars["String"]["output"]>;
  /** The use case of the banner */
  useCase: Maybe<Scalars["String"]["output"]>;
  /** The banner version */
  version: Maybe<Scalars["Int"]["output"]>;
};

/** Represents My Account banner info */
export type BannerInfo = {
  /** The banner body content */
  bodyContent: Maybe<BodyContent>;
  /** The title of the banner */
  title: Maybe<Scalars["String"]["output"]>;
};

export type BaseBet = {
  params: Params;
  templateId: Scalars["String"]["output"];
};

export type BaseBetInput = {
  params: ExpressionParamsInput;
  templateId: Scalars["String"]["input"];
};

export type BaseExpressionTemplateDefinitions = {
  baseExpressionTemplateDefinitions: Maybe<Array<BaseExpressionTemplateDefinitions>>;
  expressionTemplateId: Scalars["String"]["output"];
};

export type BaseExpressionTemplateDefinitionsInput = {
  baseExpressionTemplateDefinitions: InputMaybe<Array<BaseExpressionTemplateDefinitionsInput>>;
  expressionTemplateId: Scalars["String"]["input"];
};

/** Represent a fixture without scores */
export type BaseFixture = Fixture & {
  /** If the score should be display in american format */
  isAmericanFormat: Scalars["Boolean"]["output"];
  /** The main market */
  mainMarket: AssociatedMarkets;
  /** The fixture main market home away runner names */
  runnerNames: Maybe<FixtureRunnerNames>;
  /** The sport event */
  sportevent: SportsEvent;
  /** The fixture urn */
  urn: Scalars["URN"]["output"];
};

export type BaseballClock = {
  /** Current period of the fixture */
  period: Maybe<BaseballPeriod>;
};

export type BaseballFixture = Fixture & {
  /** Clock information */
  clock: Maybe<BaseballClock>;
  /** If the score should be display in american format */
  isAmericanFormat: Scalars["Boolean"]["output"];
  /** The fixture main market home away runner names */
  runnerNames: Maybe<FixtureRunnerNames>;
  /** Score of the current match */
  score: Maybe<BaseballScore>;
  /** Scores per inning */
  scorePerInning: Maybe<Array<Maybe<BaseballInningScore>>>;
  /** The sport event */
  sportevent: SportsEvent;
  /** The fixture urn */
  urn: Scalars["URN"]["output"];
};

export type BaseballInningScore = {
  /** The inning period */
  period: Maybe<BaseballPeriod>;
  /** Score of the inning associated */
  score: Maybe<BaseballScore>;
};

export enum BaseballPeriod {
  End = "END",
  ExtraInnings = "EXTRA_INNINGS",
  Inning_1 = "INNING_1",
  Inning_2 = "INNING_2",
  Inning_3 = "INNING_3",
  Inning_4 = "INNING_4",
  Inning_5 = "INNING_5",
  Inning_6 = "INNING_6",
  Inning_7 = "INNING_7",
  Inning_8 = "INNING_8",
  Inning_9 = "INNING_9",
  PreMatch = "PRE_MATCH",
  Unknown = "UNKNOWN",
}

export type BaseballScore = {
  /** Away team score */
  away: Scalars["Int"]["output"];
  /** Home team score */
  home: Scalars["Int"]["output"];
};

export type BasketballClock = {
  /** Current period of the fixture */
  period: Maybe<BasketballPeriod>;
  /** Current segment of the fixture */
  segment: Maybe<BasketballSegment>;
  /** Time elapsed for the current period (in seconds) */
  timeElapsed: Maybe<Scalars["Int"]["output"]>;
  /** Time remaining for the current period (in seconds) */
  timeRemaining: Maybe<Scalars["Int"]["output"]>;
};

export type BasketballFixture = Fixture & {
  /** Clock information */
  clock: Maybe<BasketballClock>;
  /** If the score should be display in american format */
  isAmericanFormat: Scalars["Boolean"]["output"];
  /** Scores by period */
  periodScores: Maybe<Array<Maybe<BasketballPeriodScore>>>;
  /** The fixture main market home away runner names */
  runnerNames: Maybe<FixtureRunnerNames>;
  /** Score of the current period */
  score: Maybe<BasketballScore>;
  /** The sport event */
  sportevent: SportsEvent;
  /** The fixture urn */
  urn: Scalars["URN"]["output"];
};

export enum BasketballPeriod {
  End = "END",
  EndOvertime = "END_OVERTIME",
  EndPeriod_1 = "END_PERIOD_1",
  EndPeriod_2 = "END_PERIOD_2",
  EndPeriod_3 = "END_PERIOD_3",
  EndPeriod_4 = "END_PERIOD_4",
  Overtime = "OVERTIME",
  Period_1 = "PERIOD_1",
  Period_2 = "PERIOD_2",
  Period_3 = "PERIOD_3",
  Period_4 = "PERIOD_4",
  UnknownPeriod = "UNKNOWN_PERIOD",
}

export type BasketballPeriodScore = {
  /** Current period of the fixture */
  period: Maybe<BasketballPeriod>;
  /** Score of the period associated */
  score: Maybe<BasketballScore>;
  /** Current segment of the fixture */
  segment: Maybe<BasketballSegment>;
};

export type BasketballScore = {
  /** Away team score */
  away: Scalars["Int"]["output"];
  /** Home team score */
  home: Scalars["Int"]["output"];
};

export enum BasketballSegment {
  H1 = "H1",
  H2 = "H2",
  Ot = "OT",
  Q1 = "Q1",
  Q2 = "Q2",
  Q3 = "Q3",
  Q4 = "Q4",
  UnknownSegment = "UNKNOWN_SEGMENT",
}

/** Benefit package details */
export type Benefit = {
  /** Benefit access level for a given plan. */
  accessLevel: Maybe<Scalars["String"]["output"]>;
  /** False if the benefit will be listed on the plan */
  hidden: Maybe<Scalars["Boolean"]["output"]>;
  /** Type of the benefit package */
  type: Maybe<Scalars["String"]["output"]>;
  /** Details about the quantity and currency of the benefit */
  valueLookup: Maybe<ValueLookup>;
};

/** The benefit access */
export type BenefitAccess = {
  /** The access level (NONE, STANDARD or EXTENDED) of such benefit */
  accessLevel: Scalars["String"]["output"];
  /** The benefit name */
  type: Scalars["String"]["output"];
};

/** Represents the benefits package of a user */
export type BenefitsPackage = {
  /** Set of benefits for which the user is qualified */
  benefits: Maybe<Array<Maybe<Benefit>>>;
  /** The commission rate of the benefit package */
  commissionRate: Maybe<Scalars["Float"]["output"]>;
  /** The type of criteria being applied */
  criteriaType: Maybe<Scalars["String"]["output"]>;
  /** Set of benefits which are self excluded from (e.g the gaming=true benefits for gaming self excluded customers). */
  excludedBenefits: Maybe<Array<Maybe<BenefitAccess>>>;
  /** Benefits package level chosen by the user */
  packageLevel: Maybe<Scalars["String"]["output"]>;
  /** Number of settled bets required to be qualified */
  requiredMarketBets: Maybe<Scalars["Int"]["output"]>;
};

/** Benefits packages details */
export type BenefitsPackages = {
  /** Available packages */
  availablePackages: Maybe<Array<Maybe<BenefitsPackage>>>;
  /** Current month benefits details */
  chosenBenefitsPackage: Maybe<BenefitsPackage>;
  /** The current month */
  currentMonth: Maybe<Scalars["String"]["output"]>;
  /** The number of users traded markets for current month */
  currentMonthTradedMarkets: Maybe<Scalars["Int"]["output"]>;
  /** The number of users traded markets for last month */
  lastMonthTradedMarkets: Maybe<Scalars["Int"]["output"]>;
  /** The next month */
  nextMonth: Maybe<Scalars["String"]["output"]>;
  /** Last month benefits details */
  qualifiedBenefitsPackage: Maybe<BenefitsPackage>;
  /** User rewards status */
  rewardsStatus: RewardsStatus;
};

export type BetCardGroup = CardGroup &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card group aggregator description */
    aggregatorDesc: Maybe<Scalars["String"]["output"]>;
    /** The card group aggregator id */
    aggregatorId: Maybe<Scalars["String"]["output"]>;
    /** The card group items */
    items: BetCardGroupItemConnection;
    /** The card group urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a connection between BetCardGroup and [BetCardGroupItem] */
export type BetCardGroupItemConnection = {
  edges: Array<Maybe<BetCardGroupItemEdge>>;
  pageInfo: Maybe<PageInfo>;
};

/** Represents a BetCardGroupItem edge */
export type BetCardGroupItemEdge = {
  cursor: Maybe<Scalars["String"]["output"]>;
  node: ViewItem;
};

export type BetDefinitionInput = {
  eventId: EventIdInput;
  expressionParams: ExpressionParamsInput;
  expressionTemplateId: Scalars["String"]["input"];
  id: Scalars["String"]["input"];
};

export type BetDefinitionResult = {
  details: Maybe<ImplyDetails>;
  id: Scalars["String"]["output"];
  result: ObbResult;
};

export type BetDetails = {
  betType: Scalars["String"]["output"];
  currency: Scalars["String"]["output"];
  id: Scalars["String"]["output"];
  outcomeBasedLegs: Array<OutcomeBasedLeg>;
  placedDate: Scalars["String"]["output"];
  potentialPayout: Maybe<Scalars["Float"]["output"]>;
  price: ObbOdds;
  receiptId: Scalars["String"]["output"];
  stake: Scalars["Float"]["output"];
  stakePerLine: Scalars["Float"]["output"];
};

export type BetEdge = {
  /** The type of Edge applied */
  reason: BetEdgeEnum;
  /** The status of the Edge on a bet */
  status: Maybe<BetEdgeStatusEnum>;
};

/** Bet edge enum values */
export enum BetEdgeEnum {
  AccaInsurance = "ACCA_INSURANCE",
  Eachway = "EACHWAY",
}

/** Bet edge status enum values */
export enum BetEdgeStatusEnum {
  Active = "ACTIVE",
  Voided = "VOIDED",
}

export type BetEligibility = {
  /** The bet identifier */
  betId: Scalars["String"]["output"];
  /** Machine-readable status code */
  code: EligibilityCode;
  /**
   * Whether the bet is eligible for sharing
   * @deprecated use eligibleForShare
   */
  eligible: Scalars["Boolean"]["output"];
  /** Whether the bet is eligible for sharing */
  eligibleForShare: Scalars["Boolean"]["output"];
  /** Whether the bet is eligible for unsharing */
  eligibleForUnshare: Scalars["Boolean"]["output"];
  /** Human-readable error description (null when eligible) */
  error: Maybe<Scalars["String"]["output"]>;
};

/** Represents a sportsbook bet leg */
export type BetLeg = {
  /** Leg Number */
  legNumber: Scalars["Int"]["output"];
  /** Mutation information for the leg */
  mutations: Maybe<BetLegMutation>;
  /**
   * The Obb Expression Template
   * @deprecated Use `outcomeBasedDetails` instead
   */
  obbExpressionTemplate: Maybe<ObbExpressionTemplate>;
  /** Details for the leg based on outcome definition */
  outcomeBasedDetails: Maybe<OutcomeBasedDetails>;
  /** The leg parts */
  parts: Array<LegPart>;
  /** Result of the leg */
  result: Maybe<ResultEnum>;
  /** Result type */
  resultType: Maybe<ResultTypeEnum>;
  /** The leg type */
  type: LegType;
  /** The bet leg urn */
  urn: Scalars["URN"]["output"];
};

/** Represents a sportsbook bet leg card */
export type BetLegCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The correspondent bet urn */
    betUrn: Scalars["URN"]["output"];
    /** Bet Leg */
    leg: BetLeg;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

export type BetLegMutation = {
  /** Mutation details eg. Score of game when leg was frozen */
  details: Maybe<Array<Maybe<BetLegMutationDetails>>>;
  /** Mutation eligibility */
  eligibility: Maybe<Array<Maybe<BetLegMutationEligibility>>>;
};

export type BetLegMutationDetails = {
  /** Details at the time the leg was frozen, current score etc. */
  freezeDetails: Maybe<LiveGameData>;
};

export type BetLegMutationEligibility = {
  /** Mutation Eligibility Details eg. current game score */
  details: Maybe<BetLegMutationEligibilityDetails>;
  /** Mutation eg. AccaFreeze */
  mutation: Maybe<BetLegMutationType>;
  /** Mutation Availability eg. Suspended, Available etc. */
  mutationAvailability: Maybe<Scalars["String"]["output"]>;
};

export type BetLegMutationEligibilityDetails = {
  /** Game details such as current score etc. */
  gameDetails: Maybe<LiveGameData>;
};

export enum BetLegMutationType {
  AccaFreeze = "AccaFreeze",
  None = "None",
}

export type BetMutation = {
  /** Mutation Eligibilities eg. AccaFreeze */
  eligibility: Maybe<Array<Maybe<BetMutationEligibility>>>;
};

export type BetMutationEligibility = {
  mutation: Maybe<BetMutationEligibilityType>;
};

export enum BetMutationEligibilityType {
  AccaFreeze = "AccaFreeze",
  None = "None",
}

/** Represents a promo card of type betting opportunity */
export type BetOpportunityPromoCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card action */
    action: PromoNavigationAction;
    /** The ladders levels */
    ladderLevels: Maybe<Array<Maybe<PphPromotionLaddersLevels>>>;
    /** The card image */
    promoImage: PromoImage;
    /** The card sub title */
    subTitle: Maybe<Scalars["String"]["output"]>;
    /** The card T&Cs */
    termsAndConditions: Maybe<PromoTermsAndConditions>;
    /** The card theme (light or dark) */
    theme: PromoTheme;
    /** The card title */
    title: Scalars["String"]["output"];
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

export type BetPlacementDetails = {
  betDetails: Maybe<BetDetails>;
  id: Scalars["String"]["output"];
  result: Result;
};

/** Represents a Bet Sharing Card Group */
export type BetSharingCardGroup = CardGroup &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The corresponding sportsbook bet */
    bet: SportsbookBet;
    /** The card group items */
    items: BetSharingCardGroupItemConnection;
    /** The card group urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a connection between BetSharingCardGroup and [BetSharingCardGroupItem] */
export type BetSharingCardGroupItemConnection = {
  edges: Array<Maybe<BetSharingCardGroupItemEdge>>;
};

/** Represents a BetSharingCardGroupItem edge */
export type BetSharingCardGroupItemEdge = {
  node: ViewItem;
};

export type BettingOpportunitySelection = {
  /** The selection's sportsbook market */
  market: SportsbookMarket;
  /** The selection's race runner, if the market has a race hierarchy */
  raceRunner: Maybe<RaceRunner>;
  /** The selection's runner */
  runner: Runner;
  runnerLiveData: Maybe<SportsbookRunnerLiveData>;
};

export enum BettingOpportunityType {
  BoostedBets = "BOOSTED_BETS",
  CreatedBets = "CREATED_BETS",
  Entity = "ENTITY",
  ManualMultiples = "MANUAL_MULTIPLES",
  Popular = "POPULAR",
  PopularMultiples = "POPULAR_MULTIPLES",
}

/** Represents a Blurb */
export type Blurb = InformativeBlurb;

/** Represents a Blurb Card */
export type BlurbCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    blurb: Blurb;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents My Account banner body content */
export type BodyContent = {
  /** Banner contact us information */
  contactUsInfo: Maybe<ContactUsInfo>;
  /** Banner form content */
  formContent: Maybe<FormContent>;
  /** The banner items */
  items: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  /** The body text */
  text: Maybe<Scalars["String"]["output"]>;
};

export type BothTeamsToScore = {
  percentage: Maybe<Scalars["Int"]["output"]>;
};

/** Represents the bottom bar */
export type BottomBar = {
  /** Represents if the bottom bar contains the product switcher */
  hasProductSwitcher: Maybe<Scalars["Boolean"]["output"]>;
  /** The bottom bar sections */
  sections: Maybe<Array<Maybe<BottomBarSection>>>;
  urn: Scalars["URN"]["output"];
};

/** Represents a bottom bar section */
export type BottomBarSection = {
  /** The section label translation key */
  label: Maybe<DisplayNameTranslationKey>;
  /** The bottom bar section type */
  sectionType: Maybe<Scalars["String"]["output"]>;
  /** The bottom bar section connected view link */
  viewLink: Maybe<ViewLink>;
};

export type BrandSetting = {
  /** The brand setting's state of activity, on or off */
  isActive: Scalars["Boolean"]["output"];
  /** The unique name of the brand setting */
  name: Scalars["String"]["output"];
};

/** A breadcrumb item representing a point in the betting hierarchy */
export type Breadcrumb =
  | CompetitionBreadcrumb
  | EventBreadcrumb
  | HomeBreadcrumb
  | MarketBreadcrumb
  | RaceBreadcrumb
  | SportBreadcrumb;

/** Represents the Breadcrumbs */
export type BreadcrumbsCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The list of breadcrumb items */
    items: Array<Breadcrumb>;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

export type Broadcasts = {
  dataVizUrl: Maybe<Scalars["String"]["output"]>;
  liveVideoUrl: Maybe<Scalars["String"]["output"]>;
};

export type BroadcastsAndStatisticsCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    broadcasts: Maybe<Broadcasts>;
    isCollapsed: Maybe<Scalars["Boolean"]["output"]>;
    sportevent: SportsEvent;
    statisticsViewLink: Maybe<ViewLink>;
    urn: Scalars["URN"]["output"];
  };

export type BroadcastsCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    broadcasts: Broadcasts;
    event: Maybe<SportsEvent>;
    isCollapsed: Scalars["Boolean"]["output"];
    race: Maybe<Race>;
    urn: Scalars["URN"]["output"];
  };

/** Represents the Browse view */
export type BrowseView = View & {
  /** The bottom bar */
  bottomBar: Maybe<BottomBar>;
  /** The view category */
  category: Maybe<ViewCategory>;
  /** The layout items on the view */
  items: ViewItemsConnection;
  /** The left side bar */
  leftSidebar: Maybe<LeftSidebar>;
  /** The regulatory data used for the regulatory header */
  regulatoryData: Maybe<RegulatoryData>;
  /** The view title */
  title: Maybe<Scalars["String"]["output"]>;
  /** The view url */
  url: Scalars["URL"]["output"];
  /** The view urn */
  urn: Scalars["URN"]["output"];
  /** The xsell bar */
  xsellBar: Maybe<XSellBar>;
};

/** Possible category type limits */
export enum BudgetCategory {
  /** Net Deposit Limit */
  Ndl = "NDL",
  NdlAff = "NDL_AFF",
  NdlAmlcdd = "NDL_AMLCDD",
  NdlReactivation = "NDL_REACTIVATION",
  NdlSgi = "NDL_SGI",
  NdlU25 = "NDL_U25",
  NdlVulnerability = "NDL_VULNERABILITY",
  /** Personal Deposit Limit */
  Pdl = "PDL",
}

/** Represents a budget card that holds a limit section */
export type BudgetLimit = {
  /** The limit amount */
  amount: Scalars["Float"]["output"];
  /** The limit category type */
  category: BudgetCategory;
  /** If it is the next breachable limit */
  nextBreachable: Scalars["Boolean"]["output"];
  /** The remaining amount */
  remain: Scalars["Float"]["output"];
  /** When limit will reset */
  reset: Scalars["String"]["output"];
};

/** Represents budgets card with limits section */
export type BudgetLimitsCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The section with budget limits */
    limits: Maybe<Array<Maybe<BudgetLimit>>>;
    /** The budgets card urn */
    urn: Scalars["URN"]["output"];
  };

export type BuyInDetails = {
  boughtIn: Maybe<Scalars["Int"]["output"]>;
  buyInMaxValue: Maybe<Scalars["Float"]["output"]>;
  buyInMinValue: Maybe<Scalars["Float"]["output"]>;
  intervals: Maybe<Array<Maybe<BuyInDetailsIntervals>>>;
};

export type BuyInDetailsIntervals = {
  amount: Maybe<Scalars["Float"]["output"]>;
  max: Scalars["Float"]["output"];
  min: Scalars["Float"]["output"];
  percentage: Maybe<Scalars["Float"]["output"]>;
};

/** Represents the by time range filters input */
export type ByTimeRangeFilterBy = {
  /** The countries URN list */
  countries: InputMaybe<Array<Scalars["URN"]["input"]>>;
};

export type ByTimeRangeMeetingCardGroup = CardGroup &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card group display Name for translations */
    displayName: Maybe<DisplayNameTranslationKey>;
    /** The card group icon */
    icon: Maybe<Image>;
    /** The card group items */
    items: ByTimeRangeMeetingCardGroupItemsConnection;
    /** The card group title */
    title: Maybe<Scalars["String"]["output"]>;
    /** The card group urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a ByTimeRangeMeetingCardGroup edge */
export type ByTimeRangeMeetingCardGroupItemEdge = {
  node: Card;
};

/** Represents a connection between ByTimeRangeMeetingCardGroup and [Card] */
export type ByTimeRangeMeetingCardGroupItemsConnection = {
  edges: Array<Maybe<ByTimeRangeMeetingCardGroupItemEdge>>;
};

export type ByTimeRangeOptions = {
  countriesFilter: Maybe<CountriesFilter>;
};

export type Cadence = {
  default: PlayStateCadence;
  sports: Maybe<Array<Maybe<SportPlayStateCadence>>>;
};

/** Represents a Card */
export type Card = {
  /** The card urn */
  urn: Scalars["URN"]["output"];
};

export type CardEdge = {
  cursor: Maybe<Scalars["String"]["output"]>;
  node: Card;
};

/** Represents a card group */
export type CardGroup = {
  /** The card group urn */
  urn: Scalars["URN"]["output"];
};

export type CardIncident = {
  cardType: Maybe<CardIncidentType>;
  player: Maybe<FootballPlayer>;
  side: Maybe<FixtureTeamSide>;
};

export enum CardIncidentType {
  Red = "RED",
  Yellow = "YELLOW",
  YellowRed = "YELLOW_RED",
}

/** Represents the products cashout quotes */
export type CashoutQuotes = {
  /** The exchange cashout quotes */
  exchangeCashoutQuotes: Maybe<Array<ExchangeCashoutQuote>>;
};

/** Represents a card with CdV progress information */
export type CdvTrackerCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** @deprecated expired experiment - remove in the next major release */
    progress: PromotionTrackerProgress;
    /** @deprecated expired experiment - remove in the next major release */
    promotion: PphPromotion;
    /**
     * The card urn
     * @deprecated expired experiment - remove in the next major release
     */
    urn: Scalars["URN"]["output"];
  };

export type CheckEligibilityResponse = {
  /** Eligibility result per bet */
  results: Array<BetEligibility>;
};

export enum CheckSocialProfileUsernameErrorCode {
  UsernameAlreadyTaken = "USERNAME_ALREADY_TAKEN",
  UsernameConsecutiveUnderscores = "USERNAME_CONSECUTIVE_UNDERSCORES",
  UsernameEmpty = "USERNAME_EMPTY",
  UsernameEndsWithUnderscore = "USERNAME_ENDS_WITH_UNDERSCORE",
  UsernameInvalidCharacters = "USERNAME_INVALID_CHARACTERS",
  UsernameInvalidStart = "USERNAME_INVALID_START",
  UsernameLengthInvalid = "USERNAME_LENGTH_INVALID",
  UsernameNotAvailable = "USERNAME_NOT_AVAILABLE",
}

export type CheckSocialProfileUsernameInput = {
  /** Desired username for the social profile */
  username: Scalars["String"]["input"];
};

export type CheckSocialProfileUsernameResult = {
  /** Machine-readable error codes indicating why the username is invalid or unavailable (empty when valid) */
  errorCodes: Array<CheckSocialProfileUsernameErrorCode>;
  /** Whether the username is valid and available */
  valid: Scalars["Boolean"]["output"];
};

export type Clock = {
  minute: Maybe<Scalars["Int"]["output"]>;
  second: Maybe<Scalars["Int"]["output"]>;
};

export type CombinedBetDefinitionResult = {
  details: Maybe<ImplyDetails>;
  legs: Array<CombinedBetLegsDefinitionResult>;
  result: ObbResult;
};

export type CombinedBetLegsDefinitionResult = {
  baseExpressionTemplateDefinitions: Maybe<Array<BaseExpressionTemplateDefinitions>>;
  betDefinitions: Array<Scalars["String"]["output"]>;
  eventId: Maybe<EventId>;
  expressionParams: Maybe<ExpressionParams>;
  expressionTemplateId: Maybe<Scalars["String"]["output"]>;
  result: ObbResult;
};

export enum ComparisonEnum {
  Equal = "EQUAL",
  GreaterThan = "GREATER_THAN",
  GreaterThanOrEqual = "GREATER_THAN_OR_EQUAL",
  LessThan = "LESS_THAN",
  LessThanOrEqual = "LESS_THAN_OR_EQUAL",
}

/** Represents a PPB competition */
export type Competition = {
  /** The competition id */
  competitionId: Scalars["Int"]["output"];
  /** The competition country */
  country: Maybe<Country>;
  /** The competition logo */
  logo: Maybe<Image>;
  /** The competition name */
  name: Scalars["String"]["output"];
  /** The competition sport */
  sport: Sport;
  /** The competition urn */
  urn: Scalars["URN"]["output"];
};

/** Breadcrumb for a Competition */
export type CompetitionBreadcrumb = {
  /** The competition view */
  competitionView: CompetitionView;
};

export type CompetitionGroup = {
  competitions: Array<Competition>;
  country: Country;
};

/** Represents a country/region with competitions */
export type CompetitionRegion = {
  /** The competition view links */
  competitionViewLinks: Array<CompetitionViewLink>;
  /** The country */
  country: Country;
};

/** Represents a card with competitions grouped by country/region */
export type CompetitionRegionCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The countries/regions where competitions will be grouped */
    competitionRegions: Array<CompetitionRegion>;
    /** The all countries card urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a View related to a Competition */
export type CompetitionView = View & {
  /** The bottom bar */
  bottomBar: Maybe<BottomBar>;
  /** The canonical url on the view */
  canonicalUrl: Maybe<Scalars["String"]["output"]>;
  /** The view category */
  category: Maybe<ViewCategory>;
  /** The view related competition */
  competition: Competition;
  /** The layout items on the view */
  items: ViewItemsConnection;
  /** The left side bar */
  leftSidebar: Maybe<LeftSidebar>;
  /** The regulatory data used for the regulatory header */
  regulatoryData: Maybe<RegulatoryData>;
  /** The view title */
  title: Maybe<Scalars["String"]["output"]>;
  /** The view url */
  url: Scalars["URL"]["output"];
  /** The view urn */
  urn: Scalars["URN"]["output"];
  /** The xsell bar */
  xsellBar: Maybe<XSellBar>;
};

/** Represents a View related to a Competition */
export type CompetitionViewItemsArgs = {
  autoPageSize: InputMaybe<Scalars["Boolean"]["input"]>;
  first: InputMaybe<Scalars["Int"]["input"]>;
};

/** TODO deprecated: use view link instead */
export type CompetitionViewLink = {
  /** The competition entity */
  competition: Competition;
  /** The competition view link urn */
  urn: Scalars["URN"]["output"];
  /** The view link */
  viewLink: ViewLink;
};

/** Represents a card that provides a connection to a competition view */
export type CompetitionViewLinkCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card connected competition */
    competition: Competition;
    /** The card urn */
    urn: Scalars["URN"]["output"];
    /** The card connected view link */
    viewLink: ViewLink;
  };

export type CompetitionsFilter = {
  allCompetitions: Array<CompetitionGroup>;
  defaultOptions: Maybe<Array<Competition>>;
  topCompetitions: Array<Competition>;
  urn: Scalars["URN"]["output"];
};

/** Represents a Confirm Cashout Preference */
export type ConfirmCashoutPreference = Preference & {
  /** The selected should confirm cashout configuration */
  shouldConfirmCashout: Scalars["Boolean"]["output"];
  /** The confirm cashout preference urn */
  urn: Scalars["URN"]["output"];
};

/** Represents a confirm cashout preference input interface */
export type ConfirmCashoutPreferenceInput = {
  /** The confirm cashout preference urn */
  urn: Scalars["URN"]["input"];
  /** The confirm cashout preference new value */
  value: Scalars["Boolean"]["input"];
};

/** Represents a Confirm Exchange Bet Placement Preference */
export type ConfirmExchangeBetPlacementPreference = Preference & {
  /** The selected should confirm cashout configuration */
  shouldConfirmBetPlacement: Scalars["Boolean"]["output"];
  /** The confirm exchange bet placement preference urn */
  urn: Scalars["URN"]["output"];
};

/** Represents My Account banner contact us info */
export type ContactUsInfo = {
  /** Contact us label */
  label: Maybe<Scalars["String"]["output"]>;
  /** Contact us link */
  link: Maybe<Scalars["String"]["output"]>;
};

/** Represents a content summary card */
export type ContentSummaryCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card sections */
    sections: Array<ContentSummarySection>;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** The content summary group link */
export type ContentSummaryGroupLinkItem = {
  /** The content summary group link items */
  items: Array<ContentSummaryLinkItem>;
  /** The content summary group link subtitle */
  subtitle: Scalars["String"]["output"];
};

export type ContentSummaryItem = ContentSummaryGroupLinkItem | ContentSummaryTextItem;

/**
 * The content summary section link item
 * TODO #THISISF-106
 */
export type ContentSummaryLinkItem = {
  /** The content summary link item alignment */
  alignment: RegulatoryItemAlignment;
  /** The content summary link item text */
  text: Scalars["String"]["output"];
  /** The content summary link item view link */
  viewLink: ViewLink;
};

/** The content summary card section */
export type ContentSummarySection = {
  /** The breadcrumbs for the current view hierarchy */
  breadcrumbs: Maybe<BreadcrumbsCard>;
  /** The content summary section includeToFaq */
  includeToFaq: Maybe<Scalars["Boolean"]["output"]>;
  /** The content summary section items */
  items: Array<ContentSummaryItem>;
  /** The content summary section type */
  sectionType: RegulatorySectionType;
  /** The content summary section title */
  title: Scalars["String"]["output"];
};

/**
 * The content summary text item
 * TODO #THISISF-106
 */
export type ContentSummaryTextItem = {
  /** The content summary text item alignment */
  alignment: RegulatoryItemAlignment;
  /** The content summary text item body text */
  text: Scalars["String"]["output"];
};

/** Possible response codes for copy mutation */
export enum CopyTipCode {
  GeneralFailure = "GENERAL_FAILURE",
  Success = "SUCCESS",
  TipExpired = "TIP_EXPIRED",
  TipNotFound = "TIP_NOT_FOUND",
}

/** Represents the result of a copy mutation */
export type CopyTipResult = {
  /** Operation result code */
  code: CopyTipCode;
};

/** Represents a Correct Score Market Card */
export type CorrectScoreCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The sportsbook market */
    market: SportsbookMarket;
    /** The number of items to display */
    numberOfItemsToDisplay: Maybe<Scalars["Int"]["output"]>;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a country filter */
export type CountriesFilter = {
  availableOptions: Array<CountriesFilterOption>;
  /** Represents the default option for the filter */
  defaultOptions: Maybe<Array<CountriesFilterOption>>;
  /** The filter urn */
  urn: Scalars["URN"]["output"];
};

export type CountriesFilterOption = {
  name: Scalars["String"]["output"];
  urn: Scalars["URN"]["output"];
};

/** Represents a country with an alpha-3 iso code and respective flag */
export type Country = {
  /** The country alpha 3 iso region code */
  code: Scalars["String"]["output"];
  /** The country flag */
  flag: Maybe<Image>;
  /** The country urn */
  urn: Scalars["URN"]["output"];
};

/** Represents a card with a coupon header */
export type CouponHeaderCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card columns */
    columns: Maybe<Array<Scalars["String"]["output"]>>;
    /** The competition entity */
    competition: Competition;
    /** The competition view link */
    competitionViewLink: ViewLink;
    /** The hasStats Boolean */
    hasStats: Scalars["Boolean"]["output"];
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

export type CreateSocialProfileInput = {
  /** Desired avatar id for the social profile */
  avatarId: Scalars["String"]["input"];
  /** Desired username for the social profile */
  username: Scalars["String"]["input"];
};

export type Crest = {
  large: Maybe<Scalars["String"]["output"]>;
  medium: Maybe<Scalars["String"]["output"]>;
  small: Maybe<Scalars["String"]["output"]>;
  vector: Maybe<Scalars["String"]["output"]>;
};

export type CricketFixture = Fixture & {
  /** Current team batting */
  currentTeamBatting: Maybe<TeamSide>;
  /** Current time */
  currentTime: Maybe<CricketTime>;
  /** If the score should be display in american format */
  isAmericanFormat: Scalars["Boolean"]["output"];
  /** The fixture main market home away runner names */
  runnerNames: Maybe<FixtureRunnerNames>;
  /** Score of the current fixture */
  score: Maybe<CricketScore>;
  /** The sport event */
  sportevent: SportsEvent;
  /** The fixture urn */
  urn: Scalars["URN"]["output"];
};

export type CricketInning = {
  /** Inning number */
  inningNumber: Maybe<Scalars["Int"]["output"]>;
  /** Number of runs made by the team */
  runs: Maybe<Scalars["Int"]["output"]>;
  /** Number of wickets lost by the batting team */
  wickets: Maybe<Scalars["Int"]["output"]>;
};

export type CricketScore = {
  /** Away team runs and wickets per inning */
  away: Maybe<Array<Maybe<CricketInning>>>;
  /** Home team runs and wickets per inning */
  home: Maybe<Array<Maybe<CricketInning>>>;
};

export type CricketTime = {
  /** Current inning being played */
  inning: Maybe<Scalars["Int"]["output"]>;
  /** Number of the current over */
  over: Maybe<Scalars["Int"]["output"]>;
};

export type CustomLogo = {
  image: GameImage;
  name: Maybe<Scalars["String"]["output"]>;
};

export type DartsFixture = Fixture & {
  /** Current Set Information (only available if type is SETS) */
  currentSet: Maybe<DartsSet>;
  /** If the score should be display in american format */
  isAmericanFormat: Scalars["Boolean"]["output"];
  /** Ordered set information of completed sets (only available if type is SETS) */
  previousSets: Maybe<Array<Maybe<DartsSet>>>;
  /** The fixture main market home away runner names */
  runnerNames: Maybe<FixtureRunnerNames>;
  /**
   * The main score of the match.
   * If type is LEGS, this represents legs won.
   * If type is SETS, this represents sets won.
   */
  score: Maybe<DartsScore>;
  /** The sport event */
  sportevent: SportsEvent;
  /** The type of scoring for this match (LEGS or SETS) */
  type: Maybe<DartsFixtureType>;
  /** The fixture urn */
  urn: Scalars["URN"]["output"];
};

export enum DartsFixtureType {
  Legs = "LEGS",
  Sets = "SETS",
}

export type DartsScore = {
  /** Away team score */
  away: Scalars["Int"]["output"];
  /** Home team score */
  home: Scalars["Int"]["output"];
};

export type DartsSet = {
  /** Number of the set */
  number: Scalars["Int"]["output"];
  /** Legs score within this set */
  score: DartsScore;
};

export type DateRangeFilter = {
  availableOptions: Array<DateRangeFilterOption>;
  defaultOption: Maybe<DateRangeFilterOption>;
  urn: Scalars["URN"]["output"];
};

export type DateRangeFilterOption = {
  title: DisplayName;
  urn: Scalars["URN"]["output"];
};

export type DecimalOdds = {
  decimalOdds: Maybe<Scalars["Float"]["output"]>;
};

/** The possible values of the default product preference */
export enum DefaultProduct {
  Exchange = "EXCHANGE",
  LastViewed = "LAST_VIEWED",
  Sportsbook = "SPORTSBOOK",
}

/** Represents a Default Product Preference */
export type DefaultProductPreference = Preference & {
  /** Available default product preference options */
  defaultProductOptions: Array<DefaultProduct>;
  /** The selected default product preference option */
  selectedDefaultProduct: DefaultProduct;
  /** The default product preference urn */
  urn: Scalars["URN"]["output"];
};

/** Represents a default product preference input interface */
export type DefaultProductPreferenceInput = {
  /** The default product preference urn */
  urn: Scalars["URN"]["input"];
  /** The default product preference new value */
  value: DefaultProduct;
};

export type Dimension = {
  height: Scalars["Int"]["output"];
  width: Scalars["Int"]["output"];
};

export enum DisplayMode {
  BlankBrowser = "BLANK_BROWSER",
  BlankInapp = "BLANK_INAPP",
  BlankWebview = "BLANK_WEBVIEW",
  SelfBrowser = "SELF_BROWSER",
  SelfInapp = "SELF_INAPP",
  SelfWebview = "SELF_WEBVIEW",
}

/** Represents the types that DisplayName can contain */
export type DisplayName = DisplayNameTitle | DisplayNameTranslationKey;

/** Represents a DisplayNameTitle */
export type DisplayNameTitle = {
  name: Scalars["String"]["output"];
};

/** Represents a DisplayNameTranslationKey */
export type DisplayNameTranslationKey = {
  translationKey: Scalars["String"]["output"];
};

export type DisplayOdds = {
  decimalOdds: Maybe<DecimalOdds>;
  fractionalOdds: Maybe<FractionalOdds>;
};

export type DisplayRunners = {
  exchange: Maybe<DisplayRunnersDefinition>;
  sportsbook: Maybe<DisplayRunnersDefinition>;
};

export type DisplayRunnersDefinition = {
  market: Market;
  runners: Array<Runner>;
};

export type Distance = {
  furlongs: Scalars["Float"]["output"];
  miles: Scalars["Float"]["output"];
  totalFurlongs: Scalars["Float"]["output"];
  totalMeters: Scalars["Float"]["output"];
  yards: Scalars["Float"]["output"];
};

export type EmsTipPart = {
  /** Event identifier */
  eventId: Scalars["String"]["output"];
  /** Event start time */
  eventStartTime: Scalars["String"]["output"];
  /** Whether this leg is eligible for Super Sub */
  isSuperSubEligible: Scalars["Boolean"]["output"];
  /** Market identifier */
  marketId: Scalars["String"]["output"];
  /** Market type */
  marketType: Scalars["String"]["output"];
  /** Additional metadata */
  metadata: TipPartMetadata;
  /** Unique part identifier */
  partId: Scalars["String"]["output"];
  /** Selection identifier */
  selectionId: Scalars["String"]["output"];
  /** Sport identifier */
  sportId: Scalars["String"]["output"];
};

/** Represents a EachWayFactor */
export type EachWayFactor = {
  /** The factor denominator */
  denominator: Scalars["Int"]["output"];
  /** The factor numerator */
  numerator: Scalars["Int"]["output"];
};

/** Represents the possible actions for editorial mini promo cards */
export type EditorialPromoActions = PromoInlineNavigationAction | PromoNavigationAction;

/** Represents a promo card of type Editorial */
export type EditorialPromoCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card action */
    action: Maybe<PromoNavigationAction>;
    /** The card image */
    promoImage: PromoImage;
    /** The card promo tag */
    promoTag: Maybe<PromoTag>;
    /** The card sub title */
    subTitle: Maybe<Scalars["String"]["output"]>;
    /** The card terms and conditions */
    termsAndConditions: Maybe<PromoTermsAndConditions>;
    /** The card theme (light or dark) */
    theme: PromoTheme;
    /** The card title */
    title: Scalars["String"]["output"];
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

export enum EligibilityCode {
  AlreadyShared = "ALREADY_SHARED",
  EventStarted = "EVENT_STARTED",
  GeneralFailure = "GENERAL_FAILURE",
  Shareable = "SHAREABLE",
  TipRemovedRiskRestricted = "TIP_REMOVED_RISK_RESTRICTED",
  UnsupportedBetType = "UNSUPPORTED_BET_TYPE",
}

export type EmbeddedContentCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card title */
    title: DisplayName;
    /** The video URL */
    url: Scalars["URL"]["output"];
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a card that will render an iframe/WebView */
export type EmbeddedViewCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    appEnv: Maybe<Scalars["String"]["output"]>;
    text: Scalars["String"]["output"];
    url: Scalars["String"]["output"];
    urn: Scalars["URN"]["output"];
  };

/** Breadcrumb for an Event */
export type EventBreadcrumb = {
  /** The event view */
  eventView: EventView;
};

/** Represents a Market Context with an Event and a Competition */
export type EventCompetitionHierarchy = {
  /** The market competition */
  competition: Competition;
  /** The market sport event */
  sportevent: SportsEvent;
};

/** Represents a card with a generic event header */
export type EventHeaderCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card event date (ISO format) */
    date: Maybe<Scalars["String"]["output"]>;
    /** The link to the race results page */
    raceResultsLink: Maybe<Scalars["String"]["output"]>;
    /** The card event sportId */
    sportId: Maybe<Scalars["String"]["output"]>;
    /** The card subtitle */
    subtitle: Maybe<Scalars["String"]["output"]>;
    /** The card tertiary title */
    tertiaryTitle: Maybe<Scalars["String"]["output"]>;
    /** The card title */
    title: Scalars["String"]["output"];
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a Market Context with an Event and a Competition */
export type EventHierarchy = {
  /** The market sport event */
  sportevent: SportsEvent;
};

export type EventId = {
  id: Scalars["String"]["output"];
  supplier: Scalars["String"]["output"];
};

export type EventIdInput = {
  id: Scalars["String"]["input"];
  supplier: Supplier;
};

/** Represents a card with an event dual market */
export type EventMarketCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card badge */
    badge: Maybe<Badge>;
    /**
     * The default market index
     * @deprecated is always 0
     */
    defaultIndex: Scalars["Int"]["output"];
    /** The card markets sorted for both exchange and sportsbook */
    displayRunners: DisplayRunners;
    /** The card connected event view link */
    eventViewLink: ViewLink;
    /** The connected sports event fixture */
    fixture: Fixture;
    isAccaFreezeEligible: Maybe<Scalars["Boolean"]["output"]>;
    /** Indicates if the event is eligible for super sub */
    isSuperSubEligible: Maybe<Scalars["Boolean"]["output"]>;
    /** The card connected market view link */
    marketViewLinks: Array<ViewLink>;
    /** Market promotion (Extra places and Money Back) */
    promotion: Maybe<MarketPromo>;
    /** The view links to all selections for this market */
    runnerViewLinks: Array<RunnerViewLink>;
    /** The connected sports event */
    sportevent: SportsEvent;
    /** The connected stats pebble group */
    statsPebble: Maybe<StatsPebbleCardGroup>;
    /** The tab button that redirects to the event view tab */
    tabLink: Maybe<TabLink>;
    /** The card title */
    title: Scalars["String"]["output"];
    /** The card urn */
    urn: Scalars["URN"]["output"];
    /** The boolean flag for live video */
    videoAvailable: Scalars["Boolean"]["output"];
  };

export type EventParticipantsRequestInput = {
  event: Scalars["URN"]["input"];
  incidentType: Scalars["String"]["input"];
  period: Scalars["String"]["input"];
};

/**
 * Represents a card with a sports event match stats information retrieved from BVP (Betfair Video Player)
 *
 * This is supposed to be a temporary "quick win" for world cup and should then be replaced by SCA in the future
 */
export type EventStatsCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The match stats URL */
    matchStatsUrl: Scalars["String"]["output"];
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a View related to a Sports Event */
export type EventView = View & {
  /** The bottom bar */
  bottomBar: Maybe<BottomBar>;
  /** The layout items on the view */
  canonicalUrl: Maybe<Scalars["String"]["output"]>;
  /** The view category */
  category: Maybe<ViewCategory>;
  /** The layout items on the view */
  items: ViewItemsConnection;
  /** The left side bar */
  leftSidebar: Maybe<LeftSidebar>;
  /** The regulatory data used for the regulatory header */
  regulatoryData: Maybe<RegulatoryData>;
  /** The view related sports event */
  sportevent: SportsEvent;
  /** The view title */
  title: Maybe<Scalars["String"]["output"]>;
  /** The view url */
  url: Scalars["URL"]["output"];
  /** The view urn */
  urn: Scalars["URN"]["output"];
  /** The xsell bar */
  xsellBar: Maybe<XSellBar>;
};

/** Represents a View related to a Sports Event */
export type EventViewItemsArgs = {
  after: InputMaybe<Scalars["String"]["input"]>;
  autoPageSize: InputMaybe<Scalars["Boolean"]["input"]>;
  first: InputMaybe<Scalars["Int"]["input"]>;
};

/** Represents a card that provides a connection to an event view */
export type EventViewLinkCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card connected sport event fixture */
    fixture: Maybe<Fixture>;
    /** The card connected sport event */
    sportevent: SportsEvent;
    /** The card urn */
    urn: Scalars["URN"]["output"];
    /** The card connected view link */
    viewLink: ViewLink;
  };

/** Represents an exchange bet outcome */
export enum ExchangeBetOutcome {
  Lost = "LOST",
  Placed = "PLACED",
  Won = "WON",
}

/** Represents a exchange cashout quote */
export type ExchangeCashoutQuote = {
  /** The cashout quote current liability */
  currentLiability: Maybe<Scalars["Float"]["output"]>;
  /** The market bet URN */
  marketBetURN: Scalars["URN"]["output"];
  /** The cashout quote exchange market urn */
  marketURN: Scalars["URN"]["output"];
  /** The cashout quote profit */
  profit: Maybe<Scalars["Float"]["output"]>;
  /** The cashout quote status */
  status: ExchangeCashoutQuoteStatus;
  /** The cashout quote urn */
  urn: Scalars["URN"]["output"];
  /** The cashout quote value */
  value: Maybe<Scalars["Float"]["output"]>;
};

/** Possible values for an exchange cashout quote status */
export enum ExchangeCashoutQuoteStatus {
  /** Quote available */
  Available = "AVAILABLE",
  /** Quote Fail */
  Fail = "FAIL",
  /** Quote late withdrawal */
  LateWithdrawal = "LATE_WITHDRAWAL",
  /** Quote unavailable */
  Unavailable = "UNAVAILABLE",
}

/** The possible values of the exchange default mode preference */
export enum ExchangeDefaultMode {
  Default = "DEFAULT",
  Predicts = "PREDICTS",
}

/** Represents an Exchange Default Mode Preference */
export type ExchangeDefaultModePreference = Preference & {
  /** Available exchange default mode preference options */
  exchangeDefaultModeOptions: Array<ExchangeDefaultMode>;
  /** The selected exchange default mode preference option */
  selectedExchangeDefaultMode: Maybe<ExchangeDefaultMode>;
  /** The exchange default mode preference urn */
  urn: Scalars["URN"]["output"];
};

/** Represents an exchange default mode preference input interface */
export type ExchangeDefaultModePreferencesInput = {
  /** The exchange default mode preference urn */
  urn: Scalars["URN"]["input"];
  /** The exchange default mode preference new value */
  value: InputMaybe<ExchangeDefaultMode>;
};

/** The possible values of the exchange default product preference */
export enum ExchangeDefaultProduct {
  Ems = "EMS",
  Neme = "NEME",
  Unassigned = "UNASSIGNED",
}

/** Represents a Exchange Default Product Preference */
export type ExchangeDefaultProductPreference = Preference & {
  /** Available exchange default product preference options */
  exchangeDefaultProductOptions: Array<ExchangeDefaultProduct>;
  /** The selected exchange default product preferences option */
  selectedExchangeDefaultProduct: Maybe<ExchangeDefaultProduct>;
  /** The exchange default product preference urn */
  urn: Scalars["URN"]["output"];
};

/** Represents a exchange default product preference input interface */
export type ExchangeDefaultProductPreferencesInput = {
  /** The exchange default product preference urn */
  urn: Scalars["URN"]["input"];
  /** The exchange default product preference new value */
  value: InputMaybe<ExchangeDefaultProduct>;
};

/** Represents a PPB exchange market */
export type ExchangeMarket = {
  /** The market betting type */
  bettingType: Scalars["String"]["output"];
  /** The cashout quotes */
  cashoutQuotes: Maybe<Array<Maybe<ExchangeCashoutQuote>>>;
  /** The market each way divisor */
  eachWayDivisor: Maybe<Scalars["Int"]["output"]>;
  /** The market runners */
  exchangeRunners: Array<ExchangeRunner>;
  /** The context that might include competition, event, venue, race */
  hierarchy: MarketHierarchy;
  /** True if the market is inplay */
  inplay: Scalars["Boolean"]["output"];
  /**
   * The market live information
   * @deprecated Use the fields on this type instead
   */
  liveData: Maybe<ExchangeMarketLiveData>;
  /** The exchange market rules view link */
  marketRulesViewLink: Maybe<ViewLink>;
  /** The market status */
  marketStatus: ExchangeMarketStatus;
  /** The market market type */
  marketType: Scalars["String"]["output"];
  /** The market localized type name */
  marketTypeName: Maybe<Scalars["String"]["output"]>;
  /** The market name */
  name: Scalars["String"]["output"];
  /** The market number of runners */
  numberOfRunners: Maybe<Scalars["Int"]["output"]>;
  /** The market number of winners */
  numberOfWinners: Maybe<Scalars["Int"]["output"]>;
  /**
   * The market runners
   * @deprecated Use exchangeRunners instead
   */
  runners: Array<Runner>;
  /** The market sport */
  sport: Sport;
  /** The market total matched */
  totalMatched: Scalars["Float"]["output"];
  /** True if a market turns 'in play' at a kick off time, otherwise it is false */
  turnInPlayEnabled: Scalars["Boolean"]["output"];
  /** The market urn */
  urn: Scalars["URN"]["output"];
};

/** Represents a market high volatile information */
export type ExchangeMarketLiveData = {
  /**
   * The cashout quotes
   * @deprecated Use ExchangeMarket cashoutQuotes instead
   */
  cashoutQuotes: Array<Maybe<ExchangeCashoutQuote>>;
  /** The market status */
  exchangeMarketStatus: ExchangeMarketStatus;
  /** True if the market is inplay */
  inplay: Scalars["Boolean"]["output"];
  /** The market runners live data */
  runners: Array<Maybe<ExchangeRunnerLiveData>>;
  /** The market total matched */
  totalMatched: Scalars["Float"]["output"];
  /** True if a market turns 'in play' at a kick off time, otherwise it is false */
  turnInPlayEnabled: Scalars["Boolean"]["output"];
  /** The live data market urn */
  urn: Scalars["URN"]["output"];
};

/** Possible values for an exchange market status */
export enum ExchangeMarketStatus {
  /** A close market */
  Closed = "CLOSED",
  /** An open market */
  Open = "OPEN",
  /** A suspended market */
  Suspended = "SUSPENDED",
}

/** Represents an Exchange Odds Display Preference */
export type ExchangeOddsDisplayPreference = Preference & {
  /** The selected odds display format */
  selectedOddsDisplayFormat: OddsDisplayFormat;
  /** The exchange odds display preference urn */
  urn: Scalars["URN"]["output"];
};

/** Represents an exchange runner price */
export type ExchangePrice = {
  /** The exchange runner liquidity */
  liquidity: Scalars["Float"]["output"];
  /** The exchange runner odd */
  odd: Scalars["Float"]["output"];
};

/** Represents a Sportsbook runner */
export type ExchangeRunner = {
  /** The runner available back exchange prices */
  availableToBack: Array<ExchangePrice>;
  /** The runner available lay exchange prices */
  availableToLay: Array<ExchangePrice>;
  /** The runner best back exchange prices */
  back: Array<ExchangePrice>;
  /** The runner handicap */
  handicap: Scalars["Float"]["output"];
  /** The runner last traded price */
  lastPriceTraded: Maybe<Scalars["Float"]["output"]>;
  /** The runner best lay exchange prices */
  lay: Array<ExchangePrice>;
  /** The sportsbook market this runner belongs to */
  market: ExchangeMarket;
  /** The runner name */
  name: Scalars["String"]["output"];
  /** The runner result type */
  resultType: Maybe<Scalars["String"]["output"]>;
  /** The runner selection id */
  selectionId: Scalars["Int"]["output"];
  /** The total matched value for the runner */
  totalMatched: Maybe<Scalars["Float"]["output"]>;
  /** The runner traded exchange prices */
  traded: Array<ExchangePrice>;
  /** The runner urn */
  urn: Scalars["URN"]["output"];
};

/**
 * Wraps an exchange runner inside a card's curated runner view, paired with the
 * RunnerView the FE should link to. `runnerView` is null when no link should be
 * shown (e.g. unnamed favourite runners).
 */
export type ExchangeRunnerDisplayItem = {
  runner: ExchangeRunner;
  /** RunnerView to link to. Null when no view link should be rendered (e.g. unnamed favourite runners). */
  runnerView: Maybe<RunnerView>;
};

/** Represents an exchange runner volatile information */
export type ExchangeRunnerLiveData = {
  /** The runner available back exchange prices */
  availableToBack: Array<ExchangePrice>;
  /** The runner available lay exchange prices */
  availableToLay: Array<ExchangePrice>;
  /** The runner best back exchange prices */
  back: Array<ExchangePrice>;
  /** The runner handicap */
  handicap: Scalars["Float"]["output"];
  /** The runner last traded price */
  lastPriceTraded: Maybe<Scalars["Float"]["output"]>;
  /** The runner best lay exchange prices */
  lay: Array<ExchangePrice>;
  /** The runner selection id */
  selectionId: Scalars["Int"]["output"];
  /** The total matched value for the runner */
  totalMatched: Maybe<Scalars["Float"]["output"]>;
  /** The runner traded exchange prices */
  traded: Array<ExchangePrice>;
  /** The exchange runner live data urn */
  urn: Scalars["URN"]["output"];
};

/**
 * Curated, content-operator-defined view of an exchange market's runners on a card.
 * See SportsbookRunnersDisplay for the display-vs-original contract.
 */
export type ExchangeRunnersDisplay = {
  /**
   * Operator-configured cap on how many items the card renders in its collapsed state.
   * Informational: the FE uses this to truncate the runner list and render "N of M" affordances.
   * Null = no cap (render all).
   */
  displayLimit: Maybe<Scalars["Int"]["output"]>;
  /** Original exchange market — runner list and order untouched. */
  market: ExchangeMarket;
  /**
   * Curated runner list in the operator-defined / sort-service order.
   *
   * Default (no argument): returns the FULL curated list. The FE truncates to
   * `displayLimit` for the collapsed view.
   *
   * Pass `applyDisplayLimit: true` to receive only the first `displayLimit` items —
   * useful for surfaces that display the card in collapsed state only and want a lean payload.
   * When `displayLimit` is null, this argument has no effect and all items are returned.
   */
  runners: Array<ExchangeRunnerDisplayItem>;
  /**
   * Total number of curated runners, regardless of which `runners` variant was queried.
   * Use this to decide whether to show a Show More chevron when `applyDisplayLimit: true`
   * is passed — in that case `runners` only returns `displayLimit` items and the FE cannot
   * infer the total from `runners.length` alone. Also useful for "Showing N of M" affordances.
   */
  totalCount: Scalars["Int"]["output"];
};

/**
 * Curated, content-operator-defined view of an exchange market's runners on a card.
 * See SportsbookRunnersDisplay for the display-vs-original contract.
 */
export type ExchangeRunnersDisplayRunnersArgs = {
  applyDisplayLimit?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type ExchangeSettings = {
  currencyDetails: Maybe<ExchangeSettingsCurrencyDetails>;
  discount: Scalars["Float"]["output"];
};

export type ExchangeSettingsCurrencyDetails = {
  currencyCode: Scalars["String"]["output"];
  currencyId: Scalars["Float"]["output"];
  minBspLiability: Scalars["Float"]["output"];
  minStake: Scalars["Float"]["output"];
};

/** Represents an exchange side */
export enum ExchangeSide {
  Back = "BACK",
  Lay = "LAY",
}

export type ExpandableCardGroup = CardGroup &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    isExpandable: Maybe<Scalars["Boolean"]["output"]>;
    isExpanded: Maybe<Scalars["Boolean"]["output"]>;
    items: ExpandableCardGroupItemsConnection;
    /** The card group title */
    title: Maybe<Scalars["String"]["output"]>;
    /** The card group urn */
    urn: Scalars["URN"]["output"];
  };

export type ExpandableCardGroupItemsArgs = {
  first: InputMaybe<Scalars["Int"]["input"]>;
};

export type ExpandableCardGroupItemEdge = {
  cursor: Maybe<Scalars["String"]["output"]>;
  node: HighlightedSelectionCard;
};

export type ExpandableCardGroupItemsConnection = {
  edges: Array<Maybe<ExpandableCardGroupItemEdge>>;
  pageInfo: Maybe<PageInfo>;
};

/** Represents an expandable card with a market card */
export type ExpandableMarketCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The market card URN */
    marketCardURN: Scalars["URN"]["output"];
    /** The expandable market card title */
    title: Scalars["String"]["output"];
    /** The expandable market card URN */
    urn: Scalars["URN"]["output"];
    viewOpenBets: Maybe<ViewLink>;
  };

export type ExperimentVariant = {
  /**
   * The bucket of the experiment where the app has fallen into
   * @deprecated Value is always zero
   */
  bucket: Scalars["Float"]["output"];
  /** The unique experiment name */
  name: Scalars["String"]["output"];
  /** The current applied variant of the experiment to the app */
  variant: Scalars["String"]["output"];
};

/** The experiment definition */
export type ExperimentsInput = {
  /** The experiment id */
  id: Scalars["String"]["input"];
  /** The experiment variant */
  variant: Scalars["String"]["input"];
};

export type ExpressionComponents = {
  /** The left operand of the expression */
  leftOperand: Array<Operand>;
  /** The operator of the expression */
  operator: Scalars["String"]["output"];
  /** The right operand of the expression */
  rightOperand: Array<Operand>;
};

export type ExpressionInfo = {
  /** The components of the expression */
  expressionComponents: Maybe<ExpressionComponents>;
  /** The expressions metadata */
  expressionMetadata: Maybe<ExpressionMetadata>;
  /** The template parameters */
  params: Parameters;
  /** The expression result */
  result: Maybe<ResultEnum>;
  /** The sub expressions information */
  subExpressionInfos: Array<ExpressionInfo>;
  /** The template id */
  templateId: Scalars["String"]["output"];
  /** The template version */
  templateVersion: Scalars["Int"]["output"];
};

export type ExpressionMetadata = {
  /** The participants information */
  participants: Array<ExpressionParticipant>;
};

export type ExpressionParams = {
  baseBets: Array<Maybe<BaseBet>>;
  x: Scalars["Float"]["output"];
};

export type ExpressionParamsInput = {
  baseBets: InputMaybe<Array<BaseBetInput>>;
  outcomeId: InputMaybe<Scalars["String"]["input"]>;
  outcomeIds: InputMaybe<Array<Scalars["String"]["input"]>>;
  participantIdA: InputMaybe<Scalars["String"]["input"]>;
  participantIdB: InputMaybe<Scalars["String"]["input"]>;
  participantIds: InputMaybe<Array<Scalars["String"]["input"]>>;
  quantifier: InputMaybe<Scalars["String"]["input"]>;
  squadAParticipantIds: InputMaybe<Array<Scalars["String"]["input"]>>;
  squadBParticipantIds: InputMaybe<Array<Scalars["String"]["input"]>>;
  timePeriodId: InputMaybe<Scalars["String"]["input"]>;
  value: InputMaybe<Scalars["Int"]["input"]>;
  x: InputMaybe<Scalars["Float"]["input"]>;
};

export type ExpressionParticipant = {
  /** The participant id */
  id: Scalars["String"]["output"];
  /** The participant name */
  name: Maybe<Scalars["String"]["output"]>;
};

/** Represents an extra wallet */
export type ExtraWallet = {
  /** The wallet amount or the percentage of boost that the price boost token gives */
  amount: Scalars["Float"]["output"];
  /** The bonus wallet expiration date */
  expirationDate: Maybe<Scalars["String"]["output"]>;
  /** The fixed odds value associated with the token */
  fixedOdds: Maybe<Scalars["Float"]["output"]>;
  /** The amount of legs the user has to lose to get the bonus (only applicable to ghost leg tokens) */
  ghostLegs: Maybe<Scalars["Int"]["output"]>;
  /** The internal wallet id */
  id: Scalars["String"]["output"];
  /** The internal wallet id with index */
  indexedId: Maybe<Scalars["String"]["output"]>;
  /** The amount of legs the user has to lose to get the bonus (only applicable to acca insurance tokens) */
  lostLegs: Maybe<Scalars["Int"]["output"]>;
  /** The valid places for the promotion (only applicable to money back tokens) */
  maxFinPos: Maybe<Scalars["Float"]["output"]>;
  /** The maximum return of the bonus (only applicable to acca insurance tokens) */
  maxReturn: Maybe<Scalars["Float"]["output"]>;
  /** The extra wallet urn */
  urn: Scalars["URN"]["output"];
  /** The wallet type */
  walletType: Maybe<WalletTypes>;
};

/** Represents a Extra Wallet Card */
export type ExtraWalletCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The wallet associated badges */
    badges: Array<Maybe<Scalars["String"]["output"]>>;
    /** The corresponding wallet */
    extraWallet: ExtraWallet;
    /** The wallet associated restrictions */
    restrictions: Maybe<WalletRestrictions>;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a Extra Wallet Card Group */
export type ExtraWalletCardGroup = CardGroup &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The total amount of free bets bonus (sum of all individual wallets) */
    amount: Scalars["Float"]["output"];
    /** The url to the bonus page */
    bonusPageUrl: Maybe<Scalars["URL"]["output"]>;
    /** The url to free bets help page */
    helpUrl: Maybe<Scalars["String"]["output"]>;
    /** The layout items */
    items: ExtraWalletCardGroupConnection;
    /** The card group urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a connection between View and [ExtraWalletCardGroup] */
export type ExtraWalletCardGroupConnection = {
  edges: Array<Maybe<ExtraWalletCardGroupEdge>>;
};

/** Represents a ExtraWalletCardGroupConnection edge */
export type ExtraWalletCardGroupEdge = {
  node: ExtraWalletCardGroupItems;
};

/** Represents ExtraWalletCardGroup allowed edge Items */
export type ExtraWalletCardGroupItems = ExtraWalletCard;

/** Represents a Favorite sports Preference */
export type FavoriteSportsPreference = Preference & {
  /** The selected favorite sports preferences option */
  selectedFavoriteSports: Array<Sport>;
  /**
   * Available sports preferences options
   * @deprecated Not in use always an empty list
   */
  sportOptions: Array<Sport>;
  /** The favorite sports preference urn */
  urn: Scalars["URN"]["output"];
};

/** Represents a favorite sports preferences input interface */
export type FavoriteSportsPreferencesInput = {
  /** The favorite sports preference urn */
  urn: Scalars["URN"]["input"];
  /** The favorite sports preference new value */
  value: InputMaybe<Array<Scalars["URN"]["input"]>>;
};

/** Represents the Favourite Markets count metadata */
export type FavouriteMarketsCountMetadata = {
  /** The current favourites count */
  currentCount: Scalars["Int"]["output"];
  /** The favourites limit */
  limit: Scalars["Int"]["output"];
  /** The metadata count URN */
  urn: Scalars["URN"]["output"];
};

/** Represents the Favourite Markets metadata */
export type FavouriteMarketsMetadata = {
  /** The Favourite Markets limit and current count for a sport */
  sport: FavouriteMarketsCountMetadata;
  /** The Favourite Markets total limit and current count */
  total: FavouriteMarketsCountMetadata;
};

/** Represents a navigation tab that will contain the users favourite content sections */
export type FavouriteMarketsNavigationTab = GenericNavigationTab &
  ViewItem & {
    /** The badge text */
    badgeText: Maybe<TranslatableText>;
    /** The tab items */
    items: FavouriteMarketsNavigationTabItems;
    /** The Favourite Markets metadata */
    metadata: Maybe<FavouriteMarketsMetadata>;
    /** The tab urn */
    urn: Scalars["URN"]["output"];
    /** The tab deeplinking view link */
    viewLink: Maybe<ViewLink>;
  };

/** Represents a navigation tab that will contain the users favourite content sections */
export type FavouriteMarketsNavigationTabItemsArgs = {
  first: InputMaybe<Scalars["Int"]["input"]>;
};

/** Represents a connection between FavouriteMarketsNavigationTab and FavouriteMarketsNavigationTabItem */
export type FavouriteMarketsNavigationTabItems = {
  edges: Array<Maybe<FavouriteMarketsNavigationTabItemsEdge>>;
};

/** Represents a FavouriteMarketsNavigationTab edge */
export type FavouriteMarketsNavigationTabItemsEdge = {
  node: NavigationTabItem;
};

/** Represents the Favourite Markets state */
export type FavouriteMarketsState = {
  /** The favourite state */
  isFavourite: Scalars["Boolean"]["output"];
  /** The Favourite Markets metadata */
  metadata: FavouriteMarketsMetadata;
  /** The state urn */
  urn: Scalars["URN"]["output"];
};

export type FeatureThrottle = {
  /** The throttle's state of activity, on or off */
  isActive: Scalars["Boolean"]["output"];
  /** The unique name of the throttle */
  name: Scalars["String"]["output"];
};

export enum FilterKeys {
  CompetitionsFilter = "competitionsFilter",
  DateRangeFilter = "dateRangeFilter",
  MarketTypeFilter = "marketTypeFilter",
  SortOption = "sortOption",
}

export type FilterTag = {
  label: Maybe<DisplayName>;
  type: Scalars["String"]["output"];
};

/** Represents a collection of CardGroup */
export type FilteredCouponCardGroup = CardGroup &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /**
     * The default market index
     * @deprecated is always sportsbook
     */
    defaultMarketTab: MarketTab;
    /** The coupon filters */
    filterOptions: Maybe<FilteredCouponOptions>;
    has90Min: Maybe<Scalars["Boolean"]["output"]>;
    items: FilteredCouponCardGroupItemsConnection;
    /** A hash representing the entire items list, regardless of pagination */
    itemsHash: Maybe<Scalars["String"]["output"]>;
    showTitle: Scalars["Boolean"]["output"];
    /** The card group title */
    title: Maybe<Scalars["String"]["output"]>;
    /** The card group urn */
    urn: Scalars["URN"]["output"];
    /** The filtered card group view all */
    viewAll: Maybe<GroupViewAll>;
  };

/** Represents a collection of CardGroup */
export type FilteredCouponCardGroupHas90MinArgs = {
  filterBy: InputMaybe<FilteredCouponFilterBy>;
  first: InputMaybe<Scalars["Int"]["input"]>;
  sortBy: InputMaybe<FilteredGroupSort>;
};

/** Represents a collection of CardGroup */
export type FilteredCouponCardGroupItemsArgs = {
  filterBy: InputMaybe<FilteredCouponFilterBy>;
  first: InputMaybe<Scalars["Int"]["input"]>;
  sortBy: InputMaybe<FilteredGroupSort>;
};

/** Represents a collection of CardGroup */
export type FilteredCouponCardGroupItemsHashArgs = {
  filterBy: InputMaybe<FilteredCouponFilterBy>;
  sortBy: InputMaybe<FilteredGroupSort>;
};

/** Represents a collection of cards that are supported on a FilteredCoupon */
export type FilteredCouponCardGroupItem = CouponHeaderCard | EventMarketCard;

/** Represents a FilteredCoupon edge */
export type FilteredCouponCardGroupItemEdge = {
  cursor: Maybe<Scalars["String"]["output"]>;
  node: FilteredCouponCardGroupItem;
};

/** Represents a connection between FilteredCoupon and FilteredCouponCardGroupItem */
export type FilteredCouponCardGroupItemsConnection = {
  edges: Array<Maybe<FilteredCouponCardGroupItemEdge>>;
  pageInfo: Maybe<PageInfo>;
};

export type FilteredCouponFilterBy = {
  competitions: InputMaybe<Array<Scalars["URN"]["input"]>>;
  dateRange: InputMaybe<Scalars["URN"]["input"]>;
  marketType: InputMaybe<Scalars["URN"]["input"]>;
};

export type FilteredCouponOptions = {
  competitionsFilter: Maybe<CompetitionsFilter>;
  dateRangeFilter: Maybe<DateRangeFilter>;
  filtersSorting: Maybe<Array<FilterKeys>>;
  marketTypeFilter: Maybe<MarketTypeFilter>;
  sortOption: Maybe<SortOption>;
};

export enum FilteredGroupSort {
  Rank = "RANK",
  Time = "TIME",
}

/** Represents a Fixture */
export type Fixture = {
  /** If the score should be display in american format */
  isAmericanFormat: Scalars["Boolean"]["output"];
  /** The fixture main market home away runner names */
  runnerNames: Maybe<FixtureRunnerNames>;
  /** The sport event */
  sportevent: SportsEvent;
  /** The fixture urn */
  urn: Scalars["URN"]["output"];
};

/** Represents a card with a sports event fixture */
export type FixtureCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** True if it needs to show the bell icon */
    availableToSubscribe: Scalars["Boolean"]["output"];
    /** The card badge */
    badge: Maybe<Badge>;
    /** The card connected sport event view link */
    eventViewLink: Maybe<ViewLink>;
    /** The card connected sport event fixture */
    fixture: Fixture;
    /** The fixture red7 scoreboard URL */
    red7Scoreboard: Maybe<Red7Scoreboard>;
    /** The card connected sport event */
    sportevent: SportsEvent;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

export enum FixtureOutcome {
  Draw = "DRAW",
  Lose = "LOSE",
  Win = "WIN",
}

/** The fixture main market home away runner names */
export type FixtureRunnerNames = {
  /** Away team name */
  away: Scalars["String"]["output"];
  /** Home team name */
  home: Scalars["String"]["output"];
};

export enum FixtureTeamSide {
  Away = "AWAY",
  Home = "HOME",
}

export type FootballCompetition = {
  id: Maybe<Scalars["ID"]["output"]>;
  stages: Maybe<Array<Maybe<FootballCompetitionStage>>>;
};

export type FootballCompetitionStage = {
  name: Maybe<Scalars["String"]["output"]>;
  standings: Maybe<Array<Maybe<FootballTeamStanding>>>;
};

export type FootballFixture = Fixture & {
  away: FootballTeamDetails;
  awayStanding: Maybe<FootballStandingForm>;
  competition: Maybe<FootballCompetition>;
  competitionForm: Maybe<FootballFixtureForm>;
  duration: Maybe<FootballMatchDuration>;
  firstLegScore: Maybe<AvbScore>;
  head2head: Maybe<FootballFixtureForm>;
  home: FootballTeamDetails;
  homeStanding: Maybe<FootballStandingForm>;
  incidents: Maybe<Array<Maybe<FootballIncident>>>;
  /** If the score should be display in american format */
  isAmericanFormat: Scalars["Boolean"]["output"];
  penaltyShootout: Maybe<FootballFixturePenaltyShootout>;
  players: Maybe<Array<Maybe<FootballPlayerFixture>>>;
  recentForm: Maybe<FootballFixtureForm>;
  /** The fixture main market home away runner names */
  runnerNames: Maybe<FixtureRunnerNames>;
  scheduledAt: Maybe<Scalars["String"]["output"]>;
  score: Maybe<AvbScore>;
  /** The sport event */
  sportevent: SportsEvent;
  startedAt: Maybe<Scalars["String"]["output"]>;
  stats: Maybe<Array<Maybe<FootballStats>>>;
  teams: Maybe<Array<Maybe<FootballTeam>>>;
  /** The fixture urn */
  urn: Scalars["URN"]["output"];
};

export type FootballFixtureForm = {
  away: Maybe<Array<Maybe<FootballTeamForm>>>;
  home: Maybe<Array<Maybe<FootballTeamForm>>>;
};

export type FootballFixturePenaltyShootout = {
  firstTeamToShoot: Maybe<FixtureTeamSide>;
  nextTeamToShoot: Maybe<FixtureTeamSide>;
  penaltyFormat: Maybe<Scalars["String"]["output"]>;
  penaltyScores: Maybe<Array<Maybe<PenaltyScore>>>;
};

export type FootballFixtureTeams = {
  away: Maybe<FootballTeamDetails>;
  home: Maybe<FootballTeamDetails>;
};

export type FootballGameStats = {
  attacks: Maybe<Scalars["Int"]["output"]>;
  blockedShots: Maybe<Scalars["Int"]["output"]>;
  corners: Maybe<Scalars["Int"]["output"]>;
  dangerousAttacks: Maybe<Scalars["Int"]["output"]>;
  fouls: Maybe<Scalars["Int"]["output"]>;
  freeKicks: Maybe<Scalars["Int"]["output"]>;
  goalKicks: Maybe<Scalars["Int"]["output"]>;
  goals: Maybe<Scalars["Int"]["output"]>;
  offsides: Maybe<Scalars["Int"]["output"]>;
  possession: Maybe<Scalars["Int"]["output"]>;
  redCards: Maybe<Scalars["Int"]["output"]>;
  shotsOffTarget: Maybe<Scalars["Int"]["output"]>;
  shotsOnTarget: Maybe<Scalars["Int"]["output"]>;
  throwIns: Maybe<Scalars["Int"]["output"]>;
  totalShots: Maybe<Scalars["Int"]["output"]>;
  yellowCards: Maybe<Scalars["Int"]["output"]>;
};

export type FootballIncident = {
  clock: Maybe<Clock>;
  details: Maybe<FootballIncidentDetails>;
  period: Maybe<FootballMatchPeriod>;
  periodStatus: Maybe<FootballPeriodStatus>;
};

export type FootballIncidentDetails =
  | AttackIncident
  | CardIncident
  | FoulIncident
  | GoalIncident
  | PenaltyIncident
  | PenaltyShootoutIncident
  | PeriodIncident
  | SetPieceIncident
  | ShotIncident
  | SubstitutionIncident;

export type FootballMatchDuration = {
  clock: Maybe<Clock>;
  period: Maybe<FootballMatchPeriod>;
  status: Maybe<FootballPeriodStatus>;
  stoppageMinutes: Maybe<Scalars["Int"]["output"]>;
};

export enum FootballMatchPeriod {
  Extra = "EXTRA",
  Regular = "REGULAR",
}

export enum FootballPeriodStatus {
  End = "END",
  Full = "FULL",
  Half = "HALF",
  InplayFirstHalf = "INPLAY_FIRST_HALF",
  InplaySecondHalf = "INPLAY_SECOND_HALF",
  PenaltyShootout = "PENALTY_SHOOTOUT",
  PreMatch = "PRE_MATCH",
}

export type FootballPlayer = {
  formationPlace: Maybe<Scalars["String"]["output"]>;
  id: Maybe<Scalars["ID"]["output"]>;
  /** Short or match name from SCA */
  matchName: Maybe<Scalars["String"]["output"]>;
  /** Full name from SCA (pass-through) */
  name: Maybe<Scalars["String"]["output"]>;
  position: Maybe<FootballPlayerPosition>;
  positionDescription: Maybe<Scalars["String"]["output"]>;
  seasonStats: Maybe<FootballPlayerSeasonStats>;
  shirtNumber: Maybe<Scalars["Int"]["output"]>;
  startingType: Maybe<FootballPlayerStartingType>;
};

export type FootballPlayerCompetitionStatsCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The competitions from what the stats are for */
    competition: Maybe<Competition>;
    /** The football player with season stats */
    player: FootballPlayerFixture;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

export type FootballPlayerFixture = {
  /** The place of the player in the team formation */
  formationPlace: Maybe<Scalars["String"]["output"]>;
  id: Maybe<Scalars["ID"]["output"]>;
  /** Short or match name from SCA */
  matchName: Maybe<Scalars["String"]["output"]>;
  /** Full name from SCA (pass-through) */
  name: Scalars["String"]["output"];
  /** The position of the player */
  position: Maybe<FootballPlayerPosition>;
  /** Text describing the player position */
  positionDescription: Maybe<Scalars["String"]["output"]>;
  /** Information about the player season stats */
  seasonStats: Maybe<FootballPlayerFixtureSeasonStats>;
  /** Shirt number of the player */
  shirtNumber: Maybe<Scalars["Int"]["output"]>;
  /** The starting status of the player */
  startingType: Maybe<FootballPlayerStartingType>;
  /** Information about Players Stats for the current match */
  stats: Maybe<Array<Maybe<FootballPlayerFixtureStats>>>;
  /** The player URN */
  urn: Scalars["URN"]["output"];
};

export type FootballPlayerFixtureContext = {
  fixture: PlayerViewFootballFixture;
  player: Maybe<FootballPlayerFixture>;
  team: Maybe<FootballTeam>;
  urn: Scalars["URN"]["output"];
};

export type FootballPlayerFixtureGameStats = {
  assists: Maybe<Scalars["Int"]["output"]>;
  blockedShots: Maybe<Scalars["Int"]["output"]>;
  fouls: Maybe<Scalars["Int"]["output"]>;
  foulsWon: Maybe<Scalars["Int"]["output"]>;
  goalkeeperSaves: Maybe<Scalars["Int"]["output"]>;
  interceptions: Maybe<Scalars["Int"]["output"]>;
  offsides: Maybe<Scalars["Int"]["output"]>;
  shotsCreated: Maybe<Scalars["Int"]["output"]>;
  shotsOnTarget: Maybe<Scalars["Int"]["output"]>;
  tacklesWon: Maybe<Scalars["Int"]["output"]>;
  totalShots: Maybe<Scalars["Int"]["output"]>;
};

export type FootballPlayerFixtureSeasonStats = {
  averages: Maybe<FootballPlayerFixtureStat>;
  matchesPlayed: Maybe<Scalars["Int"]["output"]>;
  totals: Maybe<FootballPlayerFixtureStat>;
};

export type FootballPlayerFixtureStat = {
  /** Number of Assists */
  assists: Maybe<Scalars["Float"]["output"]>;
  /** Number of times the player scored the first match goal */
  firstGoalScored: Maybe<Scalars["Float"]["output"]>;
  /** Aggregated data of Fouls Won and Fouls Committed */
  foulInvolvements: Maybe<Scalars["Float"]["output"]>;
  /** Number of Fouls Committed */
  fouls: Maybe<Scalars["Float"]["output"]>;
  /**
   * Average fouls per match
   * @deprecated use `fouls` instead
   */
  foulsPerMatch: Maybe<Scalars["Float"]["output"]>;
  /** Number of Fouls Won */
  foulsWon: Maybe<Scalars["Float"]["output"]>;
  /** Number of Goals */
  goals: Scalars["Float"]["output"];
  /** Number of times the player scored the last match goal */
  lastGoalScored: Maybe<Scalars["Float"]["output"]>;
  /** Number of Passes */
  passes: Maybe<Scalars["Float"]["output"]>;
  /** Number of Red Cards */
  redCards: Scalars["Float"]["output"];
  /** Player Number of Shots On Target */
  shotsOnTarget: Maybe<Scalars["Float"]["output"]>;
  /** Number of Assists */
  tacklesMade: Maybe<Scalars["Float"]["output"]>;
  /** Number of Assists */
  tacklesReceived: Maybe<Scalars["Float"]["output"]>;
  /** Player Number of Shots */
  totalShots: Maybe<Scalars["Float"]["output"]>;
  /** Number of Yellow Cards */
  yellowCards: Scalars["Float"]["output"];
  /** Number of Red Cards from accumulating Yellow Cards */
  yellowRedCards: Scalars["Float"]["output"];
};

export type FootballPlayerFixtureStats = {
  stats: Maybe<FootballPlayerFixtureGameStats>;
};

export enum FootballPlayerPosition {
  Defender = "DEFENDER",
  Forward = "FORWARD",
  Goalkeeper = "GOALKEEPER",
  Midfielder = "MIDFIELDER",
}

export type FootballPlayerSeasonStats = {
  /** Player Average Stats */
  averages: FootballPlayerStat;
  /** Number of matches played by the player in the season and competition */
  matchesPlayed: Scalars["Int"]["output"];
};

export enum FootballPlayerStartingType {
  Bench = "BENCH",
  Lineup = "LINEUP",
  NotAvailable = "NOT_AVAILABLE",
}

export type FootballPlayerStat = {
  /** Number of Assists */
  assists: Maybe<Scalars["Float"]["output"]>;
  /** Number of times the player scored the first match goal */
  firstGoalScored: Maybe<Scalars["Float"]["output"]>;
  /** Number of foul involvements (fouls committed + fouls won) */
  foulInvolvements: Maybe<Scalars["Float"]["output"]>;
  /** Number of Fouls Committed */
  fouls: Maybe<Scalars["Float"]["output"]>;
  /**
   * Average fouls per match
   * @deprecated use `fouls` instead
   */
  foulsPerMatch: Maybe<Scalars["Float"]["output"]>;
  /** Number of Fouls Won */
  foulsWon: Maybe<Scalars["Float"]["output"]>;
  /** Number of Goals */
  goals: Scalars["Float"]["output"];
  /** Number of times the player scored the last match goal */
  lastGoalScored: Maybe<Scalars["Float"]["output"]>;
  /** Number of Passes */
  passes: Maybe<Scalars["Float"]["output"]>;
  /** Number of Red Cards */
  redCards: Scalars["Float"]["output"];
  /** Player Number of Shots On Target */
  shotsOnTarget: Scalars["Float"]["output"];
  /** Player Number of Shots */
  totalShots: Scalars["Float"]["output"];
  /** Number of Yellow Cards */
  yellowCards: Scalars["Float"]["output"];
  /** Number of Red Cards from accumulating Yellow Cards */
  yellowRedCards: Scalars["Float"]["output"];
};

/** Link to a player view, of type football */
export type FootballPlayerViewLink = {
  /** The connected football player */
  footballPlayer: FootballPlayerFixture;
  /** The connected view url */
  viewUrl: Scalars["URL"]["output"];
  /** The connected view urn */
  viewUrn: Scalars["URN"]["output"];
};

export type FootballSquad = {
  manager: Maybe<Scalars["String"]["output"]>;
  players: Maybe<Array<Maybe<FootballPlayer>>>;
};

export type FootballStandingForm = {
  rank: Maybe<StandingRank>;
  team: Maybe<StandingTeam>;
};

export type FootballStats = {
  away: Maybe<FootballGameStats>;
  home: Maybe<FootballGameStats>;
  period: Maybe<FootballMatchPeriod>;
  periodStatus: Maybe<FootballPeriodStatus>;
};

export type FootballTeam = {
  /** Team name abbreviation */
  abbreviation: Maybe<Scalars["String"]["output"]>;
  /** Color of the team */
  color: Maybe<Scalars["String"]["output"]>;
  /** Team logo */
  crest: Maybe<Crest>;
  /** Team formation */
  formation: Maybe<Scalars["String"]["output"]>;
  /** Team unique identifier */
  id: Scalars["String"]["output"];
  /** Team jerseys */
  jerseys: Maybe<Array<Maybe<Jerseys>>>;
  /** Team name */
  name: Scalars["String"]["output"];
  /** Stats for the whole season */
  statsAllSeason: Maybe<FootballTeamStats>;
  /** Stats for the last 5 matches */
  statsPreviousFive: Maybe<FootballTeamStats>;
  /** The football team urn */
  urn: Scalars["URN"]["output"];
};

export type FootballTeamDetails = {
  color: Maybe<Scalars["String"]["output"]>;
  crest: Maybe<Crest>;
  formation: Maybe<Scalars["String"]["output"]>;
  id: Scalars["String"]["output"];
  jerseys: Maybe<Array<Maybe<Jerseys>>>;
  name: Scalars["String"]["output"];
  squad: Maybe<FootballSquad>;
  statsAllSeason: Maybe<FootballTeamStatsDetails>;
};

export type FootballTeamForm = {
  extraTimeScore: Maybe<AvbScore>;
  opponent: Maybe<Scalars["String"]["output"]>;
  outcome: Maybe<FixtureOutcome>;
  penaltyShootoutScore: Maybe<AvbScore>;
  score: Maybe<AvbScore>;
  side: Maybe<FixtureTeamSide>;
  startAt: Maybe<Scalars["String"]["output"]>;
};

export type FootballTeamRank = {
  change: Maybe<RankChange>;
  position: Maybe<Scalars["Int"]["output"]>;
  status: Maybe<RankStatus>;
};

export type FootballTeamStanding = {
  competitionForm: Maybe<Scalars["String"]["output"]>;
  draw: Maybe<Scalars["Int"]["output"]>;
  gamesPlayed: Maybe<Scalars["Int"]["output"]>;
  goalsDifference: Maybe<Scalars["Int"]["output"]>;
  loss: Maybe<Scalars["Int"]["output"]>;
  points: Maybe<Scalars["Int"]["output"]>;
  rank: Maybe<FootballTeamRank>;
  team: Maybe<FootballTeamDetails>;
  win: Maybe<Scalars["Int"]["output"]>;
};

export type FootballTeamStats = {
  averageBookingPoints: Maybe<AverageTeamStats>;
  averageCorners: Maybe<AverageTeamStats>;
  averageGoalsConceded: Maybe<AverageTeamStats>;
  averageGoalsScored: Maybe<AverageTeamStats>;
  averageShots: Maybe<Scalars["Float"]["output"]>;
  bothTeamsToScore: Maybe<BothTeamsToScore>;
};

export type FootballTeamStatsDetails = {
  averageGoalsConceded: Maybe<AverageGoalsDetails>;
  averageGoalsScored: Maybe<AverageGoalsDetails>;
  averageShotsOnTarget: Maybe<Scalars["Float"]["output"]>;
  matchesPlayed: Maybe<Scalars["Int"]["output"]>;
};

/** Represents the ForbiddenCard type, it gives context where it will be rendered */
export enum ForbiddenCardType {
  Generic = "GENERIC",
  MarketGraphs = "MARKET_GRAPHS",
  MyBets = "MY_BETS",
}

/** Represents a card that will render a ForbiddenContent */
export type ForbiddenContentCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    forbiddenCardType: ForbiddenCardType;
    urn: Scalars["URN"]["output"];
  };

/** Represents My Account banner form content */
export type FormContent = {
  /** Banner address info */
  addressInfo: Maybe<AddressInfo>;
};

export type FoulIncident = {
  foulType: Maybe<FoulIncidentType>;
  player: Maybe<FootballPlayer>;
  side: Maybe<FixtureTeamSide>;
};

export enum FoulIncidentType {
  Foul = "FOUL",
  Offside = "OFFSIDE",
}

/** Represents a odds fraction */
export type FractionalOdds = {
  /** The odd fraction denominator */
  denominator: Scalars["Int"]["output"];
  /** The odd fraction numerator */
  numerator: Scalars["Int"]["output"];
};

export type FractionalOddsInput = {
  denominator: Scalars["Int"]["input"];
  numerator: Scalars["Int"]["input"];
};

export type FreeSpinsDetails = {
  initialFreeSpins: Maybe<Scalars["Int"]["output"]>;
  remainingFreeSpins: Maybe<Scalars["Int"]["output"]>;
};

/** Represents a collection of CardGroup */
export type FutureRacingCardGroup = CardGroup &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The future racing filter options */
    filterOptions: Maybe<FutureRacingOptions>;
    /** The future racing items */
    items: FutureRacingCardGroupItemsConnection;
    /** The future racing URN */
    urn: Scalars["URN"]["output"];
  };

/** Represents a collection of CardGroup */
export type FutureRacingCardGroupItemsArgs = {
  filterBy: InputMaybe<FutureRacingFilterBy>;
  first: InputMaybe<Scalars["Int"]["input"]>;
};

/** Represents a FutureRacing edge */
export type FutureRacingCardGroupItemEdge = {
  cursor: Maybe<Scalars["String"]["output"]>;
  date: Scalars["String"]["output"];
  node: QuickLinksCard;
};

/** Represents a connection between FutureRacing and [QuickLinksCard] */
export type FutureRacingCardGroupItemsConnection = {
  edges: Array<Maybe<FutureRacingCardGroupItemEdge>>;
  pageInfo: Maybe<PageInfo>;
};

/** Represents the future racing filters input */
export type FutureRacingFilterBy = {
  /** The countries URN list */
  countries: InputMaybe<Array<Scalars["URN"]["input"]>>;
  /** The months URN list */
  months: InputMaybe<Array<Scalars["URN"]["input"]>>;
};

export type FutureRacingOptions = {
  countriesFilter: Maybe<CountriesFilter>;
  monthFilter: Maybe<MonthFilter>;
};

/** Represents a gaming Game */
export type Game = {
  backgroundColor: Maybe<Scalars["String"]["output"]>;
  copyrightText: Maybe<Scalars["String"]["output"]>;
  customBackgroundColor: Maybe<Scalars["String"]["output"]>;
  customLogo: Maybe<CustomLogo>;
  decoration: Maybe<Scalars["String"]["output"]>;
  description: Maybe<GameDescription>;
  feedData: Maybe<GameFeedData>;
  flattened: Maybe<GameImages>;
  gameHelp: Maybe<Scalars["String"]["output"]>;
  /** @deprecated Use `gameMechanics` instead */
  gameMechanic: Array<Scalars["String"]["output"]>;
  gameMechanics: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  gameStudio: Maybe<Scalars["String"]["output"]>;
  gameStudioLogo: Maybe<Scalars["String"]["output"]>;
  gameTheme: Maybe<Scalars["String"]["output"]>;
  gameType: Maybe<Scalars["String"]["output"]>;
  gameVolatility: Maybe<Scalars["String"]["output"]>;
  hasDemo: Maybe<Scalars["Boolean"]["output"]>;
  jackpotLogo: Maybe<JackpotLogo>;
  jackpotType: Maybe<Scalars["String"]["output"]>;
  label: Maybe<Label>;
  launchId: Scalars["String"]["output"];
  mainProduct: Scalars["String"]["output"];
  maxStake: Maybe<Scalars["String"]["output"]>;
  metaData: Maybe<SeoMetaData>;
  minStake: Maybe<Scalars["String"]["output"]>;
  name: Scalars["String"]["output"];
  provider: Provider;
  rgsCodeMobile: Scalars["String"]["output"];
  rtp: Maybe<Scalars["String"]["output"]>;
  screenshots: Maybe<Array<Maybe<GameImage>>>;
  uid: Scalars["String"]["output"];
  urn: Scalars["URN"]["output"];
  viewLink: ViewLink;
};

export type GameBadge = {
  label: Maybe<DisplayName>;
  rouletteNumbers: Maybe<Array<RouletteNumber>>;
  type: GameBadgeType;
};

export enum GameBadgeType {
  Featured = "FEATURED",
  Jackpot = "JACKPOT",
  New = "NEW",
  NewRegular = "NEW_REGULAR",
  Regular = "REGULAR",
  RouletteNumbers = "ROULETTE_NUMBERS",
  SeatsAvailable = "SEATS_AVAILABLE",
}

/** Represents a card with a game */
export type GameCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The Game Badge */
    badge: Maybe<GameBadge>;
    /** The game associated to the URN */
    game: Game;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

export type GameDescription = {
  content: Array<RichText>;
  headline: Maybe<Scalars["String"]["output"]>;
};

export type GameFeedData = {
  availableSeats: Maybe<Scalars["Int"]["output"]>;
  jackpot: Maybe<Scalars["Float"]["output"]>;
  lastNumbers: Maybe<Array<RouletteNumber>>;
  tableNames: Maybe<Array<Scalars["String"]["output"]>>;
};

export type GameImage = {
  alt: Maybe<Scalars["String"]["output"]>;
  dimensions: Dimension;
  url: Scalars["String"]["output"];
};

export type GameImages = {
  medium: Maybe<GameImage>;
  small: Maybe<GameImage>;
};

/** Represents a card with a game info */
export type GameInfoCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The game associated to the URN */
    game: Game;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

export enum GameTileSize {
  Medium = "MEDIUM",
  Small = "SMALL",
}

/** Represents a View related to a Game */
export type GameView = View & {
  /** The bottom bar */
  bottomBar: Maybe<BottomBar>;
  /** The view category */
  category: Maybe<ViewCategory>;
  /** The layout items on the view */
  items: ViewItemsConnection;
  /** The left side bar */
  leftSidebar: Maybe<LeftSidebar>;
  /** The view navigation item */
  navigationItem: Maybe<NavigationItem>;
  /** The regulatory data used for the regulatory header */
  regulatoryData: Maybe<RegulatoryData>;
  /** The view title */
  title: Maybe<Scalars["String"]["output"]>;
  /** The view url */
  url: Scalars["URL"]["output"];
  /** The view urn */
  urn: Scalars["URN"]["output"];
  /** The xsell bar */
  xsellBar: Maybe<XSellBar>;
};

/** Represents a View related to a Game */
export type GameViewItemsArgs = {
  after: InputMaybe<Scalars["String"]["input"]>;
  first: InputMaybe<Scalars["Int"]["input"]>;
};

export type GameWithReleaseDate = {
  releaseDate: Maybe<Scalars["String"]["output"]>;
  uid: Scalars["String"]["output"];
};

/** Represents a back navigation card */
export type GamingBackNavigationCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /**
     * The title of the card
     * @deprecated Use NavigationItem on  View
     */
    title: Scalars["String"]["output"];
    /**
     * The card urn
     * @deprecated Use NavigationItem on  View
     */
    urn: Scalars["URN"]["output"];
  };

export type GamingCardEdge = {
  cursor: Maybe<Scalars["String"]["output"]>;
  node: GameCard;
};

export type GamingCardGroup = CardGroup &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card group decoration */
    decoration: Maybe<Scalars["String"]["output"]>;
    /** The card group default layout */
    defaultLayout: SwimlaneCardGroupLayout;
    /** The card group display Name for translations */
    displayName: Maybe<DisplayNameTranslationKey>;
    gameTileSize: Maybe<GameTileSize>;
    items: GamingCardGroupItemsConnection;
    /** The card group supported layouts */
    layouts: Array<SwimlaneCardGroupLayout>;
    /** The card group title */
    title: Maybe<Scalars["String"]["output"]>;
    /** True if the it is a recently played swimlane */
    type: GamingCardGroupType;
    /** The card group urn */
    urn: Scalars["URN"]["output"];
    /** The card group view all */
    viewAll: Maybe<GroupViewAll>;
  };

export type GamingCardGroupItemsArgs = {
  first: InputMaybe<Scalars["Int"]["input"]>;
};

export type GamingCardGroupItemEdge = {
  cursor: Maybe<Scalars["String"]["output"]>;
  node: Card;
};

export type GamingCardGroupItemsConnection = {
  edges: Array<Maybe<GamingCardGroupItemEdge>>;
  pageInfo: Maybe<PageInfo>;
};

export enum GamingCardGroupType {
  Categories = "CATEGORIES",
  Default = "DEFAULT",
  FavouriteGames = "FAVOURITE_GAMES",
  RecentlyPlayed = "RECENTLY_PLAYED",
}

/** Represents the Games Category View */
export type GamingCategoryView = View & {
  /** The bottom bar */
  bottomBar: Maybe<BottomBar>;
  /** The view category */
  category: Maybe<ViewCategory>;
  /** The view game */
  game: Maybe<Game>;
  /** The layout items on the view */
  items: ViewItemsConnection;
  /** The left side bar */
  leftSidebar: Maybe<LeftSidebar>;
  /** The view navigation item */
  navigationItem: Maybe<NavigationItem>;
  /** The regulatory data used for the regulatory header */
  regulatoryData: Maybe<RegulatoryData>;
  /** The view seo meta data */
  seoMetaData: Maybe<SeoMetaData>;
  /** The view title */
  title: Maybe<Scalars["String"]["output"]>;
  /** The view url */
  url: Scalars["URL"]["output"];
  /** The view urn */
  urn: Scalars["URN"]["output"];
  /** The xsell bar */
  xsellBar: Maybe<XSellBar>;
};

/** Represents the Games Category View */
export type GamingCategoryViewItemsArgs = {
  after: InputMaybe<Scalars["String"]["input"]>;
  first: InputMaybe<Scalars["Int"]["input"]>;
};

export type GamingJackpot = {
  dropText: Maybe<Scalars["String"]["output"]>;
  dropTime: Maybe<Scalars["String"]["output"]>;
  dropValue: Maybe<Scalars["Float"]["output"]>;
  name: Scalars["String"]["output"];
  progress: Scalars["Int"]["output"];
  state: GamingJackpotState;
  urn: Scalars["URN"]["output"];
  value: Scalars["Float"]["output"];
};

export type GamingJackpotCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    jackpots: Array<GamingJackpot>;
    logo: Scalars["String"]["output"];
    name: Scalars["String"]["output"];
    urn: Scalars["URN"]["output"];
  };

export enum GamingJackpotState {
  Cold = "COLD",
  Hot = "HOT",
  VeryHot = "VERY_HOT",
}

/** Represents a card with a gaming link */
export type GamingLinkCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The games with release date list */
    games: Array<Maybe<GameWithReleaseDate>>;
    /** The gaming view link */
    link: GroupViewAll;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a play new card */
export type GamingPlayNewCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card promotion background images */
    backgroundImage: Array<Maybe<PromotionBackgroundImage>>;
    /** The card promotion endDate */
    endDate: Maybe<Scalars["String"]["output"]>;
    /** The card promotion logo images */
    logoImage: Array<Maybe<PromotionBackgroundImage>>;
    /** The card promotion optInState */
    optInState: Maybe<PromotionStatus>;
    /** The promotion subHeadline */
    subtitle: Maybe<Scalars["String"]["output"]>;
    /** The card promotion tags */
    tags: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
    /** The card promotion terms and conditions */
    termsAndConditions: Maybe<PromotionTermsAndConditions>;
    /** The widget headline */
    title: Scalars["String"]["output"];
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a card with a prize machine */
export type GamingPrizeMachineCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The prize machine active title */
    activeTitle: Maybe<Scalars["String"]["output"]>;
    /** The prize machine complete flag */
    completed: Scalars["Boolean"]["output"];
    /** The prize machine cta label */
    ctaLabel: Maybe<Scalars["String"]["output"]>;
    /** The prize machine display jackpot winners flag */
    displayJackpotWinnersPostPlayWidget: Scalars["Boolean"]["output"];
    /** The prize machine guaranteed prize flag */
    guaranteedPrize: Scalars["Boolean"]["output"];
    /** The prize machine play free Jackpot */
    jackpotAmount: Maybe<Scalars["Int"]["output"]>;
    /** The prize machine play free Jackpot state */
    jackpotState: Maybe<GamingPrizeMachineStateType>;
    /** The minigame type */
    minigameType: Maybe<Scalars["String"]["output"]>;
    /** The prize machine card placementId */
    placementId: Scalars["String"]["output"];
    /** The prize machine card link where the user is redirected */
    redirectUrl: Maybe<Scalars["String"]["output"]>;
    /** The prize machine theme images */
    themeImages: Maybe<PrizeMachineThemeImages>;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

export enum GamingPrizeMachineStateType {
  ExtraHot = "EXTRA_HOT",
  Hot = "HOT",
  Mega = "MEGA",
  Regular = "REGULAR",
}

export type GamingSearchCardConnection = {
  edges: Array<Maybe<GamingCardEdge>>;
  pageInfo: Maybe<PageInfo>;
  /** Total number of games found in the search */
  totalCount: Scalars["Int"]["output"];
};

/** Represents the gaming segmentation n View */
export type GamingSegmentationView = View & {
  /** The bottom bar */
  bottomBar: Maybe<BottomBar>;
  /** The view category */
  category: Maybe<ViewCategory>;
  /** The layout items on the view */
  items: ViewItemsConnection;
  /** The left side bar */
  leftSidebar: Maybe<LeftSidebar>;
  /** The regulatory data used for the regulatory header */
  regulatoryData: Maybe<RegulatoryData>;
  /** The view title */
  title: Maybe<Scalars["String"]["output"]>;
  /** The view url */
  url: Scalars["URL"]["output"];
  /** The view urn */
  urn: Scalars["URN"]["output"];
  /** The xsell bar */
  xsellBar: Maybe<XSellBar>;
};

/** Represents the gaming segmentation n View */
export type GamingSegmentationViewItemsArgs = {
  first: InputMaybe<Scalars["Int"]["input"]>;
};

/** Represents the Gaming Homepage View */
export type GamingView = View & {
  /** The bottom bar */
  bottomBar: Maybe<BottomBar>;
  /** The view category */
  category: Maybe<ViewCategory>;
  /** The layout items on the view */
  items: ViewItemsConnection;
  /** The left side bar */
  leftSidebar: Maybe<LeftSidebar>;
  /** The regulatory data used for the regulatory header */
  regulatoryData: Maybe<RegulatoryData>;
  /** The view seo meta data */
  seoMetaData: Maybe<SeoMetaData>;
  /** The view title */
  title: Maybe<Scalars["String"]["output"]>;
  /** The view url */
  url: Scalars["URL"]["output"];
  /** The view urn */
  urn: Scalars["URN"]["output"];
  /** The xsell bar */
  xsellBar: Maybe<XSellBar>;
};

/** Represents the Gaming Homepage View */
export type GamingViewItemsArgs = {
  first: InputMaybe<Scalars["Int"]["input"]>;
};

/** Represents a Generic Navigation Tab */
export type GenericNavigationTab = {
  /** The tab urn */
  urn: Scalars["URN"]["output"];
};

/** Represents a Generic Switcher Card */
export type GenericSwitcherCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    filterTitle: TranslatableText;
    /** The header theming for the generic switcher card */
    headerTheming: Maybe<Scalars["String"]["output"]>;
    /** The selected view */
    selectedViewLink: GenericViewLink;
    /** The siblings views */
    siblingViews: GenericSwitcherLinkConnection;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a Generic Switcher Card */
export type GenericSwitcherCardSiblingViewsArgs = {
  first: InputMaybe<Scalars["Int"]["input"]>;
};

/** Represents a connection between generic switcher card and view link */
export type GenericSwitcherLinkConnection = {
  edges: Array<Maybe<GenericSwitcherLinkEdge>>;
  pageInfo: Maybe<PageInfo>;
};

/** Represents an edge between generic switcher card and view link */
export type GenericSwitcherLinkEdge = {
  cursor: Maybe<Scalars["String"]["output"]>;
  node: GenericViewLink;
};

/** Represents a Generic View */
export type GenericView = View & {
  /** The bottom bar */
  bottomBar: Maybe<BottomBar>;
  /** The view canonical url */
  canonicalUrl: Maybe<Scalars["String"]["output"]>;
  /** The category */
  category: Maybe<ViewCategory>;
  /** The layout items on the view */
  items: ViewItemsConnection;
  /** The left side bar */
  leftSidebar: Maybe<LeftSidebar>;
  /** The regulatory data used for the regulatory header */
  regulatoryData: Maybe<RegulatoryData>;
  /** View title */
  title: Maybe<Scalars["String"]["output"]>;
  /** The view url */
  url: Scalars["URL"]["output"];
  /** The view urn */
  urn: Scalars["URN"]["output"];
  /** The View header */
  viewHeader: ViewHeader;
  /** The xsell bar */
  xsellBar: Maybe<XSellBar>;
};

/** Represents a Generic View */
export type GenericViewItemsArgs = {
  after: InputMaybe<Scalars["String"]["input"]>;
  autoPageSize: InputMaybe<Scalars["Boolean"]["input"]>;
  first: InputMaybe<Scalars["Int"]["input"]>;
};

export type GenericViewLink = {
  /** The generic view link label */
  label: Scalars["String"]["output"];
  /** The generic view link */
  viewLink: ViewLink;
};

/** Represents a card that provides a connection to a generic view */
export type GenericViewLinkCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card Badge */
    badge: Maybe<Badge>;
    icon: Maybe<PackIcon>;
    /** The sport icon */
    sportIcon: Maybe<Icon>;
    /** The card title */
    title: DisplayName;
    /** The card urn */
    urn: Scalars["URN"]["output"];
    /** The card connected view link */
    viewLink: ViewLink;
  };

export enum GhostLegStatusEnum {
  Activated = "ACTIVATED",
  CancelledManualCancellation = "CANCELLED_MANUAL_CANCELLATION",
  CancelledManualSettlement = "CANCELLED_MANUAL_SETTLEMENT",
  CancelledVoid = "CANCELLED_VOID",
  IneligibleAllWon = "INELIGIBLE_ALL_WON",
  IneligibleCashout = "INELIGIBLE_CASHOUT",
  IneligibleMultipleLosers = "INELIGIBLE_MULTIPLE_LOSERS",
  Pending = "PENDING",
}

export type GhostLegToken = {
  /** The calculated payout amount for the Ghost Leg win. Present when status is ACTIVATED. */
  payout: Maybe<Scalars["Float"]["output"]>;
  /** The re-priced decimal odds after removing the ghosted leg. Present when status is ACTIVATED. */
  repricedDecimalOdds: Maybe<Scalars["Float"]["output"]>;
  /** Current status of Ghost Leg evaluation */
  status: GhostLegStatusEnum;
  /** Ghost Leg token id */
  tokenId: Scalars["String"]["output"];
};

export type GoalIncident = {
  assist: Maybe<FootballPlayer>;
  goalScorer: Maybe<FootballPlayer>;
  goalType: Maybe<GoalIncidentType>;
  side: Maybe<FixtureTeamSide>;
};

export enum GoalIncidentType {
  Cancelled = "CANCELLED",
  Normal = "NORMAL",
  Own = "OWN",
  Penalty = "PENALTY",
  Possible = "POSSIBLE",
}

export enum Going {
  AllWeather = "ALL_WEATHER",
  Dead = "DEAD",
  Easy = "EASY",
  Fast = "FAST",
  Firm = "FIRM",
  Frozen = "FROZEN",
  Good = "GOOD",
  GoodFirm = "GOOD_FIRM",
  GoodSoft = "GOOD_SOFT",
  GoodYielding = "GOOD_YIELDING",
  Hard = "HARD",
  Heavy = "HEAVY",
  Muddy = "MUDDY",
  Normal = "NORMAL",
  Rain = "RAIN",
  Sand = "SAND",
  Sloppy = "SLOPPY",
  Slow = "SLOW",
  Soft = "SOFT",
  SoftHeavy = "SOFT_HEAVY",
  Standard = "STANDARD",
  Std = "STD",
  StdFast = "STD_FAST",
  StdSlow = "STD_SLOW",
  Synthetic = "SYNTHETIC",
  VerySoft = "VERY_SOFT",
  WetFast = "WET_FAST",
  Yielding = "YIELDING",
  YieldingSoft = "YIELDING_SOFT",
}

export type GoldenChipsDetails = {
  goldenChipsAmount: Maybe<Scalars["Float"]["output"]>;
  initialGoldenChips: Maybe<Scalars["Int"]["output"]>;
  remainingGoldenChips: Maybe<Scalars["Int"]["output"]>;
};

/** The greyhounds race rich data */
export type GreyhoundRaceKind = {
  details: GreyhoundsRaceDetails;
  runners: Array<GreyhoundRaceRunner>;
  urn: Scalars["URN"]["output"];
};

/** Federated stub. Owned by gql-module-rich-data. */
export type GreyhoundRaceRunner = {
  /** The race runner's raceURN */
  raceURN: Scalars["URN"]["output"];
  /** The greyhound racerunner's selectionId */
  selectionId: Scalars["Int"]["output"];
  /** The greyhound racerunner's trap number */
  trap: Maybe<Scalars["Int"]["output"]>;
  /** The greyhound race runner's urn */
  urn: Scalars["URN"]["output"];
};

export type GreyhoundsRaceDetails = {
  /** Number of active runners on the race */
  numberOfRunners: Maybe<Scalars["Int"]["output"]>;
};

/** Represents a Market Grid Card */
export type GridCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** Represents the blurbs to be displayed in the Grid Card */
    blurbs: Maybe<Array<Blurb>>;
    /** The grid layout to display markets/runners */
    layout: GridLayout;
    /** The List of all markets */
    markets: Array<GridMarket>;
    /** The number to items to display */
    numberOfItemsToDisplay: Maybe<Scalars["Int"]["output"]>;
    /** The list of players associated with this grid card's markets. Empty when markets have no participant-based runners. */
    players: GridCardPlayersConnection;
    /** The List of all runners */
    runners: Array<GridRunner>;
    /** Represents the stat associated with the Grid Card */
    stat: Maybe<MarketStat>;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a Market Grid Card */
export type GridCardPlayersArgs = {
  first: InputMaybe<Scalars["Int"]["input"]>;
};

/** Represents a GridCard player edge */
export type GridCardPlayerEdge = {
  cursor: Maybe<Scalars["String"]["output"]>;
  node: PlayerContext;
};

/** Represents a connection between GridCard and [PlayerContext] */
export type GridCardPlayersConnection = {
  edges: Array<Maybe<GridCardPlayerEdge>>;
  pageInfo: Maybe<PageInfo>;
};

export enum GridLayout {
  HorizontalMarkets = "HORIZONTAL_MARKETS",
  VerticalMarkets = "VERTICAL_MARKETS",
}

export type GridMarket = {
  /** The market display label */
  displayLabel: Maybe<DisplayName>;
  /** The runner */
  market: SportsbookMarket;
};

export type GridRunner = {
  /** The runner display name */
  displayName: DisplayName;
  /** The runner */
  runner: Runner;
};

/** Represent a View All link */
export type GroupViewAll = {
  /** The View All icon */
  icon: Maybe<Scalars["String"]["output"]>;
  /**
   * The View All label
   * @deprecated Use `title` instead
   */
  label: Scalars["String"]["output"];
  /** The View All name */
  title: DisplayName;
  /** The view to point */
  viewLink: ViewLink;
};

/** Represents a collection of cards that are supported on a HalfTimeSpecial */
export type HalfTimeSpecialsCards = MatchStatSelectionCard;

/** Represents a collection of cards with a common context */
export type HalfTimeSpecialsSwimlaneCardGroup = CardGroup &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /**
     * The card group display Name for translations
     * @deprecated Unused field
     */
    displayName: Maybe<DisplayNameTranslationKey>;
    /** true shows background decoration */
    isDecorated: Scalars["Boolean"]["output"];
    /** True shows icon */
    isIconSupportingTitle: Scalars["Boolean"]["output"];
    items: HalfTimeSpecialsSwimlaneCardGroupItemsConnection;
    /** The card group subtitle! */
    subtitle: Scalars["String"]["output"];
    /** The card group title */
    title: Scalars["String"]["output"];
    /** The card group urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a collection of cards with a common context */
export type HalfTimeSpecialsSwimlaneCardGroupItemsArgs = {
  first: InputMaybe<Scalars["Int"]["input"]>;
};

/** Represents a HalfTimeSpecialsSwimlaneCardGroup edge */
export type HalfTimeSpecialsSwimlaneCardGroupItemEdge = {
  cursor: Maybe<Scalars["String"]["output"]>;
  node: HalfTimeSpecialsCards;
};

/** Represents a connection between SwimlaneCardGroup and [Card] */
export type HalfTimeSpecialsSwimlaneCardGroupItemsConnection = {
  edges: Array<Maybe<HalfTimeSpecialsSwimlaneCardGroupItemEdge>>;
  pageInfo: Maybe<PageInfo>;
};

/** Represents a card with a sports event fixture head to head information */
export type HeadToHeadCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card connected sport event fixture */
    fixture: FootballFixture;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a highlighted selection card */
export type HighlightedSelectionCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** If the selection last price should be displayed */
    displayPreviousOdd: Scalars["Boolean"]["output"];
    /** The highlighted selection market */
    market: SportsbookMarket;
    /** The highlighed selection */
    runner: Runner;
    /** The card title */
    title: Scalars["String"]["output"];
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Breadcrumb for the Home page */
export type HomeBreadcrumb = {
  /** The home view displayName */
  displayName: DisplayName;
  /** The home view */
  homeView: GenericView;
};

export type Horse = {
  age: Scalars["Int"]["output"];
  bred: Maybe<Scalars["String"]["output"]>;
  color: HorseColor;
  damName: Maybe<Scalars["String"]["output"]>;
  damSireName: Maybe<Scalars["String"]["output"]>;
  name: Scalars["String"]["output"];
  pastPerformances: Maybe<Array<HorsePerformance>>;
  performance: Maybe<HorsePerformance>;
  sex: HorseSex;
  sireName: Maybe<Scalars["String"]["output"]>;
};

export enum HorseColor {
  Bay = "BAY",
  BayGrey = "BAY_GREY",
  Black = "BLACK",
  BlackBay = "BLACK_BAY",
  Brown = "BROWN",
  BrownBay = "BROWN_BAY",
  BrownBlack = "BROWN_BLACK",
  BrowGrey = "BROW_GREY",
  Chestnut = "CHESTNUT",
  DarkBay = "DARK_BAY",
  DarkBrown = "DARK_BROWN",
  DarkChestnut = "DARK_CHESTNUT",
  DarkLiver = "DARK_LIVER",
  Grey = "GREY",
  GreyBay = "GREY_BAY",
  GreyBlack = "GREY_BLACK",
  GreyBrown = "GREY_BROWN",
  GreyChestnut = "GREY_CHESTNUT",
  GreyRoan = "GREY_ROAN",
  LightBay = "LIGHT_BAY",
  LightChestnut = "LIGHT_CHESTNUT",
  Palomino = "PALOMINO",
  Roan = "ROAN",
  Skewbald = "SKEWBALD",
  Unknown = "UNKNOWN",
  White = "WHITE",
}

export type HorsePerformance = {
  age: Maybe<Scalars["Int"]["output"]>;
  bspAdvantage: Maybe<Scalars["Float"]["output"]>;
  details: RunnerDetails;
  distanceBeaten: Maybe<Scalars["Float"]["output"]>;
  distanceBeatenStatus: Maybe<Scalars["String"]["output"]>;
  ip: Maybe<Ip>;
  isp: Maybe<Isp>;
  officialRating: Maybe<Scalars["Int"]["output"]>;
  performanceComment: Maybe<Scalars["String"]["output"]>;
  positionOfficial: Maybe<Scalars["Int"]["output"]>;
  positionPastPost: Maybe<Scalars["Int"]["output"]>;
  positionStatus: Maybe<PositionStatus>;
  positionStatusCode: Maybe<Scalars["String"]["output"]>;
  race: Maybe<PastRace>;
  won: Scalars["Boolean"]["output"];
};

/** The horse race rich data */
export type HorseRaceKind = {
  details: RaceDetails;
  runners: Array<RaceRunner>;
  urn: Scalars["URN"]["output"];
};

export enum HorseSex {
  Colt = "COLT",
  Filly = "FILLY",
  Gelding = "GELDING",
  Horse = "HORSE",
  Mare = "MARE",
  Rig = "RIG",
  Unknown = "UNKNOWN",
}

export type IceHockeyClock = {
  /** Current period of the fixture */
  period: Maybe<IceHockeyPeriod>;
};

export type IceHockeyFixture = Fixture & {
  /** Clock information */
  clock: Maybe<IceHockeyClock>;
  /** If the score should be display in american format */
  isAmericanFormat: Scalars["Boolean"]["output"];
  /** Scores by period */
  periodScores: Maybe<Array<Maybe<IceHockeyPeriodScore>>>;
  /** The fixture main market home away runner names */
  runnerNames: Maybe<FixtureRunnerNames>;
  /** Score of the current period */
  score: Maybe<IceHockeyScore>;
  /** The sport event */
  sportevent: SportsEvent;
  /** The fixture urn */
  urn: Scalars["URN"]["output"];
};

export enum IceHockeyPeriod {
  End = "END",
  EndOvertime = "END_OVERTIME",
  EndPeriod_1 = "END_PERIOD_1",
  EndPeriod_2 = "END_PERIOD_2",
  EndPeriod_3 = "END_PERIOD_3",
  Overtime = "OVERTIME",
  Penalties = "PENALTIES",
  Period_1 = "PERIOD_1",
  Period_2 = "PERIOD_2",
  Period_3 = "PERIOD_3",
}

export type IceHockeyPeriodScore = {
  /** Current period of the fixture */
  period: Maybe<IceHockeyPeriod>;
  /** Score of the period associated */
  score: Maybe<IceHockeyScore>;
};

export type IceHockeyScore = {
  /** Away team score */
  away: Scalars["Int"]["output"];
  /** Home team score */
  home: Scalars["Int"]["output"];
};

export type Icon = SportIcon;

export enum IconTag {
  AccaFreeze = "ACCA_FREEZE",
  BestOddsGuaranteed = "BEST_ODDS_GUARANTEED",
  Betting = "BETTING",
  Bingo = "BINGO",
  Boost = "BOOST",
  BrandClub = "BRAND_CLUB",
  BrandClubExclusive = "BRAND_CLUB_EXCLUSIVE",
  BrandGames = "BRAND_GAMES",
  BrandLogo = "BRAND_LOGO",
  BuildABet = "BUILD_A_BET",
  BumperBoost = "BUMPER_BOOST",
  Casino = "CASINO",
  CasinoLive = "CASINO_LIVE",
  CheckoutChallenge = "CHECKOUT_CHALLENGE",
  DoubleUpBoost = "DOUBLE_UP_BOOST",
  EnhancedAcca = "ENHANCED_ACCA",
  ExtraPlaces = "EXTRA_PLACES",
  ExtraPlaceRace = "EXTRA_PLACE_RACE",
  Infogol = "INFOGOL",
  InPlay = "IN_PLAY",
  InPlayPriceBoost = "IN_PLAY_PRICE_BOOST",
  Itv7 = "ITV7",
  ItvPicks = "ITV_PICKS",
  MoneyBack = "MONEY_BACK",
  PickYourPlaces = "PICK_YOUR_PLACES",
  Poker = "POKER",
  PriceBoost = "PRICE_BOOST",
  PriceBoostMultiple = "PRICE_BOOST_MULTIPLE",
  PrizeDrop = "PRIZE_DROP",
  Racingpost = "RACINGPOST",
  RequestABet = "REQUEST_A_BET",
  SportingLife = "SPORTING_LIFE",
  SundaySeries = "SUNDAY_SERIES",
  Super_6 = "SUPER_6",
  SuperBoost = "SUPER_BOOST",
  SuperSub = "SUPER_SUB",
  SuperWeek = "SUPER_WEEK",
  Timeform = "TIMEFORM",
  TwoUp = "TWO_UP",
  Vegas = "VEGAS",
  VegasLive = "VEGAS_LIVE",
}

export type Image = {
  large: Maybe<Scalars["URL"]["output"]>;
  medium: Maybe<Scalars["URL"]["output"]>;
  small: Maybe<Scalars["URL"]["output"]>;
  vector: Maybe<Scalars["URL"]["output"]>;
};

export type ImplyBetsRequestInput = {
  betDefinitions: Array<BetDefinitionInput>;
};

export type ImplyBetsResponse = {
  betDefinitions: Array<BetDefinitionResult>;
  combinedBetDefinitions: Array<CombinedBetDefinitionResult>;
  result: ObbResult;
};

export type ImplyDetails = {
  currency: Scalars["String"]["output"];
  maxPayout: Scalars["Float"]["output"];
  maxStake: Scalars["Float"]["output"];
  minStake: Scalars["Float"]["output"];
  minStakeIncrement: Scalars["Float"]["output"];
  price: ObbOdds;
};

export type ImsPromotion = {
  amountOnPendingWinnings: Scalars["Float"]["output"];
  bonusAwarded: Maybe<Scalars["Float"]["output"]>;
  bonusInstanceCode: Maybe<Scalars["String"]["output"]>;
  bonusWagering: Maybe<Scalars["Float"]["output"]>;
  buyIn: Maybe<BuyInDetails>;
  ctaText: Scalars["String"]["output"];
  currentBonusBalance: Scalars["Float"]["output"];
  details: Maybe<Array<RichText>>;
  eligibleGames: Maybe<Array<Maybe<Scalars["URN"]["output"]>>>;
  featuredEligibleGames: Maybe<Array<Maybe<Scalars["URN"]["output"]>>>;
  freeSpins: Maybe<FreeSpinsDetails>;
  goldenChips: Maybe<GoldenChipsDetails>;
  headline: Scalars["String"]["output"];
  image: Maybe<GameImage>;
  layout: PromotionLayout;
  percentCompleted: Maybe<Scalars["Float"]["output"]>;
  status: PromotionStatus;
  subHeadline: Maybe<Scalars["String"]["output"]>;
  termsAndConditions: Maybe<Array<RichText>>;
  timeLeft: Maybe<Scalars["Int"]["output"]>;
  urn: Scalars["URN"]["output"];
  wagerType: Maybe<PromotionWagerType>;
  wageringLeft: Maybe<Scalars["Float"]["output"]>;
};

export type ImsPromotionDetailsCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    promotion: ImsPromotion;
    urn: Scalars["URN"]["output"];
  };

export type ImsPromotionErrorCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    errorCode: PromotionErrorCode;
    promotionName: Maybe<Scalars["String"]["output"]>;
    seeAll: Maybe<ViewLink>;
    urn: Scalars["URN"]["output"];
  };

export type ImsPromotionInteractionResponse = {
  promotion: Maybe<ImsPromotion>;
  responseCode: Scalars["Int"]["output"];
  responseMessage: Maybe<Scalars["String"]["output"]>;
};

export type ImsPromotionStateCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    depositLink: Maybe<ViewLink>;
    promotion: ImsPromotion;
    title: Scalars["String"]["output"];
    urn: Scalars["URN"]["output"];
  };

export type ImsPromotionTermsAndConditionsCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    promotion: ImsPromotion;
    urn: Scalars["URN"]["output"];
  };

/** Represents a View related to a IMS Promotion */
export type ImsPromotionView = View & {
  /** The bottom bar */
  bottomBar: Maybe<BottomBar>;
  /** The view category */
  category: Maybe<ViewCategory>;
  /** The layout items on the view */
  items: ViewItemsConnection;
  /** The left side bar */
  leftSidebar: Maybe<LeftSidebar>;
  /** The regulatory data used for the regulatory header */
  regulatoryData: Maybe<RegulatoryData>;
  /** The view title */
  title: Maybe<Scalars["String"]["output"]>;
  /** The view url */
  url: Scalars["URL"]["output"];
  /** The view urn */
  urn: Scalars["URN"]["output"];
  /** The xsell bar */
  xsellBar: Maybe<XSellBar>;
};

/** Represents a View related to a IMS Promotion */
export type ImsPromotionViewItemsArgs = {
  first: InputMaybe<Scalars["Int"]["input"]>;
};

export type IncidentTypesFilterInput = {
  incidentType: Scalars["String"]["input"];
  period: Scalars["String"]["input"];
};

/** Represents a card with a football stats information for scoreboard */
export type IncidentsCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card connected sport event fixture */
    fixture: FootballFixture;
    /** If the card is highlighted */
    isHighlighted: Scalars["Boolean"]["output"];
    /** If the card should show empty state */
    showEmptyState: Scalars["Boolean"]["output"];
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a InformativeBlurb */
export type InformativeBlurb = {
  description: Maybe<DisplayName>;
  isCollapsed: Scalars["Boolean"]["output"];
  supplementaryInfo: Maybe<SupplementaryInfo>;
  title: DisplayName;
};

export type Ip = {
  max: Scalars["Float"]["output"];
  min: Scalars["Float"]["output"];
};

export type Isp = {
  americanOdd: Maybe<Scalars["Float"]["output"]>;
  betfairPlace: Maybe<Scalars["Float"]["output"]>;
  betfairWin: Maybe<Scalars["Float"]["output"]>;
  decimal: Maybe<Scalars["Float"]["output"]>;
  favourite: Maybe<Scalars["Boolean"]["output"]>;
  fractional: Maybe<FractionalOdds>;
};

export enum JackpotLogo {
  DailyJackpot = "DAILY_JACKPOT",
  DailyJackpotGlow = "DAILY_JACKPOT_GLOW",
  GamesNewDailyJackpot = "GAMES_NEW_DAILY_JACKPOT",
  JackpotKing = "JACKPOT_KING",
  MacauDailyJackpot = "MACAU_DAILY_JACKPOT",
  MustGoJackpot = "MUST_GO_JACKPOT",
  ProgressiveJackpot = "PROGRESSIVE_JACKPOT",
  PubFruit = "PUB_FRUIT",
}

export type Jerseys = {
  color: Maybe<Scalars["String"]["output"]>;
  type: Maybe<Scalars["String"]["output"]>;
  url: Maybe<Scalars["URL"]["output"]>;
};

export enum Label {
  Exclusive = "EXCLUSIVE",
  Featured = "FEATURED",
  Jackpot = "JACKPOT",
  New = "NEW",
  PlayItHereFirst = "PLAY_IT_HERE_FIRST",
  Premier = "PREMIER",
  Recommended = "RECOMMENDED",
  Upgraded = "UPGRADED",
}

/** The pairing of a label with a viewlink */
export type LabeledLink = {
  /** The link label */
  label: DisplayName;
  /** The link view link */
  viewLink: ViewLink;
};

/** The possible values of the last viewed product preference */
export enum LastViewedProduct {
  Exchange = "EXCHANGE",
  Sportsbook = "SPORTSBOOK",
}

/** Represents a Last Viewed Product Preference */
export type LastViewedProductPreference = Preference & {
  /** Available last viewed product preference options */
  lastViewedProductOptions: Array<LastViewedProduct>;
  /** The selected last viewed product preference option */
  selectedLastViewedProduct: LastViewedProduct;
  /** The last viewed product preference urn */
  urn: Scalars["URN"]["output"];
};

/** Represents a last viewed product preference input interface */
export type LastViewedProductPreferenceInput = {
  /** The last viewed product preference urn */
  urn: Scalars["URN"]["input"];
  /** The last viewed product preference new value */
  value: LastViewedProduct;
};

/** Layout preferences */
export type LayoutPreferencesInput = {
  /** Favorite Sports */
  favoriteSports: InputMaybe<Array<Scalars["URN"]["input"]>>;
  /** Market Tab Preference */
  marketTab: InputMaybe<MarketTab>;
  /** Module Layout Preference */
  moduleLayout: InputMaybe<ModuleLayout>;
  /** User Products Preference */
  userProducts: InputMaybe<Array<UserProducts>>;
};

/** Represents the left side bar */
export type LeftSidebar = {
  items: ViewItemsConnection;
  urn: Scalars["URN"]["output"];
};

/** Represents the left side bar */
export type LeftSidebarItemsArgs = {
  after: InputMaybe<Scalars["String"]["input"]>;
  first: InputMaybe<Scalars["Int"]["input"]>;
};

export type LegPart = {
  /** Deductions for eachway dead heat */
  deadHeatEachwayDeductions: Maybe<Scalars["Float"]["output"]>;
  /** Deductions for win dead heat */
  deadHeatWinDeductions: Maybe<Scalars["Float"]["output"]>;
  /** EachWay Factor */
  eachwayFactor: Maybe<EachWayFactor>;
  /** EachWay Places */
  eachwayPlaces: Maybe<Scalars["Int"]["output"]>;
  /** Name of the event */
  eventDescription: Scalars["String"]["output"];
  /** Market name */
  eventMarketDescription: Scalars["String"]["output"];
  /** The eventBet URN */
  eventUrn: Maybe<Scalars["URN"]["output"]>;
  /** Handicap */
  handicap: Maybe<Scalars["Float"]["output"]>;
  /** Indicates whether the leg is eligible for super sub */
  isSuperSub: Maybe<Scalars["Boolean"]["output"]>;
  /** The marketBet URN */
  marketBetUrn: Maybe<Scalars["URN"]["output"]>;
  /** The market id */
  marketId: Maybe<Scalars["String"]["output"]>;
  /** Market type */
  marketType: Maybe<Scalars["String"]["output"]>;
  /** Original leg price (before promotions applied) */
  originalPrice: Maybe<SportsbookOdds>;
  /** Outcome definition expressions */
  outcomeDefinitionExp: Maybe<OutcomeDefinitionExp>;
  /** Indicates the associated participants */
  participants: Maybe<Array<Maybe<Participant>>>;
  /** Leg price */
  price: Maybe<SportsbookOdds>;
  /** Price Type */
  priceType: Maybe<Scalars["String"]["output"]>;
  /**
   * The race runner
   * @deprecated Use raceRunnerKind that accounts for both horse racing runners and greyhound racing runners
   */
  raceRunner: Maybe<RaceRunner>;
  /** the kind of race runner the race will have */
  raceRunnerKind: Maybe<RaceRunnerKind>;
  /** The race urn */
  raceUrn: Maybe<Scalars["URN"]["output"]>;
  /** Rule 4 Deductions */
  rule4Deductions: Maybe<Scalars["Float"]["output"]>;
  /** ID of selected runner */
  selectionId: Maybe<Scalars["Int"]["output"]>;
  /** Name of selected runner */
  selectionName: Scalars["String"]["output"];
  /** The sport id */
  sportId: Maybe<Scalars["String"]["output"]>;
};

export enum LegType {
  /** Anytime goalscorer wincast */
  Aw = "AW",
  /** Combination forecast (3+ per leg, 6+ permed RFs) */
  Cf = "CF",
  /** Combination tricast (3+ per leg 6+ bets) */
  Ct = "CT",
  /** First goalscorer wincast */
  Fw = "FW",
  /** Higher/Lower */
  Hl = "HL",
  /** Last goalscorer wincast */
  Lw = "LW",
  /** Western Handicap with Line */
  Mh = "MH",
  /** Outcome Based */
  Ob = "OB",
  /** Reverse forecast selection (2 per leg) */
  Rf = "RF",
  /** Scorecast */
  Sc = "SC",
  /** Forecast selection (2 per leg) */
  Sf = "SF",
  /** Higher/Lower Split Line */
  Sl = "SL",
  /** Simple selection */
  Ss = "SS",
  /** Tricast selection (3 per leg) */
  Tc = "TC",
  /** Western (straight) Handicap */
  Wh = "WH",
}

/**
 * Represents links card with menu sections
 * TODO #THISISF-106
 * this should not be in regulatory module but depends on RegulatoryLinkItem, this refactor will cause a breaking change
 */
export type LinksCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The menu section links */
    section: Array<LinksMenuSections>;
    /** The links card urn */
    urn: Scalars["URN"]["output"];
  };

/**
 * Represents a card with menu sections that has a collection of links
 * TODO #THISISF-106
 * this should not be in regulatory module but depends on RegulatoryLinkItem, this refactor will cause a breaking change
 */
export type LinksMenuSections = {
  /** The menu sections links items */
  items: Array<RegulatoryLinkItem>;
  /** The links menu section label */
  sectionLabel: Scalars["String"]["output"];
  /** The links menu section type */
  sectionType: Scalars["String"]["output"];
  /** The links menu section title */
  title: Maybe<Scalars["String"]["output"]>;
};

export type Literal = {
  /** The decimal value */
  decimal: Scalars["Int"]["output"];
};

export type LiveGameData = {
  /** Name of the away team */
  awayTeamName: Scalars["String"]["output"];
  /** How many goals the away team scored when the leg was frozen */
  awayTeamScore: Scalars["Int"]["output"];
  /** Name of the home team */
  homeTeamName: Scalars["String"]["output"];
  /** How many goals the home team scored when the leg was frozen */
  homeTeamScore: Scalars["Int"]["output"];
  /** Minute of the match the leg was frozen */
  minute: Scalars["Int"]["output"];
};

export type LoginStateCadence = {
  loggedIn: Cadence;
  loggedOut: Cadence;
};

/** Represents a card with Lotteries */
export type LottoCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The Lotto Competition */
    competition: Competition;
    /** The events for lotto */
    events: Maybe<Array<SportsEvent>>;
    /** The market ids for polling */
    marketIds: Maybe<Array<Scalars["String"]["output"]>>;
    /** The markets for lotto */
    markets: Maybe<Array<SportsbookMarket>>;
    selectedLottoPebble: Maybe<Scalars["String"]["output"]>;
    /** Boolean to show competition name */
    shouldShowCompetitionName: Scalars["Boolean"]["output"];
    /** The card urn */
    urn: Scalars["URN"]["output"];
    /** The win average odds for each combination */
    winAvgOdds: Maybe<Array<Maybe<WinAvgOdds>>>;
  };

/** Represents the loyalty banner card */
export type LoyaltyPromoCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The associated promo */
    loyaltyPromotion: LoyaltyPromotion;
    /** The card theme (light or dark) */
    theme: PromoTheme;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a loyalty promotion */
export type LoyaltyPromotion = {
  /** To be displayed as "title" on both the mini and bigger banners */
  name: Scalars["String"]["output"];
  /** The card image */
  promoImage: Maybe<PromoImage>;
  /** The current state of the promotion */
  state: PromoState;
  /** The promo T&Cs */
  termsAndConditions: PromoTermsAndConditions;
  /** For the bigger card only */
  title: Maybe<Scalars["String"]["output"]>;
  /** The promotion urn */
  urn: Scalars["URN"]["output"];
};

/**
 * Represents a product and its maintenance status.
 *
 * Includes meta data about product
 */
export type MaintenanceProduct = {
  name: TranslatableText;
  product: Product;
  status: SplashStatus;
  viewLink: ViewLink;
};

/** Represents a Maintenance View */
export type MaintenanceView = View & {
  /** The bottom bar */
  bottomBar: Maybe<BottomBar>;
  /** The view category */
  category: Maybe<ViewCategory>;
  /** The layout items on the view */
  items: ViewItemsConnection;
  /**
   * The left side bar
   * @deprecated Use LeftSidebar Query instead
   */
  leftSidebar: Maybe<LeftSidebar>;
  products: Array<MaintenanceProduct>;
  /** The view redirect url */
  redirectUrl: Scalars["URL"]["output"];
  /** The regulatory data used for the regulatory header */
  regulatoryData: Maybe<RegulatoryData>;
  /** The view title */
  title: Maybe<Scalars["String"]["output"]>;
  twitterUrl: Scalars["URL"]["output"];
  /** The view url */
  url: Scalars["URL"]["output"];
  /** The view urn */
  urn: Scalars["URN"]["output"];
  /** The XSell bar */
  xsellBar: Maybe<XSellBar>;
};

/** Represents a PPB market */
export type Market = ExchangeMarket | SportsbookMarket;

export type MarketBet = {
  /** The Delay of the bet */
  betDelay: Maybe<Scalars["Int"]["output"]>;
  /** The Cashout quotes */
  cashoutQuotes: Array<ExchangeCashoutQuote>;
  /** The commission of the market */
  commission: Maybe<Scalars["Float"]["output"]>;
  /** The description */
  description: Scalars["String"]["output"];
  /** Exchange light market view's navigation link */
  exchangeLightMarketViewLink: Maybe<ViewLink>;
  /** The id */
  id: Scalars["String"]["output"];
  /** The liability of the market */
  liability: Maybe<Scalars["Float"]["output"]>;
  /** The connected view's navigation link */
  marketViewLink: Maybe<ViewLink>;
  /** The Net profit */
  netProfit: Maybe<Scalars["Float"]["output"]>;
  /** Number of orders */
  numOfOrders: Scalars["Int"]["output"];
  /** Number of unmatched bets */
  numOfUnmatched: Scalars["Int"]["output"];
  /** The Gross profit */
  profit: Maybe<Scalars["Float"]["output"]>;
  /**
   * Unmatched edit view's navigation link
   * @deprecated Use `exchangeLightMarketViewLink` instead
   */
  unmatchedEditViewLink: Maybe<ViewLink>;
  /** The market bet urn */
  urn: Scalars["URN"]["output"];
};

/** Represents a card that holds information of a exchange bet */
export type MarketBetCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The bet card group urn */
    betCardGroupURN: Scalars["URN"]["output"];
    /** The market bet */
    marketBet: MarketBet;
    /** The bet card group urn */
    marketBetCardGroupURN: Scalars["URN"]["output"];
    /** The market bet card matched status - matched or unmatched, if defined */
    matchedStatus: Maybe<Scalars["String"]["output"]>;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a Market Bet Card Group */
export type MarketBetCardGroup = CardGroup &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The layout items */
    items: MarketBetCardGroupConnection;
    /** The card group urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a connection between View and [MarketBetCardGroup] */
export type MarketBetCardGroupConnection = {
  edges: Array<Maybe<MarketBetCardGroupEdge>>;
};

/** Represents a MarketBetCardGroup edge */
export type MarketBetCardGroupEdge = {
  node: MarketBetCardGroupItems;
};

/** Represents MarketBetCardGroup allowed edge Items */
export type MarketBetCardGroupItems = MarketBetCard | MarketBetExpandableCardGroup | MarketBetSelectionCardGroup;

/** Represents a Market Bet Selection Card Group */
export type MarketBetExpandableCardGroup = CardGroup &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** Flag if the group is expanded */
    isExpanded: Scalars["Boolean"]["output"];
    /** The layout items */
    items: MarketBetExpandableCardGroupConnection;
    /** The market bet card group urn */
    marketBetCardGroupURN: Scalars["URN"]["output"];
    /** The card group urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a connection between View and [MarketBetExpandableCardGroup] */
export type MarketBetExpandableCardGroupConnection = {
  edges: Array<Maybe<MarketBetExpandableCardGroupEdge>>;
};

/** Represents a MarketBetExpandableCardGroup edge */
export type MarketBetExpandableCardGroupEdge = {
  node: MarketBetExpandableCardGroupItems;
};

/** Represents MarketBetExpandableCardGroup allowed edge Items */
export type MarketBetExpandableCardGroupItems = MarketBetSelectionCardGroup;

/** Represents a card that holds information of a exchange bet selection */
export type MarketBetSelectionCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The BSP liability */
    bspLiability: Maybe<Scalars["Float"]["output"]>;
    /** The device used to place the bet */
    deviceId: Maybe<Scalars["String"]["output"]>;
    /** Unmatched edit view's navigation link */
    editViewLink: Maybe<ViewLink>;
    /** The free bet size */
    freeBetSize: Scalars["Float"]["output"];
    /** Order handicap */
    handicap: Scalars["Float"]["output"];
    /** The marketBetSelection id */
    id: Scalars["String"]["output"];
    /** Is this a BSP bet */
    isBsp: Maybe<Scalars["Boolean"]["output"]>;
    /** Flag to denote if the bet was placed by the cashout service. */
    isCashout: Maybe<Scalars["Boolean"]["output"]>;
    /** Is free bet */
    isFreeBet: Scalars["Boolean"]["output"];
    /** The isUnmatched */
    isUnmatched: Scalars["Boolean"]["output"];
    /** The liability of the bet */
    liability: Maybe<Scalars["Float"]["output"]>;
    /** The market bet card group URN */
    marketBetCardGroupURN: Scalars["URN"]["output"];
    /** The market bet URN */
    marketBetURN: Scalars["URN"]["output"];
    /** The market URN */
    marketURN: Scalars["URN"]["output"];
    /** Date/Time bet was matched */
    matchedDate: Maybe<Scalars["String"]["output"]>;
    /** Date/Time Bet was placed at */
    placedDate: Scalars["String"]["output"];
    /** Price in LBR, priceRequested in CBR */
    price: Scalars["Float"]["output"];
    /** The price matched */
    priceMatched: Scalars["Float"]["output"];
    /** potentialProfit in LBR, profit in CBR */
    profit: Maybe<Scalars["Float"]["output"]>;
    /** betOutcome in CBR */
    result: Maybe<ExchangeBetOutcome>;
    /** The runner name, maybe including the handicap, translated into the customer's locale. */
    runnerDesc: Scalars["String"]["output"];
    /** The runner URN */
    runnerURN: Scalars["URN"]["output"];
    /** The selectionId */
    selectionId: Scalars["Float"]["output"];
    /** Date/Time bet was cleared (settled) */
    settledDate: Maybe<Scalars["String"]["output"]>;
    /** Order side */
    side: Maybe<ExchangeSide>;
    /** SizeMatched in LBR matched, sizeRemaining in LBR unmatched, sizeSettled in CBR */
    size: Maybe<Scalars["Float"]["output"]>;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a Market Bet Selection Card Group */
export type MarketBetSelectionCardGroup = CardGroup &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The bet card group urn */
    betCardGroupURN: Scalars["URN"]["output"];
    /** The layout items */
    items: MarketBetSelectionCardGroupConnection;
    /** The market bet card group urn */
    marketBetCardGroupURN: Scalars["URN"]["output"];
    /** The market bet card urn */
    marketBetCardURN: Scalars["URN"]["output"];
    /** The card group urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a connection between View and [MarketBetSelectionCardGroup] */
export type MarketBetSelectionCardGroupConnection = {
  edges: Array<Maybe<MarketBetSelectionCardGroupEdge>>;
};

/** Represents a MarketBetSelectionCardGroup edge */
export type MarketBetSelectionCardGroupEdge = {
  node: MarketBetSelectionCardGroupItems;
};

/** Represents MarketBetSelectionCardGroup allowed edge Items */
export type MarketBetSelectionCardGroupItems = MarketBetSelectionCard;

/** Breadcrumb for a Market */
export type MarketBreadcrumb = {
  /** The market view */
  marketView: MarketView;
};

/** Represents a associated markets card */
export type MarketCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** Represents the blurbs to be displayed in the Market Card */
    blurbs: Maybe<Array<Blurb>>;
    /**
     * The default market index
     * @deprecated is always 0
     */
    defaultIndex: Scalars["Int"]["output"];
    /**
     * The card markets with runners sorted for both exchange and sportsbook
     * @deprecated Use runnersDisplay. The exchange/sportsbook dual shape is legacy; cards are single-product.
     */
    displayRunners: DisplayRunners;
    /** How the card should behave with respect to expansion / collapse. Null when not applicable (swimlane, quick links). */
    expansionBehavior: Maybe<MarketCardExpansionBehavior>;
    /**
     * Identifies whether runner details should be expandable or not
     * @deprecated Use sportsbookRunner.participant != null per-runner. `participant.__typename` indicates which kind of detail to render.
     */
    isRunnerExpandable: Maybe<Scalars["Boolean"]["output"]>;
    /**
     * The context that might include competition, event, meeting, race
     * @deprecated Not being used
     */
    marketsHierarchy: MarketHierarchy;
    /**
     * The number to items to display
     * @deprecated Use runnersDisplay.displayLimit to drive Show More.
     */
    numberOfItemsToDisplay: Maybe<Scalars["Int"]["output"]>;
    /**
     * The list of players associated with this market card's runners. Empty when the market has no participant-based runners or is not football.
     * @deprecated Walk runnersDisplay.runners.runner.participant for `... on FootballPlayerFixtureContext`. Dedupe by URN client-side.
     */
    players: MarketCardPlayersConnection;
    /** Market promotion (Extra places and Money Back) */
    promotion: Maybe<MarketPromo>;
    /**
     * The view links to all selections for this market
     * @deprecated Use runnersDisplay.runners.runnerView (exchange items only). Sportsbook items have no runner view.
     */
    runnerViewLinks: Array<RunnerViewLink>;
    /**
     * Curated runner view for this card. Single-product (exchange or sportsbook).
     * Items wrap the underlying runner (and, on exchange, the RunnerView to link to).
     * The default `runners` call returns the full curated list; pass `applyDisplayLimit: true` for the lean collapsed payload.
     */
    runnersDisplay: RunnersDisplay;
    /** Represents the stat associated with the Market Card */
    stat: Maybe<MarketStat>;
    /** Identifies a custom template to use for this market */
    template: MarketTemplate;
    /** The card title */
    title: Maybe<Scalars["String"]["output"]>;
    /** The card urn */
    urn: Scalars["URN"]["output"];
    /** The card connected views */
    viewLinks: Array<ViewLink>;
  };

/** Represents a associated markets card */
export type MarketCardPlayersArgs = {
  first: InputMaybe<Scalars["Int"]["input"]>;
};

/** Expansion behavior for a MarketCard inside a vertical layout. */
export enum MarketCardExpansionBehavior {
  /** Collapsible and starts closed. */
  CollapsedByDefault = "COLLAPSED_BY_DEFAULT",
  /** Collapsible and starts open. */
  ExpandedByDefault = "EXPANDED_BY_DEFAULT",
  /** Not collapsible — the card has no accordion chrome. */
  Fixed = "FIXED",
}

/** Represents a MarketCard player edge */
export type MarketCardPlayerEdge = {
  cursor: Maybe<Scalars["String"]["output"]>;
  node: PlayerContext;
};

/** Represents a connection between MarketCard and [PlayerContext] */
export type MarketCardPlayersConnection = {
  edges: Array<Maybe<MarketCardPlayerEdge>>;
  pageInfo: Maybe<PageInfo>;
};

/** Represents a associated extended markets card */
export type MarketExtendedCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The cashout quotes to be displayed on the market card */
    cashoutQuotes: Maybe<CashoutQuotes>;
    /**
     * The default market index
     * @deprecated is always 0
     */
    defaultIndex: Scalars["Int"]["output"];
    /** The card markets sorted for both exchange and sportsbook */
    displayRunners: DisplayRunners;
    /** How the card should behave with respect to expansion / collapse. Null when not applicable (swimlane, quick links). */
    expansionBehavior: Maybe<MarketCardExpansionBehavior>;
    /**
     * Identifies wether runner details should be expandable or not
     * @deprecated Use sportsbookRunner.participant != null per-runner. `participant.__typename` indicates which kind of detail to render.
     */
    isRunnerExpandable: Maybe<Scalars["Boolean"]["output"]>;
    /**
     * The context that might include competition, event, meeting, race
     * @deprecated Not being used
     */
    marketsHierarchy: MarketHierarchy;
    /** The number to items to display */
    numberOfItemsToDisplay: Maybe<Scalars["Int"]["output"]>;
    /**
     * The list of players associated with this market card's runners. Empty when the market has no participant-based runners or is not football.
     * @deprecated Walk runnersDisplay.runners.runner.participant for `... on FootballPlayerFixtureContext`. Dedupe by URN client-side.
     */
    players: MarketCardPlayersConnection;
    /** Market promotion (Extra places and Money Back) */
    promotion: Maybe<MarketPromo>;
    /** The view link to the race RaceView */
    raceViewLink: Maybe<ViewLink>;
    /** The view links to all selections for this market */
    runnerViewLinks: Array<RunnerViewLink>;
    /** Represents the stat associated with the Market Card */
    stat: Maybe<MarketStat>;
    /** Identifies a custom template to use for this market */
    template: MarketTemplate;
    /** The card title */
    title: Maybe<Scalars["String"]["output"]>;
    /** The card urn */
    urn: Scalars["URN"]["output"];
    /** The card connected views */
    viewLinks: Array<ViewLink>;
  };

/** Represents a associated extended markets card */
export type MarketExtendedCardPlayersArgs = {
  first: InputMaybe<Scalars["Int"]["input"]>;
};

/** Represents a card with a market graph */
export type MarketGraphsCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The market for this card */
    market: ExchangeMarket;
    /** The runner's market graph */
    runner: RunnerMarketGraph;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a card with a market graph */
export type MarketGraphsCardRunnerArgs = {
  urn: InputMaybe<Scalars["URN"]["input"]>;
};

/**
 * Represents the hierarchy of a market
 * E.g.: a football belongs to a event which belongs to a competition
 * E.g.: a racing market belongs to a race which belongs to a meeting
 * More contexts to come later (e.g.: tennis: multiple level events)
 */
export type MarketHierarchy = EventCompetitionHierarchy | EventHierarchy | RaceHierarchy;

/** Represents a market high volatile information like status and prices */
export type MarketLiveData = ExchangeMarketLiveData | SportsbookMarketLiveData;

export type MarketPromo = {
  description: Scalars["String"]["output"];
  signposting: MarketPromoSignposting;
  title: Scalars["String"]["output"];
};

/** Represents possible signpost types for Market promos ("extra places" or "money back") */
export enum MarketPromoSignposting {
  /** Extra places promo signposting */
  ExtraPlaces = "EXTRA_PLACES",
  /** Money Back promo signposting */
  MoneyBack = "MONEY_BACK",
}

/** Represents a card that holds market rules */
export type MarketRulesCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The rules clarification */
    clarifications: Maybe<Scalars["String"]["output"]>;
    /** True if the discount is allowed */
    discountAllowed: Scalars["Boolean"]["output"];
    /** The target display mode */
    displayMode: Maybe<DisplayMode>;
    /** The market rules market start date time */
    eventStartTime: Maybe<Scalars["String"]["output"]>;
    /** The market rules footer */
    footer: Maybe<Scalars["String"]["output"]>;
    /** The market base rate */
    marketBaseRate: Scalars["Float"]["output"];
    /** The market betting type */
    marketBettingType: Maybe<MarketRulesMarketBettingType>;
    /** The rules market name */
    marketName: Scalars["String"]["output"];
    /** The market number of winners */
    numberOfWinners: Scalars["Int"]["output"];
    /** The market rules sections */
    sections: Array<MarketRulesSection>;
    /** The Market Rules Card urn */
    urn: Scalars["URN"]["output"];
    /** The wallet information */
    wallet: Scalars["String"]["output"];
  };

/** The possible values of the market betting type */
export enum MarketRulesMarketBettingType {
  /** Any number of winners */
  AnyNumbWinners = "ANY_NUMB_WINNERS",
  /** Handicap Betting */
  HandicapBet = "HANDICAP_BET",
  /** To be placed */
  ToBePlaced = "TO_BE_PLACED",
  /** Win only market */
  WinOnlyMarket = "WIN_ONLY_MARKET",
}

/** Represents a market rules section */
export type MarketRulesSection = {
  content: Scalars["String"]["output"];
  name: MarketRulesSectionName;
};

/** The possible values of the market rules section name */
export enum MarketRulesSectionName {
  /** Customer awareness section name */
  CustomerAwareness = "CUSTOMER_AWARENESS",
  /** Market information section name */
  MarketInformation = "MARKET_INFORMATION",
}

/** Represents a Market Rules View */
export type MarketRulesView = View & {
  /** The bottom bar */
  bottomBar: Maybe<BottomBar>;
  /** The view category */
  category: Maybe<ViewCategory>;
  /** The layout items on the view */
  items: ViewItemsConnection;
  /** The left side bar */
  leftSidebar: Maybe<LeftSidebar>;
  /** The regulatory data used for the regulatory header */
  regulatoryData: Maybe<RegulatoryData>;
  /** The view title */
  title: Maybe<Scalars["String"]["output"]>;
  /** The view url */
  url: Scalars["URL"]["output"];
  /** The view urn */
  urn: Scalars["URN"]["output"];
  /** The xsell bar */
  xsellBar: Maybe<XSellBar>;
};

/** Represents a Market Rules View */
export type MarketRulesViewItemsArgs = {
  after: InputMaybe<Scalars["String"]["input"]>;
  first: InputMaybe<Scalars["Int"]["input"]>;
};

/** Input type for market selection */
export type MarketSelectionInput = {
  /** The market id */
  marketId: Scalars["String"]["input"];
  /** The selection id */
  selectionId: Scalars["Int"]["input"];
};

/** Represents the possible stats to be associated with a market */
export enum MarketStat {
  AvgAssists = "AVG_ASSISTS",
  AvgFouls = "AVG_FOULS",
  AvgFoulsWon = "AVG_FOULS_WON",
  AvgFoulInvolvements = "AVG_FOUL_INVOLVEMENTS",
  AvgGoals = "AVG_GOALS",
  AvgGoalsAssists = "AVG_GOALS_ASSISTS",
  AvgShots = "AVG_SHOTS",
  AvgShotsOnTarget = "AVG_SHOTS_ON_TARGET",
  AvgYellowRedCards = "AVG_YELLOW_RED_CARDS",
  TotalYellowRedCards = "TOTAL_YELLOW_RED_CARDS",
}

/** The possible values of the market tab preferences */
export enum MarketTab {
  Exchange = "EXCHANGE",
  Sportsbook = "SPORTSBOOK",
}

/** Represents a Market Tab Preference */
export type MarketTabPreference = Preference & {
  /**
   * Available market tab preferences options
   * @deprecated not used value is always sportsbook
   */
  marketTabOptions: Array<MarketTab>;
  /**
   * The selected market tab preferences option
   * @deprecated not used value is always sportsbook
   */
  selectedMarketTab: Maybe<MarketTab>;
  /**
   * The market tab preference urn
   * @deprecated not used value is always sportsbook
   */
  urn: Scalars["URN"]["output"];
};

/** Represents a market tab preferences input interface */
export type MarketTabPreferenceInput = {
  /** The market tab preference urn */
  urn: Scalars["URN"]["input"];
  /**
   * The market tab preference new value
   * @deprecated Value is always sportsbook
   */
  value: InputMaybe<MarketTab>;
};

/** Represents the possible market template types */
export enum MarketTemplate {
  /** The default template */
  Default = "DEFAULT",
  /** The template used for markets with 3 or less runners (e.g. MATCH_ODDS) */
  Inline = "INLINE",
  /** The temaplte used for outright markets (e.g. WINNER) */
  Outright = "OUTRIGHT",
  /** The template used for scores (e.g CORRECT_SCORE) */
  Score = "SCORE",
}

export type MarketType = {
  urn: Scalars["URN"]["output"];
};

/** Represents a market type filter */
export type MarketTypeFilter = {
  availableOptions: Array<MarketTypeFilterOption>;
  defaultOption: Maybe<MarketTypeFilterOption>;
  /** Indicates how the filter should be visually rendered */
  layout: MarketTypeFilterLayout;
  urn: Scalars["URN"]["output"];
};

/** Defines the visual presentation style for the Market Type filter within a Coupon card. */
export enum MarketTypeFilterLayout {
  /** Render the filter options as a vertical list of choices. */
  List = "LIST",
  /** Render the filter options as horizontal 'pebbles' */
  Pebbles = "PEBBLES",
}

/** Represents a market type filter option */
export type MarketTypeFilterOption = {
  marketType: MarketType;
  name: Scalars["String"]["output"];
};

/** Represents a View related to a Market */
export type MarketView = View & {
  /** The bottom bar */
  bottomBar: Maybe<BottomBar>;
  /** The canonical url on the view */
  canonicalUrl: Maybe<Scalars["String"]["output"]>;
  /** The view category */
  category: Maybe<ViewCategory>;
  /** The layout items on the view */
  items: ViewItemsConnection;
  /** The left side bar */
  leftSidebar: Maybe<LeftSidebar>;
  /** The view related market */
  mainMarket: Market;
  /** The regulatory data used for the regulatory header */
  regulatoryData: Maybe<RegulatoryData>;
  /** The view title */
  title: Maybe<Scalars["String"]["output"]>;
  /** The view url */
  url: Scalars["URL"]["output"];
  /** The view urn */
  urn: Scalars["URN"]["output"];
  /** The xsell bar */
  xsellBar: Maybe<XSellBar>;
};

/** Represents a View related to a Market */
export type MarketViewItemsArgs = {
  after: InputMaybe<Scalars["String"]["input"]>;
  first: InputMaybe<Scalars["Int"]["input"]>;
};

/** Represents a card that provides a connection to a market view */
export type MarketViewLinkCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card badge */
    badge: Maybe<Badge>;
    /** The card connected market */
    market: Market;
    /** The card urn */
    urn: Scalars["URN"]["output"];
    /** The card connected view link */
    viewLink: ViewLink;
  };

/** Represents a match stat selection card */
export type MatchStatSelectionCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** Incident type */
    incidentType: Maybe<Scalars["String"]["output"]>;
    /** The market */
    market: SportsbookMarket;
    /** The match stat selection */
    runner: Runner;
    /** Stat description */
    statsDescription: Maybe<Scalars["String"]["output"]>;
    /** The card subtitle */
    subtitle: Scalars["String"]["output"];
    /** The card title */
    title: MatchStatTitle;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents the title structure for MatchStatSelectionCard */
export type MatchStatTitle = {
  /** The combiner string */
  combiner: Maybe<Scalars["String"]["output"]>;
  /** The array of player names */
  playerNames: Array<Scalars["String"]["output"]>;
};

/** Represents a card with a sports event fixture match stats information */
export type MatchStatsCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card connected sport event fixture */
    fixture: FootballFixture;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a card with a sports event fixture match timeline information */
export type MatchTimelineCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card connected sport event fixture */
    fixture: FootballFixture;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a PPB meeting */
export type Meeting = {
  /** The country code */
  country: Scalars["String"]["output"];
  countryFlag: Maybe<Image>;
  /** The meeting open date */
  date: Maybe<Scalars["String"]["output"]>;
  /** The meeting id */
  meetingId: Scalars["String"]["output"];
  /** The meeting name */
  name: Scalars["String"]["output"];
  /** The meeting sport */
  sport: Sport;
  /** The meeting urn */
  urn: Scalars["URN"]["output"];
  /** The venue */
  venue: Scalars["String"]["output"];
};

/** Represents a mini promo card of type Editorial */
export type MiniEditorialPromoCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card action */
    cta: Maybe<EditorialPromoActions>;
    /** The card signposting (icon or badge) */
    signposting: Maybe<PromoSignposting>;
    /** The card text */
    subTitle: Maybe<Scalars["String"]["output"]>;
    /** The card terms and conditions */
    termsAndConditions: Maybe<PromoTermsAndConditions>;
    /** The card title */
    title: Scalars["String"]["output"];
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents the mini promo banner card */
export type MiniPromoBannerCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The associated promo */
    loyaltyPromotion: LoyaltyPromotion;
    /** The card theme (light or dark) */
    theme: PromoTheme;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a mini promo card of type Selection */
export type MiniSelectionPromoCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card action */
    cta: SelectionPromoActions;
    /** The card signposting (icon or badge) */
    signposting: Maybe<PromoSignposting>;
    /** The card text */
    subTitle: Maybe<Scalars["String"]["output"]>;
    /** The card terms and conditions */
    termsAndConditions: Maybe<PromoTermsAndConditions>;
    /** The card title */
    title: Scalars["String"]["output"];
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents My Account minimized banner */
export type MinimizedBannerInfo = {
  /** Minimized banner body */
  bodyText: Maybe<Scalars["String"]["output"]>;
};

export type ModalElement = {
  /** The modal element URN (built based on it's id) */
  urn: Scalars["URN"]["output"];
};

/** The possible values of the module layout preferences */
export enum ModuleLayout {
  Coupon = "COUPON",
  Swimlane = "SWIMLANE",
}

/** Represents a Module Layout Preference */
export type ModuleLayoutPreference = Preference & {
  /**
   * Available module layout preferences options
   * @deprecated not used value is always coupon
   */
  layoutOptions: Array<ModuleLayout>;
  /**
   * The selected module layout preferences option
   * @deprecated not used value is always coupon
   */
  selectedLayout: Maybe<ModuleLayout>;
  /**
   * The module layout preference urn
   * @deprecated not used value is always coupon
   */
  urn: Scalars["URN"]["output"];
};

/** Represents a module layout preferences input interface */
export type ModuleLayoutPreferenceInput = {
  /** The module layout preference urn */
  urn: Scalars["URN"]["input"];
  /**
   * The module layout preference new value
   * @deprecated Value is always coupon
   */
  value: InputMaybe<ModuleLayout>;
};

export type MonterosaContentCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The monterosa host url */
    host: Scalars["String"]["output"];
    /** The monterosa event id */
    monterosaEventId: Maybe<Scalars["String"]["output"]>;
    /** The monterosa project id */
    projectId: Scalars["String"]["output"];
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a month filter */
export type MonthFilter = {
  /** Represents the available options for the filter */
  availableOptions: Array<MonthFilterOption>;
  /** Represents the default option for the filter */
  defaultOptions: Maybe<Array<MonthFilterOption>>;
  /** The filter urn */
  urn: Scalars["URN"]["output"];
};

/** Represents a month filter option */
export type MonthFilterOption = {
  /** The filter option date (ISO format) */
  date: Scalars["String"]["output"];
  /** The filter option urn */
  urn: Scalars["URN"]["output"];
};

export type MoreInfoDetails = {
  moreInfoDetails: Array<RichText>;
  urn: Scalars["URN"]["output"];
};

/** Represents a TBD Mutation interface */
export type Mutation = {
  /** Represents a TBD acceptPromotion mutation interface */
  acceptPromotion: ImsPromotionInteractionResponse;
  cancelPromotion: ImsPromotionInteractionResponse;
  /** Checks if a Social Profile username is valid and available */
  checkSocialProfileUsername: CheckSocialProfileUsernameResult;
  /** Increments a Tip copy counter */
  copyTip: CopyTipResult;
  /** Creates a Social Profile for the user's account */
  createSocialProfile: SocialProfileResponse;
  /** Represents an OBB PlaceBet mutation interface */
  obbPlaceBet: PlaceBetResponse;
  optinCppPromo: Maybe<OptInPromoResponse>;
  readWebMessage: ReadWebMessageResponse;
  /** Represents a Favourite Markets mutation interface */
  setFavouriteMarket: SetFavouriteMarketResponse;
  /** Represents a TBD preferences mutation interface */
  setPreferences: SetPreferencesPayload;
  /** Increments a Tip share counter */
  shareTip: ShareTipResult;
  /** Sends a message to the chat bot */
  sportsbookChatBotSendMessage: SportsbookChatBotSendMessageResponse;
  /** Decrements a Tip share counter */
  unshareTip: UnshareTipResult;
  /** Updates the Social Profile */
  updateSocialProfile: SocialProfileResponse;
};

/** Represents a TBD Mutation interface */
export type MutationAcceptPromotionArgs = {
  amount: InputMaybe<Scalars["Float"]["input"]>;
  urn: Scalars["URN"]["input"];
};

/** Represents a TBD Mutation interface */
export type MutationCancelPromotionArgs = {
  bonusInstanceCode: Scalars["String"]["input"];
  urn: Scalars["URN"]["input"];
};

/** Represents a TBD Mutation interface */
export type MutationCheckSocialProfileUsernameArgs = {
  input: CheckSocialProfileUsernameInput;
};

/** Represents a TBD Mutation interface */
export type MutationCopyTipArgs = {
  tipId: Scalars["String"]["input"];
};

/** Represents a TBD Mutation interface */
export type MutationCreateSocialProfileArgs = {
  input: CreateSocialProfileInput;
};

/** Represents a TBD Mutation interface */
export type MutationObbPlaceBetArgs = {
  requestInput: PlaceBetRequestInput;
};

/** Represents a TBD Mutation interface */
export type MutationOptinCppPromoArgs = {
  urn: Scalars["URN"]["input"];
};

/** Represents a TBD Mutation interface */
export type MutationReadWebMessageArgs = {
  customerMessageId: Scalars["Float"]["input"];
};

/** Represents a TBD Mutation interface */
export type MutationSetFavouriteMarketArgs = {
  contentSectionURN: Scalars["URN"]["input"];
  isFavourite: Scalars["Boolean"]["input"];
};

/** Represents a TBD Mutation interface */
export type MutationSetPreferencesArgs = {
  input: SetPreferencesInput;
};

/** Represents a TBD Mutation interface */
export type MutationShareTipArgs = {
  betId: Scalars["String"]["input"];
};

/** Represents a TBD Mutation interface */
export type MutationSportsbookChatBotSendMessageArgs = {
  input: SportsbookChatBotSendMessageInput;
};

/** Represents a TBD Mutation interface */
export type MutationUnshareTipArgs = {
  input: UnshareInput;
};

/** Represents a TBD Mutation interface */
export type MutationUpdateSocialProfileArgs = {
  input: UpdateSocialProfileInput;
};

/** Represents my account view */
export type MyAccountView = View & {
  /** The bottom bar */
  bottomBar: Maybe<BottomBar>;
  /** The view category */
  category: Maybe<ViewCategory>;
  /** The layout items on the my account view */
  items: ViewItemsConnection;
  /** The left side bar */
  leftSidebar: Maybe<LeftSidebar>;
  /** The regulatory data used for the regulatory header */
  regulatoryData: Maybe<RegulatoryData>;
  /** The view title */
  title: Maybe<Scalars["String"]["output"]>;
  /** The view url */
  url: Scalars["URL"]["output"];
  /** The my account view urn */
  urn: Scalars["URN"]["output"];
  /** The wizard url */
  wizardUrl: Maybe<Scalars["String"]["output"]>;
  /** The xsell bar */
  xsellBar: Maybe<XSellBar>;
};

/** Represents my account view */
export type MyAccountViewItemsArgs = {
  after: InputMaybe<Scalars["String"]["input"]>;
  first: InputMaybe<Scalars["Int"]["input"]>;
};

export type MyBetsHeaderItem = GenericSwitcherCard;

/** Represents a HeaderItem edge */
export type MyBetsHeaderItemEdge = {
  cursor: Maybe<Scalars["String"]["output"]>;
  node: MyBetsHeaderItem;
  theme: Maybe<ViewItemTheme>;
};

/** The possible types of my bets bet status filter. */
export enum MyBetsMatchedStatusFilter {
  /** Matched filter value */
  Matched = "MATCHED",
  /** Unmatched filter value */
  Unmatched = "UNMATCHED",
}

/** The possible types of my bets view order type filter. */
export enum MyBetsOrderTypeFilter {
  /** Open bet order type */
  Open = "OPEN",
  /** Settled bet order type */
  Settled = "SETTLED",
}

/** The possible types of my bets view product type filter. */
export enum MyBetsProductTypeFilter {
  /** Exchange filter value */
  Exchange = "EXCHANGE",
  /** Sportsbook filter value */
  Sportsbook = "SPORTSBOOK",
}

/** Represents a View related to a My Bets */
export type MyBetsView = View & {
  /** The bottom bar */
  bottomBar: Maybe<BottomBar>;
  /** The view category */
  category: Maybe<ViewCategory>;
  /** The filters applied on the page */
  filters: MyBetsViewFilters;
  /** If empty state shows image */
  hasEmptyStateImage: Scalars["Boolean"]["output"];
  /** The layout header items on the view */
  headerItems: MyBetsViewHeaderItemsConnection;
  /** The layout items on the view */
  items: ViewItemsConnection;
  /** The left side bar */
  leftSidebar: Maybe<LeftSidebar>;
  /** The regulatory data used for the regulatory header */
  regulatoryData: Maybe<RegulatoryData>;
  /** The settlement link */
  settlementLink: Maybe<Scalars["URL"]["output"]>;
  /** The view title */
  title: Maybe<Scalars["String"]["output"]>;
  /** The transaction history link */
  transactionHistoryLink: ViewLink;
  /** The view url */
  url: Scalars["URL"]["output"];
  /** The view urn */
  urn: Scalars["URN"]["output"];
  /** The xsell bar */
  xsellBar: Maybe<XSellBar>;
};

/** Represents a View related to a My Bets */
export type MyBetsViewItemsArgs = {
  after: InputMaybe<Scalars["String"]["input"]>;
  first: InputMaybe<Scalars["Int"]["input"]>;
};

/** Represents a my bets view bet status available filters and the selected one. */
export type MyBetsViewFilterByMatchedStatusItemType = {
  /** The filter item */
  filter: MyBetsMatchedStatusFilter;
  /** The URN  for the filter item */
  filterURN: Scalars["URN"]["output"];
  /** The number of bets for the filter */
  numberOfBets: Maybe<Scalars["Int"]["output"]>;
};

/** Represents a my bets view bet status available filters and the selected one. */
export type MyBetsViewFilterByMatchedStatusType = {
  /** Filter selected index on items list */
  defaultIndex: Scalars["Int"]["output"];
  /** List of available bet status filters */
  items: Array<MyBetsViewFilterByMatchedStatusItemType>;
};

/** Represents a my bets view order type available filters and the selected one. */
export type MyBetsViewFilterByOrderType = {
  /** Filter selected index on items list */
  defaultIndex: Scalars["Int"]["output"];
  /** List of available order type filters */
  items: Array<Maybe<MyBetsOrderTypeFilter>>;
};

/** Represents a my bets view product type available filters and the selected one. */
export type MyBetsViewFilterByProductType = {
  /** Filter selected index on items list */
  defaultIndex: Scalars["Int"]["output"];
  /** List of available product type filters */
  items: Array<Maybe<MyBetsProductTypeFilter>>;
};

/** Represents My Bets View available filters */
export type MyBetsViewFilters = {
  /** Whether user has heritage bets */
  hasHeritageBets: Maybe<Scalars["Boolean"]["output"]>;
  /** If current view is of type heritage */
  isHeritageView: Maybe<Scalars["Boolean"]["output"]>;
  /** My Bets market ID's filter */
  marketIds: Array<Scalars["String"]["output"]>;
  /** My Bets market ID's filter */
  matchedStatus: Maybe<MyBetsViewFilterByMatchedStatusType>;
  /** My Bets order type filter - can be OPEN or SETTLED */
  orderType: MyBetsViewFilterByOrderType;
  /** My Bets product type filter - can be SPORTSBOOK or EXCHANGE */
  productType: MyBetsViewFilterByProductType;
  /** Total range of results to be paged in days, varies by Jurisdiction */
  totalDaysRange: Scalars["Int"]["output"];
};

/** Represents a connection between Header and [HeaderItem] */
export type MyBetsViewHeaderItemsConnection = {
  edges: Array<Maybe<MyBetsHeaderItemEdge>>;
  pageInfo: Maybe<PageInfo>;
};

export enum NavigationIntent {
  External = "EXTERNAL",
  Internal = "INTERNAL",
}

/** Represents a navigation item */
export type NavigationItem = {
  title: Maybe<Scalars["String"]["output"]>;
};

/** Represents a connection to a view, by marketbet */
export type NavigationLinkLevel = {
  /** The market bet URN */
  marketBetUrn: Scalars["URN"]["output"];
  /** The connected view url */
  viewUrl: Maybe<Scalars["URL"]["output"]>;
  /** The connected view urn */
  viewUrn: Scalars["URN"]["output"];
};

/** Represents a NavigationTab */
export type NavigationTab = GenericNavigationTab &
  ViewItem & {
    /** The badge text */
    badgeText: Maybe<TranslatableText>;
    /** The tab items */
    items: NavigationTabItems;
    /** The tab title */
    title: TranslatableText;
    /** The tab urn */
    urn: Scalars["URN"]["output"];
    /** The tab deeplinking view link */
    viewLink: Maybe<ViewLink>;
  };

/** Represents a NavigationTab */
export type NavigationTabItemsArgs = {
  first: InputMaybe<Scalars["Int"]["input"]>;
};

/** Represents a connection between View and [NavigationTab] */
export type NavigationTabConnection = {
  edges: Array<Maybe<NavigationTabEdge>>;
  pageInfo: Maybe<PageInfo>;
};

/** Represents a NavigationTab edge */
export type NavigationTabEdge = {
  cursor: Maybe<Scalars["String"]["output"]>;
  node: GenericNavigationTab;
};

/** Represents the types that a navigation tab can contain */
export type NavigationTabItem = {
  /** The Navigation Tab Item urn */
  urn: Scalars["URN"]["output"];
};

/** Represents a connection between NavigationTab and [NavigationTabItemsEdge] */
export type NavigationTabItems = {
  edges: Array<Maybe<NavigationTabItemsEdge>>;
  pageInfo: Maybe<PageInfo>;
};

/** Represents a NavigationTabItemsEdge edge */
export type NavigationTabItemsEdge = {
  cursor: Maybe<Scalars["String"]["output"]>;
  node: NavigationTabItem;
};

/** Represents a navigation tab card */
export type NavigationTabsList = ViewItem & {
  /** The layout items on the navigation tab card */
  items: NavigationTabConnection;
  /** The tab card title */
  title: Maybe<Scalars["String"]["output"]>;
  /** The card urn */
  urn: Scalars["URN"]["output"];
};

/** Represents a navigation tab card */
export type NavigationTabsListItemsArgs = {
  first: InputMaybe<Scalars["Int"]["input"]>;
  selectedOnly: InputMaybe<Scalars["Boolean"]["input"]>;
};

/** Represents a NotFound View */
export type NotFoundView = View & {
  /** The bottom bar */
  bottomBar: Maybe<BottomBar>;
  /** The view category */
  category: Maybe<ViewCategory>;
  /** The layout items on the view */
  items: ViewItemsConnection;
  /**
   * The left side bar
   * @deprecated Use LeftSidebar Query instead
   */
  leftSidebar: Maybe<LeftSidebar>;
  /** The regulatory data used for the regulatory header */
  regulatoryData: Maybe<RegulatoryData>;
  /** The view title */
  title: Maybe<Scalars["String"]["output"]>;
  /** The view url */
  url: Scalars["URL"]["output"];
  /** The view urn */
  urn: Scalars["URN"]["output"];
  /** The XSell bar */
  xsellBar: Maybe<XSellBar>;
};

/** Represents a NotFound View */
export type NotFoundViewItemsArgs = {
  after: InputMaybe<Scalars["String"]["input"]>;
  first: InputMaybe<Scalars["Int"]["input"]>;
};

export type NumericRange = {
  max: Scalars["Int"]["input"];
  min: Scalars["Int"]["input"];
};

export type ObbBettingOpportunity = {
  leg: ObbLeg;
  participants: Array<ObbParticipant>;
};

export type ObbBooleanResultType = {
  value: Scalars["String"]["output"];
};

export type ObbCard = ObbPvpCard | ObbSquadBetCard | ObbSquadVsSquadCard;

export type ObbCardEdge = {
  cursor: Maybe<Scalars["String"]["output"]>;
  node: ObbCard;
};

/** Represents an OBB Card Group */
export type ObbCardGroup = CardGroup &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** OBB Card Group window offset (hours) */
    bettingWindowOffset: Scalars["Int"]["output"];
    /** OBB Card Group associated event */
    event: SportsEvent;
    /** OBB Card Group filter tags */
    filterTags: Array<FilterTag>;
    /** OBB Card Group more info button details */
    moreInfo: Maybe<MoreInfoDetails>;
    /** OBB Card Group more info button label */
    moreInfoLabel: Maybe<DisplayName>;
    /** OBB Card Group sections */
    sections: ObbSectionsConnection;
    /** OBB Card Group switcher to show the filter tags or not */
    showFilterTags: Scalars["Boolean"]["output"];
    /** OBB Card Group title */
    title: Maybe<DisplayName>;
    /** OBB Card Group URN */
    urn: Scalars["URN"]["output"];
  };

export type ObbCardsConnection = {
  edges: Array<Maybe<ObbCardEdge>>;
  pageInfo: Maybe<PageInfo>;
};

export type ObbCardsLayout = ObbCardsStackedLayout | ObbCardsSwimlaneLayout;

export type ObbCardsLayoutConnection = {
  edges: Array<Maybe<ObbCardsLayoutEdge>>;
  pageInfo: Maybe<PageInfo>;
};

export type ObbCardsLayoutEdge = {
  cursor: Maybe<Scalars["String"]["output"]>;
  node: ObbCardsLayout;
};

/** Represents an OBB card with a stacked layout */
export type ObbCardsStackedLayout = {
  /** OBB Layout Badge */
  badge: Maybe<DisplayNameTitle>;
  /** OBB Card cards list */
  cards: ObbCardsConnection;
  /** OBB Card maximum cards to display */
  maxCardsToDisplay: Maybe<Scalars["Int"]["output"]>;
  /** OBB Card title */
  title: Maybe<DisplayName>;
  /** OBB Card URN */
  urn: Scalars["URN"]["output"];
};

/** Represents an OBB card with a swimlane layout */
export type ObbCardsSwimlaneLayout = {
  /** OBB Layout Badge */
  badge: Maybe<DisplayNameTitle>;
  /** OBB Card cards list */
  cards: ObbCardsConnection;
  /** OBB Card title */
  title: Maybe<DisplayName>;
  /** OBB Card URN */
  urn: Scalars["URN"]["output"];
};

/** Represents a obbCreatedBets card */
export type ObbCreatedBetsCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    bettingOpportunities: Array<ObbBettingOpportunity>;
    eventViewLink: ViewLink;
    fixture: Fixture;
    footerViewLink: ViewLink;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

export type ObbCreatedBetsCardConnection = {
  edges: Array<Maybe<ObbCreatedBetsCardEdge>>;
  pageInfo: Maybe<PageInfo>;
};

export type ObbCreatedBetsCardEdge = {
  cursor: Maybe<Scalars["String"]["output"]>;
  node: ObbCreatedBetsCard;
};

/** Represents a obb created bets cards group */
export type ObbCreatedBetsCardGroup = CardGroup &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    cards: ObbCreatedBetsCardConnection;
    headerBadgeLabel: Maybe<DisplayName>;
    headerViewLink: Maybe<ViewLink>;
    title: DisplayName;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a ObbEventPopulars card */
export type ObbEventPopularsCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    badgeLabel: Maybe<DisplayName>;
    event: SportsEvent;
    numberOfVisibleBettingOpportunities: Scalars["Int"]["output"];
    popularBettingOpportunities: Array<ObbPopularBettingOpportunity>;
    showPopularEvidence: Scalars["Boolean"]["output"];
    showStats: Scalars["Boolean"]["output"];
    title: DisplayName;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

export type ObbExpressionTemplate = {
  templateDetails: ObbTemplateDetails;
};

export type ObbExpressionTemplateParams =
  | ObbPvpTemplateParams
  | ObbSquadBetTemplateParams
  | ObbSquadVsSquadTemplateParams
  | ObbXOfNTemplateParams;

export type ObbFootballPlayer = {
  incidentTypes: Array<ObbIncidentType>;
  player: FootballPlayer;
  team: FootballTeamDetails;
  urn: Scalars["URN"]["output"];
};

export type ObbFootballPlayerIncidentTypesArgs = {
  filter: InputMaybe<IncidentTypesFilterInput>;
};

export type ObbFootballTeam = {
  away: FootballTeamDetails;
  home: FootballTeamDetails;
};

export type ObbIncidentType = {
  id: Scalars["String"]["output"];
  resultType: ObbResultType;
};

/** Represents a View related to a OBB Landing Page */
export type ObbLandingPageView = View & {
  /** The bottom bar */
  bottomBar: Maybe<BottomBar>;
  /** The view category */
  category: Maybe<ViewCategory>;
  /** The layout items on the view */
  items: ViewItemsConnection;
  /** The left side bar */
  leftSidebar: Maybe<LeftSidebar>;
  /** The regulatory data used for the regulatory header */
  regulatoryData: Maybe<RegulatoryData>;
  /** The view title */
  title: Maybe<Scalars["String"]["output"]>;
  /** The view url */
  url: Scalars["URL"]["output"];
  /** The view urn */
  urn: Scalars["URN"]["output"];
  /** The xsell bar */
  xsellBar: Maybe<XSellBar>;
};

/** Represents a View related to a OBB Landing Page */
export type ObbLandingPageViewItemsArgs = {
  after: InputMaybe<Scalars["String"]["input"]>;
  first: InputMaybe<Scalars["Int"]["input"]>;
};

export type ObbLeg = {
  event: SportsEvent;
  quote: ObbQuoteResult;
  templateId: Scalars["String"]["output"];
  templateParams: ObbTemplateParams;
};

/** Represents OBB betting odds */
export type ObbOdds = {
  /** The odds decimal value */
  decimal: Scalars["Float"]["output"];
  /** The odds fractional value */
  fractional: FractionalOdds;
};

export type ObbOnboardingCard = {
  legs: Array<ObbLeg>;
  participants: Array<ObbParticipant>;
};

/** Represents an obb onboarding cards group */
export type ObbOnboardingCardsCardGroup = CardGroup &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    badgeLabel: Maybe<DisplayName>;
    event: SportsEvent;
    onboardingCards: Array<Maybe<ObbOnboardingCard>>;
    title: DisplayName;
    /** The card group urn */
    urn: Scalars["URN"]["output"];
  };

export type ObbParticipant = ObbFootballPlayer;

export type ObbPopularBettingOpportunity = {
  betCount: Scalars["Int"]["output"];
  leg: ObbLeg;
  participants: Array<ObbParticipant>;
};

/** Represents a obbPvp card */
export type ObbPvpCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    defaultLegs: Array<ObbLeg>;
    event: SportsEvent;
    filterTags: Array<FilterTag>;
    incidentType: ObbIncidentType;
    participantInfo: Maybe<DisplayName>;
    participants: Array<ObbParticipant>;
    teams: ObbFootballTeam;
    title: DisplayNameTitle;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

export type ObbPvpParams = {
  outcomeId: Scalars["String"]["output"];
  participantIdA: ObbParticipant;
  participantIdB: ObbParticipant;
  timePeriodId: Scalars["String"]["output"];
};

export type ObbPvpTemplateParams = {
  /** The Outcome Id */
  outcomeId: Scalars["String"]["output"];
  /** The Participant A Id */
  participantIdA: Scalars["String"]["output"];
  /** The Participant B Id */
  participantIdB: Scalars["String"]["output"];
  /** The Time Period Id */
  timePeriodId: Scalars["String"]["output"];
};

export type ObbQuery = {
  eventParticipants: Array<ObbParticipant>;
  implyBets: ImplyBetsResponse;
  quotes: Quotes;
  squadBetQuotes: SquadBetQuotesResponse;
};

export type ObbQueryEventParticipantsArgs = {
  eventParticipantsRequestInput: EventParticipantsRequestInput;
};

export type ObbQueryImplyBetsArgs = {
  implyBetsRequestInput: ImplyBetsRequestInput;
};

export type ObbQueryQuotesArgs = {
  quotesRequestInput: QuotesRequestInput;
};

export type ObbQuerySquadBetQuotesArgs = {
  squadBetQuotesRequestInput: SquadBetQuotesRequestInput;
};

export type ObbQuote = {
  id: Scalars["String"]["output"];
  price: Maybe<ObbOdds>;
  result: ObbResult;
};

export type ObbQuoteError = {
  errorCode: Scalars["String"]["output"];
  errorDetails: Maybe<Scalars["String"]["output"]>;
};

export type ObbQuoteResult = ObbQuoteError | ObbQuoteSuccess;

export type ObbQuoteSuccess = {
  price: ObbOdds;
};

export type ObbRangeResultType = {
  max: Scalars["Int"]["output"];
  min: Scalars["Int"]["output"];
};

export type ObbResult = {
  errorDetails: Maybe<Scalars["String"]["output"]>;
  resultCode: Scalars["String"]["output"];
};

export type ObbResultType = ObbBooleanResultType | ObbRangeResultType;

/** Represents a section of an OBB Card Group */
export type ObbSection = CardGroup &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** OBB Section icon */
    icon: Maybe<PackIcon>;
    /** OBB Section switcher to determine if the section is expanded or not */
    isExpanded: Scalars["Boolean"]["output"];
    /** OBB Section layout items */
    layouts: ObbCardsLayoutConnection;
    /** OBB Section title */
    title: DisplayNameTitle;
    /** OBB Section URN */
    urn: Scalars["URN"]["output"];
  };

export type ObbSectionEdge = {
  cursor: Maybe<Scalars["String"]["output"]>;
  node: ObbSection;
};

export type ObbSectionsConnection = {
  edges: Array<Maybe<ObbSectionEdge>>;
  pageInfo: Maybe<PageInfo>;
};

/** Represents a obbSquadBet card */
export type ObbSquadBetCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    defaultLegs: Array<ObbLeg>;
    defaultOutcomeIndex: Scalars["Int"]["output"];
    entryPointLabel: Maybe<DisplayName>;
    event: SportsEvent;
    eventParticipants: Array<ObbParticipant>;
    filterTags: Array<FilterTag>;
    incidentType: ObbIncidentType;
    outcomesLabel: DisplayName;
    participantInfo: Maybe<DisplayName>;
    showModalEntryPoint: Scalars["Boolean"]["output"];
    squadParticipants: Array<ObbParticipant>;
    statsLabel: DisplayName;
    title: DisplayName;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

export type ObbSquadBetParams = {
  outcomeIds: Array<Scalars["String"]["output"]>;
  participantIds: Array<ObbParticipant>;
  quantifier: Scalars["String"]["output"];
  timePeriodId: Scalars["String"]["output"];
  value: Scalars["Int"]["output"];
};

export type ObbSquadBetTemplateParams = {
  /** List of Outcome Ids */
  outcomeIds: Array<Scalars["String"]["output"]>;
  /** List of participant Ids */
  participantIds: Array<Scalars["String"]["output"]>;
  /** The quantifier Id */
  quantifier: Scalars["String"]["output"];
  /** The Time Period Id */
  timePeriodId: Scalars["String"]["output"];
  /** The bet value */
  value: Scalars["Int"]["output"];
};

/** Represents a ObbSquadVsSquadCard card */
export type ObbSquadVsSquadCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    defaultLegs: Array<ObbLeg>;
    event: SportsEvent;
    eventParticipants: Array<ObbParticipant>;
    filterTags: Array<FilterTag>;
    firstSquadParticipants: Array<ObbParticipant>;
    incidentType: ObbIncidentType;
    outcomesLabel: Maybe<DisplayName>;
    participantInfo: Maybe<DisplayName>;
    secondSquadParticipants: Array<ObbParticipant>;
    showModalEntryPoint: Scalars["Boolean"]["output"];
    statsLabel: Maybe<DisplayName>;
    title: DisplayName;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

export type ObbSquadVsSquadParams = {
  outcomeIds: Array<Scalars["String"]["output"]>;
  quantifier: Scalars["String"]["output"];
  squadAParticipantIds: Array<ObbParticipant>;
  squadBParticipantIds: Array<ObbParticipant>;
  timePeriodId: Scalars["String"]["output"];
};

export type ObbSquadVsSquadTemplateParams = {
  /** List of outcome Ids */
  outcomeIds: Array<Scalars["String"]["output"]>;
  /** The bet value */
  quantifier: Scalars["String"]["output"];
  /** List of squad A participant Ids */
  squadAParticipantIds: Array<Scalars["String"]["output"]>;
  /** List of squad B participant Ids */
  squadBParticipantIds: Array<Scalars["String"]["output"]>;
  /** The Time Period Id */
  timePeriodId: Scalars["String"]["output"];
};

export type ObbTemplateDetails = {
  /** The template id */
  id: Scalars["String"]["output"];
  /** The sub template details */
  subTemplateDetails: Array<ObbTemplateDetails>;
  /** The template metadata */
  templateMetadata: Maybe<ObbTemplateMetadata>;
  /** The template parameters */
  templateParams: ObbExpressionTemplateParams;
  /** The template version */
  version: Scalars["Int"]["output"];
};

export type ObbTemplateMetadata = {
  /** The participants List */
  participants: Array<ObbTemplateParticipant>;
};

export type ObbTemplateParams = ObbPvpParams | ObbSquadBetParams | ObbSquadVsSquadParams;

export type ObbTemplateParticipant = {
  /** The participant id */
  id: Scalars["String"]["output"];
  /** The participant name */
  name: Maybe<Scalars["String"]["output"]>;
};

export type ObbXOfNTemplateParams = {
  /** The number of selections to win */
  x: Scalars["Int"]["output"];
};

/** Represents betting odds format */
export enum OddsDisplayFormat {
  American = "AMERICAN",
  Decimal = "DECIMAL",
  Fractional = "FRACTIONAL",
}

/** Odds Movement Preference */
export type OddsMovementPreference = Preference & {
  /** The selected should accept odds movement */
  shouldAcceptOddsMovement: Scalars["Boolean"]["output"];
  /** The accept odds movement preference urn */
  urn: Scalars["URN"]["output"];
};

export type Operand = Literal | Operator | Outcome;

export type Operator = {
  /** The operator */
  operator: Scalars["String"]["output"];
};

export type OptInPromoError = {
  message: Maybe<Scalars["String"]["output"]>;
};

export type OptInPromoResponse = LoyaltyPromotion | OptInPromoError | PromotionsHubPromotion;

/** Represents the possible opt-in states for a promotion */
export enum OptInState {
  Completed = "COMPLETED",
  Expired = "EXPIRED",
  Lost = "LOST",
  NotEligible = "NOT_ELIGIBLE",
  NotOptedIn = "NOT_OPTED_IN",
  Ongoing = "ONGOING",
  OptedIn = "OPTED_IN",
  PromotionNotActive = "PROMOTION_NOT_ACTIVE",
  Removed = "REMOVED",
  RewardAwarded = "REWARD_AWARDED",
}

export type Outcome = {
  /** The outcome id */
  outcomeId: Scalars["String"]["output"];
  /** The participant id */
  participantId: Scalars["String"]["output"];
  /** The time period id */
  timePeriodId: Scalars["String"]["output"];
};

export type OutcomeBasedDetails = {
  /** The outcome based details */
  expressionInfo: ExpressionInfo;
};

export type OutcomeBasedLeg = {
  eventId: EventId;
  price: ObbOdds;
};

export type OutcomeBasedLegDefinition = {
  baseExpressionTemplateDefinitions: InputMaybe<Array<BaseExpressionTemplateDefinitionsInput>>;
  eventId: EventIdInput;
  expectedPrice: FractionalOddsInput;
  expressionParams: ExpressionParamsInput;
  expressionTemplateId: Scalars["String"]["input"];
  legDescription: Scalars["String"]["input"];
  templateName: Scalars["String"]["input"];
};

export type OutcomeDefinition = {
  /** Query definition */
  query: QueryDefinition;
  /** Stats Threshold Definition */
  statsThresholdDef: StatsThresholdDefinition;
};

/** Represents an entry that can be defined as an operand or an operator */
export type OutcomeDefinitionEntry = {
  /** The operation entry that represents an operator */
  operator: Maybe<OutcomeDefinitionOperatorEnum>;
  /** The operation entry that represents an operand */
  outcomeDefinition: Maybe<OutcomeDefinition>;
  /** The type of operation entry */
  outcomeDefinitionType: OutcomeDefinitionTypeEnum;
};

export type OutcomeDefinitionExp = {
  /** An expression that holds the outcomeDefinition entries to be applied */
  outcomeDefinitionEntries: Array<OutcomeDefinitionEntry>;
};

/** The operation entry that represents an operator */
export enum OutcomeDefinitionOperatorEnum {
  And = "AND",
  Or = "OR",
}

/** Represents an entry that can be defined as an operand or an operator */
export enum OutcomeDefinitionTypeEnum {
  Operand = "OPERAND",
  Operator = "OPERATOR",
}

export type OutrightMarketListCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card Favourite Markets state */
    favouriteMarketsState: Maybe<FavouriteMarketsState>;
    /** The list of market types to be displayed */
    markets: Array<SportsbookMarket>;
    /** The number of displayed rows on the card */
    numberOfRowsToDisplay: Maybe<Scalars["Int"]["output"]>;
    /** The card name to be displayed */
    title: Scalars["String"]["output"];
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

export type PphCriteriaState = {
  fulfilled: Maybe<Scalars["Boolean"]["output"]>;
  params: Maybe<PphCriteriaStateParams>;
};

export type PphCriteriaStateGauge = {
  current: Maybe<Scalars["Float"]["output"]>;
  target: Maybe<Scalars["Float"]["output"]>;
};

export type PphCriteriaStateParams = {
  gauge: Maybe<PphCriteriaStateGauge>;
};

/** Encapsulates various details regarding customer-promotion relationship. */
export type PphCustomerPromotionState = {
  /** Contains criteria fulfillment related info. */
  criteriaState: Maybe<PphCriteriaState>;
  /** Holds various eligibility details. */
  eligibility: Maybe<PphCustomerPromotionStateEligibility>;
  /**
   * Attribute to indicate if the user has accepted the promotion and can now meet the qualifying criteria.
   * For promotions that require consent, this field will be true if the user has consented.
   * For all other promotions, this will return true if the user has opted in.
   */
  hasAccepted: Maybe<Scalars["Boolean"]["output"]>;
  /** OptInState for a user within a promotion. */
  optInState: Maybe<PphUserOptInState>;
  /** The promotion reward value. */
  reward: Maybe<PphCustomerPromotionStateReward>;
};

/** Encapsulates various details regarding customer-promotion relationship. */
export type PphCustomerPromotionStateEligibility = {
  canConsent: Maybe<Scalars["Boolean"]["output"]>;
  /** Indicates wether the customer can opt in now. */
  canOptIn: Maybe<Scalars["Boolean"]["output"]>;
  eligible: Maybe<Scalars["Boolean"]["output"]>;
};

export type PphCustomerPromotionStateReward = {
  value: Maybe<Scalars["Float"]["output"]>;
};

export type PphPromotionLaddersLevels = {
  fulfilled: Maybe<Scalars["Boolean"]["output"]>;
  levels: Maybe<PphCriteriaStateGauge>;
};

/** Contains the different terms and conditions associated with this promotion. */
export type PphPromotionTermsAndConditions = {
  /** The full text of the T&Cs. */
  full: Maybe<Scalars["String"]["output"]>;
  /** The summarized text of the T&Cs. */
  summarized: Maybe<Scalars["String"]["output"]>;
};

/** Possible values of OptInState for a user within a promotion. */
export enum PphUserOptInState {
  Completed = "COMPLETED",
  Expired = "EXPIRED",
  Lost = "LOST",
  NotOptedIn = "NOT_OPTED_IN",
  Ongoing = "ONGOING",
  PromotionNotActive = "PROMOTION_NOT_ACTIVE",
  Removed = "REMOVED",
  RewardAwarded = "REWARD_AWARDED",
}

/** Represents an icon on the icon pack */
export type PackIcon = {
  /** The icon category */
  category: Scalars["String"]["output"];
  /** The icon id */
  id: Scalars["String"]["output"];
};

export type PackagedCreatedBetsCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card Favourite Markets state */
    favouriteMarketsState: Maybe<FavouriteMarketsState>;
    /** All associated betting opportunities */
    items: PackagedCreatedBetsCardItemsConnection;
    /** The card configured title */
    layout: Maybe<PackagedLayoutType>;
    /** The card configured title */
    title: Maybe<DisplayName>;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

export type PackagedCreatedBetsCardItemsArgs = {
  after: InputMaybe<Scalars["String"]["input"]>;
  first: InputMaybe<Scalars["Int"]["input"]>;
};

export type PackagedCreatedBetsCardItemEdge = {
  cursor: Maybe<Scalars["String"]["output"]>;
  node: PopularBettingOpportunity;
};

export type PackagedCreatedBetsCardItemsConnection = {
  edges: Array<Maybe<PackagedCreatedBetsCardItemEdge>>;
  pageInfo: Maybe<PageInfo>;
};

export enum PackagedLayoutType {
  InCard = "IN_CARD",
  OutOfCard = "OUT_OF_CARD",
}

export type PageInfo = {
  /** Represents the cursor corresponding to the last node in edges */
  endCursor: Maybe<Scalars["String"]["output"]>;
  /** Represents if there are more edges available, or if we’ve reached the end of this connection */
  hasNextPage: Maybe<Scalars["Boolean"]["output"]>;
};

export type Parameters =
  | ObbPvpTemplateParams
  | ObbSquadBetTemplateParams
  | ObbSquadVsSquadTemplateParams
  | ObbXOfNTemplateParams;

export type Params = {
  outcomeId: Maybe<Scalars["String"]["output"]>;
  outcomeIds: Maybe<Array<Scalars["String"]["output"]>>;
  participantIdA: Maybe<Scalars["String"]["output"]>;
  participantIdB: Maybe<Scalars["String"]["output"]>;
  participantIds: Maybe<Array<Scalars["String"]["output"]>>;
  quantifier: Maybe<Scalars["String"]["output"]>;
  squadAParticipantIds: Maybe<Array<Scalars["String"]["output"]>>;
  squadBParticipantIds: Maybe<Array<Scalars["String"]["output"]>>;
  timePeriodId: Maybe<Scalars["String"]["output"]>;
  value: Maybe<Scalars["Int"]["output"]>;
};

export type Participant = {
  /** A entity id that correlates a participant to a market/selection */
  participantId: Maybe<Scalars["String"]["output"]>;
  /** The side of the participant */
  side: Maybe<ParticipantSideEnum>;
  /** The type of the participant */
  type: ParticipantTypeEnum;
};

export enum ParticipantSideEnum {
  Away = "AWAY",
  Both = "BOTH",
  Home = "HOME",
}

export enum ParticipantTypeEnum {
  /** Participant represented as a player */
  Player = "PLAYER",
  /** Participant represented as a team */
  Team = "TEAM",
}

export type PastRace = {
  /** Details information of the race */
  details: Maybe<RaceDetails>;
  /** The race archived video url */
  raceUrl: Maybe<Scalars["String"]["output"]>;
  /** The full name of the course the race took place */
  venue: Maybe<Scalars["String"]["output"]>;
};

export type PebbleCardEdge = {
  cursor: Maybe<Scalars["String"]["output"]>;
  displayName: Maybe<DisplayName>;
  /** @deprecated Use `displayName` instead, since it resolves a translation key or a string name */
  name: Maybe<Scalars["String"]["output"]>;
  node: Card;
};

/** Represents a collection of cards with a common context */
export type PebbleCardGroup = CardGroup &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card group Favourite Markets state */
    favouriteMarketsState: Maybe<FavouriteMarketsState>;
    /** The card group icon */
    icon: Maybe<PebbleCardGroupIcon>;
    items: PebbleLayoutItemsConnection;
    /** The card group outer title */
    outerTitle: Maybe<TranslatableText>;
    /** The card group state */
    pebbleExpanded: Scalars["Boolean"]["output"];
    pebbleLayout: Maybe<PebbleLayouts>;
    selectedItemUrn: Scalars["URN"]["output"];
    /** The signposting for the card group */
    signposting: Maybe<Signposting>;
    /** The card group title */
    title: Maybe<TranslatableText>;
    /** The card group urn */
    urn: Scalars["URN"]["output"];
    /** The card group view all */
    viewAll: Maybe<GroupViewAll>;
    viewOpenBets: Maybe<ViewLink>;
  };

/** Represents a collection of cards with a common context */
export type PebbleCardGroupItemsArgs = {
  first: InputMaybe<Scalars["Int"]["input"]>;
  selectedOnly: InputMaybe<Scalars["Boolean"]["input"]>;
};

export enum PebbleCardGroupIcon {
  DoubleUpBoost = "DOUBLE_UP_BOOST",
  PriceBoost = "PRICE_BOOST",
  SuperBoost = "SUPER_BOOST",
}

export type PebbleLayoutItemsConnection = {
  edges: Array<Maybe<PebbleCardEdge>>;
  pageInfo: Maybe<PageInfo>;
};

export enum PebbleLayouts {
  InCard = "IN_CARD",
  OutOfCard = "OUT_OF_CARD",
}

export type PenaltyIncident = {
  penaltyType: PenaltyIncidentType;
  side: Maybe<FixtureTeamSide>;
};

export enum PenaltyIncidentType {
  Awarded = "AWARDED",
  Missed = "MISSED",
}

export type PenaltyScore = {
  penaltyNumber: Maybe<Scalars["Int"]["output"]>;
  shotResult: Maybe<PenaltyStatus>;
  side: Maybe<FixtureTeamSide>;
};

export type PenaltyShootoutIncident = {
  penaltyShootoutType: Maybe<PenaltyShootoutIncidentType>;
  player: Maybe<FootballPlayer>;
  side: Maybe<FixtureTeamSide>;
};

export enum PenaltyShootoutIncidentType {
  Cancelled = "CANCELLED",
  FirstTeamToShoot = "FIRST_TEAM_TO_SHOOT",
  Missed = "MISSED",
  Scored = "SCORED",
}

export enum PenaltyStatus {
  Miss = "MISS",
  Score = "SCORE",
}

export type PenaltyTaker = {
  /** PenaltyTaker associated football player */
  player: FootballPlayerFixtureContext;
  /** PenaltyTaker associated to miss */
  toMiss: ToMissPenalty;
  /** PenaltyTaker associated to score */
  toScore: ToScorePenalty;
};

/** Penalty Takers Card */
export type PenaltyTakersCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** Penalty Takers associated event */
    event: SportsEvent;
    /** Penalty Takers footer */
    footer: Maybe<DisplayName>;
    /** Penalty Takers associated players */
    penaltyTakers: Array<PenaltyTaker>;
    /** Penalty Takers subtitle */
    subtitle: Maybe<DisplayName>;
    /** Penalty Takers terms and conditions URL */
    termsAndConditionsUrl: Maybe<Scalars["URL"]["output"]>;
    /** Penalty Takers title */
    title: DisplayName;
    /** Penalty Takers URN */
    urn: Scalars["URN"]["output"];
  };

export type PeriodDefinition = {
  /** Period */
  period: Maybe<PeriodEnum>;
  /** Period Status */
  periodStatus: PeriodStatusEnum;
};

export enum PeriodEnum {
  Regular = "REGULAR",
}

export type PeriodIncident = {
  injuryTime: Maybe<Scalars["Int"]["output"]>;
  period: Maybe<FootballMatchPeriod>;
  periodType: Maybe<PeriodIncidentType>;
  status: Maybe<FootballPeriodStatus>;
};

export enum PeriodIncidentType {
  InjuryTimeUpdate = "INJURY_TIME_UPDATE",
  PeriodTransition = "PERIOD_TRANSITION",
}

export enum PeriodStatusEnum {
  Full = "FULL",
  InplayFirstHalf = "INPLAY_FIRST_HALF",
  InplaySecondHalf = "INPLAY_SECOND_HALF",
}

/** Represents a Phoenix Migrated User Preference */
export type PhoenixMigratedUserPreference = Preference & {
  /** The is Phoenix Migrated User */
  isPhoenixMigratedUser: Scalars["Boolean"]["output"];
  /** The phoenix migrated user preference urn */
  urn: Scalars["URN"]["output"];
};

export type PlaceBetDefinitionInput = {
  betType: Scalars["String"]["input"];
  expectedPrice: FractionalOddsInput;
  id: Scalars["String"]["input"];
  outcomeBasedLegDefinitions: Array<OutcomeBasedLegDefinition>;
  stakePerLine: Scalars["Float"]["input"];
};

export type PlaceBetRequestInput = {
  betDefinitions: Array<PlaceBetDefinitionInput>;
  customerRef: InputMaybe<Scalars["String"]["input"]>;
};

export type PlaceBetResponse = {
  betPlacementsResult: Array<BetPlacementDetails>;
  result: ObbResult;
};

export type PlayStateCadence = {
  inPlay: Scalars["Float"]["output"];
  notInPlay: Scalars["Float"]["output"];
};

export type PlayerContext = FootballPlayerFixtureContext;

export type PlayerEventMarket = {
  /** Label for market runner */
  label: DisplayName;
  /** The market */
  market: Market;
  /** The market runner to display */
  runner: Runner;
};

export type PlayerEventMarketsCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card connected event view link */
    eventViewLink: Maybe<ViewLink>;
    /** The markets in the market group */
    markets: Array<Maybe<PlayerEventMarket>>;
    /** The player context */
    playerContext: PlayerContext;
    /** View Link to the corresponding player view */
    playerViewLink: Maybe<ViewLink>;
    /** The market group title */
    title: DisplayName;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Card group that holds player markets for an event */
export type PlayerMarketsCardGroup = CardGroup &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The fixture card */
    fixtureCard: FixtureCard;
    /** The card group items */
    items: PlayerMarketsCardGroupItemsConnection;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Card group that holds player markets for an event */
export type PlayerMarketsCardGroupItemsArgs = {
  first: InputMaybe<Scalars["Int"]["input"]>;
};

export type PlayerMarketsCardGroupItem = PebbleCardGroup;

/** Represents a a card group edge */
export type PlayerMarketsCardGroupItemEdge = {
  cursor: Maybe<Scalars["String"]["output"]>;
  node: PlayerMarketsCardGroupItem;
};

/** Represents a connection between a PlayerMarketsCardGroup and [PlayerMarketsCardGroupItem] */
export type PlayerMarketsCardGroupItemsConnection = {
  edges: Array<Maybe<PlayerMarketsCardGroupItemEdge>>;
  pageInfo: Maybe<PageInfo>;
};

/** Represents a player view */
export type PlayerView = View & {
  /** The bottom bar */
  bottomBar: Maybe<BottomBar>;
  /** The view category */
  category: Maybe<ViewCategory>;
  /** The player view context */
  context: PlayerViewContext;
  /** The layout items on the view */
  items: PlayerViewItemsConnection;
  /** The left side bar */
  leftSidebar: Maybe<LeftSidebar>;
  /** The regulatory data used for the regulatory header */
  regulatoryData: Maybe<RegulatoryData>;
  /** The view title */
  title: Maybe<Scalars["String"]["output"]>;
  /** The view url */
  url: Scalars["URL"]["output"];
  /** The view urn */
  urn: Scalars["URN"]["output"];
  /** The xsell bar */
  xsellBar: Maybe<XSellBar>;
};

/** Represents a player view */
export type PlayerViewItemsArgs = {
  after: InputMaybe<Scalars["String"]["input"]>;
  autoPageSize: InputMaybe<Scalars["Boolean"]["input"]>;
  first: InputMaybe<Scalars["Int"]["input"]>;
};

/** Represents the context of a player view */
export type PlayerViewContext = FootballPlayerFixtureContext;

export type PlayerViewFootballFixture = BaseFixture | FootballFixture;

export type PlayerViewItem = FootballPlayerCompetitionStatsCard | PlayerMarketsCardGroup | RegulatoryCard;

/** Represents a ViewItem edge */
export type PlayerViewItemEdge = {
  cursor: Maybe<Scalars["String"]["output"]>;
  node: PlayerViewItem;
};

/** Represents a connection between a PlayerView and [PlayerViewItem] */
export type PlayerViewItemsConnection = {
  edges: Array<Maybe<PlayerViewItemEdge>>;
  pageInfo: Maybe<PageInfo>;
};

/** Card group that holds player information cards */
export type PlayersRail = CardGroup &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    items: PlayersRailItemsConnection;
    /** The card group title */
    title: Maybe<DisplayName>;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Card group that holds player information cards */
export type PlayersRailItemsArgs = {
  first: InputMaybe<Scalars["Int"]["input"]>;
};

export type PlayersRailItem = PlayerEventMarketsCard;

/** Represents a Players rail card group edge */
export type PlayersRailItemEdge = {
  cursor: Maybe<Scalars["String"]["output"]>;
  node: PlayersRailItem;
};

/** Represents a connection between a PlayersRail and [PlayerMarketsCardGroupItem] */
export type PlayersRailItemsConnection = {
  edges: Array<Maybe<PlayersRailItemEdge>>;
  pageInfo: Maybe<PageInfo>;
};

export type PollingCadences = {
  BLH: PlayStateCadence;
  BME: Maybe<PlayStateCadence>;
  COS: LoginStateCadence;
  ERO: Scalars["Float"]["output"];
  JACKPOT_ZONE: Scalars["Float"]["output"];
  LBR: Scalars["Float"]["output"];
  MY_BETS: Scalars["Float"]["output"];
  POLLING_DEBOUNCE: Scalars["Float"]["output"];
  POPULAR_BETS: Scalars["Float"]["output"];
  REFRESH_CARDS: Scalars["Float"]["output"];
  SCA: LoginStateCadence;
  SER: Scalars["Float"]["output"];
  SIB: Scalars["Float"]["output"];
  SMP: Scalars["Float"]["output"];
  WAS: Scalars["Float"]["output"];
};

export type PopularBetBuilderCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The event fixture */
    fixture: Fixture;
    /** The betting opportunity */
    popularbettingopportunity: PopularBettingOpportunity;
    /** The sport event */
    sportevent: SportsEvent;
    /** The tab view link (currently for experiment) */
    tabViewLink: Maybe<ViewLink>;
    /** The card urn */
    urn: Scalars["URN"]["output"];
    /** The view link */
    viewLink: ViewLink;
  };

export type PopularBettingOpportunity = {
  /** The total number of bets */
  count: Scalars["Int"]["output"];
  /** The betting opportunity display name */
  displayName: Maybe<Scalars["String"]["output"]>;
  /** If betting opportunity is featured */
  featured: Scalars["Boolean"]["output"];
  /** If betting opportunity is headline */
  headline: Scalars["Boolean"]["output"];
  /** The betting oportunity ID */
  id: Scalars["String"]["output"];
  odds: Maybe<SportsbookOdds>;
  originalOdds: Maybe<SportsbookOdds>;
  /** The bet selections */
  selections: Array<BettingOpportunitySelection>;
  /** The betting opportunity type */
  type: Maybe<BettingOpportunityType>;
  /** The betting oportunity urn */
  urn: Scalars["URN"]["output"];
};

export type PopularMultiplesBetBuilderCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The betting opportunity */
    popularbettingopportunity: PopularBettingOpportunity;
    /** The card title */
    title: Maybe<DisplayName>;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a popular selections card */
export type PopularSelectionsCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The display mode of the card */
    displayMode: Maybe<PopularSelectionsDisplayMode>;
    /** Whether the card can be expanded */
    isExpandable: Maybe<Scalars["Boolean"]["output"]>;
    /** Whether the card is expanded by default */
    isExpandedByDefault: Maybe<Scalars["Boolean"]["output"]>;
    /** The popular selections items */
    items: Array<PopularSelectionsItem>;
    /** The maximum number of elements */
    maxNumberOfElements: Maybe<Scalars["Int"]["output"]>;
    /** The card title */
    title: Scalars["String"]["output"];
    /** The card urn */
    urn: Scalars["URN"]["output"];
    /** The maximum number of selections visible before expanding */
    visibleSelectionsLimit: Maybe<Scalars["Int"]["output"]>;
  };

/** The possible display modes for popular selections card */
export enum PopularSelectionsDisplayMode {
  List = "LIST",
  Swipe = "SWIPE",
}

/** Represents a popular selections item */
export type PopularSelectionsItem = {
  /** The market */
  market: SportsbookMarket;
  /**
   * The runner
   * @deprecated Returns the legacy shared Runner type. Use sportsbookRunner.
   */
  runner: Runner;
  /** The sportsbook runner for this item. */
  sportsbookRunner: SportsbookRunner;
  /** The stats for this item */
  stats: PopularSelectionsItemStats;
};

/** Represents the stats for a popular selections item */
export type PopularSelectionsItemStats = {
  /** The number of bets placed */
  betCount: Scalars["Int"]["output"];
};

/** Represents a collection of cards that are supported on a PopularSwimlaneCardGroup */
export type PopularSwimlaneCard = PopularBetBuilderCard | PopularMultiplesBetBuilderCard;

/** Represents a collection of popular swimlane cards with a common context */
export type PopularSwimlaneCardGroup = CardGroup &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card group display Name for translations */
    displayName: Maybe<DisplayNameTranslationKey>;
    items: PopularSwimlaneCardGroupItemsConnection;
    /** The card group title */
    title: Maybe<Scalars["String"]["output"]>;
    /** The card group urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a collection of popular swimlane cards with a common context */
export type PopularSwimlaneCardGroupItemsArgs = {
  first: InputMaybe<Scalars["Int"]["input"]>;
};

/** Represents a PopularSwimlaneCardGroup edge */
export type PopularSwimlaneCardGroupItemEdge = {
  cursor: Maybe<Scalars["String"]["output"]>;
  node: PopularSwimlaneCard;
};

/** Represents a connection between PopularSwimlaneCardGroup and [PopularSwimlaneCard] */
export type PopularSwimlaneCardGroupItemsConnection = {
  edges: Array<Maybe<PopularSwimlaneCardGroupItemEdge>>;
  pageInfo: Maybe<PageInfo>;
};

export enum PositionStatus {
  BroughtDown = "BROUGHT_DOWN",
  CarriedOut = "CARRIED_OUT",
  Deadheat = "DEADHEAT",
  DidNotFinish = "DID_NOT_FINISH",
  Disqualified = "DISQUALIFIED",
  Fell = "FELL",
  PulledUp = "PULLED_UP",
  RanOut = "RAN_OUT",
  Refused = "REFUSED",
  RefusedToRace = "REFUSED_TO_RACE",
  SlippedUp = "SLIPPED_UP",
  UnseatedRider = "UNSEATED_RIDER",
  Walkover = "WALKOVER",
}

/** Represents a PPH Promotion */
export type PphPromotion = {
  /** Encapsulates various details regarding customer-promotion relationship. */
  customerPromotionState: Maybe<PphCustomerPromotionState>;
  /** Indicates the date by which the user can fulfill the promotion criteria. */
  fulfillmentEndDate: Maybe<Scalars["String"]["output"]>;
  /** Contains the different terms and conditions associated with this promotion. */
  termsAndConditions: Maybe<PphPromotionTermsAndConditions>;
  urn: Scalars["URN"]["output"];
};

/** Represents a Preference */
export type Preference = {
  /** The preference urn */
  urn: Scalars["URN"]["output"];
};

export enum PreferenceLayout {
  Radio = "RADIO",
  Segmented = "SEGMENTED",
}

/** Represents a single choice preference */
export type PreferenceSingleChoice = Preference & {
  /** The preference key */
  preferenceKey: Scalars["String"]["output"];
  /** Available preferences options */
  preferenceValues: Array<PreferenceValue>;
  /** The selected index preferences option */
  selectedValueIndex: Scalars["Int"]["output"];
  /** The favorite sports preference urn */
  urn: Scalars["URN"]["output"];
};

export type PreferenceSingleChoiceCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** Layout to display */
    cardLayout: PreferenceLayout;
    /** Preference description */
    description: Scalars["String"]["output"];
    /** The corresponding preference bet */
    preference: PreferenceSingleChoice;
    /** Preference title */
    title: Scalars["String"]["output"];
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a user products preferences input interface */
export type PreferenceSingleChoiceInput = {
  /** The user products preference urn */
  urn: Scalars["URN"]["input"];
  /** The user products preference new value */
  value: Scalars["String"]["input"];
};

/** Represents a DisplayNameTranslationKey */
export type PreferenceValue = {
  /** The translation key to show on channels */
  translationKey: Scalars["String"]["output"];
  /** Preference option value */
  value: Scalars["String"]["output"];
};

export type Preferences = {
  confirmCashout: ConfirmCashoutPreference;
  defaultProduct: DefaultProductPreference;
  exchangeConfirmBetPlacement: ConfirmExchangeBetPlacementPreference;
  exchangeDefaultMode: ExchangeDefaultModePreference;
  exchangeDefaultProduct: ExchangeDefaultProductPreference;
  exchangeOddsDisplay: ExchangeOddsDisplayPreference;
  favoriteSports: FavoriteSportsPreference;
  lastViewedProduct: LastViewedProductPreference;
  /** @deprecated is always sportsbook */
  marketTab: MarketTabPreference;
  /** @deprecated is always coupon */
  moduleLayout: ModuleLayoutPreference;
  oddsMovement: OddsMovementPreference;
  phoenixMigratedUser: PhoenixMigratedUserPreference;
  products: UserProductsPreference;
  quickStakes: QuickStakesPreference;
  showBalances: ShowBalancesPreference;
  sportsbookOddsDisplay: SportsbookOddsDisplayPreference;
};

/** Represents the previous odds of a sportsbook runner */
export type PreviousSportsbookOdds = {
  /** The runner display odds */
  displayOdds: Maybe<SportsbookOdds>;
  /** The runner odds */
  odds: Maybe<SportsbookOdds>;
};

/** Represents a promo card of type price boost multiple */
export type PriceBoostMultiplePromoCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The betting opportunity */
    popularbettingopportunity: PopularBettingOpportunity;
    promoAction: Maybe<PromoNavigationAction>;
    /** The card image */
    promoImage: Maybe<PromoImage>;
    /** The card promo tag */
    promoTag: Maybe<PromoTag>;
    /** The card sub title */
    subTitle: Maybe<Scalars["String"]["output"]>;
    /** The card terms and conditions */
    termsAndConditions: Maybe<PromoTermsAndConditions>;
    /** The theme of the card */
    theme: PromoTheme;
    /** The card title */
    title: Scalars["String"]["output"];
    /** The card urn */
    urn: Scalars["URN"]["output"];
    /** Should show wasPrice */
    wasPrice: Scalars["Boolean"]["output"];
  };

export type PriceBoostMultisCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The Card's bettingOpportunity */
    popularbettingopportunity: PopularBettingOpportunity;
    /** specify if we should show previous odd */
    showWasPrice: Scalars["Boolean"]["output"];
    /** The card configured title */
    title: Maybe<DisplayName>;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

export type PriceBoostMultisListCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** Represents the blurb to be displayed in the PriceBoostMultisListCard */
    blurbs: Maybe<Array<Blurb>>;
    /** All associated betting opportunities */
    items: PriceBoostMultisListCardItemsConnection;
    /** Whether the card was configured to show the was price or not */
    showWasPrice: Scalars["Boolean"]["output"];
    /** The card configured title */
    title: Maybe<DisplayName>;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

export type PriceBoostMultisListCardItemsArgs = {
  after: InputMaybe<Scalars["String"]["input"]>;
  first: InputMaybe<Scalars["Int"]["input"]>;
};

export type PriceBoostMultisListCardItemEdge = {
  cursor: Maybe<Scalars["String"]["output"]>;
  node: PopularBettingOpportunity;
};

export type PriceBoostMultisListCardItemsConnection = {
  edges: Array<Maybe<PriceBoostMultisListCardItemEdge>>;
  pageInfo: Maybe<PageInfo>;
};

export type PrizeMachineThemeImages = {
  bottomLeftImage: Maybe<GameImage>;
  bottomRightImage: Maybe<GameImage>;
  topLeftImage: Maybe<GameImage>;
};

export type PrizeMachineWidgetTitles = {
  extraHotTitle: Maybe<Scalars["String"]["output"]>;
  hotTitle: Maybe<Scalars["String"]["output"]>;
  megaTitle: Maybe<Scalars["String"]["output"]>;
  normalTitle: Maybe<Scalars["String"]["output"]>;
  regularTitle: Maybe<Scalars["String"]["output"]>;
};

export enum Product {
  Exchange = "EXCHANGE",
  Games = "GAMES",
  Sportsbook = "SPORTSBOOK",
}

export enum ProductExclusion {
  Games = "GAMES",
  Sports = "SPORTS",
  Virtuals = "VIRTUALS",
}

/** Represents the action for a PromotionsHubPromotion */
export type PromoAction = {
  /** The type of action (REDIRECT, OPT_IN, BUY_IN) */
  actionType: PromoActionType;
  /** The button/action label text */
  label: Scalars["String"]["output"];
  /** The view link for navigation (null for OPT_IN/BUY_IN actions) */
  viewLink: Maybe<ViewLink>;
};

/** The type of CTA action for PromotionsHubCard */
export enum PromoActionType {
  BuyIn = "BUY_IN",
  OptIn = "OPT_IN",
  Redirect = "REDIRECT",
}

/** Represents a promotion badge */
export type PromoBadge = {
  /** The badge state */
  state: BadgeState;
  /** The badge text */
  text: Scalars["String"]["output"];
};

export type PromoBadgeSignposting = {
  label: DisplayName;
};

export type PromoIconSignposting = {
  icon: PackIcon;
};

export type PromoIconTag = {
  iconTag: IconTag;
};

/** The image that will be displayed on the card. This is not a background image. */
export type PromoImage = {
  /** The image url */
  url: Scalars["URL"]["output"];
};

/** Represents the promo inline navigation action */
export type PromoInlineNavigationAction = {
  viewLink: ViewLink;
};

export type PromoLabelTag = {
  label: Scalars["String"]["output"];
};

/** Represents the promo navigation action */
export type PromoNavigationAction = {
  /** The action link */
  link: LabeledLink;
};

/** Represents the possible signposting for mini promo cards */
export type PromoSignposting = PromoBadgeSignposting | PromoIconSignposting;

/** Represents the promo state */
export type PromoState = {
  /** The state label */
  label: DisplayName;
  /** The navigation link for both the mini and bigger card */
  link: Maybe<LabeledLink>;
  /** The promotion optInState */
  optInState: PromotionStatus;
};

export enum PromoStatus {
  Active = "ACTIVE",
  Ended = "ENDED",
  Scheduled = "SCHEDULED",
}

/** Represents a promotion step */
export type PromoStep = {
  /** The step action description */
  action: Scalars["String"]["output"];
  /** Whether the step is completed */
  completed: Scalars["Boolean"]["output"];
};

export type PromoTag = PromoIconTag | PromoLabelTag;

/** The T&Cs of the promotion */
export type PromoTermsAndConditions = {
  /** The terms and conditions full text */
  full: Maybe<Scalars["String"]["output"]>;
  /** The terms and conditions link */
  link: Maybe<LabeledLink>;
  /** The terms and conditions summary */
  summary: Maybe<Scalars["String"]["output"]>;
};

/** The different themes for the card. These are not related to TBDs themes. */
export enum PromoTheme {
  /** The card theme with dark background and yellow text. */
  Dark = "DARK",
  /** The card theme with yellow background and dark text. */
  Light = "LIGHT",
}

/** Represents the possible promotion actions */
export type PromotionAction = PromotionAddToBetslipAction | PromotionNavigationAction;

/** Represents the promotion add to betslip action */
export type PromotionAddToBetslipAction = {
  /** If the selection last price should be displayed */
  displayPreviousOdd: Scalars["Boolean"]["output"];
  /** The highlighted selection market */
  market: SportsbookMarket;
  /** The highlighed selection */
  runner: Runner;
};

/** Represents an action that adds to the betslip but also navigates */
export type PromotionAddToBetslipAndNavigateAction = {
  /** If the selection last price should be displayed */
  displayPreviousOdd: Scalars["Boolean"]["output"];
  /** The highlighted selection market */
  market: SportsbookMarket;
  /** The highlighed selection */
  runner: Runner;
  /** The view link pair of the view to navigate to */
  viewLink: ViewLink;
};

/** Represents the promotion background image */
export type PromotionBackgroundImage = {
  /** The image height */
  height: Maybe<Scalars["Int"]["output"]>;
  /** The image tag */
  tag: Maybe<Scalars["String"]["output"]>;
  /** The image url */
  url: Scalars["String"]["output"];
  /** The image width */
  width: Maybe<Scalars["Int"]["output"]>;
};

/** Represents a promotion card */
export type PromotionCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card promotion action */
    action: PromotionAction;
    /** The card promotion background images */
    backgroundImage: Array<Maybe<PromotionBackgroundImage>>;
    /** The card promotion endDate */
    endDate: Maybe<Scalars["String"]["output"]>;
    /** The card promotion has betfair boost or not */
    hasBetfairBoost: Scalars["Boolean"]["output"];
    /** The promotion headline */
    headline: Maybe<Scalars["String"]["output"]>;
    /** The card promotion introLine */
    introLine: Maybe<Scalars["String"]["output"]>;
    /** The card promotion is an IMS card or not */
    isImsPromo: Maybe<Scalars["Boolean"]["output"]>;
    /** The card promotion name */
    name: Maybe<Scalars["String"]["output"]>;
    /** The card promotion optInState */
    optInState: Maybe<PromotionStatus>;
    /** The card promotion content type label */
    promoTypeLabel: Maybe<Scalars["String"]["output"]>;
    /** The card promotion content type */
    promotionContentType: PromotionContentType;
    /** The card promotion strapline */
    strapline: Maybe<Scalars["String"]["output"]>;
    /** The promotion subHeadline */
    subHeadline: Maybe<Scalars["String"]["output"]>;
    /** The card promotion tags */
    tags: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
    /** The card promotion terms and conditions */
    termsAndConditions: Maybe<PromotionTermsAndConditions>;
    /** The card promotion title */
    title: Maybe<Scalars["String"]["output"]>;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

export type PromotionCardItem =
  | BetOpportunityPromoCard
  | EditorialPromoCard
  | LoyaltyPromoCard
  | PriceBoostMultiplePromoCard
  | PromotionCard
  | SelectionPromoCard;

/** Represents the possible promotion content types */
export enum PromotionContentType {
  /** The casino promotion content type */
  Casino = "CASINO",
  /** The generic promotion content type */
  Generic = "GENERIC",
  /** The link promotion content type */
  Link = "LINK",
  /**
   * The movable ink promotion content type
   * @deprecated movable ink promotions are not used in rebuild
   */
  MovableInk = "MOVABLE_INK",
  /** The oddsboost promotion content type */
  Oddsboost = "ODDSBOOST",
}

export enum PromotionErrorCode {
  AlreadyCompleted = "ALREADY_COMPLETED",
  General = "GENERAL",
  NotEligible = "NOT_ELIGIBLE",
}

/** Full image details for PromotionsHubCard */
export type PromotionHubImage = {
  /** The image height */
  height: Scalars["Int"]["output"];
  /** The image tag */
  tag: Maybe<Scalars["String"]["output"]>;
  /** The image url */
  url: Scalars["URL"]["output"];
  /** The image width */
  width: Scalars["Int"]["output"];
};

export enum PromotionLayout {
  Accept = "ACCEPT",
  BuyIn = "BUY_IN",
  OptIn = "OPT_IN",
}

/** Represents the promotion navigation action */
export type PromotionNavigationAction = {
  /** The action label */
  label: Scalars["String"]["output"];
  /** The view link pair of the view to navigate to */
  viewLink: ViewLink;
};

export enum PromotionStatus {
  Completed = "COMPLETED",
  Expired = "EXPIRED",
  NotEligible = "NOT_ELIGIBLE",
  NotOptedIn = "NOT_OPTED_IN",
  Ongoing = "ONGOING",
  OptedIn = "OPTED_IN",
  RewardAwarded = "REWARD_AWARDED",
}

/** Represents the promotion terms and conditions */
export type PromotionTermsAndConditions = {
  /** The terms and conditions link label */
  label: Maybe<DisplayName>;
  /** The terms and conditions summary */
  summary: Maybe<Scalars["String"]["output"]>;
  /** The terms and conditions link url */
  url: Scalars["String"]["output"];
  /** The terms and conditions view link */
  viewLink: Maybe<ViewLink>;
};

/** Represents a promotion tracker error card to be displayed when the user is not eligible */
export type PromotionTrackerErrorCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** @deprecated expired experiment - remove in the next major release */
    errorMessage: DisplayName;
    /** @deprecated expired experiment - remove in the next major release */
    link: LabeledLink;
    /**
     * The card urn
     * @deprecated expired experiment - remove in the next major release
     */
    urn: Scalars["URN"]["output"];
  };

export type PromotionTrackerProgress = {
  /** @deprecated expired experiment - remove in the next major release */
  current: Maybe<Scalars["Float"]["output"]>;
  /** @deprecated expired experiment - remove in the next major release */
  steps: Maybe<Array<Maybe<PromotionTrackerProgressStep>>>;
};

export type PromotionTrackerProgressStep = {
  /** @deprecated expired experiment - remove in the next major release */
  reward: Maybe<Scalars["Float"]["output"]>;
  /** @deprecated expired experiment - remove in the next major release */
  target: Maybe<Scalars["Float"]["output"]>;
};

export enum PromotionWagerType {
  AfterWager = "AFTER_WAGER",
  FreeSpins = "FREE_SPINS",
  GoldenChips = "GOLDEN_CHIPS",
  PreWager = "PRE_WAGER",
  Unknown = "UNKNOWN",
}

/** Represents a swimlane that only holds promotion cards. This replaces the usage of SwimlaneCardGroup for promotion cards. */
export type PromotionsCardGroup = CardGroup &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    items: PromotionsCardGroupItemsConnection;
    /** The card group title */
    title: Maybe<DisplayName>;
    /** The card group urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a swimlane that only holds promotion cards. This replaces the usage of SwimlaneCardGroup for promotion cards. */
export type PromotionsCardGroupItemsArgs = {
  first: InputMaybe<Scalars["Int"]["input"]>;
};

export type PromotionsCardGroupItemsConnection = {
  edges: Array<Maybe<PromotionsCardGroupItemsEdge>>;
  pageInfo: Maybe<PageInfo>;
};

export type PromotionsCardGroupItemsEdge = {
  cursor: Maybe<Scalars["String"]["output"]>;
  node: PromotionCardItem;
};

/** Represents a promotions hub card */
export type PromotionsHubCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The associated promotion */
    promotionsHubPromotion: PromotionsHubPromotion;
    /** The card theme (light or dark) */
    theme: PromoTheme;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Card group for promotions hub cards - returns filtered promotion items */
export type PromotionsHubCardGroup = CardGroup &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** Whether the promotions hub is in empty state (no promotions available) */
    emptyState: Maybe<Scalars["Boolean"]["output"]>;
    /** The filter options for the promotions hub */
    filterOptions: Maybe<PromotionsHubFilterOptions>;
    /** The promotions hub card items */
    items: PromotionsHubCardGroupItemsConnection;
    selectedPebble: Maybe<Scalars["String"]["output"]>;
    /** The card group urn */
    urn: Scalars["URN"]["output"];
  };

/** Card group for promotions hub cards - returns filtered promotion items */
export type PromotionsHubCardGroupItemsArgs = {
  filterBy: InputMaybe<PromotionsHubFilterBy>;
  first: InputMaybe<Scalars["Int"]["input"]>;
};

export type PromotionsHubCardGroupItem = PromotionsHubCard;

export type PromotionsHubCardGroupItemsConnection = {
  edges: Array<Maybe<PromotionsHubCardGroupItemsEdge>>;
  pageInfo: Maybe<PageInfo>;
};

export type PromotionsHubCardGroupItemsEdge = {
  cursor: Maybe<Scalars["String"]["output"]>;
  node: PromotionsHubCardGroupItem;
};

/** Filter options for promotions hub card group items */
export type PromotionsHubFilterBy = {
  /** Filter by selected promoTag group URN */
  promoTagGroup: InputMaybe<Scalars["URN"]["input"]>;
};

/** Filter options for the promotions hub card group */
export type PromotionsHubFilterOptions = {
  /** PromoTag groups - Prismic-configurable filter buttons with counts */
  promoTagGroups: Array<PromotionsHubPromoTagGroup>;
};

/** PromoTag group filter - Prismic-configurable */
export type PromotionsHubPromoTagGroup = {
  /** Number of items matching this promoTag group filter */
  count: Scalars["Int"]["output"];
  /** The display label for the promoTag group */
  label: Scalars["String"]["output"];
  /** Tags to filter promotions by */
  tags: Maybe<Array<Scalars["String"]["output"]>>;
  /** The promoTag group unique identifier */
  urn: Scalars["URN"]["output"];
};

/** Represents a promotions hub promotion */
export type PromotionsHubPromotion = {
  /** The promotion action */
  action: Maybe<PromoAction>;
  /** The promotion badge */
  badge: Maybe<PromoBadge>;
  /** Whether the user can consent to this promotion */
  canConsent: Maybe<Scalars["Boolean"]["output"]>;
  /** Whether the user can opt in to this promotion */
  canOptIn: Maybe<Scalars["Boolean"]["output"]>;
  /** The promotion description */
  description: Maybe<Scalars["String"]["output"]>;
  /** Whether the user is eligible for this promotion */
  eligible: Maybe<Scalars["Boolean"]["output"]>;
  /** Whether the user has accepted this promotion */
  hasAccepted: Maybe<Scalars["Boolean"]["output"]>;
  /** The promotion images */
  images: Maybe<Array<PromotionHubImage>>;
  /** The promotion name */
  name: Scalars["String"]["output"];
  /** The date when opt-in starts for this promotion */
  optInStartDate: Maybe<Scalars["String"]["output"]>;
  /** The promotion opt-in state */
  optInState: Maybe<OptInState>;
  /** The promotion code */
  promoCode: Scalars["String"]["output"];
  /** The date when the promotion state expires */
  promoStateExpiryDate: Maybe<Scalars["String"]["output"]>;
  /** Whether to show time left indicator */
  showTimeLeft: Maybe<Scalars["Boolean"]["output"]>;
  /** The promotion status (ACTIVE, SCHEDULED, or ENDED) */
  status: Maybe<PromoStatus>;
  /** The promotion steps */
  steps: Maybe<Array<PromoStep>>;
  /** The promotion terms and conditions */
  termsAndConditions: PromoTermsAndConditions;
  /** The promotion title */
  title: Maybe<Scalars["String"]["output"]>;
  /** The promotion urn */
  urn: Scalars["URN"]["output"];
};

/** Represents the Promotions Hub View - Main promotions listing page with promoTag group filters */
export type PromotionsHubView = View & {
  /** The bottom bar */
  bottomBar: Maybe<BottomBar>;
  /** The view category */
  category: Maybe<ViewCategory>;
  /** The layout items on the view */
  items: PromotionsHubViewItemsConnection;
  /** The left side bar */
  leftSidebar: Maybe<LeftSidebar>;
  /** The regulatory data used for the regulatory header */
  regulatoryData: Maybe<RegulatoryData>;
  /** The view title */
  title: Maybe<Scalars["String"]["output"]>;
  /** The view url */
  url: Scalars["URL"]["output"];
  /** The view urn */
  urn: Scalars["URN"]["output"];
  /** The xsell bar */
  xsellBar: Maybe<XSellBar>;
};

/** Represents the Promotions Hub View - Main promotions listing page with promoTag group filters */
export type PromotionsHubViewItemsArgs = {
  first: InputMaybe<Scalars["Int"]["input"]>;
};

export type PromotionsHubViewItem = PromotionsHubCardGroup | RegulatoryCard;

export type PromotionsHubViewItemsConnection = {
  edges: Array<Maybe<PromotionsHubViewItemsEdge>>;
  pageInfo: Maybe<PageInfo>;
};

export type PromotionsHubViewItemsEdge = {
  cursor: Maybe<Scalars["String"]["output"]>;
  node: PromotionsHubViewItem;
};

/** Represents the Promotions Homepage View */
export type PromotionsView = View & {
  /** The bottom bar */
  bottomBar: Maybe<BottomBar>;
  /** The view category */
  category: Maybe<ViewCategory>;
  /** The layout items on the view */
  items: ViewItemsConnection;
  /** The left side bar */
  leftSidebar: Maybe<LeftSidebar>;
  /** The regulatory data used for the regulatory header */
  regulatoryData: Maybe<RegulatoryData>;
  /** The view title */
  title: Maybe<Scalars["String"]["output"]>;
  /** The view url */
  url: Scalars["URL"]["output"];
  /** The view urn */
  urn: Scalars["URN"]["output"];
  /** The xsell bar */
  xsellBar: Maybe<XSellBar>;
};

/** Represents the Promotions Homepage View */
export type PromotionsViewItemsArgs = {
  first: InputMaybe<Scalars["Int"]["input"]>;
};

export type Provider = {
  name: Scalars["String"]["output"];
  uid: Scalars["String"]["output"];
};

/** The query root of TBD GraphQL interface. */
export type Query = {
  /** Get user's app required context */
  AppContext: AppContextDetails;
  /** Currently acceptable and served app versions to identify force updates */
  AppVersion: AppVersion;
  /** Look up bottom bar by its urn */
  BottomBar: Maybe<BottomBar>;
  /** Look up cards by its urns */
  Cards: Maybe<Array<Maybe<ViewItem>>>;
  /** Look up a fixture by urn */
  Fixtures: Maybe<Array<Maybe<Fixture>>>;
  /** Perform a search for gaming cards */
  GamingSearch: GamingSearchCardConnection;
  /** Returns the left sidebar */
  LeftSidebar: LeftSidebar;
  /** Look up live markets by markets urns */
  LiveMarkets: Array<Maybe<MarketLiveData>>;
  /**
   * Retrieve marketing popup messages
   * This query will retrieve this data from the WMS service
   */
  MarketingMessages: Array<Maybe<ModalElement>>;
  /** Look up markets by markets urns */
  Markets: Maybe<Array<Maybe<Market>>>;
  /** Look up preferences by preferences urns */
  Preferences: Maybe<Array<Maybe<Preference>>>;
  /** Look up race runners by race runner urns */
  RaceRunners: Maybe<Array<Maybe<RaceRunner>>>;
  /** Look up races by their URNs */
  Races: Maybe<Array<Maybe<Race>>>;
  /**
   * Look up runners by their URNs
   * @deprecated Returns the legacy shared Runner type. Use sportsbookRunners or exchangeRunners.
   */
  Runners: Maybe<Array<Maybe<Runner>>>;
  /** Perform a search across views */
  Search: SearchResult;
  /** Look up upsell suggestions by market and selection tuples */
  UpsellSuggestions: Maybe<UpsellSuggestionsResult>;
  /** Look up a view by its urn */
  View: Maybe<View>;
  /** Look up virtual markets by markets urns */
  VirtualMarkets: Array<Maybe<VirtualMarket>>;
  /** Returns the xsell bar */
  XSellBar: XSellBar;
  /**
   * Look up exchange runners by their URNs. Position-preserving: returns null
   * at index i when the i-th URN is not an exchange runner or the runner can't
   * be found.
   */
  exchangeRunners: Array<Maybe<ExchangeRunner>>;
  obb: Maybe<ObbQuery>;
  /** Check eligibility of placed bets to be shared as tips */
  socialBettingCheckEligibility: CheckEligibilityResponse;
  /** Get the social betting feed (Community Picks / The Feed) */
  socialBettingFeed: SocialBettingFeedResponse;
  /** Gets the User's Social Profile */
  socialProfile: SocialProfileResponse;
  /** Retrieves a chat bot history */
  sportsbookChatBotHistory: SportsbookChatBotHistory;
  /** Retrieves a chat bot message details */
  sportsbookChatBotMessage: SportsbookChatBotMessage;
  /**
   * Look up sportsbook runners by their URNs. Position-preserving: returns null
   * at index i when the i-th URN is not a sportsbook runner or the runner can't
   * be found.
   */
  sportsbookRunners: Array<Maybe<SportsbookRunner>>;
};

/** The query root of TBD GraphQL interface. */
export type QueryBottomBarArgs = {
  urn: Scalars["URN"]["input"];
};

/** The query root of TBD GraphQL interface. */
export type QueryCardsArgs = {
  cardsURN: Array<Scalars["URN"]["input"]>;
};

/** The query root of TBD GraphQL interface. */
export type QueryFixturesArgs = {
  URNs: Array<Scalars["URN"]["input"]>;
};

/** The query root of TBD GraphQL interface. */
export type QueryGamingSearchArgs = {
  after: InputMaybe<Scalars["String"]["input"]>;
  first: InputMaybe<Scalars["Int"]["input"]>;
  query: Scalars["String"]["input"];
};

/** The query root of TBD GraphQL interface. */
export type QueryLiveMarketsArgs = {
  marketURNs: Array<Scalars["URN"]["input"]>;
};

/** The query root of TBD GraphQL interface. */
export type QueryMarketsArgs = {
  URNs: Array<Scalars["URN"]["input"]>;
};

/** The query root of TBD GraphQL interface. */
export type QueryPreferencesArgs = {
  preferencesURN: Array<Scalars["URN"]["input"]>;
};

/** The query root of TBD GraphQL interface. */
export type QueryRaceRunnersArgs = {
  URNs: Array<Scalars["URN"]["input"]>;
};

/** The query root of TBD GraphQL interface. */
export type QueryRacesArgs = {
  URNs: Array<Scalars["URN"]["input"]>;
};

/** The query root of TBD GraphQL interface. */
export type QueryRunnersArgs = {
  runnerURNs: Array<Scalars["URN"]["input"]>;
};

/** The query root of TBD GraphQL interface. */
export type QuerySearchArgs = {
  query: Scalars["String"]["input"];
};

/** The query root of TBD GraphQL interface. */
export type QueryUpsellSuggestionsArgs = {
  marketSelections: Array<MarketSelectionInput>;
};

/** The query root of TBD GraphQL interface. */
export type QueryViewArgs = {
  viewURN: Scalars["URN"]["input"];
};

/** The query root of TBD GraphQL interface. */
export type QueryVirtualMarketsArgs = {
  URNs: Array<Scalars["URN"]["input"]>;
};

/** The query root of TBD GraphQL interface. */
export type QueryExchangeRunnersArgs = {
  urns: Array<Scalars["URN"]["input"]>;
};

/** The query root of TBD GraphQL interface. */
export type QuerySocialBettingCheckEligibilityArgs = {
  betIds: Array<Scalars["String"]["input"]>;
};

/** The query root of TBD GraphQL interface. */
export type QuerySocialBettingFeedArgs = {
  cursor: InputMaybe<Scalars["String"]["input"]>;
  size: InputMaybe<Scalars["Int"]["input"]>;
  sortBy?: InputMaybe<SocialBettingFeedSortBy>;
};

/** The query root of TBD GraphQL interface. */
export type QuerySportsbookChatBotHistoryArgs = {
  chatId: Scalars["ID"]["input"];
};

/** The query root of TBD GraphQL interface. */
export type QuerySportsbookChatBotMessageArgs = {
  messageUrn: Scalars["URN"]["input"];
};

/** The query root of TBD GraphQL interface. */
export type QuerySportsbookRunnersArgs = {
  urns: Array<Scalars["URN"]["input"]>;
};

export type QueryDefinition = {
  /** Outcome (SCA field to retrieve the stat value) */
  outcome: Scalars["String"]["output"];
  /** Participant */
  participant: Participant;
  /** Period Definition */
  periodDefinition: PeriodDefinition;
  /** Sport (football, etc) */
  sport: Scalars["String"]["output"];
};

/** Represents a card that holds attributes for link */
export type QuickLink = {
  /** The quick link icon */
  icon: Maybe<Scalars["String"]["output"]>;
  /** The quick link label */
  label: Scalars["String"]["output"];
  /** The quick link target */
  target: Maybe<Scalars["String"]["output"]>;
  /** The quick link view link */
  viewLink: ViewLink;
};

/** Represents a card that holds a collection of links */
export type QuickLinksCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The accordion state, if applicable */
    accordionExpanded: Maybe<Scalars["Boolean"]["output"]>;
    /** The accordion title, if applicable */
    accordionTitle: Maybe<Scalars["String"]["output"]>;
    /** The icon name, if applicable */
    iconName: Maybe<Scalars["String"]["output"]>;
    /** The card header label, if applicable */
    label: Maybe<DisplayName>;
    /** The quick link list */
    links: Array<QuickLink>;
    /**
     * The card header title, if applicable
     * @deprecated Use `label` instead
     */
    title: Maybe<Scalars["String"]["output"]>;
    /** The quick links card urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a QuickStakes */
export type QuickStake = {
  /** The quickstake amount */
  stake: Scalars["Float"]["output"];
};

/** Represents a QuickStakes Preference */
export type QuickStakesPreference = Preference & {
  /** The selected quickstakes */
  selectedQuickStakes: Array<QuickStake>;
  /** The quickstakes preference urn */
  urn: Scalars["URN"]["output"];
};

export type QuicklinkGridCardGroupItemEdge = {
  cursor: Maybe<Scalars["String"]["output"]>;
  /** An Icon pack icon id to override on this item */
  icon: Maybe<PackIcon>;
  /** The expanded state */
  isExpanded: Scalars["Boolean"]["output"];
  /** Translated label */
  label: Maybe<Scalars["String"]["output"]>;
  /** The connected card */
  node: Card;
  /** The style of the quicklink */
  style: QuicklinkGridStyle;
};

export enum QuicklinkGridStyle {
  Highlighted = "HIGHLIGHTED",
  HighlightedInverse = "HIGHLIGHTED_INVERSE",
  None = "NONE",
  Promoted = "PROMOTED",
}

export type QuicklinksGridCardGroup = CardGroup &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** Grid override to hide arrow icons */
    hideArrows: Scalars["Boolean"]["output"];
    /** Grid override to hide icons */
    hideIcons: Scalars["Boolean"]["output"];
    items: QuicklinksGridCardGroupItemsConnection;
    /** The card group title */
    title: Maybe<Scalars["String"]["output"]>;
    /** The card group urn */
    urn: Scalars["URN"]["output"];
  };

export type QuicklinksGridCardGroupItemsArgs = {
  first: InputMaybe<Scalars["Int"]["input"]>;
};

export type QuicklinksGridCardGroupItemsConnection = {
  edges: Array<Maybe<QuicklinkGridCardGroupItemEdge>>;
  pageInfo: Maybe<PageInfo>;
};

export type Quotes = {
  eventId: EventId;
  prices: Array<ObbQuote>;
};

export type QuotesRequestInput = {
  eventId: EventIdInput;
  toQuote: Array<ToQuote>;
};

/** Represents a PPB race */
export type Race = {
  /** True if push notification subscription is available for this race. */
  availableToSubscribe: Scalars["Boolean"]["output"];
  /** Live video and data visualization broadcasts for this race. */
  broadcasts: Maybe<Broadcasts>;
  /**
   * The race rich data
   * @deprecated Use raceKind instead
   */
  details: Maybe<RaceDetails>;
  /** The race meeting */
  meeting: Meeting;
  /** The race win market name */
  name: Scalars["String"]["output"];
  /** The race primary market */
  primaryMarket: Maybe<Market>;
  /** The race id */
  raceId: Scalars["String"]["output"];
  /** The race rich data by sport */
  raceKind: Maybe<RaceKind>;
  /** @deprecated Use raceKind that accounts for both horse racing runners and greyhound racing runners */
  runners: Maybe<Array<Maybe<RaceRunner>>>;
  /** The race sport */
  sport: Sport;
  /** The race start time */
  startTime: Scalars["String"]["output"];
  /** The race urn */
  urn: Scalars["URN"]["output"];
  /** The race verdict */
  verdict: Maybe<Scalars["String"]["output"]>;
  /** The race winning time */
  winningTime: Maybe<Scalars["Float"]["output"]>;
};

/** Breadcrumb for a Race */
export type RaceBreadcrumb = {
  /** The race view */
  raceView: RaceView;
};

export type RaceByTimeRangeCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** Market promotion (Extra places and Money Back) */
    promotion: Maybe<MarketPromo>;
    race: Race;
    urn: Scalars["URN"]["output"];
    viewLink: ViewLink;
    /** The race Winner Name */
    winner: Maybe<Scalars["String"]["output"]>;
    /** The race Winner ISP */
    winnerIsp: Maybe<Isp>;
  };

/**
 * Connection type for race-specific content within a meeting view.
 * Surfaces which race is currently selected.
 */
export type RaceContentConnection = {
  edges: Array<Maybe<ViewItemEdge>>;
  pageInfo: Maybe<PageInfo>;
  /** The race that content is being shown for, with its navigation URL */
  selectedRace: RaceNavigationItem;
};

export type RaceCountriesFilter = {
  countries: Maybe<Array<RaceCountriesFilterOptions>>;
  defaultSelected: Maybe<RaceCountriesFilterOptions>;
};

export enum RaceCountriesFilterOptions {
  AllCountries = "ALL_COUNTRIES",
  UkAndIre = "UK_AND_IRE",
}

export type RaceDetails = {
  distance: Distance;
  going: Maybe<Going>;
  name: Scalars["String"]["output"];
  /** The number of runners with the NON_RUNNER status */
  numberOfNonRunners: Maybe<Scalars["Int"]["output"]>;
  /** The total number of runners either currently entered or that ran in the race */
  numberOfParticipants: Maybe<Scalars["Int"]["output"]>;
  /** Number of active runners on the race */
  numberOfRunners: Maybe<Scalars["Int"]["output"]>;
  raceClass: Maybe<Scalars["Int"]["output"]>;
  resultType: Maybe<RaceResultType>;
  /** The meeting open date */
  scheduledTime: Scalars["String"]["output"];
  status: Maybe<RaceStatus>;
  title: Maybe<Scalars["String"]["output"]>;
  /** The type of racing of the race */
  type: Maybe<RaceType>;
};

export type RaceDetailsCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** True if it needs to show the bell icon */
    availableToSubscribe: Scalars["Boolean"]["output"];
    numberOfRunners: Scalars["Int"]["output"];
    race: Race;
    raceClass: Maybe<Scalars["Int"]["output"]>;
    /** The card connected race view link */
    raceViewLink: Maybe<ViewLink>;
    showMeetingInfo: Scalars["Boolean"]["output"];
    urn: Scalars["URN"]["output"];
  };

/** Represents a Racing Context with a Race and a Meeting */
export type RaceHierarchy = {
  /** The market meeting */
  meeting: Meeting;
  /** The market race */
  race: Race;
};

export type RaceKind = GreyhoundRaceKind | HorseRaceKind;

export type RaceMarketCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** Represents the blurbs to be displayed in the Race Market Card */
    blurbs: Maybe<Array<Blurb>>;
    /**
     * The default market index
     * @deprecated is always 0
     */
    defaultIndex: Scalars["Int"]["output"];
    /** The card markets with runners sorted for both exchange and sportsbook */
    displayRunners: DisplayRunners;
    /**
     * Identifies whether runner details should be expandable or not
     * @deprecated Use sportsbookRunner.participant != null per-runner. `participant.__typename` indicates which kind of detail to render.
     */
    isRunnerExpandable: Maybe<Scalars["Boolean"]["output"]>;
    /** The view links for each market */
    marketViewLinks: Array<ViewLink>;
    /** The race market card number of runners */
    numberOfRunners: Scalars["Int"]["output"];
    /** Market promotion (Extra places and Money Back) */
    promotion: Maybe<MarketPromo>;
    /** The race */
    race: Race;
    /** The view link to the race RaceView */
    raceViewLink: Maybe<ViewLink>;
    /** The view links to all selections for this market */
    runnerViewLinks: Array<RunnerViewLink>;
    /** The card title */
    title: Scalars["String"]["output"];
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/**
 * Represents a meeting-scoped race view. The meeting is the stable context;
 * race-specific content is accessed by filtering on a race URN.
 */
export type RaceMeetingView = View & {
  /** The bottom bar */
  bottomBar: Maybe<BottomBar>;
  /** The canonical url on the view */
  canonicalUrl: Maybe<Scalars["String"]["output"]>;
  /** The view category */
  category: Maybe<ViewCategory>;
  /**
   * Race-specific content items. When race arg is omitted, defaults to
   * the race encoded in the view.
   */
  items: RaceContentConnection;
  /** The left side bar */
  leftSidebar: Maybe<LeftSidebar>;
  /** The meeting this view represents */
  meeting: Meeting;
  /** All races at this meeting with navigation URLs. */
  races: Array<Maybe<RaceNavigationItem>>;
  /** The regulatory data used for the regulatory header */
  regulatoryData: Maybe<RegulatoryData>;
  /** Other meetings of the same sport. */
  siblingRaceMeetingViews: Array<Maybe<RaceMeetingView>>;
  /** The view title */
  title: Maybe<Scalars["String"]["output"]>;
  /** The view url */
  url: Scalars["URL"]["output"];
  /** The view urn */
  urn: Scalars["URN"]["output"];
  /** The xsell bar */
  xsellBar: Maybe<XSellBar>;
};

/**
 * Represents a meeting-scoped race view. The meeting is the stable context;
 * race-specific content is accessed by filtering on a race URN.
 */
export type RaceMeetingViewItemsArgs = {
  autoPageSize: InputMaybe<Scalars["Boolean"]["input"]>;
  first: InputMaybe<Scalars["Int"]["input"]>;
  race: InputMaybe<Scalars["URN"]["input"]>;
};

/** A race within a meeting view, with navigation context */
export type RaceNavigationItem = {
  /** Market promotion (Extra places and Money Back) */
  promotion: Maybe<MarketPromo>;
  /** The race entity */
  race: Race;
  /** The view link for this race */
  viewLink: ViewLink;
};

export enum RaceResultType {
  FullResult = "FULL_RESULT",
  QuickResult = "QUICK_RESULT",
}

export type RaceResultsCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The SCA race */
    race: Race;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a horse race runner */
export type RaceRunner = {
  /** Apprentice Claim weight reduction for jockey */
  apprenticeClaim: Maybe<Scalars["Int"]["output"]>;
  /** The race runner's comments */
  comments: Maybe<Scalars["String"]["output"]>;
  /** Characters denoting if the horse has previously won at this distance(D), course(C) or was a beaten favourite(BF). May be multiple qualifiers. */
  crsDisWinFavText: Maybe<Scalars["String"]["output"]>;
  /** The race runner's details */
  details: RunnerDetails;
  /** The race runner's form */
  form: Maybe<Scalars["String"]["output"]>;
  /** The race runner's horse details */
  horse: Horse;
  /** The race runner's raceURN */
  raceURN: Scalars["URN"]["output"];
  /** The race runner's rating */
  rating: Maybe<Scalars["Int"]["output"]>;
  /** The race runner's rating123 */
  rating123: Maybe<Scalars["Int"]["output"]>;
  /** The race runner's ratingStars */
  ratingStars: Maybe<Scalars["Int"]["output"]>;
  /** The race runner's selectionId */
  selectionId: Scalars["Int"]["output"];
  /** The entry status of the horse */
  status: Maybe<RunnerStatus>;
  /** The race runner's urn */
  urn: Scalars["URN"]["output"];
};

/** Represents a race runner kind */
export type RaceRunnerKind = GreyhoundRaceRunner | RaceRunner;

export enum RaceStatus {
  Abandoned = "ABANDONED",
  AtThePost = "AT_THE_POST",
  Delayed = "DELAYED",
  Dormant = "DORMANT",
  FalseStart = "FALSE_START",
  Finished = "FINISHED",
  GoingBehind = "GOING_BEHIND",
  GoingDown = "GOING_DOWN",
  Off = "OFF",
  Parading = "PARADING",
  Photograph = "PHOTOGRAPH",
  RaceVoid = "RACE_VOID",
  Result = "RESULT",
  UnderOrders = "UNDER_ORDERS",
  WeighedIn = "WEIGHED_IN",
}

/** Represents a card with the sibling views of a sport */
export type RaceSwitcherCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    filterTitle: TranslatableText;
    /** The header theming for the race switcher card */
    headerTheming: Maybe<Scalars["String"]["output"]>;
    /** The selected race */
    race: Race;
    /** The race siblings views */
    siblingViews: RaceSwitcherLinkConnection;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a card with the sibling views of a sport */
export type RaceSwitcherCardSiblingViewsArgs = {
  first: InputMaybe<Scalars["Int"]["input"]>;
};

/** Represents a connection between race switcher card and race link */
export type RaceSwitcherLinkConnection = {
  edges: Array<Maybe<RaceSwitcherLinkEdge>>;
  pageInfo: Maybe<PageInfo>;
};

/** Represents an edge between race switcher card and race link */
export type RaceSwitcherLinkEdge = {
  cursor: Maybe<Scalars["String"]["output"]>;
  node: RaceViewLink;
};

export type RaceTimeItemEdge = {
  cursor: Maybe<Scalars["String"]["output"]>;
  icon: Maybe<RaceTimeItemEdgeIcon>;
  isHighlighted: Scalars["Boolean"]["output"];
  node: RaceMarketCard;
  /** Market promotion (Extra places and Money Back) */
  promotion: Maybe<MarketPromo>;
  startTime: Scalars["String"]["output"];
  venue: Maybe<Scalars["String"]["output"]>;
};

export enum RaceTimeItemEdgeIcon {
  ExtraPlaces = "EXTRA_PLACES",
  MoneyBackSpecial = "MONEY_BACK_SPECIAL",
}

export enum RaceType {
  Bumper = "BUMPER",
  Chase = "CHASE",
  Flat = "FLAT",
  Hurdle = "HURDLE",
}

/** Represents a view with a related race */
export type RaceView = View & {
  /** The bottom bar */
  bottomBar: Maybe<BottomBar>;
  /** The canonical url on the view */
  canonicalUrl: Maybe<Scalars["String"]["output"]>;
  /** The view category */
  category: Maybe<ViewCategory>;
  /** The layout items on the view */
  items: ViewItemsConnection;
  /** The left side bar */
  leftSidebar: Maybe<LeftSidebar>;
  /** The corresponding race event */
  race: Race;
  /** The regulatory data used for the regulatory header */
  regulatoryData: Maybe<RegulatoryData>;
  /** The view title */
  title: Maybe<Scalars["String"]["output"]>;
  /** The view url */
  url: Scalars["URL"]["output"];
  /** The view urn */
  urn: Scalars["URN"]["output"];
  /** The xsell bar */
  xsellBar: Maybe<XSellBar>;
};

/** Represents a view with a related race */
export type RaceViewItemsArgs = {
  autoPageSize: InputMaybe<Scalars["Boolean"]["input"]>;
  first: InputMaybe<Scalars["Int"]["input"]>;
};

/** Represents a Race View Link */
export type RaceViewLink = {
  /** Market promotion (Extra places and Money Back) */
  promotion: Maybe<MarketPromo>;
  /** The race */
  race: Race;
  /** The race view link urn */
  urn: Scalars["URN"]["output"];
  /** The view link */
  viewLink: ViewLink;
};

export type RaceViewLinkCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    race: Race;
    urn: Scalars["URN"]["output"];
    viewLink: ViewLink;
  };

export type RaceViewLinksCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The selected race */
    race: Race;
    /** Race view links */
    raceViewLinks: Array<RaceViewLink>;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a collection of CardGroup */
export type RacesByTimeRangeCardGroup = CardGroup &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The future racing filter options */
    filterOptions: Maybe<ByTimeRangeOptions>;
    /** The future racing items */
    items: RacesByTimeRangeCardGroupItemsConnection;
    /** The future racing URN */
    urn: Scalars["URN"]["output"];
  };

/** Represents a collection of CardGroup */
export type RacesByTimeRangeCardGroupItemsArgs = {
  filterBy: InputMaybe<ByTimeRangeFilterBy>;
  first: InputMaybe<Scalars["Int"]["input"]>;
};

/** Represents a FutureRacing edge */
export type RacesByTimeRangeCardGroupItemEdge = {
  cursor: Maybe<Scalars["String"]["output"]>;
  node: RacesByTimeRangeCardGroupItems;
};

export type RacesByTimeRangeCardGroupItems = ByTimeRangeMeetingCardGroup | SwimlaneIndexedCardGroup;

/** Represents a connection between FutureRacing and [QuickLinksCard] */
export type RacesByTimeRangeCardGroupItemsConnection = {
  edges: Array<Maybe<RacesByTimeRangeCardGroupItemEdge>>;
  pageInfo: Maybe<PageInfo>;
};

/** Represents a collection of cards with a common context */
export type RacingSwimlaneCardGroup = CardGroup &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card group display Name for translations */
    displayName: Maybe<DisplayNameTranslationKey>;
    items: RacingSwimlaneCardGroupItemsConnection;
    /** The card group title */
    title: Maybe<Scalars["String"]["output"]>;
    /** The card group urn */
    urn: Scalars["URN"]["output"];
    /** The card group view all */
    viewAll: Maybe<GroupViewAll>;
  };

/** Represents a collection of cards with a common context */
export type RacingSwimlaneCardGroupItemsArgs = {
  first: InputMaybe<Scalars["Int"]["input"]>;
};

/** Represents a RacingSwimlaneCardGroup edge */
export type RacingSwimlaneCardGroupItemEdge = {
  cursor: Maybe<Scalars["String"]["output"]>;
  node: RaceMarketCard;
};

/** Represents a connection between RacingSwimlaneCardGroup and [Card] */
export type RacingSwimlaneCardGroupItemsConnection = {
  edges: Array<Maybe<RacingSwimlaneCardGroupItemEdge>>;
  pageInfo: Maybe<PageInfo>;
};

export enum RankChange {
  Down = "DOWN",
  NoChange = "NO_CHANGE",
  Unknown = "UNKNOWN",
  Up = "UP",
}

export enum RankStatus {
  AfcChallengeLeagueQualifiers = "AFC_CHALLENGE_LEAGUE_QUALIFIERS",
  AfcChampionsLeague_2 = "AFC_CHAMPIONS_LEAGUE_2",
  AfcChampionsLeague_2Qualifiers = "AFC_CHAMPIONS_LEAGUE_2_QUALIFIERS",
  AfcChampionsLeagueElite = "AFC_CHAMPIONS_LEAGUE_ELITE",
  AfcChampionsLeagueEliteQualifiers = "AFC_CHAMPIONS_LEAGUE_ELITE_QUALIFIERS",
  CafChampionsLeague = "CAF_CHAMPIONS_LEAGUE",
  CafChampionsLeagueQualifiers = "CAF_CHAMPIONS_LEAGUE_QUALIFIERS",
  CafConfederationCup = "CAF_CONFEDERATION_CUP",
  CafConfederationCupQualifiers = "CAF_CONFEDERATION_CUP_QUALIFIERS",
  Champions = "CHAMPIONS",
  ChampionsLeagueQualification = "CHAMPIONS_LEAGUE_QUALIFICATION",
  Promotion = "PROMOTION",
  Relegation = "RELEGATION",
  RelegationPlayOff = "RELEGATION_PLAY_OFF",
  UefaChampionsLeague = "UEFA_CHAMPIONS_LEAGUE",
  UefaChampionsLeagueQualifiers = "UEFA_CHAMPIONS_LEAGUE_QUALIFIERS",
  UefaConferenceLeaguePlayOffs = "UEFA_CONFERENCE_LEAGUE_PLAY_OFFS",
  UefaConferenceLeagueQualifiers = "UEFA_CONFERENCE_LEAGUE_QUALIFIERS",
  UefaEuropaLeague = "UEFA_EUROPA_LEAGUE",
  UefaEuropaLeaguePlayOffs = "UEFA_EUROPA_LEAGUE_PLAY_OFFS",
  Unknown = "UNKNOWN",
}

export type ReadWebMessageResponse = {
  state: Maybe<Scalars["String"]["output"]>;
};

export type Red7Scoreboard = {
  fullURL: Maybe<Scalars["String"]["output"]>;
  origin: Maybe<Scalars["String"]["output"]>;
};

/** Reduced banner actions. It is missing the 'actionFinalize' field that is specific to top level banner actions */
export type ReducedBannerCta = {
  /** MAX custom action to call */
  action: Maybe<Scalars["String"]["output"]>;
  /** Button type */
  buttonType: Maybe<Scalars["String"]["output"]>;
  /** Data to be used to call MAX custom action */
  data: Maybe<Scalars["String"]["output"]>;
  /** Button GA label */
  gaLabel: Maybe<Scalars["String"]["output"]>;
  /** Button label */
  label: Maybe<Scalars["String"]["output"]>;
  /** Button minimized label */
  minimizedLabel: Maybe<Scalars["String"]["output"]>;
  /** Relative path */
  path: Maybe<Scalars["String"]["output"]>;
  /** Where should the URL be opened */
  target: Maybe<Scalars["String"]["output"]>;
  /** CTA type */
  type: Maybe<Scalars["String"]["output"]>;
  /** Button URL */
  url: Maybe<Scalars["String"]["output"]>;
};

export type RegistrationData = {
  joinNowLabel: Maybe<Scalars["String"]["output"]>;
  joinNowLink: Scalars["String"]["output"];
};

/** Represents regulatory information */
export type RegulatoryCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The regulatory information sections */
    sections: Array<RegulatorySection>;
    /** The regulatory information urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a clock regulatory item */
export type RegulatoryClockItem = {
  /** The regulatory item alignment */
  alignment: RegulatoryItemAlignment;
  /** The regulatory item clock link target */
  target: Maybe<Scalars["String"]["output"]>;
  /** The regulatory clock text */
  text: Maybe<Scalars["String"]["output"]>;
  /** The regulatory time format */
  timeFormat: Scalars["String"]["output"];
  /** The regulatory item clock timeZone */
  timeZone: Scalars["String"]["output"];
};

/** Represents a text regulatory item */
export type RegulatoryCookieConsentItem = {
  /** The regulatory item alignment */
  alignment: RegulatoryItemAlignment;
  /** The regulatory item link target */
  target: Maybe<Scalars["String"]["output"]>;
  /** The regulatory item text */
  text: Scalars["String"]["output"];
};

/** Represents the regulatory data */
export type RegulatoryData = {
  /** The regulatory information sections */
  sections: Array<RegulatorySection>;
  urn: Scalars["URN"]["output"];
};

/** Represents a text regulatory item */
export type RegulatoryImageItem = {
  /** The regulatory item alignment */
  alignment: RegulatoryItemAlignment;
  /** The regulatory item image alt text */
  alt: Maybe<Scalars["String"]["output"]>;
  /** The regulatory item image url */
  imageURL: Scalars["String"]["output"];
  /** The regulatory item image link target */
  target: Maybe<Scalars["String"]["output"]>;
  /** The regulatory item image link url */
  url: Maybe<Scalars["String"]["output"]>;
  /** The regulatory image view link */
  viewLink: Maybe<ViewLink>;
};

/** Represents a regulatory item */
export type RegulatoryItem =
  | RegulatoryClockItem
  | RegulatoryCookieConsentItem
  | RegulatoryImageItem
  | RegulatoryLastLogInItem
  | RegulatoryLinkItem
  | RegulatoryLoggedInSinceItem
  | RegulatorySessionItem
  | RegulatoryTextItem
  | RegulatoryUserDetailsItem;

/** Possible regulatory items alignment values */
export enum RegulatoryItemAlignment {
  /** Center alignment */
  Center = "CENTER",
  /** Left alignment */
  Left = "LEFT",
  /** Right alignment */
  Right = "RIGHT",
}

/** Represents a last login item */
export type RegulatoryLastLogInItem = {
  /** The regulatory item alignment */
  alignment: RegulatoryItemAlignment;
  /** The regulatory item text */
  text: Maybe<Scalars["String"]["output"]>;
  /** The regulatory time */
  time: Scalars["String"]["output"];
  /** The regulatory time format */
  timeFormat: Scalars["String"]["output"];
};

/** Represents a text regulatory item */
export type RegulatoryLinkItem = {
  /** The regulatory item alignment */
  alignment: RegulatoryItemAlignment;
  /** The regulatory item link target */
  target: Maybe<Scalars["String"]["output"]>;
  /** The regulatory item text */
  text: Scalars["String"]["output"];
  /** The regulatory item link url */
  url: Scalars["String"]["output"];
  /** The regulatory item view link */
  viewLink: Maybe<ViewLink>;
};

/** Represents a text regulatory item */
export type RegulatoryLoggedInSinceItem = {
  /** The regulatory item alignment */
  alignment: RegulatoryItemAlignment;
  /** The regulatory item text */
  text: Maybe<Scalars["String"]["output"]>;
  /** The regulatory time format */
  timeFormat: Scalars["String"]["output"];
};

/** Represents a regulatory section */
export type RegulatorySection = {
  /** The regulatory section background color */
  bgColor: Maybe<Scalars["String"]["output"]>;
  /** The regulatory section items */
  items: Array<RegulatoryItem>;
  /** The regulatory section type */
  sectionType: RegulatorySectionType;
  /** The regulatory section text color */
  textColor: Maybe<Scalars["String"]["output"]>;
};

/** Represents an accordion regulatory section */
export type RegulatorySectionAccordion = RegulatorySection & {
  /** The regulatory section background color */
  bgColor: Maybe<Scalars["String"]["output"]>;
  /** The regulatory section items */
  items: Array<RegulatoryItem>;
  /** The regulatory section type */
  sectionType: RegulatorySectionType;
  /** The regulatory section text color */
  textColor: Maybe<Scalars["String"]["output"]>;
  /** The regulatory section title */
  title: Scalars["String"]["output"];
};

/** Represents a generic regulatory section */
export type RegulatorySectionGeneric = RegulatorySection & {
  /** The regulatory section background color */
  bgColor: Maybe<Scalars["String"]["output"]>;
  /** The regulatory section items */
  items: Array<RegulatoryItem>;
  /** The regulatory section type */
  sectionType: RegulatorySectionType;
  /** The regulatory section text color */
  textColor: Maybe<Scalars["String"]["output"]>;
  /** The regulatory section title */
  title: Maybe<Scalars["String"]["output"]>;
};

/** The possible types of regulatory sections. */
export enum RegulatorySectionType {
  /** Accordion regulatory section */
  Accordion = "ACCORDION",
  /** Generic regulatory section */
  Generic = "GENERIC",
}

/** Represents a text regulatory item */
export type RegulatorySessionItem = {
  /** The regulatory item alignment */
  alignment: RegulatoryItemAlignment;
  /** The regulatory item text */
  text: Maybe<Scalars["String"]["output"]>;
  /** The regulatory session start time */
  time: Scalars["String"]["output"];
  /** The regulatory time format */
  timeFormat: Scalars["String"]["output"];
};

/** Represents a text regulatory item */
export type RegulatoryTextItem = {
  /** The regulatory item alignment */
  alignment: RegulatoryItemAlignment;
  /** The regulatory item text */
  text: Scalars["String"]["output"];
};

/** Represents a user details item */
export type RegulatoryUserDetailsItem = {
  /** The regulatory item alignment */
  alignment: RegulatoryItemAlignment;
  /** The user contract number */
  contractNumber: Maybe<Scalars["String"]["output"]>;
  /** The user first name */
  firstName: Scalars["String"]["output"];
  /** The user last name */
  lastName: Scalars["String"]["output"];
  /** The user national identifier */
  nationalIdentifier: Maybe<Scalars["String"]["output"]>;
};

export type Result = {
  errorDetails: Maybe<Scalars["String"]["output"]>;
  legResults: Array<ObbResult>;
  resultCode: Scalars["String"]["output"];
};

/** Leg result enum values */
export enum ResultEnum {
  CashedOut = "CASHED_OUT",
  Frozen = "FROZEN",
  Losing = "LOSING",
  Lost = "LOST",
  Placed = "PLACED",
  Settled = "SETTLED",
  Void = "VOID",
  Winning = "WINNING",
  Won = "WON",
}

/** Result types values */
export enum ResultTypeEnum {
  Confirmed = "CONFIRMED",
  Potential = "POTENTIAL",
  Unknown = "UNKNOWN",
}

/** Represents a card that holds the user rewards info */
export type RewardsCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** Benefits packages details */
    benefitsPackages: BenefitsPackages;
    /** The rewards card URN */
    urn: Scalars["URN"]["output"];
  };

/** User rewards status values */
export enum RewardsStatus {
  Bespoke = "BESPOKE",
  Ineligible = "INELIGIBLE",
  NotOptedIn = "NOT_OPTED_IN",
  OptedIn = "OPTED_IN",
}

export type RichText = {
  spans: Maybe<Array<RichTextSpan>>;
  text: Scalars["String"]["output"];
  type: Scalars["String"]["output"];
};

export type RichTextSpan = {
  end: Scalars["Int"]["output"];
  start: Scalars["Int"]["output"];
  style: Scalars["String"]["output"];
  url: Maybe<Scalars["String"]["output"]>;
  viewLink: Maybe<ViewLink>;
};

export type RouletteNumber = {
  color: RouletteNumberColor;
  number: Scalars["String"]["output"];
};

export enum RouletteNumberColor {
  Black = "BLACK",
  Green = "GREEN",
  Red = "RED",
}

export type RugbyLeagueFixture = Fixture & {
  /** Half time score */
  halfTimeScore: Maybe<RugbyLeagueScore>;
  /** If the score should be display in american format */
  isAmericanFormat: Scalars["Boolean"]["output"];
  /** The fixture main market home away runner names */
  runnerNames: Maybe<FixtureRunnerNames>;
  /** Score of the current period */
  score: Maybe<RugbyLeagueScore>;
  /** The sport event */
  sportevent: SportsEvent;
  /** The fixture urn */
  urn: Scalars["URN"]["output"];
};

export type RugbyLeagueScore = {
  /** Away team score */
  away: Scalars["Int"]["output"];
  /** Home team score */
  home: Scalars["Int"]["output"];
};

export type RugbyUnionFixture = Fixture & {
  /** Half time score */
  halfTimeScore: Maybe<RugbyUnionScore>;
  /** If the score should be display in american format */
  isAmericanFormat: Scalars["Boolean"]["output"];
  /** The fixture main market home away runner names */
  runnerNames: Maybe<FixtureRunnerNames>;
  /** Score of the current period */
  score: Maybe<RugbyUnionScore>;
  /** The sport event */
  sportevent: SportsEvent;
  /** The fixture urn */
  urn: Scalars["URN"]["output"];
};

export type RugbyUnionScore = {
  /** Away team score */
  away: Scalars["Int"]["output"];
  /** Home team score */
  home: Scalars["Int"]["output"];
};

/** Represents a PPB market runner */
export type Runner = {
  /**
   * The runner handicap
   * @deprecated Use the respective runnerLiveData handicap instead
   */
  handicap: Scalars["Float"]["output"];
  /** The market this runner belongs to */
  market: Maybe<Market>;
  /**
   * The market urn
   * @deprecated Use market instead
   */
  marketURN: Scalars["URN"]["output"];
  /** The runner name */
  name: Scalars["String"]["output"];
  /** The runner participant id */
  participantId: Maybe<Scalars["String"]["output"]>;
  /** The runner result type */
  resultType: Maybe<Scalars["String"]["output"]>;
  /** The runner live data */
  runnerLiveData: Maybe<RunnerLiveData>;
  /** The market runner urn */
  runnerURN: Scalars["URN"]["output"];
  /** The runner selection id */
  selectionId: Scalars["Int"]["output"];
};

/** Represents the details of a race runner */
export type RunnerDetails = {
  /** The stall the race runner will start from */
  draw: Maybe<Scalars["Int"]["output"]>;
  /** The description of the runner equipment */
  equipmentDescription: Maybe<Scalars["String"]["output"]>;
  /** The name of the jockey */
  jockeyName: Maybe<Scalars["String"]["output"]>;
  /** The number of the cloth */
  saddleCloth: Scalars["String"]["output"];
  /** The details for the runner's silk */
  silk: Maybe<Scalars["URL"]["output"]>;
  /** The name of the trainer */
  trainerName: Maybe<Scalars["String"]["output"]>;
  /** The weight carried by the runner */
  weight: Maybe<Weight>;
};

export type RunnerInfoCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The race runner */
    raceRunner: RaceRunner;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

export type RunnerLiveData = ExchangeRunnerLiveData | SportsbookRunnerLiveData;

/** Represents a runner's market graph */
export type RunnerMarketGraph = {
  /** The runner graph URL params */
  graphParams: Scalars["String"]["output"];
  /** The runner live data */
  liveData: ExchangeRunnerLiveData;
  /** The runner urn */
  runnerURN: Scalars["URN"]["output"];
};

/**
 * A real-world entity bound to a runner's bet selection. Open to extension as new
 * participant kinds are added (Team, TennisPlayer, ...).
 *
 * Football resolves to `FootballPlayerFixtureContext` (not the bare
 * `FootballPlayerFixture`) so the FE can also pull the player's team and the
 * fixture from the same root.
 */
export type RunnerParticipant = FootballPlayerFixtureContext | GreyhoundRaceRunner | RaceRunner;

export enum RunnerStatus {
  AlsoEligible = "ALSO_ELIGIBLE",
  DroppedOutAtFiveDay = "DROPPED_OUT_AT_FIVE_DAY",
  DroppedOutAtFourDay = "DROPPED_OUT_AT_FOUR_DAY",
  DroppedOutAtOvernight = "DROPPED_OUT_AT_OVERNIGHT",
  DroppedOutDuringEarlyClosers = "DROPPED_OUT_DURING_EARLY_CLOSERS",
  MainTrackOnly = "MAIN_TRACK_ONLY",
  NonRunner = "NON_RUNNER",
  RaceAbandoned = "RACE_ABANDONED",
  Reserve = "RESERVE",
  Runner = "RUNNER",
  Withdrawn = "WITHDRAWN",
}

/** Represents the Runner view */
export type RunnerView = View & {
  /** The bottom bar */
  bottomBar: Maybe<BottomBar>;
  /** The view category */
  category: Maybe<ViewCategory>;
  /** The layout items on the view */
  items: ViewItemsConnection;
  /** The left side bar */
  leftSidebar: Maybe<LeftSidebar>;
  /** The regulatory data used for the regulatory header */
  regulatoryData: Maybe<RegulatoryData>;
  /** The view title */
  title: Maybe<Scalars["String"]["output"]>;
  /** The view url */
  url: Scalars["URL"]["output"];
  /** The view urn */
  urn: Scalars["URN"]["output"];
  /** The xsell bar */
  xsellBar: Maybe<XSellBar>;
};

/** Represents a connection to a runner view */
export type RunnerViewLink = {
  /** The runner's urn */
  runnerUrn: Scalars["URN"]["output"];
  /** The connected view url */
  viewUrl: Scalars["URL"]["output"];
  /** The connected view urn */
  viewUrn: Scalars["URN"]["output"];
};

/**
 * A curated runner view for a card. Always single-product:
 * exchange OR sportsbook, never both.
 */
export type RunnersDisplay = ExchangeRunnersDisplay | SportsbookRunnersDisplay;

export type SearchBarCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The search bar placeholder */
    placeholder: Maybe<DisplayName>;
    /** The search bar title */
    title: Maybe<DisplayName>;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Perform a search result across views */
export type SearchResult = {
  /** Search did you mean alternative query */
  didYouMean: Maybe<Scalars["String"]["output"]>;
  /** The number of found views on the current page */
  pageSize: Scalars["Int"]["output"];
  /** The search query string */
  query: Scalars["String"]["output"];
  /** The matched views */
  results: Maybe<Array<Maybe<SearchableViews>>>;
  /** The current page index */
  startIndex: Scalars["Int"]["output"];
};

/** Represents a collection of SearchZoneItems */
export type SearchZone = NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    items: ViewZoneItemsConnection;
    urn: Scalars["URN"]["output"];
  };

/** Represents a collection of SearchZoneItems */
export type SearchZoneItemsArgs = {
  first: InputMaybe<Scalars["Int"]["input"]>;
};

/** Represents the views that can be searched for */
export type SearchableViews = CompetitionView | EventView | RaceMeetingView | RaceView;

/** Represents a collection of CardGroup */
export type SegmentedCardGroup = NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    items: SegmentedCardGroupItemsConnection;
    urn: Scalars["URN"]["output"];
  };

/** Represents a collection of CardGroup */
export type SegmentedCardGroupItemsArgs = {
  first: InputMaybe<Scalars["Int"]["input"]>;
};

/** Represents a SegmentedCardGroup edge */
export type SegmentedCardGroupItemEdge = {
  cursor: Maybe<Scalars["String"]["output"]>;
  node: GamingCardGroup;
};

/** Represents a connection between SegmentedCardGroup and [CardGroup] */
export type SegmentedCardGroupItemsConnection = {
  edges: Array<Maybe<SegmentedCardGroupItemEdge>>;
  pageInfo: Maybe<PageInfo>;
};

export type SelectableItemsCardGroup = CardGroup &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    filter: Maybe<SelectableItemsCardGroupFilter>;
    isHighlighted: Scalars["Boolean"]["output"];
    items: SelectableItemsCardGroupItemsConnection;
    title: Maybe<Scalars["String"]["output"]>;
    type: Maybe<SelectableItemsCardGroupType>;
    urn: Scalars["URN"]["output"];
  };

export type SelectableItemsCardGroupItemsArgs = {
  filterBy: InputMaybe<SelectableItemsFilterOptions>;
  first: InputMaybe<Scalars["Int"]["input"]>;
};

export type SelectableItemsCardGroupFilter = RaceCountriesFilter;

export type SelectableItemsCardGroupItemEdge = RaceTimeItemEdge | StatisticsItemEdge | VirtualCardGroupItemEdge;

export type SelectableItemsCardGroupItemsConnection = {
  edges: Array<Maybe<SelectableItemsCardGroupItemEdge>>;
  pageInfo: Maybe<PageInfo>;
};

export enum SelectableItemsCardGroupType {
  Statistics = "STATISTICS",
  Timeline = "TIMELINE",
}

export type SelectableItemsFilterOptions = {
  countries: InputMaybe<RaceCountriesFilterOptions>;
};

export type SelectedPebble = {
  typename: Maybe<Scalars["String"]["output"]>;
  urn: Maybe<Scalars["String"]["output"]>;
};

export type SelectedTab = {
  typename: Maybe<Scalars["String"]["output"]>;
  urn: Maybe<Scalars["String"]["output"]>;
};

/** Represents the possible actions for selection promo cards */
export type SelectionPromoActions = PromotionAddToBetslipAction | PromotionAddToBetslipAndNavigateAction;

/** Represents a promo card of type selection */
export type SelectionPromoCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /**
     * The card action
     * @deprecated use cta instead
     */
    action: PromotionAddToBetslipAction;
    /** The card possible actions */
    cta: SelectionPromoActions;
    /** The card image */
    promoImage: Maybe<PromoImage>;
    /** The card promo tag */
    promoTag: Maybe<PromoTag>;
    /** The subTitle of the card */
    subTitle: Maybe<Scalars["String"]["output"]>;
    /** The card terms and conditions */
    termsAndConditions: Maybe<PromoTermsAndConditions>;
    /** The theme of the card */
    theme: PromoTheme;
    /** The card title */
    title: Scalars["String"]["output"];
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a SelfExcluded View */
export type SelfExcludedView = View & {
  /** The bottom bar */
  bottomBar: Maybe<BottomBar>;
  /** The view category */
  category: Maybe<ViewCategory>;
  /** The layout items on the view */
  items: ViewItemsConnection;
  /**
   * The left side bar
   * @deprecated Use LeftSidebar Query instead
   */
  leftSidebar: Maybe<LeftSidebar>;
  /** The regulatory data used for the regulatory header */
  regulatoryData: Maybe<RegulatoryData>;
  /** The view title */
  title: Maybe<Scalars["String"]["output"]>;
  /** The view url */
  url: Scalars["URL"]["output"];
  /** The view urn */
  urn: Scalars["URN"]["output"];
  /** The xsell bar */
  xsellBar: Maybe<XSellBar>;
};

/** Represents a SelfExcluded View */
export type SelfExcludedViewItemsArgs = {
  after: InputMaybe<Scalars["String"]["input"]>;
  first: InputMaybe<Scalars["Int"]["input"]>;
};

/** Represents a card with self exclusion information */
export type SelfExclusionCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The safer gambling connected view link */
    saferGamblingLink: Maybe<ViewLink>;
    /** The support connected view link */
    supportLink: Maybe<ViewLink>;
    text: DisplayName;
    urn: Scalars["URN"]["output"];
  };

export type SeoMetaData = {
  metaDescription: Maybe<Scalars["String"]["output"]>;
  metaTitle: Maybe<Scalars["String"]["output"]>;
};

export type SetFavouriteMarketResponse = {
  error: Maybe<Scalars["String"]["output"]>;
  result: Maybe<SetFavouriteMarketResult>;
};

export type SetFavouriteMarketResult = {
  favouriteMarketsNavigationTab: FavouriteMarketsNavigationTab;
  favouriteMarketsState: FavouriteMarketsState;
};

export type SetPieceIncident = {
  setPieceType: Maybe<SetPieceIncidentType>;
  side: Maybe<FixtureTeamSide>;
};

export enum SetPieceIncidentType {
  Corner = "CORNER",
  FreeKick = "FREE_KICK",
  GoalKick = "GOAL_KICK",
  ThrowIn = "THROW_IN",
}

/** Represents a preferences input interface */
export type SetPreferencesInput = {
  /** Represents a confirm cashout input interface */
  confirmCashoutPreference: InputMaybe<ConfirmCashoutPreferenceInput>;
  /** Represents a default product preference input interface */
  defaultProductPreference: InputMaybe<DefaultProductPreferenceInput>;
  /** Represents an exchange default mode preference input interface */
  exchangeDefaultModePreferences: InputMaybe<ExchangeDefaultModePreferencesInput>;
  /** Represents a exchange default product preference input interface */
  exchangeDefaultProductPreferences: InputMaybe<ExchangeDefaultProductPreferencesInput>;
  /** Represents a last viewed product preference input interface */
  lastViewedProductPreference: InputMaybe<LastViewedProductPreferenceInput>;
  /**
   * Represents a market tab preferences input interface
   * @deprecated Value is always sportsbook
   */
  marketTabPreferences: InputMaybe<MarketTabPreferenceInput>;
  /**
   * Represents a module layout preferences input interface
   * @deprecated Value is always coupon
   */
  moduleLayoutPreferences: InputMaybe<ModuleLayoutPreferenceInput>;
  /** Represents the single choice preferences input interface */
  preferenceSingleChoice: InputMaybe<PreferenceSingleChoiceInput>;
  /**
   * Represents a user products preferences input interface
   * @deprecated Value is not a preference anymore
   */
  userProductsPreferences: InputMaybe<UserProductsPreferencesInput>;
};

/** Represents a preferences payload interface */
export type SetPreferencesPayload = {
  /** The payload preferences errors */
  error: Maybe<Array<Maybe<Scalars["String"]["output"]>>>;
  /** The payload preferences urns */
  result: Maybe<Array<Maybe<Preference>>>;
};

/** Represents settings section */
export type SettingsSection = {
  /** The settings section text */
  text: Maybe<Scalars["String"]["output"]>;
  /** The settings section url */
  url: Maybe<Scalars["String"]["output"]>;
};

/** Represents the Settings view */
export type SettingsView = View & {
  /** The bottom bar */
  bottomBar: Maybe<BottomBar>;
  /** The view category */
  category: Maybe<ViewCategory>;
  /** The layout items on the view */
  items: ViewItemsConnection;
  /** The left side bar */
  leftSidebar: Maybe<LeftSidebar>;
  /** The regulatory data used for the regulatory header */
  regulatoryData: Maybe<RegulatoryData>;
  /**
   * The layout items on the view
   * @deprecated Use `items` cards instead
   */
  settings: Maybe<Array<SettingsSection>>;
  /** The view title */
  title: Maybe<Scalars["String"]["output"]>;
  /** The view url */
  url: Scalars["URL"]["output"];
  /** The view urn */
  urn: Scalars["URN"]["output"];
  /** The xsell bar */
  xsellBar: Maybe<XSellBar>;
};

/** Represents the Settings view */
export type SettingsViewItemsArgs = {
  after: InputMaybe<Scalars["String"]["input"]>;
  first: InputMaybe<Scalars["Int"]["input"]>;
};

/** Possible response codes for share mutation */
export enum ShareTipCode {
  AlreadyShared = "ALREADY_SHARED",
  BetNotEligible = "BET_NOT_ELIGIBLE",
  BetNotFound = "BET_NOT_FOUND",
  GeneralFailure = "GENERAL_FAILURE",
  Success = "SUCCESS",
}

/** Represents the result of a share mutation */
export type ShareTipResult = {
  /** Operation result code */
  code: ShareTipCode;
};

export type ShotIncident = {
  player: Maybe<FootballPlayer>;
  shotType: Maybe<ShotIncidentType>;
  side: Maybe<FixtureTeamSide>;
};

export enum ShotIncidentType {
  OffTarget = "OFF_TARGET",
  OffTargetBlocked = "OFF_TARGET_BLOCKED",
  Saved = "SAVED",
  SavedBlocked = "SAVED_BLOCKED",
}

/** Represents a Show Balances Preference */
export type ShowBalancesPreference = Preference & {
  /** The selected show balance preference */
  shouldShowBalances: Scalars["Boolean"]["output"];
  /** The show balance preference urn */
  urn: Scalars["URN"]["output"];
};

export type Signposting = BadgeSignposting;

export type SkyBetClubTrackerCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The external link to the loyalty club page */
    loyaltyClubUrl: Maybe<ViewLink>;
    /** The PPH Promotion containing progress information */
    promotion: Maybe<PphPromotion>;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

export type SnookerFixture = Fixture & {
  /** If the score should be display in american format */
  isAmericanFormat: Scalars["Boolean"]["output"];
  /** The fixture main market home away runner names */
  runnerNames: Maybe<FixtureRunnerNames>;
  /** Score of the fixture */
  score: Maybe<SnookerScore>;
  /** The sport event */
  sportevent: SportsEvent;
  /** The fixture urn */
  urn: Scalars["URN"]["output"];
};

/** Represents a card with a sports event fixture */
export type SnookerFixtureCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** True if it needs to show the bell icon */
    availableToSubscribe: Scalars["Boolean"]["output"];
    /** The card connected sport event fixture */
    fixture: SnookerFixtureCardFixture;
    /** The fixture red7 scoreboard URL */
    red7Scoreboard: Maybe<Red7Scoreboard>;
    /** The card connected sport event */
    sportevent: SportsEvent;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

export type SnookerFixtureCardFixture = BaseFixture | SnookerFixture;

export type SnookerScore = {
  /** Away team score */
  away: Scalars["Int"]["output"];
  /** Home team score */
  home: Scalars["Int"]["output"];
};

export type SocialBettingFeedResponse = {
  /** The list of Tips in the feed */
  tips: TipsConnection;
};

export enum SocialBettingFeedSortBy {
  LatestShared = "LATEST_SHARED",
  MostCopied = "MOST_COPIED",
  /** @deprecated No longer supported */
  MostShared = "MOST_SHARED",
  StartingSoon = "STARTING_SOON",
}

export type SocialProfile = {
  /** Avatar ID */
  avatarId: Scalars["String"]["output"];
  /** The Social Profile ID */
  id: Scalars["String"]["output"];
  /** The Social Profile Username */
  username: Scalars["String"]["output"];
};

export type SocialProfileResponse = {
  /** Whether the user can edit their social profile username */
  isUsernameEditable: Scalars["Boolean"]["output"];
  /** The user's social profile */
  profile: SocialProfile;
  /** Timestamp until which the user can edit their social profile username */
  usernameEditableUntil: Maybe<Scalars["String"]["output"]>;
};

export type SortOption = {
  availableOptions: Array<FilteredGroupSort>;
  defaultOption: Maybe<FilteredGroupSort>;
};

export enum SplashStatus {
  Ok = "OK",
  Splashed = "SPLASHED",
}

/** Represents a PPB sport */
export type Sport = {
  /** The sport name */
  name: Scalars["String"]["output"];
  /** The sport short name */
  shortName: Maybe<Scalars["String"]["output"]>;
  /** The sport id */
  sportId: Scalars["Int"]["output"];
  /** The sport urn */
  urn: Scalars["URN"]["output"];
};

/** Breadcrumb for a Sport */
export type SportBreadcrumb = {
  /** The sport view */
  sportView: SportView;
};

export type SportIcon = {
  sport: Maybe<Sport>;
};

export type SportPlayStateCadence = {
  inPlay: Scalars["Float"]["output"];
  notInPlay: Scalars["Float"]["output"];
  sportId: Maybe<Scalars["String"]["output"]>;
};

export type SportRibbonCardGroup = CardGroup &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** A flag to indicate if the card group is highlighted */
    isHighlighted: Scalars["Boolean"]["output"];
    /** The card group items */
    items: SportRibbonCardGroupItemsConnection;
    /** Indicates which visual layout FE should render for sport ribbon */
    ribbonLayout: SportRibbonLayout;
    /** The card group title */
    title: Maybe<Scalars["String"]["output"]>;
    /** The card group urn */
    urn: Scalars["URN"]["output"];
  };

export type SportRibbonCardGroupItemsArgs = {
  first: InputMaybe<Scalars["Int"]["input"]>;
};

/** Represents a SwimlaneCardGroup edge */
export type SportRibbonCardGroupItemEdge = {
  cursor: Maybe<Scalars["String"]["output"]>;
  label: Maybe<Scalars["String"]["output"]>;
  node: Card;
};

/** Represents a connection between SportRibbonCardGroup and [Card] */
export type SportRibbonCardGroupItemsConnection = {
  edges: Array<Maybe<SportRibbonCardGroupItemEdge>>;
  pageInfo: Maybe<PageInfo>;
};

export enum SportRibbonLayout {
  Primary = "PRIMARY",
  Secondary = "SECONDARY",
}

/** Represents a View related to a Sport */
export type SportView = View & {
  /** The bottom bar */
  bottomBar: Maybe<BottomBar>;
  /** The view canonical url */
  canonicalUrl: Maybe<Scalars["String"]["output"]>;
  /** The view category */
  category: Maybe<ViewCategory>;
  /** The layout items on the view */
  items: ViewItemsConnection;
  /** The left side bar */
  leftSidebar: Maybe<LeftSidebar>;
  /** The regulatory data used for the regulatory header */
  regulatoryData: Maybe<RegulatoryData>;
  /** The sport */
  sport: Sport;
  /** The view title */
  title: Maybe<Scalars["String"]["output"]>;
  /** The view url */
  url: Scalars["URL"]["output"];
  /** The view urn */
  urn: Scalars["URN"]["output"];
  /** The xsell bar */
  xsellBar: Maybe<XSellBar>;
};

/** Represents a View related to a Sport */
export type SportViewItemsArgs = {
  after: InputMaybe<Scalars["String"]["input"]>;
  autoPageSize: InputMaybe<Scalars["Boolean"]["input"]>;
  first: InputMaybe<Scalars["Int"]["input"]>;
};

/** Represents a card that provides a connection to a sport view */
export type SportViewLinkCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card connected sport */
    sport: Sport;
    /** The card urn */
    urn: Scalars["URN"]["output"];
    /** The card connected view link */
    viewLink: ViewLink;
  };

/** Represents a PPB event */
export type SportsEvent = {
  /** The event competition */
  competition: Maybe<Competition>;
  /** The event ID */
  eventId: Scalars["Int"]["output"];
  isSubscribed: Maybe<Scalars["Boolean"]["output"]>;
  /** The event name */
  name: Scalars["String"]["output"];
  /** The event open date */
  openDate: Scalars["String"]["output"];
  /** The event sport */
  sport: Sport;
  /** The event urn */
  urn: Scalars["URN"]["output"];
};

/** Represents a sportsbook bet */
export type SportsbookBet = {
  /** The Price of the bet */
  betPrice: Maybe<SportsbookOdds>;
  /** The Bet Receipt id */
  betReceiptId: Scalars["String"]["output"];
  /** The Type of bet - SGL, DBL, YAN, ACC - enum iff we can get a full list */
  betType: Scalars["String"]["output"];
  /** Bet specific bonus */
  bonus: Maybe<Scalars["Float"]["output"]>;
  /** Sportsbook Cashout quote */
  cashoutQuote: Maybe<SportsbookCashoutQuote>;
  /** The Total amount of bet in the currency of the user account, after the change in terms */
  currentSize: Scalars["Float"]["output"];
  /** The total amount of bet per line in a multiline bet */
  currentSizePerLine: Scalars["Float"]["output"];
  /** The Edges that have been applied to this bet */
  edges: Array<BetEdge>;
  /** Ghost Leg promotion details for the bet */
  ghostLegToken: Maybe<GhostLegToken>;
  /** If there is a bet in a 90 min market */
  has90MinBet: Scalars["Boolean"]["output"];
  /** The id */
  id: Scalars["String"]["output"];
  /** If it is AccaInsuranceReward */
  isAccaInsuranceReward: Scalars["Boolean"]["output"];
  /** Is the bet EachWay */
  isEachWay: Scalars["Boolean"]["output"];
  /** Indicates if the bet has been placed with lotteries change in terms */
  isLotteries: Maybe<Scalars["Boolean"]["output"]>;
  /** If it is MoneyBackReward */
  isMoneyBackReward: Scalars["Boolean"]["output"];
  /** Indicates if the bet has been placed with a price boost change in terms */
  isOddsBoosted: Scalars["Boolean"]["output"];
  /** If it is BOOSTED_BET */
  isPBM: Scalars["Boolean"]["output"];
  /** If it has at least one BOOSTED_LEG */
  isPBS: Scalars["Boolean"]["output"];
  /** If it is a same game multiple or not */
  isSGM: Scalars["Boolean"]["output"];
  /** If it is a multi same game multiple or not */
  isSGMMulti: Scalars["Boolean"]["output"];
  /** Is the bet settled */
  isSettled: Scalars["Boolean"]["output"];
  /** The bet legs array */
  legs: Array<BetLeg>;
  /** The first event to start that composes the bet */
  lowestEventStartTime: Maybe<Scalars["String"]["output"]>;
  /** Bet mutation eligibility data */
  mutations: Maybe<BetMutation>;
  /** Number of lines in bet */
  numLines: Scalars["Int"]["output"];
  /** The original price of the bet */
  originalBetPrice: Maybe<SportsbookOdds>;
  /** Original potential winnings in the currency of the user account */
  originalPotentialWin: Maybe<Scalars["Float"]["output"]>;
  /** Potential Winnings for eachway bets with a placed result in the currency of the user account */
  potentialWinForPlace: Maybe<Scalars["Float"]["output"]>;
  /** The product of the bet */
  product: Maybe<Scalars["String"]["output"]>;
  /** Winnings or Potential Winnings in the currency of the user account */
  profitAndLoss: Maybe<Scalars["Float"]["output"]>;
  /** Bet result */
  result: Maybe<ResultEnum>;
  /** Bet result type */
  resultType: Maybe<ResultTypeEnum>;
  /** The sportsbook bet urn */
  urn: Scalars["URN"]["output"];
};

/** Represents a card that holds information of a sportsbook bet */
export type SportsbookBetCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The corresponding sportsbook bet */
    bet: SportsbookBet;
    /** The view link to the Bet Sharing view */
    betSharingViewLink: Maybe<ViewLink>;
    /** The navigation links for event, competition or meeting */
    navigationLinks: Array<NavigationLinkLevel>;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a sportsbook bet info card */
export type SportsbookBetInfoCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The Bet Receipt id */
    betReceiptId: Scalars["String"]["output"];
    /** The device used to place the bet */
    deviceId: Maybe<Scalars["String"]["output"]>;
    /** Date/Time Bet was placed at */
    placedDate: Scalars["String"]["output"];
    /** The product */
    product: Maybe<Scalars["String"]["output"]>;
    /** Bet Id provided by the regulator only available when appropriate. E.g. Sogei bet id for Italy regulated markets. */
    regulatorBetId: Maybe<Scalars["String"]["output"]>;
    /** The bet selections */
    selections: Maybe<Array<SportsbookBetInfoSelections>>;
    /** Date/Time bet was cleared (settled) */
    settledDate: Maybe<Scalars["String"]["output"]>;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

export type SportsbookBetInfoSelections = {
  marketUrn: Scalars["URN"]["output"];
  runnerUrn: Scalars["URN"]["output"];
};

/** Represents a Sportsbook Bet Leg Card Group */
export type SportsbookBetLegCardGroup = CardGroup &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The layout items */
    items: SportsbookBetLegCardGroupConnection;
    /** The card group urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a connection between View and [SportsbookBetLegCardGroup] */
export type SportsbookBetLegCardGroupConnection = {
  edges: Array<Maybe<SportsbookBetLegCardGroupEdge>>;
};

/** Represents a SportsbookBetLegCardGroup edge */
export type SportsbookBetLegCardGroupEdge = {
  node: SportsbookBetLegCardGroupItems;
};

/**
 * Represents SportsbookBetLegCardGroup allowed edge Items
 *
 * StatsPebbleCardGroup is @deprecated in my bets, use the StatsSupportingContentButtonsCardGroup instead
 */
export type SportsbookBetLegCardGroupItems =
  | BetLegCard
  | EventHeaderCard
  | FixtureCard
  | RaceDetailsCard
  | StatsPebbleCardGroup
  | StatsSupportingContentButtonsCardGroup;

/** Represents a sportsbook cashout quote */
export type SportsbookCashoutQuote = {
  /** The cashout quote bet delay */
  betDelay: Maybe<Scalars["Int"]["output"]>;
  /** The cashout quote sportsbook bet urn */
  betUrn: Scalars["URN"]["output"];
  /** The cashout quote token */
  cashOutToken: Maybe<Scalars["String"]["output"]>;
  /** The cashout quote value */
  quote: Maybe<Scalars["Float"]["output"]>;
  /** The cashout quote refresh rate */
  refreshRate: Maybe<Scalars["Int"]["output"]>;
  /** The cashout quote stake */
  stake: Maybe<Scalars["Float"]["output"]>;
  /** The cashout quote status */
  status: SportsbookCashoutQuoteStatus;
  /** The cashout quote urn */
  urn: Scalars["URN"]["output"];
};

/** Represents a sportsbook cashout quote status */
export enum SportsbookCashoutQuoteStatus {
  /** Cashout Quote Available */
  Available = "AVAILABLE",
  /** Cashout Quote's Bet Closed */
  BetClosed = "BET_CLOSED",
  /** Cashout quote not available for inplay markets */
  InplayMarketNotEligible = "INPLAY_MARKET_NOT_ELIGIBLE",
  /** Cashout quote's leg result pending */
  LegResultPending = "LEG_RESULT_PENDING",
  /** Cashout Quote not eligible */
  NotEligible = "NOT_ELIGIBLE",
  /** Cashout quote pending */
  PendingCashout = "PENDING_CASHOUT",
  /** Cashout Quote too low */
  QuoteTooLow = "QUOTE_TOO_LOW",
  /** Cashout free bet quote too low */
  QuoteTooLowFreeBet = "QUOTE_TOO_LOW_FREE_BET",
  /** Cashout Quote suspended */
  Suspended = "SUSPENDED",
  /** Cashout Quote Unavailable */
  Unavailable = "UNAVAILABLE",
}

export type SportsbookChatBotBetSuggestionPart = {
  odds: Maybe<SportsbookOdds>;
  selections: Array<SportsbookChatBotBetSuggestionSelection>;
};

export type SportsbookChatBotBetSuggestionSelection = {
  footballFixture: Maybe<FootballFixture>;
  market: SportsbookMarket;
  participant: Maybe<SportsbookChatBotParticipant>;
  runner: Runner;
};

export type SportsbookChatBotContext = {
  eventId: Maybe<Scalars["String"]["output"]>;
  eventName: Maybe<Scalars["String"]["output"]>;
};

export type SportsbookChatBotContextInput = {
  eventId: InputMaybe<Scalars["String"]["input"]>;
  eventName: InputMaybe<Scalars["String"]["input"]>;
};

export type SportsbookChatBotHistory = {
  chatId: Scalars["ID"]["output"];
  messages: Array<SportsbookChatBotMessage>;
};

export type SportsbookChatBotMessage = {
  feedbackSubmitted: Scalars["Boolean"]["output"];
  isHistoryMessage: Scalars["Boolean"]["output"];
  parts: Maybe<Array<Maybe<SportsbookChatBotMessagePart>>>;
  role: SportsbookChatBotMessageRole;
  status: SportsbookChatBotMessageStatus;
  urn: Scalars["URN"]["output"];
};

export type SportsbookChatBotMessagePart =
  | SportsbookChatBotBetSuggestionPart
  | SportsbookChatBotParticipantStatsPart
  | SportsbookChatBotParticipantStatsRankingPart
  | SportsbookChatBotStatsComparisonPart
  | SportsbookChatBotSwimlanePart
  | SportsbookChatBotTextPart;

export enum SportsbookChatBotMessageRole {
  Assistant = "ASSISTANT",
  User = "USER",
}

export enum SportsbookChatBotMessageStatus {
  Complete = "COMPLETE",
  Error = "ERROR",
  Pending = "PENDING",
}

export type SportsbookChatBotParticipant = FootballPlayerFixtureContext | FootballTeam;

export type SportsbookChatBotParticipantStatsPart = {
  participant: SportsbookChatBotParticipant;
  stats: Array<SportsbookChatBotStatEntry>;
};

export type SportsbookChatBotParticipantStatsRankingItem = {
  participant: SportsbookChatBotParticipant;
  value: Scalars["Float"]["output"];
};

export type SportsbookChatBotParticipantStatsRankingPart = {
  ranking: Array<SportsbookChatBotParticipantStatsRankingItem>;
  statName: Scalars["String"]["output"];
};

export type SportsbookChatBotSendMessageInput = {
  chatId: Scalars["ID"]["input"];
  context: SportsbookChatBotContextInput;
  message: Scalars["String"]["input"];
};

export type SportsbookChatBotSendMessageResponse = {
  messageUrn: Scalars["URN"]["output"];
  status: SportsbookChatBotMessageStatus;
};

export type SportsbookChatBotStatEntry = {
  key: Scalars["String"]["output"];
  value: Scalars["String"]["output"];
};

export type SportsbookChatBotStatsComparisonItem = {
  participantAValue: Scalars["String"]["output"];
  participantBValue: Scalars["String"]["output"];
  statName: Scalars["String"]["output"];
};

export type SportsbookChatBotStatsComparisonPart = {
  participantA: SportsbookChatBotParticipant;
  participantB: SportsbookChatBotParticipant;
  stats: Array<SportsbookChatBotStatsComparisonItem>;
};

export type SportsbookChatBotSwimlanePart = {
  items: Array<SportsbookChatBotMessagePart>;
};

export type SportsbookChatBotTextPart = {
  text: Scalars["String"]["output"];
};

export type SportsbookChatbotCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The context to be used when sending messages from this card */
    chatContext: SportsbookChatBotContext;
    /** The chat id that will be used on this card */
    chatId: Scalars["String"]["output"];
    chatState: Maybe<Scalars["String"]["output"]>;
    /** The display window offset */
    displayWindowOffset: Maybe<Scalars["Float"]["output"]>;
    /** The chat end date from the SCA event start date */
    endDate: Maybe<Scalars["String"]["output"]>;
    /** The description to display in the chat */
    infoDescription: Maybe<DisplayName>;
    /** The title to display in the chat */
    infoTitle: Maybe<DisplayName>;
    /** The chat start date based on the SCA event start date and display window offset */
    startDate: Maybe<Scalars["String"]["output"]>;
    /** The starting prompts shown before the chat begins */
    startingPrompts: Array<DisplayName>;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a Sportsbook Expandable Leg Card Group */
export type SportsbookExpandableLegCardGroup = CardGroup &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** Is the bet panel open by default */
    isBetPanelOpen: Scalars["Boolean"]["output"];
    /** The layout items */
    items: SportsbookExpandableLegCardGroupConnection;
    /** The card group urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a connection between View and [SportsbookExpandableLegCardGroup] */
export type SportsbookExpandableLegCardGroupConnection = {
  edges: Array<Maybe<SportsbookExpandableLegCardGroupEdge>>;
};

/** Represents a SportsbookExpandableLegCardGroupConnection edge */
export type SportsbookExpandableLegCardGroupEdge = {
  node: SportsbookExpandableLegCardGroupItems;
};

/** Represents MarketBetCardGroup allowed edge Items */
export type SportsbookExpandableLegCardGroupItems =
  | SportsbookBetInfoCard
  | SportsbookBetLegCardGroup
  | SportsbookLotteriesBetLegCardGroup;

/** Represents a Sportsbook Bet Leg Card Group for Lotteries */
export type SportsbookLotteriesBetLegCardGroup = CardGroup &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The layout items */
    items: SportsbookLotteriesBetLegCardGroupConnection;
    /** The card group urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a connection between View and [SportsbookLotteriesBetLegCardGroup] */
export type SportsbookLotteriesBetLegCardGroupConnection = {
  edges: Array<Maybe<SportsbookLotteriesBetLegCardGroupEdge>>;
};

/** Represents a SportsbookLotteriesBetLegCardGroup edge */
export type SportsbookLotteriesBetLegCardGroupEdge = {
  node: SportsbookLotteriesBetLegCardGroupItems;
};

/** Represents SportsbookLotteriesBetLegCardGroup allowed edge Items */
export type SportsbookLotteriesBetLegCardGroupItems = BetLegCard | EventHeaderCard;

/** Represents a PPB sportsbook market */
export type SportsbookMarket = {
  /** The market betting type */
  bettingType: Scalars["String"]["output"];
  /** True if a market is Betfair Starting Price (BSP) */
  bspMarket: Scalars["Boolean"]["output"];
  /** If eachway is available */
  eachwayAvailable: Scalars["Boolean"]["output"];
  /** The context that might include competition, event, meeting, race */
  hierarchy: MarketHierarchy;
  /** True if the market is inplay */
  inplay: Scalars["Boolean"]["output"];
  /** True if the market is freezable */
  isAccaFreezeEligible: Maybe<Scalars["Boolean"]["output"]>;
  /** True if the market is automatic eachWay market type */
  isAutomaticEachWayMarketType: Maybe<Scalars["Boolean"]["output"]>;
  /** True if the market is oddsboost */
  isOddsboostMarketType: Maybe<Scalars["Boolean"]["output"]>;
  /** Indicates whether the market is eligible for super sub */
  isSuperSub: Maybe<Scalars["Boolean"]["output"]>;
  /**
   * The market live information
   * @deprecated Use the fields on this type instead
   */
  liveData: Maybe<SportsbookMarketLiveData>;
  /** The market status */
  marketStatus: SportsbookMarketStatus;
  /** The market market type */
  marketType: Scalars["String"]["output"];
  /** The market localized type name */
  marketTypeName: Maybe<Scalars["String"]["output"]>;
  /** The market name */
  name: Scalars["String"]["output"];
  /** The market number of active runners */
  numberOfActiveRunners: Maybe<Scalars["Int"]["output"]>;
  /** The number of places available in the place part of an eachway bet */
  numberOfPlaces: Maybe<Scalars["Int"]["output"]>;
  /** The market number of runners */
  numberOfRunners: Maybe<Scalars["Int"]["output"]>;
  /** The fractional odds at which the place part of an eachway bet is offered */
  placeFraction: Maybe<FractionalOdds>;
  /**
   * The market runners
   * @deprecated Use sportsbookRunners instead
   */
  runners: Array<Runner>;
  /** The market sport */
  sport: Sport;
  /** The market runners */
  sportsbookRunners: Array<SportsbookRunner>;
  /** True if a market turns 'in play' at a kick off time, otherwise it is false */
  turnInPlayEnabled: Scalars["Boolean"]["output"];
  /** The market urn */
  urn: Scalars["URN"]["output"];
};

export type SportsbookMarketLiveData = {
  /** True if a market is Betfair Starting Price (BSP) */
  bspMarket: Scalars["Boolean"]["output"];
  /** If eachway is available */
  eachwayAvailable: Scalars["Boolean"]["output"];
  /** True if the market is inplay */
  inplay: Scalars["Boolean"]["output"];
  /** The market runners live data */
  runners: Array<Maybe<SportsbookRunnerLiveData>>;
  /** The market status */
  sportsbookMarketStatus: SportsbookMarketStatus;
  /** True if a market turns 'in play' at a kick off time, otherwise it is false */
  turnInPlayEnabled: Scalars["Boolean"]["output"];
  /** The live data market urn */
  urn: Scalars["URN"]["output"];
};

/** Possible values for an sportsbook market status */
export enum SportsbookMarketStatus {
  /** An open market */
  Open = "OPEN",
  /** A suspended market */
  Suspended = "SUSPENDED",
}

/** Represents a sportsbook betting odds */
export type SportsbookOdds = {
  /** The odd in the American format */
  american: Maybe<Scalars["Int"]["output"]>;
  /** The odd decimal value */
  decimal: Scalars["Float"]["output"];
  /** The odd fractional value */
  fractional: Maybe<FractionalOdds>;
};

/** Represents an Sportsbook Odds Display Preference */
export type SportsbookOddsDisplayPreference = Preference & {
  /** The selected odds display format */
  selectedOddsDisplayFormat: OddsDisplayFormat;
  /** The sportsbook odds display preference urn */
  urn: Scalars["URN"]["output"];
};

/** Represents a Sportsbook runner */
export type SportsbookRunner = {
  /** The runner display odds */
  displayOdds: Maybe<SportsbookOdds>;
  /** The runner handicap */
  handicap: Scalars["Float"]["output"];
  /** The sportsbook market this runner belongs to */
  market: SportsbookMarket;
  /** The runner name */
  name: Scalars["String"]["output"];
  /** The runner odds */
  odds: Maybe<SportsbookOdds>;
  /**
   * The real-world entity this runner's bet selection is bound to (horse + jockey
   * pair, greyhound, player, ...). Null when the selection has no real-world
   * participant (e.g. "Draw", "No Goalscorer", "Unnamed Favourite #1") or when the
   * market type does not yet have a participant kind defined.
   *
   * Heavy sub-fields (e.g. `... on RaceRunner { horse { pastPerformances { ... } } }`)
   * are only fetched when selected, so the FE can pull light fields on the card
   * and lazy-fetch heavy fields on expand.
   */
  participant: Maybe<RunnerParticipant>;
  /** The runner participant id */
  participantId: Maybe<Scalars["String"]["output"]>;
  /** The runner price history */
  previousOdds: Maybe<Array<Maybe<PreviousSportsbookOdds>>>;
  /** The runner result type */
  resultType: Maybe<Scalars["String"]["output"]>;
  /** The runner scope */
  runnerScope: Maybe<SportsbookRunnerScope>;
  /** The runner status */
  runnerStatus: SportsbookRunnerStatus;
  /** The runner selection id */
  selectionId: Scalars["Int"]["output"];
  /** The runner urn */
  urn: Scalars["URN"]["output"];
};

/** Represents a Sportsbook runner */
export type SportsbookRunnerPreviousOddsArgs = {
  limit: InputMaybe<Scalars["Int"]["input"]>;
};

/**
 * Wraps a sportsbook runner inside a card's curated runner view.
 * Existed as a structural wrapper to allow additive view-side fields without
 * breaking the schema.
 */
export type SportsbookRunnerDisplayItem = {
  runner: SportsbookRunner;
};

/** Represents a sportsbook runner volatile information */
export type SportsbookRunnerLiveData = {
  /** The runner display odds */
  displayOdds: Maybe<SportsbookOdds>;
  /** The runner handicap */
  handicap: Scalars["Float"]["output"];
  isPotentialBet: Maybe<Scalars["Boolean"]["output"]>;
  /** The market urn */
  marketURN: Scalars["URN"]["output"];
  /** The runner odds */
  odds: Maybe<SportsbookOdds>;
  /** The runner price history */
  previousOdds: Maybe<Array<Maybe<PreviousSportsbookOdds>>>;
  /** The runner scope */
  runnerScope: Maybe<SportsbookRunnerScope>;
  /** The runner status */
  runnerStatus: SportsbookRunnerStatus;
  /** The Sportsbook runner data urn */
  runnerURN: Scalars["URN"]["output"];
  /** The runner selection id */
  selectionId: Scalars["Int"]["output"];
  /** The Sportsbook runner live data urn */
  urn: Scalars["URN"]["output"];
};

/** Represents a sportsbook runner volatile information */
export type SportsbookRunnerLiveDataPreviousOddsArgs = {
  limit: InputMaybe<Scalars["Int"]["input"]>;
};

export enum SportsbookRunnerScope {
  All = "ALL",
  Inplay = "INPLAY",
  Preplay = "PREPLAY",
}

export enum SportsbookRunnerStatus {
  Active = "ACTIVE",
  Removed = "REMOVED",
  Suspended = "SUSPENDED",
}

/**
 * Curated, content-operator-defined view of a sportsbook market's runners on a card.
 *
 * The original Market entity keeps its runner list unmodified (native count and order).
 * `runners` returns the full curated list by default; pass `applyDisplayLimit: true` to
 * receive only the first `displayLimit` items (opt-in lean payload for surfaces that never expand).
 * The FE is expected to truncate to `displayLimit` for the collapsed view and own its
 * Apollo cache merge strategy if it wants to model collapse/expand as two cache slots.
 */
export type SportsbookRunnersDisplay = {
  /**
   * Operator-configured cap on how many items the card renders in its collapsed state.
   * Informational: the FE uses this to truncate the runner list and render "N of M" affordances.
   * Null = no cap (render all).
   */
  displayLimit: Maybe<Scalars["Int"]["output"]>;
  /** Original sportsbook market — runner list and order untouched. */
  market: SportsbookMarket;
  /**
   * Curated runner list in the operator-defined / sort-service order.
   *
   * Default (no argument): returns the FULL curated list. The FE truncates to
   * `displayLimit` for the collapsed view.
   *
   * Pass `applyDisplayLimit: true` to receive only the first `displayLimit` items —
   * useful for surfaces that display the card in collapsed state only and want a lean payload.
   * When `displayLimit` is null, this argument has no effect and all items are returned.
   */
  runners: Array<SportsbookRunnerDisplayItem>;
  /**
   * Total number of curated runners, regardless of which `runners` variant was queried.
   * Use this to decide whether to show a Show More chevron when `applyDisplayLimit: true`
   * is passed — in that case `runners` only returns `displayLimit` items and the FE cannot
   * infer the total from `runners.length` alone. Also useful for "Showing N of M" affordances.
   */
  totalCount: Scalars["Int"]["output"];
};

/**
 * Curated, content-operator-defined view of a sportsbook market's runners on a card.
 *
 * The original Market entity keeps its runner list unmodified (native count and order).
 * `runners` returns the full curated list by default; pass `applyDisplayLimit: true` to
 * receive only the first `displayLimit` items (opt-in lean payload for surfaces that never expand).
 * The FE is expected to truncate to `displayLimit` for the collapsed view and own its
 * Apollo cache merge strategy if it wants to model collapse/expand as two cache slots.
 */
export type SportsbookRunnersDisplayRunnersArgs = {
  applyDisplayLimit?: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type SquadBetQuotesRequestInput = {
  eventId: EventIdInput;
  incidentTypeId: Scalars["String"]["input"];
  participantIds: Array<Scalars["String"]["input"]>;
  quantifier: Scalars["String"]["input"];
  timePeriodId: Scalars["String"]["input"];
  valuesRange: NumericRange;
};

export type SquadBetQuotesResponse = {
  defaultOutcomeIndex: Scalars["Int"]["output"];
  legs: Array<ObbLeg>;
};

export type StandingRank = {
  position: Maybe<Scalars["Int"]["output"]>;
};

export type StandingTeam = {
  name: Maybe<Scalars["String"]["output"]>;
};

export type StatisticsItemEdge = {
  cursor: Maybe<Scalars["String"]["output"]>;
  isHighlighted: Scalars["Boolean"]["output"];
  node: Card;
};

/** Represents a card with a football broadcasts information */
export type StatsBroadcastsCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    broadcasts: Broadcasts;
    sport: Sport;
    urn: Scalars["URN"]["output"];
  };

export type StatsBroadcastsItemEdge = {
  displayName: Maybe<DisplayNameTranslationKey>;
  node: StatsBroadcastsCard;
  type: Maybe<Scalars["String"]["output"]>;
};

/** Represents a Card Group that will return a Stats Content */
export type StatsContentCardGroup = CardGroup &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    items: StatsContentItemsConnection;
    selectedTab: Maybe<SelectedTab>;
    sportEvent: SportsEvent;
    status: Maybe<FootballPeriodStatus>;
    /** The card group urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a Card Group that will return a Stats Content */
export type StatsContentCardGroupItemsArgs = {
  first: InputMaybe<Scalars["Int"]["input"]>;
};

export type StatsContentCardGroupItemEdge =
  | StatsBroadcastsItemEdge
  | StatsLineupsItemEdge
  | StatsMatchStatsItemEdge
  | StatsPebbleItemEdge
  | StatsPlayersInPlayItemEdge
  | StatsTableItemEdge;

export type StatsContentItemsConnection = {
  edges: Array<Maybe<StatsContentCardGroupItemEdge>>;
  pageInfo: Maybe<PageInfo>;
};

/** Represents a card with a football form stats information */
export type StatsFormCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /**
     * The away team information
     * @deprecated Not being used
     */
    away: Maybe<FootballTeamDetails>;
    /** The card connected sport event fixture */
    fixture: FootballFixture;
    /**
     * The home team information
     * @deprecated Not being used
     */
    home: Maybe<FootballTeamDetails>;
    /**
     * The recentForm stats data
     * @deprecated Not being used
     */
    recentForm: Maybe<FootballFixtureForm>;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a card with a football stats information */
export type StatsGoalsAndShotsCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card connected sport event fixture */
    fixture: FootballFixture;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a card with a football head to head stats information */
export type StatsHeadToHeadCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card connected sport event fixture */
    fixture: FootballFixture;
    /**
     * The head to head stats data
     * @deprecated Not being used
     */
    head2head: Maybe<FootballFixtureForm>;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a card with a football lineups stats information */
export type StatsLineupsCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card connected sport event fixture */
    fixture: FootballFixture;
    /** The view links to all players */
    footballPlayerViewLinks: Maybe<Array<FootballPlayerViewLink>>;
    /** If there is formation info to show the new lineup view */
    hasFormationInfo: Scalars["Boolean"]["output"];
    /** The card connected sport event */
    sportEvent: SportsEvent;
    /** The match status */
    status: Maybe<FootballPeriodStatus>;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

export type StatsLineupsItemEdge = {
  displayName: Maybe<DisplayNameTranslationKey>;
  node: StatsLineupsCard;
  type: Maybe<Scalars["String"]["output"]>;
};

/** Represents a card with a sports event fixture match stats information */
export type StatsMatchStatsCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card connected sport event fixture */
    fixture: FootballFixture;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

export type StatsMatchStatsItemEdge = {
  displayName: Maybe<DisplayNameTranslationKey>;
  node: StatsMatchStatsCard;
  type: Maybe<Scalars["String"]["output"]>;
};

/** Represents a Card Group that will return a pebble with stats */
export type StatsPebbleCardGroup = CardGroup &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    items: PebbleLayoutItemsConnection;
    /** @deprecated Not being used */
    selectedItemUrn: Scalars["URN"]["output"];
    selectedPebble: Maybe<SelectedPebble>;
    sportEvent: SportsEvent;
    status: Maybe<FootballPeriodStatus>;
    /** The card group urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a Card Group that will return a pebble with stats */
export type StatsPebbleCardGroupItemsArgs = {
  first: InputMaybe<Scalars["Int"]["input"]>;
  selectedOnly: InputMaybe<Scalars["Boolean"]["input"]>;
};

export type StatsPebbleItemEdge = {
  cursor: Maybe<Scalars["String"]["output"]>;
  displayName: Maybe<DisplayNameTranslationKey>;
  node: StatsPebbleCardGroup;
  type: Maybe<Scalars["String"]["output"]>;
};

/** Represents a card with a football players in play stats information */
export type StatsPlayersInPlayCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card connected sport event fixture */
    fixture: FootballFixture;
    /** The view links to all players */
    footballPlayerViewLinks: Maybe<Array<FootballPlayerViewLink>>;
    /** The card connected sport event */
    sportEvent: SportsEvent;
    /** The Opta football statistics definitions view link */
    termsAndConditionsLink: Maybe<ViewLink>;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

export type StatsPlayersInPlayItemEdge = {
  displayName: Maybe<DisplayNameTranslationKey>;
  node: StatsPlayersInPlayCard;
  type: Maybe<Scalars["String"]["output"]>;
};

/** Represents a card with a football stats information */
export type StatsPlayersSeasonStatsCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card connected sport event fixture */
    fixture: FootballFixture;
    /** The view links to all players */
    footballPlayerViewLinks: Maybe<Array<FootballPlayerViewLink>>;
    /** The card connected sport event */
    sportEvent: SportsEvent;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a card with a football broadcasts information */
export type StatsRaceResultsCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    runners: Array<StatsRaceResultsRunner>;
    urn: Scalars["URN"]["output"];
  };

export type StatsRaceResultsHorse = {
  name: Scalars["String"]["output"];
  performance: Maybe<StatsRaceResultsHorsePerformance>;
};

export type StatsRaceResultsHorsePerformance = {
  positionOfficial: Maybe<Scalars["Int"]["output"]>;
  positionStatusCode: Maybe<Scalars["String"]["output"]>;
};

/** Represents a horse race runner for the Race Results Card */
export type StatsRaceResultsRunner = {
  /** The race runner's details */
  details: Maybe<RunnerDetails>;
  /** The race runner's horse details */
  horse: StatsRaceResultsHorse;
  /** Boolean indicating if the runner is the selected one */
  isBetSelection: Scalars["Boolean"]["output"];
};

export type StatsSupportingContentButtonsCardEdge = {
  cursor: Maybe<Scalars["String"]["output"]>;
  displayName: Maybe<DisplayName>;
  node: StatsSupportingContentButtonsItem;
};

/** Represents a Card Group that will return selectable buttons with stats */
export type StatsSupportingContentButtonsCardGroup = CardGroup &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    items: StatsSupportingContentButtonsLayoutItemsConnection;
    /** The card group urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a Card Group that will return selectable buttons with stats */
export type StatsSupportingContentButtonsCardGroupItemsArgs = {
  first: InputMaybe<Scalars["Int"]["input"]>;
};

export type StatsSupportingContentButtonsItem =
  | IncidentsCard
  | StatsBroadcastsCard
  | StatsMatchStatsCard
  | StatsRaceResultsCard;

export type StatsSupportingContentButtonsLayoutItemsConnection = {
  edges: Array<Maybe<StatsSupportingContentButtonsCardEdge>>;
  pageInfo: Maybe<PageInfo>;
};

/** Represents a card with a competition table stats information */
export type StatsTableCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card connected sport event fixture */
    fixture: FootballFixture;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

export type StatsTableItemEdge = {
  displayName: Maybe<DisplayNameTranslationKey>;
  node: StatsTableCard;
  type: Maybe<Scalars["String"]["output"]>;
};

/** Represents a card with a football team stats information */
export type StatsTeamsCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card connected sport event fixture */
    fixture: FootballFixture;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

export type StatsThresholdDefinition = {
  /** Comparison */
  comparison: Maybe<ComparisonEnum>;
  /** Threshold */
  threshold: Scalars["Float"]["output"];
};

export type SubstitutionIncident = {
  playerIn: Maybe<FootballPlayer>;
  playerOut: Maybe<FootballPlayer>;
  side: Maybe<FixtureTeamSide>;
};

/** Represents a SupplementaryInfo label. Can have a link */
export type SupplementaryInfo = {
  label: DisplayName;
  viewLink: Maybe<ViewLink>;
};

export enum Supplier {
  Sportex = "SPORTEX",
}

/** Represents a collection of cards with a common context */
export type SwimlaneCardGroup = CardGroup &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card group display Name for translations */
    displayName: Maybe<DisplayNameTranslationKey>;
    items: SwimlaneCardGroupItemsConnection;
    /** The card group title */
    title: Maybe<Scalars["String"]["output"]>;
    /** The card group urn */
    urn: Scalars["URN"]["output"];
    /** The card group view all */
    viewAll: Maybe<GroupViewAll>;
  };

/** Represents a collection of cards with a common context */
export type SwimlaneCardGroupItemsArgs = {
  first: InputMaybe<Scalars["Int"]["input"]>;
};

/** Represents a SwimlaneCardGroup edge */
export type SwimlaneCardGroupItemEdge = {
  cursor: Maybe<Scalars["String"]["output"]>;
  node: Card;
};

/** Represents a connection between SwimlaneCardGroup and [Card] */
export type SwimlaneCardGroupItemsConnection = {
  edges: Array<Maybe<SwimlaneCardGroupItemEdge>>;
  pageInfo: Maybe<PageInfo>;
};

/** Possible swimlane card group layouts */
export enum SwimlaneCardGroupLayout {
  /** Card List Layout */
  CardList = "CARD_LIST",
  /** Coupon Layout */
  Coupon = "COUPON",
  /** Grid Four Columns */
  GridFourColumns = "GRID_FOUR_COLUMNS",
  /** Grid Two Columns */
  GridTwoColumns = "GRID_TWO_COLUMNS",
}

export type SwimlaneIndexedCardGroup = CardGroup &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card group display Name for translations */
    displayName: Maybe<DisplayNameTranslationKey>;
    /** A specific item index that should be highlighted */
    highlightedIndex: Maybe<Scalars["Int"]["output"]>;
    /** A specific item index hint */
    hint: Maybe<Scalars["Int"]["output"]>;
    /** The card group icon */
    icon: Maybe<Image>;
    /** The card group items */
    items: SwimlaneIndexedCardGroupItemsConnection;
    /** The card group title */
    title: Maybe<Scalars["String"]["output"]>;
    /** The card group urn */
    urn: Scalars["URN"]["output"];
    /** The card group view all */
    viewAll: Maybe<GroupViewAll>;
  };

/** Represents a SwimlaneIndexedCardGroup edge */
export type SwimlaneIndexedCardGroupItemEdge = {
  node: Card;
};

/** Represents a connection between SwimlaneIndexedCardGroup and [Card] */
export type SwimlaneIndexedCardGroupItemsConnection = {
  edges: Array<Maybe<SwimlaneIndexedCardGroupItemEdge>>;
};

export type TabLink = {
  /** The Button icon */
  icon: Maybe<PackIcon>;
  /** The button label */
  label: Scalars["String"]["output"];
  /** The tab link */
  tabViewLink: ViewLink;
};

export type TableTennisFixture = Fixture & {
  /** Current Set Information */
  currentSet: Maybe<TableTennisSet>;
  /** If the score should be display in american format */
  isAmericanFormat: Scalars["Boolean"]["output"];
  /** Ordered set information (from recent to least recent) */
  previousSets: Maybe<Array<Maybe<TableTennisSet>>>;
  /** The fixture main market home away runner names */
  runnerNames: Maybe<FixtureRunnerNames>;
  /** Number of sets each player has won in this match */
  setsWon: Maybe<TableTennisScore>;
  /** The sport event */
  sportevent: SportsEvent;
  /** The fixture urn */
  urn: Scalars["URN"]["output"];
};

export type TableTennisScore = {
  /** Away team score */
  away: Scalars["Int"]["output"];
  /** Home team score */
  home: Scalars["Int"]["output"];
};

export type TableTennisSet = {
  /** Current Server (only for current set) */
  currentServer: Maybe<TeamSide>;
  /** Number of the set */
  number: Scalars["Int"]["output"];
  /** Score of the set */
  score: TableTennisScore;
};

/** Represents a card with a sports event fixture team form information */
export type TeamFormCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card connected sport event fixture */
    fixture: FootballFixture;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/** Represents a card with a sports event fixture team lineup information */
export type TeamLineupCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card connected sport event fixture */
    fixture: FootballFixture;
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

export enum TeamSide {
  Away = "AWAY",
  Both = "BOTH",
  Home = "HOME",
}

export type TennisGame = {
  /** The number of the game */
  number: Scalars["Int"]["output"];
  /** The number of the point */
  pointNumber: Maybe<Scalars["Int"]["output"]>;
  /** The current point winner */
  pointWinner: Maybe<TeamSide>;
  /** The current serve number */
  serveNumber: Maybe<Scalars["Int"]["output"]>;
  /** The game score for team A */
  teamAScore: Scalars["String"]["output"];
  /** The game score for team B */
  teamBScore: Scalars["String"]["output"];
  /** The participant that serves the current point */
  teamServing: Maybe<TeamSide>;
  /** The type of the game - normal game or tiebreak */
  type: TennisGameType;
};

export type TennisGameStats = {
  /** The number of aces */
  aces: Scalars["Int"]["output"];
  /** The percentage of break point conversions won */
  breakPointConversionPoints: Scalars["Int"]["output"];
  /** The number of double faults */
  doubleFaults: Scalars["Int"]["output"];
  /** The percentage of first serves won */
  firstServes: Scalars["Int"]["output"];
  /** The number of first service return points won */
  firstServiceReturnPointsWon: Scalars["Int"]["output"];
  /** The number of first services won */
  firstServicesWon: Scalars["Int"]["output"];
  /** The number of second service return points won */
  secondServiceReturnPointsWon: Scalars["Int"]["output"];
  /** The number of second services won */
  secondServicesWon: Scalars["Int"]["output"];
  /** The number of total service return points won */
  totalServiceReturnPointsWon: Scalars["Int"]["output"];
  /** The number of total services won */
  totalServicesWon: Scalars["Int"]["output"];
};

export enum TennisGameType {
  Normal = "NORMAL",
  Tiebreak = "TIEBREAK",
}

export type TennisMatch = Fixture & {
  /** The start time of the match */
  actualStartTime: Maybe<Scalars["String"]["output"]>;
  /** The current set being played */
  currentSet: Maybe<TennisSet>;
  /** The elapsed time since the beginning of the match */
  duration: Maybe<Scalars["Int"]["output"]>;
  /** The match gender */
  gender: Maybe<TennisMatchGender>;
  /** If the score should be display in american format */
  isAmericanFormat: Scalars["Boolean"]["output"];
  /** The number of sets for this match (1,3,5) */
  numberOfSets: Maybe<Scalars["Int"]["output"]>;
  /** The ordered set information (from recent to least recent) */
  previousSets: Maybe<Array<Maybe<TennisSet>>>;
  /** The fixture main market home away runner names */
  runnerNames: Maybe<FixtureRunnerNames>;
  /** The scheduled start time */
  scheduledStartTime: Scalars["String"]["output"];
  /** The sport event */
  sportevent: SportsEvent;
  /** The match statistics */
  stats: Maybe<TennisStats>;
  /** The status of the current match */
  status: Maybe<TennisMatchStatus>;
  /** The surface of the match */
  surface: Maybe<TennisSurface>;
  /** The players for team A */
  teamA: Maybe<TennisTeam>;
  /** The set score for team A */
  teamAScore: Maybe<Scalars["Int"]["output"]>;
  /** The players for team B */
  teamB: Maybe<TennisTeam>;
  /** The set score for team A */
  teamBScore: Maybe<Scalars["Int"]["output"]>;
  /** The type of the match */
  type: Maybe<TennisMatchType>;
  /** The fixture urn */
  urn: Scalars["URN"]["output"];
};

export enum TennisMatchGender {
  Female = "FEMALE",
  Male = "MALE",
  Mixed = "MIXED",
}

export type TennisMatchStatus = {
  reason: Maybe<TennisStatusReason>;
  status: TennisStatus;
};

export enum TennisMatchType {
  Doubles = "DOUBLES",
  Singles = "SINGLES",
}

export type TennisPlayer = {
  /** The player name */
  name: Scalars["String"]["output"];
  /** The player rank */
  rank: Maybe<Scalars["Int"]["output"]>;
};

export type TennisSet = {
  /** The current tennis game - null if tennis is in the past */
  currentGame: Maybe<TennisGame>;
  /** The set duration - elapsed time of the set */
  duration: Maybe<Scalars["Int"]["output"]>;
  /** The number of the set */
  number: Scalars["Int"]["output"];
  /** The ordered game (from most recent to least) */
  previousGames: Maybe<Array<Maybe<TennisGame>>>;
  /** The game score for team A on this set */
  teamAScore: Scalars["Int"]["output"];
  /** The game score for team B on this set */
  teamBScore: Scalars["Int"]["output"];
};

export type TennisSetStats = {
  /** The number of the set */
  number: Scalars["Int"]["output"];
  /** The set stats for the teams */
  teamsStats: TennisTeamsStats;
};

export type TennisStats = {
  /** The match sets stats */
  setsStats: Maybe<Array<Maybe<TennisSetStats>>>;
  /** The match stats for the teams */
  teamsStats: Maybe<TennisTeamsStats>;
};

export enum TennisStatus {
  Finished = "FINISHED",
  Interrupted = "INTERRUPTED",
  InRunning = "IN_RUNNING",
  PreMatch = "PRE_MATCH",
}

export enum TennisStatusReason {
  Disqualification = "DISQUALIFICATION",
  Finished = "FINISHED",
  HeatDelay = "HEAT_DELAY",
  OnCourtCoaching = "ON_COURT_COACHING",
  RainDelay = "RAIN_DELAY",
  Retirement = "RETIREMENT",
  ToiletBreak = "TOILET_BREAK",
}

export enum TennisSurface {
  Clay = "CLAY",
  Grass = "GRASS",
  Hard = "HARD",
  IndoorHard = "INDOOR_HARD",
}

export type TennisTeam = {
  players: Maybe<Array<Maybe<TennisPlayer>>>;
  side: Maybe<TeamSide>;
};

export type TennisTeamsStats = {
  /** The type of the match */
  aggregatedStats: TennisGameStats;
  /** The type of the match */
  teamAStats: TennisGameStats;
  /** The type of the match */
  teamBStats: TennisGameStats;
};

export type TimeFormBroadCastsCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** True if it needs to show the bell icon */
    availableToSubscribe: Scalars["Boolean"]["output"];
    /** The broadcasts and indicator of Live Video */
    broadcasts: Maybe<Broadcasts>;
    /** Selected Race and indicator of TimeForm Info */
    race: Maybe<Race>;
    /** Race for subscription */
    raceToSubscribe: Scalars["URN"]["output"];
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

export type Tip = {
  /** Engagement metrics */
  counters: TipCounters;
  /**
   * If user has already shared this tip
   * @deprecated No longer supported
   */
  hasShared: Scalars["Boolean"]["output"];
  /**
   * Timestamp of the most recent share
   * @deprecated Use shareTimestamp instead
   */
  latestShareTimestamp: Scalars["String"]["output"];
  /** Odds */
  odds: SportsbookOdds;
  /** Bet parts/selections */
  parts: Array<TipPart>;
  /** Profile that shared this tip */
  profile: SocialProfile;
  /** Timestamp of when the tip was shared */
  shareTimestamp: Scalars["String"]["output"];
  /** Unique identifier for the tip */
  tipId: Scalars["String"]["output"];
};

export type TipCounters = {
  /** Number of times copied */
  copies: Scalars["Int"]["output"];
  /**
   * Number of times shared/reshared
   * @deprecated No longer supported
   */
  shares: Scalars["Int"]["output"];
};

export type TipDescriptions = {
  /** Competition name */
  competition: Maybe<Scalars["String"]["output"]>;
  /** Event name */
  event: Maybe<Scalars["String"]["output"]>;
  /** Market name */
  market: Maybe<Scalars["String"]["output"]>;
  /** Selection name */
  selection: Maybe<Scalars["String"]["output"]>;
  /** Sport name */
  sport: Maybe<Scalars["String"]["output"]>;
};

export type TipEdge = {
  /** Cursor for pagination */
  cursor: Scalars["String"]["output"];
  /** The tip at the edge */
  node: Maybe<Tip>;
};

export type TipPart = EmsTipPart;

export type TipPartMetadata = {
  /** Human-readable descriptions */
  descriptions: Maybe<TipDescriptions>;
};

export type TipsConnection = {
  /** List of tips in the connection */
  edges: Array<TipEdge>;
  /** Pagination information for the connection */
  pageInfo: PageInfo;
};

export enum TitleImage {
  Oddsboost = "ODDSBOOST",
}

export type ToMissPenalty = {
  /** Center save associated runner */
  centerSave: Runner;
  /** Left miss or post associated runner */
  leftPostMiss: Runner;
  /** Left save associated runner */
  leftSave: Runner;
  /** Right miss or Post associated runner */
  rightPostMiss: Runner;
  /** Right save associated runner */
  rightSave: Runner;
  /** Skyrocket or crossbar associated runner */
  skyrocketCrossbar: Runner;
};

export type ToQuote = {
  baseExpressionTemplateDefinitions: InputMaybe<Array<BaseExpressionTemplateDefinitionsInput>>;
  expressionParams: ExpressionParamsInput;
  expressionTemplateId: Scalars["String"]["input"];
  id: Scalars["String"]["input"];
};

export type ToScorePenalty = {
  /** Bottom Center associated runner */
  bottomCenter: Runner;
  /** Bottom Left associated runner */
  bottomLeft: Runner;
  /** Bottom Right associated runner */
  bottomRight: Runner;
  /** Top Center associated runner */
  topCenter: Runner;
  /** Top Left associated runner */
  topLeft: Runner;
  /** Top Right associated runner */
  topRight: Runner;
};

/** Represents a TranslatableText */
export type TranslatableText = {
  translate: Maybe<TranslateProps>;
  translated: Maybe<Scalars["String"]["output"]>;
};

/** Represents a TranslatableProps */
export type TranslateProps = {
  key: Scalars["String"]["output"];
};

export type UnquotedBetOutcome = {
  incidentType: InputMaybe<UnquotedIncidentType>;
  operator: InputMaybe<Scalars["String"]["input"]>;
  period: InputMaybe<Scalars["String"]["input"]>;
  value: InputMaybe<Scalars["String"]["input"]>;
};

export type UnquotedIncidentType = {
  id: Scalars["String"]["input"];
  resultType: Scalars["String"]["input"];
};

export type UnquotedPartialLeg = {
  aggregator: InputMaybe<Scalars["String"]["input"]>;
  outcomes: InputMaybe<Array<UnquotedBetOutcome>>;
  participants: InputMaybe<Array<UnquotedParticipant>>;
};

export type UnquotedParticipant = {
  id: Scalars["String"]["input"];
  type: Scalars["String"]["input"];
};

/** Represents the possible input values for the unshare Mutation */
export type UnshareInput =
  /** The Bet ID to unshare */
  | { betId: Scalars["String"]["input"]; tipId?: never } /** The Tip ID to unshare */
  | { betId?: never; tipId: Scalars["String"]["input"] };

/** Possible response codes for unshare mutation */
export enum UnshareTipResponseCode {
  GeneralFailure = "GENERAL_FAILURE",
  Success = "SUCCESS",
  TipNotFound = "TIP_NOT_FOUND",
}

/** Represents the result of an unshare mutation */
export type UnshareTipResult = {
  /** Operation result code */
  code: UnshareTipResponseCode;
};

export type UpdateSocialProfileInput = {
  /** Desired avatar id for the social profile */
  avatarId: InputMaybe<Scalars["String"]["input"]>;
  /** Desired username for the social profile */
  username: InputMaybe<Scalars["String"]["input"]>;
};

/** Upsell suggestions response */
export type UpsellSuggestionsResult = {
  /** The list of popular selections */
  items: Array<Maybe<PopularSelectionsItem>>;
  /** Whether the client should keep fetching for upsell suggestions */
  keepFetching: Scalars["Boolean"]["output"];
  /** The max number of selections that can trigger upsell suggestions */
  max: Scalars["Int"]["output"];
  /** The minimum number of selections that can trigger upsell suggestions */
  min: Scalars["Int"]["output"];
};

export type UserDetails = {
  accountId: Scalars["Float"]["output"];
  accountOpenDate: Maybe<Scalars["String"]["output"]>;
  bucketId: Scalars["Float"]["output"];
  countryCode: Scalars["String"]["output"];
  currencyCode: Scalars["String"]["output"];
  excSettings: Maybe<ExchangeSettings>;
  /** @deprecated Use 'excSettings' instead. Returns default values for non-exchange users. */
  exchangeSettings: ExchangeSettings;
  firstName: Scalars["String"]["output"];
  jurisdiction: UserJurisdiction;
  jurisdictionalData: Maybe<UserJurisdictionData>;
  lastLoginDate: Maybe<Scalars["String"]["output"]>;
  lastName: Scalars["String"]["output"];
  localeCode: Scalars["String"]["output"];
  localeCodeBcp47: Scalars["String"]["output"];
  loggedIn: Scalars["Boolean"]["output"];
  migrationData: Maybe<UserMigrationData>;
  productExclusions: Array<Maybe<ProductExclusion>>;
  region: Scalars["String"]["output"];
  timezone: Scalars["String"]["output"];
};

export type UserJurisdiction = {
  jurisdiction: Scalars["String"]["output"];
};

export type UserJurisdictionData = {
  contractNumber: Maybe<Scalars["String"]["output"]>;
  nationalIdentifier: Maybe<Scalars["String"]["output"]>;
};

export type UserMigrationData = {
  heritageAccountId: Maybe<Scalars["String"]["output"]>;
  heritageSecondaryAccountId: Maybe<Scalars["String"]["output"]>;
  heritageSystem: Maybe<Scalars["String"]["output"]>;
  migrationDate: Maybe<Scalars["String"]["output"]>;
  migrationInformation: Maybe<Scalars["String"]["output"]>;
};

/** The possible values of the user products preferences */
export enum UserProducts {
  Exchange = "EXCHANGE",
  Games = "GAMES",
  Sportsbook = "SPORTSBOOK",
}

/** Represents a User products Preference */
export type UserProductsPreference = Preference & {
  /**
   * Available user products preferences options
   * @deprecated Value is not a preference anymore
   */
  productOptions: Array<UserProducts>;
  /** The selected user products preferences option */
  selectedProduct: Maybe<Array<Maybe<UserProducts>>>;
  /** The user products preference urn */
  urn: Scalars["URN"]["output"];
};

/** Represents a user products preferences input interface */
export type UserProductsPreferencesInput = {
  /** The user products preference urn */
  urn: Scalars["URN"]["input"];
  /**
   * The user products preference new value
   * @deprecated Value is not a preference anymore
   */
  value: InputMaybe<Array<InputMaybe<UserProducts>>>;
};

/** Details about the quantity and value of a benefit */
export type ValueLookup = {
  /** Max amount of the benefit */
  maxAmount: Maybe<ValueLookupItem>;
  /** Quantity of the benefit */
  quantity: Maybe<ValueLookupItem>;
  /** Size of the benefit */
  size: Maybe<ValueLookupItem>;
};

/** Value and type of the ammount/size/quantity of the benefit */
export type ValueLookupItem = {
  /** Type of the benefit */
  type: Maybe<Scalars["String"]["output"]>;
  /** Value of the benefit */
  value: Maybe<Scalars["String"]["output"]>;
};

/** Represents a TBD View */
export type View = {
  /** The bottom bar */
  bottomBar: Maybe<BottomBar>;
  /** The category */
  category: Maybe<ViewCategory>;
  /**
   * The left side bar
   * @deprecated Use LeftSideBar Query instead
   */
  leftSidebar: Maybe<LeftSidebar>;
  /** The regulatory data used for the regulatory header */
  regulatoryData: Maybe<RegulatoryData>;
  /** View title */
  title: Maybe<Scalars["String"]["output"]>;
  /** The view url */
  url: Scalars["URL"]["output"];
  /** The view urn */
  urn: Scalars["URN"]["output"];
  /** The xsell bar */
  xsellBar: Maybe<XSellBar>;
};

/** The possible categories for the views. */
export enum ViewCategory {
  Account = "ACCOUNT",
  Betting = "BETTING",
  Gaming = "GAMING",
  Modal = "MODAL",
  Navigation = "NAVIGATION",
  Virtuals = "VIRTUALS",
}

/** Represents a View header */
export type ViewHeader = {
  /** The page Badge */
  badge: Maybe<Badge>;
  /** The page subtitle */
  subTitle: Maybe<Scalars["String"]["output"]>;
  /** The view title */
  title: Maybe<Scalars["String"]["output"]>;
  /** The title image */
  titleImage: Maybe<TitleImage>;
};

/** Represents the types that a view can contain */
export type ViewItem = {
  /** The View Item urn */
  urn: Scalars["URN"]["output"];
};

/** Represents a ViewItem edge */
export type ViewItemEdge = {
  cursor: Maybe<Scalars["String"]["output"]>;
  node: ViewItem;
  theme: Maybe<ViewItemTheme>;
};

/** Section type for an view item, insice a view */
export enum ViewItemTheme {
  GamingSmallTiles = "GAMING_SMALL_TILES",
  Highlighted = "HIGHLIGHTED",
}

/** Represents a connection between View and [ViewItem] */
export type ViewItemsConnection = {
  edges: Array<Maybe<ViewItemEdge>>;
  pageInfo: Maybe<PageInfo>;
};

/** Represents a connection to a view */
export type ViewLink = {
  /** The navigation intent */
  navigationIntent: NavigationIntent;
  /**
   * The target displayMode
   * @deprecated Use navigationIntent instead
   */
  viewDisplayMode: Maybe<DisplayMode>;
  /** The connected view url */
  viewUrl: Scalars["URL"]["output"];
  /** The connected view urn */
  viewUrn: Scalars["URN"]["output"];
};

/** Represents a collection of ViewZoneItems */
export type ViewZone = NavigationTabItem &
  ViewItem & {
    items: ViewZoneItemsConnection;
    title: Scalars["String"]["output"];
    urn: Scalars["URN"]["output"];
  };

/** Represents a collection of ViewZoneItems */
export type ViewZoneItemsArgs = {
  first: InputMaybe<Scalars["Int"]["input"]>;
};

/** Represents the types that a view can contain */
export type ViewZoneItem = {
  /** The View Zone Item urn */
  urn: Scalars["URN"]["output"];
};

/** Represents a ViewZoneItem edge */
export type ViewZoneItemEdge = {
  cursor: Maybe<Scalars["String"]["output"]>;
  node: ViewZoneItem;
};

/** Represents a connection between ViewZone and [ViewZoneItem] */
export type ViewZoneItemsConnection = {
  edges: Array<Maybe<ViewZoneItemEdge>>;
  pageInfo: Maybe<PageInfo>;
};

/** Represents a virtual sport event card group */
export type VirtualCardGroup = CardGroup &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The virtual sport and event card items */
    items: ViewItemsConnection;
    /** The virtual card group URN */
    urn: Scalars["URN"]["output"];
  };

export type VirtualCardGroupItemEdge = {
  isClosed: Scalars["Boolean"]["output"];
  isDisabled: Scalars["Boolean"]["output"];
  isHighlighted: Scalars["Boolean"]["output"];
  node: VirtualCardGroup;
  startTime: Scalars["String"]["output"];
};

/** Represents the runners to be displayed for a certain market */
export type VirtualDisplayRunners = {
  /** The virtual market associated to this runner */
  market: VirtualMarket;
  /** The sorted list of virtual runners to be displayed */
  runners: Array<VirtualRunner>;
};

/** Represents a virtual event */
export type VirtualEvent = {
  /** The virtual event distance */
  distance: Maybe<Scalars["String"]["output"]>;
  /** The virtual event duration */
  duration: Maybe<Scalars["Int"]["output"]>;
  /** The virtual event ID */
  eventId: Scalars["Int"]["output"];
  /** The virtual event name */
  name: Scalars["String"]["output"];
  /** The virtual event open date */
  openDate: Scalars["String"]["output"];
  /** The virtual event sport */
  sport: VirtualSport;
  /** The virtual event urn */
  urn: Scalars["URN"]["output"];
  /** The virtual event venue */
  venue: Maybe<Scalars["String"]["output"]>;
};

export type VirtualEventDetailsCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card urn */
    urn: Scalars["URN"]["output"];
    /** The virtual event */
    virtualEvent: VirtualEvent;
  };

/** Represents a Market Context with an Event and a Sport */
export type VirtualEventHierarchy = {
  /** The market associated virtual event */
  virtualEvent: VirtualEvent;
};

/** Represents a virtual market */
export type VirtualMarket = {
  eachWayFraction: Maybe<Scalars["Int"]["output"]>;
  eachWayPlaces: Maybe<Scalars["Int"]["output"]>;
  /** The virtual event */
  event: VirtualEvent;
  forecast: Scalars["Boolean"]["output"];
  hasEachWay: Maybe<Scalars["Boolean"]["output"]>;
  /** The market live information */
  liveData: Maybe<SportsbookMarketLiveData>;
  /** The virtual market Id */
  marketId: Scalars["String"]["output"];
  /** The market type */
  marketType: Scalars["String"]["output"];
  /** The virtual market name */
  name: Scalars["String"]["output"];
  /** The virtual market runners */
  runners: Array<VirtualRunner>;
  /** The virtual market sport */
  sport: VirtualSport;
  status: Scalars["String"]["output"];
  tricast: Scalars["Boolean"]["output"];
  /** The virtual market urn */
  urn: Scalars["URN"]["output"];
};

/** Represents a virtual market card */
export type VirtualMarketCard = Card &
  NavigationTabItem &
  ViewItem &
  ViewZoneItem & {
    /** The card markets with virtual runners sorted */
    displayRunners: VirtualDisplayRunners;
    /** The game rules quicklink */
    gameRulesViewLink: ViewLink;
    /** The context that might include sport, event, etc */
    marketHierarchy: VirtualMarketHierarchy;
    /** The card title */
    title: Scalars["String"]["output"];
    /** The card urn */
    urn: Scalars["URN"]["output"];
  };

/**
 * Represents the hierarchy of a market
 * E.g.: a market belongs to a event which belongs to a sport
 * More contexts to possibly come later
 */
export type VirtualMarketHierarchy = VirtualEventHierarchy;

/** Represents a virtual runner */
export type VirtualRunner = {
  /** The human name */
  humanName: Maybe<Scalars["String"]["output"]>;
  /** An identifier for the human texture. */
  humanTexture: Maybe<Scalars["String"]["output"]>;
  /** The runner name */
  name: Scalars["String"]["output"];
  /** The runner odds */
  odds: SportsbookOdds;
  /** The racer index */
  racerIndex: Maybe<Scalars["Int"]["output"]>;
  /** The virtual runner urn */
  runnerURN: Scalars["URN"]["output"];
  /** The runner selection id */
  selectionId: Scalars["Int"]["output"];
  /** An identifier for the runner texture. */
  selectionTexture: Maybe<Scalars["String"]["output"]>;
};

/** Represents a virtual sport */
export type VirtualSport = {
  /** The virtual sport kind */
  kind: VirtualSportKind;
  /** The virtual sport name */
  name: DisplayNameTranslationKey;
  /** The virtual sport id */
  sportId: Scalars["Int"]["output"];
  /** The virtual sport urn */
  urn: Scalars["URN"]["output"];
};

/** Defines the kind of virtual sport */
export enum VirtualSportKind {
  Football = "FOOTBALL",
  Other = "OTHER",
  Racing = "RACING",
}

export type VolleyballFixture = Fixture & {
  /** Away team score (sets won) */
  awayScore: Maybe<Scalars["Int"]["output"]>;
  /** Current set information */
  currentSet: Maybe<VolleyballSet>;
  /** Home team score (sets won) */
  homeScore: Maybe<Scalars["Int"]["output"]>;
  /** If the score should be display in american format */
  isAmericanFormat: Scalars["Boolean"]["output"];
  /** Previous sets */
  previousSets: Maybe<Array<Maybe<VolleyballSet>>>;
  /** The fixture main market home away runner names */
  runnerNames: Maybe<FixtureRunnerNames>;
  /** The sport event */
  sportevent: SportsEvent;
  /** The fixture urn */
  urn: Scalars["URN"]["output"];
};

export type VolleyballScore = {
  /** Away team score */
  away: Scalars["Int"]["output"];
  /** Home team score */
  home: Scalars["Int"]["output"];
};

export type VolleyballSet = {
  /** Current server team side */
  currentServer: Maybe<TeamSide>;
  /** Set number */
  number: Maybe<Scalars["Int"]["output"]>;
  /** Score in this set */
  score: Maybe<VolleyballScore>;
};

/** Represents a card with wallet name */
export type Wallet = {
  /** The wallet name */
  name: Maybe<Scalars["String"]["output"]>;
};

/** Represents a card that holds the aggregation wallet rules */
export type WalletAggregationRule = {
  /** The aggregation rule field */
  field: Maybe<Scalars["String"]["output"]>;
  /** The aggregation rule sign */
  sign: Maybe<Scalars["String"]["output"]>;
  /** The aggregation rule wallet */
  wallet: Maybe<Scalars["String"]["output"]>;
};

/** Represents the Wallet restrictions */
export type WalletRestrictions = {
  /** The flag that indicates that is a restriction for acca bets */
  acca: Maybe<Scalars["Boolean"]["output"]>;
  /** The flag that indicates that is a restriction for same game multi */
  sameGameMulti: Maybe<Scalars["Boolean"]["output"]>;
  /** The flag that indicates that is a restriction for single bets */
  single: Maybe<Scalars["Boolean"]["output"]>;
};

/** Represents a card that holds a collection of wallet rules for aggregation */
export type WalletRule = {
  /** The wallet aggregation rules */
  aggregationRules: Maybe<Array<Maybe<WalletAggregationRule>>>;
  /** The wallet aggregation rule to hide if zero */
  hideIfZero: Maybe<Scalars["Boolean"]["output"]>;
  /** The wallet aggregation rule name */
  name: Maybe<Scalars["String"]["output"]>;
  /** The wallet withCurrency field */
  withCurrency: Scalars["Boolean"]["output"];
};

/** Represents a card that holds a wallet section */
export type WalletSectios = {
  /** The wallet section key */
  key: Maybe<Scalars["String"]["output"]>;
  /** The wallet section label */
  label: Maybe<Scalars["String"]["output"]>;
  /** The wallet section name */
  name: Maybe<Scalars["String"]["output"]>;
  /** The wallet section aggregation rules */
  walletRules: Array<WalletRule>;
};

/** Possible wallet types for Extra Wallets */
export enum WalletTypes {
  /** Acca Insurance Tokens */
  AccaInsuranceToken = "ACCA_INSURANCE_TOKEN",
  /** Free Bets Wallets */
  BonusCash = "BONUS_CASH",
  /** Ghost Leg Tokens */
  GhostLegToken = "GHOST_LEG_TOKEN",
  /** Money Back Tokens */
  MoneyBackToken = "MONEY_BACK_TOKEN",
  /** Price Boost Tokens */
  PriceBoostToken = "PRICE_BOOST_TOKEN",
}

export type WebMessage = ModalElement & {
  /** The content of the modal. */
  content: WebMessageContent;
  /** The modal element URN (built based on it's id) */
  urn: Scalars["URN"]["output"];
};

export type WebMessageContent = {
  /** Display height of the web message */
  templateHeight: Maybe<Scalars["Int"]["output"]>;
  /** URL of the template to display */
  templateUrl: Maybe<Scalars["String"]["output"]>;
  /** Display width of the web message */
  templateWidth: Maybe<Scalars["Int"]["output"]>;
  /** The modal title */
  title: Maybe<Scalars["String"]["output"]>;
};

export type Weight = {
  kilograms: Scalars["Float"]["output"];
  pounds: Scalars["Float"]["output"];
  stones: Scalars["String"]["output"];
};

export type WinAvgOdds = {
  decimalDisplayOdds: Maybe<DecimalOdds>;
  fractionalDisplayOdds: Maybe<FractionalOdds>;
  prettyDisplayOdds: Maybe<DisplayOdds>;
  prettyFractionalDisplayOdds: Maybe<FractionalOdds>;
  trueOdds: Maybe<DisplayOdds>;
};

/** Represents the xsell bar */
export type XSellBar = {
  /** The xsell bar sections */
  sections: Maybe<Array<XSellBarSection>>;
  /** the xsell bar urn */
  urn: Scalars["URN"]["output"];
};

export type XSellBarSection = {
  /** The xsell bar section type */
  sectionType: XSellBarSectionType;
  /** The xsell bar section url */
  sectionUrl: Scalars["URL"]["output"];
  /** The target displayMode */
  urlDisplayMode: Maybe<DisplayMode>;
};

export enum XSellBarSectionType {
  Casino = "CASINO",
  Itv7 = "ITV7",
  Poker = "POKER",
  SaferGambling = "SAFER_GAMBLING",
  SkyBingo = "SKY_BINGO",
  SkyCasino = "SKY_CASINO",
  SkyCasinoLive = "SKY_CASINO_LIVE",
  SkyPoker = "SKY_POKER",
  SkySports = "SKY_SPORTS",
  SkyVegas = "SKY_VEGAS",
  SkyVegasLive = "SKY_VEGAS_LIVE",
  SportingLife = "SPORTING_LIFE",
  Sports = "SPORTS",
  Super_6 = "SUPER_6",
}

export enum LinkPurpose {
  /** `EXECUTION` features provide metadata necessary for operation execution. */
  Execution = "EXECUTION",
  /** `SECURITY` features provide metadata necessary to securely resolve fields. */
  Security = "SECURITY",
}

export type UpsellSuggestionsOddsDisplayPreferenceQueryVariables = Exact<{ [key: string]: never }>;

export type UpsellSuggestionsOddsDisplayPreferenceQuery = {
  AppContext: {
    __typename: "AppContextDetails";
    urn: string;
    preferences: { sportsbookOddsDisplay: { urn: string; selectedOddsDisplayFormat: OddsDisplayFormat } };
  };
};

export type UpsellSuggestionsQueryVariables = Exact<{
  marketSelections: Array<MarketSelectionInput> | MarketSelectionInput;
}>;

export type UpsellSuggestionsQuery = {
  UpsellSuggestions: {
    min: number;
    max: number;
    items: Array<{
      runner: {
        name: string;
        selectionId: number;
        runnerURN: string;
        runnerLiveData:
          | {
              odds: {
                decimal: number;
                american: number | null;
                fractional: { numerator: number; denominator: number } | null;
              } | null;
            }
          | {}
          | null;
      };
      market: { name: string; urn: string; hierarchy: { sportevent: { name: string } } | {} };
    } | null>;
  } | null;
};

export type GamingPrizeMachineUserDetailsFragment = {
  __typename: "AppContextDetails";
  urn: string;
  userdetails: { localeCodeBcp47: string; currencyCode: string };
};

export type GamingPrizeMachineCardFragment = {
  __typename: "GamingPrizeMachineCard";
  urn: string;
  placementId: string;
  completed: boolean;
  redirectUrl: string | null;
  jackpotAmount: number | null;
  jackpotState: GamingPrizeMachineStateType | null;
  activeTitle: string | null;
  ctaLabel: string | null;
  displayJackpotWinnersPostPlayWidget: boolean;
  guaranteedPrize: boolean;
  minigameType: string | null;
  themeImages: {
    topLeftImage: { url: string; alt: string | null; dimensions: { width: number; height: number } } | null;
    bottomLeftImage: { url: string; alt: string | null; dimensions: { width: number; height: number } } | null;
    bottomRightImage: { url: string; alt: string | null; dimensions: { width: number; height: number } } | null;
  } | null;
};

export type GamingPrizeMachineUserDetailsQueryVariables = Exact<{ [key: string]: never }>;

export type GamingPrizeMachineUserDetailsQuery = { AppContext: GamingPrizeMachineUserDetailsFragment };

export type GamingPrizeMachineCardQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type GamingPrizeMachineCardQuery = { Cards: Array<GamingPrizeMachineCardFragment | {} | null> | null };

export type SportsbookLotteriesBetLegCardGroupFragment = {
  __typename: "SportsbookLotteriesBetLegCardGroup";
  urn: string;
  full: {
    edges: Array<{
      node:
        | { __typename: "BetLegCard"; urn: string; betUrn: string; leg: SportsbookLotteriesBetLegFragment }
        | {
            __typename: "EventHeaderCard";
            urn: string;
            title: string;
            tertiaryTitle: string | null;
            date: string | null;
          };
    } | null>;
  };
};

export type SportsbookLotteriesBetLegFragment = {
  __typename: "BetLeg";
  urn: string;
  type: LegType;
  result: ResultEnum | null;
  parts: Array<SportsbookLotteriesLegPartFragment>;
};

export type SportsbookLotteriesLegPartFragment = {
  __typename: "LegPart";
  selectionId: number | null;
  selectionName: string;
};

export type SportsbookLotteriesBetLegUserDetailsFragment = {
  __typename: "AppContextDetails";
  urn: string;
  userdetails: { localeCodeBcp47: string; timezone: string };
};

export type SportsbookLotteriesBetLegCardGroupQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type SportsbookLotteriesBetLegCardGroupQuery = {
  Cards: Array<SportsbookLotteriesBetLegCardGroupFragment | {} | null> | null;
};

export type SportsbookLotteriesBetLegUserDetailsQueryVariables = Exact<{ [key: string]: never }>;

export type SportsbookLotteriesBetLegUserDetailsQuery = { AppContext: SportsbookLotteriesBetLegUserDetailsFragment };

export type BreadcrumbsCardFragment = {
  __typename: "BreadcrumbsCard";
  urn: string;
  items: Array<
    | {
        __typename: "CompetitionBreadcrumb";
        competitionView: { urn: string; url: string; competition: { name: string } };
      }
    | { __typename: "EventBreadcrumb"; eventView: { urn: string; url: string; sportevent: { name: string } } }
    | { __typename: "HomeBreadcrumb"; displayName: { translationKey: string } | {}; homeView: { urn: string } }
    | { __typename: "MarketBreadcrumb"; marketView: { urn: string; url: string; mainMarket: { name: string } | {} } }
    | { __typename: "RaceBreadcrumb"; raceView: { urn: string; url: string; race: { name: string } } }
    | { __typename: "SportBreadcrumb"; sportView: { urn: string; url: string; sport: { name: string } } }
  >;
};

export type BreadcrumbsCardQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type BreadcrumbsCardQuery = { Cards: Array<BreadcrumbsCardFragment | {} | null> | null };

export type GenericSwitcherCardFragment = {
  __typename: "GenericSwitcherCard";
  urn: string;
  headerTheming: string | null;
  filterTitle: { translated: string | null; translate: { key: string } | null };
  selectedViewLink: { label: string; viewLink: { viewUrn: string; viewUrl: string } };
};

export type GenericSwitcherCardSiblingsFragment = {
  __typename: "GenericSwitcherCard";
  urn: string;
  siblingViews: { edges: Array<{ node: { label: string; viewLink: { viewUrn: string; viewUrl: string } } } | null> };
};

export type GenericSwitcherCardQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type GenericSwitcherCardQuery = { Cards: Array<GenericSwitcherCardFragment | {} | null> | null };

export type GenericSwitcherCardSiblingsQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type GenericSwitcherCardSiblingsQuery = { Cards: Array<GenericSwitcherCardSiblingsFragment | {} | null> | null };

export type QuicklinksGridCardGroupItemsFragment = {
  __typename: "QuicklinksGridCardGroupItemsConnection";
  edges: Array<{
    __typename: "QuicklinkGridCardGroupItemEdge";
    isExpanded: boolean;
    style: QuicklinkGridStyle;
    label: string | null;
    icon: { id: string; category: string } | null;
    node:
      | CompetitionViewLinkItemFragment
      | EventViewLinkItemFragment
      | GenericViewLinkItemFragment
      | RaceViewLinkItemFragment
      | SportViewLinkItemFragment
      | {};
  } | null>;
};

export type QuicklinksGridCardGroupItemPartialsFragment = {
  __typename: "QuicklinksGridCardGroupItemsConnection";
  edges: Array<{
    __typename: "QuicklinkGridCardGroupItemEdge";
    isExpanded: boolean;
    style: QuicklinkGridStyle;
    label: string | null;
    icon: { id: string; category: string } | null;
    node:
      | { __typename: "AccountBannersCard" }
      | { __typename: "BalanceCard" }
      | { __typename: "BetLegCard" }
      | { __typename: "BetOpportunityPromoCard" }
      | { __typename: "BlurbCard" }
      | { __typename: "BreadcrumbsCard" }
      | { __typename: "BroadcastsAndStatisticsCard" }
      | { __typename: "BroadcastsCard" }
      | { __typename: "BudgetLimitsCard" }
      | { __typename: "CdvTrackerCard" }
      | { __typename: "CompetitionRegionCard" }
      | { __typename: "CompetitionViewLinkCard"; urn: string }
      | { __typename: "ContentSummaryCard" }
      | { __typename: "CorrectScoreCard" }
      | { __typename: "CouponHeaderCard" }
      | { __typename: "EditorialPromoCard" }
      | { __typename: "EmbeddedContentCard" }
      | { __typename: "EmbeddedViewCard" }
      | { __typename: "EventHeaderCard" }
      | { __typename: "EventMarketCard" }
      | { __typename: "EventStatsCard" }
      | { __typename: "EventViewLinkCard"; urn: string }
      | { __typename: "ExpandableMarketCard" }
      | { __typename: "ExtraWalletCard" }
      | { __typename: "FixtureCard" }
      | { __typename: "FootballPlayerCompetitionStatsCard" }
      | { __typename: "ForbiddenContentCard" }
      | { __typename: "GameCard" }
      | { __typename: "GameInfoCard" }
      | { __typename: "GamingBackNavigationCard" }
      | { __typename: "GamingJackpotCard" }
      | { __typename: "GamingLinkCard" }
      | { __typename: "GamingPlayNewCard" }
      | { __typename: "GamingPrizeMachineCard" }
      | { __typename: "GenericSwitcherCard" }
      | { __typename: "GenericViewLinkCard"; urn: string }
      | { __typename: "GridCard" }
      | { __typename: "HeadToHeadCard" }
      | { __typename: "HighlightedSelectionCard" }
      | { __typename: "ImsPromotionDetailsCard" }
      | { __typename: "ImsPromotionErrorCard" }
      | { __typename: "ImsPromotionStateCard" }
      | { __typename: "ImsPromotionTermsAndConditionsCard" }
      | { __typename: "IncidentsCard" }
      | { __typename: "LinksCard" }
      | { __typename: "LottoCard" }
      | { __typename: "LoyaltyPromoCard" }
      | { __typename: "MarketBetCard" }
      | { __typename: "MarketBetSelectionCard" }
      | { __typename: "MarketCard" }
      | { __typename: "MarketExtendedCard" }
      | { __typename: "MarketGraphsCard" }
      | { __typename: "MarketRulesCard" }
      | { __typename: "MarketViewLinkCard" }
      | { __typename: "MatchStatSelectionCard" }
      | { __typename: "MatchStatsCard" }
      | { __typename: "MatchTimelineCard" }
      | { __typename: "MiniEditorialPromoCard" }
      | { __typename: "MiniPromoBannerCard" }
      | { __typename: "MiniSelectionPromoCard" }
      | { __typename: "MonterosaContentCard" }
      | { __typename: "ObbCreatedBetsCard" }
      | { __typename: "ObbEventPopularsCard" }
      | { __typename: "ObbPvpCard" }
      | { __typename: "ObbSquadBetCard" }
      | { __typename: "ObbSquadVsSquadCard" }
      | { __typename: "OutrightMarketListCard" }
      | { __typename: "PackagedCreatedBetsCard" }
      | { __typename: "PenaltyTakersCard" }
      | { __typename: "PlayerEventMarketsCard" }
      | { __typename: "PopularBetBuilderCard" }
      | { __typename: "PopularMultiplesBetBuilderCard" }
      | { __typename: "PopularSelectionsCard" }
      | { __typename: "PreferenceSingleChoiceCard" }
      | { __typename: "PriceBoostMultiplePromoCard" }
      | { __typename: "PriceBoostMultisCard" }
      | { __typename: "PriceBoostMultisListCard" }
      | { __typename: "PromotionCard" }
      | { __typename: "PromotionTrackerErrorCard" }
      | { __typename: "PromotionsHubCard" }
      | { __typename: "QuickLinksCard" }
      | { __typename: "RaceByTimeRangeCard" }
      | { __typename: "RaceDetailsCard" }
      | { __typename: "RaceMarketCard" }
      | { __typename: "RaceResultsCard" }
      | { __typename: "RaceSwitcherCard" }
      | { __typename: "RaceViewLinkCard"; urn: string }
      | { __typename: "RaceViewLinksCard" }
      | { __typename: "RegulatoryCard" }
      | { __typename: "RewardsCard" }
      | { __typename: "RunnerInfoCard" }
      | { __typename: "SearchBarCard" }
      | { __typename: "SelectionPromoCard" }
      | { __typename: "SelfExclusionCard" }
      | { __typename: "SkyBetClubTrackerCard" }
      | { __typename: "SnookerFixtureCard" }
      | { __typename: "SportViewLinkCard"; urn: string }
      | { __typename: "SportsbookBetCard" }
      | { __typename: "SportsbookBetInfoCard" }
      | { __typename: "SportsbookChatbotCard" }
      | { __typename: "StatsBroadcastsCard" }
      | { __typename: "StatsFormCard" }
      | { __typename: "StatsGoalsAndShotsCard" }
      | { __typename: "StatsHeadToHeadCard" }
      | { __typename: "StatsLineupsCard" }
      | { __typename: "StatsMatchStatsCard" }
      | { __typename: "StatsPlayersInPlayCard" }
      | { __typename: "StatsPlayersSeasonStatsCard" }
      | { __typename: "StatsRaceResultsCard" }
      | { __typename: "StatsTableCard" }
      | { __typename: "StatsTeamsCard" }
      | { __typename: "TeamFormCard" }
      | { __typename: "TeamLineupCard" }
      | { __typename: "TimeFormBroadCastsCard" }
      | { __typename: "VirtualEventDetailsCard" }
      | { __typename: "VirtualMarketCard" };
  } | null>;
};

export type QuicklinksGridCardGroupFragment = {
  __typename: "QuicklinksGridCardGroup";
  urn: string;
  hideArrows: boolean;
  hideIcons: boolean;
  quicklinksGridTitle: string | null;
  items: QuicklinksGridCardGroupItemsFragment;
  partials: QuicklinksGridCardGroupItemPartialsFragment;
};

export type QuicklinksGridCardGroupQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type QuicklinksGridCardGroupQuery = { Cards: Array<QuicklinksGridCardGroupFragment | {} | null> | null };

export type SportViewLinkItemFragment = {
  __typename: "SportViewLinkCard";
  urn: string;
  viewLink: { viewUrn: string; viewUrl: string };
  sport: { __typename: "Sport"; urn: string; name: string; sportId: number };
};

export type CompetitionViewLinkItemFragment = {
  __typename: "CompetitionViewLinkCard";
  urn: string;
  viewLink: { viewUrn: string; viewUrl: string };
  competition: {
    __typename: "Competition";
    urn: string;
    name: string;
    competitionId: number;
    sport: { __typename: "Sport"; urn: string; name: string; sportId: number };
  };
};

export type EventViewLinkItemFragment = {
  __typename: "EventViewLinkCard";
  urn: string;
  viewLink: { viewUrn: string; viewUrl: string };
  sportevent: {
    __typename: "SportsEvent";
    urn: string;
    eventId: number;
    name: string;
    openDate: string;
    competition: {
      __typename: "Competition";
      urn: string;
      name: string;
      competitionId: number;
      sport: { __typename: "Sport"; urn: string; name: string; sportId: number };
    } | null;
  };
};

export type RaceViewLinkItemFragment = {
  __typename: "RaceViewLinkCard";
  urn: string;
  race: {
    __typename: "Race";
    urn: string;
    startTime: string;
    raceId: string;
    name: string;
    meeting: {
      __typename: "Meeting";
      urn: string;
      name: string;
      meetingId: string;
      country: string;
      venue: string;
      date: string | null;
      countryFlag: { small: string | null; medium: string | null; large: string | null } | null;
      sport: { __typename: "Sport"; urn: string; name: string; sportId: number };
    };
  };
  viewLink: { viewUrn: string; viewUrl: string };
};

export type GenericViewLinkItemFragment = {
  __typename: "GenericViewLinkCard";
  urn: string;
  badge: Badge | null;
  genericViewLinkTitle:
    | { __typename: "DisplayNameTitle"; name: string }
    | { __typename: "DisplayNameTranslationKey"; translationKey: string };
  viewLink: { viewUrn: string; viewUrl: string; viewDisplayMode: DisplayMode | null };
  sportIcon: { sport: { sportId: number } | null } | null;
};

export type QuicklinksGridItemCardQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type QuicklinksGridItemCardQuery = {
  Cards: Array<
    | CompetitionViewLinkItemFragment
    | EventViewLinkItemFragment
    | GenericViewLinkItemFragment
    | RaceViewLinkItemFragment
    | SportViewLinkItemFragment
    | {}
    | null
  > | null;
};

export type QuicklinksGridItemCardUserDetailsQueryVariables = Exact<{ [key: string]: never }>;

export type QuicklinksGridItemCardUserDetailsQuery = {
  AppContext: { __typename: "AppContextDetails"; userdetails: { loggedIn: boolean } };
};

export type RaceSwitcherCardUserDetailsFragment = {
  __typename: "AppContextDetails";
  urn: string;
  userdetails: { localeCodeBcp47: string; timezone: string };
};

export type RaceSwitcherCardFragment = {
  __typename: "RaceSwitcherCard";
  urn: string;
  headerTheming: string | null;
  filterTitle: { translated: string | null; translate: { key: string } | null };
  race: {
    name: string;
    meeting: {
      urn: string;
      name: string;
      meetingId: string;
      venue: string;
      date: string | null;
      countryFlag: { vector: string | null; small: string | null } | null;
    };
  };
};

export type RaceSwitcherCardSiblingsFragment = {
  __typename: "RaceSwitcherCard";
  urn: string;
  siblingViews: {
    edges: Array<{
      node: {
        race: {
          meeting: { urn: string; venue: string; countryFlag: { vector: string | null; small: string | null } | null };
        };
        viewLink: { viewUrn: string; viewUrl: string };
      };
    } | null>;
  };
};

export type RaceSwitcherCardUserDetailsQueryVariables = Exact<{ [key: string]: never }>;

export type RaceSwitcherCardUserDetailsQuery = { AppContext: RaceSwitcherCardUserDetailsFragment };

export type RaceSwitcherCardQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type RaceSwitcherCardQuery = { Cards: Array<RaceSwitcherCardFragment | {} | null> | null };

export type RaceSwitcherCardSiblingsQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type RaceSwitcherCardSiblingsQuery = { Cards: Array<RaceSwitcherCardSiblingsFragment | {} | null> | null };

export type SelfExclusionUserDetailsFragment = {
  __typename: "AppContextDetails";
  urn: string;
  userdetails: { localeCodeBcp47: string; jurisdiction: { jurisdiction: string } };
};

export type SelfExclusionCardFragment = {
  __typename: "SelfExclusionCard";
  urn: string;
  message: { name: string } | {};
  saferGamblingLink: { viewUrn: string; viewUrl: string } | null;
  supportLink: { viewUrn: string; viewUrl: string } | null;
};

export type SelfExclusionUserDetailsQueryVariables = Exact<{ [key: string]: never }>;

export type SelfExclusionUserDetailsQuery = { AppContext: SelfExclusionUserDetailsFragment };

export type SelfExclusionCardQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type SelfExclusionCardQuery = { Cards: Array<SelfExclusionCardFragment | {} | null> | null };

export type XSellBarFragment = {
  __typename: "XSellBar";
  sections: Array<{ sectionType: XSellBarSectionType; sectionUrl: string }> | null;
};

export type XSellBarQueryVariables = Exact<{ [key: string]: never }>;

export type XSellBarQuery = { XSellBar: XSellBarFragment };

export type BetOpportunityPromoCardTermsAndConditionsFragment = {
  summary: string | null;
  link: {
    label: { name: string } | { translationKey: string };
    viewLink: { viewUrn: string; viewUrl: string; viewDisplayMode: DisplayMode | null };
  } | null;
};

export type BetOpportunityPromoCardUserDetailsFragment = {
  __typename: "AppContextDetails";
  brandSettings: Array<{ name: string; isActive: boolean }>;
  userdetails: { localeCodeBcp47: string };
};

export type BetOpportunityPromoCardFragment = {
  __typename: "BetOpportunityPromoCard";
  urn: string;
  theme: PromoTheme;
  title: string;
  subTitle: string | null;
  promoImage: { url: string };
  ladderLevels: Array<{
    __typename: "PPHPromotionLaddersLevels";
    fulfilled: boolean | null;
    levels: { __typename: "PPHCriteriaStateGauge"; current: number | null; target: number | null } | null;
  } | null> | null;
  termsAndConditions: BetOpportunityPromoCardTermsAndConditionsFragment | null;
  betOpportunityAction: {
    __typename: "PromoNavigationAction";
    link: {
      label: { name: string } | { translationKey: string };
      viewLink: { viewUrn: string; viewUrl: string; viewDisplayMode: DisplayMode | null };
    };
  };
};

export type BetOpportunityPromoCardQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type BetOpportunityPromoCardQuery = { Cards: Array<BetOpportunityPromoCardFragment | {} | null> | null };

export type BetOpportunityPromoCardUserDetailsQueryVariables = Exact<{ [key: string]: never }>;

export type BetOpportunityPromoCardUserDetailsQuery = { AppContext: BetOpportunityPromoCardUserDetailsFragment };

export type EditorialPromoCardTermsAndConditionsFragment = {
  summary: string | null;
  link: {
    label: { name: string } | { translationKey: string };
    viewLink: { viewUrn: string; viewUrl: string; viewDisplayMode: DisplayMode | null };
  } | null;
};

export type EditorialPromoCardUserDetailsFragment = {
  __typename: "AppContextDetails";
  brandSettings: Array<{ name: string; isActive: boolean }>;
  userdetails: { localeCodeBcp47: string };
};

export type EditorialPromoCardFragment = {
  __typename: "EditorialPromoCard";
  urn: string;
  theme: PromoTheme;
  title: string;
  subTitle: string | null;
  promoImage: { url: string };
  promoTag: { iconTag: IconTag } | { label: string } | null;
  termsAndConditions: EditorialPromoCardTermsAndConditionsFragment | null;
  editorialAction: {
    __typename: "PromoNavigationAction";
    link: {
      label: { name: string } | { translationKey: string };
      viewLink: { viewUrn: string; viewUrl: string; viewDisplayMode: DisplayMode | null };
    };
  } | null;
};

export type EditorialPromoCardQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type EditorialPromoCardQuery = { Cards: Array<EditorialPromoCardFragment | {} | null> | null };

export type EditorialPromoCardUserDetailsQueryVariables = Exact<{ [key: string]: never }>;

export type EditorialPromoCardUserDetailsQuery = { AppContext: EditorialPromoCardUserDetailsFragment };

export type LoyaltyPromotionFragment = {
  __typename: "LoyaltyPromotion";
  urn: string;
  name: string;
  title: string | null;
  promoImage: { url: string } | null;
  state: {
    optInState: PromotionStatus;
    label:
      | { __typename: "DisplayNameTitle"; name: string }
      | { __typename: "DisplayNameTranslationKey"; translationKey: string };
    link: {
      label:
        | { __typename: "DisplayNameTitle"; name: string }
        | { __typename: "DisplayNameTranslationKey"; translationKey: string };
      viewLink: { viewUrn: string; viewUrl: string; viewDisplayMode: DisplayMode | null };
    } | null;
  };
  termsAndConditions: {
    summary: string | null;
    link: {
      label:
        | { __typename: "DisplayNameTitle"; name: string }
        | { __typename: "DisplayNameTranslationKey"; translationKey: string };
      viewLink: { viewUrn: string; viewUrl: string; viewDisplayMode: DisplayMode | null };
    } | null;
  };
};

export type OptinCppPromoMutationVariables = Exact<{
  urn: Scalars["URN"]["input"];
}>;

export type OptinCppPromoMutation = { optinCppPromo: LoyaltyPromotionFragment | {} | null };

export type MiniPromoBannerCardFragment = {
  __typename: "MiniPromoBannerCard";
  urn: string;
  theme: PromoTheme;
  loyaltyPromotion: LoyaltyPromotionFragment;
};

export type LoyaltyPromoCardFragment = {
  __typename: "LoyaltyPromoCard";
  urn: string;
  theme: PromoTheme;
  loyaltyPromotion: LoyaltyPromotionFragment;
};

export type LoyaltyPromoCardUserDetailsFragment = {
  __typename: "AppContextDetails";
  brandSettings: Array<{ name: string; isActive: boolean }>;
};

export type LoyaltyPromoCardQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type LoyaltyPromoCardQuery = {
  Cards: Array<LoyaltyPromoCardFragment | MiniPromoBannerCardFragment | {} | null> | null;
};

export type LoyaltyPromoCardUserDetailsQueryVariables = Exact<{ [key: string]: never }>;

export type LoyaltyPromoCardUserDetailsQuery = { AppContext: LoyaltyPromoCardUserDetailsFragment };

export type PopularBettingOpportunityIsPotentialBetFragment = {
  __typename: "PopularBettingOpportunity";
  urn: string;
  selections: Array<{
    __typename: "BettingOpportunitySelection";
    runnerLiveData: { __typename: "SportsbookRunnerLiveData"; urn: string; isPotentialBet: boolean | null } | null;
  }>;
};

export type PriceBoostMultiplePromoCardCombinedOddsFragment = {
  __typename: "PopularBettingOpportunity";
  urn: string;
  odds: {
    decimal: number;
    american: number | null;
    fractional: { numerator: number; denominator: number } | null;
  } | null;
  originalOdds: {
    decimal: number;
    american: number | null;
    fractional: { numerator: number; denominator: number } | null;
  } | null;
};

export type PriceBoostMultiplePromoCardUserDetailsFragment = {
  __typename: "AppContextDetails";
  brandSettings: Array<{ name: string; isActive: boolean }>;
  userdetails: { localeCode: string };
  preferences: { sportsbookOddsDisplay: { urn: string; selectedOddsDisplayFormat: OddsDisplayFormat } };
};

export type PriceBoostMultiplePromoCardTermsAndConditionsFragment = {
  summary: string | null;
  link: {
    label: { name: string } | { translationKey: string };
    viewLink: { viewUrn: string; viewUrl: string; viewDisplayMode: DisplayMode | null };
  } | null;
};

export type PriceBoostMultiplePromoCardPopularBettingOpportunityFragment = {
  __typename: "PopularBettingOpportunity";
  urn: string;
  count: number;
  displayName: string | null;
  type: BettingOpportunityType | null;
  bettingOpportunityId: string;
  selections: Array<{
    __typename: "BettingOpportunitySelection";
    market: { urn: string };
    runner: { runnerURN: string; selectionId: number };
    raceRunner: {
      __typename: "RaceRunner";
      urn: string;
      raceURN: string;
      selectionId: number;
      horse: { name: string; age: number; color: HorseColor; sex: HorseSex };
      details: { jockeyName: string | null; trainerName: string | null; silk: string | null; saddleCloth: string };
    } | null;
  }>;
};

export type PriceBoostMultiplePromoCardFragment = {
  __typename: "PriceBoostMultiplePromoCard";
  urn: string;
  theme: PromoTheme;
  title: string;
  subTitle: string | null;
  wasPrice: boolean;
  termsAndConditions: PriceBoostMultiplePromoCardTermsAndConditionsFragment | null;
  popularbettingopportunity: PriceBoostMultiplePromoCardPopularBettingOpportunityFragment;
  promoTag: { iconTag: IconTag } | { label: string } | null;
  priceBoostMultipleImage: { url: string } | null;
  promoAction: {
    __typename: "PromoNavigationAction";
    link: { viewLink: { viewUrn: string; viewUrl: string; viewDisplayMode: DisplayMode | null } };
  } | null;
};

export type PriceBoostMultiplePromoCardQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type PriceBoostMultiplePromoCardQuery = { Cards: Array<PriceBoostMultiplePromoCardFragment | {} | null> | null };

export type PriceBoostMultiplePromoCardUserDetailsQueryVariables = Exact<{ [key: string]: never }>;

export type PriceBoostMultiplePromoCardUserDetailsQuery = {
  AppContext: PriceBoostMultiplePromoCardUserDetailsFragment;
};

export type PromotionsCardGroupFragment = {
  __typename: "PromotionsCardGroup";
  urn: string;
  promotionsCardGroupTitle: { name: string } | { translationKey: string } | null;
  items: {
    edges: Array<{
      node:
        | BetOpportunityPromoCardFragment
        | EditorialPromoCardFragment
        | LoyaltyPromoCardFragment
        | PriceBoostMultiplePromoCardFragment
        | SelectionPromoCardFragment
        | {};
    } | null>;
  };
  partials: {
    edges: Array<{
      node:
        | { __typename: "BetOpportunityPromoCard"; urn: string }
        | { __typename: "EditorialPromoCard"; urn: string }
        | { __typename: "LoyaltyPromoCard"; urn: string }
        | { __typename: "PriceBoostMultiplePromoCard"; urn: string }
        | { __typename: "PromotionCard" }
        | { __typename: "SelectionPromoCard"; urn: string };
    } | null>;
  };
};

export type PromotionsCardGroupQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type PromotionsCardGroupQuery = { Cards: Array<PromotionsCardGroupFragment | {} | null> | null };

export type PromotionsCardGroupUserDetailsQueryVariables = Exact<{ [key: string]: never }>;

export type PromotionsCardGroupUserDetailsQuery = {
  AppContext: { __typename: "AppContextDetails"; brandSettings: Array<{ name: string; isActive: boolean }> };
};

export type PromotionsHubCardTermsAndConditionsFragment = {
  summary: string | null;
  link: {
    label: { name: string } | { translationKey: string };
    viewLink: { viewUrn: string; viewUrl: string; viewDisplayMode: DisplayMode | null };
  } | null;
};

export type PromotionsHubPromotionFieldsFragment = {
  urn: string;
  name: string;
  title: string | null;
  description: string | null;
  status: PromoStatus | null;
  promoCode: string;
  showTimeLeft: boolean | null;
  canOptIn: boolean | null;
  canConsent: boolean | null;
  eligible: boolean | null;
  hasAccepted: boolean | null;
  optInState: OptInState | null;
  optInStartDate: string | null;
  promoStateExpiryDate: string | null;
  steps: Array<{ action: string; completed: boolean }> | null;
  badge: { text: string; state: BadgeState } | null;
  termsAndConditions: PromotionsHubCardTermsAndConditionsFragment;
  action: {
    label: string;
    actionType: PromoActionType;
    viewLink: { viewUrn: string; viewUrl: string; viewDisplayMode: DisplayMode | null } | null;
  } | null;
  images: Array<{ url: string; width: number; height: number; tag: string | null }> | null;
};

export type PromotionsHubCardFragment = {
  __typename: "PromotionsHubCard";
  urn: string;
  theme: PromoTheme;
  promotionsHubPromotion: PromotionsHubPromotionFieldsFragment;
};

export type OptinCppPromoHubCardMutationVariables = Exact<{
  urn: Scalars["URN"]["input"];
  productExclusions: InputMaybe<Array<ProductExclusion> | ProductExclusion>;
}>;

export type OptinCppPromoHubCardMutation = { optinCppPromo: PromotionsHubPromotionFieldsFragment | {} | null };

export type PromotionsHubCardQueryVariables = Exact<{
  urn: Scalars["URN"]["input"];
  productExclusions: InputMaybe<Array<ProductExclusion> | ProductExclusion>;
}>;

export type PromotionsHubCardQuery = { Cards: Array<PromotionsHubCardFragment | {} | null> | null };

export type LocalPromotionsHubCardGroupFragment = {
  __typename: "PromotionsHubCardGroup";
  urn: string;
  selectedPebble: string | null;
};

export type PromotionsHubCardGroupFragment = {
  __typename: "PromotionsHubCardGroup";
  urn: string;
  emptyState: boolean | null;
  filterOptions: { promoTagGroups: Array<{ urn: string; label: string; count: number }> } | null;
};

export type PromotionsHubCardGroupQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
  filterBy: InputMaybe<PromotionsHubFilterBy>;
  productExclusions: InputMaybe<Array<ProductExclusion> | ProductExclusion>;
}>;

export type PromotionsHubCardGroupQuery = {
  Cards: Array<
    | ({
        items: { edges: Array<{ node: PromotionsHubCardFragment } | null> };
        partials: { edges: Array<{ node: { urn: string } } | null> };
      } & PromotionsHubCardGroupFragment)
    | {}
    | null
  > | null;
};

export type PromotionsHubCardGroupItemsQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
  filterBy: InputMaybe<PromotionsHubFilterBy>;
  productExclusions: InputMaybe<Array<ProductExclusion> | ProductExclusion>;
}>;

export type PromotionsHubCardGroupItemsQuery = {
  Cards: Array<
    | {
        __typename: "PromotionsHubCardGroup";
        urn: string;
        items: { edges: Array<{ node: PromotionsHubCardFragment } | null> };
        partials: { edges: Array<{ node: { urn: string } } | null> };
      }
    | {}
    | null
  > | null;
};

export type IsPotentialBetFragment = {
  __typename: "SportsbookRunnerLiveData";
  urn: string;
  isPotentialBet: boolean | null;
};

export type SelectionPromoCardMarketLiveDataFragment = {
  __typename: "SportsbookMarketLiveData";
  urn: string;
  sportsbookMarketStatus: SportsbookMarketStatus;
  bspMarket: boolean;
  runners: Array<{
    urn: string;
    runnerURN: string;
    runnerStatus: SportsbookRunnerStatus;
    odds: { decimal: number; fractional: { numerator: number; denominator: number } | null } | null;
    displayOdds: { decimal: number; fractional: { numerator: number; denominator: number } | null } | null;
    previousOdds: Array<{
      odds: { decimal: number; fractional: { numerator: number; denominator: number } | null } | null;
      displayOdds: { decimal: number; fractional: { numerator: number; denominator: number } | null } | null;
    } | null> | null;
  } | null>;
};

export type SelectionPromoCardUserDetailsFragment = {
  __typename: "AppContextDetails";
  brandSettings: Array<{ name: string; isActive: boolean }>;
  userdetails: { localeCode: string };
  preferences: { sportsbookOddsDisplay: { urn: string; selectedOddsDisplayFormat: OddsDisplayFormat } };
};

export type SelectionPromoCardTermsAndConditionsFragment = {
  summary: string | null;
  link: {
    label: { name: string } | { translationKey: string };
    viewLink: { viewUrn: string; viewUrl: string; viewDisplayMode: DisplayMode | null };
  } | null;
};

export type SelectionPromoCardFragment = {
  __typename: "SelectionPromoCard";
  urn: string;
  theme: PromoTheme;
  title: string;
  subTitle: string | null;
  termsAndConditions: SelectionPromoCardTermsAndConditionsFragment | null;
  cta:
    | {
        __typename: "PromotionAddToBetslipAction";
        displayPreviousOdd: boolean;
        market: {
          urn: string;
          isOddsboostMarketType: boolean | null;
          liveData: SelectionPromoCardMarketLiveDataFragment | null;
          hierarchy:
            | { __typename: "EventCompetitionHierarchy"; sportevent: { urn: string }; competition: { urn: string } }
            | { __typename: "EventHierarchy"; sportevent: { __typename: "SportsEvent"; urn: string } }
            | {
                __typename: "RaceHierarchy";
                race: { __typename: "Race"; urn: string };
                meeting: { __typename: "Meeting"; urn: string };
              };
        };
        runner: { runnerURN: string };
      }
    | {
        __typename: "PromotionAddToBetslipAndNavigateAction";
        displayPreviousOdd: boolean;
        market: {
          urn: string;
          isOddsboostMarketType: boolean | null;
          liveData: SelectionPromoCardMarketLiveDataFragment | null;
        };
        runner: { runnerURN: string };
        viewLink: { viewUrn: string; viewUrl: string; viewDisplayMode: DisplayMode | null };
      };
  promoTag: { iconTag: IconTag } | { label: string } | null;
  selectionImage: { url: string } | null;
};

export type SelectionPromoCardQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type SelectionPromoCardQuery = { Cards: Array<SelectionPromoCardFragment | {} | null> | null };

export type SelectionPromoCardUserDetailsQueryVariables = Exact<{ [key: string]: never }>;

export type SelectionPromoCardUserDetailsQuery = { AppContext: SelectionPromoCardUserDetailsFragment };

export type CouponRefreshCardFragment = {
  __typename: "FilteredCouponCardGroup";
  urn: string;
  itemsHash: string | null;
};

export type CouponRefreshCardQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
  filteredCouponFilterBy: InputMaybe<FilteredCouponFilterBy>;
  sortBy: InputMaybe<FilteredGroupSort>;
}>;

export type CouponRefreshCardQuery = { Cards: Array<CouponRefreshCardFragment | {} | null> | null };

export type EmbeddedViewCardAppContextFragment = {
  __typename: "AppContextDetails";
  urn: string;
  userdetails: { localeCode: string; timezone: string };
};

export type EmbeddedViewCardFragment = {
  __typename: "EmbeddedViewCard";
  urn: string;
  text: string;
  url: string;
  appEnv: string | null;
};

export type EmbeddedViewCardQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type EmbeddedViewCardQuery = { Cards: Array<EmbeddedViewCardFragment | {} | null> | null };

export type EmbeddedViewCardAppContextQueryVariables = Exact<{ [key: string]: never }>;

export type EmbeddedViewCardAppContextQuery = { AppContext: EmbeddedViewCardAppContextFragment };

export type BroadcastsCardFragment = {
  __typename: "BroadcastsCard";
  urn: string;
  isCollapsed: boolean;
  broadcasts: { dataVizUrl: string | null; liveVideoUrl: string | null };
};

export type BroadcastsCardQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type BroadcastsCardQuery = { Cards: Array<BroadcastsCardFragment | {} | null> | null };

export type EmbeddedContentCardFragment = {
  __typename: "EmbeddedContentCard";
  urn: string;
  contentUrl: string;
  contentTitle: { __typename: "DisplayNameTitle"; name: string } | { __typename: "DisplayNameTranslationKey" };
};

export type EmbeddedContentCardQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type EmbeddedContentCardQuery = { Cards: Array<EmbeddedContentCardFragment | {} | null> | null };

export type IncidentsCardFragment = {
  __typename: "IncidentsCard";
  urn: string;
  isHighlighted: boolean;
  showEmptyState: boolean;
  fixture: {
    urn: string;
    incidents: Array<{
      period: FootballMatchPeriod | null;
      periodStatus: FootballPeriodStatus | null;
      clock: { minute: number | null } | null;
      details:
        | {
            __typename: "CardIncident";
            cardType: CardIncidentType | null;
            side: FixtureTeamSide | null;
            player: { id: string | null; name: string | null; startingType: FootballPlayerStartingType | null } | null;
          }
        | {
            __typename: "GoalIncident";
            goalType: GoalIncidentType | null;
            side: FixtureTeamSide | null;
            goalScorer: {
              id: string | null;
              name: string | null;
              startingType: FootballPlayerStartingType | null;
            } | null;
          }
        | {}
        | null;
    } | null> | null;
  };
};

export type IncidentsCardQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type IncidentsCardQuery = { Cards: Array<IncidentsCardFragment | {} | null> | null };

export type RugbyLeagueFixtureUserDetailsFragment = {
  urn: string;
  userdetails: { timezone: string; localeCodeBcp47: string; jurisdiction: { jurisdiction: string } };
  brandSettings: Array<{ name: string; isActive: boolean }>;
};

export type RugbyLeagueFixtureFragment = {
  __typename: "RugbyLeagueFixture";
  urn: string;
  isAmericanFormat: boolean;
  runnerNames: { home: string; away: string } | null;
  score: { scoreHome: number; scoreAway: number } | null;
  halfTimeScore: { halfTimeScoreHome: number; halfTimeScoreAway: number } | null;
  sportevent: { openDate: string; name: string; competition: { name: string } | null };
};

export type RugbyLeagueFixtureUserDetailsQueryVariables = Exact<{ [key: string]: never }>;

export type RugbyLeagueFixtureUserDetailsQuery = { AppContext: RugbyLeagueFixtureUserDetailsFragment };

export type RugbyLeagueFixtureQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type RugbyLeagueFixtureQuery = { Fixtures: Array<RugbyLeagueFixtureFragment | {} | null> | null };

export type StatsBroadcastsCardFragment = {
  __typename: "StatsBroadcastsCard";
  urn: string;
  broadcasts: { liveVideoUrl: string | null; dataVizUrl: string | null };
  sport: { urn: string; sportId: number };
};

export type StatsBroadcastsCardQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type StatsBroadcastsCardQuery = { Cards: Array<StatsBroadcastsCardFragment | {} | null> | null };

export type StatsFormCardRecentFormFragment = {
  __typename: "StatsFormCard";
  urn: string;
  fixture: {
    urn: string;
    scheduledAt: string | null;
    home: { name: string };
    away: { name: string };
    recentForm: {
      home: Array<{
        outcome: FixtureOutcome | null;
        score: { home: number | null; away: number | null } | null;
      } | null> | null;
      away: Array<{
        outcome: FixtureOutcome | null;
        score: { home: number | null; away: number | null } | null;
      } | null> | null;
    } | null;
    homeStanding: { rank: { position: number | null } | null; team: { name: string | null } | null } | null;
    awayStanding: { rank: { position: number | null } | null; team: { name: string | null } | null } | null;
  };
};

export type StatsFormCardCompetitionFormFragment = {
  __typename: "StatsFormCard";
  urn: string;
  fixture: {
    urn: string;
    scheduledAt: string | null;
    home: { name: string };
    away: { name: string };
    competitionForm: {
      home: Array<{
        side: FixtureTeamSide | null;
        outcome: FixtureOutcome | null;
        opponent: string | null;
        score: { home: number | null; away: number | null } | null;
      } | null> | null;
      away: Array<{
        side: FixtureTeamSide | null;
        outcome: FixtureOutcome | null;
        opponent: string | null;
        score: { home: number | null; away: number | null } | null;
      } | null> | null;
    } | null;
    homeStanding: { rank: { position: number | null } | null; team: { name: string | null } | null } | null;
    awayStanding: { rank: { position: number | null } | null; team: { name: string | null } | null } | null;
  };
};

export type StatsFormCardQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
  isRecent: Scalars["Boolean"]["input"];
  isCompetition: Scalars["Boolean"]["input"];
}>;

export type StatsFormCardQuery = {
  Cards: Array<(StatsFormCardRecentFormFragment & StatsFormCardCompetitionFormFragment) | {} | null> | null;
};

export type StatsGoalsAndShotsCardFragment = {
  __typename: "StatsGoalsAndShotsCard";
  urn: string;
  fixture: {
    urn: string;
    home: {
      name: string;
      statsAllSeason: {
        averageShotsOnTarget: number | null;
        averageGoalsConceded: { firstHalf: number | null; secondHalf: number | null; overall: number | null } | null;
        averageGoalsScored: { firstHalf: number | null; secondHalf: number | null; overall: number | null } | null;
      } | null;
    };
    away: {
      name: string;
      statsAllSeason: {
        averageShotsOnTarget: number | null;
        averageGoalsConceded: { firstHalf: number | null; secondHalf: number | null; overall: number | null } | null;
        averageGoalsScored: { firstHalf: number | null; secondHalf: number | null; overall: number | null } | null;
      } | null;
    };
  };
};

export type StatsGoalsAndShotsCardQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type StatsGoalsAndShotsCardQuery = { Cards: Array<StatsGoalsAndShotsCardFragment | {} | null> | null };

export type StatsHeadToHeadUserDetailsFragment = {
  __typename: "AppContextDetails";
  urn: string;
  userdetails: { localeCodeBcp47: string; timezone: string };
};

export type StatsHeadToHeadCardFragment = {
  __typename: "StatsHeadToHeadCard";
  urn: string;
  fixture: {
    urn: string;
    scheduledAt: string | null;
    head2head: {
      home: Array<{
        opponent: string | null;
        startAt: string | null;
        side: FixtureTeamSide | null;
        score: { home: number | null; away: number | null } | null;
      } | null> | null;
      away: Array<{
        opponent: string | null;
        startAt: string | null;
        score: { home: number | null; away: number | null } | null;
      } | null> | null;
    } | null;
  };
};

export type StatsHeadToHeadUserDetailsQueryVariables = Exact<{ [key: string]: never }>;

export type StatsHeadToHeadUserDetailsQuery = { AppContext: StatsHeadToHeadUserDetailsFragment };

export type StatsHeadToHeadCardQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type StatsHeadToHeadCardQuery = { Cards: Array<StatsHeadToHeadCardFragment | {} | null> | null };

export type StatsLeagueTableCardFragment = {
  __typename: "StatsTableCard";
  urn: string;
  fixture: {
    urn: string;
    competition: {
      id: string | null;
      stages: Array<{
        standings: Array<{
          gamesPlayed: number | null;
          win: number | null;
          loss: number | null;
          draw: number | null;
          points: number | null;
          goalsDifference: number | null;
          team: { name: string } | null;
          rank: { position: number | null; status: RankStatus | null; change: RankChange | null } | null;
        } | null> | null;
      } | null> | null;
    } | null;
  };
};

export type StatsLeagueTableCardQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type StatsLeagueTableCardQuery = { Cards: Array<StatsLeagueTableCardFragment | {} | null> | null };

export type StatsLineupsCardFragment = {
  __typename: "StatsLineupsCard";
  urn: string;
  hasFormationInfo: boolean;
  status: FootballPeriodStatus | null;
  fixture: {
    urn: string;
    home: {
      name: string;
      formation: string | null;
      jerseys: Array<TeamJerseyFragment | null> | null;
      squad: { manager: string | null; players: Array<LineupFootballPlayerFragment | null> | null } | null;
    };
    away: {
      name: string;
      formation: string | null;
      jerseys: Array<TeamJerseyFragment | null> | null;
      squad: { manager: string | null; players: Array<LineupFootballPlayerFragment | null> | null } | null;
    };
    incidents: Array<LineupFootballIncidentFragment | null> | null;
  };
  footballPlayerViewLinks: Array<{ viewUrl: string; viewUrn: string; footballPlayer: { urn: string } }> | null;
};

export type TeamJerseyFragment = { color: string | null; url: string | null; type: string | null };

export type LineupFootballPlayerFragment = {
  id: string | null;
  name: string | null;
  matchName: string | null;
  shirtNumber: number | null;
  position: FootballPlayerPosition | null;
  startingType: FootballPlayerStartingType | null;
  formationPlace: string | null;
};

export type LineupFootballIncidentFragment = {
  period: FootballMatchPeriod | null;
  periodStatus: FootballPeriodStatus | null;
  clock: { minute: number | null } | null;
  details:
    | { __typename: "AttackIncident" }
    | {
        __typename: "CardIncident";
        cardType: CardIncidentType | null;
        side: FixtureTeamSide | null;
        player: LineupFootballPlayerFragment | null;
      }
    | { __typename: "FoulIncident" }
    | {
        __typename: "GoalIncident";
        goalType: GoalIncidentType | null;
        side: FixtureTeamSide | null;
        goalScorer: LineupFootballPlayerFragment | null;
        assist: LineupFootballPlayerFragment | null;
      }
    | { __typename: "PenaltyIncident" }
    | {
        __typename: "PenaltyShootoutIncident";
        side: FixtureTeamSide | null;
        penaltyShootoutType: PenaltyShootoutIncidentType | null;
        player: LineupFootballPlayerFragment | null;
      }
    | { __typename: "PeriodIncident" }
    | { __typename: "SetPieceIncident" }
    | { __typename: "ShotIncident" }
    | {
        __typename: "SubstitutionIncident";
        side: FixtureTeamSide | null;
        playerIn: LineupFootballPlayerFragment | null;
        playerOut: LineupFootballPlayerFragment | null;
      }
    | null;
};

export type StatsLineupsCardQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type StatsLineupsCardQuery = { Cards: Array<StatsLineupsCardFragment | {} | null> | null };

export type FootballGameStatsFragment = {
  __typename: "FootballGameStats";
  attacks: number | null;
  dangerousAttacks: number | null;
  possession: number | null;
  corners: number | null;
  yellowCards: number | null;
  redCards: number | null;
  shotsOnTarget: number | null;
  shotsOffTarget: number | null;
};

export type StatsMatchStatsCardFragment = {
  __typename: "StatsMatchStatsCard";
  urn: string;
  fixture: {
    urn: string;
    stats: Array<{
      __typename: "FootballStats";
      period: FootballMatchPeriod | null;
      periodStatus: FootballPeriodStatus | null;
      home: FootballGameStatsFragment | null;
      away: FootballGameStatsFragment | null;
    } | null> | null;
  };
};

export type StatsMatchStatsCardQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type StatsMatchStatsCardQuery = { Cards: Array<StatsMatchStatsCardFragment | {} | null> | null };

export type FootballPlayerFixtureSeasonStatsFragment = {
  matchesPlayed: number | null;
  totals: {
    goals: number;
    firstGoalScored: number | null;
    lastGoalScored: number | null;
    shotsOnTarget: number | null;
    yellowCards: number;
    redCards: number;
    assists: number | null;
    tacklesMade: number | null;
    fouls: number | null;
  } | null;
};

export type FootballPlayerFixtureFragment = {
  id: string | null;
  urn: string;
  name: string;
  seasonStats: FootballPlayerFixtureSeasonStatsFragment | null;
};

export type StatsPlayersSeasonStatsCardAttackingFragment = {
  __typename: "StatsPlayersSeasonStatsCard";
  urn: string;
  fixture: {
    urn: string;
    players: Array<FootballPlayerFixtureFragment | null> | null;
    home: { name: string; squad: { players: Array<{ id: string | null } | null> | null } | null };
    away: { name: string; squad: { players: Array<{ id: string | null } | null> | null } | null };
  };
  footballPlayerViewLinks: Array<{
    viewUrl: string;
    viewUrn: string;
    footballPlayer: FootballPlayerFixtureFragment;
  }> | null;
};

export type StatsPlayersSeasonStatsCardDefendingFragment = {
  __typename: "StatsPlayersSeasonStatsCard";
  urn: string;
  fixture: {
    urn: string;
    players: Array<FootballPlayerFixtureFragment | null> | null;
    home: { name: string; squad: { players: Array<{ id: string | null } | null> | null } | null };
    away: { name: string; squad: { players: Array<{ id: string | null } | null> | null } | null };
  };
  footballPlayerViewLinks: Array<{
    viewUrl: string;
    viewUrn: string;
    footballPlayer: FootballPlayerFixtureFragment;
  }> | null;
};

export type StatsPlayersSeasonStatsCardQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
  isAttacking: Scalars["Boolean"]["input"];
}>;

export type StatsPlayersSeasonStatsCardQuery = {
  Cards: Array<
    (StatsPlayersSeasonStatsCardAttackingFragment & StatsPlayersSeasonStatsCardDefendingFragment) | {} | null
  > | null;
};

export type StatsPlayersSeasonStatsUserDetailsFragment = {
  __typename: "AppContextDetails";
  throttles: Array<{ name: string; isActive: boolean }>;
};

export type StatsPlayersSeasonStatsUserDetailsQueryVariables = Exact<{ [key: string]: never }>;

export type StatsPlayersSeasonStatsUserDetailsQuery = { AppContext: StatsPlayersSeasonStatsUserDetailsFragment };

export type StatsTeamsCardPreviousFiveFragment = {
  __typename: "StatsTeamsCard";
  urn: string;
  fixture: {
    urn: string;
    teams: Array<{
      urn: string;
      name: string;
      statsPreviousFive: {
        averageShots: number | null;
        averageGoalsScored: AverageTeamStatsFragment | null;
        averageGoalsConceded: AverageTeamStatsFragment | null;
        averageCorners: AverageTeamStatsFragment | null;
        averageBookingPoints: AverageTeamStatsFragment | null;
        bothTeamsToScore: BothTeamsToScoreFragment | null;
      } | null;
    } | null> | null;
  };
};

export type StatsTeamsCardAllSeasonFragment = {
  __typename: "StatsTeamsCard";
  urn: string;
  fixture: {
    urn: string;
    teams: Array<{
      urn: string;
      name: string;
      statsAllSeason: {
        averageShots: number | null;
        averageGoalsScored: AverageTeamStatsFragment | null;
        averageGoalsConceded: AverageTeamStatsFragment | null;
        averageCorners: AverageTeamStatsFragment | null;
        averageBookingPoints: AverageTeamStatsFragment | null;
        bothTeamsToScore: BothTeamsToScoreFragment | null;
      } | null;
    } | null> | null;
  };
};

export type AverageTeamStatsFragment = {
  firstHalf: number | null;
  secondHalf: number | null;
  home: number | null;
  away: number | null;
  overall: number | null;
};

export type BothTeamsToScoreFragment = { percentage: number | null };

export type StatsTeamsCardQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
  isPreviousFive: Scalars["Boolean"]["input"];
  isAllSeason: Scalars["Boolean"]["input"];
}>;

export type StatsTeamsCardQuery = {
  Cards: Array<(StatsTeamsCardPreviousFiveFragment & StatsTeamsCardAllSeasonFragment) | {} | null> | null;
};

export type TeamLineupCardFragment = {
  __typename: "TeamLineupCard";
  urn: string;
  fixture: {
    urn: string;
    home: { squad: { manager: string | null; players: Array<LineupFootballPlayerFragment | null> | null } | null };
    away: { squad: { manager: string | null; players: Array<LineupFootballPlayerFragment | null> | null } | null };
    incidents: Array<LineupFootballIncidentFragment | null> | null;
  };
};

export type TeamLineupCardQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type TeamLineupCardQuery = { Cards: Array<TeamLineupCardFragment | {} | null> | null };

export type IsSubscribedFragment = { __typename: "SportsEvent"; urn: string; isSubscribed: boolean | null };

export type TennisFixtureUserDetailsFragment = {
  urn: string;
  brandSettings: Array<{ name: string; isActive: boolean }>;
  userdetails: { timezone: string; localeCodeBcp47: string; jurisdiction: { jurisdiction: string } };
};

export type TennisFixtureFragment = {
  __typename: "TennisMatch";
  urn: string;
  isAmericanFormat: boolean;
  scheduledStartTime: string;
  surface: TennisSurface | null;
  teamAScore: number | null;
  teamBScore: number | null;
  runnerNames: { home: string; away: string } | null;
  status: { status: TennisStatus; reason: TennisStatusReason | null } | null;
  currentSet: {
    number: number;
    teamAScore: number;
    teamBScore: number;
    duration: number | null;
    currentGame: { number: number; teamAScore: string; teamBScore: string; teamServing: TeamSide | null } | null;
  } | null;
  sportevent: { urn: string; name: string; openDate: string; competition: { name: string } | null };
};

export type TennisFixtureUserDetailsQueryVariables = Exact<{ [key: string]: never }>;

export type TennisFixtureUserDetailsQuery = { AppContext: TennisFixtureUserDetailsFragment };

export type TennisFixtureQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type TennisFixtureQuery = { Fixtures: Array<TennisFixtureFragment | {} | null> | null };

export type VolleyballFixtureUserDetailsFragment = {
  __typename: "AppContextDetails";
  urn: string;
  brandSettings: Array<{ name: string; isActive: boolean }>;
  userdetails: { timezone: string; localeCodeBcp47: string; jurisdiction: { jurisdiction: string } };
};

export type VolleyballFixtureFragment = {
  __typename: "VolleyballFixture";
  urn: string;
  isAmericanFormat: boolean;
  homeScore: number | null;
  awayScore: number | null;
  runnerNames: { home: string; away: string } | null;
  sportevent: { urn: string; name: string; openDate: string; competition: { name: string } | null };
  currentSet: {
    volleyballSetNumber: number | null;
    volleyballCurrentServer: TeamSide | null;
    volleyballSetScore: { home: number; away: number } | null;
  } | null;
  previousSets: Array<{
    volleyballSetNumber: number | null;
    volleyballCurrentServer: TeamSide | null;
    volleyballSetScore: { home: number; away: number } | null;
  } | null> | null;
};

export type VolleyballFixtureUserDetailsQueryVariables = Exact<{ [key: string]: never }>;

export type VolleyballFixtureUserDetailsQuery = { AppContext: VolleyballFixtureUserDetailsFragment };

export type VolleyballFixtureQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type VolleyballFixtureQuery = { Fixtures: Array<VolleyballFixtureFragment | {} | null> | null };

export type LocalLottoCardFragment = { __typename: "LottoCard"; urn: string; selectedLottoPebble: string | null };

export type LottoCardUserDetailsFragment = {
  __typename: "AppContextDetails";
  urn: string;
  preferences: { sportsbookOddsDisplay: { urn: string; selectedOddsDisplayFormat: OddsDisplayFormat } };
  userdetails: { localeCodeBcp47: string; timezone: string };
};

export type LottoCardOddsFragment = {
  __typename: "LottoCard";
  urn: string;
  winAvgOdds: Array<{
    decimalDisplayOdds: { decimalOdds: number | null } | null;
    fractionalDisplayOdds: { numerator: number; denominator: number } | null;
  } | null> | null;
};

export type LottoCardFragment = {
  __typename: "LottoCard";
  urn: string;
  shouldShowCompetitionName: boolean;
  marketIds: Array<string> | null;
  competition: { __typename: "Competition"; urn: string; name: string };
  lottoMarkets: Array<{
    __typename: "SportsbookMarket";
    urn: string;
    name: string;
    marketType: string;
    liveData: { urn: string; sportsbookMarketStatus: SportsbookMarketStatus } | null;
    hierarchy:
      | {
          sportevent: { __typename: "SportsEvent"; urn: string; name: string; openDate: string };
          competition: { urn: string };
        }
      | { sportevent: { __typename: "SportsEvent"; urn: string; name: string; openDate: string } }
      | {};
    runners: Array<{ runnerURN: string; selectionId: number; name: string; resultType: string | null }>;
  }> | null;
} & LocalLottoCardFragment;

export type LottoCardOddsQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type LottoCardOddsQuery = { Cards: Array<LottoCardOddsFragment | {} | null> | null };

export type LottoCardQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type LottoCardQuery = { Cards: Array<LottoCardFragment | {} | null> | null };

export type LottoCardUserDetailsQueryVariables = Exact<{ [key: string]: never }>;

export type LottoCardUserDetailsQuery = { AppContext: LottoCardUserDetailsFragment };

export type PenaltyTakersRunnerFragment = {
  __typename: "Runner";
  runnerURN: string;
  name: string;
  selectionId: number;
  resultType: string | null;
  market:
    | { urn: string; name: string; liveData: { urn: string; sportsbookMarketStatus: SportsbookMarketStatus } | null }
    | {}
    | null;
  runnerLiveData:
    | {
        urn: string;
        runnerURN: string;
        runnerStatus: SportsbookRunnerStatus;
        odds: { decimal: number; fractional: { numerator: number; denominator: number } | null } | null;
        displayOdds: { decimal: number; fractional: { numerator: number; denominator: number } | null } | null;
      }
    | {}
    | null;
};

export type PenaltyTakersCardIsPotentialBetFragment = {
  __typename: "PenaltyTakersCard";
  urn: string;
  penaltyTakers: Array<{
    toScore: {
      topLeft: {
        runnerLiveData:
          | { __typename: "SportsbookRunnerLiveData"; urn: string; isPotentialBet: boolean | null }
          | {}
          | null;
      };
      topCenter: {
        runnerLiveData:
          | { __typename: "SportsbookRunnerLiveData"; urn: string; isPotentialBet: boolean | null }
          | {}
          | null;
      };
      topRight: {
        runnerLiveData:
          | { __typename: "SportsbookRunnerLiveData"; urn: string; isPotentialBet: boolean | null }
          | {}
          | null;
      };
      bottomLeft: {
        runnerLiveData:
          | { __typename: "SportsbookRunnerLiveData"; urn: string; isPotentialBet: boolean | null }
          | {}
          | null;
      };
      bottomCenter: {
        runnerLiveData:
          | { __typename: "SportsbookRunnerLiveData"; urn: string; isPotentialBet: boolean | null }
          | {}
          | null;
      };
      bottomRight: {
        runnerLiveData:
          | { __typename: "SportsbookRunnerLiveData"; urn: string; isPotentialBet: boolean | null }
          | {}
          | null;
      };
    };
    toMiss: {
      leftPostMiss: {
        runnerLiveData:
          | { __typename: "SportsbookRunnerLiveData"; urn: string; isPotentialBet: boolean | null }
          | {}
          | null;
      };
      skyrocketCrossbar: {
        runnerLiveData:
          | { __typename: "SportsbookRunnerLiveData"; urn: string; isPotentialBet: boolean | null }
          | {}
          | null;
      };
      rightPostMiss: {
        runnerLiveData:
          | { __typename: "SportsbookRunnerLiveData"; urn: string; isPotentialBet: boolean | null }
          | {}
          | null;
      };
      leftSave: {
        runnerLiveData:
          | { __typename: "SportsbookRunnerLiveData"; urn: string; isPotentialBet: boolean | null }
          | {}
          | null;
      };
      centerSave: {
        runnerLiveData:
          | { __typename: "SportsbookRunnerLiveData"; urn: string; isPotentialBet: boolean | null }
          | {}
          | null;
      };
      rightSave: {
        runnerLiveData:
          | { __typename: "SportsbookRunnerLiveData"; urn: string; isPotentialBet: boolean | null }
          | {}
          | null;
      };
    };
  }>;
};

export type PenaltyTakersCardUserDetailsFragment = {
  __typename: "AppContextDetails";
  brandSettings: Array<{ name: string; isActive: boolean }>;
  userdetails: { localeCode: string };
  preferences: { sportsbookOddsDisplay: { urn: string; selectedOddsDisplayFormat: OddsDisplayFormat } };
};

export type PenaltyTakersCardFragment = {
  __typename: "PenaltyTakersCard";
  urn: string;
  penaltyTakersCardTermsAndConditionsUrl: string | null;
  penaltyTakersCardTitle: { name: string } | { translationKey: string };
  penaltyTakersCardSubtitle: { name: string } | { translationKey: string } | null;
  penaltyTakersCardFooter: { name: string } | { translationKey: string } | null;
  event: { urn: string };
  penaltyTakers: Array<{
    player: {
      __typename: "FootballPlayerFixtureContext";
      urn: string;
      player: { id: string | null; name: string } | null;
      team: { jerseys: Array<{ url: string | null } | null> | null } | null;
    };
    toScore: {
      topLeft: PenaltyTakersRunnerFragment;
      topCenter: PenaltyTakersRunnerFragment;
      topRight: PenaltyTakersRunnerFragment;
      bottomLeft: PenaltyTakersRunnerFragment;
      bottomCenter: PenaltyTakersRunnerFragment;
      bottomRight: PenaltyTakersRunnerFragment;
    };
    toMiss: {
      leftPostMiss: PenaltyTakersRunnerFragment;
      skyrocketCrossbar: PenaltyTakersRunnerFragment;
      rightPostMiss: PenaltyTakersRunnerFragment;
      leftSave: PenaltyTakersRunnerFragment;
      centerSave: PenaltyTakersRunnerFragment;
      rightSave: PenaltyTakersRunnerFragment;
    };
  }>;
};

export type PenaltyTakersCardQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type PenaltyTakersCardQuery = { Cards: Array<PenaltyTakersCardFragment | {} | null> | null };

export type PenaltyTakersCardUserDetailsQueryVariables = Exact<{ [key: string]: never }>;

export type PenaltyTakersCardUserDetailsQuery = { AppContext: PenaltyTakersCardUserDetailsFragment };

export type PlayerEventMarketsCardFragment = {
  __typename: "PlayerEventMarketsCard";
  urn: string;
  playerContext: {
    __typename: "FootballPlayerFixtureContext";
    fixture: { urn: string; home: { id: string }; away: { id: string }; sportevent: { urn: string } } | {};
    player: {
      name: string;
      shirtNumber: number | null;
      position: FootballPlayerPosition | null;
      positionDescription: string | null;
    } | null;
    team: {
      id: string;
      jerseys: Array<{ url: string | null; color: string | null; type: string | null } | null> | null;
    } | null;
  };
  playerViewLink: { viewUrl: string; viewUrn: string } | null;
  playerCardEventViewLink: { viewUrl: string; viewUrn: string } | null;
  playerCardMarketTitle: { name: string } | { translationKey: string };
  playerCardMarkets: Array<{
    label: { name: string } | { translationKey: string };
    market: { urn: string } | {};
    runner: { runnerURN: string };
  } | null>;
};

export type PlayerEventMarketsCardQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type PlayerEventMarketsCardQuery = { Cards: Array<PlayerEventMarketsCardFragment | {} | null> | null };

export type PlayersRailFragment = {
  __typename: "PlayersRail";
  urn: string;
  playersRailTitle: { name: string } | { translationKey: string } | null;
  items: { edges: Array<{ node: PlayerEventMarketsCardFragment } | null> };
  partials: { edges: Array<{ node: { __typename: "PlayerEventMarketsCard"; urn: string } } | null> };
};

export type PlayersRailQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type PlayersRailQuery = { Cards: Array<PlayersRailFragment | {} | null> | null };

export type PopularSelectionsCardFragment = {
  __typename: "PopularSelectionsCard";
  urn: string;
  title: string;
  visibleSelectionsLimit: number | null;
  isExpandable: boolean | null;
  isExpandedByDefault: boolean | null;
  popularDisplayMode: PopularSelectionsDisplayMode | null;
  popularSelectionsCardItems: Array<{
    runner: {
      runnerURN: string;
      name: string;
      selectionId: number;
      participantId: string | null;
      runnerLiveData:
        | {
            __typename: "SportsbookRunnerLiveData";
            urn: string;
            runnerStatus: SportsbookRunnerStatus;
            odds: { decimal: number; fractional: { denominator: number; numerator: number } | null } | null;
            displayOdds: { decimal: number; fractional: { denominator: number; numerator: number } | null } | null;
          }
        | {}
        | null;
    };
    market: {
      urn: string;
      name: string;
      liveData: { urn: string; sportsbookMarketStatus: SportsbookMarketStatus; bspMarket: boolean } | null;
    };
    stats: { betCount: number };
  }>;
};

export type PopularSelectionsCardEnrichedPartialFragment = {
  __typename: "PopularSelectionsCard";
  urn: string;
  title: string;
  visibleSelectionsLimit: number | null;
  isExpandable: boolean | null;
  isExpandedByDefault: boolean | null;
  popularDisplayMode: PopularSelectionsDisplayMode | null;
};

export type PopularSelectionsQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type PopularSelectionsQuery = { Cards: Array<PopularSelectionsCardFragment | {} | null> | null };

export type PopularSelectionsOddsDisplayPreferenceFragment = {
  __typename: "AppContextDetails";
  urn: string;
  preferences: { sportsbookOddsDisplay: { urn: string; selectedOddsDisplayFormat: OddsDisplayFormat } };
};

export type PopularSelectionsOddsDisplayPreferenceQueryVariables = Exact<{ [key: string]: never }>;

export type PopularSelectionsOddsDisplayPreferenceQuery = {
  AppContext: PopularSelectionsOddsDisplayPreferenceFragment;
};

export type PopularSelectionsCardPotentialBetsFragment = {
  __typename: "PopularSelectionsCard";
  urn: string;
  popularSelectionsCardItems: Array<{
    runner: {
      runnerLiveData:
        | { __typename: "SportsbookRunnerLiveData"; urn: string; isPotentialBet: boolean | null }
        | {}
        | null;
    };
  }>;
};

export type PopularSelectionsCardDisplayModeFragment = {
  __typename: "PopularSelectionsCard";
  urn: string;
  title: string;
  popularDisplayMode: PopularSelectionsDisplayMode | null;
  items: Array<{ __typename: "PopularSelectionsItem" }>;
};

export type PopularSelectionsCardQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type PopularSelectionsCardQuery = { Cards: Array<PopularSelectionsCardDisplayModeFragment | {} | null> | null };

export type PopularSelectionsCardTitleFragment = {
  __typename: "PopularSelectionsCard";
  urn: string;
  title: string;
  items: Array<{ __typename: "PopularSelectionsItem" }>;
};

export type PopularSelectionsPromoBannerQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type PopularSelectionsPromoBannerQuery = { Cards: Array<PopularSelectionsCardTitleFragment | {} | null> | null };

export type SportsbookBetButtonIsPotentialBetFragment = {
  __typename: "SportsbookRunnerLiveData";
  urn: string;
  isPotentialBet: boolean | null;
};

export type SportsbookOddsDisplayPreferenceFragment = {
  __typename: "AppContextDetails";
  urn: string;
  preferences: { sportsbookOddsDisplay: { urn: string; selectedOddsDisplayFormat: OddsDisplayFormat } };
};

export type SportsbookBetButtonRunnerFragment = {
  runnerURN: string;
  name: string;
  market:
    | {
        urn: string;
        name: string;
        isOddsboostMarketType: boolean | null;
        liveData: { urn: string; sportsbookMarketStatus: SportsbookMarketStatus; bspMarket: boolean } | null;
        hierarchy: { race: { urn: string } } | {};
      }
    | {}
    | null;
  runnerLiveData:
    | {
        urn: string;
        runnerURN: string;
        runnerStatus: SportsbookRunnerStatus;
        odds: { decimal: number; fractional: { numerator: number; denominator: number } | null } | null;
        displayOdds: { decimal: number; fractional: { numerator: number; denominator: number } | null } | null;
        previousOdds: Array<{
          odds: { decimal: number; fractional: { numerator: number; denominator: number } | null } | null;
          displayOdds: { decimal: number; fractional: { numerator: number; denominator: number } | null } | null;
        } | null> | null;
      }
    | {}
    | null;
};

export type SportsbookOddsDisplayPreferenceQueryVariables = Exact<{ [key: string]: never }>;

export type SportsbookOddsDisplayPreferenceQuery = { AppContext: SportsbookOddsDisplayPreferenceFragment };

export type SportsbookBetButtonQueryVariables = Exact<{
  runnerURNs: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type SportsbookBetButtonQuery = { Runners: Array<SportsbookBetButtonRunnerFragment | null> | null };

export type SportsbookChatbotCardFragment = {
  __typename: "SportsbookChatbotCard";
  urn: string;
  chatId: string;
  startDate: string | null;
  endDate: string | null;
  displayWindowOffset: number | null;
  chatContext: { eventId: string | null; eventName: string | null };
  infoTitle: { name: string } | { translationKey: string } | null;
  infoDescription: { name: string } | { translationKey: string } | null;
  startingPrompts: Array<{ name: string } | { translationKey: string }>;
};

export type SportsbookChatbotCardQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type SportsbookChatbotCardQuery = { Cards: Array<SportsbookChatbotCardFragment | {} | null> | null };

export type SportsbookChatbotCardChatStateFragment = { chatState: string | null };

export type SportsbookChatbotHistoryQueryVariables = Exact<{
  chatId: Scalars["ID"]["input"];
}>;

export type SportsbookChatbotHistoryQuery = {
  sportsbookChatBotHistory: {
    chatId: string;
    messages: Array<{
      urn: string;
      status: SportsbookChatBotMessageStatus;
      role: SportsbookChatBotMessageRole;
      isHistoryMessage: boolean;
      feedbackSubmitted: boolean;
      parts: Array<
        | SportsbookChatbotBetSuggestionPartFragment
        | SportsbookChatbotParticipantStatsPartFragment
        | SportsbookChatbotParticipantStatsRankingPartFragment
        | SportsbookChatbotStatsComparisonPartFragment
        | SportsbookChatbotSwimlanePartFragment
        | SportsbookChatbotTextPartFragment
        | null
      > | null;
    }>;
  };
};

export type SportsbookChatbotMessageQueryVariables = Exact<{
  messageUrn: Scalars["URN"]["input"];
}>;

export type SportsbookChatbotMessageQuery = {
  sportsbookChatBotMessage: {
    urn: string;
    status: SportsbookChatBotMessageStatus;
    role: SportsbookChatBotMessageRole;
    isHistoryMessage: boolean;
    feedbackSubmitted: boolean;
    parts: Array<
      | SportsbookChatbotBetSuggestionPartFragment
      | SportsbookChatbotParticipantStatsPartFragment
      | SportsbookChatbotParticipantStatsRankingPartFragment
      | SportsbookChatbotStatsComparisonPartFragment
      | SportsbookChatbotSwimlanePartFragment
      | SportsbookChatbotTextPartFragment
      | null
    > | null;
  };
};

export type SportsbookChatbotSendMessageMutationVariables = Exact<{
  input: SportsbookChatBotSendMessageInput;
}>;

export type SportsbookChatbotSendMessageMutation = {
  sportsbookChatBotSendMessage: { messageUrn: string; status: SportsbookChatBotMessageStatus };
};

export type SportsbookChatbotBetSuggestionPartFragment = {
  __typename: "SportsbookChatBotBetSuggestionPart";
  selections: Array<{
    runner: { runnerURN: string; marketURN: string; name: string };
    market: { name: string };
    footballFixture: {
      home: { jerseys: Array<{ url: string | null } | null> | null };
      away: { jerseys: Array<{ url: string | null } | null> | null };
    } | null;
    participant:
      | {
          __typename: "FootballPlayerFixtureContext";
          team: { jerseys: Array<{ url: string | null } | null> | null } | null;
        }
      | { __typename: "FootballTeam"; jerseys: Array<{ url: string | null } | null> | null }
      | null;
  }>;
  odds: { decimal: number; fractional: { numerator: number; denominator: number } | null } | null;
};

export type SportsbookChatbotParticipantStatsPartFragment = {
  __typename: "SportsbookChatBotParticipantStatsPart";
  participant:
    | {
        __typename: "FootballPlayerFixtureContext";
        urn: string;
        player: { name: string } | null;
        team: { jerseys: Array<{ url: string | null } | null> | null } | null;
      }
    | { __typename: "FootballTeam"; urn: string; name: string; jerseys: Array<{ url: string | null } | null> | null };
  stats: Array<{ key: string; value: string }>;
};

export type SportsbookChatbotParticipantStatsRankingPartFragment = {
  __typename: "SportsbookChatBotParticipantStatsRankingPart";
  statName: string;
  ranking: Array<{
    value: number;
    participant:
      | { __typename: "FootballPlayerFixtureContext"; urn: string; player: { name: string } | null }
      | { __typename: "FootballTeam"; urn: string; name: string; jerseys: Array<{ url: string | null } | null> | null };
  }>;
};

export type SportsbookChatbotStatsComparisonPartFragment = {
  __typename: "SportsbookChatBotStatsComparisonPart";
  participantA:
    | {
        __typename: "FootballPlayerFixtureContext";
        urn: string;
        player: { name: string } | null;
        team: { jerseys: Array<{ url: string | null } | null> | null } | null;
      }
    | { __typename: "FootballTeam"; urn: string; name: string; jerseys: Array<{ url: string | null } | null> | null };
  participantB:
    | {
        __typename: "FootballPlayerFixtureContext";
        urn: string;
        player: { name: string } | null;
        team: { jerseys: Array<{ url: string | null } | null> | null } | null;
      }
    | { __typename: "FootballTeam"; urn: string; name: string; jerseys: Array<{ url: string | null } | null> | null };
  stats: Array<{ statName: string; participantAValue: string; participantBValue: string }>;
};

export type SportsbookChatbotSwimlanePartFragment = {
  __typename: "SportsbookChatBotSwimlanePart";
  items: Array<
    | ({ __typename: "SportsbookChatBotBetSuggestionPart" } & SportsbookChatbotBetSuggestionPartFragment)
    | ({ __typename: "SportsbookChatBotParticipantStatsPart" } & SportsbookChatbotParticipantStatsPartFragment)
    | ({
        __typename: "SportsbookChatBotParticipantStatsRankingPart";
      } & SportsbookChatbotParticipantStatsRankingPartFragment)
    | ({ __typename: "SportsbookChatBotStatsComparisonPart" } & SportsbookChatbotStatsComparisonPartFragment)
    | { __typename: "SportsbookChatBotSwimlanePart" }
    | ({ __typename: "SportsbookChatBotTextPart" } & SportsbookChatbotTextPartFragment)
  >;
};

export type SportsbookChatbotTextPartFragment = { __typename: "SportsbookChatBotTextPart"; text: string };

export type SportsbookChatbotCardChatStateQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type SportsbookChatbotCardChatStateQuery = { Cards: Array<{ chatState: string | null } | {} | null> | null };

export type SportsbookChatbotInputQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type SportsbookChatbotInputQuery = {
  Cards: Array<{ startingPrompts: Array<{ name: string } | { translationKey: string }> } | {} | null> | null;
};

export type SportsbookChatbotCardChatContextQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type SportsbookChatbotCardChatContextQuery = {
  Cards: Array<{ chatContext: { eventName: string | null } } | {} | null> | null;
};

export type AppContextDetailsFragment = {
  __typename: "AppContextDetails";
  urn: string;
  userdetails: {
    accountId: number;
    loggedIn: boolean;
    region: string;
    bucketId: number;
    countryCode: string;
    localeCode: string;
    localeCodeBcp47: string;
    timezone: string;
    currencyCode: string;
    firstName: string;
    lastName: string;
    lastLoginDate: string | null;
    productExclusions: Array<ProductExclusion | null>;
    jurisdiction: { jurisdiction: string };
    excSettings: {
      discount: number;
      currencyDetails: { minBspLiability: number; minStake: number; currencyCode: string; currencyId: number } | null;
    } | null;
    jurisdictionalData: { nationalIdentifier: string | null; contractNumber: string | null } | null;
    migrationData: {
      heritageAccountId: string | null;
      heritageSecondaryAccountId: string | null;
      heritageSystem: string | null;
      migrationInformation: string | null;
      migrationDate: string | null;
    } | null;
  };
  throttles: Array<{ name: string; isActive: boolean }>;
  brandSettings: Array<{ name: string; isActive: boolean }>;
  preferences: {
    confirmCashout: { urn: string; shouldConfirmCashout: boolean };
    exchangeConfirmBetPlacement: { urn: string; shouldConfirmBetPlacement: boolean };
    oddsMovement: { urn: string; shouldAcceptOddsMovement: boolean };
    showBalances: { urn: string; shouldShowBalances: boolean };
    quickStakes: { urn: string; selectedQuickStakes: Array<{ stake: number }> };
    exchangeOddsDisplay: { urn: string; selectedOddsDisplayFormat: OddsDisplayFormat };
    sportsbookOddsDisplay: { urn: string; selectedOddsDisplayFormat: OddsDisplayFormat };
    favoriteSports: { urn: string; selectedFavoriteSports: Array<{ urn: string; sportId: number }> };
    defaultProduct: { urn: string; selectedDefaultProduct: DefaultProduct };
    exchangeDefaultProduct: { urn: string; selectedExchangeDefaultProduct: ExchangeDefaultProduct | null };
    products: { urn: string; selectedProduct: Array<UserProducts | null> | null };
    lastViewedProduct: { urn: string; selectedLastViewedProduct: LastViewedProduct };
    phoenixMigratedUser: { urn: string; isPhoenixMigratedUser: boolean };
    exchangeDefaultMode: { urn: string; selectedExchangeDefaultMode: ExchangeDefaultMode | null };
  };
  registration: { joinNowLabel: string | null; joinNowLink: string } | null;
  pollcadences: {
    ERO: number;
    SMP: number;
    WAS: number;
    LBR: number;
    SIB: number;
    SER: number;
    JACKPOT_ZONE: number;
    MY_BETS: number;
    POPULAR_BETS: number;
    REFRESH_CARDS: number;
    POLLING_DEBOUNCE: number;
    SCA: {
      loggedIn: { default: { inPlay: number; notInPlay: number } };
      loggedOut: { default: { inPlay: number; notInPlay: number } };
    };
    COS: {
      loggedIn: {
        default: { inPlay: number; notInPlay: number };
        sports: Array<{ sportId: string | null; inPlay: number; notInPlay: number } | null> | null;
      };
      loggedOut: { default: { inPlay: number; notInPlay: number } };
    };
  } | null;
};

export type AppContextDetailsQueryVariables = Exact<{ [key: string]: never }>;

export type AppContextDetailsQuery = { AppContext: AppContextDetailsFragment };

export type ViewRedirectQueryVariables = Exact<{
  viewURN: Scalars["URN"]["input"];
}>;

export type ViewRedirectQuery = {
  View:
    | { __typename: "AllCompetitionsView"; urn: string; url: string }
    | { __typename: "AllMarketsView"; urn: string; url: string }
    | { __typename: "BrowseView"; urn: string; url: string }
    | { __typename: "CompetitionView"; urn: string; url: string }
    | { __typename: "EventView"; urn: string; url: string }
    | { __typename: "GameView"; urn: string; url: string }
    | { __typename: "GamingCategoryView"; urn: string; url: string }
    | { __typename: "GamingSegmentationView"; urn: string; url: string }
    | { __typename: "GamingView"; urn: string; url: string }
    | { __typename: "GenericView"; urn: string; url: string }
    | { __typename: "ImsPromotionView"; urn: string; url: string }
    | { __typename: "MaintenanceView"; urn: string; url: string }
    | { __typename: "MarketRulesView"; urn: string; url: string }
    | { __typename: "MarketView"; urn: string; url: string }
    | { __typename: "MyAccountView"; urn: string; url: string }
    | { __typename: "MyBetsView"; urn: string; url: string }
    | { __typename: "NotFoundView"; urn: string; url: string }
    | { __typename: "ObbLandingPageView"; urn: string; url: string }
    | { __typename: "PlayerView"; urn: string; url: string }
    | { __typename: "PromotionsHubView"; urn: string; url: string }
    | { __typename: "PromotionsView"; urn: string; url: string }
    | { __typename: "RaceMeetingView"; urn: string; url: string }
    | { __typename: "RaceView"; urn: string; url: string }
    | { __typename: "RunnerView"; urn: string; url: string }
    | { __typename: "SelfExcludedView"; urn: string; url: string }
    | { __typename: "SettingsView"; urn: string; url: string }
    | { __typename: "SportView"; urn: string; url: string }
    | null;
};

export type SportEventCacheWarmupFragment = {
  __typename: "SportsEvent";
  urn: string;
  eventId: number;
  name: string;
  openDate: string;
  competition: {
    __typename: "Competition";
    urn: string;
    name: string;
    sport: { __typename: "Sport"; urn: string; name: string };
  } | null;
};

export type FilteredCouponCardGroupAllCompetitionsFilterOptionsFragment = {
  filterOptions: {
    __typename: "FilteredCouponOptions";
    competitionsFilter: {
      urn: string;
      allCompetitions: Array<{
        competitions: Array<{
          __typename: "Competition";
          urn: string;
          name: string;
          competitionId: number;
          sport: { __typename: "Sport"; urn: string; name: string; sportId: number };
        }>;
        country: {
          urn: string;
          code: string;
          flag: { vector: string | null; small: string | null; medium: string | null; large: string | null } | null;
        };
      }>;
    } | null;
  } | null;
};

export type AllCompetitionsFilterQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type AllCompetitionsFilterQuery = {
  Cards: Array<FilteredCouponCardGroupAllCompetitionsFilterOptionsFragment | {} | null> | null;
};

export type MonterosaContentCardFragment = {
  __typename: "MonterosaContentCard";
  urn: string;
  host: string;
  projectId: string;
  monterosaEventId: string | null;
};

export type MonterosaContentCardQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type MonterosaContentCardQuery = { Cards: Array<MonterosaContentCardFragment | {} | null> | null };

export type MonterosaAppContextFragment = {
  __typename: "AppContextDetails";
  urn: string;
  preferences: {
    sportsbookOddsDisplay: {
      __typename: "SportsbookOddsDisplayPreference";
      urn: string;
      selectedOddsDisplayFormat: OddsDisplayFormat;
    };
  };
};

export type MonterosaAppContextQueryVariables = Exact<{ [key: string]: never }>;

export type MonterosaAppContextQuery = { AppContext: MonterosaAppContextFragment };

export type FootballPlayerCompetitionStatsCardFragment = {
  __typename: "FootballPlayerCompetitionStatsCard";
  urn: string;
  player: {
    seasonStats: {
      matchesPlayed: number | null;
      totals: { goals: number; yellowCards: number; redCards: number; assists: number | null } | null;
    } | null;
  };
};

export type FootballPlayerCompetitionStatsCardQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type FootballPlayerCompetitionStatsCardQuery = {
  Cards: Array<FootballPlayerCompetitionStatsCardFragment | {} | null> | null;
};

export type PlayerMarketsCardGroupFragment = {
  __typename: "PlayerMarketsCardGroup";
  urn: string;
  fixtureCard: { __typename: "FixtureCard"; urn: string };
  items: { edges: Array<{ node: { __typename: "PebbleCardGroup"; urn: string } } | null> };
};

export type PlayerMarketsCardGroupQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type PlayerMarketsCardGroupQuery = { Cards: Array<PlayerMarketsCardGroupFragment | {} | null> | null };

export type PlayerViewFragment = {
  __typename: "PlayerView";
  urn: string;
  url: string;
  title: string | null;
  context: {
    __typename: "FootballPlayerFixtureContext";
    player: {
      id: string | null;
      urn: string;
      name: string;
      position: FootballPlayerPosition | null;
      shirtNumber: number | null;
    } | null;
    team: { name: string; color: string | null } | null;
  };
  items: {
    edges: Array<{
      node:
        | FootballPlayerCompetitionStatsCardFragment
        | { __typename: "PlayerMarketsCardGroup"; urn: string }
        | { __typename: "RegulatoryCard"; urn: string };
    } | null>;
  };
};

export type PlayerViewQueryVariables = Exact<{
  urn: Scalars["URN"]["input"];
}>;

export type PlayerViewQuery = { View: PlayerViewFragment | {} | null };

export type NavigationTabsListCardFragment = {
  __typename: "NavigationTabsList";
  urn: string;
  title: string | null;
  items: {
    edges: Array<{
      node:
        | {
            urn: string;
            title: { translated: string | null };
            viewLink: { viewUrn: string; viewUrl: string } | null;
            items: {
              edges: Array<{
                node:
                  | { __typename: "AccountBannersCard"; urn: string }
                  | { __typename: "BalanceCard"; urn: string }
                  | { __typename: "BetCardGroup"; urn: string }
                  | { __typename: "BetLegCard"; urn: string }
                  | { __typename: "BetOpportunityPromoCard"; urn: string }
                  | { __typename: "BetSharingCardGroup"; urn: string }
                  | { __typename: "BlurbCard"; urn: string }
                  | { __typename: "BreadcrumbsCard"; urn: string }
                  | { __typename: "BroadcastsAndStatisticsCard"; urn: string }
                  | { __typename: "BroadcastsCard"; urn: string }
                  | { __typename: "BudgetLimitsCard"; urn: string }
                  | { __typename: "ByTimeRangeMeetingCardGroup"; urn: string }
                  | { __typename: "CdvTrackerCard"; urn: string }
                  | { __typename: "CompetitionRegionCard"; urn: string }
                  | { __typename: "CompetitionViewLinkCard"; urn: string }
                  | { __typename: "ContentSummaryCard"; urn: string }
                  | { __typename: "CorrectScoreCard"; urn: string }
                  | { __typename: "CouponHeaderCard"; urn: string }
                  | { __typename: "EditorialPromoCard"; urn: string }
                  | { __typename: "EmbeddedContentCard"; urn: string }
                  | { __typename: "EmbeddedViewCard"; urn: string }
                  | { __typename: "EventHeaderCard"; urn: string }
                  | { __typename: "EventMarketCard"; urn: string }
                  | { __typename: "EventStatsCard"; urn: string }
                  | { __typename: "EventViewLinkCard"; urn: string }
                  | { __typename: "ExpandableCardGroup"; urn: string }
                  | { __typename: "ExpandableMarketCard"; urn: string }
                  | { __typename: "ExtraWalletCard"; urn: string }
                  | { __typename: "ExtraWalletCardGroup"; urn: string }
                  | { __typename: "FilteredCouponCardGroup"; urn: string }
                  | { __typename: "FixtureCard"; urn: string }
                  | { __typename: "FootballPlayerCompetitionStatsCard"; urn: string }
                  | { __typename: "ForbiddenContentCard"; urn: string }
                  | { __typename: "FutureRacingCardGroup"; urn: string }
                  | { __typename: "GameCard"; urn: string }
                  | { __typename: "GameInfoCard"; urn: string }
                  | { __typename: "GamingBackNavigationCard"; urn: string }
                  | { __typename: "GamingCardGroup"; urn: string }
                  | { __typename: "GamingJackpotCard"; urn: string }
                  | { __typename: "GamingLinkCard"; urn: string }
                  | { __typename: "GamingPlayNewCard"; urn: string }
                  | { __typename: "GamingPrizeMachineCard"; urn: string }
                  | { __typename: "GenericSwitcherCard"; urn: string }
                  | { __typename: "GenericViewLinkCard"; urn: string }
                  | { __typename: "GridCard"; urn: string }
                  | { __typename: "HalfTimeSpecialsSwimlaneCardGroup"; urn: string }
                  | { __typename: "HeadToHeadCard"; urn: string }
                  | { __typename: "HighlightedSelectionCard"; urn: string }
                  | { __typename: "ImsPromotionDetailsCard"; urn: string }
                  | { __typename: "ImsPromotionErrorCard"; urn: string }
                  | { __typename: "ImsPromotionStateCard"; urn: string }
                  | { __typename: "ImsPromotionTermsAndConditionsCard"; urn: string }
                  | { __typename: "IncidentsCard"; urn: string }
                  | { __typename: "LinksCard"; urn: string }
                  | { __typename: "LottoCard"; urn: string }
                  | { __typename: "LoyaltyPromoCard"; urn: string }
                  | { __typename: "MarketBetCard"; urn: string }
                  | { __typename: "MarketBetCardGroup"; urn: string }
                  | { __typename: "MarketBetExpandableCardGroup"; urn: string }
                  | { __typename: "MarketBetSelectionCard"; urn: string }
                  | { __typename: "MarketBetSelectionCardGroup"; urn: string }
                  | { __typename: "MarketCard"; urn: string }
                  | { __typename: "MarketExtendedCard"; urn: string }
                  | { __typename: "MarketGraphsCard"; urn: string }
                  | { __typename: "MarketRulesCard"; urn: string }
                  | { __typename: "MarketViewLinkCard"; urn: string }
                  | { __typename: "MatchStatSelectionCard"; urn: string }
                  | { __typename: "MatchStatsCard"; urn: string }
                  | { __typename: "MatchTimelineCard"; urn: string }
                  | { __typename: "MiniEditorialPromoCard"; urn: string }
                  | { __typename: "MiniPromoBannerCard"; urn: string }
                  | { __typename: "MiniSelectionPromoCard"; urn: string }
                  | { __typename: "MonterosaContentCard"; urn: string }
                  | { __typename: "ObbCardGroup"; urn: string }
                  | { __typename: "ObbCreatedBetsCard"; urn: string }
                  | { __typename: "ObbCreatedBetsCardGroup"; urn: string }
                  | { __typename: "ObbEventPopularsCard"; urn: string }
                  | { __typename: "ObbOnboardingCardsCardGroup"; urn: string }
                  | { __typename: "ObbPvpCard"; urn: string }
                  | { __typename: "ObbSection"; urn: string }
                  | { __typename: "ObbSquadBetCard"; urn: string }
                  | { __typename: "ObbSquadVsSquadCard"; urn: string }
                  | { __typename: "OutrightMarketListCard"; urn: string }
                  | { __typename: "PackagedCreatedBetsCard"; urn: string }
                  | { __typename: "PebbleCardGroup"; urn: string }
                  | { __typename: "PenaltyTakersCard"; urn: string }
                  | { __typename: "PlayerEventMarketsCard"; urn: string }
                  | { __typename: "PlayerMarketsCardGroup"; urn: string }
                  | { __typename: "PlayersRail"; urn: string }
                  | { __typename: "PopularBetBuilderCard"; urn: string }
                  | { __typename: "PopularMultiplesBetBuilderCard"; urn: string }
                  | { __typename: "PopularSelectionsCard"; urn: string }
                  | { __typename: "PopularSwimlaneCardGroup"; urn: string }
                  | { __typename: "PreferenceSingleChoiceCard"; urn: string }
                  | { __typename: "PriceBoostMultiplePromoCard"; urn: string }
                  | { __typename: "PriceBoostMultisCard"; urn: string }
                  | { __typename: "PriceBoostMultisListCard"; urn: string }
                  | { __typename: "PromotionCard"; urn: string }
                  | { __typename: "PromotionTrackerErrorCard"; urn: string }
                  | { __typename: "PromotionsCardGroup"; urn: string }
                  | { __typename: "PromotionsHubCard"; urn: string }
                  | { __typename: "PromotionsHubCardGroup"; urn: string }
                  | { __typename: "QuickLinksCard"; urn: string }
                  | { __typename: "QuicklinksGridCardGroup"; urn: string }
                  | { __typename: "RaceByTimeRangeCard"; urn: string }
                  | { __typename: "RaceDetailsCard"; urn: string }
                  | { __typename: "RaceMarketCard"; urn: string }
                  | { __typename: "RaceResultsCard"; urn: string }
                  | { __typename: "RaceSwitcherCard"; urn: string }
                  | { __typename: "RaceViewLinkCard"; urn: string }
                  | { __typename: "RaceViewLinksCard"; urn: string }
                  | { __typename: "RacesByTimeRangeCardGroup"; urn: string }
                  | { __typename: "RacingSwimlaneCardGroup"; urn: string }
                  | { __typename: "RegulatoryCard"; urn: string }
                  | { __typename: "RewardsCard"; urn: string }
                  | { __typename: "RunnerInfoCard"; urn: string }
                  | { __typename: "SearchBarCard"; urn: string }
                  | { __typename: "SearchZone"; urn: string }
                  | { __typename: "SegmentedCardGroup"; urn: string }
                  | { __typename: "SelectableItemsCardGroup"; urn: string }
                  | { __typename: "SelectionPromoCard"; urn: string }
                  | { __typename: "SelfExclusionCard"; urn: string }
                  | { __typename: "SkyBetClubTrackerCard"; urn: string }
                  | { __typename: "SnookerFixtureCard"; urn: string }
                  | { __typename: "SportRibbonCardGroup"; urn: string }
                  | { __typename: "SportViewLinkCard"; urn: string }
                  | { __typename: "SportsbookBetCard"; urn: string }
                  | { __typename: "SportsbookBetInfoCard"; urn: string }
                  | { __typename: "SportsbookBetLegCardGroup"; urn: string }
                  | { __typename: "SportsbookChatbotCard"; urn: string }
                  | { __typename: "SportsbookExpandableLegCardGroup"; urn: string }
                  | { __typename: "SportsbookLotteriesBetLegCardGroup"; urn: string }
                  | { __typename: "StatsBroadcastsCard"; urn: string }
                  | { __typename: "StatsContentCardGroup"; urn: string }
                  | { __typename: "StatsFormCard"; urn: string }
                  | { __typename: "StatsGoalsAndShotsCard"; urn: string }
                  | { __typename: "StatsHeadToHeadCard"; urn: string }
                  | { __typename: "StatsLineupsCard"; urn: string }
                  | { __typename: "StatsMatchStatsCard"; urn: string }
                  | { __typename: "StatsPebbleCardGroup"; urn: string }
                  | { __typename: "StatsPlayersInPlayCard"; urn: string }
                  | { __typename: "StatsPlayersSeasonStatsCard"; urn: string }
                  | { __typename: "StatsRaceResultsCard"; urn: string }
                  | { __typename: "StatsSupportingContentButtonsCardGroup"; urn: string }
                  | { __typename: "StatsTableCard"; urn: string }
                  | { __typename: "StatsTeamsCard"; urn: string }
                  | { __typename: "SwimlaneCardGroup"; urn: string }
                  | { __typename: "SwimlaneIndexedCardGroup"; urn: string }
                  | { __typename: "TeamFormCard"; urn: string }
                  | { __typename: "TeamLineupCard"; urn: string }
                  | { __typename: "TimeFormBroadCastsCard"; urn: string }
                  | { __typename: "ViewZone"; urn: string }
                  | { __typename: "VirtualCardGroup"; urn: string }
                  | { __typename: "VirtualEventDetailsCard"; urn: string }
                  | { __typename: "VirtualMarketCard"; urn: string };
              } | null>;
            };
          }
        | {};
    } | null>;
  };
};

export type NavigationTabsListCardQueryVariables = Exact<{
  urns: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type NavigationTabsListCardQuery = { Cards: Array<NavigationTabsListCardFragment | {} | null> | null };

export type RaceMeetingViewItemsQueryVariables = Exact<{
  viewURN: Scalars["URN"]["input"];
  race: InputMaybe<Scalars["URN"]["input"]>;
}>;

export type RaceMeetingViewItemsQuery = {
  View:
    | {
        urn: string;
        races: Array<RaceNavigationItemFragment | null>;
        items: {
          selectedRace: RaceNavigationItemFragment;
          edges: Array<{
            cursor: string | null;
            theme: ViewItemTheme | null;
            node:
              | { __typename: "NavigationTabsList"; urn: string }
              | { __typename: "RaceResultsCard"; urn: string }
              | { __typename: "RegulatoryCard"; urn: string }
              | {};
          } | null>;
          pageInfo: { endCursor: string | null; hasNextPage: boolean | null } | null;
        };
      }
    | {}
    | null;
};

export type RaceMeetingViewAppContextFragment = {
  __typename: "AppContextDetails";
  urn: string;
  userdetails: { localeCodeBcp47: string; timezone: string };
  brandSettings: Array<{ name: string; isActive: boolean }>;
};

export type RaceMeetingViewAppContextQueryVariables = Exact<{ [key: string]: never }>;

export type RaceMeetingViewAppContextQuery = { AppContext: RaceMeetingViewAppContextFragment };

export type RaceNavigationItemFragment = {
  race: {
    urn: string;
    raceId: string;
    name: string;
    startTime: string;
    verdict: string | null;
    availableToSubscribe: boolean;
    broadcasts: { liveVideoUrl: string | null; dataVizUrl: string | null } | null;
    primaryMarket: { numberOfActiveRunners: number | null } | {} | null;
    raceKind:
      | { details: { numberOfRunners: number | null } }
      | {
          runners: Array<{ rating123: number | null; ratingStars: number | null; horse: { name: string } }>;
          details: {
            name: string;
            title: string | null;
            scheduledTime: string;
            numberOfRunners: number | null;
            numberOfNonRunners: number | null;
            numberOfParticipants: number | null;
            going: Going | null;
            status: RaceStatus | null;
            type: RaceType | null;
            resultType: RaceResultType | null;
            raceClass: number | null;
            distance: { totalFurlongs: number; totalMeters: number; miles: number; furlongs: number; yards: number };
          };
        }
      | null;
  };
  viewLink: { viewUrn: string; viewUrl: string };
  promotion: { signposting: MarketPromoSignposting } | null;
};

export type RaceMeetingViewFragment = {
  __typename: "RaceMeetingView";
  urn: string;
  url: string;
  title: string | null;
  meeting: {
    urn: string;
    name: string;
    venue: string;
    country: string;
    date: string | null;
    countryFlag: { vector: string | null; small: string | null } | null;
    sport: { sportId: number; name: string };
  };
  races: Array<RaceNavigationItemFragment | null>;
  siblingRaceMeetingViews: Array<{
    urn: string;
    url: string;
    meeting: {
      urn: string;
      name: string;
      venue: string;
      country: string;
      countryFlag: { vector: string | null; small: string | null } | null;
    };
  } | null>;
  items: {
    selectedRace: RaceNavigationItemFragment;
    edges: Array<{
      cursor: string | null;
      theme: ViewItemTheme | null;
      node:
        | NavigationTabsListCardFragment
        | { __typename: "PreferenceSingleChoiceCard"; urn: string }
        | { __typename: "RaceResultsCard"; urn: string }
        | { __typename: "RegulatoryCard"; urn: string }
        | {};
    } | null>;
    pageInfo: { endCursor: string | null; hasNextPage: boolean | null } | null;
  };
};

export type RaceMeetingViewQueryVariables = Exact<{
  viewURN: Scalars["URN"]["input"];
}>;

export type RaceMeetingViewQuery = { View: RaceMeetingViewFragment | {} | null };

export type SkyBetClubTrackerUserDetailsFragment = {
  __typename: "AppContextDetails";
  urn: string;
  userdetails: { localeCodeBcp47: string; currencyCode: string; jurisdiction: { jurisdiction: string } };
  brandSettings: Array<{ name: string; isActive: boolean }>;
};

export type SkyBetClubTrackerCardFragment = {
  __typename: "SkyBetClubTrackerCard";
  urn: string;
  promotion: {
    fulfillmentEndDate: string | null;
    customerPromotionState: {
      hasAccepted: boolean | null;
      criteriaState: { params: { gauge: { current: number | null; target: number | null } | null } | null } | null;
    } | null;
    termsAndConditions: { summarized: string | null } | null;
  } | null;
};

export type SkyBetClubTrackerUserDetailsQueryVariables = Exact<{ [key: string]: never }>;

export type SkyBetClubTrackerUserDetailsQuery = { AppContext: SkyBetClubTrackerUserDetailsFragment };

export type SkyBetClubTrackerCardQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type SkyBetClubTrackerCardQuery = { Cards: Array<SkyBetClubTrackerCardFragment | {} | null> | null };

export type LocalStatsContentCardGroupFragment = {
  selectedTab: { urn: string | null; typename: string | null } | null;
};

export type StatsContentCardGroupFragment = {
  __typename: "StatsContentCardGroup";
  urn: string;
  partials: {
    edges: Array<
      | {
          type: string | null;
          displayName: { translationKey: string } | null;
          node: { __typename: "StatsBroadcastsCard"; urn: string };
        }
      | {
          type: string | null;
          displayName: { translationKey: string } | null;
          node: { __typename: "StatsLineupsCard"; urn: string };
        }
      | {
          type: string | null;
          displayName: { translationKey: string } | null;
          node: { __typename: "StatsMatchStatsCard"; urn: string };
        }
      | {
          type: string | null;
          displayName: { translationKey: string } | null;
          node: { __typename: "StatsPebbleCardGroup"; urn: string };
        }
      | {
          type: string | null;
          displayName: { translationKey: string } | null;
          node: { __typename: "StatsPlayersInPlayCard"; urn: string };
        }
      | {
          type: string | null;
          displayName: { translationKey: string } | null;
          node: { __typename: "StatsTableCard"; urn: string };
        }
      | null
    >;
  };
} & LocalStatsContentCardGroupFragment;

export type StatsContentCardGroupQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type StatsContentCardGroupQuery = { Cards: Array<StatsContentCardGroupFragment | {} | null> | null };

export type StatsPebbleCardGroupBaseDataFragment = {
  __typename: "StatsPebbleCardGroup";
  urn: string;
  status: FootballPeriodStatus | null;
};

export type LocalStatsPebbleCardGroupFragment = {
  selectedPebble: { urn: string | null; typename: string | null } | null;
};

export type StatsPebbleCardGroupFragment = {
  full: {
    edges: Array<{
      displayName: DisplayNameStatsFragment | {} | null;
      node:
        | IncidentsCardFragment
        | (StatsFormCardRecentFormFragment & StatsFormCardCompetitionFormFragment)
        | StatsGoalsAndShotsCardFragment
        | StatsHeadToHeadCardFragment
        | StatsMatchStatsCardFragment
        | (StatsPlayersSeasonStatsCardAttackingFragment & StatsPlayersSeasonStatsCardDefendingFragment)
        | (StatsTeamsCardPreviousFiveFragment & StatsTeamsCardAllSeasonFragment)
        | {};
    } | null>;
  };
  partials: {
    edges: Array<{
      node:
        | { __typename: "IncidentsCard"; urn: string }
        | { __typename: "StatsFormCard"; urn: string }
        | { __typename: "StatsGoalsAndShotsCard"; urn: string }
        | { __typename: "StatsHeadToHeadCard"; urn: string }
        | { __typename: "StatsMatchStatsCard"; urn: string }
        | { __typename: "StatsPlayersSeasonStatsCard"; urn: string }
        | { __typename: "StatsTeamsCard"; urn: string }
        | {};
      displayName: DisplayNameStatsFragment | {} | null;
    } | null>;
  };
} & StatsPebbleCardGroupBaseDataFragment &
  LocalStatsPebbleCardGroupFragment;

export type DisplayNameStatsFragment = { translationKey: string };

export type StatsPebbleCardGroupQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type StatsPebbleCardGroupQuery = { Cards: Array<StatsPebbleCardGroupFragment | {} | null> | null };

export type StatsPlayersInPlayUserDetailsFragment = {
  __typename: "AppContextDetails";
  urn: string;
  userdetails: { localeCodeBcp47: string; timezone: string; jurisdiction: { jurisdiction: string } };
};

export type StatsPlayersInPlayCardFragment = {
  __typename: "StatsPlayersInPlayCard";
  urn: string;
  fixture: {
    urn: string;
    players: Array<{
      id: string | null;
      name: string;
      stats: Array<{
        stats: {
          totalShots: number | null;
          shotsOnTarget: number | null;
          foulsWon: number | null;
          assists: number | null;
          fouls: number | null;
          tacklesWon: number | null;
          blockedShots: number | null;
          offsides: number | null;
          interceptions: number | null;
          goalkeeperSaves: number | null;
          shotsCreated: number | null;
        } | null;
      } | null> | null;
    } | null> | null;
    home: { name: string; squad: { players: Array<{ id: string | null } | null> | null } | null };
    away: { name: string; squad: { players: Array<{ id: string | null } | null> | null } | null };
  };
  footballPlayerViewLinks: Array<{ viewUrl: string; viewUrn: string; footballPlayer: { urn: string } }> | null;
};

export type StatsPlayersInPlayUserDetailsQueryVariables = Exact<{ [key: string]: never }>;

export type StatsPlayersInPlayUserDetailsQuery = { AppContext: StatsPlayersInPlayUserDetailsFragment };

export type StatsPlayersInPlayCardQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type StatsPlayersInPlayCardQuery = { Cards: Array<StatsPlayersInPlayCardFragment | {} | null> | null };

export type StatsPlayersInPlayCardThrotlesFragment = {
  __typename: "AppContextDetails";
  throttles: Array<{ name: string; isActive: boolean }>;
};

export type StatsRaceResultsCardFragment = {
  __typename: "StatsRaceResultsCard";
  urn: string;
  raceResultsRunners: Array<{
    isBetSelection: boolean;
    horse: { name: string; performance: { positionOfficial: number | null; positionStatusCode: string | null } | null };
    details: { saddleCloth: string; silk: string | null } | null;
  }>;
};

export type StatsRaceResultsCardQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type StatsRaceResultsCardQuery = { Cards: Array<StatsRaceResultsCardFragment | {} | null> | null };

export type StatsSupportingContentButtonsCardGroupBaseDataFragment = {
  __typename: "StatsSupportingContentButtonsCardGroup";
  urn: string;
};

export type StatsSupportingContentButtonsCardGroupFragment = {
  full: {
    edges: Array<{
      displayName: DisplayNameStatsFragment | {} | null;
      node:
        | IncidentsCardFragment
        | StatsBroadcastsCardFragment
        | StatsMatchStatsCardFragment
        | StatsRaceResultsCardFragment;
    } | null>;
  };
  partials: {
    edges: Array<{
      node:
        | { __typename: "IncidentsCard"; urn: string }
        | { __typename: "StatsBroadcastsCard"; urn: string }
        | { __typename: "StatsMatchStatsCard"; urn: string }
        | { __typename: "StatsRaceResultsCard"; urn: string };
      displayName: DisplayNameStatsFragment | {} | null;
    } | null>;
  };
} & StatsSupportingContentButtonsCardGroupBaseDataFragment;

export type StatsSupportingContentButtonsCardGroupQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type StatsSupportingContentButtonsCardGroupQuery = {
  Cards: Array<StatsSupportingContentButtonsCardGroupFragment | {} | null> | null;
};

export type SportsbookRunnerLiveDataPotentialBetUpdateFragment = {
  __typename: "SportsbookRunnerLiveData";
  urn: string;
  isPotentialBet: boolean | null;
};

export type SportsbookRunnerLiveDataEventProcessorFragment = {
  runnerStatus: SportsbookRunnerStatus;
  odds: { decimal: number; fractional: { numerator: number; denominator: number } | null } | null;
  displayOdds: { decimal: number; fractional: { numerator: number; denominator: number } | null } | null;
  previousOdds: Array<{
    odds: { decimal: number; fractional: { numerator: number; denominator: number } | null } | null;
    displayOdds: { decimal: number; fractional: { numerator: number; denominator: number } | null } | null;
  } | null> | null;
};

export type SportsbookMarketLiveDataEventProcessorFragment = {
  __typename: "SportsbookMarketLiveData";
  urn: string;
  sportsbookMarketStatus: SportsbookMarketStatus;
};

export type RaceMeetingViewSeoFragment = {
  __typename: "RaceMeetingView";
  urn: string;
  meeting: { __typename: "Meeting"; urn: string; venue: string; sport: { sportId: number } };
  items: { selectedRace: { race: { __typename: "Race"; urn: string; name: string; startTime: string } } };
};

export type AppContextPreferencesFragment = {
  __typename: "AppContextDetails";
  urn: string;
  preferences: {
    confirmCashout: { urn: string; shouldConfirmCashout: boolean };
    exchangeConfirmBetPlacement: { urn: string; shouldConfirmBetPlacement: boolean };
    oddsMovement: { urn: string; shouldAcceptOddsMovement: boolean };
    showBalances: { urn: string; shouldShowBalances: boolean };
    quickStakes: { urn: string; selectedQuickStakes: Array<{ stake: number }> };
    exchangeOddsDisplay: { urn: string; selectedOddsDisplayFormat: OddsDisplayFormat };
    sportsbookOddsDisplay: { urn: string; selectedOddsDisplayFormat: OddsDisplayFormat };
    favoriteSports: { urn: string; selectedFavoriteSports: Array<{ urn: string; sportId: number }> };
    defaultProduct: { urn: string; selectedDefaultProduct: DefaultProduct };
    exchangeDefaultProduct: { urn: string; selectedExchangeDefaultProduct: ExchangeDefaultProduct | null };
    products: { urn: string; selectedProduct: Array<UserProducts | null> | null };
    lastViewedProduct: { urn: string; selectedLastViewedProduct: LastViewedProduct };
    phoenixMigratedUser: { urn: string; isPhoenixMigratedUser: boolean };
    exchangeDefaultMode: { urn: string; selectedExchangeDefaultMode: ExchangeDefaultMode | null };
  };
};

export type AppContextPreferencesQueryVariables = Exact<{ [key: string]: never }>;

export type AppContextPreferencesQuery = { AppContext: AppContextPreferencesFragment };

export type GamingPrizeMachineCardTrackingParamsFragment = {
  __typename: "GamingPrizeMachineCard";
  urn: string;
  placementId: string;
  completed: boolean;
  jackpotAmount: number | null;
  jackpotState: GamingPrizeMachineStateType | null;
  activeTitle: string | null;
  ctaLabel: string | null;
  displayJackpotWinnersPostPlayWidget: boolean;
  guaranteedPrize: boolean;
};

export type GamingPrizeMachineCardThrotlesFragment = {
  __typename: "AppContextDetails";
  throttles: Array<{ name: string; isActive: boolean }>;
};

export type IncidentsCardTrackingQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type IncidentsCardTrackingQuery = { Cards: Array<IncidentsCardTrackingParamsFragment | {} | null> | null };

export type IncidentsCardTrackingParamsFragment = {
  __typename: "IncidentsCard";
  urn: string;
  fixture: {
    urn: string;
    sportevent: { urn: string; name: string; competition: { urn: string; name: string } | null };
  };
};

export type LottoCardTrackingQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type LottoCardTrackingQuery = { Cards: Array<LottoCardTrackingParamsFragment | {} | null> | null };

export type LottoCardTrackingParamsFragment = {
  __typename: "LottoCard";
  urn: string;
  shouldShowCompetitionName: boolean;
  marketIds: Array<string> | null;
  competition: { __typename: "Competition"; competitionId: number; urn: string; name: string };
  lottoMarkets: Array<{
    __typename: "SportsbookMarket";
    urn: string;
    name: string;
    marketType: string;
    liveData: { urn: string; sportsbookMarketStatus: SportsbookMarketStatus } | null;
    hierarchy:
      | {
          sportevent: { __typename: "SportsEvent"; eventId: number; urn: string; name: string; openDate: string };
          competition: { __typename: "Competition"; urn: string };
        }
      | {};
    runners: Array<{ runnerURN: string; selectionId: number; name: string; resultType: string | null }>;
  }> | null;
};

export type NotificationsSubscriptionRaceTrackingParamsFragment = {
  __typename: "Race";
  urn: string;
  raceId: string;
  name: string;
  startTime: string;
  meeting: { urn: string; venue: string; sport: { name: string } };
};

export type NotificationsSubscriptionRaceTrackingQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type NotificationsSubscriptionRaceTrackingQuery = {
  Races: Array<NotificationsSubscriptionRaceTrackingParamsFragment | null> | null;
};

export type PenaltyTakersCardTrackingQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type PenaltyTakersCardTrackingQuery = {
  Cards: Array<PenaltyTakersCardTrackingParamsFragment | {} | null> | null;
};

export type PenaltyTakersCardTrackingParamsFragment = {
  __typename: "PenaltyTakersCard";
  urn: string;
  event: { urn: string; name: string };
  penaltyTakers: Array<{
    player: {
      __typename: "FootballPlayerFixtureContext";
      urn: string;
      player: { id: string | null; name: string } | null;
    };
  }>;
};

export type StatsContentCardGroupTrackingQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type StatsContentCardGroupTrackingQuery = {
  Cards: Array<StatsContentCardGroupTrackingParamsFragment | {} | null> | null;
};

export type StatsContentCardGroupTrackingParamsFragment = {
  __typename: "StatsContentCardGroup";
  urn: string;
  status: FootballPeriodStatus | null;
  sportEvent: { urn: string; name: string; competition: { urn: string; name: string } | null };
};

export type StatsLineupsCardTrackingQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type StatsLineupsCardTrackingQuery = { Cards: Array<StatsLineupsCardTrackingParamsFragment | {} | null> | null };

export type StatsLineupsCardTrackingParamsFragment = {
  __typename: "StatsLineupsCard";
  urn: string;
  status: FootballPeriodStatus | null;
  sportEvent: { urn: string; name: string; competition: { urn: string; name: string } | null };
};

export type StatsPebbleCardGroupTrackingQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type StatsPebbleCardGroupTrackingQuery = {
  Cards: Array<StatsPebbleCardGroupTrackingParamsFragment | {} | null> | null;
};

export type StatsPebbleCardGroupTrackingParamsFragment = {
  __typename: "StatsPebbleCardGroup";
  urn: string;
  status: FootballPeriodStatus | null;
  items: {
    edges: Array<{
      displayName: { translationKey: string } | {} | null;
      node:
        | { __typename: "AccountBannersCard"; urn: string }
        | { __typename: "BalanceCard"; urn: string }
        | { __typename: "BetLegCard"; urn: string }
        | { __typename: "BetOpportunityPromoCard"; urn: string }
        | { __typename: "BlurbCard"; urn: string }
        | { __typename: "BreadcrumbsCard"; urn: string }
        | { __typename: "BroadcastsAndStatisticsCard"; urn: string }
        | { __typename: "BroadcastsCard"; urn: string }
        | { __typename: "BudgetLimitsCard"; urn: string }
        | { __typename: "CdvTrackerCard"; urn: string }
        | { __typename: "CompetitionRegionCard"; urn: string }
        | { __typename: "CompetitionViewLinkCard"; urn: string }
        | { __typename: "ContentSummaryCard"; urn: string }
        | { __typename: "CorrectScoreCard"; urn: string }
        | { __typename: "CouponHeaderCard"; urn: string }
        | { __typename: "EditorialPromoCard"; urn: string }
        | { __typename: "EmbeddedContentCard"; urn: string }
        | { __typename: "EmbeddedViewCard"; urn: string }
        | { __typename: "EventHeaderCard"; urn: string }
        | { __typename: "EventMarketCard"; urn: string }
        | { __typename: "EventStatsCard"; urn: string }
        | { __typename: "EventViewLinkCard"; urn: string }
        | { __typename: "ExpandableMarketCard"; urn: string }
        | { __typename: "ExtraWalletCard"; urn: string }
        | { __typename: "FixtureCard"; urn: string }
        | { __typename: "FootballPlayerCompetitionStatsCard"; urn: string }
        | { __typename: "ForbiddenContentCard"; urn: string }
        | { __typename: "GameCard"; urn: string }
        | { __typename: "GameInfoCard"; urn: string }
        | { __typename: "GamingBackNavigationCard"; urn: string }
        | { __typename: "GamingJackpotCard"; urn: string }
        | { __typename: "GamingLinkCard"; urn: string }
        | { __typename: "GamingPlayNewCard"; urn: string }
        | { __typename: "GamingPrizeMachineCard"; urn: string }
        | { __typename: "GenericSwitcherCard"; urn: string }
        | { __typename: "GenericViewLinkCard"; urn: string }
        | { __typename: "GridCard"; urn: string }
        | { __typename: "HeadToHeadCard"; urn: string }
        | { __typename: "HighlightedSelectionCard"; urn: string }
        | { __typename: "ImsPromotionDetailsCard"; urn: string }
        | { __typename: "ImsPromotionErrorCard"; urn: string }
        | { __typename: "ImsPromotionStateCard"; urn: string }
        | { __typename: "ImsPromotionTermsAndConditionsCard"; urn: string }
        | { __typename: "IncidentsCard"; urn: string }
        | { __typename: "LinksCard"; urn: string }
        | { __typename: "LottoCard"; urn: string }
        | { __typename: "LoyaltyPromoCard"; urn: string }
        | { __typename: "MarketBetCard"; urn: string }
        | { __typename: "MarketBetSelectionCard"; urn: string }
        | { __typename: "MarketCard"; urn: string }
        | { __typename: "MarketExtendedCard"; urn: string }
        | { __typename: "MarketGraphsCard"; urn: string }
        | { __typename: "MarketRulesCard"; urn: string }
        | { __typename: "MarketViewLinkCard"; urn: string }
        | { __typename: "MatchStatSelectionCard"; urn: string }
        | { __typename: "MatchStatsCard"; urn: string }
        | { __typename: "MatchTimelineCard"; urn: string }
        | { __typename: "MiniEditorialPromoCard"; urn: string }
        | { __typename: "MiniPromoBannerCard"; urn: string }
        | { __typename: "MiniSelectionPromoCard"; urn: string }
        | { __typename: "MonterosaContentCard"; urn: string }
        | { __typename: "ObbCreatedBetsCard"; urn: string }
        | { __typename: "ObbEventPopularsCard"; urn: string }
        | { __typename: "ObbPvpCard"; urn: string }
        | { __typename: "ObbSquadBetCard"; urn: string }
        | { __typename: "ObbSquadVsSquadCard"; urn: string }
        | { __typename: "OutrightMarketListCard"; urn: string }
        | { __typename: "PackagedCreatedBetsCard"; urn: string }
        | { __typename: "PenaltyTakersCard"; urn: string }
        | { __typename: "PlayerEventMarketsCard"; urn: string }
        | { __typename: "PopularBetBuilderCard"; urn: string }
        | { __typename: "PopularMultiplesBetBuilderCard"; urn: string }
        | { __typename: "PopularSelectionsCard"; urn: string }
        | { __typename: "PreferenceSingleChoiceCard"; urn: string }
        | { __typename: "PriceBoostMultiplePromoCard"; urn: string }
        | { __typename: "PriceBoostMultisCard"; urn: string }
        | { __typename: "PriceBoostMultisListCard"; urn: string }
        | { __typename: "PromotionCard"; urn: string }
        | { __typename: "PromotionTrackerErrorCard"; urn: string }
        | { __typename: "PromotionsHubCard"; urn: string }
        | { __typename: "QuickLinksCard"; urn: string }
        | { __typename: "RaceByTimeRangeCard"; urn: string }
        | { __typename: "RaceDetailsCard"; urn: string }
        | { __typename: "RaceMarketCard"; urn: string }
        | { __typename: "RaceResultsCard"; urn: string }
        | { __typename: "RaceSwitcherCard"; urn: string }
        | { __typename: "RaceViewLinkCard"; urn: string }
        | { __typename: "RaceViewLinksCard"; urn: string }
        | { __typename: "RegulatoryCard"; urn: string }
        | { __typename: "RewardsCard"; urn: string }
        | { __typename: "RunnerInfoCard"; urn: string }
        | { __typename: "SearchBarCard"; urn: string }
        | { __typename: "SelectionPromoCard"; urn: string }
        | { __typename: "SelfExclusionCard"; urn: string }
        | { __typename: "SkyBetClubTrackerCard"; urn: string }
        | { __typename: "SnookerFixtureCard"; urn: string }
        | { __typename: "SportViewLinkCard"; urn: string }
        | { __typename: "SportsbookBetCard"; urn: string }
        | { __typename: "SportsbookBetInfoCard"; urn: string }
        | { __typename: "SportsbookChatbotCard"; urn: string }
        | { __typename: "StatsBroadcastsCard"; urn: string }
        | { __typename: "StatsFormCard"; urn: string }
        | { __typename: "StatsGoalsAndShotsCard"; urn: string }
        | { __typename: "StatsHeadToHeadCard"; urn: string }
        | { __typename: "StatsLineupsCard"; urn: string }
        | { __typename: "StatsMatchStatsCard"; urn: string }
        | { __typename: "StatsPlayersInPlayCard"; urn: string }
        | { __typename: "StatsPlayersSeasonStatsCard"; urn: string }
        | { __typename: "StatsRaceResultsCard"; urn: string }
        | { __typename: "StatsTableCard"; urn: string }
        | { __typename: "StatsTeamsCard"; urn: string }
        | { __typename: "TeamFormCard"; urn: string }
        | { __typename: "TeamLineupCard"; urn: string }
        | { __typename: "TimeFormBroadCastsCard"; urn: string }
        | { __typename: "VirtualEventDetailsCard"; urn: string }
        | { __typename: "VirtualMarketCard"; urn: string };
    } | null>;
  };
  sportEvent: { urn: string; name: string; competition: { urn: string; name: string } | null };
};

export type StatsPlayersInPlayTrackingQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type StatsPlayersInPlayTrackingQuery = {
  Cards: Array<StatsPlayersInPlayTrackingParamsFragment | {} | null> | null;
};

export type StatsPlayersInPlayTrackingParamsFragment = {
  __typename: "StatsPlayersInPlayCard";
  urn: string;
  sportEvent: { urn: string; name: string; competition: { urn: string; name: string } | null };
};

export type StatsPlayersSeasonStatsTrackingQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type StatsPlayersSeasonStatsTrackingQuery = {
  Cards: Array<StatsPlayersSeasonStatsTrackingParamsFragment | {} | null> | null;
};

export type StatsPlayersSeasonStatsTrackingParamsFragment = {
  __typename: "StatsPlayersSeasonStatsCard";
  urn: string;
  sportEvent: { urn: string; name: string; competition: { urn: string; name: string } | null };
};

export type StatsSupportingContentButtonsCardGroupTrackingQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type StatsSupportingContentButtonsCardGroupTrackingQuery = {
  Cards: Array<StatsSupportingContentButtonsCardGroupTrackingParamsFragment | {} | null> | null;
};

export type StatsSupportingContentButtonsCardGroupTrackingParamsFragment = {
  __typename: "StatsSupportingContentButtonsCardGroup";
  urn: string;
  items: {
    edges: Array<{
      node:
        | { __typename: "IncidentsCard"; urn: string }
        | { __typename: "StatsBroadcastsCard"; urn: string }
        | { __typename: "StatsMatchStatsCard"; urn: string }
        | { __typename: "StatsRaceResultsCard"; urn: string };
      displayName: { translationKey: string } | {} | null;
    } | null>;
  };
};

export type StatsTeamsCardExpandIconTrackingQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
}>;

export type StatsTeamsCardExpandIconTrackingQuery = {
  Cards: Array<StatsTeamsCardExpandIconTrackingParamsFragment | {} | null> | null;
};

export type StatsTeamsCardExpandIconTrackingParamsFragment = {
  __typename: "StatsTeamsCard";
  urn: string;
  fixture: {
    urn: string;
    sportevent: { urn: string; name: string; competition: { urn: string; name: string } | null };
  };
};

export type AcceptPromotionMutationVariables = Exact<{
  urn: Scalars["URN"]["input"];
  amount: InputMaybe<Scalars["Float"]["input"]>;
  throttlesOn: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  throttlesOff: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  productExclusions: InputMaybe<Array<ProductExclusion> | ProductExclusion>;
}>;

export type AcceptPromotionMutation = {
  acceptPromotion: { responseCode: number; responseMessage: string | null; promotion: ImsPromotionFragment | null };
};

export type SportsFragment = { sportId: string | null; inPlay: number; notInPlay: number };

export type AppContextQueryVariables = Exact<{
  throttlesOn: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  throttlesOff: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
}>;

export type AppContextQuery = {
  AppContext: {
    urn: string;
    userdetails: {
      accountId: number;
      loggedIn: boolean;
      region: string;
      bucketId: number;
      countryCode: string;
      localeCode: string;
      localeCodeBcp47: string;
      timezone: string;
      currencyCode: string;
      firstName: string;
      lastName: string;
      accountOpenDate: string | null;
      lastLoginDate: string | null;
      productExclusions: Array<ProductExclusion | null>;
      jurisdiction: { jurisdiction: string };
      exchangeSettings: {
        discount: number;
        currencyDetails: { minBspLiability: number; minStake: number; currencyCode: string; currencyId: number } | null;
      };
      excSettings: {
        discount: number;
        currencyDetails: { minBspLiability: number; minStake: number; currencyCode: string; currencyId: number } | null;
      } | null;
      jurisdictionalData: { nationalIdentifier: string | null; contractNumber: string | null } | null;
      migrationData: {
        heritageAccountId: string | null;
        heritageSecondaryAccountId: string | null;
        heritageSystem: string | null;
        migrationInformation: string | null;
        migrationDate: string | null;
      } | null;
    };
    activeExperiments: Array<{ name: string; variant: string } | null>;
    throttles: Array<{ name: string; isActive: boolean }>;
    brandSettings: Array<{ name: string; isActive: boolean }>;
    preferences: {
      confirmCashout: { urn: string; shouldConfirmCashout: boolean };
      exchangeConfirmBetPlacement: { urn: string; shouldConfirmBetPlacement: boolean };
      oddsMovement: { urn: string; shouldAcceptOddsMovement: boolean };
      showBalances: { urn: string; shouldShowBalances: boolean };
      quickStakes: { urn: string; selectedQuickStakes: Array<{ stake: number }> };
      exchangeOddsDisplay: { urn: string; selectedOddsDisplayFormat: OddsDisplayFormat };
      sportsbookOddsDisplay: { urn: string; selectedOddsDisplayFormat: OddsDisplayFormat };
      favoriteSports: { urn: string; selectedFavoriteSports: Array<{ urn: string; sportId: number }> };
      defaultProduct: { urn: string; selectedDefaultProduct: DefaultProduct };
      exchangeDefaultProduct: { urn: string; selectedExchangeDefaultProduct: ExchangeDefaultProduct | null };
      products: { urn: string; selectedProduct: Array<UserProducts | null> | null };
      lastViewedProduct: { urn: string; selectedLastViewedProduct: LastViewedProduct };
      phoenixMigratedUser: { urn: string; isPhoenixMigratedUser: boolean };
      exchangeDefaultMode: { urn: string; selectedExchangeDefaultMode: ExchangeDefaultMode | null };
    };
    registration: { joinNowLabel: string | null; joinNowLink: string } | null;
    pollcadences: {
      ERO: number;
      SMP: number;
      WAS: number;
      LBR: number;
      SIB: number;
      SER: number;
      JACKPOT_ZONE: number;
      MY_BETS: number;
      POPULAR_BETS: number;
      REFRESH_CARDS: number;
      POLLING_DEBOUNCE: number;
      BLH: { inPlay: number; notInPlay: number };
      BME: { inPlay: number; notInPlay: number } | null;
      SCA: {
        loggedIn: { default: { inPlay: number; notInPlay: number } };
        loggedOut: { default: { inPlay: number; notInPlay: number } };
      };
      COS: {
        loggedIn: { default: { inPlay: number; notInPlay: number }; sports: Array<SportsFragment | null> | null };
        loggedOut: { default: { inPlay: number; notInPlay: number } };
      };
    } | null;
  };
};

export type AppVersionQueryVariables = Exact<{
  throttlesOn: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  throttlesOff: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
}>;

export type AppVersionQuery = {
  AppVersion: {
    urn: string;
    url: string | null;
    downloadUrl: string | null;
    storeUrl: string | null;
    versionCode: number | null;
    minVersionCode: number | null;
    minOSVersion: string | null;
    blackList: Array<{ versioncode: number | null } | null> | null;
  };
};

export type BettingCardRunnersDisplayQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
  requestForExc: Scalars["Boolean"]["input"];
  requestForSbk: Scalars["Boolean"]["input"];
  preferences: InputMaybe<LayoutPreferencesInput>;
  productExclusions: InputMaybe<Array<ProductExclusion> | ProductExclusion>;
  experiments: InputMaybe<Array<ExperimentsInput> | ExperimentsInput>;
  throttlesOn: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  throttlesOff: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
}>;

export type BettingCardRunnersDisplayQuery = {
  Cards: Array<
    | { __typename: "AccountBannersCard" }
    | { __typename: "BalanceCard" }
    | { __typename: "BetCardGroup" }
    | { __typename: "BetLegCard" }
    | { __typename: "BetOpportunityPromoCard" }
    | { __typename: "BetSharingCardGroup" }
    | { __typename: "BlurbCard" }
    | { __typename: "BreadcrumbsCard" }
    | { __typename: "BroadcastsAndStatisticsCard" }
    | { __typename: "BroadcastsCard" }
    | { __typename: "BudgetLimitsCard" }
    | { __typename: "ByTimeRangeMeetingCardGroup" }
    | { __typename: "CdvTrackerCard" }
    | { __typename: "CompetitionRegionCard" }
    | { __typename: "CompetitionViewLinkCard" }
    | { __typename: "ContentSummaryCard" }
    | { __typename: "CorrectScoreCard" }
    | { __typename: "CouponHeaderCard" }
    | { __typename: "EditorialPromoCard" }
    | { __typename: "EmbeddedContentCard" }
    | { __typename: "EmbeddedViewCard" }
    | { __typename: "EventHeaderCard" }
    | { __typename: "EventMarketCard"; urn: string; displayRunners: DisplayRunnersFragment }
    | { __typename: "EventStatsCard" }
    | { __typename: "EventViewLinkCard" }
    | { __typename: "ExpandableCardGroup" }
    | { __typename: "ExpandableMarketCard" }
    | { __typename: "ExtraWalletCard" }
    | { __typename: "ExtraWalletCardGroup" }
    | { __typename: "FavouriteMarketsNavigationTab" }
    | { __typename: "FilteredCouponCardGroup" }
    | { __typename: "FixtureCard" }
    | { __typename: "FootballPlayerCompetitionStatsCard" }
    | { __typename: "ForbiddenContentCard" }
    | { __typename: "FutureRacingCardGroup" }
    | { __typename: "GameCard" }
    | { __typename: "GameInfoCard" }
    | { __typename: "GamingBackNavigationCard" }
    | { __typename: "GamingCardGroup" }
    | { __typename: "GamingJackpotCard" }
    | { __typename: "GamingLinkCard" }
    | { __typename: "GamingPlayNewCard" }
    | { __typename: "GamingPrizeMachineCard" }
    | { __typename: "GenericSwitcherCard" }
    | { __typename: "GenericViewLinkCard" }
    | { __typename: "GridCard" }
    | { __typename: "HalfTimeSpecialsSwimlaneCardGroup" }
    | { __typename: "HeadToHeadCard" }
    | { __typename: "HighlightedSelectionCard" }
    | { __typename: "ImsPromotionDetailsCard" }
    | { __typename: "ImsPromotionErrorCard" }
    | { __typename: "ImsPromotionStateCard" }
    | { __typename: "ImsPromotionTermsAndConditionsCard" }
    | { __typename: "IncidentsCard" }
    | { __typename: "LinksCard" }
    | { __typename: "LottoCard" }
    | { __typename: "LoyaltyPromoCard" }
    | { __typename: "MarketBetCard" }
    | { __typename: "MarketBetCardGroup" }
    | { __typename: "MarketBetExpandableCardGroup" }
    | { __typename: "MarketBetSelectionCard" }
    | { __typename: "MarketBetSelectionCardGroup" }
    | { __typename: "MarketCard"; urn: string; displayRunners: DisplayRunnersFragment }
    | { __typename: "MarketExtendedCard"; urn: string; displayRunners: DisplayRunnersFragment }
    | { __typename: "MarketGraphsCard" }
    | { __typename: "MarketRulesCard" }
    | { __typename: "MarketViewLinkCard" }
    | { __typename: "MatchStatSelectionCard" }
    | { __typename: "MatchStatsCard" }
    | { __typename: "MatchTimelineCard" }
    | { __typename: "MiniEditorialPromoCard" }
    | { __typename: "MiniPromoBannerCard" }
    | { __typename: "MiniSelectionPromoCard" }
    | { __typename: "MonterosaContentCard" }
    | { __typename: "NavigationTab" }
    | { __typename: "NavigationTabsList" }
    | { __typename: "ObbCardGroup" }
    | { __typename: "ObbCreatedBetsCard" }
    | { __typename: "ObbCreatedBetsCardGroup" }
    | { __typename: "ObbEventPopularsCard" }
    | { __typename: "ObbOnboardingCardsCardGroup" }
    | { __typename: "ObbPvpCard" }
    | { __typename: "ObbSection" }
    | { __typename: "ObbSquadBetCard" }
    | { __typename: "ObbSquadVsSquadCard" }
    | { __typename: "OutrightMarketListCard" }
    | { __typename: "PackagedCreatedBetsCard" }
    | { __typename: "PebbleCardGroup" }
    | { __typename: "PenaltyTakersCard" }
    | { __typename: "PlayerEventMarketsCard" }
    | { __typename: "PlayerMarketsCardGroup" }
    | { __typename: "PlayersRail" }
    | { __typename: "PopularBetBuilderCard" }
    | { __typename: "PopularMultiplesBetBuilderCard" }
    | { __typename: "PopularSelectionsCard" }
    | { __typename: "PopularSwimlaneCardGroup" }
    | { __typename: "PreferenceSingleChoiceCard" }
    | { __typename: "PriceBoostMultiplePromoCard" }
    | { __typename: "PriceBoostMultisCard" }
    | { __typename: "PriceBoostMultisListCard" }
    | { __typename: "PromotionCard" }
    | { __typename: "PromotionTrackerErrorCard" }
    | { __typename: "PromotionsCardGroup" }
    | { __typename: "PromotionsHubCard" }
    | { __typename: "PromotionsHubCardGroup" }
    | { __typename: "QuickLinksCard" }
    | { __typename: "QuicklinksGridCardGroup" }
    | { __typename: "RaceByTimeRangeCard" }
    | { __typename: "RaceDetailsCard" }
    | { __typename: "RaceMarketCard"; urn: string; displayRunners: DisplayRunnersFragment }
    | { __typename: "RaceResultsCard" }
    | { __typename: "RaceSwitcherCard" }
    | { __typename: "RaceViewLinkCard" }
    | { __typename: "RaceViewLinksCard" }
    | { __typename: "RacesByTimeRangeCardGroup" }
    | { __typename: "RacingSwimlaneCardGroup" }
    | { __typename: "RegulatoryCard" }
    | { __typename: "RewardsCard" }
    | { __typename: "RunnerInfoCard" }
    | { __typename: "SearchBarCard" }
    | { __typename: "SearchZone" }
    | { __typename: "SegmentedCardGroup" }
    | { __typename: "SelectableItemsCardGroup" }
    | { __typename: "SelectionPromoCard" }
    | { __typename: "SelfExclusionCard" }
    | { __typename: "SkyBetClubTrackerCard" }
    | { __typename: "SnookerFixtureCard" }
    | { __typename: "SportRibbonCardGroup" }
    | { __typename: "SportViewLinkCard" }
    | { __typename: "SportsbookBetCard" }
    | { __typename: "SportsbookBetInfoCard" }
    | { __typename: "SportsbookBetLegCardGroup" }
    | { __typename: "SportsbookChatbotCard" }
    | { __typename: "SportsbookExpandableLegCardGroup" }
    | { __typename: "SportsbookLotteriesBetLegCardGroup" }
    | { __typename: "StatsBroadcastsCard" }
    | { __typename: "StatsContentCardGroup" }
    | { __typename: "StatsFormCard" }
    | { __typename: "StatsGoalsAndShotsCard" }
    | { __typename: "StatsHeadToHeadCard" }
    | { __typename: "StatsLineupsCard" }
    | { __typename: "StatsMatchStatsCard" }
    | { __typename: "StatsPebbleCardGroup" }
    | { __typename: "StatsPlayersInPlayCard" }
    | { __typename: "StatsPlayersSeasonStatsCard" }
    | { __typename: "StatsRaceResultsCard" }
    | { __typename: "StatsSupportingContentButtonsCardGroup" }
    | { __typename: "StatsTableCard" }
    | { __typename: "StatsTeamsCard" }
    | { __typename: "SwimlaneCardGroup" }
    | { __typename: "SwimlaneIndexedCardGroup" }
    | { __typename: "TeamFormCard" }
    | { __typename: "TeamLineupCard" }
    | { __typename: "TimeFormBroadCastsCard" }
    | { __typename: "ViewZone" }
    | { __typename: "VirtualCardGroup" }
    | { __typename: "VirtualEventDetailsCard" }
    | { __typename: "VirtualMarketCard" }
    | null
  > | null;
};

export type DisplayRunnersFragment = {
  exchange?: { runners: Array<{ runnerURN: string }> } | null;
  sportsbook?: { runners: Array<{ runnerURN: string }> } | null;
};

export type CancelPromotionMutationVariables = Exact<{
  urn: Scalars["URN"]["input"];
  bonusInstanceCode: Scalars["String"]["input"];
  throttlesOn: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  throttlesOff: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  productExclusions: InputMaybe<Array<ProductExclusion> | ProductExclusion>;
}>;

export type CancelPromotionMutation = {
  cancelPromotion: { responseCode: number; responseMessage: string | null; promotion: ImsPromotionFragment | null };
};

export type CardQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
  numberOfFilledCardsInCardGroup?: InputMaybe<Scalars["Int"]["input"]>;
  first: InputMaybe<Scalars["Int"]["input"]>;
  cursor: InputMaybe<Scalars["String"]["input"]>;
  preferences: InputMaybe<LayoutPreferencesInput>;
  productExclusions: InputMaybe<Array<ProductExclusion> | ProductExclusion>;
  experiments: InputMaybe<Array<ExperimentsInput> | ExperimentsInput>;
  throttlesOn: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  throttlesOff: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
}>;

export type CardQuery = {
  Cards: Array<
    | AccountBannersCardFragment
    | BalanceCardFragment
    | BetCardGroupFragment
    | SportsbookBetLegCardFragment
    | BetSharingCardGroupFragment
    | BlurbCardFragment
    | BroadcastsAndStatisticsCardFragment
    | BroadcastsCardDeprecatedFragment
    | BudgetLimitsCardFragment
    | ByTimeRangeMeetingCardGroupFragment
    | CompetitionRegionCardFragment
    | CompetitionViewLinkCardFragment
    | ContentSummaryCardFragment
    | CorrectScoreCardFragment
    | CouponHeaderCardFragment
    | EventMarketCardFragment
    | EventStatsCardFragment
    | EventViewLinkCardFragment
    | ExpandableCardGroupFragment
    | ExpandableMarketCardFragment
    | ExtraWalletCardFragment
    | ExtraWalletCardGroupFragment
    | FavouriteMarketsNavigationTabFragment
    | FilteredCouponCardGroupFragment
    | FixtureCardFragment
    | ForbiddenContentCardFragment
    | FutureRacingCardGroupFragment
    | GameCardFragment
    | GameInfoCardFragment
    | GamingCardGroupFragment
    | GamingJackpotCardFragment
    | GamingLinkCardFragment
    | GamingPlayNewCardFragment
    | GenericViewLinkCardFragment
    | GridCardFragment
    | HalfTimeSpecialsSwimlaneCardGroupFragment
    | HeadToHeadCardFragment
    | HighlightedSelectionCardFragment
    | ImsPromotionDetailsCardFragment
    | ImsPromotionErrorCardFragment
    | ImsPromotionStateCardFragment
    | ImsPromotionTermsAndConditionsCardFragment
    | LinksCardFragment
    | MarketBetCardFragment
    | MarketBetCardGroupFragment
    | MarketBetExpandableCardGroupFragment
    | MarketBetSelectionCardFragment
    | MarketBetSelectionCardGroupFragment
    | MarketCardFragment
    | MarketExtendedCardFragment
    | MarketGraphsCardFragment
    | MarketRulesCardFragment
    | MarketViewLinkCardFragment
    | MatchStatSelectionCardFragment
    | MatchStatsCardFragment
    | MatchTimelineCardFragment
    | NavigationTabFragment
    | (NavigationTabsListFragment & NavigationTabsListFragment)
    | ObbCardGroupFragment
    | ObbCreatedBetsCardGroupFragment
    | ObbEventPopularsCardFragment
    | ObbOnboardingCardsCardGroupFragment
    | OutrightMarketListCardFragment
    | PackagedCreatedBetsCardFragment
    | PebbleCardGroupFragment
    | PopularBetBuilderCardFragment
    | PopularMultiplesBetBuilderCardFragment
    | PopularSwimlaneCardGroupFragment
    | PreferenceSingleChoiceCardFragment
    | PriceBoostMultisCardFragment
    | PriceBoostMultisListCardFragment
    | PromotionCardFragment
    | LocalTbdPromotionsHubCardGroupFragment
    | QuickLinksCardFragment
    | RaceByTimeRangeCardFragment
    | RaceDetailsCardFragment
    | RaceMarketCardFragment
    | RaceResultsCardFragment
    | RaceViewLinkCardFragment
    | RaceViewLinksCardFragment
    | RacesByTimeRangeCardGroupFragment
    | RacingSwimlaneCardGroupFragment
    | RegulatoryCardFragment
    | RewardsCardFragment
    | RunnerInfoCardFragment
    | SearchBarCardFragment
    | SearchZoneFragment
    | SegmentedCardGroupFragment
    | SelectableitemsCardGroupFragment
    | SportRibbonCardGroupFragment
    | SportViewLinkCardFragment
    | SportsbookBetCardFragment
    | SportsbookBetInfoCardFragment
    | SportsbookBetLegCardGroupFragment
    | SwimlaneCardGroupFragment
    | SwimlaneIndexedCardGroupFragment
    | TeamFormCardFragment
    | TimeFormBroadCastsCardFragment
    | ViewZoneFragment
    | VirtualCardGroupFragment
    | VirtualEventDetailsCardFragment
    | VirtualMarketCardFragment
    | {}
    | null
  > | null;
};

export type SetConfirmCashoutPreferenceMutationVariables = Exact<{
  urn: Scalars["URN"]["input"];
  value: Scalars["Boolean"]["input"];
  throttlesOn: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  throttlesOff: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  productExclusions: InputMaybe<Array<ProductExclusion> | ProductExclusion>;
}>;

export type SetConfirmCashoutPreferenceMutation = {
  setPreferences: {
    error: Array<string | null> | null;
    result: Array<ConfirmCashoutPreferenceFragment | {} | null> | null;
  };
};

export type SetDefaultProductPreferenceMutationVariables = Exact<{
  urn: Scalars["URN"]["input"];
  value: DefaultProduct;
  throttlesOn: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  throttlesOff: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  productExclusions: InputMaybe<Array<ProductExclusion> | ProductExclusion>;
}>;

export type SetDefaultProductPreferenceMutation = {
  setPreferences: {
    error: Array<string | null> | null;
    result: Array<DefaultProductPreferenceFragment | {} | null> | null;
  };
};

export type SetExchangeDefaultProductPreferenceMutationVariables = Exact<{
  urn: Scalars["URN"]["input"];
  value: ExchangeDefaultProduct;
  throttlesOn: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  throttlesOff: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  productExclusions: InputMaybe<Array<ProductExclusion> | ProductExclusion>;
}>;

export type SetExchangeDefaultProductPreferenceMutation = {
  setPreferences: {
    error: Array<string | null> | null;
    result: Array<ExchangeDefaultProductPreferenceFragment | {} | null> | null;
  };
};

export type SetFavouriteMarketMutationVariables = Exact<{
  contentSectionURN: Scalars["URN"]["input"];
  isFavourite: Scalars["Boolean"]["input"];
  throttlesOn: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  throttlesOff: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
}>;

export type SetFavouriteMarketMutation = {
  setFavouriteMarket: {
    error: string | null;
    result: {
      favouriteMarketsState: FavouriteMarketsStateFragment;
      favouriteMarketsNavigationTab: FavouriteMarketsNavigationTabLiteFragment;
    } | null;
  };
};

export type FilteredCouponQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
  preferences: InputMaybe<LayoutPreferencesInput>;
  productExclusions: InputMaybe<Array<ProductExclusion> | ProductExclusion>;
  filteredCouponFilterBy: InputMaybe<FilteredCouponFilterBy>;
  futureRacingFilterBy: InputMaybe<FutureRacingFilterBy>;
  racesByTimeRangeFilterBy: InputMaybe<ByTimeRangeFilterBy>;
  numberOfFilledCardsInCardGroup: Scalars["Int"]["input"];
  sortBy: InputMaybe<FilteredGroupSort>;
  experiments: InputMaybe<Array<ExperimentsInput> | ExperimentsInput>;
  throttlesOn: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  throttlesOff: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
}>;

export type FilteredCouponQuery = {
  Cards: Array<
    | FilteredCouponCardGroupWithItemsFilteredFragment
    | FutureRacingCardGroupWithItemsFilteredFragment
    | RacesByTimeRangeCardGroupWithItemsFilteredFragment
    | {}
    | null
  > | null;
};

export type FilteredSelectableItemsQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
  first: InputMaybe<Scalars["Int"]["input"]>;
  cursor: InputMaybe<Scalars["String"]["input"]>;
  filterBy: InputMaybe<SelectableItemsFilterOptions>;
  preferences: InputMaybe<LayoutPreferencesInput>;
  productExclusions: InputMaybe<Array<ProductExclusion> | ProductExclusion>;
  experiments: InputMaybe<Array<ExperimentsInput> | ExperimentsInput>;
  throttlesOn: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  throttlesOff: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
}>;

export type FilteredSelectableItemsQuery = {
  Cards: Array<SelectableitemsCardGroupFilteredFragment | {} | null> | null;
};

export type FullCardQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
  preferences: InputMaybe<LayoutPreferencesInput>;
  productExclusions: InputMaybe<Array<ProductExclusion> | ProductExclusion>;
  experiments: InputMaybe<Array<ExperimentsInput> | ExperimentsInput>;
  throttlesOn: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  throttlesOff: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
}>;

export type FullCardQuery = { Cards: Array<RaceResultsCardFragment | {} | null> | null };

export type GamingSearchQueryVariables = Exact<{
  query: Scalars["String"]["input"];
  first: InputMaybe<Scalars["Int"]["input"]>;
  after: InputMaybe<Scalars["String"]["input"]>;
}>;

export type GamingSearchQuery = { GamingSearch: FullGamingSearchCardItemsFragment };

export type GetWebMessagesQueryVariables = Exact<{
  throttlesOn: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  throttlesOff: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  productExclusions: InputMaybe<Array<ProductExclusion> | ProductExclusion>;
}>;

export type GetWebMessagesQuery = {
  MarketingMessages: Array<{
    urn: string;
    content: {
      title: string | null;
      templateUrl: string | null;
      templateHeight: number | null;
      templateWidth: number | null;
    };
  } | null>;
};

export type ImplyObbBetsQueryVariables = Exact<{
  implyBetsRequestInput: ImplyBetsRequestInput;
  throttlesOn: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  throttlesOff: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  productExclusions: InputMaybe<Array<ProductExclusion> | ProductExclusion>;
}>;

export type ImplyObbBetsQuery = {
  obb: {
    implyBets: {
      betDefinitions: Array<{
        id: string;
        details: {
          minStake: number;
          maxStake: number;
          maxPayout: number;
          minStakeIncrement: number;
          currency: string;
          price: { decimal: number; fractional: { numerator: number; denominator: number } };
        } | null;
        result: { resultCode: string; errorDetails: string | null };
      }>;
      combinedBetDefinitions: Array<{
        result: { resultCode: string; errorDetails: string | null };
        legs: Array<{
          expressionTemplateId: string | null;
          betDefinitions: Array<string>;
          eventId: { supplier: string; id: string } | null;
          baseExpressionTemplateDefinitions: Array<{ expressionTemplateId: string }> | null;
          expressionParams: {
            x: number;
            baseBets: Array<{
              templateId: string;
              params: {
                outcomeId: string | null;
                timePeriodId: string | null;
                participantIdA: string | null;
                participantIdB: string | null;
                squadAParticipantIds: Array<string> | null;
                squadBParticipantIds: Array<string> | null;
                value: number | null;
                quantifier: string | null;
                participantIds: Array<string> | null;
                outcomeIds: Array<string> | null;
              };
            } | null>;
          } | null;
          result: { errorDetails: string | null; resultCode: string };
        }>;
        details: {
          minStake: number;
          maxStake: number;
          maxPayout: number;
          minStakeIncrement: number;
          currency: string;
          price: { decimal: number; fractional: { numerator: number; denominator: number } };
        } | null;
      }>;
      result: { resultCode: string; errorDetails: string | null };
    };
  } | null;
};

export type SetLastViewedProductPreferenceMutationVariables = Exact<{
  urn: Scalars["URN"]["input"];
  value: LastViewedProduct;
  throttlesOn: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  throttlesOff: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  productExclusions: InputMaybe<Array<ProductExclusion> | ProductExclusion>;
}>;

export type SetLastViewedProductPreferenceMutation = {
  setPreferences: {
    error: Array<string | null> | null;
    result: Array<LastViewedProductPreferenceFragment | {} | null> | null;
  };
};

export type MainMarketsQueryVariables = Exact<{
  urn: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
  withFixtureUpdates: Scalars["Boolean"]["input"];
  preferences: InputMaybe<LayoutPreferencesInput>;
  productExclusions: InputMaybe<Array<ProductExclusion> | ProductExclusion>;
  experiments: InputMaybe<Array<ExperimentsInput> | ExperimentsInput>;
  throttlesOn: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  throttlesOff: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
}>;

export type MainMarketsQuery = {
  Cards: Array<
    | { __typename: "AccountBannersCard" }
    | { __typename: "BalanceCard" }
    | { __typename: "BetCardGroup" }
    | { __typename: "BetLegCard" }
    | { __typename: "BetOpportunityPromoCard" }
    | { __typename: "BetSharingCardGroup" }
    | { __typename: "BlurbCard" }
    | { __typename: "BreadcrumbsCard" }
    | { __typename: "BroadcastsAndStatisticsCard" }
    | { __typename: "BroadcastsCard" }
    | { __typename: "BudgetLimitsCard" }
    | { __typename: "ByTimeRangeMeetingCardGroup" }
    | { __typename: "CdvTrackerCard" }
    | { __typename: "CompetitionRegionCard" }
    | { __typename: "CompetitionViewLinkCard" }
    | { __typename: "ContentSummaryCard" }
    | { __typename: "CorrectScoreCard" }
    | { __typename: "CouponHeaderCard" }
    | { __typename: "EditorialPromoCard" }
    | { __typename: "EmbeddedContentCard" }
    | { __typename: "EmbeddedViewCard" }
    | { __typename: "EventHeaderCard" }
    | ({
        __typename: "EventMarketCard";
        fixture?:
          | FixtureAmericanFootballFixtureFragment
          | FixtureAustralianRulesFixtureFragment
          | FixtureBaseFixtureFragment
          | FixtureBaseballFixtureFragment
          | FixtureBasketballFixtureFragment
          | FixtureCricketFixtureFragment
          | FixtureDartsFixtureFragment
          | FixtureFootballFixtureFragment
          | FixtureIceHockeyFixtureFragment
          | FixtureRugbyLeagueFixtureFragment
          | FixtureRugbyUnionFixtureFragment
          | FixtureSnookerFixtureFragment
          | FixtureTableTennisFixtureFragment
          | FixtureTennisMatchFragment
          | FixtureVolleyballFixtureFragment;
      } & EventMarketCardWithoutSporeventOrFixtureFragment)
    | { __typename: "EventStatsCard" }
    | { __typename: "EventViewLinkCard" }
    | { __typename: "ExpandableCardGroup" }
    | { __typename: "ExpandableMarketCard" }
    | { __typename: "ExtraWalletCard" }
    | { __typename: "ExtraWalletCardGroup" }
    | { __typename: "FavouriteMarketsNavigationTab" }
    | { __typename: "FilteredCouponCardGroup" }
    | {
        __typename: "FixtureCard";
        urn: string;
        fixture:
          | FixtureAmericanFootballFixtureFragment
          | FixtureAustralianRulesFixtureFragment
          | FixtureBaseFixtureFragment
          | FixtureBaseballFixtureFragment
          | FixtureBasketballFixtureFragment
          | FixtureCricketFixtureFragment
          | FixtureDartsFixtureFragment
          | FixtureFootballFixtureFragment
          | FixtureIceHockeyFixtureFragment
          | FixtureRugbyLeagueFixtureFragment
          | FixtureRugbyUnionFixtureFragment
          | FixtureSnookerFixtureFragment
          | FixtureTableTennisFixtureFragment
          | FixtureTennisMatchFragment
          | FixtureVolleyballFixtureFragment;
      }
    | { __typename: "FootballPlayerCompetitionStatsCard" }
    | { __typename: "ForbiddenContentCard" }
    | { __typename: "FutureRacingCardGroup" }
    | { __typename: "GameCard" }
    | { __typename: "GameInfoCard" }
    | { __typename: "GamingBackNavigationCard" }
    | { __typename: "GamingCardGroup" }
    | { __typename: "GamingJackpotCard" }
    | { __typename: "GamingLinkCard" }
    | { __typename: "GamingPlayNewCard" }
    | { __typename: "GamingPrizeMachineCard" }
    | { __typename: "GenericSwitcherCard" }
    | { __typename: "GenericViewLinkCard" }
    | { __typename: "GridCard" }
    | { __typename: "HalfTimeSpecialsSwimlaneCardGroup" }
    | { __typename: "HeadToHeadCard" }
    | { __typename: "HighlightedSelectionCard" }
    | { __typename: "ImsPromotionDetailsCard" }
    | { __typename: "ImsPromotionErrorCard" }
    | { __typename: "ImsPromotionStateCard" }
    | { __typename: "ImsPromotionTermsAndConditionsCard" }
    | { __typename: "IncidentsCard" }
    | { __typename: "LinksCard" }
    | { __typename: "LottoCard" }
    | { __typename: "LoyaltyPromoCard" }
    | { __typename: "MarketBetCard" }
    | { __typename: "MarketBetCardGroup" }
    | { __typename: "MarketBetExpandableCardGroup" }
    | { __typename: "MarketBetSelectionCard" }
    | { __typename: "MarketBetSelectionCardGroup" }
    | { __typename: "MarketCard" }
    | { __typename: "MarketExtendedCard" }
    | { __typename: "MarketGraphsCard" }
    | { __typename: "MarketRulesCard" }
    | { __typename: "MarketViewLinkCard" }
    | { __typename: "MatchStatSelectionCard" }
    | { __typename: "MatchStatsCard" }
    | { __typename: "MatchTimelineCard" }
    | { __typename: "MiniEditorialPromoCard" }
    | { __typename: "MiniPromoBannerCard" }
    | { __typename: "MiniSelectionPromoCard" }
    | { __typename: "MonterosaContentCard" }
    | { __typename: "NavigationTab" }
    | { __typename: "NavigationTabsList" }
    | { __typename: "ObbCardGroup" }
    | { __typename: "ObbCreatedBetsCard" }
    | { __typename: "ObbCreatedBetsCardGroup" }
    | { __typename: "ObbEventPopularsCard" }
    | { __typename: "ObbOnboardingCardsCardGroup" }
    | { __typename: "ObbPvpCard" }
    | { __typename: "ObbSection" }
    | { __typename: "ObbSquadBetCard" }
    | { __typename: "ObbSquadVsSquadCard" }
    | { __typename: "OutrightMarketListCard" }
    | { __typename: "PackagedCreatedBetsCard" }
    | { __typename: "PebbleCardGroup" }
    | { __typename: "PenaltyTakersCard" }
    | { __typename: "PlayerEventMarketsCard" }
    | { __typename: "PlayerMarketsCardGroup" }
    | { __typename: "PlayersRail" }
    | { __typename: "PopularBetBuilderCard" }
    | { __typename: "PopularMultiplesBetBuilderCard" }
    | { __typename: "PopularSelectionsCard" }
    | { __typename: "PopularSwimlaneCardGroup" }
    | { __typename: "PreferenceSingleChoiceCard" }
    | { __typename: "PriceBoostMultiplePromoCard" }
    | { __typename: "PriceBoostMultisCard" }
    | { __typename: "PriceBoostMultisListCard" }
    | { __typename: "PromotionCard" }
    | { __typename: "PromotionTrackerErrorCard" }
    | { __typename: "PromotionsCardGroup" }
    | { __typename: "PromotionsHubCard" }
    | { __typename: "PromotionsHubCardGroup" }
    | { __typename: "QuickLinksCard" }
    | { __typename: "QuicklinksGridCardGroup" }
    | { __typename: "RaceByTimeRangeCard" }
    | { __typename: "RaceDetailsCard" }
    | { __typename: "RaceMarketCard" }
    | { __typename: "RaceResultsCard" }
    | { __typename: "RaceSwitcherCard" }
    | { __typename: "RaceViewLinkCard" }
    | { __typename: "RaceViewLinksCard" }
    | { __typename: "RacesByTimeRangeCardGroup" }
    | { __typename: "RacingSwimlaneCardGroup" }
    | { __typename: "RegulatoryCard" }
    | { __typename: "RewardsCard" }
    | { __typename: "RunnerInfoCard" }
    | { __typename: "SearchBarCard" }
    | { __typename: "SearchZone" }
    | { __typename: "SegmentedCardGroup" }
    | { __typename: "SelectableItemsCardGroup" }
    | { __typename: "SelectionPromoCard" }
    | { __typename: "SelfExclusionCard" }
    | { __typename: "SkyBetClubTrackerCard" }
    | { __typename: "SnookerFixtureCard" }
    | { __typename: "SportRibbonCardGroup" }
    | { __typename: "SportViewLinkCard" }
    | { __typename: "SportsbookBetCard" }
    | { __typename: "SportsbookBetInfoCard" }
    | { __typename: "SportsbookBetLegCardGroup" }
    | { __typename: "SportsbookChatbotCard" }
    | { __typename: "SportsbookExpandableLegCardGroup" }
    | { __typename: "SportsbookLotteriesBetLegCardGroup" }
    | { __typename: "StatsBroadcastsCard" }
    | { __typename: "StatsContentCardGroup" }
    | { __typename: "StatsFormCard" }
    | { __typename: "StatsGoalsAndShotsCard" }
    | { __typename: "StatsHeadToHeadCard" }
    | { __typename: "StatsLineupsCard" }
    | { __typename: "StatsMatchStatsCard" }
    | { __typename: "StatsPebbleCardGroup" }
    | { __typename: "StatsPlayersInPlayCard" }
    | { __typename: "StatsPlayersSeasonStatsCard" }
    | { __typename: "StatsRaceResultsCard" }
    | { __typename: "StatsSupportingContentButtonsCardGroup" }
    | { __typename: "StatsTableCard" }
    | { __typename: "StatsTeamsCard" }
    | { __typename: "SwimlaneCardGroup" }
    | { __typename: "SwimlaneIndexedCardGroup" }
    | { __typename: "TeamFormCard" }
    | { __typename: "TeamLineupCard" }
    | { __typename: "TimeFormBroadCastsCard" }
    | { __typename: "ViewZone" }
    | { __typename: "VirtualCardGroup" }
    | { __typename: "VirtualEventDetailsCard" }
    | { __typename: "VirtualMarketCard" }
    | null
  > | null;
};

export type MarketsQueryVariables = Exact<{
  URNs: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
  preferences: InputMaybe<LayoutPreferencesInput>;
  throttlesOn: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  throttlesOff: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  productExclusions: InputMaybe<Array<ProductExclusion> | ProductExclusion>;
}>;

export type MarketsQuery = {
  Markets: Array<ExchangeMarketBettingFragment | SportsbookMarketBettingFragment | null> | null;
};

export type ObbGetEventParticipantsQueryVariables = Exact<{
  eventParticipantsRequestInput: EventParticipantsRequestInput;
  incidentTypeFiltersInput: InputMaybe<IncidentTypesFilterInput>;
  throttlesOn: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  throttlesOff: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  productExclusions: InputMaybe<Array<ProductExclusion> | ProductExclusion>;
}>;

export type ObbGetEventParticipantsQuery = {
  obb: {
    eventParticipants: Array<{
      urn: string;
      incidentTypes: Array<{ id: string; resultType: { value: string } | { max: number; min: number } }>;
    }>;
  } | null;
};

export type ObbQuotesQueryVariables = Exact<{
  quotesRequestInput: QuotesRequestInput;
  throttlesOn: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  throttlesOff: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  productExclusions: InputMaybe<Array<ProductExclusion> | ProductExclusion>;
}>;

export type ObbQuotesQuery = {
  obb: {
    quotes: {
      eventId: { id: string; supplier: string };
      prices: Array<{
        id: string;
        price: { decimal: number; fractional: { numerator: number; denominator: number } } | null;
        result: { resultCode: string; errorDetails: string | null };
      }>;
    };
  } | null;
};

export type ObbSquadbetQuotesQueryVariables = Exact<{
  squadBetQuotesRequestInput: SquadBetQuotesRequestInput;
  throttlesOn: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  throttlesOff: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  productExclusions: InputMaybe<Array<ProductExclusion> | ProductExclusion>;
}>;

export type ObbSquadbetQuotesQuery = {
  obb: { squadBetQuotes: { defaultOutcomeIndex: number; legs: Array<ObbLegFragment> } } | null;
};

export type OptinCppPromoLegacyMutationVariables = Exact<{
  urn: Scalars["URN"]["input"];
  throttlesOn: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  throttlesOff: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  productExclusions: InputMaybe<Array<ProductExclusion> | ProductExclusion>;
}>;

export type OptinCppPromoLegacyMutation = { optinCppPromo: LoyaltyPromotionLegacyFragment | {} | null };

export type PlaceObbBetMutationVariables = Exact<{
  requestInput: PlaceBetRequestInput;
  throttlesOn: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  throttlesOff: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  productExclusions: InputMaybe<Array<ProductExclusion> | ProductExclusion>;
}>;

export type PlaceObbBetMutation = {
  obbPlaceBet: {
    betPlacementsResult: Array<{
      id: string;
      result: {
        resultCode: string;
        errorDetails: string | null;
        legResults: Array<{ resultCode: string; errorDetails: string | null }>;
      };
      betDetails: {
        id: string;
        receiptId: string;
        betType: string;
        placedDate: string;
        stake: number;
        stakePerLine: number;
        potentialPayout: number | null;
        currency: string;
        price: { decimal: number; fractional: { numerator: number; denominator: number } };
        outcomeBasedLegs: Array<{
          price: { decimal: number; fractional: { numerator: number; denominator: number } };
          eventId: { id: string; supplier: string };
        }>;
      } | null;
    }>;
    result: { resultCode: string; errorDetails: string | null };
  };
};

export type RaceRunnersQueryVariables = Exact<{
  URNs: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
  throttlesOn: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  throttlesOff: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  productExclusions: InputMaybe<Array<ProductExclusion> | ProductExclusion>;
}>;

export type RaceRunnersQuery = { RaceRunners: Array<RaceRunnerHorsePastPerformanceFragment | null> | null };

export type ReadWebMessageMutationVariables = Exact<{
  customerMessageId: Scalars["Float"]["input"];
  throttlesOn: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  throttlesOff: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  productExclusions: InputMaybe<Array<ProductExclusion> | ProductExclusion>;
}>;

export type ReadWebMessageMutation = { readWebMessage: { state: string | null } };

export type SearchViewQueryVariables = Exact<{
  query: Scalars["String"]["input"];
  preferences: InputMaybe<LayoutPreferencesInput>;
  productExclusions: InputMaybe<Array<ProductExclusion> | ProductExclusion>;
  experiments: InputMaybe<Array<ExperimentsInput> | ExperimentsInput>;
  throttlesOn: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  throttlesOff: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
}>;

export type SearchViewQuery = {
  Search: {
    query: string;
    pageSize: number;
    startIndex: number;
    didYouMean: string | null;
    results: Array<
      | { __typename: "CompetitionView"; urn: string; url: string; competition: CompetitionWithLogoFragment }
      | {
          __typename: "EventView";
          urn: string;
          url: string;
          sportevent: {
            name: string;
            openDate: string;
            competition: CompetitionBasicFragment | null;
            sport: SportFragment;
          };
        }
      | { __typename: "RaceMeetingView"; urn: string }
      | {
          __typename: "RaceView";
          urn: string;
          url: string;
          race: {
            __typename: "Race";
            urn: string;
            startTime: string;
            name: string;
            meeting: {
              __typename: "Meeting";
              urn: string;
              name: string;
              country: string;
              venue: string;
              date: string | null;
            };
            sport: SportFragment;
          };
        }
      | null
    > | null;
  };
};

export type SetSingleChoicePreferenceMutationVariables = Exact<{
  urn: Scalars["URN"]["input"];
  value: Scalars["String"]["input"];
  throttlesOn: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  throttlesOff: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  productExclusions: InputMaybe<Array<ProductExclusion> | ProductExclusion>;
}>;

export type SetSingleChoicePreferenceMutation = {
  setPreferences: {
    error: Array<string | null> | null;
    result: Array<PreferenceSingleChoiceFragment | {} | null> | null;
  };
};

export type SetUserProductsPreferenceMutationVariables = Exact<{
  urn: Scalars["URN"]["input"];
  value: Array<UserProducts> | UserProducts;
  throttlesOn: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  throttlesOff: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  productExclusions: InputMaybe<Array<ProductExclusion> | ProductExclusion>;
}>;

export type SetUserProductsPreferenceMutation = {
  setPreferences: {
    error: Array<string | null> | null;
    result: Array<UserProductsPreferenceFragment | {} | null> | null;
  };
};

export type ViewQueryVariables = Exact<{
  urn: Scalars["URN"]["input"];
  withBottomBar?: InputMaybe<Scalars["Boolean"]["input"]>;
  withLeftSidebar?: InputMaybe<Scalars["Boolean"]["input"]>;
  withRegulatoryData?: InputMaybe<Scalars["Boolean"]["input"]>;
  withXSellBar?: InputMaybe<Scalars["Boolean"]["input"]>;
  numberOfFilledCardsInCardGroup: Scalars["Int"]["input"];
  numberOfFilledCardsInView: Scalars["Int"]["input"];
  withPageInfo?: InputMaybe<Scalars["Boolean"]["input"]>;
  first: InputMaybe<Scalars["Int"]["input"]>;
  cursor: InputMaybe<Scalars["String"]["input"]>;
  preferences: InputMaybe<LayoutPreferencesInput>;
  productExclusions: InputMaybe<Array<ProductExclusion> | ProductExclusion>;
  experiments: InputMaybe<Array<ExperimentsInput> | ExperimentsInput>;
  throttlesOn: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  throttlesOff: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  decorationsOnly?: Scalars["Boolean"]["input"];
}>;

export type ViewQuery = {
  View:
    | (ViewDecorationsAllCompetitionsViewFragment & FullViewAllCompetitionsViewFragment)
    | (ViewDecorationsAllMarketsViewFragment & FullViewAllMarketsViewFragment)
    | (ViewDecorationsBrowseViewFragment & FullViewBrowseViewFragment)
    | (ViewDecorationsCompetitionViewFragment & FullViewCompetitionViewFragment)
    | (ViewDecorationsEventViewFragment & FullViewEventViewFragment)
    | (ViewDecorationsGameViewFragment & FullViewGameViewFragment)
    | (ViewDecorationsGamingCategoryViewFragment & FullViewGamingCategoryViewFragment)
    | (ViewDecorationsGamingSegmentationViewFragment & FullViewGamingSegmentationViewFragment)
    | (ViewDecorationsGamingViewFragment & FullViewGamingViewFragment)
    | (ViewDecorationsGenericViewFragment & FullViewGenericViewFragment)
    | (ViewDecorationsImsPromotionViewFragment & FullViewImsPromotionViewFragment)
    | (ViewDecorationsMaintenanceViewFragment & FullViewMaintenanceViewFragment)
    | (ViewDecorationsMarketRulesViewFragment & FullViewMarketRulesViewFragment)
    | (ViewDecorationsMarketViewFragment & FullViewMarketViewFragment)
    | (ViewDecorationsMyAccountViewFragment & FullViewMyAccountViewFragment)
    | (ViewDecorationsMyBetsViewFragment & FullViewMyBetsViewFragment)
    | (ViewDecorationsNotFoundViewFragment & FullViewNotFoundViewFragment)
    | (ViewDecorationsObbLandingPageViewFragment & FullViewObbLandingPageViewFragment)
    | (ViewDecorationsPlayerViewFragment & FullViewPlayerViewFragment)
    | (ViewDecorationsPromotionsHubViewFragment & FullViewPromotionsHubViewFragment)
    | (ViewDecorationsPromotionsViewFragment & FullViewPromotionsViewFragment)
    | (ViewDecorationsRaceMeetingViewFragment & FullViewRaceMeetingViewFragment)
    | (ViewDecorationsRaceViewFragment & FullViewRaceViewFragment)
    | (ViewDecorationsRunnerViewFragment & FullViewRunnerViewFragment)
    | (ViewDecorationsSelfExcludedViewFragment & FullViewSelfExcludedViewFragment)
    | (ViewDecorationsSettingsViewFragment & FullViewSettingsViewFragment)
    | (ViewDecorationsSportViewFragment & FullViewSportViewFragment)
    | null;
};

type ViewDecorationsAllCompetitionsViewFragment = {
  __typename: "AllCompetitionsView";
  urn: string;
  url: string;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar?: XSellBarFragment | null;
};

type ViewDecorationsAllMarketsViewFragment = {
  __typename: "AllMarketsView";
  urn: string;
  url: string;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar?: XSellBarFragment | null;
};

type ViewDecorationsBrowseViewFragment = {
  __typename: "BrowseView";
  urn: string;
  url: string;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar?: XSellBarFragment | null;
};

type ViewDecorationsCompetitionViewFragment = {
  __typename: "CompetitionView";
  urn: string;
  url: string;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar?: XSellBarFragment | null;
};

type ViewDecorationsEventViewFragment = {
  __typename: "EventView";
  urn: string;
  url: string;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar?: XSellBarFragment | null;
};

type ViewDecorationsGameViewFragment = {
  __typename: "GameView";
  urn: string;
  url: string;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar?: XSellBarFragment | null;
};

type ViewDecorationsGamingCategoryViewFragment = {
  __typename: "GamingCategoryView";
  urn: string;
  url: string;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar?: XSellBarFragment | null;
};

type ViewDecorationsGamingSegmentationViewFragment = {
  __typename: "GamingSegmentationView";
  urn: string;
  url: string;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar?: XSellBarFragment | null;
};

type ViewDecorationsGamingViewFragment = {
  __typename: "GamingView";
  urn: string;
  url: string;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar?: XSellBarFragment | null;
};

type ViewDecorationsGenericViewFragment = {
  __typename: "GenericView";
  urn: string;
  url: string;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar?: XSellBarFragment | null;
};

type ViewDecorationsImsPromotionViewFragment = {
  __typename: "ImsPromotionView";
  urn: string;
  url: string;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar?: XSellBarFragment | null;
};

type ViewDecorationsMaintenanceViewFragment = {
  __typename: "MaintenanceView";
  urn: string;
  url: string;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar?: XSellBarFragment | null;
};

type ViewDecorationsMarketRulesViewFragment = {
  __typename: "MarketRulesView";
  urn: string;
  url: string;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar?: XSellBarFragment | null;
};

type ViewDecorationsMarketViewFragment = {
  __typename: "MarketView";
  urn: string;
  url: string;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar?: XSellBarFragment | null;
};

type ViewDecorationsMyAccountViewFragment = {
  __typename: "MyAccountView";
  urn: string;
  url: string;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar?: XSellBarFragment | null;
};

type ViewDecorationsMyBetsViewFragment = {
  __typename: "MyBetsView";
  urn: string;
  url: string;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar?: XSellBarFragment | null;
};

type ViewDecorationsNotFoundViewFragment = {
  __typename: "NotFoundView";
  urn: string;
  url: string;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar?: XSellBarFragment | null;
};

type ViewDecorationsObbLandingPageViewFragment = {
  __typename: "ObbLandingPageView";
  urn: string;
  url: string;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar?: XSellBarFragment | null;
};

type ViewDecorationsPlayerViewFragment = {
  __typename: "PlayerView";
  urn: string;
  url: string;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar?: XSellBarFragment | null;
};

type ViewDecorationsPromotionsHubViewFragment = {
  __typename: "PromotionsHubView";
  urn: string;
  url: string;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar?: XSellBarFragment | null;
};

type ViewDecorationsPromotionsViewFragment = {
  __typename: "PromotionsView";
  urn: string;
  url: string;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar?: XSellBarFragment | null;
};

type ViewDecorationsRaceMeetingViewFragment = {
  __typename: "RaceMeetingView";
  urn: string;
  url: string;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar?: XSellBarFragment | null;
};

type ViewDecorationsRaceViewFragment = {
  __typename: "RaceView";
  urn: string;
  url: string;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar?: XSellBarFragment | null;
};

type ViewDecorationsRunnerViewFragment = {
  __typename: "RunnerView";
  urn: string;
  url: string;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar?: XSellBarFragment | null;
};

type ViewDecorationsSelfExcludedViewFragment = {
  __typename: "SelfExcludedView";
  urn: string;
  url: string;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar?: XSellBarFragment | null;
};

type ViewDecorationsSettingsViewFragment = {
  __typename: "SettingsView";
  urn: string;
  url: string;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar?: XSellBarFragment | null;
};

type ViewDecorationsSportViewFragment = {
  __typename: "SportView";
  urn: string;
  url: string;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar?: XSellBarFragment | null;
};

export type ViewDecorationsFragment =
  | ViewDecorationsAllCompetitionsViewFragment
  | ViewDecorationsAllMarketsViewFragment
  | ViewDecorationsBrowseViewFragment
  | ViewDecorationsCompetitionViewFragment
  | ViewDecorationsEventViewFragment
  | ViewDecorationsGameViewFragment
  | ViewDecorationsGamingCategoryViewFragment
  | ViewDecorationsGamingSegmentationViewFragment
  | ViewDecorationsGamingViewFragment
  | ViewDecorationsGenericViewFragment
  | ViewDecorationsImsPromotionViewFragment
  | ViewDecorationsMaintenanceViewFragment
  | ViewDecorationsMarketRulesViewFragment
  | ViewDecorationsMarketViewFragment
  | ViewDecorationsMyAccountViewFragment
  | ViewDecorationsMyBetsViewFragment
  | ViewDecorationsNotFoundViewFragment
  | ViewDecorationsObbLandingPageViewFragment
  | ViewDecorationsPlayerViewFragment
  | ViewDecorationsPromotionsHubViewFragment
  | ViewDecorationsPromotionsViewFragment
  | ViewDecorationsRaceMeetingViewFragment
  | ViewDecorationsRaceViewFragment
  | ViewDecorationsRunnerViewFragment
  | ViewDecorationsSelfExcludedViewFragment
  | ViewDecorationsSettingsViewFragment
  | ViewDecorationsSportViewFragment;

type FullViewAllCompetitionsViewFragment = AllCompetitionsViewFragment;

type FullViewAllMarketsViewFragment = AllMarketsViewFragment;

type FullViewBrowseViewFragment = BrowseViewFragment;

type FullViewCompetitionViewFragment = CompetitionViewFragment;

type FullViewEventViewFragment = EventViewFragment;

type FullViewGameViewFragment = GameViewFragment;

type FullViewGamingCategoryViewFragment = GamingCategoryViewFragment;

type FullViewGamingSegmentationViewFragment = GamingSegmentationViewFragment;

type FullViewGamingViewFragment = GamingViewFragment;

type FullViewGenericViewFragment = GenericViewFragment;

type FullViewImsPromotionViewFragment = ImsPromotionViewFragment;

type FullViewMaintenanceViewFragment = MaintenanceViewFragment;

type FullViewMarketRulesViewFragment = MarketRulesViewFragment;

type FullViewMarketViewFragment = MarketViewFragment;

type FullViewMyAccountViewFragment = MyAccountViewFragment;

type FullViewMyBetsViewFragment = MyBetsViewFragment;

type FullViewNotFoundViewFragment = NotFoundViewFragment;

type FullViewObbLandingPageViewFragment = ObbLandingPageViewFragment;

type FullViewPlayerViewFragment = {};

type FullViewPromotionsHubViewFragment = PromotionsHubViewFragment;

type FullViewPromotionsViewFragment = PromotionsViewFragment;

type FullViewRaceMeetingViewFragment = { __typename: "RaceMeetingView"; urn: string };

type FullViewRaceViewFragment = RaceViewFragment;

type FullViewRunnerViewFragment = RunnerViewFragment;

type FullViewSelfExcludedViewFragment = SelfExcludedViewFragment;

type FullViewSettingsViewFragment = SettingsViewFragment;

type FullViewSportViewFragment = SportViewFragment;

export type FullViewFragment =
  | FullViewAllCompetitionsViewFragment
  | FullViewAllMarketsViewFragment
  | FullViewBrowseViewFragment
  | FullViewCompetitionViewFragment
  | FullViewEventViewFragment
  | FullViewGameViewFragment
  | FullViewGamingCategoryViewFragment
  | FullViewGamingSegmentationViewFragment
  | FullViewGamingViewFragment
  | FullViewGenericViewFragment
  | FullViewImsPromotionViewFragment
  | FullViewMaintenanceViewFragment
  | FullViewMarketRulesViewFragment
  | FullViewMarketViewFragment
  | FullViewMyAccountViewFragment
  | FullViewMyBetsViewFragment
  | FullViewNotFoundViewFragment
  | FullViewObbLandingPageViewFragment
  | FullViewPlayerViewFragment
  | FullViewPromotionsHubViewFragment
  | FullViewPromotionsViewFragment
  | FullViewRaceMeetingViewFragment
  | FullViewRaceViewFragment
  | FullViewRunnerViewFragment
  | FullViewSelfExcludedViewFragment
  | FullViewSettingsViewFragment
  | FullViewSportViewFragment;

export type VirtualMarketsQueryVariables = Exact<{
  URNs: Array<Scalars["URN"]["input"]> | Scalars["URN"]["input"];
  throttlesOn: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  throttlesOff: InputMaybe<Array<Scalars["String"]["input"]> | Scalars["String"]["input"]>;
  productExclusions: InputMaybe<Array<ProductExclusion> | ProductExclusion>;
}>;

export type VirtualMarketsQuery = { VirtualMarkets: Array<VirtualMarketFragment | null> };

export type BottomBarFragment = {
  __typename: "BottomBar";
  hasProductSwitcher: boolean | null;
  tiles: Array<{
    tileType: string | null;
    viewLink: { viewUrn: string; viewUrl: string; viewDisplayMode: DisplayMode | null } | null;
  } | null> | null;
};

export type AccountBannersCardFragment = {
  __typename: "AccountBannersCard";
  urn: string;
  bannerDetails: Array<{
    isMinimized: boolean | null;
    priority: string | null;
    useCase: string | null;
    flow: string | null;
    template: string | null;
    attentionLevel: string | null;
    maxDisplays: number | null;
    version: number | null;
    isClosable: boolean | null;
    bannerType: string | null;
    bannerInfo: {
      title: string | null;
      bodyContent: {
        text: string | null;
        items: Array<string | null> | null;
        formContent: {
          addressInfo: {
            addressLabel: string | null;
            postcodeLabel: string | null;
            jumioAddressStreetName: string | null;
            jumioAddressCity: string | null;
            jumioAddressProvince: string | null;
          } | null;
        } | null;
        contactUsInfo: { link: string | null; label: string | null } | null;
      } | null;
    } | null;
    minimizedBannerInfo: { bodyText: string | null } | null;
    bannerActions: Array<{
      label: string | null;
      gaLabel: string | null;
      minimizedLabel: string | null;
      type: string | null;
      buttonType: string | null;
      path: string | null;
      url: string | null;
      target: string | null;
      action: string | null;
      data: string | null;
      actionFinalize: {
        onErrorBanner: {
          isMinimized: boolean | null;
          priority: string | null;
          useCase: string | null;
          flow: string | null;
          template: string | null;
          attentionLevel: string | null;
          maxDisplays: number | null;
          version: number | null;
          isClosable: boolean | null;
          bannerInfo: {
            title: string | null;
            bodyContent: {
              text: string | null;
              items: Array<string | null> | null;
              formContent: {
                addressInfo: {
                  addressLabel: string | null;
                  postcodeLabel: string | null;
                  jumioAddressStreetName: string | null;
                  jumioAddressCity: string | null;
                  jumioAddressProvince: string | null;
                } | null;
              } | null;
              contactUsInfo: { link: string | null; label: string | null } | null;
            } | null;
          } | null;
          minimizedBannerInfo: { bodyText: string | null } | null;
          bannerActions: Array<{
            label: string | null;
            gaLabel: string | null;
            minimizedLabel: string | null;
            type: string | null;
            buttonType: string | null;
            path: string | null;
            url: string | null;
            target: string | null;
            action: string | null;
            data: string | null;
          } | null> | null;
        } | null;
      } | null;
    } | null> | null;
  } | null> | null;
};

export type AccountBannersCardPartialFragment = { __typename: "AccountBannersCard"; urn: string };

export type BalanceCardFragment = {
  __typename: "BalanceCard";
  urn: string;
  wallets: Array<{ name: string | null }>;
  walletSections: Array<{
    __typename: "WalletSectios";
    key: string | null;
    label: string | null;
    name: string | null;
    walletRules: Array<{
      __typename: "WalletRule";
      name: string | null;
      hideIfZero: boolean | null;
      withCurrency: boolean;
      aggregationRules: Array<{
        __typename: "WalletAggregationRule";
        field: string | null;
        sign: string | null;
        wallet: string | null;
      } | null> | null;
    }>;
  }>;
};

export type BalanceCardPartialFragment = { __typename: "BalanceCard"; urn: string };

export type BetSharingCardGroupFragment = {
  __typename: "BetSharingCardGroup";
  urn: string;
  bet: SportsbookBetFragment;
  full: { edges: Array<{ node: SportsbookBetLegCardGroupFragment | {} } | null> };
};

export type BetSharingCardGroupPartialFragment = { __typename: "BetSharingCardGroup"; urn: string };

export type BetCardGroupFragment = {
  __typename: "BetCardGroup";
  urn: string;
  aggregatorId: string | null;
  aggregatorDesc: string | null;
  full: {
    edges: Array<{
      node:
        | EventHeaderCardFragment
        | FixtureCardFragment
        | MarketBetCardGroupFragment
        | RaceDetailsCardFragment
        | SportsbookBetCardFragment
        | SportsbookExpandableLegCardGroupFragment
        | {};
    } | null>;
  };
};

export type BetCardGroupPartialFragment = { __typename: "BetCardGroup"; urn: string };

export type BlurbCardFragment = { __typename: "BlurbCard"; urn: string; blurb: InformativeBlurbFragment };

export type InformativeBlurbFragment = {
  isCollapsed: boolean;
  title: DisplayNameDisplayNameTitleFragment | DisplayNameDisplayNameTranslationKeyFragment;
  description: DisplayNameDisplayNameTitleFragment | DisplayNameDisplayNameTranslationKeyFragment | null;
  supplementaryInfo: {
    label: DisplayNameDisplayNameTitleFragment | DisplayNameDisplayNameTranslationKeyFragment;
    viewLink: { viewUrn: string; viewUrl: string; viewDisplayMode: DisplayMode | null } | null;
  } | null;
};

export type BroadcastsAndStatisticsCardFragment = {
  __typename: "BroadcastsAndStatisticsCard";
  urn: string;
  eventBroadCastsIsCollapsed: boolean | null;
  sportevent: SportEventFragment;
  eventBroadCasts: { dataVizUrl: string | null; liveVideoUrl: string | null } | null;
  statisticsViewLink: { viewUrn: string; viewUrl: string } | null;
};

export type BroadcastsAndStatisticsCardPartialFragment = { __typename: "BroadcastsAndStatisticsCard"; urn: string };

export type BroadcastsCardDeprecatedFragment = {
  __typename: "BroadcastsCard";
  urn: string;
  isCollapsed: boolean;
  broadcasts: { dataVizUrl: string | null; liveVideoUrl: string | null };
};

export type BroadcastsCardPartialFragment = { __typename: "BroadcastsCard"; urn: string };

export type BudgetLimitsCardFragment = {
  __typename: "BudgetLimitsCard";
  urn: string;
  limits: Array<{
    amount: number;
    category: BudgetCategory;
    remain: number;
    reset: string;
    nextBreachable: boolean;
  } | null> | null;
};

export type BudgetLimitsCardPartialFragment = { __typename: "BudgetLimitsCard"; urn: string };

export type ByTimeRangeMeetingCardGroupFragment = {
  __typename: "ByTimeRangeMeetingCardGroup";
  urn: string;
  cardGroupTitle: string | null;
  displayName: { translationKey: string } | null;
  icon: { vector: string | null } | null;
  meetingItems: FullByTimeRangeMeetingCardGroupItemsFragment;
};

export type ByTimeRangeMeetingCardGroupPartialFragment = { __typename: "ByTimeRangeMeetingCardGroup"; urn: string };

export type CompetitionRegionCardFragment = {
  __typename: "CompetitionRegionCard";
  urn: string;
  competitionRegions: Array<{
    country: {
      urn: string;
      code: string;
      flag: { vector: string | null; small: string | null; medium: string | null; large: string | null } | null;
    };
    competitionViewLinks: Array<{
      urn: string;
      viewLink: { viewUrn: string; viewUrl: string };
      competition: CompetitionWithLogoFragment;
    }>;
  }>;
};

export type CompetitionRegionCardPartialFragment = { __typename: "CompetitionRegionCard"; urn: string };

export type CompetitionViewLinkCardFragment = {
  __typename: "CompetitionViewLinkCard";
  urn: string;
  viewLink: { viewUrn: string; viewUrl: string };
  competition: CompetitionFragment;
};

export type CompetitionViewLinkCardBasicFragment = {
  __typename: "CompetitionViewLinkCard";
  urn: string;
  viewLink: { viewUrn: string; viewUrl: string };
  competition: CompetitionBasicFragment;
};

export type ContentSummaryCardFragment = {
  __typename: "ContentSummaryCard";
  urn: string;
  sections: Array<{
    sectionType: RegulatorySectionType;
    title: string;
    includeToFaq: boolean | null;
    breadcrumbs: { __typename: "BreadcrumbsCard"; urn: string } | null;
    items: Array<
      | {
          __typename: "ContentSummaryGroupLinkItem";
          subtitle: string;
          items: Array<{
            alignment: RegulatoryItemAlignment;
            text: string;
            viewLink: { viewUrl: string; viewUrn: string };
          }>;
        }
      | { __typename: "ContentSummaryTextItem"; alignment: RegulatoryItemAlignment; text: string }
    >;
  }>;
};

export type ContentSummaryCardPartialFragment = { __typename: "ContentSummaryCard"; urn: string };

export type CorrectScoreCardFragment = {
  __typename: "CorrectScoreCard";
  urn: string;
  numberOfItemsToDisplay: number | null;
  market: SportsbookMarketFragment;
};

export type CorrectScoreCardPartialFragment = { __typename: "CorrectScoreCard"; urn: string };

export type CouponHeaderCardFragment = {
  __typename: "CouponHeaderCard";
  urn: string;
  columns: Array<string> | null;
  hasStats: boolean;
  competition: CompetitionBasicFragment;
  competitionViewLink: { viewUrn: string; viewUrl: string };
};

export type CouponHeaderCardPartialFragment = { __typename: "CouponHeaderCard"; urn: string };

export type DisplayNameTitleFragment = { __typename: "DisplayNameTitle"; name: string };

export type DisplayNameTranslationKeyFragment = { __typename: "DisplayNameTranslationKey"; translationKey: string };

type DisplayNameDisplayNameTitleFragment = DisplayNameTitleFragment;

type DisplayNameDisplayNameTranslationKeyFragment = DisplayNameTranslationKeyFragment;

export type DisplayNameFragment = DisplayNameDisplayNameTitleFragment | DisplayNameDisplayNameTranslationKeyFragment;

export type EventHeaderCardFragment = {
  __typename: "EventHeaderCard";
  urn: string;
  title: string;
  subtitle: string | null;
  tertiaryTitle: string | null;
  sportId: string | null;
  date: string | null;
};

export type EventHeaderCardPartialFragment = { __typename: "EventHeaderCard"; urn: string };

export type EventMarketCardFragment = {
  __typename: "EventMarketCard";
  urn: string;
  title: string;
  videoAvailable: boolean;
  isSuperSubEligible: boolean | null;
  eventViewLink: { viewUrn: string; viewUrl: string };
  runnerViewLinks: Array<{ runnerUrn: string; viewUrl: string; viewUrn: string }>;
  sportevent: SportEventFragment;
  statsPebble: { urn: string } | null;
  fixture:
    | FixtureAmericanFootballFixtureFragment
    | FixtureAustralianRulesFixtureFragment
    | FixtureBaseFixtureFragment
    | FixtureBaseballFixtureFragment
    | FixtureBasketballFixtureFragment
    | FixtureCricketFixtureFragment
    | FixtureDartsFixtureFragment
    | FixtureFootballFixtureFragment
    | FixtureIceHockeyFixtureFragment
    | FixtureRugbyLeagueFixtureFragment
    | FixtureRugbyUnionFixtureFragment
    | FixtureSnookerFixtureFragment
    | FixtureTableTennisFixtureFragment
    | FixtureTennisMatchFragment
    | FixtureVolleyballFixtureFragment;
  displayRunners: {
    exchange: { market: ExchangeMarketLiveDataFragment | {}; runners: Array<{ runnerURN: string }> } | null;
    sportsbook: { market: SportsbookMarketLiveDataFragment | {}; runners: Array<{ runnerURN: string }> } | null;
  };
  tabLink: {
    label: string;
    icon: { __typename: "PackIcon"; id: string; category: string } | null;
    tabViewLink: { viewUrn: string; viewUrl: string };
  } | null;
  marketPromo: { title: string; description: string; signposting: MarketPromoSignposting } | null;
};

export type EventMarketCardWithoutSporeventOrFixtureFragment = {
  __typename: "EventMarketCard";
  urn: string;
  title: string;
  eventViewLink: { viewUrn: string; viewUrl: string };
  runnerViewLinks: Array<{ runnerUrn: string; viewUrl: string; viewUrn: string }>;
  tabLink: {
    label: string;
    icon: { __typename: "PackIcon"; id: string; category: string } | null;
    tabViewLink: { viewUrn: string; viewUrl: string };
  } | null;
  displayRunners: {
    exchange: { market: ExchangeMarketLiveDataFragment | {}; runners: Array<{ runnerURN: string }> } | null;
    sportsbook: { market: SportsbookMarketLiveDataFragment | {}; runners: Array<{ runnerURN: string }> } | null;
  };
};

export type EventMarketCardPartialFragment = { __typename: "EventMarketCard"; urn: string };

export type EventStatsCardFragment = { __typename: "EventStatsCard"; urn: string; matchStatsUrl: string };

export type EventStatsCardPartialFragment = { __typename: "EventStatsCard"; urn: string };

export type EventViewLinkCardWithoutFixtureFragment = {
  __typename: "EventViewLinkCard";
  urn: string;
  viewLink: { viewUrn: string; viewUrl: string };
  sportevent: SportEventFragment;
};

export type EventViewLinkCardFragment = {
  eventViewLinkFixture: FootballFixtureLiteFragment | {} | null;
} & EventViewLinkCardWithoutFixtureFragment;

export type EventViewLinkCardPartialFragment = { __typename: "EventViewLinkCard"; urn: string };

export type ExpandableCardGroupFragment = {
  __typename: "ExpandableCardGroup";
  urn: string;
  isExpandable: boolean | null;
  isExpanded: boolean | null;
  expandableCardGroupTitle: string | null;
  full: FullExpandableCardGroupItemsFragment;
  partials: PartialsExpandableCardGroupItemsFragment;
};

export type ExpandableCardGroupPartialFragment = { __typename: "ExpandableCardGroup"; urn: string };

export type ExpandableMarketCardFragment = {
  __typename: "ExpandableMarketCard";
  urn: string;
  title: string;
  marketCardURN: string;
  viewOpenBets: { viewUrl: string; viewUrn: string } | null;
};

export type ExpandableMarketCardPartialFragment = { __typename: "ExpandableMarketCard"; urn: string };

export type ExpandableMarketCardEnrichedPartialFragment = {
  __typename: "ExpandableMarketCard";
  urn: string;
  title: string;
};

export type ExtraWalletCardGroupFragment = {
  __typename: "ExtraWalletCardGroup";
  urn: string;
  amount: number;
  helpUrl: string | null;
  bonusPageUrl: string | null;
  full: { edges: Array<{ node: ExtraWalletCardFragment } | null> };
};

export type ExtraWalletCardGroupPartialFragment = { __typename: "ExtraWalletCardGroup"; urn: string };

export type ExtraWalletCardFragment = {
  __typename: "ExtraWalletCard";
  urn: string;
  badges: Array<string | null>;
  extraWallet: ExtraWalletFragment;
  restrictions: { single: boolean | null; acca: boolean | null; sameGameMulti: boolean | null } | null;
};

export type ExtraWalletCardPartialFragment = { __typename: "ExtraWalletCard"; urn: string };

export type FilteredCouponCardGroupFragment = {
  __typename: "FilteredCouponCardGroup";
  urn: string;
  has90Min: boolean | null;
  filteredCouponTitle: string | null;
  filterOptions: FilteredCouponOptionsFragment | null;
  viewAll: { label: string; icon: string | null; viewLink: { viewUrn: string; viewUrl: string } } | null;
  full: FullFilteredCouponCardGroupItemsFragment;
  partials: PartialsFilteredCouponCardGroupItemsFragment;
};

export type FilteredCouponCardGroupWithItemsFilteredFragment = {
  __typename: "FilteredCouponCardGroup";
  urn: string;
  has90Min: boolean | null;
  full: FullFilteredCouponCardGroupItemsFragment;
  partials: PartialsFilteredCouponCardGroupItemsFragment;
};

export type FilteredCouponCardGroupPartialFragment = { __typename: "FilteredCouponCardGroup"; urn: string };

export type FilteredCouponOptionsFragment = {
  __typename: "FilteredCouponOptions";
  filtersSorting: Array<FilterKeys> | null;
  sortOption: { defaultOption: FilteredGroupSort | null; availableOptions: Array<FilteredGroupSort> } | null;
  dateRangeFilter: {
    urn: string;
    defaultOption: {
      urn: string;
      title: DisplayNameDisplayNameTitleFragment | DisplayNameDisplayNameTranslationKeyFragment;
    } | null;
    availableOptions: Array<{
      urn: string;
      title: DisplayNameDisplayNameTitleFragment | DisplayNameDisplayNameTranslationKeyFragment;
    }>;
  } | null;
  marketTypeFilter: {
    urn: string;
    layout: MarketTypeFilterLayout;
    defaultOption: { name: string; marketType: { urn: string } } | null;
    availableOptions: Array<{ name: string; marketType: { urn: string } }>;
  } | null;
  competitionsFilter: {
    urn: string;
    defaultOptions: Array<CompetitionBasicFragment> | null;
    topCompetitions: Array<CompetitionBasicFragment>;
  } | null;
};

export type FixtureCardFragment = {
  __typename: "FixtureCard";
  urn: string;
  availableToSubscribe: boolean;
  fixture:
    | FixtureAmericanFootballFixtureFragment
    | FixtureAustralianRulesFixtureFragment
    | FixtureBaseFixtureFragment
    | FixtureBaseballFixtureFragment
    | FixtureBasketballFixtureFragment
    | FixtureCricketFixtureFragment
    | FixtureDartsFixtureFragment
    | FixtureFootballFixtureFragment
    | FixtureIceHockeyFixtureFragment
    | FixtureRugbyLeagueFixtureFragment
    | FixtureRugbyUnionFixtureFragment
    | FixtureSnookerFixtureFragment
    | FixtureTableTennisFixtureFragment
    | FixtureTennisMatchFragment
    | FixtureVolleyballFixtureFragment;
  fixtureEventViewLink: { viewUrn: string; viewUrl: string } | null;
  sportevent: SportEventFragment;
  red7Scoreboard: { fullURL: string | null; origin: string | null } | null;
};

export type FixtureCardPartialFragment = {
  __typename: "FixtureCard";
  urn: string;
  red7Scoreboard: { fullURL: string | null; origin: string | null } | null;
};

export type FixtureCardWithStatsFragment = {
  fixture:
    | FixtureWithStatsAmericanFootballFixtureFragment
    | FixtureWithStatsAustralianRulesFixtureFragment
    | FixtureWithStatsBaseFixtureFragment
    | FixtureWithStatsBaseballFixtureFragment
    | FixtureWithStatsBasketballFixtureFragment
    | FixtureWithStatsCricketFixtureFragment
    | FixtureWithStatsDartsFixtureFragment
    | FixtureWithStatsFootballFixtureFragment
    | FixtureWithStatsIceHockeyFixtureFragment
    | FixtureWithStatsRugbyLeagueFixtureFragment
    | FixtureWithStatsRugbyUnionFixtureFragment
    | FixtureWithStatsSnookerFixtureFragment
    | FixtureWithStatsTableTennisFixtureFragment
    | FixtureWithStatsTennisMatchFragment
    | FixtureWithStatsVolleyballFixtureFragment;
} & FixtureCardFragment;

export type FixtureCardWithStatsPartialFragment = FixtureCardPartialFragment;

export type ForbiddenContentCardFragment = {
  __typename: "ForbiddenContentCard";
  urn: string;
  forbiddenCardType: ForbiddenCardType;
};

export type ForbiddenContentCardPartialFragment = {
  __typename: "ForbiddenContentCard";
  urn: string;
  forbiddenCardType: ForbiddenCardType;
};

export type FutureRacingCardGroupFragment = {
  __typename: "FutureRacingCardGroup";
  urn: string;
  filterOptions: FutureRacingOptionsFragment | null;
  full: FullFutureRacingCardGroupItemsFragment;
  partials: PartialsFutureRacingCardGroupItemsFragment;
};

export type FutureRacingCardGroupWithItemsFilteredFragment = {
  __typename: "FutureRacingCardGroup";
  urn: string;
  full: FullFutureRacingCardGroupItemsFragment;
  partials: PartialsFutureRacingCardGroupItemsFragment;
};

export type FutureRacingCardGroupPartialFragment = { __typename: "FutureRacingCardGroup"; urn: string };

export type FutureRacingOptionsFragment = {
  __typename: "FutureRacingOptions";
  countriesFilter: {
    urn: string;
    defaultOptions: Array<{ urn: string; name: string }> | null;
    availableOptions: Array<{ urn: string; name: string }>;
  } | null;
  monthFilter: {
    urn: string;
    defaultOptions: Array<{ urn: string; date: string }> | null;
    availableOptions: Array<{ urn: string; date: string }>;
  } | null;
};

export type GameCardFragment = { __typename: "GameCard"; urn: string; game: GameFragment };

export type GameCardPartialFragment = { __typename: "GameCard"; urn: string };

export type GameInfoCardFragment = { __typename: "GameInfoCard"; urn: string; game: GameFragment };

export type GameInfoCardPartialFragment = { __typename: "GameInfoCard"; urn: string };

export type GamingCardGroupFragment = {
  __typename: "GamingCardGroup";
  urn: string;
  defaultLayout: SwimlaneCardGroupLayout;
  layouts: Array<SwimlaneCardGroupLayout>;
  type: GamingCardGroupType;
  decoration: string | null;
  gameTileSize: GameTileSize | null;
  cardGroupTitle: string | null;
  displayName: { translationKey: string } | null;
  viewAll: { label: string; icon: string | null; viewLink: { viewUrn: string; viewUrl: string } } | null;
  full: FullGameCardGroupItemsFragment;
  partials: PartialsGameCardGroupItemsFragment;
};

export type GamingCardGroupPartialFragment = { __typename: "GamingCardGroup"; urn: string };

export type GamingJackpotCardFragment = {
  __typename: "GamingJackpotCard";
  urn: string;
  name: string;
  logo: string;
  jackpots: Array<GamingJackpotFragment>;
};

export type GamingJackpotCardPartialFragment = { __typename: "GamingJackpotCard"; urn: string };

export type GamingLinkCardFragment = {
  __typename: "GamingLinkCard";
  urn: string;
  games: Array<{ releaseDate: string | null; uid: string } | null>;
  link: { label: string; icon: string | null; viewLink: { viewUrn: string; viewUrl: string } };
};

export type GamingLinkCardPartialFragment = { __typename: "GamingLinkCard"; urn: string };

export type GamingPlayNewCardFragment = {
  __typename: "GamingPlayNewCard";
  urn: string;
  title: string;
  subtitle: string | null;
  endDate: string | null;
  optInState: PromotionStatus | null;
  tags: Array<string | null> | null;
  backgroundImage: Array<{ url: string; width: number | null; height: number | null } | null>;
  logoImage: Array<{ url: string; width: number | null; height: number | null } | null>;
  termsAndConditions: {
    summary: string | null;
    url: string;
    label: DisplayNameDisplayNameTitleFragment | DisplayNameDisplayNameTranslationKeyFragment | null;
    viewLink: { viewUrn: string; viewUrl: string; viewDisplayMode: DisplayMode | null } | null;
  } | null;
};

export type GamingPlayNewCardPartialFragment = { __typename: "GamingPlayNewCard"; urn: string };

export type GenericViewLinkCardFragment = {
  __typename: "GenericViewLinkCard";
  urn: string;
  badge: Badge | null;
  genericViewLinkTitle: DisplayNameDisplayNameTitleFragment | DisplayNameDisplayNameTranslationKeyFragment;
  viewLink: { viewUrn: string; viewUrl: string; viewDisplayMode: DisplayMode | null };
  sportIcon: IconFragment | null;
};

export type GenericViewLinkCardPartialFragment = { __typename: "GenericViewLinkCard"; urn: string };

export type GridCardFragment = {
  __typename: "GridCard";
  urn: string;
  numberOfItemsToDisplay: number | null;
  layout: GridLayout;
  stat: MarketStat | null;
  markets: Array<{
    displayLabel: DisplayNameDisplayNameTitleFragment | DisplayNameDisplayNameTranslationKeyFragment | null;
    market: SportsbookMarketLiveDataFragment;
  }>;
  runners: Array<{
    displayName: DisplayNameDisplayNameTitleFragment | DisplayNameDisplayNameTranslationKeyFragment;
    runner: { runnerURN: string; selectionId: number; participantId: string | null; marketURN: string };
  }>;
  players: { edges: Array<{ cursor: string | null; node: FootballPlayerFixtureContextPlayerDataFragment } | null> };
  firstPlayer: { edges: Array<{ node: FootballPlayerFixtureContextFixtureDataFragment } | null> };
  blurbs: Array<InformativeBlurbFragment> | null;
};

export type GridCardPartialFragment = { __typename: "GridCard"; urn: string };

export type HalfTimeSpecialsSwimlaneCardGroupFragment = {
  __typename: "HalfTimeSpecialsSwimlaneCardGroup";
  urn: string;
  isDecorated: boolean;
  isIconSupportingTitle: boolean;
  halfTimeSpecialsCardGroupTitle: string;
  cardGroupSubtitle: string;
  displayName: { translationKey: string } | null;
  halfTimeSpecialsFull: { edges: Array<{ node: MatchStatSelectionCardFragment } | null> };
  halfTimeSpecialsPartials: { edges: Array<{ node: { __typename: "MatchStatSelectionCard"; urn: string } } | null> };
};

export type HalfTimeSpecialsSwimlaneCardGroupPartialFragment = {
  __typename: "HalfTimeSpecialsSwimlaneCardGroup";
  urn: string;
};

export type HeadToHeadCardFragment = {
  __typename: "HeadToHeadCard";
  urn: string;
  footballFixture: {
    head2head: {
      home: Array<FootballTeamFormFragment | null> | null;
      away: Array<FootballTeamFormFragment | null> | null;
    } | null;
  } & FootballFixtureFragment;
};

export type HeadToHeadCardPartialFragment = { __typename: "HeadToHeadCard"; urn: string };

export type HighlightedSelectionCardFragment = {
  __typename: "HighlightedSelectionCard";
  urn: string;
  title: string;
  displayPreviousOdd: boolean;
  market: SportsbookMarketFragment;
  runner: { runnerURN: string };
};

export type HighlightedSelectionCardPartialFragment = { __typename: "HighlightedSelectionCard"; urn: string };

export type ImsPromotionDetailsCardFragment = {
  __typename: "ImsPromotionDetailsCard";
  urn: string;
  promotion: {
    urn: string;
    details: Array<{
      type: string;
      text: string;
      spans: Array<{ start: number; end: number; style: string; url: string | null }> | null;
    }> | null;
  };
};

export type ImsPromotionDetailsCardPartialFragment = { __typename: "ImsPromotionDetailsCard"; urn: string };

export type ImsPromotionErrorCardFragment = {
  __typename: "ImsPromotionErrorCard";
  urn: string;
  errorCode: PromotionErrorCode;
  seeAll: { viewUrn: string; viewUrl: string } | null;
};

export type ImsPromotionErrorCardPartialFragment = { __typename: "ImsPromotionErrorCard"; urn: string };

export type ImsPromotionStateCardFragment = {
  __typename: "ImsPromotionStateCard";
  urn: string;
  title: string;
  promotion: ImsPromotionFragment;
  depositLink: { viewUrn: string; viewUrl: string } | null;
};

export type ImsPromotionStateCardPartialFragment = { __typename: "ImsPromotionStateCard"; urn: string };

export type ImsPromotionTermsAndConditionsCardFragment = {
  __typename: "ImsPromotionTermsAndConditionsCard";
  urn: string;
  promotion: {
    urn: string;
    termsAndConditions: Array<{
      type: string;
      text: string;
      spans: Array<{ start: number; end: number; style: string; url: string | null }> | null;
    }> | null;
  };
};

export type ImsPromotionTermsAndConditionsCardPartialFragment = {
  __typename: "ImsPromotionTermsAndConditionsCard";
  urn: string;
};

export type LinksCardFragment = {
  __typename: "LinksCard";
  urn: string;
  section: Array<{
    __typename: "LinksMenuSections";
    title: string | null;
    sectionType: string;
    sectionLabel: string;
    items: Array<{
      __typename: "RegulatoryLinkItem";
      url: string;
      text: string;
      target: string | null;
      alignment: RegulatoryItemAlignment;
    }>;
  }>;
};

export type LinksCardPartialFragment = { __typename: "LinksCard"; urn: string };

export type MarketBetCardGroupFragment = {
  __typename: "MarketBetCardGroup";
  urn: string;
  full: {
    edges: Array<{
      node: MarketBetCardFragment | MarketBetExpandableCardGroupFragment | MarketBetSelectionCardGroupFragment;
    } | null>;
  };
  partials: {
    edges: Array<{
      node:
        | MarketBetCardPartialFragment
        | MarketBetExpandableCardGroupPartialFragment
        | MarketBetSelectionCardGroupPartialFragment;
    } | null>;
  };
};

export type MarketBetCardGroupPartialFragment = { __typename: "MarketBetCardGroup"; urn: string };

export type MarketBetCardFragment = {
  __typename: "MarketBetCard";
  urn: string;
  betCardGroupURN: string;
  marketBetCardGroupURN: string;
  matchedStatus: string | null;
  marketBet: ExchangeMarketBetFragment;
};

export type MarketBetCardPartialFragment = { __typename: "MarketBetCard"; urn: string };

export type MarketBetExpandableCardGroupFragment = {
  __typename: "MarketBetExpandableCardGroup";
  urn: string;
  marketBetCardGroupURN: string;
  isOpen: boolean;
  full: { edges: Array<{ node: MarketBetSelectionCardGroupFragment } | null> };
  partials: { edges: Array<{ node: MarketBetSelectionCardGroupPartialFragment } | null> };
};

export type MarketBetExpandableCardGroupPartialFragment = { __typename: "MarketBetExpandableCardGroup"; urn: string };

export type MarketBetSelectionCardGroupFragment = {
  __typename: "MarketBetSelectionCardGroup";
  urn: string;
  betCardGroupURN: string;
  marketBetCardURN: string;
  marketBetCardGroupURN: string;
  full: { edges: Array<{ node: MarketBetSelectionCardFragment } | null> };
  partials: { edges: Array<{ node: MarketBetSelectionCardPartialFragment } | null> };
};

export type MarketBetSelectionCardGroupPartialFragment = { __typename: "MarketBetSelectionCardGroup"; urn: string };

export type MarketBetSelectionCardFragment = {
  __typename: "MarketBetSelectionCard";
  urn: string;
  id: string;
  handicap: number;
  placedDate: string;
  settledDate: string | null;
  matchedDate: string | null;
  price: number;
  runnerDesc: string;
  side: ExchangeSide | null;
  isCashout: boolean | null;
  size: number | null;
  profit: number | null;
  result: ExchangeBetOutcome | null;
  isFreeBet: boolean;
  freeBetSize: number;
  priceMatched: number;
  selectionId: number;
  deviceId: string | null;
  isUnmatched: boolean;
  isBsp: boolean | null;
  bspLiability: number | null;
  liability: number | null;
  marketBetURN: string;
  runnerURN: string;
  marketURN: string;
  marketBetCardGroupURN: string;
  editViewLink: { viewUrn: string; viewUrl: string; viewDisplayMode: DisplayMode | null } | null;
};

export type MarketBetSelectionCardPartialFragment = { __typename: "MarketBetSelectionCard"; urn: string };

export type MarketCardFragment = {
  __typename: "MarketCard";
  urn: string;
  numberOfItemsToDisplay: number | null;
  isRunnerExpandable: boolean | null;
  template: MarketTemplate;
  stat: MarketStat | null;
  cardTitle: string | null;
  viewLinks: Array<{ viewUrn: string; viewUrl: string }>;
  marketsHierarchy: { __typename: "RaceHierarchy"; race: RaceWithRaceRunnersFragment } | {};
  displayRunners: {
    exchange: { market: ExchangeMarketLiveDataFragment | {}; runners: Array<{ runnerURN: string }> } | null;
    sportsbook: {
      market: SportsbookMarketLiveDataFragment | {};
      runners: Array<{ runnerURN: string; participantId: string | null }>;
    } | null;
  };
  runnerViewLinks: Array<{ runnerUrn: string; viewUrl: string; viewUrn: string }>;
  marketPromo: { title: string; description: string; signposting: MarketPromoSignposting } | null;
  blurbs: Array<InformativeBlurbFragment> | null;
  players: { edges: Array<{ cursor: string | null; node: FootballPlayerFixtureContextPlayerDataFragment } | null> };
  firstPlayer: { edges: Array<{ node: FootballPlayerFixtureContextFixtureDataFragment } | null> };
};

export type MarketCardPartialFragment = { __typename: "MarketCard"; urn: string };

export type MarketExtendedCardFragment = {
  __typename: "MarketExtendedCard";
  urn: string;
  numberOfItemsToDisplay: number | null;
  isRunnerExpandable: boolean | null;
  cardTitle: string | null;
  viewLinks: Array<{ viewUrn: string; viewUrl: string }>;
  displayRunners: {
    exchange: { market: ExchangeMarketLiveDataFragment | {}; runners: Array<{ runnerURN: string }> } | null;
    sportsbook: { market: SportsbookMarketLiveDataFragment | {}; runners: Array<{ runnerURN: string }> } | null;
  };
  cashoutQuotes: { exchangeCashoutQuotes: Array<ExchangeCashoutQuoteFragment> | null } | null;
  runnerViewLinks: Array<{ runnerUrn: string; viewUrl: string; viewUrn: string }>;
  raceViewLink: { viewUrn: string; viewUrl: string } | null;
  marketPromo: { title: string; description: string; signposting: MarketPromoSignposting } | null;
};

export type MarketExtendedCardPartialFragment = { __typename: "MarketExtendedCard"; urn: string };

export type MarketGraphsCardFragment = {
  __typename: "MarketGraphsCard";
  urn: string;
  market: ExchangeMarketLiveDataFragment;
  runner: RunnerMarketGraphFragment;
};

export type MarketGraphsCardPartialFragment = { __typename: "MarketGraphsCard"; urn: string };

export type MarketRulesCardFragment = {
  __typename: "MarketRulesCard";
  urn: string;
  marketName: string;
  wallet: string;
  clarifications: string | null;
  marketBaseRate: number;
  discountAllowed: boolean;
  eventStartTime: string | null;
  marketBettingType: MarketRulesMarketBettingType | null;
  numberOfWinners: number;
  displayMode: DisplayMode | null;
  footer: string | null;
  sections: Array<{ name: MarketRulesSectionName; content: string }>;
};

export type MarketRulesCardPartialFragment = { __typename: "MarketRulesCard"; urn: string };

export type MarketViewLinkCardFragment = {
  __typename: "MarketViewLinkCard";
  urn: string;
  badge: Badge | null;
  viewLink: { viewUrn: string; viewUrl: string };
  market:
    | { __typename: "ExchangeMarket"; name: string; urn: string }
    | { __typename: "SportsbookMarket"; name: string; urn: string };
};

export type MarketViewLinkCardPartialFragment = { __typename: "MarketViewLinkCard"; urn: string };

export type MatchStatSelectionCardFragment = {
  __typename: "MatchStatSelectionCard";
  urn: string;
  statsDescription: string | null;
  incidentType: string | null;
  matchStatSubtitle: string;
  matchStatTitle: { playerNames: Array<string>; combiner: string | null };
  market: SportsbookMarketFragment;
  runner: { runnerURN: string };
};

export type MatchStatSelectionCardPartialFragment = { __typename: "MatchStatSelectionCard"; urn: string };

export type MatchStatsCardFragment = {
  __typename: "MatchStatsCard";
  urn: string;
  footballFixture: {
    stats: Array<{
      period: FootballMatchPeriod | null;
      periodStatus: FootballPeriodStatus | null;
      home: GameStatsFragment | null;
      away: GameStatsFragment | null;
    } | null> | null;
  } & FootballFixtureFragment;
};

export type MatchStatsCardPartialFragment = { __typename: "MatchStatsCard"; urn: string };

export type MatchTimelineCardFragment = {
  __typename: "MatchTimelineCard";
  urn: string;
  footballFixture: {
    incidents: Array<FootballIncidentFragment | null> | null;
    stats: Array<{
      period: FootballMatchPeriod | null;
      periodStatus: FootballPeriodStatus | null;
      home: GameStatsFragment | null;
      away: GameStatsFragment | null;
    } | null> | null;
  } & FootballFixtureFragment;
};

export type MatchTimelineCardPartialFragment = { __typename: "MatchTimelineCard"; urn: string };

export type ObbCardGroupFragment = {
  __typename: "ObbCardGroup";
  urn: string;
  showFilterTags: boolean;
  bettingWindowOffset: number;
  obbCardGroupTitle: DisplayNameDisplayNameTitleFragment | DisplayNameDisplayNameTranslationKeyFragment | null;
  event: { urn: string; name: string; eventId: number; openDate: string };
  moreInfoLabel: DisplayNameDisplayNameTitleFragment | DisplayNameDisplayNameTranslationKeyFragment | null;
  moreInfo: {
    urn: string;
    moreInfoDetails: Array<{
      type: string;
      text: string;
      spans: Array<{
        start: number;
        end: number;
        style: string;
        viewLink: { viewUrn: string; viewUrl: string; viewDisplayMode: DisplayMode | null } | null;
      }> | null;
    }>;
  } | null;
  filterTags: Array<{
    type: string;
    label: DisplayNameDisplayNameTitleFragment | DisplayNameDisplayNameTranslationKeyFragment | null;
  }>;
  obbCardGroupSections: { edges: Array<{ node: ObbSectionFragment } | null> };
};

export type ObbCardsStackedLayoutFragment = {
  __typename: "ObbCardsStackedLayout";
  urn: string;
  maxCardsToDisplay: number | null;
  title: { name: string } | {} | null;
  badge: { name: string } | null;
  cards: { edges: Array<{ node: ObbPvpCardFragment | ObbSquadBetCardFragment | ObbSquadVsSquadCardFragment } | null> };
};

export type ObbCardsSwimlaneLayoutFragment = {
  __typename: "ObbCardsSwimlaneLayout";
  urn: string;
  title: { name: string } | {} | null;
  badge: { name: string } | null;
  cards: { edges: Array<{ node: ObbPvpCardFragment | ObbSquadBetCardFragment | ObbSquadVsSquadCardFragment } | null> };
};

export type ObbCreatedBetsCardGroupFragment = {
  __typename: "ObbCreatedBetsCardGroup";
  urn: string;
  obbCreatedBetsCardGroupTitle: DisplayNameDisplayNameTitleFragment | DisplayNameDisplayNameTranslationKeyFragment;
  headerBadgeLabel: DisplayNameDisplayNameTitleFragment | DisplayNameDisplayNameTranslationKeyFragment | null;
  headerViewLink: { viewUrn: string; viewUrl: string } | null;
  cards: { edges: Array<{ cursor: string | null; node: ObbCreatedBetsCardFragment } | null> };
};

export type ObbCreatedBetsCardFragment = {
  __typename: "ObbCreatedBetsCard";
  urn: string;
  fixture:
    | ({ sportevent: SportEventFragment } & FixtureAmericanFootballFixtureFragment)
    | ({ sportevent: SportEventFragment } & FixtureAustralianRulesFixtureFragment)
    | ({ sportevent: SportEventFragment } & FixtureBaseFixtureFragment)
    | ({ sportevent: SportEventFragment } & FixtureBaseballFixtureFragment)
    | ({ sportevent: SportEventFragment } & FixtureBasketballFixtureFragment)
    | ({ sportevent: SportEventFragment } & FixtureCricketFixtureFragment)
    | ({ sportevent: SportEventFragment } & FixtureDartsFixtureFragment)
    | ({ sportevent: SportEventFragment } & FixtureFootballFixtureFragment)
    | ({ sportevent: SportEventFragment } & FixtureIceHockeyFixtureFragment)
    | ({ sportevent: SportEventFragment } & FixtureRugbyLeagueFixtureFragment)
    | ({ sportevent: SportEventFragment } & FixtureRugbyUnionFixtureFragment)
    | ({ sportevent: SportEventFragment } & FixtureSnookerFixtureFragment)
    | ({ sportevent: SportEventFragment } & FixtureTableTennisFixtureFragment)
    | ({ sportevent: SportEventFragment } & FixtureTennisMatchFragment)
    | ({ sportevent: SportEventFragment } & FixtureVolleyballFixtureFragment);
  eventViewLink: { viewUrn: string; viewUrl: string };
  footerViewLink: { viewUrn: string; viewUrl: string };
  bettingOpportunities: Array<{ participants: Array<ObbFootballPlayerFragment>; leg: ObbLegFragment }>;
};

export type ObbEventPopularsCardFragment = {
  __typename: "ObbEventPopularsCard";
  urn: string;
  numberOfVisibleBettingOpportunities: number;
  showPopularEvidence: boolean;
  showStats: boolean;
  obbEventPopularsCardTitle: DisplayNameDisplayNameTitleFragment | DisplayNameDisplayNameTranslationKeyFragment;
  badgeLabel: DisplayNameDisplayNameTitleFragment | DisplayNameDisplayNameTranslationKeyFragment | null;
  event: { urn: string; name: string; eventId: number };
  popularBettingOpportunities: Array<{
    betCount: number;
    participants: Array<ObbFootballPlayerFragment>;
    leg: ObbLegFragment;
  }>;
};

export type ObbOnboardingCardsCardGroupFragment = {
  __typename: "ObbOnboardingCardsCardGroup";
  urn: string;
  obbOnboardingCardsCardGroupTitle: DisplayNameDisplayNameTitleFragment | DisplayNameDisplayNameTranslationKeyFragment;
  obbOnboardingCardsCardGroupBadgeLabel:
    | DisplayNameDisplayNameTitleFragment
    | DisplayNameDisplayNameTranslationKeyFragment
    | null;
  event: { urn: string; name: string; eventId: number; openDate: string };
  onboardingCards: Array<{
    participants: Array<{
      __typename: "ObbFootballPlayer";
      urn: string;
      player: {
        id: string | null;
        name: string | null;
        shirtNumber: number | null;
        position: FootballPlayerPosition | null;
      };
      team: {
        id: string;
        name: string;
        color: string | null;
        crest: { small: string | null; medium: string | null } | null;
        jerseys: Array<{ type: string | null; color: string | null; url: string | null } | null> | null;
      };
    }>;
    legs: Array<ObbLegFragment>;
  } | null>;
};

export type ObbOnboardingCardsCardGroupPartialFragment = { __typename: "ObbOnboardingCardsCardGroup"; urn: string };

export type ObbPvpCardFragment = {
  __typename: "ObbPvpCard";
  urn: string;
  title: { name: string };
  event: { __typename: "SportsEvent"; urn: string; name: string; eventId: number };
  teams: {
    home: { id: string; name: string; jerseys: Array<{ color: string | null } | null> | null };
    away: { id: string; name: string; jerseys: Array<{ color: string | null } | null> | null };
  };
  participants: Array<ObbFootballPlayerFragment>;
  participantInfo: { name: string } | {} | null;
  filterTags: Array<{
    type: string;
    label: DisplayNameDisplayNameTitleFragment | DisplayNameDisplayNameTranslationKeyFragment | null;
  }>;
  incidentType: { id: string };
  defaultLegs: Array<ObbLegFragment>;
};

export type ObbQuoteSuccessFragment = {
  __typename: "ObbQuoteSuccess";
  price: {
    __typename: "ObbOdds";
    decimal: number;
    fractional: { __typename: "FractionalOdds"; numerator: number; denominator: number };
  };
};

export type ObbQuoteErrorFragment = { __typename: "ObbQuoteError"; errorCode: string; errorDetails: string | null };

export type ObbSectionFragment = {
  __typename: "ObbSection";
  urn: string;
  isExpanded: boolean;
  obbSectionTitle: DisplayNameDisplayNameTitleFragment;
  icon: { id: string; category: string } | null;
  layouts: { edges: Array<{ node: ObbCardsStackedLayoutFragment | ObbCardsSwimlaneLayoutFragment } | null> };
};

export type ObbSquadBetCardFragment = {
  __typename: "ObbSquadBetCard";
  urn: string;
  showModalEntryPoint: boolean;
  defaultOutcomeIndex: number;
  title: DisplayNameDisplayNameTitleFragment | DisplayNameDisplayNameTranslationKeyFragment;
  outcomesLabel: DisplayNameDisplayNameTitleFragment | DisplayNameDisplayNameTranslationKeyFragment;
  statsLabel: DisplayNameDisplayNameTitleFragment | DisplayNameDisplayNameTranslationKeyFragment;
  entryPointLabel: DisplayNameDisplayNameTitleFragment | DisplayNameDisplayNameTranslationKeyFragment | null;
  participantInfo: DisplayNameDisplayNameTitleFragment | DisplayNameDisplayNameTranslationKeyFragment | null;
  filterTags: Array<{
    type: string;
    label: DisplayNameDisplayNameTitleFragment | DisplayNameDisplayNameTranslationKeyFragment | null;
  }>;
  event: { __typename: "SportsEvent"; urn: string; name: string; eventId: number };
  eventParticipants: Array<ObbFootballPlayerFragment>;
  squadParticipants: Array<{ __typename: "ObbFootballPlayer"; urn: string }>;
  incidentType: { id: string };
  defaultLegs: Array<ObbLegFragment>;
};

export type ObbSquadVsSquadCardFragment = {
  __typename: "ObbSquadVsSquadCard";
  urn: string;
  showModalEntryPoint: boolean;
  title: DisplayNameDisplayNameTitleFragment | DisplayNameDisplayNameTranslationKeyFragment;
  outcomesText: DisplayNameDisplayNameTitleFragment | DisplayNameDisplayNameTranslationKeyFragment | null;
  statsText: DisplayNameDisplayNameTitleFragment | DisplayNameDisplayNameTranslationKeyFragment | null;
  participantInfo: DisplayNameDisplayNameTitleFragment | DisplayNameDisplayNameTranslationKeyFragment | null;
  filterTags: Array<{
    type: string;
    label: DisplayNameDisplayNameTitleFragment | DisplayNameDisplayNameTranslationKeyFragment | null;
  }>;
  event: { __typename: "SportsEvent"; urn: string; name: string; eventId: number };
  eventParticipants: Array<ObbFootballPlayerFragment>;
  firstSquadParticipants: Array<{ __typename: "ObbFootballPlayer"; urn: string }>;
  secondSquadParticipants: Array<{ __typename: "ObbFootballPlayer"; urn: string }>;
  incidentType: { id: string };
  defaultLegs: Array<ObbLegFragment>;
};

export type OutrightMarketListCardFragment = {
  __typename: "OutrightMarketListCard";
  urn: string;
  title: string;
  numberOfRowsToDisplay: number | null;
  markets: Array<SportsbookMarketLiveDataFragment>;
  favouriteMarketsState: FavouriteMarketsStateLiteFragment | null;
};

export type OutrightMarketListCardPartialFragment = { __typename: "OutrightMarketListCard"; urn: string };

export type PackagedCreatedBetsCardFragment = {
  __typename: "PackagedCreatedBetsCard";
  urn: string;
  pcbLayout: PackagedLayoutType | null;
  pcbTitle: DisplayNameTitleFragment | {} | null;
  favouriteMarketsState: FavouriteMarketsStateLiteFragment | null;
  items: PackagedCreatedBetsItemsFragment;
};

export type PackagedCreatedBetsCardPartialFragment = { __typename: "PackagedCreatedBetsCard"; urn: string };

export type PebbleCardGroupFragment = {
  selectedItemUrn: string;
  pebbleCardGroupIcon: PebbleCardGroupIcon | null;
  outerTitle: TranslatableTextFragment | null;
  viewOpenBets: { viewUrl: string; viewUrn: string } | null;
  viewAll: {
    title: DisplayNameDisplayNameTitleFragment | DisplayNameDisplayNameTranslationKeyFragment;
    viewLink: { viewUrl: string; viewUrn: string };
  } | null;
  full: FullPebbleCardGroupItemsFragment;
  partials: PartialsPebbleCardGroupItemsFragment;
} & PebbleCardGroupEnrichedPartialFragment;

export type PebbleCardGroupPartialFragment = { __typename: "PebbleCardGroup"; urn: string };

export type PebbleCardGroupEnrichedPartialFragment = {
  pebbleExpanded: boolean;
  pebbleCardGroupTitle: TranslatableTextFragment | null;
  favouriteMarketsState: FavouriteMarketsStateLiteFragment | null;
} & PebbleCardGroupPartialFragment;

export type PopularBetBuilderCardFragment = {
  __typename: "PopularBetBuilderCard";
  urn: string;
  sportevent: SportEventFragment;
  fixture:
    | FixtureAmericanFootballFixtureFragment
    | FixtureAustralianRulesFixtureFragment
    | FixtureBaseFixtureFragment
    | FixtureBaseballFixtureFragment
    | FixtureBasketballFixtureFragment
    | FixtureCricketFixtureFragment
    | FixtureDartsFixtureFragment
    | FixtureFootballFixtureFragment
    | FixtureIceHockeyFixtureFragment
    | FixtureRugbyLeagueFixtureFragment
    | FixtureRugbyUnionFixtureFragment
    | FixtureSnookerFixtureFragment
    | FixtureTableTennisFixtureFragment
    | FixtureTennisMatchFragment
    | FixtureVolleyballFixtureFragment;
  popularbettingopportunity: PopularBettingOpportunityFragment;
  viewLink: { viewUrn: string; viewUrl: string };
  tabViewLink: { viewUrn: string; viewUrl: string } | null;
};

export type PopularBetBuilderCardPartialFragment = { __typename: "PopularBetBuilderCard"; urn: string };

export type PopularMultiplesBetBuilderCardFragment = {
  __typename: "PopularMultiplesBetBuilderCard";
  urn: string;
  popularbettingopportunity: PopularBettingOpportunityFragment;
  cmsConfiguredTitle: DisplayNameTitleFragment | {} | null;
};

export type PopularMultiplesBetBuilderCardPartialFragment = {
  __typename: "PopularMultiplesBetBuilderCard";
  urn: string;
};

export type PopularSwimlaneCardGroupFragment = {
  __typename: "PopularSwimlaneCardGroup";
  urn: string;
  popularSwimlaneCardGroupTitle: string | null;
  displayName: { translationKey: string } | null;
  fullItems: { edges: Array<{ node: PopularBetBuilderCardFragment | PopularMultiplesBetBuilderCardFragment } | null> };
  partialItems: {
    edges: Array<{ node: PopularBetBuilderCardPartialFragment | PopularMultiplesBetBuilderCardPartialFragment } | null>;
  };
};

export type PopularSwimlaneCardGroupPartialFragment = { __typename: "PopularSwimlaneCardGroup"; urn: string };

export type PreferenceSingleChoiceCardFragment = {
  __typename: "PreferenceSingleChoiceCard";
  urn: string;
  title: string;
  description: string;
  cardLayout: PreferenceLayout;
  preference: PreferenceSingleChoiceFragment;
};

export type PreferenceSingleChoiceCardPartialFragment = { __typename: "PreferenceSingleChoiceCard"; urn: string };

export type PriceBoostMultisCardFragment = {
  __typename: "PriceBoostMultisCard";
  urn: string;
  showWasPrice: boolean;
  pbmTitle: DisplayNameDisplayNameTitleFragment | DisplayNameDisplayNameTranslationKeyFragment | null;
  popularbettingopportunity: PopularBettingOpportunityFragment;
};

export type PriceBoostMultisCardPartialFragment = { __typename: "PriceBoostMultisCard"; urn: string };

export type PriceBoostMultisListCardFragment = {
  __typename: "PriceBoostMultisListCard";
  urn: string;
  showWasPrice: boolean;
  pbmTitle: DisplayNameTitleFragment | {} | null;
  items: PriceBoostMultisListCardItemsFragment;
  blurbs: Array<InformativeBlurbFragment> | null;
};

export type PromotionAddToBetslipActionFragment = {
  displayPreviousOdd: boolean;
  market: SportsbookMarketFragment;
  runner: { runnerURN: string; selectionId: number; handicap: number };
};

export type PromotionCardFragment = {
  __typename: "PromotionCard";
  urn: string;
  promotionContentType: PromotionContentType;
  promoTypeLabel: string | null;
  headline: string | null;
  subHeadline: string | null;
  strapline: string | null;
  isImsPromo: boolean | null;
  introLine: string | null;
  endDate: string | null;
  optInState: PromotionStatus | null;
  tags: Array<string | null> | null;
  hasBetfairBoost: boolean;
  promotionName: string | null;
  promotionTitle: string | null;
  backgroundImage: Array<{ url: string; width: number | null; height: number | null; tag: string | null } | null>;
  termsAndConditions: {
    summary: string | null;
    url: string;
    label: DisplayNameDisplayNameTitleFragment | DisplayNameDisplayNameTranslationKeyFragment | null;
    viewLink: { viewUrn: string; viewUrl: string; viewDisplayMode: DisplayMode | null } | null;
  } | null;
  action: PromotionAddToBetslipActionFragment | PromotionNavigationActionFragment;
};

export type PromotionCardPartialFragment = { __typename: "PromotionCard"; urn: string };

export type PromotionNavigationActionFragment = {
  label: string;
  viewLink: { viewUrn: string; viewUrl: string; viewDisplayMode: DisplayMode | null };
};

export type LocalTbdPromotionsHubCardGroupFragment = { __typename: "PromotionsHubCardGroup"; urn: string };

export type QuickLinksCardFragment = {
  __typename: "QuickLinksCard";
  urn: string;
  accordionTitle: string | null;
  accordionExpanded: boolean | null;
  iconName: string | null;
  quickLinksTitle: string | null;
  label: DisplayNameDisplayNameTitleFragment | DisplayNameDisplayNameTranslationKeyFragment | null;
  links: Array<{
    label: string;
    target: string | null;
    icon: string | null;
    viewLink: { viewUrn: string; viewUrl: string };
  }>;
};

export type QuickLinksCardPartialFragment = { __typename: "QuickLinksCard"; urn: string };

export type RaceByTimeRangeCardFragment = {
  __typename: "RaceByTimeRangeCard";
  urn: string;
  winner: string | null;
  race: RaceWithRaceDetailsFragment;
  viewLink: { viewUrn: string; viewUrl: string };
  marketPromo: { signposting: MarketPromoSignposting } | null;
  winnerIsp: {
    favourite: boolean | null;
    decimal: number | null;
    americanOdd: number | null;
    fractional: { numerator: number; denominator: number } | null;
  } | null;
};

export type RaceByTimeRangeCardPartialFragment = { __typename: "RaceByTimeRangeCard"; urn: string };

export type RaceDetailsCardFragment = {
  __typename: "RaceDetailsCard";
  urn: string;
  numberOfRunners: number;
  raceClass: number | null;
  showMeetingInfo: boolean;
  availableToSubscribe: boolean;
  race: RaceWithRaceDetailsFragment;
  raceViewLink: { viewUrn: string; viewUrl: string } | null;
};

export type RaceDetailsCardPartialFragment = { __typename: "RaceDetailsCard"; urn: string };

export type RaceMarketCardFragment = {
  __typename: "RaceMarketCard";
  urn: string;
  title: string;
  numberOfRunners: number;
  isRunnerExpandable: boolean | null;
  raceViewLink: { viewUrn: string; viewUrl: string } | null;
  displayRunners: {
    exchange: { market: ExchangeMarketLiveDataFragment | {}; runners: Array<{ runnerURN: string }> } | null;
    sportsbook: { market: SportsbookMarketLiveDataFragment | {}; runners: Array<{ runnerURN: string }> } | null;
  };
  race: RaceWithRaceRunnersFragment;
  runnerViewLinks: Array<{ runnerUrn: string; viewUrl: string; viewUrn: string }>;
  marketPromo: { title: string; description: string; signposting: MarketPromoSignposting } | null;
  blurbs: Array<InformativeBlurbFragment> | null;
};

export type RaceMarketCardPartialFragment = { __typename: "RaceMarketCard"; urn: string };

export type RaceResultsCardFragment = {
  __typename: "RaceResultsCard";
  urn: string;
  race: RaceWithRaceRunnersPerformanceFragment;
};

export type RaceResultsCardPartialFragment = { __typename: "RaceResultsCard"; urn: string };

export type RaceViewLinkCardFragment = {
  __typename: "RaceViewLinkCard";
  urn: string;
  race: RaceFragment;
  viewLink: { viewUrn: string; viewUrl: string };
};

export type RaceViewLinkCardPartialFragment = { __typename: "RaceViewLinkCard"; urn: string };

export type RaceViewLinksCardFragment = {
  __typename: "RaceViewLinksCard";
  urn: string;
  race: RaceWithRaceDetailsFragment;
  raceViewLinks: Array<{
    race: RaceWithRaceDetailsFragment;
    viewLink: { viewUrn: string; viewUrl: string };
    marketPromo: { signposting: MarketPromoSignposting } | null;
  }>;
};

export type RaceViewLinksCardPartialFragment = { __typename: "RaceViewLinksCard"; urn: string };

export type RacesByTimeRangeCardGroupFragment = {
  __typename: "RacesByTimeRangeCardGroup";
  urn: string;
  filterOptions: ByTimeRangeOptionsFragment | null;
  full: FullRacesByTimeRangeCardGroupItemsFragment;
  partials: PartialsRacesByTimeRangeCardGroupItemsFragment;
};

export type RacesByTimeRangeCardGroupWithItemsFilteredFragment = {
  __typename: "RacesByTimeRangeCardGroup";
  urn: string;
  full: FullRacesByTimeRangeCardGroupItemsFragment;
  partials: PartialsRacesByTimeRangeCardGroupItemsFragment;
};

export type RacesByTimeRangeCardGroupPartialFragment = { __typename: "RacesByTimeRangeCardGroup"; urn: string };

export type ByTimeRangeOptionsFragment = {
  __typename: "ByTimeRangeOptions";
  countriesFilter: {
    urn: string;
    defaultOptions: Array<{ urn: string; name: string }> | null;
    availableOptions: Array<{ urn: string; name: string }>;
  } | null;
};

export type RacingSwimlaneCardGroupFragment = {
  __typename: "RacingSwimlaneCardGroup";
  urn: string;
  racingSwimlaneCardGroupTitle: string | null;
  displayName: { translationKey: string } | null;
  viewAll: { label: string; icon: string | null; viewLink: { viewUrn: string; viewUrl: string } } | null;
  fullItems: { edges: Array<{ node: RaceMarketCardFragment } | null> };
  partialItems: { edges: Array<{ node: { __typename: "RaceMarketCard"; urn: string } } | null> };
};

export type RacingSwimlaneCardGroupPartialFragment = { __typename: "RacingSwimlaneCardGroup"; urn: string };

export type RegulatoryCardFragment = {
  __typename: "RegulatoryCard";
  urn: string;
  sections: Array<
    | {
        __typename: "RegulatorySectionAccordion";
        sectionType: RegulatorySectionType;
        title: string;
        items: Array<
          | {
              __typename: "RegulatoryClockItem";
              alignment: RegulatoryItemAlignment;
              timeFormat: string;
              timeZone: string;
              target: string | null;
              clockText: string | null;
            }
          | {
              __typename: "RegulatoryCookieConsentItem";
              alignment: RegulatoryItemAlignment;
              text: string;
              target: string | null;
            }
          | {
              __typename: "RegulatoryImageItem";
              imageURL: string;
              alignment: RegulatoryItemAlignment;
              alt: string | null;
              target: string | null;
              link: string | null;
              viewLink: { viewUrn: string; viewUrl: string; viewDisplayMode: DisplayMode | null } | null;
            }
          | {
              __typename: "RegulatoryLastLogInItem";
              alignment: RegulatoryItemAlignment;
              time: string;
              timeFormat: string;
              lastLoginText: string | null;
            }
          | {
              __typename: "RegulatoryLinkItem";
              alignment: RegulatoryItemAlignment;
              text: string;
              url: string;
              target: string | null;
              viewLink: { viewUrl: string; viewUrn: string; viewDisplayMode: DisplayMode | null } | null;
            }
          | {
              __typename: "RegulatoryLoggedInSinceItem";
              alignment: RegulatoryItemAlignment;
              timeFormat: string;
              loggedInSinceText: string | null;
            }
          | {
              __typename: "RegulatorySessionItem";
              alignment: RegulatoryItemAlignment;
              timeFormat: string;
              sessionText: string | null;
            }
          | { __typename: "RegulatoryTextItem"; alignment: RegulatoryItemAlignment; text: string }
          | {
              __typename: "RegulatoryUserDetailsItem";
              alignment: RegulatoryItemAlignment;
              firstName: string;
              lastName: string;
              nationalIdentifier: string | null;
              contractNumber: string | null;
            }
        >;
      }
    | {
        __typename: "RegulatorySectionGeneric";
        sectionType: RegulatorySectionType;
        genericSectionTitle: string | null;
        items: Array<
          | {
              __typename: "RegulatoryClockItem";
              alignment: RegulatoryItemAlignment;
              timeFormat: string;
              timeZone: string;
              target: string | null;
              clockText: string | null;
            }
          | {
              __typename: "RegulatoryCookieConsentItem";
              alignment: RegulatoryItemAlignment;
              text: string;
              target: string | null;
            }
          | {
              __typename: "RegulatoryImageItem";
              imageURL: string;
              alignment: RegulatoryItemAlignment;
              alt: string | null;
              target: string | null;
              link: string | null;
              viewLink: { viewUrn: string; viewUrl: string; viewDisplayMode: DisplayMode | null } | null;
            }
          | {
              __typename: "RegulatoryLastLogInItem";
              alignment: RegulatoryItemAlignment;
              time: string;
              timeFormat: string;
              lastLoginText: string | null;
            }
          | {
              __typename: "RegulatoryLinkItem";
              alignment: RegulatoryItemAlignment;
              text: string;
              url: string;
              target: string | null;
              viewLink: { viewUrl: string; viewUrn: string; viewDisplayMode: DisplayMode | null } | null;
            }
          | {
              __typename: "RegulatoryLoggedInSinceItem";
              alignment: RegulatoryItemAlignment;
              timeFormat: string;
              loggedInSinceText: string | null;
            }
          | {
              __typename: "RegulatorySessionItem";
              alignment: RegulatoryItemAlignment;
              timeFormat: string;
              sessionText: string | null;
            }
          | { __typename: "RegulatoryTextItem"; alignment: RegulatoryItemAlignment; text: string }
          | {
              __typename: "RegulatoryUserDetailsItem";
              alignment: RegulatoryItemAlignment;
              firstName: string;
              lastName: string;
              nationalIdentifier: string | null;
              contractNumber: string | null;
            }
        >;
      }
  >;
};

export type RegulatoryCardPartialFragment = { __typename: "RegulatoryCard"; urn: string };

export type RewardsCardFragment = {
  __typename: "RewardsCard";
  urn: string;
  benefitsPackages: {
    rewardsStatus: RewardsStatus;
    lastMonthTradedMarkets: number | null;
    currentMonthTradedMarkets: number | null;
    currentMonth: string | null;
    nextMonth: string | null;
    qualifiedBenefitsPackage: {
      commissionRate: number | null;
      requiredMarketBets: number | null;
      packageLevel: string | null;
      criteriaType: string | null;
      excludedBenefits: Array<{ type: string; accessLevel: string } | null> | null;
      benefits: Array<{
        hidden: boolean | null;
        accessLevel: string | null;
        type: string | null;
        valueLookup: {
          maxAmount: { type: string | null; value: string | null } | null;
          quantity: { type: string | null; value: string | null } | null;
          size: { type: string | null; value: string | null } | null;
        } | null;
      } | null> | null;
    } | null;
    chosenBenefitsPackage: {
      commissionRate: number | null;
      requiredMarketBets: number | null;
      packageLevel: string | null;
      criteriaType: string | null;
      excludedBenefits: Array<{ type: string; accessLevel: string } | null> | null;
      benefits: Array<{
        hidden: boolean | null;
        accessLevel: string | null;
        type: string | null;
        valueLookup: {
          maxAmount: { type: string | null; value: string | null } | null;
          quantity: { type: string | null; value: string | null } | null;
          size: { type: string | null; value: string | null } | null;
        } | null;
      } | null> | null;
    } | null;
    availablePackages: Array<{
      commissionRate: number | null;
      requiredMarketBets: number | null;
      packageLevel: string | null;
      criteriaType: string | null;
      excludedBenefits: Array<{ type: string; accessLevel: string } | null> | null;
      benefits: Array<{
        hidden: boolean | null;
        accessLevel: string | null;
        type: string | null;
        valueLookup: {
          maxAmount: { type: string | null; value: string | null } | null;
          quantity: { type: string | null; value: string | null } | null;
          size: { type: string | null; value: string | null } | null;
        } | null;
      } | null> | null;
    } | null> | null;
  };
};

export type RewardsCardPartialFragment = { __typename: "RewardsCard"; urn: string };

export type RunnerInfoCardFragment = { __typename: "RunnerInfoCard"; urn: string; raceRunner: RaceRunnerFragment };

export type RunnerInfoCardPartialFragment = { __typename: "RunnerInfoCard"; urn: string };

export type SearchBarCardFragment = {
  __typename: "SearchBarCard";
  urn: string;
  searchTitle: DisplayNameTitleFragment | {} | null;
  searchPlaceholder: DisplayNameTitleFragment | {} | null;
};

export type SearchBarCardPartialFragment = { __typename: "SearchBarCard"; urn: string };

export type SearchZoneFragment = {
  __typename: "SearchZone";
  urn: string;
  searchZoneItems: { edges: Array<{ node: GamingCardGroupFragment | SearchBarCardFragment | {} } | null> };
};

export type SearchZonePartialFragment = { __typename: "SearchZone"; urn: string };

export type SegmentedCardGroupFragment = {
  __typename: "SegmentedCardGroup";
  urn: string;
  full: FullSegmentedCardGroupItemsFragment;
  partials: PartialsSegmentedCardGroupItemsFragment;
};

export type SegmentedCardGroupPartialFragment = { __typename: "SegmentedCardGroup"; urn: string };

export type SelectableitemsCardGroupFragment = {
  __typename: "SelectableItemsCardGroup";
  urn: string;
  cardGroupTitle: string | null;
  isSelectableItemsCardGroupHighlighted: boolean;
  selectableItemsCardGroupType: SelectableItemsCardGroupType | null;
  filter: {
    countries: Array<RaceCountriesFilterOptions> | null;
    defaultSelected: RaceCountriesFilterOptions | null;
  } | null;
  full: FullSelectableItemsCardGroupItemsFragment;
  partials: PartialsSelectableItemsCardGroupItemsFragment;
};

export type SelectableitemsCardGroupFilteredFragment = {
  __typename: "SelectableItemsCardGroup";
  urn: string;
  cardGroupTitle: string | null;
  isSelectableItemsCardGroupHighlighted: boolean;
  selectableItemsCardGroupType: SelectableItemsCardGroupType | null;
  filter: {
    countries: Array<RaceCountriesFilterOptions> | null;
    defaultSelected: RaceCountriesFilterOptions | null;
  } | null;
  full: FullSelectableItemsCardGroupItemsFragment;
  partials: PartialsSelectableItemsCardGroupItemsFragment;
};

export type SelectableitemsCardGroupPartialFragment = { __typename: "SelectableItemsCardGroup"; urn: string };

export type SportRibbonCardGroupFragment = {
  __typename: "SportRibbonCardGroup";
  urn: string;
  full: {
    edges: Array<{
      label: string | null;
      node:
        | { __typename: "AccountBannersCard"; urn: string }
        | { __typename: "BalanceCard"; urn: string }
        | { __typename: "BetLegCard"; urn: string }
        | { __typename: "BetOpportunityPromoCard"; urn: string }
        | { __typename: "BlurbCard"; urn: string }
        | { __typename: "BreadcrumbsCard"; urn: string }
        | { __typename: "BroadcastsAndStatisticsCard"; urn: string }
        | { __typename: "BroadcastsCard"; urn: string }
        | { __typename: "BudgetLimitsCard"; urn: string }
        | { __typename: "CdvTrackerCard"; urn: string }
        | { __typename: "CompetitionRegionCard"; urn: string }
        | { __typename: "CompetitionViewLinkCard"; urn: string }
        | { __typename: "ContentSummaryCard"; urn: string }
        | { __typename: "CorrectScoreCard"; urn: string }
        | { __typename: "CouponHeaderCard"; urn: string }
        | { __typename: "EditorialPromoCard"; urn: string }
        | { __typename: "EmbeddedContentCard"; urn: string }
        | { __typename: "EmbeddedViewCard"; urn: string }
        | { __typename: "EventHeaderCard"; urn: string }
        | { __typename: "EventMarketCard"; urn: string }
        | { __typename: "EventStatsCard"; urn: string }
        | { __typename: "EventViewLinkCard"; urn: string }
        | { __typename: "ExpandableMarketCard"; urn: string }
        | { __typename: "ExtraWalletCard"; urn: string }
        | { __typename: "FixtureCard"; urn: string }
        | { __typename: "FootballPlayerCompetitionStatsCard"; urn: string }
        | { __typename: "ForbiddenContentCard"; urn: string }
        | { __typename: "GameCard"; urn: string }
        | { __typename: "GameInfoCard"; urn: string }
        | { __typename: "GamingBackNavigationCard"; urn: string }
        | { __typename: "GamingJackpotCard"; urn: string }
        | { __typename: "GamingLinkCard"; urn: string }
        | { __typename: "GamingPlayNewCard"; urn: string }
        | { __typename: "GamingPrizeMachineCard"; urn: string }
        | { __typename: "GenericSwitcherCard"; urn: string }
        | {
            __typename: "GenericViewLinkCard";
            badge: Badge | null;
            urn: string;
            genericViewLinkTitle: DisplayNameDisplayNameTitleFragment | DisplayNameDisplayNameTranslationKeyFragment;
            icon: { id: string; category: string } | null;
            viewLink: { viewUrn: string; viewUrl: string; viewDisplayMode: DisplayMode | null };
          }
        | { __typename: "GridCard"; urn: string }
        | { __typename: "HeadToHeadCard"; urn: string }
        | { __typename: "HighlightedSelectionCard"; urn: string }
        | { __typename: "ImsPromotionDetailsCard"; urn: string }
        | { __typename: "ImsPromotionErrorCard"; urn: string }
        | { __typename: "ImsPromotionStateCard"; urn: string }
        | { __typename: "ImsPromotionTermsAndConditionsCard"; urn: string }
        | { __typename: "IncidentsCard"; urn: string }
        | { __typename: "LinksCard"; urn: string }
        | { __typename: "LottoCard"; urn: string }
        | { __typename: "LoyaltyPromoCard"; urn: string }
        | { __typename: "MarketBetCard"; urn: string }
        | { __typename: "MarketBetSelectionCard"; urn: string }
        | { __typename: "MarketCard"; urn: string }
        | { __typename: "MarketExtendedCard"; urn: string }
        | { __typename: "MarketGraphsCard"; urn: string }
        | { __typename: "MarketRulesCard"; urn: string }
        | { __typename: "MarketViewLinkCard"; urn: string }
        | { __typename: "MatchStatSelectionCard"; urn: string }
        | { __typename: "MatchStatsCard"; urn: string }
        | { __typename: "MatchTimelineCard"; urn: string }
        | { __typename: "MiniEditorialPromoCard"; urn: string }
        | { __typename: "MiniPromoBannerCard"; urn: string }
        | { __typename: "MiniSelectionPromoCard"; urn: string }
        | { __typename: "MonterosaContentCard"; urn: string }
        | { __typename: "ObbCreatedBetsCard"; urn: string }
        | { __typename: "ObbEventPopularsCard"; urn: string }
        | { __typename: "ObbPvpCard"; urn: string }
        | { __typename: "ObbSquadBetCard"; urn: string }
        | { __typename: "ObbSquadVsSquadCard"; urn: string }
        | { __typename: "OutrightMarketListCard"; urn: string }
        | { __typename: "PackagedCreatedBetsCard"; urn: string }
        | { __typename: "PenaltyTakersCard"; urn: string }
        | { __typename: "PlayerEventMarketsCard"; urn: string }
        | { __typename: "PopularBetBuilderCard"; urn: string }
        | { __typename: "PopularMultiplesBetBuilderCard"; urn: string }
        | { __typename: "PopularSelectionsCard"; urn: string }
        | { __typename: "PreferenceSingleChoiceCard"; urn: string }
        | { __typename: "PriceBoostMultiplePromoCard"; urn: string }
        | { __typename: "PriceBoostMultisCard"; urn: string }
        | { __typename: "PriceBoostMultisListCard"; urn: string }
        | { __typename: "PromotionCard"; urn: string }
        | { __typename: "PromotionTrackerErrorCard"; urn: string }
        | { __typename: "PromotionsHubCard"; urn: string }
        | { __typename: "QuickLinksCard"; urn: string }
        | { __typename: "RaceByTimeRangeCard"; urn: string }
        | { __typename: "RaceDetailsCard"; urn: string }
        | { __typename: "RaceMarketCard"; urn: string }
        | { __typename: "RaceResultsCard"; urn: string }
        | { __typename: "RaceSwitcherCard"; urn: string }
        | { __typename: "RaceViewLinkCard"; urn: string }
        | { __typename: "RaceViewLinksCard"; urn: string }
        | { __typename: "RegulatoryCard"; urn: string }
        | { __typename: "RewardsCard"; urn: string }
        | { __typename: "RunnerInfoCard"; urn: string }
        | { __typename: "SearchBarCard"; urn: string }
        | { __typename: "SelectionPromoCard"; urn: string }
        | { __typename: "SelfExclusionCard"; urn: string }
        | { __typename: "SkyBetClubTrackerCard"; urn: string }
        | { __typename: "SnookerFixtureCard"; urn: string }
        | {
            __typename: "SportViewLinkCard";
            urn: string;
            viewLink: { viewUrn: string; viewUrl: string };
            sport: SportWithShortNameFragment;
          }
        | { __typename: "SportsbookBetCard"; urn: string }
        | { __typename: "SportsbookBetInfoCard"; urn: string }
        | { __typename: "SportsbookChatbotCard"; urn: string }
        | { __typename: "StatsBroadcastsCard"; urn: string }
        | { __typename: "StatsFormCard"; urn: string }
        | { __typename: "StatsGoalsAndShotsCard"; urn: string }
        | { __typename: "StatsHeadToHeadCard"; urn: string }
        | { __typename: "StatsLineupsCard"; urn: string }
        | { __typename: "StatsMatchStatsCard"; urn: string }
        | { __typename: "StatsPlayersInPlayCard"; urn: string }
        | { __typename: "StatsPlayersSeasonStatsCard"; urn: string }
        | { __typename: "StatsRaceResultsCard"; urn: string }
        | { __typename: "StatsTableCard"; urn: string }
        | { __typename: "StatsTeamsCard"; urn: string }
        | { __typename: "TeamFormCard"; urn: string }
        | { __typename: "TeamLineupCard"; urn: string }
        | { __typename: "TimeFormBroadCastsCard"; urn: string }
        | { __typename: "VirtualEventDetailsCard"; urn: string }
        | { __typename: "VirtualMarketCard"; urn: string };
    } | null>;
  };
};

export type SportRibbonCardGroupPartialFragment = { __typename: "SportRibbonCardGroup"; urn: string };

export type SportViewLinkCardFragment = {
  __typename: "SportViewLinkCard";
  urn: string;
  viewLink: { viewUrn: string; viewUrl: string };
  sport: SportWithShortNameFragment;
};

export type SportViewLinkCardPartialFragment = { __typename: "SportViewLinkCard"; urn: string };

export type SportsbookBetCardFragment = {
  __typename: "SportsbookBetCard";
  urn: string;
  navigationLinks: Array<{ marketBetUrn: string; viewUrn: string; viewUrl: string | null }>;
  bet: SportsbookBetFragment;
  betSharingViewLink: { viewUrn: string; viewUrl: string } | null;
};

export type SportsbookBetCardPartialFragment = { __typename: "SportsbookBetCard"; urn: string };

export type SportsbookBetInfoCardFragment = {
  __typename: "SportsbookBetInfoCard";
  urn: string;
  placedDate: string;
  settledDate: string | null;
  betReceiptId: string;
  regulatorBetId: string | null;
  deviceId: string | null;
  product: string | null;
  selections: Array<{ marketUrn: string; runnerUrn: string }> | null;
};

export type SportsbookBetInfoCardPartialFragment = { __typename: "SportsbookBetInfoCard"; urn: string };

export type SportsbookBetLegCardGroupFragment = {
  __typename: "SportsbookBetLegCardGroup";
  urn: string;
  full: {
    edges: Array<{
      node:
        | SportsbookBetLegCardFragment
        | EventHeaderCardFragment
        | FixtureCardFragment
        | RaceDetailsCardFragment
        | StatsPebbleCardGroupBaseDataFragment
        | StatsSupportingContentButtonsCardGroupBaseDataFragment;
    } | null>;
  };
};

export type SportsbookBetLegCardGroupPartialFragment = { __typename: "SportsbookBetLegCardGroup"; urn: string };

export type SportsbookBetLegCardFragment = {
  __typename: "BetLegCard";
  urn: string;
  betUrn: string;
  leg: SportsbookBetLegFragment;
};

export type SportsbookBetLegCardPartialFragment = { __typename: "BetLegCard"; urn: string };

export type SportsbookExpandableLegCardGroupFragment = {
  __typename: "SportsbookExpandableLegCardGroup";
  urn: string;
  isBetPanelOpen: boolean;
  full: {
    edges: Array<{
      node:
        | SportsbookBetInfoCardFragment
        | SportsbookBetLegCardGroupFragment
        | SportsbookLotteriesBetLegCardGroupFragment;
    } | null>;
  };
};

export type SportsbookExpandableLegCardGroupPartialFragment = {
  __typename: "SportsbookExpandableLegCardGroup";
  urn: string;
};

export type SwimlaneCardGroupFragment = {
  __typename: "SwimlaneCardGroup";
  urn: string;
  cardGroupTitle: string | null;
  displayName: { translationKey: string } | null;
  viewAll: { label: string; icon: string | null; viewLink: { viewUrn: string; viewUrl: string } } | null;
  full: FullCardGroupItemsFragment;
  partials: PartialsCardGroupItemsFragment;
};

export type SwimlaneCardGroupPartialFragment = { __typename: "SwimlaneCardGroup"; urn: string };

export type SwimlaneIndexedCardGroupFragment = {
  __typename: "SwimlaneIndexedCardGroup";
  urn: string;
  hint: number | null;
  cardGroupTitle: string | null;
  displayName: { translationKey: string } | null;
  icon: { vector: string | null } | null;
  viewAll: { label: string; icon: string | null; viewLink: { viewUrn: string; viewUrl: string } } | null;
  swimlaneItems: FullSwimlaneIndexedCardGroupItemsFragment;
};

export type SwimlaneIndexedCardGroupPartialFragment = { __typename: "SwimlaneIndexedCardGroup"; urn: string };

export type TeamFormCardFragment = {
  __typename: "TeamFormCard";
  urn: string;
  footballFixture: FootballFixtureWithRecentFormFragment;
};

export type TeamFormCardPartialFragment = { __typename: "TeamFormCard"; urn: string };

export type TeamLineupCardPartialFragment = { __typename: "TeamLineupCard"; urn: string };

export type TimeFormBroadCastsCardFragment = {
  __typename: "TimeFormBroadCastsCard";
  urn: string;
  availableToSubscribe: boolean;
  raceToSubscribe: string;
  raceBroadCasts: { dataVizUrl: string | null; liveVideoUrl: string | null } | null;
  selectedRace: RaceWithRaceRunnersFragment | null;
};

export type TimeFormBroadCastsCardPartialFragment = { __typename: "TimeFormBroadCastsCard"; urn: string };

export type ViewZoneFragment = {
  __typename: "ViewZone";
  urn: string;
  title: string;
  viewZoneItems: {
    edges: Array<{
      node:
        | AccountBannersCardFragment
        | BalanceCardFragment
        | BetOpportunityPromoCardFragment
        | BroadcastsAndStatisticsCardFragment
        | BroadcastsCardDeprecatedFragment
        | BudgetLimitsCardFragment
        | ByTimeRangeMeetingCardGroupFragment
        | CompetitionViewLinkCardFragment
        | ContentSummaryCardFragment
        | EditorialPromoCardFragment
        | EventMarketCardFragment
        | EventViewLinkCardFragment
        | FixtureCardFragment
        | GameCardFragment
        | GameInfoCardFragment
        | GamingCardGroupFragment
        | GamingJackpotCardFragment
        | GamingLinkCardFragment
        | GamingPlayNewCardFragment
        | GamingPrizeMachineCardFragment
        | GenericViewLinkCardFragment
        | HalfTimeSpecialsSwimlaneCardGroupFragment
        | HeadToHeadCardFragment
        | HighlightedSelectionCardFragment
        | LinksCardFragment
        | LottoCardFragment
        | MarketCardFragment
        | MarketExtendedCardFragment
        | MarketGraphsCardFragment
        | MarketViewLinkCardFragment
        | MatchStatSelectionCardFragment
        | MatchStatsCardFragment
        | MatchTimelineCardFragment
        | MiniPromoBannerCardFragment
        | MonterosaContentCardFragment
        | PebbleCardGroupFragment
        | PenaltyTakersCardFragment
        | PopularSelectionsCardFragment
        | PriceBoostMultiplePromoCardFragment
        | PromotionCardFragment
        | QuickLinksCardFragment
        | RaceDetailsCardFragment
        | RaceMarketCardFragment
        | RaceViewLinkCardFragment
        | RaceViewLinksCardFragment
        | RacingSwimlaneCardGroupFragment
        | RewardsCardFragment
        | SearchBarCardFragment
        | SegmentedCardGroupFragment
        | SelectionPromoCardFragment
        | SportViewLinkCardFragment
        | SportsbookBetCardFragment
        | SportsbookChatbotCardFragment
        | SportsbookLotteriesBetLegCardGroupFragment
        | StatsContentCardGroupFragment
        | StatsPebbleCardGroupFragment
        | StatsPlayersInPlayCardFragment
        | SwimlaneCardGroupFragment
        | SwimlaneIndexedCardGroupFragment
        | TeamFormCardFragment
        | TeamLineupCardFragment
        | {};
    } | null>;
  };
};

export type ViewZonePartialFragment = { __typename: "ViewZone"; urn: string };

export type VirtualCardGroupFragment = {
  __typename: "VirtualCardGroup";
  urn: string;
  items: {
    edges: Array<{
      node: PebbleCardGroupFragment | VirtualEventDetailsCardFragment | VirtualMarketCardFragment | {};
    } | null>;
  };
};

export type VirtualEventDetailsCardFragment = {
  __typename: "VirtualEventDetailsCard";
  urn: string;
  virtualEvent: VirtualEventFragment;
};

export type VirtualEventDetailsCardPartialFragment = { __typename: "VirtualEventDetailsCard"; urn: string };

export type VirtualMarketCardFragment = {
  __typename: "VirtualMarketCard";
  urn: string;
  title: string;
  marketHierarchy: VirtualMarketHierarchyFragment;
  displayRunners: { market: VirtualMarketFragment };
  gameRulesViewLink: { viewUrn: string; viewUrl: string; viewDisplayMode: DisplayMode | null };
};

export type VirtualMarketCardPartialFragment = { __typename: "VirtualMarketCard"; urn: string };

export type AmericanFootballFixtureFragment = {
  __typename: "AmericanFootballFixture";
  urn: string;
  isAmericanFormat: boolean;
  runnerNames: { home: string; away: string } | null;
  score: { home: number | null; away: number | null } | null;
  clock: {
    timeElapsed: number | null;
    timeRemaining: number | null;
    americanFootballPeriod: AmericanFootballPeriod | null;
  } | null;
  quarterScores: Array<{
    period: AmericanFootballPeriod | null;
    score: { home: number | null; away: number | null } | null;
  } | null> | null;
};

export type AustralianRulesFixtureFragment = {
  __typename: "AustralianRulesFixture";
  urn: string;
  isAmericanFormat: boolean;
  runnerNames: { home: string; away: string } | null;
  score: {
    goals: { scoreHome: number | null; scoreAway: number | null } | null;
    behinds: { scoreHome: number | null; scoreAway: number | null } | null;
    points: { scoreHome: number | null; scoreAway: number | null } | null;
  } | null;
  periodScores: Array<{
    australianRulesPeriod: AustralianRulesPeriod | null;
    score: {
      goals: { scoreHome: number | null; scoreAway: number | null } | null;
      behinds: { scoreHome: number | null; scoreAway: number | null } | null;
      points: { scoreHome: number | null; scoreAway: number | null } | null;
    } | null;
  } | null> | null;
};

export type BaseballFixtureFragment = {
  __typename: "BaseballFixture";
  urn: string;
  isAmericanFormat: boolean;
  runnerNames: { home: string; away: string } | null;
  score: { scoreHome: number; scoreAway: number } | null;
  clock: { baseballClockPeriod: BaseballPeriod | null } | null;
  scorePerInning: Array<{
    baseballInningPeriod: BaseballPeriod | null;
    score: { scoreHome: number; scoreAway: number } | null;
  } | null> | null;
};

export type BasketballFixtureFragment = {
  __typename: "BasketballFixture";
  urn: string;
  isAmericanFormat: boolean;
  runnerNames: { home: string; away: string } | null;
  score: { scoreHome: number; scoreAway: number } | null;
  clock: {
    period: BasketballPeriod | null;
    segment: BasketballSegment | null;
    timeElapsed: number | null;
    timeRemaining: number | null;
  } | null;
  periodScores: Array<{
    period: BasketballPeriod | null;
    segment: BasketballSegment | null;
    score: { scoreHome: number; scoreAway: number } | null;
  } | null> | null;
};

export type CompetitionFragment = CommonCompetitionFragment & CompetitionLogoFragment & CompetitionCountryFragment;

export type CompetitionWithLogoFragment = CommonCompetitionFragment & CompetitionLogoFragment;

export type CompetitionBasicFragment = CommonCompetitionFragment;

export type CommonCompetitionFragment = {
  __typename: "Competition";
  urn: string;
  name: string;
  competitionId: number;
  sport: SportFragment;
};

export type CompetitionLogoFragment = {
  logo: { vector: string | null; small: string | null; medium: string | null; large: string | null } | null;
};

export type CompetitionCountryFragment = { country: CountryFragment | null };

export type ConfirmCashoutPreferenceFragment = {
  __typename: "ConfirmCashoutPreference";
  urn: string;
  shouldConfirmCashout: boolean;
};

export type CountryFragment = {
  urn: string;
  code: string;
  flag: { vector: string | null; small: string | null; medium: string | null; large: string | null } | null;
};

export type CricketFixtureFragment = {
  __typename: "CricketFixture";
  urn: string;
  isAmericanFormat: boolean;
  currentTeamBatting: TeamSide | null;
  runnerNames: { home: string; away: string } | null;
  score: {
    homeScore: Array<{ runs: number | null; wickets: number | null; inningNumber: number | null } | null> | null;
    awayScore: Array<{ runs: number | null; wickets: number | null; inningNumber: number | null } | null> | null;
  } | null;
  currentTime: { inning: number | null; over: number | null } | null;
};

export type DartsFixtureFragment = {
  __typename: "DartsFixture";
  urn: string;
  isAmericanFormat: boolean;
  dartsFixtureType: DartsFixtureType | null;
  runnerNames: { home: string; away: string } | null;
  dartsScore: { home: number; away: number } | null;
  currentSet: { number: number; score: { home: number; away: number } } | null;
  previousSets: Array<{ number: number; score: { home: number; away: number } } | null> | null;
};

export type DefaultProductPreferenceFragment = {
  __typename: "DefaultProductPreference";
  urn: string;
  defaultProductOptions: Array<DefaultProduct>;
  selectedDefaultProduct: DefaultProduct;
};

export type ExchangeCashoutQuoteFragment = {
  __typename: "ExchangeCashoutQuote";
  urn: string;
  marketURN: string;
  marketBetURN: string;
  value: number | null;
  profit: number | null;
  currentLiability: number | null;
  status: ExchangeCashoutQuoteStatus;
};

export type ExchangeDefaultProductPreferenceFragment = {
  __typename: "ExchangeDefaultProductPreference";
  urn: string;
  exchangeDefaultProductOptions: Array<ExchangeDefaultProduct>;
  selectedExchangeDefaultProduct: ExchangeDefaultProduct | null;
};

export type ExchangeMarketBetFragment = {
  __typename: "MarketBet";
  urn: string;
  id: string;
  description: string;
  numOfOrders: number;
  numOfUnmatched: number;
  liability: number | null;
  betDelay: number | null;
  commission: number | null;
  profit: number | null;
  netProfit: number | null;
  cashoutQuotes: Array<ExchangeCashoutQuoteFragment>;
  marketViewLink: { viewUrn: string; viewUrl: string } | null;
  unmatchedEditViewLink: { viewUrn: string; viewUrl: string } | null;
  exchangeLightMarketViewLink: { viewUrn: string; viewUrl: string } | null;
};

export type ExchangeMarketFragment = {
  __typename: "ExchangeMarket";
  urn: string;
  name: string;
  marketType: string;
  marketTypeName: string | null;
  bettingType: string;
  eachWayDivisor: number | null;
  numberOfWinners: number | null;
  hierarchy:
    | MarketHierarchyEventCompetitionHierarchyFragment
    | MarketHierarchyEventHierarchyFragment
    | MarketHierarchyRaceHierarchyFragment;
  sport: SportFragment;
  runners: Array<{
    __typename: "Runner";
    runnerURN: string;
    name: string;
    selectionId: number;
    handicap: number;
    resultType: string | null;
  }>;
};

export type ExchangeMarketBettingFragment = {
  __typename: "ExchangeMarket";
  urn: string;
  name: string;
  marketType: string;
  marketTypeName: string | null;
  bettingType: string;
  eachWayDivisor: number | null;
  numberOfWinners: number | null;
  liveData: { totalMatched: number; exchangeMarketStatus: ExchangeMarketStatus; inplay: boolean } | null;
  hierarchy:
    | HydratedMarketHierarchyEventCompetitionHierarchyFragment
    | HydratedMarketHierarchyEventHierarchyFragment
    | HydratedMarketHierarchyRaceHierarchyFragment;
  sport: SportFragment;
  runners: Array<{
    __typename: "Runner";
    runnerURN: string;
    name: string;
    selectionId: number;
    handicap: number;
    resultType: string | null;
  }>;
};

export type ExchangeMarketLiveDataFragment = {
  __typename: "ExchangeMarket";
  urn: string;
  name: string;
  marketType: string;
  marketTypeName: string | null;
  bettingType: string;
  eachWayDivisor: number | null;
  numberOfWinners: number | null;
  liveData: {
    totalMatched: number;
    exchangeMarketStatus: ExchangeMarketStatus;
    inplay: boolean;
    turnInPlayEnabled: boolean;
    cashoutQuotes: Array<ExchangeCashoutQuoteFragment | null>;
  } | null;
  hierarchy:
    | MarketHierarchyEventCompetitionHierarchyFragment
    | MarketHierarchyEventHierarchyFragment
    | MarketHierarchyRaceHierarchyFragment;
  sport: SportFragment;
  runners: Array<{
    __typename: "Runner";
    runnerURN: string;
    name: string;
    selectionId: number;
    handicap: number;
    resultType: string | null;
  }>;
  marketRulesViewLink: { viewUrn: string; viewUrl: string } | null;
};

export type ExtraWalletFragment = {
  __typename: "ExtraWallet";
  urn: string;
  indexedId: string | null;
  amount: number;
  expirationDate: string | null;
  walletType: WalletTypes | null;
  lostLegs: number | null;
  maxReturn: number | null;
  maxFinPos: number | null;
  ghostLegs: number | null;
  fixedOdds: number | null;
  walletId: string;
};

export type FavouriteMarketsCountMetadataFragment = {
  __typename: "FavouriteMarketsCountMetadata";
  urn: string;
  limit: number;
  currentCount: number;
};

export type FavouriteMarketsStateFragment = {
  __typename: "FavouriteMarketsState";
  urn: string;
  isFavourite: boolean;
  metadata: { sport: FavouriteMarketsCountMetadataFragment; total: FavouriteMarketsCountMetadataFragment };
};

export type FavouriteMarketsStateLiteFragment = {
  __typename: "FavouriteMarketsState";
  urn: string;
  isFavourite: boolean;
};

export type BaseFixtureFragment = {
  __typename: "BaseFixture";
  urn: string;
  sportevent: SportEventFragment;
  mainMarket: { exchange: ExchangeMarketLiveDataFragment | null; sportsbook: SportsbookMarketLiveDataFragment | null };
};

type FixtureAmericanFootballFixtureFragment = AmericanFootballFixtureFragment;

type FixtureAustralianRulesFixtureFragment = AustralianRulesFixtureFragment;

type FixtureBaseFixtureFragment = BaseFixtureFragment;

type FixtureBaseballFixtureFragment = BaseballFixtureFragment;

type FixtureBasketballFixtureFragment = BasketballFixtureFragment;

type FixtureCricketFixtureFragment = CricketFixtureFragment;

type FixtureDartsFixtureFragment = DartsFixtureFragment;

type FixtureFootballFixtureFragment = FootballFixtureFragment;

type FixtureIceHockeyFixtureFragment = IceHockeyFixtureFragment;

type FixtureRugbyLeagueFixtureFragment = RugbyLeagueFixtureDeprecatedFragment;

type FixtureRugbyUnionFixtureFragment = RugbyUnionFixtureFragment;

type FixtureSnookerFixtureFragment = SnookerFixtureFragment;

type FixtureTableTennisFixtureFragment = TableTennisFixtureFragment;

type FixtureTennisMatchFragment = TennisFixtureDeprecatedFragment;

type FixtureVolleyballFixtureFragment = VolleyballFixtureDeprecatedFragment;

export type FixtureFragment =
  | FixtureAmericanFootballFixtureFragment
  | FixtureAustralianRulesFixtureFragment
  | FixtureBaseFixtureFragment
  | FixtureBaseballFixtureFragment
  | FixtureBasketballFixtureFragment
  | FixtureCricketFixtureFragment
  | FixtureDartsFixtureFragment
  | FixtureFootballFixtureFragment
  | FixtureIceHockeyFixtureFragment
  | FixtureRugbyLeagueFixtureFragment
  | FixtureRugbyUnionFixtureFragment
  | FixtureSnookerFixtureFragment
  | FixtureTableTennisFixtureFragment
  | FixtureTennisMatchFragment
  | FixtureVolleyballFixtureFragment;

type FixtureWithStatsAmericanFootballFixtureFragment = FixtureAmericanFootballFixtureFragment;

type FixtureWithStatsAustralianRulesFixtureFragment = FixtureAustralianRulesFixtureFragment;

type FixtureWithStatsBaseFixtureFragment = FixtureBaseFixtureFragment;

type FixtureWithStatsBaseballFixtureFragment = FixtureBaseballFixtureFragment;

type FixtureWithStatsBasketballFixtureFragment = FixtureBasketballFixtureFragment;

type FixtureWithStatsCricketFixtureFragment = FixtureCricketFixtureFragment;

type FixtureWithStatsDartsFixtureFragment = FixtureDartsFixtureFragment;

type FixtureWithStatsFootballFixtureFragment = FootballFixtureWithStatsFragment & FixtureFootballFixtureFragment;

type FixtureWithStatsIceHockeyFixtureFragment = FixtureIceHockeyFixtureFragment;

type FixtureWithStatsRugbyLeagueFixtureFragment = FixtureRugbyLeagueFixtureFragment;

type FixtureWithStatsRugbyUnionFixtureFragment = FixtureRugbyUnionFixtureFragment;

type FixtureWithStatsSnookerFixtureFragment = FixtureSnookerFixtureFragment;

type FixtureWithStatsTableTennisFixtureFragment = FixtureTableTennisFixtureFragment;

type FixtureWithStatsTennisMatchFragment = FixtureTennisMatchFragment;

type FixtureWithStatsVolleyballFixtureFragment = FixtureVolleyballFixtureFragment;

export type FixtureWithStatsFragment =
  | FixtureWithStatsAmericanFootballFixtureFragment
  | FixtureWithStatsAustralianRulesFixtureFragment
  | FixtureWithStatsBaseFixtureFragment
  | FixtureWithStatsBaseballFixtureFragment
  | FixtureWithStatsBasketballFixtureFragment
  | FixtureWithStatsCricketFixtureFragment
  | FixtureWithStatsDartsFixtureFragment
  | FixtureWithStatsFootballFixtureFragment
  | FixtureWithStatsIceHockeyFixtureFragment
  | FixtureWithStatsRugbyLeagueFixtureFragment
  | FixtureWithStatsRugbyUnionFixtureFragment
  | FixtureWithStatsSnookerFixtureFragment
  | FixtureWithStatsTableTennisFixtureFragment
  | FixtureWithStatsTennisMatchFragment
  | FixtureWithStatsVolleyballFixtureFragment;

export type FootballFixtureFragment = {
  __typename: "FootballFixture";
  urn: string;
  isAmericanFormat: boolean;
  scheduledAt: string | null;
  startedAt: string | null;
  home: {
    name: string;
    color: string | null;
    crest: { vector: string | null; small: string | null; medium: string | null; large: string | null } | null;
  };
  away: {
    name: string;
    color: string | null;
    crest: { vector: string | null; small: string | null; medium: string | null; large: string | null } | null;
  };
  runnerNames: { home: string; away: string } | null;
  score: { home: number | null; away: number | null } | null;
  firstLegScore: { home: number | null; away: number | null } | null;
  duration: {
    period: FootballMatchPeriod | null;
    status: FootballPeriodStatus | null;
    stoppageMinutes: number | null;
    clock: { minute: number | null; second: number | null } | null;
  } | null;
  penaltyShootout: {
    firstTeamToShoot: FixtureTeamSide | null;
    nextTeamToShoot: FixtureTeamSide | null;
    penaltyFormat: string | null;
    penaltyScores: Array<{
      penaltyNumber: number | null;
      side: FixtureTeamSide | null;
      shotResult: PenaltyStatus | null;
    } | null> | null;
  } | null;
};

export type FootballFixtureLiteFragment = {
  __typename: "FootballFixture";
  urn: string;
  scheduledAt: string | null;
  startedAt: string | null;
  isAmericanFormat: boolean;
  duration: {
    period: FootballMatchPeriod | null;
    status: FootballPeriodStatus | null;
    stoppageMinutes: number | null;
    clock: { minute: number | null; second: number | null } | null;
  } | null;
  runnerNames: { home: string; away: string } | null;
  home: { name: string };
  away: { name: string };
};

export type FootballFixtureWithRecentFormFragment = {
  recentForm: {
    home: Array<FootballTeamFormFragment | null> | null;
    away: Array<FootballTeamFormFragment | null> | null;
  } | null;
} & FootballFixtureFragment;

export type FootballFixtureWithStatsFragment = {
  stats: Array<{
    periodStatus: FootballPeriodStatus | null;
    period: FootballMatchPeriod | null;
    home: { redCards: number | null } | null;
    away: { redCards: number | null } | null;
  } | null> | null;
} & FootballFixtureFragment;

export type FootballIncidentFragment = {
  period: FootballMatchPeriod | null;
  periodStatus: FootballPeriodStatus | null;
  clock: { minute: number | null; second: number | null } | null;
  details:
    | { __typename: "AttackIncident"; side: FixtureTeamSide | null; attackType: AttackIncidentType | null }
    | {
        __typename: "CardIncident";
        cardType: CardIncidentType | null;
        side: FixtureTeamSide | null;
        player: FootballPlayerFragment | null;
      }
    | {
        __typename: "FoulIncident";
        side: FixtureTeamSide | null;
        foulType: FoulIncidentType | null;
        player: FootballPlayerFragment | null;
      }
    | {
        __typename: "GoalIncident";
        goalType: GoalIncidentType | null;
        side: FixtureTeamSide | null;
        goalScorer: FootballPlayerFragment | null;
        assist: FootballPlayerFragment | null;
      }
    | { __typename: "PenaltyIncident"; side: FixtureTeamSide | null; penaltyType: PenaltyIncidentType }
    | {
        __typename: "PenaltyShootoutIncident";
        side: FixtureTeamSide | null;
        penaltyShootoutType: PenaltyShootoutIncidentType | null;
        player: FootballPlayerFragment | null;
      }
    | {
        __typename: "PeriodIncident";
        periodType: PeriodIncidentType | null;
        period: FootballMatchPeriod | null;
        status: FootballPeriodStatus | null;
        injuryTime: number | null;
      }
    | { __typename: "SetPieceIncident"; side: FixtureTeamSide | null; setPieceType: SetPieceIncidentType | null }
    | {
        __typename: "ShotIncident";
        side: FixtureTeamSide | null;
        shotType: ShotIncidentType | null;
        player: FootballPlayerFragment | null;
      }
    | {
        __typename: "SubstitutionIncident";
        side: FixtureTeamSide | null;
        playerIn: FootballPlayerFragment | null;
        playerOut: FootballPlayerFragment | null;
      }
    | null;
};

export type FootballPlayerFixtureContextFixtureDataFragment = {
  __typename: "FootballPlayerFixtureContext";
  urn: string;
  fixture: FootballFixtureTeamsJerseysFragment | {};
};

export type FootballFixtureTeamsJerseysFragment = {
  __typename: "FootballFixture";
  urn: string;
  home: {
    id: string;
    name: string;
    jerseys: Array<{ color: string | null; url: string | null; type: string | null } | null> | null;
    statsAllSeason: { matchesPlayed: number | null } | null;
  };
  away: {
    id: string;
    name: string;
    jerseys: Array<{ color: string | null; url: string | null; type: string | null } | null> | null;
    statsAllSeason: { matchesPlayed: number | null } | null;
  };
};

export type FootballPlayerFixtureContextPlayerDataFragment = {
  __typename: "FootballPlayerFixtureContext";
  urn: string;
  player: {
    __typename: "FootballPlayerFixture";
    urn: string;
    id: string | null;
    name: string;
    seasonStats: {
      matchesPlayed: number | null;
      averages: {
        shotsOnTarget: number | null;
        totalShots: number | null;
        goals: number;
        yellowCards: number;
        redCards: number;
        fouls: number | null;
        foulsWon: number | null;
        foulInvolvements: number | null;
        assists: number | null;
      } | null;
      totals: {
        shotsOnTarget: number | null;
        totalShots: number | null;
        goals: number;
        yellowCards: number;
        redCards: number;
        fouls: number | null;
        foulsWon: number | null;
        foulInvolvements: number | null;
        assists: number | null;
      } | null;
    } | null;
  } | null;
  team: { id: string } | null;
};

export type FootballPlayerFragment = {
  id: string | null;
  name: string | null;
  shirtNumber: number | null;
  position: FootballPlayerPosition | null;
  positionDescription: string | null;
  startingType: FootballPlayerStartingType | null;
};

export type FootballTeamFormFragment = {
  opponent: string | null;
  outcome: FixtureOutcome | null;
  startAt: string | null;
  side: FixtureTeamSide | null;
  score: { home: number | null; away: number | null } | null;
  extraTimeScore: { home: number | null; away: number | null } | null;
  penaltyShootoutScore: { home: number | null; away: number | null } | null;
};

export type GameStatsFragment = {
  attacks: number | null;
  possession: number | null;
  corners: number | null;
  yellowCards: number | null;
  redCards: number | null;
  offsides: number | null;
  fouls: number | null;
  throwIns: number | null;
  freeKicks: number | null;
  goalKicks: number | null;
  blockedShots: number | null;
  dangerousAttacks: number | null;
  shotsOnTarget: number | null;
  shotsOffTarget: number | null;
  goals: number | null;
};

export type GameFragment = {
  __typename: "Game";
  urn: string;
  uid: string;
  name: string;
  launchId: string;
  rgsCodeMobile: string;
  jackpotLogo: JackpotLogo | null;
  copyrightText: string | null;
  customBackgroundColor: string | null;
  backgroundColor: string | null;
  label: Label | null;
  mainProduct: string;
  gameType: string | null;
  gameVolatility: string | null;
  gameTheme: string | null;
  jackpotType: string | null;
  gameStudio: string | null;
  minStake: string | null;
  maxStake: string | null;
  gameMechanics: Array<string | null> | null;
  gameHelp: string | null;
  rtp: string | null;
  decoration: string | null;
  hasDemo: boolean | null;
  viewLink: { viewUrn: string; viewUrl: string };
  customLogo: { name: string | null; image: GameImageFragment } | null;
  feedData: {
    jackpot: number | null;
    availableSeats: number | null;
    tableNames: Array<string> | null;
    lastNumbers: Array<{ number: string; color: RouletteNumberColor }> | null;
  } | null;
  provider: { name: string; uid: string };
  flattened: GameImagesFragment | null;
  metaData: { metaTitle: string | null; metaDescription: string | null } | null;
  description: {
    headline: string | null;
    content: Array<{
      type: string;
      text: string;
      spans: Array<{ start: number; end: number; style: string; url: string | null }> | null;
    }>;
  } | null;
  screenshots: Array<GameImageFragment | null> | null;
};

export type GameImagesFragment = {
  small: { url: string; alt: string | null; dimensions: { width: number; height: number } } | null;
  medium: { url: string; alt: string | null; dimensions: { width: number; height: number } } | null;
};

export type GameImageFragment = { url: string; alt: string | null; dimensions: { width: number; height: number } };

export type GamingJackpotFragment = {
  __typename: "GamingJackpot";
  urn: string;
  name: string;
  value: number;
  state: GamingJackpotState;
  progress: number;
  dropValue: number | null;
  dropTime: string | null;
  dropText: string | null;
};

export type GreyhoundRaceRunnerFragment = {
  __typename: "GreyhoundRaceRunner";
  urn: string;
  trap: number | null;
  raceURN: string;
  selectionId: number;
};

export type IceHockeyFixtureFragment = {
  __typename: "IceHockeyFixture";
  urn: string;
  isAmericanFormat: boolean;
  runnerNames: { home: string; away: string } | null;
  score: { scoreHome: number; scoreAway: number } | null;
  clock: { clockPeriod: IceHockeyPeriod | null } | null;
  periodScores: Array<{
    periodScoresPeriod: IceHockeyPeriod | null;
    score: { scoreHome: number; scoreAway: number } | null;
  } | null> | null;
};

export type IconFragment = { sport: { sportId: number } | null };

export type ImsPromotionFragment = {
  __typename: "ImsPromotion";
  urn: string;
  headline: string;
  subHeadline: string | null;
  bonusInstanceCode: string | null;
  ctaText: string;
  layout: PromotionLayout;
  status: PromotionStatus;
  timeLeft: number | null;
  wagerType: PromotionWagerType | null;
  percentCompleted: number | null;
  bonusWagering: number | null;
  wageringLeft: number | null;
  bonusAwarded: number | null;
  currentBonusBalance: number;
  amountOnPendingWinnings: number;
  freeSpins: { initialFreeSpins: number | null; remainingFreeSpins: number | null } | null;
  goldenChips: {
    initialGoldenChips: number | null;
    remainingGoldenChips: number | null;
    goldenChipsAmount: number | null;
  } | null;
  buyIn: {
    buyInMinValue: number | null;
    buyInMaxValue: number | null;
    boughtIn: number | null;
    intervals: Array<{ min: number; max: number; amount: number | null; percentage: number | null } | null> | null;
  } | null;
  image: { url: string; alt: string | null; dimensions: { width: number; height: number } } | null;
};

export type LastViewedProductPreferenceFragment = {
  __typename: "LastViewedProductPreference";
  urn: string;
  lastViewedProductOptions: Array<LastViewedProduct>;
  selectedLastViewedProduct: LastViewedProduct;
};

export type LoyaltyPromotionLegacyFragment = {
  __typename: "LoyaltyPromotion";
  urn: string;
  name: string;
  title: string | null;
  promoImage: { url: string } | null;
  state: {
    optInState: PromotionStatus;
    label: DisplayNameDisplayNameTitleFragment | DisplayNameDisplayNameTranslationKeyFragment;
    link: {
      label: DisplayNameDisplayNameTitleFragment | DisplayNameDisplayNameTranslationKeyFragment;
      viewLink: { viewUrn: string; viewUrl: string; viewDisplayMode: DisplayMode | null };
    } | null;
  };
  termsAndConditions: {
    summary: string | null;
    link: {
      label: DisplayNameDisplayNameTitleFragment | DisplayNameDisplayNameTranslationKeyFragment;
      viewLink: { viewUrn: string; viewUrl: string; viewDisplayMode: DisplayMode | null };
    } | null;
  };
};

type HydratedMarketHierarchyEventCompetitionHierarchyFragment = {
  __typename: "EventCompetitionHierarchy";
  sportevent: SportEventFragment;
  competition: CompetitionBasicFragment;
};

type HydratedMarketHierarchyEventHierarchyFragment = { __typename: "EventHierarchy"; sportevent: SportEventFragment };

type HydratedMarketHierarchyRaceHierarchyFragment = {
  __typename: "RaceHierarchy";
  race: RaceWithRaceRunnersFragment;
  meeting: MeetingFragment;
};

export type HydratedMarketHierarchyFragment =
  | HydratedMarketHierarchyEventCompetitionHierarchyFragment
  | HydratedMarketHierarchyEventHierarchyFragment
  | HydratedMarketHierarchyRaceHierarchyFragment;

type MarketHierarchyEventCompetitionHierarchyFragment = {
  __typename: "EventCompetitionHierarchy";
  sportevent: SportEventFragment;
  competition: CompetitionBasicFragment;
};

type MarketHierarchyEventHierarchyFragment = { __typename: "EventHierarchy"; sportevent: SportEventFragment };

type MarketHierarchyRaceHierarchyFragment = {
  __typename: "RaceHierarchy";
  race: RaceFragment;
  meeting: MeetingFragment;
};

export type MarketHierarchyFragment =
  | MarketHierarchyEventCompetitionHierarchyFragment
  | MarketHierarchyEventHierarchyFragment
  | MarketHierarchyRaceHierarchyFragment;

export type MeetingFragment = {
  __typename: "Meeting";
  urn: string;
  name: string;
  meetingId: string;
  country: string;
  venue: string;
  date: string | null;
  countryFlag: { small: string | null; medium: string | null; large: string | null } | null;
  sport: SportFragment;
};

export type ObbFootballPlayerFragment = {
  __typename: "ObbFootballPlayer";
  urn: string;
  player: {
    id: string | null;
    name: string | null;
    position: FootballPlayerPosition | null;
    shirtNumber: number | null;
    seasonStats: {
      matchesPlayed: number;
      averages: {
        goals: number;
        redCards: number;
        yellowCards: number;
        yellowRedCards: number;
        shotsOnTarget: number;
        totalShots: number;
        fouls: number | null;
        foulsWon: number | null;
        assists: number | null;
        passes: number | null;
        foulInvolvements: number | null;
      };
    } | null;
  };
  team: { id: string; name: string; color: string | null; jerseys: Array<{ url: string | null } | null> | null };
};

export type ObbLegFragment = {
  __typename: "ObbLeg";
  templateId: string;
  templateParams:
    | ObbPvpTemplateParamsFragment
    | ObbSquadBetTemplateParamsFragment
    | ObbSquadVsSquadTemplateParamsFragment;
  quote: ObbQuoteErrorFragment | ObbQuoteSuccessFragment;
  event: { __typename: "SportsEvent"; urn: string; name: string; eventId: number };
};

export type ObbPvpTemplateParamsFragment = {
  __typename: "ObbPvpParams";
  outcomeId: string;
  timePeriodId: string;
  participantIdA: { __typename: "ObbFootballPlayer"; urn: string };
  participantIdB: { __typename: "ObbFootballPlayer"; urn: string };
};

export type ObbSquadBetTemplateParamsFragment = {
  __typename: "ObbSquadBetParams";
  outcomeIds: Array<string>;
  value: number;
  timePeriodId: string;
  quantifier: string;
  participantIds: Array<{ __typename: "ObbFootballPlayer"; urn: string }>;
};

export type ObbSquadVsSquadTemplateParamsFragment = {
  __typename: "ObbSquadVsSquadParams";
  outcomeIds: Array<string>;
  timePeriodId: string;
  quantifier: string;
  squadAParticipantIds: Array<{ __typename: "ObbFootballPlayer"; urn: string }>;
  squadBParticipantIds: Array<{ __typename: "ObbFootballPlayer"; urn: string }>;
};

export type PopularBettingOpportunityFragment = {
  __typename: "PopularBettingOpportunity";
  urn: string;
  id: string;
  count: number;
  displayName: string | null;
  type: BettingOpportunityType | null;
  selections: Array<{
    __typename: "BettingOpportunitySelection";
    market: SportsbookMarketFragment;
    runner: { runnerURN: string; selectionId: number };
    raceRunner: RaceRunnerLiteFragment | null;
  }>;
};

export type PopularBettingOpportunityPartialFragment = { __typename: "PopularBettingOpportunity"; urn: string };

export type PreferenceSingleChoiceFragment = {
  __typename: "PreferenceSingleChoice";
  urn: string;
  preferenceKey: string;
  selectedValueIndex: number;
  preferenceValues: Array<{ value: string; translationKey: string }>;
};

export type RaceRunnerHorsePastPerformanceFragment = {
  __typename: "RaceRunner";
  urn: string;
  rating123: number | null;
  ratingStars: number | null;
  selectionId: number;
  raceURN: string;
  form: string | null;
  rating: number | null;
  comments: string | null;
  status: RunnerStatus | null;
  horse: {
    name: string;
    sireName: string | null;
    damName: string | null;
    damSireName: string | null;
    age: number;
    color: HorseColor;
    sex: HorseSex;
    bred: string | null;
    pastPerformances: Array<{
      positionOfficial: number | null;
      performanceComment: string | null;
      race: {
        raceUrl: string | null;
        venue: string | null;
        details: {
          scheduledTime: string;
          numberOfRunners: number | null;
          going: Going | null;
          type: RaceType | null;
          distance: { miles: number; furlongs: number; yards: number };
        } | null;
      } | null;
    }> | null;
  };
  details: {
    jockeyName: string | null;
    trainerName: string | null;
    saddleCloth: string;
    equipmentDescription: string | null;
    silk: string | null;
    draw: number | null;
    weight: { stones: string } | null;
  };
};

export type RaceRunnerHorsePerformanceFragment = {
  __typename: "RaceRunner";
  urn: string;
  rating123: number | null;
  ratingStars: number | null;
  selectionId: number;
  raceURN: string;
  form: string | null;
  rating: number | null;
  comments: string | null;
  status: RunnerStatus | null;
  horse: {
    name: string;
    sireName: string | null;
    damName: string | null;
    damSireName: string | null;
    age: number;
    color: HorseColor;
    sex: HorseSex;
    bred: string | null;
    performance: {
      positionOfficial: number | null;
      distanceBeatenStatus: string | null;
      positionStatusCode: string | null;
      bspAdvantage: number | null;
      isp: {
        decimal: number | null;
        americanOdd: number | null;
        favourite: boolean | null;
        fractional: { numerator: number; denominator: number } | null;
      } | null;
    } | null;
  };
  details: {
    jockeyName: string | null;
    trainerName: string | null;
    saddleCloth: string;
    equipmentDescription: string | null;
    silk: string | null;
    draw: number | null;
    weight: { stones: string } | null;
  };
};

export type RaceRunnerFragment = {
  __typename: "RaceRunner";
  urn: string;
  raceURN: string;
  rating123: number | null;
  ratingStars: number | null;
  selectionId: number;
  form: string | null;
  apprenticeClaim: number | null;
  crsDisWinFavText: string | null;
  rating: number | null;
  comments: string | null;
  status: RunnerStatus | null;
  horse: {
    name: string;
    sireName: string | null;
    damName: string | null;
    damSireName: string | null;
    age: number;
    color: HorseColor;
    sex: HorseSex;
    bred: string | null;
  };
  details: {
    jockeyName: string | null;
    trainerName: string | null;
    saddleCloth: string;
    equipmentDescription: string | null;
    silk: string | null;
    draw: number | null;
    weight: { stones: string } | null;
  };
};

export type RaceRunnerLiteFragment = {
  __typename: "RaceRunner";
  urn: string;
  raceURN: string;
  selectionId: number;
  horse: { name: string; age: number; color: HorseColor; sex: HorseSex };
  details: { jockeyName: string | null; trainerName: string | null; silk: string | null; saddleCloth: string };
};

type RaceKindGreyhoundRaceKindFragment = { runners: Array<GreyhoundRaceRunnerFragment> };

type RaceKindHorseRaceKindFragment = { runners: Array<RaceRunnerFragment> };

export type RaceKindFragment = RaceKindGreyhoundRaceKindFragment | RaceKindHorseRaceKindFragment;

export type RaceWithRaceDetailsFragment = {
  __typename: "Race";
  urn: string;
  startTime: string;
  name: string;
  raceId: string;
  verdict: string | null;
  winningTime: number | null;
  meeting: MeetingFragment;
  details: {
    scheduledTime: string;
    resultType: RaceResultType | null;
    numberOfRunners: number | null;
    numberOfNonRunners: number | null;
    numberOfParticipants: number | null;
    raceClass: number | null;
    going: Going | null;
    status: RaceStatus | null;
    type: RaceType | null;
    raceDetailsTitle: string | null;
    distance: { miles: number; furlongs: number; yards: number };
  } | null;
};

export type RaceWithRaceRunnersPerformanceFragment = {
  __typename: "Race";
  urn: string;
  startTime: string;
  name: string;
  raceId: string;
  verdict: string | null;
  winningTime: number | null;
  details: {
    scheduledTime: string;
    numberOfRunners: number | null;
    numberOfNonRunners: number | null;
    raceClass: number | null;
    numberOfParticipants: number | null;
    going: Going | null;
    status: RaceStatus | null;
    type: RaceType | null;
    resultType: RaceResultType | null;
    raceDetailsTitle: string | null;
    distance: { miles: number; furlongs: number; yards: number };
  } | null;
  runners: Array<RaceRunnerHorsePerformanceFragment | null> | null;
  raceKind: RaceKindGreyhoundRaceKindFragment | RaceKindHorseRaceKindFragment | null;
  meeting: MeetingFragment;
};

export type RaceWithRaceRunnersFragment = {
  __typename: "Race";
  urn: string;
  startTime: string;
  name: string;
  raceId: string;
  verdict: string | null;
  winningTime: number | null;
  details: {
    scheduledTime: string;
    numberOfRunners: number | null;
    numberOfNonRunners: number | null;
    raceClass: number | null;
    numberOfParticipants: number | null;
    going: Going | null;
    status: RaceStatus | null;
    type: RaceType | null;
    resultType: RaceResultType | null;
    raceDetailsTitle: string | null;
    distance: { miles: number; furlongs: number; yards: number };
  } | null;
  runners: Array<RaceRunnerFragment | null> | null;
  raceKind: RaceKindGreyhoundRaceKindFragment | RaceKindHorseRaceKindFragment | null;
  meeting: MeetingFragment;
};

export type RaceFragment = {
  __typename: "Race";
  urn: string;
  startTime: string;
  raceId: string;
  name: string;
  meeting: MeetingFragment;
};

export type RegulatoryDataFragment = {
  __typename: "RegulatoryData";
  sections: Array<
    | {
        __typename: "RegulatorySectionAccordion";
        items: Array<
          | { __typename: "RegulatoryClockItem" }
          | { __typename: "RegulatoryCookieConsentItem" }
          | {
              __typename: "RegulatoryImageItem";
              imageURL: string;
              alignment: RegulatoryItemAlignment;
              alt: string | null;
              target: string | null;
              link: string | null;
              viewLink: { viewUrn: string; viewUrl: string; viewDisplayMode: DisplayMode | null } | null;
            }
          | { __typename: "RegulatoryLastLogInItem" }
          | {
              __typename: "RegulatoryLinkItem";
              alignment: RegulatoryItemAlignment;
              text: string;
              target: string | null;
              viewLink: { viewUrl: string } | null;
            }
          | { __typename: "RegulatoryLoggedInSinceItem" }
          | {
              __typename: "RegulatorySessionItem";
              alignment: RegulatoryItemAlignment;
              timeFormat: string;
              time: string;
              sessionText: string | null;
            }
          | { __typename: "RegulatoryTextItem"; alignment: RegulatoryItemAlignment; text: string }
          | { __typename: "RegulatoryUserDetailsItem" }
        >;
      }
    | {
        __typename: "RegulatorySectionGeneric";
        sectionType: RegulatorySectionType;
        items: Array<
          | { __typename: "RegulatoryClockItem" }
          | { __typename: "RegulatoryCookieConsentItem" }
          | {
              __typename: "RegulatoryImageItem";
              imageURL: string;
              alignment: RegulatoryItemAlignment;
              alt: string | null;
              target: string | null;
              link: string | null;
              viewLink: { viewUrn: string; viewUrl: string; viewDisplayMode: DisplayMode | null } | null;
            }
          | { __typename: "RegulatoryLastLogInItem" }
          | {
              __typename: "RegulatoryLinkItem";
              alignment: RegulatoryItemAlignment;
              text: string;
              target: string | null;
              viewLink: { viewUrl: string } | null;
            }
          | { __typename: "RegulatoryLoggedInSinceItem" }
          | {
              __typename: "RegulatorySessionItem";
              alignment: RegulatoryItemAlignment;
              timeFormat: string;
              time: string;
              sessionText: string | null;
            }
          | { __typename: "RegulatoryTextItem"; alignment: RegulatoryItemAlignment; text: string }
          | { __typename: "RegulatoryUserDetailsItem" }
        >;
      }
  >;
};

export type RugbyLeagueFixtureDeprecatedFragment = {
  __typename: "RugbyLeagueFixture";
  urn: string;
  isAmericanFormat: boolean;
  runnerNames: { home: string; away: string } | null;
  score: { scoreHome: number; scoreAway: number } | null;
  halfTimeScore: { halfTimeScoreHome: number; halfTimeScoreAway: number } | null;
};

export type RugbyUnionFixtureFragment = {
  __typename: "RugbyUnionFixture";
  urn: string;
  isAmericanFormat: boolean;
  runnerNames: { home: string; away: string } | null;
  score: { scoreHome: number; scoreAway: number } | null;
  halfTimeScore: { halfTimeScoreHome: number; halfTimeScoreAway: number } | null;
};

export type RunnerMarketGraphFragment = {
  __typename: "RunnerMarketGraph";
  runnerURN: string;
  graphParams: string;
  liveData: {
    urn: string;
    selectionId: number;
    handicap: number;
    totalMatched: number | null;
    lastPriceTraded: number | null;
    availableToLay: Array<{ odd: number; liquidity: number }>;
    availableToBack: Array<{ odd: number; liquidity: number }>;
    traded: Array<{ odd: number; liquidity: number }>;
  };
};

export type SnookerFixtureFragment = {
  __typename: "SnookerFixture";
  urn: string;
  isAmericanFormat: boolean;
  runnerNames: { home: string; away: string } | null;
  score: { scoreHome: number; scoreAway: number } | null;
};

export type SportEventFragment = {
  __typename: "SportsEvent";
  urn: string;
  eventId: number;
  name: string;
  openDate: string;
  competition: CompetitionBasicFragment | null;
};

export type SportFragment = { __typename: "Sport"; urn: string; name: string; sportId: number };

export type SportWithShortNameFragment = {
  __typename: "Sport";
  urn: string;
  name: string;
  sportId: number;
  shortName: string | null;
};

export type OutcomeBasedDetailsFragment = {
  expressionInfo: {
    templateId: string;
    templateVersion: number;
    result: ResultEnum | null;
    params:
      | { outcomeId: string; timePeriodId: string; participantIdA: string; participantIdB: string }
      | {
          outcomeIds: Array<string>;
          timePeriodId: string;
          participantIds: Array<string>;
          value: number;
          quantifier: string;
        }
      | {
          squadAParticipantIds: Array<string>;
          squadBParticipantIds: Array<string>;
          outcomeIds: Array<string>;
          timePeriodId: string;
          quantifier: string;
        }
      | { x: number };
    expressionComponents: {
      operator: string;
      leftOperand: Array<
        { decimal: number } | { operator: string } | { outcomeId: string; timePeriodId: string; participantId: string }
      >;
      rightOperand: Array<
        { decimal: number } | { operator: string } | { outcomeId: string; timePeriodId: string; participantId: string }
      >;
    } | null;
    expressionMetadata: { participants: Array<{ name: string | null; id: string }> } | null;
    subExpressionInfos: Array<{
      __typename: "ExpressionInfo";
      templateId: string;
      templateVersion: number;
      result: ResultEnum | null;
      params:
        | { outcomeId: string; timePeriodId: string; participantIdA: string; participantIdB: string }
        | {
            outcomeIds: Array<string>;
            timePeriodId: string;
            participantIds: Array<string>;
            value: number;
            quantifier: string;
          }
        | {
            squadAParticipantIds: Array<string>;
            squadBParticipantIds: Array<string>;
            outcomeIds: Array<string>;
            timePeriodId: string;
            quantifier: string;
          }
        | { x: number };
      expressionComponents: {
        operator: string;
        leftOperand: Array<
          | { decimal: number }
          | { operator: string }
          | { outcomeId: string; timePeriodId: string; participantId: string }
        >;
        rightOperand: Array<
          | { decimal: number }
          | { operator: string }
          | { outcomeId: string; timePeriodId: string; participantId: string }
        >;
      } | null;
      expressionMetadata: { participants: Array<{ name: string | null; id: string }> } | null;
    }>;
  };
};

export type OutcomeDefinitionExpFragment = {
  __typename: "OutcomeDefinitionExp";
  outcomeDefinitionEntries: Array<{
    outcomeDefinitionType: OutcomeDefinitionTypeEnum;
    operator: OutcomeDefinitionOperatorEnum | null;
    outcomeDefinition: {
      query: {
        sport: string;
        outcome: string;
        periodDefinition: { period: PeriodEnum | null; periodStatus: PeriodStatusEnum };
        participant: { type: ParticipantTypeEnum; side: ParticipantSideEnum | null; participantId: string | null };
      };
      statsThresholdDef: { threshold: number; comparison: ComparisonEnum | null };
    } | null;
  }>;
};

export type SportsbookBetLegFragment = {
  __typename: "BetLeg";
  urn: string;
  type: LegType;
  result: ResultEnum | null;
  resultType: ResultTypeEnum | null;
  legNumber: number;
  mutations: {
    eligibility: Array<{
      mutation: BetLegMutationType | null;
      mutationAvailability: string | null;
      details: {
        gameDetails: {
          minute: number;
          homeTeamName: string;
          homeTeamScore: number;
          awayTeamName: string;
          awayTeamScore: number;
        } | null;
      } | null;
    } | null> | null;
    details: Array<{
      freezeDetails: {
        minute: number;
        homeTeamName: string;
        homeTeamScore: number;
        awayTeamName: string;
        awayTeamScore: number;
      } | null;
    } | null> | null;
  } | null;
  parts: Array<{
    marketBetUrn: string | null;
    marketId: string | null;
    sportId: string | null;
    eventUrn: string | null;
    priceType: string | null;
    eventDescription: string;
    eventMarketDescription: string;
    marketType: string | null;
    selectionId: number | null;
    selectionName: string;
    handicap: number | null;
    eachwayPlaces: number | null;
    rule4Deductions: number | null;
    deadHeatWinDeductions: number | null;
    deadHeatEachwayDeductions: number | null;
    isSuperSub: boolean | null;
    raceUrn: string | null;
    price: { decimal: number; fractional: { numerator: number; denominator: number } | null } | null;
    originalPrice: { decimal: number; fractional: { numerator: number; denominator: number } | null } | null;
    eachwayFactor: { numerator: number; denominator: number } | null;
    outcomeDefinitionExp: OutcomeDefinitionExpFragment | null;
    participants: Array<{
      participantId: string | null;
      type: ParticipantTypeEnum;
      side: ParticipantSideEnum | null;
    } | null> | null;
    raceRunner: RaceRunnerFragment | null;
    raceRunnerKind: GreyhoundRaceRunnerFragment | RaceRunnerFragment | null;
  }>;
  outcomeBasedDetails: OutcomeBasedDetailsFragment | null;
};

export type SportsbookBetFragment = {
  __typename: "SportsbookBet";
  urn: string;
  betReceiptId: string;
  id: string;
  isSettled: boolean;
  profitAndLoss: number | null;
  originalPotentialWin: number | null;
  potentialWinForPlace: number | null;
  isOddsBoosted: boolean;
  isLotteries: boolean | null;
  betType: string;
  isEachWay: boolean;
  isSGM: boolean;
  isSGMMulti: boolean;
  isPBM: boolean;
  isPBS: boolean;
  has90MinBet: boolean;
  currentSize: number;
  numLines: number;
  currentSizePerLine: number;
  isAccaInsuranceReward: boolean;
  isMoneyBackReward: boolean;
  result: ResultEnum | null;
  resultType: ResultTypeEnum | null;
  bonus: number | null;
  product: string | null;
  lowestEventStartTime: string | null;
  ghostLegToken: { tokenId: string; repricedDecimalOdds: number | null; payout: number | null } | null;
  mutations: { eligibility: Array<{ mutation: BetMutationEligibilityType | null } | null> | null } | null;
  betPrice: { decimal: number; fractional: { numerator: number; denominator: number } | null } | null;
  originalBetPrice: { decimal: number; fractional: { numerator: number; denominator: number } | null } | null;
  legs: Array<{ urn: string }>;
  cashoutQuote: SportsbookCashoutQuoteFragment | null;
  edges: Array<{ reason: BetEdgeEnum; status: BetEdgeStatusEnum | null }>;
};

export type SportsbookCashoutQuoteFragment = {
  __typename: "SportsbookCashoutQuote";
  urn: string;
  betUrn: string;
  quote: number | null;
  stake: number | null;
  betDelay: number | null;
  cashOutToken: string | null;
  refreshRate: number | null;
  status: SportsbookCashoutQuoteStatus;
};

export type SportsbookMarketFragment = {
  __typename: "SportsbookMarket";
  urn: string;
  name: string;
  marketType: string;
  marketTypeName: string | null;
  bettingType: string;
  isOddsboostMarketType: boolean | null;
  isAutomaticEachWayMarketType: boolean | null;
  isSuperSub: boolean | null;
  isAccaFreezeEligible: boolean | null;
  hierarchy:
    | MarketHierarchyEventCompetitionHierarchyFragment
    | MarketHierarchyEventHierarchyFragment
    | MarketHierarchyRaceHierarchyFragment;
  sport: SportFragment;
  runners: Array<{
    __typename: "Runner";
    runnerURN: string;
    name: string;
    selectionId: number;
    handicap: number;
    resultType: string | null;
  }>;
};

export type SportsbookMarketBettingFragment = {
  __typename: "SportsbookMarket";
  urn: string;
  name: string;
  marketType: string;
  marketTypeName: string | null;
  bettingType: string;
  isOddsboostMarketType: boolean | null;
  isAutomaticEachWayMarketType: boolean | null;
  isSuperSub: boolean | null;
  isAccaFreezeEligible: boolean | null;
  liveData: {
    inplay: boolean;
    turnInPlayEnabled: boolean;
    bspMarket: boolean;
    runners: Array<SportsbookRunnerLiveDataFragment | null>;
  } | null;
  hierarchy:
    | HydratedMarketHierarchyEventCompetitionHierarchyFragment
    | HydratedMarketHierarchyEventHierarchyFragment
    | HydratedMarketHierarchyRaceHierarchyFragment;
  sport: SportFragment;
  runners: Array<{
    __typename: "Runner";
    runnerURN: string;
    name: string;
    selectionId: number;
    handicap: number;
    resultType: string | null;
  }>;
};

export type SportsbookMarketLiveDataFragment = {
  __typename: "SportsbookMarket";
  urn: string;
  name: string;
  marketType: string;
  marketTypeName: string | null;
  bettingType: string;
  isOddsboostMarketType: boolean | null;
  isAutomaticEachWayMarketType: boolean | null;
  isSuperSub: boolean | null;
  isAccaFreezeEligible: boolean | null;
  liveData: {
    inplay: boolean;
    turnInPlayEnabled: boolean;
    sportsbookMarketStatus: SportsbookMarketStatus;
    bspMarket: boolean;
    eachwayAvailable: boolean;
    runners: Array<SportsbookRunnerLiveDataFragment | null>;
  } | null;
  hierarchy:
    | MarketHierarchyEventCompetitionHierarchyFragment
    | MarketHierarchyEventHierarchyFragment
    | MarketHierarchyRaceHierarchyFragment;
  sport: SportFragment;
  runners: Array<{
    __typename: "Runner";
    runnerURN: string;
    name: string;
    selectionId: number;
    handicap: number;
    resultType: string | null;
  }>;
};

export type SportsbookRunnerLiveDataFragment = {
  __typename: "SportsbookRunnerLiveData";
  urn: string;
  marketURN: string;
  runnerURN: string;
  selectionId: number;
  runnerStatus: SportsbookRunnerStatus;
  handicap: number;
  odds: { decimal: number; fractional: { denominator: number; numerator: number } | null } | null;
  displayOdds: { decimal: number; fractional: { denominator: number; numerator: number } | null } | null;
};

export type TableTennisFixtureFragment = {
  __typename: "TableTennisFixture";
  urn: string;
  isAmericanFormat: boolean;
  runnerNames: { home: string; away: string } | null;
  currentSet: { number: number; currentServer: TeamSide | null; score: { home: number; away: number } } | null;
  setsWon: { home: number; away: number } | null;
  previousSets: Array<{
    number: number;
    currentServer: TeamSide | null;
    score: { home: number; away: number };
  } | null> | null;
};

export type TennisFixtureDeprecatedFragment = {
  __typename: "TennisMatch";
  urn: string;
  isAmericanFormat: boolean;
  actualStartTime: string | null;
  scheduledStartTime: string;
  teamAScore: number | null;
  teamBScore: number | null;
  surface: TennisSurface | null;
  type: TennisMatchType | null;
  runnerNames: { home: string; away: string } | null;
  currentSet: {
    teamAScore: number;
    teamBScore: number;
    currentGame: { teamAScore: string; teamBScore: string; teamServing: TeamSide | null; type: TennisGameType } | null;
  } | null;
  status: { status: TennisStatus; reason: TennisStatusReason | null } | null;
};

export type UserProductsPreferenceFragment = {
  __typename: "UserProductsPreference";
  urn: string;
  productOptions: Array<UserProducts>;
  selectedProduct: Array<UserProducts | null> | null;
};

export type VirtualEventFragment = {
  __typename: "VirtualEvent";
  distance: string | null;
  duration: number | null;
  eventId: number;
  name: string;
  openDate: string;
  urn: string;
  venue: string | null;
  sport: VirtualSportFragment;
};

export type VirtualMarketHierarchyFragment = {
  __typename: "VirtualEventHierarchy";
  virtualEvent: VirtualEventFragment;
};

export type VirtualMarketFragment = {
  __typename: "VirtualMarket";
  urn: string;
  name: string;
  marketType: string;
  marketId: string;
  status: string;
  hasEachWay: boolean | null;
  eachWayPlaces: number | null;
  eachWayFraction: number | null;
  sport: VirtualSportFragment;
  event: VirtualEventFragment;
  runners: Array<VirtualRunnerFragment>;
};

export type VirtualRunnerFragment = {
  __typename: "VirtualRunner";
  name: string;
  humanName: string | null;
  racerIndex: number | null;
  runnerURN: string;
  selectionId: number;
  humanTexture: string | null;
  selectionTexture: string | null;
  odds: { decimal: number; fractional: { numerator: number; denominator: number } | null };
};

export type VirtualSportFragment = {
  __typename: "VirtualSport";
  sportId: number;
  urn: string;
  kind: VirtualSportKind;
  name: { translationKey: string };
};

export type VolleyballFixtureDeprecatedFragment = {
  __typename: "VolleyballFixture";
  urn: string;
  isAmericanFormat: boolean;
  homeScore: number | null;
  awayScore: number | null;
  runnerNames: { home: string; away: string } | null;
  currentSet: {
    volleyballSetNumber: number | null;
    volleyballCurrentServer: TeamSide | null;
    volleyballSetScore: { home: number; away: number } | null;
  } | null;
  previousSets: Array<{
    volleyballSetNumber: number | null;
    volleyballCurrentServer: TeamSide | null;
    volleyballSetScore: { home: number; away: number } | null;
  } | null> | null;
};

export type FullByTimeRangeMeetingCardGroupItemsFragment = {
  edges: Array<{ node: RaceByTimeRangeCardFragment | {} } | null>;
};

export type FullCardGroupItemsFragment = {
  edges: Array<{
    node:
      | AccountBannersCardFragment
      | BalanceCardFragment
      | BetOpportunityPromoCardFragment
      | BroadcastsCardDeprecatedFragment
      | BudgetLimitsCardFragment
      | CompetitionRegionCardFragment
      | CompetitionViewLinkCardFragment
      | ContentSummaryCardFragment
      | CorrectScoreCardFragment
      | EditorialPromoCardFragment
      | EventMarketCardFragment
      | EventViewLinkCardFragment
      | ExpandableMarketCardFragment
      | FixtureCardFragment
      | GameCardFragment
      | GameInfoCardFragment
      | GamingJackpotCardFragment
      | GamingLinkCardFragment
      | GamingPlayNewCardFragment
      | GenericViewLinkCardFragment
      | GridCardFragment
      | HeadToHeadCardFragment
      | HighlightedSelectionCardFragment
      | ImsPromotionDetailsCardFragment
      | (ImsPromotionErrorCardFragment & ImsPromotionErrorCardFragment)
      | ImsPromotionStateCardFragment
      | ImsPromotionTermsAndConditionsCardFragment
      | LinksCardFragment
      | LoyaltyPromoCardFragment
      | MarketBetCardFragment
      | MarketBetSelectionCardFragment
      | MarketCardFragment
      | MarketExtendedCardFragment
      | MarketGraphsCardFragment
      | MarketRulesCardFragment
      | MarketViewLinkCardFragment
      | MatchStatsCardFragment
      | MatchTimelineCardFragment
      | MiniPromoBannerCardFragment
      | PriceBoostMultiplePromoCardFragment
      | PriceBoostMultisCardFragment
      | PromotionCardFragment
      | QuickLinksCardFragment
      | RaceByTimeRangeCardFragment
      | RaceDetailsCardFragment
      | RaceMarketCardFragment
      | RaceViewLinkCardFragment
      | RaceViewLinksCardFragment
      | RegulatoryCardFragment
      | RewardsCardFragment
      | RunnerInfoCardFragment
      | SelectionPromoCardFragment
      | SportViewLinkCardFragment
      | SportsbookBetCardFragment
      | TeamFormCardFragment
      | TeamLineupCardFragment
      | {};
  } | null>;
};

export type PartialsCardGroupItemsFragment = {
  edges: Array<{
    node:
      | { __typename: "AccountBannersCard"; urn: string }
      | { __typename: "BalanceCard"; urn: string }
      | { __typename: "BetLegCard"; urn: string }
      | { __typename: "BetOpportunityPromoCard"; urn: string }
      | { __typename: "BlurbCard"; urn: string }
      | { __typename: "BreadcrumbsCard"; urn: string }
      | { __typename: "BroadcastsAndStatisticsCard"; urn: string }
      | { __typename: "BroadcastsCard"; urn: string }
      | { __typename: "BudgetLimitsCard"; urn: string }
      | { __typename: "CdvTrackerCard"; urn: string }
      | { __typename: "CompetitionRegionCard"; urn: string }
      | { __typename: "CompetitionViewLinkCard"; urn: string }
      | { __typename: "ContentSummaryCard"; urn: string }
      | { __typename: "CorrectScoreCard"; urn: string }
      | { __typename: "CouponHeaderCard"; urn: string }
      | { __typename: "EditorialPromoCard"; urn: string }
      | { __typename: "EmbeddedContentCard"; urn: string }
      | { __typename: "EmbeddedViewCard"; urn: string }
      | { __typename: "EventHeaderCard"; urn: string }
      | { __typename: "EventMarketCard"; urn: string }
      | { __typename: "EventStatsCard"; urn: string }
      | { __typename: "EventViewLinkCard"; urn: string }
      | { __typename: "ExpandableMarketCard"; urn: string }
      | { __typename: "ExtraWalletCard"; urn: string }
      | { __typename: "FixtureCard"; urn: string }
      | { __typename: "FootballPlayerCompetitionStatsCard"; urn: string }
      | { __typename: "ForbiddenContentCard"; urn: string }
      | { __typename: "GameCard"; urn: string }
      | { __typename: "GameInfoCard"; urn: string }
      | { __typename: "GamingBackNavigationCard"; urn: string }
      | { __typename: "GamingJackpotCard"; urn: string }
      | { __typename: "GamingLinkCard"; urn: string }
      | { __typename: "GamingPlayNewCard"; urn: string }
      | { __typename: "GamingPrizeMachineCard"; urn: string }
      | { __typename: "GenericSwitcherCard"; urn: string }
      | { __typename: "GenericViewLinkCard"; urn: string }
      | { __typename: "GridCard"; urn: string }
      | { __typename: "HeadToHeadCard"; urn: string }
      | { __typename: "HighlightedSelectionCard"; urn: string }
      | { __typename: "ImsPromotionDetailsCard"; urn: string }
      | { __typename: "ImsPromotionErrorCard"; urn: string }
      | { __typename: "ImsPromotionStateCard"; urn: string }
      | { __typename: "ImsPromotionTermsAndConditionsCard"; urn: string }
      | { __typename: "IncidentsCard"; urn: string }
      | { __typename: "LinksCard"; urn: string }
      | { __typename: "LottoCard"; urn: string }
      | { __typename: "LoyaltyPromoCard"; urn: string }
      | { __typename: "MarketBetCard"; urn: string }
      | { __typename: "MarketBetSelectionCard"; urn: string }
      | { __typename: "MarketCard"; urn: string }
      | { __typename: "MarketExtendedCard"; urn: string }
      | { __typename: "MarketGraphsCard"; urn: string }
      | { __typename: "MarketRulesCard"; urn: string }
      | { __typename: "MarketViewLinkCard"; urn: string }
      | { __typename: "MatchStatSelectionCard"; urn: string }
      | { __typename: "MatchStatsCard"; urn: string }
      | { __typename: "MatchTimelineCard"; urn: string }
      | { __typename: "MiniEditorialPromoCard"; urn: string }
      | { __typename: "MiniPromoBannerCard"; urn: string }
      | { __typename: "MiniSelectionPromoCard"; urn: string }
      | { __typename: "MonterosaContentCard"; urn: string }
      | { __typename: "ObbCreatedBetsCard"; urn: string }
      | { __typename: "ObbEventPopularsCard"; urn: string }
      | { __typename: "ObbPvpCard"; urn: string }
      | { __typename: "ObbSquadBetCard"; urn: string }
      | { __typename: "ObbSquadVsSquadCard"; urn: string }
      | { __typename: "OutrightMarketListCard"; urn: string }
      | { __typename: "PackagedCreatedBetsCard"; urn: string }
      | { __typename: "PenaltyTakersCard"; urn: string }
      | { __typename: "PlayerEventMarketsCard"; urn: string }
      | { __typename: "PopularBetBuilderCard"; urn: string }
      | { __typename: "PopularMultiplesBetBuilderCard"; urn: string }
      | { __typename: "PopularSelectionsCard"; urn: string }
      | { __typename: "PreferenceSingleChoiceCard"; urn: string }
      | { __typename: "PriceBoostMultiplePromoCard"; urn: string }
      | { __typename: "PriceBoostMultisCard"; urn: string }
      | { __typename: "PriceBoostMultisListCard"; urn: string }
      | { __typename: "PromotionCard"; urn: string }
      | { __typename: "PromotionTrackerErrorCard"; urn: string }
      | { __typename: "PromotionsHubCard"; urn: string }
      | { __typename: "QuickLinksCard"; urn: string }
      | { __typename: "RaceByTimeRangeCard"; urn: string }
      | { __typename: "RaceDetailsCard"; urn: string }
      | { __typename: "RaceMarketCard"; urn: string }
      | { __typename: "RaceResultsCard"; urn: string }
      | { __typename: "RaceSwitcherCard"; urn: string }
      | { __typename: "RaceViewLinkCard"; urn: string }
      | { __typename: "RaceViewLinksCard"; urn: string }
      | { __typename: "RegulatoryCard"; urn: string }
      | { __typename: "RewardsCard"; urn: string }
      | { __typename: "RunnerInfoCard"; urn: string }
      | { __typename: "SearchBarCard"; urn: string }
      | { __typename: "SelectionPromoCard"; urn: string }
      | { __typename: "SelfExclusionCard"; urn: string }
      | { __typename: "SkyBetClubTrackerCard"; urn: string }
      | { __typename: "SnookerFixtureCard"; urn: string }
      | { __typename: "SportViewLinkCard"; urn: string }
      | { __typename: "SportsbookBetCard"; urn: string }
      | { __typename: "SportsbookBetInfoCard"; urn: string }
      | { __typename: "SportsbookChatbotCard"; urn: string }
      | { __typename: "StatsBroadcastsCard"; urn: string }
      | { __typename: "StatsFormCard"; urn: string }
      | { __typename: "StatsGoalsAndShotsCard"; urn: string }
      | { __typename: "StatsHeadToHeadCard"; urn: string }
      | { __typename: "StatsLineupsCard"; urn: string }
      | { __typename: "StatsMatchStatsCard"; urn: string }
      | { __typename: "StatsPlayersInPlayCard"; urn: string }
      | { __typename: "StatsPlayersSeasonStatsCard"; urn: string }
      | { __typename: "StatsRaceResultsCard"; urn: string }
      | { __typename: "StatsTableCard"; urn: string }
      | { __typename: "StatsTeamsCard"; urn: string }
      | { __typename: "TeamFormCard"; urn: string }
      | { __typename: "TeamLineupCard"; urn: string }
      | { __typename: "TimeFormBroadCastsCard"; urn: string }
      | { __typename: "VirtualEventDetailsCard"; urn: string }
      | { __typename: "VirtualMarketCard"; urn: string };
  } | null>;
};

export type FullExpandableCardGroupItemsFragment = { edges: Array<{ node: HighlightedSelectionCardFragment } | null> };

export type PartialsExpandableCardGroupItemsFragment = {
  edges: Array<{ node: { __typename: "HighlightedSelectionCard"; urn: string } } | null>;
};

export type FullFavouriteMarketsNavigationTabItemsFragment = {
  edges: Array<{
    node: OutrightMarketListCardFragment | PackagedCreatedBetsCardFragment | PebbleCardGroupFragment | {};
  } | null>;
};

export type PartialsFavouriteMarketsNavigationTabItemsFragment = {
  edges: Array<{
    node:
      | OutrightMarketListCardPartialFragment
      | PackagedCreatedBetsCardPartialFragment
      | PebbleCardGroupEnrichedPartialFragment
      | {};
  } | null>;
};

export type FullFilteredCouponCardGroupItemsFragment = {
  edges: Array<{ node: CouponHeaderCardFragment | EventMarketCardFragment } | null>;
};

export type PartialsFilteredCouponCardGroupItemsFragment = {
  edges: Array<{ node: CouponHeaderCardPartialFragment | EventMarketCardPartialFragment } | null>;
  pageInfo: { hasNextPage: boolean | null } | null;
};

export type FullFutureRacingCardGroupItemsFragment = {
  edges: Array<{ date: string; node: QuickLinksCardFragment } | null>;
};

export type PartialsFutureRacingCardGroupItemsFragment = {
  edges: Array<{ date: string; node: { __typename: "QuickLinksCard"; urn: string } } | null>;
  pageInfo: { hasNextPage: boolean | null } | null;
};

export type FullGameCardGroupItemsFragment = {
  edges: Array<{
    node:
      | GameCardFragment
      | GameInfoCardFragment
      | GamingJackpotCardFragment
      | GamingLinkCardFragment
      | GamingPlayNewCardFragment
      | {};
  } | null>;
};

export type PartialsGameCardGroupItemsFragment = {
  edges: Array<{
    node:
      | { __typename: "AccountBannersCard"; urn: string }
      | { __typename: "BalanceCard"; urn: string }
      | { __typename: "BetLegCard"; urn: string }
      | { __typename: "BetOpportunityPromoCard"; urn: string }
      | { __typename: "BlurbCard"; urn: string }
      | { __typename: "BreadcrumbsCard"; urn: string }
      | { __typename: "BroadcastsAndStatisticsCard"; urn: string }
      | { __typename: "BroadcastsCard"; urn: string }
      | { __typename: "BudgetLimitsCard"; urn: string }
      | { __typename: "CdvTrackerCard"; urn: string }
      | { __typename: "CompetitionRegionCard"; urn: string }
      | { __typename: "CompetitionViewLinkCard"; urn: string }
      | { __typename: "ContentSummaryCard"; urn: string }
      | { __typename: "CorrectScoreCard"; urn: string }
      | { __typename: "CouponHeaderCard"; urn: string }
      | { __typename: "EditorialPromoCard"; urn: string }
      | { __typename: "EmbeddedContentCard"; urn: string }
      | { __typename: "EmbeddedViewCard"; urn: string }
      | { __typename: "EventHeaderCard"; urn: string }
      | { __typename: "EventMarketCard"; urn: string }
      | { __typename: "EventStatsCard"; urn: string }
      | { __typename: "EventViewLinkCard"; urn: string }
      | { __typename: "ExpandableMarketCard"; urn: string }
      | { __typename: "ExtraWalletCard"; urn: string }
      | { __typename: "FixtureCard"; urn: string }
      | { __typename: "FootballPlayerCompetitionStatsCard"; urn: string }
      | { __typename: "ForbiddenContentCard"; urn: string }
      | { __typename: "GameCard"; urn: string }
      | { __typename: "GameInfoCard"; urn: string }
      | { __typename: "GamingBackNavigationCard"; urn: string }
      | { __typename: "GamingJackpotCard"; urn: string }
      | { __typename: "GamingLinkCard"; urn: string }
      | { __typename: "GamingPlayNewCard"; urn: string }
      | { __typename: "GamingPrizeMachineCard"; urn: string }
      | { __typename: "GenericSwitcherCard"; urn: string }
      | { __typename: "GenericViewLinkCard"; urn: string }
      | { __typename: "GridCard"; urn: string }
      | { __typename: "HeadToHeadCard"; urn: string }
      | { __typename: "HighlightedSelectionCard"; urn: string }
      | { __typename: "ImsPromotionDetailsCard"; urn: string }
      | { __typename: "ImsPromotionErrorCard"; urn: string }
      | { __typename: "ImsPromotionStateCard"; urn: string }
      | { __typename: "ImsPromotionTermsAndConditionsCard"; urn: string }
      | { __typename: "IncidentsCard"; urn: string }
      | { __typename: "LinksCard"; urn: string }
      | { __typename: "LottoCard"; urn: string }
      | { __typename: "LoyaltyPromoCard"; urn: string }
      | { __typename: "MarketBetCard"; urn: string }
      | { __typename: "MarketBetSelectionCard"; urn: string }
      | { __typename: "MarketCard"; urn: string }
      | { __typename: "MarketExtendedCard"; urn: string }
      | { __typename: "MarketGraphsCard"; urn: string }
      | { __typename: "MarketRulesCard"; urn: string }
      | { __typename: "MarketViewLinkCard"; urn: string }
      | { __typename: "MatchStatSelectionCard"; urn: string }
      | { __typename: "MatchStatsCard"; urn: string }
      | { __typename: "MatchTimelineCard"; urn: string }
      | { __typename: "MiniEditorialPromoCard"; urn: string }
      | { __typename: "MiniPromoBannerCard"; urn: string }
      | { __typename: "MiniSelectionPromoCard"; urn: string }
      | { __typename: "MonterosaContentCard"; urn: string }
      | { __typename: "ObbCreatedBetsCard"; urn: string }
      | { __typename: "ObbEventPopularsCard"; urn: string }
      | { __typename: "ObbPvpCard"; urn: string }
      | { __typename: "ObbSquadBetCard"; urn: string }
      | { __typename: "ObbSquadVsSquadCard"; urn: string }
      | { __typename: "OutrightMarketListCard"; urn: string }
      | { __typename: "PackagedCreatedBetsCard"; urn: string }
      | { __typename: "PenaltyTakersCard"; urn: string }
      | { __typename: "PlayerEventMarketsCard"; urn: string }
      | { __typename: "PopularBetBuilderCard"; urn: string }
      | { __typename: "PopularMultiplesBetBuilderCard"; urn: string }
      | { __typename: "PopularSelectionsCard"; urn: string }
      | { __typename: "PreferenceSingleChoiceCard"; urn: string }
      | { __typename: "PriceBoostMultiplePromoCard"; urn: string }
      | { __typename: "PriceBoostMultisCard"; urn: string }
      | { __typename: "PriceBoostMultisListCard"; urn: string }
      | { __typename: "PromotionCard"; urn: string }
      | { __typename: "PromotionTrackerErrorCard"; urn: string }
      | { __typename: "PromotionsHubCard"; urn: string }
      | { __typename: "QuickLinksCard"; urn: string }
      | { __typename: "RaceByTimeRangeCard"; urn: string }
      | { __typename: "RaceDetailsCard"; urn: string }
      | { __typename: "RaceMarketCard"; urn: string }
      | { __typename: "RaceResultsCard"; urn: string }
      | { __typename: "RaceSwitcherCard"; urn: string }
      | { __typename: "RaceViewLinkCard"; urn: string }
      | { __typename: "RaceViewLinksCard"; urn: string }
      | { __typename: "RegulatoryCard"; urn: string }
      | { __typename: "RewardsCard"; urn: string }
      | { __typename: "RunnerInfoCard"; urn: string }
      | { __typename: "SearchBarCard"; urn: string }
      | { __typename: "SelectionPromoCard"; urn: string }
      | { __typename: "SelfExclusionCard"; urn: string }
      | { __typename: "SkyBetClubTrackerCard"; urn: string }
      | { __typename: "SnookerFixtureCard"; urn: string }
      | { __typename: "SportViewLinkCard"; urn: string }
      | { __typename: "SportsbookBetCard"; urn: string }
      | { __typename: "SportsbookBetInfoCard"; urn: string }
      | { __typename: "SportsbookChatbotCard"; urn: string }
      | { __typename: "StatsBroadcastsCard"; urn: string }
      | { __typename: "StatsFormCard"; urn: string }
      | { __typename: "StatsGoalsAndShotsCard"; urn: string }
      | { __typename: "StatsHeadToHeadCard"; urn: string }
      | { __typename: "StatsLineupsCard"; urn: string }
      | { __typename: "StatsMatchStatsCard"; urn: string }
      | { __typename: "StatsPlayersInPlayCard"; urn: string }
      | { __typename: "StatsPlayersSeasonStatsCard"; urn: string }
      | { __typename: "StatsRaceResultsCard"; urn: string }
      | { __typename: "StatsTableCard"; urn: string }
      | { __typename: "StatsTeamsCard"; urn: string }
      | { __typename: "TeamFormCard"; urn: string }
      | { __typename: "TeamLineupCard"; urn: string }
      | { __typename: "TimeFormBroadCastsCard"; urn: string }
      | { __typename: "VirtualEventDetailsCard"; urn: string }
      | { __typename: "VirtualMarketCard"; urn: string };
  } | null>;
};

export type FullGamingSearchCardItemsFragment = {
  totalCount: number;
  edges: Array<{ node: GameCardFragment } | null>;
  pageInfo: { hasNextPage: boolean | null; endCursor: string | null } | null;
};

export type PartialsGamingSearchCardItemsFragment = {
  edges: Array<{ node: { __typename: "GameCard"; urn: string } } | null>;
};

export type FullNavigationTabItemsFragment = {
  edges: Array<{
    node:
      | AccountBannersCardFragment
      | BalanceCardFragment
      | BetCardGroupFragment
      | BetOpportunityPromoCardFragment
      | BlurbCardFragment
      | BroadcastsAndStatisticsCardFragment
      | BroadcastsCardDeprecatedFragment
      | BudgetLimitsCardFragment
      | ByTimeRangeMeetingCardGroupFragment
      | CompetitionRegionCardFragment
      | CompetitionViewLinkCardFragment
      | ContentSummaryCardFragment
      | CorrectScoreCardFragment
      | EditorialPromoCardFragment
      | EmbeddedContentCardFragment
      | EmbeddedViewCardFragment
      | EventMarketCardFragment
      | EventViewLinkCardFragment
      | ExpandableCardGroupFragment
      | ExpandableMarketCardFragment
      | FilteredCouponCardGroupFragment
      | FixtureCardFragment
      | ForbiddenContentCardFragment
      | FutureRacingCardGroupFragment
      | GameCardFragment
      | GameInfoCardFragment
      | GamingCardGroupFragment
      | GamingJackpotCardFragment
      | GamingLinkCardFragment
      | GamingPlayNewCardFragment
      | GenericViewLinkCardFragment
      | GridCardFragment
      | HalfTimeSpecialsSwimlaneCardGroupFragment
      | HeadToHeadCardFragment
      | HighlightedSelectionCardFragment
      | (ImsPromotionDetailsCardFragment & ImsPromotionDetailsCardFragment)
      | (ImsPromotionErrorCardFragment & ImsPromotionErrorCardFragment)
      | (ImsPromotionStateCardFragment & ImsPromotionStateCardFragment)
      | (ImsPromotionTermsAndConditionsCardFragment & ImsPromotionTermsAndConditionsCardFragment)
      | LinksCardFragment
      | LottoCardFragment
      | MarketCardFragment
      | MarketExtendedCardFragment
      | MarketGraphsCardFragment
      | MarketRulesCardFragment
      | MarketViewLinkCardFragment
      | MatchStatSelectionCardFragment
      | MatchStatsCardFragment
      | MatchTimelineCardFragment
      | MiniPromoBannerCardFragment
      | MonterosaContentCardFragment
      | OutrightMarketListCardFragment
      | PebbleCardGroupFragment
      | PenaltyTakersCardFragment
      | PopularMultiplesBetBuilderCardFragment
      | PopularSelectionsCardFragment
      | PopularSwimlaneCardGroupFragment
      | PreferenceSingleChoiceCardFragment
      | PriceBoostMultiplePromoCardFragment
      | PromotionCardFragment
      | PromotionsCardGroupFragment
      | QuickLinksCardFragment
      | QuicklinksGridCardGroupFragment
      | RaceByTimeRangeCardFragment
      | RaceDetailsCardFragment
      | RaceMarketCardFragment
      | RaceResultsCardFragment
      | RaceViewLinkCardFragment
      | RaceViewLinksCardFragment
      | RacesByTimeRangeCardGroupFragment
      | RacingSwimlaneCardGroupFragment
      | RegulatoryCardFragment
      | RewardsCardFragment
      | RunnerInfoCardFragment
      | SearchBarCardFragment
      | SegmentedCardGroupFragment
      | SelectableitemsCardGroupFragment
      | SelectionPromoCardFragment
      | SportRibbonCardGroupFragment
      | SportViewLinkCardFragment
      | SportsbookBetCardFragment
      | SportsbookChatbotCardFragment
      | SportsbookLotteriesBetLegCardGroupFragment
      | SwimlaneCardGroupFragment
      | SwimlaneIndexedCardGroupFragment
      | TeamFormCardFragment
      | TeamLineupCardFragment
      | TimeFormBroadCastsCardFragment
      | ViewZoneFragment
      | VirtualEventDetailsCardFragment
      | VirtualMarketCardFragment
      | {};
  } | null>;
};

export type PartialsNavigationTabItemsFragment = {
  edges: Array<{
    node:
      | { __typename: "AccountBannersCard"; urn: string }
      | { __typename: "BalanceCard"; urn: string }
      | { __typename: "BetCardGroup"; urn: string }
      | { __typename: "BetLegCard"; urn: string }
      | { __typename: "BetOpportunityPromoCard"; urn: string }
      | { __typename: "BetSharingCardGroup"; urn: string }
      | { __typename: "BlurbCard"; urn: string }
      | { __typename: "BreadcrumbsCard"; urn: string }
      | { __typename: "BroadcastsAndStatisticsCard"; urn: string }
      | { __typename: "BroadcastsCard"; urn: string }
      | { __typename: "BudgetLimitsCard"; urn: string }
      | { __typename: "ByTimeRangeMeetingCardGroup"; urn: string }
      | { __typename: "CdvTrackerCard"; urn: string }
      | { __typename: "CompetitionRegionCard"; urn: string }
      | { __typename: "CompetitionViewLinkCard"; urn: string }
      | { __typename: "ContentSummaryCard"; urn: string }
      | { __typename: "CorrectScoreCard"; urn: string }
      | { __typename: "CouponHeaderCard"; urn: string }
      | { __typename: "EditorialPromoCard"; urn: string }
      | { __typename: "EmbeddedContentCard"; urn: string }
      | { __typename: "EmbeddedViewCard"; urn: string }
      | { __typename: "EventHeaderCard"; urn: string }
      | { __typename: "EventMarketCard"; urn: string }
      | { __typename: "EventStatsCard"; urn: string }
      | { __typename: "EventViewLinkCard"; urn: string }
      | { __typename: "ExpandableCardGroup"; urn: string }
      | ({ __typename: "ExpandableMarketCard"; urn: string } & ExpandableMarketCardEnrichedPartialFragment)
      | { __typename: "ExtraWalletCard"; urn: string }
      | { __typename: "ExtraWalletCardGroup"; urn: string }
      | { __typename: "FilteredCouponCardGroup"; urn: string }
      | { __typename: "FixtureCard"; urn: string }
      | { __typename: "FootballPlayerCompetitionStatsCard"; urn: string }
      | { __typename: "ForbiddenContentCard"; urn: string }
      | { __typename: "FutureRacingCardGroup"; urn: string }
      | { __typename: "GameCard"; urn: string }
      | { __typename: "GameInfoCard"; urn: string }
      | { __typename: "GamingBackNavigationCard"; urn: string }
      | { __typename: "GamingCardGroup"; urn: string }
      | { __typename: "GamingJackpotCard"; urn: string }
      | { __typename: "GamingLinkCard"; urn: string }
      | { __typename: "GamingPlayNewCard"; urn: string }
      | { __typename: "GamingPrizeMachineCard"; urn: string }
      | { __typename: "GenericSwitcherCard"; urn: string }
      | { __typename: "GenericViewLinkCard"; urn: string }
      | { __typename: "GridCard"; urn: string }
      | { __typename: "HalfTimeSpecialsSwimlaneCardGroup"; urn: string }
      | { __typename: "HeadToHeadCard"; urn: string }
      | { __typename: "HighlightedSelectionCard"; urn: string }
      | { __typename: "ImsPromotionDetailsCard"; urn: string }
      | { __typename: "ImsPromotionErrorCard"; urn: string }
      | { __typename: "ImsPromotionStateCard"; urn: string }
      | { __typename: "ImsPromotionTermsAndConditionsCard"; urn: string }
      | { __typename: "IncidentsCard"; urn: string }
      | { __typename: "LinksCard"; urn: string }
      | { __typename: "LottoCard"; urn: string }
      | { __typename: "LoyaltyPromoCard"; urn: string }
      | { __typename: "MarketBetCard"; urn: string }
      | { __typename: "MarketBetCardGroup"; urn: string }
      | { __typename: "MarketBetExpandableCardGroup"; urn: string }
      | { __typename: "MarketBetSelectionCard"; urn: string }
      | { __typename: "MarketBetSelectionCardGroup"; urn: string }
      | { __typename: "MarketCard"; urn: string }
      | { __typename: "MarketExtendedCard"; urn: string }
      | { __typename: "MarketGraphsCard"; urn: string }
      | { __typename: "MarketRulesCard"; urn: string }
      | { __typename: "MarketViewLinkCard"; urn: string }
      | { __typename: "MatchStatSelectionCard"; urn: string }
      | { __typename: "MatchStatsCard"; urn: string }
      | { __typename: "MatchTimelineCard"; urn: string }
      | { __typename: "MiniEditorialPromoCard"; urn: string }
      | { __typename: "MiniPromoBannerCard"; urn: string }
      | { __typename: "MiniSelectionPromoCard"; urn: string }
      | { __typename: "MonterosaContentCard"; urn: string }
      | { __typename: "ObbCardGroup"; urn: string }
      | { __typename: "ObbCreatedBetsCard"; urn: string }
      | { __typename: "ObbCreatedBetsCardGroup"; urn: string }
      | { __typename: "ObbEventPopularsCard"; urn: string }
      | { __typename: "ObbOnboardingCardsCardGroup"; urn: string }
      | { __typename: "ObbPvpCard"; urn: string }
      | { __typename: "ObbSection"; urn: string }
      | { __typename: "ObbSquadBetCard"; urn: string }
      | { __typename: "ObbSquadVsSquadCard"; urn: string }
      | { __typename: "OutrightMarketListCard"; urn: string }
      | { __typename: "PackagedCreatedBetsCard"; urn: string }
      | ({ __typename: "PebbleCardGroup"; urn: string } & PebbleCardGroupEnrichedPartialFragment)
      | { __typename: "PenaltyTakersCard"; urn: string }
      | { __typename: "PlayerEventMarketsCard"; urn: string }
      | { __typename: "PlayerMarketsCardGroup"; urn: string }
      | { __typename: "PlayersRail"; urn: string }
      | { __typename: "PopularBetBuilderCard"; urn: string }
      | { __typename: "PopularMultiplesBetBuilderCard"; urn: string }
      | ({ __typename: "PopularSelectionsCard"; urn: string } & PopularSelectionsCardEnrichedPartialFragment)
      | { __typename: "PopularSwimlaneCardGroup"; urn: string }
      | { __typename: "PreferenceSingleChoiceCard"; urn: string }
      | { __typename: "PriceBoostMultiplePromoCard"; urn: string }
      | { __typename: "PriceBoostMultisCard"; urn: string }
      | { __typename: "PriceBoostMultisListCard"; urn: string }
      | { __typename: "PromotionCard"; urn: string }
      | { __typename: "PromotionTrackerErrorCard"; urn: string }
      | { __typename: "PromotionsCardGroup"; urn: string }
      | { __typename: "PromotionsHubCard"; urn: string }
      | { __typename: "PromotionsHubCardGroup"; urn: string }
      | { __typename: "QuickLinksCard"; urn: string }
      | { __typename: "QuicklinksGridCardGroup"; urn: string }
      | { __typename: "RaceByTimeRangeCard"; urn: string }
      | { __typename: "RaceDetailsCard"; urn: string }
      | { __typename: "RaceMarketCard"; urn: string }
      | { __typename: "RaceResultsCard"; urn: string }
      | { __typename: "RaceSwitcherCard"; urn: string }
      | { __typename: "RaceViewLinkCard"; urn: string }
      | { __typename: "RaceViewLinksCard"; urn: string }
      | { __typename: "RacesByTimeRangeCardGroup"; urn: string }
      | { __typename: "RacingSwimlaneCardGroup"; urn: string }
      | { __typename: "RegulatoryCard"; urn: string }
      | { __typename: "RewardsCard"; urn: string }
      | { __typename: "RunnerInfoCard"; urn: string }
      | { __typename: "SearchBarCard"; urn: string }
      | { __typename: "SearchZone"; urn: string }
      | { __typename: "SegmentedCardGroup"; urn: string }
      | { __typename: "SelectableItemsCardGroup"; urn: string }
      | { __typename: "SelectionPromoCard"; urn: string }
      | { __typename: "SelfExclusionCard"; urn: string }
      | { __typename: "SkyBetClubTrackerCard"; urn: string }
      | { __typename: "SnookerFixtureCard"; urn: string }
      | { __typename: "SportRibbonCardGroup"; urn: string }
      | { __typename: "SportViewLinkCard"; urn: string }
      | { __typename: "SportsbookBetCard"; urn: string }
      | { __typename: "SportsbookBetInfoCard"; urn: string }
      | { __typename: "SportsbookBetLegCardGroup"; urn: string }
      | { __typename: "SportsbookChatbotCard"; urn: string }
      | { __typename: "SportsbookExpandableLegCardGroup"; urn: string }
      | { __typename: "SportsbookLotteriesBetLegCardGroup"; urn: string }
      | { __typename: "StatsBroadcastsCard"; urn: string }
      | { __typename: "StatsContentCardGroup"; urn: string }
      | { __typename: "StatsFormCard"; urn: string }
      | { __typename: "StatsGoalsAndShotsCard"; urn: string }
      | { __typename: "StatsHeadToHeadCard"; urn: string }
      | { __typename: "StatsLineupsCard"; urn: string }
      | { __typename: "StatsMatchStatsCard"; urn: string }
      | { __typename: "StatsPebbleCardGroup"; urn: string }
      | { __typename: "StatsPlayersInPlayCard"; urn: string }
      | { __typename: "StatsPlayersSeasonStatsCard"; urn: string }
      | { __typename: "StatsRaceResultsCard"; urn: string }
      | { __typename: "StatsSupportingContentButtonsCardGroup"; urn: string }
      | { __typename: "StatsTableCard"; urn: string }
      | { __typename: "StatsTeamsCard"; urn: string }
      | { __typename: "SwimlaneCardGroup"; urn: string }
      | { __typename: "SwimlaneIndexedCardGroup"; urn: string }
      | { __typename: "TeamFormCard"; urn: string }
      | { __typename: "TeamLineupCard"; urn: string }
      | { __typename: "TimeFormBroadCastsCard"; urn: string }
      | { __typename: "ViewZone"; urn: string }
      | { __typename: "VirtualCardGroup"; urn: string }
      | { __typename: "VirtualEventDetailsCard"; urn: string }
      | { __typename: "VirtualMarketCard"; urn: string };
  } | null>;
};

export type PackagedCreatedBetsItemsFragment = {
  edges: Array<{
    __typename: "PackagedCreatedBetsCardItemEdge";
    cursor: string | null;
    node: PopularBettingOpportunityFragment;
  } | null>;
  pageInfo: { endCursor: string | null; hasNextPage: boolean | null } | null;
};

export type FullPebbleCardGroupItemsFragment = {
  edges: Array<{
    name: string | null;
    node:
      | (AccountBannersCardFragment & AccountBannersCardFragment)
      | BalanceCardFragment
      | BetOpportunityPromoCardFragment
      | BroadcastsCardDeprecatedFragment
      | CompetitionRegionCardFragment
      | CompetitionViewLinkCardFragment
      | ContentSummaryCardFragment
      | CorrectScoreCardFragment
      | EditorialPromoCardFragment
      | EventMarketCardFragment
      | EventViewLinkCardFragment
      | FixtureCardFragment
      | GameCardFragment
      | GameInfoCardFragment
      | GamingJackpotCardFragment
      | GamingLinkCardFragment
      | GamingPlayNewCardFragment
      | GenericViewLinkCardFragment
      | GridCardFragment
      | HeadToHeadCardFragment
      | HighlightedSelectionCardFragment
      | (ImsPromotionDetailsCardFragment & ImsPromotionDetailsCardFragment)
      | (ImsPromotionErrorCardFragment & ImsPromotionErrorCardFragment)
      | (ImsPromotionStateCardFragment & ImsPromotionStateCardFragment)
      | (ImsPromotionTermsAndConditionsCardFragment & ImsPromotionTermsAndConditionsCardFragment)
      | LinksCardFragment
      | MarketCardFragment
      | MarketExtendedCardFragment
      | MarketGraphsCardFragment
      | MarketRulesCardFragment
      | MarketViewLinkCardFragment
      | MatchStatsCardFragment
      | MatchTimelineCardFragment
      | PackagedCreatedBetsCardFragment
      | PriceBoostMultiplePromoCardFragment
      | PromotionCardFragment
      | QuickLinksCardFragment
      | RaceByTimeRangeCardFragment
      | RaceDetailsCardFragment
      | RaceMarketCardFragment
      | RaceViewLinkCardFragment
      | RaceViewLinksCardFragment
      | RegulatoryCardFragment
      | RewardsCardFragment
      | RunnerInfoCardFragment
      | SelectionPromoCardFragment
      | SportViewLinkCardFragment
      | SportsbookBetCardFragment
      | TeamFormCardFragment
      | TeamLineupCardFragment
      | VirtualMarketCardFragment
      | {};
  } | null>;
};

export type PartialsPebbleCardGroupItemsFragment = {
  edges: Array<{
    name: string | null;
    node:
      | { __typename: "AccountBannersCard"; urn: string }
      | { __typename: "BalanceCard"; urn: string }
      | { __typename: "BetLegCard"; urn: string }
      | { __typename: "BetOpportunityPromoCard"; urn: string }
      | { __typename: "BlurbCard"; urn: string }
      | { __typename: "BreadcrumbsCard"; urn: string }
      | { __typename: "BroadcastsAndStatisticsCard"; urn: string }
      | { __typename: "BroadcastsCard"; urn: string }
      | { __typename: "BudgetLimitsCard"; urn: string }
      | { __typename: "CdvTrackerCard"; urn: string }
      | { __typename: "CompetitionRegionCard"; urn: string }
      | { __typename: "CompetitionViewLinkCard"; urn: string }
      | { __typename: "ContentSummaryCard"; urn: string }
      | { __typename: "CorrectScoreCard"; urn: string }
      | { __typename: "CouponHeaderCard"; urn: string }
      | { __typename: "EditorialPromoCard"; urn: string }
      | { __typename: "EmbeddedContentCard"; urn: string }
      | { __typename: "EmbeddedViewCard"; urn: string }
      | { __typename: "EventHeaderCard"; urn: string }
      | { __typename: "EventMarketCard"; urn: string }
      | { __typename: "EventStatsCard"; urn: string }
      | { __typename: "EventViewLinkCard"; urn: string }
      | { __typename: "ExpandableMarketCard"; urn: string }
      | { __typename: "ExtraWalletCard"; urn: string }
      | { __typename: "FixtureCard"; urn: string }
      | { __typename: "FootballPlayerCompetitionStatsCard"; urn: string }
      | { __typename: "ForbiddenContentCard"; urn: string }
      | { __typename: "GameCard"; urn: string }
      | { __typename: "GameInfoCard"; urn: string }
      | { __typename: "GamingBackNavigationCard"; urn: string }
      | { __typename: "GamingJackpotCard"; urn: string }
      | { __typename: "GamingLinkCard"; urn: string }
      | { __typename: "GamingPlayNewCard"; urn: string }
      | { __typename: "GamingPrizeMachineCard"; urn: string }
      | { __typename: "GenericSwitcherCard"; urn: string }
      | { __typename: "GenericViewLinkCard"; urn: string }
      | { __typename: "GridCard"; urn: string }
      | { __typename: "HeadToHeadCard"; urn: string }
      | { __typename: "HighlightedSelectionCard"; urn: string }
      | { __typename: "ImsPromotionDetailsCard"; urn: string }
      | { __typename: "ImsPromotionErrorCard"; urn: string }
      | { __typename: "ImsPromotionStateCard"; urn: string }
      | { __typename: "ImsPromotionTermsAndConditionsCard"; urn: string }
      | { __typename: "IncidentsCard"; urn: string }
      | { __typename: "LinksCard"; urn: string }
      | { __typename: "LottoCard"; urn: string }
      | { __typename: "LoyaltyPromoCard"; urn: string }
      | { __typename: "MarketBetCard"; urn: string }
      | { __typename: "MarketBetSelectionCard"; urn: string }
      | { __typename: "MarketCard"; urn: string }
      | { __typename: "MarketExtendedCard"; urn: string }
      | { __typename: "MarketGraphsCard"; urn: string }
      | { __typename: "MarketRulesCard"; urn: string }
      | { __typename: "MarketViewLinkCard"; urn: string }
      | { __typename: "MatchStatSelectionCard"; urn: string }
      | { __typename: "MatchStatsCard"; urn: string }
      | { __typename: "MatchTimelineCard"; urn: string }
      | { __typename: "MiniEditorialPromoCard"; urn: string }
      | { __typename: "MiniPromoBannerCard"; urn: string }
      | { __typename: "MiniSelectionPromoCard"; urn: string }
      | { __typename: "MonterosaContentCard"; urn: string }
      | { __typename: "ObbCreatedBetsCard"; urn: string }
      | { __typename: "ObbEventPopularsCard"; urn: string }
      | { __typename: "ObbPvpCard"; urn: string }
      | { __typename: "ObbSquadBetCard"; urn: string }
      | { __typename: "ObbSquadVsSquadCard"; urn: string }
      | { __typename: "OutrightMarketListCard"; urn: string }
      | { __typename: "PackagedCreatedBetsCard"; urn: string }
      | { __typename: "PenaltyTakersCard"; urn: string }
      | { __typename: "PlayerEventMarketsCard"; urn: string }
      | { __typename: "PopularBetBuilderCard"; urn: string }
      | { __typename: "PopularMultiplesBetBuilderCard"; urn: string }
      | { __typename: "PopularSelectionsCard"; urn: string }
      | { __typename: "PreferenceSingleChoiceCard"; urn: string }
      | { __typename: "PriceBoostMultiplePromoCard"; urn: string }
      | { __typename: "PriceBoostMultisCard"; urn: string }
      | { __typename: "PriceBoostMultisListCard"; urn: string }
      | { __typename: "PromotionCard"; urn: string }
      | { __typename: "PromotionTrackerErrorCard"; urn: string }
      | { __typename: "PromotionsHubCard"; urn: string }
      | { __typename: "QuickLinksCard"; urn: string }
      | { __typename: "RaceByTimeRangeCard"; urn: string }
      | { __typename: "RaceDetailsCard"; urn: string }
      | { __typename: "RaceMarketCard"; urn: string }
      | { __typename: "RaceResultsCard"; urn: string }
      | { __typename: "RaceSwitcherCard"; urn: string }
      | { __typename: "RaceViewLinkCard"; urn: string }
      | { __typename: "RaceViewLinksCard"; urn: string }
      | { __typename: "RegulatoryCard"; urn: string }
      | { __typename: "RewardsCard"; urn: string }
      | { __typename: "RunnerInfoCard"; urn: string }
      | { __typename: "SearchBarCard"; urn: string }
      | { __typename: "SelectionPromoCard"; urn: string }
      | { __typename: "SelfExclusionCard"; urn: string }
      | { __typename: "SkyBetClubTrackerCard"; urn: string }
      | { __typename: "SnookerFixtureCard"; urn: string }
      | { __typename: "SportViewLinkCard"; urn: string }
      | { __typename: "SportsbookBetCard"; urn: string }
      | { __typename: "SportsbookBetInfoCard"; urn: string }
      | { __typename: "SportsbookChatbotCard"; urn: string }
      | { __typename: "StatsBroadcastsCard"; urn: string }
      | { __typename: "StatsFormCard"; urn: string }
      | { __typename: "StatsGoalsAndShotsCard"; urn: string }
      | { __typename: "StatsHeadToHeadCard"; urn: string }
      | { __typename: "StatsLineupsCard"; urn: string }
      | { __typename: "StatsMatchStatsCard"; urn: string }
      | { __typename: "StatsPlayersInPlayCard"; urn: string }
      | { __typename: "StatsPlayersSeasonStatsCard"; urn: string }
      | { __typename: "StatsRaceResultsCard"; urn: string }
      | { __typename: "StatsTableCard"; urn: string }
      | { __typename: "StatsTeamsCard"; urn: string }
      | { __typename: "TeamFormCard"; urn: string }
      | { __typename: "TeamLineupCard"; urn: string }
      | { __typename: "TimeFormBroadCastsCard"; urn: string }
      | { __typename: "VirtualEventDetailsCard"; urn: string }
      | { __typename: "VirtualMarketCard"; urn: string };
  } | null>;
};

export type PriceBoostMultisListCardItemsFragment = {
  edges: Array<{
    __typename: "PriceBoostMultisListCardItemEdge";
    cursor: string | null;
    node: PopularBettingOpportunityFragment;
  } | null>;
  pageInfo: { endCursor: string | null; hasNextPage: boolean | null } | null;
};

export type FullRacesByTimeRangeCardGroupItemsFragment = {
  edges: Array<{ node: ByTimeRangeMeetingCardGroupFragment | SwimlaneIndexedCardGroupFragment } | null>;
};

export type PartialsRacesByTimeRangeCardGroupItemsFragment = {
  edges: Array<{ node: ByTimeRangeMeetingCardGroupPartialFragment | SwimlaneIndexedCardGroupPartialFragment } | null>;
  pageInfo: { hasNextPage: boolean | null } | null;
};

export type FullSegmentedCardGroupItemsFragment = { edges: Array<{ node: GamingCardGroupFragment } | null> };

export type PartialsSegmentedCardGroupItemsFragment = {
  edges: Array<{ node: { __typename: "GamingCardGroup"; urn: string } } | null>;
};

export type VirtualCardGroupPartialItemEdgeFragment = {
  __typename: "VirtualCardGroupItemEdge";
  startTime: string;
  isClosed: boolean;
  isDisabled: boolean;
  node: { __typename: "VirtualCardGroup"; urn: string };
};

export type VirtualCardGroupFullItemEdgeFragment = {
  __typename: "VirtualCardGroupItemEdge";
  startTime: string;
  isClosed: boolean;
  isDisabled: boolean;
  isHighlighted: boolean;
  node: VirtualCardGroupFragment;
};

export type FullSelectableItemsCardGroupItemsFragment = {
  edges: Array<
    | {
        isHighlighted: boolean;
        startTime: string;
        venue: string | null;
        promotion: { signposting: MarketPromoSignposting } | null;
        node: RaceMarketCardFragment;
      }
    | {
        isHighlighted: boolean;
        node:
          | EventStatsCardFragment
          | HeadToHeadCardFragment
          | MatchStatsCardFragment
          | MatchTimelineCardFragment
          | TeamFormCardFragment
          | TeamLineupCardFragment
          | {};
      }
    | VirtualCardGroupFullItemEdgeFragment
    | null
  >;
};

export type PartialsSelectableItemsCardGroupItemsFragment = {
  edges: Array<
    | {
        startTime: string;
        venue: string | null;
        promotion: { title: string; description: string; signposting: MarketPromoSignposting } | null;
        node: { __typename: "RaceMarketCard"; urn: string };
      }
    | {
        node:
          | { __typename: "AccountBannersCard"; urn: string }
          | { __typename: "BalanceCard"; urn: string }
          | { __typename: "BetLegCard"; urn: string }
          | { __typename: "BetOpportunityPromoCard"; urn: string }
          | { __typename: "BlurbCard"; urn: string }
          | { __typename: "BreadcrumbsCard"; urn: string }
          | { __typename: "BroadcastsAndStatisticsCard"; urn: string }
          | { __typename: "BroadcastsCard"; urn: string }
          | { __typename: "BudgetLimitsCard"; urn: string }
          | { __typename: "CdvTrackerCard"; urn: string }
          | { __typename: "CompetitionRegionCard"; urn: string }
          | { __typename: "CompetitionViewLinkCard"; urn: string }
          | { __typename: "ContentSummaryCard"; urn: string }
          | { __typename: "CorrectScoreCard"; urn: string }
          | { __typename: "CouponHeaderCard"; urn: string }
          | { __typename: "EditorialPromoCard"; urn: string }
          | { __typename: "EmbeddedContentCard"; urn: string }
          | { __typename: "EmbeddedViewCard"; urn: string }
          | { __typename: "EventHeaderCard"; urn: string }
          | { __typename: "EventMarketCard"; urn: string }
          | { __typename: "EventStatsCard"; urn: string }
          | { __typename: "EventViewLinkCard"; urn: string }
          | { __typename: "ExpandableMarketCard"; urn: string }
          | { __typename: "ExtraWalletCard"; urn: string }
          | { __typename: "FixtureCard"; urn: string }
          | { __typename: "FootballPlayerCompetitionStatsCard"; urn: string }
          | { __typename: "ForbiddenContentCard"; urn: string }
          | { __typename: "GameCard"; urn: string }
          | { __typename: "GameInfoCard"; urn: string }
          | { __typename: "GamingBackNavigationCard"; urn: string }
          | { __typename: "GamingJackpotCard"; urn: string }
          | { __typename: "GamingLinkCard"; urn: string }
          | { __typename: "GamingPlayNewCard"; urn: string }
          | { __typename: "GamingPrizeMachineCard"; urn: string }
          | { __typename: "GenericSwitcherCard"; urn: string }
          | { __typename: "GenericViewLinkCard"; urn: string }
          | { __typename: "GridCard"; urn: string }
          | { __typename: "HeadToHeadCard"; urn: string }
          | { __typename: "HighlightedSelectionCard"; urn: string }
          | { __typename: "ImsPromotionDetailsCard"; urn: string }
          | { __typename: "ImsPromotionErrorCard"; urn: string }
          | { __typename: "ImsPromotionStateCard"; urn: string }
          | { __typename: "ImsPromotionTermsAndConditionsCard"; urn: string }
          | { __typename: "IncidentsCard"; urn: string }
          | { __typename: "LinksCard"; urn: string }
          | { __typename: "LottoCard"; urn: string }
          | { __typename: "LoyaltyPromoCard"; urn: string }
          | { __typename: "MarketBetCard"; urn: string }
          | { __typename: "MarketBetSelectionCard"; urn: string }
          | { __typename: "MarketCard"; urn: string }
          | { __typename: "MarketExtendedCard"; urn: string }
          | { __typename: "MarketGraphsCard"; urn: string }
          | { __typename: "MarketRulesCard"; urn: string }
          | { __typename: "MarketViewLinkCard"; urn: string }
          | { __typename: "MatchStatSelectionCard"; urn: string }
          | { __typename: "MatchStatsCard"; urn: string }
          | { __typename: "MatchTimelineCard"; urn: string }
          | { __typename: "MiniEditorialPromoCard"; urn: string }
          | { __typename: "MiniPromoBannerCard"; urn: string }
          | { __typename: "MiniSelectionPromoCard"; urn: string }
          | { __typename: "MonterosaContentCard"; urn: string }
          | { __typename: "ObbCreatedBetsCard"; urn: string }
          | { __typename: "ObbEventPopularsCard"; urn: string }
          | { __typename: "ObbPvpCard"; urn: string }
          | { __typename: "ObbSquadBetCard"; urn: string }
          | { __typename: "ObbSquadVsSquadCard"; urn: string }
          | { __typename: "OutrightMarketListCard"; urn: string }
          | { __typename: "PackagedCreatedBetsCard"; urn: string }
          | { __typename: "PenaltyTakersCard"; urn: string }
          | { __typename: "PlayerEventMarketsCard"; urn: string }
          | { __typename: "PopularBetBuilderCard"; urn: string }
          | { __typename: "PopularMultiplesBetBuilderCard"; urn: string }
          | { __typename: "PopularSelectionsCard"; urn: string }
          | { __typename: "PreferenceSingleChoiceCard"; urn: string }
          | { __typename: "PriceBoostMultiplePromoCard"; urn: string }
          | { __typename: "PriceBoostMultisCard"; urn: string }
          | { __typename: "PriceBoostMultisListCard"; urn: string }
          | { __typename: "PromotionCard"; urn: string }
          | { __typename: "PromotionTrackerErrorCard"; urn: string }
          | { __typename: "PromotionsHubCard"; urn: string }
          | { __typename: "QuickLinksCard"; urn: string }
          | { __typename: "RaceByTimeRangeCard"; urn: string }
          | { __typename: "RaceDetailsCard"; urn: string }
          | { __typename: "RaceMarketCard"; urn: string }
          | { __typename: "RaceResultsCard"; urn: string }
          | { __typename: "RaceSwitcherCard"; urn: string }
          | { __typename: "RaceViewLinkCard"; urn: string }
          | { __typename: "RaceViewLinksCard"; urn: string }
          | { __typename: "RegulatoryCard"; urn: string }
          | { __typename: "RewardsCard"; urn: string }
          | { __typename: "RunnerInfoCard"; urn: string }
          | { __typename: "SearchBarCard"; urn: string }
          | { __typename: "SelectionPromoCard"; urn: string }
          | { __typename: "SelfExclusionCard"; urn: string }
          | { __typename: "SkyBetClubTrackerCard"; urn: string }
          | { __typename: "SnookerFixtureCard"; urn: string }
          | { __typename: "SportViewLinkCard"; urn: string }
          | { __typename: "SportsbookBetCard"; urn: string }
          | { __typename: "SportsbookBetInfoCard"; urn: string }
          | { __typename: "SportsbookChatbotCard"; urn: string }
          | { __typename: "StatsBroadcastsCard"; urn: string }
          | { __typename: "StatsFormCard"; urn: string }
          | { __typename: "StatsGoalsAndShotsCard"; urn: string }
          | { __typename: "StatsHeadToHeadCard"; urn: string }
          | { __typename: "StatsLineupsCard"; urn: string }
          | { __typename: "StatsMatchStatsCard"; urn: string }
          | { __typename: "StatsPlayersInPlayCard"; urn: string }
          | { __typename: "StatsPlayersSeasonStatsCard"; urn: string }
          | { __typename: "StatsRaceResultsCard"; urn: string }
          | { __typename: "StatsTableCard"; urn: string }
          | { __typename: "StatsTeamsCard"; urn: string }
          | { __typename: "TeamFormCard"; urn: string }
          | { __typename: "TeamLineupCard"; urn: string }
          | { __typename: "TimeFormBroadCastsCard"; urn: string }
          | { __typename: "VirtualEventDetailsCard"; urn: string }
          | { __typename: "VirtualMarketCard"; urn: string };
      }
    | VirtualCardGroupPartialItemEdgeFragment
    | null
  >;
};

export type FullSwimlaneIndexedCardGroupItemsFragment = {
  edges: Array<{
    node:
      | AccountBannersCardFragment
      | BalanceCardFragment
      | BetOpportunityPromoCardFragment
      | BroadcastsCardDeprecatedFragment
      | BudgetLimitsCardFragment
      | CompetitionRegionCardFragment
      | CompetitionViewLinkCardFragment
      | ContentSummaryCardFragment
      | EditorialPromoCardFragment
      | EventMarketCardFragment
      | EventViewLinkCardFragment
      | FixtureCardFragment
      | GameCardFragment
      | GameInfoCardFragment
      | GamingJackpotCardFragment
      | GamingLinkCardFragment
      | GamingPlayNewCardFragment
      | GenericViewLinkCardFragment
      | HeadToHeadCardFragment
      | HighlightedSelectionCardFragment
      | ImsPromotionDetailsCardFragment
      | (ImsPromotionErrorCardFragment & ImsPromotionErrorCardFragment)
      | ImsPromotionStateCardFragment
      | ImsPromotionTermsAndConditionsCardFragment
      | LinksCardFragment
      | MarketCardFragment
      | MarketExtendedCardFragment
      | MarketGraphsCardFragment
      | MarketRulesCardFragment
      | MarketViewLinkCardFragment
      | MatchStatsCardFragment
      | MatchTimelineCardFragment
      | MiniPromoBannerCardFragment
      | PriceBoostMultiplePromoCardFragment
      | PromotionCardFragment
      | QuickLinksCardFragment
      | RaceByTimeRangeCardFragment
      | RaceDetailsCardFragment
      | RaceMarketCardFragment
      | RaceViewLinkCardFragment
      | RaceViewLinksCardFragment
      | RegulatoryCardFragment
      | RewardsCardFragment
      | RunnerInfoCardFragment
      | SelectionPromoCardFragment
      | SportViewLinkCardFragment
      | SportsbookBetCardFragment
      | TeamFormCardFragment
      | TeamLineupCardFragment
      | {};
  } | null>;
};

export type ViewItemsFragment = {
  edges: Array<{
    theme: ViewItemTheme | null;
    node:
      | AccountBannersCardFragment
      | BalanceCardFragment
      | BetCardGroupFragment
      | SportsbookBetLegCardFragment
      | BetOpportunityPromoCardFragment
      | BetSharingCardGroupFragment
      | BroadcastsAndStatisticsCardFragment
      | BroadcastsCardDeprecatedFragment
      | BudgetLimitsCardFragment
      | ByTimeRangeMeetingCardGroupFragment
      | CompetitionRegionCardFragment
      | CompetitionViewLinkCardFragment
      | ContentSummaryCardFragment
      | CorrectScoreCardFragment
      | EditorialPromoCardFragment
      | EmbeddedContentCardFragment
      | EmbeddedViewCardFragment
      | EventMarketCardFragment
      | EventViewLinkCardFragment
      | (ExpandableCardGroupFragment & ExpandableCardGroupFragment)
      | ExpandableMarketCardFragment
      | FilteredCouponCardGroupFragment
      | FixtureCardWithStatsFragment
      | ForbiddenContentCardFragment
      | FutureRacingCardGroupFragment
      | GameCardFragment
      | GameInfoCardFragment
      | GamingCardGroupFragment
      | GamingJackpotCardFragment
      | GamingLinkCardFragment
      | GamingPlayNewCardFragment
      | GamingPrizeMachineCardFragment
      | GenericSwitcherCardFragment
      | GridCardFragment
      | HalfTimeSpecialsSwimlaneCardGroupFragment
      | HeadToHeadCardFragment
      | HighlightedSelectionCardFragment
      | ImsPromotionDetailsCardFragment
      | ImsPromotionErrorCardFragment
      | ImsPromotionStateCardFragment
      | ImsPromotionTermsAndConditionsCardFragment
      | IncidentsCardFragment
      | LinksCardFragment
      | LottoCardFragment
      | MarketBetCardFragment
      | MarketBetCardGroupFragment
      | MarketBetExpandableCardGroupFragment
      | MarketBetSelectionCardFragment
      | MarketBetSelectionCardGroupFragment
      | MarketCardFragment
      | MarketExtendedCardFragment
      | MarketGraphsCardFragment
      | MarketRulesCardFragment
      | MarketViewLinkCardFragment
      | MatchStatSelectionCardFragment
      | MatchStatsCardFragment
      | MatchTimelineCardFragment
      | MiniPromoBannerCardFragment
      | MonterosaContentCardFragment
      | NavigationTabsListFragment
      | OutrightMarketListCardFragment
      | PackagedCreatedBetsCardFragment
      | PebbleCardGroupFragment
      | PenaltyTakersCardFragment
      | PopularMultiplesBetBuilderCardFragment
      | PopularSelectionsCardFragment
      | PopularSwimlaneCardGroupFragment
      | PreferenceSingleChoiceCardFragment
      | PriceBoostMultiplePromoCardFragment
      | PromotionCardFragment
      | PromotionsCardGroupFragment
      | QuickLinksCardFragment
      | QuicklinksGridCardGroupFragment
      | RaceByTimeRangeCardFragment
      | RaceDetailsCardFragment
      | RaceMarketCardFragment
      | RaceSwitcherCardFragment
      | RaceViewLinkCardFragment
      | RaceViewLinksCardFragment
      | RacesByTimeRangeCardGroupFragment
      | RacingSwimlaneCardGroupFragment
      | RegulatoryCardFragment
      | RewardsCardFragment
      | RunnerInfoCardFragment
      | SearchBarCardFragment
      | SearchZoneFragment
      | SegmentedCardGroupFragment
      | SelectableitemsCardGroupFragment
      | SelectionPromoCardFragment
      | SelfExclusionCardFragment
      | SportRibbonCardGroupFragment
      | SportsbookBetCardFragment
      | SportsbookBetInfoCardFragment
      | SportsbookBetLegCardGroupFragment
      | SportsbookChatbotCardFragment
      | SportsbookExpandableLegCardGroupFragment
      | SportsbookLotteriesBetLegCardGroupFragment
      | StatsBroadcastsCardFragment
      | StatsContentCardGroupFragment
      | (StatsFormCardRecentFormFragment & StatsFormCardCompetitionFormFragment)
      | StatsGoalsAndShotsCardFragment
      | StatsHeadToHeadCardFragment
      | StatsLineupsCardFragment
      | StatsMatchStatsCardFragment
      | StatsPebbleCardGroupFragment
      | StatsPlayersInPlayCardFragment
      | StatsLeagueTableCardFragment
      | (StatsTeamsCardPreviousFiveFragment & StatsTeamsCardAllSeasonFragment)
      | SwimlaneCardGroupFragment
      | SwimlaneIndexedCardGroupFragment
      | TeamFormCardFragment
      | TeamLineupCardFragment
      | TimeFormBroadCastsCardFragment
      | ViewZoneFragment
      | {};
  } | null>;
  pageInfo?: { endCursor: string | null; hasNextPage: boolean | null } | null;
};

export type ViewItemsPartialFragment = {
  edges: Array<{
    theme: ViewItemTheme | null;
    node:
      | { __typename: "AccountBannersCard"; urn: string }
      | { __typename: "BalanceCard"; urn: string }
      | { __typename: "BetCardGroup"; urn: string }
      | { __typename: "BetLegCard"; urn: string }
      | { __typename: "BetOpportunityPromoCard"; urn: string }
      | { __typename: "BetSharingCardGroup"; urn: string }
      | { __typename: "BlurbCard"; urn: string }
      | { __typename: "BreadcrumbsCard"; urn: string }
      | { __typename: "BroadcastsAndStatisticsCard"; urn: string }
      | { __typename: "BroadcastsCard"; urn: string }
      | { __typename: "BudgetLimitsCard"; urn: string }
      | { __typename: "ByTimeRangeMeetingCardGroup"; urn: string }
      | { __typename: "CdvTrackerCard"; urn: string }
      | { __typename: "CompetitionRegionCard"; urn: string }
      | { __typename: "CompetitionViewLinkCard"; urn: string }
      | { __typename: "ContentSummaryCard"; urn: string }
      | { __typename: "CorrectScoreCard"; urn: string }
      | { __typename: "CouponHeaderCard"; urn: string }
      | { __typename: "EditorialPromoCard"; urn: string }
      | { __typename: "EmbeddedContentCard"; urn: string }
      | { __typename: "EmbeddedViewCard"; urn: string }
      | { __typename: "EventHeaderCard"; urn: string }
      | { __typename: "EventMarketCard"; urn: string }
      | { __typename: "EventStatsCard"; urn: string }
      | { __typename: "EventViewLinkCard"; urn: string }
      | { __typename: "ExpandableCardGroup"; urn: string }
      | { __typename: "ExpandableMarketCard"; urn: string }
      | { __typename: "ExtraWalletCard"; urn: string }
      | { __typename: "ExtraWalletCardGroup"; urn: string }
      | { __typename: "FavouriteMarketsNavigationTab"; urn: string }
      | { __typename: "FilteredCouponCardGroup"; urn: string }
      | {
          __typename: "FixtureCard";
          urn: string;
          red7Scoreboard: { fullURL: string | null; origin: string | null } | null;
        }
      | { __typename: "FootballPlayerCompetitionStatsCard"; urn: string }
      | { __typename: "ForbiddenContentCard"; urn: string }
      | { __typename: "FutureRacingCardGroup"; urn: string }
      | { __typename: "GameCard"; urn: string }
      | { __typename: "GameInfoCard"; urn: string }
      | { __typename: "GamingBackNavigationCard"; urn: string }
      | { __typename: "GamingCardGroup"; urn: string }
      | { __typename: "GamingJackpotCard"; urn: string }
      | { __typename: "GamingLinkCard"; urn: string }
      | { __typename: "GamingPlayNewCard"; urn: string }
      | { __typename: "GamingPrizeMachineCard"; urn: string }
      | { __typename: "GenericSwitcherCard"; urn: string }
      | { __typename: "GenericViewLinkCard"; urn: string }
      | { __typename: "GridCard"; urn: string }
      | { __typename: "HalfTimeSpecialsSwimlaneCardGroup"; urn: string }
      | { __typename: "HeadToHeadCard"; urn: string }
      | { __typename: "HighlightedSelectionCard"; urn: string }
      | { __typename: "ImsPromotionDetailsCard"; urn: string }
      | { __typename: "ImsPromotionErrorCard"; urn: string }
      | { __typename: "ImsPromotionStateCard"; urn: string }
      | { __typename: "ImsPromotionTermsAndConditionsCard"; urn: string }
      | { __typename: "IncidentsCard"; urn: string }
      | { __typename: "LinksCard"; urn: string }
      | { __typename: "LottoCard"; urn: string }
      | { __typename: "LoyaltyPromoCard"; urn: string }
      | { __typename: "MarketBetCard"; urn: string }
      | { __typename: "MarketBetCardGroup"; urn: string }
      | { __typename: "MarketBetExpandableCardGroup"; urn: string }
      | { __typename: "MarketBetSelectionCard"; urn: string }
      | { __typename: "MarketBetSelectionCardGroup"; urn: string }
      | { __typename: "MarketCard"; urn: string }
      | { __typename: "MarketExtendedCard"; urn: string }
      | { __typename: "MarketGraphsCard"; urn: string }
      | { __typename: "MarketRulesCard"; urn: string }
      | { __typename: "MarketViewLinkCard"; urn: string }
      | { __typename: "MatchStatSelectionCard"; urn: string }
      | { __typename: "MatchStatsCard"; urn: string }
      | { __typename: "MatchTimelineCard"; urn: string }
      | { __typename: "MiniEditorialPromoCard"; urn: string }
      | { __typename: "MiniPromoBannerCard"; urn: string }
      | { __typename: "MiniSelectionPromoCard"; urn: string }
      | { __typename: "MonterosaContentCard"; urn: string }
      | { __typename: "NavigationTab"; urn: string }
      | { __typename: "NavigationTabsList"; urn: string }
      | { __typename: "ObbCardGroup"; urn: string }
      | { __typename: "ObbCreatedBetsCard"; urn: string }
      | { __typename: "ObbCreatedBetsCardGroup"; urn: string }
      | { __typename: "ObbEventPopularsCard"; urn: string }
      | { __typename: "ObbOnboardingCardsCardGroup"; urn: string }
      | { __typename: "ObbPvpCard"; urn: string }
      | { __typename: "ObbSection"; urn: string }
      | { __typename: "ObbSquadBetCard"; urn: string }
      | { __typename: "ObbSquadVsSquadCard"; urn: string }
      | { __typename: "OutrightMarketListCard"; urn: string }
      | { __typename: "PackagedCreatedBetsCard"; urn: string }
      | { __typename: "PebbleCardGroup"; urn: string }
      | { __typename: "PenaltyTakersCard"; urn: string }
      | { __typename: "PlayerEventMarketsCard"; urn: string }
      | { __typename: "PlayerMarketsCardGroup"; urn: string }
      | { __typename: "PlayersRail"; urn: string }
      | { __typename: "PopularBetBuilderCard"; urn: string }
      | { __typename: "PopularMultiplesBetBuilderCard"; urn: string }
      | { __typename: "PopularSelectionsCard"; urn: string }
      | { __typename: "PopularSwimlaneCardGroup"; urn: string }
      | { __typename: "PreferenceSingleChoiceCard"; urn: string }
      | { __typename: "PriceBoostMultiplePromoCard"; urn: string }
      | { __typename: "PriceBoostMultisCard"; urn: string }
      | { __typename: "PriceBoostMultisListCard"; urn: string }
      | { __typename: "PromotionCard"; urn: string }
      | { __typename: "PromotionTrackerErrorCard"; urn: string }
      | { __typename: "PromotionsCardGroup"; urn: string }
      | { __typename: "PromotionsHubCard"; urn: string }
      | { __typename: "PromotionsHubCardGroup"; urn: string }
      | { __typename: "QuickLinksCard"; urn: string }
      | { __typename: "QuicklinksGridCardGroup"; urn: string }
      | { __typename: "RaceByTimeRangeCard"; urn: string }
      | { __typename: "RaceDetailsCard"; urn: string }
      | { __typename: "RaceMarketCard"; urn: string }
      | { __typename: "RaceResultsCard"; urn: string }
      | { __typename: "RaceSwitcherCard"; urn: string }
      | { __typename: "RaceViewLinkCard"; urn: string }
      | { __typename: "RaceViewLinksCard"; urn: string }
      | { __typename: "RacesByTimeRangeCardGroup"; urn: string }
      | { __typename: "RacingSwimlaneCardGroup"; urn: string }
      | { __typename: "RegulatoryCard"; urn: string }
      | { __typename: "RewardsCard"; urn: string }
      | { __typename: "RunnerInfoCard"; urn: string }
      | { __typename: "SearchBarCard"; urn: string }
      | { __typename: "SearchZone"; urn: string }
      | { __typename: "SegmentedCardGroup"; urn: string }
      | { __typename: "SelectableItemsCardGroup"; urn: string }
      | { __typename: "SelectionPromoCard"; urn: string }
      | { __typename: "SelfExclusionCard"; urn: string }
      | { __typename: "SkyBetClubTrackerCard"; urn: string }
      | { __typename: "SnookerFixtureCard"; urn: string }
      | { __typename: "SportRibbonCardGroup"; urn: string }
      | { __typename: "SportViewLinkCard"; urn: string }
      | { __typename: "SportsbookBetCard"; urn: string }
      | { __typename: "SportsbookBetInfoCard"; urn: string }
      | { __typename: "SportsbookBetLegCardGroup"; urn: string }
      | { __typename: "SportsbookChatbotCard"; urn: string }
      | { __typename: "SportsbookExpandableLegCardGroup"; urn: string }
      | { __typename: "SportsbookLotteriesBetLegCardGroup"; urn: string }
      | { __typename: "StatsBroadcastsCard"; urn: string }
      | { __typename: "StatsContentCardGroup"; urn: string }
      | { __typename: "StatsFormCard"; urn: string }
      | { __typename: "StatsGoalsAndShotsCard"; urn: string }
      | { __typename: "StatsHeadToHeadCard"; urn: string }
      | { __typename: "StatsLineupsCard"; urn: string }
      | { __typename: "StatsMatchStatsCard"; urn: string }
      | { __typename: "StatsPebbleCardGroup"; urn: string }
      | { __typename: "StatsPlayersInPlayCard"; urn: string }
      | { __typename: "StatsPlayersSeasonStatsCard"; urn: string }
      | { __typename: "StatsRaceResultsCard"; urn: string }
      | { __typename: "StatsSupportingContentButtonsCardGroup"; urn: string }
      | { __typename: "StatsTableCard"; urn: string }
      | { __typename: "StatsTeamsCard"; urn: string }
      | { __typename: "SwimlaneCardGroup"; urn: string }
      | { __typename: "SwimlaneIndexedCardGroup"; urn: string }
      | { __typename: "TeamFormCard"; urn: string }
      | { __typename: "TeamLineupCard"; urn: string }
      | { __typename: "TimeFormBroadCastsCard"; urn: string }
      | { __typename: "ViewZone"; urn: string }
      | { __typename: "VirtualCardGroup"; urn: string }
      | { __typename: "VirtualEventDetailsCard"; urn: string }
      | { __typename: "VirtualMarketCard"; urn: string };
  } | null>;
};

export type FavouriteMarketsNavigationTabPartialFragment = {
  __typename: "FavouriteMarketsNavigationTab";
  urn: string;
  badgeText: TranslatableTextFragment | null;
  tabViewLink: { viewUrl: string; viewUrn: string } | null;
  metadata: { total: FavouriteMarketsCountMetadataFragment } | null;
};

export type FavouriteMarketsNavigationTabLiteFragment = {
  partials: PartialsFavouriteMarketsNavigationTabItemsFragment;
} & FavouriteMarketsNavigationTabPartialFragment;

export type FavouriteMarketsNavigationTabFragment = {
  full: FullFavouriteMarketsNavigationTabItemsFragment;
} & FavouriteMarketsNavigationTabLiteFragment;

export type NavigationTabFragment = {
  __typename: "NavigationTab";
  urn: string;
  badgeText: TranslatableTextFragment | null;
  tabTitle: TranslatableTextFragment;
  tabViewLink: { viewUrl: string; viewUrn: string } | null;
  full: FullNavigationTabItemsFragment;
  partials: PartialsNavigationTabItemsFragment;
};

export type NavigationTabPartialFragment = {
  __typename: "NavigationTab";
  urn: string;
  badgeText: TranslatableTextFragment | null;
  tabTitle: TranslatableTextFragment;
  tabViewLink: { viewUrl: string; viewUrn: string } | null;
};

export type NavigationTabsListFragment = {
  __typename: "NavigationTabsList";
  urn: string;
  tabsTitle: string | null;
  full: { edges: Array<{ node: FavouriteMarketsNavigationTabFragment | NavigationTabFragment } | null> };
  partials: {
    edges: Array<{ node: FavouriteMarketsNavigationTabPartialFragment | NavigationTabPartialFragment } | null>;
  };
};

export type NavigationTabsListPartialFragment = { __typename: "NavigationTabsList"; urn: string };

export type LeftSidebarFragment = { __typename: "LeftSidebar"; items: ViewItemsFragment };

export type TranslatableTextFragment = { translated: string | null; translate: { key: string } | null };

export type AllCompetitionsViewFragment = {
  __typename: "AllCompetitionsView";
  urn: string;
  url: string;
  title: string | null;
  items: ViewItemsFragment;
  partialItems: ViewItemsPartialFragment;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar: XSellBarFragment | null;
};

export type AllMarketsViewFragment = {
  __typename: "AllMarketsView";
  urn: string;
  url: string;
  title: string | null;
  items: ViewItemsFragment;
  partialItems: ViewItemsPartialFragment;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar: XSellBarFragment | null;
};

export type BrowseViewFragment = {
  __typename: "BrowseView";
  urn: string;
  url: string;
  items: ViewItemsFragment;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar: XSellBarFragment | null;
};

export type CompetitionViewFragment = {
  __typename: "CompetitionView";
  urn: string;
  url: string;
  title: string | null;
  canonicalUrl: string | null;
  competition: CompetitionBasicFragment;
  items: ViewItemsFragment;
  partialItems: ViewItemsPartialFragment;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar: XSellBarFragment | null;
};

export type EventViewFragment = {
  __typename: "EventView";
  urn: string;
  url: string;
  canonicalUrl: string | null;
  items: ViewItemsFragment;
  partialItems: ViewItemsPartialFragment;
  sportevent: SportEventFragment;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar: XSellBarFragment | null;
};

export type GameViewFragment = {
  __typename: "GameView";
  urn: string;
  url: string;
  items: ViewItemsFragment;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar: XSellBarFragment | null;
  navigationItem: { title: string | null } | null;
};

export type GamingCategoryViewFragment = {
  __typename: "GamingCategoryView";
  urn: string;
  url: string;
  items: ViewItemsFragment;
  partialItems: ViewItemsPartialFragment;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar: XSellBarFragment | null;
  navigationItem: { title: string | null } | null;
  seoMetaData: { metaTitle: string | null; metaDescription: string | null } | null;
};

export type GamingSegmentationViewFragment = {
  __typename: "GamingSegmentationView";
  urn: string;
  url: string;
  items: ViewItemsFragment;
  partialItems: ViewItemsPartialFragment;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar: XSellBarFragment | null;
};

export type GamingViewFragment = {
  __typename: "GamingView";
  urn: string;
  url: string;
  items: ViewItemsFragment;
  partialItems: ViewItemsPartialFragment;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar: XSellBarFragment | null;
  seoMetaData: { metaTitle: string | null; metaDescription: string | null } | null;
};

export type GenericViewFragment = {
  __typename: "GenericView";
  urn: string;
  url: string;
  title: string | null;
  canonicalUrl: string | null;
  category: ViewCategory | null;
  viewHeader: { title: string | null; titleImage: TitleImage | null; subTitle: string | null; badge: Badge | null };
  items: ViewItemsFragment;
  partialItems: ViewItemsPartialFragment;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar: XSellBarFragment | null;
};

export type ImsPromotionViewFragment = {
  __typename: "ImsPromotionView";
  urn: string;
  url: string;
  title: string | null;
  items: ViewItemsFragment;
  partialItems: ViewItemsPartialFragment;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar: XSellBarFragment | null;
};

export type MaintenanceViewFragment = {
  __typename: "MaintenanceView";
  urn: string;
  url: string;
  redirectUrl: string;
  twitterUrl: string;
  products: Array<{
    product: Product;
    status: SplashStatus;
    viewLink: { viewUrn: string; viewUrl: string };
    name: { translate: { key: string } | null };
  }>;
  items: ViewItemsFragment;
  regulatoryData: RegulatoryDataFragment | null;
  bottomBar: BottomBarFragment | null;
  xsellBar: XSellBarFragment | null;
};

export type MarketRulesViewFragment = {
  __typename: "MarketRulesView";
  urn: string;
  url: string;
  title: string | null;
  category: ViewCategory | null;
  items: ViewItemsFragment;
  xsellBar: XSellBarFragment | null;
};

export type MarketViewFragment = {
  __typename: "MarketView";
  urn: string;
  url: string;
  canonicalUrl: string | null;
  mainMarket: ExchangeMarketFragment | SportsbookMarketFragment;
  items: ViewItemsFragment;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar: XSellBarFragment | null;
};

export type MyAccountViewFragment = {
  __typename: "MyAccountView";
  urn: string;
  url: string;
  wizardUrl: string | null;
  items: ViewItemsFragment;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar: XSellBarFragment | null;
};

export type MyBetsViewFragment = {
  __typename: "MyBetsView";
  urn: string;
  url: string;
  settlementLink: string | null;
  hasEmptyStateImage: boolean;
  filters: {
    marketIds: Array<string>;
    totalDaysRange: number;
    hasHeritageBets: boolean | null;
    isHeritageView: boolean | null;
    orderType: { items: Array<MyBetsOrderTypeFilter | null>; defaultIndex: number };
    productType: { items: Array<MyBetsProductTypeFilter | null>; defaultIndex: number };
    matchedStatus: {
      defaultIndex: number;
      items: Array<{ filterURN: string; filter: MyBetsMatchedStatusFilter; numberOfBets: number | null }>;
    } | null;
  };
  transactionHistoryLink: { viewUrn: string; viewUrl: string };
  items: ViewItemsFragment;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar: XSellBarFragment | null;
  headerItems: { edges: Array<{ theme: ViewItemTheme | null; node: GenericSwitcherCardFragment } | null> };
};

export type NotFoundViewFragment = {
  __typename: "NotFoundView";
  urn: string;
  url: string;
  items: ViewItemsFragment;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar: XSellBarFragment | null;
};

export type ObbLandingPageViewFragment = {
  __typename: "ObbLandingPageView";
  urn: string;
  url: string;
  items: ViewItemsFragment;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar: XSellBarFragment | null;
};

export type PromotionsHubViewFragment = {
  __typename: "PromotionsHubView";
  title: string | null;
  urn: string;
  url: string;
  category: ViewCategory | null;
  items: {
    edges: Array<{
      node:
        | ({ __typename: "PromotionsHubCardGroup" } & LocalTbdPromotionsHubCardGroupFragment)
        | { __typename: "RegulatoryCard"; urn: string };
    } | null>;
  };
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar: XSellBarFragment | null;
};

export type PromotionsViewFragment = {
  __typename: "PromotionsView";
  urn: string;
  url: string;
  items: ViewItemsFragment;
  partialItems: ViewItemsPartialFragment;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar: XSellBarFragment | null;
};

export type RaceViewFragment = {
  __typename: "RaceView";
  urn: string;
  url: string;
  title: string | null;
  canonicalUrl: string | null;
  race: RaceFragment;
  items: ViewItemsFragment;
  partialItems: ViewItemsPartialFragment;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar: XSellBarFragment | null;
};

export type RunnerViewFragment = {
  __typename: "RunnerView";
  urn: string;
  url: string;
  title: string | null;
  category: ViewCategory | null;
  items: ViewItemsFragment;
  xsellBar: XSellBarFragment | null;
};

export type SelfExcludedViewFragment = {
  __typename: "SelfExcludedView";
  urn: string;
  url: string;
  items: ViewItemsFragment;
  bottomBar?: BottomBarFragment | null;
  xsellBar: XSellBarFragment | null;
};

export type SettingsViewFragment = {
  __typename: "SettingsView";
  urn: string;
  url: string;
  settings: Array<{ text: string | null; url: string | null }> | null;
  items: ViewItemsFragment;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar: XSellBarFragment | null;
};

export type SportViewFragment = {
  __typename: "SportView";
  urn: string;
  url: string;
  title: string | null;
  canonicalUrl: string | null;
  sport: SportFragment;
  items: ViewItemsFragment;
  partialItems: ViewItemsPartialFragment;
  bottomBar?: BottomBarFragment | null;
  leftSidebar?: LeftSidebarFragment | null;
  regulatoryData?: RegulatoryDataFragment | null;
  xsellBar: XSellBarFragment | null;
};
