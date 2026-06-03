import React, { Suspense } from "react";
import { act, render } from "@testing-library/react";
import emitEvent from "../../../../../event-broker/event-emitter";
import { Placeholder } from "@ppb/the-wall-web";
import { useRaceItemsContentVM } from "../viewmodel/RaceItemsContent.viewmodel";
import RaceItemsContent from "./RaceItemsContent.web";
import SELECTORS from "./RaceItemsContent.selectors";
import NavigationTabsListCard from "../../NavigationTabsListCard/view/NavigationTabsListCard.web";
import ConnectedRaceResultsCard from "../../../../RaceResultsCard";
import RaceResultsCardPlaceholder from "../../../../RaceResultsCard/RaceResultsCardPlaceholder.web";
import ConnectedRegulatoryCard from "../../../../RegulatoryCard";
import RegulatoryCardPlaceholder from "../../../../RegulatoryCard/RegulatoryCardPlaceholder.web";
import ConnectedPreferenceSingleChoiceCard from "../../../../PreferenceSingleChoiceCard";

jest.mock("../viewmodel/RaceItemsContent.viewmodel", () => ({
  useRaceItemsContentVM: jest.fn(),
}));

jest.mock("../../../../../event-broker/event-emitter", () => jest.fn());

jest.mock("@ppb/the-wall-web", () => ({
  Placeholder: jest.fn(() => <placeholder-mock />),
}));

jest.mock("../../NavigationTabsListCard/view/NavigationTabsListCard.web", () =>
  jest.fn((props) => <navigation-tabs-mock {...props} />),
);

jest.mock("../../../../RaceResultsCard", () => jest.fn((props) => <race-results-mock {...props} />));
jest.mock("../../../../RaceResultsCard/RaceResultsCard.web", () =>
  jest.fn((props) => <race-results-component-mock {...props} />),
);
jest.mock("../../../../RaceResultsCard/RaceResultsCardPlaceholder.web", () =>
  jest.fn(() => <race-results-placeholder-mock />),
);

jest.mock("../../../../RegulatoryCard", () => jest.fn((props) => <regulatory-card-mock {...props} />));
jest.mock("../../../../RegulatoryCard/RegulatoryCard.web", () =>
  jest.fn((props) => <regulatory-component-mock {...props} />),
);
jest.mock("../../../../RegulatoryCard/RegulatoryCardPlaceholder.web", () =>
  jest.fn(() => <regulatory-placeholder-mock />),
);

jest.mock("../../../../PreferenceSingleChoiceCard", () =>
  jest.fn((props) => <preference-single-choice-mock {...props} />),
);
jest.mock("../../../../PreferenceSingleChoiceCard/PreferenceSingleChoiceCard.web", () =>
  jest.fn((props) => <preference-single-choice-component-mock {...props} />),
);

const mockedUseRaceItemsContentVM = jest.mocked(useRaceItemsContentVM);

const buildVM = (overrides = {}) => ({
  loading: false,
  transitioning: false,
  vm: { data: { cardEdges: [] } },
  ...overrides,
});

const renderComponent = async (vmOverrides = {}, propOverrides = {}) => {
  mockedUseRaceItemsContentVM.mockReturnValue(buildVM(vmOverrides));

  const view = render(
    <Suspense fallback={null}>
      <RaceItemsContent
        viewUrn="ppb:tbd:view:raceMeeting:7|12345.1500"
        raceUrn="ppb:race:12345.1500"
        {...propOverrides}
      />
    </Suspense>,
  );

  await act(async () => {
    await Promise.resolve();
  });

  return { ...view };
};

