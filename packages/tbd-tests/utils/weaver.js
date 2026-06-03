const url = require("url");
const { extractEndpoints } = require("./extractEndpoints");

const filterAvailableSportsbookBets = (bets) =>
  bets.filter(({ quoteResult }) => quoteResult.quoteStatus === "AVAILABLE");
const filterAvailableExchangeBets = (bets) => bets.filter(({ quote }) => quote.status === "AVAILABLE");

/**
 * Build url.
 *
 * @param {Object} ReqParams Object with host, port and path.
 * @param {Object} ReqParams.hostname hostname. Example: 'mgasbpp.drk.internal'.
 * @param {Object} ReqParams.pathname pathname. Example: '/www/sports/navigation/facet/v1.0/search'.
 * @param {Object} ReqParams.port port. Example: 80.
 * @param {Object} ReqParams.protocol protocol. Example: 'http'.
 * @returns {String} Returns an URL string.
 *                   Example: http://uk-api.app.betfair/www/sports/navigation/facet/v1.0/search
 */
function buildURL({ hostname, port, pathname, protocol }) {
  return url.format({
    hostname,
    port,
    pathname,
    protocol,
  });
}

/**
 * Returns an object with an interface to execute requests to facet.
 * @param {String} xApplication Valid X-Application header value.
 * @param {Object} facetedSearch Facet facetedSearch url options (hostname, pathname, port and protocol).
 *
 * @returns {Object} Returns an object with an API to request data = require(facetedSearch.
 */
