import { Badge, XSellBarFragment } from "../../../clients/catalogue/catalogue-response-types";
import { ProductsOption } from "../../entities";
import { ErrorType } from "../../network-status/Errors";
import { MyBetsFilters } from "../cards/MyBets.types";
import URN from "../URN";

import { BrowseInterfaceState } from "./browse-view/BrowseInterface.types";
import { PartialItem } from "./PartialItem.types";
import { ViewLink } from "./ViewLink.types";

export type ViewHeaderBadge = `${Badge}`;

export type ViewHeader = {
  title: string | null;
  subTitle: string | null;
  badge: ViewHeaderBadge | null;
};

/**
 * "View" data model type
 * holding all the data that a view needs about what and how to render cards on the screen
 */
export type CommonView = {
  urn: URN;
  typename: string;
  url: string;
  canonicalUrl?: string | null;
  title?: string;
  viewHeader?: ViewHeader | null;
  items: PartialItem[];
  wizardUrl?: string | null;
  navigationItem?: NavigationItem;
  metadata?: ViewMetadata;
  xsellBar?: XSellBarFragment | null;
};

type ViewMetadata = {
  cacheTimestamp: number;
};

type PageInfo = {
  endCursor: string;
  hasNextPage: boolean;
};

export type EventView = {
  typename: "EventView";
  sportevent: URN;
  nextPageCursor?: string;
  items: PartialItem[];
} & CommonView;

export type EventViews = {
  [urn: string]: EventView;
};

export type ErrorView = {
  typename: "ErrorView";
  urn: URN;
  errorType: ErrorType;
  helpCenterUrl?: string;
  bffEndpoint?: string;
  latestBffEndpoint?: string;
  appEnv: string;
} & CommonView;

export type ErrorViews = {
  [urn: string]: ErrorView;
};

export type SportView = {
  typename: "SportView";
  sport: URN;
  title?: string;
  items: PartialItem[];
} & CommonView;

export type SportViews = {
  [urn: string]: SportView;
};

export type GenericView = {
  typename: "GenericView";
  items: PartialItem[];
} & CommonView;

export type GenericViews = {
  [urn: string]: GenericView;
};

export type RunnerView = {
  typename: "RunnerView";
  items: PartialItem[];
} & CommonView;

export type RunnerViews = {
  [urn: string]: RunnerView;
};

export type SelfExcludedView = {
  typename: "SelfExcludedView";
  items: PartialItem[];
} & CommonView;

export type SelfExcludedViews = {
  [urn: string]: SelfExcludedView;
};

export type MarketView = {
  typename: "MarketView";
  mainMarket: URN;
  items: PartialItem[];
} & CommonView;

export type MarketViewHydrated = {
  typename: "MarketView";
  mainMarket: URN;
  items: PartialItem[];
} & CommonView;

export type MarketViews = {
  [urn: string]: MarketView;
};

export type AllMarketsView = {
  typename: "AllMarketsView";
  items: PartialItem[];
} & CommonView;

export type AllMarketsViews = {
  [urn: string]: AllMarketsView;
};

export type AllCompetitionsView = {
  typename: "AllCompetitionsView";
  items: PartialItem[];
} & CommonView;

export type MyAccountView = {
  typename: "MyAccountView";
  items: PartialItem[];
} & CommonView;

export type MarketRulesView = {
  typename: "MarketRulesView";
  items: PartialItem[];
} & CommonView;

export type AllCompetitionsViews = {
  [urn: string]: AllCompetitionsView;
};

export type MyAccountViews = {
  [urn: string]: MyAccountView;
};

export type MarketRulesViews = {
  [urn: string]: MarketRulesView;
};

export type BrowseView = {
  typename: "BrowseView";
  items: PartialItem[];
} & BrowseInterfaceState &
  CommonView;

export type BrowseViews = {
  [urn: string]: BrowseView;
};

export type ObbLandingPageView = {
  typename: "ObbLandingPageView";
  items: PartialItem[];
} & CommonView;

export type ObbLandingPageViews = {
  [urn: string]: ObbLandingPageView;
};

export type CompetitionView = {
  typename: "CompetitionView";
  competition: URN;
  items: PartialItem[];
} & CommonView;

export type CompetitionViews = {
  [urn: string]: CompetitionView;
};

export type SeoMetaData = {
  metaTitle: string | null;
  metaDescription: string | null;
} | null;

export type GamingView = {
  typename: "GamingView";
  seoMetaData?: SeoMetaData;
  items: PartialItem[];
} & CommonView;

export type GamingViews = {
  [urn: string]: GamingView;
};

export type GameView = {
  typename: "GameView";
  items: PartialItem[];
} & CommonView;