describe("RaceItemsContent.web", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders the loading placeholder", async () => {
    const { getByTestId } = await renderComponent({ loading: true });

    expect(getByTestId(SELECTORS.CONTENT)).toBeDefined();
    expect(Placeholder).toHaveBeenCalled();
    expect(NavigationTabsListCard).not.toHaveBeenCalled();
    expect(ConnectedRaceResultsCard).not.toHaveBeenCalled();
    expect(ConnectedRegulatoryCard).not.toHaveBeenCalled();
    expect(ConnectedPreferenceSingleChoiceCard).not.toHaveBeenCalled();
  });

  it("renders an empty container without emitting when there are no cards", async () => {
    const { getByTestId } = await renderComponent();

    expect(getByTestId(SELECTORS.CONTENT)).toBeDefined();
    expect(emitEvent).not.toHaveBeenCalled();
  });

  it("renders navigation tabs cards", async () => {
    await renderComponent({
      vm: {
        data: {
          cardEdges: [
            {
              key: "NavigationTabsList-ppb:card:navigation",
              typename: "NavigationTabsList",
              urn: "ppb:card:navigation",
            },
          ],
        },
      },
    });

    expect(NavigationTabsListCard).toHaveBeenCalledWith(
      expect.objectContaining({ urn: "ppb:card:navigation", transitioning: false }),
      undefined,
    );
  });

  it("renders race results cards", async () => {
    await renderComponent({
      vm: {
        data: {
          cardEdges: [
            { key: "RaceResultsCard-ppb:card:results", typename: "RaceResultsCard", urn: "ppb:card:results" },
          ],
        },
      },
    });

    expect(ConnectedRaceResultsCard).toHaveBeenCalledWith(
      expect.objectContaining({
        urn: "ppb:card:results",
        component: expect.any(Object),
        placeholder: RaceResultsCardPlaceholder,
        visible: true,
      }),
      undefined,
    );
  });

  it("renders regulatory cards", async () => {
    await renderComponent({
      vm: {
        data: {
          cardEdges: [
            { key: "RegulatoryCard-ppb:card:regulatory", typename: "RegulatoryCard", urn: "ppb:card:regulatory" },
          ],
        },
      },
    });

    expect(ConnectedRegulatoryCard).toHaveBeenCalledWith(
      expect.objectContaining({
        urn: "ppb:card:regulatory",
        component: expect.any(Object),
        placeholder: RegulatoryCardPlaceholder,
        visible: true,
      }),
      undefined,
    );
  });

  it("renders preference single choice cards", async () => {
    await renderComponent({
      vm: {
        data: {
          cardEdges: [
            {
              key: "PreferenceSingleChoiceCard-ppb:card:preference",
              typename: "PreferenceSingleChoiceCard",
              urn: "ppb:card:preference",
            },
          ],
        },
      },
    });

    expect(ConnectedPreferenceSingleChoiceCard).toHaveBeenCalledWith(
      expect.objectContaining({
        urn: "ppb:card:preference",
        component: expect.any(Object),
        visible: true,
      }),
      undefined,
    );
  });

  it("ignores unknown card types", async () => {
    await renderComponent({
      vm: {
        data: {
          cardEdges: [{ key: "Unknown-ppb:card:unknown", typename: "UnknownCard", urn: "ppb:card:unknown" }],
        },
      },
    });

    expect(NavigationTabsListCard).not.toHaveBeenCalled();
    expect(ConnectedRaceResultsCard).not.toHaveBeenCalled();
    expect(ConnectedRegulatoryCard).not.toHaveBeenCalled();
    expect(ConnectedPreferenceSingleChoiceCard).not.toHaveBeenCalled();
  });

  it("skips known card types when the urn is null", async () => {
    await renderComponent({
      vm: {
        data: {
          cardEdges: [{ key: "NavigationTabsList-null", typename: "NavigationTabsList", urn: null }],
        },
      },
    });

    expect(NavigationTabsListCard).not.toHaveBeenCalled();
  });

  it("passes transitioning through to navigation tabs cards", async () => {
    await renderComponent({
      transitioning: true,
      vm: {
        data: {
          cardEdges: [
            {
              key: "NavigationTabsList-ppb:card:navigation",
              typename: "NavigationTabsList",
              urn: "ppb:card:navigation",
            },
          ],
        },
      },
    });

    expect(NavigationTabsListCard).toHaveBeenCalledWith(
      expect.objectContaining({ urn: "ppb:card:navigation", transitioning: true }),
      undefined,
    );
  });

  it("emits fetch cards with non-null urns on mount", async () => {
    await renderComponent({
      vm: {
        data: {
          cardEdges: [
            {
              key: "NavigationTabsList-ppb:card:navigation",
              typename: "NavigationTabsList",
              urn: "ppb:card:navigation",
            },
            { key: "RegulatoryCard-null", typename: "RegulatoryCard", urn: null },
            { key: "RaceResultsCard-ppb:card:results", typename: "RaceResultsCard", urn: "ppb:card:results" },
          ],
        },
      },
    });

    expect(emitEvent).toHaveBeenCalledTimes(1);
    expect(emitEvent).toHaveBeenCalledWith("@@UI/FETCH_CARDS", {
      itemUrns: ["ppb:card:navigation", "ppb:card:results"],
    });
  });

  it("emits again when the card urns change", async () => {
    const { rerender } = await renderComponent({
      vm: {
        data: {
          cardEdges: [
            {
              key: "NavigationTabsList-ppb:card:navigation",
              typename: "NavigationTabsList",
              urn: "ppb:card:navigation",
            },
          ],
        },
      },
    });

    mockedUseRaceItemsContentVM.mockReturnValue(
      buildVM({
        vm: {
          data: {
            cardEdges: [
              { key: "RaceResultsCard-ppb:card:results", typename: "RaceResultsCard", urn: "ppb:card:results" },
            ],
          },
        },
      }),
    );

    rerender(
      <Suspense fallback={null}>
        <RaceItemsContent viewUrn="ppb:tbd:view:raceMeeting:7|12345.1500" raceUrn="ppb:race:12345.1500" />
      </Suspense>,
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(emitEvent).toHaveBeenCalledTimes(2);
    expect(emitEvent).toHaveBeenLastCalledWith("@@UI/FETCH_CARDS", {
      itemUrns: ["ppb:card:results"],
    });
  });

  it("does not re-emit when cardEdges reference stays stable", async () => {
    const cardEdges = [
      { key: "NavigationTabsList-ppb:card:navigation", typename: "NavigationTabsList", urn: "ppb:card:navigation" },
    ];
    const { rerender } = await renderComponent({
      vm: {
        data: {
          cardEdges,
        },
      },
    });

    mockedUseRaceItemsContentVM.mockReturnValue(
      buildVM({
        vm: {
          data: {
            cardEdges,
          },
        },
      }),
    );

    rerender(
      <Suspense fallback={null}>
        <RaceItemsContent viewUrn="ppb:tbd:view:raceMeeting:7|12345.1500" raceUrn="ppb:race:12345.1500" />
      </Suspense>,
    );

    await act(async () => {
      await Promise.resolve();
    });

    expect(emitEvent).toHaveBeenCalledTimes(1);
  });
});
