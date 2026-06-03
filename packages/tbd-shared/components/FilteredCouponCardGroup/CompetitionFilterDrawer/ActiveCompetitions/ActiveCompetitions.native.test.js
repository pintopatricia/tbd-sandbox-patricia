import { render, act } from "@testing-library/react-native";
import { ActionLink, Chip } from "@ppb/the-wall-native";
import { ActionLinkColor } from "@ppb/the-wall-common/types";
import { ActiveCompetitions } from "./ActiveCompetitions.native";

jest.mock("@ppb/the-wall-native", () => ({
  Chip: jest.fn(),
  ActionLink: jest.fn(),
}));

const SELECTED_COMPETITIONS_MOCK = [
  { id: "competitionurn1", name: "la liga" },
  { id: "competitionurn2", name: "la liga runiors" },
];

const renderActiveCompetitionsComponent = ({
  selectedCompetitions = SELECTED_COMPETITIONS_MOCK,
  onCompetitionRemove = null,
  onReset = null,
  resetText = "reset",
}) => {
  render(
    <ActiveCompetitions
      selectedCompetitions={selectedCompetitions}
      onCompetitionRemove={onCompetitionRemove}
      onReset={onReset}
      resetText={resetText}
    />,
  );
};

describe("ActiveCompetitions", () => {
  beforeEach(jest.clearAllMocks);

  it("should render ActiveCompetitions", () => {
    renderActiveCompetitionsComponent({});
    expect(Chip).toHaveBeenCalledTimes(2);
    expect(Chip).toHaveBeenCalledWith(
      {
        text: "la liga",
        onTap: expect.any(Function),
      },
      undefined,
    );
    expect(Chip).toHaveBeenCalledWith(
      {
        text: "la liga runiors",
        onTap: expect.any(Function),
      },
      undefined,
    );
  });
  describe("when chip is clicked", () => {
    it("must add/remove respective competition", () => {
      const addRemove = jest.fn();
      renderActiveCompetitionsComponent({ onCompetitionRemove: addRemove });
      act(() => Chip.mock.calls[0][0].onTap());
      expect(addRemove).toHaveBeenCalledTimes(1);
      expect(addRemove).toHaveBeenCalledWith("competitionurn1");
    });
  });
  it("should render resetButton", () => {
    const onReset = jest.fn();
    renderActiveCompetitionsComponent({ selectedCompetitions: SELECTED_COMPETITIONS_MOCK, onReset });

    expect(ActionLink).toHaveBeenCalledTimes(1);
    expect(ActionLink).toHaveBeenCalledWith(
      { color: ActionLinkColor.Default, text: "reset", onClick: onReset },
      undefined,
    );
  });
});
