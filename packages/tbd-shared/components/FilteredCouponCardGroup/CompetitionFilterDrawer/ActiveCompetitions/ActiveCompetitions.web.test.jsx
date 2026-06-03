import "jest-dom/extend-expect";
import { ActionLinkColor, ActionLinkTypography } from "@ppb/the-wall-common/types";
import { ActionLink, Chip } from "@ppb/the-wall-web";
import { render, act } from "@testing-library/react";
import { ActiveCompetitions } from "./ActiveCompetitions.web";

jest.mock("@ppb/the-wall-web", () => ({
  ActionLink: jest.fn(),
  Chip: jest.fn(),
}));

const SELECTED_COMPETITIONS_MOCK = [
  {
    id: "ppb:competition:1",
    name: "Premier League",
  },
  {
    id: "ppb:competition:2",
    name: "Championship",
  },
];

function setup({ selectedCompetitions = [], resetText = "Reset", onReset = null, onCompetitionRemove = null } = {}) {
  return render(
    <ActiveCompetitions
      selectedCompetitions={selectedCompetitions}
      resetText={resetText}
      onReset={onReset}
      onCompetitionRemove={onCompetitionRemove}
    />,
  );
}

describe("ActiveCompetitions", () => {
  beforeEach(jest.clearAllMocks);

  it("should render one chip for each selected competition", () => {
    setup({ selectedCompetitions: SELECTED_COMPETITIONS_MOCK });

    expect(Chip).toHaveBeenCalledTimes(2);
    expect(Chip).toHaveBeenCalledWith(
      {
        text: "Premier League",
        onTap: expect.any(Function),
      },
      undefined,
    );
    expect(Chip).toHaveBeenCalledWith(
      {
        text: "Championship",
        onTap: expect.any(Function),
      },
      undefined,
    );
  });

  describe("when chip is clicked", () => {
    it("should call onCompetitionRemoved with competition id", () => {
      const onCompetitionRemoveSpy = jest.fn();
      setup({ selectedCompetitions: SELECTED_COMPETITIONS_MOCK, onCompetitionRemove: onCompetitionRemoveSpy });

      act(() => Chip.mock.calls[0][0].onTap());

      expect(onCompetitionRemoveSpy).toHaveBeenCalledTimes(1);
      expect(onCompetitionRemoveSpy).toHaveBeenCalledWith("ppb:competition:1");
    });
  });

  it("should render reset button", () => {
    const onResetSpy = jest.fn();
    setup({ selectedCompetitions: SELECTED_COMPETITIONS_MOCK, onReset: onResetSpy });

    expect(ActionLink).toHaveBeenCalledTimes(1);
    expect(ActionLink).toHaveBeenCalledWith(
      {
        color: ActionLinkColor.Default,
        text: "Reset",
        typography: ActionLinkTypography.Regular,
        onClick: onResetSpy,
      },
      undefined,
    );
  });
});
