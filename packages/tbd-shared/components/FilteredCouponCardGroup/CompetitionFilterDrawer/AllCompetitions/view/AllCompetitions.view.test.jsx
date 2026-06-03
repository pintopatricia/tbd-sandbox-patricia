import "jest-dom/extend-expect";
import { render } from "@testing-library/react";
import { useAllCompetitionsVM } from "../viewmodel/AllCompetitions.viewmodel";
import { ConnectedAllCompetitions } from "./AllCompetitions.view";

const PlaceholderMock = jest.fn(() => <></>);
const ComponentMock = jest.fn(() => <></>);

jest.mock("../viewmodel/AllCompetitions.viewmodel.ts", () => ({
  useAllCompetitionsVM: jest.fn(),
}));
jest.mock("../../../../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

function setup({ loading = false, selectedCompetitions = [], competitions = [], onCheckboxListChange = null } = {}) {
  useAllCompetitionsVM.mockReturnValue({ loading, competitions });

  return render(
    <ConnectedAllCompetitions
      urn="ppb:tbd:urn"
      component={ComponentMock}
      placeholder={PlaceholderMock}
      selectedCompetitions={selectedCompetitions}
      onCheckboxListChange={onCheckboxListChange}
    />,
  );
}

describe("ConnectedAllCompetitions", () => {
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
      const selectedCompetitions = ["ppb:competition:1", "ppb:competition:3"];
      const onCheckboxListChangeSpy = jest.fn();

      setup({
        loading: false,
        competitions: [
          {
            id: "GB",
            flag: "vector:gb",
            title: "I18N.COUNTRIES.GB",
            items: [
              {
                id: "ppb:competition:1",
                isSelected: false,
                text: "Competition 1",
              },
            ],
          },
          {
            id: "PT",
            flag: "vector:pt",
            title: "I18N.COUNTRIES.PT",
            items: [
              {
                id: "ppb:competition:3",
                isSelected: false,
                text: "Competition 3",
              },
            ],
          },
        ],
        selectedCompetitions,
        onCheckboxListChange: onCheckboxListChangeSpy,
      });

      expect(ComponentMock).toHaveBeenCalledTimes(1);
      expect(ComponentMock).toHaveBeenCalledWith(
        {
          competitions: [
            {
              id: "GB",
              flag: "vector:gb",
              title: "I18N.COUNTRIES.GB",
              items: [
                {
                  id: "ppb:competition:1",
                  isSelected: false,
                  text: "Competition 1",
                },
              ],
            },
            {
              id: "PT",
              flag: "vector:pt",
              title: "I18N.COUNTRIES.PT",
              items: [
                {
                  id: "ppb:competition:3",
                  isSelected: false,
                  text: "Competition 3",
                },
              ],
            },
          ],
          selectedCompetitions: ["ppb:competition:1", "ppb:competition:3"],
          onCheckboxListChange: onCheckboxListChangeSpy,
        },
        undefined,
      );
    });
  });
});
