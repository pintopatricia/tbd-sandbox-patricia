import Catalogue from "../../clients/catalogue/catalogue-client";
import { FilteredGroupSort, RaceCountriesFilterOptions } from "../../clients/catalogue/catalogue-response-types";
import type {
  AcceptPromotionMutation,
  ByTimeRangeFilterBy,
  CancelPromotionMutation,
  EventParticipantsRequestInput,
  ExperimentsInput,
  FilteredCouponFilterBy,
  FutureRacingFilterBy,
  GamingSearchQuery,
  GetWebMessagesQuery,
  ImplyBetsRequestInput,
  ImplyObbBetsQuery,
  IncidentTypesFilterInput,
  OptinCppPromoMutation,
  PlaceBetRequestInput,
  PlaceObbBetMutation,
  QuotesRequestInput,
  ReadWebMessageMutation,
  SquadBetQuotesRequestInput,
} from "../../clients/catalogue/catalogue-response-types";
import layoutQuery from "../../clients/catalogue/view_query.graphql";
import searchQuery from "../../clients/catalogue/search_query.graphql";
import gamingSearchQuery from "../../clients/catalogue/gaming_search_query.graphql";
import cardsQuery from "../../clients/catalogue/card_query.graphql";
import fullCardsQuery from "../../clients/catalogue/full_card_query.graphql";
import singleChoicePreferenceMutation from "../../clients/catalogue/single_choice_preference_mutation.graphql";
import exchangeDefaultProductPreferenceMutation from "../../clients/catalogue/exchange_default_product_preference_mutation.graphql";
import defaultProductPreferenceMutation from "../../clients/catalogue/default_product_preference_mutation.graphql";
import confirmCashoutPreferenceMutation from "../../clients/catalogue/confirm_cashout_preference_mutation.graphql";
import lastViewedProductPreferenceMutation from "../../clients/catalogue/last_viewed_product_preference_mutation.graphql";
import userProductsPreferenceMutation from "../../clients/catalogue/user_products_preference_mutation.graphql";
import setFavouriteMarketMutation from "../../clients/catalogue/favourite_markets_mutation.graphql";
import bettingCardRunnersDisplayQuery from "../../clients/catalogue/betting_card_runners_display_query.graphql";
import mainMarketsQuery from "../../clients/catalogue/main_markets_query.graphql";
import filteredCouponQuery from "../../clients/catalogue/filtered_coupon_query.graphql";
import acceptPromotionQuery from "../../clients/catalogue/accept_promotion_mutation.graphql";
import cancelPromotionQuery from "../../clients/catalogue/cancel_promotion_mutation.graphql";
import optinCppPromotionQuery from "../../clients/catalogue/optin_cpp_promotion_mutation.graphql";
import placeObbBetQuery from "../../clients/catalogue/place_obb_bet.graphql";
import implyObbBetsQuery from "../../clients/catalogue/imply_obb_bet.graphql";
import getObbQuotesQuery from "../../clients/catalogue/obb_quotes_query.graphql";
import getObbEventParticipantsQuery from "../../clients/catalogue/obb_get_event_participants_query.graphql";
import getObbSquadbetQuotesQuery from "../../clients/catalogue/obb_squadbet_quotes_query.graphql";
import marketsQuery from "../../clients/catalogue/markets_query.graphql";
import virtualMarketsQuery from "../../clients/catalogue/virtual_markets_query.graphql";
import raceRunnersQuery from "../../clients/catalogue/race_runners_query.graphql";
import getWebMessagesQuery from "../../clients/catalogue/get_web_messages_query.graphql";
import readWebMessageMutation from "../../clients/catalogue/read_web_message_mutation.graphql";
import filteredSelectableItemsQuery from "../../clients/catalogue/filtered_selectable_items_query.graphql";
import {
  mapDefaultProductOptionToDefaultProduct,
  mapLastViewedProductOptionToLastViewedProduct,
  mapProductOptionsListToUserProductsList,
  mapStringToExchangeDefaultProduct,
  mapStringToUserProducts,
  updateUserProductsList,
} from "../../helpers/preferences";
import type {
  DefaultProductOption,
  HorsePerformance,
  LastViewedProductOption,
  ProductExclusion,
  ProductsOption,
  RouterState,
  SettingsPreference,
  ThrottleOverrides,
  UserPreferences,
} from "../../state";
import type { SelectableItemsFilterOptions } from "../../state/constants";
import type URN from "../../state/layout/URN";
import type { SearchResult } from "../../state/layout/views/browse-view/BrowseInterface.types";
import { createClientFactory } from "../client-factory";

