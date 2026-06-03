import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { BetInfoItemMode } from "@ppb/the-wall-common/types";
import { GenericIcon } from "@ppb/the-wall-icons/GenericIcon/GenericIcon";
import { Collapse, BetInfo } from "@ppb/the-wall-web";
import { BetInfoCollapse } from "./BetInfoCollapse.web";

jest.mock("@ppb/the-wall-web", () => ({
  Collapse: jest.fn(() => <collapse-mock />),
  BetInfo: jest.fn(() => <bet-info-mock />),
}));

jest.mock("@ppb/the-wall-icons/GenericIcon/GenericIcon", () => ({
  GenericIcon: jest.fn(() => <generic-icon-mock />),
}));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

const MOCK_ITEMS = [
  { title: "Betfair Id", value: "123456789", mode: BetInfoItemMode.WITHOUT_COPY },
  { title: "Placed", value: "28/03/2026, 14:30", mode: BetInfoItemMode.WITHOUT_COPY },
];

function renderBetInfoCollapse({ items = MOCK_ITEMS } = {}) {
  return render(<BetInfoCollapse items={items} />);
}

describe("BetInfoCollapse", () => {
  beforeEach(() => jest.clearAllMocks());

  it("should render", () => {
    const { container } = renderBetInfoCollapse();

    expect(container).toBeDefined();
  });

  describe("Collapse", () => {
    it("should be called with expected props", () => {
      renderBetInfoCollapse();

      expect(Collapse).toHaveBeenCalledWith(
        expect.objectContaining({
          isOpen: false,
          setIsOpen: expect.any(Function),
          header: expect.any(Object),
          children: expect.any(Object),
        }),
        undefined,
      );
      expect(Collapse).toHaveBeenCalledTimes(1);
    });

    it("should pass title to header", () => {
      renderBetInfoCollapse();

      const { queryByText } = render(Collapse.mock.calls[0][0].header);

      expect(queryByText("I18N.MY_BETS.BET_DETAILS")).not.toBeNull();
    });

    it("should render chevron icon in header", () => {
      renderBetInfoCollapse();
      render(Collapse.mock.calls[0][0].header);

      expect(GenericIcon).toHaveBeenCalled();
    });
  });

  describe("BetInfo", () => {
    it("should be called with the provided items", () => {
      renderBetInfoCollapse();
      render(Collapse.mock.calls[0][0].children);

      expect(BetInfo).toHaveBeenCalledWith(
        expect.objectContaining({
          items: MOCK_ITEMS,
        }),
        undefined,
      );
      expect(BetInfo).toHaveBeenCalledTimes(1);
    });
  });
});
