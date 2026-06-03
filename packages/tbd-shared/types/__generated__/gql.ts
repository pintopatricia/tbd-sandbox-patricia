/* eslint-disable */
import * as types from "./graphql";
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
  "\n  query UpsellSuggestionsOddsDisplayPreference {\n    AppContext {\n      __typename\n      urn\n      preferences {\n        sportsbookOddsDisplay {\n          urn\n          selectedOddsDisplayFormat\n        }\n      }\n    }\n  }\n":
    types.UpsellSuggestionsOddsDisplayPreferenceDocument,
  "\n  query UpsellSuggestions($marketSelections: [MarketSelectionInput!]!) {\n    UpsellSuggestions(marketSelections: $marketSelections) {\n      min\n      max\n      items {\n        runner {\n          name\n          selectionId\n          runnerURN\n          runnerLiveData {\n            ... on SportsbookRunnerLiveData {\n              odds {\n                decimal\n                fractional {\n                  numerator\n                  denominator\n                }\n                american\n              }\n            }\n          }\n        }\n        market {\n          name\n          urn\n          hierarchy {\n            ... on EventCompetitionHierarchy {\n              sportevent {\n                name\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n":
    types.UpsellSuggestionsDocument,
  "\n  fragment GamingPrizeMachineUserDetails on AppContextDetails {\n    __typename\n    urn\n    userdetails {\n      localeCodeBcp47\n      currencyCode\n    }\n  }\n":
    types.GamingPrizeMachineUserDetailsFragmentDoc,
  "\n  fragment GamingPrizeMachineCard on GamingPrizeMachineCard {\n    __typename\n    urn\n    placementId\n    completed\n    redirectUrl\n    jackpotAmount\n    jackpotState\n    activeTitle\n    ctaLabel\n    displayJackpotWinnersPostPlayWidget\n    guaranteedPrize\n    minigameType\n    themeImages {\n      topLeftImage {\n        url\n        alt\n        dimensions {\n          width\n          height\n        }\n      }\n      bottomLeftImage {\n        url\n        alt\n        dimensions {\n          width\n          height\n        }\n      }\n      bottomRightImage {\n        url\n        alt\n        dimensions {\n          width\n          height\n        }\n      }\n    }\n  }\n":
    types.GamingPrizeMachineCardFragmentDoc,
  "\n  query GamingPrizeMachineUserDetails {\n    AppContext {\n      ...GamingPrizeMachineUserDetails\n    }\n  }\n":
    types.GamingPrizeMachineUserDetailsDocument,
  "\n  query GamingPrizeMachineCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...GamingPrizeMachineCard\n    }\n  }\n":
    types.GamingPrizeMachineCardDocument,
  "\n  fragment SportsbookLotteriesBetLegCardGroup on SportsbookLotteriesBetLegCardGroup {\n    __typename\n    urn\n    full: items {\n      edges {\n        node {\n          ... on BetLegCard {\n            urn\n            betUrn\n            __typename\n            leg {\n              ...SportsbookLotteriesBetLegFragment\n            }\n          }\n          ... on EventHeaderCard {\n            urn\n            __typename\n            title\n            tertiaryTitle\n            date\n          }\n        }\n      }\n    }\n  }\n\n  fragment SportsbookLotteriesBetLegFragment on BetLeg {\n    __typename\n    urn\n    type\n    parts {\n      ...SportsbookLotteriesLegPartFragment\n    }\n    result\n  }\n\n  fragment SportsbookLotteriesLegPartFragment on LegPart {\n    __typename\n    selectionId\n    selectionName\n  }\n":
    types.SportsbookLotteriesBetLegCardGroupFragmentDoc,
  "\n  fragment SportsbookLotteriesBetLegUserDetails on AppContextDetails {\n    __typename\n    urn\n    userdetails {\n      localeCodeBcp47\n      timezone\n    }\n  }\n":
    types.SportsbookLotteriesBetLegUserDetailsFragmentDoc,
  "\n  query SportsbookLotteriesBetLegCardGroup($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...SportsbookLotteriesBetLegCardGroup\n    }\n  }\n":
    types.SportsbookLotteriesBetLegCardGroupDocument,
  "\n  query SportsbookLotteriesBetLegUserDetails {\n    AppContext {\n      ...SportsbookLotteriesBetLegUserDetails\n    }\n  }\n":
    types.SportsbookLotteriesBetLegUserDetailsDocument,
  "\n  fragment BreadcrumbsCard on BreadcrumbsCard {\n    __typename\n    urn\n    items {\n      ... on HomeBreadcrumb {\n        __typename\n        displayName {\n          ... on DisplayNameTranslationKey {\n            translationKey\n          }\n        }\n        homeView {\n          urn\n        }\n      }\n      ... on SportBreadcrumb {\n        __typename\n        sportView {\n          urn\n          url\n          sport {\n            name\n          }\n        }\n      }\n      ... on CompetitionBreadcrumb {\n        __typename\n        competitionView {\n          urn\n          url\n          competition {\n            name\n          }\n        }\n      }\n      ... on EventBreadcrumb {\n        __typename\n        eventView {\n          urn\n          url\n          sportevent {\n            name\n          }\n        }\n      }\n      ... on RaceBreadcrumb {\n        __typename\n        raceView {\n          urn\n          url\n          race {\n            name\n          }\n        }\n      }\n      ... on MarketBreadcrumb {\n        __typename\n        marketView {\n          urn\n          url\n          mainMarket {\n            ... on SportsbookMarket {\n              name\n            }\n          }\n        }\n      }\n    }\n  }\n":
    types.BreadcrumbsCardFragmentDoc,
  "\n  query BreadcrumbsCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...BreadcrumbsCard\n    }\n  }\n":
    types.BreadcrumbsCardDocument,
  "\n  fragment GenericSwitcherCard on GenericSwitcherCard {\n    __typename\n    urn\n    filterTitle {\n      translated\n      translate {\n        key\n      }\n    }\n    selectedViewLink {\n      label\n      viewLink {\n        viewUrn\n        viewUrl\n      }\n    }\n    headerTheming\n  }\n":
    types.GenericSwitcherCardFragmentDoc,
  "\n  fragment GenericSwitcherCardSiblings on GenericSwitcherCard {\n    __typename\n    urn\n    siblingViews {\n      edges {\n        node {\n          label\n          viewLink {\n            viewUrn\n            viewUrl\n          }\n        }\n      }\n    }\n  }\n":
    types.GenericSwitcherCardSiblingsFragmentDoc,
  "\n  query GenericSwitcherCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...GenericSwitcherCard\n    }\n  }\n":
    types.GenericSwitcherCardDocument,
  "\n  query GenericSwitcherCardSiblings($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...GenericSwitcherCardSiblings\n    }\n  }\n":
    types.GenericSwitcherCardSiblingsDocument,
  "\n  fragment QuicklinksGridCardGroupItems on QuicklinksGridCardGroupItemsConnection {\n    __typename\n    edges {\n      __typename\n      isExpanded\n      style\n      label\n      icon {\n        id\n        category\n      }\n      node {\n        ...SportViewLinkItem\n        ...CompetitionViewLinkItem\n        ...EventViewLinkItem\n        ...RaceViewLinkItem\n        ...GenericViewLinkItem\n      }  \n    }\n  }\n":
    types.QuicklinksGridCardGroupItemsFragmentDoc,
  "\n  fragment QuicklinksGridCardGroupItemPartials on QuicklinksGridCardGroupItemsConnection {\n    __typename\n    edges {\n      __typename\n      isExpanded\n      style\n      label\n      icon {\n        id\n        category\n      }\n      node {\n        __typename\n        ... on SportViewLinkCard { urn }\n        ... on CompetitionViewLinkCard { urn }\n        ... on EventViewLinkCard { urn }\n        ... on RaceViewLinkCard { urn }\n        ... on GenericViewLinkCard { urn }\n      }\n    }\n  }\n":
    types.QuicklinksGridCardGroupItemPartialsFragmentDoc,
  "\n  fragment QuicklinksGridCardGroup on QuicklinksGridCardGroup {\n    __typename\n    urn\n    quicklinksGridTitle: title\n    hideArrows\n    hideIcons\n    items (first: 4) {\n      ...QuicklinksGridCardGroupItems\n    }\n    partials: items {\n      ...QuicklinksGridCardGroupItemPartials\n    }\n  }\n":
    types.QuicklinksGridCardGroupFragmentDoc,
  "\n  query QuicklinksGridCardGroup($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...QuicklinksGridCardGroup\n    }\n  }\n":
    types.QuicklinksGridCardGroupDocument,
  "\n  fragment SportViewLinkItem on SportViewLinkCard {\n    __typename\n    urn\n    viewLink {\n      viewUrn\n      viewUrl\n    }\n    sport {\n      ... on Sport {\n        __typename\n        urn\n        name\n        sportId\n      }\n    }\n  }\n":
    types.SportViewLinkItemFragmentDoc,
  "\n  fragment CompetitionViewLinkItem on CompetitionViewLinkCard {\n    __typename\n    urn\n    viewLink {\n      viewUrn\n      viewUrl\n    }\n    competition {\n      ... on Competition {\n        __typename\n        urn\n        name\n        competitionId\n        sport {\n          ... on Sport {\n            __typename\n            urn\n            name\n            sportId\n          }\n        }\n      }\n    }\n  }\n":
    types.CompetitionViewLinkItemFragmentDoc,
  "\n  fragment EventViewLinkItem on EventViewLinkCard {\n    __typename\n    urn\n    viewLink {\n      viewUrn\n      viewUrl\n    }\n    sportevent {\n      ... on SportsEvent {\n        __typename\n        urn\n        eventId\n        name\n        openDate\n        competition {\n          ... on Competition {\n            __typename\n            urn\n            name\n            competitionId\n            sport {\n              ... on Sport {\n                __typename\n                urn\n                name\n                sportId\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n":
    types.EventViewLinkItemFragmentDoc,
  "\n  fragment RaceViewLinkItem on RaceViewLinkCard {\n    __typename\n    urn\n    race {\n      ... on Race {\n        __typename\n        urn\n        startTime\n        raceId\n        name\n        meeting {\n          ... on Meeting {\n            __typename\n            urn\n            name\n            meetingId\n            country\n            countryFlag {\n              small\n              medium\n              large\n            }\n            venue\n            date\n            sport {\n              ... on Sport {\n                __typename\n                urn\n                name\n                sportId\n              }\n            }\n          }\n        }\n      }\n    }\n    viewLink {\n      viewUrn\n      viewUrl\n    }\n  }\n":
    types.RaceViewLinkItemFragmentDoc,
  "\n  fragment GenericViewLinkItem on GenericViewLinkCard {\n    __typename\n    urn\n    genericViewLinkTitle: title {\n      __typename\n      ... on DisplayNameTitle {\n        name\n      }\n      ... on DisplayNameTranslationKey {\n        translationKey\n      }\n    }\n    viewLink {\n      viewUrn\n      viewUrl\n      viewDisplayMode\n    }\n    badge\n    sportIcon {\n      ... on SportIcon {\n        sport {\n          sportId\n        }\n      }\n    }\n  }\n":
    types.GenericViewLinkItemFragmentDoc,
  "\n  query QuicklinksGridItemCard(\n    $urn: [URN!]!\n  ) {\n    Cards(cardsURN: $urn) {\n      ... on SportViewLinkCard {\n        ...SportViewLinkItem\n      }\n      ... on CompetitionViewLinkCard {\n        ...CompetitionViewLinkItem\n      }\n      ... on EventViewLinkCard {\n        ...EventViewLinkItem\n      }\n      ... on RaceViewLinkCard {\n        ...RaceViewLinkItem\n      }\n      ... on GenericViewLinkCard {\n        ...GenericViewLinkItem\n      }\n    }\n  }\n":
    types.QuicklinksGridItemCardDocument,
  "\n  query QuicklinksGridItemCardUserDetails {\n    AppContext {\n      ... on AppContextDetails {\n        __typename\n        userdetails {\n          loggedIn\n        }\n      }\n    }\n  }\n":
    types.QuicklinksGridItemCardUserDetailsDocument,
  "\n  fragment RaceSwitcherCardUserDetails on AppContextDetails {\n    __typename\n    urn\n    userdetails {\n      localeCodeBcp47\n      timezone\n    }\n  }\n":
    types.RaceSwitcherCardUserDetailsFragmentDoc,
  "\n  fragment RaceSwitcherCard on RaceSwitcherCard {\n    __typename\n    urn\n    filterTitle {\n      translated\n      translate {\n        key\n      }\n    }\n    race {\n      name\n      meeting {\n        urn\n        name\n        meetingId\n        countryFlag {\n          vector\n          small\n        }\n        venue\n        date\n      }\n    }\n    headerTheming\n  }\n":
    types.RaceSwitcherCardFragmentDoc,
  "\n  fragment RaceSwitcherCardSiblings on RaceSwitcherCard {\n    __typename\n    urn\n    siblingViews {\n      edges {\n        node {\n          race {\n            meeting {\n              urn\n              venue\n              countryFlag {\n                vector\n                small\n              }\n            }\n          }\n          viewLink {\n            viewUrn\n            viewUrl\n          }\n        }\n      }\n    }\n  }\n":
    types.RaceSwitcherCardSiblingsFragmentDoc,
  "\n  query RaceSwitcherCardUserDetails {\n    AppContext {\n      ...RaceSwitcherCardUserDetails\n    }\n  }\n":
    types.RaceSwitcherCardUserDetailsDocument,
  "\n  query RaceSwitcherCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...RaceSwitcherCard\n    }\n  }\n":
    types.RaceSwitcherCardDocument,
  "\n  query RaceSwitcherCardSiblings($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...RaceSwitcherCardSiblings\n    }\n  }\n":
    types.RaceSwitcherCardSiblingsDocument,
  "\n  fragment SelfExclusionUserDetails on AppContextDetails {\n    __typename\n    urn\n    userdetails {\n      localeCodeBcp47\n      jurisdiction {\n        jurisdiction\n      }\n    }\n  }\n":
    types.SelfExclusionUserDetailsFragmentDoc,
  "\n  fragment SelfExclusionCard on SelfExclusionCard {\n    __typename\n    urn\n    message: text {\n      ... on DisplayNameTitle {\n        name\n      }\n    }\n    saferGamblingLink {\n      viewUrn\n      viewUrl\n    }\n    supportLink {\n      viewUrn\n      viewUrl\n    }\n  }\n":
    types.SelfExclusionCardFragmentDoc,
  "\n  query SelfExclusionUserDetails {\n    AppContext {\n      ...SelfExclusionUserDetails\n    }\n  }\n":
    types.SelfExclusionUserDetailsDocument,
  "\n  query SelfExclusionCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...SelfExclusionCard\n    }\n  }\n":
    types.SelfExclusionCardDocument,
  "\n  fragment XSellBar on XSellBar {\n    __typename\n    sections {\n      sectionType\n      sectionUrl\n    }\n  }\n":
    types.XSellBarFragmentDoc,
  "\n  query XSellBar {\n    XSellBar {\n      ...XSellBar\n    }\n  }\n": types.XSellBarDocument,
  "\n  fragment BetOpportunityPromoCardTermsAndConditions on PromoTermsAndConditions {\n    summary\n    link {\n      label {\n        ... on DisplayNameTitle {\n          name\n        }\n        ... on DisplayNameTranslationKey {\n          translationKey\n        }\n      }\n      viewLink {\n        viewUrn\n        viewUrl\n        viewDisplayMode\n      }\n    }\n  }\n":
    types.BetOpportunityPromoCardTermsAndConditionsFragmentDoc,
  "\n  fragment BetOpportunityPromoCardUserDetails on AppContextDetails {\n    __typename\n    brandSettings {\n      name\n      isActive\n    }\n    userdetails {\n      localeCodeBcp47\n    }\n  }\n":
    types.BetOpportunityPromoCardUserDetailsFragmentDoc,
  "\n  fragment BetOpportunityPromoCard on BetOpportunityPromoCard {\n    __typename\n    urn\n    theme\n    title\n    subTitle\n    promoImage {\n      url\n    }\n    ladderLevels{\n      __typename\n      fulfilled\n      levels{\n        __typename\n        current\n        target\n      }\n    }\n    termsAndConditions {\n      ...BetOpportunityPromoCardTermsAndConditions\n    }\n    betOpportunityAction: action {\n      __typename\n      link {\n        label {\n          ... on DisplayNameTitle {\n            name\n          }\n          ... on DisplayNameTranslationKey {\n            translationKey\n          }\n        }\n        viewLink {\n          viewUrn\n          viewUrl\n          viewDisplayMode\n        }\n      }\n    }\n  }\n":
    types.BetOpportunityPromoCardFragmentDoc,
  "\n  query BetOpportunityPromoCard(\n    $urn: [URN!]!\n  ) {\n    Cards(cardsURN: $urn) {\n      ...BetOpportunityPromoCard\n    }\n  }\n":
    types.BetOpportunityPromoCardDocument,
  "\n  query BetOpportunityPromoCardUserDetails {\n    AppContext {\n      ...BetOpportunityPromoCardUserDetails\n    }\n  }\n":
    types.BetOpportunityPromoCardUserDetailsDocument,
  "\n  fragment EditorialPromoCardTermsAndConditions on PromoTermsAndConditions {\n    summary\n    link {\n      label {\n        ... on DisplayNameTitle {\n          name\n        }\n        ... on DisplayNameTranslationKey {\n          translationKey\n        }\n      }\n      viewLink {\n        viewUrn\n        viewUrl\n        viewDisplayMode\n      }\n    }\n  }\n":
    types.EditorialPromoCardTermsAndConditionsFragmentDoc,
  "\n  fragment EditorialPromoCardUserDetails on AppContextDetails {\n    __typename\n    brandSettings {\n      name\n      isActive\n    }\n    userdetails {\n      localeCodeBcp47\n    }\n  }\n":
    types.EditorialPromoCardUserDetailsFragmentDoc,
  "\n  fragment EditorialPromoCard on EditorialPromoCard {\n  __typename\n  urn\n  theme\n  title\n  subTitle\n  promoImage {\n    url\n  }\n  promoTag {\n    ... on PromoIconTag {\n      iconTag\n    }\n    ... on PromoLabelTag {\n      label\n    }\n  }\n  termsAndConditions {\n    ...EditorialPromoCardTermsAndConditions\n  }\n  editorialAction: action {\n    __typename\n    link {\n      label {\n        ... on DisplayNameTitle {\n          name\n        }\n        ... on DisplayNameTranslationKey {\n          translationKey\n        }\n      }\n      viewLink {\n        viewUrn\n        viewUrl\n        viewDisplayMode\n      }\n    }\n  }\n}\n":
    types.EditorialPromoCardFragmentDoc,
  "\n  query EditorialPromoCard(\n    $urn: [URN!]!\n  ) {\n    Cards(cardsURN: $urn) {\n      ...EditorialPromoCard\n    }\n  }\n":
    types.EditorialPromoCardDocument,
  "\n  query EditorialPromoCardUserDetails {\n    AppContext {\n      ...EditorialPromoCardUserDetails\n    }\n  }\n":
    types.EditorialPromoCardUserDetailsDocument,
  "\n  fragment LoyaltyPromotion on LoyaltyPromotion {\n    __typename\n    urn\n    name\n    title\n    promoImage {\n      url\n    }\n    state {\n      optInState\n      label {\n        ... on DisplayNameTitle { \n          __typename\n          name\n        }\n        ... on DisplayNameTranslationKey {\n          __typename\n          translationKey\n        }\n      }\n      link {\n        label {\n          ... on DisplayNameTitle {\n            __typename\n            name\n          }\n          ... on DisplayNameTranslationKey {\n            __typename\n            translationKey\n          }\n        }\n        viewLink {\n          viewUrn\n          viewUrl\n          viewDisplayMode\n        }\n      }\n    }\n    termsAndConditions {\n      summary\n      link {\n        label {\n          ... on DisplayNameTitle {\n            __typename\n            name\n          }\n          ... on DisplayNameTranslationKey {\n            __typename\n            translationKey\n          }\n        }\n        viewLink {\n          viewUrn\n          viewUrl\n          viewDisplayMode\n        }\n      }\n    }\n  }\n":
    types.LoyaltyPromotionFragmentDoc,
  "\n  mutation OptinCppPromo($urn: URN!) {\n    optinCppPromo(urn: $urn) {\n      ...LoyaltyPromotion\n    }\n  }\n":
    types.OptinCppPromoDocument,
  "\n  fragment MiniPromoBannerCard on MiniPromoBannerCard {\n    __typename\n    urn\n    theme\n    loyaltyPromotion {\n      ...LoyaltyPromotion\n    }\n  }\n":
    types.MiniPromoBannerCardFragmentDoc,
  "\n  fragment LoyaltyPromoCard on LoyaltyPromoCard {\n    __typename\n    urn\n    theme\n    loyaltyPromotion {\n      ...LoyaltyPromotion\n    }\n  }\n":
    types.LoyaltyPromoCardFragmentDoc,
  "\n  fragment LoyaltyPromoCardUserDetails on AppContextDetails {\n    __typename\n    brandSettings {\n      name\n      isActive\n    }\n  }\n":
    types.LoyaltyPromoCardUserDetailsFragmentDoc,
  "\n  query LoyaltyPromoCard(\n    $urn: [URN!]!\n  ) {\n    Cards(cardsURN: $urn) {\n      ...LoyaltyPromoCard\n      ...MiniPromoBannerCard\n    }\n  }\n":
    types.LoyaltyPromoCardDocument,
  "\n  query LoyaltyPromoCardUserDetails {\n    AppContext {\n      ...LoyaltyPromoCardUserDetails\n    }\n  }\n":
    types.LoyaltyPromoCardUserDetailsDocument,
  "\n  fragment PopularBettingOpportunityIsPotentialBet on PopularBettingOpportunity {\n    __typename\n    urn\n    selections {\n      __typename\n      runnerLiveData @client {\n        __typename\n        urn\n        isPotentialBet\n      }\n    }\n  }\n":
    types.PopularBettingOpportunityIsPotentialBetFragmentDoc,
  "\n  fragment PriceBoostMultiplePromoCardCombinedOdds on PopularBettingOpportunity {\n    __typename\n    urn\n    odds @client {\n      decimal\n      fractional {\n        numerator\n        denominator\n      }\n      american\n    }\n    originalOdds @client {\n      decimal\n      fractional {\n        numerator\n        denominator\n      }\n      american\n    }\n  }\n":
    types.PriceBoostMultiplePromoCardCombinedOddsFragmentDoc,
  "\n  fragment PriceBoostMultiplePromoCardUserDetails on AppContextDetails {\n    __typename\n    brandSettings {\n      name\n      isActive\n    }\n    userdetails {\n      localeCode\n    }\n    preferences {\n      sportsbookOddsDisplay {\n        urn\n        selectedOddsDisplayFormat\n      }\n    }\n  }\n":
    types.PriceBoostMultiplePromoCardUserDetailsFragmentDoc,
  "\n  fragment PriceBoostMultiplePromoCardTermsAndConditions on PromoTermsAndConditions {\n    summary\n    link {\n      label {\n        ... on DisplayNameTitle {\n          name\n        }\n        ... on DisplayNameTranslationKey {\n          translationKey\n        }\n      }\n      viewLink {\n        viewUrn\n        viewUrl\n        viewDisplayMode\n      }\n    }\n  }\n":
    types.PriceBoostMultiplePromoCardTermsAndConditionsFragmentDoc,
  "\n  fragment PriceBoostMultiplePromoCardPopularBettingOpportunity on PopularBettingOpportunity {\n    __typename\n    urn\n    count\n    bettingOpportunityId: id\n    selections {\n      __typename\n      market {\n        urn\n      }\n      runner {\n        runnerURN\n        selectionId\n      }\n      raceRunner {\n        __typename\n        urn\n        raceURN\n        selectionId\n        horse {\n          name\n          age\n          color\n          sex\n        }\n        details {\n          jockeyName\n          trainerName\n          silk\n          saddleCloth\n        }\n      }\n    }\n    displayName\n    type\n  }\n":
    types.PriceBoostMultiplePromoCardPopularBettingOpportunityFragmentDoc,
  "\n  fragment PriceBoostMultiplePromoCard on PriceBoostMultiplePromoCard {\n    __typename\n    urn\n    theme\n    title\n    subTitle\n    wasPrice\n    termsAndConditions {\n      ...PriceBoostMultiplePromoCardTermsAndConditions\n    }\n    popularbettingopportunity {\n      ...PriceBoostMultiplePromoCardPopularBettingOpportunity\n    }\n    promoTag {\n      ... on PromoIconTag {\n        iconTag\n      }\n      ... on PromoLabelTag {\n        label\n      }\n    }\n    priceBoostMultipleImage: promoImage {\n      url\n    }\n    promoAction {\n      __typename\n      link {\n        viewLink {\n          viewUrn\n          viewUrl\n          viewDisplayMode\n        }\n      }\n    }\n  }\n":
    types.PriceBoostMultiplePromoCardFragmentDoc,
  "\n  query PriceBoostMultiplePromoCard(\n    $urn: [URN!]!\n  ) {\n    Cards(cardsURN: $urn) {\n      ...PriceBoostMultiplePromoCard\n    }\n  }\n":
    types.PriceBoostMultiplePromoCardDocument,
  "\n  query PriceBoostMultiplePromoCardUserDetails {\n    AppContext {\n      ...PriceBoostMultiplePromoCardUserDetails\n    }\n  }\n":
    types.PriceBoostMultiplePromoCardUserDetailsDocument,
  "\n  fragment PromotionsCardGroup on PromotionsCardGroup {\n    __typename\n    urn\n    promotionsCardGroupTitle: title {\n      ... on DisplayNameTitle {\n        name\n      }\n      ... on DisplayNameTranslationKey {\n        translationKey\n      }\n    }\n    items (first: 2) {\n      edges {\n        node {\n          ...BetOpportunityPromoCard\n          ...EditorialPromoCard\n          ...LoyaltyPromoCard\n          ...SelectionPromoCard\n          ...PriceBoostMultiplePromoCard\n        }\n      }\n    }\n    partials: items {\n      edges {\n        node {\n          __typename\n          ... on BetOpportunityPromoCard { urn }\n          ... on EditorialPromoCard { urn }\n          ... on LoyaltyPromoCard { urn }\n          ... on SelectionPromoCard { urn }\n          ... on PriceBoostMultiplePromoCard { urn }\n        }\n      }\n    }\n  }\n":
    types.PromotionsCardGroupFragmentDoc,
  "\n  query PromotionsCardGroup(\n    $urn: [URN!]!\n  ) {\n    Cards(cardsURN: $urn) {\n      ...PromotionsCardGroup\n    }\n  }\n":
    types.PromotionsCardGroupDocument,
  "\n  query PromotionsCardGroupUserDetails {\n    AppContext {\n      ... on AppContextDetails {\n        __typename\n        brandSettings {\n          name\n          isActive\n        }\n      }\n    }\n  }\n":
    types.PromotionsCardGroupUserDetailsDocument,
  "\n  fragment PromotionsHubCardTermsAndConditions on PromoTermsAndConditions {\n    summary\n    link {\n      label {\n        ... on DisplayNameTitle {\n          name\n        }\n        ... on DisplayNameTranslationKey {\n          translationKey\n        }\n      }\n      viewLink {\n        viewUrn\n        viewUrl\n        viewDisplayMode\n      }\n    }\n  }\n":
    types.PromotionsHubCardTermsAndConditionsFragmentDoc,
  "\n  fragment PromotionsHubPromotionFields on PromotionsHubPromotion {\n    urn\n    name\n    title\n    description\n    status\n    promoCode\n    steps {\n      action\n      completed\n    }\n    showTimeLeft\n    canOptIn\n    canConsent\n    eligible\n    badge {\n      text\n      state\n    }\n    hasAccepted\n    optInState\n    optInStartDate\n    promoStateExpiryDate\n    termsAndConditions {\n      ...PromotionsHubCardTermsAndConditions\n    }\n    action {\n      label\n      actionType\n      viewLink {\n        viewUrn\n        viewUrl\n        viewDisplayMode\n      }\n    }\n    images {\n      url\n      width\n      height\n      tag\n    }\n  }\n":
    types.PromotionsHubPromotionFieldsFragmentDoc,
  "\n  fragment PromotionsHubCard on PromotionsHubCard {\n    __typename\n    urn\n    theme\n    promotionsHubPromotion {\n      ...PromotionsHubPromotionFields\n    }\n  }\n":
    types.PromotionsHubCardFragmentDoc,
  "\n  mutation OptinCppPromoHubCard($urn: URN!, $productExclusions: [ProductExclusion!]) @productExclusions(productExclusions: $productExclusions) {\n    optinCppPromo(urn: $urn) {\n      ... on PromotionsHubPromotion {\n        ...PromotionsHubPromotionFields\n      }\n    }\n  }\n":
    types.OptinCppPromoHubCardDocument,
  "\n  query PromotionsHubCard($urn: URN!, $productExclusions: [ProductExclusion!]) @productExclusions(productExclusions: $productExclusions) {\n    Cards(cardsURN: [$urn]) {\n      ...PromotionsHubCard\n    }\n  }\n":
    types.PromotionsHubCardDocument,
  "\n  fragment LocalPromotionsHubCardGroup on PromotionsHubCardGroup {\n    __typename\n    urn\n    selectedPebble @client\n  }\n":
    types.LocalPromotionsHubCardGroupFragmentDoc,
  "\n  fragment PromotionsHubCardGroup on PromotionsHubCardGroup {\n    __typename\n    urn\n    emptyState\n    filterOptions {\n      promoTagGroups {\n        urn\n        label\n        count\n      }\n    }\n  }\n":
    types.PromotionsHubCardGroupFragmentDoc,
  "\n  query PromotionsHubCardGroup(\n    $urn: [URN!]!\n    $filterBy: PromotionsHubFilterBy\n    $productExclusions: [ProductExclusion!]\n  ) @productExclusions(productExclusions: $productExclusions) {\n    Cards(cardsURN: $urn) {\n      ...PromotionsHubCardGroup\n      ... on PromotionsHubCardGroup {\n        items(first: 6, filterBy: $filterBy) {\n          edges {\n            node {\n              ...PromotionsHubCard\n            }\n          }\n        }\n        partials: items(filterBy: $filterBy) {\n          edges {\n            node {\n              ... on PromotionsHubCard {\n                urn\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n":
    types.PromotionsHubCardGroupDocument,
  "\n  query PromotionsHubCardGroupItems(\n    $urn: [URN!]!\n    $filterBy: PromotionsHubFilterBy\n    $productExclusions: [ProductExclusion!]\n  ) @productExclusions(productExclusions: $productExclusions) {\n    Cards(cardsURN: $urn) {\n      ... on PromotionsHubCardGroup {\n        __typename\n        urn\n        items(first: 6, filterBy: $filterBy) {\n          edges {\n            node {\n              ...PromotionsHubCard\n            }\n          }\n        }\n        partials: items(filterBy: $filterBy) {\n          edges {\n            node {\n              ... on PromotionsHubCard {\n                urn\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n":
    types.PromotionsHubCardGroupItemsDocument,
  "\n  fragment IsPotentialBet on SportsbookRunnerLiveData {\n    __typename\n    urn\n    isPotentialBet @client\n  }\n":
    types.IsPotentialBetFragmentDoc,
  "\n  fragment SelectionPromoCardMarketLiveData on SportsbookMarketLiveData {\n    __typename\n    urn\n    sportsbookMarketStatus\n    bspMarket\n    runners {\n      urn\n      runnerURN\n      runnerStatus\n      odds {\n        decimal\n        fractional {\n          numerator\n          denominator\n        }\n      }\n      displayOdds {\n        decimal\n        fractional {\n          numerator\n          denominator\n        }\n      }\n      previousOdds(limit: 1) {\n        odds {\n          decimal\n          fractional {\n            numerator\n            denominator\n          }\n        }\n        displayOdds {\n          decimal\n          fractional {\n            numerator\n            denominator\n          }\n        }\n      }\n    }\n  }\n":
    types.SelectionPromoCardMarketLiveDataFragmentDoc,
  "\n  fragment SelectionPromoCardUserDetails on AppContextDetails {\n    __typename\n    brandSettings {\n      name\n      isActive\n    }\n    userdetails {\n      localeCode\n    }\n    preferences {\n      sportsbookOddsDisplay {\n        urn\n        selectedOddsDisplayFormat\n      }\n    }\n  }\n":
    types.SelectionPromoCardUserDetailsFragmentDoc,
  "\n  fragment SelectionPromoCardTermsAndConditions on PromoTermsAndConditions {\n    summary\n    link {\n      label {\n        ... on DisplayNameTitle {\n          name\n        }\n        ... on DisplayNameTranslationKey {\n          translationKey\n        }\n      }\n      viewLink {\n        viewUrn\n        viewUrl\n        viewDisplayMode\n      }\n    }\n  }\n":
    types.SelectionPromoCardTermsAndConditionsFragmentDoc,
  "\n  fragment SelectionPromoCard on SelectionPromoCard {\n    __typename\n    urn\n    theme\n    title\n    subTitle\n    termsAndConditions {\n      ...SelectionPromoCardTermsAndConditions\n    }\n    cta {\n      ... on PromotionAddToBetslipAction {\n        __typename\n        market {\n          urn\n          isOddsboostMarketType\n          liveData {\n            ...SelectionPromoCardMarketLiveData\n          }\n          hierarchy {\n            __typename\n            ... on EventHierarchy {\n              sportevent {\n                __typename\n                urn\n              }\n            }\n            ... on RaceHierarchy {\n              race {\n                __typename\n                urn\n              }\n              meeting {\n                __typename\n                urn\n              }\n            }\n            ... on EventCompetitionHierarchy {\n              sportevent {\n                urn\n              }\n              competition {\n                urn\n              }\n            }\n          }\n        }\n        runner {\n          runnerURN\n        }\n        displayPreviousOdd\n      }\n      ... on PromotionAddToBetslipAndNavigateAction {\n        __typename\n        market {\n          urn\n          isOddsboostMarketType\n          liveData {\n            ...SelectionPromoCardMarketLiveData\n          }\n        }\n        runner {\n          runnerURN\n        }\n        displayPreviousOdd\n        viewLink {\n          viewUrn\n          viewUrl\n          viewDisplayMode\n        }\n      }\n    }\n    promoTag {\n      ... on PromoIconTag {\n        iconTag\n      }\n      ... on PromoLabelTag {\n        label\n      }\n    }\n    selectionImage: promoImage {\n      url\n    }\n  }\n":
    types.SelectionPromoCardFragmentDoc,
  "\n  query SelectionPromoCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...SelectionPromoCard\n    }\n  }\n":
    types.SelectionPromoCardDocument,
  "\n  query SelectionPromoCardUserDetails {\n    AppContext {\n      ...SelectionPromoCardUserDetails\n    }\n  }\n":
    types.SelectionPromoCardUserDetailsDocument,
  "\n  fragment CouponRefreshCard on FilteredCouponCardGroup {\n    __typename\n    urn\n    itemsHash(filterBy: $filteredCouponFilterBy, sortBy: $sortBy)\n  }\n":
    types.CouponRefreshCardFragmentDoc,
  "\n  query CouponRefreshCard($urn: [URN!]!, $filteredCouponFilterBy: FilteredCouponFilterBy, $sortBy: FilteredGroupSort) {\n    Cards(cardsURN: $urn) {\n      ...CouponRefreshCard\n    }\n  }\n":
    types.CouponRefreshCardDocument,
  "\n  fragment EmbeddedViewCardAppContext on AppContextDetails {\n    __typename\n    urn\n    userdetails {\n      localeCode\n      timezone\n    }\n  }\n":
    types.EmbeddedViewCardAppContextFragmentDoc,
  "\n  fragment EmbeddedViewCard on EmbeddedViewCard {\n    __typename\n    urn\n    text\n    url\n    appEnv @client\n  }\n":
    types.EmbeddedViewCardFragmentDoc,
  "\n  query EmbeddedViewCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...EmbeddedViewCard\n    }\n  }\n":
    types.EmbeddedViewCardDocument,
  "\n  query EmbeddedViewCardAppContext {\n    AppContext {\n      ...EmbeddedViewCardAppContext\n    }\n  }\n":
    types.EmbeddedViewCardAppContextDocument,
  "\n  fragment BroadcastsCard on BroadcastsCard {\n    __typename\n    urn\n    broadcasts {\n      dataVizUrl\n      liveVideoUrl\n    }\n    isCollapsed\n  }\n":
    types.BroadcastsCardFragmentDoc,
  "\n  query BroadcastsCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...BroadcastsCard\n    }\n  }\n":
    types.BroadcastsCardDocument,
  "\n  fragment EmbeddedContentCard on EmbeddedContentCard {\n    __typename\n    urn\n    contentTitle: title {\n      __typename\n      ... on DisplayNameTitle {\n        name\n      }\n    }\n    contentUrl: url\n  }\n":
    types.EmbeddedContentCardFragmentDoc,
  "\n  query EmbeddedContentCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...EmbeddedContentCard\n    }\n  }\n":
    types.EmbeddedContentCardDocument,
  "\n  fragment IncidentsCard on IncidentsCard {\n    __typename\n    urn\n    isHighlighted\n    showEmptyState\n    fixture {\n      urn\n      incidents {\n        period\n        periodStatus\n        clock {\n          minute\n        }\n        details {\n          ... on CardIncident {\n            __typename\n            cardType\n            side\n            player {\n              id\n              name\n              startingType\n            }\n          }\n          ... on GoalIncident {\n            __typename\n            goalType\n            side\n            goalScorer {\n              id\n              name\n              startingType\n            }\n          }\n        }\n      }\n    }\n  }\n":
    types.IncidentsCardFragmentDoc,
  "\n  query IncidentsCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...IncidentsCard\n    }\n  }\n":
    types.IncidentsCardDocument,
  "\n  fragment RugbyLeagueFixtureUserDetails on AppContextDetails {\n    urn\n    userdetails {\n      timezone\n      localeCodeBcp47\n      jurisdiction {\n        jurisdiction\n      }\n    }\n    brandSettings {\n      name\n      isActive\n    }\n  }\n":
    types.RugbyLeagueFixtureUserDetailsFragmentDoc,
  "\n  fragment RugbyLeagueFixture on RugbyLeagueFixture {\n    __typename\n    urn\n    runnerNames {\n      home\n      away\n    }\n    isAmericanFormat\n    score {\n      scoreHome: home\n      scoreAway: away\n    }\n    halfTimeScore {\n      halfTimeScoreHome: home\n      halfTimeScoreAway: away\n    }\n    sportevent {\n      openDate\n      competition {\n        name\n      }\n      name\n    }\n  }\n":
    types.RugbyLeagueFixtureFragmentDoc,
  "\n  query RugbyLeagueFixtureUserDetails {\n    AppContext {\n      ...RugbyLeagueFixtureUserDetails\n    }\n  }\n":
    types.RugbyLeagueFixtureUserDetailsDocument,
  "\n  query RugbyLeagueFixture($urn: [URN!]!) {\n    Fixtures(URNs: $urn) {\n      ...RugbyLeagueFixture\n    }\n  }\n":
    types.RugbyLeagueFixtureDocument,
  "\n  fragment StatsBroadcastsCard on StatsBroadcastsCard {\n    __typename\n    urn\n    broadcasts {\n      liveVideoUrl\n      dataVizUrl\n    }\n    sport {\n      ... on Sport {\n        urn\n        sportId\n      }\n    }\n  }\n":
    types.StatsBroadcastsCardFragmentDoc,
  "\n  query StatsBroadcastsCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsBroadcastsCard\n    }\n  }\n":
    types.StatsBroadcastsCardDocument,
  "\n  fragment StatsFormCardRecentForm on StatsFormCard {\n    __typename\n    urn\n    fixture {\n      urn\n      scheduledAt\n      home {\n        name\n      }\n      away {\n        name\n      }\n      recentForm {\n        home {\n          score {\n            home\n            away\n          }\n          outcome\n        }\n        away {\n          score {\n            home\n            away\n          }\n          outcome\n        }\n      }\n      homeStanding {\n        rank {\n          position\n        }\n        team {\n          name\n        }\n      }\n      awayStanding {\n        rank {\n          position\n        }\n        team {\n          name\n        }\n      }\n    }\n  }\n":
    types.StatsFormCardRecentFormFragmentDoc,
  "\n  fragment StatsFormCardCompetitionForm on StatsFormCard {\n    __typename\n    urn\n    fixture {\n      urn\n      scheduledAt\n      home {\n        name\n      }\n      away {\n        name\n      }\n      competitionForm {\n        home {\n          side\n          outcome\n          opponent\n          score {\n            home\n            away\n          }\n        }\n        away {\n          side\n          outcome\n          opponent\n          score {\n            home\n            away\n          }\n        }\n      }\n      homeStanding {\n        rank {\n          position\n        }\n        team {\n          name\n        }\n      }\n      awayStanding {\n        rank {\n          position\n        }\n        team {\n          name\n        }\n      }\n    }\n  }\n":
    types.StatsFormCardCompetitionFormFragmentDoc,
  "\n  query StatsFormCard($urn: [URN!]!, $isRecent: Boolean!, $isCompetition: Boolean!) {\n    Cards(cardsURN: $urn) {\n      ...StatsFormCardRecentForm @include(if: $isRecent)\n      ...StatsFormCardCompetitionForm @include(if: $isCompetition)\n    }\n  }\n":
    types.StatsFormCardDocument,
  "\n  fragment StatsGoalsAndShotsCard on StatsGoalsAndShotsCard {\n    __typename\n    urn\n    fixture {\n      urn\n      home {\n        name\n        statsAllSeason {\n          averageGoalsConceded {\n            firstHalf\n            secondHalf\n            overall\n          }\n          averageGoalsScored {\n            firstHalf\n            secondHalf\n            overall\n          }\n          averageShotsOnTarget\n        }\n      }\n      away {\n        name\n        statsAllSeason {\n          averageGoalsConceded {\n            firstHalf\n            secondHalf\n            overall\n          }\n          averageGoalsScored {\n            firstHalf\n            secondHalf\n            overall\n          }\n          averageShotsOnTarget\n        }\n      }\n    }\n  }\n":
    types.StatsGoalsAndShotsCardFragmentDoc,
  "\n  query StatsGoalsAndShotsCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsGoalsAndShotsCard\n    }\n  }\n":
    types.StatsGoalsAndShotsCardDocument,
  "\n  fragment StatsHeadToHeadUserDetails on AppContextDetails {\n    __typename\n    urn\n    userdetails {\n      localeCodeBcp47\n      timezone\n    }\n  }\n":
    types.StatsHeadToHeadUserDetailsFragmentDoc,
  "\n  fragment StatsHeadToHeadCard on StatsHeadToHeadCard {\n    __typename\n    urn\n    fixture {\n      urn\n      scheduledAt\n      head2head {\n        home {\n          opponent\n          score {\n            home\n            away\n          }\n          startAt\n          side\n        }\n        away {\n          opponent\n          score {\n            home\n            away\n          }\n          startAt\n        }\n      }\n    }\n  }\n":
    types.StatsHeadToHeadCardFragmentDoc,
  "\n  query StatsHeadToHeadUserDetails {\n    AppContext {\n      ...StatsHeadToHeadUserDetails\n    }\n  }\n":
    types.StatsHeadToHeadUserDetailsDocument,
  "\n  query StatsHeadToHeadCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsHeadToHeadCard\n    }\n  }\n":
    types.StatsHeadToHeadCardDocument,
  "\n  fragment StatsLeagueTableCard on StatsTableCard {\n    __typename\n    urn\n    fixture {\n      urn\n      competition {\n        id\n        stages {\n          standings {\n            gamesPlayed\n            win\n            loss\n            draw\n            points\n            goalsDifference\n            team {\n              name\n            }\n            rank {\n              position\n              status\n              change\n            }\n          }\n        }\n      }\n    }\n  }\n":
    types.StatsLeagueTableCardFragmentDoc,
  "\n  query StatsLeagueTableCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsLeagueTableCard\n    }\n  }\n":
    types.StatsLeagueTableCardDocument,
  "\n  fragment StatsLineupsCard on StatsLineupsCard {\n    __typename\n    urn\n    hasFormationInfo\n    status\n    fixture {\n      urn\n      home {\n        jerseys {\n          ...teamJersey\n        }\n        name\n        formation\n        squad {\n          manager\n          players {\n            ...lineupFootballPlayer\n          }\n        }\n      }\n      away {\n        jerseys {\n          ...teamJersey\n        }\n        name\n        formation\n        squad {\n          manager\n          players {\n            ...lineupFootballPlayer\n          }\n        }\n      }\n      incidents {\n        ...lineupFootballIncident\n      }\n    }\n    footballPlayerViewLinks {\n      viewUrl\n      viewUrn\n      footballPlayer {\n        urn\n      }\n    }\n  }\n\n  fragment teamJersey on Jerseys {\n    color\n    url\n    type\n  }\n\n  fragment lineupFootballPlayer on FootballPlayer {\n    id\n    name\n    matchName\n    shirtNumber\n    position\n    startingType\n    formationPlace\n  }\n\n  fragment lineupFootballIncident on FootballIncident {\n    clock {\n      minute\n    }\n    period\n    periodStatus\n    details {\n      __typename\n      ... on GoalIncident {\n        goalType\n        side\n        goalScorer {\n          ...lineupFootballPlayer\n        }\n        assist {\n          ...lineupFootballPlayer\n        }\n      }\n      ... on CardIncident {\n        cardType\n        side\n        player {\n          ...lineupFootballPlayer\n        }\n      }\n      ... on SubstitutionIncident {\n        side\n        playerIn {\n          ...lineupFootballPlayer\n        }\n        playerOut {\n          ...lineupFootballPlayer\n        }\n      }\n      ... on PenaltyShootoutIncident {\n        side\n        penaltyShootoutType\n        player {\n          ...lineupFootballPlayer\n        }\n      }\n    }\n  }\n":
    types.StatsLineupsCardFragmentDoc,
  "\n  query StatsLineupsCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsLineupsCard\n    }\n  }\n":
    types.StatsLineupsCardDocument,
  "\n  fragment FootballGameStats on FootballGameStats {\n    __typename\n    attacks\n    dangerousAttacks\n    possession\n    corners\n    yellowCards\n    redCards\n    shotsOnTarget\n    shotsOffTarget\n  }\n":
    types.FootballGameStatsFragmentDoc,
  "\n  fragment StatsMatchStatsCard on StatsMatchStatsCard {\n    __typename\n    urn\n    fixture {\n      urn\n      stats {\n        __typename\n        period\n        periodStatus\n        home {\n          ...FootballGameStats\n        }\n        away {\n          ...FootballGameStats\n        }\n      }\n    }\n  }\n":
    types.StatsMatchStatsCardFragmentDoc,
  "\n  query StatsMatchStatsCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsMatchStatsCard\n    }\n  }\n":
    types.StatsMatchStatsCardDocument,
  "\n  fragment FootballPlayerFixtureSeasonStats on FootballPlayerFixtureSeasonStats {\n    totals {\n      goals\n      firstGoalScored\n      lastGoalScored\n      shotsOnTarget\n      yellowCards\n      redCards\n      assists\n      tacklesMade\n      fouls\n    }\n    matchesPlayed\n  }\n":
    types.FootballPlayerFixtureSeasonStatsFragmentDoc,
  "\n  fragment FootballPlayerFixture on FootballPlayerFixture {\n    id\n    urn\n    name\n    seasonStats {\n      ...FootballPlayerFixtureSeasonStats\n    }\n  }\n":
    types.FootballPlayerFixtureFragmentDoc,
  "\n  fragment StatsPlayersSeasonStatsCardAttacking on StatsPlayersSeasonStatsCard {\n    __typename\n    urn\n    fixture {\n      urn\n      players {\n        ...FootballPlayerFixture\n      }\n      home {\n        name\n        squad {\n          players {\n            id\n          }\n        }\n      }\n      away {\n        name\n        squad {\n          players {\n            id\n          }\n        }\n      }\n    }\n    footballPlayerViewLinks {\n      viewUrl\n      viewUrn\n      footballPlayer {\n        ...FootballPlayerFixture\n      }\n    }\n  }\n":
    types.StatsPlayersSeasonStatsCardAttackingFragmentDoc,
  "\n  fragment StatsPlayersSeasonStatsCardDefending on StatsPlayersSeasonStatsCard {\n    __typename\n    urn\n    fixture {\n      urn\n      players {\n        ...FootballPlayerFixture\n      }\n      home {\n        name\n        squad {\n          players {\n            id\n          }\n        }\n      }\n      away {\n        name\n        squad {\n          players {\n            id\n          }\n        }\n      }\n    }\n    footballPlayerViewLinks {\n      viewUrl\n      viewUrn\n      footballPlayer {\n        ...FootballPlayerFixture\n      }\n    }\n  }\n":
    types.StatsPlayersSeasonStatsCardDefendingFragmentDoc,
  "\n  query StatsPlayersSeasonStatsCard($urn: [URN!]!, $isAttacking: Boolean!) {\n    Cards(cardsURN: $urn) {\n      ...StatsPlayersSeasonStatsCardAttacking @include(if: $isAttacking)\n      ...StatsPlayersSeasonStatsCardDefending @skip(if: $isAttacking)\n    }\n  }\n":
    types.StatsPlayersSeasonStatsCardDocument,
  "\n  fragment StatsPlayersSeasonStatsUserDetails on AppContextDetails {\n    __typename\n    throttles {\n      name\n      isActive\n    }\n  }\n":
    types.StatsPlayersSeasonStatsUserDetailsFragmentDoc,
  "\n  query StatsPlayersSeasonStatsUserDetails {\n    AppContext {\n      ...StatsPlayersSeasonStatsUserDetails\n    }\n  }\n":
    types.StatsPlayersSeasonStatsUserDetailsDocument,
  "\n  fragment StatsTeamsCardPreviousFive on StatsTeamsCard {\n    __typename\n    urn\n    fixture {\n      urn\n      teams {\n        urn\n        name\n        statsPreviousFive {\n          averageGoalsScored {\n            ...averageTeamStats\n          }\n          averageGoalsConceded {\n            ...averageTeamStats\n          }\n          averageCorners {\n            ...averageTeamStats\n          }\n          averageBookingPoints {\n            ...averageTeamStats\n          }\n          averageShots\n          bothTeamsToScore {\n            ...bothTeamsToScore\n          }\n        }\n      }\n    }\n  }\n":
    types.StatsTeamsCardPreviousFiveFragmentDoc,
  "\n  fragment StatsTeamsCardAllSeason on StatsTeamsCard {\n    __typename\n    urn\n    fixture {\n      urn\n      teams {\n        urn\n        name\n        statsAllSeason {\n          averageGoalsScored {\n            ...averageTeamStats\n          }\n          averageGoalsConceded {\n            ...averageTeamStats\n          }\n          averageCorners {\n            ...averageTeamStats\n          }\n          averageBookingPoints {\n            ...averageTeamStats\n          }\n          averageShots\n          bothTeamsToScore {\n            ...bothTeamsToScore\n          }\n        }\n      }\n    }\n  }\n":
    types.StatsTeamsCardAllSeasonFragmentDoc,
  "\n  fragment averageTeamStats on AverageTeamStats {\n    firstHalf\n    secondHalf\n    home\n    away\n    overall\n  }\n":
    types.AverageTeamStatsFragmentDoc,
  "\n  fragment bothTeamsToScore on BothTeamsToScore {\n    percentage\n  }\n": types.BothTeamsToScoreFragmentDoc,
  "\n  query StatsTeamsCard(\n    $urn: [URN!]!\n    $isPreviousFive: Boolean!\n    $isAllSeason: Boolean!\n  ) {\n    Cards(cardsURN: $urn) {\n      ...StatsTeamsCardPreviousFive @include(if: $isPreviousFive)\n      ...StatsTeamsCardAllSeason @include(if: $isAllSeason)\n    }\n  }\n":
    types.StatsTeamsCardDocument,
  "\n  fragment TeamLineupCard on TeamLineupCard {\n    __typename\n    urn\n    fixture {\n      urn\n      home {\n        squad {\n          manager\n          players {\n            ...lineupFootballPlayer\n          }\n        }\n      }\n      away {\n        squad {\n          manager\n          players {\n            ...lineupFootballPlayer\n          }\n        }\n      }\n      incidents {\n        ...lineupFootballIncident\n      }\n    }\n  }\n":
    types.TeamLineupCardFragmentDoc,
  "\n  query TeamLineupCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...TeamLineupCard\n    }\n  }\n":
    types.TeamLineupCardDocument,
  "\n  fragment IsSubscribed on SportsEvent {\n    __typename\n    urn\n    isSubscribed @client\n  }\n":
    types.IsSubscribedFragmentDoc,
  "\n  fragment TennisFixtureUserDetails on AppContextDetails {\n    urn\n    brandSettings {\n      name\n      isActive\n    }\n    userdetails {\n      timezone\n      localeCodeBcp47\n      jurisdiction {\n        jurisdiction\n      }\n    }\n  }\n":
    types.TennisFixtureUserDetailsFragmentDoc,
  "\n  fragment TennisFixture on TennisMatch {\n    __typename\n    urn\n    isAmericanFormat\n    runnerNames {\n      home\n      away\n    }\n    scheduledStartTime\n    surface\n    teamAScore\n    teamBScore\n    status {\n      status\n      reason\n    }\n    currentSet {\n      number\n      teamAScore\n      teamBScore\n      duration\n      currentGame {\n        number\n        teamAScore\n        teamBScore\n        teamServing\n      }\n    }\n    sportevent {\n      urn\n      name\n      openDate\n      competition {\n        name\n      }\n    }\n  }\n":
    types.TennisFixtureFragmentDoc,
  "\n  query TennisFixtureUserDetails {\n    AppContext {\n      ...TennisFixtureUserDetails\n    }\n  }\n":
    types.TennisFixtureUserDetailsDocument,
  "\n  query TennisFixture($urn: [URN!]!) {\n    Fixtures(URNs: $urn) {\n      ...TennisFixture\n    }\n  }\n":
    types.TennisFixtureDocument,
  "\n  fragment VolleyballFixtureUserDetails on AppContextDetails {\n    __typename\n    urn\n    brandSettings {\n      name\n      isActive\n    }\n    userdetails {\n      timezone\n      localeCodeBcp47\n      jurisdiction {\n        jurisdiction\n      }\n    }\n  }\n":
    types.VolleyballFixtureUserDetailsFragmentDoc,
  "\nfragment VolleyballFixture on VolleyballFixture {\n    __typename\n    urn\n    runnerNames {\n        home\n        away\n    }\n    sportevent {\n      urn\n      name\n      openDate\n      competition {\n        name\n      }\n    }\n    isAmericanFormat\n    currentSet {\n        volleyballSetNumber: number\n        volleyballSetScore: score {\n        home\n        away\n        }\n        volleyballCurrentServer: currentServer\n    }\n    homeScore\n    awayScore\n    previousSets {\n        volleyballSetNumber: number\n        volleyballSetScore: score {\n        home\n        away\n        }\n        volleyballCurrentServer: currentServer\n    }\n    }\n":
    types.VolleyballFixtureFragmentDoc,
  "\n  query VolleyballFixtureUserDetails {\n    AppContext {\n      ...VolleyballFixtureUserDetails\n    }\n  }\n":
    types.VolleyballFixtureUserDetailsDocument,
  "\n  query VolleyballFixture($urn: [URN!]!) {\n    Fixtures(URNs: $urn) {\n      ...VolleyballFixture\n    }\n  }\n":
    types.VolleyballFixtureDocument,
  "\n  fragment LocalLottoCard on LottoCard {\n    __typename\n    urn\n    selectedLottoPebble @client\n  }\n":
    types.LocalLottoCardFragmentDoc,
  "\n  fragment LottoCardUserDetails on AppContextDetails {\n    __typename\n    urn\n    preferences {\n      sportsbookOddsDisplay {\n        urn\n        selectedOddsDisplayFormat\n      }\n    }\n    userdetails {\n      localeCodeBcp47\n      timezone\n    }\n  }\n":
    types.LottoCardUserDetailsFragmentDoc,
  "\n  fragment LottoCardOdds on LottoCard {\n    urn\n    __typename\n    winAvgOdds {\n      decimalDisplayOdds {\n        decimalOdds\n      }\n      fractionalDisplayOdds {\n        numerator\n        denominator\n      }\n    }\n  }\n":
    types.LottoCardOddsFragmentDoc,
  "\n  fragment LottoCard on LottoCard {\n    ...LocalLottoCard\n    __typename\n    urn\n    shouldShowCompetitionName\n    competition {\n      __typename\n      urn\n      name\n    }\n    lottoMarkets: markets {\n      __typename\n      urn\n      name\n      marketType\n      liveData {\n        urn\n        sportsbookMarketStatus\n      }\n      hierarchy {\n        ... on EventHierarchy {\n          sportevent {\n            __typename\n            urn\n            name\n            openDate\n          }\n        }\n        ... on EventCompetitionHierarchy {\n          sportevent {\n            __typename\n            urn\n            name\n            openDate\n          }\n          competition {\n            urn\n          }\n        }\n      }\n      runners {\n        runnerURN\n        selectionId\n        name\n        resultType\n      }\n    }\n    marketIds\n  }\n":
    types.LottoCardFragmentDoc,
  "\n  query LottoCardOdds($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...LottoCardOdds\n    }\n  }\n":
    types.LottoCardOddsDocument,
  "\n  query LottoCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...LottoCard\n    }\n  }\n":
    types.LottoCardDocument,
  "\n  query LottoCardUserDetails {\n    AppContext {\n      ...LottoCardUserDetails\n    }\n  }\n":
    types.LottoCardUserDetailsDocument,
  "\n  fragment PenaltyTakersRunner on Runner {\n    __typename\n    runnerURN\n    name\n    selectionId\n    resultType\n    market {\n      ... on SportsbookMarket {\n        urn\n        name\n        liveData {\n          ... on SportsbookMarketLiveData {\n            urn\n            sportsbookMarketStatus\n          }\n        }\n      }\n    }\n    runnerLiveData {\n      ... on SportsbookRunnerLiveData {\n        urn\n        runnerURN\n        runnerStatus\n        odds {\n          decimal\n          fractional {\n            numerator\n            denominator\n          }\n        }\n        displayOdds {\n          decimal\n          fractional {\n            numerator\n            denominator\n          }\n        }\n      }\n    }\n  }\n":
    types.PenaltyTakersRunnerFragmentDoc,
  "\n  fragment PenaltyTakersCardIsPotentialBet on PenaltyTakersCard {\n    __typename\n    urn\n    penaltyTakers {\n      toScore {\n        topLeft {\n          runnerLiveData {\n            ... on SportsbookRunnerLiveData {\n              __typename\n              urn\n              isPotentialBet @client\n            }\n          }\n        }\n        topCenter {\n          runnerLiveData {\n            ... on SportsbookRunnerLiveData {\n              __typename\n              urn\n              isPotentialBet @client\n            }\n          }\n        }\n        topRight {\n          runnerLiveData {\n            ... on SportsbookRunnerLiveData {\n              __typename\n              urn\n              isPotentialBet @client\n            }\n          }\n        }\n        bottomLeft {\n          runnerLiveData {\n            ... on SportsbookRunnerLiveData {\n              __typename\n              urn\n              isPotentialBet @client\n            }\n          }\n        }\n        bottomCenter {\n          runnerLiveData {\n            ... on SportsbookRunnerLiveData {\n              __typename\n              urn\n              isPotentialBet @client\n            }\n          }\n        }\n        bottomRight {\n          runnerLiveData {\n            ... on SportsbookRunnerLiveData {\n              __typename\n              urn\n              isPotentialBet @client\n            }\n          }\n        }\n      }\n      toMiss {\n        leftPostMiss {\n          runnerLiveData {\n            ... on SportsbookRunnerLiveData {\n              __typename\n              urn\n              isPotentialBet @client\n            }\n          }\n        }\n        skyrocketCrossbar {\n          runnerLiveData {\n            ... on SportsbookRunnerLiveData {\n              __typename\n              urn\n              isPotentialBet @client\n            }\n          }\n        }\n        rightPostMiss {\n          runnerLiveData {\n            ... on SportsbookRunnerLiveData {\n              __typename\n              urn\n              isPotentialBet @client\n            }\n          }\n        }\n        leftSave {\n          runnerLiveData {\n            ... on SportsbookRunnerLiveData {\n              __typename\n              urn\n              isPotentialBet @client\n            }\n          }\n        }\n        centerSave {\n          runnerLiveData {\n            ... on SportsbookRunnerLiveData {\n              __typename\n              urn\n              isPotentialBet @client\n            }\n          }\n        }\n        rightSave {\n          runnerLiveData {\n            ... on SportsbookRunnerLiveData {\n              __typename\n              urn\n              isPotentialBet @client\n            }\n          }\n        }\n      }\n    }\n  }\n":
    types.PenaltyTakersCardIsPotentialBetFragmentDoc,
  "\n  fragment PenaltyTakersCardUserDetails on AppContextDetails {\n    __typename\n    brandSettings {\n      name\n      isActive\n    }\n    userdetails {\n      localeCode\n    }\n    preferences {\n      sportsbookOddsDisplay {\n        urn\n        selectedOddsDisplayFormat\n      }\n    }\n  }\n":
    types.PenaltyTakersCardUserDetailsFragmentDoc,
  "\n  fragment PenaltyTakersCard on PenaltyTakersCard {\n    __typename\n    urn\n    penaltyTakersCardTitle: title {\n      ... on DisplayNameTitle {\n        name\n      }\n      ... on DisplayNameTranslationKey {\n        translationKey\n      }\n    }\n    penaltyTakersCardSubtitle: subtitle {\n      ... on DisplayNameTitle {\n        name\n      }\n      ... on DisplayNameTranslationKey {\n        translationKey\n      }\n    }\n    penaltyTakersCardFooter: footer {\n      ... on DisplayNameTitle {\n        name\n      }\n      ... on DisplayNameTranslationKey {\n        translationKey\n      }\n    }\n    penaltyTakersCardTermsAndConditionsUrl: termsAndConditionsUrl\n    event {\n      urn\n    }\n    penaltyTakers {\n      player {\n        ... on FootballPlayerFixtureContext {\n          __typename\n          urn\n          player {\n            id\n            name\n          }\n          team {\n            jerseys {\n              url\n            }\n          }\n        }\n      }\n      toScore {\n        topLeft {\n          ...PenaltyTakersRunner\n        }\n        topCenter {\n          ...PenaltyTakersRunner\n        }\n        topRight {\n          ...PenaltyTakersRunner\n        }\n        bottomLeft {\n          ...PenaltyTakersRunner\n        }\n        bottomCenter {\n          ...PenaltyTakersRunner\n        }\n        bottomRight {\n          ...PenaltyTakersRunner\n        }\n      }\n      toMiss {\n        leftPostMiss {\n          ...PenaltyTakersRunner\n        }\n        skyrocketCrossbar {\n          ...PenaltyTakersRunner\n        }\n        rightPostMiss {\n          ...PenaltyTakersRunner\n        }\n        leftSave {\n          ...PenaltyTakersRunner\n        }\n        centerSave {\n          ...PenaltyTakersRunner\n        }\n        rightSave {\n          ...PenaltyTakersRunner\n        }\n      }\n    }\n  }\n":
    types.PenaltyTakersCardFragmentDoc,
  "\n  query PenaltyTakersCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...PenaltyTakersCard\n    }\n  }\n":
    types.PenaltyTakersCardDocument,
  "\n  query PenaltyTakersCardUserDetails {\n    AppContext {\n      ...PenaltyTakersCardUserDetails\n    }\n  }\n":
    types.PenaltyTakersCardUserDetailsDocument,
  "\n  fragment PlayerEventMarketsCard on PlayerEventMarketsCard {\n    __typename\n    urn\n    playerContext {\n      ... on FootballPlayerFixtureContext {\n        __typename\n        fixture {\n          ... on FootballFixture {\n            urn\n            home {\n              id\n            }\n            away {\n              id\n            }\n            sportevent {\n              urn\n            }\n          }\n        }\n        player {\n          name\n          shirtNumber\n          position\n          positionDescription\n        }\n        team {\n          id\n          jerseys {\n            url\n            color\n            type\n          }\n        }\n      }\n    }\n    playerViewLink {\n      viewUrl\n      viewUrn\n    }\n    playerCardEventViewLink: eventViewLink {\n      viewUrl\n      viewUrn\n    }\n    playerCardMarketTitle: title {\n      ... on DisplayNameTitle {\n        name\n      }\n      ... on DisplayNameTranslationKey {\n        translationKey\n      }\n    }\n    playerCardMarkets: markets {\n      label {\n        ... on DisplayNameTitle {\n          name\n        }\n        ... on DisplayNameTranslationKey {\n          translationKey\n        }\n      }\n      market {\n        ... on SportsbookMarket {\n          urn\n        }\n      }\n      runner {\n        runnerURN\n      }\n    }\n  }\n":
    types.PlayerEventMarketsCardFragmentDoc,
  "\n  query PlayerEventMarketsCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...PlayerEventMarketsCard\n    }\n  }\n":
    types.PlayerEventMarketsCardDocument,
  "\n  fragment PlayersRail on PlayersRail {\n    __typename\n    urn\n    playersRailTitle: title {\n      ... on DisplayNameTitle {\n        name\n      }\n      ... on DisplayNameTranslationKey {\n        translationKey\n      }\n    }\n    items(first: 2) {\n      edges {\n        node {\n          ...PlayerEventMarketsCard\n        }\n      }\n    }\n    partials: items {\n      edges {\n        node {\n          __typename\n          ... on PlayerEventMarketsCard {\n            urn\n          }\n        }\n      }\n    }\n  }\n":
    types.PlayersRailFragmentDoc,
  "\n  query PlayersRail($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...PlayersRail\n    }\n  }\n":
    types.PlayersRailDocument,
  "\n  fragment PopularSelectionsCard on PopularSelectionsCard {\n    __typename\n    urn\n    title\n    visibleSelectionsLimit\n    isExpandable\n    isExpandedByDefault\n    popularDisplayMode: displayMode\n    popularSelectionsCardItems: items {\n      runner {\n        runnerURN\n        name\n        selectionId\n        participantId\n        runnerLiveData {\n          ... on SportsbookRunnerLiveData {\n            urn\n            __typename\n            odds {\n              decimal\n              fractional {\n                denominator\n                numerator\n              }\n            }\n            displayOdds {\n              decimal\n              fractional {\n                denominator\n                numerator\n              }\n            }\n            runnerStatus\n          }\n        }\n      }\n      market {\n        urn\n        name\n        liveData {\n          ... on SportsbookMarketLiveData {\n            urn\n            sportsbookMarketStatus\n            bspMarket\n          }\n        }\n      }\n      stats {\n          betCount\n      }\n    }\n  }\n":
    types.PopularSelectionsCardFragmentDoc,
  "\n  fragment PopularSelectionsCardEnrichedPartial on PopularSelectionsCard {\n    __typename\n    urn\n    title\n    visibleSelectionsLimit\n    isExpandable\n    isExpandedByDefault\n    popularDisplayMode: displayMode\n}":
    types.PopularSelectionsCardEnrichedPartialFragmentDoc,
  "\n  query PopularSelectionsQuery($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...PopularSelectionsCard\n    }\n  }":
    types.PopularSelectionsQueryDocument,
  "\n  fragment PopularSelectionsOddsDisplayPreference on AppContextDetails {\n    __typename\n    urn\n    preferences {\n      sportsbookOddsDisplay {\n        urn\n        selectedOddsDisplayFormat\n      }\n    }\n  }\n":
    types.PopularSelectionsOddsDisplayPreferenceFragmentDoc,
  "\n  query PopularSelectionsOddsDisplayPreferenceQuery {\n    AppContext {\n      ...PopularSelectionsOddsDisplayPreference\n    }\n  }\n":
    types.PopularSelectionsOddsDisplayPreferenceQueryDocument,
  "\n  fragment PopularSelectionsCardPotentialBets on PopularSelectionsCard {\n    __typename\n    urn\n    popularSelectionsCardItems: items {\n      runner {\n        runnerLiveData {\n          ... on SportsbookRunnerLiveData {\n            __typename\n            urn\n            isPotentialBet @client\n          }\n        }\n      }\n    }\n  }\n":
    types.PopularSelectionsCardPotentialBetsFragmentDoc,
  "\n  fragment PopularSelectionsCardDisplayMode on PopularSelectionsCard {\n    __typename\n    urn\n    title\n    popularDisplayMode: displayMode\n    items {\n      __typename\n    }\n  }\n":
    types.PopularSelectionsCardDisplayModeFragmentDoc,
  "\n  query PopularSelectionsCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...PopularSelectionsCardDisplayMode\n    }\n  }":
    types.PopularSelectionsCardDocument,
  "\n  fragment PopularSelectionsCardTitle on PopularSelectionsCard {\n    __typename\n    urn\n    title\n    items {\n      __typename\n    }\n  }\n":
    types.PopularSelectionsCardTitleFragmentDoc,
  "\n      query PopularSelectionsPromoBanner($urn: [URN!]!) {\n        Cards(cardsURN: $urn) {\n          ...PopularSelectionsCardTitle\n        }\n      }\n    ":
    types.PopularSelectionsPromoBannerDocument,
  "\n  fragment SportsbookBetButtonIsPotentialBet on SportsbookRunnerLiveData {\n    __typename\n    urn\n    isPotentialBet @client\n  }\n":
    types.SportsbookBetButtonIsPotentialBetFragmentDoc,
  "\n  fragment SportsbookOddsDisplayPreference on AppContextDetails {\n    __typename\n    urn\n    preferences {\n      sportsbookOddsDisplay {\n        urn\n        selectedOddsDisplayFormat\n      }\n    }\n  }\n":
    types.SportsbookOddsDisplayPreferenceFragmentDoc,
  "\n  fragment SportsbookBetButtonRunner on Runner {\n    runnerURN\n    name\n    market {\n      ... on SportsbookMarket {\n        urn\n        name\n        liveData {\n          ... on SportsbookMarketLiveData {\n            urn\n            sportsbookMarketStatus\n            bspMarket\n          }\n        }\n        hierarchy {\n          ... on RaceHierarchy {\n            race {\n              urn\n            }\n          }\n        }\n        isOddsboostMarketType\n      }\n    }\n    runnerLiveData {\n      ... on SportsbookRunnerLiveData {\n        urn\n        runnerURN\n        runnerStatus\n        odds {\n          decimal\n          fractional {\n            numerator\n            denominator\n          }\n        }\n        displayOdds {\n          decimal\n          fractional {\n            numerator\n            denominator\n          }\n        }\n        previousOdds(limit: 1) {\n          odds {\n            decimal\n            fractional {\n              numerator\n              denominator\n            }\n          }\n          displayOdds {\n            decimal\n            fractional {\n              numerator\n              denominator\n            }\n          }\n        }\n      }\n    }\n  }\n":
    types.SportsbookBetButtonRunnerFragmentDoc,
  "\n  query SportsbookOddsDisplayPreference {\n    AppContext {\n      ...SportsbookOddsDisplayPreference\n    }\n  }\n":
    types.SportsbookOddsDisplayPreferenceDocument,
  "\n  query SportsbookBetButton($runnerURNs: [URN!]!) {\n    Runners(runnerURNs: $runnerURNs) {\n      ...SportsbookBetButtonRunner\n    }\n  }\n":
    types.SportsbookBetButtonDocument,
  "\n  fragment SportsbookChatbotCard on SportsbookChatbotCard {\n    __typename\n    urn\n    chatId\n    startDate\n    endDate\n    displayWindowOffset\n    chatContext {\n      eventId\n      eventName\n    }\n    infoTitle {\n      ... on DisplayNameTitle {\n        name\n      }\n      ... on DisplayNameTranslationKey {\n        translationKey\n      }\n    }\n    infoDescription {\n      ... on DisplayNameTitle {\n        name\n      }\n      ... on DisplayNameTranslationKey {\n        translationKey\n      }\n    }\n    startingPrompts {\n      ... on DisplayNameTitle {\n        name\n      }\n      ... on DisplayNameTranslationKey {\n        translationKey\n      }\n    }\n  }\n":
    types.SportsbookChatbotCardFragmentDoc,
  "\n  query SportsbookChatbotCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...SportsbookChatbotCard\n    }\n  }\n":
    types.SportsbookChatbotCardDocument,
  "\n  fragment SportsbookChatbotCardChatState on SportsbookChatbotCard {\n    chatState @client\n  }\n":
    types.SportsbookChatbotCardChatStateFragmentDoc,
  "\n  query SportsbookChatbotHistory($chatId: ID!) {\n    sportsbookChatBotHistory(chatId: $chatId) {\n      chatId\n      messages {\n        urn\n        status\n        role\n        isHistoryMessage @client\n        feedbackSubmitted @client\n        parts {\n          ...SportsbookChatbotTextPart\n          ...SportsbookChatbotBetSuggestionPart\n          ...SportsbookChatbotParticipantStatsPart\n          ...SportsbookChatbotParticipantStatsRankingPart\n          ...SportsbookChatbotStatsComparisonPart\n          ...SportsbookChatbotSwimlanePart\n        }\n      }\n    }\n  }\n":
    types.SportsbookChatbotHistoryDocument,
  "\n  query SportsbookChatbotMessage($messageUrn: URN!) {\n    sportsbookChatBotMessage(messageUrn: $messageUrn) {\n      urn\n      status\n      role\n      isHistoryMessage @client\n      feedbackSubmitted @client\n      parts {\n        ...SportsbookChatbotTextPart\n        ...SportsbookChatbotBetSuggestionPart\n        ...SportsbookChatbotParticipantStatsPart\n        ...SportsbookChatbotParticipantStatsRankingPart\n        ...SportsbookChatbotStatsComparisonPart\n        ...SportsbookChatbotSwimlanePart\n      }\n    }\n  }\n":
    types.SportsbookChatbotMessageDocument,
  "\n  mutation SportsbookChatbotSendMessage($input: SportsbookChatBotSendMessageInput!) {\n    sportsbookChatBotSendMessage(input: $input) {\n      messageUrn\n      status\n    }\n  }\n":
    types.SportsbookChatbotSendMessageDocument,
  "\n  fragment SportsbookChatbotBetSuggestionPart on SportsbookChatBotBetSuggestionPart {\n    __typename\n    selections {\n      runner {\n        runnerURN\n        marketURN\n        name\n      }\n      market {\n        name\n      }\n      footballFixture {\n        home {\n          jerseys {\n            url\n          }\n        }\n        away {\n          jerseys {\n            url\n          }\n        }\n      }\n      participant {\n        __typename\n        ... on FootballTeam {\n          jerseys {\n            url\n          }\n        }\n        ... on FootballPlayerFixtureContext {\n          team {\n            jerseys {\n              url\n            }\n          }\n        }\n      }\n    }\n    odds {\n      decimal\n      fractional {\n        numerator\n        denominator\n      }\n    }\n  }\n":
    types.SportsbookChatbotBetSuggestionPartFragmentDoc,
  "\n  fragment SportsbookChatbotParticipantStatsPart on SportsbookChatBotParticipantStatsPart {\n    __typename\n    participant {\n      __typename\n      ... on FootballTeam {\n        urn\n        name\n        jerseys {\n          url\n        }\n      }\n      ... on FootballPlayerFixtureContext {\n        urn\n        player {\n          name\n        }\n        team {\n          jerseys {\n            url\n          }\n        }\n      }\n    }\n    stats {\n      key\n      value\n    }\n  }\n":
    types.SportsbookChatbotParticipantStatsPartFragmentDoc,
  "\n  fragment SportsbookChatbotParticipantStatsRankingPart on SportsbookChatBotParticipantStatsRankingPart {\n    __typename\n    statName\n    ranking {\n      participant {\n        ... on FootballTeam {\n          __typename\n          urn\n          name\n          jerseys {\n            url\n          }\n        }\n        ... on FootballPlayerFixtureContext {\n          __typename\n          urn\n          player {\n            name\n          }\n        }\n      }\n      value\n    }\n  }\n":
    types.SportsbookChatbotParticipantStatsRankingPartFragmentDoc,
  "\n  fragment SportsbookChatbotStatsComparisonPart on SportsbookChatBotStatsComparisonPart {\n    __typename\n    participantA {\n      __typename\n      ... on FootballTeam {\n        urn\n        name\n        jerseys {\n          url\n        }\n      }\n      ... on FootballPlayerFixtureContext {\n        urn\n        player {\n          name\n        }\n        team {\n          jerseys {\n            url\n          }\n        }\n      }\n    }\n    participantB {\n      __typename\n      ... on FootballTeam {\n        urn\n        name\n        jerseys {\n          url\n        }\n      }\n      ... on FootballPlayerFixtureContext {\n        urn\n        player {\n          name\n        }\n        team {\n          jerseys {\n            url\n          }\n        }\n      }\n    }\n    stats {\n      statName\n      participantAValue\n      participantBValue\n    }\n  }\n":
    types.SportsbookChatbotStatsComparisonPartFragmentDoc,
  "\n  fragment SportsbookChatbotSwimlanePart on SportsbookChatBotSwimlanePart {\n    __typename\n    items {\n      __typename\n      ...SportsbookChatbotTextPart\n      ...SportsbookChatbotBetSuggestionPart\n      ...SportsbookChatbotParticipantStatsPart\n      ...SportsbookChatbotParticipantStatsRankingPart\n      ...SportsbookChatbotStatsComparisonPart\n    }\n  }\n":
    types.SportsbookChatbotSwimlanePartFragmentDoc,
  "\n  fragment SportsbookChatbotTextPart on SportsbookChatBotTextPart {\n    __typename\n    text\n  }\n":
    types.SportsbookChatbotTextPartFragmentDoc,
  "\n  query SportsbookChatbotCardChatState($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ... on SportsbookChatbotCard {\n        chatState @client\n      }\n    }\n  }\n":
    types.SportsbookChatbotCardChatStateDocument,
  "\n  query SportsbookChatbotInput($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ... on SportsbookChatbotCard {\n        startingPrompts {\n          ... on DisplayNameTitle {\n            name\n          }\n          ... on DisplayNameTranslationKey {\n            translationKey\n          }\n        }\n      }\n    }\n  }\n":
    types.SportsbookChatbotInputDocument,
  "\n  query SportsbookChatbotCardChatContext($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ... on SportsbookChatbotCard {\n        chatContext {\n          eventName\n        }\n      }\n    }\n  }\n":
    types.SportsbookChatbotCardChatContextDocument,
  "\n  fragment AppContextDetails on AppContextDetails {\n    __typename\n    urn\n    userdetails {\n      accountId\n      loggedIn\n      jurisdiction {\n        jurisdiction\n      }\n      region\n      bucketId\n      countryCode\n      localeCode\n      localeCodeBcp47\n      timezone\n      currencyCode\n      excSettings {\n        discount\n        currencyDetails {\n          minBspLiability\n          minStake\n          currencyCode\n          currencyId\n        }\n      }\n      firstName\n      lastName\n      lastLoginDate\n      jurisdictionalData {\n        nationalIdentifier\n        contractNumber\n      }\n      productExclusions\n      migrationData {\n        heritageAccountId\n        heritageSecondaryAccountId\n        heritageSystem\n        migrationInformation\n        migrationDate\n      }\n    }\n    throttles {\n      name\n      isActive\n    }\n    brandSettings {\n      name\n      isActive\n    }\n    preferences {\n      confirmCashout {\n        urn\n        shouldConfirmCashout\n      }\n      exchangeConfirmBetPlacement {\n        urn\n        shouldConfirmBetPlacement\n      }\n      oddsMovement {\n        urn\n        shouldAcceptOddsMovement\n      }\n      showBalances {\n        urn\n        shouldShowBalances\n      }\n      quickStakes {\n        urn\n        selectedQuickStakes {\n          stake\n        }\n      }\n      exchangeOddsDisplay {\n        urn\n        selectedOddsDisplayFormat\n      }\n      sportsbookOddsDisplay {\n        urn\n        selectedOddsDisplayFormat\n      }\n      favoriteSports {\n        urn\n        selectedFavoriteSports {\n          urn\n          sportId\n        }\n      }\n      defaultProduct {\n        urn\n        selectedDefaultProduct\n      }\n      exchangeDefaultProduct {\n        urn\n        selectedExchangeDefaultProduct\n      }\n      products {\n        urn\n        selectedProduct\n      }\n      lastViewedProduct {\n        urn\n        selectedLastViewedProduct\n      }\n      phoenixMigratedUser {\n        urn\n        isPhoenixMigratedUser\n      }\n      exchangeDefaultMode {\n        urn\n        selectedExchangeDefaultMode\n      }\n    }\n    registration {\n      joinNowLabel\n      joinNowLink\n    }\n    pollcadences {\n      ERO\n      SMP\n      WAS\n      LBR\n      SIB\n      SER\n      SCA {\n        loggedIn {\n          default {\n            inPlay\n            notInPlay\n          }\n        }\n        loggedOut {\n          default {\n            inPlay\n            notInPlay\n          }\n        }\n      }\n      COS {\n        loggedIn {\n          default {\n            inPlay\n            notInPlay\n          }\n          sports {\n            sportId\n            inPlay\n            notInPlay\n          }\n        }\n        loggedOut {\n          default {\n            inPlay\n            notInPlay\n          }\n        }\n      }\n      JACKPOT_ZONE\n      MY_BETS\n      POPULAR_BETS\n      REFRESH_CARDS\n      POLLING_DEBOUNCE\n    }\n  }\n":
    types.AppContextDetailsFragmentDoc,
  "\n  query AppContextDetailsQuery {\n    AppContext {\n      ...AppContextDetails\n    }\n  }\n":
    types.AppContextDetailsQueryDocument,
  "\n  query ViewRedirect($viewURN: URN!) {\n    View(viewURN: $viewURN) {\n      __typename\n      urn\n      url\n    }\n  }\n":
    types.ViewRedirectDocument,
  "\n  fragment sportEventCacheWarmup on SportsEvent {\n    __typename\n    urn\n    eventId\n    name\n    openDate\n    competition {\n      __typename\n      urn\n      name\n      sport {\n        __typename\n        urn\n        name\n      }\n    }\n  }\n":
    types.SportEventCacheWarmupFragmentDoc,
  "\n  fragment FilteredCouponCardGroupAllCompetitionsFilterOptions on FilteredCouponCardGroup {\n    filterOptions {\n      __typename\n      competitionsFilter {\n        urn\n        allCompetitions {\n          competitions {\n            __typename\n            urn\n            name\n            competitionId\n            sport {\n              __typename\n              urn\n              name\n              sportId\n            }\n          }\n          country {\n            urn\n            code\n            flag {\n              vector\n              small\n              medium\n              large\n            }\n          }\n        }\n      }\n    }\n  }\n":
    types.FilteredCouponCardGroupAllCompetitionsFilterOptionsFragmentDoc,
  "\n  query AllCompetitionsFilter($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...FilteredCouponCardGroupAllCompetitionsFilterOptions\n    }\n  }\n":
    types.AllCompetitionsFilterDocument,
  "\n  fragment MonterosaContentCard on MonterosaContentCard {\n    __typename\n    urn\n    host\n    projectId\n    monterosaEventId\n  }\n":
    types.MonterosaContentCardFragmentDoc,
  "\n  query MonterosaContentCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...MonterosaContentCard\n    }\n  }\n":
    types.MonterosaContentCardDocument,
  "\n  fragment MonterosaAppContext on AppContextDetails {\n    __typename\n    urn\n    preferences {\n      sportsbookOddsDisplay {\n        __typename\n        urn\n        selectedOddsDisplayFormat\n      }\n    }\n  }\n":
    types.MonterosaAppContextFragmentDoc,
  "\n  query MonterosaAppContext {\n    AppContext {\n      ...MonterosaAppContext\n    }\n  }\n":
    types.MonterosaAppContextDocument,
  "\n  fragment footballPlayerCompetitionStatsCard on FootballPlayerCompetitionStatsCard {\n    __typename\n    urn\n    player {\n      seasonStats {\n        matchesPlayed\n        totals {\n          goals\n          yellowCards\n          redCards\n          assists\n        }\n      }\n    }\n  }\n":
    types.FootballPlayerCompetitionStatsCardFragmentDoc,
  "\n  query FootballPlayerCompetitionStatsCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...footballPlayerCompetitionStatsCard\n    }\n  }\n":
    types.FootballPlayerCompetitionStatsCardDocument,
  "\n  fragment PlayerMarketsCardGroup on PlayerMarketsCardGroup {\n    __typename\n    urn\n    fixtureCard {\n      __typename\n      urn\n    }\n    items {\n      edges {\n        node {\n          ... on PebbleCardGroup {\n            __typename\n            urn\n          }\n        }\n      }\n    }\n  }\n":
    types.PlayerMarketsCardGroupFragmentDoc,
  "\n  query PlayerMarketsCardGroup($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...PlayerMarketsCardGroup\n    }\n  }\n":
    types.PlayerMarketsCardGroupDocument,
  "\n  fragment PlayerView on PlayerView {\n    __typename\n    urn\n    url\n    title\n    context {\n      __typename\n      ... on FootballPlayerFixtureContext {\n        player {\n          id\n          urn\n          name\n          position\n          shirtNumber\n        }\n        team {\n          name\n          color\n        }\n      }\n    }\n    items {\n      edges {\n        node {\n          ...footballPlayerCompetitionStatsCard\n          ... on PlayerMarketsCardGroup {\n            __typename\n            urn\n          }\n          ... on RegulatoryCard {\n            __typename\n            urn\n          }\n        }\n      }\n    }\n  }\n":
    types.PlayerViewFragmentDoc,
  "\n  query PlayerView($urn: URN!) {\n    View(viewURN: $urn) {\n      ...PlayerView\n    }\n  }\n":
    types.PlayerViewDocument,
  "\n  fragment NavigationTabsListCard on NavigationTabsList {\n    __typename\n    urn\n    title\n    items {\n      edges {\n        node {\n          ... on NavigationTab {\n            urn\n            title {\n              translated\n            }\n            viewLink {\n              viewUrn\n              viewUrl\n            }\n            items {\n              edges {\n                node {\n                  __typename\n                  urn\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n":
    types.NavigationTabsListCardFragmentDoc,
  "\n  query NavigationTabsListCard($urns: [URN!]!) {\n    Cards(cardsURN: $urns) {\n      ...NavigationTabsListCard\n    }\n  }\n":
    types.NavigationTabsListCardDocument,
  "\n  query RaceMeetingViewItems($viewURN: URN!, $race: URN) {\n    View(viewURN: $viewURN) {\n      ... on RaceMeetingView {\n        urn\n        races {\n          ...RaceNavigationItem\n        }\n        items(race: $race) {\n          selectedRace {\n            ...RaceNavigationItem\n          }\n          edges {\n            node {\n              ... on RaceResultsCard {\n                __typename\n                urn\n              }\n              ... on RegulatoryCard {\n                __typename\n                urn\n              }\n              ... on NavigationTabsList {\n                __typename\n                urn\n              }\n            }\n            cursor\n            theme\n          }\n          pageInfo {\n            endCursor\n            hasNextPage\n          }\n        }\n      }\n    }\n  }\n":
    types.RaceMeetingViewItemsDocument,
  "\n  fragment RaceMeetingViewAppContext on AppContextDetails {\n    __typename\n    urn\n    userdetails {\n      localeCodeBcp47\n      timezone\n    }\n    brandSettings {\n      name\n      isActive\n    }\n  }\n":
    types.RaceMeetingViewAppContextFragmentDoc,
  "\n  query RaceMeetingViewAppContext {\n    AppContext {\n      ...RaceMeetingViewAppContext\n    }\n  }\n":
    types.RaceMeetingViewAppContextDocument,
  "\n  fragment RaceNavigationItem on RaceNavigationItem {\n    race {\n      urn\n      raceId\n      name\n      startTime\n      verdict\n      broadcasts {\n        liveVideoUrl\n        dataVizUrl\n      }\n      primaryMarket {\n        ... on SportsbookMarket {\n          numberOfActiveRunners\n        }\n      }\n      raceKind {\n        ... on HorseRaceKind {\n          runners {\n            horse {\n              name\n            }\n            rating123\n            ratingStars\n          }\n          details {\n            name\n            title\n            scheduledTime\n            distance {\n              totalFurlongs\n              totalMeters\n              miles\n              furlongs\n              yards\n            }\n            numberOfRunners\n            numberOfNonRunners\n            numberOfParticipants\n            going\n            status\n            type\n            resultType\n            raceClass\n          }\n        }\n        ... on GreyhoundRaceKind {\n          details {\n            numberOfRunners\n          }\n        }\n      }\n      availableToSubscribe\n    }\n    viewLink {\n      viewUrn\n      viewUrl\n    }\n    promotion {\n      signposting\n    }\n  }\n":
    types.RaceNavigationItemFragmentDoc,
  "\n  fragment RaceMeetingView on RaceMeetingView {\n    __typename\n    urn\n    url\n    title\n    meeting {\n      urn\n      name\n      venue\n      country\n      date\n      countryFlag {\n        vector\n        small\n      }\n      sport {\n        sportId\n        name\n      }\n    }\n    races {\n      ...RaceNavigationItem\n    }\n    siblingRaceMeetingViews {\n      urn\n      url\n      meeting {\n        urn\n        name\n        venue\n        country\n        countryFlag {\n          vector\n          small\n        }\n      }\n    }\n    items {\n      selectedRace {\n        ...RaceNavigationItem\n      }\n      edges {\n        node {\n          ... on RaceResultsCard {\n            __typename\n            urn\n          }\n          ... on RegulatoryCard {\n            __typename\n            urn\n          }\n          ... on NavigationTabsList {\n            ...NavigationTabsListCard\n          }\n          ... on PreferenceSingleChoiceCard {\n            __typename\n            urn\n          }\n        }\n        cursor\n        theme\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n":
    types.RaceMeetingViewFragmentDoc,
  "\n  query RaceMeetingView($viewURN: URN!) {\n    View(viewURN: $viewURN) {\n      ...RaceMeetingView\n    }\n  }\n":
    types.RaceMeetingViewDocument,
  "\n  fragment SkyBetClubTrackerUserDetails on AppContextDetails {\n    __typename\n    urn\n    userdetails {\n      localeCodeBcp47\n      currencyCode\n      jurisdiction {\n        jurisdiction\n      }\n    }\n    brandSettings {\n      name\n      isActive\n    }\n  }\n":
    types.SkyBetClubTrackerUserDetailsFragmentDoc,
  "\n  fragment SkyBetClubTrackerCard on SkyBetClubTrackerCard {\n    __typename\n    urn\n    promotion {\n      ... on PphPromotion {\n        fulfillmentEndDate\n        customerPromotionState {\n          criteriaState {\n            params {\n              gauge {\n                current\n                target\n              }\n            }\n          }\n          hasAccepted\n        }\n        termsAndConditions {\n          summarized\n        }\n      }\n    }\n  }\n":
    types.SkyBetClubTrackerCardFragmentDoc,
  "\n  query SkyBetClubTrackerUserDetails {\n    AppContext {\n      ...SkyBetClubTrackerUserDetails\n    }\n  }\n":
    types.SkyBetClubTrackerUserDetailsDocument,
  "\n  query SkyBetClubTrackerCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...SkyBetClubTrackerCard\n    }\n  }\n":
    types.SkyBetClubTrackerCardDocument,
  "\n  fragment LocalStatsContentCardGroup on StatsContentCardGroup {\n    selectedTab @client {\n      urn\n      typename\n    }\n  }\n":
    types.LocalStatsContentCardGroupFragmentDoc,
  "\n  fragment StatsContentCardGroup on StatsContentCardGroup {\n    __typename\n    urn\n    ...LocalStatsContentCardGroup\n    partials: items {\n      edges {\n        ... on StatsMatchStatsItemEdge {\n          displayName {\n            translationKey\n          }\n          type\n          node {\n            urn\n            __typename\n          }\n        }\n        ... on StatsPebbleItemEdge {\n          displayName {\n            translationKey\n          }\n          type\n          node {\n            urn\n            __typename\n          }\n        }\n        ... on StatsLineupsItemEdge {\n          displayName {\n            translationKey\n          }\n          type\n          node {\n            urn\n            __typename\n          }\n        }\n        ... on StatsMatchStatsItemEdge {\n          displayName {\n            translationKey\n          }\n          type\n          node {\n            urn\n            __typename\n          }\n        }\n        ... on StatsBroadcastsItemEdge {\n          displayName {\n            translationKey\n          }\n          type\n          node {\n            urn\n            __typename\n          }\n        }\n        ... on StatsTableItemEdge {\n          displayName {\n            translationKey\n          }\n          type\n          node {\n            urn\n            __typename\n          }\n        }\n        ... on StatsPlayersInPlayItemEdge {\n          displayName {\n            translationKey\n          }\n          type\n          node {\n            urn\n            __typename\n          }\n        }\n      }\n    }\n  }\n":
    types.StatsContentCardGroupFragmentDoc,
  "\n  query StatsContentCardGroup($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsContentCardGroup\n    }\n  }\n":
    types.StatsContentCardGroupDocument,
  "\n  fragment StatsPebbleCardGroupBaseData on StatsPebbleCardGroup {\n    __typename\n    urn\n    status\n  }\n":
    types.StatsPebbleCardGroupBaseDataFragmentDoc,
  "\n  fragment LocalStatsPebbleCardGroup on StatsPebbleCardGroup {\n    selectedPebble @client {\n      urn\n      typename\n    }\n  }\n":
    types.LocalStatsPebbleCardGroupFragmentDoc,
  "\n  fragment StatsPebbleCardGroup on StatsPebbleCardGroup {\n    ...StatsPebbleCardGroupBaseData\n    ...LocalStatsPebbleCardGroup\n    full: items(first: 1, selectedOnly: true) {\n      edges {\n        displayName {\n          ...DisplayNameStats\n        }\n        node {\n          ... on StatsFormCard {\n            ...StatsFormCardRecentForm\n            ...StatsFormCardCompetitionForm\n          }\n          ... on StatsHeadToHeadCard {\n            ...StatsHeadToHeadCard\n          }\n          ... on StatsTeamsCard {\n            ...StatsTeamsCardPreviousFive\n            ...StatsTeamsCardAllSeason\n          }\n          ... on StatsPlayersSeasonStatsCard {\n            ...StatsPlayersSeasonStatsCardAttacking\n            ...StatsPlayersSeasonStatsCardDefending\n          }\n          ... on StatsMatchStatsCard {\n            ...StatsMatchStatsCard\n          }\n          ... on StatsGoalsAndShotsCard {\n            ...StatsGoalsAndShotsCard\n          }\n          ... on IncidentsCard {\n            ...IncidentsCard\n          }\n        }\n      }\n    }\n    partials: items {\n      edges {\n        displayName {\n          ...DisplayNameStats\n        }\n        ... on PebbleCardEdge {\n          node {\n            ... on StatsFormCard {\n              __typename\n              urn\n            }\n            ... on StatsHeadToHeadCard {\n              __typename\n              urn\n            }\n            ... on StatsTeamsCard {\n              __typename\n              urn\n            }\n            ... on StatsPlayersSeasonStatsCard {\n              __typename\n              urn\n            }\n            ... on StatsMatchStatsCard {\n              __typename\n              urn\n            }\n            ... on StatsGoalsAndShotsCard {\n              __typename\n              urn\n            }\n            ... on IncidentsCard {\n              __typename\n              urn\n            }\n          }\n        }\n      }\n    }\n  }\n\n  fragment DisplayNameStats on DisplayNameTranslationKey {\n    translationKey\n  }\n":
    types.StatsPebbleCardGroupFragmentDoc,
  "\n  query StatsPebbleCardGroup($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsPebbleCardGroup\n    }\n  }\n":
    types.StatsPebbleCardGroupDocument,
  "\n  fragment StatsPlayersInPlayUserDetails on AppContextDetails {\n    __typename\n    urn\n    userdetails {\n      localeCodeBcp47\n      jurisdiction {\n        jurisdiction\n      }\n      timezone\n    }\n  }\n":
    types.StatsPlayersInPlayUserDetailsFragmentDoc,
  "\n  fragment StatsPlayersInPlayCard on StatsPlayersInPlayCard {\n    __typename\n    urn\n    fixture {\n      urn\n      players {\n        id\n        name\n        stats {\n          stats {\n            totalShots\n            shotsOnTarget\n            foulsWon\n            assists\n            fouls\n            tacklesWon\n            blockedShots\n            offsides\n            interceptions\n            goalkeeperSaves\n            shotsCreated\n          }\n        }\n      }\n      home {\n        name\n        squad {\n          players {\n            id\n          }\n        }\n      }\n      away {\n        name\n        squad {\n          players {\n            id\n          }\n        }\n      }\n    }\n    footballPlayerViewLinks {\n      viewUrl\n      viewUrn\n      footballPlayer {\n        urn\n      }\n    }\n  }\n":
    types.StatsPlayersInPlayCardFragmentDoc,
  "\n  query StatsPlayersInPlayUserDetails {\n    AppContext {\n      ...StatsPlayersInPlayUserDetails\n    }\n  }\n":
    types.StatsPlayersInPlayUserDetailsDocument,
  "\n  query StatsPlayersInPlayCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsPlayersInPlayCard\n    }\n  }\n":
    types.StatsPlayersInPlayCardDocument,
  "\n  fragment StatsPlayersInPlayCardThrotles on AppContextDetails {\n    __typename\n    throttles {\n      name\n      isActive\n    }\n  }\n":
    types.StatsPlayersInPlayCardThrotlesFragmentDoc,
  "\n  fragment StatsRaceResultsCard on StatsRaceResultsCard {\n    __typename\n    urn\n    raceResultsRunners: runners {\n      horse {\n        name\n        performance {\n          positionOfficial\n          positionStatusCode\n        }\n      }\n      details {\n        saddleCloth\n        silk\n      }\n      isBetSelection\n    }\n  }\n":
    types.StatsRaceResultsCardFragmentDoc,
  "\n  query StatsRaceResultsCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsRaceResultsCard\n    }\n  }\n":
    types.StatsRaceResultsCardDocument,
  "\n  fragment StatsSupportingContentButtonsCardGroupBaseData on StatsSupportingContentButtonsCardGroup {\n    __typename\n    urn\n  }\n":
    types.StatsSupportingContentButtonsCardGroupBaseDataFragmentDoc,
  "\n  fragment StatsSupportingContentButtonsCardGroup on StatsSupportingContentButtonsCardGroup {\n    ...StatsSupportingContentButtonsCardGroupBaseData\n    full: items(first: 2) {\n      edges {\n        displayName {\n          ...DisplayNameStats\n        }\n        node {\n          ... on StatsMatchStatsCard {\n            ...StatsMatchStatsCard\n          }\n          ... on IncidentsCard {\n            ...IncidentsCard\n          }\n          ... on StatsBroadcastsCard {\n            ...StatsBroadcastsCard\n          }\n          ... on StatsRaceResultsCard {\n            ...StatsRaceResultsCard\n          }\n        }\n      }\n    }\n    partials: items {\n      edges {\n        displayName {\n          ...DisplayNameStats\n        }\n        ... on StatsSupportingContentButtonsCardEdge {\n          node {\n            ... on StatsMatchStatsCard {\n              __typename\n              urn\n            }\n            ... on IncidentsCard {\n              __typename\n              urn\n            }\n            ... on StatsBroadcastsCard {\n              __typename\n              urn\n            }\n            ... on StatsRaceResultsCard {\n              __typename\n              urn\n            }\n          }\n        }\n      }\n    }\n  }\n":
    types.StatsSupportingContentButtonsCardGroupFragmentDoc,
  "\n  query StatsSupportingContentButtonsCardGroup($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsSupportingContentButtonsCardGroup\n    }\n  }\n":
    types.StatsSupportingContentButtonsCardGroupDocument,
  "\n  fragment SportsbookRunnerLiveDataPotentialBetUpdate on SportsbookRunnerLiveData {\n    __typename\n    urn\n    isPotentialBet @client\n  }\n":
    types.SportsbookRunnerLiveDataPotentialBetUpdateFragmentDoc,
  "\n  fragment SportsbookRunnerLiveDataEventProcessor on SportsbookRunnerLiveData {\n    odds {\n      decimal\n      fractional {\n        numerator\n        denominator\n      }\n    }\n    displayOdds {\n      decimal\n      fractional {\n        numerator\n        denominator\n      }\n    }\n    previousOdds(limit: 1) {\n      odds {\n        decimal\n        fractional {\n          numerator\n          denominator\n        }\n      }\n      displayOdds {\n        decimal\n        fractional {\n          numerator\n          denominator\n        }\n      }\n    }\n    runnerStatus\n  }\n":
    types.SportsbookRunnerLiveDataEventProcessorFragmentDoc,
  "\n  fragment SportsbookMarketLiveDataEventProcessor on SportsbookMarketLiveData {\n    __typename\n    urn\n    sportsbookMarketStatus\n  }\n":
    types.SportsbookMarketLiveDataEventProcessorFragmentDoc,
  "\n  fragment RaceMeetingViewSeo on RaceMeetingView {\n    __typename\n    urn\n    meeting {\n      __typename\n      urn\n      venue\n      sport {\n        sportId\n      }\n    }\n    items {\n      selectedRace {\n        race {\n          __typename\n          urn\n          name\n          startTime\n        }\n      }\n    }\n  }\n":
    types.RaceMeetingViewSeoFragmentDoc,
  "\n  fragment AppContextPreferences on AppContextDetails {\n    __typename\n    urn\n    preferences {\n      confirmCashout {\n        urn\n        shouldConfirmCashout\n      }\n      exchangeConfirmBetPlacement {\n        urn\n        shouldConfirmBetPlacement\n      }\n      oddsMovement {\n        urn\n        shouldAcceptOddsMovement\n      }\n      showBalances {\n        urn\n        shouldShowBalances\n      }\n      quickStakes {\n        urn\n        selectedQuickStakes {\n          stake\n        }\n      }\n      exchangeOddsDisplay {\n        urn\n        selectedOddsDisplayFormat\n      }\n      sportsbookOddsDisplay {\n        urn\n        selectedOddsDisplayFormat\n      }\n      favoriteSports {\n        urn\n        selectedFavoriteSports {\n          urn\n          sportId\n        }\n      }\n      defaultProduct {\n        urn\n        selectedDefaultProduct\n      }\n      exchangeDefaultProduct {\n        urn\n        selectedExchangeDefaultProduct\n      }\n      products {\n        urn\n        selectedProduct\n      }\n      lastViewedProduct {\n        urn\n        selectedLastViewedProduct\n      }\n      phoenixMigratedUser {\n        urn\n        isPhoenixMigratedUser\n      }\n      exchangeDefaultMode {\n        urn\n        selectedExchangeDefaultMode\n      }\n    }\n  }\n ":
    types.AppContextPreferencesFragmentDoc,
  "\n  query AppContextPreferences {\n    AppContext {\n      ...AppContextPreferences\n    }\n  }":
    types.AppContextPreferencesDocument,
  "\n  fragment GamingPrizeMachineCardTrackingParams on GamingPrizeMachineCard {\n    __typename\n    urn\n    placementId\n    completed\n    jackpotAmount\n    jackpotState\n    activeTitle\n    ctaLabel\n    displayJackpotWinnersPostPlayWidget\n    guaranteedPrize\n  }\n":
    types.GamingPrizeMachineCardTrackingParamsFragmentDoc,
  "\n  fragment GamingPrizeMachineCardThrotles on AppContextDetails {\n    __typename\n    throttles {\n      name\n      isActive\n    }\n  }\n":
    types.GamingPrizeMachineCardThrotlesFragmentDoc,
  "\n  query IncidentsCardTracking($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...IncidentsCardTrackingParams\n    }\n  }\n":
    types.IncidentsCardTrackingDocument,
  "\n  fragment IncidentsCardTrackingParams on IncidentsCard {\n    __typename\n    urn\n    fixture {\n      urn\n      sportevent {\n        urn\n        name\n        competition {\n          urn\n          name\n        }\n      }\n    }\n  }\n":
    types.IncidentsCardTrackingParamsFragmentDoc,
  "\n  query LottoCardTracking($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...LottoCardTrackingParams\n    }\n  }\n":
    types.LottoCardTrackingDocument,
  "\n  fragment LottoCardTrackingParams on LottoCard {\n    __typename\n    urn\n    shouldShowCompetitionName\n    competition {\n      __typename\n      competitionId\n      urn\n      name\n    }\n    lottoMarkets: markets {\n      __typename\n      urn\n      name\n      marketType\n      liveData {\n        urn\n        sportsbookMarketStatus\n      }\n      hierarchy {\n        ... on EventCompetitionHierarchy {\n          sportevent {\n            eventId\n            __typename\n            urn\n            name\n            openDate\n          }\n          competition {\n            urn\n            __typename\n          }\n        }\n      }\n      runners {\n        runnerURN\n        selectionId\n        name\n        resultType\n      }\n    }\n    marketIds\n  }\n":
    types.LottoCardTrackingParamsFragmentDoc,
  "\n  fragment NotificationsSubscriptionRaceTrackingParams on Race {\n    __typename\n    urn\n    raceId\n    name\n    startTime\n    meeting {\n      urn\n      venue\n      sport {\n        name\n      }\n    }\n  }\n":
    types.NotificationsSubscriptionRaceTrackingParamsFragmentDoc,
  "\n  query NotificationsSubscriptionRaceTracking($urn: [URN!]!) {\n    Races(URNs: $urn) {\n      ...NotificationsSubscriptionRaceTrackingParams\n    }\n  }\n":
    types.NotificationsSubscriptionRaceTrackingDocument,
  "\n  query PenaltyTakersCardTracking($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...PenaltyTakersCardTrackingParams\n    }\n  }\n":
    types.PenaltyTakersCardTrackingDocument,
  "\n  fragment PenaltyTakersCardTrackingParams on PenaltyTakersCard {\n    __typename\n    urn\n    event {\n      urn\n      name\n    }\n    penaltyTakers {\n      player {\n        ... on FootballPlayerFixtureContext {\n          __typename\n          urn\n          player {\n            id\n            name\n          }\n        }\n      }\n    }\n  }\n":
    types.PenaltyTakersCardTrackingParamsFragmentDoc,
  "\n  query StatsContentCardGroupTracking($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsContentCardGroupTrackingParams\n    }\n  }\n":
    types.StatsContentCardGroupTrackingDocument,
  "\n  fragment StatsContentCardGroupTrackingParams on StatsContentCardGroup {\n    __typename\n    urn\n    status\n    sportEvent {\n      urn\n      name\n      competition {\n        urn\n        name\n      }\n    }\n  }\n":
    types.StatsContentCardGroupTrackingParamsFragmentDoc,
  "\n  query StatsLineupsCardTracking($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsLineupsCardTrackingParams\n    }\n  }\n":
    types.StatsLineupsCardTrackingDocument,
  "\n  fragment StatsLineupsCardTrackingParams on StatsLineupsCard {\n    __typename\n    urn\n    status\n    sportEvent {\n      urn\n      name\n      competition {\n        urn\n        name\n      }\n    }\n  }\n":
    types.StatsLineupsCardTrackingParamsFragmentDoc,
  "\n  query StatsPebbleCardGroupTracking($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsPebbleCardGroupTrackingParams\n    }\n  }\n":
    types.StatsPebbleCardGroupTrackingDocument,
  "\n  fragment StatsPebbleCardGroupTrackingParams on StatsPebbleCardGroup {\n    __typename\n    urn\n    status\n    items {\n      edges {\n        displayName {\n          ... on DisplayNameTranslationKey {\n            translationKey\n          }\n        }\n        node {\n          urn\n          __typename\n        }\n      }\n    }\n    sportEvent {\n      urn\n      name\n      competition {\n        urn\n        name\n      }\n    }\n  }\n":
    types.StatsPebbleCardGroupTrackingParamsFragmentDoc,
  "\n  query StatsPlayersInPlayTracking($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsPlayersInPlayTrackingParams\n    }\n  }\n":
    types.StatsPlayersInPlayTrackingDocument,
  "\n  fragment StatsPlayersInPlayTrackingParams on StatsPlayersInPlayCard {\n    __typename\n    urn\n    sportEvent {\n      urn\n      name\n      competition {\n        urn\n        name\n      }\n    }\n  }\n":
    types.StatsPlayersInPlayTrackingParamsFragmentDoc,
  "\n  query StatsPlayersSeasonStatsTracking($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsPlayersSeasonStatsTrackingParams\n    }\n  }\n":
    types.StatsPlayersSeasonStatsTrackingDocument,
  "\n  fragment StatsPlayersSeasonStatsTrackingParams on StatsPlayersSeasonStatsCard {\n    __typename\n    urn\n    sportEvent {\n      urn\n      name\n      competition {\n        urn\n        name\n      }\n    }\n  }\n":
    types.StatsPlayersSeasonStatsTrackingParamsFragmentDoc,
  "\n  query StatsSupportingContentButtonsCardGroupTracking($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsSupportingContentButtonsCardGroupTrackingParams\n    }\n  }\n":
    types.StatsSupportingContentButtonsCardGroupTrackingDocument,
  "\n  fragment StatsSupportingContentButtonsCardGroupTrackingParams on StatsSupportingContentButtonsCardGroup {\n    __typename\n    urn\n    items {\n      edges {\n        displayName {\n          ... on DisplayNameTranslationKey {\n            translationKey\n          }\n        }\n        ... on StatsSupportingContentButtonsCardEdge {\n          node {\n            ... on StatsMatchStatsCard {\n              __typename\n              urn\n            }\n            ... on IncidentsCard {\n              __typename\n              urn\n            }\n            ... on StatsBroadcastsCard {\n              __typename\n              urn\n            }\n            ... on StatsRaceResultsCard {\n              __typename\n              urn\n            }\n          }\n        }\n      }\n    }\n  }\n":
    types.StatsSupportingContentButtonsCardGroupTrackingParamsFragmentDoc,
  "\n  query StatsTeamsCardExpandIconTracking($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsTeamsCardExpandIconTrackingParams\n    }\n  }\n":
    types.StatsTeamsCardExpandIconTrackingDocument,
  "\n  fragment StatsTeamsCardExpandIconTrackingParams on StatsTeamsCard {\n    __typename\n    urn\n    fixture {\n      urn\n      sportevent {\n        urn\n        name\n        competition {\n          urn\n          name\n        }\n      }\n    }\n  }\n":
    types.StatsTeamsCardExpandIconTrackingParamsFragmentDoc,
};

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = gql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function gql(source: string): unknown;