import {
  buildCardsLayout,
  buildFilteredCouponLayout,
  buildFilteredSelectableItemsLayout,
  buildFullCardLayout,
  buildMainMarketsUpdatesPayload,
  buildRunnersDisplayUpdatesPayload,
} from "./cards-mapper";
import type { SetPreferenceResult, TransformedLayout } from "./catalogue-types";
import { buildMarketsEntities } from "./markets-mapper";
import { buildObbSquadBetLegResult } from "./obb-leg-mapper";
import {
  buildConfirmCashoutResult,
  buildDefaultProductResult,
  buildExchangeDefaultProductResult,
  buildLastViewedProductResult,
  buildSingleChoiceResult,
  buildUserProductsResult,
} from "./preference-mapper";
import { buildRaceRunnersPastPerformancesPayload } from "./race-runners-mapper";
import { buildSearchResult } from "./search-mapper";
import { convertUserPreferences } from "./user-preferences-converter";
import { buildViewResult } from "./view-mapper";
import { buildVirtualMarketsEntities } from "./virtual-markets-mapper";
import { buildFavouriteMarkets, type SetFavouriteMarketMutationResult } from "./favourite-markets-mapper";

export type CatalogueServiceLayout = TransformedLayout;

const catalogueClientFactory = createClientFactory(Catalogue);
/**
 * Retrieve layout.
 *
 * @param {URN} urn URN that identifies the catalogue item
 * @param numberOfFilledCardsInCardgroup Number of completely filled cardgroup cards requested
 * @param numberOfFilledCardsInView Number of completely filled view cards requested
 * @param withBottomBar
 * @param withLeftSidebar
 * @param withRegulatoryData
 * @param withPageInfo
 * @param cursor
 * @param userPreferences User preferences
 * @param productExclusions Product exclusions
 * @param currentUrl Current url from the router
 * @param experiments Experiment inputs
 * @param throttleOverrides Throttle overrides
 * @param decorationsOnly Flag to request only layout decorations
 * @returns Returns the layout structure for that catalogue item
 */
async function getLayout(
  urn: URN,
  numberOfFilledCardsInCardgroup: number,
  numberOfFilledCardsInView: number,
  withBottomBar?: boolean,
  withLeftSidebar?: boolean,
  withRegulatoryData?: boolean,
  withPageInfo?: boolean,
  cursor?: string,
  userPreferences?: UserPreferences,
  productExclusions?: ProductExclusion[],
  currentUrl?: string,
  experiments?: ExperimentsInput[],
  throttleOverrides?: ThrottleOverrides,
  decorationsOnly?: boolean,
): Promise<CatalogueServiceLayout> {
  const catalogue = catalogueClientFactory("CATALOGUE");
  const layoutPreferences = convertUserPreferences(userPreferences);
  const view = await catalogue.getLayout(
    urn,
    layoutQuery,
    numberOfFilledCardsInCardgroup,
    numberOfFilledCardsInView,
    withBottomBar,
    withLeftSidebar,
    withRegulatoryData,
    withPageInfo,
    cursor,
    layoutPreferences,
    productExclusions,
    currentUrl,
    experiments,
    throttleOverrides,
    decorationsOnly,
  );

  return buildViewResult(view);
}

/**
 * Retrieve search results.
 *
 * @param {string} query Query used to get search results
 * @param userPreferences User preferences
 * @param productExclusions Product exclusions
 * @returns Returns the search result
 */
async function getSearchResults(
  query: string,
  userPreferences?: UserPreferences,
  productExclusions?: ProductExclusion[],
  experiments?: ExperimentsInput[],
  throttleOverrides?: ThrottleOverrides,
): Promise<SearchResult> {
  const catalogue = catalogueClientFactory("CATALOGUE");
  const searchResults = await catalogue.getSearchResults(
    query,
    searchQuery,
    convertUserPreferences(userPreferences),
    productExclusions,
    experiments,
    throttleOverrides,
  );

  return buildSearchResult(searchResults);
}

/**
 * Retrieve gaming search results.
 *
 * @param {string} query Query used to get gaming search results
 * @param first Number used to query 'first' results
 * @returns Returns the gaming search result
 */
