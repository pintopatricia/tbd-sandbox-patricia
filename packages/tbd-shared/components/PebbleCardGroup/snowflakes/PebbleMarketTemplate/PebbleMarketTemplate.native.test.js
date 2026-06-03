import { render } from "@testing-library/react-native";

import { PebbleList } from "@ppb/the-wall-native";

import { ExchangeMarket } from "../../../ExchangeMarket/snowflakes/ExchangeMarket/ExchangeMarket.native";
import { PebbleMarketTemplate } from "./PebbleMarketTemplate.native";
import styles from "./PebbleMarketTemplate.native.styles";

jest.mock("@ppb/the-wall-native", () => ({
  PebbleList: jest.fn(({ props, children }) => <market-pebble-list {...props}>{children}</market-pebble-list>),
}));

jest.mock("../../../ExchangeMarket/snowflakes/ExchangeMarket/ExchangeMarket.native", () => ({
  ExchangeMarket: jest.fn(({ props, children }) => <exchange-market-mock {...props}>{children}</exchange-market-mock>),
}));

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  spacings: {},
}));

jest.mock("@ppb/the-wall-native/helpers/test-props", () => ({
  getTestProps: jest.fn().mockImplementation((props) => ({ testID: props })),
}));

beforeEach(jest.clearAllMocks); // clears all mock calls between tests

function renderPebbleMarketTemplate({ items, defaultSelectedPebble, onPebblePress, selectedPebbleRef, title }) {
  return render(
    <PebbleMarketTemplate
      items={items}
      defaultSelectedPebble={defaultSelectedPebble}
      onPebblePress={onPebblePress}
      title={title}
      selectedPebbleRef={selectedPebbleRef}
    >
      <ExchangeMarket urn="urn" name="Market" prices={[]} />
    </PebbleMarketTemplate>,
  );
}

describe("PebbleMarketTemplate", () => {
  describe("when PebbleMarketTemplate is mounted", () => {
    const pebbleListProps = {
      defaultSelectedPebble: undefined,
      items: [1, 2],
      onPebblePress: jest.fn(),
      title: "Over/Under",
      selectedPebbleRef: undefined,
    };

    it("should render children correctly", () => {
      renderPebbleMarketTemplate(pebbleListProps);

      expect(ExchangeMarket).toHaveBeenCalledTimes(1);
      expect(ExchangeMarket).toHaveBeenCalledWith({ name: "Market", prices: [], urn: "urn" }, undefined);
    });

    it("should call PebbleList with correct props", () => {
      renderPebbleMarketTemplate(pebbleListProps);

      expect(PebbleList).toHaveBeenCalledTimes(1);
      expect(PebbleList).toHaveBeenCalledWith(
        {
          defaultSelectedPebble: undefined,
          items: [1, 2],
          scrollStyle: styles.scrollViewStyle,
          onPebblePress: expect.any(Function),
        },
        undefined,
      );
    });
  });

  describe("when PebbleMarketTemplate is mounted without items", () => {
    const pebbleListProps = {
      defaultSelectedPebble: undefined,
      items: [],
      onPebblePress: jest.fn(),
    };

    beforeEach(() => {
      renderPebbleMarketTemplate(pebbleListProps);
    });

    it("should not call PebbleList", () => {
      expect(PebbleList).toHaveBeenCalledTimes(0);
    });
  });
});
