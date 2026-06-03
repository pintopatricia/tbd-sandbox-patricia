import "jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { PrimaryButton, RichTextComponent } from "@ppb/the-wall-web";
import { OddsDisplayPreference } from "@ppb/tbd-store";
import { FreezeConfirmButton } from "./FreezeConfirmButton.web";

jest.mock("../../../helpers/i18n", () => ({ i18n: jest.fn(({ key }) => key) }));
jest.mock("@ppb/the-wall-web", () => ({
  PrimaryButton: jest.fn(() => <primary-button-mock />),
  RichTextComponent: jest.fn((props) => <rich-text-component-mock {...props} />),
}));

const mockedProps = {
  parts: [
    {
      eventDescription: "Man Utd v Everton",
      eventMarketDescription: "First Goal Scorer",
      selectionName: "André Gomes",
      marketBetUrn: "ppb:marketBet:55677043",
      price: {
        decimal: 0.1,
        fractional: {
          numerator: 2,
          denominator: 9,
          __typename: "FractionalOdds",
        },
      },
    },
  ],
  mutations: {
    eligibility: [
      {
        mutation: "AccaFreeze",
        mutationAvailability: "Available",
      },
    ],
  },
};

describe("FreezeConfirmButton Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly when a leg is selected", async () => {
    render(<FreezeConfirmButton selectedLeg={mockedProps} oddsLabel="0.1" onConfirm={jest.fn()} />);
    expect(PrimaryButton).toHaveBeenCalledWith(
      expect.objectContaining({
        disabled: false,
        icon: "Value--Acca-Freeze",
        label: "I18N.FREEZE_SELECTION.CONFIRM_BUTTON_LABEL",
        onTap: expect.anything(),
      }),
      undefined,
    );
    expect(RichTextComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        list: expect.arrayContaining([
          expect.objectContaining({ text: "I18N.FREEZE_LEG.SELECTED_LABEL" }),
          expect.objectContaining({ text: "André Gomes @ 0.1" }),
        ]),
      }),
      undefined,
    );
  });

  it("renders fractions correctly when a leg is selected", async () => {
    render(<FreezeConfirmButton selectedLeg={mockedProps} oddsLabel="2/9" onConfirm={jest.fn()} />);
    expect(RichTextComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        list: expect.arrayContaining([
          expect.objectContaining({ text: "I18N.FREEZE_LEG.SELECTED_LABEL" }),
          expect.objectContaining({ text: "André Gomes @ 2/9" }),
        ]),
      }),
      undefined,
    );
  });

  it("renders correctly when nothing is selected", async () => {
    render(<FreezeConfirmButton selectedLeg={null} oddsFormat={OddsDisplayPreference.Decimal} onConfirm={jest.fn()} />);
    expect(PrimaryButton).toHaveBeenCalledWith(
      expect.objectContaining({
        disabled: true,
        icon: "Value--Acca-Freeze",
        label: "I18N.FREEZE_LEG.SELECT_BUTTON_LABEL",
        onTap: expect.anything(),
      }),
      undefined,
    );
    expect(RichTextComponent).toHaveBeenCalledWith(
      expect.objectContaining({
        list: expect.arrayContaining([
          expect.objectContaining({
            text: "I18N.FREEZE_LEG.UNSELECTED_LABEL",
          }),
        ]),
      }),
      undefined,
    );
  });
});
