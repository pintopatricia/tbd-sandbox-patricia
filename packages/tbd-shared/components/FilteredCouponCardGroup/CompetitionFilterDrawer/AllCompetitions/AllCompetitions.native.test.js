import { render } from "@testing-library/react-native";
import { Card, OptionList, TBDImage } from "@ppb/the-wall-native";
import { CardHeaderSize, CardTheme } from "@ppb/the-wall-common/types/Card/Card.types";
import { AllCompetitions } from "./AllCompetitions.native";

jest.mock("@ppb/the-wall-native", () => ({
  Card: jest.fn(),
  OptionList: jest.fn(),
  TBDImage: jest.fn(),
}));

const COMPETITIONS_MOCK = [
  {
    id: "ES",
    flag: "flag:es",
    title: "Competition",
    items: [
      { id: "competitionurn1", text: "competitionText", isSelected: true },
      { id: "competitionurn2", text: "competitionText2", isSelected: false },
    ],
  },
];

const COMPETITION_WITHOUT_FLAG_MOCK = [
  {
    id: "ES",
    flag: undefined,
    title: "Spain",
    items: [{ id: "competitionurn1", text: "competitionText", isSelected: true }],
  },
];
const SELECTED_COMPETITIONS_MOCK = ["competitionurn1"];
const CHECKBOX_LIST_CHANGE_MOCK = () => jest.fn(() => {});

const renderAllCompetitionsComponent = ({
  competitions = COMPETITIONS_MOCK,
  selectedCompetitions = SELECTED_COMPETITIONS_MOCK,
  onCheckboxListChange = CHECKBOX_LIST_CHANGE_MOCK,
}) => {
  render(
    <AllCompetitions
      competitions={competitions}
      selectedCompetitions={selectedCompetitions}
      onCheckboxListChange={onCheckboxListChange}
    />,
  );
};

describe("AllCompetitions", () => {
  beforeEach(jest.clearAllMocks);

  it("should render an accordion for every competition group", () => {
    renderAllCompetitionsComponent({});
    expect(Card).toHaveBeenCalledTimes(1);
    expect(Card).toHaveBeenCalledWith(
      {
        startOpen: false,
        isCollapsible: true,
        title: "Competition",
        theme: CardTheme.TRANSPARENT,
        size: CardHeaderSize.LARGE,
        fullWidthContent: true,
        startElement: expect.any(Object),
        children: expect.any(Object),
      },
      undefined,
    );
  });
  it("should render OptionList", () => {
    const onCheckboxListChangeSpy = jest.fn();
    const checkboxListOptions = [
      { id: "competitionurn1", text: "competitionText", isSelected: true, key: "competitionurn1" },
      { id: "competitionurn2", text: "competitionText2", isSelected: false, key: "competitionurn2" },
    ];
    renderAllCompetitionsComponent({ onCheckboxListChange: onCheckboxListChangeSpy });
    Card.mock.calls.forEach((call) => render(call[0].children));
    expect(OptionList).toHaveBeenCalledTimes(1);
    expect(OptionList).toHaveBeenCalledWith(
      {
        listOptions: checkboxListOptions,
        handleChange: expect.any(Function),
      },
      undefined,
    );
  });
  it("should render flag when defined", () => {
    const onCheckboxListChangeSpy = jest.fn();
    renderAllCompetitionsComponent({
      onCheckboxListChange: onCheckboxListChangeSpy,
    });

    Card.mock.calls.forEach((call) => render(call[0].startElement));

    expect(TBDImage).toHaveBeenCalledWith(
      {
        source: "flag:es",
      },
      undefined,
    );
  });

  it("should not render flag when not defined", () => {
    renderAllCompetitionsComponent({
      competitions: COMPETITION_WITHOUT_FLAG_MOCK,
    });

    expect(TBDImage).toHaveBeenCalledTimes(0);
    expect(Card).toHaveBeenCalledWith(
      {
        startOpen: false,
        isCollapsible: true,
        title: "Spain",
        theme: CardTheme.TRANSPARENT,
        size: CardHeaderSize.LARGE,
        fullWidthContent: true,
        startElement: undefined,
        children: expect.any(Object),
      },
      undefined,
    );
  });
});
