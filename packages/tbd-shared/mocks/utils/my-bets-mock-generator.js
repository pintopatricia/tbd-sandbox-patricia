/* eslint-disable no-underscore-dangle */
// Auxiliary
const transformIntoPartialCard = ({ node: { __typename, urn } = {} } = {}) =>
  (__typename &&
    urn && {
      node: {
        __typename,
        urn,
      },
    }) ||
  null;

const SUPPORTED_HEADERS = ["EventHeaderCard", "RaceDetailsCard", "FixtureCard"];

const getHeader = (card, EVENT_UID) => {
  if (card.__typename === "EventHeaderCard") {
    const { title, subtitle, tertiaryTitle, sportId, date } = card;

    return {
      node: {
        __typename: "EventHeaderCard",
        urn: `ppb:tbd:card:eventHeader:${EVENT_UID}`,
        title: title || "13:40 NOVICES' HURDLE 2m 3f 49y",
        subtitle: subtitle ?? null,
        tertiaryTitle: tertiaryTitle ?? "FONTWELL",
        sportId: sportId || "7",
        date: date || "2023-04-21T12:40:00.000Z",
      },
    };
  }

  if (card.__typename === "RaceDetailsCard") {
    const {
      numberOfRunners,
      numberOfNonRunners,
      numberOfParticipants,
      availableToSubscribe,
      showMeetingInfo,
      raceName,
      meetingName,
      venue,
    } = card;

    return {
      node: {
        __typename: "RaceDetailsCard",
        urn: `ppb:tbd:card:raceDetails:${EVENT_UID}.1605|true`,
        numberOfRunners: numberOfRunners || 10,
        showMeetingInfo: showMeetingInfo || false,
        availableToSubscribe: availableToSubscribe || true,
        race: {
          __typename: "Race",

          urn: `ppb:race:${EVENT_UID}.1605`,
          startTime: "2023-04-21T12:40:00.000Z",
          name: raceName || "Aintree",
          meeting: {
            __typename: "Meeting",

            urn: `ppb:meeting:${EVENT_UID}`,
            name: meetingName || "Wind 13th Jul",
            country: "GB",
            countryFlag: {
              medium: "http://example.test.com/mockedImage/image.png",
            },
            venue: venue || "Aintree",
            sport: {
              __typename: "Sport",
              urn: "ppb:eventType:7",
              name: "Horse Racing",
              sportId: 7,
            },
          },
          details: {
            distance: {
              totalFurlongs: 1,
              totalMeters: 1,
              miles: 10,
              furlongs: 40,
              yards: 50,
            },
            scheduledTime: "2023-04-21T12:40:00.000Z",
            resultType: null,
            numberOfRunners: numberOfRunners || 10,
            numberOfNonRunners: numberOfNonRunners || 0,
            numberOfParticipants: numberOfParticipants || 10,
            going: "GOOD_FIRM",
            status: "GOING_DOWN",
            type: "FLAT",
          },
        },
      },
    };
  }

  if (card.__typename === "FixtureCard") {
    const { homeName, awayName, scheduledAt, fixtureEventViewLink, eventId, duration, score } = card;

    const FINAL_EVENT_ID = eventId || EVENT_UID;

    return {
      node: {
        __typename: "FixtureCard",
        urn: `ppb:tbd:card:fixture:${FINAL_EVENT_ID}|viewLink|0`,
        fixture: {
          __typename: "FootballFixture",
          urn: `ppb:fixture:${FINAL_EVENT_ID}`,
          home: {
            name: homeName || "Newcastle",
            color: "ffffff",
            crest: null,
          },
          away: {
            name: awayName || "Brighton",
            color: "ff3b0a",
            crest: null,
          },
          scheduledAt: scheduledAt || "2023-05-18T18:30:00Z",
          startedAt: null,
          score: score ?? null,
          firstLegScore: null,
          duration: duration ?? {
            period: "REGULAR",
            status: "PRE_MATCH",
            clock: null,
            stoppageMinutes: null,
          },
          penaltyShootout: null,
        },
        fixtureEventViewLink,
        sportevent: {
          __typename: "SportsEvent",
          urn: `ppb:event:${FINAL_EVENT_ID}`,
          eventId: FINAL_EVENT_ID,
          name: `${homeName} v ${awayName}`,
          openDate: scheduledAt || "2023-05-18T18:30:00.000Z",
          competition: null,
        },
        availableToSubscribe: true,
      },
    };
  }

  return null;
};

