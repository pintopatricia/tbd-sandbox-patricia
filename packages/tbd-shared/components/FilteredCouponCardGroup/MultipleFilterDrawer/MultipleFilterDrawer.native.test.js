import { render, act } from "@testing-library/react-native";
import { FilterDrawer, OptionList } from "@ppb/the-wall-native";
import MultipleFilterDrawer from "./MultipleFilterDrawer.native";

jest.mock("@ppb/the-wall-native", () => ({
  OptionList: jest.fn((props) => <option-list {...props} />),
  FilterDrawer: jest.fn((props) => <filter-drawer {...props} />),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  spacings: {},
}));

function renderMultipleFilterDrawer(props) {
  return render(<MultipleFilterDrawer {...props} />);
}

const filterMock = {
  id: "marketTypeFilter",
  value: "filter 1",
  isSelected: false,
  isActive: false,
  isSingleSelection: false,
  title: "filter 1",
  availableOptions: [
    { id: "filter:option:1", text: "Option 1" },
    { id: "filter:option:2", text: "Option 2" },
  ],
  defaultOption: { id: "filter:option:2", text: "Option 2" },
};

const selectionsMock = {
  sortFilter: "filter:option:3",
  dateRangeFilter: "filter:option:2",
  marketTypeFilter: "filter:option:1",
};

const multipleFilterMock = {
  filter: filterMock,
  selections: selectionsMock,
  onApply: jest.fn(() => {}),
  onClose: jest.fn(() => {}),
};

const multipleFilterWithoutSelectionsMock = {
  ...multipleFilterMock,
  selections: {},
};

describe("MultipleFilterDrawer", () => {
  afterEach(jest.clearAllMocks);

  it("should render FilterDrawer", () => {
    renderMultipleFilterDrawer(multipleFilterMock);
    expect(FilterDrawer).toHaveBeenCalledWith(
      {
        title: filterMock.title,
        displayApplyButton: true,
        onCloseTap: multipleFilterMock.onClose,
        onApply: expect.any(Function),
        onOutsideTap: multipleFilterMock.onClose,
        applyText: undefined,
        children: expect.any(Object),
        theme: "dark",
      },
      undefined,
    );
  });

  it("should render OptionList", () => {
    renderMultipleFilterDrawer(multipleFilterMock);
    expect(OptionList).toHaveBeenCalledWith(
      {
        listOptions: [
          {
            id: "filter:option:1",
            isSelected: true,
            text: "Option 1",
          },
          {
            id: "filter:option:2",
            isSelected: false,
            text: "Option 2",
          },
        ],
        handleChange: expect.any(Function),
      },
      undefined,
    );
  });

  describe("when don't have selections", () => {
    it("should render OptionList without any selected option", () => {
      renderMultipleFilterDrawer(multipleFilterWithoutSelectionsMock);

      expect(OptionList).toHaveBeenCalledWith(
        {
          listOptions: [
            {
              id: "filter:option:1",
              isSelected: false,
              text: "Option 1",
            },
            {
              id: "filter:option:2",
              isSelected: false,
              text: "Option 2",
            },
          ],
          handleChange: expect.any(Function),
        },
        undefined,
      );
    });
  });

  describe("when option is not selected", () => {
    it("should call onApply correctly", () => {
      renderMultipleFilterDrawer(multipleFilterMock);

      act(() => {
        OptionList.mock.calls[0][0].handleChange("filter:option:2");
        FilterDrawer.mock.calls[0][0].onApply();
      });

      expect(multipleFilterMock.onApply).toHaveBeenCalledWith(["filter:option:1", "filter:option:2"], []);
    });
  });

  describe("when option is selected", () => {
    it("should call onApply correctly", () => {
      renderMultipleFilterDrawer(multipleFilterMock);

      act(() => {
        OptionList.mock.calls[0][0].handleChange("filter:option:1");
        FilterDrawer.mock.calls[0][0].onApply();
      });

      expect(multipleFilterMock.onApply).toHaveBeenCalledWith([], []);
    });
  });
});
