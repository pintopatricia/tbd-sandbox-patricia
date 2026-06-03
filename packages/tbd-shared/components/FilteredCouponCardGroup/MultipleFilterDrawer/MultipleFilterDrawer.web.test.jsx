import { render, act } from "@testing-library/react";
import "jest-dom/extend-expect";
import { FilterDrawer, OptionList } from "@ppb/the-wall-web";
import { ConfigContextProvider } from "../../Config/ConfigContext";
import MultipleFilterDrawer from "./MultipleFilterDrawer.web";

jest.mock("@ppb/the-wall-web", () => ({
  OptionList: jest.fn((props) => <option-list {...props} />),
  FilterDrawer: jest.fn((props) => <filter-drawer {...props} />),
}));

function renderMultipleFilterDrawer(props, value = { isDesktopLayout: false }) {
  return render(
    <ConfigContextProvider value={value}>
      <MultipleFilterDrawer {...props} />
    </ConfigContextProvider>,
  );
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

const filterDrawerExpectedProps = {
  title: filterMock.title,
  displayApplyButton: true,
  onCloseTap: multipleFilterMock.onClose,
  onApply: expect.any(Function),
  onOutsideTap: multipleFilterMock.onClose,
  applyText: undefined,
  children: expect.any(Object),
  theme: "dark",
};

describe("MultipleFilterDrawer", () => {
  afterEach(jest.clearAllMocks);

  describe("when using desktop template", () => {
    it("should render MultipleFilterDrawer", () => {
      renderMultipleFilterDrawer(multipleFilterMock, { isDesktopLayout: true });

      expect(FilterDrawer).toHaveBeenCalledWith(
        {
          ...filterDrawerExpectedProps,
          isDesktop: true,
        },
        undefined,
      );
    });
  });

  it("should render FilterDrawer", () => {
    renderMultipleFilterDrawer(multipleFilterMock);
    expect(FilterDrawer).toHaveBeenCalledWith(
      {
        ...filterDrawerExpectedProps,
        isDesktop: false,
      },
      undefined,
    );
  });

  it("should render OptionList", () => {
    renderMultipleFilterDrawer(multipleFilterMock);
    expect(OptionList).toHaveBeenCalledWith(
      {
        listGroupName: "filterSelections",
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
          listGroupName: "filterSelections",
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
        OptionList.mock.calls[0][0].handleChange({ id: "filter:option:2", text: "Option 2" });
        FilterDrawer.mock.calls[0][0].onApply();
      });

      expect(multipleFilterMock.onApply).toHaveBeenCalledWith(
        ["filter:option:1", "filter:option:2"],
        ["Option 1", "Option 2"],
      );
    });
  });

  describe("when option is selected", () => {
    it("should call onApply correctly", () => {
      renderMultipleFilterDrawer(multipleFilterMock);

      act(() => {
        OptionList.mock.calls[0][0].handleChange({ id: "filter:option:1", text: "Option 1" });
        FilterDrawer.mock.calls[0][0].onApply();
      });

      expect(multipleFilterMock.onApply).toHaveBeenCalledWith([], []);
    });
  });
});
