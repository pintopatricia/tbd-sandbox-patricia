import "jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { ConnectedActiveCompetitions } from "./ActiveCompetitions.view";
import { useActiveCompetitionsVM } from "../viewmodel/ActiveCompetitions.viewmodel";

const PlaceholderMock = jest.fn(() => <></>);
const ComponentMock = jest.fn(() => <></>);

jest.mock("../viewmodel/ActiveCompetitions.viewmodel", () => ({
  useActiveCompetitionsVM: jest.fn(),
}));

function setup({
  selectedCompetitions = [],
  loading = false,
  selectedCompetitionsIds = [],
  resetText = null,
  onCompetitionRemove = null,
  onReset = null,
} = {}) {
  useActiveCompetitionsVM.mockReturnValue({ loading, selectedCompetitions });

  return render(
    <ConnectedActiveCompetitions
      urn="ppb:tbd:urn"
      component={ComponentMock}
      placeholder={PlaceholderMock}
      selectedCompetitionsIds={selectedCompetitionsIds}
      resetText={resetText}
      onCompetitionRemove={onCompetitionRemove}
      onReset={onReset}
    />,
  );
}

describe("ConnectedActiveCompetitions", () => {
  beforeEach(jest.clearAllMocks);

  describe("when is loading", () => {
    it("should render placeholder", async () => {
      setup({ loading: true });

      expect(PlaceholderMock).toHaveBeenCalled();
    });
    it("should not render the component", async () => {
      setup({ loading: true });

      expect(ComponentMock).not.toHaveBeenCalledTimes(1);
    });
  });

  describe("when is loaded", () => {
    it("should not render placeholder", async () => {
      setup({ loading: false });

      expect(PlaceholderMock).not.toHaveBeenCalled();
    });

    it("should render the component", async () => {
      const selectedCompetitionsIds = ["ppb:competition:1", "ppb:competition:3"];
      const resetTextMock = "Reset";
      const onCompetitionRemoveSpy = jest.fn();
      const onResetSpy = jest.fn();

      setup({
        selectedCompetitions: [
          {
            id: "ppb:competition:1",
            name: "Competition 1",
          },
          {
            id: "ppb:competition:3",
            name: "Competition 3",
          },
        ],
        loading: false,
        selectedCompetitionsIds,
        onCompetitionRemove: onCompetitionRemoveSpy,
        resetText: resetTextMock,
        onReset: onResetSpy,
      });

      expect(ComponentMock).toHaveBeenCalledTimes(1);
      expect(ComponentMock).toHaveBeenCalledWith(
        {
          selectedCompetitions: [
            { id: "ppb:competition:1", name: "Competition 1" },
            { id: "ppb:competition:3", name: "Competition 3" },
          ],
          resetText: resetTextMock,
          onReset: onResetSpy,
          onCompetitionRemove: onCompetitionRemoveSpy,
        },
        undefined,
      );
    });
  });
});
