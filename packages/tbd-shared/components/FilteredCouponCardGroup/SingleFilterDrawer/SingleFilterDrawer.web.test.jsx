import { render, act } from "@testing-library/react";
import "jest-dom/extend-expect";
import { FilterDrawer, RadioList } from "@ppb/the-wall-web";
import { ConfigContextProvider } from "../../Config/ConfigContext";
import SingleFilterDrawer from "./SingleFilterDrawer.web";

jest.mock("@ppb/the-wall-web", () => ({
  RadioList: jest.fn((props) => <radio-list {...props} />),
  FilterDrawer: jest.fn((props) => <filter-drawer {...props} />),
}));

function renderSingleFilterDrawer(props, value = { isDesktopLayout: false }) {
  return render(
    <ConfigContextProvider value={value}>
      <SingleFilterDrawer {...props} />
    </ConfigContextProvider>,
  );
}

const radioFilterMock = {
  id: "marketTypeFilter",
  value: "filter 1",
  isSelected: false,
  isActive: false,
  isSingleSelection: true,
  title: "filter 1",
  availableOptions: [
    { id: "filter:option:1", text: "Option 1" },
    { id: "filter:1:option:2", text: "Option 2" },
  ],
  defaultOption: { id: "filter:1:option:2", text: "Option 2" },
};

const selectionsMock = {
  sortFilter: "filter:option:3",
  dateRangeFilter: "filter:option:2",
  marketTypeFilter: "filter:option:1",
};

const singleFilterMock = {
  filter: radioFilterMock,
  selections: selectionsMock,
  onApply: jest.fn(() => {}),
  onClose: jest.fn(() => {}),
};

const singleFilterWithoutSelectionsMock = {
  ...singleFilterMock,
  selections: {},
};

const filterDrawerExpectedProps = {
  title: radioFilterMock.title,
  displayApplyButton: false,
  onCloseTap: singleFilterMock.onClose,
  onOutsideTap: singleFilterMock.onClose,
  applyText: undefined,
  children: expect.any(Object),
  theme: "dark",
};

describe("SingleFilterDrawer", () => {
  afterEach(jest.clearAllMocks);

  describe("when using the desktop layout", () => {
    it("should render FilterDrawer", () => {
      renderSingleFilterDrawer(singleFilterMock, { isDesktopLayout: true });

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
    renderSingleFilterDrawer(singleFilterMock);
    expect(FilterDrawer).toHaveBeenCalledWith(
      {
        ...filterDrawerExpectedProps,
        isDesktop: false,
      },
      undefined,
    );
  });

  describe("when filter uses radio button list", () => {
    it("should render RadioList", () => {
      renderSingleFilterDrawer(singleFilterMock);
      expect(RadioList).toHaveBeenCalledWith(
        {
          listGroupName: "filterSelections",
          listOptions: singleFilterMock.filter.availableOptions,
          handleChange: expect.any(Function),
          selectedOption: "filter:option:1",
          theme: "dark",
        },
        undefined,
      );
    });

    it("should call handleChange correctly", () => {
      renderSingleFilterDrawer(singleFilterMock);

      act(() => {
        RadioList.mock.calls[0][0].handleChange(undefined, { id: "option", text: "optionText" });
      });

      expect(singleFilterMock.onApply).toHaveBeenCalledWith(["option"], ["optionText"]);
    });

    describe("and don't have selections", () => {
      it("should render RadioList with the selectedOption empty", () => {
        renderSingleFilterDrawer(singleFilterWithoutSelectionsMock);
        expect(RadioList).toHaveBeenCalledWith(
          {
            listGroupName: "filterSelections",
            listOptions: singleFilterWithoutSelectionsMock.filter.availableOptions,
            handleChange: expect.any(Function),
            selectedOption: "",
            theme: "dark",
          },
          undefined,
        );
      });
    });
  });
});
