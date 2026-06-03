export const HEADER_ITEMS_MOCK = {
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
};

export const GENERIC_SWITCHER_CARD_HEADER_ITEM_MOCK = {
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
};