async function getGamingSearchResults(query: string, first: number, after?: string): Promise<GamingSearchQuery> {
  const catalogue = catalogueClientFactory("CATALOGUE");
  const gamingSearchResults = await catalogue.getGamingSearchResults(query, gamingSearchQuery, first, after);

  return gamingSearchResults;
}

/**
 * Retrieve cards by urns.
 *
 * @param {string[]} urns Urns to fetch
 * @param numberOfFilledCardsInCardGroup Number of completely filled cardgroup cards requested
 * @param userPreferences User preferences
 * @param productExclusions Product exclusions
 * @returns Returns the transformed layout filled with the new cards
 */
async function getCards(
  urns: string[],
  numberOfFilledCardsInCardGroup?: number,
  userPreferences?: UserPreferences,
  productExclusions?: ProductExclusion[],
  experiments?: ExperimentsInput[],
  throttleOverrides?: ThrottleOverrides,
  router?: RouterState,
  first?: number,
  cursor?: string,
): Promise<CatalogueServiceLayout> {
  const catalogue = catalogueClientFactory("CATALOGUE");

  const cards = await catalogue.getCards(
    urns,
    cardsQuery,
    numberOfFilledCardsInCardGroup,
    convertUserPreferences(userPreferences),
    productExclusions,
    experiments,
    throttleOverrides,
    router,
    first,
    cursor,
  );

  return buildCardsLayout(cards);
}

/**
 * Retrieve a full card by urn.
 *
 * @param {string} urn Urn to fetch
 * @param userPreferences User preferences
 * @param productExclusions Product exclusions
 * @returns Returns the transformed layout filled with the new cards
 */
async function getFullCard(
  urn: string,
  userPreferences?: UserPreferences,
  productExclusions?: ProductExclusion[],
  experiments?: ExperimentsInput[],
  throttleOverrides?: ThrottleOverrides,
  router?: RouterState,
): Promise<CatalogueServiceLayout> {
  const catalogue = catalogueClientFactory("CATALOGUE");
  const cards = await catalogue.getFullCard(
    urn,
    fullCardsQuery,
    undefined,
    convertUserPreferences(userPreferences),
    productExclusions,
    experiments,
    throttleOverrides,
    router,
  );

  return buildFullCardLayout(cards);
}

/**
 * Retrieve cards with runner lists
 *
 * @param {URN} urns URNs that identifies the catalogue items
 * @param requestForExc Flag to request exchange markets
 * @param requestForSbk Flag to request sportsbook markets
 * @param userPreferences User preferences
 * @param productExclusions Product exclusions
 * @returns Returns the transformed layout filled with the new cards
 */
async function getSortableCardsDisplayRunnersUpdates(
  urns: URN[],
  requestForExc: boolean,
  requestForSbk: boolean,
  userPreferences?: UserPreferences,
  productExclusions?: ProductExclusion[],
  experiments?: ExperimentsInput[],
  throttleOverrides?: ThrottleOverrides,
  router?: RouterState,
): Promise<TransformedLayout> {
  const catalogue = catalogueClientFactory("CATALOGUE");

  const cards = await catalogue.getSortableCardsDisplayRunnersUpdates(
    urns,
    bettingCardRunnersDisplayQuery,
    requestForExc,
    requestForSbk,
    convertUserPreferences(userPreferences),
    productExclusions,
    experiments,
    throttleOverrides,
    router,
  );

  return buildRunnersDisplayUpdatesPayload(cards);
}

/**
 * Retrieve cards with updated main markets
 *
 * @param {URN} urns URNs that identifies the catalogue items
 * @returns Returns the transformed layout filled with the new main markets
 */
async function getMainMarketsUpdates(
  urns: URN[],
  withFixtureUpdates: boolean,
  userPreferences?: UserPreferences,
  productExclusions?: ProductExclusion[],
  experiments?: ExperimentsInput[],
  throttleOverrides?: ThrottleOverrides,
  router?: RouterState,
): Promise<TransformedLayout> {
  const catalogue = catalogueClientFactory("CATALOGUE");
  const cards = await catalogue.getMainMarketsUpdates(
    urns,
    withFixtureUpdates,
    mainMarketsQuery,
    convertUserPreferences(userPreferences),
    productExclusions,
    experiments,
    throttleOverrides,
    router,
  );
  return buildMainMarketsUpdatesPayload(cards);
}

