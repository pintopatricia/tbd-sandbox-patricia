import { createGenericViewLinkCardHydratedByURNSelector } from "./generic-viewlinks-selectors";

const cardUrnMock = "ppb:tbd:card:genericviewlink:generic:123";

const genericViewLinkCardMock = {
  urn: cardUrnMock,
  typename: "GenericViewLinkCard",
  title: "some title",
  viewLink: {
    viewUrn: "ppb:tbd:view:generic:coupon:1234",
    viewUrl: "view/cp-1234",
  },
};

const stateMock = {
  layouts: {
    cards: {
      genericviewlinks: {
        [cardUrnMock]: genericViewLinkCardMock,
      },
    },
  },
};

const getGenericViewLinkCardByURN = jest.fn(() => genericViewLinkCardMock);

jest.mock("../cards-selectors", () => ({
  createCardByURNSelector: jest.fn(() => getGenericViewLinkCardByURN),
}));

describe("genericviewlink selectors", () => {
  beforeEach(jest.clearAllMocks);

  describe("createGenericViewLinkCardHydratedByURNSelector", () => {
    describe("when the card data exists", () => {
      it("should return the hydrated competition view link card", () => {
        expect(createGenericViewLinkCardHydratedByURNSelector()(stateMock, cardUrnMock)).toEqual({
          card: genericViewLinkCardMock,
        });
      });
    });

    describe("when there's no card with the specified URN", () => {
      it("should return undefined", () => {
        getGenericViewLinkCardByURN.mockReturnValueOnce(undefined);

        expect(createGenericViewLinkCardHydratedByURNSelector()(stateMock, cardUrnMock)).toEqual(undefined);
      });
    });
  });
});