// SBK Auxiliary
const getSBKBetLegsPerGroupMock = (bet, betId) => {
  const { edges } = bet;

  const LEGS_PER_GROUP = [];
  let betLegCounter = -1;

  const hasLegNumbers = edges.legCardGroups.every((group) => group.legs.every(({ legNumber }) => legNumber));

  edges.legCardGroups.map(({ legs }) => {
    const LEGS_MOCK = legs.map((leg) => {
      betLegCounter += 1;
      const { type, result, resultType, parts, legNumber, outcomeBasedDetails } = leg;

      return {
        __typename: "BetLeg",
        urn: `ppb:sbkBetLeg:${betId}/${hasLegNumbers ? legNumber : betLegCounter}`,
        type: type || "SS",
        result: result || null,
        resultType: resultType || null,
        legNumber: hasLegNumbers ? legNumber : betLegCounter,
        outcomeBasedDetails: outcomeBasedDetails || null,
        parts: parts.map((part) => {
          const {
            price,
            originalPrice,
            priceType,
            eventUrn,
            eventDescription,
            eachwayPlaces,
            selectionName,
            rule4Deductions,
            eventMarketDescription,
            marketType,
            handicap,
            outcomeDefinitionExp,
            sportId,
            isSuperSub,
          } = part;

          const defaultPrice = {
            decimal: 2.25,
            fractional: {
              numerator: 5,
              denominator: 4,
            },
          };

          return {
            marketBetUrn: "ppb:marketBet:924.333333333",
            marketId: "924.333333333",
            price: price !== undefined ? price : defaultPrice,
            originalPrice: originalPrice !== undefined ? originalPrice : defaultPrice,
            priceType: priceType || "LIVE",
            eventUrn: eventUrn || null,
            eventDescription: eventDescription || "13:40 NOVICES' HURDLE 2m 3f 49y",
            eventMarketDescription: eachwayPlaces ? "Each Way" : eventMarketDescription || "Win",
            marketType: marketType || "WIN",
            selectionId: 1,
            selectionName: selectionName || "Gitche Gumee",
            startTime: "2023-04-21T12:40:00.000Z",
            handicap: handicap || null,
            eachwayPlaces: eachwayPlaces || null,
            eachwayFactor: eachwayPlaces ? { numerator: 1, denominator: 5 } : null,
            rule4Deductions: rule4Deductions || null,
            outcomeDefinitionExp: outcomeDefinitionExp || null,
            sportId,
            isSuperSub: isSuperSub || null,
          };
        }),
      };
    });

    return LEGS_PER_GROUP.push(LEGS_MOCK);
  });

  return LEGS_PER_GROUP;
};

// SBK 4th level mock
const getSBKBetLegCardGroupsMock = (legCardGroups, legsPerGroup, betId) =>
  legCardGroups.map((group, groupIndex) => {
    const edges = [];

    const CARD_GROUP_UID = `${betId}/${groupIndex}`;
    const EVENT_UID = parseInt(`${betId}${groupIndex}`, 10);

    const { eventHeader, raceDetails, footballFixture, legs } = group;

    legs.forEach((_, legIndex) => {
      const SBK_BET_LEG_CARD = {
        node: {
          __typename: "BetLegCard",
          urn: `ppb:tbd:card:sbkBetLeg:${CARD_GROUP_UID}/${legIndex}`,
          betUrn: `ppb:sbkBet:${betId}`,
          leg: legsPerGroup[groupIndex][legIndex],
        },
      };

      edges.push(SBK_BET_LEG_CARD);
    });

    if (eventHeader) {
      edges.push(
        getHeader(
          {
            __typename: "EventHeaderCard",
            ...eventHeader,
          },
          EVENT_UID,
        ),
      );
    }

    if (raceDetails) {
      edges.push(
        getHeader(
          {
            __typename: "RaceDetailsCard",
            ...raceDetails,
          },
          EVENT_UID,
        ),
      );
    }

    if (footballFixture) {
      edges.push(
        getHeader(
          {
            __typename: "FixtureCard",
            ...footballFixture,
          },
          EVENT_UID,
        ),
      );
    }

    return {
      node: {
        __typename: "SportsbookBetLegCardGroup",
        urn: `ppb:tbd:cardgroup:sbkBetLeg:${CARD_GROUP_UID}`,
        full: {
          edges,
        },
      },
    };
  });