export type GameViews = {
  [urn: string]: GameView;
};

export type NavigationItem = {
  title: string | null;
} | null;

export type GamingCategoryView = {
  typename: "GamingCategoryView";
  navigationItem: NavigationItem;
  seoMetaData?: SeoMetaData;
  items: PartialItem[];
} & CommonView;

export type GamingCategoryViews = {
  [urn: string]: GamingCategoryView;
};

export type GamingSegmentationView = {
  typename: "GamingSegmentationView";
  items: PartialItem[];
} & CommonView;

export type GamingSegmentationViews = {
  [urn: string]: GamingSegmentationView;
};

export type MyBetsView = {
  typename: "MyBetsView";
  items: PartialItem[];
  pageInfo: PageInfo;
  filters: MyBetsFilters;
  transactionHistoryLink: ViewLink;
  hasEmptyStateImage: boolean;
  settlementLink: string | null;
  headerItems: PartialItem[];
} & CommonView;

export type MyBetsViews = {
  [urn: string]: MyBetsView;
};

export type SettingsSection = {
  text?: string | null;
  id?: string | null;
  url?: string | null;
};

export type SettingsView = {
  typename: "SettingsView";
  settings: SettingsSection[];
  items: PartialItem[];
} & CommonView;

export type SettingsViews = {
  [urn: string]: SettingsView;
};

export type RaceView = {
  typename: "RaceView";
  items: PartialItem[];
  race: URN;
} & CommonView;

export type RaceViews = {
  [urn: string]: RaceView;
};

export type SplashStatus = "OK" | "SPLASHED";

export type MaintenanceProduct = {
  product: ProductsOption;
  status: SplashStatus;
  viewLink: ViewLink;
  name: string;
};

export type MaintenanceView = {
  typename: "MaintenanceView";
  redirectUrl: string;
  products: MaintenanceProduct[];
  items: PartialItem[];
  twitterUrl: string;
} & CommonView;

export type MaintenanceViews = {
  [urn: string]: MaintenanceView;
};

export type NotFoundView = {
  typename: "NotFoundView";
  items: PartialItem[];
} & CommonView;

export type NotFoundViews = {
  [urn: string]: NotFoundView;
};

export type ImsPromotionView = {
  typename: "ImsPromotionView";
  items: PartialItem[];
} & CommonView;

export type ImsPromotionViews = {
  [urn: string]: ImsPromotionView;
};

export type PromotionsView = {
  typename: "PromotionsView";
  items: PartialItem[];
} & CommonView;

export type PromotionsViews = {
  [urn: string]: PromotionsView;
};

export type PromotionsHubView = {
  typename: "PromotionsHubView";
  items: PartialItem[];
} & CommonView;

export type PromotionsHubViews = {
  [urn: string]: PromotionsHubView;
};

export type Views = {
  readonly allcompetitions: AllCompetitionsViews;
  readonly allmarkets: AllMarketsViews;
  readonly browse: BrowseViews;
  readonly competition: CompetitionViews;
  readonly error: ErrorViews;
  readonly event: EventViews;
  readonly game: GameViews;
  readonly gaming: GamingViews;
  readonly gamingcategory: GamingCategoryViews;
  readonly gamingsegmentation: GamingSegmentationViews;
  readonly generic: GenericViews;
  readonly maintenance: MaintenanceViews;
  readonly market: MarketViews;
  readonly myAccount: MyAccountViews;
  readonly mybets: MyBetsViews;
  readonly notfound: NotFoundViews;
  readonly obblandingpage: ObbLandingPageViews;
  readonly race: RaceViews;
  readonly runner: RunnerViews;
  readonly settings: SettingsViews;
  readonly selfexcluded: SelfExcludedViews;
  readonly sport: SportViews;
  readonly imspromotion: ImsPromotionViews;
  readonly promotions: PromotionsViews;
  readonly promotionshub: PromotionsHubViews;
  readonly marketrules: MarketRulesViews;
};

/**
 * Type for all views adapted for GenericView
 */
export type View =
  | AllCompetitionsView
  | AllMarketsView
  | BrowseView
  | CompetitionView
  | EventView
  | ErrorView
  | GameView
  | GamingView
  | GamingCategoryView
  | GamingSegmentationView
  | GenericView
  | MaintenanceView
  | MarketRulesView
  | MarketView
  | MyAccountView
  | MyBetsView
  | NotFoundView
  | RaceView
  | RunnerView
  | SettingsView
  | SelfExcludedView
  | SportView
  | ImsPromotionView
  | PromotionsView
  | PromotionsHubView
  | ObbLandingPageView;
