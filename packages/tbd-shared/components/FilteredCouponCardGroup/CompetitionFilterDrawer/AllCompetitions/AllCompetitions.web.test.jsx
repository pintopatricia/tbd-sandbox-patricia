import "jest-dom/extend-expect";
import { OptionList, Image, Card } from "@ppb/the-wall-web";
import { render } from "@testing-library/react";
import { CardHeaderSize, CardTheme } from "@ppb/the-wall-common/types/Card/Card.types";
import { AllCompetitions } from "./AllCompetitions.web";

jest.mock("@ppb/the-wall-web", () => ({
  Card: jest.fn(),
  OptionList: jest.fn(),
  Image: jest.fn(),
}));

const COMPETITIONS_MOCK = [
  {
    id: "GB",
    title: "United Kingdom",
    flag: "flag:gb",
    items: [
      {
        id: "ppb:competition:1",
      },
      {
        id: "ppb:competition:2",
      },
    ],
  },
  {
    id: "PT",
    title: "Portugal",
    flag: "flag:pt",
    items: [
      {
        id: "ppb:competition:3",
      },
    ],
  },
];

const COMPETITION_WITHOUT_FLAG_MOCK = [
  {
    id: "ES",
    title: "Spain",
    flag: undefined,
    items: [
      {
        id: "ppb:competition:3",
      },
    ],
  },
];

const SELECTED_COMPETITIONS_MOCK = ["ppb:competition:1", "ppb:competition:3"];

function setup({ competitions = [], selectedCompetitions = [], onCheckboxListChange = null } = {}) {
  return render(
    <AllCompetitions
      competitions={competitions}
      selectedCompetitions={selectedCompetitions}
      onCheckboxListChange={onCheckboxListChange}
    />,
  );
}

describe("AllCompetitions", () => {
  beforeEach(jest.clearAllMocks);

  it("should render one accordion for each competition group", () => {
    setup({ competitions: COMPETITIONS_MOCK });

    expect(Card).toHaveBeenCalledTimes(2);
    expect(Card).toHaveBeenCalledWith(
      {
        startOpen: false,
        isCollapsible: true,
        title: "United Kingdom",
        theme: CardTheme.TRANSPARENT,
        size: CardHeaderSize.LARGE,
        fullWidthContent: true,
        startElement: expect.any(Object),
        children: expect.any(Object),
      },
      undefined,
    );
    expect(Card).toHaveBeenCalledWith(
      {
        startOpen: false,
        isCollapsible: true,
        title: "Portugal",
        theme: CardTheme.TRANSPARENT,
        size: CardHeaderSize.LARGE,
        fullWidthContent: true,
        startElement: expect.any(Object),
        children: expect.any(Object),
      },
      undefined,
    );
  });

  it("should render one OptionList for each competition group", () => {
    const onCheckboxListChangeSpy = jest.fn();
    setup({
      competitions: COMPETITIONS_MOCK,
      selectedCompetitions: SELECTED_COMPETITIONS_MOCK,
      onCheckboxListChange: onCheckboxListChangeSpy,
    });

    Card.mock.calls.forEach((call) => render(call[0].children));

    expect(OptionList).toHaveBeenCalledTimes(2);

    expect(OptionList).toHaveBeenCalledWith(
      {
        listGroupName: "GB",
        listOptions: [
          {
            id: "ppb:competition:1",
            isSelected: true,
          },
          {
            id: "ppb:competition:2",
            isSelected: false,
          },
        ],
        handleChange: onCheckboxListChangeSpy,
      },
      undefined,
    );

    expect(OptionList).toHaveBeenCalledWith(
      {
        listGroupName: "PT",
        listOptions: [
          {
            id: "ppb:competition:3",
            isSelected: true,
          },
        ],
        handleChange: onCheckboxListChangeSpy,
      },
      undefined,
    );
  });

  it("should render competition group flags when flags are defined", () => {
    const onCheckboxListChangeSpy = jest.fn();
    setup({
      competitions: COMPETITIONS_MOCK,
      selectedCompetitions: SELECTED_COMPETITIONS_MOCK,
      onCheckboxListChange: onCheckboxListChangeSpy,
    });

    Card.mock.calls.forEach((call) => render(call[0].startElement));

    expect(Image).toHaveBeenCalledWith(
      {
        src: "flag:gb",
        alt: "",
      },
      undefined,
    );

    expect(Image).toHaveBeenCalledWith(
      {
        src: "flag:pt",
        alt: "",
      },
      undefined,
    );
  });

  it("should not render flags when not defined", () => {
    const onCheckboxListChangeSpy = jest.fn();
    setup({
      competitions: COMPETITION_WITHOUT_FLAG_MOCK,
      selectedCompetitions: SELECTED_COMPETITIONS_MOCK,
      onCheckboxListChange: onCheckboxListChangeSpy,
    });

    expect(Image).toHaveBeenCalledTimes(0);
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
