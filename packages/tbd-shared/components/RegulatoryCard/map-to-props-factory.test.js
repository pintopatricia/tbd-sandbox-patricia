import { UI__FOOTER_LINK_CLICK } from "@ppb/tbd-store/actions/navigation";
import { makeMapStateToProps, mapDispatchToProps } from "./map-to-props-factory";

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

jest.mock("@ppb/tbd-store/state/my-bets/my-bets-selectors", () => ({
  getMyBetsExchangeBottomSheet: jest.fn(),
}));

import { getMyBetsExchangeBottomSheet } from "@ppb/tbd-store/state/my-bets/my-bets-selectors";

describe("mapStateToProps", () => {
  beforeEach(jest.clearAllMocks);

  it("should map state to props", () => {
    const sections = [];
    const STATE = {
      layouts: {
        cards: {
          regulatory: { "ppb:tbd:card:regulatory:footer": { sections } },
        },
      },
    };
    getMyBetsExchangeBottomSheet.mockReturnValue({ isOpen: false });

    const props = makeMapStateToProps()(STATE, { urn: "ppb:tbd:card:regulatory:footer" });
    expect(props).toEqual({
      sections,
      labels: {
        nationalIdentifierLabel: "I18N.USER.NATIONAL_IDENTIFIER",
        contractNumberLabel: "I18N.USER.CONTRACT_NUMBER",
      },
      usePortal: true,
    });
  });

  it("should map state to props with usePortal false when bottom sheet is open", () => {
    const sections = [];
    const STATE = {
      layouts: {
        cards: {
          regulatory: { "ppb:tbd:card:regulatory:footer": { sections } },
        },
      },
    };
    getMyBetsExchangeBottomSheet.mockReturnValue({ isOpen: true });

    const props = makeMapStateToProps()(STATE, { urn: "ppb:tbd:card:regulatory:footer" });
    expect(props).toEqual({
      sections,
      labels: {
        nationalIdentifierLabel: "I18N.USER.NATIONAL_IDENTIFIER",
        contractNumberLabel: "I18N.USER.CONTRACT_NUMBER",
      },
      usePortal: false,
    });
  });

  it("should map state to props with usePortal as true when exchangeEditState is undefined", () => {
    const sections = [];
    const STATE = {
      layouts: {
        cards: {
          regulatory: { "ppb:tbd:card:regulatory:footer": { sections } },
        },
      },
    };
    getMyBetsExchangeBottomSheet.mockReturnValue(undefined);

    const props = makeMapStateToProps()(STATE, { urn: "ppb:tbd:card:regulatory:footer" });
    expect(props).toEqual({
      sections,
      labels: {
        nationalIdentifierLabel: "I18N.USER.NATIONAL_IDENTIFIER",
        contractNumberLabel: "I18N.USER.CONTRACT_NUMBER",
      },
      usePortal: true,
    });
  });

  it("should return empty object when card is not found", () => {
    const STATE = {
      layouts: {
        cards: {
          regulatory: {},
        },
      },
    };
    getMyBetsExchangeBottomSheet.mockReturnValue(undefined);

    const props = makeMapStateToProps()(STATE, { urn: "ppb:tbd:card:regulatory:footer" });
    expect(props).toEqual({});
  });
});

describe("mapDispatchToProps", () => {
  beforeEach(jest.clearAllMocks);

  describe("dispatchFooterLinkNavigation", () => {
    describe("when view link is defined", () => {
      it("should dispatch footer link navigation", () => {
        const { dispatchFooterLinkNavigation } = mapDispatchToProps;
        const viewLink = {
          viewUrn: "urn:fake:1",
          viewUrl: "url",
        };
        const text = "The Text";

        expect(dispatchFooterLinkNavigation(viewLink, text)).toEqual({
          payload: {
            module: "footer",
            url: viewLink.viewUrl,
            text,
          },
          type: UI__FOOTER_LINK_CLICK,
        });
      });
    });

    describe("when view link is not defined", () => {
      it("should dispatch footer link navigation", () => {
        const { dispatchFooterLinkNavigation } = mapDispatchToProps;
        const text = "The Text";

        expect(dispatchFooterLinkNavigation(undefined, text)).toEqual({
          payload: {
            module: "footer",
            text,
          },
          type: UI__FOOTER_LINK_CLICK,
        });
      });
    });
  });
});
