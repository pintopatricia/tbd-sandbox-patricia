function getPopularQuicklinksGridCardGroup() {
  return {
    __typename: "QuicklinksGridCardGroup",
    urn: "ppb:tbd:cardgroup:quicklinksGrid:popular-quick-links-card-group",
    quicklinksGridTitle: "Popular",
    hideArrows: false,
    hideIcons: false,
    items: {
      __typename: "QuicklinksGridCardGroupItemsConnection",
      edges: [
        {
          __typename: "QuicklinkGridCardGroupItemEdge",
          isExpanded: true,
          style: "NONE",
          label: null,
          icon: {
            __typename: "PackIcon",
            id: "my-bets",
            category: "Navigation",
          },
          node: {
            __typename: "GenericViewLinkCard",
            urn: "ppb:tbd:card:genericViewLink:generic:my-bets",
            genericViewLinkTitle: {
              __typename: "DisplayNameTranslationKey",
              translationKey: "I18N.MY_BETS.TITLE",
            },
            viewLink: {
              viewUrn: "ppb:tbd:view:myBets:open",
              viewUrl: "mybets/open/mb-6f70656e",
              viewDisplayMode: null,
            },
            badge: "MY_BETS",
            sportIcon: null,
          },
        },
        {
          __typename: "QuicklinkGridCardGroupItemEdge",
          isExpanded: true,
          style: "NONE",
          label: "Promotions",
          icon: {
            __typename: "PackIcon",
            id: "promotions",
            category: "Casino",
          },
          node: {
            __typename: "GenericViewLinkCard",
            urn: "ppb:tbd:card:genericViewLink:external:promotions",
            genericViewLinkTitle: {
              __typename: "DisplayNameTitle",
              name: "Promotions",
            },
            viewLink: {
              viewUrn: "ppb:tbd:view:external:external",
              viewUrl: "https://promos.betfair.com/",
              viewDisplayMode: "BLANK_INAPP",
            },
            badge: null,
            sportIcon: null,
          },
        },
      ],
    },
    partials: {
      __typename: "QuicklinksGridCardGroupItemsConnection",
      edges: [
        {
          __typename: "QuicklinkGridCardGroupItemEdge",
          isExpanded: true,
          style: "NONE",
          label: null,
          icon: {
            __typename: "PackIcon",
            id: "my-bets",
            category: "Navigation",
          },
          node: {
            __typename: "GenericViewLinkCard",
            urn: "ppb:tbd:card:genericViewLink:generic:my-bets",
          },
        },
        {
          __typename: "QuicklinkGridCardGroupItemEdge",
          isExpanded: true,
          style: "NONE",
          label: "Promotions",
          icon: {
            __typename: "PackIcon",
            id: "promotions",
            category: "Casino",
          },
          node: {
            __typename: "GenericViewLinkCard",
            urn: "ppb:tbd:card:genericViewLink:external:promotions",
          },
        },
      ],
    },
  };
}

function getExtraQuickLinksCard() {
  return {
    __typename: "QuickLinksCard",
    urn: "ppb:tbd:card:quickLinks:group:extra-quick-liks",
    accordionExpanded: false,
    links: [
      {
        label: "In-Play",
        viewLink: {
          viewUrn: "ppb:tbd:view:generic:inplay",
          viewUrl: "inplay/all/i-inplay",
        },
        target: null,
        icon: "Inplay",
      },
      {
        label: "Soccer",
        viewLink: {
          viewUrn: "ppb:tbd:view:sport:1",
          viewUrl: "soccer/s-1",
        },
        target: null,
        icon: "1",
      },
    ],
    iconName: null,
  };
}

function getAzMenu(sportsList) {
  const AZ_MENU_SPORTS = sportsList || {
    1: "Football",
    2: "Tennis",
    3: "Golf",
    4: "Cricket",
    5: "Rugby Union",
    7: "Horse Racing",
    6: "Boxing",
    3503: "Darts",
    6422: "Snooker",
    6423: "American Football",
    7511: "Baseball",
    7522: "Basketball",
    61420: "Australian Rules",
    27454571: "Esports",
    26420387: "Mixed Martial Arts",
  };
  const QUICKLINKS = Object.entries(AZ_MENU_SPORTS)
    .sort(([_a, firstName], [_b, secondName]) => (firstName > secondName ? 1 : -1))
    .map(([id, name]) => ({
      label: name,
      viewLink: {
        viewUrn: `ppb:tbd:view:sport:${id}`,
        viewUrl: `${name.toLowerCase().replace(" ", "-")}/s-${id}`,
      },
      icon: id,
    }));

  return {
    __typename: "QuickLinksCard",
    urn: "ppb:tbd:card:quickLinks:azMenu:leftSidebar|I18N.LEFT_SIDE_BAR.AZ_MENU_TITLE",
    quickLinksTitle: null,
    label: {
      __typename: "DisplayNameTranslationKey",
      translationKey: "I18N.LEFT_SIDE_BAR.AZ_MENU_TITLE",
    },
    accordionTitle: null,
    iconName: null,
    accordionExpanded: false,
    links: QUICKLINKS,
  };
}

function getFullLeftSideBarMock() {
  return {
    items: {
      edges: [
        {
          node: getPopularQuicklinksGridCardGroup(),
        },
        {
          node: getExtraQuickLinksCard(),
        },
        {
          node: getAzMenu(),
        },
      ],
      pageInfo: null,
    },
  };
}

module.exports = { getFullLeftSideBarMock, getPopularQuicklinksGridCardGroup };
