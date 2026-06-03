import { render } from "@testing-library/react";
import "jest-dom/extend-expect";
import { SportsbookBetButton } from "@ppb/the-wall-web";

import ObbBetButton from "./ObbBetButton.web";

jest.mock("@ppb/the-wall-web", () => ({
  SportsbookBetButton: jest.fn(),
}));

const mockProps = {
  legId: "mock-id",
  cardUrn: "mock-card-urn",
  eventName: "Mock Event",
  position: { horizontalPosition: 1, verticalPosition: 1 },
  quote: { odds: "1.00" },
  secondaryLabel: "mock-secondaryLabel",
  status: "selected",
  animated: false,
  dispatchAddLegToBetslip: jest.fn(),
};

describe("ObbBetButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render SportsbookBetButton with correct props", () => {
    render(<ObbBetButton {...mockProps} />);
    expect(SportsbookBetButton).toHaveBeenCalledWith(
      expect.objectContaining({
        animated: false,
        disabled: false,
        secondaryLabel: "mock-secondaryLabel",
        label: "1.00",
        status: "selected",
      }),
      undefined,
    );
  });

  describe("when there is quote error an no odds", () => {
    it("should render SportsbookBetButton with disabled state", () => {
      const errorProps = { ...mockProps, quote: { odds: null, quoteError: "Quote Error" } };
      render(<ObbBetButton {...errorProps} />);
      expect(SportsbookBetButton).toHaveBeenCalledWith(
        expect.objectContaining({
          animated: false,
          disabled: true,
          secondaryLabel: "mock-secondaryLabel",
          label: "-",
          status: "selected",
        }),
        undefined,
      );
    });
  });

  describe("when there is no quote", () => {
    it("should render SportsbookBetButton with disabled state", () => {
      const errorProps = { ...mockProps, quote: undefined };
      render(<ObbBetButton {...errorProps} />);
      expect(SportsbookBetButton).toHaveBeenCalledWith(
        expect.objectContaining({
          animated: false,
          disabled: true,
          secondaryLabel: "mock-secondaryLabel",
          label: "-",
          status: "selected",
        }),
        undefined,
      );
    });
  });

  describe("when clicking on the button", () => {
    it("should call dispatchAddLegToBetslip with correct parameters", () => {
      render(<ObbBetButton {...mockProps} />);
      const button = SportsbookBetButton.mock.calls[0][0].onClick;
      button();
      expect(mockProps.dispatchAddLegToBetslip).toHaveBeenCalledWith(
        "mock-id",
        "mock-card-urn",
        "Mock Event",
        {
          horizontalPosition: 1,
          verticalPosition: 1,
        },
        undefined,
      );
    });

    it("should call onClick prop instead of dispatchAddLegToBetslip when onClick is provided", () => {
      const onClickSpy = jest.fn();
      const propsWithOnClick = { ...mockProps, onClick: onClickSpy };
      render(<ObbBetButton {...propsWithOnClick} />);
      const button = SportsbookBetButton.mock.calls[0][0].onClick;
      button();
      expect(onClickSpy).toHaveBeenCalledTimes(1);
      expect(mockProps.dispatchAddLegToBetslip).not.toHaveBeenCalled();
    });
  });

  describe("when animated prop is true", () => {
    it("should pass animated: true to SportsbookBetButton", () => {
      const animatedProps = { ...mockProps, animated: true };
      render(<ObbBetButton {...animatedProps} />);
      expect(SportsbookBetButton).toHaveBeenCalledWith(
        expect.objectContaining({
          animated: true,
        }),
        undefined,
      );
    });
  });

  describe("when status is not provided", () => {
    it("should default to 'default' status", () => {
      const { status, ...propsWithoutStatus } = mockProps;
      render(<ObbBetButton {...propsWithoutStatus} />);
      expect(SportsbookBetButton).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "default",
        }),
        undefined,
      );
    });
  });
});
