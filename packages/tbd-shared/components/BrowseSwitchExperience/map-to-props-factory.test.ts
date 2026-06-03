import { ApplicationState } from "@ppb/tbd-store/state";
import { makeMapStateToProps } from "./map-to-props-factory";

describe("makeMapStateToProps", () => {
  it("should initialize BrowseSwitchExperience component with the correct props", () => {
    const stateMock = {
      entities: {
        throttles: {},
      },
    } as ApplicationState;

    const mapStateToProps = makeMapStateToProps(stateMock, { urn: "ppb:tbd:view:mock" });

    const props = mapStateToProps(stateMock, { urn: "ppb:tbd:view:mock" });
    expect(props.browsePagePrismic).toBeUndefined();
  });

  it("should return true for when Throttle isActive true", () => {
    const stateMock = {
      entities: {
        throttles: { BROWSE_PAGE_PRISMIC: { isActive: true } },
      },
    } as unknown as ApplicationState;

    const mapStateToProps = makeMapStateToProps(stateMock, { urn: "ppb:tbd:view:mock" });

    const props = mapStateToProps(stateMock, { urn: "ppb:tbd:view:mock" });

    expect(props.browsePagePrismic).toEqual(true);
  });

  it("should return false for when Throttle isActive false", () => {
    const stateMock = {
      entities: {
        throttles: { BROWSE_PAGE_PRISMIC: { isActive: false } },
      },
    } as unknown as ApplicationState;

    const mapStateToProps = makeMapStateToProps(stateMock, { urn: "ppb:tbd:view:mock" });

    const props = mapStateToProps(stateMock, { urn: "ppb:tbd:view:mock" });

    expect(props.browsePagePrismic).toEqual(false);
  });
});