// SBK 3rd level mock
const getSBKExpandableLegCardGroupMock = (edges, betId, legsPerGroup) => {
  const SBK_BET_LEG_CARD_GROUPS = getSBKBetLegCardGroupsMock(edges.legCardGroups, legsPerGroup, betId);

  const SBK_BET_INFO_CARD = edges.betInfo
    ? [
        {
          node: {
            __typename: "SportsbookBetInfoCard",
            urn: `ppb:tbd:card:sbkBetInfo:${betId}`,
            ...edges.betInfo,
          },
        },
      ]
    : [];

  return {
    node: {
      __typename: "SportsbookExpandableLegCardGroup",
      urn: `ppb:tbd:cardgroup:sbkExpandableLeg:${betId}`,
      full: {
        edges: [...SBK_BET_LEG_CARD_GROUPS, ...SBK_BET_INFO_CARD],
      },
    },
  };
};

// SBK 2nd level mock
const getSBKBetCardGroupsMock = (bets) => {
  const DEFAULT_BET_ID_SEED = 1111111111;

  return bets.map((bet, index) => {
    const {
      betId = DEFAULT_BET_ID_SEED + index,
      product,
      betType,
      betSharingViewLink,
      edges,
      result,
      resultType,
      isACCA,
      isOddsBoosted,
      isPBM,
      isSettled,
      profitAndLoss,
      originalPotentialWin,
      betReceiptId,
      currentSize,
      numLines,
      betPrice,
      originalBetPrice,
      cashoutQuote,
      bonus,
      navigationLinks = [],
      lowestEventStartTime,
      // PLACED RETURNS
      potentialWinForPlace,
      isAccaInsuranceReward,

      // NOT YET TREATED
      isSGM,
      isSGMMulti,
      has90MinBet,
    } = bet;

    const SBK_LEGS_PER_GROUP = getSBKBetLegsPerGroupMock(bet, betId);

    const defaultBetPrice = {
      decimal: 21.6,
      fractional: {
        numerator: 108,
        denominator: 5,
      },
    };

    const defaultOriginalBetPrice = {
      decimal: 20.6,
      fractional: {
        numerator: 103,
        denominator: 5,
      },
    };

    const SBK_BET = {
      urn: `ppb:sbkBet:${betId}`,
      __typename: "SportsbookBet",
      betReceiptId: betReceiptId || "O/11037374/0002965",
      id: `${betId}`,
      product: product || null,
      isSettled: !!isSettled,
      profitAndLoss,
      originalPotentialWin: originalPotentialWin || null,
      isOddsBoosted: isOddsBoosted ? "true" : "false",
      isPBM: !!isPBM,
      betType: betType || "DBL",
      isSGM: !!isSGM,
      potentialWinForPlace: potentialWinForPlace || null,
      isSGMMulti: !!isSGMMulti,
      has90MinBet: !!has90MinBet,
      currentSize: currentSize || 0.1,
      numLines: numLines || 1,
      betPrice: betPrice !== undefined ? betPrice : defaultBetPrice,
      originalBetPrice: originalBetPrice !== undefined ? originalBetPrice : defaultOriginalBetPrice,
      legs: SBK_LEGS_PER_GROUP.flat(),
      result: result || null,
      resultType: resultType || null,
      cashoutQuote: cashoutQuote || null,
      bonus: bonus || 0,
      lowestEventStartTime: lowestEventStartTime || "2024-06-26T09:45:00.000Z",
      isAccaInsuranceReward: !!isAccaInsuranceReward,
      edges: isACCA
        ? [
            {
              reason: "ACCA_INSURANCE",
              status: "VOIDED",
            },
          ]
        : [],
    };

    const SBK_BET_CARD = {
      node: {
        __typename: "SportsbookBetCard",
        urn: `ppb:tbd:card:sbkBet:${betId}`,
        navigationLinks,
        bet: SBK_BET,
        betSharingViewLink: betSharingViewLink || null,
      },
    };

    const SBK_EXPANDABLE = getSBKExpandableLegCardGroupMock(edges, betId, SBK_LEGS_PER_GROUP);

    return {
      node: {
        __typename: "BetCardGroup",
        urn: `ppb:tbd:card:bet:group:${betId}|sbk`,
        full: {
          edges: [SBK_BET_CARD, SBK_EXPANDABLE],
        },
      },
    };
  });
};

