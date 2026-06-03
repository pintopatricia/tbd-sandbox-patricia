import { render } from "@testing-library/react-native";

import ViewZone from "./ViewZone.native";
import selectors from "./ViewZone.native.selectors";
import styles from "./ViewZone.native.styles";

import ConnectedCardGroup from "../CardGroup";
import CardGroup from "../CardGroup/CardGroup.native";

import ConnectedSegmentedCardGroup from "../SegmentedCardGroup";
import SegmentedCardGroup from "../SegmentedCardGroup/SegmentedCardGroup.native";
import SegmentedCardGroupPlaceholder from "../SegmentedCardGroup/SegmentedCardGroupPlaceholder.native";

jest.mock("@ppb/the-wall-common/base-theme", () => ({
  colors: {},
  typography: {},
  spacings: {},
  heights: {},
  gutters: {},
}));

jest.mock("@ppb/the-wall-native", () => ({
  withStyle: jest.fn(() => "some-placeholder"),
  Text: jest.requireActual("react-native").Text,
}));

jest.mock("../CardGroup", () => jest.fn(() => <connected-cardgroup-mock />));
jest.mock("../CardGroup/CardGroup.native", () => jest.fn(() => <cardgroup-mock />));

jest.mock("../SegmentedCardGroup", () => jest.fn(() => <connected-segmented-cardgroup-mock />));
jest.mock("../SegmentedCardGroup/SegmentedCardGroup.native", () => jest.fn(() => <segmented-cardgroup-mock />));
jest.mock("../SegmentedCardGroup/SegmentedCardGroupPlaceholder.native", () =>
  jest.fn(() => <segmented-cardgroup-placeholder-mock />),
);

jest.mock("../CardGroup/CardGroupPlaceholders.native", () => ({
  DefaultPlaceholder: "default-placeholder",
}));

jest.mock("../ErrorBoundary/ErrorBoundary", () => ({
  ErrorBoundary: jest.fn(({ children }) => <>{children}</>),
}));

const viewZoneItems = [{ urn: "ppb:tbd:cardgroup:segmented", typename: "SegmentedCardGroup" }];
const cardGroupItems = [{ urn: "ppb:tbd:cardgroup:some", typename: "SomeCardGroup" }];

function renderViewZone({ title = "Fake Title", items = [] }) {
  return render(<ViewZone title={title} items={items} />);
}

describe("View Zone", () => {
  beforeEach(jest.clearAllMocks);

  describe("when there are no items", () => {
    it("should not render ViewZone", () => {
      const { queryByTestId } = renderViewZone({ items: [] });
      const viewZone = queryByTestId(selectors.VIEW_ZONE_CONTAINER);

      expect(viewZone).toBeNull();
    });
  });

  describe("when there are items", () => {
    it("should render title", () => {
      const { getByTestId } = renderViewZone({ items: viewZoneItems });
      const viewZoneTitle = getByTestId(selectors.VIEW_ZONE_TITLE);

      expect(viewZoneTitle).toHaveStyle(styles.title);
      expect(viewZoneTitle).toHaveTextContent("Fake Title");
    });

    it("should render ViewZone with the expected connected items", () => {
      renderViewZone({ items: viewZoneItems });

      expect(ConnectedSegmentedCardGroup).toHaveBeenCalledWith(
        {
          urn: "ppb:tbd:cardgroup:segmented",
          component: SegmentedCardGroup,
          placeholder: SegmentedCardGroupPlaceholder,
        },
        undefined,
      );
    });

    describe("when the item typename doesn't match any connected component", () => {
      it("should render the connected card group", () => {
        renderViewZone({ items: cardGroupItems });

        expect(ConnectedCardGroup).toHaveBeenCalledWith(
          {
            urn: "ppb:tbd:cardgroup:some",
            typename: "SomeCardGroup",
            component: CardGroup,
          },
          undefined,
        );
      });
    });
  });
});