/**
 * Retrieve a coupon aplying the provided filters
 *
 * @param urn The coupon URN
 * @param filterBy The filter options
 * @param sortBy The sort option
 * @param numberOfFilledCardsInCardgroup Number of completely filled cardgroup cards requested
 * @param userPreferences User preferences
 * @param productExclusions Product exclusions
 * @returns Returns the layout structure for that catalogue item
 */
async function getFilteredCoupon(
  urn: string,
  filterBy?: {
    dateRange?: URN;
    competitions?: URN[];
    marketType: URN | null;
    months?: URN[];
    countries?: URN[];
  },
  sortBy?: FilteredGroupSort,
  numberOfFilledCardsInCardGroup?: number,
  userPreferences?: UserPreferences,
  productExclusions?: ProductExclusion[],
  experiments?: ExperimentsInput[],
  throttleOverrides?: ThrottleOverrides,
  router?: RouterState,
): Promise<CatalogueServiceLayout> {
  const catalogue = catalogueClientFactory("CATALOGUE");

  const filteredCouponFilterBy: FilteredCouponFilterBy = {
    dateRange: filterBy?.dateRange ?? null,
    competitions: filterBy?.competitions ?? null,
    marketType: filterBy?.marketType ?? null,
  };

  const futureRacingFilterBy: FutureRacingFilterBy = {
    months: filterBy?.months ? filterBy?.months : null,
    countries: filterBy?.countries ? filterBy?.countries : null,
  };

  const racesByTimeRangeFilterBy: ByTimeRangeFilterBy = {
    countries: filterBy?.countries ? filterBy?.countries : null,
  };

  const sort = sortBy && (sortBy === FilteredGroupSort.Rank ? FilteredGroupSort.Rank : FilteredGroupSort.Time);

  const cards = await catalogue.getFilteredCoupon(
    urn,
    filteredCouponQuery,
    filteredCouponFilterBy,
    futureRacingFilterBy,
    racesByTimeRangeFilterBy,
    sort,
    numberOfFilledCardsInCardGroup,
    convertUserPreferences(userPreferences),
    productExclusions,
    experiments,
    throttleOverrides,
    router,
  );

  return buildFilteredCouponLayout(cards);
}

/**
 * Retrieve sportsbook markets
 *
 * @param {URN} urns URNs that identifies the SBK markets
 * @returns Returns sportsbook markets
 */
async function getMarkets(
  urns: URN[],
  userPreferences?: UserPreferences,
  throttleOverrides?: ThrottleOverrides,
  router?: RouterState,
): Promise<CatalogueServiceLayout> {
  const catalogue = catalogueClientFactory("CATALOGUE");
  const response = await catalogue.getMarkets(
    urns,
    marketsQuery,
    convertUserPreferences(userPreferences),
    throttleOverrides,
    router,
  );

  return buildMarketsEntities(response.Markets);
}

/**
 * Retrieve sportsbook virtual markets
 *
 * @param {URN} urns URNs that identifies the SBK virtual markets
 * @returns Returns sportsbook virtual markets
 */
async function getVirtualMarkets(
  urns: URN[],
  throttleOverrides?: ThrottleOverrides,
  router?: RouterState,
): Promise<CatalogueServiceLayout> {
  const catalogue = catalogueClientFactory("CATALOGUE");
  const response = await catalogue.getVirtualMarkets(urns, virtualMarketsQuery, throttleOverrides, router);

  return buildVirtualMarketsEntities(response.VirtualMarkets);
}

/**
 * Retrieve race runners past performances
 *
 * @param {URN} urns URNs that identify the race runners
 * @returns Returns race runners past performances
 */
async function getRaceRunnersPastPerformances(
  urns: URN[],
  throttleOverrides?: ThrottleOverrides,
): Promise<{ [urn: string]: HorsePerformance[] } | undefined> {
  const catalogue = catalogueClientFactory("CATALOGUE");
  const response = await catalogue.getRaceRunners(urns, raceRunnersQuery, throttleOverrides);

  return buildRaceRunnersPastPerformancesPayload(response.RaceRunners);
}

/**
 * Trigger an ims promotion through a mutation
 *
 * @param {string} urn The promotion urn
 * @param {string} amount The buyIn value
 * @returns Returns the mutation result object
 */