// EXC MarketBetSelectionCard
const getEXCMarketBetSelectionCardMock = (card, marketId, orderType, matchedStatus) => {
  const {
    id,
    handicap = 0,
    placedDate = "2023-09-25T16:44:09.000Z",
    settledDate = null,
    matchedDate = "1970-01-01T00:00:00.000Z",
    price = 9,
    runnerDesc = "Home or Draw",
    side = "BACK",
    isCashout = false,
    size = 1,
    liability = null,
    profit = 8,
    result = null,
    bspLiability = null,
    isBsp = false,
    isFreeBet = false,
    freeBetSize = 0,
    priceMatched = 0,
    selectionId = 6384646,
    isUnmatched = true,
  } = card;

  const selectionUID = `${id}-${isUnmatched ? "U" : "M"}`;

  return {
    node: {
      __typename: "MarketBetSelectionCard",
      urn: `ppb:tbd:card:marketBetSelection:${selectionUID}?=orderType=${orderType}&matchedStatus=${matchedStatus}`,
      id: `${id}`,
      handicap,
      placedDate,
      settledDate,
      matchedDate,
      price,
      runnerDesc,
      side,
      isCashout,
      size,
      liability,
      profit,
      result,
      bspLiability,
      isBsp,
      isFreeBet,
      freeBetSize,
      priceMatched,
      selectionId,
      isUnmatched,
      editViewLink:
        (isUnmatched && {
          viewUrn: `ppb:tbd:view:generic:exchangeLightMarket:${selectionUID}`,
          viewUrl: "Not Implemented",
          viewDisplayMode: null,
        }) ||
        undefined,
      marketBetURN: `ppb:marketBet:${marketId}`,
      runnerURN: `ppb:excRunner:${marketId}/${selectionId}/0`,
      marketURN: `ppb:excMarket:${marketId}`,
      marketBetCardGroupURN: `ppb:tbd:cardgroup:marketBetCard:${marketId}?=orderType=${orderType}&matchedStatus=${matchedStatus}`,
    },
  };
};

// EXC MarketBetSelectionCardGroup
const getEXCMarketBetSelectionCardGroupMock = (
  marketBetSelectionCardGroup,
  EVENT_UID,
  marketId,
  orderType,
  matchedStatus,
) => {
  const { edges = [] } = marketBetSelectionCardGroup;

  const fullEdges = edges.map((card) => {
    if (card.__typename === "MarketBetSelectionCard") {
      return getEXCMarketBetSelectionCardMock(card, marketId, orderType, matchedStatus);
    }

    return null;
  });

  return {
    node: {
      __typename: "MarketBetSelectionCardGroup",
      urn: `ppb:tbd:cardgroup:marketBetSelectionCard:${marketId}?=orderType=${orderType}&matchedStatus=${matchedStatus}`,
      betCardGroupURN: `ppb:tbd:card:bet:group:${EVENT_UID}|exc`,
      marketBetCardURN: `ppb:tbd:card:marketBet:${marketId}?=orderType=${orderType}&matchedStatus=${matchedStatus}`,
      marketBetCardGroupURN: `ppb:tbd:cardgroup:marketBetCard:${marketId}?=orderType=${orderType}&matchedStatus=${matchedStatus}`,
      full: {
        edges: fullEdges,
      },
      partials: {
        partialEdges: fullEdges.map((card) => transformIntoPartialCard(card)),
      },
    },
  };
};

