import { fabricGQL } from "@flutter-global/uki-channels-http-clients";

import type { RouterState, ThrottleOverrides } from "../../state";
import type URN from "../../state/layout/URN";
import type {
  AcceptPromotionMutation,
  AppContextQuery,
  AppVersionQuery,
  BettingCardRunnersDisplayQuery,
  ByTimeRangeFilterBy,
  CancelPromotionMutation,
  CardQuery,
  DefaultProduct,
  ExchangeDefaultProduct,
  ExperimentsInput,
  FilteredCouponFilterBy,
  FilteredCouponQuery,
  FilteredGroupSort,
  FilteredSelectableItemsQuery,
  FullCardQuery,
  FutureRacingFilterBy,
  GamingSearchQuery,
  GetWebMessagesQuery,
  LastViewedProduct,
  LayoutPreferencesInput,
  MainMarketsQuery,
  MarketsQuery,
  OptinCppPromoMutation,
  PlaceBetRequestInput,
  PlaceObbBetMutation,
  ProductExclusion,
  RaceRunnersQuery,
  ReadWebMessageMutation,
  SearchViewQuery,
  SelectableItemsFilterOptions,
  SetConfirmCashoutPreferenceMutation,
  SetDefaultProductPreferenceMutation,
  SetExchangeDefaultProductPreferenceMutation,
  SetFavouriteMarketMutation,
  SetLastViewedProductPreferenceMutation,
  SetSingleChoicePreferenceMutation,
  SetUserProductsPreferenceMutation,
  UserProducts,
  ViewQuery,
  VirtualMarketsQuery,
  ImplyBetsRequestInput,
  ImplyObbBetsQuery,
  QuotesRequestInput,
  ObbQuotesQuery,
  IncidentTypesFilterInput,
  EventParticipantsRequestInput,
  SquadBetQuotesRequestInput,
  ObbSquadbetQuotesQuery,
  ObbGetEventParticipantsQuery,
} from "./catalogue-response-types";

type Headers = { [headerKey: string]: string | undefined };

/**
 * Catalogue Client
 * @param {string} endpoint Catalogue endpoint path
 * @param {object} options Options
 *
 * @returns CatalogueClient
 */