async function acceptImsPromotion(
  urn: string,
  amount?: number,
  throttleOverrides?: ThrottleOverrides,
): Promise<AcceptPromotionMutation> {
  const catalogue = catalogueClientFactory("CATALOGUE");
  const response = await catalogue.acceptImsPromotion(urn, acceptPromotionQuery, amount, throttleOverrides);
  return response;
}

/**
 * Cancel an ims promotion through a mutation
 *
 * @param {string} urn The promotion urn
 * @param {string} promoInstanceCode The unique identifier of the promotion
 * @returns Returns the mutation result object
 */
async function cancelImsPromotion(
  urn: string,
  promoInstanceCode: string,
  throttleOverrides?: ThrottleOverrides,
): Promise<CancelPromotionMutation> {
  const catalogue = catalogueClientFactory("CATALOGUE");
  const response = await catalogue.cancelImsPromotion(urn, cancelPromotionQuery, promoInstanceCode, throttleOverrides);
  return response;
}

/**
 * OptsIn a loyalty promotion through a mutation
 *
 * @param {string} urn The promotion urn
 * @returns Returns the mutation result object
 */
async function optinCppPromotion(urn: string, throttleOverrides?: ThrottleOverrides): Promise<OptinCppPromoMutation> {
  const catalogue = catalogueClientFactory("CATALOGUE");
  const response = await catalogue.optinCppPromotion(urn, optinCppPromotionQuery, throttleOverrides);
  return response;
}

/**
 *
 *
 * @param {requestInput} requestInput The requestInput object for obb place bet
 * @returns Returns the mutation result object
 */
async function placeObbBet(
  requestInput: PlaceBetRequestInput,
  throttleOverrides?: ThrottleOverrides,
): Promise<PlaceObbBetMutation> {
  const catalogue = catalogueClientFactory("CATALOGUE");
  const response = await catalogue.placeObbBet(placeObbBetQuery, requestInput, throttleOverrides);
  return response;
}

/**
 *
 * @param legsUrns the obb legs urns to get quotes for
 * @returns the obb legs quotes
 */

async function implyObbBets(
  implyBetsRequestInput: ImplyBetsRequestInput,
  throttleOverrides?: ThrottleOverrides,
): Promise<ImplyObbBetsQuery> {
  const catalogue = catalogueClientFactory("CATALOGUE");
  const response = await catalogue.implyObbBets(implyObbBetsQuery, implyBetsRequestInput, throttleOverrides);

  return response;
}

async function getObbQuotes(quotesRequestInput: QuotesRequestInput, throttleOverrides?: ThrottleOverrides) {
  const catalogue = catalogueClientFactory("CATALOGUE");
  const response = await catalogue.getObbQuotes(getObbQuotesQuery, quotesRequestInput, throttleOverrides);

  return response;
}

/**
 *
 * @param eventParticipantsRequestInput the event participants request input
 * @param incidentTypesFilterInput the incident types filter input
 * @returns the obb event participants
 */
async function getObbEventParticipants(
  eventParticipantsRequestInput: EventParticipantsRequestInput,
  incidentTypeFiltersInput: IncidentTypesFilterInput,
  throttleOverrides?: ThrottleOverrides,
) {
  const catalogue = catalogueClientFactory("CATALOGUE");
  const response = await catalogue.getObbEventParticipants(
    getObbEventParticipantsQuery,
    eventParticipantsRequestInput,
    incidentTypeFiltersInput,
    throttleOverrides,
  );

  return response;
}

async function getObbSquadbetQuotes(
  squadBetQuotesRequestInput: SquadBetQuotesRequestInput,
  throttleOverrides?: ThrottleOverrides,
) {
  const catalogue = catalogueClientFactory("CATALOGUE");
  const response = await catalogue.getObbSquadbetQuotes(
    getObbSquadbetQuotesQuery,
    squadBetQuotesRequestInput,
    throttleOverrides,
  );

  return buildObbSquadBetLegResult(response);
}

/**
 * Set single choice preference through a mutation
 *
 * @param {string} urn The single choice preference urn
 * @param {string} value The value to be set
 * @returns Returns the set mutation result
 */
async function setSingleChoicePreference(
  urn: string,
  value: string,
  throttleOverrides?: ThrottleOverrides,
): Promise<SetPreferenceResult> {
  const catalogue = catalogueClientFactory("CATALOGUE");
  const result = await catalogue.setSingleChoicePreference(
    urn,
    singleChoicePreferenceMutation,
    value,
    throttleOverrides,
  );
  return buildSingleChoiceResult(result);
}

