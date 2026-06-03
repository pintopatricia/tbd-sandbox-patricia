import { act, render } from "@testing-library/react-native";
import { Card } from "@ppb/the-wall-native";
import { CardTheme, CardHeaderSize } from "@ppb/the-wall-common/types/Card/Card.types";
import ExpandableMarketCard from "./ExpandableMarketCard.native";
import ConnectedMarketCard from "../MarketCard";
import MarketCard from "../MarketCard/MarketCard.native";
import ConnectedOpenBets from "../OpenBets";
import { OpenBets } from "../OpenBets/OpenBets.native";
import { SHELL } from "./ExpandableMarketCard.native.selectors";

jest.mock("../MarketCard", () => jest.fn(() => <connected-basic-market-mock />));
jest.mock("../MarketCard/MarketCard.native", () => jest.fn(() => <basic-market-mock />));
jest.mock("../OpenBets", () => jest.fn(() => <connected-open-bets-mock />));
jest.mock("../OpenBets/OpenBets.native", () => ({
  OpenBets: jest.fn(() => <open-bets-mock />),
}));
jest.mock("@ppb/the-wall-native", () => ({
  Card: jest.fn(({ children, props }) => <card-mock {...props}>{children}</card-mock>),
}));

const dispatchFetchFullCardAction = jest.fn();

function renderExpandableMarketCard(props) {
  return render(<ExpandableMarketCard {...props} />);
}

describe("ExpandableMarketCard", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    renderExpandableMarketCard({
      title: "title",
      marketCardURN: "marketCardURN",
      urn: "expandableMarketCardURN",
      dispatchFetchFullCardAction,
    });
  });

  describe("when rendering a shell", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should render the ExpandableMarketCard shell component", () => {
      const props = {
        title: "title",
        urn: "expandableMarketCardURN",
      };

      const { queryByTestId } = renderExpandableMarketCard(props);

      expect(queryByTestId(SHELL)).toBeDefined();
    });

    it("should render the ExpandableMarketCard component closed with title defined", () => {
      const props = {
        title: "title",
        urn: "expandableMarketCardURN",
      };

      renderExpandableMarketCard(props);

      expect(Card).toHaveBeenCalledWith(
        {
          children: expect.any(Object),
          title: "title",
          onTitleClick: expect.any(Function),
          endElement: expect.any(Object),
          isCollapsible: true,
          theme: CardTheme.SECONDARY,
          size: CardHeaderSize.LARGE,
          fullWidthContent: true,
        },
        undefined,
      );
    });
  });

  it("should render the Card component with the correct props", () => {
    expect(Card).toHaveBeenCalledWith(
      expect.objectContaining({
        onTitleClick: expect.any(Function),
        children: expect.any(Object),
        title: "title",
        endElement: expect.any(Object),
        isCollapsible: true,
        theme: CardTheme.SECONDARY,
        size: CardHeaderSize.LARGE,
        fullWidthContent: true,
      }),
      undefined,
    );
  });

  it("should render the OpenBets component with the correct props", () => {
    const { endElement } = Card.mock.calls[0][0];

    render(endElement);

    expect(ConnectedOpenBets).toHaveBeenCalledWith(
      {
        cardURN: "expandableMarketCardURN",
        component: OpenBets,
      },
      undefined,
    );
  });

  it("should render the MarketCard component with the correct props", () => {
    expect(ConnectedMarketCard).toHaveBeenCalledWith(
      expect.objectContaining({
        component: MarketCard,
        urn: "marketCardURN",
      }),
      undefined,
    );
  });

  describe("on Card press", () => {
    describe("and it becomes expanded", () => {
      it("should call dispatchFetchFullCardAction with the correct parameters", () => {
        act(() => {
          Card.mock.calls[0][0].onTitleClick(true);
        });

        expect(dispatchFetchFullCardAction).toHaveBeenCalledWith("marketCardURN");
      });
    });

    describe("and it becomes collapsed", () => {
      it("should not call dispatchFetchFullCardAction with the correct parameters", () => {
        act(() => {
          Card.mock.calls[0][0].onTitleClick(false);
        });

        expect(dispatchFetchFullCardAction).not.toHaveBeenCalled();
      });
    });
  });
});
