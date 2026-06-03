import { render, act } from "@testing-library/react";
import "jest-dom/extend-expect";

import ConnectedGameInfoPage from "./GameInfoPage.web";
import ConnectedCard from "../Card";
import Card from "../Card/Card.web";
import ConnectedBackNavigationItem from "../BackNavigationItem/index";

jest.mock("../Card", () => jest.fn(() => <connected-card-mock />));
jest.mock("../BackNavigationItem", () => jest.fn(() => <connected-back-nav-item-mock />));

describe("GameInfoPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call connected card for the items", () => {
    render(
      <ConnectedGameInfoPage
        urn={"ppb:gameInfo"}
        view={{
          items: [
            { urn: "urn:fake:1", typename: "fake:1" },
            { urn: "urn:fake:2", typename: "fake:2" },
          ],
        }}
      />,
    );
    expect(ConnectedCard).toHaveBeenCalledWith({ urn: "urn:fake:1", typename: "fake:1", component: Card }, undefined);
    expect(ConnectedCard).toHaveBeenCalledWith({ urn: "urn:fake:2", typename: "fake:2", component: Card }, undefined);
    expect(ConnectedCard).toHaveBeenCalledTimes(2);
  });

  it("should should not render the connected cards when there are no items", () => {
    render(<ConnectedGameInfoPage urn={"ppb:gameInfoPage"} view={{ items: [] }} />);
    expect(ConnectedCard).toHaveBeenCalledTimes(0);
  });

  it("should render BackNavigationItem when backNavigationTitle exists", async () => {
    await act(async () => {
      render(
        <ConnectedGameInfoPage
          urn={"ppb:gameInfo"}
          view={{
            navigationItem: { title: "Back" },
            items: [],
          }}
        />,
      );
    });
    expect(ConnectedBackNavigationItem).toHaveBeenCalledTimes(1);
  });
});