/**
 * Set user products preference through a mutation
 *
 * @param {string} urn The user products preference urn
 * @param {string} value The value to be set
 * @param {SettingsPreference} userProductsSingleChoicePreference The current user products as single choice preference
 * @param {ProductsOption[]} userProductsPreferences The current user products as preferences
 * @returns Returns the preference mutation result
 */
async function setUserProductsPreference(
  urn: string,
  value: string,
  userProductsSingleChoicePreference: SettingsPreference,
  userProductsPreferences: ProductsOption[],
  throttleOverrides?: ThrottleOverrides,
): Promise<SetPreferenceResult> {
  const catalogue = catalogueClientFactory("CATALOGUE");
  const userProductSelected = mapStringToUserProducts(value);

  if (!userProductSelected) return undefined;

  const userProductsSelected = updateUserProductsList(
    mapProductOptionsListToUserProductsList(userProductsPreferences),
    userProductSelected,
  );

  const result = await catalogue.setUserProductsPreference(
    urn,
    userProductsPreferenceMutation,
    userProductsSelected,
    throttleOverrides,
  );

  return buildUserProductsResult(result, userProductsSingleChoicePreference);
}

/**
 * Set exchange default product preference through a mutation
 *
 * @param {string} urn The exchange default product preference urn
 * @param {string} value The value to be set
 * @param {SettingsPreference} exchangeDefaultProductSingleChoicePreference The current exchange default product as single choice preference
 * @param {SettingsPreference} userProductsSingleChoicePreference The current user products as single choice preference
 * @param {ProductsOption[]} userProductsPreferences The current user products as preferences
 * @returns Returns the preference mutation result
 */
async function setExchangeDefaultProductPreference(
  urn: string,
  value: string,
  exchangeDefaultProductSingleChoicePreference: SettingsPreference,
  throttleOverrides?: ThrottleOverrides,
): Promise<SetPreferenceResult> {
  const catalogue = catalogueClientFactory("CATALOGUE");
  const exchangeDefaultProductSelected = mapStringToExchangeDefaultProduct(value);
  if (!exchangeDefaultProductSelected) return undefined;

  const result = await catalogue.setExchangeDefaultProductPreference(
    urn,
    exchangeDefaultProductPreferenceMutation,
    exchangeDefaultProductSelected,
    throttleOverrides,
  );

  return buildExchangeDefaultProductResult(result, exchangeDefaultProductSingleChoicePreference);
}

/**
 * Set default product preference through a mutation
 *
 * @param {string} urn The default product preference urn
 * @param {DefaultProductOption} value The value to be set
 * @param {SettingsPreference} defaultProductSingleChoicePreference The current default product as single choice preference
 * @returns Returns the preference mutation result
 */
async function setDefaultProductPreference(
  urn: string,
  value: DefaultProductOption,
  defaultProductSingleChoicePreference: SettingsPreference,
  throttleOverrides?: ThrottleOverrides,
): Promise<SetPreferenceResult> {
  const defaultProductSelected = mapDefaultProductOptionToDefaultProduct(value);

  if (!defaultProductSelected) {
    return undefined;
  }

  const catalogue = catalogueClientFactory("CATALOGUE");
  const result = await catalogue.setDefaultProductPreference(
    urn,
    defaultProductPreferenceMutation,
    defaultProductSelected,
    throttleOverrides,
  );

  return buildDefaultProductResult(result, defaultProductSingleChoicePreference);
}

/**
 * Set confirm cashout preference through a mutation
 *
 * @param {string} urn The confirm cashout preference urn
 * @param {boolean} value The value to be set
 * @returns Returns the preference mutation result
 */
async function setConfirmCashoutPreference(
  urn: string,
  value: boolean,
  confirmCashoutSingleChoicePreference: SettingsPreference,
  throttleOverrides?: ThrottleOverrides,
): Promise<SetPreferenceResult> {
  const catalogue = catalogueClientFactory("CATALOGUE");
  const result = await catalogue.setConfirmCashoutPreference(
    urn,
    confirmCashoutPreferenceMutation,
    value,
    throttleOverrides,
  );

  return buildConfirmCashoutResult(result, confirmCashoutSingleChoicePreference);
}

