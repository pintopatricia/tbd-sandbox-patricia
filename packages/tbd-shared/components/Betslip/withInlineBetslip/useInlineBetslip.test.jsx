import { render, renderHook, waitFor, getByTestId } from "@testing-library/react";
 
import "jest-dom/extend-expect";
import { useSelector } from "react-redux";
import { createExcRunnerPotentialBetsByRunnerURNSelector } from "@ppb/tbd-store/state/entities/entities-selectors";
import { getBetslipExchangeContext } from "@ppb/tbd-store/state/betslip/betslip-card-selectors";

import useInlineBetslip from "./useInlineBetslip";

jest.mock("react-redux", () => ({
  useSelector: jest.fn((selector) => selector({})),
}));

jest.mock("../RootInlineBetslip", () =>
  jest.fn(() => <some-connected-mock data-testid="some-connected-mock" />).mockName("some-connected-mock"),
);

jest.mock("@ppb/tbd-store/state/entities/entities-selectors", () => ({
  createExcRunnerPotentialBetsByRunnerURNSelector: jest.fn(() => () => []),
}));

jest.mock("@ppb/tbd-store/state/betslip/betslip-card-selectors", () => ({
  getBetslipExchangeContext: jest.fn(() => ({})),
}));

describe("useInlineBetslip", () => {
  beforeEach(() => jest.clearAllMocks());

  function setup({
    exchangeContext = null,
    component = jest.fn(() => <some-component-mock />),
    urn = "",
    exchangeReport = {},
    getExcRunnerPotentialBetsByRunnerURN = jest.fn(() => []),
  } = {}) {
    const appState = { entities: {}, betslip: { exchangeReport } };
    getBetslipExchangeContext.mockReturnValue(exchangeContext);
    createExcRunnerPotentialBetsByRunnerURNSelector.mockReturnValueOnce(getExcRunnerPotentialBetsByRunnerURN);
    useSelector.mockImplementation((selector) => selector(exchangeReport ? appState : {}));

    const {
      result: { current },
    } = renderHook(() => useInlineBetslip(component));
    const Betslip = ({ urn: mockUrn }) => current(mockUrn);

    return render(<Betslip urn={urn} />);
  }

  describe("when there's nothing to bet/edit/see", () => {
    it("should not return anything", () => {
      const { queryByTestId } = setup();

      expect(queryByTestId("some-connected-mock")).toBeNull();
    });
  });

  describe("when there's a potential bet", () => {
    it("should call getExcRunnerPotentialBetsByRunnerURN", async () => {
      const getExcRunnerPotentialBetsByRunnerURN = jest.fn(() => ["some potential bet"]);
      const { container } = setup({
        urn: "theURN",
        exchangeContext: { runner: "theURN" },
        getExcRunnerPotentialBetsByRunnerURN,
      });

      await waitFor(() => getByTestId(container, "some-connected-mock"));

      expect(getExcRunnerPotentialBetsByRunnerURN).toHaveBeenCalledWith(
        { entities: {}, betslip: { exchangeReport: {} } },
        "theURN",
      );
      expect(getExcRunnerPotentialBetsByRunnerURN).toHaveBeenCalledTimes(1);
    });

    it("should call getBetslipExchangeContext", () => {
      setup({
        urn: "theURN",
        exchangeContext: { runner: "theURN" },
        getExcRunnerPotentialBetsByRunnerURN: jest.fn(() => ["some potential bet"]),
      });

      expect(getBetslipExchangeContext).toHaveBeenNthCalledWith(1, {
        entities: {},
        betslip: { exchangeReport: {} },
      });
      expect(getBetslipExchangeContext).toHaveBeenCalledTimes(3);
    });

    it("should return connected betslip", () => {
      const { queryByTestId } = setup({
        urn: "theURN",
        exchangeContext: { runner: "theURN" },
        getExcRunnerPotentialBetsByRunnerURN: jest.fn(() => ["some potential bet"]),
      });

      expect(queryByTestId("some-connected-mock")).not.toBeNull();
    });
  });

  describe("when there's a report", () => {
    describe("when there's a wrong context", () => {
      it("should not return connected betslip", () => {
        const { queryByTestId } = setup({
          urn: "theURN",
          exchangeContext: { runner: "notTheURN" },
          exchangeReport: { runner: "theURN" },
        });

        expect(queryByTestId("some-connected-mock")).toBeNull();
      });
    });

    describe("when there's a correct context", () => {
      it("should return connected betslip", () => {
        const { queryByTestId } = setup({
          urn: "theURN",
          exchangeContext: { runner: "theURN" },
          exchangeReport: { runner: "theURN" },
        });

        expect(queryByTestId("some-connected-mock")).not.toBeNull();
      });
    });
  });

  describe("when there's an editable bet", () => {
    it("should call getBetslipExchangeContext", () => {
      setup({
        urn: "theURN",
        exchangeContext: { runner: "theURN" },
      });

      expect(getBetslipExchangeContext).toHaveBeenNthCalledWith(2, {
        entities: {},
        betslip: { exchangeReport: {} },
      });
      expect(getBetslipExchangeContext).toHaveBeenCalledTimes(3);
    });

    it("should return connected betslip", () => {
      const { queryByTestId } = setup({
        urn: "theURN",
        exchangeContext: { runner: "theURN" },
      });

      expect(queryByTestId("some-connected-mock")).not.toBeNull();
    });
  });
});