// EXC MarketBetExpandableCardGroup
const getEXCMarketBetExpandableCardGroupMock = (
  marketBetExpandableCardGroup,
  EVENT_UID,
  marketId,
  orderType,
  matchedStatus,
) => {
  const { edges = [], isOpen = false } = marketBetExpandableCardGroup;

  const fullEdges = edges.map((card) => {
    if (card.__typename === "MarketBetSelectionCardGroup") {
      return getEXCMarketBetSelectionCardGroupMock(card, EVENT_UID, marketId, orderType, matchedStatus);
    }

    return null;
  });

  return {
    node: {
      __typename: "MarketBetExpandableCardGroup",
      urn: `ppb:tbd:cardgroup:marketBetExpandableCard:${marketId}?=orderType=${orderType}&matchedStatus=${matchedStatus}`,
      isOpen,
      marketBetCardGroupURN: `ppb:tbd:cardgroup:marketBetCard:${marketId}?=orderType=${orderType}&matchedStatus=${matchedStatus}`,
      full: {
        edges: fullEdges,
      },
      partials: {
        partialEdges: fullEdges.map((card) => transformIntoPartialCard(card)),
      },
    },
  };
};

// EXC MarketBetCard
const getEXCMarketCardMock = (card, eventId, marketId, orderType, matchedStatus) => {
  const {
    description = "Double Chance",
    numOfOrders = 1,
    numOfUnmatched = 1,
    cashoutQuotes,
    liability,
    commission,
    profit,
    netProfit,
  } = card;

  return {
    node: {
      __typename: "MarketBetCard",
      urn: `ppb:tbd:card:marketBet:${marketId}?=orderType=${orderType}&matchedStatus=${matchedStatus}`,
      betCardGroupURN: `ppb:tbd:card:bet:group:${eventId}|exc`,
      marketBetCardGroupURN: `ppb:tbd:cardgroup:marketBetCard:${marketId}?=orderType=${orderType}&matchedStatus=${matchedStatus}`,
      marketBet: {
        __typename: "MarketBet",
        urn: `ppb:marketBet:${marketId}`,
        id: `${marketId}`,
        description,
        numOfOrders,
        numOfUnmatched,
        cashoutQuotes:
          (cashoutQuotes && [
            {
              __typename: "ExchangeCashoutQuote",
              urn: `ppb:excCashoutQuote:${marketId}/0`,
              marketURN: `ppb:excMarket:${marketId}`,
              marketBetURN: `ppb:marketBet:${marketId}`,
              value: cashoutQuotes[0]?.value ?? null,
              profit: cashoutQuotes[0]?.profit ?? null,
              currentLiability: cashoutQuotes[0]?.currentLiability ?? null,
              status: cashoutQuotes[0]?.status || "UNAVAILABLE",
            },
          ]) ||
          [],
        liability,
        commission,
        profit,
        netProfit,
        betDelay: 0,
        marketViewLink: {
          viewUrn: `ppb:tbd:view:market:${marketId}`,
          viewUrl: `football/portuguese-primeira-liga/benfica-v-porto/match-odds/m-${marketId}`,
        },
        exchangeLightMarketViewLink: {
          viewUrn: `ppb:tbd:view:generic:exchangeLightMarket:${marketId}`,
          viewUrl: "Not Implemented",
        },
      },
      matchedStatus,
    },
  };
};

// EXC MarketBetCardGroup
const getEXCMarketBetCardGroupMock = (marketBetCardGroup, eventId, marketId, orderType, matchedStatus) => {
  const { edges = [] } = marketBetCardGroup;

  const fullEdges = edges.map((card) => {
    if (card.__typename === "MarketBetCard") {
      return getEXCMarketCardMock(card, eventId, marketId, orderType, matchedStatus);
    }

    if (card.__typename === "MarketBetExpandableCardGroup") {
      return getEXCMarketBetExpandableCardGroupMock(card, eventId, marketId, orderType, matchedStatus);
    }

    return null;
  });

  return {
    node: {
      __typename: "MarketBetCardGroup",
      urn: `ppb:tbd:cardgroup:marketBetCard:${marketId}?=orderType=${orderType}&matchedStatus=${matchedStatus}`,
      full: {
        edges: fullEdges,
      },
      partials: {
        partialEdges: fullEdges.map((card) => transformIntoPartialCard(card)),
      },
    },
  };
};