function createFacetClient(xApplication, facetedSearch) {
  return {
    async facetedSearch(filter, options) {
      const body = { filter, ...options };

      const response = await fetch(buildURL(facetedSearch), {
        method: "POST",
        headers: {
          "X-Application": xApplication,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      return response.json();
    },
  };
}

function createValidateMarketsEligibilityClient(xApplication, cashoutQuotesURLOptions) {
  return {
    async validateMarketsEligibility(marketIds) {
      const endpoint = new URL(buildURL(cashoutQuotesURLOptions));
      endpoint.search = new URLSearchParams({ marketIds: marketIds.join(",") }).toString();

      const response = await fetch(url.toString(), {
        headers: {
          "X-Application": xApplication,
          "Content-Type": "application/json",
        },
      });
      return response.json();
    },
  };
}

function createGetEligibleMarketsClient(xApplication, eligibleMarketsURLOptions) {
  return {
    async getEligibleMarkets(ssoid) {
      const endpoint = new URL(buildURL(eligibleMarketsURLOptions));
      endpoint.search = new URLSearchParams({ currencyCode: "GBP" }).toString();

      const response = await fetch(url.toString(), {
        headers: {
          "X-Application": xApplication,
          "Content-Type": "application/json",
          Cookie: `ssoid=${ssoid}`,
        },
      });
      return response.json();
    },
  };
}

function createGetEligibleBetsClient(xApplication, eligibleBetsURLOptions) {
  return {
    async getEligibleBets(ssoid) {
      const response = await fetch(buildURL(eligibleBetsURLOptions), {
        headers: {
          "X-Application": xApplication,
          "Content-Type": "application/json",
          Cookie: `ssoid=${ssoid}`,
        },
      });
      return response.json();
    },
  };
}

function createCashoutBetClient(xApplication, cashoutBetsURLOptions) {
  return {
    async cashoutBet(betInfo, ssoid) {
      const response = await fetch(buildURL(cashoutBetsURLOptions), {
        method: "POST",
        headers: {
          "X-Application": xApplication,
          "Content-Type": "application/json",
          Cookie: `ssoid=${ssoid}`,
        },
        body: JSON.stringify({ ...betInfo }),
      });
      return response.json();
    },
    async cashout(betInfo, ssoid) {
      const endpoint = new URL(buildURL(cashoutBetsURLOptions));
      endpoint.search = new URLSearchParams({ ...betInfo }).toString();

      const response = await fetch(url.toString(), {
        headers: {
          "X-Application": xApplication,
          "Content-Type": "application/json",
          Cookie: `ssoid=${ssoid}`,
        },
      });
      return response.json();
    },
  };
}

/**
 * Wrapper for a weaver client.
 *
 * @class Weaver
 */
class Weaver {
  constructor() {
    this.endpoints = extractEndpoints();
    this.facetClient = createFacetClient(this.endpoints.X_APPLICATION, this.endpoints.FACETED_SEARCH_URL_OPTIONS);
    this.validateMarketsEligibilityClient = createValidateMarketsEligibilityClient(
      this.endpoints.X_APPLICATION,
      this.endpoints.FCQ_VALIDATE_MARKETS_ELIGIBILITY_URL_OPTIONS,
    );
    this.getEligibleBetsClient = createGetEligibleBetsClient(
      this.endpoints.X_APPLICATION,
      this.endpoints.FCQ_GET_ELIGIBLE_BETS_URL_OPTIONS,
    );
    this.getEligibleMarketsClient = createGetEligibleMarketsClient(
      this.endpoints.X_APPLICATION,
      this.endpoints.COS_GET_ELIGIBLE_MARKETS_URL_OPTIONS,
    );
    this.cashoutBetSportsbookClient = createCashoutBetClient(
      this.endpoints.X_APPLICATION,
      this.endpoints.SCO_SPORTSBOOK_CASHOUT_BET_URL_OPTIONS,
    );
    this.cashoutBetExchangeClient = createCashoutBetClient(
      this.endpoints.X_APPLICATION,
      this.endpoints.COS_TRANSACTIONAL_URL_OPTIONS,
    );
  }

  async fetchWeaverEvents({
    eventTypeId = 1,
    locale = "en_GB",
    productTypes = ["SPORTSBOOK"],
    inPlayOnly = false,
    // only events from tomorrow onwards
    marketStartingAfter = new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString(),
    selectBy = "FIRST_TO_START",
  } = {}) {
    const facetFilter = {
      eventTypeIds: [eventTypeId],
      selectBy,
      marketTypeCodes: ["MATCH_ODDS"],
      attachments: ["EVENT", "COMPETITION", "EVENT_TYPE"],
      maxResults: 30,
      marketStartingAfter,
      inPlayOnly,
      productTypes,
    };

    const {
      attachments: { eventTypes = {}, events = {}, competitions = {} },
      results,
    } = await this.facetClient.facetedSearch(facetFilter, { locale });

    if (results.length === 0) {
      throw new Error("No facet results for fetchSingleEventData");
    }

    return { results, eventTypes, events, competitions, eventTypeId };
  }

  async fetchWeaverRaces({
    eventTypeId = 7,
    locale = "en_GB",
    productTypes = ["SPORTSBOOK"],
    inPlayOnly = false,
    marketCountries = [],
    selectBy = "LAST_TO_START",
    // only races from one hour onwards
    marketStartingAfter = new Date(new Date().getTime() + 1 * 60 * 60 * 1000).toISOString(),
  } = {}) {
    const facetFilter = {
      eventTypeIds: [eventTypeId],
      selectBy,
      marketCountries,
      marketTypeCodes: ["WIN"],
      attachments: ["RACE", "MEETING", "EVENT_TYPE"],
      maxResults: 30,
      inPlayOnly,
      marketStartingAfter,
      productTypes,
    };

    const {
      attachments: { eventTypes = {}, races = {}, meetings = {} },
      results,
    } = await this.facetClient.facetedSearch(facetFilter, { locale });

    if (results.length === 0) {
      throw new Error("No facet results for fetchSingleEventData");
    }

    return { results, eventTypes, races, meetings, eventTypeId };
  }

  async fetchWeaverEventsWithMarkets({
    eventTypeId = 1,
    locale = "en_GB",
    productTypes = ["SPORTSBOOK"],
    inPlayOnly = false,
    marketStartingAfter = new Date().toISOString(),
    marketTypeCodes = "MATCH_ODDS",
  } = {}) {
    const facetFilter = {
      eventTypeIds: [eventTypeId],
      selectBy: "LAST_TO_START",
      marketTypeCodes: [marketTypeCodes],
      attachments: ["EVENT", "COMPETITION", "MARKET"],
      maxResults: 30,
      inPlayOnly,
      marketStartingAfter,
      productTypes,
    };

    const {
      attachments: { eventTypes = {}, events = {}, competitions = {} },
      results,
    } = await this.facetClient.facetedSearch(facetFilter, { locale });

    if (results.length === 0) {
      throw new Error("No facet results for fetchSingleEventData");
    }

    return { results, eventTypes, events, competitions, eventTypeId };
  }

  async takeCashout(betsForCashout, ssoid) {
    return betsForCashout.map(async ({ quoteResult }) => {
      const betInfo = {
        betId: quoteResult.betId,
        betDelay: quoteResult.betDelay,
        quote: quoteResult.quote,
        cashOutToken: quoteResult.cashOutToken,
      };

      await this.cashoutBetSportsbookClient.cashoutBet(betInfo, ssoid);
    });
  }

  async takeExchangeCashout(betsForCashout, ssoid) {
    return betsForCashout.map(async ({ quote }) => {
      const betInfo = {
        marketId: quote.marketId,
        currencyCode: "GBP",
        quoteValue: 0,
      };

      await this.cashoutBetExchangeClient.cashout(betInfo, ssoid);
    });
  }

  async takeExchangeOpenBets(ssoid) {
    const response = await this.getEligibleMarketsClient.getEligibleMarkets(ssoid);

    if (response.length !== 0) {
      const availableExchangeBetsForCashout = filterAvailableExchangeBets(response);

      await this.takeExchangeCashout(availableExchangeBetsForCashout, ssoid);
    }
  }

  async takeSBKOpenBets(ssoid) {
    const { inplayBets, comingUpBets } = await this.getEligibleBetsClient.getEligibleBets(ssoid);

    let availableSBKBetsForCashout = [];
    let availableInplaySBKBetsForCashout = [];

    if (comingUpBets.bets.length !== 0) {
      availableSBKBetsForCashout = filterAvailableSportsbookBets(comingUpBets.bets);

      await this.takeCashout(availableSBKBetsForCashout, ssoid);
    }

    if (inplayBets.bets.length !== 0) {
      availableInplaySBKBetsForCashout = filterAvailableSportsbookBets(inplayBets.bets);

      await this.takeCashout(availableInplaySBKBetsForCashout, ssoid);
    }

    // Check if there are more bets to cashout
    if (
      (availableSBKBetsForCashout.length > 0 && comingUpBets.moreAvailable) ||
      (availableInplaySBKBetsForCashout.length > 0 && inplayBets.moreAvailable)
    ) {
      this.takeSBKOpenBets(ssoid);
    }
  }

  /**
   * Fetch top single event data for a specific eventTypeId starting in a given number of hours
   *
   * @param {number} eventTypeId eventTypeId to retrieve - default is football
   * @param {string} productTypes to query, can be both EXC & SBK - default is SPORTSBOOK
   * @param {string} selectBy SelectBy Facet Filter
   * @returns {Promise.<Object>} promise that resolves to an Object that contains the event Data
   *
   * @memberOf Weaver
   */
  async fetchSingleEventData(filter) {
    const { eventTypes, events, competitions, results, eventTypeId } = await this.fetchWeaverEvents(filter);

    const [{ eventId, competitionId }] = results;

    return {
      eventTypeName: eventTypes[eventTypeId].name,
      competitionName: competitions[competitionId].name,
      eventName: events[eventId].name,
      eventId,
    };
  }

  /**
   * Fetch top single race data for a specific eventTypeId starting in a given number of hours
   *
   * @param {number} eventTypeId eventTypeId to retrieve - default is football
   * @param {string} productTypes to query, can be both EXC & SBK - default is SPORTSBOOK
   * @param {string} selectBy SelectBy Facet Filter
   * @returns {Promise.<Object>} promise that resolves to an Object that contains the race Data
   *
   * @memberOf Weaver
   */
  async fetchSingleRaceData(filter) {
    const { eventTypes, races, meetings, results, eventTypeId } = await this.fetchWeaverRaces(filter);
    const [{ raceId, meetingId }] = results;

    return {
      eventTypeName: eventTypes[eventTypeId].name,
      meetingName: meetings[meetingId].name,
      raceName: meetings[meetingId].venue,
      winMarketName: races[raceId].winMarketName,
      raceId,
    };
  }

  /**
   * Fetch multiple events data for a specific eventTypeId starting in a given number of hours
   *
   * @param {number} eventTypeId eventTypeId to retrieve - default is football
   * @param {string} productTypes to query, can be both EXC & SBK - default is SPORTSBOOK
   * @returns {Promise.<Object>} promise that resolves to an Object that contains the event Data
   *
   * @memberOf Weaver
   */
  async fetchMultipleEventsData(filter) {
    const { eventTypes, events, competitions, results, eventTypeId } = await this.fetchWeaverEvents(filter);

    return results.map(({ eventId, competitionId }) => ({
      eventTypeName: eventTypes[eventTypeId].name,
      competitionName: competitions[competitionId].name,
      eventName: events[eventId].name,
      eventId,
    }));
  }

  /**
   * Fetch multiple events data with cashout available
   *
   * @param {number} eventTypeId eventTypeId to retrieve - default is football
   * @param {string} locale define the locale - default is en_GB
   * @param {string} productTypes to query, can be both EXC & SBK - default is SPORTSBOOK
   * @param {boolean} inPlayOnly to limit the results to events in play - default is false
   * @returns {Promise.<Object>} promise that resolves to an Object that contains the list of eventIds
   *
   * @memberOf Weaver
   */
  async fetchMultipleEventsDataWithCashoutAvailable(filter) {
    const { results } = await this.fetchWeaverEventsWithMarkets(filter);

    const marketsIds = results.map((event) => event.sportsbookMarketId);
    const marketsWithCashout = await this.validateMarketsEligibilityClient.validateMarketsEligibility(marketsIds);

    const marketsCashoutWithEvents = results.filter(
      ({ sportsbookMarketId }) =>
        marketsWithCashout[sportsbookMarketId] && marketsWithCashout[sportsbookMarketId].hasCashout === true,
    );

    return marketsCashoutWithEvents.map(({ eventId }) => ({
      eventId,
    }));
  }

  async fetchWeaverCompetitions({
    eventTypeId = 1,
    locale = "en_GB",
    productTypes = ["SPORTSBOOK"],
    inPlayOnly = false,
    selectBy = "MAXIMUM_TRADED",
  } = {}) {
    const facetFilter = {
      eventTypeIds: [eventTypeId],
      selectBy,
      marketTypeCodes: ["WINNER", "MATCH_ODDS"],
      attachments: ["COMPETITION", "EVENT_TYPE"],
      maxResults: 30,
      inPlayOnly,
      productTypes,
    };

    const {
      attachments: { eventTypes = {}, competitions = {} },
      results,
    } = await this.facetClient.facetedSearch(facetFilter, { locale });

    if (results.length === 0) {
      throw new Error("No facet results for fetchSingleCompetitionData");
    }

    return { results, eventTypes, competitions, eventTypeId };
  }

  /**
   * Fetch top single competition data for a specific eventTypeId
   *
   * @param {number} eventTypeId eventTypeId to retrieve - default is football
   * @param {string} productTypes to query, can be both EXC & SBK - default is SPORTSBOOK
   * @param {string} selectBy SelectBy Facet Filter
   * @returns {Promise.<Object>} promise that resolves to an Object that contains the event Data
   *
   * @memberOf Weaver
   */
  async fetchSingleCompetitionData(filter) {
    const { results, eventTypes, competitions, eventTypeId } = await this.fetchWeaverCompetitions(filter);

    const [{ competitionId }] = results;

    return {
      eventTypeName: eventTypes[eventTypeId].name,
      competitionName: competitions[competitionId].name,
      competitionId,
    };
  }

  /**
   * Fetch multiple competitions data for a specific eventTypeId
   *
   * @param {number} eventTypeId eventTypeId to retrieve - default is football
   * @param {string} productTypes to query, can be both EXC & SBK - default is SPORTSBOOK
   * @returns {Promise.<Object>} promise that resolves to an Object that contains the event Data
   *
   * @memberOf Weaver
   */
  async fetchMultipleCompetitionData(filter) {
    const { results, eventTypes, competitions, eventTypeId } = await this.fetchWeaverCompetitions(filter);

    return results.map(({ competitionId }) => ({
      eventTypeName: eventTypes[eventTypeId].name,
      competitionName: competitions[competitionId].name,
      competitionId,
    }));
  }
}

module.exports = { Weaver };
