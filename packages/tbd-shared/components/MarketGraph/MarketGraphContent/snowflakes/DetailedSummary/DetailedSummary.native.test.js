import { render } from "@testing-library/react-native";

import { Divider } from "@ppb/the-wall-native";

import { DetailedSummary } from "./DetailedSummary.native";
import {
  DETAILED_SUMMARY_GROUP_TITLE,
  DETAILED_SUMMARY_ITEM_TITLE,
  DETAILED_SUMMARY_ITEM_AMOUNT,
} from "./DetailedSummary.native.selectors";

jest.mock("@ppb/the-wall-native", () => ({
  Divider: jest.fn(() => <divider-mock />),
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  tokens: {
    DetailedSummaryHorizontalGapPrimary: {},
    DetailedSummaryHorizontalGapSecondary: {},
  },
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

const mockBalances = [
  {
    title: "Cash Balance",
    groups: [
      {
        title: "Poker Wallet",
        amount: "£7.00",
      },
    ],
  },
];

function renderDetailedSummary({ showHorizontalRule = false }) {
  return render(<DetailedSummary details={mockBalances} showHorizontalRule={showHorizontalRule} />);
}

describe("DetailedSummary", () => {
  beforeEach(jest.clearAllMocks);

  it("should render the correct group title, wallet title and amount", () => {
    const { queryByTestId } = renderDetailedSummary({});

    expect(queryByTestId(DETAILED_SUMMARY_GROUP_TITLE)).toHaveTextContent("Cash Balance");
    expect(queryByTestId(DETAILED_SUMMARY_ITEM_TITLE)).toHaveTextContent("Poker Wallet");
    expect(queryByTestId(DETAILED_SUMMARY_ITEM_AMOUNT)).toHaveTextContent("£7.00");
  });

  describe("When there is showHorizontalRule equals true", () => {
    it("should render a divider", () => {
      renderDetailedSummary({ showHorizontalRule: true });

      expect(Divider).toHaveBeenCalledTimes(1);
    });
  });
});