/**
 * Set last viewed product preference through a mutation
 *
 * @param {string} urn The last viewed product preference urn
 * @param {LastViewedProductOption} value The value to be set
 * @returns Returns the preference mutation result
 */
async function setLastViewedProductPreference(
  urn: string,
  value: LastViewedProductOption,
  throttleOverrides?: ThrottleOverrides,
): Promise<LastViewedProductOption | undefined> {
  const lastViewedProductSelected = mapLastViewedProductOptionToLastViewedProduct(value);

  if (!lastViewedProductSelected) {
    return undefined;
  }

  const catalogue = catalogueClientFactory("CATALOGUE");
  const result = await catalogue.setLastViewedProductPreference(
    urn,
    lastViewedProductPreferenceMutation,
    lastViewedProductSelected,
    throttleOverrides,
  );

  return buildLastViewedProductResult(result);
}

/**
 * Toggle a ContentSection isFavourite value
 *
 * @param {string} contentSectionURN The URN of the content section
 * @param {boolean} isFavourite True if the content section was favourited
 * @returns Returns the set favourite market mutation result
 */
async function setFavouriteMarket(
  contentSectionURN: string,
  isFavourite: boolean,
  throttleOverrides?: ThrottleOverrides,
): Promise<SetFavouriteMarketMutationResult> {
  const catalogue = catalogueClientFactory("CATALOGUE");
  const result = await catalogue.setFavouriteMarket(
    setFavouriteMarketMutation,
    contentSectionURN,
    isFavourite,
    throttleOverrides,
  );

  return buildFavouriteMarkets(result);
}

/**
 * Retrieve web messages
 *
 */
async function getWebMessages(throttleOverrides?: ThrottleOverrides): Promise<GetWebMessagesQuery> {
  const catalogue = catalogueClientFactory("CATALOGUE");
  const result = await catalogue.getWebMessages(getWebMessagesQuery, throttleOverrides);

  return result;
}

/**
 * Read a web message through a mutation
 *
 * @param {number} customerMessageId The message id to be read
 * @returns Returns the readMessage mutation result
 */
async function readWebMessage(
  customerMessageId: number,
  throttleOverrides?: ThrottleOverrides,
): Promise<ReadWebMessageMutation> {
  const catalogue = catalogueClientFactory("CATALOGUE");
  const result = await catalogue.readWebMessage(customerMessageId, readWebMessageMutation, throttleOverrides);

  return result;
}

/**
 * Retrieve selectable items filtered by country
 *
 * @param urn The coupon URN
 * @param filterBy The country to filter by
 * @param userPreferences User preferences
 * @param productExclusions Product exclusions
 * @returns Returns the layout structure for that catalogue item
 */
async function getFilteredSelectableItems(
  urn: string,
  filterBy: SelectableItemsFilterOptions,
  userPreferences?: UserPreferences,
  productExclusions?: ProductExclusion[],
  experiments?: ExperimentsInput[],
  throttleOverrides?: ThrottleOverrides,
): Promise<CatalogueServiceLayout> {
  const catalogue = catalogueClientFactory("CATALOGUE");

  const countryFilterBy = {
    countries: RaceCountriesFilterOptions[filterBy],
  };

  const cards = await catalogue.getFilteredSelectableItemsCardGroup(
    urn,
    filteredSelectableItemsQuery,
    countryFilterBy,
    convertUserPreferences(userPreferences),
    productExclusions,
    experiments,
    throttleOverrides,
  );

  return buildFilteredSelectableItemsLayout(cards);
}

/**
 * Layout Service interface
 */
export default {
  getLayout,
  getMarkets,
  getFilteredCoupon,
  getVirtualMarkets,
  getCards,
  getSearchResults,
  getGamingSearchResults,
  getFullCard,
  getMainMarketsUpdates,
  getSortableCardsDisplayRunnersUpdates,
  getRaceRunnersPastPerformances,
  setSingleChoicePreference,
  cancelImsPromotion,
  acceptImsPromotion,
  optinCppPromotion,
  setUserProductsPreference,
  setExchangeDefaultProductPreference,
  setDefaultProductPreference,
  setConfirmCashoutPreference,
  setLastViewedProductPreference,
  setFavouriteMarket,
  getWebMessages,
  readWebMessage,
  getFilteredSelectableItems,
  placeObbBet,
  implyObbBets,
  getObbQuotes,
  getObbEventParticipants,
  getObbSquadbetQuotes,
};