// EXC BetCardGroup
const getEXCBetCardGroupsMock = (betCardGroups, { isOpen, isOpenUnmatched, isOpenMatched, isPagination }) => {
  const DEFAULT_AGGREGATOR_ID_SEED = !isPagination ? 1111111110 : 2111111110;
  const DEFAULT_MARKET_ID_SEED = !isPagination ? 11111110 : 21111110;
  let marketCounter = 0;

  const orderType = isOpen || isOpenUnmatched || isOpenMatched ? "OPEN" : "SETTLED";
  const matchedStatus = isOpenMatched ? "matched" : "unmatched";

  return betCardGroups.map((betCardGroup, index) => {
    const { aggregatorId, aggregatorDesc = "AGGREGATOR_DESC", edges = [] } = betCardGroup;

    const EVENT_UID = aggregatorId || DEFAULT_AGGREGATOR_ID_SEED + index;

    const fullEdges = edges.map((card) => {
      if (SUPPORTED_HEADERS.includes(card.__typename)) {
        return getHeader(card, EVENT_UID);
      }

      if (card.__typename === "MarketBetCardGroup") {
        marketCounter += 1;
        const marketId = `1.${DEFAULT_MARKET_ID_SEED + marketCounter}`;
        return getEXCMarketBetCardGroupMock(card, EVENT_UID, marketId, orderType, matchedStatus);
      }

      return null;
    });

    return {
      node: {
        __typename: "BetCardGroup",
        urn: `ppb:tbd:card:bet:group:${EVENT_UID}|exc`,
        aggregatorId: `${EVENT_UID}`,
        aggregatorDesc,
        full: {
          edges: fullEdges,
        },
      },
    };
  });
};

// SBK && EXC MyBetsView
const getMyBetsViewMock = (
  betCardGroups,
  {
    isSBK,
    hasFooter,
    hasNextPage,
    cursor = "NA==",
    isOpen,
    isOpenUnmatched,
    isOpenMatched,
    isOpenBetsFiltered,
    hasBottomBar = false,
    unmatchedCount = 0,
    matchedCount = 0,
  },
) => {
  if (hasFooter) {
    betCardGroups.push({
      node: {
        urn: "ppb:tbd:card:regulatory:footer",
        __typename: "RegulatoryCard",
        sections: [
          {
            __typename: "RegulatorySectionGeneric",
            sectionType: "GENERIC",
            genericSectionTitle: null,
            items: [
              {
                __typename: "RegulatoryTextItem",
                alignment: "LEFT",
                text: "Warning: Live scores and other data on this site is sourced from third party feeds.",
              },
            ],
          },
        ],
      },
    });
  }

  const myBetsViewOpenURN = "ppb:tbd:view:myBets:open";
  const myBetsViewSettledURN = "ppb:tbd:view:myBets:settled";

  let myBetsViewURN;
  let matchedStatus;

  const hasMatchedStatusQParams = !isSBK && (isOpenUnmatched || isOpenMatched);
  const orderMatchedStatus = isOpenMatched ? "matched" : "unmatched";

  if (!isOpen && !isOpenUnmatched && !isOpenMatched) {
    myBetsViewURN = myBetsViewSettledURN;
  } else if (isSBK) {
    myBetsViewURN = myBetsViewOpenURN;
  } else {
    myBetsViewURN = hasMatchedStatusQParams
      ? `${myBetsViewOpenURN}?=matchedStatus=${orderMatchedStatus}`
      : myBetsViewOpenURN;

    matchedStatus = {
      items: [
        {
          filterURN: `${myBetsViewOpenURN}?=matchedStatus=unmatched`,
          filter: "UNMATCHED",
          numberOfBets: unmatchedCount,
        },
        {
          filterURN: `${myBetsViewOpenURN}?=matchedStatus=matched`,
          filter: "MATCHED",
          numberOfBets: matchedCount,
        },
      ],
      defaultIndex: isOpenMatched ? 1 : 0,
    };
  }

  return {
    __typename: "MyBetsView",
    urn: myBetsViewURN,
    url: "mybets/myBets-open",
    filters: {
      orderType: {
        items: ["OPEN", "SETTLED"],
        defaultIndex: isOpen || isOpenMatched || isOpenUnmatched ? 0 : 1,
      },
      productType: {
        items: ["EXCHANGE", "SPORTSBOOK"],
        defaultIndex: isSBK ? 1 : 0,
      },
      matchedStatus,
      marketIds: isOpenBetsFiltered ? ["1.11111111"] : [],
      isHeritageView: false,
      hasHeritageBets: false,
    },
    edges: betCardGroups,
    bottomBar: hasBottomBar && {
      tiles: [
        {
          tileType: "HOME",
          viewLink: {
            viewUrn: "ppb:tbd:view:generic:home",
            viewUrl: "",
            viewDisplayMode: null,
          },
        },
        {
          tileType: "BROWSE",
          viewLink: {
            viewUrn: "ppb:tbd:view:browse:sports",
            viewUrl: "browse/sports/bw-73706f727473",
            viewDisplayMode: null,
          },
        },
        {
          tileType: "MY_BETS",
          viewLink: {
            viewUrn: "ppb:tbd:view:myBets:open",
            viewUrl: "mybets/open/mb-6f70656e",
            viewDisplayMode: null,
          },
        },
        {
          tileType: "GAMING",
          viewLink: {
            viewUrn: "ppb:tbd:view:gaming:1",
            viewUrl: "casino/gm-1",
            viewDisplayMode: null,
          },
        },
      ],
      hasProductSwitcher: true,
    },
    pageInfo: {
      hasNextPage,
      endCursor: cursor,
    },
    headerItems: {
      edges: [
        {
          node: {
            __typename: "GenericSwitcherCard",
            urn: "ppb:tbd:card:genericswitcher:mybets",
            filterTitle: {
              translated: null,
              translate: {
                key: "",
                __typename: "TranslateProps",
              },
              __typename: "TranslatableText",
            },
            selectedViewLink: {
              label: "My Bets",
              viewLink: {
                viewUrn: "ppb:tbd:view:myBets:mybets",
                viewUrl: "",
                __typename: "ViewLink",
              },
              __typename: "GenericViewLink",
            },
            siblingViews: {
              __typename: "GenericViewLinkConnection",
              edges: [
                {
                  __typename: "GenericViewLinkEdge",
                  node: {
                    __typename: "GenericViewLink",
                    label: "My Bets",
                    viewLink: {
                      __typename: "ViewLink",
                      viewUrn: "ppb:tbd:view:myBets:mybets",
                      viewUrl: "",
                    },
                  },
                },
              ],
            },
            headerTheming: null,
          },
          cursor: null,
          theme: null,
          __typename: "MyBetsHeaderItemEdge",
        },
      ],
      pageInfo: null,
      __typename: "MyBetsViewHeaderItemsConnection",
    },
  };
};

