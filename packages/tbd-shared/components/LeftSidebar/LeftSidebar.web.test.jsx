import { render } from "@testing-library/react";

import ConnectedSportsBrowse from "../SportsBrowse";
import LeftSidebar from "./LeftSidebar.web";
import { i18n } from "../../helpers/i18n";
import { ViewItem } from "../ViewItem/ViewItem.web";

jest.mock("../SportsBrowse", () => jest.fn((props) => <connected-sports-browse-mock {...props} />));
jest.mock("../SportsBrowse/SportsBrowse.web", () => jest.fn((props) => <sports-browse-mock {...props} />));

jest.mock("../ViewItem/ViewItem.web", () => ({ ViewItem: jest.fn((props) => <view-item-mock {...props} />) }));

jest.mock("../../helpers/i18n", () => ({
  i18n: jest.fn(({ key }) => key),
}));

const ITEMS = [
  { urn: "1", typename: "SwimlaneCardGroup" },
  { urn: "2", typename: "GamingCardGroup" },
];

const DEFAULT_PROPS = {
  items: ITEMS,
  isDesktop: true,
};

const renderLeftSidebar = (props = {}) => render(<LeftSidebar {...DEFAULT_PROPS} {...props} />);

describe("LeftSidebar.web", () => {
  beforeEach(jest.clearAllMocks);

  it("should render the search bar correctly", () => {
    renderLeftSidebar();

    expect(i18n).toHaveBeenCalledWith({ key: "I18N.NAVIGATION_BAR.SEARCH" });
    expect(ConnectedSportsBrowse).toHaveBeenCalledWith({ component: expect.any(Function), isDesktop: true }, undefined);
  });

  describe("items", () => {
    describe("when no items are passed", () => {
      it("should not render any view item", () => {
        renderLeftSidebar({ items: [] });

        expect(ViewItem).not.toHaveBeenCalled();
      });
    });

    describe("when items are passed", () => {
      it("should render the correct number of view items", () => {
        renderLeftSidebar();

        expect(ViewItem).toHaveBeenCalledTimes(2);
        expect(ViewItem).toHaveBeenNthCalledWith(
          1,
          { urn: ITEMS[0].urn, typename: ITEMS[0].typename, visible: true },
          undefined,
        );
        expect(ViewItem).toHaveBeenNthCalledWith(
          2,
          { urn: ITEMS[1].urn, typename: ITEMS[1].typename, visible: true },
          undefined,
        );
      });
    });
  });
});