/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query UpsellSuggestionsOddsDisplayPreference {\n    AppContext {\n      __typename\n      urn\n      preferences {\n        sportsbookOddsDisplay {\n          urn\n          selectedOddsDisplayFormat\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  query UpsellSuggestionsOddsDisplayPreference {\n    AppContext {\n      __typename\n      urn\n      preferences {\n        sportsbookOddsDisplay {\n          urn\n          selectedOddsDisplayFormat\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query UpsellSuggestions($marketSelections: [MarketSelectionInput!]!) {\n    UpsellSuggestions(marketSelections: $marketSelections) {\n      min\n      max\n      items {\n        runner {\n          name\n          selectionId\n          runnerURN\n          runnerLiveData {\n            ... on SportsbookRunnerLiveData {\n              odds {\n                decimal\n                fractional {\n                  numerator\n                  denominator\n                }\n                american\n              }\n            }\n          }\n        }\n        market {\n          name\n          urn\n          hierarchy {\n            ... on EventCompetitionHierarchy {\n              sportevent {\n                name\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  query UpsellSuggestions($marketSelections: [MarketSelectionInput!]!) {\n    UpsellSuggestions(marketSelections: $marketSelections) {\n      min\n      max\n      items {\n        runner {\n          name\n          selectionId\n          runnerURN\n          runnerLiveData {\n            ... on SportsbookRunnerLiveData {\n              odds {\n                decimal\n                fractional {\n                  numerator\n                  denominator\n                }\n                american\n              }\n            }\n          }\n        }\n        market {\n          name\n          urn\n          hierarchy {\n            ... on EventCompetitionHierarchy {\n              sportevent {\n                name\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment GamingPrizeMachineUserDetails on AppContextDetails {\n    __typename\n    urn\n    userdetails {\n      localeCodeBcp47\n      currencyCode\n    }\n  }\n",
): (typeof documents)["\n  fragment GamingPrizeMachineUserDetails on AppContextDetails {\n    __typename\n    urn\n    userdetails {\n      localeCodeBcp47\n      currencyCode\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment GamingPrizeMachineCard on GamingPrizeMachineCard {\n    __typename\n    urn\n    placementId\n    completed\n    redirectUrl\n    jackpotAmount\n    jackpotState\n    activeTitle\n    ctaLabel\n    displayJackpotWinnersPostPlayWidget\n    guaranteedPrize\n    minigameType\n    themeImages {\n      topLeftImage {\n        url\n        alt\n        dimensions {\n          width\n          height\n        }\n      }\n      bottomLeftImage {\n        url\n        alt\n        dimensions {\n          width\n          height\n        }\n      }\n      bottomRightImage {\n        url\n        alt\n        dimensions {\n          width\n          height\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment GamingPrizeMachineCard on GamingPrizeMachineCard {\n    __typename\n    urn\n    placementId\n    completed\n    redirectUrl\n    jackpotAmount\n    jackpotState\n    activeTitle\n    ctaLabel\n    displayJackpotWinnersPostPlayWidget\n    guaranteedPrize\n    minigameType\n    themeImages {\n      topLeftImage {\n        url\n        alt\n        dimensions {\n          width\n          height\n        }\n      }\n      bottomLeftImage {\n        url\n        alt\n        dimensions {\n          width\n          height\n        }\n      }\n      bottomRightImage {\n        url\n        alt\n        dimensions {\n          width\n          height\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query GamingPrizeMachineUserDetails {\n    AppContext {\n      ...GamingPrizeMachineUserDetails\n    }\n  }\n",
): (typeof documents)["\n  query GamingPrizeMachineUserDetails {\n    AppContext {\n      ...GamingPrizeMachineUserDetails\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query GamingPrizeMachineCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...GamingPrizeMachineCard\n    }\n  }\n",
): (typeof documents)["\n  query GamingPrizeMachineCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...GamingPrizeMachineCard\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment SportsbookLotteriesBetLegCardGroup on SportsbookLotteriesBetLegCardGroup {\n    __typename\n    urn\n    full: items {\n      edges {\n        node {\n          ... on BetLegCard {\n            urn\n            betUrn\n            __typename\n            leg {\n              ...SportsbookLotteriesBetLegFragment\n            }\n          }\n          ... on EventHeaderCard {\n            urn\n            __typename\n            title\n            tertiaryTitle\n            date\n          }\n        }\n      }\n    }\n  }\n\n  fragment SportsbookLotteriesBetLegFragment on BetLeg {\n    __typename\n    urn\n    type\n    parts {\n      ...SportsbookLotteriesLegPartFragment\n    }\n    result\n  }\n\n  fragment SportsbookLotteriesLegPartFragment on LegPart {\n    __typename\n    selectionId\n    selectionName\n  }\n",
): (typeof documents)["\n  fragment SportsbookLotteriesBetLegCardGroup on SportsbookLotteriesBetLegCardGroup {\n    __typename\n    urn\n    full: items {\n      edges {\n        node {\n          ... on BetLegCard {\n            urn\n            betUrn\n            __typename\n            leg {\n              ...SportsbookLotteriesBetLegFragment\n            }\n          }\n          ... on EventHeaderCard {\n            urn\n            __typename\n            title\n            tertiaryTitle\n            date\n          }\n        }\n      }\n    }\n  }\n\n  fragment SportsbookLotteriesBetLegFragment on BetLeg {\n    __typename\n    urn\n    type\n    parts {\n      ...SportsbookLotteriesLegPartFragment\n    }\n    result\n  }\n\n  fragment SportsbookLotteriesLegPartFragment on LegPart {\n    __typename\n    selectionId\n    selectionName\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment SportsbookLotteriesBetLegUserDetails on AppContextDetails {\n    __typename\n    urn\n    userdetails {\n      localeCodeBcp47\n      timezone\n    }\n  }\n",
): (typeof documents)["\n  fragment SportsbookLotteriesBetLegUserDetails on AppContextDetails {\n    __typename\n    urn\n    userdetails {\n      localeCodeBcp47\n      timezone\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query SportsbookLotteriesBetLegCardGroup($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...SportsbookLotteriesBetLegCardGroup\n    }\n  }\n",
): (typeof documents)["\n  query SportsbookLotteriesBetLegCardGroup($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...SportsbookLotteriesBetLegCardGroup\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query SportsbookLotteriesBetLegUserDetails {\n    AppContext {\n      ...SportsbookLotteriesBetLegUserDetails\n    }\n  }\n",
): (typeof documents)["\n  query SportsbookLotteriesBetLegUserDetails {\n    AppContext {\n      ...SportsbookLotteriesBetLegUserDetails\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment BreadcrumbsCard on BreadcrumbsCard {\n    __typename\n    urn\n    items {\n      ... on HomeBreadcrumb {\n        __typename\n        displayName {\n          ... on DisplayNameTranslationKey {\n            translationKey\n          }\n        }\n        homeView {\n          urn\n        }\n      }\n      ... on SportBreadcrumb {\n        __typename\n        sportView {\n          urn\n          url\n          sport {\n            name\n          }\n        }\n      }\n      ... on CompetitionBreadcrumb {\n        __typename\n        competitionView {\n          urn\n          url\n          competition {\n            name\n          }\n        }\n      }\n      ... on EventBreadcrumb {\n        __typename\n        eventView {\n          urn\n          url\n          sportevent {\n            name\n          }\n        }\n      }\n      ... on RaceBreadcrumb {\n        __typename\n        raceView {\n          urn\n          url\n          race {\n            name\n          }\n        }\n      }\n      ... on MarketBreadcrumb {\n        __typename\n        marketView {\n          urn\n          url\n          mainMarket {\n            ... on SportsbookMarket {\n              name\n            }\n          }\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment BreadcrumbsCard on BreadcrumbsCard {\n    __typename\n    urn\n    items {\n      ... on HomeBreadcrumb {\n        __typename\n        displayName {\n          ... on DisplayNameTranslationKey {\n            translationKey\n          }\n        }\n        homeView {\n          urn\n        }\n      }\n      ... on SportBreadcrumb {\n        __typename\n        sportView {\n          urn\n          url\n          sport {\n            name\n          }\n        }\n      }\n      ... on CompetitionBreadcrumb {\n        __typename\n        competitionView {\n          urn\n          url\n          competition {\n            name\n          }\n        }\n      }\n      ... on EventBreadcrumb {\n        __typename\n        eventView {\n          urn\n          url\n          sportevent {\n            name\n          }\n        }\n      }\n      ... on RaceBreadcrumb {\n        __typename\n        raceView {\n          urn\n          url\n          race {\n            name\n          }\n        }\n      }\n      ... on MarketBreadcrumb {\n        __typename\n        marketView {\n          urn\n          url\n          mainMarket {\n            ... on SportsbookMarket {\n              name\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query BreadcrumbsCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...BreadcrumbsCard\n    }\n  }\n",
): (typeof documents)["\n  query BreadcrumbsCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...BreadcrumbsCard\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment GenericSwitcherCard on GenericSwitcherCard {\n    __typename\n    urn\n    filterTitle {\n      translated\n      translate {\n        key\n      }\n    }\n    selectedViewLink {\n      label\n      viewLink {\n        viewUrn\n        viewUrl\n      }\n    }\n    headerTheming\n  }\n",
): (typeof documents)["\n  fragment GenericSwitcherCard on GenericSwitcherCard {\n    __typename\n    urn\n    filterTitle {\n      translated\n      translate {\n        key\n      }\n    }\n    selectedViewLink {\n      label\n      viewLink {\n        viewUrn\n        viewUrl\n      }\n    }\n    headerTheming\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment GenericSwitcherCardSiblings on GenericSwitcherCard {\n    __typename\n    urn\n    siblingViews {\n      edges {\n        node {\n          label\n          viewLink {\n            viewUrn\n            viewUrl\n          }\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment GenericSwitcherCardSiblings on GenericSwitcherCard {\n    __typename\n    urn\n    siblingViews {\n      edges {\n        node {\n          label\n          viewLink {\n            viewUrn\n            viewUrl\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query GenericSwitcherCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...GenericSwitcherCard\n    }\n  }\n",
): (typeof documents)["\n  query GenericSwitcherCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...GenericSwitcherCard\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query GenericSwitcherCardSiblings($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...GenericSwitcherCardSiblings\n    }\n  }\n",
): (typeof documents)["\n  query GenericSwitcherCardSiblings($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...GenericSwitcherCardSiblings\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment QuicklinksGridCardGroupItems on QuicklinksGridCardGroupItemsConnection {\n    __typename\n    edges {\n      __typename\n      isExpanded\n      style\n      label\n      icon {\n        id\n        category\n      }\n      node {\n        ...SportViewLinkItem\n        ...CompetitionViewLinkItem\n        ...EventViewLinkItem\n        ...RaceViewLinkItem\n        ...GenericViewLinkItem\n      }  \n    }\n  }\n",
): (typeof documents)["\n  fragment QuicklinksGridCardGroupItems on QuicklinksGridCardGroupItemsConnection {\n    __typename\n    edges {\n      __typename\n      isExpanded\n      style\n      label\n      icon {\n        id\n        category\n      }\n      node {\n        ...SportViewLinkItem\n        ...CompetitionViewLinkItem\n        ...EventViewLinkItem\n        ...RaceViewLinkItem\n        ...GenericViewLinkItem\n      }  \n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment QuicklinksGridCardGroupItemPartials on QuicklinksGridCardGroupItemsConnection {\n    __typename\n    edges {\n      __typename\n      isExpanded\n      style\n      label\n      icon {\n        id\n        category\n      }\n      node {\n        __typename\n        ... on SportViewLinkCard { urn }\n        ... on CompetitionViewLinkCard { urn }\n        ... on EventViewLinkCard { urn }\n        ... on RaceViewLinkCard { urn }\n        ... on GenericViewLinkCard { urn }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment QuicklinksGridCardGroupItemPartials on QuicklinksGridCardGroupItemsConnection {\n    __typename\n    edges {\n      __typename\n      isExpanded\n      style\n      label\n      icon {\n        id\n        category\n      }\n      node {\n        __typename\n        ... on SportViewLinkCard { urn }\n        ... on CompetitionViewLinkCard { urn }\n        ... on EventViewLinkCard { urn }\n        ... on RaceViewLinkCard { urn }\n        ... on GenericViewLinkCard { urn }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment QuicklinksGridCardGroup on QuicklinksGridCardGroup {\n    __typename\n    urn\n    quicklinksGridTitle: title\n    hideArrows\n    hideIcons\n    items (first: 4) {\n      ...QuicklinksGridCardGroupItems\n    }\n    partials: items {\n      ...QuicklinksGridCardGroupItemPartials\n    }\n  }\n",
): (typeof documents)["\n  fragment QuicklinksGridCardGroup on QuicklinksGridCardGroup {\n    __typename\n    urn\n    quicklinksGridTitle: title\n    hideArrows\n    hideIcons\n    items (first: 4) {\n      ...QuicklinksGridCardGroupItems\n    }\n    partials: items {\n      ...QuicklinksGridCardGroupItemPartials\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query QuicklinksGridCardGroup($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...QuicklinksGridCardGroup\n    }\n  }\n",
): (typeof documents)["\n  query QuicklinksGridCardGroup($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...QuicklinksGridCardGroup\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment SportViewLinkItem on SportViewLinkCard {\n    __typename\n    urn\n    viewLink {\n      viewUrn\n      viewUrl\n    }\n    sport {\n      ... on Sport {\n        __typename\n        urn\n        name\n        sportId\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment SportViewLinkItem on SportViewLinkCard {\n    __typename\n    urn\n    viewLink {\n      viewUrn\n      viewUrl\n    }\n    sport {\n      ... on Sport {\n        __typename\n        urn\n        name\n        sportId\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment CompetitionViewLinkItem on CompetitionViewLinkCard {\n    __typename\n    urn\n    viewLink {\n      viewUrn\n      viewUrl\n    }\n    competition {\n      ... on Competition {\n        __typename\n        urn\n        name\n        competitionId\n        sport {\n          ... on Sport {\n            __typename\n            urn\n            name\n            sportId\n          }\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment CompetitionViewLinkItem on CompetitionViewLinkCard {\n    __typename\n    urn\n    viewLink {\n      viewUrn\n      viewUrl\n    }\n    competition {\n      ... on Competition {\n        __typename\n        urn\n        name\n        competitionId\n        sport {\n          ... on Sport {\n            __typename\n            urn\n            name\n            sportId\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment EventViewLinkItem on EventViewLinkCard {\n    __typename\n    urn\n    viewLink {\n      viewUrn\n      viewUrl\n    }\n    sportevent {\n      ... on SportsEvent {\n        __typename\n        urn\n        eventId\n        name\n        openDate\n        competition {\n          ... on Competition {\n            __typename\n            urn\n            name\n            competitionId\n            sport {\n              ... on Sport {\n                __typename\n                urn\n                name\n                sportId\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment EventViewLinkItem on EventViewLinkCard {\n    __typename\n    urn\n    viewLink {\n      viewUrn\n      viewUrl\n    }\n    sportevent {\n      ... on SportsEvent {\n        __typename\n        urn\n        eventId\n        name\n        openDate\n        competition {\n          ... on Competition {\n            __typename\n            urn\n            name\n            competitionId\n            sport {\n              ... on Sport {\n                __typename\n                urn\n                name\n                sportId\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment RaceViewLinkItem on RaceViewLinkCard {\n    __typename\n    urn\n    race {\n      ... on Race {\n        __typename\n        urn\n        startTime\n        raceId\n        name\n        meeting {\n          ... on Meeting {\n            __typename\n            urn\n            name\n            meetingId\n            country\n            countryFlag {\n              small\n              medium\n              large\n            }\n            venue\n            date\n            sport {\n              ... on Sport {\n                __typename\n                urn\n                name\n                sportId\n              }\n            }\n          }\n        }\n      }\n    }\n    viewLink {\n      viewUrn\n      viewUrl\n    }\n  }\n",
): (typeof documents)["\n  fragment RaceViewLinkItem on RaceViewLinkCard {\n    __typename\n    urn\n    race {\n      ... on Race {\n        __typename\n        urn\n        startTime\n        raceId\n        name\n        meeting {\n          ... on Meeting {\n            __typename\n            urn\n            name\n            meetingId\n            country\n            countryFlag {\n              small\n              medium\n              large\n            }\n            venue\n            date\n            sport {\n              ... on Sport {\n                __typename\n                urn\n                name\n                sportId\n              }\n            }\n          }\n        }\n      }\n    }\n    viewLink {\n      viewUrn\n      viewUrl\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment GenericViewLinkItem on GenericViewLinkCard {\n    __typename\n    urn\n    genericViewLinkTitle: title {\n      __typename\n      ... on DisplayNameTitle {\n        name\n      }\n      ... on DisplayNameTranslationKey {\n        translationKey\n      }\n    }\n    viewLink {\n      viewUrn\n      viewUrl\n      viewDisplayMode\n    }\n    badge\n    sportIcon {\n      ... on SportIcon {\n        sport {\n          sportId\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment GenericViewLinkItem on GenericViewLinkCard {\n    __typename\n    urn\n    genericViewLinkTitle: title {\n      __typename\n      ... on DisplayNameTitle {\n        name\n      }\n      ... on DisplayNameTranslationKey {\n        translationKey\n      }\n    }\n    viewLink {\n      viewUrn\n      viewUrl\n      viewDisplayMode\n    }\n    badge\n    sportIcon {\n      ... on SportIcon {\n        sport {\n          sportId\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query QuicklinksGridItemCard(\n    $urn: [URN!]!\n  ) {\n    Cards(cardsURN: $urn) {\n      ... on SportViewLinkCard {\n        ...SportViewLinkItem\n      }\n      ... on CompetitionViewLinkCard {\n        ...CompetitionViewLinkItem\n      }\n      ... on EventViewLinkCard {\n        ...EventViewLinkItem\n      }\n      ... on RaceViewLinkCard {\n        ...RaceViewLinkItem\n      }\n      ... on GenericViewLinkCard {\n        ...GenericViewLinkItem\n      }\n    }\n  }\n",
): (typeof documents)["\n  query QuicklinksGridItemCard(\n    $urn: [URN!]!\n  ) {\n    Cards(cardsURN: $urn) {\n      ... on SportViewLinkCard {\n        ...SportViewLinkItem\n      }\n      ... on CompetitionViewLinkCard {\n        ...CompetitionViewLinkItem\n      }\n      ... on EventViewLinkCard {\n        ...EventViewLinkItem\n      }\n      ... on RaceViewLinkCard {\n        ...RaceViewLinkItem\n      }\n      ... on GenericViewLinkCard {\n        ...GenericViewLinkItem\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query QuicklinksGridItemCardUserDetails {\n    AppContext {\n      ... on AppContextDetails {\n        __typename\n        userdetails {\n          loggedIn\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  query QuicklinksGridItemCardUserDetails {\n    AppContext {\n      ... on AppContextDetails {\n        __typename\n        userdetails {\n          loggedIn\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment RaceSwitcherCardUserDetails on AppContextDetails {\n    __typename\n    urn\n    userdetails {\n      localeCodeBcp47\n      timezone\n    }\n  }\n",
): (typeof documents)["\n  fragment RaceSwitcherCardUserDetails on AppContextDetails {\n    __typename\n    urn\n    userdetails {\n      localeCodeBcp47\n      timezone\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment RaceSwitcherCard on RaceSwitcherCard {\n    __typename\n    urn\n    filterTitle {\n      translated\n      translate {\n        key\n      }\n    }\n    race {\n      name\n      meeting {\n        urn\n        name\n        meetingId\n        countryFlag {\n          vector\n          small\n        }\n        venue\n        date\n      }\n    }\n    headerTheming\n  }\n",
): (typeof documents)["\n  fragment RaceSwitcherCard on RaceSwitcherCard {\n    __typename\n    urn\n    filterTitle {\n      translated\n      translate {\n        key\n      }\n    }\n    race {\n      name\n      meeting {\n        urn\n        name\n        meetingId\n        countryFlag {\n          vector\n          small\n        }\n        venue\n        date\n      }\n    }\n    headerTheming\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment RaceSwitcherCardSiblings on RaceSwitcherCard {\n    __typename\n    urn\n    siblingViews {\n      edges {\n        node {\n          race {\n            meeting {\n              urn\n              venue\n              countryFlag {\n                vector\n                small\n              }\n            }\n          }\n          viewLink {\n            viewUrn\n            viewUrl\n          }\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment RaceSwitcherCardSiblings on RaceSwitcherCard {\n    __typename\n    urn\n    siblingViews {\n      edges {\n        node {\n          race {\n            meeting {\n              urn\n              venue\n              countryFlag {\n                vector\n                small\n              }\n            }\n          }\n          viewLink {\n            viewUrn\n            viewUrl\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query RaceSwitcherCardUserDetails {\n    AppContext {\n      ...RaceSwitcherCardUserDetails\n    }\n  }\n",
): (typeof documents)["\n  query RaceSwitcherCardUserDetails {\n    AppContext {\n      ...RaceSwitcherCardUserDetails\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query RaceSwitcherCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...RaceSwitcherCard\n    }\n  }\n",
): (typeof documents)["\n  query RaceSwitcherCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...RaceSwitcherCard\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query RaceSwitcherCardSiblings($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...RaceSwitcherCardSiblings\n    }\n  }\n",
): (typeof documents)["\n  query RaceSwitcherCardSiblings($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...RaceSwitcherCardSiblings\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment SelfExclusionUserDetails on AppContextDetails {\n    __typename\n    urn\n    userdetails {\n      localeCodeBcp47\n      jurisdiction {\n        jurisdiction\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment SelfExclusionUserDetails on AppContextDetails {\n    __typename\n    urn\n    userdetails {\n      localeCodeBcp47\n      jurisdiction {\n        jurisdiction\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment SelfExclusionCard on SelfExclusionCard {\n    __typename\n    urn\n    message: text {\n      ... on DisplayNameTitle {\n        name\n      }\n    }\n    saferGamblingLink {\n      viewUrn\n      viewUrl\n    }\n    supportLink {\n      viewUrn\n      viewUrl\n    }\n  }\n",
): (typeof documents)["\n  fragment SelfExclusionCard on SelfExclusionCard {\n    __typename\n    urn\n    message: text {\n      ... on DisplayNameTitle {\n        name\n      }\n    }\n    saferGamblingLink {\n      viewUrn\n      viewUrl\n    }\n    supportLink {\n      viewUrn\n      viewUrl\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query SelfExclusionUserDetails {\n    AppContext {\n      ...SelfExclusionUserDetails\n    }\n  }\n",
): (typeof documents)["\n  query SelfExclusionUserDetails {\n    AppContext {\n      ...SelfExclusionUserDetails\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query SelfExclusionCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...SelfExclusionCard\n    }\n  }\n",
): (typeof documents)["\n  query SelfExclusionCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...SelfExclusionCard\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment XSellBar on XSellBar {\n    __typename\n    sections {\n      sectionType\n      sectionUrl\n    }\n  }\n",
): (typeof documents)["\n  fragment XSellBar on XSellBar {\n    __typename\n    sections {\n      sectionType\n      sectionUrl\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query XSellBar {\n    XSellBar {\n      ...XSellBar\n    }\n  }\n",
): (typeof documents)["\n  query XSellBar {\n    XSellBar {\n      ...XSellBar\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment BetOpportunityPromoCardTermsAndConditions on PromoTermsAndConditions {\n    summary\n    link {\n      label {\n        ... on DisplayNameTitle {\n          name\n        }\n        ... on DisplayNameTranslationKey {\n          translationKey\n        }\n      }\n      viewLink {\n        viewUrn\n        viewUrl\n        viewDisplayMode\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment BetOpportunityPromoCardTermsAndConditions on PromoTermsAndConditions {\n    summary\n    link {\n      label {\n        ... on DisplayNameTitle {\n          name\n        }\n        ... on DisplayNameTranslationKey {\n          translationKey\n        }\n      }\n      viewLink {\n        viewUrn\n        viewUrl\n        viewDisplayMode\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment BetOpportunityPromoCardUserDetails on AppContextDetails {\n    __typename\n    brandSettings {\n      name\n      isActive\n    }\n    userdetails {\n      localeCodeBcp47\n    }\n  }\n",
): (typeof documents)["\n  fragment BetOpportunityPromoCardUserDetails on AppContextDetails {\n    __typename\n    brandSettings {\n      name\n      isActive\n    }\n    userdetails {\n      localeCodeBcp47\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment BetOpportunityPromoCard on BetOpportunityPromoCard {\n    __typename\n    urn\n    theme\n    title\n    subTitle\n    promoImage {\n      url\n    }\n    ladderLevels{\n      __typename\n      fulfilled\n      levels{\n        __typename\n        current\n        target\n      }\n    }\n    termsAndConditions {\n      ...BetOpportunityPromoCardTermsAndConditions\n    }\n    betOpportunityAction: action {\n      __typename\n      link {\n        label {\n          ... on DisplayNameTitle {\n            name\n          }\n          ... on DisplayNameTranslationKey {\n            translationKey\n          }\n        }\n        viewLink {\n          viewUrn\n          viewUrl\n          viewDisplayMode\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment BetOpportunityPromoCard on BetOpportunityPromoCard {\n    __typename\n    urn\n    theme\n    title\n    subTitle\n    promoImage {\n      url\n    }\n    ladderLevels{\n      __typename\n      fulfilled\n      levels{\n        __typename\n        current\n        target\n      }\n    }\n    termsAndConditions {\n      ...BetOpportunityPromoCardTermsAndConditions\n    }\n    betOpportunityAction: action {\n      __typename\n      link {\n        label {\n          ... on DisplayNameTitle {\n            name\n          }\n          ... on DisplayNameTranslationKey {\n            translationKey\n          }\n        }\n        viewLink {\n          viewUrn\n          viewUrl\n          viewDisplayMode\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query BetOpportunityPromoCard(\n    $urn: [URN!]!\n  ) {\n    Cards(cardsURN: $urn) {\n      ...BetOpportunityPromoCard\n    }\n  }\n",
): (typeof documents)["\n  query BetOpportunityPromoCard(\n    $urn: [URN!]!\n  ) {\n    Cards(cardsURN: $urn) {\n      ...BetOpportunityPromoCard\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query BetOpportunityPromoCardUserDetails {\n    AppContext {\n      ...BetOpportunityPromoCardUserDetails\n    }\n  }\n",
): (typeof documents)["\n  query BetOpportunityPromoCardUserDetails {\n    AppContext {\n      ...BetOpportunityPromoCardUserDetails\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment EditorialPromoCardTermsAndConditions on PromoTermsAndConditions {\n    summary\n    link {\n      label {\n        ... on DisplayNameTitle {\n          name\n        }\n        ... on DisplayNameTranslationKey {\n          translationKey\n        }\n      }\n      viewLink {\n        viewUrn\n        viewUrl\n        viewDisplayMode\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment EditorialPromoCardTermsAndConditions on PromoTermsAndConditions {\n    summary\n    link {\n      label {\n        ... on DisplayNameTitle {\n          name\n        }\n        ... on DisplayNameTranslationKey {\n          translationKey\n        }\n      }\n      viewLink {\n        viewUrn\n        viewUrl\n        viewDisplayMode\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment EditorialPromoCardUserDetails on AppContextDetails {\n    __typename\n    brandSettings {\n      name\n      isActive\n    }\n    userdetails {\n      localeCodeBcp47\n    }\n  }\n",
): (typeof documents)["\n  fragment EditorialPromoCardUserDetails on AppContextDetails {\n    __typename\n    brandSettings {\n      name\n      isActive\n    }\n    userdetails {\n      localeCodeBcp47\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment EditorialPromoCard on EditorialPromoCard {\n  __typename\n  urn\n  theme\n  title\n  subTitle\n  promoImage {\n    url\n  }\n  promoTag {\n    ... on PromoIconTag {\n      iconTag\n    }\n    ... on PromoLabelTag {\n      label\n    }\n  }\n  termsAndConditions {\n    ...EditorialPromoCardTermsAndConditions\n  }\n  editorialAction: action {\n    __typename\n    link {\n      label {\n        ... on DisplayNameTitle {\n          name\n        }\n        ... on DisplayNameTranslationKey {\n          translationKey\n        }\n      }\n      viewLink {\n        viewUrn\n        viewUrl\n        viewDisplayMode\n      }\n    }\n  }\n}\n",
): (typeof documents)["\n  fragment EditorialPromoCard on EditorialPromoCard {\n  __typename\n  urn\n  theme\n  title\n  subTitle\n  promoImage {\n    url\n  }\n  promoTag {\n    ... on PromoIconTag {\n      iconTag\n    }\n    ... on PromoLabelTag {\n      label\n    }\n  }\n  termsAndConditions {\n    ...EditorialPromoCardTermsAndConditions\n  }\n  editorialAction: action {\n    __typename\n    link {\n      label {\n        ... on DisplayNameTitle {\n          name\n        }\n        ... on DisplayNameTranslationKey {\n          translationKey\n        }\n      }\n      viewLink {\n        viewUrn\n        viewUrl\n        viewDisplayMode\n      }\n    }\n  }\n}\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query EditorialPromoCard(\n    $urn: [URN!]!\n  ) {\n    Cards(cardsURN: $urn) {\n      ...EditorialPromoCard\n    }\n  }\n",
): (typeof documents)["\n  query EditorialPromoCard(\n    $urn: [URN!]!\n  ) {\n    Cards(cardsURN: $urn) {\n      ...EditorialPromoCard\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query EditorialPromoCardUserDetails {\n    AppContext {\n      ...EditorialPromoCardUserDetails\n    }\n  }\n",
): (typeof documents)["\n  query EditorialPromoCardUserDetails {\n    AppContext {\n      ...EditorialPromoCardUserDetails\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment LoyaltyPromotion on LoyaltyPromotion {\n    __typename\n    urn\n    name\n    title\n    promoImage {\n      url\n    }\n    state {\n      optInState\n      label {\n        ... on DisplayNameTitle { \n          __typename\n          name\n        }\n        ... on DisplayNameTranslationKey {\n          __typename\n          translationKey\n        }\n      }\n      link {\n        label {\n          ... on DisplayNameTitle {\n            __typename\n            name\n          }\n          ... on DisplayNameTranslationKey {\n            __typename\n            translationKey\n          }\n        }\n        viewLink {\n          viewUrn\n          viewUrl\n          viewDisplayMode\n        }\n      }\n    }\n    termsAndConditions {\n      summary\n      link {\n        label {\n          ... on DisplayNameTitle {\n            __typename\n            name\n          }\n          ... on DisplayNameTranslationKey {\n            __typename\n            translationKey\n          }\n        }\n        viewLink {\n          viewUrn\n          viewUrl\n          viewDisplayMode\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment LoyaltyPromotion on LoyaltyPromotion {\n    __typename\n    urn\n    name\n    title\n    promoImage {\n      url\n    }\n    state {\n      optInState\n      label {\n        ... on DisplayNameTitle { \n          __typename\n          name\n        }\n        ... on DisplayNameTranslationKey {\n          __typename\n          translationKey\n        }\n      }\n      link {\n        label {\n          ... on DisplayNameTitle {\n            __typename\n            name\n          }\n          ... on DisplayNameTranslationKey {\n            __typename\n            translationKey\n          }\n        }\n        viewLink {\n          viewUrn\n          viewUrl\n          viewDisplayMode\n        }\n      }\n    }\n    termsAndConditions {\n      summary\n      link {\n        label {\n          ... on DisplayNameTitle {\n            __typename\n            name\n          }\n          ... on DisplayNameTranslationKey {\n            __typename\n            translationKey\n          }\n        }\n        viewLink {\n          viewUrn\n          viewUrl\n          viewDisplayMode\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  mutation OptinCppPromo($urn: URN!) {\n    optinCppPromo(urn: $urn) {\n      ...LoyaltyPromotion\n    }\n  }\n",
): (typeof documents)["\n  mutation OptinCppPromo($urn: URN!) {\n    optinCppPromo(urn: $urn) {\n      ...LoyaltyPromotion\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment MiniPromoBannerCard on MiniPromoBannerCard {\n    __typename\n    urn\n    theme\n    loyaltyPromotion {\n      ...LoyaltyPromotion\n    }\n  }\n",
): (typeof documents)["\n  fragment MiniPromoBannerCard on MiniPromoBannerCard {\n    __typename\n    urn\n    theme\n    loyaltyPromotion {\n      ...LoyaltyPromotion\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment LoyaltyPromoCard on LoyaltyPromoCard {\n    __typename\n    urn\n    theme\n    loyaltyPromotion {\n      ...LoyaltyPromotion\n    }\n  }\n",
): (typeof documents)["\n  fragment LoyaltyPromoCard on LoyaltyPromoCard {\n    __typename\n    urn\n    theme\n    loyaltyPromotion {\n      ...LoyaltyPromotion\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment LoyaltyPromoCardUserDetails on AppContextDetails {\n    __typename\n    brandSettings {\n      name\n      isActive\n    }\n  }\n",
): (typeof documents)["\n  fragment LoyaltyPromoCardUserDetails on AppContextDetails {\n    __typename\n    brandSettings {\n      name\n      isActive\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query LoyaltyPromoCard(\n    $urn: [URN!]!\n  ) {\n    Cards(cardsURN: $urn) {\n      ...LoyaltyPromoCard\n      ...MiniPromoBannerCard\n    }\n  }\n",
): (typeof documents)["\n  query LoyaltyPromoCard(\n    $urn: [URN!]!\n  ) {\n    Cards(cardsURN: $urn) {\n      ...LoyaltyPromoCard\n      ...MiniPromoBannerCard\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query LoyaltyPromoCardUserDetails {\n    AppContext {\n      ...LoyaltyPromoCardUserDetails\n    }\n  }\n",
): (typeof documents)["\n  query LoyaltyPromoCardUserDetails {\n    AppContext {\n      ...LoyaltyPromoCardUserDetails\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment PopularBettingOpportunityIsPotentialBet on PopularBettingOpportunity {\n    __typename\n    urn\n    selections {\n      __typename\n      runnerLiveData @client {\n        __typename\n        urn\n        isPotentialBet\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment PopularBettingOpportunityIsPotentialBet on PopularBettingOpportunity {\n    __typename\n    urn\n    selections {\n      __typename\n      runnerLiveData @client {\n        __typename\n        urn\n        isPotentialBet\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment PriceBoostMultiplePromoCardCombinedOdds on PopularBettingOpportunity {\n    __typename\n    urn\n    odds @client {\n      decimal\n      fractional {\n        numerator\n        denominator\n      }\n      american\n    }\n    originalOdds @client {\n      decimal\n      fractional {\n        numerator\n        denominator\n      }\n      american\n    }\n  }\n",
): (typeof documents)["\n  fragment PriceBoostMultiplePromoCardCombinedOdds on PopularBettingOpportunity {\n    __typename\n    urn\n    odds @client {\n      decimal\n      fractional {\n        numerator\n        denominator\n      }\n      american\n    }\n    originalOdds @client {\n      decimal\n      fractional {\n        numerator\n        denominator\n      }\n      american\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment PriceBoostMultiplePromoCardUserDetails on AppContextDetails {\n    __typename\n    brandSettings {\n      name\n      isActive\n    }\n    userdetails {\n      localeCode\n    }\n    preferences {\n      sportsbookOddsDisplay {\n        urn\n        selectedOddsDisplayFormat\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment PriceBoostMultiplePromoCardUserDetails on AppContextDetails {\n    __typename\n    brandSettings {\n      name\n      isActive\n    }\n    userdetails {\n      localeCode\n    }\n    preferences {\n      sportsbookOddsDisplay {\n        urn\n        selectedOddsDisplayFormat\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment PriceBoostMultiplePromoCardTermsAndConditions on PromoTermsAndConditions {\n    summary\n    link {\n      label {\n        ... on DisplayNameTitle {\n          name\n        }\n        ... on DisplayNameTranslationKey {\n          translationKey\n        }\n      }\n      viewLink {\n        viewUrn\n        viewUrl\n        viewDisplayMode\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment PriceBoostMultiplePromoCardTermsAndConditions on PromoTermsAndConditions {\n    summary\n    link {\n      label {\n        ... on DisplayNameTitle {\n          name\n        }\n        ... on DisplayNameTranslationKey {\n          translationKey\n        }\n      }\n      viewLink {\n        viewUrn\n        viewUrl\n        viewDisplayMode\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment PriceBoostMultiplePromoCardPopularBettingOpportunity on PopularBettingOpportunity {\n    __typename\n    urn\n    count\n    bettingOpportunityId: id\n    selections {\n      __typename\n      market {\n        urn\n      }\n      runner {\n        runnerURN\n        selectionId\n      }\n      raceRunner {\n        __typename\n        urn\n        raceURN\n        selectionId\n        horse {\n          name\n          age\n          color\n          sex\n        }\n        details {\n          jockeyName\n          trainerName\n          silk\n          saddleCloth\n        }\n      }\n    }\n    displayName\n    type\n  }\n",
): (typeof documents)["\n  fragment PriceBoostMultiplePromoCardPopularBettingOpportunity on PopularBettingOpportunity {\n    __typename\n    urn\n    count\n    bettingOpportunityId: id\n    selections {\n      __typename\n      market {\n        urn\n      }\n      runner {\n        runnerURN\n        selectionId\n      }\n      raceRunner {\n        __typename\n        urn\n        raceURN\n        selectionId\n        horse {\n          name\n          age\n          color\n          sex\n        }\n        details {\n          jockeyName\n          trainerName\n          silk\n          saddleCloth\n        }\n      }\n    }\n    displayName\n    type\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment PriceBoostMultiplePromoCard on PriceBoostMultiplePromoCard {\n    __typename\n    urn\n    theme\n    title\n    subTitle\n    wasPrice\n    termsAndConditions {\n      ...PriceBoostMultiplePromoCardTermsAndConditions\n    }\n    popularbettingopportunity {\n      ...PriceBoostMultiplePromoCardPopularBettingOpportunity\n    }\n    promoTag {\n      ... on PromoIconTag {\n        iconTag\n      }\n      ... on PromoLabelTag {\n        label\n      }\n    }\n    priceBoostMultipleImage: promoImage {\n      url\n    }\n    promoAction {\n      __typename\n      link {\n        viewLink {\n          viewUrn\n          viewUrl\n          viewDisplayMode\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment PriceBoostMultiplePromoCard on PriceBoostMultiplePromoCard {\n    __typename\n    urn\n    theme\n    title\n    subTitle\n    wasPrice\n    termsAndConditions {\n      ...PriceBoostMultiplePromoCardTermsAndConditions\n    }\n    popularbettingopportunity {\n      ...PriceBoostMultiplePromoCardPopularBettingOpportunity\n    }\n    promoTag {\n      ... on PromoIconTag {\n        iconTag\n      }\n      ... on PromoLabelTag {\n        label\n      }\n    }\n    priceBoostMultipleImage: promoImage {\n      url\n    }\n    promoAction {\n      __typename\n      link {\n        viewLink {\n          viewUrn\n          viewUrl\n          viewDisplayMode\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query PriceBoostMultiplePromoCard(\n    $urn: [URN!]!\n  ) {\n    Cards(cardsURN: $urn) {\n      ...PriceBoostMultiplePromoCard\n    }\n  }\n",
): (typeof documents)["\n  query PriceBoostMultiplePromoCard(\n    $urn: [URN!]!\n  ) {\n    Cards(cardsURN: $urn) {\n      ...PriceBoostMultiplePromoCard\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query PriceBoostMultiplePromoCardUserDetails {\n    AppContext {\n      ...PriceBoostMultiplePromoCardUserDetails\n    }\n  }\n",
): (typeof documents)["\n  query PriceBoostMultiplePromoCardUserDetails {\n    AppContext {\n      ...PriceBoostMultiplePromoCardUserDetails\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment PromotionsCardGroup on PromotionsCardGroup {\n    __typename\n    urn\n    promotionsCardGroupTitle: title {\n      ... on DisplayNameTitle {\n        name\n      }\n      ... on DisplayNameTranslationKey {\n        translationKey\n      }\n    }\n    items (first: 2) {\n      edges {\n        node {\n          ...BetOpportunityPromoCard\n          ...EditorialPromoCard\n          ...LoyaltyPromoCard\n          ...SelectionPromoCard\n          ...PriceBoostMultiplePromoCard\n        }\n      }\n    }\n    partials: items {\n      edges {\n        node {\n          __typename\n          ... on BetOpportunityPromoCard { urn }\n          ... on EditorialPromoCard { urn }\n          ... on LoyaltyPromoCard { urn }\n          ... on SelectionPromoCard { urn }\n          ... on PriceBoostMultiplePromoCard { urn }\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment PromotionsCardGroup on PromotionsCardGroup {\n    __typename\n    urn\n    promotionsCardGroupTitle: title {\n      ... on DisplayNameTitle {\n        name\n      }\n      ... on DisplayNameTranslationKey {\n        translationKey\n      }\n    }\n    items (first: 2) {\n      edges {\n        node {\n          ...BetOpportunityPromoCard\n          ...EditorialPromoCard\n          ...LoyaltyPromoCard\n          ...SelectionPromoCard\n          ...PriceBoostMultiplePromoCard\n        }\n      }\n    }\n    partials: items {\n      edges {\n        node {\n          __typename\n          ... on BetOpportunityPromoCard { urn }\n          ... on EditorialPromoCard { urn }\n          ... on LoyaltyPromoCard { urn }\n          ... on SelectionPromoCard { urn }\n          ... on PriceBoostMultiplePromoCard { urn }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query PromotionsCardGroup(\n    $urn: [URN!]!\n  ) {\n    Cards(cardsURN: $urn) {\n      ...PromotionsCardGroup\n    }\n  }\n",
): (typeof documents)["\n  query PromotionsCardGroup(\n    $urn: [URN!]!\n  ) {\n    Cards(cardsURN: $urn) {\n      ...PromotionsCardGroup\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query PromotionsCardGroupUserDetails {\n    AppContext {\n      ... on AppContextDetails {\n        __typename\n        brandSettings {\n          name\n          isActive\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  query PromotionsCardGroupUserDetails {\n    AppContext {\n      ... on AppContextDetails {\n        __typename\n        brandSettings {\n          name\n          isActive\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment PromotionsHubCardTermsAndConditions on PromoTermsAndConditions {\n    summary\n    link {\n      label {\n        ... on DisplayNameTitle {\n          name\n        }\n        ... on DisplayNameTranslationKey {\n          translationKey\n        }\n      }\n      viewLink {\n        viewUrn\n        viewUrl\n        viewDisplayMode\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment PromotionsHubCardTermsAndConditions on PromoTermsAndConditions {\n    summary\n    link {\n      label {\n        ... on DisplayNameTitle {\n          name\n        }\n        ... on DisplayNameTranslationKey {\n          translationKey\n        }\n      }\n      viewLink {\n        viewUrn\n        viewUrl\n        viewDisplayMode\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment PromotionsHubPromotionFields on PromotionsHubPromotion {\n    urn\n    name\n    title\n    description\n    status\n    promoCode\n    steps {\n      action\n      completed\n    }\n    showTimeLeft\n    canOptIn\n    canConsent\n    eligible\n    badge {\n      text\n      state\n    }\n    hasAccepted\n    optInState\n    optInStartDate\n    promoStateExpiryDate\n    termsAndConditions {\n      ...PromotionsHubCardTermsAndConditions\n    }\n    action {\n      label\n      actionType\n      viewLink {\n        viewUrn\n        viewUrl\n        viewDisplayMode\n      }\n    }\n    images {\n      url\n      width\n      height\n      tag\n    }\n  }\n",
): (typeof documents)["\n  fragment PromotionsHubPromotionFields on PromotionsHubPromotion {\n    urn\n    name\n    title\n    description\n    status\n    promoCode\n    steps {\n      action\n      completed\n    }\n    showTimeLeft\n    canOptIn\n    canConsent\n    eligible\n    badge {\n      text\n      state\n    }\n    hasAccepted\n    optInState\n    optInStartDate\n    promoStateExpiryDate\n    termsAndConditions {\n      ...PromotionsHubCardTermsAndConditions\n    }\n    action {\n      label\n      actionType\n      viewLink {\n        viewUrn\n        viewUrl\n        viewDisplayMode\n      }\n    }\n    images {\n      url\n      width\n      height\n      tag\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment PromotionsHubCard on PromotionsHubCard {\n    __typename\n    urn\n    theme\n    promotionsHubPromotion {\n      ...PromotionsHubPromotionFields\n    }\n  }\n",
): (typeof documents)["\n  fragment PromotionsHubCard on PromotionsHubCard {\n    __typename\n    urn\n    theme\n    promotionsHubPromotion {\n      ...PromotionsHubPromotionFields\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  mutation OptinCppPromoHubCard($urn: URN!, $productExclusions: [ProductExclusion!]) @productExclusions(productExclusions: $productExclusions) {\n    optinCppPromo(urn: $urn) {\n      ... on PromotionsHubPromotion {\n        ...PromotionsHubPromotionFields\n      }\n    }\n  }\n",
): (typeof documents)["\n  mutation OptinCppPromoHubCard($urn: URN!, $productExclusions: [ProductExclusion!]) @productExclusions(productExclusions: $productExclusions) {\n    optinCppPromo(urn: $urn) {\n      ... on PromotionsHubPromotion {\n        ...PromotionsHubPromotionFields\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query PromotionsHubCard($urn: URN!, $productExclusions: [ProductExclusion!]) @productExclusions(productExclusions: $productExclusions) {\n    Cards(cardsURN: [$urn]) {\n      ...PromotionsHubCard\n    }\n  }\n",
): (typeof documents)["\n  query PromotionsHubCard($urn: URN!, $productExclusions: [ProductExclusion!]) @productExclusions(productExclusions: $productExclusions) {\n    Cards(cardsURN: [$urn]) {\n      ...PromotionsHubCard\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment LocalPromotionsHubCardGroup on PromotionsHubCardGroup {\n    __typename\n    urn\n    selectedPebble @client\n  }\n",
): (typeof documents)["\n  fragment LocalPromotionsHubCardGroup on PromotionsHubCardGroup {\n    __typename\n    urn\n    selectedPebble @client\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment PromotionsHubCardGroup on PromotionsHubCardGroup {\n    __typename\n    urn\n    emptyState\n    filterOptions {\n      promoTagGroups {\n        urn\n        label\n        count\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment PromotionsHubCardGroup on PromotionsHubCardGroup {\n    __typename\n    urn\n    emptyState\n    filterOptions {\n      promoTagGroups {\n        urn\n        label\n        count\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query PromotionsHubCardGroup(\n    $urn: [URN!]!\n    $filterBy: PromotionsHubFilterBy\n    $productExclusions: [ProductExclusion!]\n  ) @productExclusions(productExclusions: $productExclusions) {\n    Cards(cardsURN: $urn) {\n      ...PromotionsHubCardGroup\n      ... on PromotionsHubCardGroup {\n        items(first: 6, filterBy: $filterBy) {\n          edges {\n            node {\n              ...PromotionsHubCard\n            }\n          }\n        }\n        partials: items(filterBy: $filterBy) {\n          edges {\n            node {\n              ... on PromotionsHubCard {\n                urn\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  query PromotionsHubCardGroup(\n    $urn: [URN!]!\n    $filterBy: PromotionsHubFilterBy\n    $productExclusions: [ProductExclusion!]\n  ) @productExclusions(productExclusions: $productExclusions) {\n    Cards(cardsURN: $urn) {\n      ...PromotionsHubCardGroup\n      ... on PromotionsHubCardGroup {\n        items(first: 6, filterBy: $filterBy) {\n          edges {\n            node {\n              ...PromotionsHubCard\n            }\n          }\n        }\n        partials: items(filterBy: $filterBy) {\n          edges {\n            node {\n              ... on PromotionsHubCard {\n                urn\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query PromotionsHubCardGroupItems(\n    $urn: [URN!]!\n    $filterBy: PromotionsHubFilterBy\n    $productExclusions: [ProductExclusion!]\n  ) @productExclusions(productExclusions: $productExclusions) {\n    Cards(cardsURN: $urn) {\n      ... on PromotionsHubCardGroup {\n        __typename\n        urn\n        items(first: 6, filterBy: $filterBy) {\n          edges {\n            node {\n              ...PromotionsHubCard\n            }\n          }\n        }\n        partials: items(filterBy: $filterBy) {\n          edges {\n            node {\n              ... on PromotionsHubCard {\n                urn\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  query PromotionsHubCardGroupItems(\n    $urn: [URN!]!\n    $filterBy: PromotionsHubFilterBy\n    $productExclusions: [ProductExclusion!]\n  ) @productExclusions(productExclusions: $productExclusions) {\n    Cards(cardsURN: $urn) {\n      ... on PromotionsHubCardGroup {\n        __typename\n        urn\n        items(first: 6, filterBy: $filterBy) {\n          edges {\n            node {\n              ...PromotionsHubCard\n            }\n          }\n        }\n        partials: items(filterBy: $filterBy) {\n          edges {\n            node {\n              ... on PromotionsHubCard {\n                urn\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment IsPotentialBet on SportsbookRunnerLiveData {\n    __typename\n    urn\n    isPotentialBet @client\n  }\n",
): (typeof documents)["\n  fragment IsPotentialBet on SportsbookRunnerLiveData {\n    __typename\n    urn\n    isPotentialBet @client\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment SelectionPromoCardMarketLiveData on SportsbookMarketLiveData {\n    __typename\n    urn\n    sportsbookMarketStatus\n    bspMarket\n    runners {\n      urn\n      runnerURN\n      runnerStatus\n      odds {\n        decimal\n        fractional {\n          numerator\n          denominator\n        }\n      }\n      displayOdds {\n        decimal\n        fractional {\n          numerator\n          denominator\n        }\n      }\n      previousOdds(limit: 1) {\n        odds {\n          decimal\n          fractional {\n            numerator\n            denominator\n          }\n        }\n        displayOdds {\n          decimal\n          fractional {\n            numerator\n            denominator\n          }\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment SelectionPromoCardMarketLiveData on SportsbookMarketLiveData {\n    __typename\n    urn\n    sportsbookMarketStatus\n    bspMarket\n    runners {\n      urn\n      runnerURN\n      runnerStatus\n      odds {\n        decimal\n        fractional {\n          numerator\n          denominator\n        }\n      }\n      displayOdds {\n        decimal\n        fractional {\n          numerator\n          denominator\n        }\n      }\n      previousOdds(limit: 1) {\n        odds {\n          decimal\n          fractional {\n            numerator\n            denominator\n          }\n        }\n        displayOdds {\n          decimal\n          fractional {\n            numerator\n            denominator\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment SelectionPromoCardUserDetails on AppContextDetails {\n    __typename\n    brandSettings {\n      name\n      isActive\n    }\n    userdetails {\n      localeCode\n    }\n    preferences {\n      sportsbookOddsDisplay {\n        urn\n        selectedOddsDisplayFormat\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment SelectionPromoCardUserDetails on AppContextDetails {\n    __typename\n    brandSettings {\n      name\n      isActive\n    }\n    userdetails {\n      localeCode\n    }\n    preferences {\n      sportsbookOddsDisplay {\n        urn\n        selectedOddsDisplayFormat\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment SelectionPromoCardTermsAndConditions on PromoTermsAndConditions {\n    summary\n    link {\n      label {\n        ... on DisplayNameTitle {\n          name\n        }\n        ... on DisplayNameTranslationKey {\n          translationKey\n        }\n      }\n      viewLink {\n        viewUrn\n        viewUrl\n        viewDisplayMode\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment SelectionPromoCardTermsAndConditions on PromoTermsAndConditions {\n    summary\n    link {\n      label {\n        ... on DisplayNameTitle {\n          name\n        }\n        ... on DisplayNameTranslationKey {\n          translationKey\n        }\n      }\n      viewLink {\n        viewUrn\n        viewUrl\n        viewDisplayMode\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment SelectionPromoCard on SelectionPromoCard {\n    __typename\n    urn\n    theme\n    title\n    subTitle\n    termsAndConditions {\n      ...SelectionPromoCardTermsAndConditions\n    }\n    cta {\n      ... on PromotionAddToBetslipAction {\n        __typename\n        market {\n          urn\n          isOddsboostMarketType\n          liveData {\n            ...SelectionPromoCardMarketLiveData\n          }\n          hierarchy {\n            __typename\n            ... on EventHierarchy {\n              sportevent {\n                __typename\n                urn\n              }\n            }\n            ... on RaceHierarchy {\n              race {\n                __typename\n                urn\n              }\n              meeting {\n                __typename\n                urn\n              }\n            }\n            ... on EventCompetitionHierarchy {\n              sportevent {\n                urn\n              }\n              competition {\n                urn\n              }\n            }\n          }\n        }\n        runner {\n          runnerURN\n        }\n        displayPreviousOdd\n      }\n      ... on PromotionAddToBetslipAndNavigateAction {\n        __typename\n        market {\n          urn\n          isOddsboostMarketType\n          liveData {\n            ...SelectionPromoCardMarketLiveData\n          }\n        }\n        runner {\n          runnerURN\n        }\n        displayPreviousOdd\n        viewLink {\n          viewUrn\n          viewUrl\n          viewDisplayMode\n        }\n      }\n    }\n    promoTag {\n      ... on PromoIconTag {\n        iconTag\n      }\n      ... on PromoLabelTag {\n        label\n      }\n    }\n    selectionImage: promoImage {\n      url\n    }\n  }\n",
): (typeof documents)["\n  fragment SelectionPromoCard on SelectionPromoCard {\n    __typename\n    urn\n    theme\n    title\n    subTitle\n    termsAndConditions {\n      ...SelectionPromoCardTermsAndConditions\n    }\n    cta {\n      ... on PromotionAddToBetslipAction {\n        __typename\n        market {\n          urn\n          isOddsboostMarketType\n          liveData {\n            ...SelectionPromoCardMarketLiveData\n          }\n          hierarchy {\n            __typename\n            ... on EventHierarchy {\n              sportevent {\n                __typename\n                urn\n              }\n            }\n            ... on RaceHierarchy {\n              race {\n                __typename\n                urn\n              }\n              meeting {\n                __typename\n                urn\n              }\n            }\n            ... on EventCompetitionHierarchy {\n              sportevent {\n                urn\n              }\n              competition {\n                urn\n              }\n            }\n          }\n        }\n        runner {\n          runnerURN\n        }\n        displayPreviousOdd\n      }\n      ... on PromotionAddToBetslipAndNavigateAction {\n        __typename\n        market {\n          urn\n          isOddsboostMarketType\n          liveData {\n            ...SelectionPromoCardMarketLiveData\n          }\n        }\n        runner {\n          runnerURN\n        }\n        displayPreviousOdd\n        viewLink {\n          viewUrn\n          viewUrl\n          viewDisplayMode\n        }\n      }\n    }\n    promoTag {\n      ... on PromoIconTag {\n        iconTag\n      }\n      ... on PromoLabelTag {\n        label\n      }\n    }\n    selectionImage: promoImage {\n      url\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query SelectionPromoCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...SelectionPromoCard\n    }\n  }\n",
): (typeof documents)["\n  query SelectionPromoCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...SelectionPromoCard\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query SelectionPromoCardUserDetails {\n    AppContext {\n      ...SelectionPromoCardUserDetails\n    }\n  }\n",
): (typeof documents)["\n  query SelectionPromoCardUserDetails {\n    AppContext {\n      ...SelectionPromoCardUserDetails\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment CouponRefreshCard on FilteredCouponCardGroup {\n    __typename\n    urn\n    itemsHash(filterBy: $filteredCouponFilterBy, sortBy: $sortBy)\n  }\n",
): (typeof documents)["\n  fragment CouponRefreshCard on FilteredCouponCardGroup {\n    __typename\n    urn\n    itemsHash(filterBy: $filteredCouponFilterBy, sortBy: $sortBy)\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query CouponRefreshCard($urn: [URN!]!, $filteredCouponFilterBy: FilteredCouponFilterBy, $sortBy: FilteredGroupSort) {\n    Cards(cardsURN: $urn) {\n      ...CouponRefreshCard\n    }\n  }\n",
): (typeof documents)["\n  query CouponRefreshCard($urn: [URN!]!, $filteredCouponFilterBy: FilteredCouponFilterBy, $sortBy: FilteredGroupSort) {\n    Cards(cardsURN: $urn) {\n      ...CouponRefreshCard\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment EmbeddedViewCardAppContext on AppContextDetails {\n    __typename\n    urn\n    userdetails {\n      localeCode\n      timezone\n    }\n  }\n",
): (typeof documents)["\n  fragment EmbeddedViewCardAppContext on AppContextDetails {\n    __typename\n    urn\n    userdetails {\n      localeCode\n      timezone\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment EmbeddedViewCard on EmbeddedViewCard {\n    __typename\n    urn\n    text\n    url\n    appEnv @client\n  }\n",
): (typeof documents)["\n  fragment EmbeddedViewCard on EmbeddedViewCard {\n    __typename\n    urn\n    text\n    url\n    appEnv @client\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query EmbeddedViewCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...EmbeddedViewCard\n    }\n  }\n",
): (typeof documents)["\n  query EmbeddedViewCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...EmbeddedViewCard\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query EmbeddedViewCardAppContext {\n    AppContext {\n      ...EmbeddedViewCardAppContext\n    }\n  }\n",
): (typeof documents)["\n  query EmbeddedViewCardAppContext {\n    AppContext {\n      ...EmbeddedViewCardAppContext\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment BroadcastsCard on BroadcastsCard {\n    __typename\n    urn\n    broadcasts {\n      dataVizUrl\n      liveVideoUrl\n    }\n    isCollapsed\n  }\n",
): (typeof documents)["\n  fragment BroadcastsCard on BroadcastsCard {\n    __typename\n    urn\n    broadcasts {\n      dataVizUrl\n      liveVideoUrl\n    }\n    isCollapsed\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query BroadcastsCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...BroadcastsCard\n    }\n  }\n",
): (typeof documents)["\n  query BroadcastsCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...BroadcastsCard\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment EmbeddedContentCard on EmbeddedContentCard {\n    __typename\n    urn\n    contentTitle: title {\n      __typename\n      ... on DisplayNameTitle {\n        name\n      }\n    }\n    contentUrl: url\n  }\n",
): (typeof documents)["\n  fragment EmbeddedContentCard on EmbeddedContentCard {\n    __typename\n    urn\n    contentTitle: title {\n      __typename\n      ... on DisplayNameTitle {\n        name\n      }\n    }\n    contentUrl: url\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query EmbeddedContentCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...EmbeddedContentCard\n    }\n  }\n",
): (typeof documents)["\n  query EmbeddedContentCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...EmbeddedContentCard\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment IncidentsCard on IncidentsCard {\n    __typename\n    urn\n    isHighlighted\n    showEmptyState\n    fixture {\n      urn\n      incidents {\n        period\n        periodStatus\n        clock {\n          minute\n        }\n        details {\n          ... on CardIncident {\n            __typename\n            cardType\n            side\n            player {\n              id\n              name\n              startingType\n            }\n          }\n          ... on GoalIncident {\n            __typename\n            goalType\n            side\n            goalScorer {\n              id\n              name\n              startingType\n            }\n          }\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment IncidentsCard on IncidentsCard {\n    __typename\n    urn\n    isHighlighted\n    showEmptyState\n    fixture {\n      urn\n      incidents {\n        period\n        periodStatus\n        clock {\n          minute\n        }\n        details {\n          ... on CardIncident {\n            __typename\n            cardType\n            side\n            player {\n              id\n              name\n              startingType\n            }\n          }\n          ... on GoalIncident {\n            __typename\n            goalType\n            side\n            goalScorer {\n              id\n              name\n              startingType\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query IncidentsCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...IncidentsCard\n    }\n  }\n",
): (typeof documents)["\n  query IncidentsCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...IncidentsCard\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment RugbyLeagueFixtureUserDetails on AppContextDetails {\n    urn\n    userdetails {\n      timezone\n      localeCodeBcp47\n      jurisdiction {\n        jurisdiction\n      }\n    }\n    brandSettings {\n      name\n      isActive\n    }\n  }\n",
): (typeof documents)["\n  fragment RugbyLeagueFixtureUserDetails on AppContextDetails {\n    urn\n    userdetails {\n      timezone\n      localeCodeBcp47\n      jurisdiction {\n        jurisdiction\n      }\n    }\n    brandSettings {\n      name\n      isActive\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment RugbyLeagueFixture on RugbyLeagueFixture {\n    __typename\n    urn\n    runnerNames {\n      home\n      away\n    }\n    isAmericanFormat\n    score {\n      scoreHome: home\n      scoreAway: away\n    }\n    halfTimeScore {\n      halfTimeScoreHome: home\n      halfTimeScoreAway: away\n    }\n    sportevent {\n      openDate\n      competition {\n        name\n      }\n      name\n    }\n  }\n",
): (typeof documents)["\n  fragment RugbyLeagueFixture on RugbyLeagueFixture {\n    __typename\n    urn\n    runnerNames {\n      home\n      away\n    }\n    isAmericanFormat\n    score {\n      scoreHome: home\n      scoreAway: away\n    }\n    halfTimeScore {\n      halfTimeScoreHome: home\n      halfTimeScoreAway: away\n    }\n    sportevent {\n      openDate\n      competition {\n        name\n      }\n      name\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query RugbyLeagueFixtureUserDetails {\n    AppContext {\n      ...RugbyLeagueFixtureUserDetails\n    }\n  }\n",
): (typeof documents)["\n  query RugbyLeagueFixtureUserDetails {\n    AppContext {\n      ...RugbyLeagueFixtureUserDetails\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query RugbyLeagueFixture($urn: [URN!]!) {\n    Fixtures(URNs: $urn) {\n      ...RugbyLeagueFixture\n    }\n  }\n",
): (typeof documents)["\n  query RugbyLeagueFixture($urn: [URN!]!) {\n    Fixtures(URNs: $urn) {\n      ...RugbyLeagueFixture\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment StatsBroadcastsCard on StatsBroadcastsCard {\n    __typename\n    urn\n    broadcasts {\n      liveVideoUrl\n      dataVizUrl\n    }\n    sport {\n      ... on Sport {\n        urn\n        sportId\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment StatsBroadcastsCard on StatsBroadcastsCard {\n    __typename\n    urn\n    broadcasts {\n      liveVideoUrl\n      dataVizUrl\n    }\n    sport {\n      ... on Sport {\n        urn\n        sportId\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query StatsBroadcastsCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsBroadcastsCard\n    }\n  }\n",
): (typeof documents)["\n  query StatsBroadcastsCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsBroadcastsCard\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment StatsFormCardRecentForm on StatsFormCard {\n    __typename\n    urn\n    fixture {\n      urn\n      scheduledAt\n      home {\n        name\n      }\n      away {\n        name\n      }\n      recentForm {\n        home {\n          score {\n            home\n            away\n          }\n          outcome\n        }\n        away {\n          score {\n            home\n            away\n          }\n          outcome\n        }\n      }\n      homeStanding {\n        rank {\n          position\n        }\n        team {\n          name\n        }\n      }\n      awayStanding {\n        rank {\n          position\n        }\n        team {\n          name\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment StatsFormCardRecentForm on StatsFormCard {\n    __typename\n    urn\n    fixture {\n      urn\n      scheduledAt\n      home {\n        name\n      }\n      away {\n        name\n      }\n      recentForm {\n        home {\n          score {\n            home\n            away\n          }\n          outcome\n        }\n        away {\n          score {\n            home\n            away\n          }\n          outcome\n        }\n      }\n      homeStanding {\n        rank {\n          position\n        }\n        team {\n          name\n        }\n      }\n      awayStanding {\n        rank {\n          position\n        }\n        team {\n          name\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment StatsFormCardCompetitionForm on StatsFormCard {\n    __typename\n    urn\n    fixture {\n      urn\n      scheduledAt\n      home {\n        name\n      }\n      away {\n        name\n      }\n      competitionForm {\n        home {\n          side\n          outcome\n          opponent\n          score {\n            home\n            away\n          }\n        }\n        away {\n          side\n          outcome\n          opponent\n          score {\n            home\n            away\n          }\n        }\n      }\n      homeStanding {\n        rank {\n          position\n        }\n        team {\n          name\n        }\n      }\n      awayStanding {\n        rank {\n          position\n        }\n        team {\n          name\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment StatsFormCardCompetitionForm on StatsFormCard {\n    __typename\n    urn\n    fixture {\n      urn\n      scheduledAt\n      home {\n        name\n      }\n      away {\n        name\n      }\n      competitionForm {\n        home {\n          side\n          outcome\n          opponent\n          score {\n            home\n            away\n          }\n        }\n        away {\n          side\n          outcome\n          opponent\n          score {\n            home\n            away\n          }\n        }\n      }\n      homeStanding {\n        rank {\n          position\n        }\n        team {\n          name\n        }\n      }\n      awayStanding {\n        rank {\n          position\n        }\n        team {\n          name\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query StatsFormCard($urn: [URN!]!, $isRecent: Boolean!, $isCompetition: Boolean!) {\n    Cards(cardsURN: $urn) {\n      ...StatsFormCardRecentForm @include(if: $isRecent)\n      ...StatsFormCardCompetitionForm @include(if: $isCompetition)\n    }\n  }\n",
): (typeof documents)["\n  query StatsFormCard($urn: [URN!]!, $isRecent: Boolean!, $isCompetition: Boolean!) {\n    Cards(cardsURN: $urn) {\n      ...StatsFormCardRecentForm @include(if: $isRecent)\n      ...StatsFormCardCompetitionForm @include(if: $isCompetition)\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment StatsGoalsAndShotsCard on StatsGoalsAndShotsCard {\n    __typename\n    urn\n    fixture {\n      urn\n      home {\n        name\n        statsAllSeason {\n          averageGoalsConceded {\n            firstHalf\n            secondHalf\n            overall\n          }\n          averageGoalsScored {\n            firstHalf\n            secondHalf\n            overall\n          }\n          averageShotsOnTarget\n        }\n      }\n      away {\n        name\n        statsAllSeason {\n          averageGoalsConceded {\n            firstHalf\n            secondHalf\n            overall\n          }\n          averageGoalsScored {\n            firstHalf\n            secondHalf\n            overall\n          }\n          averageShotsOnTarget\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment StatsGoalsAndShotsCard on StatsGoalsAndShotsCard {\n    __typename\n    urn\n    fixture {\n      urn\n      home {\n        name\n        statsAllSeason {\n          averageGoalsConceded {\n            firstHalf\n            secondHalf\n            overall\n          }\n          averageGoalsScored {\n            firstHalf\n            secondHalf\n            overall\n          }\n          averageShotsOnTarget\n        }\n      }\n      away {\n        name\n        statsAllSeason {\n          averageGoalsConceded {\n            firstHalf\n            secondHalf\n            overall\n          }\n          averageGoalsScored {\n            firstHalf\n            secondHalf\n            overall\n          }\n          averageShotsOnTarget\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query StatsGoalsAndShotsCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsGoalsAndShotsCard\n    }\n  }\n",
): (typeof documents)["\n  query StatsGoalsAndShotsCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsGoalsAndShotsCard\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment StatsHeadToHeadUserDetails on AppContextDetails {\n    __typename\n    urn\n    userdetails {\n      localeCodeBcp47\n      timezone\n    }\n  }\n",
): (typeof documents)["\n  fragment StatsHeadToHeadUserDetails on AppContextDetails {\n    __typename\n    urn\n    userdetails {\n      localeCodeBcp47\n      timezone\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment StatsHeadToHeadCard on StatsHeadToHeadCard {\n    __typename\n    urn\n    fixture {\n      urn\n      scheduledAt\n      head2head {\n        home {\n          opponent\n          score {\n            home\n            away\n          }\n          startAt\n          side\n        }\n        away {\n          opponent\n          score {\n            home\n            away\n          }\n          startAt\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment StatsHeadToHeadCard on StatsHeadToHeadCard {\n    __typename\n    urn\n    fixture {\n      urn\n      scheduledAt\n      head2head {\n        home {\n          opponent\n          score {\n            home\n            away\n          }\n          startAt\n          side\n        }\n        away {\n          opponent\n          score {\n            home\n            away\n          }\n          startAt\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query StatsHeadToHeadUserDetails {\n    AppContext {\n      ...StatsHeadToHeadUserDetails\n    }\n  }\n",
): (typeof documents)["\n  query StatsHeadToHeadUserDetails {\n    AppContext {\n      ...StatsHeadToHeadUserDetails\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query StatsHeadToHeadCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsHeadToHeadCard\n    }\n  }\n",
): (typeof documents)["\n  query StatsHeadToHeadCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsHeadToHeadCard\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment StatsLeagueTableCard on StatsTableCard {\n    __typename\n    urn\n    fixture {\n      urn\n      competition {\n        id\n        stages {\n          standings {\n            gamesPlayed\n            win\n            loss\n            draw\n            points\n            goalsDifference\n            team {\n              name\n            }\n            rank {\n              position\n              status\n              change\n            }\n          }\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment StatsLeagueTableCard on StatsTableCard {\n    __typename\n    urn\n    fixture {\n      urn\n      competition {\n        id\n        stages {\n          standings {\n            gamesPlayed\n            win\n            loss\n            draw\n            points\n            goalsDifference\n            team {\n              name\n            }\n            rank {\n              position\n              status\n              change\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query StatsLeagueTableCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsLeagueTableCard\n    }\n  }\n",
): (typeof documents)["\n  query StatsLeagueTableCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsLeagueTableCard\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment StatsLineupsCard on StatsLineupsCard {\n    __typename\n    urn\n    hasFormationInfo\n    status\n    fixture {\n      urn\n      home {\n        jerseys {\n          ...teamJersey\n        }\n        name\n        formation\n        squad {\n          manager\n          players {\n            ...lineupFootballPlayer\n          }\n        }\n      }\n      away {\n        jerseys {\n          ...teamJersey\n        }\n        name\n        formation\n        squad {\n          manager\n          players {\n            ...lineupFootballPlayer\n          }\n        }\n      }\n      incidents {\n        ...lineupFootballIncident\n      }\n    }\n    footballPlayerViewLinks {\n      viewUrl\n      viewUrn\n      footballPlayer {\n        urn\n      }\n    }\n  }\n\n  fragment teamJersey on Jerseys {\n    color\n    url\n    type\n  }\n\n  fragment lineupFootballPlayer on FootballPlayer {\n    id\n    name\n    matchName\n    shirtNumber\n    position\n    startingType\n    formationPlace\n  }\n\n  fragment lineupFootballIncident on FootballIncident {\n    clock {\n      minute\n    }\n    period\n    periodStatus\n    details {\n      __typename\n      ... on GoalIncident {\n        goalType\n        side\n        goalScorer {\n          ...lineupFootballPlayer\n        }\n        assist {\n          ...lineupFootballPlayer\n        }\n      }\n      ... on CardIncident {\n        cardType\n        side\n        player {\n          ...lineupFootballPlayer\n        }\n      }\n      ... on SubstitutionIncident {\n        side\n        playerIn {\n          ...lineupFootballPlayer\n        }\n        playerOut {\n          ...lineupFootballPlayer\n        }\n      }\n      ... on PenaltyShootoutIncident {\n        side\n        penaltyShootoutType\n        player {\n          ...lineupFootballPlayer\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment StatsLineupsCard on StatsLineupsCard {\n    __typename\n    urn\n    hasFormationInfo\n    status\n    fixture {\n      urn\n      home {\n        jerseys {\n          ...teamJersey\n        }\n        name\n        formation\n        squad {\n          manager\n          players {\n            ...lineupFootballPlayer\n          }\n        }\n      }\n      away {\n        jerseys {\n          ...teamJersey\n        }\n        name\n        formation\n        squad {\n          manager\n          players {\n            ...lineupFootballPlayer\n          }\n        }\n      }\n      incidents {\n        ...lineupFootballIncident\n      }\n    }\n    footballPlayerViewLinks {\n      viewUrl\n      viewUrn\n      footballPlayer {\n        urn\n      }\n    }\n  }\n\n  fragment teamJersey on Jerseys {\n    color\n    url\n    type\n  }\n\n  fragment lineupFootballPlayer on FootballPlayer {\n    id\n    name\n    matchName\n    shirtNumber\n    position\n    startingType\n    formationPlace\n  }\n\n  fragment lineupFootballIncident on FootballIncident {\n    clock {\n      minute\n    }\n    period\n    periodStatus\n    details {\n      __typename\n      ... on GoalIncident {\n        goalType\n        side\n        goalScorer {\n          ...lineupFootballPlayer\n        }\n        assist {\n          ...lineupFootballPlayer\n        }\n      }\n      ... on CardIncident {\n        cardType\n        side\n        player {\n          ...lineupFootballPlayer\n        }\n      }\n      ... on SubstitutionIncident {\n        side\n        playerIn {\n          ...lineupFootballPlayer\n        }\n        playerOut {\n          ...lineupFootballPlayer\n        }\n      }\n      ... on PenaltyShootoutIncident {\n        side\n        penaltyShootoutType\n        player {\n          ...lineupFootballPlayer\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query StatsLineupsCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsLineupsCard\n    }\n  }\n",
): (typeof documents)["\n  query StatsLineupsCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsLineupsCard\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment FootballGameStats on FootballGameStats {\n    __typename\n    attacks\n    dangerousAttacks\n    possession\n    corners\n    yellowCards\n    redCards\n    shotsOnTarget\n    shotsOffTarget\n  }\n",
): (typeof documents)["\n  fragment FootballGameStats on FootballGameStats {\n    __typename\n    attacks\n    dangerousAttacks\n    possession\n    corners\n    yellowCards\n    redCards\n    shotsOnTarget\n    shotsOffTarget\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment StatsMatchStatsCard on StatsMatchStatsCard {\n    __typename\n    urn\n    fixture {\n      urn\n      stats {\n        __typename\n        period\n        periodStatus\n        home {\n          ...FootballGameStats\n        }\n        away {\n          ...FootballGameStats\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment StatsMatchStatsCard on StatsMatchStatsCard {\n    __typename\n    urn\n    fixture {\n      urn\n      stats {\n        __typename\n        period\n        periodStatus\n        home {\n          ...FootballGameStats\n        }\n        away {\n          ...FootballGameStats\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query StatsMatchStatsCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsMatchStatsCard\n    }\n  }\n",
): (typeof documents)["\n  query StatsMatchStatsCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsMatchStatsCard\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment FootballPlayerFixtureSeasonStats on FootballPlayerFixtureSeasonStats {\n    totals {\n      goals\n      firstGoalScored\n      lastGoalScored\n      shotsOnTarget\n      yellowCards\n      redCards\n      assists\n      tacklesMade\n      fouls\n    }\n    matchesPlayed\n  }\n",
): (typeof documents)["\n  fragment FootballPlayerFixtureSeasonStats on FootballPlayerFixtureSeasonStats {\n    totals {\n      goals\n      firstGoalScored\n      lastGoalScored\n      shotsOnTarget\n      yellowCards\n      redCards\n      assists\n      tacklesMade\n      fouls\n    }\n    matchesPlayed\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment FootballPlayerFixture on FootballPlayerFixture {\n    id\n    urn\n    name\n    seasonStats {\n      ...FootballPlayerFixtureSeasonStats\n    }\n  }\n",
): (typeof documents)["\n  fragment FootballPlayerFixture on FootballPlayerFixture {\n    id\n    urn\n    name\n    seasonStats {\n      ...FootballPlayerFixtureSeasonStats\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment StatsPlayersSeasonStatsCardAttacking on StatsPlayersSeasonStatsCard {\n    __typename\n    urn\n    fixture {\n      urn\n      players {\n        ...FootballPlayerFixture\n      }\n      home {\n        name\n        squad {\n          players {\n            id\n          }\n        }\n      }\n      away {\n        name\n        squad {\n          players {\n            id\n          }\n        }\n      }\n    }\n    footballPlayerViewLinks {\n      viewUrl\n      viewUrn\n      footballPlayer {\n        ...FootballPlayerFixture\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment StatsPlayersSeasonStatsCardAttacking on StatsPlayersSeasonStatsCard {\n    __typename\n    urn\n    fixture {\n      urn\n      players {\n        ...FootballPlayerFixture\n      }\n      home {\n        name\n        squad {\n          players {\n            id\n          }\n        }\n      }\n      away {\n        name\n        squad {\n          players {\n            id\n          }\n        }\n      }\n    }\n    footballPlayerViewLinks {\n      viewUrl\n      viewUrn\n      footballPlayer {\n        ...FootballPlayerFixture\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment StatsPlayersSeasonStatsCardDefending on StatsPlayersSeasonStatsCard {\n    __typename\n    urn\n    fixture {\n      urn\n      players {\n        ...FootballPlayerFixture\n      }\n      home {\n        name\n        squad {\n          players {\n            id\n          }\n        }\n      }\n      away {\n        name\n        squad {\n          players {\n            id\n          }\n        }\n      }\n    }\n    footballPlayerViewLinks {\n      viewUrl\n      viewUrn\n      footballPlayer {\n        ...FootballPlayerFixture\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment StatsPlayersSeasonStatsCardDefending on StatsPlayersSeasonStatsCard {\n    __typename\n    urn\n    fixture {\n      urn\n      players {\n        ...FootballPlayerFixture\n      }\n      home {\n        name\n        squad {\n          players {\n            id\n          }\n        }\n      }\n      away {\n        name\n        squad {\n          players {\n            id\n          }\n        }\n      }\n    }\n    footballPlayerViewLinks {\n      viewUrl\n      viewUrn\n      footballPlayer {\n        ...FootballPlayerFixture\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query StatsPlayersSeasonStatsCard($urn: [URN!]!, $isAttacking: Boolean!) {\n    Cards(cardsURN: $urn) {\n      ...StatsPlayersSeasonStatsCardAttacking @include(if: $isAttacking)\n      ...StatsPlayersSeasonStatsCardDefending @skip(if: $isAttacking)\n    }\n  }\n",
): (typeof documents)["\n  query StatsPlayersSeasonStatsCard($urn: [URN!]!, $isAttacking: Boolean!) {\n    Cards(cardsURN: $urn) {\n      ...StatsPlayersSeasonStatsCardAttacking @include(if: $isAttacking)\n      ...StatsPlayersSeasonStatsCardDefending @skip(if: $isAttacking)\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment StatsPlayersSeasonStatsUserDetails on AppContextDetails {\n    __typename\n    throttles {\n      name\n      isActive\n    }\n  }\n",
): (typeof documents)["\n  fragment StatsPlayersSeasonStatsUserDetails on AppContextDetails {\n    __typename\n    throttles {\n      name\n      isActive\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query StatsPlayersSeasonStatsUserDetails {\n    AppContext {\n      ...StatsPlayersSeasonStatsUserDetails\n    }\n  }\n",
): (typeof documents)["\n  query StatsPlayersSeasonStatsUserDetails {\n    AppContext {\n      ...StatsPlayersSeasonStatsUserDetails\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment StatsTeamsCardPreviousFive on StatsTeamsCard {\n    __typename\n    urn\n    fixture {\n      urn\n      teams {\n        urn\n        name\n        statsPreviousFive {\n          averageGoalsScored {\n            ...averageTeamStats\n          }\n          averageGoalsConceded {\n            ...averageTeamStats\n          }\n          averageCorners {\n            ...averageTeamStats\n          }\n          averageBookingPoints {\n            ...averageTeamStats\n          }\n          averageShots\n          bothTeamsToScore {\n            ...bothTeamsToScore\n          }\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment StatsTeamsCardPreviousFive on StatsTeamsCard {\n    __typename\n    urn\n    fixture {\n      urn\n      teams {\n        urn\n        name\n        statsPreviousFive {\n          averageGoalsScored {\n            ...averageTeamStats\n          }\n          averageGoalsConceded {\n            ...averageTeamStats\n          }\n          averageCorners {\n            ...averageTeamStats\n          }\n          averageBookingPoints {\n            ...averageTeamStats\n          }\n          averageShots\n          bothTeamsToScore {\n            ...bothTeamsToScore\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment StatsTeamsCardAllSeason on StatsTeamsCard {\n    __typename\n    urn\n    fixture {\n      urn\n      teams {\n        urn\n        name\n        statsAllSeason {\n          averageGoalsScored {\n            ...averageTeamStats\n          }\n          averageGoalsConceded {\n            ...averageTeamStats\n          }\n          averageCorners {\n            ...averageTeamStats\n          }\n          averageBookingPoints {\n            ...averageTeamStats\n          }\n          averageShots\n          bothTeamsToScore {\n            ...bothTeamsToScore\n          }\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment StatsTeamsCardAllSeason on StatsTeamsCard {\n    __typename\n    urn\n    fixture {\n      urn\n      teams {\n        urn\n        name\n        statsAllSeason {\n          averageGoalsScored {\n            ...averageTeamStats\n          }\n          averageGoalsConceded {\n            ...averageTeamStats\n          }\n          averageCorners {\n            ...averageTeamStats\n          }\n          averageBookingPoints {\n            ...averageTeamStats\n          }\n          averageShots\n          bothTeamsToScore {\n            ...bothTeamsToScore\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment averageTeamStats on AverageTeamStats {\n    firstHalf\n    secondHalf\n    home\n    away\n    overall\n  }\n",
): (typeof documents)["\n  fragment averageTeamStats on AverageTeamStats {\n    firstHalf\n    secondHalf\n    home\n    away\n    overall\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment bothTeamsToScore on BothTeamsToScore {\n    percentage\n  }\n",
): (typeof documents)["\n  fragment bothTeamsToScore on BothTeamsToScore {\n    percentage\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query StatsTeamsCard(\n    $urn: [URN!]!\n    $isPreviousFive: Boolean!\n    $isAllSeason: Boolean!\n  ) {\n    Cards(cardsURN: $urn) {\n      ...StatsTeamsCardPreviousFive @include(if: $isPreviousFive)\n      ...StatsTeamsCardAllSeason @include(if: $isAllSeason)\n    }\n  }\n",
): (typeof documents)["\n  query StatsTeamsCard(\n    $urn: [URN!]!\n    $isPreviousFive: Boolean!\n    $isAllSeason: Boolean!\n  ) {\n    Cards(cardsURN: $urn) {\n      ...StatsTeamsCardPreviousFive @include(if: $isPreviousFive)\n      ...StatsTeamsCardAllSeason @include(if: $isAllSeason)\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment TeamLineupCard on TeamLineupCard {\n    __typename\n    urn\n    fixture {\n      urn\n      home {\n        squad {\n          manager\n          players {\n            ...lineupFootballPlayer\n          }\n        }\n      }\n      away {\n        squad {\n          manager\n          players {\n            ...lineupFootballPlayer\n          }\n        }\n      }\n      incidents {\n        ...lineupFootballIncident\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment TeamLineupCard on TeamLineupCard {\n    __typename\n    urn\n    fixture {\n      urn\n      home {\n        squad {\n          manager\n          players {\n            ...lineupFootballPlayer\n          }\n        }\n      }\n      away {\n        squad {\n          manager\n          players {\n            ...lineupFootballPlayer\n          }\n        }\n      }\n      incidents {\n        ...lineupFootballIncident\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query TeamLineupCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...TeamLineupCard\n    }\n  }\n",
): (typeof documents)["\n  query TeamLineupCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...TeamLineupCard\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment IsSubscribed on SportsEvent {\n    __typename\n    urn\n    isSubscribed @client\n  }\n",
): (typeof documents)["\n  fragment IsSubscribed on SportsEvent {\n    __typename\n    urn\n    isSubscribed @client\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment TennisFixtureUserDetails on AppContextDetails {\n    urn\n    brandSettings {\n      name\n      isActive\n    }\n    userdetails {\n      timezone\n      localeCodeBcp47\n      jurisdiction {\n        jurisdiction\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment TennisFixtureUserDetails on AppContextDetails {\n    urn\n    brandSettings {\n      name\n      isActive\n    }\n    userdetails {\n      timezone\n      localeCodeBcp47\n      jurisdiction {\n        jurisdiction\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment TennisFixture on TennisMatch {\n    __typename\n    urn\n    isAmericanFormat\n    runnerNames {\n      home\n      away\n    }\n    scheduledStartTime\n    surface\n    teamAScore\n    teamBScore\n    status {\n      status\n      reason\n    }\n    currentSet {\n      number\n      teamAScore\n      teamBScore\n      duration\n      currentGame {\n        number\n        teamAScore\n        teamBScore\n        teamServing\n      }\n    }\n    sportevent {\n      urn\n      name\n      openDate\n      competition {\n        name\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment TennisFixture on TennisMatch {\n    __typename\n    urn\n    isAmericanFormat\n    runnerNames {\n      home\n      away\n    }\n    scheduledStartTime\n    surface\n    teamAScore\n    teamBScore\n    status {\n      status\n      reason\n    }\n    currentSet {\n      number\n      teamAScore\n      teamBScore\n      duration\n      currentGame {\n        number\n        teamAScore\n        teamBScore\n        teamServing\n      }\n    }\n    sportevent {\n      urn\n      name\n      openDate\n      competition {\n        name\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query TennisFixtureUserDetails {\n    AppContext {\n      ...TennisFixtureUserDetails\n    }\n  }\n",
): (typeof documents)["\n  query TennisFixtureUserDetails {\n    AppContext {\n      ...TennisFixtureUserDetails\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query TennisFixture($urn: [URN!]!) {\n    Fixtures(URNs: $urn) {\n      ...TennisFixture\n    }\n  }\n",
): (typeof documents)["\n  query TennisFixture($urn: [URN!]!) {\n    Fixtures(URNs: $urn) {\n      ...TennisFixture\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment VolleyballFixtureUserDetails on AppContextDetails {\n    __typename\n    urn\n    brandSettings {\n      name\n      isActive\n    }\n    userdetails {\n      timezone\n      localeCodeBcp47\n      jurisdiction {\n        jurisdiction\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment VolleyballFixtureUserDetails on AppContextDetails {\n    __typename\n    urn\n    brandSettings {\n      name\n      isActive\n    }\n    userdetails {\n      timezone\n      localeCodeBcp47\n      jurisdiction {\n        jurisdiction\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\nfragment VolleyballFixture on VolleyballFixture {\n    __typename\n    urn\n    runnerNames {\n        home\n        away\n    }\n    sportevent {\n      urn\n      name\n      openDate\n      competition {\n        name\n      }\n    }\n    isAmericanFormat\n    currentSet {\n        volleyballSetNumber: number\n        volleyballSetScore: score {\n        home\n        away\n        }\n        volleyballCurrentServer: currentServer\n    }\n    homeScore\n    awayScore\n    previousSets {\n        volleyballSetNumber: number\n        volleyballSetScore: score {\n        home\n        away\n        }\n        volleyballCurrentServer: currentServer\n    }\n    }\n",
): (typeof documents)["\nfragment VolleyballFixture on VolleyballFixture {\n    __typename\n    urn\n    runnerNames {\n        home\n        away\n    }\n    sportevent {\n      urn\n      name\n      openDate\n      competition {\n        name\n      }\n    }\n    isAmericanFormat\n    currentSet {\n        volleyballSetNumber: number\n        volleyballSetScore: score {\n        home\n        away\n        }\n        volleyballCurrentServer: currentServer\n    }\n    homeScore\n    awayScore\n    previousSets {\n        volleyballSetNumber: number\n        volleyballSetScore: score {\n        home\n        away\n        }\n        volleyballCurrentServer: currentServer\n    }\n    }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query VolleyballFixtureUserDetails {\n    AppContext {\n      ...VolleyballFixtureUserDetails\n    }\n  }\n",
): (typeof documents)["\n  query VolleyballFixtureUserDetails {\n    AppContext {\n      ...VolleyballFixtureUserDetails\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query VolleyballFixture($urn: [URN!]!) {\n    Fixtures(URNs: $urn) {\n      ...VolleyballFixture\n    }\n  }\n",
): (typeof documents)["\n  query VolleyballFixture($urn: [URN!]!) {\n    Fixtures(URNs: $urn) {\n      ...VolleyballFixture\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment LocalLottoCard on LottoCard {\n    __typename\n    urn\n    selectedLottoPebble @client\n  }\n",
): (typeof documents)["\n  fragment LocalLottoCard on LottoCard {\n    __typename\n    urn\n    selectedLottoPebble @client\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment LottoCardUserDetails on AppContextDetails {\n    __typename\n    urn\n    preferences {\n      sportsbookOddsDisplay {\n        urn\n        selectedOddsDisplayFormat\n      }\n    }\n    userdetails {\n      localeCodeBcp47\n      timezone\n    }\n  }\n",
): (typeof documents)["\n  fragment LottoCardUserDetails on AppContextDetails {\n    __typename\n    urn\n    preferences {\n      sportsbookOddsDisplay {\n        urn\n        selectedOddsDisplayFormat\n      }\n    }\n    userdetails {\n      localeCodeBcp47\n      timezone\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment LottoCardOdds on LottoCard {\n    urn\n    __typename\n    winAvgOdds {\n      decimalDisplayOdds {\n        decimalOdds\n      }\n      fractionalDisplayOdds {\n        numerator\n        denominator\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment LottoCardOdds on LottoCard {\n    urn\n    __typename\n    winAvgOdds {\n      decimalDisplayOdds {\n        decimalOdds\n      }\n      fractionalDisplayOdds {\n        numerator\n        denominator\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment LottoCard on LottoCard {\n    ...LocalLottoCard\n    __typename\n    urn\n    shouldShowCompetitionName\n    competition {\n      __typename\n      urn\n      name\n    }\n    lottoMarkets: markets {\n      __typename\n      urn\n      name\n      marketType\n      liveData {\n        urn\n        sportsbookMarketStatus\n      }\n      hierarchy {\n        ... on EventHierarchy {\n          sportevent {\n            __typename\n            urn\n            name\n            openDate\n          }\n        }\n        ... on EventCompetitionHierarchy {\n          sportevent {\n            __typename\n            urn\n            name\n            openDate\n          }\n          competition {\n            urn\n          }\n        }\n      }\n      runners {\n        runnerURN\n        selectionId\n        name\n        resultType\n      }\n    }\n    marketIds\n  }\n",
): (typeof documents)["\n  fragment LottoCard on LottoCard {\n    ...LocalLottoCard\n    __typename\n    urn\n    shouldShowCompetitionName\n    competition {\n      __typename\n      urn\n      name\n    }\n    lottoMarkets: markets {\n      __typename\n      urn\n      name\n      marketType\n      liveData {\n        urn\n        sportsbookMarketStatus\n      }\n      hierarchy {\n        ... on EventHierarchy {\n          sportevent {\n            __typename\n            urn\n            name\n            openDate\n          }\n        }\n        ... on EventCompetitionHierarchy {\n          sportevent {\n            __typename\n            urn\n            name\n            openDate\n          }\n          competition {\n            urn\n          }\n        }\n      }\n      runners {\n        runnerURN\n        selectionId\n        name\n        resultType\n      }\n    }\n    marketIds\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query LottoCardOdds($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...LottoCardOdds\n    }\n  }\n",
): (typeof documents)["\n  query LottoCardOdds($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...LottoCardOdds\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query LottoCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...LottoCard\n    }\n  }\n",
): (typeof documents)["\n  query LottoCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...LottoCard\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query LottoCardUserDetails {\n    AppContext {\n      ...LottoCardUserDetails\n    }\n  }\n",
): (typeof documents)["\n  query LottoCardUserDetails {\n    AppContext {\n      ...LottoCardUserDetails\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment PenaltyTakersRunner on Runner {\n    __typename\n    runnerURN\n    name\n    selectionId\n    resultType\n    market {\n      ... on SportsbookMarket {\n        urn\n        name\n        liveData {\n          ... on SportsbookMarketLiveData {\n            urn\n            sportsbookMarketStatus\n          }\n        }\n      }\n    }\n    runnerLiveData {\n      ... on SportsbookRunnerLiveData {\n        urn\n        runnerURN\n        runnerStatus\n        odds {\n          decimal\n          fractional {\n            numerator\n            denominator\n          }\n        }\n        displayOdds {\n          decimal\n          fractional {\n            numerator\n            denominator\n          }\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment PenaltyTakersRunner on Runner {\n    __typename\n    runnerURN\n    name\n    selectionId\n    resultType\n    market {\n      ... on SportsbookMarket {\n        urn\n        name\n        liveData {\n          ... on SportsbookMarketLiveData {\n            urn\n            sportsbookMarketStatus\n          }\n        }\n      }\n    }\n    runnerLiveData {\n      ... on SportsbookRunnerLiveData {\n        urn\n        runnerURN\n        runnerStatus\n        odds {\n          decimal\n          fractional {\n            numerator\n            denominator\n          }\n        }\n        displayOdds {\n          decimal\n          fractional {\n            numerator\n            denominator\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment PenaltyTakersCardIsPotentialBet on PenaltyTakersCard {\n    __typename\n    urn\n    penaltyTakers {\n      toScore {\n        topLeft {\n          runnerLiveData {\n            ... on SportsbookRunnerLiveData {\n              __typename\n              urn\n              isPotentialBet @client\n            }\n          }\n        }\n        topCenter {\n          runnerLiveData {\n            ... on SportsbookRunnerLiveData {\n              __typename\n              urn\n              isPotentialBet @client\n            }\n          }\n        }\n        topRight {\n          runnerLiveData {\n            ... on SportsbookRunnerLiveData {\n              __typename\n              urn\n              isPotentialBet @client\n            }\n          }\n        }\n        bottomLeft {\n          runnerLiveData {\n            ... on SportsbookRunnerLiveData {\n              __typename\n              urn\n              isPotentialBet @client\n            }\n          }\n        }\n        bottomCenter {\n          runnerLiveData {\n            ... on SportsbookRunnerLiveData {\n              __typename\n              urn\n              isPotentialBet @client\n            }\n          }\n        }\n        bottomRight {\n          runnerLiveData {\n            ... on SportsbookRunnerLiveData {\n              __typename\n              urn\n              isPotentialBet @client\n            }\n          }\n        }\n      }\n      toMiss {\n        leftPostMiss {\n          runnerLiveData {\n            ... on SportsbookRunnerLiveData {\n              __typename\n              urn\n              isPotentialBet @client\n            }\n          }\n        }\n        skyrocketCrossbar {\n          runnerLiveData {\n            ... on SportsbookRunnerLiveData {\n              __typename\n              urn\n              isPotentialBet @client\n            }\n          }\n        }\n        rightPostMiss {\n          runnerLiveData {\n            ... on SportsbookRunnerLiveData {\n              __typename\n              urn\n              isPotentialBet @client\n            }\n          }\n        }\n        leftSave {\n          runnerLiveData {\n            ... on SportsbookRunnerLiveData {\n              __typename\n              urn\n              isPotentialBet @client\n            }\n          }\n        }\n        centerSave {\n          runnerLiveData {\n            ... on SportsbookRunnerLiveData {\n              __typename\n              urn\n              isPotentialBet @client\n            }\n          }\n        }\n        rightSave {\n          runnerLiveData {\n            ... on SportsbookRunnerLiveData {\n              __typename\n              urn\n              isPotentialBet @client\n            }\n          }\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment PenaltyTakersCardIsPotentialBet on PenaltyTakersCard {\n    __typename\n    urn\n    penaltyTakers {\n      toScore {\n        topLeft {\n          runnerLiveData {\n            ... on SportsbookRunnerLiveData {\n              __typename\n              urn\n              isPotentialBet @client\n            }\n          }\n        }\n        topCenter {\n          runnerLiveData {\n            ... on SportsbookRunnerLiveData {\n              __typename\n              urn\n              isPotentialBet @client\n            }\n          }\n        }\n        topRight {\n          runnerLiveData {\n            ... on SportsbookRunnerLiveData {\n              __typename\n              urn\n              isPotentialBet @client\n            }\n          }\n        }\n        bottomLeft {\n          runnerLiveData {\n            ... on SportsbookRunnerLiveData {\n              __typename\n              urn\n              isPotentialBet @client\n            }\n          }\n        }\n        bottomCenter {\n          runnerLiveData {\n            ... on SportsbookRunnerLiveData {\n              __typename\n              urn\n              isPotentialBet @client\n            }\n          }\n        }\n        bottomRight {\n          runnerLiveData {\n            ... on SportsbookRunnerLiveData {\n              __typename\n              urn\n              isPotentialBet @client\n            }\n          }\n        }\n      }\n      toMiss {\n        leftPostMiss {\n          runnerLiveData {\n            ... on SportsbookRunnerLiveData {\n              __typename\n              urn\n              isPotentialBet @client\n            }\n          }\n        }\n        skyrocketCrossbar {\n          runnerLiveData {\n            ... on SportsbookRunnerLiveData {\n              __typename\n              urn\n              isPotentialBet @client\n            }\n          }\n        }\n        rightPostMiss {\n          runnerLiveData {\n            ... on SportsbookRunnerLiveData {\n              __typename\n              urn\n              isPotentialBet @client\n            }\n          }\n        }\n        leftSave {\n          runnerLiveData {\n            ... on SportsbookRunnerLiveData {\n              __typename\n              urn\n              isPotentialBet @client\n            }\n          }\n        }\n        centerSave {\n          runnerLiveData {\n            ... on SportsbookRunnerLiveData {\n              __typename\n              urn\n              isPotentialBet @client\n            }\n          }\n        }\n        rightSave {\n          runnerLiveData {\n            ... on SportsbookRunnerLiveData {\n              __typename\n              urn\n              isPotentialBet @client\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment PenaltyTakersCardUserDetails on AppContextDetails {\n    __typename\n    brandSettings {\n      name\n      isActive\n    }\n    userdetails {\n      localeCode\n    }\n    preferences {\n      sportsbookOddsDisplay {\n        urn\n        selectedOddsDisplayFormat\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment PenaltyTakersCardUserDetails on AppContextDetails {\n    __typename\n    brandSettings {\n      name\n      isActive\n    }\n    userdetails {\n      localeCode\n    }\n    preferences {\n      sportsbookOddsDisplay {\n        urn\n        selectedOddsDisplayFormat\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment PenaltyTakersCard on PenaltyTakersCard {\n    __typename\n    urn\n    penaltyTakersCardTitle: title {\n      ... on DisplayNameTitle {\n        name\n      }\n      ... on DisplayNameTranslationKey {\n        translationKey\n      }\n    }\n    penaltyTakersCardSubtitle: subtitle {\n      ... on DisplayNameTitle {\n        name\n      }\n      ... on DisplayNameTranslationKey {\n        translationKey\n      }\n    }\n    penaltyTakersCardFooter: footer {\n      ... on DisplayNameTitle {\n        name\n      }\n      ... on DisplayNameTranslationKey {\n        translationKey\n      }\n    }\n    penaltyTakersCardTermsAndConditionsUrl: termsAndConditionsUrl\n    event {\n      urn\n    }\n    penaltyTakers {\n      player {\n        ... on FootballPlayerFixtureContext {\n          __typename\n          urn\n          player {\n            id\n            name\n          }\n          team {\n            jerseys {\n              url\n            }\n          }\n        }\n      }\n      toScore {\n        topLeft {\n          ...PenaltyTakersRunner\n        }\n        topCenter {\n          ...PenaltyTakersRunner\n        }\n        topRight {\n          ...PenaltyTakersRunner\n        }\n        bottomLeft {\n          ...PenaltyTakersRunner\n        }\n        bottomCenter {\n          ...PenaltyTakersRunner\n        }\n        bottomRight {\n          ...PenaltyTakersRunner\n        }\n      }\n      toMiss {\n        leftPostMiss {\n          ...PenaltyTakersRunner\n        }\n        skyrocketCrossbar {\n          ...PenaltyTakersRunner\n        }\n        rightPostMiss {\n          ...PenaltyTakersRunner\n        }\n        leftSave {\n          ...PenaltyTakersRunner\n        }\n        centerSave {\n          ...PenaltyTakersRunner\n        }\n        rightSave {\n          ...PenaltyTakersRunner\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment PenaltyTakersCard on PenaltyTakersCard {\n    __typename\n    urn\n    penaltyTakersCardTitle: title {\n      ... on DisplayNameTitle {\n        name\n      }\n      ... on DisplayNameTranslationKey {\n        translationKey\n      }\n    }\n    penaltyTakersCardSubtitle: subtitle {\n      ... on DisplayNameTitle {\n        name\n      }\n      ... on DisplayNameTranslationKey {\n        translationKey\n      }\n    }\n    penaltyTakersCardFooter: footer {\n      ... on DisplayNameTitle {\n        name\n      }\n      ... on DisplayNameTranslationKey {\n        translationKey\n      }\n    }\n    penaltyTakersCardTermsAndConditionsUrl: termsAndConditionsUrl\n    event {\n      urn\n    }\n    penaltyTakers {\n      player {\n        ... on FootballPlayerFixtureContext {\n          __typename\n          urn\n          player {\n            id\n            name\n          }\n          team {\n            jerseys {\n              url\n            }\n          }\n        }\n      }\n      toScore {\n        topLeft {\n          ...PenaltyTakersRunner\n        }\n        topCenter {\n          ...PenaltyTakersRunner\n        }\n        topRight {\n          ...PenaltyTakersRunner\n        }\n        bottomLeft {\n          ...PenaltyTakersRunner\n        }\n        bottomCenter {\n          ...PenaltyTakersRunner\n        }\n        bottomRight {\n          ...PenaltyTakersRunner\n        }\n      }\n      toMiss {\n        leftPostMiss {\n          ...PenaltyTakersRunner\n        }\n        skyrocketCrossbar {\n          ...PenaltyTakersRunner\n        }\n        rightPostMiss {\n          ...PenaltyTakersRunner\n        }\n        leftSave {\n          ...PenaltyTakersRunner\n        }\n        centerSave {\n          ...PenaltyTakersRunner\n        }\n        rightSave {\n          ...PenaltyTakersRunner\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query PenaltyTakersCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...PenaltyTakersCard\n    }\n  }\n",
): (typeof documents)["\n  query PenaltyTakersCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...PenaltyTakersCard\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query PenaltyTakersCardUserDetails {\n    AppContext {\n      ...PenaltyTakersCardUserDetails\n    }\n  }\n",
): (typeof documents)["\n  query PenaltyTakersCardUserDetails {\n    AppContext {\n      ...PenaltyTakersCardUserDetails\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment PlayerEventMarketsCard on PlayerEventMarketsCard {\n    __typename\n    urn\n    playerContext {\n      ... on FootballPlayerFixtureContext {\n        __typename\n        fixture {\n          ... on FootballFixture {\n            urn\n            home {\n              id\n            }\n            away {\n              id\n            }\n            sportevent {\n              urn\n            }\n          }\n        }\n        player {\n          name\n          shirtNumber\n          position\n          positionDescription\n        }\n        team {\n          id\n          jerseys {\n            url\n            color\n            type\n          }\n        }\n      }\n    }\n    playerViewLink {\n      viewUrl\n      viewUrn\n    }\n    playerCardEventViewLink: eventViewLink {\n      viewUrl\n      viewUrn\n    }\n    playerCardMarketTitle: title {\n      ... on DisplayNameTitle {\n        name\n      }\n      ... on DisplayNameTranslationKey {\n        translationKey\n      }\n    }\n    playerCardMarkets: markets {\n      label {\n        ... on DisplayNameTitle {\n          name\n        }\n        ... on DisplayNameTranslationKey {\n          translationKey\n        }\n      }\n      market {\n        ... on SportsbookMarket {\n          urn\n        }\n      }\n      runner {\n        runnerURN\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment PlayerEventMarketsCard on PlayerEventMarketsCard {\n    __typename\n    urn\n    playerContext {\n      ... on FootballPlayerFixtureContext {\n        __typename\n        fixture {\n          ... on FootballFixture {\n            urn\n            home {\n              id\n            }\n            away {\n              id\n            }\n            sportevent {\n              urn\n            }\n          }\n        }\n        player {\n          name\n          shirtNumber\n          position\n          positionDescription\n        }\n        team {\n          id\n          jerseys {\n            url\n            color\n            type\n          }\n        }\n      }\n    }\n    playerViewLink {\n      viewUrl\n      viewUrn\n    }\n    playerCardEventViewLink: eventViewLink {\n      viewUrl\n      viewUrn\n    }\n    playerCardMarketTitle: title {\n      ... on DisplayNameTitle {\n        name\n      }\n      ... on DisplayNameTranslationKey {\n        translationKey\n      }\n    }\n    playerCardMarkets: markets {\n      label {\n        ... on DisplayNameTitle {\n          name\n        }\n        ... on DisplayNameTranslationKey {\n          translationKey\n        }\n      }\n      market {\n        ... on SportsbookMarket {\n          urn\n        }\n      }\n      runner {\n        runnerURN\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query PlayerEventMarketsCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...PlayerEventMarketsCard\n    }\n  }\n",
): (typeof documents)["\n  query PlayerEventMarketsCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...PlayerEventMarketsCard\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment PlayersRail on PlayersRail {\n    __typename\n    urn\n    playersRailTitle: title {\n      ... on DisplayNameTitle {\n        name\n      }\n      ... on DisplayNameTranslationKey {\n        translationKey\n      }\n    }\n    items(first: 2) {\n      edges {\n        node {\n          ...PlayerEventMarketsCard\n        }\n      }\n    }\n    partials: items {\n      edges {\n        node {\n          __typename\n          ... on PlayerEventMarketsCard {\n            urn\n          }\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment PlayersRail on PlayersRail {\n    __typename\n    urn\n    playersRailTitle: title {\n      ... on DisplayNameTitle {\n        name\n      }\n      ... on DisplayNameTranslationKey {\n        translationKey\n      }\n    }\n    items(first: 2) {\n      edges {\n        node {\n          ...PlayerEventMarketsCard\n        }\n      }\n    }\n    partials: items {\n      edges {\n        node {\n          __typename\n          ... on PlayerEventMarketsCard {\n            urn\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query PlayersRail($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...PlayersRail\n    }\n  }\n",
): (typeof documents)["\n  query PlayersRail($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...PlayersRail\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment PopularSelectionsCard on PopularSelectionsCard {\n    __typename\n    urn\n    title\n    visibleSelectionsLimit\n    isExpandable\n    isExpandedByDefault\n    popularDisplayMode: displayMode\n    popularSelectionsCardItems: items {\n      runner {\n        runnerURN\n        name\n        selectionId\n        participantId\n        runnerLiveData {\n          ... on SportsbookRunnerLiveData {\n            urn\n            __typename\n            odds {\n              decimal\n              fractional {\n                denominator\n                numerator\n              }\n            }\n            displayOdds {\n              decimal\n              fractional {\n                denominator\n                numerator\n              }\n            }\n            runnerStatus\n          }\n        }\n      }\n      market {\n        urn\n        name\n        liveData {\n          ... on SportsbookMarketLiveData {\n            urn\n            sportsbookMarketStatus\n            bspMarket\n          }\n        }\n      }\n      stats {\n          betCount\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment PopularSelectionsCard on PopularSelectionsCard {\n    __typename\n    urn\n    title\n    visibleSelectionsLimit\n    isExpandable\n    isExpandedByDefault\n    popularDisplayMode: displayMode\n    popularSelectionsCardItems: items {\n      runner {\n        runnerURN\n        name\n        selectionId\n        participantId\n        runnerLiveData {\n          ... on SportsbookRunnerLiveData {\n            urn\n            __typename\n            odds {\n              decimal\n              fractional {\n                denominator\n                numerator\n              }\n            }\n            displayOdds {\n              decimal\n              fractional {\n                denominator\n                numerator\n              }\n            }\n            runnerStatus\n          }\n        }\n      }\n      market {\n        urn\n        name\n        liveData {\n          ... on SportsbookMarketLiveData {\n            urn\n            sportsbookMarketStatus\n            bspMarket\n          }\n        }\n      }\n      stats {\n          betCount\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment PopularSelectionsCardEnrichedPartial on PopularSelectionsCard {\n    __typename\n    urn\n    title\n    visibleSelectionsLimit\n    isExpandable\n    isExpandedByDefault\n    popularDisplayMode: displayMode\n}",
): (typeof documents)["\n  fragment PopularSelectionsCardEnrichedPartial on PopularSelectionsCard {\n    __typename\n    urn\n    title\n    visibleSelectionsLimit\n    isExpandable\n    isExpandedByDefault\n    popularDisplayMode: displayMode\n}"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query PopularSelectionsQuery($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...PopularSelectionsCard\n    }\n  }",
): (typeof documents)["\n  query PopularSelectionsQuery($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...PopularSelectionsCard\n    }\n  }"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment PopularSelectionsOddsDisplayPreference on AppContextDetails {\n    __typename\n    urn\n    preferences {\n      sportsbookOddsDisplay {\n        urn\n        selectedOddsDisplayFormat\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment PopularSelectionsOddsDisplayPreference on AppContextDetails {\n    __typename\n    urn\n    preferences {\n      sportsbookOddsDisplay {\n        urn\n        selectedOddsDisplayFormat\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query PopularSelectionsOddsDisplayPreferenceQuery {\n    AppContext {\n      ...PopularSelectionsOddsDisplayPreference\n    }\n  }\n",
): (typeof documents)["\n  query PopularSelectionsOddsDisplayPreferenceQuery {\n    AppContext {\n      ...PopularSelectionsOddsDisplayPreference\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment PopularSelectionsCardPotentialBets on PopularSelectionsCard {\n    __typename\n    urn\n    popularSelectionsCardItems: items {\n      runner {\n        runnerLiveData {\n          ... on SportsbookRunnerLiveData {\n            __typename\n            urn\n            isPotentialBet @client\n          }\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment PopularSelectionsCardPotentialBets on PopularSelectionsCard {\n    __typename\n    urn\n    popularSelectionsCardItems: items {\n      runner {\n        runnerLiveData {\n          ... on SportsbookRunnerLiveData {\n            __typename\n            urn\n            isPotentialBet @client\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment PopularSelectionsCardDisplayMode on PopularSelectionsCard {\n    __typename\n    urn\n    title\n    popularDisplayMode: displayMode\n    items {\n      __typename\n    }\n  }\n",
): (typeof documents)["\n  fragment PopularSelectionsCardDisplayMode on PopularSelectionsCard {\n    __typename\n    urn\n    title\n    popularDisplayMode: displayMode\n    items {\n      __typename\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query PopularSelectionsCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...PopularSelectionsCardDisplayMode\n    }\n  }",
): (typeof documents)["\n  query PopularSelectionsCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...PopularSelectionsCardDisplayMode\n    }\n  }"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment PopularSelectionsCardTitle on PopularSelectionsCard {\n    __typename\n    urn\n    title\n    items {\n      __typename\n    }\n  }\n",
): (typeof documents)["\n  fragment PopularSelectionsCardTitle on PopularSelectionsCard {\n    __typename\n    urn\n    title\n    items {\n      __typename\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n      query PopularSelectionsPromoBanner($urn: [URN!]!) {\n        Cards(cardsURN: $urn) {\n          ...PopularSelectionsCardTitle\n        }\n      }\n    ",
): (typeof documents)["\n      query PopularSelectionsPromoBanner($urn: [URN!]!) {\n        Cards(cardsURN: $urn) {\n          ...PopularSelectionsCardTitle\n        }\n      }\n    "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment SportsbookBetButtonIsPotentialBet on SportsbookRunnerLiveData {\n    __typename\n    urn\n    isPotentialBet @client\n  }\n",
): (typeof documents)["\n  fragment SportsbookBetButtonIsPotentialBet on SportsbookRunnerLiveData {\n    __typename\n    urn\n    isPotentialBet @client\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment SportsbookOddsDisplayPreference on AppContextDetails {\n    __typename\n    urn\n    preferences {\n      sportsbookOddsDisplay {\n        urn\n        selectedOddsDisplayFormat\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment SportsbookOddsDisplayPreference on AppContextDetails {\n    __typename\n    urn\n    preferences {\n      sportsbookOddsDisplay {\n        urn\n        selectedOddsDisplayFormat\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment SportsbookBetButtonRunner on Runner {\n    runnerURN\n    name\n    market {\n      ... on SportsbookMarket {\n        urn\n        name\n        liveData {\n          ... on SportsbookMarketLiveData {\n            urn\n            sportsbookMarketStatus\n            bspMarket\n          }\n        }\n        hierarchy {\n          ... on RaceHierarchy {\n            race {\n              urn\n            }\n          }\n        }\n        isOddsboostMarketType\n      }\n    }\n    runnerLiveData {\n      ... on SportsbookRunnerLiveData {\n        urn\n        runnerURN\n        runnerStatus\n        odds {\n          decimal\n          fractional {\n            numerator\n            denominator\n          }\n        }\n        displayOdds {\n          decimal\n          fractional {\n            numerator\n            denominator\n          }\n        }\n        previousOdds(limit: 1) {\n          odds {\n            decimal\n            fractional {\n              numerator\n              denominator\n            }\n          }\n          displayOdds {\n            decimal\n            fractional {\n              numerator\n              denominator\n            }\n          }\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment SportsbookBetButtonRunner on Runner {\n    runnerURN\n    name\n    market {\n      ... on SportsbookMarket {\n        urn\n        name\n        liveData {\n          ... on SportsbookMarketLiveData {\n            urn\n            sportsbookMarketStatus\n            bspMarket\n          }\n        }\n        hierarchy {\n          ... on RaceHierarchy {\n            race {\n              urn\n            }\n          }\n        }\n        isOddsboostMarketType\n      }\n    }\n    runnerLiveData {\n      ... on SportsbookRunnerLiveData {\n        urn\n        runnerURN\n        runnerStatus\n        odds {\n          decimal\n          fractional {\n            numerator\n            denominator\n          }\n        }\n        displayOdds {\n          decimal\n          fractional {\n            numerator\n            denominator\n          }\n        }\n        previousOdds(limit: 1) {\n          odds {\n            decimal\n            fractional {\n              numerator\n              denominator\n            }\n          }\n          displayOdds {\n            decimal\n            fractional {\n              numerator\n              denominator\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query SportsbookOddsDisplayPreference {\n    AppContext {\n      ...SportsbookOddsDisplayPreference\n    }\n  }\n",
): (typeof documents)["\n  query SportsbookOddsDisplayPreference {\n    AppContext {\n      ...SportsbookOddsDisplayPreference\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query SportsbookBetButton($runnerURNs: [URN!]!) {\n    Runners(runnerURNs: $runnerURNs) {\n      ...SportsbookBetButtonRunner\n    }\n  }\n",
): (typeof documents)["\n  query SportsbookBetButton($runnerURNs: [URN!]!) {\n    Runners(runnerURNs: $runnerURNs) {\n      ...SportsbookBetButtonRunner\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment SportsbookChatbotCard on SportsbookChatbotCard {\n    __typename\n    urn\n    chatId\n    startDate\n    endDate\n    displayWindowOffset\n    chatContext {\n      eventId\n      eventName\n    }\n    infoTitle {\n      ... on DisplayNameTitle {\n        name\n      }\n      ... on DisplayNameTranslationKey {\n        translationKey\n      }\n    }\n    infoDescription {\n      ... on DisplayNameTitle {\n        name\n      }\n      ... on DisplayNameTranslationKey {\n        translationKey\n      }\n    }\n    startingPrompts {\n      ... on DisplayNameTitle {\n        name\n      }\n      ... on DisplayNameTranslationKey {\n        translationKey\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment SportsbookChatbotCard on SportsbookChatbotCard {\n    __typename\n    urn\n    chatId\n    startDate\n    endDate\n    displayWindowOffset\n    chatContext {\n      eventId\n      eventName\n    }\n    infoTitle {\n      ... on DisplayNameTitle {\n        name\n      }\n      ... on DisplayNameTranslationKey {\n        translationKey\n      }\n    }\n    infoDescription {\n      ... on DisplayNameTitle {\n        name\n      }\n      ... on DisplayNameTranslationKey {\n        translationKey\n      }\n    }\n    startingPrompts {\n      ... on DisplayNameTitle {\n        name\n      }\n      ... on DisplayNameTranslationKey {\n        translationKey\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query SportsbookChatbotCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...SportsbookChatbotCard\n    }\n  }\n",
): (typeof documents)["\n  query SportsbookChatbotCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...SportsbookChatbotCard\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment SportsbookChatbotCardChatState on SportsbookChatbotCard {\n    chatState @client\n  }\n",
): (typeof documents)["\n  fragment SportsbookChatbotCardChatState on SportsbookChatbotCard {\n    chatState @client\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query SportsbookChatbotHistory($chatId: ID!) {\n    sportsbookChatBotHistory(chatId: $chatId) {\n      chatId\n      messages {\n        urn\n        status\n        role\n        isHistoryMessage @client\n        feedbackSubmitted @client\n        parts {\n          ...SportsbookChatbotTextPart\n          ...SportsbookChatbotBetSuggestionPart\n          ...SportsbookChatbotParticipantStatsPart\n          ...SportsbookChatbotParticipantStatsRankingPart\n          ...SportsbookChatbotStatsComparisonPart\n          ...SportsbookChatbotSwimlanePart\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  query SportsbookChatbotHistory($chatId: ID!) {\n    sportsbookChatBotHistory(chatId: $chatId) {\n      chatId\n      messages {\n        urn\n        status\n        role\n        isHistoryMessage @client\n        feedbackSubmitted @client\n        parts {\n          ...SportsbookChatbotTextPart\n          ...SportsbookChatbotBetSuggestionPart\n          ...SportsbookChatbotParticipantStatsPart\n          ...SportsbookChatbotParticipantStatsRankingPart\n          ...SportsbookChatbotStatsComparisonPart\n          ...SportsbookChatbotSwimlanePart\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query SportsbookChatbotMessage($messageUrn: URN!) {\n    sportsbookChatBotMessage(messageUrn: $messageUrn) {\n      urn\n      status\n      role\n      isHistoryMessage @client\n      feedbackSubmitted @client\n      parts {\n        ...SportsbookChatbotTextPart\n        ...SportsbookChatbotBetSuggestionPart\n        ...SportsbookChatbotParticipantStatsPart\n        ...SportsbookChatbotParticipantStatsRankingPart\n        ...SportsbookChatbotStatsComparisonPart\n        ...SportsbookChatbotSwimlanePart\n      }\n    }\n  }\n",
): (typeof documents)["\n  query SportsbookChatbotMessage($messageUrn: URN!) {\n    sportsbookChatBotMessage(messageUrn: $messageUrn) {\n      urn\n      status\n      role\n      isHistoryMessage @client\n      feedbackSubmitted @client\n      parts {\n        ...SportsbookChatbotTextPart\n        ...SportsbookChatbotBetSuggestionPart\n        ...SportsbookChatbotParticipantStatsPart\n        ...SportsbookChatbotParticipantStatsRankingPart\n        ...SportsbookChatbotStatsComparisonPart\n        ...SportsbookChatbotSwimlanePart\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  mutation SportsbookChatbotSendMessage($input: SportsbookChatBotSendMessageInput!) {\n    sportsbookChatBotSendMessage(input: $input) {\n      messageUrn\n      status\n    }\n  }\n",
): (typeof documents)["\n  mutation SportsbookChatbotSendMessage($input: SportsbookChatBotSendMessageInput!) {\n    sportsbookChatBotSendMessage(input: $input) {\n      messageUrn\n      status\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment SportsbookChatbotBetSuggestionPart on SportsbookChatBotBetSuggestionPart {\n    __typename\n    selections {\n      runner {\n        runnerURN\n        marketURN\n        name\n      }\n      market {\n        name\n      }\n      footballFixture {\n        home {\n          jerseys {\n            url\n          }\n        }\n        away {\n          jerseys {\n            url\n          }\n        }\n      }\n      participant {\n        __typename\n        ... on FootballTeam {\n          jerseys {\n            url\n          }\n        }\n        ... on FootballPlayerFixtureContext {\n          team {\n            jerseys {\n              url\n            }\n          }\n        }\n      }\n    }\n    odds {\n      decimal\n      fractional {\n        numerator\n        denominator\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment SportsbookChatbotBetSuggestionPart on SportsbookChatBotBetSuggestionPart {\n    __typename\n    selections {\n      runner {\n        runnerURN\n        marketURN\n        name\n      }\n      market {\n        name\n      }\n      footballFixture {\n        home {\n          jerseys {\n            url\n          }\n        }\n        away {\n          jerseys {\n            url\n          }\n        }\n      }\n      participant {\n        __typename\n        ... on FootballTeam {\n          jerseys {\n            url\n          }\n        }\n        ... on FootballPlayerFixtureContext {\n          team {\n            jerseys {\n              url\n            }\n          }\n        }\n      }\n    }\n    odds {\n      decimal\n      fractional {\n        numerator\n        denominator\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment SportsbookChatbotParticipantStatsPart on SportsbookChatBotParticipantStatsPart {\n    __typename\n    participant {\n      __typename\n      ... on FootballTeam {\n        urn\n        name\n        jerseys {\n          url\n        }\n      }\n      ... on FootballPlayerFixtureContext {\n        urn\n        player {\n          name\n        }\n        team {\n          jerseys {\n            url\n          }\n        }\n      }\n    }\n    stats {\n      key\n      value\n    }\n  }\n",
): (typeof documents)["\n  fragment SportsbookChatbotParticipantStatsPart on SportsbookChatBotParticipantStatsPart {\n    __typename\n    participant {\n      __typename\n      ... on FootballTeam {\n        urn\n        name\n        jerseys {\n          url\n        }\n      }\n      ... on FootballPlayerFixtureContext {\n        urn\n        player {\n          name\n        }\n        team {\n          jerseys {\n            url\n          }\n        }\n      }\n    }\n    stats {\n      key\n      value\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment SportsbookChatbotParticipantStatsRankingPart on SportsbookChatBotParticipantStatsRankingPart {\n    __typename\n    statName\n    ranking {\n      participant {\n        ... on FootballTeam {\n          __typename\n          urn\n          name\n          jerseys {\n            url\n          }\n        }\n        ... on FootballPlayerFixtureContext {\n          __typename\n          urn\n          player {\n            name\n          }\n        }\n      }\n      value\n    }\n  }\n",
): (typeof documents)["\n  fragment SportsbookChatbotParticipantStatsRankingPart on SportsbookChatBotParticipantStatsRankingPart {\n    __typename\n    statName\n    ranking {\n      participant {\n        ... on FootballTeam {\n          __typename\n          urn\n          name\n          jerseys {\n            url\n          }\n        }\n        ... on FootballPlayerFixtureContext {\n          __typename\n          urn\n          player {\n            name\n          }\n        }\n      }\n      value\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment SportsbookChatbotStatsComparisonPart on SportsbookChatBotStatsComparisonPart {\n    __typename\n    participantA {\n      __typename\n      ... on FootballTeam {\n        urn\n        name\n        jerseys {\n          url\n        }\n      }\n      ... on FootballPlayerFixtureContext {\n        urn\n        player {\n          name\n        }\n        team {\n          jerseys {\n            url\n          }\n        }\n      }\n    }\n    participantB {\n      __typename\n      ... on FootballTeam {\n        urn\n        name\n        jerseys {\n          url\n        }\n      }\n      ... on FootballPlayerFixtureContext {\n        urn\n        player {\n          name\n        }\n        team {\n          jerseys {\n            url\n          }\n        }\n      }\n    }\n    stats {\n      statName\n      participantAValue\n      participantBValue\n    }\n  }\n",
): (typeof documents)["\n  fragment SportsbookChatbotStatsComparisonPart on SportsbookChatBotStatsComparisonPart {\n    __typename\n    participantA {\n      __typename\n      ... on FootballTeam {\n        urn\n        name\n        jerseys {\n          url\n        }\n      }\n      ... on FootballPlayerFixtureContext {\n        urn\n        player {\n          name\n        }\n        team {\n          jerseys {\n            url\n          }\n        }\n      }\n    }\n    participantB {\n      __typename\n      ... on FootballTeam {\n        urn\n        name\n        jerseys {\n          url\n        }\n      }\n      ... on FootballPlayerFixtureContext {\n        urn\n        player {\n          name\n        }\n        team {\n          jerseys {\n            url\n          }\n        }\n      }\n    }\n    stats {\n      statName\n      participantAValue\n      participantBValue\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment SportsbookChatbotSwimlanePart on SportsbookChatBotSwimlanePart {\n    __typename\n    items {\n      __typename\n      ...SportsbookChatbotTextPart\n      ...SportsbookChatbotBetSuggestionPart\n      ...SportsbookChatbotParticipantStatsPart\n      ...SportsbookChatbotParticipantStatsRankingPart\n      ...SportsbookChatbotStatsComparisonPart\n    }\n  }\n",
): (typeof documents)["\n  fragment SportsbookChatbotSwimlanePart on SportsbookChatBotSwimlanePart {\n    __typename\n    items {\n      __typename\n      ...SportsbookChatbotTextPart\n      ...SportsbookChatbotBetSuggestionPart\n      ...SportsbookChatbotParticipantStatsPart\n      ...SportsbookChatbotParticipantStatsRankingPart\n      ...SportsbookChatbotStatsComparisonPart\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment SportsbookChatbotTextPart on SportsbookChatBotTextPart {\n    __typename\n    text\n  }\n",
): (typeof documents)["\n  fragment SportsbookChatbotTextPart on SportsbookChatBotTextPart {\n    __typename\n    text\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query SportsbookChatbotCardChatState($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ... on SportsbookChatbotCard {\n        chatState @client\n      }\n    }\n  }\n",
): (typeof documents)["\n  query SportsbookChatbotCardChatState($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ... on SportsbookChatbotCard {\n        chatState @client\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query SportsbookChatbotInput($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ... on SportsbookChatbotCard {\n        startingPrompts {\n          ... on DisplayNameTitle {\n            name\n          }\n          ... on DisplayNameTranslationKey {\n            translationKey\n          }\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  query SportsbookChatbotInput($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ... on SportsbookChatbotCard {\n        startingPrompts {\n          ... on DisplayNameTitle {\n            name\n          }\n          ... on DisplayNameTranslationKey {\n            translationKey\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query SportsbookChatbotCardChatContext($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ... on SportsbookChatbotCard {\n        chatContext {\n          eventName\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  query SportsbookChatbotCardChatContext($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ... on SportsbookChatbotCard {\n        chatContext {\n          eventName\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment AppContextDetails on AppContextDetails {\n    __typename\n    urn\n    userdetails {\n      accountId\n      loggedIn\n      jurisdiction {\n        jurisdiction\n      }\n      region\n      bucketId\n      countryCode\n      localeCode\n      localeCodeBcp47\n      timezone\n      currencyCode\n      excSettings {\n        discount\n        currencyDetails {\n          minBspLiability\n          minStake\n          currencyCode\n          currencyId\n        }\n      }\n      firstName\n      lastName\n      lastLoginDate\n      jurisdictionalData {\n        nationalIdentifier\n        contractNumber\n      }\n      productExclusions\n      migrationData {\n        heritageAccountId\n        heritageSecondaryAccountId\n        heritageSystem\n        migrationInformation\n        migrationDate\n      }\n    }\n    throttles {\n      name\n      isActive\n    }\n    brandSettings {\n      name\n      isActive\n    }\n    preferences {\n      confirmCashout {\n        urn\n        shouldConfirmCashout\n      }\n      exchangeConfirmBetPlacement {\n        urn\n        shouldConfirmBetPlacement\n      }\n      oddsMovement {\n        urn\n        shouldAcceptOddsMovement\n      }\n      showBalances {\n        urn\n        shouldShowBalances\n      }\n      quickStakes {\n        urn\n        selectedQuickStakes {\n          stake\n        }\n      }\n      exchangeOddsDisplay {\n        urn\n        selectedOddsDisplayFormat\n      }\n      sportsbookOddsDisplay {\n        urn\n        selectedOddsDisplayFormat\n      }\n      favoriteSports {\n        urn\n        selectedFavoriteSports {\n          urn\n          sportId\n        }\n      }\n      defaultProduct {\n        urn\n        selectedDefaultProduct\n      }\n      exchangeDefaultProduct {\n        urn\n        selectedExchangeDefaultProduct\n      }\n      products {\n        urn\n        selectedProduct\n      }\n      lastViewedProduct {\n        urn\n        selectedLastViewedProduct\n      }\n      phoenixMigratedUser {\n        urn\n        isPhoenixMigratedUser\n      }\n      exchangeDefaultMode {\n        urn\n        selectedExchangeDefaultMode\n      }\n    }\n    registration {\n      joinNowLabel\n      joinNowLink\n    }\n    pollcadences {\n      ERO\n      SMP\n      WAS\n      LBR\n      SIB\n      SER\n      SCA {\n        loggedIn {\n          default {\n            inPlay\n            notInPlay\n          }\n        }\n        loggedOut {\n          default {\n            inPlay\n            notInPlay\n          }\n        }\n      }\n      COS {\n        loggedIn {\n          default {\n            inPlay\n            notInPlay\n          }\n          sports {\n            sportId\n            inPlay\n            notInPlay\n          }\n        }\n        loggedOut {\n          default {\n            inPlay\n            notInPlay\n          }\n        }\n      }\n      JACKPOT_ZONE\n      MY_BETS\n      POPULAR_BETS\n      REFRESH_CARDS\n      POLLING_DEBOUNCE\n    }\n  }\n",
): (typeof documents)["\n  fragment AppContextDetails on AppContextDetails {\n    __typename\n    urn\n    userdetails {\n      accountId\n      loggedIn\n      jurisdiction {\n        jurisdiction\n      }\n      region\n      bucketId\n      countryCode\n      localeCode\n      localeCodeBcp47\n      timezone\n      currencyCode\n      excSettings {\n        discount\n        currencyDetails {\n          minBspLiability\n          minStake\n          currencyCode\n          currencyId\n        }\n      }\n      firstName\n      lastName\n      lastLoginDate\n      jurisdictionalData {\n        nationalIdentifier\n        contractNumber\n      }\n      productExclusions\n      migrationData {\n        heritageAccountId\n        heritageSecondaryAccountId\n        heritageSystem\n        migrationInformation\n        migrationDate\n      }\n    }\n    throttles {\n      name\n      isActive\n    }\n    brandSettings {\n      name\n      isActive\n    }\n    preferences {\n      confirmCashout {\n        urn\n        shouldConfirmCashout\n      }\n      exchangeConfirmBetPlacement {\n        urn\n        shouldConfirmBetPlacement\n      }\n      oddsMovement {\n        urn\n        shouldAcceptOddsMovement\n      }\n      showBalances {\n        urn\n        shouldShowBalances\n      }\n      quickStakes {\n        urn\n        selectedQuickStakes {\n          stake\n        }\n      }\n      exchangeOddsDisplay {\n        urn\n        selectedOddsDisplayFormat\n      }\n      sportsbookOddsDisplay {\n        urn\n        selectedOddsDisplayFormat\n      }\n      favoriteSports {\n        urn\n        selectedFavoriteSports {\n          urn\n          sportId\n        }\n      }\n      defaultProduct {\n        urn\n        selectedDefaultProduct\n      }\n      exchangeDefaultProduct {\n        urn\n        selectedExchangeDefaultProduct\n      }\n      products {\n        urn\n        selectedProduct\n      }\n      lastViewedProduct {\n        urn\n        selectedLastViewedProduct\n      }\n      phoenixMigratedUser {\n        urn\n        isPhoenixMigratedUser\n      }\n      exchangeDefaultMode {\n        urn\n        selectedExchangeDefaultMode\n      }\n    }\n    registration {\n      joinNowLabel\n      joinNowLink\n    }\n    pollcadences {\n      ERO\n      SMP\n      WAS\n      LBR\n      SIB\n      SER\n      SCA {\n        loggedIn {\n          default {\n            inPlay\n            notInPlay\n          }\n        }\n        loggedOut {\n          default {\n            inPlay\n            notInPlay\n          }\n        }\n      }\n      COS {\n        loggedIn {\n          default {\n            inPlay\n            notInPlay\n          }\n          sports {\n            sportId\n            inPlay\n            notInPlay\n          }\n        }\n        loggedOut {\n          default {\n            inPlay\n            notInPlay\n          }\n        }\n      }\n      JACKPOT_ZONE\n      MY_BETS\n      POPULAR_BETS\n      REFRESH_CARDS\n      POLLING_DEBOUNCE\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query AppContextDetailsQuery {\n    AppContext {\n      ...AppContextDetails\n    }\n  }\n",
): (typeof documents)["\n  query AppContextDetailsQuery {\n    AppContext {\n      ...AppContextDetails\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query ViewRedirect($viewURN: URN!) {\n    View(viewURN: $viewURN) {\n      __typename\n      urn\n      url\n    }\n  }\n",
): (typeof documents)["\n  query ViewRedirect($viewURN: URN!) {\n    View(viewURN: $viewURN) {\n      __typename\n      urn\n      url\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment sportEventCacheWarmup on SportsEvent {\n    __typename\n    urn\n    eventId\n    name\n    openDate\n    competition {\n      __typename\n      urn\n      name\n      sport {\n        __typename\n        urn\n        name\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment sportEventCacheWarmup on SportsEvent {\n    __typename\n    urn\n    eventId\n    name\n    openDate\n    competition {\n      __typename\n      urn\n      name\n      sport {\n        __typename\n        urn\n        name\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment FilteredCouponCardGroupAllCompetitionsFilterOptions on FilteredCouponCardGroup {\n    filterOptions {\n      __typename\n      competitionsFilter {\n        urn\n        allCompetitions {\n          competitions {\n            __typename\n            urn\n            name\n            competitionId\n            sport {\n              __typename\n              urn\n              name\n              sportId\n            }\n          }\n          country {\n            urn\n            code\n            flag {\n              vector\n              small\n              medium\n              large\n            }\n          }\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment FilteredCouponCardGroupAllCompetitionsFilterOptions on FilteredCouponCardGroup {\n    filterOptions {\n      __typename\n      competitionsFilter {\n        urn\n        allCompetitions {\n          competitions {\n            __typename\n            urn\n            name\n            competitionId\n            sport {\n              __typename\n              urn\n              name\n              sportId\n            }\n          }\n          country {\n            urn\n            code\n            flag {\n              vector\n              small\n              medium\n              large\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query AllCompetitionsFilter($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...FilteredCouponCardGroupAllCompetitionsFilterOptions\n    }\n  }\n",
): (typeof documents)["\n  query AllCompetitionsFilter($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...FilteredCouponCardGroupAllCompetitionsFilterOptions\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment MonterosaContentCard on MonterosaContentCard {\n    __typename\n    urn\n    host\n    projectId\n    monterosaEventId\n  }\n",
): (typeof documents)["\n  fragment MonterosaContentCard on MonterosaContentCard {\n    __typename\n    urn\n    host\n    projectId\n    monterosaEventId\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query MonterosaContentCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...MonterosaContentCard\n    }\n  }\n",
): (typeof documents)["\n  query MonterosaContentCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...MonterosaContentCard\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment MonterosaAppContext on AppContextDetails {\n    __typename\n    urn\n    preferences {\n      sportsbookOddsDisplay {\n        __typename\n        urn\n        selectedOddsDisplayFormat\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment MonterosaAppContext on AppContextDetails {\n    __typename\n    urn\n    preferences {\n      sportsbookOddsDisplay {\n        __typename\n        urn\n        selectedOddsDisplayFormat\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query MonterosaAppContext {\n    AppContext {\n      ...MonterosaAppContext\n    }\n  }\n",
): (typeof documents)["\n  query MonterosaAppContext {\n    AppContext {\n      ...MonterosaAppContext\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment footballPlayerCompetitionStatsCard on FootballPlayerCompetitionStatsCard {\n    __typename\n    urn\n    player {\n      seasonStats {\n        matchesPlayed\n        totals {\n          goals\n          yellowCards\n          redCards\n          assists\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment footballPlayerCompetitionStatsCard on FootballPlayerCompetitionStatsCard {\n    __typename\n    urn\n    player {\n      seasonStats {\n        matchesPlayed\n        totals {\n          goals\n          yellowCards\n          redCards\n          assists\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query FootballPlayerCompetitionStatsCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...footballPlayerCompetitionStatsCard\n    }\n  }\n",
): (typeof documents)["\n  query FootballPlayerCompetitionStatsCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...footballPlayerCompetitionStatsCard\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment PlayerMarketsCardGroup on PlayerMarketsCardGroup {\n    __typename\n    urn\n    fixtureCard {\n      __typename\n      urn\n    }\n    items {\n      edges {\n        node {\n          ... on PebbleCardGroup {\n            __typename\n            urn\n          }\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment PlayerMarketsCardGroup on PlayerMarketsCardGroup {\n    __typename\n    urn\n    fixtureCard {\n      __typename\n      urn\n    }\n    items {\n      edges {\n        node {\n          ... on PebbleCardGroup {\n            __typename\n            urn\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query PlayerMarketsCardGroup($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...PlayerMarketsCardGroup\n    }\n  }\n",
): (typeof documents)["\n  query PlayerMarketsCardGroup($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...PlayerMarketsCardGroup\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment PlayerView on PlayerView {\n    __typename\n    urn\n    url\n    title\n    context {\n      __typename\n      ... on FootballPlayerFixtureContext {\n        player {\n          id\n          urn\n          name\n          position\n          shirtNumber\n        }\n        team {\n          name\n          color\n        }\n      }\n    }\n    items {\n      edges {\n        node {\n          ...footballPlayerCompetitionStatsCard\n          ... on PlayerMarketsCardGroup {\n            __typename\n            urn\n          }\n          ... on RegulatoryCard {\n            __typename\n            urn\n          }\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment PlayerView on PlayerView {\n    __typename\n    urn\n    url\n    title\n    context {\n      __typename\n      ... on FootballPlayerFixtureContext {\n        player {\n          id\n          urn\n          name\n          position\n          shirtNumber\n        }\n        team {\n          name\n          color\n        }\n      }\n    }\n    items {\n      edges {\n        node {\n          ...footballPlayerCompetitionStatsCard\n          ... on PlayerMarketsCardGroup {\n            __typename\n            urn\n          }\n          ... on RegulatoryCard {\n            __typename\n            urn\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query PlayerView($urn: URN!) {\n    View(viewURN: $urn) {\n      ...PlayerView\n    }\n  }\n",
): (typeof documents)["\n  query PlayerView($urn: URN!) {\n    View(viewURN: $urn) {\n      ...PlayerView\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment NavigationTabsListCard on NavigationTabsList {\n    __typename\n    urn\n    title\n    items {\n      edges {\n        node {\n          ... on NavigationTab {\n            urn\n            title {\n              translated\n            }\n            viewLink {\n              viewUrn\n              viewUrl\n            }\n            items {\n              edges {\n                node {\n                  __typename\n                  urn\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment NavigationTabsListCard on NavigationTabsList {\n    __typename\n    urn\n    title\n    items {\n      edges {\n        node {\n          ... on NavigationTab {\n            urn\n            title {\n              translated\n            }\n            viewLink {\n              viewUrn\n              viewUrl\n            }\n            items {\n              edges {\n                node {\n                  __typename\n                  urn\n                }\n              }\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query NavigationTabsListCard($urns: [URN!]!) {\n    Cards(cardsURN: $urns) {\n      ...NavigationTabsListCard\n    }\n  }\n",
): (typeof documents)["\n  query NavigationTabsListCard($urns: [URN!]!) {\n    Cards(cardsURN: $urns) {\n      ...NavigationTabsListCard\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query RaceMeetingViewItems($viewURN: URN!, $race: URN) {\n    View(viewURN: $viewURN) {\n      ... on RaceMeetingView {\n        urn\n        races {\n          ...RaceNavigationItem\n        }\n        items(race: $race) {\n          selectedRace {\n            ...RaceNavigationItem\n          }\n          edges {\n            node {\n              ... on RaceResultsCard {\n                __typename\n                urn\n              }\n              ... on RegulatoryCard {\n                __typename\n                urn\n              }\n              ... on NavigationTabsList {\n                __typename\n                urn\n              }\n            }\n            cursor\n            theme\n          }\n          pageInfo {\n            endCursor\n            hasNextPage\n          }\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  query RaceMeetingViewItems($viewURN: URN!, $race: URN) {\n    View(viewURN: $viewURN) {\n      ... on RaceMeetingView {\n        urn\n        races {\n          ...RaceNavigationItem\n        }\n        items(race: $race) {\n          selectedRace {\n            ...RaceNavigationItem\n          }\n          edges {\n            node {\n              ... on RaceResultsCard {\n                __typename\n                urn\n              }\n              ... on RegulatoryCard {\n                __typename\n                urn\n              }\n              ... on NavigationTabsList {\n                __typename\n                urn\n              }\n            }\n            cursor\n            theme\n          }\n          pageInfo {\n            endCursor\n            hasNextPage\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment RaceMeetingViewAppContext on AppContextDetails {\n    __typename\n    urn\n    userdetails {\n      localeCodeBcp47\n      timezone\n    }\n    brandSettings {\n      name\n      isActive\n    }\n  }\n",
): (typeof documents)["\n  fragment RaceMeetingViewAppContext on AppContextDetails {\n    __typename\n    urn\n    userdetails {\n      localeCodeBcp47\n      timezone\n    }\n    brandSettings {\n      name\n      isActive\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query RaceMeetingViewAppContext {\n    AppContext {\n      ...RaceMeetingViewAppContext\n    }\n  }\n",
): (typeof documents)["\n  query RaceMeetingViewAppContext {\n    AppContext {\n      ...RaceMeetingViewAppContext\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment RaceNavigationItem on RaceNavigationItem {\n    race {\n      urn\n      raceId\n      name\n      startTime\n      verdict\n      broadcasts {\n        liveVideoUrl\n        dataVizUrl\n      }\n      primaryMarket {\n        ... on SportsbookMarket {\n          numberOfActiveRunners\n        }\n      }\n      raceKind {\n        ... on HorseRaceKind {\n          runners {\n            horse {\n              name\n            }\n            rating123\n            ratingStars\n          }\n          details {\n            name\n            title\n            scheduledTime\n            distance {\n              totalFurlongs\n              totalMeters\n              miles\n              furlongs\n              yards\n            }\n            numberOfRunners\n            numberOfNonRunners\n            numberOfParticipants\n            going\n            status\n            type\n            resultType\n            raceClass\n          }\n        }\n        ... on GreyhoundRaceKind {\n          details {\n            numberOfRunners\n          }\n        }\n      }\n      availableToSubscribe\n    }\n    viewLink {\n      viewUrn\n      viewUrl\n    }\n    promotion {\n      signposting\n    }\n  }\n",
): (typeof documents)["\n  fragment RaceNavigationItem on RaceNavigationItem {\n    race {\n      urn\n      raceId\n      name\n      startTime\n      verdict\n      broadcasts {\n        liveVideoUrl\n        dataVizUrl\n      }\n      primaryMarket {\n        ... on SportsbookMarket {\n          numberOfActiveRunners\n        }\n      }\n      raceKind {\n        ... on HorseRaceKind {\n          runners {\n            horse {\n              name\n            }\n            rating123\n            ratingStars\n          }\n          details {\n            name\n            title\n            scheduledTime\n            distance {\n              totalFurlongs\n              totalMeters\n              miles\n              furlongs\n              yards\n            }\n            numberOfRunners\n            numberOfNonRunners\n            numberOfParticipants\n            going\n            status\n            type\n            resultType\n            raceClass\n          }\n        }\n        ... on GreyhoundRaceKind {\n          details {\n            numberOfRunners\n          }\n        }\n      }\n      availableToSubscribe\n    }\n    viewLink {\n      viewUrn\n      viewUrl\n    }\n    promotion {\n      signposting\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment RaceMeetingView on RaceMeetingView {\n    __typename\n    urn\n    url\n    title\n    meeting {\n      urn\n      name\n      venue\n      country\n      date\n      countryFlag {\n        vector\n        small\n      }\n      sport {\n        sportId\n        name\n      }\n    }\n    races {\n      ...RaceNavigationItem\n    }\n    siblingRaceMeetingViews {\n      urn\n      url\n      meeting {\n        urn\n        name\n        venue\n        country\n        countryFlag {\n          vector\n          small\n        }\n      }\n    }\n    items {\n      selectedRace {\n        ...RaceNavigationItem\n      }\n      edges {\n        node {\n          ... on RaceResultsCard {\n            __typename\n            urn\n          }\n          ... on RegulatoryCard {\n            __typename\n            urn\n          }\n          ... on NavigationTabsList {\n            ...NavigationTabsListCard\n          }\n          ... on PreferenceSingleChoiceCard {\n            __typename\n            urn\n          }\n        }\n        cursor\n        theme\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment RaceMeetingView on RaceMeetingView {\n    __typename\n    urn\n    url\n    title\n    meeting {\n      urn\n      name\n      venue\n      country\n      date\n      countryFlag {\n        vector\n        small\n      }\n      sport {\n        sportId\n        name\n      }\n    }\n    races {\n      ...RaceNavigationItem\n    }\n    siblingRaceMeetingViews {\n      urn\n      url\n      meeting {\n        urn\n        name\n        venue\n        country\n        countryFlag {\n          vector\n          small\n        }\n      }\n    }\n    items {\n      selectedRace {\n        ...RaceNavigationItem\n      }\n      edges {\n        node {\n          ... on RaceResultsCard {\n            __typename\n            urn\n          }\n          ... on RegulatoryCard {\n            __typename\n            urn\n          }\n          ... on NavigationTabsList {\n            ...NavigationTabsListCard\n          }\n          ... on PreferenceSingleChoiceCard {\n            __typename\n            urn\n          }\n        }\n        cursor\n        theme\n      }\n      pageInfo {\n        endCursor\n        hasNextPage\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query RaceMeetingView($viewURN: URN!) {\n    View(viewURN: $viewURN) {\n      ...RaceMeetingView\n    }\n  }\n",
): (typeof documents)["\n  query RaceMeetingView($viewURN: URN!) {\n    View(viewURN: $viewURN) {\n      ...RaceMeetingView\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment SkyBetClubTrackerUserDetails on AppContextDetails {\n    __typename\n    urn\n    userdetails {\n      localeCodeBcp47\n      currencyCode\n      jurisdiction {\n        jurisdiction\n      }\n    }\n    brandSettings {\n      name\n      isActive\n    }\n  }\n",
): (typeof documents)["\n  fragment SkyBetClubTrackerUserDetails on AppContextDetails {\n    __typename\n    urn\n    userdetails {\n      localeCodeBcp47\n      currencyCode\n      jurisdiction {\n        jurisdiction\n      }\n    }\n    brandSettings {\n      name\n      isActive\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment SkyBetClubTrackerCard on SkyBetClubTrackerCard {\n    __typename\n    urn\n    promotion {\n      ... on PphPromotion {\n        fulfillmentEndDate\n        customerPromotionState {\n          criteriaState {\n            params {\n              gauge {\n                current\n                target\n              }\n            }\n          }\n          hasAccepted\n        }\n        termsAndConditions {\n          summarized\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment SkyBetClubTrackerCard on SkyBetClubTrackerCard {\n    __typename\n    urn\n    promotion {\n      ... on PphPromotion {\n        fulfillmentEndDate\n        customerPromotionState {\n          criteriaState {\n            params {\n              gauge {\n                current\n                target\n              }\n            }\n          }\n          hasAccepted\n        }\n        termsAndConditions {\n          summarized\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query SkyBetClubTrackerUserDetails {\n    AppContext {\n      ...SkyBetClubTrackerUserDetails\n    }\n  }\n",
): (typeof documents)["\n  query SkyBetClubTrackerUserDetails {\n    AppContext {\n      ...SkyBetClubTrackerUserDetails\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query SkyBetClubTrackerCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...SkyBetClubTrackerCard\n    }\n  }\n",
): (typeof documents)["\n  query SkyBetClubTrackerCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...SkyBetClubTrackerCard\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment LocalStatsContentCardGroup on StatsContentCardGroup {\n    selectedTab @client {\n      urn\n      typename\n    }\n  }\n",
): (typeof documents)["\n  fragment LocalStatsContentCardGroup on StatsContentCardGroup {\n    selectedTab @client {\n      urn\n      typename\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment StatsContentCardGroup on StatsContentCardGroup {\n    __typename\n    urn\n    ...LocalStatsContentCardGroup\n    partials: items {\n      edges {\n        ... on StatsMatchStatsItemEdge {\n          displayName {\n            translationKey\n          }\n          type\n          node {\n            urn\n            __typename\n          }\n        }\n        ... on StatsPebbleItemEdge {\n          displayName {\n            translationKey\n          }\n          type\n          node {\n            urn\n            __typename\n          }\n        }\n        ... on StatsLineupsItemEdge {\n          displayName {\n            translationKey\n          }\n          type\n          node {\n            urn\n            __typename\n          }\n        }\n        ... on StatsMatchStatsItemEdge {\n          displayName {\n            translationKey\n          }\n          type\n          node {\n            urn\n            __typename\n          }\n        }\n        ... on StatsBroadcastsItemEdge {\n          displayName {\n            translationKey\n          }\n          type\n          node {\n            urn\n            __typename\n          }\n        }\n        ... on StatsTableItemEdge {\n          displayName {\n            translationKey\n          }\n          type\n          node {\n            urn\n            __typename\n          }\n        }\n        ... on StatsPlayersInPlayItemEdge {\n          displayName {\n            translationKey\n          }\n          type\n          node {\n            urn\n            __typename\n          }\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment StatsContentCardGroup on StatsContentCardGroup {\n    __typename\n    urn\n    ...LocalStatsContentCardGroup\n    partials: items {\n      edges {\n        ... on StatsMatchStatsItemEdge {\n          displayName {\n            translationKey\n          }\n          type\n          node {\n            urn\n            __typename\n          }\n        }\n        ... on StatsPebbleItemEdge {\n          displayName {\n            translationKey\n          }\n          type\n          node {\n            urn\n            __typename\n          }\n        }\n        ... on StatsLineupsItemEdge {\n          displayName {\n            translationKey\n          }\n          type\n          node {\n            urn\n            __typename\n          }\n        }\n        ... on StatsMatchStatsItemEdge {\n          displayName {\n            translationKey\n          }\n          type\n          node {\n            urn\n            __typename\n          }\n        }\n        ... on StatsBroadcastsItemEdge {\n          displayName {\n            translationKey\n          }\n          type\n          node {\n            urn\n            __typename\n          }\n        }\n        ... on StatsTableItemEdge {\n          displayName {\n            translationKey\n          }\n          type\n          node {\n            urn\n            __typename\n          }\n        }\n        ... on StatsPlayersInPlayItemEdge {\n          displayName {\n            translationKey\n          }\n          type\n          node {\n            urn\n            __typename\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query StatsContentCardGroup($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsContentCardGroup\n    }\n  }\n",
): (typeof documents)["\n  query StatsContentCardGroup($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsContentCardGroup\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment StatsPebbleCardGroupBaseData on StatsPebbleCardGroup {\n    __typename\n    urn\n    status\n  }\n",
): (typeof documents)["\n  fragment StatsPebbleCardGroupBaseData on StatsPebbleCardGroup {\n    __typename\n    urn\n    status\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment LocalStatsPebbleCardGroup on StatsPebbleCardGroup {\n    selectedPebble @client {\n      urn\n      typename\n    }\n  }\n",
): (typeof documents)["\n  fragment LocalStatsPebbleCardGroup on StatsPebbleCardGroup {\n    selectedPebble @client {\n      urn\n      typename\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment StatsPebbleCardGroup on StatsPebbleCardGroup {\n    ...StatsPebbleCardGroupBaseData\n    ...LocalStatsPebbleCardGroup\n    full: items(first: 1, selectedOnly: true) {\n      edges {\n        displayName {\n          ...DisplayNameStats\n        }\n        node {\n          ... on StatsFormCard {\n            ...StatsFormCardRecentForm\n            ...StatsFormCardCompetitionForm\n          }\n          ... on StatsHeadToHeadCard {\n            ...StatsHeadToHeadCard\n          }\n          ... on StatsTeamsCard {\n            ...StatsTeamsCardPreviousFive\n            ...StatsTeamsCardAllSeason\n          }\n          ... on StatsPlayersSeasonStatsCard {\n            ...StatsPlayersSeasonStatsCardAttacking\n            ...StatsPlayersSeasonStatsCardDefending\n          }\n          ... on StatsMatchStatsCard {\n            ...StatsMatchStatsCard\n          }\n          ... on StatsGoalsAndShotsCard {\n            ...StatsGoalsAndShotsCard\n          }\n          ... on IncidentsCard {\n            ...IncidentsCard\n          }\n        }\n      }\n    }\n    partials: items {\n      edges {\n        displayName {\n          ...DisplayNameStats\n        }\n        ... on PebbleCardEdge {\n          node {\n            ... on StatsFormCard {\n              __typename\n              urn\n            }\n            ... on StatsHeadToHeadCard {\n              __typename\n              urn\n            }\n            ... on StatsTeamsCard {\n              __typename\n              urn\n            }\n            ... on StatsPlayersSeasonStatsCard {\n              __typename\n              urn\n            }\n            ... on StatsMatchStatsCard {\n              __typename\n              urn\n            }\n            ... on StatsGoalsAndShotsCard {\n              __typename\n              urn\n            }\n            ... on IncidentsCard {\n              __typename\n              urn\n            }\n          }\n        }\n      }\n    }\n  }\n\n  fragment DisplayNameStats on DisplayNameTranslationKey {\n    translationKey\n  }\n",
): (typeof documents)["\n  fragment StatsPebbleCardGroup on StatsPebbleCardGroup {\n    ...StatsPebbleCardGroupBaseData\n    ...LocalStatsPebbleCardGroup\n    full: items(first: 1, selectedOnly: true) {\n      edges {\n        displayName {\n          ...DisplayNameStats\n        }\n        node {\n          ... on StatsFormCard {\n            ...StatsFormCardRecentForm\n            ...StatsFormCardCompetitionForm\n          }\n          ... on StatsHeadToHeadCard {\n            ...StatsHeadToHeadCard\n          }\n          ... on StatsTeamsCard {\n            ...StatsTeamsCardPreviousFive\n            ...StatsTeamsCardAllSeason\n          }\n          ... on StatsPlayersSeasonStatsCard {\n            ...StatsPlayersSeasonStatsCardAttacking\n            ...StatsPlayersSeasonStatsCardDefending\n          }\n          ... on StatsMatchStatsCard {\n            ...StatsMatchStatsCard\n          }\n          ... on StatsGoalsAndShotsCard {\n            ...StatsGoalsAndShotsCard\n          }\n          ... on IncidentsCard {\n            ...IncidentsCard\n          }\n        }\n      }\n    }\n    partials: items {\n      edges {\n        displayName {\n          ...DisplayNameStats\n        }\n        ... on PebbleCardEdge {\n          node {\n            ... on StatsFormCard {\n              __typename\n              urn\n            }\n            ... on StatsHeadToHeadCard {\n              __typename\n              urn\n            }\n            ... on StatsTeamsCard {\n              __typename\n              urn\n            }\n            ... on StatsPlayersSeasonStatsCard {\n              __typename\n              urn\n            }\n            ... on StatsMatchStatsCard {\n              __typename\n              urn\n            }\n            ... on StatsGoalsAndShotsCard {\n              __typename\n              urn\n            }\n            ... on IncidentsCard {\n              __typename\n              urn\n            }\n          }\n        }\n      }\n    }\n  }\n\n  fragment DisplayNameStats on DisplayNameTranslationKey {\n    translationKey\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query StatsPebbleCardGroup($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsPebbleCardGroup\n    }\n  }\n",
): (typeof documents)["\n  query StatsPebbleCardGroup($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsPebbleCardGroup\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment StatsPlayersInPlayUserDetails on AppContextDetails {\n    __typename\n    urn\n    userdetails {\n      localeCodeBcp47\n      jurisdiction {\n        jurisdiction\n      }\n      timezone\n    }\n  }\n",
): (typeof documents)["\n  fragment StatsPlayersInPlayUserDetails on AppContextDetails {\n    __typename\n    urn\n    userdetails {\n      localeCodeBcp47\n      jurisdiction {\n        jurisdiction\n      }\n      timezone\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment StatsPlayersInPlayCard on StatsPlayersInPlayCard {\n    __typename\n    urn\n    fixture {\n      urn\n      players {\n        id\n        name\n        stats {\n          stats {\n            totalShots\n            shotsOnTarget\n            foulsWon\n            assists\n            fouls\n            tacklesWon\n            blockedShots\n            offsides\n            interceptions\n            goalkeeperSaves\n            shotsCreated\n          }\n        }\n      }\n      home {\n        name\n        squad {\n          players {\n            id\n          }\n        }\n      }\n      away {\n        name\n        squad {\n          players {\n            id\n          }\n        }\n      }\n    }\n    footballPlayerViewLinks {\n      viewUrl\n      viewUrn\n      footballPlayer {\n        urn\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment StatsPlayersInPlayCard on StatsPlayersInPlayCard {\n    __typename\n    urn\n    fixture {\n      urn\n      players {\n        id\n        name\n        stats {\n          stats {\n            totalShots\n            shotsOnTarget\n            foulsWon\n            assists\n            fouls\n            tacklesWon\n            blockedShots\n            offsides\n            interceptions\n            goalkeeperSaves\n            shotsCreated\n          }\n        }\n      }\n      home {\n        name\n        squad {\n          players {\n            id\n          }\n        }\n      }\n      away {\n        name\n        squad {\n          players {\n            id\n          }\n        }\n      }\n    }\n    footballPlayerViewLinks {\n      viewUrl\n      viewUrn\n      footballPlayer {\n        urn\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query StatsPlayersInPlayUserDetails {\n    AppContext {\n      ...StatsPlayersInPlayUserDetails\n    }\n  }\n",
): (typeof documents)["\n  query StatsPlayersInPlayUserDetails {\n    AppContext {\n      ...StatsPlayersInPlayUserDetails\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query StatsPlayersInPlayCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsPlayersInPlayCard\n    }\n  }\n",
): (typeof documents)["\n  query StatsPlayersInPlayCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsPlayersInPlayCard\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment StatsPlayersInPlayCardThrotles on AppContextDetails {\n    __typename\n    throttles {\n      name\n      isActive\n    }\n  }\n",
): (typeof documents)["\n  fragment StatsPlayersInPlayCardThrotles on AppContextDetails {\n    __typename\n    throttles {\n      name\n      isActive\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment StatsRaceResultsCard on StatsRaceResultsCard {\n    __typename\n    urn\n    raceResultsRunners: runners {\n      horse {\n        name\n        performance {\n          positionOfficial\n          positionStatusCode\n        }\n      }\n      details {\n        saddleCloth\n        silk\n      }\n      isBetSelection\n    }\n  }\n",
): (typeof documents)["\n  fragment StatsRaceResultsCard on StatsRaceResultsCard {\n    __typename\n    urn\n    raceResultsRunners: runners {\n      horse {\n        name\n        performance {\n          positionOfficial\n          positionStatusCode\n        }\n      }\n      details {\n        saddleCloth\n        silk\n      }\n      isBetSelection\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query StatsRaceResultsCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsRaceResultsCard\n    }\n  }\n",
): (typeof documents)["\n  query StatsRaceResultsCard($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsRaceResultsCard\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment StatsSupportingContentButtonsCardGroupBaseData on StatsSupportingContentButtonsCardGroup {\n    __typename\n    urn\n  }\n",
): (typeof documents)["\n  fragment StatsSupportingContentButtonsCardGroupBaseData on StatsSupportingContentButtonsCardGroup {\n    __typename\n    urn\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment StatsSupportingContentButtonsCardGroup on StatsSupportingContentButtonsCardGroup {\n    ...StatsSupportingContentButtonsCardGroupBaseData\n    full: items(first: 2) {\n      edges {\n        displayName {\n          ...DisplayNameStats\n        }\n        node {\n          ... on StatsMatchStatsCard {\n            ...StatsMatchStatsCard\n          }\n          ... on IncidentsCard {\n            ...IncidentsCard\n          }\n          ... on StatsBroadcastsCard {\n            ...StatsBroadcastsCard\n          }\n          ... on StatsRaceResultsCard {\n            ...StatsRaceResultsCard\n          }\n        }\n      }\n    }\n    partials: items {\n      edges {\n        displayName {\n          ...DisplayNameStats\n        }\n        ... on StatsSupportingContentButtonsCardEdge {\n          node {\n            ... on StatsMatchStatsCard {\n              __typename\n              urn\n            }\n            ... on IncidentsCard {\n              __typename\n              urn\n            }\n            ... on StatsBroadcastsCard {\n              __typename\n              urn\n            }\n            ... on StatsRaceResultsCard {\n              __typename\n              urn\n            }\n          }\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment StatsSupportingContentButtonsCardGroup on StatsSupportingContentButtonsCardGroup {\n    ...StatsSupportingContentButtonsCardGroupBaseData\n    full: items(first: 2) {\n      edges {\n        displayName {\n          ...DisplayNameStats\n        }\n        node {\n          ... on StatsMatchStatsCard {\n            ...StatsMatchStatsCard\n          }\n          ... on IncidentsCard {\n            ...IncidentsCard\n          }\n          ... on StatsBroadcastsCard {\n            ...StatsBroadcastsCard\n          }\n          ... on StatsRaceResultsCard {\n            ...StatsRaceResultsCard\n          }\n        }\n      }\n    }\n    partials: items {\n      edges {\n        displayName {\n          ...DisplayNameStats\n        }\n        ... on StatsSupportingContentButtonsCardEdge {\n          node {\n            ... on StatsMatchStatsCard {\n              __typename\n              urn\n            }\n            ... on IncidentsCard {\n              __typename\n              urn\n            }\n            ... on StatsBroadcastsCard {\n              __typename\n              urn\n            }\n            ... on StatsRaceResultsCard {\n              __typename\n              urn\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query StatsSupportingContentButtonsCardGroup($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsSupportingContentButtonsCardGroup\n    }\n  }\n",
): (typeof documents)["\n  query StatsSupportingContentButtonsCardGroup($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsSupportingContentButtonsCardGroup\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment SportsbookRunnerLiveDataPotentialBetUpdate on SportsbookRunnerLiveData {\n    __typename\n    urn\n    isPotentialBet @client\n  }\n",
): (typeof documents)["\n  fragment SportsbookRunnerLiveDataPotentialBetUpdate on SportsbookRunnerLiveData {\n    __typename\n    urn\n    isPotentialBet @client\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment SportsbookRunnerLiveDataEventProcessor on SportsbookRunnerLiveData {\n    odds {\n      decimal\n      fractional {\n        numerator\n        denominator\n      }\n    }\n    displayOdds {\n      decimal\n      fractional {\n        numerator\n        denominator\n      }\n    }\n    previousOdds(limit: 1) {\n      odds {\n        decimal\n        fractional {\n          numerator\n          denominator\n        }\n      }\n      displayOdds {\n        decimal\n        fractional {\n          numerator\n          denominator\n        }\n      }\n    }\n    runnerStatus\n  }\n",
): (typeof documents)["\n  fragment SportsbookRunnerLiveDataEventProcessor on SportsbookRunnerLiveData {\n    odds {\n      decimal\n      fractional {\n        numerator\n        denominator\n      }\n    }\n    displayOdds {\n      decimal\n      fractional {\n        numerator\n        denominator\n      }\n    }\n    previousOdds(limit: 1) {\n      odds {\n        decimal\n        fractional {\n          numerator\n          denominator\n        }\n      }\n      displayOdds {\n        decimal\n        fractional {\n          numerator\n          denominator\n        }\n      }\n    }\n    runnerStatus\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment SportsbookMarketLiveDataEventProcessor on SportsbookMarketLiveData {\n    __typename\n    urn\n    sportsbookMarketStatus\n  }\n",
): (typeof documents)["\n  fragment SportsbookMarketLiveDataEventProcessor on SportsbookMarketLiveData {\n    __typename\n    urn\n    sportsbookMarketStatus\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment RaceMeetingViewSeo on RaceMeetingView {\n    __typename\n    urn\n    meeting {\n      __typename\n      urn\n      venue\n      sport {\n        sportId\n      }\n    }\n    items {\n      selectedRace {\n        race {\n          __typename\n          urn\n          name\n          startTime\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment RaceMeetingViewSeo on RaceMeetingView {\n    __typename\n    urn\n    meeting {\n      __typename\n      urn\n      venue\n      sport {\n        sportId\n      }\n    }\n    items {\n      selectedRace {\n        race {\n          __typename\n          urn\n          name\n          startTime\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment AppContextPreferences on AppContextDetails {\n    __typename\n    urn\n    preferences {\n      confirmCashout {\n        urn\n        shouldConfirmCashout\n      }\n      exchangeConfirmBetPlacement {\n        urn\n        shouldConfirmBetPlacement\n      }\n      oddsMovement {\n        urn\n        shouldAcceptOddsMovement\n      }\n      showBalances {\n        urn\n        shouldShowBalances\n      }\n      quickStakes {\n        urn\n        selectedQuickStakes {\n          stake\n        }\n      }\n      exchangeOddsDisplay {\n        urn\n        selectedOddsDisplayFormat\n      }\n      sportsbookOddsDisplay {\n        urn\n        selectedOddsDisplayFormat\n      }\n      favoriteSports {\n        urn\n        selectedFavoriteSports {\n          urn\n          sportId\n        }\n      }\n      defaultProduct {\n        urn\n        selectedDefaultProduct\n      }\n      exchangeDefaultProduct {\n        urn\n        selectedExchangeDefaultProduct\n      }\n      products {\n        urn\n        selectedProduct\n      }\n      lastViewedProduct {\n        urn\n        selectedLastViewedProduct\n      }\n      phoenixMigratedUser {\n        urn\n        isPhoenixMigratedUser\n      }\n      exchangeDefaultMode {\n        urn\n        selectedExchangeDefaultMode\n      }\n    }\n  }\n ",
): (typeof documents)["\n  fragment AppContextPreferences on AppContextDetails {\n    __typename\n    urn\n    preferences {\n      confirmCashout {\n        urn\n        shouldConfirmCashout\n      }\n      exchangeConfirmBetPlacement {\n        urn\n        shouldConfirmBetPlacement\n      }\n      oddsMovement {\n        urn\n        shouldAcceptOddsMovement\n      }\n      showBalances {\n        urn\n        shouldShowBalances\n      }\n      quickStakes {\n        urn\n        selectedQuickStakes {\n          stake\n        }\n      }\n      exchangeOddsDisplay {\n        urn\n        selectedOddsDisplayFormat\n      }\n      sportsbookOddsDisplay {\n        urn\n        selectedOddsDisplayFormat\n      }\n      favoriteSports {\n        urn\n        selectedFavoriteSports {\n          urn\n          sportId\n        }\n      }\n      defaultProduct {\n        urn\n        selectedDefaultProduct\n      }\n      exchangeDefaultProduct {\n        urn\n        selectedExchangeDefaultProduct\n      }\n      products {\n        urn\n        selectedProduct\n      }\n      lastViewedProduct {\n        urn\n        selectedLastViewedProduct\n      }\n      phoenixMigratedUser {\n        urn\n        isPhoenixMigratedUser\n      }\n      exchangeDefaultMode {\n        urn\n        selectedExchangeDefaultMode\n      }\n    }\n  }\n "];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query AppContextPreferences {\n    AppContext {\n      ...AppContextPreferences\n    }\n  }",
): (typeof documents)["\n  query AppContextPreferences {\n    AppContext {\n      ...AppContextPreferences\n    }\n  }"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment GamingPrizeMachineCardTrackingParams on GamingPrizeMachineCard {\n    __typename\n    urn\n    placementId\n    completed\n    jackpotAmount\n    jackpotState\n    activeTitle\n    ctaLabel\n    displayJackpotWinnersPostPlayWidget\n    guaranteedPrize\n  }\n",
): (typeof documents)["\n  fragment GamingPrizeMachineCardTrackingParams on GamingPrizeMachineCard {\n    __typename\n    urn\n    placementId\n    completed\n    jackpotAmount\n    jackpotState\n    activeTitle\n    ctaLabel\n    displayJackpotWinnersPostPlayWidget\n    guaranteedPrize\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment GamingPrizeMachineCardThrotles on AppContextDetails {\n    __typename\n    throttles {\n      name\n      isActive\n    }\n  }\n",
): (typeof documents)["\n  fragment GamingPrizeMachineCardThrotles on AppContextDetails {\n    __typename\n    throttles {\n      name\n      isActive\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query IncidentsCardTracking($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...IncidentsCardTrackingParams\n    }\n  }\n",
): (typeof documents)["\n  query IncidentsCardTracking($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...IncidentsCardTrackingParams\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment IncidentsCardTrackingParams on IncidentsCard {\n    __typename\n    urn\n    fixture {\n      urn\n      sportevent {\n        urn\n        name\n        competition {\n          urn\n          name\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment IncidentsCardTrackingParams on IncidentsCard {\n    __typename\n    urn\n    fixture {\n      urn\n      sportevent {\n        urn\n        name\n        competition {\n          urn\n          name\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query LottoCardTracking($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...LottoCardTrackingParams\n    }\n  }\n",
): (typeof documents)["\n  query LottoCardTracking($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...LottoCardTrackingParams\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment LottoCardTrackingParams on LottoCard {\n    __typename\n    urn\n    shouldShowCompetitionName\n    competition {\n      __typename\n      competitionId\n      urn\n      name\n    }\n    lottoMarkets: markets {\n      __typename\n      urn\n      name\n      marketType\n      liveData {\n        urn\n        sportsbookMarketStatus\n      }\n      hierarchy {\n        ... on EventCompetitionHierarchy {\n          sportevent {\n            eventId\n            __typename\n            urn\n            name\n            openDate\n          }\n          competition {\n            urn\n            __typename\n          }\n        }\n      }\n      runners {\n        runnerURN\n        selectionId\n        name\n        resultType\n      }\n    }\n    marketIds\n  }\n",
): (typeof documents)["\n  fragment LottoCardTrackingParams on LottoCard {\n    __typename\n    urn\n    shouldShowCompetitionName\n    competition {\n      __typename\n      competitionId\n      urn\n      name\n    }\n    lottoMarkets: markets {\n      __typename\n      urn\n      name\n      marketType\n      liveData {\n        urn\n        sportsbookMarketStatus\n      }\n      hierarchy {\n        ... on EventCompetitionHierarchy {\n          sportevent {\n            eventId\n            __typename\n            urn\n            name\n            openDate\n          }\n          competition {\n            urn\n            __typename\n          }\n        }\n      }\n      runners {\n        runnerURN\n        selectionId\n        name\n        resultType\n      }\n    }\n    marketIds\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment NotificationsSubscriptionRaceTrackingParams on Race {\n    __typename\n    urn\n    raceId\n    name\n    startTime\n    meeting {\n      urn\n      venue\n      sport {\n        name\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment NotificationsSubscriptionRaceTrackingParams on Race {\n    __typename\n    urn\n    raceId\n    name\n    startTime\n    meeting {\n      urn\n      venue\n      sport {\n        name\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query NotificationsSubscriptionRaceTracking($urn: [URN!]!) {\n    Races(URNs: $urn) {\n      ...NotificationsSubscriptionRaceTrackingParams\n    }\n  }\n",
): (typeof documents)["\n  query NotificationsSubscriptionRaceTracking($urn: [URN!]!) {\n    Races(URNs: $urn) {\n      ...NotificationsSubscriptionRaceTrackingParams\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query PenaltyTakersCardTracking($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...PenaltyTakersCardTrackingParams\n    }\n  }\n",
): (typeof documents)["\n  query PenaltyTakersCardTracking($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...PenaltyTakersCardTrackingParams\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment PenaltyTakersCardTrackingParams on PenaltyTakersCard {\n    __typename\n    urn\n    event {\n      urn\n      name\n    }\n    penaltyTakers {\n      player {\n        ... on FootballPlayerFixtureContext {\n          __typename\n          urn\n          player {\n            id\n            name\n          }\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment PenaltyTakersCardTrackingParams on PenaltyTakersCard {\n    __typename\n    urn\n    event {\n      urn\n      name\n    }\n    penaltyTakers {\n      player {\n        ... on FootballPlayerFixtureContext {\n          __typename\n          urn\n          player {\n            id\n            name\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query StatsContentCardGroupTracking($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsContentCardGroupTrackingParams\n    }\n  }\n",
): (typeof documents)["\n  query StatsContentCardGroupTracking($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsContentCardGroupTrackingParams\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment StatsContentCardGroupTrackingParams on StatsContentCardGroup {\n    __typename\n    urn\n    status\n    sportEvent {\n      urn\n      name\n      competition {\n        urn\n        name\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment StatsContentCardGroupTrackingParams on StatsContentCardGroup {\n    __typename\n    urn\n    status\n    sportEvent {\n      urn\n      name\n      competition {\n        urn\n        name\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query StatsLineupsCardTracking($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsLineupsCardTrackingParams\n    }\n  }\n",
): (typeof documents)["\n  query StatsLineupsCardTracking($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsLineupsCardTrackingParams\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment StatsLineupsCardTrackingParams on StatsLineupsCard {\n    __typename\n    urn\n    status\n    sportEvent {\n      urn\n      name\n      competition {\n        urn\n        name\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment StatsLineupsCardTrackingParams on StatsLineupsCard {\n    __typename\n    urn\n    status\n    sportEvent {\n      urn\n      name\n      competition {\n        urn\n        name\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query StatsPebbleCardGroupTracking($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsPebbleCardGroupTrackingParams\n    }\n  }\n",
): (typeof documents)["\n  query StatsPebbleCardGroupTracking($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsPebbleCardGroupTrackingParams\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment StatsPebbleCardGroupTrackingParams on StatsPebbleCardGroup {\n    __typename\n    urn\n    status\n    items {\n      edges {\n        displayName {\n          ... on DisplayNameTranslationKey {\n            translationKey\n          }\n        }\n        node {\n          urn\n          __typename\n        }\n      }\n    }\n    sportEvent {\n      urn\n      name\n      competition {\n        urn\n        name\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment StatsPebbleCardGroupTrackingParams on StatsPebbleCardGroup {\n    __typename\n    urn\n    status\n    items {\n      edges {\n        displayName {\n          ... on DisplayNameTranslationKey {\n            translationKey\n          }\n        }\n        node {\n          urn\n          __typename\n        }\n      }\n    }\n    sportEvent {\n      urn\n      name\n      competition {\n        urn\n        name\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query StatsPlayersInPlayTracking($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsPlayersInPlayTrackingParams\n    }\n  }\n",
): (typeof documents)["\n  query StatsPlayersInPlayTracking($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsPlayersInPlayTrackingParams\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment StatsPlayersInPlayTrackingParams on StatsPlayersInPlayCard {\n    __typename\n    urn\n    sportEvent {\n      urn\n      name\n      competition {\n        urn\n        name\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment StatsPlayersInPlayTrackingParams on StatsPlayersInPlayCard {\n    __typename\n    urn\n    sportEvent {\n      urn\n      name\n      competition {\n        urn\n        name\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query StatsPlayersSeasonStatsTracking($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsPlayersSeasonStatsTrackingParams\n    }\n  }\n",
): (typeof documents)["\n  query StatsPlayersSeasonStatsTracking($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsPlayersSeasonStatsTrackingParams\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment StatsPlayersSeasonStatsTrackingParams on StatsPlayersSeasonStatsCard {\n    __typename\n    urn\n    sportEvent {\n      urn\n      name\n      competition {\n        urn\n        name\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment StatsPlayersSeasonStatsTrackingParams on StatsPlayersSeasonStatsCard {\n    __typename\n    urn\n    sportEvent {\n      urn\n      name\n      competition {\n        urn\n        name\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query StatsSupportingContentButtonsCardGroupTracking($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsSupportingContentButtonsCardGroupTrackingParams\n    }\n  }\n",
): (typeof documents)["\n  query StatsSupportingContentButtonsCardGroupTracking($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsSupportingContentButtonsCardGroupTrackingParams\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment StatsSupportingContentButtonsCardGroupTrackingParams on StatsSupportingContentButtonsCardGroup {\n    __typename\n    urn\n    items {\n      edges {\n        displayName {\n          ... on DisplayNameTranslationKey {\n            translationKey\n          }\n        }\n        ... on StatsSupportingContentButtonsCardEdge {\n          node {\n            ... on StatsMatchStatsCard {\n              __typename\n              urn\n            }\n            ... on IncidentsCard {\n              __typename\n              urn\n            }\n            ... on StatsBroadcastsCard {\n              __typename\n              urn\n            }\n            ... on StatsRaceResultsCard {\n              __typename\n              urn\n            }\n          }\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment StatsSupportingContentButtonsCardGroupTrackingParams on StatsSupportingContentButtonsCardGroup {\n    __typename\n    urn\n    items {\n      edges {\n        displayName {\n          ... on DisplayNameTranslationKey {\n            translationKey\n          }\n        }\n        ... on StatsSupportingContentButtonsCardEdge {\n          node {\n            ... on StatsMatchStatsCard {\n              __typename\n              urn\n            }\n            ... on IncidentsCard {\n              __typename\n              urn\n            }\n            ... on StatsBroadcastsCard {\n              __typename\n              urn\n            }\n            ... on StatsRaceResultsCard {\n              __typename\n              urn\n            }\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  query StatsTeamsCardExpandIconTracking($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsTeamsCardExpandIconTrackingParams\n    }\n  }\n",
): (typeof documents)["\n  query StatsTeamsCardExpandIconTracking($urn: [URN!]!) {\n    Cards(cardsURN: $urn) {\n      ...StatsTeamsCardExpandIconTrackingParams\n    }\n  }\n"];
/**
 * The gql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function gql(
  source: "\n  fragment StatsTeamsCardExpandIconTrackingParams on StatsTeamsCard {\n    __typename\n    urn\n    fixture {\n      urn\n      sportevent {\n        urn\n        name\n        competition {\n          urn\n          name\n        }\n      }\n    }\n  }\n",
): (typeof documents)["\n  fragment StatsTeamsCardExpandIconTrackingParams on StatsTeamsCard {\n    __typename\n    urn\n    fixture {\n      urn\n      sportevent {\n        urn\n        name\n        competition {\n          urn\n          name\n        }\n      }\n    }\n  }\n"];

export function gql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<
  infer TType,
  any
>
  ? TType
  : never;