const getMyBetsSBKViewMock = (bets, { hasFooter, hasNextPage, hasBottomBar } = {}) => {
  const sbkBetCardGroups = getSBKBetCardGroupsMock(bets);

  return getMyBetsViewMock(sbkBetCardGroups, {
    isSBK: true,
    hasFooter,
    hasNextPage,
    isOpen: bets[0].isOpen,
    hasBottomBar,
  });
};

const getMyBetsEXCViewMock = (
  bets,
  {
    hasFooter,
    hasNextPage,
    cursor = "NA==",
    isOpen,
    isOpenUnmatched,
    isOpenMatched,
    isOpenBetsFiltered,
    isPagination,
    hasBottomBar = true,
    unmatchedCount = 0,
    matchedCount = 0,
  } = {},
) => {
  const excBetCardGroups = getEXCBetCardGroupsMock(bets, { isOpen, isOpenUnmatched, isOpenMatched, isPagination });

  return getMyBetsViewMock(excBetCardGroups, {
    isSBK: false,
    hasFooter,
    hasNextPage,
    cursor,
    isOpen,
    isOpenUnmatched,
    isOpenMatched,
    isOpenBetsFiltered,
    hasBottomBar,
    unmatchedCount,
    matchedCount,
  });
};

const getMyBetsEXCCardResults = (marketBetCardGroupCards, { eventId, marketId, isSettled, isOpenMatched }) => {
  const orderType = isSettled ? "SETTLED" : "OPEN";
  const matchedStatus = isSettled ? undefined : (isOpenMatched && "matched") || "unmatched";

  const cards = marketBetCardGroupCards.map((marketBetCardGroup) => {
    const { node } = getEXCMarketBetCardGroupMock(marketBetCardGroup, eventId, marketId, orderType, matchedStatus);

    return node;
  });

  return { cards };
};

module.exports = {
  getMyBetsSBKViewMock,
  getMyBetsEXCViewMock,
  getMyBetsEXCCardResults,
};