function CatalogueClient(
  endpoint: string,
  options: {
    applicationKey: string;
    overrideUserAgent?: string;
    overrideCustomHeaders?: Headers;
  },
  overrideReferer?: string,
): {
  getLayout: (
    urn: URN,
    gqlQuery: string,
    numberOfFilledCardsInCardGroup: number,
    numberOfFilledCardsInView: number,
    withBottomBar?: boolean,
    withLeftSidebar?: boolean,
    withRegulatoryData?: boolean,
    withPageInfo?: boolean,
    cursor?: string,
    preferences?: Partial<LayoutPreferencesInput>,
    productExclusions?: ProductExclusion[],
    currentUrl?: string,
    experiments?: ExperimentsInput[],
    throttleOverrides?: ThrottleOverrides,
    decorationsOnly?: boolean,
  ) => Promise<ViewQuery>;
  getSearchResults: (
    query: string,
    gqlQuery: string,
    preferences?: Partial<LayoutPreferencesInput>,
    productExclusions?: ProductExclusion[],
    experiments?: ExperimentsInput[],
    throttleOverrides?: ThrottleOverrides,
  ) => Promise<SearchViewQuery>;
  getGamingSearchResults: (
    query: string,
    gqlQuery: string,
    first: number,
    after?: string,
  ) => Promise<GamingSearchQuery>;
  getCards: (
    urns: string[],
    gqlQuery: string,
    numberOfFilledCardsInCardGroup?: number,
    preferences?: Partial<LayoutPreferencesInput>,
    productExclusions?: ProductExclusion[],
    experiments?: ExperimentsInput[],
    throttleOverrides?: ThrottleOverrides,
    router?: RouterState,
    first?: number,
    cursor?: string,
  ) => Promise<CardQuery>;
  getFullCard: (
    urn: string,
    gqlQuery: string,
    numberOfFilledCardsInCardGroup?: number,
    preferences?: Partial<LayoutPreferencesInput>,
    productExclusions?: ProductExclusion[],
    experiments?: ExperimentsInput[],
    throttleOverrides?: ThrottleOverrides,
    router?: RouterState,
  ) => Promise<FullCardQuery>;
  getMainMarketsUpdates: (
    urns: string[],
    withFixtureUpdates: boolean,
    gqlQuery: string,
    preferences?: Partial<LayoutPreferencesInput>,
    productExclusions?: ProductExclusion[],
    experiments?: ExperimentsInput[],
    throttleOverrides?: ThrottleOverrides,
    router?: RouterState,
  ) => Promise<MainMarketsQuery>;
  getSortableCardsDisplayRunnersUpdates: (
    urns: string[],
    gqlQuery: string,
    requestForExc: boolean,
    requestForSbk: boolean,
    preferences?: Partial<LayoutPreferencesInput>,
    productExclusions?: ProductExclusion[],
    experiments?: ExperimentsInput[],
    throttleOverrides?: ThrottleOverrides,
    router?: RouterState,
  ) => Promise<BettingCardRunnersDisplayQuery>;
  getFilteredCoupon: (
    urn: string,
    gqlQuery: string,
    filteredCouponFilterBy?: FilteredCouponFilterBy,
    futureRacingFilterBy?: FutureRacingFilterBy,
    racesByTimeRangeFilterBy?: ByTimeRangeFilterBy,
    sortBy?: FilteredGroupSort,
    numberOfFilledCardsInCardGroup?: number,
    preferences?: Partial<LayoutPreferencesInput>,
    productExclusions?: ProductExclusion[],
    experiments?: ExperimentsInput[],
    throttleOverrides?: ThrottleOverrides,
    router?: RouterState,
  ) => Promise<FilteredCouponQuery>;
  getFilteredSelectableItemsCardGroup: (
    urn: string,
    gqlQuery: string,
    countryFilterBy?: SelectableItemsFilterOptions,
    preferences?: Partial<LayoutPreferencesInput>,
    productExclusions?: ProductExclusion[],
    experiments?: ExperimentsInput[],
    throttleOverrides?: ThrottleOverrides,
  ) => Promise<FilteredSelectableItemsQuery>;
  acceptImsPromotion: (
    urn: string,
    gqlQuery: string,
    amount?: number,
    throttleOverrides?: ThrottleOverrides,
  ) => Promise<AcceptPromotionMutation>;
  cancelImsPromotion: (
    urn: string,
    gqlQuery: string,
    promoInstanceCode: string,
    throttleOverrides?: ThrottleOverrides,
  ) => Promise<CancelPromotionMutation>;
  optinCppPromotion: (
    urn: string,
    gqlQuery: string,
    throttleOverrides?: ThrottleOverrides,
  ) => Promise<OptinCppPromoMutation>;
  placeObbBet: (
    gqlQuery: string,
    requestInput: PlaceBetRequestInput,
    throttleOverrides?: ThrottleOverrides,
  ) => Promise<PlaceObbBetMutation>;
  implyObbBets: (
    gqlQuery: string,
    implyBetsRequestInput: ImplyBetsRequestInput,
    throttleOverrides?: ThrottleOverrides,
  ) => Promise<ImplyObbBetsQuery>;
  getObbQuotes: (
    gqlQuery: string,
    quotesRequestInput: QuotesRequestInput,
    throttleOverrides?: ThrottleOverrides,
  ) => Promise<ObbQuotesQuery>;
  getObbEventParticipants: (
    gqlQuery: string,
    eventParticipantsRequestInput: EventParticipantsRequestInput,
    incidentTypeFilterInput: IncidentTypesFilterInput,
    throttleOverrides?: ThrottleOverrides,
  ) => Promise<ObbGetEventParticipantsQuery>;
  getObbSquadbetQuotes: (
    gqlQuery: string,
    squadBetQuotesRequestInput: SquadBetQuotesRequestInput,
    throttleOverrides?: ThrottleOverrides,
  ) => Promise<ObbSquadbetQuotesQuery>;
  setSingleChoicePreference: (
    urn: string,
    gqlMutation: string,
    value: string,
    throttleOverrides?: ThrottleOverrides,
  ) => Promise<SetSingleChoicePreferenceMutation>;
  setExchangeDefaultProductPreference: (
    urn: string,
    gqlMutation: string,
    value: ExchangeDefaultProduct,
    throttleOverrides?: ThrottleOverrides,
  ) => Promise<SetExchangeDefaultProductPreferenceMutation>;
  setConfirmCashoutPreference: (
    urn: string,
    gqlMutation: string,
    value: boolean,
    throttleOverrides?: ThrottleOverrides,
  ) => Promise<SetConfirmCashoutPreferenceMutation>;
  setDefaultProductPreference: (
    urn: string,
    gqlMutation: string,
    value: DefaultProduct,
    throttleOverrides?: ThrottleOverrides,
  ) => Promise<SetDefaultProductPreferenceMutation>;
  setLastViewedProductPreference: (
    urn: string,
    gqlMutation: string,
    value: LastViewedProduct,
    throttleOverrides?: ThrottleOverrides,
  ) => Promise<SetLastViewedProductPreferenceMutation>;
  setUserProductsPreference: (
    urn: string,
    gqlMutation: string,
    value: UserProducts[],
    throttleOverrides?: ThrottleOverrides,
  ) => Promise<SetUserProductsPreferenceMutation>;
  setFavouriteMarket: (
    gqlMutation: string,
    contentSectionURN: string,
    isFavourite: boolean,
    throttleOverrides?: ThrottleOverrides,
  ) => Promise<SetFavouriteMarketMutation>;
  getMarkets: (
    urns: string[],
    gqlQuery: string,
    preferences?: Partial<LayoutPreferencesInput>,
    throttleOverrides?: ThrottleOverrides,
    router?: RouterState,
  ) => Promise<MarketsQuery>;
  getVirtualMarkets: (
    urns: string[],
    gqlQuery: string,
    throttleOverrides?: ThrottleOverrides,
    router?: RouterState,
  ) => Promise<VirtualMarketsQuery>;
  getRaceRunners: (
    urns: string[],
    gqlQuery: string,
    throttleOverrides?: ThrottleOverrides,
  ) => Promise<RaceRunnersQuery>;
  getWebMessages: (gqlQuery: string, throttleOverrides?: ThrottleOverrides) => Promise<GetWebMessagesQuery>;
  readWebMessage: (
    customerMessageId: number,
    gqlQuery: string,
    throttleOverrides?: ThrottleOverrides,
  ) => Promise<ReadWebMessageMutation>;
  getAppContext: (
    gqlQuery: string,
    token?: string | null,
    throttleOverrides?: ThrottleOverrides,
  ) => Promise<AppContextQuery>;
  getAppVersion: (gqlQuery: string, throttleOverrides?: ThrottleOverrides) => Promise<AppVersionQuery>;
} {
  let customHeaders: Headers;

  if (options.overrideCustomHeaders !== undefined) {
    customHeaders = options.overrideCustomHeaders;
  }

  const fabricGQLClient = fabricGQL(endpoint, options);

  /**
   * @param {URN} urn URN identifier
   * @param {number} numberOfFilledCardsInCardGroup Number of completely filled cardgroup cards requested
   * @param {number} numberOfFilledCardsInView Number of completely filled view cards requested
   * @param {boolean} withBottomBar Boolean to request bottom bar
   * @param {boolean} withLeftSidebar Boolean to request left sidebar
   * @param {string} currentUrl Document location
   *
   * @returns Modules that compose the page and the data that they need
   */
  async function getLayout(
    urn: URN,
    gqlQuery: string,
    numberOfFilledCardsInCardGroup: number,
    numberOfFilledCardsInView: number,
    withBottomBar?: boolean,
    withLeftSidebar?: boolean,
    withRegulatoryData?: boolean,
    withPageInfo?: boolean,
    cursor?: string,
    preferences?: Partial<LayoutPreferencesInput>,
    productExclusions?: ProductExclusion[],
    currentUrl?: string,
    experiments?: ExperimentsInput[],
    throttleOverrides?: ThrottleOverrides,
    decorationsOnly?: boolean,
  ): Promise<ViewQuery> {
    const response = await fabricGQLClient.request({
      query: gqlQuery,
      variables: {
        urn,
        numberOfFilledCardsInCardGroup,
        numberOfFilledCardsInView,
        withBottomBar,
        withLeftSidebar,
        withRegulatoryData,
        withPageInfo,
        cursor,
        preferences,
        productExclusions,
        experiments,
        ...(throttleOverrides || {}),
        decorationsOnly,
      },
      currentUrl,
      headers: customHeaders,
    });

    return response.data;
  }

  async function getSearchResults(
    query: string,
    gqlQuery: string,
    preferences?: Partial<LayoutPreferencesInput>,
    productExclusions?: ProductExclusion[],
    experiments?: ExperimentsInput[],
    throttleOverrides?: ThrottleOverrides,
  ): Promise<SearchViewQuery> {
    const response = await fabricGQLClient.request({
      query: gqlQuery,
      variables: {
        query,
        preferences,
        productExclusions,
        experiments,
        ...(throttleOverrides || {}),
      },
      headers: customHeaders,
    });

    return response.data;
  }

  async function getGamingSearchResults(
    query: string,
    gqlQuery: string,
    first: number,
    after?: string,
  ): Promise<GamingSearchQuery> {
    const response = await fabricGQLClient.request({
      query: gqlQuery,
      variables: {
        query,
        first,
        after,
      },
      headers: customHeaders,
    });

    return response.data;
  }

  async function getCards(
    urns: string[],
    gqlQuery: string,
    numberOfFilledCardsInCardGroup?: number,
    preferences?: Partial<LayoutPreferencesInput>,
    productExclusions?: ProductExclusion[],
    experiments?: ExperimentsInput[],
    throttleOverrides?: ThrottleOverrides,
    router?: RouterState,
    first?: number,
    cursor?: string,
  ): Promise<CardQuery> {
    const response = await fabricGQLClient.request({
      query: gqlQuery,
      variables: {
        urn: urns,
        numberOfFilledCardsInCardGroup,
        preferences,
        productExclusions,
        experiments,
        ...(throttleOverrides || {}),
        first,
        cursor,
      },
      headers: customHeaders,
      router,
    });

    return response.data;
  }

  async function getFullCard(
    urn: string,
    gqlQuery: string,
    numberOfFilledCardsInCardGroup?: number,
    preferences?: Partial<LayoutPreferencesInput>,
    productExclusions?: ProductExclusion[],
    experiments?: ExperimentsInput[],
    throttleOverrides?: ThrottleOverrides,
    router?: RouterState,
  ): Promise<FullCardQuery> {
    const response = await fabricGQLClient.request({
      query: gqlQuery,
      variables: {
        urn: [urn],
        numberOfFilledCardsInCardGroup,
        preferences,
        productExclusions,
        experiments,
        ...(throttleOverrides || {}),
      },
      headers: customHeaders,
      router,
    });

    return response.data;
  }

  async function getFilteredSelectableItemsCardGroup(
    urn: string,
    gqlQuery: string,
    countryFilterBy?: SelectableItemsFilterOptions,
    preferences?: Partial<LayoutPreferencesInput>,
    productExclusions?: ProductExclusion[],
    experiments?: ExperimentsInput[],
    throttleOverrides?: ThrottleOverrides,
  ): Promise<FilteredSelectableItemsQuery> {
    const response = await fabricGQLClient.request({
      query: gqlQuery,
      variables: {
        urn,
        filterBy: countryFilterBy,
        preferences,
        productExclusions,
        experiments,
        ...(throttleOverrides || {}),
      },
      headers: customHeaders,
    });

    return response.data;
  }

  async function getSortableCardsDisplayRunnersUpdates(
    urns: string[],
    gqlQuery: string,
    requestForExc: boolean,
    requestForSbk: boolean,
    preferences?: Partial<LayoutPreferencesInput>,
    productExclusions?: ProductExclusion[],
    experiments?: ExperimentsInput[],
    throttleOverrides?: ThrottleOverrides,
    router?: RouterState,
  ): Promise<BettingCardRunnersDisplayQuery> {
    const response = await fabricGQLClient.request({
      query: gqlQuery,
      variables: {
        urn: urns,
        requestForExc,
        requestForSbk,
        preferences,
        productExclusions,
        experiments,
        ...(throttleOverrides || {}),
      },
      headers: customHeaders,
      router,
    });

    return response.data;
  }

  async function getMainMarketsUpdates(
    urns: string[],
    withFixtureUpdates: boolean,
    gqlQuery: string,
    preferences?: Partial<LayoutPreferencesInput>,
    productExclusions?: ProductExclusion[],
    experiments?: ExperimentsInput[],
    throttleOverrides?: ThrottleOverrides,
    router?: RouterState,
  ): Promise<MainMarketsQuery> {
    const response = await fabricGQLClient.request({
      query: gqlQuery,
      variables: {
        urn: urns,
        withFixtureUpdates,
        preferences,
        productExclusions,
        experiments,
        ...(throttleOverrides || {}),
      },
      headers: customHeaders,
      router,
    });

    return response.data;
  }

  async function getFilteredCoupon(
    urn: string,
    gqlQuery: string,
    filteredCouponFilterBy?: FilteredCouponFilterBy,
    futureRacingFilterBy?: FutureRacingFilterBy,
    racesByTimeRangeFilterBy?: ByTimeRangeFilterBy,
    sortBy?: FilteredGroupSort,
    numberOfFilledCardsInCardGroup?: number,
    preferences?: Partial<LayoutPreferencesInput>,
    productExclusions?: ProductExclusion[],
    experiments?: ExperimentsInput[],
    throttleOverrides?: ThrottleOverrides,
    router?: RouterState,
  ): Promise<FilteredCouponQuery> {
    const response = await fabricGQLClient.request({
      query: gqlQuery,
      variables: {
        urn,
        filteredCouponFilterBy,
        futureRacingFilterBy,
        racesByTimeRangeFilterBy,
        sortBy,
        numberOfFilledCardsInCardGroup,
        preferences,
        productExclusions,
        experiments,
        ...(throttleOverrides || {}),
      },
      headers: customHeaders,
      router,
    });

    return response.data;
  }

  async function acceptImsPromotion(
    urn: string,
    gqlQuery: string,
    amount?: number,
    throttleOverrides?: ThrottleOverrides,
  ): Promise<AcceptPromotionMutation> {
    const response = await fabricGQLClient.request({
      query: gqlQuery,
      variables: {
        urn,
        amount,
        productExclusions: [],
        ...(throttleOverrides || {}),
      },
    });
    return response.data;
  }

  async function cancelImsPromotion(
    urn: string,
    gqlQuery: string,
    bonusInstanceCode: string,
    throttleOverrides?: ThrottleOverrides,
  ): Promise<CancelPromotionMutation> {
    const response = await fabricGQLClient.request({
      query: gqlQuery,
      variables: {
        urn,
        bonusInstanceCode,
        productExclusions: [],
        ...(throttleOverrides || {}),
      },
      headers: customHeaders,
    });
    return response.data;
  }

  async function optinCppPromotion(
    urn: string,
    gqlQuery: string,
    throttleOverrides?: ThrottleOverrides,
  ): Promise<OptinCppPromoMutation> {
    const response = await fabricGQLClient.request({
      query: gqlQuery,
      variables: {
        urn,
        productExclusions: [],
        ...(throttleOverrides || {}),
      },
    });
    return response.data;
  }

  async function placeObbBet(
    gqlQuery: string,
    requestInput: PlaceBetRequestInput,
    throttleOverrides?: ThrottleOverrides,
  ): Promise<PlaceObbBetMutation> {
    const response = await fabricGQLClient.request({
      query: gqlQuery,
      variables: {
        requestInput,
        productExclusions: [],
        ...(throttleOverrides || {}),
      },
    });
    return response.data;
  }

  async function implyObbBets(
    gqlQuery: string,
    implyBetsRequestInput: ImplyBetsRequestInput,
    throttleOverrides?: ThrottleOverrides,
  ): Promise<ImplyObbBetsQuery> {
    const response = await fabricGQLClient.request({
      query: gqlQuery,
      variables: {
        implyBetsRequestInput,
        productExclusions: [],
        ...(throttleOverrides || {}),
      },
    });

    return response.data;
  }

  async function getObbQuotes(
    gqlQuery: string,
    quotesRequestInput: QuotesRequestInput,
    throttleOverrides?: ThrottleOverrides,
  ): Promise<ObbQuotesQuery> {
    const response = await fabricGQLClient.request({
      query: gqlQuery,
      variables: {
        quotesRequestInput,
        ...(throttleOverrides || {}),
      },
      headers: customHeaders,
    });

    return response.data;
  }

  async function getObbEventParticipants(
    gqlQuery: string,
    eventParticipantsRequestInput: EventParticipantsRequestInput,
    incidentTypeFiltersInput: IncidentTypesFilterInput,
    throttleOverrides?: ThrottleOverrides,
  ): Promise<ObbGetEventParticipantsQuery> {
    const response = await fabricGQLClient.request({
      query: gqlQuery,
      variables: {
        eventParticipantsRequestInput,
        incidentTypeFiltersInput,
        ...(throttleOverrides || {}),
      },
      headers: customHeaders,
    });

    return response.data;
  }

  async function getObbSquadbetQuotes(
    gqlQuery: string,
    squadBetQuotesRequestInput: SquadBetQuotesRequestInput,
    throttleOverrides?: ThrottleOverrides,
  ): Promise<ObbSquadbetQuotesQuery> {
    const response = await fabricGQLClient.request({
      query: gqlQuery,
      variables: {
        squadBetQuotesRequestInput,
        ...(throttleOverrides || {}),
      },
      headers: customHeaders,
    });

    return response.data;
  }

  async function setSingleChoicePreference(
    urn: string,
    gqlMutation: string,
    value: string,
    throttleOverrides?: ThrottleOverrides,
  ): Promise<SetSingleChoicePreferenceMutation> {
    const response = await fabricGQLClient.request({
      query: gqlMutation,
      variables: {
        urn,
        value,
        productExclusions: [],
        ...(throttleOverrides || {}),
      },
      headers: customHeaders,
    });

    return response.data;
  }

  async function setExchangeDefaultProductPreference(
    urn: string,
    gqlMutation: string,
    value: ExchangeDefaultProduct,
    throttleOverrides?: ThrottleOverrides,
  ): Promise<SetExchangeDefaultProductPreferenceMutation> {
    const response = await fabricGQLClient.request({
      query: gqlMutation,
      variables: {
        urn,
        value,
        productExclusions: [],
        ...(throttleOverrides || {}),
      },
      headers: customHeaders,
    });

    return response.data;
  }

  async function setConfirmCashoutPreference(
    urn: string,
    gqlMutation: string,
    value: boolean,
    throttleOverrides?: ThrottleOverrides,
  ): Promise<SetConfirmCashoutPreferenceMutation> {
    const response = await fabricGQLClient.request({
      query: gqlMutation,
      variables: {
        urn,
        value,
        ...(throttleOverrides || {}),
      },
      headers: customHeaders,
    });

    return response.data;
  }

  async function setDefaultProductPreference(
    urn: string,
    gqlMutation: string,
    value: DefaultProduct,
    throttleOverrides?: ThrottleOverrides,
  ): Promise<SetDefaultProductPreferenceMutation> {
    const response = await fabricGQLClient.request({
      query: gqlMutation,
      variables: {
        urn,
        value,
        productExclusions: [],
        ...(throttleOverrides || {}),
      },
      headers: customHeaders,
    });

    return response.data;
  }

  async function setLastViewedProductPreference(
    urn: string,
    gqlMutation: string,
    value: LastViewedProduct,
    throttleOverrides?: ThrottleOverrides,
  ): Promise<SetLastViewedProductPreferenceMutation> {
    const response = await fabricGQLClient.request({
      query: gqlMutation,
      variables: {
        urn,
        value,
        productExclusions: [],
        ...(throttleOverrides || {}),
      },
      headers: customHeaders,
    });

    return response.data;
  }

  async function setUserProductsPreference(
    urn: string,
    gqlMutation: string,
    value: Array<UserProducts>,
    throttleOverrides?: ThrottleOverrides,
  ): Promise<SetUserProductsPreferenceMutation> {
    const response = await fabricGQLClient.request({
      query: gqlMutation,
      variables: {
        urn,
        value,
        productExclusions: [],
        ...(throttleOverrides || {}),
      },
      headers: customHeaders,
    });

    return response.data;
  }

  async function setFavouriteMarket(
    gqlMutation: string,
    contentSectionURN: string,
    isFavourite: boolean,
    throttleOverrides?: ThrottleOverrides,
  ): Promise<SetFavouriteMarketMutation> {
    const response = await fabricGQLClient.request({
      query: gqlMutation,
      variables: {
        contentSectionURN,
        isFavourite,
        ...(throttleOverrides || {}),
      },
      headers: customHeaders,
    });

    return response.data;
  }

  async function getVirtualMarkets(
    urns: string[],
    gqlQuery: string,
    throttleOverrides?: ThrottleOverrides,
    router?: RouterState,
  ): Promise<VirtualMarketsQuery> {
    const response = await fabricGQLClient.request({
      query: gqlQuery,
      variables: { URNs: urns, productExclusions: [], ...(throttleOverrides || {}) },
      headers: customHeaders,
      router,
    });
    return response.data;
  }

  async function getMarkets(
    urns: string[],
    gqlQuery: string,
    preferences?: Partial<LayoutPreferencesInput>,
    throttleOverrides?: ThrottleOverrides,
    router?: RouterState,
  ): Promise<MarketsQuery> {
    const response = await fabricGQLClient.request({
      query: gqlQuery,
      variables: { URNs: urns, productExclusions: [], preferences, ...(throttleOverrides || {}) },
      headers: customHeaders,
      router,
    });
    return response.data;
  }

  async function getRaceRunners(
    urns: string[],
    gqlQuery: string,
    throttleOverrides?: ThrottleOverrides,
  ): Promise<RaceRunnersQuery> {
    const response = await fabricGQLClient.request({
      query: gqlQuery,
      variables: { URNs: urns, productExclusions: [], ...(throttleOverrides || {}) },
      headers: customHeaders,
    });
    return response.data;
  }

  async function getWebMessages(gqlQuery: string, throttleOverrides?: ThrottleOverrides): Promise<GetWebMessagesQuery> {
    const response = await fabricGQLClient.request({
      query: gqlQuery,
      headers: {
        Referer: overrideReferer,
        ...customHeaders,
      },
      variables: { productExclusions: [], ...(throttleOverrides || {}) },
    });
    return response.data;
  }

  async function readWebMessage(
    customerMessageId: number,
    gqlQuery: string,
    throttleOverrides?: ThrottleOverrides,
  ): Promise<ReadWebMessageMutation> {
    const response = await fabricGQLClient.request({
      query: gqlQuery,
      variables: {
        customerMessageId,
        productExclusions: [],
        ...(throttleOverrides || {}),
      },
      headers: customHeaders,
    });
    return response.data;
  }

  async function getAppContext(
    gqlQuery: string,
    token?: string | null,
    throttleOverrides?: ThrottleOverrides,
  ): Promise<AppContextQuery> {
    let headers: Headers = {
      ...customHeaders,
    };

    /*
     * https://gitlab.app.betfair/tbd/mobile-site/-/merge_requests/7832
     * This logic is done so the first request can have the correct token
     * set by CET. Otherwise the cookie has an incorrect domain without the jurisdiction.
     * Showing the user always logged out in consequent requests
     */
    if (token) {
      headers = {
        ...headers,
        "X-Authentication": token,
      };
    }

    const response = await fabricGQLClient.request({
      query: gqlQuery,
      headers,
      variables: {
        ...(throttleOverrides || {}),
      },
    });

    return response.data;
  }

  async function getAppVersion(gqlQuery: string, throttleOverrides?: ThrottleOverrides): Promise<AppVersionQuery> {
    const headers: Headers = {
      ...customHeaders,
    };

    const response = await fabricGQLClient.request({
      query: gqlQuery,
      headers,
      variables: {
        ...(throttleOverrides || {}),
      },
    });

    return response.data;
  }

  return {
    getLayout,
    getSearchResults,
    getGamingSearchResults,
    getCards,
    getFullCard,
    getMainMarketsUpdates,
    getSortableCardsDisplayRunnersUpdates,
    getFilteredCoupon,
    getFilteredSelectableItemsCardGroup,
    getMarkets,
    getVirtualMarkets,
    getRaceRunners,
    acceptImsPromotion,
    cancelImsPromotion,
    optinCppPromotion,
    setSingleChoicePreference,
    setConfirmCashoutPreference,
    setExchangeDefaultProductPreference,
    setDefaultProductPreference,
    setLastViewedProductPreference,
    setUserProductsPreference,
    setFavouriteMarket,
    getWebMessages,
    readWebMessage,
    getAppContext,
    getAppVersion,
    placeObbBet,
    implyObbBets,
    getObbQuotes,
    getObbEventParticipants,
    getObbSquadbetQuotes,
  };
}

export default CatalogueClient;
